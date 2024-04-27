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
        // whenよりも古いメッセージ10件を取得
        if(when === "" || howMany === ""){
            console.log(Date.now());
            return new Response("Bad Request", { status: 400 });
        }
        const result = await messages.find({ timestamp: { $lt: when } }).sort({ timestamp: -1 }).limit(Number(howMany));
        console.log(result);
        return new Response(JSON.stringify(JSON.stringify(result)), {
            headers: { "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*"
             },
          })
    }
}