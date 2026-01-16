import { useEffect, useRef } from "react";
import type { Message } from "../types";
import { MessageItem } from "./MessageItem";

interface MessageListProps {
  messages: Message[];
  onScrollTop: () => void;
  isLoading: boolean;
}

export function MessageList({ messages, onScrollTop, isLoading }: MessageListProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const prevLengthRef = useRef(messages.length);

  // 新規メッセージで自動スクロール
  useEffect(() => {
    if (messages.length > prevLengthRef.current && containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
    prevLengthRef.current = messages.length;
  }, [messages.length]);

  const handleScroll = () => {
    if (!containerRef.current || isLoading) return;

    // 上端に達したら追加読み込み
    if (containerRef.current.scrollTop === 0) {
      onScrollTop();
    }
  };

  return (
    <div
      ref={containerRef}
      onScroll={handleScroll}
      className="flex-1 overflow-y-auto p-4 scrollbar-hide"
    >
      {isLoading && (
        <div className="text-center py-2 text-gray-500 dark:text-gray-400">
          読み込み中...
        </div>
      )}
      {messages.map((message, index) => (
        <MessageItem key={message._id || index} message={message} />
      ))}
    </div>
  );
}
