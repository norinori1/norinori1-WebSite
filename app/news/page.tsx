import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { listNews } from "@/lib/notion/news";
import SiteHeader from "@/components/SiteHeader";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "News – norinori1",
  description:
    "norinori1からの最新情報。新作の進捗、公開情報、アップデート情報など。",
};

function formatDate(dateStr: string): string {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  return d.toLocaleDateString("ja-JP", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default async function NewsPage() {
  let newsItems: Awaited<ReturnType<typeof listNews>> = [];
  let error: string | null = null;

  try {
    newsItems = await listNews();
  } catch (e) {
    error = e instanceof Error ? e.message : "データの取得に失敗しました。";
  }

  return (
    <main className="site-root">
      <SiteHeader />

      <div style={{ paddingTop: "64px" }}>
        <section className="section">
          <div className="container">
            <h1 style={{ fontSize: "clamp(2rem, 4vw, 3rem)", marginBottom: "0.5rem" }}>
              News
            </h1>
            <p className="section-lead">
              新作の進捗、公開情報、アップデートなど最新情報をお届けします。
            </p>

            {error ? (
              <div className="notion-callout" style={{ marginTop: "2rem" }}>
                <p>
                  データの取得に失敗しました。しばらく待ってから再度アクセスしてください。
                </p>
                {process.env.NODE_ENV === "development" && (
                  <pre style={{ fontSize: "0.8rem", whiteSpace: "pre-wrap" }}>{error}</pre>
                )}
              </div>
            ) : newsItems.length === 0 ? (
              <p style={{ marginTop: "2rem", color: "var(--color-neutral-500)" }}>
                ニュース記事はまだありません。
              </p>
            ) : (
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
                  gap: "1.5rem",
                  marginTop: "2rem",
                }}
              >
                {newsItems.map((item) => (
                  <article key={item.id} className="work-card">
                    {item.coverImageUrl && (
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
                          src={item.coverImageUrl}
                          alt={`${item.title} cover`}
                          fill
                          style={{ objectFit: "cover" }}
                          unoptimized
                        />
                      </div>
                    )}
                    <div className="work-head">
                      <h2 style={{ fontSize: "1.1rem", margin: 0 }}>{item.title}</h2>
                    </div>
                    {item.date && (
                      <p
                        style={{
                          margin: "0.4rem 0",
                          fontSize: "0.85rem",
                          color: "var(--color-neutral-500)",
                        }}
                      >
                        {formatDate(item.date)}
                      </p>
                    )}
                    {item.excerpt && (
                      <p style={{ margin: "0.5rem 0", color: "var(--color-neutral-700)" }}>
                        {item.excerpt}
                      </p>
                    )}
                    <div className="chips">
                      {item.tags.map((tag) => (
                        <span key={tag} className="chip">
                          {tag}
                        </span>
                      ))}
                    </div>
                    <Link
                      href={`/news/${item.slug}`}
                      className="work-link"
                      style={{ display: "inline-block", marginTop: "1rem" }}
                    >
                      続きを読む →
                    </Link>
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
