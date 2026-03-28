import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import Script from "next/script";
import { getNewsBySlug, listNewsSlugs } from "@/lib/notion/news";
import NotionBlocks from "@/components/NotionBlocks";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import ShareButtons from "@/components/ShareButtons";

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
    const ogImages = news.coverImageUrl
      ? [{ url: news.coverImageUrl, alt: news.title }]
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
        images: news.coverImageUrl ? [news.coverImageUrl] : undefined,
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

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: news.title,
    url: `${siteUrl}/news/${slug}`,
    ...(news.coverImageUrl && { image: news.coverImageUrl }),
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
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <SiteHeader />

      <div style={{ paddingTop: "64px" }}>
        <section className="section">
          <div className="container" style={{ maxWidth: "860px" }}>
            <Link
              href="/news"
              style={{
                color: "var(--color-neutral-500)",
                textDecoration: "none",
                fontSize: "0.9rem",
              }}
            >
              ← News 一覧に戻る
            </Link>

            {news.coverImageUrl && (
              <div
                style={{
                  marginTop: "1.5rem",
                  borderRadius: "12px",
                  overflow: "hidden",
                  aspectRatio: "16/9",
                  position: "relative",
                  maxHeight: "400px",
                }}
              >
                <Image
                  src={news.coverImageUrl}
                  alt={`${news.title} cover`}
                  fill
                  sizes="(max-width: 860px) calc(100vw - 2rem), 860px"
                  style={{ objectFit: "cover" }}
                  priority
                />
              </div>
            )}

            <div style={{ marginTop: "1.5rem" }}>
              <h1
                style={{
                  margin: 0,
                  fontSize: "clamp(1.75rem, 3.5vw, 2.5rem)",
                }}
              >
                {news.title}
              </h1>

              {news.date && (
                <p
                  style={{
                    marginTop: "0.5rem",
                    fontSize: "0.9rem",
                    color: "var(--color-neutral-500)",
                  }}
                >
                  {formatDate(news.date)}
                </p>
              )}

              {news.excerpt && (
                <p
                  style={{
                    marginTop: "0.75rem",
                    color: "var(--color-neutral-700)",
                    lineHeight: "1.8",
                  }}
                >
                  {news.excerpt}
                </p>
              )}

              <div style={{ marginTop: "1rem", display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
                {news.tags.map((tag) => (
                  <span key={tag} className="chip">
                    {tag}
                  </span>
                ))}
              </div>

              <ShareButtons
                title={news.title}
                url={`${siteUrl}/news/${slug}`}
              />
            </div>

            {blocks.length > 0 && (
              <div style={{ marginTop: "2.5rem" }}>
                <NotionBlocks blocks={blocks} />
              </div>
            )}
          </div>
        </section>
      </div>

      <SiteFooter />
    </main>
  );
}
