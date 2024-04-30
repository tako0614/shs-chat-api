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
        try {
          const req = JSON.parse(ev.data);
          if (req.password !== password) {
            return;
          }
          if (req.type === undefined || req.type === null) {
            return;
          }
          if (req.type == "send") {
            if (
              req.message === undefined || req.user === undefined ||
              req.textColor === undefined || req.timeColor === undefined ||
              req.bgColor === undefined || req.nameColor === undefined
            ) {
              return;
            }
            const message = req.message
            if(message.length > 200) {
              return
            }
            const result = await messages.create({
              message: req.message,
              user: req.user,
              textColor: req.textColor,
              timeColor: req.timeColor,
              bgColor: req.bgColor,
              nameColor: req.nameColor,
              timestamp: new Date(),
            });
            //接続されているクライアント全員にメッセージを送信
            const test = {
              type: "message",
              message: req.message,
              user: req.user,
              timestamp: result.timestamp,
              textColor: req.textColor,
              timeColor: req.timeColor,
              bgColor: req.bgColor,
              nameColor: req.nameColor,
            };
            clients.forEach((client: WebSocket) => {
              if (client.readyState === WebSocket.OPEN) {
                client.send(JSON.stringify(test));
              }
            });
            //socket.send(JSON.stringify(test));
          } else if (req.type == "people") {
            socket.send(JSON.stringify({
              people: clients.length,
              type: "people",
            }));
          } else {
            return;
          }
        } catch (error) {
          console.log(error);
        }
      };
      socket.onopen = (ws) => {
        clients.push(ws);
        socket.send("connected");
      };
      socket.onclose = (ws) => {
        const target: any = ws;
        console.log(clients)
        clients.forEach((item: any, index: any) => {
          if (WebSocket.OPEN === target.readyState) {
            return
          } else {
            clients.splice(index);
          }
        });
      };
      return response;
    } else {
      return new Response(
        JSON.stringify({ response: "the request is a normal HTTP request" }),
      );
    }
  },
};
