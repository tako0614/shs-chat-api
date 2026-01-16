import mongoose from "mongoose";

let isConnected = false;

/**
 * MongoDBに接続する
 * すでに接続済みの場合は何もしない
 */
export async function connectDatabase(mongoUrl: string): Promise<void> {
  if (isConnected) {
    return;
  }

  try {
    await mongoose.connect(mongoUrl);
    isConnected = true;
    console.log("MongoDB 接続完了");
  } catch (error) {
    console.error("MongoDB 接続エラー:", error);
    throw error;
  }
}

/**
 * 接続状態を取得する
 */
export function isDatabaseConnected(): boolean {
  return isConnected;
}
