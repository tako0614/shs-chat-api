import { FreshContext } from "$fresh/server.ts";
import { getConfig } from "../../config/index.ts";
import messagesModel from "../../models/messages.ts";

/**
 * 後方互換性のための旧エンドポイント
 * 新しいクライアントは /api/messages を使用してください
 */
export const handler = {
  async GET(req: Request, _ctx: FreshContext) {
    const config = getConfig();
    const url = new URL(req.url);

    const password = url.searchParams.get("password");
    if (password !== config.password) {
      return new Response("Unauthorized", { status: 401 });
    }

    const howMany = url.searchParams.get("howMany") || "";
    const when = url.searchParams.get("when") || "";

    if (when === "" || howMany === "") {
      return new Response("Bad Request", { status: 400 });
    }

    const date = new Date(when);
    date.setHours(date.getHours() - 9);

    const result = await messagesModel
      .find({ timestamp: { $lt: date } })
      .sort({ timestamp: -1 })
      .limit(Number(howMany));

    // 注意: 旧クライアントは二重パースを期待しているため、二重stringify
    return new Response(JSON.stringify(JSON.stringify(result)), {
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    });
  },
};
