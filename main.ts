/// <reference no-default-lib="true" />
/// <reference lib="dom" />
/// <reference lib="dom.iterable" />
/// <reference lib="dom.asynciterable" />
/// <reference lib="deno.ns" />

import "$std/dotenv/load.ts";
import { start } from "$fresh/server.ts";
import manifest from "./fresh.gen.ts";
import config from "./fresh.config.ts";
import { loadConfig } from "./config/index.ts";
import { connectDatabase } from "./lib/database.ts";

// 設定読み込み・DB接続
const appConfig = await loadConfig();
await connectDatabase(appConfig.mongoUrl);

// サーバー起動
await start(manifest, config);
