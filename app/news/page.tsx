import type { Metadata } from "next";
import Link from "next/link";
import { listNews } from "@/lib/notion/news";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import ScrollReveal from "@/components/ScrollReveal";
import Thumbnail from "@/components/Thumbnail";
import { UIIcon } from "@/components/PlatformIcon";

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

      <section className="section page-head">
        <div className="container">
          <div className="section-head">
            <p className="section-eyebrow label is-drawn">
              <span className="section-num">05</span>
              News
            </p>
            <h1 className="section-title">お知らせ</h1>
            <p className="section-lead">
              新作の進捗、公開情報、アップデートなど最新情報をお届けします。
            </p>
          </div>

          {error ? (
            <div className="state-panel">
              <h3>お知らせを読み込めませんでした</h3>
              <p>しばらく待ってから再度アクセスしてください。</p>
              {process.env.NODE_ENV === "development" && (
                <pre style={{ fontSize: "0.8rem", whiteSpace: "pre-wrap" }}>{error}</pre>
              )}
            </div>
          ) : newsItems.length === 0 ? (
            <div className="state-panel">
              <h3>まだお知らせはありません</h3>
              <p>更新があればここに掲載します。</p>
            </div>
          ) : (
            <div className="card-grid">
              {newsItems.map((item, i) => (
                <ScrollReveal key={item.id} delay={i * 70}>
                  <article className="work-card">
                    {item.coverImageUrl && (
                      <Thumbnail
                        src={`/api/notion-image?pageId=${item.id}&prop=CoverImage`}
                        alt={`${item.title} のカバー画像`}
                      />
                    )}
                    <div className="work-body">
                      <h2 className="card-title">
                        <Link href={`/news/${item.slug}`} className="stretch-link">
                          {item.title}
                        </Link>
                      </h2>
                      {item.date && <p className="card-date">{formatDate(item.date)}</p>}
                      {item.excerpt && <p className="work-desc">{item.excerpt}</p>}
                      {item.tags.length > 0 && (
                        <div className="work-meta">
                          <div className="chips">
                            {item.tags.map((tag) => (
                              <span key={tag} className="chip">
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                      <div className="work-actions">
                        <span className="link-arrow" aria-hidden="true">
                          続きを読む
                          <UIIcon name="arrowRight" size={16} />
                        </span>
                      </div>
                    </div>
                  </article>
                </ScrollReveal>
              ))}
            </div>
          )}
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
