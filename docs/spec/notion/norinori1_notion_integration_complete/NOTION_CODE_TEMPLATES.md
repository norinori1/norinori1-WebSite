# Notion統合 - コピペで使えるコードテンプレート

すぐに使えるコード一式です。ファイル名通りに保存してください。

---

## 📁 ファイル配置図

```
project/
├── .env                      ← 環境変数（ここに設定）
├── .env.example              ← テンプレート（Gitで管理）
├── .gitignore               ← Git無視設定
├── package.json             ← npm設定
├── index.html               ← 生成されるファイル
├── data/
│   ├── games.json
│   ├── news.json
│   └── profile.json
└── scripts/
    └── build.js             ← ビルドスクリプト
```

---

## ファイル1: `.env.example`

**リポジトリにコミット（テンプレート用）**

```bash
# .env.example
# コピーして .env を作成してください

NOTION_TOKEN=secret_YOUR_TOKEN_HERE
NOTION_GAMES_DB=YOUR_GAMES_DATABASE_ID
NOTION_NEWS_DB=YOUR_NEWS_DATABASE_ID
NOTION_PROFILE_DB=YOUR_PROFILE_DATABASE_ID
```

---

## ファイル2: `.gitignore`

```bash
# .gitignore

# 環境変数（秘密キー）
.env
.env.local
.env.*.local

# Node
node_modules/
npm-debug.log
yarn-error.log

# IDE
.vscode/
.idea/
*.swp
*.swo
*~

# OS
.DS_Store
Thumbs.db

# Build
data/
dist/
build/

# その他
*.log
.cache
```

---

## ファイル3: `package.json`

```json
{
  "name": "norinori1-portfolio",
  "version": "1.0.0",
  "description": "norinori1 Game Developer Portfolio - Powered by Notion",
  "main": "index.html",
  "scripts": {
    "build": "node scripts/build.js",
    "dev": "nodemon --exec 'npm run build' --watch scripts --watch .env",
    "start": "npm run build && echo 'Server: http://localhost:8000' && python -m http.server 8000",
    "deploy": "npm run build && git add . && git commit -m '🔄 Update from Notion' && git push",
    "verify": "node scripts/build.js --verify"
  },
  "dependencies": {
    "@notionhq/client": "^2.2.0",
    "dotenv": "^16.0.3"
  },
  "devDependencies": {
    "nodemon": "^3.0.1"
  },
  "engines": {
    "node": ">=16.0.0"
  },
  "keywords": [
    "notion",
    "portfolio",
    "game-developer",
    "cms",
    "headless-cms"
  ],
  "author": "norinori1",
  "license": "MIT"
}
```

---

## ファイル4: `scripts/build.js` (メインスクリプト)

```javascript
#!/usr/bin/env node

/**
 * Notion Portfolio Builder
 * 
 * Notionから自動的にポートフォリオHTMLを生成します
 * 使用方法: npm run build
 */

const { Client } = require('@notionhq/client');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

// ========================================
// 設定
// ========================================

const NOTION_TOKEN = process.env.NOTION_TOKEN;
const GAMES_DB = process.env.NOTION_GAMES_DB;
const NEWS_DB = process.env.NOTION_NEWS_DB;
const PROFILE_DB = process.env.NOTION_PROFILE_DB;

// バリデーション
if (!NOTION_TOKEN || !GAMES_DB || !NEWS_DB || !PROFILE_DB) {
    console.error('❌ エラー: .env に必要な環境変数がすべて設定されていません');
    console.error('必要な環境変数:');
    console.error('  - NOTION_TOKEN');
    console.error('  - NOTION_GAMES_DB');
    console.error('  - NOTION_NEWS_DB');
    console.error('  - NOTION_PROFILE_DB');
    process.exit(1);
}

const notion = new Client({ auth: NOTION_TOKEN });

// ========================================
// メイン処理
// ========================================

async function buildPortfolio() {
    console.log('\n🔄 Notionからビルド開始...\n');
    
    const startTime = Date.now();
    
    try {
        // 1. Notionからデータ取得
        console.log('📡 Notionからデータを取得中...');
        const games = await fetchGames();
        const news = await fetchNews();
        const profile = await fetchProfile();
        
        console.log(`✅ データ取得完了: ${games.length}件のゲーム, ${news.length}件のニュース\n`);
        
        // 2. JSONで保存（キャッシュ用）
        console.log('💾 JSONデータを保存中...');
        ensureDataDir();
        saveJSON('data/games.json', games);
        saveJSON('data/news.json', news);
        saveJSON('data/profile.json', profile);
        
        // 3. HTMLを生成
        console.log('🎨 HTMLを生成中...');
        const html = generateHTML(games, news, profile);
        
        // 4. HTMLファイルを書き込み
        fs.writeFileSync('./index.html', html);
        console.log('✅ index.html を生成しました\n');
        
        // 完了
        const duration = ((Date.now() - startTime) / 1000).toFixed(2);
        console.log(`✅ ビルド完了！ (${duration}秒)\n`);
        console.log('🌐 ブラウザで確認: open index.html\n');
        
    } catch (error) {
        console.error('❌ ビルドエラー:');
        console.error(error.message);
        
        if (error.message.includes('Invalid API token')) {
            console.error('\n💡 ヒント: NOTION_TOKEN を確認してください');
        } else if (error.message.includes('database_not_found')) {
            console.error('\n💡 ヒント: DATABASE_ID を確認してください');
        }
        
        process.exit(1);
    }
}

// ========================================
// Notionからデータ取得
// ========================================

async function fetchGames() {
    const response = await notion.databases.query({
        database_id: GAMES_DB,
        filter: {
            property: 'Status',
            select: { does_not_equal: 'Hidden' }
        },
        sorts: [
            { property: 'Featured', direction: 'descending' },
            { property: 'ReleaseDate', direction: 'descending' }
        ]
    });
    
    return response.results.map(page => ({
        id: page.id,
        title: getProp(page, 'Title', 'title')[0]?.plain_text || 'Untitled',
        slug: getProp(page, 'Slug', 'text') || slugify(getProp(page, 'Title', 'title')[0]?.plain_text || ''),
        description: getProp(page, 'Description', 'text') || '',
        content: getProp(page, 'Content', 'text') || '',
        link: getProp(page, 'Link', 'url') || '',
        status: getProp(page, 'Status', 'select') || 'Released',
        tags: getProp(page, 'Tags', 'multi_select') || [],
        engines: getProp(page, 'Engines', 'multi_select') || [],
        platforms: getProp(page, 'Platforms', 'multi_select') || [],
        featured: getProp(page, 'Featured', 'checkbox') || false,
        releaseDate: getProp(page, 'ReleaseDate', 'date') || new Date().toISOString().split('T')[0],
        thumbnail: page.properties.Thumbnail?.files?.[0]?.file?.url || '',
        playCount: getProp(page, 'PlayCount', 'number') || 0
    }));
}

async function fetchNews() {
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
        title: getProp(page, 'Title', 'title')[0]?.plain_text || 'Untitled',
        slug: getProp(page, 'Slug', 'text') || '',
        excerpt: getProp(page, 'Excerpt', 'text') || '',
        content: getProp(page, 'Content', 'text') || '',
        date: getProp(page, 'Date', 'date') || new Date().toISOString().split('T')[0],
        tags: getProp(page, 'Tags', 'multi_select') || [],
        featured: getProp(page, 'Featured', 'checkbox') || false,
        readTime: getProp(page, 'ReadTime', 'number') || 5,
        url: `https://www.notion.so/${page.id.replace(/-/g, '')}`,
        coverImage: page.properties.CoverImage?.files?.[0]?.file?.url || ''
    }));
}

async function fetchProfile() {
    const response = await notion.databases.query({
        database_id: PROFILE_DB,
        sorts: [
            { property: 'Category', direction: 'ascending' },
            { property: 'Level', direction: 'descending' }
        ]
    });
    
    return response.results.reduce((acc, page) => {
        const category = getProp(page, 'Category', 'select') || 'Other';
        const skill = {
            name: getProp(page, 'SkillName', 'text') || 'Unknown',
            level: getProp(page, 'Level', 'select') || '',
            description: getProp(page, 'Description', 'text') || '',
            experience: getProp(page, 'ExperienceYears', 'number') || 0,
            icon: page.properties.Icon?.files?.[0]?.file?.url || ''
        };
        
        if (!acc[category]) acc[category] = [];
        acc[category].push(skill);
        return acc;
    }, {});
}

// ========================================
// ユーティリティ関数
// ========================================

function getProp(page, propName, type) {
    const prop = page.properties[propName];
    if (!prop) {
        return type === 'multi_select' || type === 'title' ? [] : '';
    }
    
    try {
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
            case 'number':
                return prop.number || 0;
            default:
                return '';
        }
    } catch (e) {
        console.warn(`⚠️ プロパティ取得エラー: ${propName}`);
        return type === 'multi_select' ? [] : '';
    }
}

function slugify(str) {
    return str
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-');
}

function saveJSON(filePath, data) {
    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}

function ensureDataDir() {
    if (!fs.existsSync('data')) {
        fs.mkdirSync('data', { recursive: true });
    }
}

// ========================================
// HTML生成
// ========================================

function generateHTML(games, news, profile) {
    const gamesHtml = games.map(game => `
        <article class="game-card" data-game-id="${game.id}">
            ${game.thumbnail ? `<img src="${game.thumbnail}" alt="${escapeHtml(game.title)}" class="game-card__image" loading="lazy" />` : '<div class="game-card__image" style="background: #E2E8F0;"></div>'}
            <div class="game-card__content">
                <h3 class="game-card__title">${escapeHtml(game.title)}</h3>
                <p class="game-card__description">${escapeHtml(game.description)}</p>
                <div class="game-card__tags">
                    ${game.tags.map(tag => `<span class="tag">${escapeHtml(tag)}</span>`).join('')}
                </div>
                <a href="${game.link}" target="_blank" rel="noopener noreferrer" class="game-card__link">
                    Play Now →
                </a>
            </div>
        </article>
    `).join('\n');
    
    const newsHtml = news.slice(0, 5).map(article => `
        <article class="news-item">
            <h3 class="news-item__title">${escapeHtml(article.title)}</h3>
            <p class="news-item__excerpt">${escapeHtml(article.excerpt)}</p>
            <div class="news-item__meta">
                <span class="news-item__date">${formatDate(article.date)}</span>
                <a href="${article.url}" target="_blank" class="news-item__link">詳しく →</a>
            </div>
        </article>
    `).join('\n');
    
    const skillsHtml = Object.entries(profile).map(([category, skills]) => `
        <div class="skill-card">
            <h3 class="skill-card__title">${escapeHtml(category)}</h3>
            <ul class="skill-list">
                ${skills.map(skill => `
                    <li class="skill-item">
                        <span class="skill-item__name">${escapeHtml(skill.name)}</span>
                        <span class="skill-item__level">${escapeHtml(skill.level)}</span>
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
            --color-primary-lighter: #A7D8E8;
            --color-neutral-50: #FFFFFF;
            --color-neutral-100: #F8FAFC;
            --color-neutral-200: #E2E8F0;
            --color-neutral-500: #64748B;
            --color-neutral-900: #0F172A;
        }
        
        * { margin: 0; padding: 0; box-sizing: border-box; }
        
        html { scroll-behavior: smooth; }
        
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
            color: var(--color-neutral-900);
            background: var(--color-neutral-50);
            line-height: 1.6;
        }
        
        .container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 0 2rem;
        }
        
        section {
            padding: 4rem 0;
        }
        
        section:nth-child(even) {
            background: var(--color-neutral-100);
        }
        
        h2 {
            font-size: 2.5rem;
            font-weight: 700;
            margin-bottom: 2rem;
            color: var(--color-primary-dark);
        }
        
        header {
            background: linear-gradient(135deg, var(--color-primary-dark) 0%, var(--color-primary-lighter) 100%);
            color: white;
            padding: 4rem 0;
            text-align: center;
        }
        
        header h1 {
            font-size: 3.5rem;
            margin-bottom: 1rem;
            font-family: 'Geist Mono', 'JetBrains Mono', monospace;
            letter-spacing: -0.02em;
        }
        
        header p {
            font-size: 1.25rem;
            opacity: 0.95;
        }
        
        /* ゲームカード */
        .games-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 2rem;
            margin: 3rem 0;
        }
        
        .game-card {
            background: white;
            border: 1px solid var(--color-neutral-200);
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
            background: var(--color-neutral-200);
        }
        
        .game-card__content {
            padding: 1.5rem;
        }
        
        .game-card__title {
            font-size: 1.25rem;
            font-weight: 700;
            margin-bottom: 0.5rem;
            color: var(--color-neutral-900);
        }
        
        .game-card__description {
            font-size: 0.9rem;
            color: var(--color-neutral-500);
            margin-bottom: 1rem;
        }
        
        .game-card__tags {
            margin-bottom: 1rem;
        }
        
        .tag {
            display: inline-block;
            padding: 0.25rem 0.75rem;
            background: var(--color-neutral-200);
            color: var(--color-primary-dark);
            border-radius: 999px;
            font-size: 0.75rem;
            font-weight: 600;
            margin-right: 0.5rem;
            margin-bottom: 0.5rem;
        }
        
        .game-card__link {
            display: inline-block;
            color: var(--color-primary);
            text-decoration: none;
            font-weight: 600;
            transition: color 0.3s;
        }
        
        .game-card__link:hover {
            color: var(--color-primary-dark);
        }
        
        /* ニュース */
        .news-item {
            border-bottom: 1px solid var(--color-neutral-200);
            padding: 2rem 0;
        }
        
        .news-item:last-child {
            border-bottom: none;
        }
        
        .news-item__title {
            font-size: 1.25rem;
            font-weight: 700;
            margin-bottom: 0.5rem;
            color: var(--color-neutral-900);
        }
        
        .news-item__excerpt {
            color: var(--color-neutral-500);
            margin-bottom: 1rem;
            font-size: 0.95rem;
        }
        
        .news-item__meta {
            display: flex;
            justify-content: space-between;
            align-items: center;
            font-size: 0.9rem;
        }
        
        .news-item__date {
            color: var(--color-neutral-500);
        }
        
        .news-item__link {
            color: var(--color-primary);
            text-decoration: none;
            font-weight: 600;
        }
        
        /* スキル */
        .skills-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
            gap: 2rem;
            margin: 3rem 0;
        }
        
        .skill-card {
            background: white;
            border: 1px solid var(--color-neutral-200);
            border-radius: 8px;
            padding: 1.5rem;
        }
        
        .skill-card__title {
            font-size: 1.1rem;
            font-weight: 700;
            margin-bottom: 1rem;
            color: var(--color-primary-dark);
        }
        
        .skill-list {
            list-style: none;
        }
        
        .skill-item {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 0.75rem 0;
            border-bottom: 1px solid var(--color-neutral-200);
            font-size: 0.9rem;
        }
        
        .skill-item:last-child {
            border-bottom: none;
        }
        
        .skill-item__name {
            font-weight: 600;
            color: var(--color-neutral-900);
        }
        
        .skill-item__level {
            background: var(--color-primary-lighter);
            color: var(--color-neutral-900);
            padding: 0.25rem 0.5rem;
            border-radius: 3px;
            font-size: 0.75rem;
            font-weight: 600;
        }
        
        /* フッター */
        footer {
            background: var(--color-neutral-900);
            color: white;
            padding: 2rem 0;
            text-align: center;
            margin-top: 4rem;
        }
        
        footer p {
            opacity: 0.8;
            font-size: 0.9rem;
        }
        
        /* レスポンシブ */
        @media (max-width: 768px) {
            header h1 { font-size: 2.5rem; }
            h2 { font-size: 1.75rem; }
            section { padding: 2rem 0; }
            .game-card__title { font-size: 1.1rem; }
            .news-item__meta { flex-direction: column; gap: 0.5rem; }
        }
    </style>
</head>
<body>
    <header>
        <div class="container">
            <h1>norinori1</h1>
            <p>Game Developer & Creator</p>
            <p style="font-size: 0.9rem; margin-top: 1rem; opacity: 0.8;">Built with Notion × JavaScript ✨</p>
        </div>
    </header>
    
    <section>
        <div class="container">
            <h2>🎮 Featured Games</h2>
            <div class="games-grid">
                ${gamesHtml || '<p>ゲーム情報がまだありません</p>'}
            </div>
        </div>
    </section>
    
    <section>
        <div class="container">
            <h2>📰 Latest News</h2>
            ${newsHtml || '<p>ニュースがまだありません</p>'}
        </div>
    </section>
    
    <section>
        <div class="container">
            <h2>🛠️ Skills & Technologies</h2>
            <div class="skills-grid">
                ${skillsHtml || '<p>スキル情報がまだありません</p>'}
            </div>
        </div>
    </section>
    
    <footer>
        <div class="container">
            <p>&copy; 2025 norinori1. Built with Notion + JavaScript</p>
            <p style="font-size: 0.85rem; margin-top: 0.5rem;">Generated at ${new Date().toLocaleString('ja-JP')}</p>
        </div>
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

function escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
}

// Node.js環境でのエスケープ
function escapeHtml(text) {
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, m => map[m]);
}

// ========================================
// 実行
// ========================================

buildPortfolio().catch(error => {
    console.error('Fatal error:', error);
    process.exit(1);
});
```

---

## ファイル5: `README.md`

```markdown
# norinori1 Portfolio - Powered by Notion

Notionをヘッドレス CMSとして使用したゲーム開発者ポートフォリオサイト。

## セットアップ（5分）

### 1. リポジトリクローン

\`\`\`bash
git clone https://github.com/norinori1/portfolio.git
cd portfolio
\`\`\`

### 2. パッケージインストール

\`\`\`bash
npm install
\`\`\`

### 3. 環境変数設定

\`\`\`bash
cp .env.example .env
# .env を編集して、Notion トークンと Database IDを設定
\`\`\`

### 4. ビルド&実行

\`\`\`bash
npm run build    # ビルド
npm start        # http://localhost:8000
\`\`\`

## 開発

\`\`\`bash
npm run dev      # 監視モードで開発
\`\`\`

## デプロイ

### Vercel

\`\`\`bash
npm install -g vercel
vercel
\`\`\`

### GitHub Pages

\`\`\`bash
npm run deploy
\`\`\`

## Notionデータベース設計

詳しくは [NOTION_IMPLEMENTATION.md](./NOTION_IMPLEMENTATION.md) を参照。

## トラブルシューティング

- **"Invalid API token"**: NOTION_TOKEN を確認
- **"Database not found"**: DATABASE_ID を確認
- **データが取得できない**: Integrationの権限を確認

## ライセンス

MIT

## 作成者

norinori1
```

---

## 最初のステップ

### 1. このファイルたちを保存

```bash
mkdir project && cd project

# .env.example を保存
cat > .env.example << 'EOF'
NOTION_TOKEN=secret_YOUR_TOKEN_HERE
NOTION_GAMES_DB=YOUR_GAMES_DATABASE_ID
NOTION_NEWS_DB=YOUR_NEWS_DATABASE_ID
NOTION_PROFILE_DB=YOUR_PROFILE_DATABASE_ID
EOF

# .gitignore を保存
cat > .gitignore << 'EOF'
.env
node_modules/
data/
EOF

# package.json を保存（上記のJSONをコピペ）

# scripts/build.js を保存（上記のJavaScriptをコピペ）
mkdir -p scripts
```

### 2. npm install

```bash
npm install
```

### 3. .env を設定

```bash
cp .env.example .env
# エディタで .env を開き、トークンとDB IDを設定
```

### 4. ビルド&テスト

```bash
npm run build
npm start
```

**http://localhost:8000 にアクセス！**

---

## 次のステップ

1. Notionでデータベース作成
2. データを入力
3. `npm run build`
4. Vercelにデプロイ
5. GitHub Actionsで自動化（オプション）

---

**楽しい開発を！🚀**

---

作成日: 2025年3月27日
