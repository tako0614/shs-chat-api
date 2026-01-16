import { load } from "https://deno.land/std@0.204.0/dotenv/mod.ts";

/** アプリケーション設定 */
export interface AppConfig {
  mongoUrl: string;
  password: string;
}

let cachedConfig: AppConfig | null = null;

/**
 * 設定を読み込む
 * 2回目以降はキャッシュを返す
 */
export async function loadConfig(): Promise<AppConfig> {
  if (cachedConfig) {
    return cachedConfig;
  }

  const env = await load();

  cachedConfig = {
    mongoUrl: env["MONGO_URL"] || Deno.env.get("MONGO_URL") || "",
    password: env["PASSWORD"] || Deno.env.get("PASSWORD") || "",
  };

  return cachedConfig;
}

/**
 * 設定を取得する（同期）
 * loadConfig()を先に呼び出す必要がある
 */
export function getConfig(): AppConfig {
  if (!cachedConfig) {
    throw new Error("Config not loaded. Call loadConfig() first.");
  }
  return cachedConfig;
}
