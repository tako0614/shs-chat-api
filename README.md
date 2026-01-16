# SHS Chat API

シンプルなリアルタイムチャット API。独自クライアント向けの WebSocket ベースのメッセージングシステムです。

## 機能

- WebSocket によるリアルタイムメッセージング
- メッセージ履歴の取得（ページネーション対応）
- カスタマイズ可能なメッセージスタイル（テキスト色、背景色、名前色、時刻色）
- 接続ユーザー数の取得
- ダーク/ライトモード

## 技術スタック

### バックエンド
- **Deno** + **Fresh Framework**
- **MongoDB** + Mongoose
- **TypeScript**

### クライアント
- **React** + **TypeScript**
- **Vite**
- **Tailwind CSS**

## セットアップ

### 環境変数

`.env` ファイルを作成:

```env
MONGO_URL=mongodb://localhost:27017/shs-chat
PASSWORD=your_password
```

### バックエンド起動

```bash
# 開発モード
deno task start

# プロダクション
deno task preview
```

### クライアント起動

```bash
cd client
npm install
npm run dev
```

クライアントの環境変数（`.env`）:

```env
VITE_API_URL=https://your-api-host
VITE_WS_URL=wss://your-api-host
VITE_PASSWORD=your_password
```

## API リファレンス

### WebSocket API

**接続**: `wss://host/api/app?password=YOUR_PASSWORD`

#### メッセージ送信

```json
{
  "type": "send",
  "password": "YOUR_PASSWORD",
  "message": "Hello!",
  "user": "UserName",
  "textColor": "#000000",
  "timeColor": "#666666",
  "bgColor": "#ffffff",
  "nameColor": "#333333"
}
```

#### 接続人数取得

```json
{
  "type": "people",
  "password": "YOUR_PASSWORD"
}
```

**レスポンス**:
```json
{
  "type": "people",
  "people": 5
}
```

#### メッセージ受信

```json
{
  "type": "message",
  "message": "Hello!",
  "user": "UserName",
  "timestamp": "2024-01-01T12:00:00.000Z",
  "textColor": "#000000",
  "timeColor": "#666666",
  "bgColor": "#ffffff",
  "nameColor": "#333333"
}
```

### REST API

#### GET /api/messages

メッセージ履歴を取得。

| パラメータ | 型 | 必須 | 説明 |
|-----------|------|------|------|
| password | string | Yes | API パスワード |
| when | string | Yes | この日時より前のメッセージを取得（ISO 8601形式） |
| howMany | number | Yes | 取得件数 |

**レスポンス**:
```json
[
  {
    "_id": "...",
    "message": "Hello!",
    "user": "UserName",
    "timestamp": "2024-01-01T12:00:00.000Z",
    "textColor": "#000000",
    "timeColor": "#666666",
    "bgColor": "#ffffff",
    "nameColor": "#333333"
  }
]
```

## ディレクトリ構成

```
shs-chat-api/
├── config/           # 設定モジュール
├── lib/              # 共通ライブラリ
├── types/            # TypeScript型定義
├── models/           # MongoDB スキーマ
├── routes/
│   └── api/
│       ├── app.ts        # WebSocket エンドポイント
│       └── messages.ts   # REST エンドポイント
├── client/           # React クライアント
│   └── src/
│       ├── components/   # UIコンポーネント
│       ├── hooks/        # カスタムフック
│       ├── types/        # 型定義
│       └── utils/        # ユーティリティ
├── main.ts           # サーバーエントリーポイント
└── dev.ts            # 開発サーバー
```

## ライセンス

MIT
