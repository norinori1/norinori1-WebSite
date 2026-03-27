import { Client } from "@notionhq/client";

let _client: Client | null = null;

export function getNotionClient(): Client {
  if (!_client) {
    const token = process.env.NOTION_TOKEN;
    if (!token) {
      throw new Error(
        "NOTION_TOKEN environment variable is not set. " +
          "Add it to your Vercel environment variables.",
      );
    }
    _client = new Client({ auth: token });
  }
  return _client;
}
