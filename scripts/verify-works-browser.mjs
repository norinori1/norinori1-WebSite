import assert from "node:assert/strict";
import { mkdir, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";

// Uses an existing Playwright installation; no package or test framework is added.
const { chromium } = await import(process.argv[2] ? pathToFileURL(resolve(process.argv[2])).href : "playwright");
const browser = await chromium.launch({ headless: true, ...(process.argv[3] ? { executablePath: process.argv[3] } : {}) });
const output = resolve("docs/verification/works-gallery");
await mkdir(output, { recursive: true });
const results = { data: "Local Notion SDK fixtures: CMS snapshot plus six synthetic edge cases; not a live website-to-Notion connection", viewports: [], interactions: [], pageErrors: [] };
const baseURL = "http://localhost:3135";
const categories = ["Unity Games", "Roblox Games", "Scratch Games", "VRChat Worlds", "VRChat Gimmicks", "Avatar Assets", "Developer Tools", "Other / 未分類"];
function svgFor(url) {
  const slug = new URL(url).pathname.split("/").pop().replace(".svg", "");
  const label = slug.replaceAll("-", " ").replaceAll("&", "&amp;");
  return `<svg xmlns="http://www.w3.org/2000/svg" width="960" height="540" viewBox="0 0 960 540"><rect width="960" height="540" fill="#102a46"/><path d="M0 90H960M0 180H960M0 270H960M0 360H960M0 450H960M120 0V540M240 0V540M360 0V540M480 0V540M600 0V540M720 0V540M840 0V540" stroke="#28517b"/><path d="M370 140h220l75 130-75 130H370l-75-130z" fill="#173b60" stroke="#7db7fb" stroke-width="3"/><text x="480" y="281" fill="#d6e8ff" font-family="monospace" font-size="32" text-anchor="middle">WORKS</text><text x="480" y="480" fill="#a7caed" font-family="sans-serif" font-size="25" text-anchor="middle">${label}</text><text x="28" y="34" fill="#a7caed" font-family="monospace" font-size="18">VERIFICATION ARTWORK</text></svg>`;
}
async function prepare(context) {
  context.setDefaultTimeout(30000);
  context.setDefaultNavigationTimeout(30000);
  // Chromium does not re-run interception for the redirected image request.
  // Verify the actual proxy redirect, then supply artwork at that boundary.
  await context.route("**/api/notion-image?**", async (route) => {
    const response = await route.fetch({ maxRedirects: 0 });
    assert.equal(response.status(), 307);
    const destination = response.headers().location;
    assert.ok(destination.startsWith("https://secure.notion-static.com/fixtures/"));
    await route.fulfill({ status: 200, contentType: "image/svg+xml", body: svgFor(destination) });
  });
  const page = await context.newPage();
  page.on("pageerror", (error) => results.pageErrors.push(error.message));
  await page.goto(`${baseURL}/works`);
  await page.getByRole("status").filter({ hasText: "21 件の作品" }).waitFor();
  await page.evaluate(() => document.fonts.ready);
  await page.locator('article > a[href^="/works/"]').first().waitFor();
  await page.evaluate(() => document.querySelectorAll("article img").forEach((image) => { image.loading = "eager"; }));
  await page.waitForFunction(() => [...document.querySelectorAll('article img')].every((img) => img.complete && img.naturalWidth > 0)).catch(async (error) => {
    console.error(await page.locator("article img").evaluateAll((images) => images.map((image) => ({ src: image.src, loaded: image.complete, width: image.naturalWidth, loading: image.loading }))));
    throw error;
  });
  return page;
}
function sections(page) { return page.locator('section[aria-labelledby^="works-"]'); }
function cards(page) { return page.locator('article > a[href^="/works/"]'); }
async function capture(page, name) {
  await page.evaluate(() => document.querySelectorAll("article img").forEach((image) => { image.loading = "eager"; }));
  await page.waitForFunction(() => [...document.querySelectorAll("article img")].every((image) => image.complete && image.naturalWidth > 0));
  await page.screenshot({ path: resolve(output, name), fullPage: true });
}
async function titles(page, section = 0) { return sections(page).nth(section).locator("h3").allTextContents(); }
async function expectCategories(page, expected) { assert.deepEqual(await sections(page).locator("h2").allTextContents(), expected); }
try {
  for (const width of [320, 390, 768, 1280]) {
    const context = await browser.newContext({ viewport: { width, height: 900 }, colorScheme: "light", reducedMotion: "reduce" });
    const page = await prepare(context);
    for (const theme of ["light", "dark"]) {
      await page.evaluate((value) => { localStorage.setItem("theme", value); }, theme);
      await page.reload();
      await page.getByRole("status").filter({ hasText: "21 件の作品" }).waitFor();
      await page.waitForFunction((value) => document.documentElement.classList.contains(value), theme);
      await page.evaluate(() => document.querySelectorAll("article img").forEach((image) => { image.loading = "eager"; }));
      await page.waitForFunction(() => [...document.querySelectorAll('article img')].every((img) => img.complete && img.naturalWidth > 0));
      await expectCategories(page, categories);
      const layout = await page.evaluate(() => {
        const section = document.querySelector('section[aria-labelledby^="works-"]');
        const grid = section.lastElementChild;
        const heading = section.querySelector("h2");
        const link = section.querySelector("article > a");
        const artwork = link.firstElementChild.getBoundingClientRect();
        const title = link.querySelector("h3");
        const titleStyle = getComputedStyle(title);
        const nav = document.querySelector('nav[aria-label="作品カテゴリへ移動"]');
        return { columns: getComputedStyle(grid).gridTemplateColumns.split(" ").length, pageWidth: document.documentElement.scrollWidth, viewport: innerWidth,
          artworkRatio: artwork.width / artwork.height, titleLines: title.getBoundingClientRect().height / parseFloat(titleStyle.lineHeight),
          navScrollable: nav.scrollWidth > nav.clientWidth, panelHidden: document.getElementById("works-filters-panel").hidden,
          h1: document.querySelectorAll("h1").length, headingLevel: heading.tagName,
          placeholders: [...document.querySelectorAll("article > a")].filter((card) => !card.querySelector("img")).length,
          tagCounts: [...document.querySelectorAll("article > a")].map((card) => card.querySelectorAll('[class*="__tags"] > span').length) };
      });
      assert.equal(layout.columns, width >= 1024 ? 4 : width >= 640 ? 3 : 2);
      assert.ok(layout.pageWidth <= width, `Page overflows at ${width}`);
      assert.ok(Math.abs(layout.artworkRatio - 16 / 9) < 0.04);
      assert.ok(layout.titleLines <= 2.05);
      assert.ok(layout.panelHidden);
      assert.equal(layout.h1, 1);
      assert.equal(layout.headingLevel, "H2");
      assert.ok(layout.placeholders >= 3);
      assert.ok(layout.tagCounts.every((count) => count <= 2));
      if (width < 640) assert.ok(layout.navScrollable);
      assert.equal(await cards(page).count(), 21);
      assert.ok(await cards(page).getByText("★ Featured", { exact: true }).count() >= 4);
      const name = `works-${width}-${theme}.png`;
      await capture(page, name);
      results.viewports.push({ width, theme, screenshot: name, ...layout });
    }
    // Exercise the same controls at every target viewport, including 320px.
    const viewportSearch = page.getByRole("searchbox", { name: "作品を検索" });
    await viewportSearch.fill("  POLARITY  ");
    assert.equal(await cards(page).count(), 1);
    assert.equal(await page.locator("#works-filters-panel").isVisible(), false);
    await viewportSearch.fill("");
    await page.getByRole("button", { name: /^フィルター$/ }).click();
    const platforms = page.locator("#works-filters-panel").getByRole("group", { name: /プラットフォーム/ });
    await platforms.getByRole("button", { name: "Web", exact: true }).click();
    assert.equal(await cards(page).count(), 16);
    await platforms.getByRole("button", { name: "PC", exact: true }).click();
    assert.equal(await cards(page).count(), 21);
    assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
    if (width === 320) await capture(page, "works-filters-320-dark.png");
    await page.getByRole("button", { name: "フィルター全解除", exact: true }).click();
    await page.getByRole("button", { name: /^フィルター$/ }).click();
    assert.equal(await page.locator("#works-filters-panel").isVisible(), false);
    results.interactions.push(`${width}px: search, collapsed panel, explicit toggle, platform OR, clearing and panel overflow passed`);
    await context.close();
  }

  const context = await browser.newContext({ viewport: { width: 1280, height: 900 }, reducedMotion: "reduce" });
  const page = await prepare(context);
  const search = page.getByRole("searchbox", { name: "作品を検索" });
  const sort = page.getByRole("combobox", { name: "並び順" });
  const toggle = page.getByRole("button", { name: /^フィルター$/ });
  const panel = page.locator("#works-filters-panel");
  await page.getByRole("button", { name: "ダークモードに切り替え" }).click();
  await page.waitForFunction(() => document.documentElement.classList.contains("dark"));
  await page.getByRole("button", { name: "ライトモードに切り替え" }).click();
  await page.waitForFunction(() => document.documentElement.classList.contains("light"));
  results.interactions.push("Theme toggle works in both directions; all saved-theme reloads have no hydration errors");
  await search.focus();
  await page.keyboard.press("Tab");
  assert.equal(await sort.evaluate((element) => element === document.activeElement), true);
  await page.keyboard.press("Tab");
  assert.equal(await toggle.evaluate((element) => element === document.activeElement), true);
  await page.keyboard.press("Tab");
  assert.equal(await page.locator('nav[aria-label="作品カテゴリへ移動"] a').first().evaluate((element) => element === document.activeElement), true);
  assert.ok(await page.locator('nav[aria-label="作品カテゴリへ移動"] a').first().evaluate((element) => parseFloat(getComputedStyle(element).outlineWidth) >= 2 && getComputedStyle(element).outlineStyle !== "none"));
  await panel.locator("button").first().evaluate((element) => element.focus());
  assert.equal(await panel.evaluate((element) => element.contains(document.activeElement)), false);
  results.interactions.push("Closed panel is hidden and inert; keyboard skips its buttons; controls have visible focus styles");

  await search.fill("  POLARITY  ");
  await page.getByRole("status").filter({ hasText: "1 件の作品" }).waitFor();
  assert.equal(await cards(page).count(), 1);
  await expectCategories(page, ["Unity Games"]);
  assert.equal(await toggle.getAttribute("aria-expanded"), "false");
  await search.fill("  whitespace search  ");
  await page.getByRole("status").filter({ hasText: "1 件の作品" }).waitFor();
  assert.ok((await cards(page).first().getAttribute("href")).includes("fixture-long-title"));
  await search.fill("");
  results.interactions.push("Title and description search trims whitespace; searching does not expand filters; empty categories disappear");

  await page.getByRole("button", { name: /^フィルター/ }).click();
  await panel.getByRole("button", { name: "Puzzle", exact: true }).click();
  await panel.getByRole("button", { name: "Physics", exact: true }).click();
  assert.equal(await cards(page).count(), 2);
  await panel.getByRole("button", { name: "PC", exact: true }).click();
  assert.equal(await cards(page).count(), 1);
  await panel.getByRole("group", { name: /プラットフォーム/ }).getByRole("button", { name: "Web", exact: true }).click();
  assert.equal(await cards(page).count(), 2);
  await page.getByRole("button", { name: /^フィルター\s*4/ }).click();
  assert.equal(await panel.isVisible(), false);
  assert.equal(await page.getByRole("group", { name: "選択中のフィルター" }).isVisible(), true);
  await capture(page, "works-active-filters-light.png");
  await page.getByRole("button", { name: "タグ Physics を解除", exact: true }).click();
  assert.ok(await cards(page).count() > 2);
  await page.getByRole("button", { name: "プラットフォーム PC を解除", exact: true }).click();
  assert.equal(await page.getByRole("button", { name: "プラットフォーム PC を解除", exact: true }).count(), 0);
  await search.fill("  POLARITY  ");
  await page.getByRole("button", { name: "フィルター全解除", exact: true }).click();
  assert.equal(await search.inputValue(), "  POLARITY  ");
  assert.equal(await cards(page).count(), 1);
  assert.equal(await panel.isVisible(), false);
  await search.fill("");
  results.interactions.push("Tag AND, platform OR and combined AND; chips remove individual selections while closed; clear filters preserves search");

  await page.getByRole("button", { name: /^フィルター$/ }).click();
  await panel.getByRole("button", { name: "PC", exact: true }).focus();
  await page.keyboard.press("Escape");
  assert.equal(await panel.isVisible(), false);
  assert.equal(await toggle.evaluate((element) => element === document.activeElement), true);
  results.interactions.push("Escape closes panel and returns focus to toggle");

  const defaultTitles = await titles(page);
  assert.equal(defaultTitles[0], "ZINTOROAD");
  assert.equal(defaultTitles[1], "Zulu Featured checkbox / Sample");
  await sort.selectOption("title-asc");
  assert.ok((await titles(page))[0].startsWith("Alpha"));
  await sort.selectOption("title-desc");
  assert.equal((await titles(page))[0], "Zulu Featured checkbox / Sample");
  await sort.selectOption("status");
  assert.equal((await titles(page))[0], "ZINTOROAD");
  assert.ok((await titles(page))[1].startsWith("Alpha"));
  assert.equal((await titles(page)).at(-1), "Zulu Featured checkbox / Sample");
  results.interactions.push("All four sort orders override Featured promotion as specified; checkbox-only and Status-only Featured are highlighted");

  await page.getByRole("button", { name: "ダークモードに切り替え" }).click();
  await search.fill("does-not-exist");
  await page.getByRole("heading", { name: "該当する作品がありません" }).waitFor();
  assert.equal(await sections(page).count(), 0);
  assert.equal(await page.getByRole("navigation", { name: "作品カテゴリへ移動" }).count(), 0);
  const emptyTheme = await page.evaluate(() => document.documentElement.classList.contains("dark") ? "dark" : "light");
  await capture(page, `works-empty-${emptyTheme}.png`);
  await page.getByRole("button", { name: "検索・絞り込みをリセット" }).click();
  assert.equal(await search.inputValue(), "");
  await expectCategories(page, categories);
  assert.equal(await search.evaluate((element) => element === document.activeElement), true);
  results.interactions.push("Zero results hide sections and nav; reset restores all works and focuses search");

  await page.getByRole("link", { name: "Developer Tools 3 件" }).click();
  await page.waitForFunction(() => location.hash === "#works-developer-tools");
  const jump = await page.evaluate(() => ({ heading: document.getElementById("works-developer-tools").getBoundingClientRect().top, header: document.querySelector(".site-header").getBoundingClientRect().bottom }));
  assert.ok(jump.heading >= jump.header, "Category heading hidden by fixed header");
  await page.locator('a[href="/works/github-railway-map"]').click();
  await page.waitForURL("**/works/github-railway-map");
  assert.equal(await page.getByRole("heading", { level: 1, name: "Github-Railway-Map" }).isVisible(), true);
  results.interactions.push("Category jump clears fixed header; entire card navigates to existing detail route");
  await context.close();

  const touchContext = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, reducedMotion: "reduce" });
  const touch = await prepare(touchContext);
  await touch.getByRole("button", { name: /^フィルター$/ }).tap();
  await touch.locator("#works-filters-panel").getByRole("button", { name: "Sample", exact: true }).tap();
  await touch.getByRole("button", { name: /^フィルター\s*1/ }).tap();
  await capture(touch, "works-mobile-filters-light.png");
  await touch.getByRole("button", { name: "タグ Sample を解除" }).tap();
  assert.equal(await cards(touch).count(), 21);
  const nav = touch.getByRole("navigation", { name: "作品カテゴリへ移動" });
  await nav.evaluate((element) => { element.scrollLeft = element.scrollWidth; });
  await nav.getByRole("link", { name: "Other / 未分類 2 件" }).tap();
  const touchJump = await touch.evaluate(() => ({ heading: document.getElementById("works-other").getBoundingClientRect().top, header: document.querySelector(".site-header").getBoundingClientRect().bottom }));
  assert.ok(touchJump.heading >= touchJump.header);
  await touch.locator('a[href="/works/rogue-lycan"]').tap();
  await touch.waitForURL("**/works/rogue-lycan");
  results.interactions.push("390px touch: open, select, close, remove chip, horizontally scroll nav, jump and open card");
  await touchContext.close();
  assert.deepEqual(results.pageErrors, []);
  results.status = "PASS";
} catch (error) {
  results.status = "FAIL";
  results.error = error.stack;
  throw error;
} finally {
  await writeFile(resolve(output, "browser-results.json"), JSON.stringify(results, null, 2) + "\n");
  await browser.close();
  console.log(JSON.stringify({ status: results.status, screenshots: results.viewports.length, interactions: results.interactions, error: results.error }, null, 2));
}
