import type { ServerResponse } from "node:http";
import { server } from "./mcp-server";
import { SSEServerTransport } from "../../../../mcp/sse";

let transport: SSEServerTransport | null = null;

export async function GET(req: Request) {
  const { readable, writable } = new TransformStream();
  const writer = writable.getWriter();

  const res = {
    writeHead: () => res,
    write: (chunk: string | Buffer) => {
      writer.write(chunk);
      return true;
    },
    on: (event: string, listener: () => void) => {
      if (event === "close") {
        req.signal.addEventListener("abort", () => {
          writer.close();
          if (typeof listener === "function") listener();
        });
      }
      return res;
    },
    end: (chunk?: string | Buffer) => {
      if (chunk !== undefined) {
        writer.write(chunk);
      }
      writer.close();
      return res;
    },
  };

  const serverRes = res as unknown as ServerResponse;

  transport = new SSEServerTransport("/api/mcp/warehouse", serverRes);
  await server.connect(transport);

  return new Response(readable, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
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
      }
    );
  }
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

  return new Response(textResponse, {
    status: statusResponse,
  });
}
