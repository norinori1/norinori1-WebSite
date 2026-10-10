import assert from "node:assert/strict";
import type { NotionBlock } from "./notion/blocks";
import { splitWorkSections, buildIntroSegments, hasSectionContent, selectWorkTab } from "./work-sections";
import { getWorkLinks, parseAdditionalLinks, workAction } from "./work-links";

const text = (plain_text: string) => [{ plain_text }];
function block(id: string, type: string, value = "", children?: NotionBlock[]): NotionBlock {
  if (type === "image") return { id, type, image: { type: "external", external: { url: "https://example.com/image.png" }, caption: [] } } as unknown as NotionBlock;
  return { id, type, [type]: { rich_text: text(value) }, ...(children && { children }) } as unknown as NotionBlock;
}
const legacy = [block("old-h1", "heading_1", "概要"), block("old-text", "paragraph", "全文を残す\n改行も残す"),
  block("nested", "toggle", "詳細", [block("nested-tech", "heading_1", "技術・開発"), block("child", "paragraph", "入れ子")])];
assert.deepEqual(splitWorkSections(legacy), { intro: legacy, tech: [], news: [] });
assert.equal(splitWorkSections(legacy).intro[2], legacy[2]);
const before = block("before", "paragraph", "見出し前の本文");
const intro = block("intro-text", "paragraph", "概要");
const tech = block("tech-text", "code", "const preserved = true;");
const unknown = block("unknown", "unsupported");
const variant = block("variant", "heading_1", "技術・開発 ");
const child = block("boundary-child", "paragraph", "トグル見出しの本文");
const result = splitWorkSections([before, block("intro", "heading_1", "作品紹介"), intro,
  block("tech", "heading_1", "技術・開発"), tech, unknown, variant,
  block("intro-again", "heading_1", "作品紹介"), block("h2", "heading_2", "ニュース・実績"),
  block("news", "heading_1", "ニュース・実績", [child])]);
assert.deepEqual(result.intro.map((item) => item.id), ["before", "intro-text", "h2"]);
assert.deepEqual(result.tech, [tech, unknown, variant]);
assert.deepEqual(result.news, [child]);
assert.equal(hasSectionContent([block("heading", "heading_2", "使用技術"), block("empty", "paragraph", " \n"), block("divider", "divider")]), false);
assert.equal(hasSectionContent([unknown]), true);
assert.equal(hasSectionContent([block("quote", "quote", "", [intro])]), true);
assert.equal(hasSectionContent([block("image", "image")]), true);
const images = [block("a", "image"), block("b", "image")];
const nestedImage = block("toggle-image", "toggle", "画像", [block("nested-image", "image")]);
const segments = buildIntroSegments([block("outside", "image"), block("screens", "heading_2", "スクリーンショット"),
  ...images, before, block("c", "image"), nestedImage, block("next", "heading_2", "遊び方"), block("after", "image")]);
assert.deepEqual(segments.map((segment) => [segment.kind, segment.blocks.map((item) => item.id)]), [
  ["body", ["outside", "screens"]], ["gallery", ["a", "b"]], ["body", ["before"]],
  ["gallery", ["c"]], ["body", ["toggle-image", "next", "after"]],
]);
assert.equal(segments.flatMap((item) => item.blocks).length, 9);
assert.equal(buildIntroSegments([block("screens", "heading_2", "スクリーンショット"), before]).some((segment) => segment.kind === "gallery"), false);
assert.equal(selectWorkTab("tech", ["intro", "tech"]), "tech");
for (const value of [null, "", "invalid", "news"]) assert.equal(selectWorkTab(value, ["intro", "tech"]), "intro");
assert.deepEqual(parseAdditionalLinks(" https://a.example \r\n\nhttps://b.example\n "), ["https://a.example", "https://b.example"]);
const links = getWorkLinks({ link: "javascript:alert(1)", additionalLinks: ["", "mailto:user@example.com", "//example.com", "/relative", "https://user:pass@github.com/", "https://NORINORI1.itch.io", "https://norinori1.itch.io/", "https://github.com/norinori1/project"] });
assert.equal(links.length, 2);
assert.equal(links[0].service, "itch.io");
assert.equal(links[1].icon.name, "github");
const cases = [
  ["https://scratch.mit.edu/projects/1", "scratch"], ["https://www.unityroom.com/games/test", "unity"],
  ["https://www.roblox.com/games/1", "roblox"], ["https://discord.gg/example", "discord"],
  ["https://vrchat.com/home/world/wrld_example", "portal"], ["https://shop.booth.pm/items/1", "package"],
  ["https://norinori1.github.io/tool", "web"], ["https://itch.io.evil.example/path/github.com", "web"],
  ["https://notitch.io/", "web"], ["https://github.com.evil.example/", "web"], ["https://unknown.example", "web"],
] as const;
for (const [link, icon] of cases) assert.equal(getWorkLinks({ link, additionalLinks: [] })[0].icon.name, icon);
assert.equal(workAction("Unity Games"), "プレイする");
assert.equal(workAction("VRChat Worlds"), "ワールドを見る");
assert.equal(workAction("Avatar Assets"), "配布ページを見る");
assert.equal(workAction("Developer Tools"), "ツールを見る");
assert.equal(workAction("Other"), "作品を見る");
console.log("Work detail: legacy preservation, exact H1 boundaries, nesting, empty sections, gallery scope/order, direct tabs and safe multi-service links passed.");
