import type { Metadata } from "next";
import { listWorks } from "@/lib/notion/works";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import WorksClient from "@/components/WorksClient";

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
      <SiteHeader />

      <section className="section page-head">
        <div className="container">
          <div className="section-head">
            <p className="section-eyebrow label is-drawn">
              <span className="section-num">02</span>
              Works
            </p>
            <h1 className="section-title">制作した作品</h1>
            <p className="section-lead">
              Unity・Roblox・Scratch などで公開しているゲームと開発ツールの一覧です。
            </p>
          </div>

          {error ? (
            <div className="state-panel">
              <h3>作品情報を読み込めませんでした</h3>
              <p>しばらく待ってから再度アクセスしてください。</p>
              {process.env.NODE_ENV === "development" && (
                <pre style={{ fontSize: "0.8rem", whiteSpace: "pre-wrap" }}>{error}</pre>
              )}
            </div>
          ) : works.length === 0 ? (
            <div className="state-panel">
              <h3>準備中です</h3>
              <p>作品情報を準備しています。もう少しお待ちください。</p>
            </div>
          ) : (
            <WorksClient works={works} />
          )}
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
