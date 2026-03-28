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

// Cache database_id -> data_source_id resolutions to avoid redundant API calls
const _dataSourceIdCache: Record<string, string> = {};

/**
 * Resolve a Notion database_id (from the URL) to a data_source_id required
 * by the v5 SDK's dataSources.query(). Results are cached for the process lifetime.
 */
export async function resolveDataSourceId(databaseId: string): Promise<string> {
  if (_dataSourceIdCache[databaseId]) {
    return _dataSourceIdCache[databaseId];
  }
  const notion = getNotionClient();
  const db = await notion.databases.retrieve({ database_id: databaseId });
  const dataSources = (db as { data_sources?: Array<{ id: string }> }).data_sources;
  if (!dataSources || dataSources.length === 0) {
    throw new Error(
      `No data sources found for database ${databaseId}. ` +
        "Make sure the Notion integration has access to this database.",
    );
  }
  const dataSourceId = dataSources[0].id;
  _dataSourceIdCache[databaseId] = dataSourceId;
  return dataSourceId;
}
