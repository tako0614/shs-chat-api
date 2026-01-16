#!/usr/bin/env -S deno run -A --watch=static/,routes/

import "$std/dotenv/load.ts";
import dev from "$fresh/dev.ts";
import config from "./fresh.config.ts";
import { loadConfig } from "./config/index.ts";
import { connectDatabase } from "./lib/database.ts";

// 設定読み込み・DB接続
const appConfig = await loadConfig();
await connectDatabase(appConfig.mongoUrl);

// 開発サーバー起動
await dev(import.meta.url, "./main.ts", config);
