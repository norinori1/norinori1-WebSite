"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

type WorkItem = {
  id: string;
  title: string;
  description: string;
  link: string;
  status: "Latest" | "Featured" | "Released";
  tags: string[];
  platforms: string[];
};

const works: WorkItem[] = [
  {
    id: "zintoroad",
    title: "ZINTOROAD",
    description:
      "Survivor-like Rogue-lite × Real-Time Resource Management",
    link: "https://norinori1.itch.io/zintoroad-beta",
    status: "Latest",
    tags: ["Unity", "Strategic", "Resource Management"],
    platforms: ["PC", "Web"],
  },
  {
    id: "rogue-lycan",
    title: "ROGUE LYCAN",
    description: "Discord Activity Rogue-like Game",
    link: "https://norinori1.github.io/Rogue-Lycan-Discord-Activity/",
    status: "Featured",
    tags: ["Discord", "Web", "Rogue-like"],
    platforms: ["Discord", "Web"],
  },
  {
    id: "polarity-under",
    title: "POLARITY UNDER",
    description: "Puzzle-based Action Game",
    link: "https://unityroom.com/games/polarity_under",
    status: "Released",
    tags: ["Unity", "Puzzle", "Action"],
    platforms: ["Web", "Windows"],
  },
  {
    id: "puzzle-ball-stage-maker",
    title: "Puzzle Ball Stage Maker",
    description: "Creative puzzle game stage editor",
    link: "https://norinori1.itch.io",
    status: "Featured",
    tags: ["Puzzle", "Creative", "Level Editor"],
    platforms: ["Web"],
  },
  {
    id: "block-crushing-game",
    title: "Block Crushing Game",
    description: "Classic block-crushing puzzle mechanics",
    link: "https://norinori1.itch.io",
    status: "Released",
    tags: ["Puzzle", "Casual", "Classic"],
    platforms: ["Web", "Download"],
  },
  {
    id: "puzzle-ball-3",
    title: "Puzzle Ball 3!",
    description: "Advanced puzzle ball mechanics",
    link: "https://norinori1.itch.io",
    status: "Released",
    tags: ["Puzzle", "Physics", "Challenging"],
    platforms: ["Web"],
  },
];

const platforms = [
  { name: "itch.io", url: "https://norinori1.itch.io" },
  { name: "X (Twitter)", url: "https://x.com/norinori1_" },
  { name: "GitHub", url: "https://github.com/norinori1" },
  { name: "Scratch", url: "https://scratch.mit.edu/users/norinori1/" },
  { name: "Discord", url: "https://norinori1.github.io/Rogue-Lycan-Discord-Activity/" },
  { name: "unityroom", url: "https://unityroom.com" },
];

const skills = [
  {
    category: "Game Engines",
    items: ["Unity", "Roblox", "Scratch"],
  },
  {
    category: "Languages",
    items: ["C#", "Luau", "JavaScript"],
  },
  {
    category: "Research",
    items: ["TensorFlow", "Game AI", "Gameplay Analytics"],
  },
  {
    category: "Tools & Workflow",
    items: ["GitHub", "VS Code", "Node.js"],
  },
];

const socialLinks = [
  { name: "Twitter/X", url: "https://x.com/norinori1_" },
  { name: "GitHub", url: "https://github.com/norinori1" },
  { name: "itch.io", url: "https://norinori1.itch.io" },
];

declare global {
  interface Window {
    gtag?: (
      command: "event",
      eventName: string,
      params?: Record<string, unknown>,
    ) => void;
  }
}

function trackEvent(eventName: string, params: Record<string, unknown>) {
  if (typeof window.gtag === "function") {
    window.gtag("event", eventName, params);
  }
}

export default function Home() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

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

  return (
    <main className="site-root">
      <header className="site-header">
        <div className="container header-inner">
          <a href="#top" className="brand" aria-label="norinori1 top">
            <Image
              src="/norinori1-splash.svg"
              alt="norinori1 - Game Developer & Creator logo"
              className="brand-splash"
              width={420}
              height={42}
              priority
            />
          </a>

          <button
            className="menu-toggle"
            type="button"
            aria-expanded={isMenuOpen}
            aria-controls="site-nav"
            aria-label="ナビゲーションを開閉"
            onClick={() => setIsMenuOpen((prev) => !prev)}
          >
            ☰
          </button>

          <nav id="site-nav" className={`site-nav ${isMenuOpen ? "open" : ""}`}>
            <a
              href="#about"
              onClick={() => {
                setIsMenuOpen(false);
                trackEvent("header_nav_click", { nav_item: "about" });
              }}
            >
              About
            </a>
            <a
              href="#works"
              onClick={() => {
                setIsMenuOpen(false);
                trackEvent("header_nav_click", { nav_item: "works" });
              }}
            >
              Works
            </a>
            <a
              href="#news"
              onClick={() => {
                setIsMenuOpen(false);
                trackEvent("header_nav_click", { nav_item: "news" });
              }}
            >
              News
            </a>
          </nav>
        </div>
      </header>

      <section id="top" className="hero" aria-label="Hero">
        <div className="container hero-content">
          <Image
            src="/norinori1-splash.svg"
            alt="norinori1 logo with Game Developer & Creator branding"
            className="hero-splash"
            width={560}
            height={120}
            priority
          />
          <div className="hero-copy">
            <p className="hero-subtitle">Game Developer & Creator</p>
            <p>
              Unity、Roblox、Scratchなど複数プラットフォームで、
              ユニークなゲーム体験と開発ツールを継続的に制作しています。
            </p>
          </div>
          <div className="hero-cta">
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
          <h2>About</h2>
          <p className="section-lead">
            ゲーム開発者として、戦略・パズル・ローグライクを中心に開発しています。
            最新技術の実験やコミュニティ向けツール開発にも注力しています。
          </p>
        </div>
      </section>

      <section id="works" className="section section-alt">
        <div className="container">
          <h2>Works</h2>
          <p className="section-lead">6つのゲーム作品をピックアップしています。</p>
          <div className="works-grid">
            {works.map((work) => (
              <article
                key={work.id}
                className="work-card"
                onClick={() =>
                  trackEvent("game_card_click", {
                    game_id: work.id,
                    game_title: work.title,
                    event_category: "engagement",
                  })
                }
              >
                <div className="work-head">
                  <h3>{work.title}</h3>
                  <span className={`badge badge-${work.status.toLowerCase()}`}>
                    {work.status}
                  </span>
                </div>
                <p>{work.description}</p>
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
                  Visit →
                </a>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="skills" className="section">
        <div className="container">
          <h2>Skills</h2>
          <div className="skills-grid">
            {skills.map((skill) => (
              <article key={skill.category} className="skill-card">
                <h3>{skill.category}</h3>
                <ul>
                  {skill.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="platforms" className="section section-alt">
        <div className="container">
          <h2>Platforms</h2>
          <div className="platform-grid">
            {platforms.map((platform) => (
              <a
                key={platform.name}
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
                <h3>{platform.name}</h3>
                <span>Visit →</span>
              </a>
            ))}
          </div>
        </div>
      </section>

      <section id="news" className="section">
        <div className="container">
          <h2>News</h2>
          <p className="section-lead">
            新作の進捗、公開情報、アップデート情報をこのセクションで発信していきます。
          </p>
        </div>
      </section>

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
                <a
                  href="#about"
                  onClick={() =>
                    trackEvent("footer_link_click", { link_text: "about" })
                  }
                >
                  About
                </a>
              </li>
              <li>
                <a
                  href="#works"
                  onClick={() =>
                    trackEvent("footer_link_click", { link_text: "works" })
                  }
                >
                  Works
                </a>
              </li>
              <li>
                <a
                  href="#news"
                  onClick={() =>
                    trackEvent("footer_link_click", { link_text: "news" })
                  }
                >
                  News
                </a>
              </li>
            </ul>
          </section>
          <section>
            <h3>Follow</h3>
            <ul>
              {socialLinks.map((item) => (
                <li key={item.name}>
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() =>
                      trackEvent("social_link_click", {
                        platform: item.name,
                        event_category: "outbound",
                      })
                    }
                  >
                    {item.name}
                  </a>
                </li>
              ))}
            </ul>
          </section>
        </div>
        <p className="copyright">© 2026 norinori1</p>
      </footer>
    </main>
  );
}
