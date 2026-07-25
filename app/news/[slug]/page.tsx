import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import Script from "next/script";
import { getNewsBySlug, listNewsSlugs, listNews } from "@/lib/notion/news";
import NotionBlocks from "@/components/NotionBlocks";
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
    const slugs = await listNewsSlugs();
    return slugs.map((slug) => ({ slug }));
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  try {
    const result = await getNewsBySlug(slug);
    if (!result) return {};
    const { news } = result;
    const canonicalUrl = `/news/${slug}`;
    // Use the proxy URL for OG/Twitter images so they never hit an expired S3 URL.
    const coverProxyUrl = news.coverImageUrl
      ? `${siteUrl}/api/notion-image?pageId=${news.id}&prop=CoverImage`
      : undefined;
    const ogImages = coverProxyUrl
      ? [{ url: coverProxyUrl, alt: news.title }]
      : undefined;
    return {
      title: `${news.title} – norinori1`,
      description: news.excerpt,
      alternates: { canonical: canonicalUrl },
      openGraph: {
        title: news.title,
        description: news.excerpt ?? undefined,
        url: canonicalUrl,
        type: "article",
        images: ogImages,
        ...(news.date && { publishedTime: news.date }),
      },
      twitter: {
        card: "summary_large_image",
        title: news.title,
        description: news.excerpt ?? undefined,
        images: coverProxyUrl ? [coverProxyUrl] : undefined,
      },
    };
  } catch {
    return {};
  }
}

function formatDate(dateStr: string): string {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  return d.toLocaleDateString("ja-JP", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default async function NewsDetailPage({ params }: Props) {
  const { slug } = await params;

  let result: Awaited<ReturnType<typeof getNewsBySlug>> = null;
  try {
    result = await getNewsBySlug(slug);
  } catch {
    notFound();
  }

  if (!result) {
    notFound();
  }

  const { news, blocks } = result;

  let otherNews: Awaited<ReturnType<typeof listNews>> = [];
  try {
    const allNews = await listNews();
    otherNews = allNews.filter((n) => n.slug !== slug).slice(0, 3);
  } catch {
    // otherNews stays empty
  }

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: news.title,
    url: `${siteUrl}/news/${slug}`,
    ...(news.coverImageUrl && {
      image: `${siteUrl}/api/notion-image?pageId=${news.id}&prop=CoverImage`,
    }),
    ...(news.excerpt && { description: news.excerpt }),
    ...(news.date && { datePublished: news.date }),
    author: {
      "@type": "Person",
      name: "norinori1",
      url: siteUrl,
    },
  };

  return (
    <main className="site-root">
      <Script
        id="schema-news"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData).replace(/</g, "\\u003c"),
        }}
      />
      <SiteHeader />

      {news.coverImageUrl ? (
        <header className="article-hero">
          <Image
            src={`/api/notion-image?pageId=${news.id}&prop=CoverImage`}
            alt=""
            aria-hidden="true"
            fill
            sizes="100vw"
            priority
            unoptimized
          />
          <div className="container article-hero-copy">
            {news.date && <p className="article-meta">{formatDate(news.date)}</p>}
            <h1>{news.title}</h1>
          </div>
        </header>
      ) : (
        <header className="container article-header">
          <Link href="/news" className="back-link">
            <UIIcon name="arrowLeft" size={14} />
            News 一覧
          </Link>
          <h1>{news.title}</h1>
          {news.date && <p className="article-meta">{formatDate(news.date)}</p>}
        </header>
      )}

      <section className="section">
        <div className="container">
          {news.coverImageUrl && (
            <Link href="/news" className="back-link">
              <UIIcon name="arrowLeft" size={14} />
              News 一覧
            </Link>
          )}

          <div className="article-body">
            {news.excerpt && <p className="section-lead">{news.excerpt}</p>}

            {news.tags.length > 0 && (
              <div className="chips" style={{ marginTop: "var(--space-5)" }}>
                {news.tags.map((tag) => (
                  <span key={tag} className="chip">
                    {tag}
                  </span>
                ))}
              </div>
            )}

            <div style={{ marginTop: "var(--space-6)" }}>
              <ShareButtons title={news.title} url={`${siteUrl}/news/${slug}`} />
            </div>

            {blocks.length > 0 && (
              <>
                <hr className="divider" />
                <NotionBlocks blocks={blocks} />
              </>
            )}
          </div>
        </div>
      </section>

      {otherNews.length > 0 && (
        <section className="section section-alt">
          <div className="container">
            <div className="section-head-row">
              <div className="section-head">
                <p className="section-eyebrow label is-drawn">More</p>
                <h2>ほかのお知らせ</h2>
              </div>
              <Link href="/news" className="link-arrow">
                すべてのお知らせ
                <UIIcon name="arrowRight" size={16} />
              </Link>
            </div>

            <div className="card-grid">
              {otherNews.map((n) => (
                <article key={n.id} className="work-card">
                  {n.coverImageUrl && (
                    <Thumbnail
                      src={`/api/notion-image?pageId=${n.id}&prop=CoverImage`}
                      alt={`${n.title} のカバー画像`}
                      sizes="(max-width: 640px) calc(100vw - 2.5rem), 280px"
                    />
                  )}
                  <div className="work-body">
                    <h3 className="card-title">
                      <Link href={`/news/${n.slug}`} className="stretch-link">
                        {n.title}
                      </Link>
                    </h3>
                    {n.date && <p className="card-date">{formatDate(n.date)}</p>}
                    {n.excerpt && <p className="work-desc">{n.excerpt}</p>}
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}

      <SiteFooter />
    </main>
  );
}
