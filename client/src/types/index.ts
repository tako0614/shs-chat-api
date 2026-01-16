/** メッセージ */
export interface Message {
  _id?: string;
  message: string;
  user: string;
  timestamp: Date | string;
  textColor: string;
  timeColor: string;
  bgColor: string;
  nameColor: string;
}

/** メッセージカラー設定 */
export interface MessageColors {
  textColor: string;
  timeColor: string;
  bgColor: string;
  nameColor: string;
}

/** WebSocket送信メッセージ */
export interface SendMessagePayload {
  type: "send";
  password: string;
  message: string;
  user: string;
  textColor: string;
  timeColor: string;
  bgColor: string;
  nameColor: string;
}

/** WebSocket受信メッセージ */
export interface WebSocketMessage {
  type: "message" | "people";
  message?: string;
  user?: string;
  timestamp?: string;
  textColor?: string;
  timeColor?: string;
  bgColor?: string;
  nameColor?: string;
  people?: number;
}

/** アプリ設定 */
export interface AppConfig {
  apiUrl: string;
  wsUrl: string;
  password: string;
}
