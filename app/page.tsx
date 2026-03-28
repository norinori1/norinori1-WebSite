import { listFeaturedWorks } from "@/lib/notion/works";
import HomeContent from "@/components/HomeContent";

export const revalidate = 3600;

export default async function Home() {
  let featuredWorks: Awaited<ReturnType<typeof listFeaturedWorks>> = [];
  let fetchError = false;

  try {
    featuredWorks = await listFeaturedWorks();
  } catch {
    fetchError = true;
  }

  return <HomeContent featuredWorks={featuredWorks} fetchError={fetchError} />;
}
