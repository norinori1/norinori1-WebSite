import assert from "node:assert/strict";
import { WORK_CATEGORIES, type Work } from "../types/notion";
import { filterWorks, sortWorks, groupWorks, normalizeCategory, isFeaturedWork } from "./works-gallery";

function work(title: string, overrides: Partial<Work> = {}): Work {
  return { id: title, title, slug: title, description: "遊べる Puzzle ゲーム", link: "", status: "Released",
    tags: ["Puzzle", "Physics"], platforms: ["Web"], thumbnailUrl: null, featured: false,
    category: "Unity Games", ...overrides };
}

const fixtures = [
  work("Zulu", { featured: true }),
  work("Bravo", { status: "Featured", tags: ["Puzzle"], category: "Scratch Games" }),
  work("Alpha", { status: "Latest", platforms: ["PC"], category: "Developer Tools" }),
  work("Charlie", { tags: ["Action"], platforms: ["Android"], category: "Other" }),
];
const titles = (works: Work[]) => works.map((item) => item.title);
const empty = new Set<string>();
assert.equal(normalizeCategory(undefined), "Other");
assert.equal(normalizeCategory(null), "Other");
assert.equal(normalizeCategory("Unknown"), "Other");
for (const category of WORK_CATEGORIES) assert.equal(normalizeCategory(category), category);
assert.deepEqual(titles(filterWorks(fixtures, "  ALPHA  ", empty, empty)), ["Alpha"]);
assert.equal(filterWorks(fixtures, " 遊べる ", empty, empty).length, 4);
assert.equal(filterWorks(fixtures, "   ", empty, empty).length, 4);
assert.deepEqual(titles(filterWorks(fixtures, "", new Set(["Puzzle", "Physics"]), empty)), ["Zulu", "Alpha"]);
assert.deepEqual(titles(filterWorks(fixtures, "", empty, new Set(["Web", "PC"]))), ["Zulu", "Bravo", "Alpha"]);
assert.deepEqual(titles(filterWorks(fixtures, "", new Set(["Puzzle", "Physics"]), new Set(["Web", "PC"]))), ["Zulu", "Alpha"]);
assert.deepEqual(titles(filterWorks(fixtures, " alpha ", new Set(["Puzzle", "Physics"]), new Set(["PC", "Android"]))), ["Alpha"]);
assert.equal(filterWorks(fixtures, "missing", empty, empty).length, 0);
assert.equal(filterWorks(fixtures, "", new Set(["Puzzle", "Action"]), empty).length, 0);
assert.deepEqual(titles(sortWorks(fixtures, "default")), ["Bravo", "Zulu", "Alpha", "Charlie"]);
assert.deepEqual(titles(sortWorks(fixtures, "title-asc")), ["Alpha", "Bravo", "Charlie", "Zulu"]);
assert.deepEqual(titles(sortWorks(fixtures, "title-desc")), ["Zulu", "Charlie", "Bravo", "Alpha"]);
assert.deepEqual(titles(sortWorks(fixtures, "status")), ["Bravo", "Alpha", "Charlie", "Zulu"]);
assert.deepEqual(titles(fixtures), ["Zulu", "Bravo", "Alpha", "Charlie"]);
assert.equal(isFeaturedWork(fixtures[0]), true);
assert.equal(isFeaturedWork(fixtures[1]), true);
assert.equal(isFeaturedWork(fixtures[2]), false);
const allCategories = [...WORK_CATEGORIES, "Other" as const];
const groups = groupWorks(allCategories.map((category) => work(category, { category })).reverse());
assert.deepEqual(groups.map((group) => group.category), allCategories);
assert.equal(new Set(groups.map((group) => group.id)).size, 8);
assert.equal(groups.at(-1)?.label, "Other / 未分類");
assert.equal(groups.flatMap((group) => group.works).length, 8);
assert.deepEqual(groupWorks(filterWorks(fixtures, "Bravo", empty, empty)).map((group) => group.category), ["Scratch Games"]);
assert.deepEqual(groupWorks([]), []);
assert.deepEqual(groupWorks([work("Unclassified", { category: "Future Category" as Work["category"] })]).map((group) => group.category), ["Other"]);
assert.equal(groupWorks(sortWorks(fixtures, "title-asc"))[0].works[0].title, "Zulu");
console.log("Works gallery: categories, search, tag AND / platform OR, ordering, Featured and empty results passed.");
