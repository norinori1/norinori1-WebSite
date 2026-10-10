import type { NotionBlock } from "@/lib/notion/blocks";
import { buildIntroSegments } from "@/lib/work-sections";
import { sanitizeUrl } from "@/lib/security";
import NotionBlocks, { RichText } from "./NotionBlocks";
import ScreenshotGallery, { type Screenshot } from "./ScreenshotGallery";

export default function WorkIntro({ blocks }: { blocks: NotionBlock[] }) {
  return buildIntroSegments(blocks).map((segment, index) => {
    if (segment.kind === "body") return <NotionBlocks key={index} blocks={segment.blocks} />;
    const images: Screenshot[] = segment.blocks.flatMap((block) => {
      if (!("type" in block) || block.type !== "image") return [];
      const src = block.image.type === "file" ? `/api/notion-image?blockId=${block.id}` : sanitizeUrl(block.image.external.url);
      if (src === "about:blank") return [];
      const caption = block.image.caption;
      return [{ id: block.id, src, alt: caption.map((item) => item.plain_text).join(""),
        caption: caption.length ? <RichText items={caption} /> : null }];
    });
    return <ScreenshotGallery key={index} images={images} />;
  });
}
