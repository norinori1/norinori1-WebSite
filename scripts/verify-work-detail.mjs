import assert from "node:assert/strict";
import { mkdir, writeFile, readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";

const { chromium } = await import(pathToFileURL(resolve(process.argv[2])).href);
const browser = await chromium.launch({ headless: true, executablePath: process.argv[3] });
const output = resolve("docs/verification/work-detail");
await mkdir(output, { recursive: true });
const base = "http://localhost:3137";
const results = { source: "Published Notion text snapshot and explicit synthetic cases. Image artwork is verification-only; no live SDK credentials.", viewports: [], checks: [], pageErrors: [] };
function artwork(destination) {
  const label = new URL(destination).pathname.split("/").pop().replace(".svg", "");
  return `<svg xmlns="http://www.w3.org/2000/svg" width="960" height="540"><rect width="960" height="540" fill="#102a46"/><path d="M0 90H960M0 180H960M0 270H960M0 360H960M0 450H960M120 0V540M240 0V540M360 0V540M480 0V540M600 0V540M720 0V540M840 0V540" stroke="#28517b"/><path d="M370 140h220l75 130-75 130H370l-75-130z" fill="#173b60" stroke="#7db7fb" stroke-width="3"/><text x="480" y="275" text-anchor="middle" fill="#d6e8ff" font-family="monospace" font-size="30">${label}</text><text x="30" y="40" fill="#a7caed" font-family="monospace" font-size="18">VERIFICATION ARTWORK</text></svg>`;
}
async function context(options = {}) {
  const context = await browser.newContext({ reducedMotion: "reduce", ...options });
  await context.route("**/api/notion-image?**", async (route) => {
    const response = await route.fetch({ maxRedirects: 0 });
    assert.equal(response.status(), 307);
    const destination = response.headers().location;
    assert.ok(destination.startsWith("https://secure.notion-static.com/fixtures/"));
    await route.fulfill({ status: 200, contentType: "image/svg+xml", body: artwork(destination) });
  });
  await context.route("https://secure.notion-static.com/fixtures/**", async (route) => {
    await route.fulfill({ status: 200, contentType: "image/svg+xml", body: artwork(route.request().url()) });
  });
  return context;
}
async function ready(page, slug = "fixture-world", query = "") {
  await page.goto(`${base}/works/${slug}${query}`);
  await page.getByRole("tablist").waitFor();
  await page.evaluate(() => document.fonts.ready);
}
async function capture(page, name) {
  const modal = await page.locator("dialog[open]").count() > 0;
  if (!modal) await page.evaluate(() => scrollTo(0, 0));
  await page.evaluate(() => document.querySelectorAll("img").forEach((image) => { image.loading = "eager"; }));
  await page.waitForFunction(() => [...document.querySelectorAll("img")].filter((image) => image.getBoundingClientRect().width > 0).every((image) => image.complete && image.naturalWidth > 0));
  await page.screenshot({ path: resolve(output, name), fullPage: !modal });
}
try {
  for (const width of [320, 390, 768, 1280]) {
    const ctx = await context({ viewport: { width, height: 900 }, hasTouch: width === 390 });
    const page = await ctx.newPage();
    page.on("pageerror", (error) => results.pageErrors.push(error.message));
    await ready(page);
    for (const theme of ["light", "dark"]) {
      await page.evaluate((theme) => localStorage.setItem("theme", theme), theme);
      await page.reload();
      await page.waitForFunction((theme) => document.documentElement.classList.contains(theme), theme);
      await page.getByRole("tablist").waitFor();
      await page.getByRole("tab", { name: "作品紹介", exact: true }).click();
      await capture(page, `detail-${width}-${theme}.png`);
      const layout = await page.evaluate(() => ({ width: innerWidth, page: document.documentElement.scrollWidth,
        thumb: getComputedStyle(document.querySelector("header .thumb-img")).objectFit,
        galleryColumns: getComputedStyle(document.querySelector('[aria-label="スクリーンショット"]')).gridTemplateColumns.split(" ").length,
        hiddenFocus: [...document.querySelectorAll('[role="tabpanel"][hidden] a')].every((item) => item.getBoundingClientRect().width === 0) }));
      assert.ok(layout.page <= width, JSON.stringify(layout));
      const breadcrumb = await page.getByRole("navigation", { name: "パンくず" }).boundingBox();
      const header = await page.locator(".site-header").boundingBox();
      assert.ok(breadcrumb.y >= header.y + header.height, "Breadcrumb must clear the fixed header");
      assert.equal(layout.thumb, "contain");
      assert.equal(layout.galleryColumns, width < 480 ? 1 : width < 768 ? 2 : 3);
      assert.ok(layout.hiddenFocus);
      assert.equal(await page.locator('[aria-label="作品へのリンク"] a').count(), 3);
      assert.equal(await page.locator('[aria-label="スクリーンショット"] figure').count(), 3);
      assert.equal(await page.locator('a[aria-haspopup="dialog"]').count(), 3);
      assert.equal(await page.locator('[role="tabpanel"]:visible').count(), 1);
      await page.getByRole("tab", { name: "技術・開発", exact: true }).click();
      assert.ok(page.url().includes("tab=tech"));
      assert.equal(await page.locator('[aria-label="作品へのリンク"] a').count(), 3);
      await page.getByRole("tab", { name: "ニュース・実績", exact: true }).click();
      await page.getByText("検証専用のニュース本文", { exact: true }).waitFor();
      await page.getByRole("tab", { name: "作品紹介", exact: true }).click();
      if (width === 390) await page.getByRole("tab", { name: "技術・開発", exact: true }).tap();
      results.viewports.push({ theme, ...layout });
    }
    await ctx.close();
  }
  const ctx = await context({ viewport: { width: 1280, height: 900 } });
  const page = await ctx.newPage();
  page.on("pageerror", (error) => results.pageErrors.push(error.message));
  await ready(page, "fixture-world", "?utm_source=verification&tab=tech");
  assert.equal(await page.getByRole("tab", { selected: true }).getAttribute("id"), "work-tab-tech");
  await page.getByRole("tab", { name: "技術・開発", exact: true }).focus();
  await page.keyboard.press("ArrowRight");
  assert.ok(page.url().includes("utm_source=verification") && page.url().includes("tab=news"));
  assert.equal(await page.locator("#work-tab-news").evaluate((element) => element === document.activeElement), true);
  await page.keyboard.press("Home");
  assert.ok(!page.url().includes("tab="));
  await page.keyboard.press("End");
  assert.ok(page.url().includes("tab=news"));
  await page.keyboard.press("ArrowRight");
  assert.equal(await page.locator("#work-tab-intro").evaluate((element) => element === document.activeElement), true);
  await page.keyboard.press("ArrowLeft");
  assert.ok(page.url().includes("tab=news"));
  await page.goBack();
  await page.getByRole("tab", { name: "作品紹介", selected: true }).waitFor();
  await page.goForward();
  await page.getByRole("tab", { name: "ニュース・実績", selected: true }).waitFor();
  results.checks.push("Direct links, other query preservation, history, ArrowLeft/Right wrapping, Home/End and roving focus");
  await ready(page, "fixture-world", "?tab=unknown");
  await page.getByRole("tab", { name: "作品紹介", selected: true }).waitFor();
  await page.locator('a[aria-haspopup="dialog"]').first().focus();
  await page.keyboard.press("Enter");
  await page.getByRole("dialog").waitFor();
  assert.equal(await page.getByRole("button", { name: "拡大表示を閉じる" }).evaluate((element) => element === document.activeElement), true);
  await capture(page, "detail-lightbox.png");
  await page.keyboard.press("Tab");
  assert.equal(await page.getByRole("button", { name: "拡大表示を閉じる" }).evaluate((element) => element === document.activeElement), true);
  await page.keyboard.press("Escape");
  await page.getByRole("dialog").waitFor({ state: "hidden" });
  assert.equal(await page.locator('a[aria-haspopup="dialog"]').first().evaluate((element) => element === document.activeElement), true);
  await page.keyboard.press("Space");
  await page.getByRole("dialog").waitFor();
  await page.getByRole("button", { name: "拡大表示を閉じる" }).click();
  results.checks.push("Gallery native dialog: Enter/Space, modal focus, Escape, close button and trigger focus restoration; actual block-image proxy redirects");
  await ready(page, "fixture-gimmick", "?tab=news");
  assert.equal(await page.getByRole("tab").count(), 1);
  assert.equal(await page.locator('[aria-label="作品へのリンク"]').count(), 0);
  assert.equal(await page.locator('[aria-label="スクリーンショット"]').count(), 0);
  await capture(page, "detail-empty.png");
  await ready(page, "fixture-avatar");
  const ctas = page.locator('[aria-label="作品へのリンク"] a');
  assert.equal(await ctas.count(), 2);
  assert.equal(await ctas.first().getAttribute("href"), "https://sample.booth.pm/items/1");
  assert.match(await ctas.first().innerText(), /配布ページを見る/);
  results.checks.push("Empty optional tabs, missing thumbnail/link, invalid/duplicate URL exclusion and additional-only primary CTA");
  const snapshots = JSON.parse(await readFile(resolve("scripts/fixtures/works-detail-snapshot.json"), "utf8"));
  for (const work of snapshots) {
    await ready(page, work.slug);
    const body = await page.locator("#work-panel-intro").innerText();
    for (const line of work.body.split("\n")) {
      if (!line || line === "<empty-block/>" || line.startsWith("```")) continue;
      const content = line.replace(/^#{1,3} /, "").replace(/\[([^\]]+)\]\(https?:\/\/[^)]+\)/g, "$1")
        .replace(/\*\*/g, "").replace(/<br>/g, "\n").replace(/\\([\\*~`$\[\]<>{}|^])/g, "$1");
      assert.ok(body.includes(content), `${work.slug}: missing ${content.slice(0, 60)}`);
    }
    assert.equal(await page.locator('link[rel="canonical"]').getAttribute("href"), `https://norinori1.vercel.app/works/${work.slug}`);
    const otherUrls = await page.locator('section.section-alt a[href^="/works/"]').evaluateAll((elements) => elements.map((element) => element.getAttribute("href")));
    assert.ok(!otherUrls.includes(`/works/${work.slug}`));
  }
  await ready(page, "zintoroad");
  await capture(page, "detail-zintoroad-legacy.png");
  const related = await page.locator('section.section-alt a[href^="/works/"]').evaluateAll((elements) => elements.map((element) => element.getAttribute("href")));
  assert.deepEqual(related, ["/works/block-crushing-game", "/works/puzzle-ball-stage-maker", "/works/polarity-under", "/works/fixture-featured"]);
  results.checks.push("All 15 published legacy bodies preserve every text line, canonical URLs; same-category related works exclude the current work");
  await ready(page, "fixture-long-title");
  assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
  await page.goto(`${base}/works`);
  assert.equal(await page.locator('article > a[href^="/works/"]').count(), 21);
  results.checks.push("Long title and unchanged gallery card count/layout after shared card extraction");
  await ctx.close();
  const noJs = await context({ javaScriptEnabled: false, viewport: { width: 390, height: 900 } });
  const staticPage = await noJs.newPage();
  await staticPage.goto(`${base}/works/fixture-world?tab=tech`);
  assert.equal(await staticPage.locator('section[id^="work-panel-"]:visible').count(), 3);
  await staticPage.getByText("検証専用のニュース本文", { exact: true }).waitFor();
  assert.equal(await staticPage.locator('a[aria-haspopup="dialog"]').count(), 3);
  results.checks.push("JavaScript disabled: all server-rendered sections readable; screenshot links remain usable");
  await noJs.close();
  assert.deepEqual(results.pageErrors, []);
  console.log(JSON.stringify(results, null, 2));
} finally {
  await writeFile(resolve(output, "browser-results.json"), JSON.stringify(results, null, 2) + "\n");
  await browser.close();
}
