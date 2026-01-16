/** メッセージの型定義 */
export interface Message {
  _id?: string;
  message: string;
  user: string;
  timestamp: Date;
  textColor: string;
  timeColor: string;
  bgColor: string;
  nameColor: string;
}

/** WebSocket リクエストの型定義 */
export interface WebSocketRequest {
  type: "send" | "people";
  password: string;
  message?: string;
  user?: string;
  textColor?: string;
  timeColor?: string;
  bgColor?: string;
  nameColor?: string;
}

/** WebSocket レスポンスの型定義 */
export interface WebSocketResponse {
  type: "message" | "people";
  message?: string;
  user?: string;
  timestamp?: Date;
  textColor?: string;
  timeColor?: string;
  bgColor?: string;
  nameColor?: string;
  people?: number;
}

/** 送信メッセージリクエスト */
export interface SendMessageRequest {
  type: "send";
  password: string;
  message: string;
  user: string;
  textColor: string;
  timeColor: string;
  bgColor: string;
  nameColor: string;
}

/** 接続人数リクエスト */
export interface PeopleRequest {
  type: "people";
  password: string;
}

/** メッセージ取得パラメータ */
export interface GetMessagesParams {
  password: string;
  when: string;
  howMany: number;
}
