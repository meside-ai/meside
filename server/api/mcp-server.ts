import type { ServerResponse } from "node:http";
import { server } from "@/mcp-server/index.js";
import { Hono } from "hono";
import { SSEServerTransport } from "../mcp-server/common/sse.js";

let transport: SSEServerTransport | null = null;

export const mcpServerApi = new Hono()
  .get("/sse", async (c) => {
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
          c.req.raw.signal.addEventListener("abort", () => {
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

    transport = new SSEServerTransport(
      "/meside/api/mcp-server/message",
      serverRes,
    );
    await server.connect(transport);

    return new Response(readable, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
      status: 200,
    });
  })
  .post("/message", async (c) => {
    const parsedBody = await c.req.json();
    const sessionId = c.req.query("sessionId");
    if (!sessionId) {
      return c.json({ error: "Missing sessionId parameter" }, 400);
    }
    if (!transport) {
      return c.json({ error: "Session not found" }, 404);
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
  });
