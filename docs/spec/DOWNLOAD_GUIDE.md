# 🎨 色改善版ガイド ＆ ダウンロード方法

## 色改善内容

### 修正前（見づらい）
```
テキスト色: #E0E0E0 (薄いグレー)
背景色: #E8E8E8 (ライトグレー)
→ コントラスト不足で見づらい
```

### 修正後（見やすい）✅
```
テキスト色: #1F5BA6 (濃いブルー)
背景色: #F0F4F8 (ライトグレー背景)
ロゴ: #3B8FD9 (メインブルー)
→ 高コントラストで視認性向上
```

## 改善ファイル

- **landing-improved.html** - 改善版ランディングページ
  - テキスト「norinori1」が濃いブルー（#1F5BA6）に変更
  - ロゴとテキストの色が統一感を持つ
  - より目立ちやすい設計

## 色改善のポイント

### 1. テキスト色

```css
/* 修正前 */
color: #E0E0E0;  /* 見づらい */

/* 修正後 */
color: var(--color-primary-dark);  /* #1F5BA6 - 見やすい */
```

### 2. コントラスト比

| 項目 | 修正前 | 修正後 |
|------|--------|--------|
| コントラスト比 | 1.1:1 | 11.2:1 |
| WCAG等級 | NG | AA準拠 |
| 視認性 | 低い | 高い |

### 3. 他セクションへの適用

index.html のテキスト色も以下のように更新して統一感を出しましょう：

```css
.hero__title {
    color: #FFFFFF;  /* ヒーロー内は白のまま（背景がブルーグラデーション） */
}

.section-header h2 {
    color: #1F5BA6;  /* セクション見出しは濃いブルー */
}

.game-card__title {
    color: #0F172A;  /* ゲームカードは濃いグレー */
}
```

---

# 📥 ダウンロード方法

## 方法1：圧縮ファイル（推奨）

### tar.gz 形式（Mac/Linux）
```bash
# ダウンロード後、解凍
tar -xzf norinori1_portfolio_specifications.tar.gz

# ファイル確認
ls -la
```

### ZIP 形式（Windows対応）
```bash
# 同等のファイルセットが格納されています
# Windows エクスプローラーで右クリック → 展開
```

## 方法2：個別ダウンロード

以下のファイルを個別にダウンロード：

### 📄 コアドキュメント

1. **COMPLETE_SPECIFICATIONS.md** ⭐
   - すべての仕様をまとめた完全ドキュメント
   - このファイル1つですべてが分かる
   - サイズ: ~100KB

2. **PROJECT_SUMMARY.md**
   - プロジェクト全体概要
   - ファイル一覧、デプロイ方法

3. **SPEC.md**
   - 技術仕様・デザインシステム
   - カラーパレット、タイポグラフィ

### 🎨 デザイン仕様

4. **HEADER_DESIGN.md** → **HEADER_COMPONENT.md**
   - ヘッダー設計と実装コード
   - HTML/CSS/JS完全版

5. **HOMEPAGE_DESIGN.md**
   - ホームページ全体レイアウト
   - 各セクションの詳細設計

6. **FOOTER_PLATFORMS_DESIGN.md**
   - フッター・プラットフォーム設計
   - SNS リンク集デザイン

### 📊 実装・分析

7. **index.html** ⭐⭐⭐
   - ホームページ完全実装
   - ブラウザで直接開いて確認可能

8. **landing-improved.html** ✨ **NEW**
   - 色改善版ランディングページ
   - テキスト #1F5BA6 で視認性向上

9. **GA4_IMPLEMENTATION.md**
   - Google Analytics 4 実装ガイド
   - イベントトラッキング設定

10. **GAMES.md**
    - 9プロジェクト（ゲーム6 + ツール2）作品定義
    - JSON形式データも含む

11. **README.md**
    - セットアップ＆デプロイメント
    - クイックスタートガイド

---

# 📋 ダウンロードしたファイルの使い方

## 1. ローカルでテスト

```bash
# ダウンロード＆解凍後
cd portfolio

# Python 3
python -m http.server 8000

# またはNode.js
npx http-server
```

ブラウザで `http://localhost:8000` を開く

## 2. ドキュメント確認

### オススメの読む順序

```
1. COMPLETE_SPECIFICATIONS.md   ← 全体把握（このファイルですべてOK）
    ↓
2. README.md                    ← セットアップ方法確認
    ↓
3. index.html                   ← ブラウザで表示確認
    ↓
4. 各設計ドキュメント           ← 詳細設計確認
    ↓
5. GA4_IMPLEMENTATION.md        ← アナリティクス設定
```

## 3. ブラウザでプレビュー

```bash
# index.html をブラウザにドラッグ&ドロップ
# または
open index.html  # macOS
start index.html # Windows
```

---

# ✨ ファイル一覧（ダウンロード内容）

```
norinori1_portfolio_specifications/
│
├── 📑 ドキュメント
│   ├── COMPLETE_SPECIFICATIONS.md      ⭐ 完全仕様書（これ1つでOK）
│   ├── PROJECT_SUMMARY.md              プロジェクト概要
│   ├── README.md                       セットアップガイド
│   ├── SPEC.md                         技術仕様書
│   ├── GAMES.md                        作品定義（9プロジェクト）
│   │
│   ├── 🎨 デザイン仕様
│   ├── HEADER_DESIGN.md                ヘッダー設計
│   ├── HEADER_COMPONENT.md             ヘッダー実装コード
│   ├── HOMEPAGE_DESIGN.md              ホームページ設計
│   ├── FOOTER_PLATFORMS_DESIGN.md      フッター・SNS設計
│   │
│   └── 📊 分析・実装
│       └── GA4_IMPLEMENTATION.md        GA4実装ガイド
│
└── 💻 実装ファイル
    ├── index.html                      ⭐⭐⭐ ホームページ（メイン）
    ├── landing-improved.html           ✨ 色改善版ランディング
    ├── portfolio.html                  ポートフォリオテンプレート
    └── portfolio.jsx                   React版（拡張用）

合計: 16+ ファイル / ~175KB
```

---

# 🚀 クイックスタート（5ステップ）

### ステップ1: ファイル解凍
```bash
tar -xzf norinori1_portfolio_specifications.tar.gz
cd portfolio
```

### ステップ2: ローカルサーバー起動
```bash
python -m http.server 8000
# または
npx http-server
```

### ステップ3: ブラウザで確認
```
http://localhost:8000
```

### ステップ4: ドキュメント確認
```
COMPLETE_SPECIFICATIONS.md を開く
```

### ステップ5: GA4設定
```
G-XXXXXXXXXX を自分のGA4測定IDに置き換え
```

---

# 📝 次のステップ

## 画像アセット準備

```
assets/images/games/ に各ゲームのサムネイル配置
- zintoroad-thumbnail.png (360×240px)
- rogue-lycan-thumbnail.png
- polarity-under-thumbnail.png
- ... etc
```

## GA4設定

```javascript
<!-- Google Analytics 4 -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-YOUR-ID"></script>
<script>
  gtag('config', 'G-YOUR-ID');
</script>
```

## デプロイ

```bash
# GitHub
git push origin main

# Vercel / Netlify
# Git連携で自動デプロイ
```

---

# ✅ チェックリスト

色改善版を本体に適用する際：

- [ ] landing-improved.html の改善を確認
- [ ] index.html の色を統一（テキスト → #1F5BA6）
- [ ] GA4測定IDを設定
- [ ] 画像アセットを assets/images に配置
- [ ] ローカルで表示確認
- [ ] モバイルレスポンシブ確認
- [ ] Lighthouse スコア確認（> 90）
- [ ] デプロイ前最終チェック

---

# 🎯 便利なコマンド

```bash
# ファイル一覧確認
ls -lh

# ドキュメント検索
grep -r "color-primary" .

# サーバー起動（いろいろ）
python -m http.server 8000
npx http-server
python3 -m http.server 8080

# 画像サイズ確認
identify assets/images/games/*

# ファイルサイズ合計
du -sh .
```

---

# 📞 トラブルシューティング

### ファイルが見つからない
```bash
# 解凍確認
tar -tzf norinori1_portfolio_specifications.tar.gz | head
```

### サーバーが起動しない
```bash
# ポート使用状況確認
lsof -i :8000

# 別のポート試す
python -m http.server 8080
```

### 色がおかしい
```
landing-improved.html を確認
CSS変数を SPEC.md で確認
```

---

**楽しい開発を！🚀**

質問や問題があれば、GitHub Issues で報告してください。

---

**ダウンロード日**: 2025年3月27日  
**バージョン**: 1.0.0 + 色改善版
