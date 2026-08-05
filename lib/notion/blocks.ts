import type {
  BlockObjectResponse,
  PartialBlockObjectResponse,
} from "@notionhq/client/build/src/api-endpoints";
import { getNotionClient } from "./client";

/**
 * A Notion block augmented with its nested children (if any).
 *
 * Notion blocks such as callouts, toggles, and quotes can contain child
 * blocks (e.g. a callout with multiple paragraphs stores everything after
 * the first line as separate child blocks). The Notion API never inlines
 * children in a `blocks.children.list` response, so callers must fetch them
 * with a follow-up request per parent block. We do that once here and attach
 * the result as `children` so renderers don't need to know about pagination.
 */
export type NotionBlock = (BlockObjectResponse | PartialBlockObjectResponse) & {
  children?: NotionBlock[];
};

/**
 * Fetch all direct children of a block, handling pagination automatically.
 */
async function listChildren(blockId: string): Promise<NotionBlock[]> {
  const notion = getNotionClient();
  const blocks: NotionBlock[] = [];
  let cursor: string | undefined;

  do {
    const response = await notion.blocks.children.list({
      block_id: blockId,
      start_cursor: cursor,
      page_size: 100,
    });
    blocks.push(...response.results);
    cursor = response.has_more ? (response.next_cursor ?? undefined) : undefined;
  } while (cursor);

  return blocks;
}

/**
 * Recursively fetch a block's children (and their children, etc.), attaching
 * each level as `children` so nested content (e.g. the extra paragraphs
 * inside a multi-line callout, or a toggle's contents) can be rendered
 * in place.
 */
async function attachChildren(blocks: NotionBlock[]): Promise<NotionBlock[]> {
  await Promise.all(
    blocks.map(async (block) => {
      if ("has_children" in block && block.has_children) {
        const children = await listChildren(block.id);
        block.children = await attachChildren(children);
      }
    }),
  );
  return blocks;
}

/**
 * Fetch all blocks for a Notion page, including nested children, handling
 * pagination automatically.
 */
export async function getPageBlocks(pageId: string): Promise<NotionBlock[]> {
  const blocks = await listChildren(pageId);
  return attachChildren(blocks);
}
