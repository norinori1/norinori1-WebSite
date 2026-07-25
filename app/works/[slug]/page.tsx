import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import Script from "next/script";
import { getWorkBySlug, listWorkSlugs, listWorks } from "@/lib/notion/works";
import NotionBlocks from "@/components/NotionBlocks";
import { sanitizeUrl } from "@/lib/security";
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
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData).replace(/</g, "\\u003c"),
        }}
      />
      <SiteHeader />

      {work.thumbnailUrl ? (
        <header className="article-hero">
          <Image
            src={`/api/notion-image?pageId=${work.id}&prop=Thumbnail`}
            alt=""
            aria-hidden="true"
            fill
            sizes="100vw"
            priority
            unoptimized
          />
          <div className="container article-hero-copy">
            <p className="article-meta">
              <span className={`badge badge-${work.status.toLowerCase()}`}>{work.status}</span>
              {work.platforms.join(" / ")}
            </p>
            <h1>{work.title}</h1>
          </div>
        </header>
      ) : (
        <header className="container article-header">
          <Link href="/works" className="back-link">
            <UIIcon name="arrowLeft" size={14} />
            Works 一覧
          </Link>
          <h1>{work.title}</h1>
          <p className="article-meta">
            <span className={`badge badge-${work.status.toLowerCase()}`}>{work.status}</span>
            {work.platforms.join(" / ")}
          </p>
        </header>
      )}

      <section className="section">
        <div className="container">
          {work.thumbnailUrl && (
            <Link href="/works" className="back-link">
              <UIIcon name="arrowLeft" size={14} />
              Works 一覧
            </Link>
          )}

          <div className="article-body">
            {work.description && <p className="section-lead">{work.description}</p>}

            {(work.tags.length > 0 || work.platforms.length > 0) && (
              <div className="chips" style={{ marginTop: "var(--space-5)" }}>
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
            )}

            {work.link && (
              <p style={{ marginTop: "var(--space-5)" }}>
                <a
                  href={sanitizeUrl(work.link)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-primary"
                >
                  プレイする
                  <UIIcon name="arrowUpRight" size={16} />
                </a>
              </p>
            )}

            <div style={{ marginTop: "var(--space-6)" }}>
              <ShareButtons
                title={work.title}
                url={`${siteUrl}/works/${slug}`}
              />
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

      {otherWorks.length > 0 && (
        <section className="section section-alt">
          <div className="container">
            <div className="section-head-row">
              <div className="section-head">
                <p className="section-eyebrow label is-drawn">More</p>
                <h2>ほかの作品</h2>
              </div>
              <Link href="/works" className="link-arrow">
                すべての作品
                <UIIcon name="arrowRight" size={16} />
              </Link>
            </div>

            <div className="card-grid">
              {otherWorks.map((w) => (
                <article key={w.id} className="work-card">
                  {w.thumbnailUrl && (
                    <Thumbnail
                      src={`/api/notion-image?pageId=${w.id}&prop=Thumbnail`}
                      alt={`${w.title} のサムネイル`}
                      sizes="(max-width: 640px) calc(100vw - 2.5rem), 280px"
                    />
                  )}
                  <div className="work-body">
                    <div className="work-head">
                      <h3 className="card-title">
                        <Link href={`/works/${w.slug}`} className="stretch-link">
                          {w.title}
                        </Link>
                      </h3>
                      <span className={`badge badge-${w.status.toLowerCase()}`}>{w.status}</span>
                    </div>
                    {w.description && <p className="work-desc">{w.description}</p>}
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