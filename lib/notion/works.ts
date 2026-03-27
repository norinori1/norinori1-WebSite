import type {
  PageObjectResponse,
} from "@notionhq/client/build/src/api-endpoints";
import { getNotionClient } from "./client";
import { getPageBlocks, type NotionBlock } from "./blocks";
import type { Work } from "@/types/notion";

function getDatabaseId(): string {
  const id = process.env.NOTION_GAMES_DB;
  if (!id) {
    throw new Error(
      "NOTION_GAMES_DB environment variable is not set. " +
        "Add the Notion Games database ID to your Vercel environment variables.",
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

function extractUrl(
  property: PageObjectResponse["properties"][string] | undefined,
): string {
  if (!property || property.type !== "url") return "";
  return property.url ?? "";
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

function pageToWork(page: PageObjectResponse): Work {
  const p = page.properties;
  return {
    id: page.id,
    title: extractText(p["Title"]),
    slug: extractText(p["Slug"]),
    description: extractText(p["Description"]),
    link: extractUrl(p["Link"]),
    status: (extractSelect(p["Status"]) as Work["status"]) || "Released",
    tags: extractMultiSelect(p["Tags"]),
    platforms: extractMultiSelect(p["Platforms"]),
    thumbnailUrl: extractFileUrl(p["Thumbnail"]),
    featured: extractCheckbox(p["Featured"]),
  };
}

/** Return all published works from the Games DB, ordered by Featured then title. */
export async function listWorks(): Promise<Work[]> {
  const notion = getNotionClient();
  const dbId = getDatabaseId();

  const response = await notion.databases.query({
    database_id: dbId,
    filter: {
      property: "Status",
      select: { is_not_empty: true },
    },
    sorts: [
      { property: "Featured", direction: "descending" },
      { property: "Title", direction: "ascending" },
    ],
  });

  return (response.results as PageObjectResponse[])
    .map(pageToWork)
    .filter((w) => w.slug);
}

/** Return a single work by slug, including its Notion page blocks. */
export async function getWorkBySlug(
  slug: string,
): Promise<{ work: Work; blocks: NotionBlock[] } | null> {
  const notion = getNotionClient();
  const dbId = getDatabaseId();

  const response = await notion.databases.query({
    database_id: dbId,
    filter: {
      property: "Slug",
      rich_text: { equals: slug },
    },
    page_size: 1,
  });

  const page = response.results[0] as PageObjectResponse | undefined;
  if (!page) return null;

  const work = pageToWork(page);
  const blocks = await getPageBlocks(page.id);

  return { work, blocks };
}

/** Return all slugs for static path generation. */
export async function listWorkSlugs(): Promise<string[]> {
  const works = await listWorks();
  return works.map((w) => w.slug).filter(Boolean);
}
