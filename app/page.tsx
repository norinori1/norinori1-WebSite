import { listFeaturedWorks } from "@/lib/notion/works";
import HomeContent from "@/components/HomeContent";

export const revalidate = 3600;

export default async function Home() {
  let featuredWorks: Awaited<ReturnType<typeof listFeaturedWorks>> = [];

  try {
    featuredWorks = await listFeaturedWorks();
  } catch {
    // Silently fall back to empty list on the home page
  }

  return <HomeContent featuredWorks={featuredWorks} />;
}
