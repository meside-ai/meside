import type { ServerResponse } from "node:http";
import { getLogger } from "../../../logger";
import { SSEServerTransport } from "../../../mcp/sse";
import { server } from "./mcp-server";

const logger = getLogger("warehouse-mcp");

// TODO: add feature to close transport when no more requests are made
const transportMap = new Map<string, SSEServerTransport>();

export async function GET(req: Request) {
  const { readable, writable } = new TransformStream();
  const writer = writable.getWriter();

  const res = {
    writeHead: () => res,
    write: (chunk: string | Buffer) => {
      logger.info("sse transport write", { chunk });
      writer.write(chunk);
      return true;
    },
    on: (event: string, listener: () => void) => {
      logger.info("sse transport on event", { event });
      if (event === "close") {
        req.signal.addEventListener("abort", () => {
          logger.info("sse transport on signal abort");
          writer.close();
          if (typeof listener === "function") listener();
        });
      }
      return res;
    },
    end: (chunk?: string | Buffer) => {
      logger.info("sse transport end", { chunk });
      if (chunk !== undefined) {
        writer.write(chunk);
      }
      writer.close();
      return res;
    },
  };

  const serverRes = res as unknown as ServerResponse;

  const domain = req.headers.get("host");

  logger.info("sse prepare to create transport");
  const transport = new SSEServerTransport(
    `http://${domain}/meside/warehouse/api/mcp/warehouse`,
    serverRes,
  );
  const sessionId = transport.sessionId;
  logger.info("sse transport created", { sessionId });
  transportMap.set(sessionId, transport);
  await server.connect(transport);
  logger.info("sse transport server ready", { sessionId });

  return new Response(readable, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
      "Content-Encoding": "none",
    },
    status: 200,
  });
}

export async function POST(req: Request) {
  const parsedBody = await req.json();
  const url = new URL(req.url);
  const sessionId = url.searchParams.get("sessionId");
  if (!sessionId) {
    return new Response(
      JSON.stringify({ error: "Missing sessionId parameter" }),
      {
        status: 400,
      },
    );
  }
  logger.info("post prepare connect to transport via post", { sessionId });
  const transport = transportMap.get(sessionId);

  if (!transport) {
    return new Response(JSON.stringify({ error: "Session not found" }), {
      status: 404,
    });
  }

  let statusResponse = 500;
  let textResponse = "unknown error";

  const res = {
    writeHead: (statusCode: number) => {
      statusResponse = statusCode;
      return res;
    },
    end: (text: string) => {
      textResponse = text;
    },
  };

  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  await transport.handlePostMessage(res as any, parsedBody);

  logger.info("post transport handled post message", { sessionId });

  return new Response(textResponse, {
    status: statusResponse,
  });
}
