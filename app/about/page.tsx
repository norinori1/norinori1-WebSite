import type { Metadata } from "next";
import Link from "next/link";
import SiteHeader from "@/components/SiteHeader";

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
              <ul style={{ paddingLeft: "1.2rem", color: "var(--color-neutral-700)" }}>
                <li>
                  <strong>Game Engines:</strong> Unity, Roblox, Scratch
                </li>
                <li>
                  <strong>Languages:</strong> C#, Luau, JavaScript / TypeScript
                </li>
                <li>
                  <strong>Research:</strong> TensorFlow, Game AI, Gameplay Analytics
                </li>
                <li>
                  <strong>Tools:</strong> GitHub, VS Code, Node.js
                </li>
              </ul>

              <h2 style={{ marginTop: "2.5rem" }}>Links</h2>
              <ul style={{ paddingLeft: "1.2rem", color: "var(--color-neutral-700)" }}>
                <li>
                  <a
                    href="https://github.com/norinori1"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    GitHub
                  </a>
                </li>
                <li>
                  <a
                    href="https://x.com/norinori1_"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    X (Twitter)
                  </a>
                </li>
                <li>
                  <a
                    href="https://norinori1.itch.io"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    itch.io
                  </a>
                </li>
                <li>
                  <a
                    href="https://scratch.mit.edu/users/norinori1/"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
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
