import { FreshContext } from "$fresh/server.ts";
import { getConfig } from "../../config/index.ts";
import messages from "../../models/messages.ts";
import type {
  SendMessageRequest,
  WebSocketRequest,
  WebSocketResponse,
} from "../../types/message.ts";

/** 接続中のクライアント一覧 */
const clients: WebSocket[] = [];

/** メッセージの最大文字数 */
const MAX_MESSAGE_LENGTH = 200;

/**
 * 送信リクエストのバリデーション
 */
function isValidSendRequest(req: WebSocketRequest): req is SendMessageRequest {
  return (
    req.type === "send" &&
    typeof req.message === "string" &&
    typeof req.user === "string" &&
    typeof req.textColor === "string" &&
    typeof req.timeColor === "string" &&
    typeof req.bgColor === "string" &&
    typeof req.nameColor === "string" &&
    req.message.length <= MAX_MESSAGE_LENGTH
  );
}

/**
 * 全クライアントにメッセージを送信
 */
function broadcastMessage(message: WebSocketResponse): void {
  const payload = JSON.stringify(message);
  clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(payload);
    }
  });
}

/**
 * 切断済みクライアントを削除
 */
function removeDisconnectedClients(): void {
  for (let i = clients.length - 1; i >= 0; i--) {
    if (clients[i].readyState !== WebSocket.OPEN) {
      clients.splice(i, 1);
    }
  }
}

export const handler = {
  GET(req: Request, _ctx: FreshContext) {
    // 通常のHTTPリクエスト
    if (req.headers.get("upgrade") !== "websocket") {
      return new Response(
        JSON.stringify({ message: "WebSocket endpoint. Use ws:// or wss://" }),
        {
          status: 200,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // パスワード認証
    const config = getConfig();
    const url = new URL(req.url);
    const reqPassword = url.searchParams.get("password");

    if (reqPassword !== config.password) {
      return new Response("Unauthorized", { status: 401 });
    }

    // WebSocket アップグレード
    const { socket, response } = Deno.upgradeWebSocket(req);

    socket.onopen = () => {
      clients.push(socket);
      socket.send("connected");
    };

    socket.onmessage = async (ev: MessageEvent) => {
      try {
        const req: WebSocketRequest = JSON.parse(ev.data);

        // パスワード認証
        if (req.password !== config.password) {
          return;
        }

        // メッセージ送信
        if (req.type === "send") {
          if (!isValidSendRequest(req)) {
            return;
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

          const response: WebSocketResponse = {
            type: "message",
            message: req.message,
            user: req.user,
            timestamp: result.timestamp,
            textColor: req.textColor,
            timeColor: req.timeColor,
            bgColor: req.bgColor,
            nameColor: req.nameColor,
          };

          broadcastMessage(response);
        }

        // 接続人数取得
        if (req.type === "people") {
          removeDisconnectedClients();
          socket.send(
            JSON.stringify({
              type: "people",
              people: clients.length,
            })
          );
        }
      } catch (error) {
        console.error("WebSocket message error:", error);
      }
    };

    socket.onclose = () => {
      removeDisconnectedClients();
    };

    socket.onerror = (error) => {
      console.error("WebSocket error:", error);
      removeDisconnectedClients();
    };

    return response;
  },
};
