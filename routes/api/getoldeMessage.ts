import { FreshContext } from "$fresh/server.ts";
import messages from "../../models/messages.ts";
export const handler = {
  async GET(req: Request, _ctx: FreshContext) {
    const url = new URL(req.url);
    const password = url.searchParams.get("password");
    if (password !== Deno.env.get("PASSWORD")) {
      return new Response("Unauthorized", { status: 401 });
    }
    const howMany = url.searchParams.get("howMany") || "";
    const when = url.searchParams.get("when") || "";
    if (when === "" || howMany === "") {
      return new Response("Bad Request", { status: 400 });
    }
    const date = new Date(when);
    date.setHours(date.getHours() - 9);
    const result = await messages.find({ timestamp: { $lt: date } })
      .sort({ timestamp: -1 }).limit(Number(howMany));
    return new Response(JSON.stringify(JSON.stringify(result)), {
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    });
  },
};
