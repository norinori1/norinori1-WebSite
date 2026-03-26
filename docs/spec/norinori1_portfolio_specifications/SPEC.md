# norinori1 ゲーム開発ポートフォリオサイト - 技術仕様書

**プロジェクト名**: norinori1 Portfolio  
**バージョン**: 1.0.0  
**作成日**: 2025年3月27日  
**対象ユーザー**: ゲーム開発者（norinori1本人）、クライアント、採用担当者

---

## 📋 目次

1. [プロジェクト概要](#プロジェクト概要)
2. [ディレクトリ構造](#ディレクトリ構造)
3. [アセット管理](#アセット管理)
4. [デザインシステム](#デザインシステム)
5. [ページ構成](#ページ構成)
6. [コンポーネント設計](#コンポーネント設計)
7. [データ仕様](#データ仕様)
8. [レスポンシブ仕様](#レスポンシブ仕様)
9. [技術スタック](#技術スタック)
10. [開発ガイドライン](#開発ガイドライン)

---

## プロジェクト概要

### 目的
norinori1の成果物（ゲーム作品）をまとめたポートフォリオWebサイト。
ゲーム開発者としてのスキル、プロジェクト、研究領域を視覚的に展示し、
採用・協業の機会を生み出すことを目標とする。

### ターゲットユーザー
- ゲーム業界の採用担当者
- クライアント・協業パートナー候補
- ゲーム開発コミュニティメンバー
- 技術共有を求める学習者

### コア価値提案
- **多才性**: Unity、Roblox、Scratchの複数プラットフォーム対応
- **実績**: 5作品以上のリリース実績
- **継続性**: 最新技術（Unity × TensorFlow）への取り組み
- **透明性**: ベータ版公開によるコミュニティとの協働

---

## ディレクトリ構造

```
portfolio/
├── README.md                    # セットアップガイド
├── SPEC.md                      # このファイル
├── GAMES.md                     # 作品データ定義
├── index.html                   # エントリーポイント
├── package.json                 # Node.js設定（オプション）
├── style.css                    # グローバルスタイル
├── scripts/
│   └── main.js                  # メインロジック
├── assets/
│   ├── images/
│   │   ├── hero/
│   │   │   ├── hero-bg.png      [不可視] 背景画像
│   │   │   └── gradient-overlay.svg [不可視]
│   │   ├── logos/
│   │   │   ├── norinori1-icon.svg [不可視] メインロゴ
│   │   │   ├── unity-badge.svg [不可視]
│   │   │   ├── roblox-badge.svg [不可視]
│   │   │   └── scratch-badge.svg [不可視]
│   │   ├── games/
│   │   │   ├── zintoroad-thumbnail.png [不可視]
│   │   │   ├── puzzle-ball-thumbnail.png [不可視]
│   │   │   ├── block-crush-thumbnail.png [不可視]
│   │   │   └── [...game thumbnails...]
│   │   └── platforms/
│   │       ├── itch-io-icon.svg [不可視]
│   │       ├── scratch-icon.svg [不可視]
│   │       └── twitter-icon.svg [不可視]
│   ├── icons/
│   │   ├── chevron-right.svg [不可視]
│   │   ├── external-link.svg [不可視]
│   │   └── scroll-indicator.svg [不可視]
│   └── fonts/
│       ├── GeistMono-Regular.woff2
│       └── GeistSans-Regular.woff2
├── components/
│   ├── header.html
│   ├── hero.html
│   ├── games-section.html
│   ├── skills-section.html
│   ├── platforms-section.html
│   └── footer.html
└── data/
    ├── games.json               # GAMES.mdから生成
    ├── skills.json
    └── platforms.json
```

**[不可視]** = コピペ不可の画像アセット

---

## アセット管理

### 概要
このプロジェクトは**PNGおよびSVGを多用**します。
すべてのアセットはコピペ防止措置を施します。

### 画像フォーマット

#### PNG画像（ゲーム作品サムネイル）
**ファイル**: `assets/images/games/*.png`

| 用途 | サイズ | 色深度 | 圧縮 |
|------|--------|--------|------|
| ゲーム作品サムネイル | 360×240px | RGB | 最適化 |
| ゲーム詳細画像 | 720×480px | RGB | 最適化 |
| OG画像（SNS共有） | 1200×630px | RGB | 最適化 |

**コピペ防止手段**:
- ブラウザのコンテキストメニュー（右クリック）を無効化
- 画像要素に `user-select: none` 適用
- `draggable="false"` 属性設定
- データ属性を暗号化（Base64エンコード）

**実装例**:
```html
<img 
  src="assets/images/games/zintoroad-thumbnail.png"
  alt="ZINTOROAD game thumbnail"
  draggable="false"
  class="game-thumbnail"
  data-image-id="[encrypted-id]"
/>
```

```css
.game-thumbnail {
  user-select: none;
  -webkit-user-select: none;
  pointer-events: auto;
}

/* 右クリック無効化 */
.game-thumbnail {
  -webkit-touch-callout: none;
}
```

#### SVGアセット（ロゴ・アイコン）
**ファイル**: `assets/images/logos/*.svg`, `assets/icons/*.svg`

| 用途 | 例 | コピペ防止 |
|------|-----|-----------|
| メインロゴ | norinori1-icon.svg | インライン化 + 難読化 |
| 技術バッジ | unity-badge.svg, roblox-badge.svg | 背景画像化 |
| UIアイコン | chevron-right.svg, external-link.svg | CSS変数 |
| デコレーション | gradient-overlay.svg | フィルター適用 |

**コピペ防止手段**:

1. **SVGをバックグラウンド画像として使用**
```css
.logo {
  background: url('data:image/svg+xml;base64,[encoded]');
  background-size: contain;
  background-repeat: no-repeat;
  width: 120px;
  height: 40px;
}
```

2. **SVGをフィルターチェーンに埋め込み**
```html
<svg style="display: none;">
  <defs>
    <filter id="glow">
      <!-- フィルター定義 -->
    </filter>
  </defs>
</svg>
```

3. **インラインSVGの難読化**
```javascript
// SVG要素をJavaScriptで動的に生成・修正
// ソースコードから直接取得不可
```

### 画像最適化

**WebP対応**:
```html
<picture>
  <source srcset="assets/images/games/zintoroad.webp" type="image/webp">
  <img src="assets/images/games/zintoroad.png" alt="ZINTOROAD">
</picture>
```

**遅延ロード**:
```html
<img 
  src="assets/images/games/thumbnail.png"
  loading="lazy"
  alt="game thumbnail"
/>
```

**レスポンシブ画像**:
```html
<img 
  srcset="
    assets/images/games/thumbnail-320w.png 320w,
    assets/images/games/thumbnail-640w.png 640w,
    assets/images/games/thumbnail-1280w.png 1280w
  "
  sizes="(max-width: 600px) 100vw, (max-width: 1200px) 50vw, 33vw"
  src="assets/images/games/thumbnail-640w.png"
  alt="game thumbnail"
/>
```

---

## デザインシステム

### カラーパレット

#### プライマリカラー（ロゴベース）
```css
--color-primary-dark: #1F5BA6;      /* 濃いブルー（ロゴ外枠） */
--color-primary: #3B8FD9;           /* メインブルー */
--color-primary-light: #5BA3D0;     /* 明るいブルー */
--color-primary-lighter: #A7D8E8;   /* 薄いブルー */
```

#### セカンダリカラー
```css
--color-secondary: #0099FF;         /* アクティブブルー */
--color-secondary-light: #66C2FF;   /* ライトブルー */
```

#### ニュートラルカラー（白ベース）
```css
--color-neutral-50: #FFFFFF;        /* 背景（最白） */
--color-neutral-100: #F8FAFC;       /* オフホワイト */
--color-neutral-200: #E2E8F0;       /* 薄いグレー */
--color-neutral-300: #CBD5E1;       /* グレー */
--color-neutral-500: #64748B;       /* ダークグレー */
--color-neutral-700: #334155;       /* 濃いグレー */
--color-neutral-900: #0F172A;       /* テキスト（濃） */
```

#### アクセントカラー
```css
--color-success: #10B981;        /* 成功（緑） */
--color-warning: #F59E0B;        /* 注意（琥珀） */
--color-danger: #EF4444;         /* エラー（赤） */
```

### タイポグラフィ

#### フォント定義
```css
--font-display: 'Geist Mono', 'JetBrains Mono', monospace;    /* ロゴ・見出し */
--font-sans: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; /* 本文 */
--font-mono: 'Fira Code', 'Consolas', monospace;             /* コード */
```

#### スケール
```css
/* 見出し */
--text-h1: 3.5rem (56px);   font-weight: 700;
--text-h2: 2.5rem (40px);   font-weight: 700;
--text-h3: 1.5rem (24px);   font-weight: 600;
--text-h4: 1.25rem (20px);  font-weight: 600;

/* 本文 */
--text-lg: 1.125rem (18px); font-weight: 400;
--text-base: 1rem (16px);   font-weight: 400;
--text-sm: 0.875rem (14px); font-weight: 400;
--text-xs: 0.75rem (12px);  font-weight: 500;

/* 行間 */
--line-height-tight: 1.2;
--line-height-normal: 1.6;
--line-height-relaxed: 1.8;
```

### スペーシング

```css
--spacing-xs: 0.25rem (4px);
--spacing-sm: 0.5rem (8px);
--spacing-md: 1rem (16px);
--spacing-lg: 1.5rem (24px);
--spacing-xl: 2rem (32px);
--spacing-2xl: 3rem (48px);
--spacing-3xl: 4rem (64px);
```

### シャドウ・エフェクト

```css
--shadow-sm: 0 1px 2px rgba(0,0,0,0.05);
--shadow-md: 0 4px 6px rgba(0,0,0,0.1);
--shadow-lg: 0 10px 15px rgba(0,0,0,0.1);
--shadow-xl: 0 20px 25px rgba(0,0,0,0.1);

--shadow-glow: 0 0 20px rgba(59, 143, 217, 0.3);
--shadow-focus: 0 0 0 3px rgba(59, 143, 217, 0.1), 0 0 0 6px rgba(59, 143, 217, 0.2);
```

### ボーダー・角丸

```css
--border-radius-sm: 4px;
--border-radius-md: 8px;
--border-radius-lg: 12px;
--border-radius-xl: 16px;
--border-radius-full: 9999px;

--border-color-primary: rgba(59, 143, 217, 0.2);
--border-color-secondary: rgba(59, 143, 217, 0.4);
--border-color-light: #E2E8F0;
```

---

## ページ構成

### ページ一覧

| ページ | パス | 説明 |
|--------|------|------|
| ホーム | `/` | ランディングページ＋プロフィール |
| About | `/about` | プロフィール詳細 |
| Works | `/works` | ゲーム・ツール作品一覧 |
| News | `/news` | 最新情報・DevLog |
| ゲーム詳細 | `/games/:game-id` | 個別ゲーム情報ページ |
| スキル | `/skills` | 技術スキル＆研究領域 |
| プラットフォーム | `/platforms` | SNS・リンク集 |

### グローバルヘッダー

```
┌─────────────────────────────────────────────────┐
│  ◊ norinori1            ABOUT  WORKS  NEWS      │
└─────────────────────────────────────────────────┘
```

**構成**:
- **左側**: norinori1 ロゴ（アイコン + テキスト）
- **右側**: グローバルナビゲーション（3項目）

**デザイン特性**:
- 手書き風・有機的なアイコン
- モダンミニマル
- 固定ナビゲーション（スクロール時も常時表示）
- レスポンシブ: モバイルではハンバーガーメニュー化

### ページ構造（ホーム・`/`）

```
Header (Fixed Nav)
  ├── Logo
  ├── Menu Links
  └── CTA Button

Hero Section
  ├── Title
  ├── Subtitle
  ├── Gradient Background
  └── CTA Buttons

Featured Games Section
  ├── Section Title
  ├── Game Grid (3-5 cards)
  │   ├── Game Card
  │   │   ├── Thumbnail Image [PNG]
  │   │   ├── Title
  │   │   ├── Description
  │   │   ├── Tags
  │   │   ├── Platform Badges
  │   │   └── CTA Link
  │   └── [...more cards...]
  └── View All Link

Skills Section
  ├── Section Title
  ├── Skill Cards Grid
  │   ├── Skill Card (Engines)
  │   │   ├── Category Title
  │   │   ├── Skill Item
  │   │   │   ├── Skill Name
  │   │   │   ├── Level Badge
  │   │   │   └── Description
  │   │   └── [...more items...]
  │   └── Skill Card (Research)
  │       └── [...items...]
  └── Research Highlight Box

Platforms Section
  ├── Section Title
  ├── Platform Links Grid
  │   ├── Platform Card
  │   │   ├── Icon [SVG]
  │   │   ├── Platform Name
  │   │   ├── Description
  │   │   └── Visit Link
  │   └── [...more cards...]
  └── Social Links

Footer
  ├── Copyright
  ├── Links
  └── Built With
```

---

## コンポーネント設計

### ヘッダー（グローバル）

**概要**: 
固定ヘッダーで常にユーザーに表示。スクロール時に背景が濃くなり、視認性を保つ。

**構成要素**:
- ロゴ（アイコン + テキスト）
- グローバルナビゲーション（About / Works / News）
- モバイル用ハンバーガーメニュー

**ビジュアル仕様**:
```
Layout: Flexbox (space-between)
Logo: アイコン(32×32px) + テキスト(1.25rem, 700)
Navigation: 3項目、gap 2rem
Colors: テキスト #F1F5F9、ホバー #6366F1
Icons: ストロークベース（手書き風）
```

**インタラクション**:
- ホバー時: テキストカラー → primary color
- アクティブ時: 下線表示 + primary color
- スクロール時: 背景色濃度UP + backdrop blur

**レスポンシブ**:
- PC: フル表示
- タブレット: ナビゲーション圧縮
- モバイル: ハンバーガーメニュー

---

### 共有コンポーネント

#### GameCard
```html
<div class="game-card" data-game-id="[game-id]">
  <div class="game-card__image">
    <img 
      src="assets/images/games/[game-slug]-thumbnail.png"
      alt="[Game Title]"
      loading="lazy"
      draggable="false"
    />
    <div class="game-card__overlay">
      [Status Badge: Latest / Featured / etc.]
    </div>
  </div>
  <div class="game-card__content">
    <h3 class="game-card__title">[Game Title]</h3>
    <p class="game-card__description">[Description]</p>
    <div class="game-card__tags">
      [Tag1], [Tag2], [Tag3]
    </div>
    <div class="game-card__platforms">
      📱 [Platform1] • [Platform2]
    </div>
    <a href="[link]" class="game-card__cta">Play Now →</a>
  </div>
</div>
```

**スタイルの特徴**:
- ホバーで縮約 (translateY -8px)
- 背景色グラデーション遷移
- ボーダーカラー強調

#### SkillCard
```html
<div class="skill-card" style="--accent-color: [color];">
  <h3 class="skill-card__title">[Category]</h3>
  <div class="skill-card__items">
    <div class="skill-item">
      <div class="skill-item__header">
        <span class="skill-item__name">[Skill Name]</span>
        <span class="skill-item__level">[Level]</span>
      </div>
      <p class="skill-item__description">[Description]</p>
    </div>
  </div>
</div>
```

#### PlatformCard
```html
<a href="[platform-url]" class="platform-card" target="_blank">
  <div class="platform-card__icon">[SVG Icon]</div>
  <h4 class="platform-card__name">[Platform Name]</h4>
  <p class="platform-card__description">[Description]</p>
  <span class="platform-card__cta">Visit →</span>
</a>
```

### リユーザブルUIパターン

#### Badge
```html
<span class="badge badge--[variant]">[Text]</span>
```

**バリアント**: `primary`, `success`, `warning`, `danger`

#### Button
```html
<a href="[url]" class="button button--[variant]">[Text]</a>
<button class="button button--[variant]">[Text]</button>
```

**バリアント**: `primary`, `secondary`, `ghost`

#### Grid System
```css
/* 3-column default, 2-column tablet, 1-column mobile */
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: var(--spacing-lg);
}
```

---

## データ仕様

### 作品データ形式

**定義**: `GAMES.md` を参照

作品データは別の `GAMES.md` ファイルで管理されます。
このファイルには以下の情報が含まれます：

- ゲームID
- タイトル
- 説明
- 画像パス（PNG サムネイル）
- リンク（itch.io、Scratchなど）
- タグ
- プラットフォーム
- ステータス（Latest、Featured等）
- リリース日
- 開発環境

**データ構造例** (JSON):
```json
{
  "id": "zintoroad-beta",
  "title": "ZINTOROAD[beta]",
  "description": "Survivor-like Rogue-lite × Real-Time Resource Management",
  "thumbnail": "assets/images/games/zintoroad-thumbnail.png",
  "link": "https://norinori1.itch.io/zintoroad-beta",
  "tags": ["Unity", "Strategic", "Resource Management"],
  "platforms": ["PC", "Web"],
  "status": "Latest",
  "releaseDate": "2025-12-15",
  "engines": ["Unity", "C#"]
}
```

### スキルデータ形式

```json
{
  "category": "Engines & Platforms",
  "accentColor": "#6366F1",
  "items": [
    {
      "name": "C# + Unity",
      "level": "Expert",
      "description": "Primary development environment"
    }
  ]
}
```

### プラットフォームデータ形式

```json
{
  "name": "itch.io",
  "url": "https://norinori1.itch.io",
  "icon": "assets/icons/itch-io-icon.svg",
  "description": "Game distribution & showcase"
}
```

---

## レスポンシブ仕様

### ブレークポイント

```css
/* モバイルファースト */
--bp-sm: 640px;   /* スマートフォン横向き */
--bp-md: 768px;   /* タブレット */
--bp-lg: 1024px;  /* デスクトップ */
--bp-xl: 1280px;  /* 大画面 */
--bp-2xl: 1536px; /* 超大画面 */
```

### レイアウト対応

#### ゲームグリッド
- **モバイル** (<640px): 1列
- **タブレット** (640-1024px): 2列
- **デスクトップ** (>1024px): 3列

#### スキルグリッド
- **モバイル** (<640px): 1列
- **タブレット** (640-1024px): 1列
- **デスクトップ** (>1024px): 2列

#### プラットフォームグリッド
- **モバイル** (<640px): 1列
- **タブレット** (640-1024px): 3列
- **デスクトップ** (>1024px): 3列

### タッチ・クリック対応

```css
/* タップターゲット最小サイズ 44×44px */
.button,
.game-card,
a {
  min-height: 44px;
  min-width: 44px;
}

/* タッチデバイス用メディアクエリ */
@media (hover: none) and (pointer: coarse) {
  /* ホバーエフェクト無効化 */
  .game-card:hover {
    transform: none;
  }
  
  /* アクティブ状態を強調 */
  .game-card:active {
    opacity: 0.8;
  }
}
```

---

## 技術スタック

### フロントエンド

| レイヤー | 技術 | 理由 |
|---------|------|------|
| マークアップ | HTML5 | セマンティック構造 |
| スタイリング | CSS3 (Grid, Flexbox) | モダンレイアウト |
| インタラクション | Vanilla JavaScript (ES6+) | 軽量 |
| フレームワーク | React (オプション) | ポートフォリオ拡張時 |
| アナリティクス | Google Analytics 4 (GA4) | ユーザー行動分析 |

### アセット処理

- **画像**: PNG, WebP, SVG
- **フォント**: WOFF2 (自己ホスト)
- **アイコン**: インラインSVG / CSS変数

### パフォーマンス

- **バンドルサイズ**: < 100KB
- **Lighthouse スコア**: > 90 (全項目)
- **ファースト・コンテントフル・ペイント**: < 1.5s

### デプロイメント

- GitHub Pages
- Vercel
- Netlify

---

## Google Analytics 4 (GA4) 実装

### 概要

Google Analytics 4 を組み込み、ユーザー行動、ページビュー、イベントを追跡します。

### セットアップ

#### 1. GA4プロパティ作成

1. [Google Analytics コンソール](https://analytics.google.com)にアクセス
2. 新しいプロパティを作成（プロパティ名: `norinori1 Portfolio`）
3. **測定ID** を取得（`G-XXXXXXXXXX` の形式）

#### 2. サイトへの実装

```html
<!-- HTML内の <head> タグに追加 -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-XXXXXXXXXX', {
    'page_path': window.location.pathname,
    'anonymize_ip': true  // IPアドレスは記録しない
  });
</script>
```

**注**: `G-XXXXXXXXXX` を自分の測定IDに置き換えてください

#### 3. React実装（オプション）

```javascript
// src/components/GA4.js
export function initializeGA4(measurementId) {
  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
  document.head.appendChild(script);

  window.dataLayer = window.dataLayer || [];
  function gtag(){window.dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', measurementId, {
    'page_path': window.location.pathname,
    'anonymize_ip': true
  });
}

// App.jsで呼び出し
import { useEffect } from 'react';
import { initializeGA4 } from './components/GA4';

export default function App() {
  useEffect(() => {
    initializeGA4('G-XXXXXXXXXX');
  }, []);
  
  return (/* ... */);
}
```

### トラッキングイベント

#### ページビュー

GA4は自動的にページビューを追跡します。

#### カスタムイベント（ゲームクリック）

```javascript
// ゲームカードクリック時
function trackGameClick(gameId, gameTitle) {
  gtag('event', 'game_click', {
    'game_id': gameId,
    'game_title': gameTitle,
    'event_category': 'engagement',
    'event_label': 'game_card'
  });
}

// 使用例
document.querySelectorAll('.game-card').forEach(card => {
  card.addEventListener('click', (e) => {
    const gameId = card.dataset.gameId;
    const gameTitle = card.querySelector('h3').textContent;
    trackGameClick(gameId, gameTitle);
  });
});
```

#### リンククリック（外部リンク）

```javascript
// 外部リンククリック追跡
function trackExternalLink(url, label) {
  gtag('event', 'click', {
    'event_category': 'engagement',
    'event_label': label,
    'value': url
  });
}

// 使用例
document.querySelectorAll('a[target="_blank"]').forEach(link => {
  link.addEventListener('click', () => {
    trackExternalLink(link.href, link.textContent);
  });
});
```

#### スクロール深度

```javascript
// ページのスクロール深度を追跡
let scrollPercentages = [];

window.addEventListener('scroll', () => {
  const scrolled = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
  const roundedScroll = Math.floor(scrolled / 10) * 10;
  
  if (!scrollPercentages.includes(roundedScroll) && roundedScroll > 0) {
    scrollPercentages.push(roundedScroll);
    gtag('event', 'scroll_depth', {
      'event_category': 'engagement',
      'event_label': `${roundedScroll}%`,
      'value': roundedScroll
    });
  }
});
```

### ダッシュボード設定

#### 重要なレポート

1. **ユーザー概要**
   - 総セッション数
   - アクティブユーザー数
   - セッションごとの平均エンゲージメント時間

2. **ユーザーの行動**
   - ページビュー数
   - スクロール深度
   - 平均セッション時間

3. **コンバージョン**（カスタムイベント）
   - ゲームクリック数
   - 外部リンククリック数
   - プラットフォーム別クリック数

4. **トラフィックの獲得**
   - 参照元別ユーザー
   - キャンペーン別パフォーマンス

### プライバシー設定

#### GDPR / CCPA 対応

```javascript
// ユーザーがクッキーに同意する前にGA4を初期化しない
function initializeGA4WithConsent() {
  // クッキー同意バナーから同意を確認
  if (localStorage.getItem('cookie-consent') === 'true') {
    gtag('consent', 'update', {
      'analytics_storage': 'granted'
    });
    initializeGA4('G-XXXXXXXXXX');
  }
}

document.addEventListener('DOMContentLoaded', initializeGA4WithConsent);
```

#### データ保護

- **匿名化**: IP アドレスを自動的に匿名化
- **保有期間**: 14 ヶ月でデータを自動削除
- **個人を特定できない**: GA4 は個人識別情報（PII）の送信を禁止

### トラブルシューティング

#### GA4が動作していない確認

```javascript
// ブラウザ開発者ツールのコンソールで実行
window.dataLayer
// [Array] が表示されればOK

gtag('config', 'G-XXXXXXXXXX')
// undefined が表示されればOK
```

#### デバッグモード有効化

```javascript
gtag('config', 'G-XXXXXXXXXX', {
  'debug_mode': true  // 開発環境のみ有効
});
```

---

## 開発ガイドライン

### コーディング規約

#### HTML
```html
<!-- セマンティックなマークアップ -->
<section id="games" aria-label="Featured Games">
  <h2>Featured Games</h2>
  <div class="game-grid" role="list">
    <article class="game-card" role="listitem">
      <!-- コンテンツ -->
    </article>
  </div>
</section>
```

#### CSS
```css
/* BEM命名規則 */
.game-card { }
.game-card__image { }
.game-card__content { }
.game-card--featured { }

/* CSS変数 */
.game-card {
  background: var(--color-neutral-800);
  padding: var(--spacing-lg);
  border-radius: var(--border-radius-lg);
}
```

#### JavaScript
```javascript
// モジュール化
const GameCard = {
  init() { },
  render() { },
  handleClick() { }
};

// イベントリスナー
document.querySelectorAll('.game-card').forEach(card => {
  card.addEventListener('click', GameCard.handleClick);
});
```

### アクセシビリティ

#### WCAG 2.1 Level AA対応
- すべての画像に `alt` テキスト
- キーボードナビゲーション対応
- カラーコントラスト比 4.5:1 以上
- フォーカスインジケータ可視化

#### スクリーンリーダー
```html
<a href="[url]" aria-label="Play ZINTOROAD on itch.io">
  <img src="thumbnail.png" alt="ZINTOROAD game thumbnail" />
</a>
```

### テスト

#### ユニットテスト
- JavaScript 関数ロジック
- データ変換・フィルタリング

#### E2Eテスト
- リンククリック
- ページナビゲーション
- フォーム送信（あれば）

#### ビジュアルリグレッション
- スクリーンショット比較
- レスポンシブブレークポイント確認

### パフォーマンス最適化

```javascript
// 画像の遅延ロード
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const img = entry.target;
      img.src = img.dataset.src;
      observer.unobserve(img);
    }
  });
});

document.querySelectorAll('img[data-src]').forEach(img => {
  observer.observe(img);
});
```

### バージョン管理

```bash
# Git ブランチ戦略: Git Flow
main                  # 本番環境
├── release/v1.0.0
└── develop          # 開発環境
    ├── feature/add-game-detail
    ├── feature/improve-mobile-ux
    └── fix/button-hover-bug
```

---

## 補足

### 画像アセットのコピペ防止技術詳細

#### 実装例

```html
<!-- HTML内の保護 -->
<img 
  src="assets/images/games/game.png"
  alt="Game Title"
  draggable="false"
  class="protected-image"
  oncontextmenu="return false;"
/>
```

```css
/* CSS での保護 */
.protected-image {
  user-select: none;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  -webkit-touch-callout: none;
  pointer-events: auto;
}

/* 背景画像化 */
.logo {
  background-image: url('data:image/svg+xml;base64,...');
  background-size: cover;
  background-position: center;
}
```

```javascript
/* JavaScript での保護 */
document.addEventListener('copy', (e) => {
  const selection = window.getSelection();
  if (selection.toString().includes('[画像]')) {
    e.preventDefault();
  }
});

// 画像ダウンロード防止
document.querySelectorAll('img').forEach(img => {
  img.addEventListener('dragstart', (e) => {
    e.preventDefault();
    return false;
  });
});
```

### 今後の拡張予定

- [ ] ゲーム詳細ページ（個別ページ化）
- [ ] ブログ機能（開発ログ）
- [ ] コンタクトフォーム
- [ ] 多言語対応（日本語、英語）
- [ ] ダークモード自動切り替え
- [ ] PWA化（オフライン対応）

---

**最終更新**: 2025年3月27日  
**ドキュメント所有者**: norinori1  
**レビュアー**: [要設定]
