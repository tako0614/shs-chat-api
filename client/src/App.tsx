import { useState, useEffect, useCallback } from "react";
import type { AppConfig, MessageColors } from "./types";
import { useWebSocket } from "./hooks/useWebSocket";
import { useMessages } from "./hooks/useMessages";
import { useTheme } from "./hooks/useTheme";
import { MessageList } from "./components/MessageList";
import { MessageInput } from "./components/MessageInput";
import { SettingsPanel } from "./components/SettingsPanel";

// 設定（環境変数または直接指定）
const config: AppConfig = {
  apiUrl: import.meta.env.VITE_API_URL || "https://chat3.takos.jp",
  wsUrl: import.meta.env.VITE_WS_URL || "wss://chat3.takos.jp",
  password: import.meta.env.VITE_PASSWORD || "tako",
};

// 初期カラー
const defaultColors: MessageColors = {
  textColor: "#000000",
  bgColor: "#ffffff",
  nameColor: "#333333",
  timeColor: "#666666",
};

function App() {
  const { theme, toggleTheme } = useTheme();
  const { isConnected, onlineCount, sendMessage, lastMessage } = useWebSocket(config);
  const { messages, isLoading, loadMore, addMessage } = useMessages(config);

  const [userName, setUserName] = useState(() => {
    return localStorage.getItem("userName") || "匿名";
  });

  const [colors, setColors] = useState<MessageColors>(() => {
    const saved = localStorage.getItem("messageColors");
    return saved ? JSON.parse(saved) : defaultColors;
  });

  // ユーザー名をローカルストレージに保存
  useEffect(() => {
    localStorage.setItem("userName", userName);
  }, [userName]);

  // カラー設定をローカルストレージに保存
  useEffect(() => {
    localStorage.setItem("messageColors", JSON.stringify(colors));
  }, [colors]);

  // 新規メッセージを追加
  useEffect(() => {
    if (lastMessage) {
      addMessage(lastMessage);
    }
  }, [lastMessage, addMessage]);

  // メッセージ送信
  const handleSend = useCallback(
    (message: string) => {
      sendMessage({
        message,
        user: userName,
        ...colors,
      });
    },
    [sendMessage, userName, colors]
  );

  return (
    <div className="h-screen flex bg-white dark:bg-gray-900">
      {/* サイドバー */}
      <SettingsPanel
        userName={userName}
        onUserNameChange={setUserName}
        colors={colors}
        onColorsChange={setColors}
        theme={theme}
        onThemeToggle={toggleTheme}
        isConnected={isConnected}
        onlineCount={onlineCount}
      />

      {/* メインエリア */}
      <div className="flex-1 flex flex-col">
        {/* ヘッダー */}
        <header className="p-4 border-b dark:border-gray-700">
          <h1 className="text-xl font-bold dark:text-white">SHS Chat</h1>
        </header>

        {/* メッセージ一覧 */}
        <MessageList
          messages={messages}
          onScrollTop={loadMore}
          isLoading={isLoading}
        />

        {/* 入力フォーム */}
        <MessageInput onSend={handleSend} disabled={!isConnected} />
      </div>
    </div>
  );
}

export default App;
