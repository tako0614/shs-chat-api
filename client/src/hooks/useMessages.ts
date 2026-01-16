import { useState, useCallback, useEffect } from "react";
import type { Message, AppConfig, WebSocketMessage } from "../types";
import { fetchMessages } from "../utils/api";

interface UseMessagesReturn {
  messages: Message[];
  isLoading: boolean;
  loadMore: () => Promise<void>;
  addMessage: (message: WebSocketMessage) => void;
}

const INITIAL_LOAD = 20;
const LOAD_MORE = 15;

export function useMessages(config: AppConfig): UseMessagesReturn {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [oldestTimestamp, setOldestTimestamp] = useState<Date>(new Date());

  // 初回読み込み
  useEffect(() => {
    const loadInitial = async () => {
      setIsLoading(true);
      try {
        const data = await fetchMessages(config, new Date(), INITIAL_LOAD);
        setMessages(data.reverse());
        if (data.length > 0) {
          setOldestTimestamp(new Date(data[data.length - 1].timestamp));
        }
      } catch (error) {
        console.error("Failed to load messages:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadInitial();
  }, [config]);

  // 追加読み込み
  const loadMore = useCallback(async () => {
    if (isLoading) return;

    setIsLoading(true);
    try {
      const data = await fetchMessages(config, oldestTimestamp, LOAD_MORE);
      if (data.length > 0) {
        setMessages((prev) => [...data.reverse(), ...prev]);
        setOldestTimestamp(new Date(data[data.length - 1].timestamp));
      }
    } catch (error) {
      console.error("Failed to load more messages:", error);
    } finally {
      setIsLoading(false);
    }
  }, [config, oldestTimestamp, isLoading]);

  // 新規メッセージ追加
  const addMessage = useCallback((wsMessage: WebSocketMessage) => {
    if (wsMessage.type !== "message") return;

    const message: Message = {
      message: wsMessage.message || "",
      user: wsMessage.user || "",
      timestamp: wsMessage.timestamp || new Date().toISOString(),
      textColor: wsMessage.textColor || "#000000",
      timeColor: wsMessage.timeColor || "#666666",
      bgColor: wsMessage.bgColor || "#ffffff",
      nameColor: wsMessage.nameColor || "#333333",
    };

    setMessages((prev) => [...prev, message]);
  }, []);

  return { messages, isLoading, loadMore, addMessage };
}
