import { WORK_CATEGORIES, type Work, type WorkCategory } from "../types/notion";

export type SortOption = "default" | "title-asc" | "title-desc" | "status";

export function normalizeCategory(value: string | null | undefined): WorkCategory {
  return WORK_CATEGORIES.find((category) => category === value) ?? "Other";
}

export function isFeaturedWork(work: Work): boolean {
  return work.featured || work.status === "Featured";
}

export function filterWorks(
  works: readonly Work[],
  search: string,
  tags: ReadonlySet<string>,
  platforms: ReadonlySet<string>,
): Work[] {
  const query = search.trim().toLocaleLowerCase("ja");
  return works.filter((work) =>
    (!query || work.title.toLocaleLowerCase("ja").includes(query) ||
      work.description.toLocaleLowerCase("ja").includes(query)) &&
    Array.from(tags).every((tag) => work.tags.includes(tag)) &&
    (platforms.size === 0 || Array.from(platforms).some((platform) => work.platforms.includes(platform))),
  );
}

export function sortWorks(works: readonly Work[], sort: SortOption): Work[] {
  const byTitle = (a: Work, b: Work) => a.title.localeCompare(b.title, "ja");
  const statusOrder = { Featured: 0, Latest: 1, Released: 2 };
  return [...works].sort((a, b) => {
    if (sort === "title-asc") return byTitle(a, b);
    if (sort === "title-desc") return byTitle(b, a);
    if (sort === "status") return statusOrder[a.status] - statusOrder[b.status] || byTitle(a, b);
    return Number(isFeaturedWork(b)) - Number(isFeaturedWork(a)) || byTitle(a, b);
  });
}

export function groupWorks(works: readonly Work[]) {
  const categories: WorkCategory[] = [...WORK_CATEGORIES, "Other"];
  return categories.map((category, index) => ({
    category,
    label: category === "Other" ? "Other / 未分類" : category,
    id: `works-${category.toLowerCase().replaceAll(" ", "-")}`,
    number: String(index + 1).padStart(2, "0"),
    works: works.filter((work) => normalizeCategory(work.category) === category),
  })).filter((group) => group.works.length > 0);
}
