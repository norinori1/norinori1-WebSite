"use client";

import { useState, useMemo, useRef } from "react";
import Link from "next/link";
import type { Work } from "@/types/notion";
import { filterWorks, sortWorks, groupWorks, isFeaturedWork, type SortOption } from "@/lib/works-gallery";
import styles from "./WorksClient.module.css";
import Thumbnail from "@/components/Thumbnail";
import WorkCategoryArtwork from "@/components/WorkCategoryArtwork";
import PlatformIcon, { UIIcon, type IconName } from "@/components/PlatformIcon";

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

// Platform names that map to SVG icons
const PLATFORM_SVG_ICONS: Record<string, IconName> = {
  Unity: "unity",
  Roblox: "roblox",
  Scratch: "scratch",
  Discord: "discord",
  GitHub: "github",
  Web: "web",
};

export default function WorksClient({ works }: { works: Work[] }) {
  const [search, setSearch] = useState("");
  const [activeTags, setActiveTags] = useState<Set<string>>(new Set());
  const [activePlatforms, setActivePlatforms] = useState<Set<string>>(new Set());
  const [sort, setSort] = useState<SortOption>("default");
  const [isExpanded, setIsExpanded] = useState(false);
  const filterToggleRef = useRef<HTMLButtonElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  const allTags = useMemo(() =>
    Array.from(new Set(works.flatMap((work) => work.tags))).sort((a, b) => a.localeCompare(b, "ja")), [works]);
  const allPlatforms = useMemo(() =>
    Array.from(new Set(works.flatMap((work) => work.platforms))).sort((a, b) => a.localeCompare(b, "ja")), [works]);
  const filteredWorks = useMemo(() =>
    sortWorks(filterWorks(works, search, activeTags, activePlatforms), sort),
    [works, search, activeTags, activePlatforms, sort]);
  const groups = useMemo(() => groupWorks(filteredWorks), [filteredWorks]);
  const activeFilterCount = activeTags.size + activePlatforms.size;

  function toggleSelection(value: string, setter: typeof setActiveTags) {
    setter((previous) => {
      const next = new Set(previous);
      if (next.has(value)) next.delete(value);
      else next.add(value);
      return next;
    });
  }

  function clearFilters() {
    setActiveTags(new Set());
    setActivePlatforms(new Set());
  }

  function resetSearch() {
    setSearch("");
    clearFilters();
    searchRef.current?.focus();
  }

  return (
    <div className={styles.gallery}>
      <div className={styles.toolbar}>
        <div className={styles.controls}>
          <div className={styles.searchWrap}>
            <span className="works-search-icon" aria-hidden="true">
              <UIIcon name="search" size={16} />
            </span>
            <input
              ref={searchRef}
              type="search"
              className={`works-search ${styles.search}`}
              placeholder="作品名・説明で検索..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              aria-label="作品を検索"
            />
          </div>
          <select
            className={`works-sort ${styles.sort}`}
            value={sort}
            onChange={(event) => setSort(event.target.value as SortOption)}
            aria-label="並び順"
          >
            <option value="default">Featured 優先</option>
            <option value="title-asc">タイトル A → Z</option>
            <option value="title-desc">タイトル Z → A</option>
            <option value="status">ステータス順</option>
          </select>
          {(allPlatforms.length > 0 || allTags.length > 0) && (
            <button
              ref={filterToggleRef}
              type="button"
              className={`works-filter-toggle ${styles.filterToggle}`}
              onClick={() => setIsExpanded((previous) => !previous)}
              aria-expanded={isExpanded}
              aria-controls="works-filters-panel"
            >
              フィルター
              {activeFilterCount > 0 && <span className="filter-count-badge">{activeFilterCount}</span>}
              <UIIcon name="chevronDown" size={14} />
            </button>
          )}
        </div>

        <div
          id="works-filters-panel"
          className={styles.filterPanel}
          hidden={!isExpanded}
          inert={!isExpanded}
          onKeyDown={(event) => {
            if (event.key === "Escape") {
              setIsExpanded(false);
              filterToggleRef.current?.focus();
            }
          }}
        >
          {allPlatforms.length > 0 && (
            <fieldset className={styles.filterGroup}>
              <legend>プラットフォーム <span>いずれかに一致</span></legend>
              <div className="works-tag-filters">
                {allPlatforms.map((platform) => (
                  <button
                    key={platform}
                    type="button"
                    className={`works-tag-btn ${styles.filterButton}${activePlatforms.has(platform) ? " active" : ""}`}
                    onClick={() => toggleSelection(platform, setActivePlatforms)}
                    aria-pressed={activePlatforms.has(platform)}
                  >
                    <span className="works-tag-icon" aria-hidden="true">
                      <PlatformIcon name={PLATFORM_SVG_ICONS[platform] ?? "web"} size={13} />
                    </span>
                    {platform}
                  </button>
                ))}
              </div>
            </fieldset>
          )}
          {allTags.length > 0 && (
            <fieldset className={styles.filterGroup}>
              <legend>タグ <span>すべてに一致</span></legend>
              <div className="works-tag-filters">
                {allTags.map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    className={`works-tag-btn ${styles.filterButton}${activeTags.has(tag) ? " active" : ""}`}
                    onClick={() => toggleSelection(tag, setActiveTags)}
                    aria-pressed={activeTags.has(tag)}
                  >
                    <span className="works-tag-icon" aria-hidden="true"><TagIcon tag={tag} size={13} /></span>
                    {tag}
                  </button>
                ))}
              </div>
            </fieldset>
          )}
        </div>
      </div>

      {activeFilterCount > 0 && (
        <div className={styles.activeFilters} role="group" aria-label="選択中のフィルター">
          {Array.from(activePlatforms).map((platform) => (
            <button key={`platform-${platform}`} type="button" className={styles.removeChip}
              onClick={() => toggleSelection(platform, setActivePlatforms)}
              aria-label={`プラットフォーム ${platform} を解除`}>
              <span>環境: {platform}</span><UIIcon name="close" size={13} />
            </button>
          ))}
          {Array.from(activeTags).map((tag) => (
            <button key={`tag-${tag}`} type="button" className={styles.removeChip}
              onClick={() => toggleSelection(tag, setActiveTags)}
              aria-label={`タグ ${tag} を解除`}>
              <span>タグ: {tag}</span><UIIcon name="close" size={13} />
            </button>
          ))}
          <button type="button" className={styles.resetButton} onClick={clearFilters}>
            フィルター全解除
          </button>
        </div>
      )}

      <p className={styles.resultCount} role="status" aria-live="polite" aria-atomic="true">
        {filteredWorks.length} 件の作品
        {search.trim() || activeFilterCount > 0 ? ` / 全 ${works.length} 件` : ""}
      </p>

      {groups.length > 0 && (
        <nav className={styles.categoryNav} aria-label="作品カテゴリへ移動">
          {groups.map((group) => (
            <a key={group.category} href={`#${group.id}`}>
              <WorkCategoryArtwork category={group.category} className={styles.categoryNavArtwork} />
              {group.label}<span aria-label={`${group.works.length} 件`}>{group.works.length}</span>
            </a>
          ))}
        </nav>
      )}

      {filteredWorks.length === 0 ? (
        <div className="state-panel">
          <h2>該当する作品がありません</h2>
          <p>検索語やフィルターの条件を変えてみてください。</p>
          <button type="button" className={styles.resetButton} onClick={resetSearch}>
            検索・絞り込みをリセット
          </button>
        </div>
      ) : groups.map((group) => (
        <section key={group.category} className={styles.categorySection} aria-labelledby={group.id}>
          <div className={styles.categoryHead}>
            <span className={styles.categoryNumber} aria-hidden="true">{group.number}</span>
            <WorkCategoryArtwork category={group.category} className={styles.categoryArtwork} />
            <h2 id={group.id} tabIndex={-1}>{group.label}</h2>
            <span className={styles.categoryCount}>{group.works.length} 件</span>
          </div>
          <div className={styles.grid}>
            {group.works.map((work) => (
              <article key={work.id} className={styles.card}>
                <Link href={`/works/${work.slug}`}
                  className={`${styles.cardLink}${isFeaturedWork(work) ? ` ${styles.featured}` : ""}`}>
                  <div className={styles.artwork}>
                    {work.thumbnailUrl ? (
                      <Thumbnail
                        src={`/api/notion-image?pageId=${work.id}&prop=Thumbnail`}
                        alt={`${work.title} のサムネイル`}
                        sizes="(min-width: 1024px) 280px, (min-width: 640px) 30vw, 45vw"
                      />
                    ) : (
                      <div className={styles.placeholder} aria-hidden="true">
                        <UIIcon name="hexArrowRight" size={36} strokeWidth={1} />
                        <span>WORKS</span>
                      </div>
                    )}
                    {isFeaturedWork(work) && (
                      <span className={styles.featuredBadge}>★ Featured</span>
                    )}
                  </div>
                  <div className={styles.cardBody}>
                    <h3 className={styles.cardTitle} title={work.title}>{work.title}</h3>
                    <span className={`badge badge-${work.status.toLowerCase()} ${styles.status}`}>
                      {work.status}
                    </span>
                    {work.tags.length > 0 && (
                      <div className={styles.tags}>
                        {work.tags.slice(0, 2).map((tag) => (
                          <span key={tag} className={styles.tag} title={tag}>{tag}</span>
                        ))}
                      </div>
                    )}
                  </div>
                </Link>
              </article>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
