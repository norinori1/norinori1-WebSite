import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Script from "next/script";
import { getWorkBySlug, listWorkSlugs, listWorks } from "@/lib/notion/works";
import NotionBlocks from "@/components/NotionBlocks";
import { getWorkLinks, safeWorkUrl, workAction } from "@/lib/work-links";
import { splitWorkSections, hasSectionContent, WORK_TABS } from "@/lib/work-sections";
import { groupWorks } from "@/lib/works-gallery";
import WorkTabs from "@/components/WorkTabs";
import WorkIntro from "@/components/WorkIntro";
import WorkCard from "@/components/WorkCard";
import PlatformIcon from "@/components/PlatformIcon";
import styles from "@/components/WorkDetail.module.css";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import ShareButtons from "@/components/ShareButtons";
import Thumbnail from "@/components/Thumbnail";
import { UIIcon } from "@/components/PlatformIcon";

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://norinori1.vercel.app";

export const revalidate = 3600;

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  try {
    const slugs = await listWorkSlugs();
    return slugs.map((slug) => ({ slug }));
  } catch {
    return [];
  }
}
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  try {
    const result = await getWorkBySlug(slug);
    if (!result) return {};
    const { work } = result;
    const canonicalUrl = `/works/${slug}`;
    // Use the proxy URL for OG/Twitter images so they never hit an expired S3 URL.
    const thumbnailProxyUrl = work.thumbnailUrl
      ? `${siteUrl}/api/notion-image?pageId=${work.id}&prop=Thumbnail`
      : undefined;
    const ogImages = thumbnailProxyUrl
      ? [{ url: thumbnailProxyUrl, alt: work.title }]
      : undefined;
    return {
      title: `${work.title} – norinori1`,
      description: work.description,
      alternates: { canonical: canonicalUrl },
      openGraph: {
        title: work.title,
        description: work.description ?? undefined,
        url: canonicalUrl,
        type: "article",
        images: ogImages,
      },
      twitter: {
        card: "summary_large_image",
        title: work.title,
        description: work.description ?? undefined,
        images: thumbnailProxyUrl ? [thumbnailProxyUrl] : undefined,
      },
    };
  } catch {
    return {};
  }
}

export default async function WorkDetailPage({ params }: Props) {
  const { slug } = await params;
  let result: Awaited<ReturnType<typeof getWorkBySlug>> = null;
  try { result = await getWorkBySlug(slug); } catch { notFound(); }
  if (!result) notFound();
  const { work, blocks } = result;
  const sections = splitWorkSections(blocks);
  const links = getWorkLinks(work);
  const repository = safeWorkUrl(work.repository);
  const hasTechMetadata = work.engines.length > 0 || Boolean(repository);
  const available = WORK_TABS.filter((tab) => tab.id === "intro" || hasSectionContent(sections[tab.id]) || (tab.id === "tech" && hasTechMetadata));
  const category = groupWorks([work])[0];
  let otherWorks: Awaited<ReturnType<typeof listWorks>> = [];
  try {
    const candidates = (await listWorks()).filter((item) => item.id !== work.id && item.slug !== slug);
    otherWorks = [...candidates.filter((item) => item.category === work.category),
      ...candidates.filter((item) => item.category !== work.category)].slice(0, 4);
  } catch { /* Related works are optional. */ }
  const structuredData = {
    "@context": "https://schema.org", "@type": "SoftwareApplication", name: work.title,
    url: `${siteUrl}/works/${slug}`,
    ...(work.thumbnailUrl && { image: `${siteUrl}/api/notion-image?pageId=${work.id}&prop=Thumbnail` }),
    ...(work.description && { description: work.description }),
    author: { "@type": "Person", name: "norinori1", url: siteUrl },
    ...(links.length > 0 && { sameAs: links.map((link) => link.href) }),
    applicationCategory: "Game",
  };
  const action = workAction(work.category);
  return (
    <main className="site-root">
      <Script id="schema-work" type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData).replace(/</g, "\\u003c") }} />
      <SiteHeader />
      <header className={`container ${styles.hero}`}>
        <nav aria-label="パンくず" className={styles.back}>
          <Link href="/works"><UIIcon name="arrowLeft" size={14} /> Works</Link>
          <span aria-hidden="true">/</span>
          <Link href={`/works#${category.id}`}>{category.label}</Link>
        </nav>
        <div className={styles.heroGrid}>
          <div className={styles.visual}>
            {work.thumbnailUrl ? <Thumbnail src={`/api/notion-image?pageId=${work.id}&prop=Thumbnail`}
              alt={`${work.title} のキービジュアル`} sizes="(min-width: 900px) 55vw, 95vw" /> :
              <div className={styles.placeholder} aria-label="作品画像は未登録">
                <UIIcon name="hexArrowRight" size={56} strokeWidth={1} /><span>WORKS</span>
              </div>}
          </div>
          <div className={styles.summary}>
            <span className={`badge badge-${work.status.toLowerCase()}`}>{work.status}</span>
            <h1>{work.title}</h1>
            {work.description && <p className={styles.description}>{work.description}</p>}
            <div className={styles.chips}>{work.platforms.map((platform) => <span key={platform} className={styles.chip}>{platform}</span>)}</div>
            <div className={styles.chips}>{work.tags.slice(0, 3).map((tag) => <span key={tag} className={styles.chip}>{tag}</span>)}</div>
            {links.length > 0 && <div className={styles.actions} aria-label="作品へのリンク">
              {links.map((link, index) => {
                const button = <a key={link.href} href={link.href} target="_blank" rel="noopener noreferrer"
                  className={`${styles.action}${index === 0 ? ` ${styles.primary}` : ""}`}>
                  <span aria-hidden="true">{link.icon.kind === "platform" ?
                    <PlatformIcon name={link.icon.name} size={20} /> : <UIIcon name={link.icon.name} size={20} />}</span>
                  <span>{action}<small style={{ display: "block", fontWeight: 400 }}>{link.service}</small></span>
                  <UIIcon name="arrowUpRight" size={18} />
                </a>;
                return index === 0 ? button : <div key={link.href} className={styles.secondary}>{button}</div>;
              })}
            </div>}
            <div className={styles.share}><span className="label">Share</span>
              <ShareButtons title={work.title} url={`${siteUrl}/works/${slug}`} />
            </div>
          </div>
        </div>
      </header>
      <div className="container">
        <WorkTabs key={slug} sections={available.map((tab) => ({
          ...tab, content: <>
            {tab.id === "tech" && hasTechMetadata && !hasSectionContent(sections.tech) && <div className={styles.techMeta}>
              {work.engines.length > 0 && <><h3>使用技術</h3><p>{work.engines.join(" / ")}</p></>}
              {repository && <p><a href={repository} target="_blank" rel="noopener noreferrer">ソースコード・リポジトリ <UIIcon name="arrowUpRight" size={14} /></a></p>}
            </div>}
            {tab.id === "intro" ? <WorkIntro blocks={sections.intro} /> : <NotionBlocks blocks={sections[tab.id]} />}
          </>,
        }))} />
      </div>
      {otherWorks.length > 0 && <section className="section section-alt">
        <div className="container">
          <div className="section-head-row">
            <div className="section-head"><p className="section-eyebrow label is-drawn">More</p><h2>ほかの作品</h2></div>
            <Link href="/works" className="link-arrow">すべての作品 <UIIcon name="arrowRight" size={16} /></Link>
          </div>
          <div className={styles.related}>{otherWorks.map((item) => <WorkCard key={item.id} work={item} />)}</div>
        </div>
      </section>}
      <SiteFooter />
    </main>
  );
}
