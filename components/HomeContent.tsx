"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect } from "react";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import ScrollReveal from "@/components/ScrollReveal";
import { trackEvent } from "@/lib/analytics";
import PlatformIcon, { type IconName } from "@/components/PlatformIcon";
import type { Work, NewsItem } from "@/types/notion";

interface HomeContentProps {
  featuredWorks: Work[];
  recentNews: NewsItem[];
  fetchError?: boolean;
}

const platforms: { name: string; url: string; icon: IconName }[] = [
  { name: "itch.io", url: "https://norinori1.itch.io", icon: "itchio" },
  { name: "X (Twitter)", url: "https://x.com/norinori1_", icon: "x" },
  { name: "GitHub", url: "https://github.com/norinori1", icon: "github" },
  { name: "Scratch", url: "https://scratch.mit.edu/users/norinori1/", icon: "scratch" },
  { name: "unityroom", url: "https://unityroom.com", icon: "unity" },
];

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
    ],
  },
  {
    category: "Research",
    items: [
      { label: "TensorFlow", icon: "tensorflow", level: 1 },
      { label: "Game AI", icon: null, level: 3 },
      { label: "Gameplay Analytics", icon: null, level: 2 },
    ],
  },
  {
    category: "Tools & Workflow",
    items: [
      { label: "GitHub", icon: "github", level: 5 },
      { label: "VS Code", icon: null, level: 5 },
      { label: "Node.js", icon: "nodejs", level: 1 },
    ],
  },
];

const basePath = "";

function formatDate(dateStr: string): string {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  return d.toLocaleDateString("ja-JP", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default function HomeContent({ featuredWorks, recentNews, fetchError }: HomeContentProps) {
  useEffect(() => {
    const sections = document.querySelectorAll<HTMLElement>("section[id]");
    const seen = new Set<string>();

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) {
            return;
          }

          const sectionId = entry.target.id;
          if (seen.has(sectionId)) {
            return;
          }

          seen.add(sectionId);
          const sectionName =
            entry.target.querySelector("h2")?.textContent ?? sectionId;

          trackEvent("section_view", {
            section_id: sectionId,
            section_name: sectionName,
            event_category: "engagement",
          });
        });
      },
      { threshold: 0.25 },
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const buttons = document.querySelectorAll<HTMLElement>(".hero-cta .btn");

    function handleRipple(event: MouseEvent) {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      const button = event.currentTarget as HTMLElement;
      const rect = button.getBoundingClientRect();
      const ripple = document.createElement("span");
      ripple.className = "btn-ripple-wave";
      ripple.style.left = `${event.clientX - rect.left}px`;
      ripple.style.top = `${event.clientY - rect.top}px`;
      button.appendChild(ripple);
      ripple.addEventListener("animationend", () => ripple.remove(), { once: true });
    }

    buttons.forEach((btn) => btn.addEventListener("click", handleRipple));
    return () => buttons.forEach((btn) => btn.removeEventListener("click", handleRipple));
  }, []);

  return (
    <main className="site-root">
      <SiteHeader />

      <section id="top" className="hero" aria-label="Hero">
        <div className="hero-particles" aria-hidden="true">
          <span className="hero-particle hero-particle--lg hero-particle--slow"   style={{ top: "10%", left: "8%"  }} />
          <span className="hero-particle hero-particle--md hero-particle--medium" style={{ top: "20%", left: "88%" }} />
          <span className="hero-particle hero-particle--sm hero-particle--fast"   style={{ top: "60%", left: "15%" }} />
          <span className="hero-particle hero-particle--lg hero-particle--slow"   style={{ top: "75%", left: "75%" }} />
          <span className="hero-particle hero-particle--md hero-particle--medium" style={{ top: "35%", left: "50%" }} />
          <span className="hero-particle hero-particle--sm hero-particle--fast"   style={{ top: "85%", left: "30%" }} />
          <span className="hero-particle hero-particle--sm hero-particle--medium" style={{ top: "15%", left: "65%" }} />
          <span className="hero-particle hero-particle--md hero-particle--slow"   style={{ top: "50%", left: "92%" }} />
        </div>
        <div className="container hero-content">
          <Image
            src={`${basePath}/norinori1-splash-white.svg`}
            alt="norinori1 logo with Game Developer & Creator branding"
            className="hero-splash hero-animate hero-animate-logo"
            width={560}
            height={120}
            priority
          />
          <div className="hero-copy">
            <p className="hero-subtitle hero-animate hero-animate-sub">Game Developer & Creator</p>
            <p className="hero-animate hero-animate-desc">
              Unity、Roblox、Scratchなど複数プラットフォームで、
              ユニークなゲーム体験と開発ツールを継続的に制作しています。
            </p>
          </div>
          <div className="hero-cta hero-animate hero-animate-cta">
            <a className="btn btn-primary" href="#works">
              作品を見る
            </a>
            <a className="btn btn-secondary" href="#about">
              プロフィール
            </a>
          </div>
        </div>
      </section>

      <section id="about" className="section">
        <div className="container">
          <ScrollReveal>
            <h2>About</h2>
            <p className="section-lead">
              ゲーム開発者として、戦略・パズル・ローグライクを中心に開発しています。
              最新技術の実験やコミュニティ向けツール開発にも注力しています。
            </p>
          </ScrollReveal>
        </div>
      </section>

      <section id="works" className="section section-alt">
        <div className="container">
          <ScrollReveal>
            <h2>Works</h2>
            <p className="section-lead">Featuredに設定されたゲーム作品です。</p>
          </ScrollReveal>
          {fetchError ? (
            <div className="notion-callout" style={{ marginTop: "2rem" }}>
              <p>
                作品情報の取得に失敗しました。しばらく待ってから再度アクセスしてください。
              </p>
            </div>
          ) : featuredWorks.length === 0 ? (
            <p style={{ marginTop: "2rem", color: "var(--color-neutral-500)" }}>
              作品情報を準備中です。
            </p>
          ) : (
            <div className="works-grid">
              {featuredWorks.map((work, i) => (
                <ScrollReveal key={work.id} delay={i * 80}>
                  <article
                    className="work-card"
                    onClick={() =>
                      trackEvent("game_card_click", {
                        game_id: work.id,
                        game_title: work.title,
                        event_category: "engagement",
                      })
                    }
                  >
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
                          sizes="(max-width: 640px) calc(100vw - 2rem), (max-width: 1200px) calc(50vw - 2rem), 400px"
                          style={{ objectFit: "cover" }}
                        />
                      </div>
                    )}
                    <div className="work-head">
                      <h3>{work.title}</h3>
                      <span className={`badge badge-${work.status.toLowerCase()}`}>
                        {work.status}
                      </span>
                    </div>
                    {work.description && <p>{work.description}</p>}
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
                    <div style={{ marginTop: "1rem", display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
                      <Link
                        href={`/works/${work.slug}`}
                        className="work-link"
                        onClick={() =>
                          trackEvent("game_card_detail_click", {
                            game_id: work.id,
                            game_title: work.title,
                            event_category: "engagement",
                          })
                        }
                      >
                        詳細を見る →
                      </Link>
                      {work.link && (
                        <a
                          className="work-link"
                          href={work.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={() =>
                            trackEvent("game_link_click", {
                              game_id: work.id,
                              destination_url: work.link,
                              event_category: "outbound",
                            })
                          }
                        >
                          Visit ↗
                        </a>
                      )}
                    </div>
                  </article>
                </ScrollReveal>
              ))}
            </div>
          )}
        </div>
      </section>

      <section id="skills" className="section">
        <div className="container">
          <ScrollReveal>
            <h2>Skills</h2>
          </ScrollReveal>
          <div className="skills-grid">
            {skills.map((skill) => (
              <ScrollReveal key={skill.category}>
                <article className="skill-card">
                  <h3>{skill.category}</h3>
                  <div className="skill-badges">
                    {skill.items.map(({ label, icon, level }) => (
                      <span key={label} className="skill-badge">
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
                </article>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      <section id="platforms" className="section section-alt">
        <div className="container">
          <ScrollReveal>
            <h2>Platforms</h2>
          </ScrollReveal>
          <div className="platform-grid">
            {platforms.map((platform, i) => (
              <ScrollReveal key={platform.name} delay={i * 60}>
                <a
                  className="platform-card"
                  href={platform.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() =>
                    trackEvent("platform_link_click", {
                      platform_name: platform.name,
                      event_category: "outbound",
                    })
                  }
                >
                  <PlatformIcon name={platform.icon} size={32} className="platform-card-icon" />
                  <h3>{platform.name}</h3>
                  <span>Visit →</span>
                </a>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      <section id="news" className="section">
        <div className="container">
          <ScrollReveal>
            <h2>News</h2>
            <p className="section-lead">
              新作の進捗、公開情報、アップデート情報をこのセクションで発信していきます。
            </p>
          </ScrollReveal>
          {recentNews.length > 0 && (
            <>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
                  gap: "1.25rem",
                  marginTop: "2rem",
                }}
              >
                {recentNews.map((item, i) => (
                  <ScrollReveal key={item.id} delay={i * 80}>
                    <article className="work-card">
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
                            sizes="(max-width: 640px) calc(100vw - 2rem), (max-width: 1200px) calc(50vw - 2rem), 400px"
                            style={{ objectFit: "cover" }}
                          />
                        </div>
                      )}
                      <h3 style={{ margin: 0, fontSize: "1rem" }}>{item.title}</h3>
                      {item.date && (
                        <p style={{ margin: "0.35rem 0 0", fontSize: "0.8rem", color: "var(--color-neutral-500)" }}>
                          {formatDate(item.date)}
                        </p>
                      )}
                      {item.excerpt && (
                        <p style={{ margin: "0.5rem 0", fontSize: "0.9rem", color: "var(--color-neutral-700)", lineHeight: "1.6" }}>
                          {item.excerpt}
                        </p>
                      )}
                      <Link
                        href={`/news/${item.slug}`}
                        className="work-link"
                        style={{ display: "inline-block", marginTop: "0.75rem" }}
                        onClick={() =>
                          trackEvent("news_card_click", {
                            news_id: item.id,
                            news_title: item.title,
                            event_category: "engagement",
                          })
                        }
                      >
                        続きを読む →
                      </Link>
                    </article>
                  </ScrollReveal>
                ))}
              </div>
              <ScrollReveal>
                <div style={{ marginTop: "2rem", textAlign: "center" }}>
                  <Link href="/news" className="btn btn-secondary">
                    News 一覧を見る →
                  </Link>
                </div>
              </ScrollReveal>
            </>
          )}
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
