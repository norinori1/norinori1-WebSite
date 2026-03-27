import type {
  BlockObjectResponse,
  RichTextItemResponse,
} from "@notionhq/client/build/src/api-endpoints";
import type { NotionBlock } from "@/lib/notion/blocks";
import Image from "next/image";

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
            <a href={href} target="_blank" rel="noopener noreferrer">
              {node}
            </a>
          );
        }

        return <span key={i}>{node}</span>;
      })}
    </>
  );
}

type FullBlock = BlockObjectResponse;

function isFullBlock(block: NotionBlock): block is FullBlock {
  return "type" in block;
}

/** Render a single Notion block. */
function NotionBlock({ block }: { block: NotionBlock }) {
  if (!isFullBlock(block)) return null;

  switch (block.type) {
    case "paragraph":
      return (
        <p className="notion-paragraph">
          <RichText items={block.paragraph.rich_text} />
        </p>
      );

    case "heading_1":
      return (
        <h2 className="notion-h1">
          <RichText items={block.heading_1.rich_text} />
        </h2>
      );

    case "heading_2":
      return (
        <h3 className="notion-h2">
          <RichText items={block.heading_2.rich_text} />
        </h3>
      );

    case "heading_3":
      return (
        <h4 className="notion-h3">
          <RichText items={block.heading_3.rich_text} />
        </h4>
      );

    case "bulleted_list_item":
      return (
        <li className="notion-list-item">
          <RichText items={block.bulleted_list_item.rich_text} />
        </li>
      );

    case "numbered_list_item":
      return (
        <li className="notion-list-item">
          <RichText items={block.numbered_list_item.rich_text} />
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
        <blockquote className="notion-quote">
          <RichText items={block.quote.rich_text} />
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
          </div>
        </div>
      );
    }

    case "divider":
      return <hr className="notion-divider" />;

    case "image": {
      const src =
        block.image.type === "file"
          ? block.image.file.url
          : block.image.external.url;
      const caption =
        block.image.caption.length > 0
          ? block.image.caption.map((t) => t.plain_text).join("")
          : undefined;
      return (
        <figure className="notion-image">
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
          <a href={block.bookmark.url} target="_blank" rel="noopener noreferrer">
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
        </details>
      );

    default:
      return null;
  }
}

/**
 * Render a list of Notion blocks, grouping consecutive list items into
 * proper <ul>/<ol> elements.
 */
export default function NotionBlocks({ blocks }: { blocks: NotionBlock[] }) {
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
        <ul key={`ul-${i}`} className="notion-ul">
          {items.map((b) => (
            <NotionBlock key={(b as FullBlock).id} block={b} />
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
        <ol key={`ol-${i}`} className="notion-ol">
          {items.map((b) => (
            <NotionBlock key={(b as FullBlock).id} block={b} />
          ))}
        </ol>,
      );
      continue;
    }

    elements.push(<NotionBlock key={block.id} block={block} />);
    i++;
  }

  return <div className="notion-content">{elements}</div>;
}
