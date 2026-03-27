import type {
  PageObjectResponse,
} from "@notionhq/client/build/src/api-endpoints";
import { getNotionClient } from "./client";
import { getPageBlocks, type NotionBlock } from "./blocks";
import type { NewsItem } from "@/types/notion";

function getDatabaseId(): string {
  const id = process.env.NOTION_NEWS_DB;
  if (!id) {
    throw new Error(
      "NOTION_NEWS_DB environment variable is not set. " +
        "Add the Notion News database ID to your Vercel environment variables.",
    );
  }
  return id;
}

function extractText(
  property: PageObjectResponse["properties"][string] | undefined,
): string {
  if (!property) return "";
  if (property.type === "title") {
    return property.title.map((t) => t.plain_text).join("");
  }
  if (property.type === "rich_text") {
    return property.rich_text.map((t) => t.plain_text).join("");
  }
  return "";
}

function extractSelect(
  property: PageObjectResponse["properties"][string] | undefined,
): string {
  if (!property || property.type !== "select") return "";
  return property.select?.name ?? "";
}

function extractMultiSelect(
  property: PageObjectResponse["properties"][string] | undefined,
): string[] {
  if (!property || property.type !== "multi_select") return [];
  return property.multi_select.map((s) => s.name);
}

function extractCheckbox(
  property: PageObjectResponse["properties"][string] | undefined,
): boolean {
  if (!property || property.type !== "checkbox") return false;
  return property.checkbox;
}

function extractDate(
  property: PageObjectResponse["properties"][string] | undefined,
): string {
  if (!property || property.type !== "date") return "";
  return property.date?.start ?? "";
}

function extractFileUrl(
  property: PageObjectResponse["properties"][string] | undefined,
): string | null {
  if (!property) return null;
  if (property.type === "files" && property.files.length > 0) {
    const file = property.files[0];
    if (file.type === "file") return file.file.url;
    if (file.type === "external") return file.external.url;
  }
  return null;
}

function pageToNewsItem(page: PageObjectResponse): NewsItem {
  const p = page.properties;
  return {
    id: page.id,
    title: extractText(p["Title"]),
    slug: extractText(p["Slug"]),
    excerpt: extractText(p["Excerpt"]),
    date: extractDate(p["Date"]),
    status: (extractSelect(p["Status"]) as NewsItem["status"]) || "Draft",
    tags: extractMultiSelect(p["Tags"]),
    coverImageUrl: extractFileUrl(p["CoverImage"]),
    featured: extractCheckbox(p["Featured"]),
  };
}

/** Return all published news items, ordered newest first. */
export async function listNews(): Promise<NewsItem[]> {
  const notion = getNotionClient();
  const dbId = getDatabaseId();

  const response = await notion.dataSources.query({
    data_source_id: dbId,
    filter: {
      property: "Status",
      select: { equals: "Published" },
    },
    sorts: [{ property: "Date", direction: "descending" }],
  });

  return (response.results as PageObjectResponse[])
    .map(pageToNewsItem)
    .filter((n) => n.slug);
}

/** Return a single news item by slug, including its Notion page blocks. */
export async function getNewsBySlug(
  slug: string,
): Promise<{ news: NewsItem; blocks: NotionBlock[] } | null> {
  const notion = getNotionClient();
  const dbId = getDatabaseId();

  const response = await notion.dataSources.query({
    data_source_id: dbId,
    filter: {
      property: "Slug",
      rich_text: { equals: slug },
    },
    page_size: 1,
  });

  const page = response.results[0] as PageObjectResponse | undefined;
  if (!page) return null;

  const news = pageToNewsItem(page);
  const blocks = await getPageBlocks(page.id);

  return { news, blocks };
}

/** Return all slugs for static path generation. */
export async function listNewsSlugs(): Promise<string[]> {
  const items = await listNews();
  return items.map((n) => n.slug).filter(Boolean);
}
