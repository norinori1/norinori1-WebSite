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
              <WorksClient works={works} />
            )}
          </div>
        </section>
      </div>

      <SiteFooter />
    </main>
  );
}
