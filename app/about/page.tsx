import type { Metadata } from "next";
import Link from "next/link";
import SiteHeader from "@/components/SiteHeader";
import PlatformIcon from "@/components/PlatformIcon";

export const metadata: Metadata = {
  title: "About – norinori1",
  description:
    "norinori1のプロフィール。Unity、Roblox、Scratchでゲームを開発するクリエイター。",
};

export default function AboutPage() {
  return (
    <main className="site-root">
      <SiteHeader />

      <div style={{ paddingTop: "64px" }}>
        <section className="section">
          <div className="container">
            <h1 style={{ fontSize: "clamp(2rem, 4vw, 3rem)", marginBottom: "1.5rem" }}>
              About
            </h1>

            <div style={{ maxWidth: "720px", lineHeight: "1.9" }}>
              <p className="section-lead">
                こんにちは、norinori1 です。Unity・Roblox・Scratch を中心に、
                戦略・パズル・ローグライクなど多様なジャンルのゲームを継続的に開発しています。
              </p>

              <h2 style={{ marginTop: "2.5rem" }}>Skills</h2>
              <div style={{ display: "grid", gap: "1.25rem", marginTop: "0.75rem" }}>
                {(
                  [
                    {
                      category: "Game Engines",
                      items: [
                        { label: "Unity", icon: "unity" as const },
                        { label: "Roblox", icon: "roblox" as const },
                        { label: "Scratch", icon: "scratch" as const },
                      ],
                    },
                    {
                      category: "Languages",
                      items: [
                        { label: "C#", icon: null },
                        { label: "Luau", icon: "luau" as const },
                        { label: "JavaScript", icon: "javascript" as const },
                        { label: "TypeScript", icon: "typescript" as const },
                      ],
                    },
                    {
                      category: "Research",
                      items: [
                        { label: "TensorFlow", icon: "tensorflow" as const },
                        { label: "Game AI", icon: null },
                        { label: "Gameplay Analytics", icon: null },
                      ],
                    },
                    {
                      category: "Tools",
                      items: [
                        { label: "GitHub", icon: "github" as const },
                        { label: "VS Code", icon: null },
                        { label: "Node.js", icon: "nodejs" as const },
                      ],
                    },
                  ] as const
                ).map(({ category, items }) => (
                  <div key={category}>
                    <p
                      style={{
                        margin: "0 0 0.5rem",
                        fontWeight: 600,
                        color: "var(--color-neutral-900)",
                      }}
                    >
                      {category}
                    </p>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
                      {items.map(({ label, icon }) => (
                        <span
                          key={label}
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "0.35rem",
                            border: "1px solid var(--color-neutral-200)",
                            borderRadius: "999px",
                            padding: "0.25rem 0.65rem",
                            fontSize: "0.875rem",
                            color: "var(--color-neutral-700)",
                          }}
                        >
                          {icon && <PlatformIcon name={icon} size={15} />}
                          {label}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <h2 style={{ marginTop: "2.5rem" }}>Links</h2>
              <ul style={{ paddingLeft: "1.2rem", color: "var(--color-neutral-700)" }}>
                <li>
                  <a
                    href="https://github.com/norinori1"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem" }}
                  >
                    <PlatformIcon name="github" size={18} />
                    GitHub
                  </a>
                </li>
                <li>
                  <a
                    href="https://x.com/norinori1_"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem" }}
                  >
                    <PlatformIcon name="x" size={18} />
                    X (Twitter)
                  </a>
                </li>
                <li>
                  <a
                    href="https://norinori1.itch.io"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem" }}
                  >
                    <PlatformIcon name="itchio" size={18} />
                    itch.io
                  </a>
                </li>
                <li>
                  <a
                    href="https://scratch.mit.edu/users/norinori1/"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem" }}
                  >
                    <PlatformIcon name="scratch" size={18} />
                    Scratch
                  </a>
                </li>
              </ul>
            </div>
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
