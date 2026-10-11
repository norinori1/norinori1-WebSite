import assert from "node:assert/strict";
import { getNotionClient } from "./client";
import { listWorks, listFeaturedWorks, listWorkSlugs } from "./works";
import type { QueryDataSourceParameters, QueryDataSourceResponse } from "@notionhq/client/build/src/api-endpoints";

async function runTests() {
  // Stub the SDK boundaries only: execute the real listing, pagination and mapping.
  const previousToken = process.env.NOTION_TOKEN;
  const previousDb = process.env.NOTION_GAMES_DB;
  process.env.NOTION_TOKEN = "local-test-only";
  process.env.NOTION_GAMES_DB = "local-test-database";
  const client = getNotionClient();
  const originalRetrieve = client.databases.retrieve;
  const originalQuery = client.dataSources.query;
  const calls: QueryDataSourceParameters[] = [];
  let failSecondPage = false;
  try {
    client.databases.retrieve = (async () => ({ data_sources: [{ id: "test-source" }] })) as unknown as typeof originalRetrieve;
    client.dataSources.query = async (args) => {
      calls.push(args);
      const offset = args.start_cursor === "page-2" ? 100 : args.start_cursor === "page-3" ? 200 : 0;
      if (failSecondPage && offset === 100) throw new Error("Second-page API failure");
      const length = offset === 200 ? 5 : 100;
      return {
        object: "list", has_more: offset < 200, next_cursor: offset === 0 ? "page-2" : offset === 100 ? "page-3" : null,
        results: Array.from({ length }, (_, index) => {
          const number = offset + index;
          const category = number === 0 ? undefined : number === 1 ? "Future Category" : "Unity Games";
          return { object: "page", id: String(number), url: `https://www.notion.so/test-${number}`, properties: {
            Title: { type: "title", title: [{ plain_text: `Work ${number}` }] },
            Slug: { type: "rich_text", rich_text: [{ plain_text: number === 204 ? "" : `work-${number}` }] },
            Status: { type: "select", select: { name: "Released" } },
            ...(number === 2 ? {
              "Additional Links": { type: "rich_text", rich_text: [{ plain_text: "https://a.example\n" }, { plain_text: "https://b.example" }] },
              Engines: { type: "multi_select", multi_select: [{ name: "Unity" }] },
              Repository: { type: "url", url: "https://github.com/test/project" },
            } : {}),
            ...(number === 3 ? {
              "Additional Links": { type: "rich_text", rich_text: [
                { type: "text", plain_text: "Game Parade", href: "https://gameparade.creators-guild.com/works/legacy-2380/" },
                { type: "text", plain_text: "\n\n" },
                { type: "text", plain_text: "unityroom DEMO", href: "https://unityroom.com/games/zintoroad-beta" },
              ] },
            } : {}),
            ...(category ? { Category: { type: "select", select: { name: category } } } : {}),
          } };
        }),
      } as unknown as QueryDataSourceResponse;
    };
    const works = await listWorks();
    assert.equal(works.length, 204);
    assert.equal(new Set(works.map((work) => work.slug)).size, 204);
    assert.equal(works[200].slug, "work-200");
    assert.equal(works[0].category, "Other");
    assert.equal(works[1].category, "Other");
    assert.equal(works[2].category, "Unity Games");
    assert.deepEqual(works[0].additionalLinks, []);
    assert.deepEqual(works[0].engines, []);
    assert.equal(works[0].repository, "");
    assert.deepEqual(works[2].additionalLinks, ["https://a.example", "https://b.example"]);
    assert.deepEqual(works[3].additionalLinks, [
      "https://gameparade.creators-guild.com/works/legacy-2380/",
      "https://unityroom.com/games/zintoroad-beta",
    ]);
    assert.deepEqual(works[2].engines, ["Unity"]);
    assert.equal(works[2].repository, "https://github.com/test/project");
    assert.deepEqual(calls.map((call) => call.start_cursor), [undefined, "page-2", "page-3"]);
    assert.ok(calls.every((call) => call.data_source_id === "test-source" && call.filter && call.sorts));
    calls.length = 0;
    assert.equal((await listFeaturedWorks()).length, 204);
    assert.equal(calls.length, 3);
    assert.deepEqual(calls[0].filter, { property: "Status", select: { equals: "Featured" } });
    assert.equal((await listWorkSlugs()).length, 204);
    failSecondPage = true;
    await assert.rejects(listWorks(), /Second-page API failure/);
    console.log("Notion Works: 205 rows across 3 pages, mapping, missing slug, Featured listing, slugs and failure propagation passed.");
  } finally {
    client.databases.retrieve = originalRetrieve;
    client.dataSources.query = originalQuery;
    if (previousToken === undefined) delete process.env.NOTION_TOKEN;
    else process.env.NOTION_TOKEN = previousToken;
    if (previousDb === undefined) delete process.env.NOTION_GAMES_DB;
    else process.env.NOTION_GAMES_DB = previousDb;
  }
}

runTests().catch((error) => { console.error(error); process.exitCode = 1; });
