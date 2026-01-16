import type { MessageColors } from "../types";

interface SettingsPanelProps {
  userName: string;
  onUserNameChange: (name: string) => void;
  colors: MessageColors;
  onColorsChange: (colors: MessageColors) => void;
  theme: "light" | "dark";
  onThemeToggle: () => void;
  isConnected: boolean;
  onlineCount: number;
}

export function SettingsPanel({
  userName,
  onUserNameChange,
  colors,
  onColorsChange,
  theme,
  onThemeToggle,
  isConnected,
  onlineCount,
}: SettingsPanelProps) {
  return (
    <div className="w-64 p-4 border-r dark:border-gray-700 overflow-y-auto">
      {/* 接続状態 */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-2">
          <div
            className={`w-3 h-3 rounded-full ${
              isConnected ? "bg-green-500" : "bg-red-500"
            }`}
          />
          <span className="text-sm dark:text-white">
            {isConnected ? "接続中" : "切断"}
          </span>
        </div>
        <div className="text-sm text-gray-600 dark:text-gray-400">
          オンライン: {onlineCount}人
        </div>
      </div>

      {/* ユーザー名 */}
      <div className="mb-6">
        <label className="block text-sm font-medium mb-2 dark:text-white">
          ユーザー名
        </label>
        <input
          type="text"
          value={userName}
          onChange={(e) => onUserNameChange(e.target.value)}
          className="w-full p-2 border rounded dark:bg-gray-800 dark:border-gray-600 dark:text-white"
        />
      </div>

      {/* テーマ切替 */}
      <div className="mb-6">
        <button
          onClick={onThemeToggle}
          className="w-full p-2 bg-gray-200 dark:bg-gray-700 rounded hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors dark:text-white"
        >
          {theme === "light" ? "ダークモード" : "ライトモード"}
        </button>
      </div>

      {/* カラー設定 */}
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1 dark:text-white">
            テキスト色
          </label>
          <input
            type="color"
            value={colors.textColor}
            onChange={(e) =>
              onColorsChange({ ...colors, textColor: e.target.value })
            }
            className="w-full h-8 cursor-pointer"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1 dark:text-white">
            背景色
          </label>
          <input
            type="color"
            value={colors.bgColor}
            onChange={(e) =>
              onColorsChange({ ...colors, bgColor: e.target.value })
            }
            className="w-full h-8 cursor-pointer"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1 dark:text-white">
            名前色
          </label>
          <input
            type="color"
            value={colors.nameColor}
            onChange={(e) =>
              onColorsChange({ ...colors, nameColor: e.target.value })
            }
            className="w-full h-8 cursor-pointer"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1 dark:text-white">
            時刻色
          </label>
          <input
            type="color"
            value={colors.timeColor}
            onChange={(e) =>
              onColorsChange({ ...colors, timeColor: e.target.value })
            }
            className="w-full h-8 cursor-pointer"
          />
        </div>
      </div>
    </div>
  );
}
