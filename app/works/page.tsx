import type { Metadata } from "next";
import { listWorks } from "@/lib/notion/works";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import WorksClient from "@/components/WorksClient";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Works – 作品ギャラリー | norinori1",
  description:
    "norinori1 の作品ギャラリー。ゲーム、VRChat のワールドやギミック、アバター向けアセット、開発ツールから気になる作品を見つけてください。",
  alternates: { canonical: "/works" },
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
            <h1 className="section-title">作品ギャラリー</h1>
            <p className="section-lead">
              ゲームも、遊びを広げるアセットも、ものづくりのツールも。
              気になる作品を開いて、楽しんでみてください。
            </p>
          </div>

          {error ? (
            <div className="state-panel">
              <h2>作品情報を読み込めませんでした</h2>
              <p>しばらく待ってから再度アクセスしてください。</p>
              {process.env.NODE_ENV === "development" && (
                <pre style={{ fontSize: "0.8rem", whiteSpace: "pre-wrap" }}>{error}</pre>
              )}
            </div>
          ) : works.length === 0 ? (
            <div className="state-panel">
              <h2>準備中です</h2>
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
