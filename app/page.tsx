import { listFeaturedWorks } from "@/lib/notion/works";
import { listNews } from "@/lib/notion/news";
import HomeContent from "@/components/HomeContent";
import type { NewsItem } from "@/types/notion";

export const revalidate = 3600;

export default async function Home() {
  let featuredWorks: Awaited<ReturnType<typeof listFeaturedWorks>> = [];
  let recentNews: NewsItem[] = [];
  let fetchError = false;

  try {
    [featuredWorks, recentNews] = await Promise.all([
      listFeaturedWorks(),
      listNews(),
    ]);
    recentNews = recentNews.slice(0, 3);
  } catch {
    fetchError = true;
  }

  return <HomeContent featuredWorks={featuredWorks} recentNews={recentNews} fetchError={fetchError} />;
}
