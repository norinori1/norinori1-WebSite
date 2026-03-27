import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { listWorks } from "@/lib/notion/works";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Works – norinori1",
  description:
    "norinori1が制作したゲーム作品の一覧。Unity、Roblox、Scratchなど複数プラットフォームで公開中。",
};

export default async function WorksPage() {
  let works: Awaited<ReturnType<typeof listWorks>> = [];
  let error: string | null = null;

  try {
    works = await listWorks();
  } catch (e) {
    error = e instanceof Error ? e.message : "データの取得に失敗しました。";
  }

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
          <div className="container">
            <h1 style={{ fontSize: "clamp(2rem, 4vw, 3rem)", marginBottom: "0.5rem" }}>
              Works
            </h1>
            <p className="section-lead">制作したゲーム作品の一覧です。</p>

            {error ? (
              <div className="notion-callout" style={{ marginTop: "2rem" }}>
                <p>
                  データの取得に失敗しました。しばらく待ってから再度アクセスしてください。
                </p>
                {process.env.NODE_ENV === "development" && (
                  <pre style={{ fontSize: "0.8rem", whiteSpace: "pre-wrap" }}>{error}</pre>
                )}
              </div>
            ) : works.length === 0 ? (
              <p style={{ marginTop: "2rem", color: "var(--color-neutral-500)" }}>
                作品情報を準備中です。
              </p>
            ) : (
              <div className="works-grid" style={{ marginTop: "2rem" }}>
                {works.map((work) => (
                  <article key={work.id} className="work-card">
                    {work.thumbnailUrl && (
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
                          src={work.thumbnailUrl}
                          alt={`${work.title} thumbnail`}
                          fill
                          style={{ objectFit: "cover" }}
                          unoptimized
                        />
                      </div>
                    )}
                    <div className="work-head">
                      <h2 style={{ fontSize: "1.1rem", margin: 0 }}>{work.title}</h2>
                      <span className={`badge badge-${work.status.toLowerCase()}`}>
                        {work.status}
                      </span>
                    </div>
                    {work.description && (
                      <p style={{ margin: "0.5rem 0" }}>{work.description}</p>
                    )}
                    <div className="chips">
                      {work.tags.map((tag) => (
                        <span key={tag} className="chip">
                          {tag}
                        </span>
                      ))}
                    </div>
                    <div className="chips chips-platform">
                      {work.platforms.map((platform) => (
                        <span key={platform} className="chip platform-chip">
                          {platform}
                        </span>
                      ))}
                    </div>
                    <div style={{ marginTop: "1rem", display: "flex", gap: "0.75rem" }}>
                      <Link
                        href={`/works/${work.slug}`}
                        className="work-link"
                      >
                        詳細を見る →
                      </Link>
                      {work.link && (
                        <a
                          href={work.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="work-link"
                          style={{ marginLeft: "auto" }}
                        >
                          Visit ↗
                        </a>
                      )}
                    </div>
                  </article>
                ))}
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
