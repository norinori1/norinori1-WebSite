import type {
  BlockObjectResponse,
  RichTextItemResponse,
} from "@notionhq/client/build/src/api-endpoints";
import type { NotionBlock } from "@/lib/notion/blocks";
import Image from "next/image";
import { sanitizeUrl } from "@/lib/security";

/** Render Notion rich text with inline formatting preserved. */
function RichText({ items }: { items: RichTextItemResponse[] }) {
  return (
    <>
      {items.map((item, i) => {
        const { annotations, plain_text, href } = item;
        let node: React.ReactNode = plain_text;

        if (annotations.code) {
          node = <code className="notion-inline-code">{node}</code>;
        }
        if (annotations.bold) node = <strong>{node}</strong>;
        if (annotations.italic) node = <em>{node}</em>;
        if (annotations.strikethrough) node = <s>{node}</s>;
        if (annotations.underline) node = <u>{node}</u>;

        if (href) {
          node = (
            <a href={sanitizeUrl(href)} target="_blank" rel="noopener noreferrer">
              {node}
            </a>
          );
        }

        return <span key={i}>{node}</span>;
      })}
    </>
  );
}

type FullBlock = BlockObjectResponse & { children?: NotionBlock[] };

function isFullBlock(block: NotionBlock): block is FullBlock {
  return "type" in block;
}

/**
 * Render a Notion block's nested children, if any. Used by block types that
 * can contain other blocks (callouts, toggles, quotes, list items) so their
 * content stays visually grouped with the parent instead of being dropped.
 */
function NestedChildren({ blocks }: { blocks: NotionBlock[] | undefined }) {
  if (!blocks || blocks.length === 0) return null;
  return <>{renderBlocks(blocks)}</>;
}

/** Render a single Notion block. */
function NotionBlockView({ block }: { block: NotionBlock }) {
  if (!isFullBlock(block)) return null;

  switch (block.type) {
    case "paragraph":
      return (
        <>
          <p>
            <RichText items={block.paragraph.rich_text} />
          </p>
          <NestedChildren blocks={block.children} />
        </>
      );

    case "heading_1":
      return (
        <h2>
          <RichText items={block.heading_1.rich_text} />
        </h2>
      );

    case "heading_2":
      return (
        <h3>
          <RichText items={block.heading_2.rich_text} />
        </h3>
      );

    case "heading_3":
      return (
        <h4>
          <RichText items={block.heading_3.rich_text} />
        </h4>
      );

    case "bulleted_list_item":
      return (
        <li>
          <RichText items={block.bulleted_list_item.rich_text} />
          <NestedChildren blocks={block.children} />
        </li>
      );

    case "numbered_list_item":
      return (
        <li>
          <RichText items={block.numbered_list_item.rich_text} />
          <NestedChildren blocks={block.children} />
        </li>
      );

    case "code":
      return (
        <pre className="notion-code">
          <code>
            <RichText items={block.code.rich_text} />
          </code>
        </pre>
      );

    case "quote":
      return (
        <blockquote>
          <RichText items={block.quote.rich_text} />
          <NestedChildren blocks={block.children} />
        </blockquote>
      );

    case "callout": {
      const icon = block.callout.icon;
      const emoji =
        icon && icon.type === "emoji" ? icon.emoji : null;
      return (
        <div className="notion-callout">
          {emoji && <span className="notion-callout-icon">{emoji}</span>}
          <div>
            <RichText items={block.callout.rich_text} />
            <NestedChildren blocks={block.children} />
          </div>
        </div>
      );
    }

    case "divider":
      return <hr />;

    case "image": {
      // Use the proxy for Notion-hosted (signed S3) URLs so they never expire.
      // External URLs are stable and can be used directly, but we sanitize them for safety.
      const src =
        block.image.type === "file"
          ? `/api/notion-image?blockId=${block.id}`
          : sanitizeUrl(block.image.external.url);
      const caption =
        block.image.caption.length > 0
          ? block.image.caption.map((t) => t.plain_text).join("")
          : undefined;
      return (
        <figure>
          <Image
            src={src}
            alt={caption ?? ""}
            width={800}
            height={450}
            style={{ width: "100%", height: "auto" }}
            unoptimized
          />
          {caption && (
            <figcaption className="notion-image-caption">{caption}</figcaption>
          )}
        </figure>
      );
    }

    case "bookmark":
      return (
        <div className="notion-bookmark">
          <a
            href={sanitizeUrl(block.bookmark.url)}
            target="_blank"
            rel="noopener noreferrer"
          >
            {block.bookmark.url}
          </a>
        </div>
      );

    case "toggle":
      return (
        <details className="notion-toggle">
          <summary>
            <RichText items={block.toggle.rich_text} />
          </summary>
          <NestedChildren blocks={block.children} />
        </details>
      );

    default:
      return null;
  }
}

/**
 * Render a list of Notion blocks, grouping consecutive list items into
 * proper <ul>/<ol> elements. Used both for a page's top-level blocks and,
 * recursively, for any block's nested children.
 */
function renderBlocks(blocks: NotionBlock[]): React.ReactNode[] {
  const elements: React.ReactNode[] = [];
  let i = 0;

  while (i < blocks.length) {
    const block = blocks[i];
    if (!isFullBlock(block)) {
      i++;
      continue;
    }

    if (block.type === "bulleted_list_item") {
      const items: NotionBlock[] = [];
      while (i < blocks.length) {
        const b = blocks[i];
        if (isFullBlock(b) && b.type === "bulleted_list_item") {
          items.push(b);
          i++;
        } else {
          break;
        }
      }
      elements.push(
        <ul key={`ul-${i}`}>
          {items.map((b) => (
            <NotionBlockView key={(b as FullBlock).id} block={b} />
          ))}
        </ul>,
      );
      continue;
    }

    if (block.type === "numbered_list_item") {
      const items: NotionBlock[] = [];
      while (i < blocks.length) {
        const b = blocks[i];
        if (isFullBlock(b) && b.type === "numbered_list_item") {
          items.push(b);
          i++;
        } else {
          break;
        }
      }
      elements.push(
        <ol key={`ol-${i}`}>
          {items.map((b) => (
            <NotionBlockView key={(b as FullBlock).id} block={b} />
          ))}
        </ol>,
      );
      continue;
    }

    elements.push(<NotionBlockView key={block.id} block={block} />);
    i++;
  }

  return elements;
}

export default function NotionBlocks({ blocks }: { blocks: NotionBlock[] }) {
  return (
    <div className="prose prose-slate max-w-none notion-content">
      {renderBlocks(blocks)}
    </div>
  );
}
