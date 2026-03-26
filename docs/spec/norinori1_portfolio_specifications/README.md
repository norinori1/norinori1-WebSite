# norinori1 ゲーム開発者ポートフォリオサイト

成果物を集めたWebサイト兼ポートフォリオの完全実装です。

## 📦 ファイル一覧

### 1. **portfolio.html** ⭐ 推奨
- **用途**: ブラウザで直接開くことができるスタンドアロンWebサイト
- **使い方**: ファイルをダブルクリックするか、ブラウザにドラッグ&ドロップ
- **特徴**: 
  - 外部依存なし（React不要）
  - 即座に使用可能
  - ホスティング不要で動作
  - GitHub Pages対応

### 2. **portfolio.jsx**
- **用途**: Reactプロジェクト向けコンポーネント
- **使い方**: Next.jsやReactアプリにインポートして使用
- **特徴**: Reactの状態管理、ホバーアニメーション、スムーズなインタラクション

### 3. **norinori1_profile.md**
- **用途**: プロフィール情報のマークダウン版
- **使い方**: README、ブログ、各種ドキュメントに組み込む

---

## 🚀 すぐに始める

### ローカルで確認
```bash
# portfolio.htmlをブラウザで開く
open portfolio.html        # macOS
start portfolio.html       # Windows
xdg-open portfolio.html    # Linux
```

### GitHub Pagesで公開
```bash
# リポジトリにファイルをコミット
git add portfolio.html
git commit -m "Add game developer portfolio"
git push origin main

# Settings → Pages で main ブランチを選択
# https://[username].github.io/portfolio.html でアクセス可能
```

### 独自ドメインでホスト
```bash
# Netlify, Vercel, Firebase Hosting など任意のホスティングサービスに
# portfolio.html をアップロード
```

---

## 🎨 デザイン特徴

### ビジュアル
- **テーマ**: モダン・ダークテーマ
- **メインカラー**: インディゴ＆ブルー
- **レスポンシブ**: モバイル、タブレット、デスクトップ対応

### セクション
1. **Navigation** - スムーズなスクロール対応
2. **Profile/Hero** - インパクトのある自己紹介
3. **Featured Games** - ゲーム作品のカード表示
4. **Skills & Expertise** - 技術スキルと研究中の領域
5. **Find Me Online** - SNS・プラットフォームへのリンク
6. **Footer** - サイト情報

### アニメーション
- スクロール時のフェードイン
- ホバー時のカード拡大
- ナビゲーションの背景変化
- スムーズなボタンインタラクション

---

## 🔧 カスタマイズガイド

### プロフィール情報の変更

#### HTMLファイルの場合
```html
<!-- hero.html内の以下の部分を編集 -->
<h1>Game Developer</h1>
<p>Crafting experiences...</p>

<!-- platformsセクション内のリンクを編集 -->
<a href="https://your-itch-io-url">
```

#### Reactコンポーネントの場合
```javascript
// portfolio.jsx内の games, skills, platforms 配列を編集
const games = [
  {
    title: 'Your Game Title',
    description: '...',
    // ...
  }
];
```

### 色のカスタマイズ

HTMLファイル:
```css
/* style内の色定義を変更 */
background: linear-gradient(135deg, #6366F1, #3B82F6); /* グラデーション */
color: #f1f5f9; /* テキスト色 */
```

Reactコンポーネント:
```javascript
const styles = {
  heroTitle: {
    background: 'linear-gradient(135deg, #YOUR_COLOR, #YOUR_COLOR)',
  }
};
```

### ゲーム情報の追加

```javascript
// games配列に新しいオブジェクトを追加
{
  title: '新作ゲーム',
  description: 'ゲームの説明',
  status: 'Latest',      // オプション
  platforms: ['PC', 'Web'],
  link: 'https://itch.io/...',
  tags: ['Unity', 'Puzzle'],
}
```

---

## 📱 レスポンシブ対応

- **デスクトップ** (1200px以上): 3カラムグリッド
- **タブレット** (768px～1200px): 2カラムグリッド
- **モバイル** (～768px): 1カラム、最適化レイアウト

---

## 🌐 外部リンク統合

ポートフォリオサイトは以下へ自動的にリンクされています：

- **itch.io**: https://norinori1.itch.io
- **Scratch**: https://scratch.mit.edu/users/norinori1/
- **X (Twitter)**: https://x.com/norinori1_

リンクは各セクションの「Visit →」ボタンから新しいタブで開きます。

---

## ⚡ パフォーマンス

- **ファイルサイズ**: ~25KB (HTML版)
- **ロード時間**: < 1秒
- **SEO対応**: 
  - メタタグ設定済み
  - Semantic HTML
  - モバイルフレンドリー

---

## 🛠  技術スタック

### HTML版
- HTML5
- CSS3 (Grid, Flexbox, Gradient)
- Vanilla JavaScript (ES6+)

### React版
- React 18+
- Inline CSS / styled-components互換
- Responsive design

---

## 📋 SEO設定（オプション）

メタタグを追加して検索エンジン最適化：

```html
<meta name="description" content="ゲーム開発者のポートフォリオサイト。Unity、Roblox、Scratchで制作したゲーム作品を展示。">
<meta name="keywords" content="ゲーム開発, Unity, インディーゲーム, ゲーム開発者">
<meta name="author" content="norinori1">
<meta property="og:title" content="norinori1 - Game Developer Portfolio">
<meta property="og:description" content="ゲーム開発者のポートフォリオサイト">
<meta property="og:image" content="[OG画像URL]">
```

---

## 📧 サポート

- **バグ報告**: ファイルの不具合があれば報告してください
- **カスタマイズ**: 上記のガイドに従って自由にカスタマイズ可能
- **拡張**: セクションの追加や機能追加は制限なし

---

## 📝 ライセンス

このポートフォリオテンプレートは自由に使用、カスタマイズ、配布できます。

---

## ✨ おすすめの次のステップ

1. **ドメイン取得**: お名前.com、Google Domains など
2. **ホスティング**: GitHub Pages, Vercel, Netlify (全て無料)
3. **SNS連携**: Twitter, LinkedInのプロフィールにリンク追加
4. **Google Analytics**: アクセス解析の設定
5. **OG画像作成**: ソーシャルメディアシェア用画像

---

**Happy Coding! 🎮✨**
