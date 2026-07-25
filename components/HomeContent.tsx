"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect } from "react";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import ScrollReveal from "@/components/ScrollReveal";
import Thumbnail from "@/components/Thumbnail";
import { trackEvent } from "@/lib/analytics";
import { sanitizeUrl } from "@/lib/security";
import PlatformIcon, { UIIcon, type IconName } from "@/components/PlatformIcon";
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
  { name: "Qiita", url: "https://qiita.com/norinori1", icon: "qiita" },
  { name: "Zenn", url: "https://zenn.dev/norinori1", icon: "zenn" },
  { name: "Scratch", url: "https://scratch.mit.edu/users/norinori1/", icon: "scratch" },
  { name: "unityroom", url: "https://unityroom.com/users/csn31btru8plo50zijv4", icon: "unity" },
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
    category: "Tools & Workflow",
    items: [
      { label: "GitHub", icon: "github", level: 5 },
      { label: "VS Code", icon: null, level: 5 },
      { label: "Node.js", icon: "nodejs", level: 1 },
    ],
  },
];

function formatDate(dateStr: string): string {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  return d.toLocaleDateString("ja-JP", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

/** `01 —— ABOUT` + heading + optional lead. The recurring section voice. */
function SectionHead({
  num,
  eyebrow,
  title,
  lead,
}: {
  num: string;
  eyebrow: string;
  title: string;
  lead?: string;
}) {
  return (
    <div className="section-head">
      <p className="section-eyebrow label">
        <span className="section-num">{num}</span>
        {eyebrow}
      </p>
      <h2>{title}</h2>
      {lead && <p className="section-lead">{lead}</p>}
    </div>
  );
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
          <span className="hero-particle hero-particle--lg hero-particle--slow" style={{ top: "12%", left: "72%" }} />
          <span className="hero-particle hero-particle--md hero-particle--medium" style={{ top: "24%", left: "90%" }} />
          <span className="hero-particle hero-particle--sm hero-particle--fast" style={{ top: "68%", left: "80%" }} />
          <span className="hero-particle hero-particle--lg hero-particle--slow" style={{ top: "78%", left: "58%" }} />
          <span className="hero-particle hero-particle--sm hero-particle--medium" style={{ top: "44%", left: "94%" }} />
          <span className="hero-particle hero-particle--md hero-particle--fast" style={{ top: "88%", left: "88%" }} />
        </div>

        <div className="container hero-content">
          <p className="hero-eyebrow label hero-animate hero-animate-eyebrow">
            Game Developer &amp; Creator
          </p>
          <Image
            src="/norinori1-splash-white.svg"
            alt="norinori1"
            className="hero-splash hero-animate hero-animate-logo"
            width={520}
            height={123}
            priority
          />
          <p className="hero-desc hero-animate hero-animate-desc">
            Unity、Roblox、Scratchなど複数プラットフォームで、
            ユニークなゲーム体験と開発ツールを継続的に制作しています。
          </p>
          <div className="hero-cta hero-animate hero-animate-cta">
            <a className="btn btn-primary" href="#works">
              作品を見る
              <UIIcon name="arrowRight" size={16} />
            </a>
            <a className="btn btn-secondary" href="#about">
              プロフィール
            </a>
          </div>
        </div>

        <a href="#about" className="hero-scroll hero-animate hero-animate-scroll" aria-label="下へスクロール">
          <span className="label">Scroll</span>
          <UIIcon name="chevronDown" size={18} />
        </a>
      </section>

      <section id="about" className="section">
        <div className="container">
          <ScrollReveal>
            <SectionHead
              num="01"
              eyebrow="About"
              title="つくっているもの"
              lead="ゲーム開発者として、戦略・パズル・ローグライクを中心に開発しています。最新技術の実験やコミュニティ向けツール開発にも注力しています。"
            />
          </ScrollReveal>
          <ScrollReveal delay={80}>
            <Link href="/about" className="link-arrow">
              プロフィールを詳しく見る
              <UIIcon name="arrowRight" size={16} />
            </Link>
          </ScrollReveal>
        </div>
      </section>

      <section id="works" className="section section-alt">
        <div className="container">
          <div className="section-head-row">
            <ScrollReveal>
              <SectionHead
                num="02"
                eyebrow="Works"
                title="Featured Works"
                lead="Featuredに設定されたゲーム作品です。"
              />
            </ScrollReveal>
            <ScrollReveal delay={80}>
              <Link href="/works" className="link-arrow">
                すべての作品
                <UIIcon name="arrowRight" size={16} />
              </Link>
            </ScrollReveal>
          </div>

          {fetchError ? (
            <div className="state-panel">
              <h3>作品情報を読み込めませんでした</h3>
              <p>しばらく待ってから再度アクセスしてください。</p>
            </div>
          ) : featuredWorks.length === 0 ? (
            <div className="state-panel">
              <h3>準備中です</h3>
              <p>作品情報を準備しています。もう少しお待ちください。</p>
            </div>
          ) : (
            <div className="works-grid">
              {featuredWorks.map((work, i) => (
                <ScrollReveal
                  key={work.id}
                  delay={i * 70}
                  className={i === 0 ? "work-card-wide" : undefined}
                >
                  <article className="work-card">
                    {work.thumbnailUrl && (
                      <Thumbnail
                        src={`/api/notion-image?pageId=${work.id}&prop=Thumbnail`}
                        alt={`${work.title} のサムネイル`}
                      />
                    )}
                    <div className="work-body">
                      <div className="work-head">
                        <h3>
                          <Link
                            href={`/works/${work.slug}`}
                            className="stretch-link"
                            onClick={() =>
                              trackEvent("game_card_detail_click", {
                                game_id: work.id,
                                game_title: work.title,
                                event_category: "engagement",
                              })
                            }
                          >
                            {work.title}
                          </Link>
                        </h3>
                        <span className={`badge badge-${work.status.toLowerCase()}`}>
                          {work.status}
                        </span>
                      </div>

                      {work.description && <p className="work-desc">{work.description}</p>}

                      <div className="work-meta">
                        {work.tags.length > 0 && (
                          <div className="chips">
                            {work.tags.map((tag) => (
                              <span key={tag} className="chip">
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}
                        {work.platforms.length > 0 && (
                          <div className="chips">
                            {work.platforms.map((platform) => (
                              <span key={platform} className="chip platform-chip">
                                {platform}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>

                      <div className="work-actions">
                        <span className="link-arrow" aria-hidden="true">
                          詳細を見る
                          <UIIcon name="arrowRight" size={16} />
                        </span>
                        {work.link && (
                          <a
                            className="link-arrow is-external"
                            href={sanitizeUrl(work.link)}
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
                            プレイする
                            <UIIcon name="arrowUpRight" size={16} />
                          </a>
                        )}
                      </div>
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
            <SectionHead
              num="03"
              eyebrow="Skills"
              title="使っている道具"
              lead="日常的に触れている技術と、いま学んでいる技術です。"
            />
          </ScrollReveal>
          <div className="skills-grid">
            {skills.map((skill, i) => (
              <ScrollReveal key={skill.category} delay={i * 70}>
                <article className="skill-card">
                  <h3>{skill.category}</h3>
                  <div className="skill-list">
                    {skill.items.map(({ label, icon, level }) => (
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
      </section>

      <section id="platforms" className="section section-alt">
        <div className="container">
          <ScrollReveal>
            <SectionHead
              num="04"
              eyebrow="Platforms"
              title="活動している場所"
              lead="作品の公開や、開発の記録を残している場所です。"
            />
          </ScrollReveal>
          <div className="platform-grid">
            {platforms.map((platform, i) => (
              <ScrollReveal key={platform.name} delay={i * 50}>
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
                  <PlatformIcon name={platform.icon} size={26} className="platform-card-icon" />
                  <h3>{platform.name}</h3>
                </a>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      <section id="news" className="section">
        <div className="container">
          <div className="section-head-row">
            <ScrollReveal>
              <SectionHead
                num="05"
                eyebrow="News"
                title="最近の記録"
                lead="新作の進捗、公開情報、アップデート情報を発信しています。"
              />
            </ScrollReveal>
            {recentNews.length > 0 && (
              <ScrollReveal delay={80}>
                <Link href="/news" className="link-arrow">
                  すべてのお知らせ
                  <UIIcon name="arrowRight" size={16} />
                </Link>
              </ScrollReveal>
            )}
          </div>

          {recentNews.length === 0 ? (
            <div className="state-panel">
              <h3>まだお知らせはありません</h3>
              <p>更新があればここに掲載します。</p>
            </div>
          ) : (
            <div className="card-grid">
              {recentNews.map((item, i) => (
                <ScrollReveal key={item.id} delay={i * 70}>
                  <article className="work-card">
                    {item.coverImageUrl && (
                      <Thumbnail
                        src={`/api/notion-image?pageId=${item.id}&prop=CoverImage`}
                        alt={`${item.title} のカバー画像`}
                      />
                    )}
                    <div className="work-body">
                      <h3 className="card-title">
                        <Link
                          href={`/news/${item.slug}`}
                          className="stretch-link"
                          onClick={() =>
                            trackEvent("news_card_click", {
                              news_id: item.id,
                              news_title: item.title,
                              event_category: "engagement",
                            })
                          }
                        >
                          {item.title}
                        </Link>
                      </h3>
                      {item.date && <p className="card-date">{formatDate(item.date)}</p>}
                      {item.excerpt && <p className="work-desc">{item.excerpt}</p>}
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
