import { NextResponse } from "next/server";
import { getNotionClient } from "@/lib/notion/client";
import type { BlockObjectResponse } from "@notionhq/client/build/src/api-endpoints";
import { sanitizeUrl } from "@/lib/security";

/**
 * In-process cache to avoid redundant Notion API calls.
 * Each entry stores a fresh S3 URL and when it was fetched.
 * Notion signed URLs are valid for ~1 hour; we cache for 45 minutes.
 */
const urlCache = new Map<string, { url: string; cachedAt: number }>();
const CACHE_TTL_MS = 45 * 60 * 1000;
const MAX_CACHE_SIZE = 1000;

function getCached(key: string): string | null {
  const entry = urlCache.get(key);
  if (entry && Date.now() - entry.cachedAt < CACHE_TTL_MS) {
    return entry.url;
  }
  return null;
}

function setCached(key: string, url: string): void {
  // Simple DoS protection: if cache is too large, clear oldest entries (FIFO-ish)
  if (urlCache.size >= MAX_CACHE_SIZE) {
    const firstKey = urlCache.keys().next().value;
    if (firstKey !== undefined) {
      urlCache.delete(firstKey);
    }
  }
  urlCache.set(key, { url, cachedAt: Date.now() });
}

async function resolveBlockImageUrl(blockId: string): Promise<string | null> {
  const cached = getCached(`block:${blockId}`);
  if (cached) return cached;

  const notion = getNotionClient();
  const block = await notion.blocks.retrieve({ block_id: blockId });
  if (!("type" in block) || block.type !== "image") return null;

  const imageBlock = block as BlockObjectResponse & { type: "image" };
  const url =
    imageBlock.image.type === "file"
      ? imageBlock.image.file.url
      : imageBlock.image.external.url;

  setCached(`block:${blockId}`, url);
  return url;
}

async function resolvePagePropertyUrl(pageId: string, prop: string): Promise<string | null> {
  const cacheKey = `page:${pageId}:${prop}`;
  const cached = getCached(cacheKey);
  if (cached) return cached;

  const notion = getNotionClient();
  const page = await notion.pages.retrieve({ page_id: pageId });
  if (!("properties" in page)) return null;

  const property = page.properties[prop];
  if (!property || property.type !== "files" || property.files.length === 0) return null;

  const file = property.files[0];
  const url = file.type === "file" ? file.file.url : file.external.url;

  setCached(cacheKey, url);
  return url;
}

/**
 * GET /api/notion-image
 *
 * Fetches a fresh signed URL from the Notion API and returns a 307 redirect.
 * The redirect response is cached by the browser/CDN for 30 minutes, so
 * Notion's S3 URLs (which expire in ~1 hour) are always refreshed in time.
 *
 * Query parameters (one of the two forms is required):
 *   ?blockId=<notionBlockId>              — for inline image blocks
 *   ?pageId=<notionPageId>&prop=<propName> — for database file properties
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const blockId = searchParams.get("blockId");
  const pageId = searchParams.get("pageId");
  const prop = searchParams.get("prop");

  if (!blockId && (!pageId || !prop)) {
    return new NextResponse("Missing required parameters: blockId or (pageId + prop)", {
      status: 400,
    });
  }

  try {
    const imageUrl = blockId
      ? await resolveBlockImageUrl(blockId)
      : await resolvePagePropertyUrl(pageId!, prop!);

    if (!imageUrl) {
      return new NextResponse("Image not found", { status: 404 });
    }

    const sanitizedUrl = sanitizeUrl(imageUrl);
    if (sanitizedUrl === "about:blank" || sanitizedUrl === "") {
      return new NextResponse("Unsafe image URL", { status: 403 });
    }

    const response = NextResponse.redirect(sanitizedUrl, { status: 307 });
    // Cache the redirect for 30 min; Notion URLs expire in ~1h, so this is safe.
    response.headers.set(
      "Cache-Control",
      "public, max-age=1800, stale-while-revalidate=300",
    );
    return response;
  } catch (error) {
    console.error("[notion-image] Failed to resolve image URL:", error);
    return new NextResponse("Failed to fetch image from Notion", { status: 502 });
  }
}
