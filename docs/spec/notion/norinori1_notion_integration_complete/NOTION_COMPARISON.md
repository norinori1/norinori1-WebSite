# Notion統合ガイド - 3パターン完全比較

norinori1ポートフォリオをNotionで完全管理する方法を3パターン解説します。

---

## 📊 3パターン比較表

| 項目 | 簡単版 | 推奨版 ⭐ | 上級版 |
|------|--------|---------|--------|
| **セットアップ難易度** | ⭐ 簡単 | ⭐⭐ 中程度 | ⭐⭐⭐ 難しい |
| **ページ速度** | 遅い (2-3s) | 高速 (<1s) ⭐⭐⭐ | 高速 (<0.5s) ⭐⭐⭐ |
| **SEO最適化** | 弱い | 強い ⭐⭐⭐ | 強い ⭐⭐⭐ |
| **リアルタイム更新** | ✅ あり | ❌ ビルド時 | ❌ ビルド時 |
| **更新待機時間** | 即時 | 最大5分 | 最大5分 |
| **サーバー必要** | ❌ 不要 | ❌ 不要 | ❌ 不要 |
| **デプロイ手順** | 自動 | 手動または自動 | 自動 (GitHub Actions) |
| **開発環境構築** | 5分 | 30分 | 1時間 |
| **メンテナンス** | 簡単 | 簡単 | 簡単 |
| **推奨度** | ★★☆ | ★★★ | ★★★ |
| **用途** | テスト・検証 | 本番推奨 | エンタープライズ |

---

## 📱 パターン別特徴

### パターン1: 簡単版（クライアント側で動的取得）

```
Notion Database
    ↓ (Notion API)
ブラウザ (JavaScript)
    ↓ (リアルタイム取得)
ページ表示
```

**メリット**
- ✅ セットアップが最も簡単（5分）
- ✅ Notionで編集後、即座に反映
- ✅ サーバー不要
- ✅ デプロイは単なる静的ファイル

**デメリット**
- ❌ ページ読み込みが遅い (2-3秒)
- ❌ API呼び出し回数制限あり（1時間3ユーザーあたり120回）
- ❌ SEOに弱い（JavaScript実行待つため）
- ❌ 初回読み込み時にNotionが遅いと全体が遅い

**推奨: テスト・小規模サイト向け**

---

### パターン2: 推奨版（ビルド時に取得→HTML生成）

```
Notion Database
    ↓ (build時のみ)
スクリプト実行
    ↓ (Notion APIで取得)
HTML/JSON生成
    ↓
GitHub / Vercel
    ↓
高速配信
```

**メリット**
- ✅ ページ速度が高速 (<1秒)
- ✅ SEO最適化完全対応
- ✅ API呼び出し少ない（ビルド時のみ）
- ✅ Notionダウンでもサイト稼働
- ✅ バックアップ自動取得

**デメリット**
- ❌ 更新後、ビルドが必要 (2-5分待機)
- ❌ 手動ビルドの場合、手作業が増える
- ❌ セットアップやや複雑

**推奨: 本番運用向け（ブログ+ゲーム）**

---

### パターン3: 上級版（GitHub Actions自動化）

```
Notion Database
    ↓ (更新検知)
GitHub Actions トリガー
    ↓ (自動実行)
スクリプト実行
    ↓
HTML/JSON生成
    ↓
自動プッシュ
    ↓
Vercel 自動デプロイ
```

**メリット**
- ✅ 完全自動化（Notion編集 → サイト更新）
- ✅ 最高速ページ速度
- ✅ SEO最適化完全対応
- ❌ API呼び出し少ない
- ✅ 手作業ゼロ

**デメリット**
- ❌ セットアップが複雑 (1時間)
- ❌ GitHub Actions設定が必要
- ❌ 維持管理にある程度の技術知識が必要

**推奨: エンタープライズ・フル自動化したい人向け**

---

## 💰 API制限

### Notion API レート制限

- **無料プラン**: 3ユーザー あたり 1時間120リクエスト
- **有料プラン**: 制限なし（ただし実質上は十分）

### 実際の影響

- **簡単版**: ユーザー10人が同時アクセス → 制限に引っかかる可能性
- **推奨版**: ビルド時のみ → まず制限にかからない
- **上級版**: スケジュール実行 → 制限なし

**結論**: 簡単版でいくなら、有料プラン推奨（月$5）

---

## 🎯 我々の推奨: パターン2（推奨版）

### 理由

1. **実装の難易度と効果のバランスが最高**
   - セットアップ30分で本番レベルの品質

2. **運用が簡単**
   - Vercel/Netlify連携で自動ビルド可能
   - または `npm run build && git push` で完了

3. **コスト効率**
   - Vercelは月5ドルで無制限デプロイ
   - Notion APIは無料プランで十分

4. **SEOに強い**
   - ゲーム情報などが検索対象になる

5. **拡張性がある**
   - あとで上級版へのアップグレードも容易

---

## 🚀 実装ロードマップ

### すぐに始められるなら

```
1日目: パターン2をセットアップ (2時間)
2日目: Notionデータベース設計 (1時間)
3日目: 既存コンテンツをNotionに移行 (2時間)
4日目: テスト・デプロイ (1時間)
完成！
```

### 段階的に始めるなら

```
Week1: パターン1で試験導入
Week2: パターン2に移行
Week3: GitHub Actions自動化検討
```

---

# パターン1: 簡単版（詳細実装ガイド）

## セットアップ（5分）

### 1. Notion Integration作成

1. [Notion Developers](https://www.notion.com/my-integrations) にアクセス
2. "New integration" をクリック
3. 名前: `norinori1-portfolio`
4. 作成 → **Secret Token をコピー**

### 2. HTMLにスクリプト追加

```html
<!DOCTYPE html>
<html lang="ja">
<head>
    <meta charset="UTF-8">
    <title>norinori1 Portfolio</title>
</head>
<body>
    <!-- Notion APIスクリプト -->
    <script src="https://cdn.jsdelivr.net/npm/@notionhq/client@latest"></script>
    
    <!-- ゲーム表示エリア -->
    <div id="games-container"></div>
    
    <script>
        // Notionデータベース取得スクリプト
        const NOTION_TOKEN = 'secret_YOUR_TOKEN_HERE'; // ⚠️ 本番ではセキュア化が必要
        const DATABASE_ID = 'YOUR_DATABASE_ID';
        
        async function loadGamesFromNotion() {
            try {
                const response = await fetch(`https://api.notion.com/v1/databases/${DATABASE_ID}/query`, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${NOTION_TOKEN}`,
                        'Notion-Version': '2022-06-28'
                    },
                    body: JSON.stringify({})
                });
                
                const data = await response.json();
                renderGames(data.results);
            } catch (error) {
                console.error('Notion API error:', error);
            }
        }
        
        function renderGames(games) {
            const container = document.getElementById('games-container');
            container.innerHTML = games.map(game => {
                const props = game.properties;
                return `
                    <article class="game-card">
                        <h3>${props.Title.title[0].plain_text}</h3>
                        <p>${props.Description.rich_text[0]?.plain_text || ''}</p>
                        <a href="${props.Link.url}">Play Now →</a>
                    </article>
                `;
            }).join('');
        }
        
        // ページロード時に実行
        loadGamesFromNotion();
    </script>
</body>
</html>
```

### 3. Notion Security（重要）

⚠️ **クライアント側にトークンを置くのはセキュリティリスク**

**改善版: Vercel Functions使用**

```javascript
// /api/notion-games.js (Vercel)
export default async function handler(req, res) {
    const response = await fetch(
        `https://api.notion.com/v1/databases/${process.env.NOTION_DATABASE_ID}/query`,
        {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${process.env.NOTION_TOKEN}`,
                'Notion-Version': '2022-06-28'
            },
            body: JSON.stringify({})
        }
    );
    
    const data = await response.json();
    res.status(200).json(data);
}
```

```html
<!-- クライアント側 -->
<script>
    async function loadGames() {
        const res = await fetch('/api/notion-games');
        const data = await res.json();
        renderGames(data.results);
    }
</script>
```

---

# パターン2: 推奨版（詳細実装ガイド）

## セットアップ（30分）

### 1. Node.jsプロジェクト初期化

```bash
npm init -y
npm install @notionhq/client dotenv
```

### 2. 環境変数設定

```bash
# .env
NOTION_TOKEN=secret_YOUR_TOKEN_HERE
NOTION_DATABASE_ID=YOUR_DATABASE_ID
```

### 3. ビルドスクリプト作成

```javascript
// scripts/build-from-notion.js
const { Client } = require('@notionhq/client');
const fs = require('fs');
require('dotenv').config();

const notion = new Client({ 
    auth: process.env.NOTION_TOKEN 
});

const DATABASE_ID = process.env.NOTION_DATABASE_ID;

async function buildFromNotion() {
    try {
        // Notionデータベースから取得
        const response = await notion.databases.query({
            database_id: DATABASE_ID,
            sorts: [{ property: 'Status', direction: 'descending' }]
        });
        
        // HTMLに変換
        const gamesHtml = response.results.map(page => {
            const props = page.properties;
            return `
                <article class="game-card" data-game-id="${page.id}">
                    <h3>${props.Title.title[0].plain_text}</h3>
                    <p>${props.Description.rich_text[0]?.plain_text || ''}</p>
                    <a href="${props.Link.url}" target="_blank">
                        Play Now →
                    </a>
                </article>
            `;
        }).join('\n');
        
        // HTMLファイル生成
        const html = `
<!DOCTYPE html>
<html>
<head>
    <title>norinori1 Portfolio</title>
</head>
<body>
    <section id="games">
        ${gamesHtml}
    </section>
</body>
</html>
        `;
        
        fs.writeFileSync('./index.html', html);
        console.log('✅ ビルド完了: index.html');
        
        // JSON形式でも保存（キャッシュ用）
        fs.writeFileSync('./data/games.json', JSON.stringify(response.results, null, 2));
        console.log('✅ データ保存: data/games.json');
        
    } catch (error) {
        console.error('❌ ビルドエラー:', error);
    }
}

buildFromNotion();
```

### 4. package.json スクリプト追加

```json
{
  "scripts": {
    "build": "node scripts/build-from-notion.js",
    "dev": "npm run build && node -m http.server 8000"
  }
}
```

### 5. 実行

```bash
# 手動ビルド
npm run build

# 開発サーバー
npm run dev
```

### 6. Notion API Security

```bash
# .gitignore
.env
node_modules/
```

---

## Notionデータベース設計

### ゲーム情報テーブル

| 項目 | 型 | 説明 |
|------|-----|------|
| **Title** | Text | ゲームタイトル |
| **Description** | Rich Text | 短い説明 |
| **Link** | URL | リンク (itch.io等) |
| **Status** | Select | Latest / Featured / Released |
| **Tags** | Multi-select | Unity, Strategic 等 |
| **Thumbnail** | File | ゲーム画像 |
| **Engines** | Multi-select | Unity, C# 等 |
| **ReleaseDate** | Date | リリース日 |
| **Featured** | Checkbox | トップに表示するか |

### ニュース・DevLog テーブル

| 項目 | 型 | 説明 |
|------|-----|------|
| **Title** | Text | 記事タイトル |
| **Content** | Rich Text | 本文 |
| **Date** | Date | 投稿日 |
| **Status** | Select | Published / Draft |
| **Tags** | Multi-select | ゲーム開発, Unity等 |
| **Featured** | Checkbox | トップに表示するか |

### プロフィール・スキル テーブル

| 項目 | 型 | 説明 |
|------|-----|------|
| **Category** | Text | Game Engines等 |
| **Skill** | Text | Unity, C# 等 |
| **Level** | Select | Expert, Advanced等 |
| **Description** | Rich Text | 説明 |

---

# パターン3: 上級版（GitHub Actions自動化）

## セットアップ（1時間）

### 1. GitHub Actions ワークフロー作成

```yaml
# .github/workflows/build-from-notion.yml
name: Build from Notion

on:
  workflow_dispatch:  # 手動トリガー
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
      
      - name: Install dependencies
        run: npm install
      
      - name: Build from Notion
        run: npm run build
        env:
          NOTION_TOKEN: ${{ secrets.NOTION_TOKEN }}
          NOTION_DATABASE_ID: ${{ secrets.NOTION_DATABASE_ID }}
      
      - name: Git config
        run: |
          git config --local user.email "action@github.com"
          git config --local user.name "GitHub Action"
      
      - name: Commit & push
        run: |
          git add .
          git commit -m "🔄 Auto-build from Notion" || true
          git push
      
      - name: Deploy to Vercel
        run: npx vercel --prod
        env:
          VERCEL_TOKEN: ${{ secrets.VERCEL_TOKEN }}
          VERCEL_ORG_ID: ${{ secrets.VERCEL_ORG_ID }}
          VERCEL_PROJECT_ID: ${{ secrets.VERCEL_PROJECT_ID }}
```

### 2. GitHub Secrets設定

```
Settings → Secrets → New repository secret

NOTION_TOKEN=secret_xxx
NOTION_DATABASE_ID=xxx
VERCEL_TOKEN=xxx
VERCEL_ORG_ID=xxx
VERCEL_PROJECT_ID=xxx
```

### 3. Webhook（さらに高速化）

Notion更新時に即座にトリガーする方法（Zapierなど使用）

---

## 🎯 我々の選択: パターン2 実装

以降のガイドでは、**パターン2（推奨版）** の完全実装を説明します。

---

## まとめ

| パターン | 選ぶべき人 |
|---------|----------|
| **簡単版** | まずテストしてみたい人、小規模サイト |
| **推奨版** | 本番運用・個人ブログ・中規模サイト ⭐ |
| **上級版** | 完全自動化・企業サイト・複雑な運用 |

**我々の結論: パターン2（推奨版）を実装ガイドにします** 🚀

次のファイルで詳細実装ガイドを提供します。

---

**更新日**: 2025年3月27日
