import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import Script from "next/script";
import { getWorkBySlug, listWorkSlugs, listWorks } from "@/lib/notion/works";
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
  try {
    result = await getWorkBySlug(slug);
  } catch {
    notFound();
  }

  if (!result) {
    notFound();
  }

  const { work, blocks } = result;

  let otherWorks: Awaited<ReturnType<typeof listWorks>> = [];
  try {
    const allWorks = await listWorks();
    otherWorks = allWorks.filter((w) => w.slug !== slug).slice(0, 4);
  } catch {
    // otherWorks stays empty
  }

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: work.title,
    url: `${siteUrl}/works/${slug}`,
    ...(work.thumbnailUrl && {
      image: `${siteUrl}/api/notion-image?pageId=${work.id}&prop=Thumbnail`,
    }),
    ...(work.description && { description: work.description }),
    author: {
      "@type": "Person",
      name: "norinori1",
      url: siteUrl,
    },
    ...(work.link && { sameAs: work.link }),
    applicationCategory: "Game",
  };

  return (
    <main className="site-root">
      <Script
        id="schema-work"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <SiteHeader />

      <div style={{ paddingTop: "64px" }}>
        <section className="section">
          <div className="container" style={{ maxWidth: "860px" }}>
            <Link
              href="/works"
              style={{
                color: "var(--color-neutral-500)",
                textDecoration: "none",
                fontSize: "0.9rem",
              }}
            >
              ← Works 一覧に戻る
            </Link>

            {work.thumbnailUrl && (
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
                  src={`/api/notion-image?pageId=${work.id}&prop=Thumbnail`}
                  alt={`${work.title} thumbnail`}
                  fill
                  sizes="(max-width: 860px) calc(100vw - 2rem), 860px"
                  style={{ objectFit: "cover" }}
                  priority
                  unoptimized
                />
              </div>
            )}

            <div style={{ marginTop: "1.5rem" }}>
              <div
                style={{ display: "flex", alignItems: "center", gap: "0.75rem", flexWrap: "wrap" }}
              >
                <h1
                  style={{
                    margin: 0,
                    fontSize: "clamp(1.75rem, 3.5vw, 2.5rem)",
                  }}
                >
                  {work.title}
                </h1>
                <span className={`badge badge-${work.status.toLowerCase()}`}>
                  {work.status}
                </span>
              </div>

              {work.description && (
                <p
                  style={{
                    marginTop: "0.75rem",
                    color: "var(--color-neutral-700)",
                    lineHeight: "1.8",
                  }}
                >
                  {work.description}
                </p>
              )}

              <div style={{ marginTop: "1rem", display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
                {work.tags.map((tag) => (
                  <span key={tag} className="chip">
                    {tag}
                  </span>
                ))}
                {work.platforms.map((platform) => (
                  <span key={platform} className="chip platform-chip">
                    {platform}
                  </span>
                ))}
              </div>

              <ShareButtons
                title={work.title}
                url={`${process.env.NEXT_PUBLIC_SITE_URL ?? "https://norinori1.vercel.app"}/works/${slug}`}
              />

              {work.link && (
                <a
                  href={work.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-primary"
                  style={{
                    display: "inline-block",
                    marginTop: "1.25rem",
                    background: "var(--color-primary)",
                    color: "#fff",
                    border: "none",
                  }}
                >
                  Play / Visit ↗
                </a>
              )}
            </div>

            {blocks.length > 0 && (
              <div style={{ marginTop: "2.5rem" }}>
                <NotionBlocks blocks={blocks} />
              </div>
            )}
          </div>
        </section>

        {otherWorks.length > 0 && (
          <section className="section section-alt">
            <div className="container">
              <h2 style={{ fontSize: "1.5rem", marginBottom: "1.5rem" }}>Other Works</h2>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
                  gap: "1.25rem",
                }}
              >
                {otherWorks.map((w) => (
                  <Link
                    key={w.id}
                    href={`/works/${w.slug}`}
                    style={{ textDecoration: "none", color: "inherit" }}
                  >
                    <article className="work-card" style={{ height: "100%" }}>
                      {w.thumbnailUrl && (
                        <div
                          style={{
                            marginBottom: "0.75rem",
                            borderRadius: "8px",
                            overflow: "hidden",
                            aspectRatio: "16/9",
                            position: "relative",
                          }}
                        >
                          <Image
                            src={`/api/notion-image?pageId=${w.id}&prop=Thumbnail`}
                            alt={`${w.title} thumbnail`}
                            fill
                            sizes="(max-width: 640px) calc(50vw - 1.5rem), 220px"
                            style={{ objectFit: "cover" }}
                            unoptimized
                          />
                        </div>
                      )}
                      <div className="work-head">
                        <h3 style={{ fontSize: "0.95rem", margin: 0 }}>{w.title}</h3>
                        <span className={`badge badge-${w.status.toLowerCase()}`}>
                          {w.status}
                        </span>
                      </div>
                      {w.description && (
                        <p
                          style={{
                            margin: "0.4rem 0 0",
                            fontSize: "0.85rem",
                            color: "var(--color-neutral-600)",
                            overflow: "hidden",
                            display: "-webkit-box",
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: "vertical",
                          }}
                        >
                          {w.description}
                        </p>
                      )}
                    </article>
                  </Link>
                ))}
              </div>
              <div style={{ marginTop: "1.5rem" }}>
                <Link
                  href="/works"
                  style={{ color: "var(--color-primary)", textDecoration: "none", fontSize: "0.95rem" }}
                >
                  ← Works 一覧をすべて見る
                </Link>
              </div>
            </div>
          </section>
        )}
      </div>

      <SiteFooter />
    </main>
  );
}