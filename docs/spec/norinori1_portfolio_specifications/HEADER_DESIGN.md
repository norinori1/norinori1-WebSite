# HEADER_DESIGN.md - グローバルヘッダーデザイン仕様

norinori1ポートフォリオサイトのグローバルヘッダーデザイン仕様書。
スケッチをベースにした詳細な実装ガイド。

---

## ビジュアル仕様

### スケッチ概要

```
┌────────────────────────────────────────────────────────┐
│                                                        │
│  ◊ norinori1          👤 ABOUT  ✎ WORKS  📢 NEWS    │
│                                                        │
└────────────────────────────────────────────────────────┘
```

### ロゴデザイン

#### norinori1 ロゴアイコン

**形状**: ジオメトリック立方体（Isometric）

**仕様**:
- サイズ: 32×32px
- ストロークスタイル: 手書き風（stroke-width: 1.5）
- 色: Linear Gradient（primary → secondary）
- 回転角: Isometric 45°

**構造**:
```
立方体の3面を構成
- 正面（フロント）: 水平線 + 垂直線
- 上面（トップ）: 対角線
- 側面（サイド）: 垂直線 + 対角線
```

**Gradient**:
- Start: #6366F1 (primary)
- End: #3B82F6 (secondary)
- Direction: 135°（左上→右下）

#### テキスト部分

**フォント**: Monospace（手書き風・技術的なイメージ）
- フォントファミリー: 'Geist Mono', 'JetBrains Mono'
- サイズ: 1.25rem (20px)
- 字重: 700 (Bold)
- 文字間隔: -0.02em（やや詰める）
- 色: #F1F5F9 (neutral-100)

**レイアウト**: アイコンとテキストの間隔 0.75rem

---

## ナビゲーション仕様

### 3つのメニュー項目

#### 1. ABOUT（プロフィール）

**アイコン**: 人物シルエット

```
┌─────┐
│ ◯   │  (頭部)
├─────┤
│  |  │  (体)
│ / \ │  (腕足)
└─────┘
```

**仕様**:
- サイズ: 20×20px
- ストロークで構成
- 簡潔なシルエット
- stroke-width: 1.5

#### 2. WORKS（作品・ゲーム）

**アイコン**: ペン/ブラシ

```
   ╱
  │ (ブラシ先端)
  │
  ├─ (持ち手)
  │
  │
```

**仕様**:
- サイズ: 20×20px
- 斜め45°角度
- 創作性を表現
- stroke-width: 1.5

#### 3. NEWS（ニュース・更新）

**アイコン**: スピーカー/メガホン

```
  /|
 / |  (スピーカーコーン)
|  |
 \ |
  \|
```

**仕様**:
- サイズ: 20×20px
- メガホンのような拡張形状
- 情報発信を表現
- stroke-width: 1.5

### ナビゲーション構造

```html
<nav class="header__nav" role="navigation" aria-label="グローバルナビゲーション">
  <ul class="nav-list">
    <li class="nav-item">
      <a href="/about" class="nav-link" data-nav="about">
        <svg class="nav-icon" viewBox="0 0 24 24" aria-hidden="true">
          <!-- ABOUT アイコン -->
        </svg>
        <span class="nav-label">About</span>
      </a>
    </li>
    <li class="nav-item">
      <a href="/works" class="nav-link" data-nav="works">
        <svg class="nav-icon" viewBox="0 0 24 24" aria-hidden="true">
          <!-- WORKS アイコン -->
        </svg>
        <span class="nav-label">Works</span>
      </a>
    </li>
    <li class="nav-item">
      <a href="/news" class="nav-link" data-nav="news">
        <svg class="nav-icon" viewBox="0 0 24 24" aria-hidden="true">
          <!-- NEWS アイコン -->
        </svg>
        <span class="nav-label">News</span>
      </a>
    </li>
  </ul>
</nav>
```

---

## スタイル仕様

### カラースキーム

```css
/* Header背景 */
--header-bg: #FFFFFF (white)
--header-bg-border: #E2E8F0 (neutral-200)

/* テキスト */
--nav-text-default: #64748B (neutral-500)
--nav-text-hover: #3B8FD9 (primary)
--nav-text-active: #1F5BA6 (primary-dark)

/* ロゴグラデーション */
--logo-gradient-start: #3B8FD9
--logo-gradient-end: #1F5BA6
```

### サイズ・スペーシング

```css
/* Layout */
header height: 64px (固定)
content-max-width: 1200px

/* Logo */
logo-icon-size: 32×32px
logo-text-size: 1.25rem
logo-gap: 0.75rem

/* Navigation */
nav-gap: 2rem (デスクトップ)
nav-item-gap: 0.5rem (icon + label)
nav-icon-size: 20×20px
nav-label-size: 0.9rem

/* Padding */
header-padding-x: 2rem
header-padding-y: 1rem
```

### トランジション・アニメーション

```css
/* ホバーエフェクト */
transition: all 0.3s ease;

/* スクロール背景変更 */
transition: background-color 0.3s ease, backdrop-filter 0.3s ease;

/* アクティブリンク下線 */
transition: border-color 0.3s ease, color 0.3s ease;
```

---

## インタラクション仕様

### ホバー状態

```css
.nav-link:hover {
  color: var(--color-primary);
  /* テキストカラーが primary に変更 */
}

.nav-link:hover .nav-icon {
  stroke: currentColor; /* カラー継承 */
}
```

### アクティブ状態

```css
.nav-link.active {
  color: var(--color-primary);
  border-bottom: 2px solid var(--color-primary);
  padding-bottom: 0.25rem;
}
```

### スクロール検出

```javascript
window.addEventListener('scroll', () => {
  const header = document.querySelector('header.header');
  if (window.scrollY > 50) {
    header.classList.add('scrolled');
  } else {
    header.classList.remove('scrolled');
  }
});
```

**scrolled 時の変更**:
- 背景色: より濃く、透半（rgba with 0.95）
- backdrop-filter: blur(10px) 追加
- 視認性向上

---

## レスポンシブ仕様

### ブレークポイント対応

#### デスクトップ (> 1024px)
```
├─ Logo
└─ Navigation (3項目、完全表示)
```

**特徴**:
- 全ナビゲーション表示
- フル幅レイアウト
- アイコン + ラベル表示

#### タブレット (640px - 1024px)
```
├─ Logo
└─ Navigation (3項目、コンパクト)
```

**特徴**:
- ナビゲーション圧縮（gap 1.5rem → 1rem）
- アイコンのみの表示オプション
- または完全非表示 + ハンバーガーメニュー

#### モバイル (< 640px)
```
├─ Logo
└─ ハンバーガーメニュー ☰
```

**特徴**:
- ハンバーガーメニュー表示
- ナビゲーション非表示（デフォルト）
- メニュー展開時にドロップダウン表示

### ハンバーガーメニュー仕様

```html
<button class="header__menu-toggle" 
        aria-label="メニュー開閉" 
        aria-expanded="false">
  <span></span>
  <span></span>
  <span></span>
</button>
```

**ビジュアル**:
- 3本線（アイコン）
- ホバー時：色が primary に変更
- クリック時：opened 状態（アニメーション）

**アニメーション**:
```css
/* 開く状態 */
.header__menu-toggle.open span:nth-child(1) {
  transform: rotate(45deg) translate(8px, 8px);
}

.header__menu-toggle.open span:nth-child(2) {
  opacity: 0;
}

.header__menu-toggle.open span:nth-child(3) {
  transform: rotate(-45deg) translate(7px, -7px);
}
```

---

## アクセシビリティ仕様

### キーボードナビゲーション

```css
/* フォーカスインジケーター */
.nav-link:focus {
  outline: 2px solid var(--color-primary);
  outline-offset: 4px;
}
```

### ARIA属性

```html
<!-- ナビゲーション -->
<nav role="navigation" aria-label="グローバルナビゲーション">

<!-- メニューボタン -->
<button aria-label="メニュー開閉" aria-expanded="false">

<!-- 非表示アイコン -->
<svg aria-hidden="true">
```

### スクリーンリーダー対応

- ナビゲーションラベルは常に表示
- アイコンには alt 属性不要（aria-hidden）
- リンクのテキストで目的地が明確

---

## 実装チェックリスト

- [ ] ロゴアイコンが gradient で表示される
- [ ] ナビゲーション項目がホバーで色が変わる
- [ ] アクティブページのリンクが下線表示される
- [ ] スクロール時にヘッダー背景が濃くなる
- [ ] モバイルでハンバーガーメニューが表示される
- [ ] キーボードで全ナビゲーション項目にアクセスできる
- [ ] スクリーンリーダーでナビゲーション構造が認識される
- [ ] SVGアイコンがコピペ不可（インライン化 + 難読化）
- [ ] GA4でナビゲーションクリック追跡

---

**参考**: SPEC.md の「デザインシステム」「GA4実装」も併せて確認

**最終更新**: 2025年3月27日
