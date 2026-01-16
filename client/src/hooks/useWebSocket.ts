import { useEffect, useRef, useState, useCallback } from "react";
import type { AppConfig, WebSocketMessage, SendMessagePayload } from "../types";

interface UseWebSocketReturn {
  isConnected: boolean;
  onlineCount: number;
  sendMessage: (payload: Omit<SendMessagePayload, "type" | "password">) => void;
  lastMessage: WebSocketMessage | null;
}

export function useWebSocket(config: AppConfig): UseWebSocketReturn {
  const [isConnected, setIsConnected] = useState(false);
  const [onlineCount, setOnlineCount] = useState(0);
  const [lastMessage, setLastMessage] = useState<WebSocketMessage | null>(null);
  const socketRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<number | null>(null);

  const connect = useCallback(() => {
    const wsUrl = `${config.wsUrl}/api/app?password=${encodeURIComponent(config.password)}`;
    const ws = new WebSocket(wsUrl);

    ws.onopen = () => {
      setIsConnected(true);
    };

    ws.onmessage = (event) => {
      if (event.data === "connected") return;

      try {
        const data: WebSocketMessage = JSON.parse(event.data);

        if (data.type === "people") {
          setOnlineCount(data.people || 0);
        } else if (data.type === "message") {
          setLastMessage(data);
        }
      } catch {
        // 無視
      }
    };

    ws.onclose = () => {
      setIsConnected(false);
      // 10秒後に再接続
      reconnectTimeoutRef.current = window.setTimeout(() => {
        connect();
      }, 10000);
    };

    ws.onerror = () => {
      ws.close();
    };

    socketRef.current = ws;
  }, [config]);

  // 接続開始
  useEffect(() => {
    connect();

    return () => {
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
      socketRef.current?.close();
    };
  }, [connect]);

  // 接続人数をポーリング
  useEffect(() => {
    const interval = setInterval(() => {
      if (socketRef.current?.readyState === WebSocket.OPEN) {
        socketRef.current.send(
          JSON.stringify({
            type: "people",
            password: config.password,
          })
        );
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [config.password]);

  const sendMessage = useCallback(
    (payload: Omit<SendMessagePayload, "type" | "password">) => {
      if (socketRef.current?.readyState === WebSocket.OPEN) {
        socketRef.current.send(
          JSON.stringify({
            type: "send",
            password: config.password,
            ...payload,
          })
        );
      }
    },
    [config.password]
  );

  return { isConnected, onlineCount, sendMessage, lastMessage };
}
