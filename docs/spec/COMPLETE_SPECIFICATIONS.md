# norinori1 ゲーム開発者ポートフォリオサイト - 完全仕様書

**プロジェクト名**: norinori1 Game Developer Portfolio  
**バージョン**: 1.0.0  
**作成日**: 2025年3月27日  
**最終更新**: 2025年3月27日

---

# 📑 目次

1. [プロジェクトサマリー](#プロジェクトサマリー)
2. [技術仕様](#技術仕様)
3. [カラースキーム](#カラースキーム)
4. [ゲーム・ツール作品定義](#ゲームツール作品定義)
5. [ヘッダー設計](#ヘッダー設計)
6. [ホームページ設計](#ホームページ設計)
7. [フッター・プラットフォーム設計](#フッタープラットフォーム設計)
8. [GA4実装ガイド](#ga4実装ガイド)
9. [実装チェックリスト](#実装チェックリスト)
10. [デプロイメント](#デプロイメント)

---

# プロジェクトサマリー

## 概要

norinori1の成果物（9つのゲーム・ツール）をまとめたモダンなポートフォリオWebサイト。
複数プラットフォーム展開（Unity、Roblox、Scratch）での開発実績を視覚的に展示。

## 目的

- ゲーム業界の採用担当者へのアピール
- クライアント・協業パートナー開拓
- ゲーム開発コミュニティとの連携

## ターゲットユーザー

- ゲーム業界採用担当者
- クライアント・協業パートナー候補
- ゲーム開発コミュニティメンバー
- 技術共有を求める学習者

## コア価値提案

- **多才性**: Unity、Roblox、Scratchの複数プラットフォーム対応
- **実績**: 6ゲーム + 2ツール = 9プロジェクト
- **継続性**: 最新技術（Unity × TensorFlow）への取り組み
- **透明性**: ベータ版公開によるコミュニティとの協働

---

# 技術仕様

## テックスタック

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

## ディレクトリ構造

```
portfolio/
├── README.md
├── index.html
├── landing-improved.html
├── portfolio.html
├── portfolio.jsx
├── style.css (optional)
├── scripts/
│   └── main.js
├── assets/
│   ├── images/
│   │   ├── hero/
│   │   ├── logos/
│   │   ├── games/
│   │   ├── tools/
│   │   └── icons/
│   ├── fonts/
│   └── favicons/
├── components/
│   ├── header.html
│   ├── hero.html
│   ├── games-section.html
│   ├── skills-section.html
│   ├── platforms-section.html
│   └── footer.html
└── data/
    ├── games.json
    ├── skills.json
    └── platforms.json
```

---

# カラースキーム

## プライマリカラー（ロゴベース）

```css
--color-primary-dark: #1F5BA6;      /* 濃いブルー（ロゴ外枠） */
--color-primary: #3B8FD9;           /* メインブルー */
--color-primary-light: #5BA3D0;     /* 明るいブルー */
--color-primary-lighter: #A7D8E8;   /* 薄いブルー */
```

## ニュートラルカラー（白ベース）

```css
--color-neutral-50: #FFFFFF;        /* 背景（最白） */
--color-neutral-100: #F8FAFC;       /* オフホワイト */
--color-neutral-200: #E2E8F0;       /* 薄いグレー */
--color-neutral-300: #CBD5E1;       /* グレー */
--color-neutral-500: #64748B;       /* ダークグレー */
--color-neutral-700: #334155;       /* 濃いグレー */
--color-neutral-900: #0F172A;       /* テキスト（濃） */
```

## アクセントカラー

```css
--color-success: #10B981;           /* 成功（緑） */
--color-warning: #F59E0B;           /* 注意（琥珀） */
--color-danger: #EF4444;            /* エラー（赤） */
```

## 色の使用例

- **ヘッダー背景**: #FFFFFF
- **ヘッダーテキスト**: #1F5BA6 (primary-dark)
- **ナビゲーション（デフォルト）**: #64748B (neutral-500)
- **ナビゲーション（ホバー/アクティブ）**: #3B8FD9 (primary)
- **ボタン（プライマリ）**: #FFFFFF背景 + #1F5BA6テキスト
- **ボタン（セカンダリ）**: transparent背景 + #FFFFFF テキスト

---

# ゲーム・ツール作品定義

## ゲーム（6作品）

### 1. ZINTOROAD

```yaml
id: zintoroad
type: game
title: ZINTOROAD
description: "Survivor-like Rogue-lite × Real-Time Resource Management"
link: "https://norinori1.itch.io/zintoroad-beta"
tags: ["Unity", "Strategic", "Resource Management"]
platforms: ["PC", "Web"]
status: "Latest"
engines: ["Unity", "C#"]
```

### 2. ROGUE LYCAN

```yaml
id: rogue-lycan
type: game
title: ROGUE LYCAN
description: "Discord Activity Rogue-like Game"
link: "https://norinori1.github.io/Rogue-Lycan-Discord-Activity/"
tags: ["Discord", "Web", "Rogue-like"]
platforms: ["Discord", "Web"]
status: "Featured"
engines: ["HTML5", "JavaScript"]
repository: "https://github.com/norinori1/Rogue-Lycan-Discord-Activity"
```

### 3. POLARITY UNDER

```yaml
id: polarity-under
type: game
title: POLARITY UNDER
description: "Puzzle-based Action Game"
link: "https://unityroom.com/games/polarity_under"
tags: ["Unity", "Puzzle", "Action"]
platforms: ["Web", "Windows"]
status: "Released"
engines: ["Unity", "C#"]
```

### 4. Puzzle Ball Stage Maker

```yaml
id: puzzle-ball-stage-maker
type: game
title: "Puzzle Ball Stage Maker"
description: "Creative puzzle game stage editor"
link: "https://norinori1.itch.io"
tags: ["Puzzle", "Creative", "Level Editor"]
platforms: ["Web"]
status: "Featured"
engines: ["Unity", "C#"]
```

### 5. Block Crushing Game

```yaml
id: block-crushing-game
type: game
title: "Block Crushing Game"
description: "Classic block-crushing puzzle mechanics"
link: "https://norinori1.itch.io"
tags: ["Puzzle", "Casual", "Classic"]
platforms: ["Web", "Download"]
status: "Released"
engines: ["Unity", "C#"]
```

### 6. Puzzle Ball 3!

```yaml
id: puzzle-ball-3
type: game
title: "Puzzle Ball 3!"
description: "Advanced puzzle ball mechanics"
link: "https://norinori1.itch.io"
tags: ["Puzzle", "Physics", "Challenging"]
platforms: ["Web"]
status: "Released"
engines: ["Unity", "C#"]
```

## ツール（2本）

### 1. Scratch Text Asset Creator

```yaml
id: scratch-text-asset-creator
type: tool
title: "Scratch Text Asset Creator"
description: "Create text-based assets for Scratch projects"
link: "https://norinori1.github.io/Scratch-Text-Asset-Creator/"
tags: ["Scratch", "Utility", "Open Source"]
platforms: ["Web"]
status: "Released"
repository: "https://github.com/norinori1/Scratch-Text-Asset-Creator"
```

### 2. Scratch Data Structures Generator

```yaml
id: scratch-data-structures-generator
type: tool
title: "Scratch Data Structures Generator"
description: "Generate complex data structures for Scratch"
link: "https://norinori1.github.io/Scratch-Data-Stractures-Generator/"
tags: ["Scratch", "Developer Tool", "Code Generation"]
platforms: ["Web"]
status: "Released"
repository: "https://github.com/norinori1/Scratch-Data-Stractures-Generator"
```

---

# ヘッダー設計

## ビジュアル仕様

```
┌─────────────────────────────────────┐
│  ◊ norinori1          About Works News│
└─────────────────────────────────────┘
```

### ロゴ

- **サイズ**: 32×32px（アイコン）+ テキスト
- **フォント**: Monospace (Geist Mono, JetBrains Mono)
- **色**: テキスト #1F5BA6、アイコン グラデーション (#3B8FD9 → #1F5BA6)
- **ホバー**: opacity 0.8

### ナビゲーション

- **アイテム数**: 3 (About / Works / News)
- **ギャップ**: 2rem (デスクトップ)
- **色デフォルト**: #64748B (neutral-500)
- **色ホバー**: #3B8FD9 (primary)
- **アイコン**: SVG（ストロークベース、20×20px）

### スタイル

- **背景**: #FFFFFF
- **ボーダー**: 1px solid #E2E8F0
- **固定**: position fixed
- **高さ**: 64px
- **スクロール時**: 背景 rgba(255, 255, 255, 0.95) + blur(10px)

### レスポンシブ

- **PC (> 768px)**: フル表示
- **モバイル (< 768px)**: ハンバーガーメニュー

---

# ホームページ設計

## セクション構成

### 1. ヒーロー/ランディング

```
高さ: 100vh
背景: linear-gradient(135deg, #1F5BA6 0%, #A7D8E8 100%)
要素:
  - ロゴ（120×120px）
  - タイトル（3.5rem）
  - サブタイトル（1.5rem）
  - 説明テキスト
  - CTA ボタン（2個）
  - スクロール示唆
```

### 2. フィーチャーゲーム

```
グリッド: 3列（自動フィット）
カード数: 6
カード構成:
  - 画像（360×240px）
  - タイトル
  - 説明
  - タグ
  - プラットフォームバッジ
  - リンク
```

### 3. スキル/技術

```
グリッド: 2列（自動フィット）
カード数: 4
カテゴリ:
  - Game Engines
  - Languages
  - Research
  - Tools & Workflow
```

### 4. プラットフォーム/SNS

```
グリッド: 3列（自動フィット）
カード数: 6
プラットフォーム:
  - itch.io
  - X (Twitter)
  - GitHub
  - Scratch
  - Discord
  - unityroom
```

### 5. フッター

```
背景: #0F172A
テキスト: #F1F5F9
セクション数: 4
  - ブランド情報
  - Navigation
  - Resources
  - Follow
```

---

# フッター・プラットフォーム設計

## プラットフォームカード仕様

- **グリッド**: repeat(auto-fit, minmax(280px, 1fr))
- **ギャップ**: 2rem
- **カード背景**: linear-gradient(135deg, #FFFFFF 0%, #F8FAFC 100%)
- **ボーダー**: 2px solid #E2E8F0
- **ホバー**: 
  - transform: translateY(-8px)
  - border-color: #3B8FD9
  - box-shadow: 0 12px 24px rgba(59, 143, 217, 0.15)

## フッター仕様

- **背景**: #0F172A
- **パディング**: 4rem 0 2rem
- **グリッド**: auto-fit, minmax(250px, 1fr)
- **テキスト色**: #F1F5F9
- **ボーダー**: rgba(255, 255, 255, 0.1)

---

# GA4実装ガイド

## 基本設定

```html
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-XXXXXXXXXX', {
    'page_path': window.location.pathname,
    'anonymize_ip': true
  });
</script>
```

## トラッキングイベント

| イベント | トリガー | パラメータ |
|---------|---------|----------|
| `section_view` | セクション表示 | section_id, section_name |
| `game_card_click` | ゲームカード | game_id, game_title |
| `game_link_click` | ゲームリンク | game_id, destination_url |
| `header_nav_click` | ヘッダーナビ | nav_item |
| `platform_link_click` | プラットフォーム | platform_name |
| `social_link_click` | ソーシャル | platform |
| `footer_link_click` | フッターリンク | link_text |

## JavaScript実装例

```javascript
// セクション表示トラッキング
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      gtag('event', 'section_view', {
        'section_id': entry.target.id,
        'section_name': entry.target.querySelector('h2')?.textContent,
        'event_category': 'engagement'
      });
    }
  });
}, { threshold: 0.25 });

document.querySelectorAll('section').forEach(section => {
  observer.observe(section);
});

// ゲームカードクリック
document.querySelectorAll('.game-card').forEach(card => {
  card.addEventListener('click', () => {
    gtag('event', 'game_card_click', {
      'game_id': card.dataset.gameId,
      'game_title': card.querySelector('.game-card__title').textContent,
      'event_category': 'engagement'
    });
  });
});
```

---

# 実装チェックリスト

## 設計

- [ ] ロゴ色修正完了（テキスト → #1F5BA6）
- [ ] カラーパレット確定
- [ ] レスポンシブブレークポイント確定
- [ ] コンポーネント設計完了

## マークアップ

- [ ] HTML5セマンティック構造
- [ ] Meta タグ（OG, Twitter Card）
- [ ] アクセシビリティ属性（ARIA）
- [ ] 画像 alt テキスト
- [ ] 構造化データ（Schema.org）

## スタイリング

- [ ] CSS変数定義
- [ ] レスポンシブデザイン実装
- [ ] ホバー/フォーカス状態
- [ ] アニメーション
- [ ] ダークモード（オプション）

## インタラクション

- [ ] ナビゲーション動作
- [ ] スクロール検出
- [ ] フォーム（コンタクト等）
- [ ] モーダル（あれば）

## アナリティクス

- [ ] GA4スクリプト追加
- [ ] イベント トラッキング設定
- [ ] ゴール定義
- [ ] ダッシュボード作成

## パフォーマンス

- [ ] 画像最適化
- [ ] ファイルサイズチェック
- [ ] Lighthouse スコア確認
- [ ] キャッシュ戦略設定

## デプロイ

- [ ] Git リポジトリ初期化
- [ ] .gitignore 設定
- [ ] README 作成
- [ ] LICENSE 追加
- [ ] デプロイ先決定（GitHub/Vercel/Netlify）

## テスト

- [ ] ブラウザ互換性テスト
- [ ] モバイルデバイステスト
- [ ] アクセシビリティテスト
- [ ] SEO テスト

---

# デプロイメント

## GitHub Pages

```bash
# リポジトリ初期化
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/norinori1/portfolio.git
git push -u origin main
```

**Settings → Pages → Source: main branch**

**URL**: `https://norinori1.github.io/portfolio/`

## Vercel

```bash
# Vercel CLIインストール
npm i -g vercel

# デプロイ
vercel
```

**自動デプロイ**: Git連携で Push 時に自動

## Netlify

```bash
# Netlify CLIインストール
npm i -g netlify-cli

# デプロイ
netlify deploy
```

**自動デプロイ**: Git連携で設定

---

## カスタムドメイン設定

### GitHub Pages

```
リポジトリ Settings → Pages → Custom domain: norinori1.com
```

DNS設定:
```
A レコード: 185.199.108.153
CNAME: norinori1.github.io
```

### Vercel/Netlify

Dashboard → Domain Settings → カスタムドメイン追加

---

# ローカル実行

## Python

```bash
python -m http.server 8000
```

## Node.js

```bash
npm install -g http-server
http-server
```

## VS Code

Live Server 拡張 → Open with Live Server

---

# SEO最適化

- [x] Meta タグ（title, description, og:*）
- [x] セマンティックHTML
- [x] Heading 構造
- [x] Alt テキスト
- [x] 構造化データ
- [ ] サイトマップ（推奨）
- [ ] robots.txt（推奨）

---

# パフォーマンス目標

| メトリクス | 目標 |
|-----------|------|
| LCP | < 2.5s |
| FID | < 100ms |
| CLS | < 0.1 |
| Bundle Size | < 100KB |

---

# ファイル一覧

| ファイル | サイズ | 説明 |
|---------|--------|------|
| index.html | 27KB | ホームページ実装 |
| landing-improved.html | 5KB | ランディング改善版 |
| portfolio.html | 18KB | ポートフォリオテンプレート |
| SPEC.md | 28KB | 技術仕様 |
| HOMEPAGE_DESIGN.md | 21KB | ホームページ設計 |
| HEADER_COMPONENT.md | 21KB | ヘッダー実装 |
| FOOTER_PLATFORMS_DESIGN.md | 16KB | フッター設計 |
| GA4_IMPLEMENTATION.md | 11KB | GA4ガイド |
| PROJECT_SUMMARY.md | 11KB | プロジェクトサマリー |
| GAMES.md | 7.4KB | 作品定義 |
| README.md | 6.1KB | セットアップ |
| このファイル | - | 完全仕様書 |

---

# サポート＆更新

## バグ報告

GitHub Issues: `https://github.com/norinori1/portfolio/issues`

## 更新予定

- 新作ゲーム追加時に GAMES.md + index.html を更新
- 月1回の SEO 監査
- 四半期ごとの パフォーマンス測定

---

# ライセンス

Copyright © 2025 norinori1. All rights reserved.

---

**作成**: 2025年3月27日  
**バージョン**: 1.0.0  
**ステータス**: ✅ Phase 1 完成

このドキュメントを参考に、norinori1のポートフォリオサイト構築を進めてください！🚀
