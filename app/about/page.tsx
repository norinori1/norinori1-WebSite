import type { Metadata } from "next";
import Image from "next/image";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import PlatformIcon from "@/components/PlatformIcon";
import ScrollReveal from "@/components/ScrollReveal";

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
            <ScrollReveal>
              <h1 style={{ fontSize: "clamp(2rem, 4vw, 3rem)", marginBottom: "1.5rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <Image src="/about-icon.svg" alt="" width={40} height={40} aria-hidden="true" />
                About
              </h1>
            </ScrollReveal>

            <div style={{ maxWidth: "720px", lineHeight: "1.9" }}>
              <ScrollReveal>
                <p className="section-lead">
                  こんにちは、norinori1 です。Unity・Roblox・Scratch を中心に、
                  戦略・パズル・ローグライクなど多様なジャンルのゲームを継続的に開発しています。
                </p>
              </ScrollReveal>

              <ScrollReveal>
                <h2 style={{ marginTop: "2.5rem" }}>Skills</h2>
              </ScrollReveal>
              <div style={{ display: "grid", gap: "1.25rem", marginTop: "0.75rem" }}>
                {(
                  [
                    {
                      category: "Game Engines",
                      items: [
                        { label: "Unity", icon: "unity" as const, level: 4 },
                        { label: "Roblox", icon: "roblox" as const, level: 1 },
                        { label: "Scratch", icon: "scratch" as const, level: 5 },
                      ],
                    },
                    {
                      category: "Languages",
                      items: [
                        { label: "C#", icon: null, level: 4 },
                        { label: "Luau", icon: "luau" as const, level: 1 },
                        { label: "JavaScript", icon: "javascript" as const, level: 1 },
                        { label: "TypeScript", icon: "typescript" as const, level: 1 },
                      ],
                    },
                    {
                      category: "Research",
                      items: [
                        { label: "TensorFlow", icon: "tensorflow" as const, level: 1 },
                        { label: "Game AI", icon: null, level: 3 },
                        { label: "Gameplay Analytics", icon: null, level: 2 },
                      ],
                    },
                    {
                      category: "Tools",
                      items: [
                        { label: "GitHub", icon: "github" as const, level: 5 },
                        { label: "VS Code", icon: null, level: 5 },
                        { label: "Node.js", icon: "nodejs" as const, level: 1 },
                      ],
                    },
                  ] as const
                ).map(({ category, items }, i) => (
                  <ScrollReveal key={category} delay={i * 80}>
                    <div>
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
                        {items.map(({ label, icon, level }) => (
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
                            <span className="skill-dots" aria-label={`レベル ${level}/5`}>
                              {[1, 2, 3, 4, 5].map((n) => (
                                <span key={n} className={`skill-dot${n <= level ? " filled" : ""}`} />
                              ))}
                            </span>
                          </span>
                        ))}
                      </div>
                    </div>
                  </ScrollReveal>
                ))}
              </div>

              <ScrollReveal>
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
                      href="https://qiita.com/norinori1"
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem" }}
                    >
                      <PlatformIcon name="web" size={18} />
                      Qiita
                    </a>
                  </li>
                  <li>
                    <a
                      href="https://zenn.dev/norinori1"
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem" }}
                    >
                      <PlatformIcon name="web" size={18} />
                      Zenn
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
              </ScrollReveal>
            </div>
          </div>
        </section>
      </div>

      <SiteFooter />
    </main>
  );
}
