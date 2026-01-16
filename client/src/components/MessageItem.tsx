import type { Message } from "../types";
import { formatDate } from "../utils/formatDate";
import { escapeHtml } from "../utils/sanitize";

interface MessageItemProps {
  message: Message;
}

export function MessageItem({ message }: MessageItemProps) {
  return (
    <div
      className="p-3 rounded-lg mb-2"
      style={{ backgroundColor: message.bgColor }}
    >
      <div className="flex items-center gap-2 mb-1">
        <span
          className="font-bold"
          style={{ color: message.nameColor }}
        >
          {escapeHtml(message.user)}
        </span>
        <span
          className="text-sm"
          style={{ color: message.timeColor }}
        >
          {formatDate(message.timestamp)}
        </span>
      </div>
      <p
        className="whitespace-pre-wrap break-words"
        style={{ color: message.textColor }}
      >
        {escapeHtml(message.message)}
      </p>
    </div>
  );
}
