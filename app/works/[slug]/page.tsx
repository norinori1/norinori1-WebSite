import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { getWorkBySlug, listWorkSlugs } from "@/lib/notion/works";
import NotionBlocks from "@/components/NotionBlocks";

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
    return {
      title: `${result.work.title} – norinori1`,
      description: result.work.description,
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

  return (
    <main className="site-root">
      <header className="site-header">
        <div className="container header-inner">
          <Link href="/" className="brand" aria-label="norinori1 top">
            <span style={{ fontWeight: 700, fontSize: "1.2rem" }}>norinori1</span>
          </Link>
          <nav className="site-nav">
            <Link href="/about">About</Link>
            <Link href="/works">Works</Link>
            <Link href="/news">News</Link>
          </nav>
        </div>
      </header>

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
                  src={work.thumbnailUrl}
                  alt={`${work.title} thumbnail`}
                  fill
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
      </div>

      <footer className="site-footer">
        <div className="container footer-grid">
          <section>
            <h3>norinori1</h3>
            <p>ゲーム開発者・クリエイター</p>
          </section>
          <section>
            <h3>Navigation</h3>
            <ul>
              <li>
                <Link href="/about">About</Link>
              </li>
              <li>
                <Link href="/works">Works</Link>
              </li>
              <li>
                <Link href="/news">News</Link>
              </li>
            </ul>
          </section>
        </div>
        <p className="copyright">© 2026 norinori1</p>
      </footer>
    </main>
  );
}
