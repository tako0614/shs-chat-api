import type { Message, AppConfig } from "../types";

/**
 * 過去のメッセージを取得する
 */
export async function fetchMessages(
  config: AppConfig,
  when: Date,
  howMany: number
): Promise<Message[]> {
  const params = new URLSearchParams({
    password: config.password,
    when: when.toISOString(),
    howMany: String(howMany),
  });

  const response = await fetch(`${config.apiUrl}/api/messages?${params}`);

  if (!response.ok) {
    throw new Error(`Failed to fetch messages: ${response.status}`);
  }

  return response.json();
}
