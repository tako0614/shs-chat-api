import { load } from "https://deno.land/std@0.204.0/dotenv/mod.ts";
const env = await load();
const password = env["PASSWORD"];
import { FreshContext } from "$fresh/server.ts";
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
      socket.onmessage = (ev) => {


        const req = JSON.parse(ev.data);
        console.log(req.data);
        const test = {
          type: "message",
          data: ev.data,
        };
        socket.send(JSON.stringify(test));



      };
      socket.onopen = () => {
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
