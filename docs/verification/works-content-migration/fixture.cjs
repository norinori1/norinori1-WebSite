// Verification only: real published CMS text plus explicit synthetic boundary cases.
// Never loaded by normal development/build commands. No credentials or signed URLs.
// Synchronous CommonJS preload: fetch must be patched before Next loads the SDK.
/* eslint-disable @typescript-eslint/no-require-imports */
require("../../../scripts/works-browser-fixture.cjs");
const snapshots = require("./snapshot.json");
const baseFetch = globalThis.fetch;
let nextId = 0;
const blocksById = new Map();
const roots = new Map();
const annotations = { bold: false, italic: false, strikethrough: false, underline: false, code: false, color: "default" };
function rich(value) {
  const plain = (content, href = null, bold = false) => ({ type: "text", plain_text: content, href,
    text: { content, link: href ? { url: href } : null }, annotations: { ...annotations, bold } });
  const pieces = value.split(/(\[[^\]]+\]\(https?:\/\/[^)]+\)|\*\*[^*]+\*\*)/g).filter(Boolean);
  return pieces.map((piece) => {
    const link = piece.match(/^\[([^\]]+)\]\((https?:\/\/[^)]+)\)$/);
    if (link) return plain(link[1], link[2]);
    if (piece.startsWith("**") && piece.endsWith("**")) return plain(piece.slice(2, -2), null, true);
    return plain(piece.replace(/<br>/g, "\n").replace(/\\([\\*~`$\[\]<>{}|^])/g, "$1"));
  });
}
function make(type, content = "", children = []) {
  const id = `20000000-0000-4000-8000-${String(++nextId).padStart(12, "0")}`;
  const block = { object: "block", id, type, has_children: children.length > 0,
    [type]: { rich_text: rich(content), color: "default" } };
  blocksById.set(id.replaceAll("-", ""), { block, children });
  return block;
}
function markdownBlocks(markdown) {
  const blocks = [], lines = markdown.split("\n");
  for (let index = 0; index < lines.length; index++) {
    const line = lines[index];
    if (!line) continue;
    if (line.startsWith("```")) {
      const code = [];
      while (++index < lines.length && !lines[index].startsWith("```")) code.push(lines[index]);
      const block = make("code", "");
      block.code = { rich_text: rich(code.join("\n")), caption: [], language: "plain text" };
      blocks.push(block);
    } else if (/^#{1,3} /.test(line)) {
      const heading = line.match(/^(#{1,3}) (.*)$/);
      blocks.push(make(`heading_${heading[1].length}`, heading[2]));
    } else if (line.startsWith("- ")) blocks.push(make("bulleted_list_item", line.slice(2)));
    else if (line === "<empty-block/>") blocks.push(make("paragraph"));
    else blocks.push(make("paragraph", line));
  }
  return blocks;
}
for (const page of snapshots) roots.set(page.id.replaceAll("-", ""), markdownBlocks(page.body));
function screenshot(name, hosted = true) {
  const block = make("image");
  block.image = { type: hosted ? "file" : "external", caption: rich(name),
    [hosted ? "file" : "external"]: { url: `https://secure.notion-static.com/fixtures/${name}.svg` } };
  return block;
}
const nested = make("toggle", "入れ子はそのまま", [make("heading_1", "ニュース・実績"), make("paragraph", "入れ子本文を保全")]);
const full = [make("paragraph", "境界前の本文を保全"), make("heading_1", "作品紹介"), make("heading_2", "概要"),
  make("paragraph", "検証用の三タブ作品。これは実作品の登録内容ではありません。"),
  make("heading_2", "スクリーンショット"), screenshot("screen-one"), screenshot("screen-two"), screenshot("screen-three", false),
  make("paragraph", "ギャラリー後の本文"), nested, make("heading_2", "遊び方・操作方法"), screenshot("outside-gallery"),
  make("heading_1", "技術・開発"), make("heading_2", "設計・実装の工夫"), make("code", "const preserved = true;"),
  make("heading_1", "ニュース・実績"), make("heading_2", "掲載・紹介"), make("paragraph", "検証専用のニュース本文")];
full.find((block) => block.type === "code").code.language = "javascript";
roots.set("10000000000040008000000000000002", full);
roots.set("10000000000040008000000000000003", [make("heading_1", "作品紹介"), make("paragraph", "画像・リンクなしでも成立"),
  make("heading_1", "技術・開発"), make("heading_2", "使用技術"), make("paragraph", ""), make("heading_1", "ニュース・実績")]);
roots.set("10000000000040008000000000000004", [make("heading_1", "作品紹介"), make("paragraph", "配布リンクの検証")]);
globalThis.fetch = async (input, options) => {
  const url = new URL(typeof input === "string" || input instanceof URL ? input : input.url);
  if (url.hostname !== "api.notion.com") return baseFetch(input, options);
  const key = url.pathname.split("/")[3]?.replaceAll("-", "");
  if (url.pathname.startsWith("/v1/blocks/")) {
    const entry = blocksById.get(key);
    const body = url.pathname.endsWith("/children") ?
      { object: "list", results: roots.get(key) ?? entry?.children ?? [], has_more: false, next_cursor: null } : entry?.block;
    return new Response(JSON.stringify(body), { headers: { "content-type": "application/json" } });
  }
  const response = await baseFetch(input, options);
  if (!url.pathname.startsWith("/v1/data_sources/") && !url.pathname.startsWith("/v1/pages/")) return response;
  const data = await response.json();
  for (const page of data.results ?? [data]) {
    const source = snapshots.find((item) => item.id.replaceAll("-", "") === page.id?.replaceAll("-", ""));
    if (!page.properties) continue;
    if (source) {
      page.properties.Link = { type: "url", url: source.link || null };
      page.properties.Repository = { type: "url", url: source.repository || null };
      page.properties.Engines = { type: "multi_select", multi_select: source.engines.map((name) => ({ name })) };
    }
    const id = page.id.replaceAll("-", "");
    if (id === "10000000000040008000000000000002") {
      page.properties.Link = { type: "url", url: "https://vrchat.com/home/world/wrld_fixture" };
      page.properties["Additional Links"] = { type: "rich_text", rich_text: rich("https://sample.booth.pm/items/1\nhttps://github.com/norinori1/test\nhttps://sample.booth.pm/items/1\njavascript:alert(1)") };
    }
    if (id === "10000000000040008000000000000004") {
      page.properties.Link = { type: "url", url: null };
      page.properties["Additional Links"] = { type: "rich_text", rich_text: rich("https://sample.booth.pm/items/1\nhttps://unknown.example/asset") };
    }
  }
  return new Response(JSON.stringify(data), { headers: { "content-type": "application/json" } });
};
