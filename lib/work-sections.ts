import type { NotionBlock } from "./notion/blocks";

export const WORK_TABS = [
  { id: "intro", label: "作品紹介" },
  { id: "tech", label: "技術・開発" },
  { id: "news", label: "ニュース・実績" },
] as const;
export type WorkTabId = (typeof WORK_TABS)[number]["id"];
export type WorkSections = Record<WorkTabId, NotionBlock[]>;

/** Only exact, top-level H1 text marks a boundary. Children remain in their section. */
export function splitWorkSections(blocks: readonly NotionBlock[]): WorkSections {
  const sections: WorkSections = { intro: [], tech: [], news: [] };
  let current: WorkTabId = "intro";
  for (const block of blocks) {
    const text = "type" in block && block.type === "heading_1"
      ? block.heading_1.rich_text.map((item) => item.plain_text).join("") : null;
    const tab = WORK_TABS.find((item) => item.label === text);
    if (tab) {
      current = tab.id;
      sections[current].push(...(block.children ?? []));
    } else {
      sections[current].push(block);
    }
  }
  return sections;
}

export function hasSectionContent(blocks: readonly NotionBlock[]): boolean {
  return blocks.some((block) => {
    if (block.children && hasSectionContent(block.children)) return true;
    if (!("type" in block)) return true; // Unknown content must never make a tab disappear.
    if (block.type === "unsupported") return true;
    if (block.type === "divider" || block.type.startsWith("heading_")) return false;
    const payload = block[block.type as keyof typeof block];
    if (payload && typeof payload === "object" && "rich_text" in payload) {
      return (payload.rich_text as { plain_text: string }[]).some((item) => item.plain_text.trim());
    }
    return true;
  });
}

export type IntroSegment = { kind: "body" | "gallery"; blocks: NotionBlock[] };

/** Group consecutive direct images in the screenshot H2, without moving other blocks. */
export function buildIntroSegments(blocks: readonly NotionBlock[]): IntroSegment[] {
  const segments: IntroSegment[] = [];
  let screenshots = false;
  for (const block of blocks) {
    if ("type" in block) {
      if (block.type === "heading_1") screenshots = false;
      if (block.type === "heading_2") {
        screenshots = block.heading_2.rich_text.map((item) => item.plain_text).join("") === "スクリーンショット";
      }
    }
    const kind = screenshots && "type" in block && block.type === "image" ? "gallery" : "body";
    const previous = segments.at(-1);
    if (previous?.kind === kind) previous.blocks.push(block);
    else segments.push({ kind, blocks: [block] });
  }
  return segments;
}

export function selectWorkTab(value: string | null, available: readonly string[]): WorkTabId {
  return WORK_TABS.some((tab) => tab.id === value) && available.includes(value!) ? value as WorkTabId : "intro";
}
