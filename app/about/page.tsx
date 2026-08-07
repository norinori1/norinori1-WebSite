import type { Metadata } from "next";
import Image from "next/image";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import PlatformIcon, { type IconName } from "@/components/PlatformIcon";
import ScrollReveal from "@/components/ScrollReveal";

export const metadata: Metadata = {
  title: "About – norinori1",
  description:
    "norinori1のプロフィール。Unity、Roblox、Scratchでゲームを開発するクリエイター。",
};

const skills: { category: string; items: { label: string; icon: IconName | null; level: number }[] }[] = [
  {
    category: "Game Engines",
    items: [
      { label: "Unity", icon: "unity", level: 4 },
      { label: "Roblox", icon: "roblox", level: 1 },
      { label: "Scratch", icon: "scratch", level: 5 },
    ],
  },
  {
    category: "Languages",
    items: [
      { label: "C#", icon: null, level: 4 },
      { label: "Luau", icon: "luau", level: 1 },
      { label: "JavaScript", icon: "javascript", level: 1 },
      { label: "TypeScript", icon: "typescript", level: 1 },
    ],
  },
  {
    category: "Tools",
    items: [
      { label: "GitHub", icon: "github", level: 5 },
      { label: "VS Code", icon: null, level: 5 },
      { label: "Node.js", icon: "nodejs", level: 1 },
    ],
  },
];

const links: { name: string; url: string; icon: IconName }[] = [
  { name: "GitHub", url: "https://github.com/norinori1", icon: "github" },
  { name: "Qiita", url: "https://qiita.com/norinori1", icon: "qiita" },
  { name: "Zenn", url: "https://zenn.dev/norinori1", icon: "zenn" },
  { name: "X (Twitter)", url: "https://x.com/norinori1_", icon: "x" },
  { name: "itch.io", url: "https://norinori1.itch.io", icon: "itchio" },
  { name: "Scratch", url: "https://scratch.mit.edu/users/norinori1/", icon: "scratch" },
  { name: "AtCoder", url: "https://atcoder.jp/users/norinori1", icon: "web" },
];

export default function AboutPage() {
  return (
    <main className="site-root">
      <SiteHeader />

      <section className="section page-head">
        <div className="container">
          <ScrollReveal>
            <div className="section-head">
              <p className="section-eyebrow label">
                <span className="section-num">00</span>
                About
              </p>
              <h1 className="section-title">norinori1</h1>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={60}>
            <div className="about-intro">
              <Image
                src="/about-icon.svg"
                alt=""
                width={104}
                height={104}
                className="about-portrait"
                aria-hidden="true"
              />
              <p className="section-lead">
                こんにちは、norinori1 です。Unity・Roblox・Scratch を中心に、
                戦略・パズル・ローグライクなど多様なジャンルのゲームを継続的に開発しています。
              </p>
            </div>
          </ScrollReveal>

          <div className="about-block">
            <ScrollReveal>
              <h2>Skills</h2>
            </ScrollReveal>
            <div className="skills-grid">
              {skills.map(({ category, items }, i) => (
                <ScrollReveal key={category} delay={i * 70}>
                  <article className="skill-card">
                    <h3>{category}</h3>
                    <div className="skill-list">
                      {items.map(({ label, icon, level }) => (
                        <div key={label} className="skill-row">
                          <span className="skill-name">
                            {icon && <PlatformIcon name={icon} size={16} />}
                            {label}
                          </span>
                          <span className="skill-meter" aria-label={`習熟度 ${level}/5`}>
                            {[1, 2, 3, 4, 5].map((n) => (
                              <span key={n} className={`skill-seg${n <= level ? " filled" : ""}`} />
                            ))}
                          </span>
                        </div>
                      ))}
                    </div>
                  </article>
                </ScrollReveal>
              ))}
            </div>
          </div>

          <div className="about-block">
            <ScrollReveal>
              <h2>Links</h2>
            </ScrollReveal>
            <div className="platform-grid">
              {links.map((link, i) => (
                <ScrollReveal key={link.name} delay={i * 50}>
                  <a
                    className="platform-card"
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <PlatformIcon name={link.icon} size={26} className="platform-card-icon" />
                    <h3>{link.name}</h3>
                  </a>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
