import { FreshContext } from "$fresh/server.ts";
import { getConfig } from "../../config/index.ts";
import messagesModel from "../../models/messages.ts";
import type { Message } from "../../types/message.ts";

export const handler = {
  async GET(req: Request, _ctx: FreshContext) {
    const config = getConfig();
    const url = new URL(req.url);

    // パスワード認証
    const password = url.searchParams.get("password");
    if (password !== config.password) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      });
    }

    // パラメータ取得
    const howMany = url.searchParams.get("howMany");
    const when = url.searchParams.get("when");

    if (!when || !howMany) {
      return new Response(
        JSON.stringify({ error: "Missing required parameters: when, howMany" }),
        {
          status: 400,
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
          },
        }
      );
    }

    const limit = parseInt(howMany, 10);
    if (isNaN(limit) || limit <= 0) {
      return new Response(
        JSON.stringify({ error: "Invalid howMany parameter" }),
        {
          status: 400,
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
          },
        }
      );
    }

    try {
      // 日付をパースしてタイムゾーン調整
      const date = new Date(when);
      date.setHours(date.getHours() - 9);

      // メッセージ取得
      const result = await messagesModel
        .find({ timestamp: { $lt: date } })
        .sort({ timestamp: -1 })
        .limit(limit);

      const messages: Message[] = result.map((doc) => ({
        _id: doc._id?.toString(),
        message: doc.message,
        user: doc.user,
        timestamp: doc.timestamp,
        textColor: doc.textColor,
        timeColor: doc.timeColor,
        bgColor: doc.bgColor,
        nameColor: doc.nameColor,
      }));

      return new Response(JSON.stringify(messages), {
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      });
    } catch (error) {
      console.error("Message fetch error:", error);
      return new Response(
        JSON.stringify({ error: "Internal server error" }),
        {
          status: 500,
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
          },
        }
      );
    }
  },
};
