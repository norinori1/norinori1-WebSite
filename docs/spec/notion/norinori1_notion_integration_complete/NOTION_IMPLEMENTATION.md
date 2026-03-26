# Notion統合 推奨版 完全実装ガイド

Notionをヘッドレス CMSとして使い、自動的にHTMLを生成する方法。
**本番推奨・最良のバランス版** です。

---

## 📋 このガイドの流れ

```
1. Notion Integration設定 (5分)
2. Notionデータベース設計 (10分)
3. Node.jsプロジェクト構築 (10分)
4. ビルドスクリプト実装 (10分)
5. Vercel自動デプロイ設定 (5分)
```

**所要時間: 約40分 でフル稼働！**

---

# ステップ1: Notion Integration設定

## 1.1 Integration トークン取得

1. **Notion Developers にアクセス**
   - URL: https://www.notion.com/my-integrations

2. **"+ New integration" をクリック**
   - Name: `norinori1-portfolio`
   - ロゴ: (あれば) norinori1ロゴ

3. **Capabilities 設定**
   - ✅ Read content
   - ✅ Update content
   - ✅ Read databases
   - ✅ Insert comments
   - (その他はスキップ)

4. **Submit → トークン取得**
   ```
   secret_abcdefg1234567890...
   ```
   **⚠️ このトークンは絶対に公開しない！**

## 1.2 データベースの共有設定

Notionで各データベース（ゲーム、ニュース等）を作成後：

1. **データベース右上 "Share" をクリック**
2. **"+ Add a guest" から Integration追加**
3. 検索: `norinori1-portfolio`
4. **✅ Invite**

**各テーブル（Games, News, Profile）で同じ手順を繰り返す**

---

# ステップ2: Notionデータベース設計

## 2.1 テンプレート・複製用リンク

### A. ゲーム情報テーブル テンプレート

| No. | プロパティ名 | 型 | 説明 | 例 |
|-----|-----------|-----|------|-----|
| 1 | **Title** | Title | ゲームタイトル | ZINTOROAD |
| 2 | **Slug** | Text | URL用（手動） | zintoroad |
| 3 | **Description** | Text | 短い説明 (100字以内) | Survivor-like Rogue-lite |
| 4 | **Content** | Rich Text | 詳細説明 | (長めのテキスト) |
| 5 | **Link** | URL | ゲームリンク | https://norinori1.itch.io/... |
| 6 | **Status** | Select | Latest / Featured / Released | Latest |
| 7 | **Tags** | Multi-select | Unity, Strategic 等 | Unity, Strategic |
| 8 | **Engines** | Multi-select | ゲームエンジン | Unity, C# |
| 9 | **Platforms** | Multi-select | PC, Web, Discord 等 | Web |
| 10 | **Thumbnail** | Files & media | ゲーム画像 (360×240px) | (画像ファイル) |
| 11 | **ReleaseDate** | Date | リリース日 | 2025-01-15 |
| 12 | **Featured** | Checkbox | トップに表示するか | ✓ |
| 13 | **PlayCount** | Number | プレイ数（自動取得） | 1234 |

### B. ニュース・DevLog テーブル

| No. | プロパティ名 | 型 | 説明 | 例 |
|-----|-----------|-----|------|-----|
| 1 | **Title** | Title | 記事タイトル | Unity × TensorFlow実験開始 |
| 2 | **Slug** | Text | URL用 | unity-tensorflow-experiment |
| 3 | **Excerpt** | Text | 概要 (200字以内) | 新しい技術に... |
| 4 | **Content** | Rich Text | 本文 | (Markdown対応) |
| 5 | **Date** | Date | 投稿日 | 2025-03-27 |
| 6 | **Status** | Select | Published / Draft | Published |
| 7 | **Featured** | Checkbox | トップ表示 | ✓ |
| 8 | **Tags** | Multi-select | Unity, ML, TensorFlow | Unity, ML |
| 9 | **CoverImage** | Files & media | サムネイル画像 | (画像) |
| 10 | **ReadTime** | Number | 読了時間（分） | 5 |

### C. プロフィール・スキル テーブル

| No. | プロパティ名 | 型 | 説明 | 例 |
|-----|-----------|-----|------|-----|
| 1 | **Category** | Select | Game Engines / Languages / Tools等 | Game Engines |
| 2 | **SkillName** | Text | スキル名 | Unity |
| 3 | **Level** | Select | Expert / Advanced / Intermediate | Expert |
| 4 | **Description** | Rich Text | 説明 | C# with Unity... |
| 5 | **Icon** | Files & media | アイコン | (画像) |
| 6 | **ExperienceYears** | Number | 経験年数 | 3 |
| 7 | **Link** | URL | 関連リンク | https://unity.com |

---

## 2.2 Notion UI での作成手順

### ゲーム情報テーブル作成

```
1. Notionで新規ページ → "Database" 
2. Name: "Games"
3. Property追加（+ ボタン）:
   - Slug (Text)
   - Description (Text)
   - Content (Rich Text)
   - Link (URL)
   - Status (Select) → Options: Latest, Featured, Released
   - Tags (Multi-select)
   - ... (上記テーブル参照)
4. Gallery ビュー作成（オプション）
```

### テンプレート Notion ページ

```
Games データベーステンプレート
https://www.notion.so/norinori1/GAMES-DATABASE-TEMPLATE-HERE
```

**コピーして使用:**
1. テンプレートリンクを開く
2. "Duplicate" → あなたのワークスペースに複製

---

# ステップ3: Node.js プロジェクト構築

## 3.1 プロジェクト初期化

```bash
# 1. フォルダ作成
mkdir norinori1-portfolio
cd norinori1-portfolio

# 2. Git初期化
git init

# 3. Node.js初期化
npm init -y
```

## 3.2 必要なパッケージインストール

```bash
npm install @notionhq/client dotenv
npm install --save-dev nodemon
```

## 3.3 ディレクトリ構造

```
norinori1-portfolio/
├── .env
├── .env.example
├── .gitignore
├── package.json
├── index.html (生成)
├── data/
│   ├── games.json (生成)
│   ├── news.json (生成)
│   └── profile.json (生成)
├── scripts/
│   ├── build.js (メインビルドスクリプト)
│   ├── fetch-games.js
│   ├── fetch-news.js
│   └── fetch-profile.js
├── templates/
│   ├── index.html (テンプレート)
│   ├── game-card.html
│   └── news-item.html
└── assets/
    └── (既存の画像など)
```

## 3.4 .env ファイル設定

```bash
# .env (git管理外)
NOTION_TOKEN=secret_YOUR_INTEGRATION_TOKEN_HERE
NOTION_GAMES_DB=YOUR_GAMES_DATABASE_ID
NOTION_NEWS_DB=YOUR_NEWS_DATABASE_ID
NOTION_PROFILE_DB=YOUR_PROFILE_DATABASE_ID
```

## 3.5 .env.example（共有用テンプレート）

```bash
# .env.example (Gitで管理)
NOTION_TOKEN=secret_xxx
NOTION_GAMES_DB=xxx
NOTION_NEWS_DB=xxx
NOTION_PROFILE_DB=xxx
```

## 3.6 .gitignore 設定

```
# .gitignore
.env
.env.local
node_modules/
data/
dist/
*.log
.DS_Store
```

---

# ステップ4: ビルドスクリプト実装

## 4.1 メインビルドスクリプト

```javascript
// scripts/build.js
const { Client } = require('@notionhq/client');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const notion = new Client({ 
    auth: process.env.NOTION_TOKEN 
});

// データベースID
const GAMES_DB = process.env.NOTION_GAMES_DB;
const NEWS_DB = process.env.NOTION_NEWS_DB;
const PROFILE_DB = process.env.NOTION_PROFILE_DB;

async function buildPortfolio() {
    console.log('🔄 Notionからビルド中...\n');
    
    try {
        // 1. データ取得
        const games = await fetchGames();
        const news = await fetchNews();
        const profile = await fetchProfile();
        
        // 2. JSONで保存（キャッシュ用）
        saveJSON('data/games.json', games);
        saveJSON('data/news.json', news);
        saveJSON('data/profile.json', profile);
        
        // 3. HTMLを生成
        const html = generateHTML(games, news, profile);
        
        // 4. HTMLファイルを書き込み
        fs.writeFileSync('./index.html', html);
        
        console.log('✅ ビルド完了！');
        console.log(`📊 取得データ: ゲーム${games.length}件, ニュース${news.length}件`);
        
    } catch (error) {
        console.error('❌ ビルドエラー:', error.message);
        process.exit(1);
    }
}

// ========================================
// データ取得関数
// ========================================

async function fetchGames() {
    console.log('📖 ゲーム情報を取得中...');
    
    const response = await notion.databases.query({
        database_id: GAMES_DB,
        sorts: [
            { property: 'Status', direction: 'descending' },
            { property: 'ReleaseDate', direction: 'descending' }
        ]
    });
    
    return response.results.map(page => ({
        id: page.id,
        title: getProperty(page, 'Title', 'title')[0]?.plain_text || '',
        slug: getProperty(page, 'Slug', 'text') || '',
        description: getProperty(page, 'Description', 'text') || '',
        link: getProperty(page, 'Link', 'url') || '',
        status: getProperty(page, 'Status', 'select') || 'Released',
        tags: getProperty(page, 'Tags', 'multi_select'),
        platforms: getProperty(page, 'Platforms', 'multi_select'),
        featured: getProperty(page, 'Featured', 'checkbox') || false,
        releaseDate: getProperty(page, 'ReleaseDate', 'date') || '',
        thumbnail: page.properties.Thumbnail?.files?.[0]?.file?.url || ''
    }));
}

async function fetchNews() {
    console.log('📰 ニュース・DevLogを取得中...');
    
    const response = await notion.databases.query({
        database_id: NEWS_DB,
        filter: {
            property: 'Status',
            select: { equals: 'Published' }
        },
        sorts: [{ property: 'Date', direction: 'descending' }]
    });
    
    return response.results.map(page => ({
        id: page.id,
        title: getProperty(page, 'Title', 'title')[0]?.plain_text || '',
        slug: getProperty(page, 'Slug', 'text') || '',
        excerpt: getProperty(page, 'Excerpt', 'text') || '',
        date: getProperty(page, 'Date', 'date') || '',
        tags: getProperty(page, 'Tags', 'multi_select'),
        featured: getProperty(page, 'Featured', 'checkbox') || false,
        url: `https://www.notion.so/${page.id.replace(/-/g, '')}`
    }));
}

async function fetchProfile() {
    console.log('👤 プロフィール・スキルを取得中...');
    
    const response = await notion.databases.query({
        database_id: PROFILE_DB,
        sorts: [
            { property: 'Category', direction: 'ascending' },
            { property: 'Level', direction: 'descending' }
        ]
    });
    
    return response.results.reduce((acc, page) => {
        const category = getProperty(page, 'Category', 'select') || 'Other';
        const skill = {
            name: getProperty(page, 'SkillName', 'text') || '',
            level: getProperty(page, 'Level', 'select') || '',
            description: getProperty(page, 'Description', 'text') || ''
        };
        
        if (!acc[category]) acc[category] = [];
        acc[category].push(skill);
        return acc;
    }, {});
}

// ========================================
// ユーティリティ関数
// ========================================

function getProperty(page, propName, type) {
    const prop = page.properties[propName];
    if (!prop) return type === 'multi_select' || type === 'title' ? [] : '';
    
    switch (type) {
        case 'text':
            return prop.rich_text?.[0]?.plain_text || '';
        case 'title':
            return prop.title || [];
        case 'url':
            return prop.url || '';
        case 'select':
            return prop.select?.name || '';
        case 'multi_select':
            return prop.multi_select?.map(s => s.name) || [];
        case 'date':
            return prop.date?.start || '';
        case 'checkbox':
            return prop.checkbox || false;
        default:
            return '';
    }
}

function saveJSON(filePath, data) {
    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
    console.log(`💾 ${filePath} を保存しました`);
}

// ========================================
// HTML生成関数
// ========================================

function generateHTML(games, news, profile) {
    const gamesHtml = games.map(game => `
        <article class="game-card" data-game-id="${game.id}">
            <img src="${game.thumbnail}" alt="${game.title}" class="game-card__image" />
            <div class="game-card__content">
                <h3 class="game-card__title">${game.title}</h3>
                <p class="game-card__description">${game.description}</p>
                <div class="game-card__tags">
                    ${game.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
                </div>
                <a href="${game.link}" target="_blank" rel="noopener noreferrer" class="game-card__link">
                    Play Now →
                </a>
            </div>
        </article>
    `).join('\n');
    
    const newsHtml = news.slice(0, 5).map(article => `
        <article class="news-item">
            <h3 class="news-item__title">${article.title}</h3>
            <p class="news-item__excerpt">${article.excerpt}</p>
            <div class="news-item__meta">
                <span class="news-item__date">${formatDate(article.date)}</span>
                <a href="${article.url}" target="_blank" class="news-item__link">詳しく →</a>
            </div>
        </article>
    `).join('\n');
    
    const profileHtml = Object.entries(profile).map(([category, skills]) => `
        <div class="skill-card">
            <h3 class="skill-card__title">${category}</h3>
            <ul class="skill-list">
                ${skills.map(skill => `
                    <li class="skill-item">
                        <span class="skill-item__name">${skill.name}</span>
                        <span class="skill-item__level">${skill.level}</span>
                    </li>
                `).join('')}
            </ul>
        </div>
    `).join('\n');
    
    return `<!DOCTYPE html>
<html lang="ja">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="norinori1 - Game Developer Portfolio">
    <title>norinori1 - Game Developer</title>
    <style>
        :root {
            --color-primary: #3B8FD9;
            --color-primary-dark: #1F5BA6;
            --color-neutral-50: #FFFFFF;
            --color-neutral-500: #64748B;
            --color-neutral-900: #0F172A;
        }
        
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
            color: var(--color-neutral-900);
            background: var(--color-neutral-50);
            line-height: 1.6;
        }
        
        .container { max-width: 1200px; margin: 0 auto; padding: 0 2rem; }
        
        section { padding: 4rem 0; }
        
        h2 { font-size: 2.5rem; margin-bottom: 2rem; color: var(--color-primary-dark); }
        
        .game-card {
            background: white;
            border: 1px solid #E2E8F0;
            border-radius: 12px;
            overflow: hidden;
            transition: all 0.3s ease;
        }
        
        .game-card:hover {
            transform: translateY(-8px);
            border-color: var(--color-primary);
            box-shadow: 0 12px 24px rgba(59, 143, 217, 0.15);
        }
        
        .game-card__image {
            width: 100%;
            height: 200px;
            object-fit: cover;
            background: #E2E8F0;
        }
        
        .game-card__content { padding: 1.5rem; }
        
        .game-card__title {
            font-size: 1.25rem;
            font-weight: 700;
            margin-bottom: 0.5rem;
        }
        
        .game-card__description {
            font-size: 0.9rem;
            color: var(--color-neutral-500);
            margin-bottom: 1rem;
        }
        
        .tag {
            display: inline-block;
            padding: 0.25rem 0.75rem;
            background: #E2E8F0;
            color: var(--color-primary-dark);
            border-radius: 999px;
            font-size: 0.75rem;
            font-weight: 600;
            margin-right: 0.5rem;
        }
        
        .game-card__link {
            display: inline-block;
            color: var(--color-primary);
            text-decoration: none;
            font-weight: 600;
            margin-top: 1rem;
            transition: color 0.3s;
        }
        
        .game-card__link:hover { color: var(--color-primary-dark); }
        
        .games-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 2rem;
            margin: 3rem 0;
        }
        
        .news-item {
            border-bottom: 1px solid #E2E8F0;
            padding: 2rem 0;
        }
        
        .news-item__title {
            font-size: 1.25rem;
            margin-bottom: 0.5rem;
        }
        
        .news-item__excerpt {
            color: var(--color-neutral-500);
            margin-bottom: 1rem;
        }
        
        .news-item__meta {
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        
        .skill-card {
            background: white;
            border: 1px solid #E2E8F0;
            border-radius: 8px;
            padding: 1.5rem;
            margin-bottom: 1.5rem;
        }
        
        .skill-card__title {
            font-size: 1.1rem;
            font-weight: 700;
            margin-bottom: 1rem;
            color: var(--color-primary-dark);
        }
        
        .skill-list { list-style: none; }
        
        .skill-item {
            display: flex;
            justify-content: space-between;
            padding: 0.5rem 0;
            border-bottom: 1px solid #E2E8F0;
        }
        
        .skill-item__level {
            background: #A7D8E8;
            padding: 0.25rem 0.5rem;
            border-radius: 3px;
            font-size: 0.75rem;
            font-weight: 600;
        }
    </style>
</head>
<body>
    <header style="background: linear-gradient(135deg, var(--color-primary-dark) 0%, #A7D8E8 100%); color: white; padding: 4rem 0; text-align: center;">
        <div class="container">
            <h1 style="font-size: 3.5rem; margin-bottom: 1rem;">norinori1</h1>
            <p style="font-size: 1.25rem; opacity: 0.9;">Game Developer & Creator</p>
            <p style="margin-top: 1rem; opacity: 0.8;">Built with Notion × JavaScript ✨</p>
        </div>
    </header>
    
    <section>
        <div class="container">
            <h2>🎮 Featured Games</h2>
            <div class="games-grid">
                ${gamesHtml}
            </div>
        </div>
    </section>
    
    <section style="background: #F8FAFC;">
        <div class="container">
            <h2>📰 Latest News</h2>
            ${newsHtml}
        </div>
    </section>
    
    <section>
        <div class="container">
            <h2>🛠️ Skills & Technologies</h2>
            ${profileHtml}
        </div>
    </section>
    
    <footer style="background: var(--color-neutral-900); color: white; padding: 2rem 0; text-align: center;">
        <p>&copy; 2025 norinori1. Built with Notion + JavaScript</p>
    </footer>
</body>
</html>`;
}

function formatDate(dateStr) {
    const date = new Date(dateStr);
    return new Intl.DateTimeFormat('ja-JP', { 
        year: 'numeric', 
        month: '2-digit', 
        day: '2-digit' 
    }).format(date);
}

// ========================================
// 実行
// ========================================

buildPortfolio();
```

## 4.2 package.json スクリプト設定

```json
{
  "name": "norinori1-portfolio",
  "version": "1.0.0",
  "description": "norinori1 Game Developer Portfolio",
  "scripts": {
    "build": "node scripts/build.js",
    "dev": "nodemon --exec 'npm run build' --watch scripts",
    "start": "npm run build && python -m http.server 8000",
    "deploy": "npm run build && git add . && git commit -m '🔄 Update from Notion' && git push"
  },
  "dependencies": {
    "@notionhq/client": "^2.2.0",
    "dotenv": "^16.0.0"
  },
  "devDependencies": {
    "nodemon": "^3.0.0"
  }
}
```

---

# ステップ5: 実行とテスト

## 5.1 ローカルでテスト

```bash
# 環境変数確認
cat .env

# ビルド実行
npm run build

# サーバー起動
npm start
```

**ブラウザで確認: `http://localhost:8000`**

## 5.2 トラブルシューティング

### エラー: "Invalid API Token"
```bash
# .env を確認
echo $NOTION_TOKEN

# トークンをコピペして再確認
# (空白がないか確認)
```

### エラー: "Database not found"
```bash
# Database ID を確認
# Notionで該当DBを開く → URLから
# notion.so/WORKSPACE/[この部分]?v=...
```

### データが取得できない
```bash
# Integration がデータベースに共有されているか確認
# Notion → Database → Share → Integration追加
```

---

# ステップ6: Vercel自動デプロイ設定

## 6.1 Vercelプロジェクト作成

```bash
# Vercel CLIインストール
npm install -g vercel

# デプロイ
vercel
```

## 6.2 Environment Variables設定

**Vercelダッシュボード → Settings → Environment Variables**

```
NOTION_TOKEN = secret_xxx
NOTION_GAMES_DB = xxx
NOTION_NEWS_DB = xxx
NOTION_PROFILE_DB = xxx
```

## 6.3 vercel.json 作成

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": ".",
  "env": {
    "NOTION_TOKEN": "@notion-token",
    "NOTION_GAMES_DB": "@notion-games-db",
    "NOTION_NEWS_DB": "@notion-news-db",
    "NOTION_PROFILE_DB": "@notion-profile-db"
  }
}
```

---

# ステップ7: GitHub自動更新設定（オプション）

## 7.1 GitHub Actions ワークフロー

```yaml
# .github/workflows/build.yml
name: Build from Notion

on:
  workflow_dispatch:
  schedule:
    - cron: '0 * * * *'  # 1時間ごと

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - run: npm install
      
      - run: npm run build
        env:
          NOTION_TOKEN: ${{ secrets.NOTION_TOKEN }}
          NOTION_GAMES_DB: ${{ secrets.NOTION_GAMES_DB }}
          NOTION_NEWS_DB: ${{ secrets.NOTION_NEWS_DB }}
          NOTION_PROFILE_DB: ${{ secrets.NOTION_PROFILE_DB }}
      
      - uses: EndBug/add-and-commit@v9
        with:
          message: '🔄 Auto-build from Notion'
          push: true
```

---

# 📚 使用例

## Notion で新しいゲームを追加

```
1. Notion → Games → "+ Add a page"
2. 以下を入力:
   - Title: "My New Game"
   - Description: "Amazing game"
   - Link: "https://..."
   - Status: "Featured"
   - Featured: ✓
3. Save
```

**自動でビルド:**
```bash
npm run build
```

**結果: index.html が自動更新 ✅**

---

# 🔐 セキュリティガイド

## DO ✅

- [ ] NOTION_TOKEN を .env に保存（git管理外）
- [ ] .env を .gitignore に追加
- [ ] Vercelで Environment Variables 設定
- [ ] HTTPSでデプロイ
- [ ] 定期的にトークン更新

## DON'T ❌

- [ ] トークンをコード内に書き込み
- [ ] トークンをGitHubにプッシュ
- [ ] .env をGitで管理
- [ ] トークンをSlack等で共有

---

# 📊 パフォーマンス比較

| メトリクス | 手動管理 | Notion統合（推奨版） |
|-----------|---------|-----------------|
| 更新速度 | 遅い（手作業） | 自動（5分以内） |
| ページロード | 高速 | 高速（ビルド後） |
| SEO | 最適 | 最適 |
| メンテナンス | 手動 | 自動 |
| API制限 | N/A | なし（ビルド時のみ） |
| コスト | 無料 | 無料 |

---

# ✅ チェックリスト

実装完了するまで以下を確認：

- [ ] Notion Integration作成
- [ ] Integration Token取得
- [ ] Notionデータベース共有
- [ ] Node.js環境構築
- [ ] .env 設定
- [ ] npm install 実行
- [ ] npm run build テスト
- [ ] localhost:8000 で表示確認
- [ ] Vercel設定
- [ ] Environment Variables設定
- [ ] 初回デプロイ成功
- [ ] GitHub Actions設定（オプション）

---

# 🎯 次のステップ

## Phase 1 (今)
- ✅ Notion統合設定

## Phase 2 (1-2日)
- 既存コンテンツをNotionに移行
- Notion テンプレート最適化

## Phase 3 (オプション)
- GitHub Actions全自動化
- Webhooks統合（Zapier等）

---

**おめでとうございます！これであなたのポートフォリオがNotionで管理できます！** 🚀

---

**更新日**: 2025年3月27日  
**バージョン**: 1.0.0
