import { load } from "https://deno.land/std@0.204.0/dotenv/mod.ts";
const env = await load();
const password = env["PASSWORD"];
import { FreshContext } from "$fresh/server.ts";
import messages from "../../models/messages.ts";
let clients: any = [];
export const handler = {
  GET(req: Request, _ctx: FreshContext) {
    if (req.headers.get("upgrade") === "websocket") {
      const url = new URL(req.url);
      const reqpassword = url.searchParams.get("password");
      if (reqpassword !== password) {
        return new Response("Unauthorized", { status: 401 });
      }
      const { socket, response } = Deno.upgradeWebSocket(req);
      if (!socket) throw new Error("unreachable");
      socket.onmessage = async (ev) => {
        const req = JSON.parse(ev.data);
        if (req.password !== password) {
          return;
        }
        if (req.message === undefined || req.user === undefined) {
          return;
        }
        const result = await messages.create({
          message: req.message,
          user: req.user,
          timestamp: new Date(),
        });
        //接続されているクライアント全員にメッセージを送信
        const test = {
          message: req.message,
          user: req.user,
          timestamp: result.timestamp,
        };
        clients.forEach((client: WebSocket) => {
          if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify(test));
          }
        });
        //socket.send(JSON.stringify(test));
      };
      socket.onopen = (ws) => {
        clients.push(ws.target);
        socket.send("connected");
      };
      return response;
    } else {
      return new Response(
        JSON.stringify({ response: "the request is a normal HTTP request" }),
      );
    }
  },
};
