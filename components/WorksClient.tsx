"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import type { Work } from "@/types/notion";
import PlatformIcon, { type IconName } from "@/components/PlatformIcon";

// Tags that map to SVG icons from PlatformIcon (tech/platform tags)
const TAG_SVG_ICONS: Record<string, IconName> = {
  Unity: "unity",
  Roblox: "roblox",
  Scratch: "scratch",
  Luau: "luau",
  JavaScript: "javascript",
  TypeScript: "typescript",
  TensorFlow: "tensorflow",
  "Node.js": "nodejs",
  NodeJS: "nodejs",
  GitHub: "github",
  "itch.io": "itchio",
  Discord: "discord",
  ディスコード: "discord",
  Web: "web",
  ウェブ: "web",
  Website: "web",
  Webサイト: "web",
};

// Emoji icon mapping for non-tech tag names (Japanese and English)
const TAG_EMOJI_ICONS: Record<string, string> = {
  Game: "🎮",
  ゲーム: "🎮",
  "2D": "📐",
  "3D": "🎲",
  Puzzle: "🧩",
  パズル: "🧩",
  Action: "⚡",
  アクション: "⚡",
  Adventure: "🗺️",
  アドベンチャー: "🗺️",
  Platformer: "🏃",
  Platform: "🏃",
  Mobile: "📱",
  PC: "💻",
  Multiplayer: "👥",
  マルチプレイ: "👥",
  Horror: "👻",
  ホラー: "👻",
  Racing: "🏎️",
  レーシング: "🏎️",
  Strategy: "♟️",
  ストラテジー: "♟️",
  RPG: "⚔️",
  Simulation: "🔬",
  シミュレーション: "🔬",
  Shooter: "🎯",
  シューター: "🎯",
  FPS: "🔫",
  VR: "🥽",
  AI: "🤖",
  Educational: "📚",
  教育: "📚",
  Original: "✨",
  オリジナル: "✨",
  Jam: "🏆",
  GameJam: "🏆",
  ゲームジャム: "🏆",
  WIP: "🔧",
};

type TagIconResult =
  | { type: "svg"; name: IconName }
  | { type: "emoji"; icon: string };

function getTagIcon(tag: string): TagIconResult {
  const svgName = TAG_SVG_ICONS[tag];
  if (svgName) return { type: "svg", name: svgName };
  return { type: "emoji", icon: TAG_EMOJI_ICONS[tag] ?? "🏷️" };
}

function TagIcon({ tag, size = 12 }: { tag: string; size?: number }) {
  const icon = getTagIcon(tag);
  if (icon.type === "svg") {
    return <PlatformIcon name={icon.name} size={size} />;
  }
  return (
    <span className="chip-icon" aria-hidden="true">
      {icon.icon}
    </span>
  );
}

type SortOption = "default" | "title-asc" | "title-desc" | "status";

interface WorksClientProps {
  works: Work[];
}

export default function WorksClient({ works }: WorksClientProps) {
  const [search, setSearch] = useState("");
  const [activeTags, setActiveTags] = useState<Set<string>>(new Set());
  const [sort, setSort] = useState<SortOption>("default");

  // Collect all unique tags from all works
  const allTags = useMemo(() => {
    const tagSet = new Set<string>();
    works.forEach((w) => w.tags.forEach((t) => tagSet.add(t)));
    return Array.from(tagSet).sort((a, b) => a.localeCompare(b, "ja"));
  }, [works]);

  const toggleTag = (tag: string) => {
    setActiveTags((prev) => {
      const next = new Set(prev);
      if (next.has(tag)) {
        next.delete(tag);
      } else {
        next.add(tag);
      }
      return next;
    });
  };

  const filteredWorks = useMemo(() => {
    let result = works;

    // Search filter (title + description)
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (w) =>
          w.title.toLowerCase().includes(q) ||
          w.description.toLowerCase().includes(q),
      );
    }

    // Tag filter (AND logic: all active tags must be present)
    if (activeTags.size > 0) {
      result = result.filter((w) =>
        Array.from(activeTags).every((t) => w.tags.includes(t)),
      );
    }

    // Sort
    if (sort !== "default") {
      result = [...result];
      if (sort === "title-asc") {
        result.sort((a, b) => a.title.localeCompare(b.title, "ja"));
      } else if (sort === "title-desc") {
        result.sort((a, b) => b.title.localeCompare(a.title, "ja"));
      } else if (sort === "status") {
        const statusOrder: Record<string, number> = {
          Featured: 0,
          Latest: 1,
          Released: 2,
        };
        result.sort((a, b) => {
          const aOrder = statusOrder[a.status] ?? 99;
          const bOrder = statusOrder[b.status] ?? 99;
          return aOrder - bOrder;
        });
      }
    }
    // "default": keep server order (Featured first, then title)

    return result;
  }, [works, search, activeTags, sort]);

  return (
    <div>
      {/* Search and Sort */}
      <div className="works-controls">
        <div className="works-search-wrap">
          <span className="works-search-icon" aria-hidden="true">
            🔍
          </span>
          <input
            type="search"
            className="works-search"
            placeholder="作品名・説明で検索..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            aria-label="作品を検索"
          />
        </div>
        <select
          className="works-sort"
          value={sort}
          onChange={(e) => setSort(e.target.value as SortOption)}
          aria-label="並び順"
        >
          <option value="default">並び順: デフォルト</option>
          <option value="title-asc">タイトル A → Z</option>
          <option value="title-desc">タイトル Z → A</option>
          <option value="status">ステータス順</option>
        </select>
      </div>

      {/* Tag Filter Buttons */}
      {allTags.length > 0 && (
        <div className="works-tag-filters" role="group" aria-label="タグで絞り込む">
          {allTags.map((tag) => (
            <button
              key={tag}
              type="button"
              className={`works-tag-btn${activeTags.has(tag) ? " active" : ""}`}
              onClick={() => toggleTag(tag)}
              aria-pressed={activeTags.has(tag)}
            >
              <span className="works-tag-icon" aria-hidden="true">
                <TagIcon tag={tag} size={13} />
              </span>
              {tag}
            </button>
          ))}
          {activeTags.size > 0 && (
            <button
              type="button"
              className="works-tag-clear"
              onClick={() => setActiveTags(new Set())}
              aria-label="タグフィルターをクリア"
            >
              ✕ クリア
            </button>
          )}
        </div>
      )}

      {/* Results count when filtered */}
      {(search.trim() || activeTags.size > 0) && (
        <p className="works-result-count">
          {filteredWorks.length} 件の作品が見つかりました
        </p>
      )}

      {/* Works Grid */}
      {filteredWorks.length === 0 ? (
        <p style={{ marginTop: "2rem", color: "var(--color-neutral-500)" }}>
          条件に一致する作品が見つかりませんでした。
        </p>
      ) : (
        <div className="works-grid" style={{ marginTop: "1.5rem" }}>
          {filteredWorks.map((work) => (
            <article key={work.id} className="work-card">
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
                    style={{ objectFit: "cover" }}
                    unoptimized
                  />
                </div>
              )}
              <div className="work-head">
                <h2 style={{ fontSize: "1.1rem", margin: 0 }}>{work.title}</h2>
                <span className={`badge badge-${work.status.toLowerCase()}`}>
                  {work.status}
                </span>
              </div>
              {work.description && (
                <p style={{ margin: "0.5rem 0" }}>{work.description}</p>
              )}
              {/* Clickable tag chips */}
              {work.tags.length > 0 && (
                <div className="chips">
                  {work.tags.map((tag) => (
                    <button
                      key={tag}
                      type="button"
                      className={`chip chip-tag${activeTags.has(tag) ? " chip-tag-active" : ""}`}
                      onClick={() => toggleTag(tag)}
                      title={`"${tag}" で絞り込む`}
                      aria-pressed={activeTags.has(tag)}
                    >
                      <TagIcon tag={tag} size={12} />
                      {tag}
                    </button>
                  ))}
                </div>
              )}
              <div className="chips chips-platform">
                {work.platforms.map((platform) => (
                  <span key={platform} className="chip platform-chip">
                    {platform}
                  </span>
                ))}
              </div>
              <div style={{ marginTop: "1rem", display: "flex", gap: "0.75rem" }}>
                <Link href={`/works/${work.slug}`} className="work-link">
                  詳細を見る →
                </Link>
                {work.link && (
                  <a
                    href={work.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="work-link"
                    style={{ marginLeft: "auto" }}
                  >
                    Visit ↗
                  </a>
                )}
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
