# HEADER_COMPONENT.md - グローバルヘッダー実装コード

完全に実装可能なヘッダーコンポーネント。コピペで使用可能です。

---

## 1. HTML マークアップ

```html
<!DOCTYPE html>
<html lang="ja">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>norinori1 - Game Developer Portfolio</title>
    <link rel="stylesheet" href="header.css">
</head>
<body>
    <!-- グローバルヘッダー -->
    <header class="header" id="mainHeader">
        <div class="header__container">
            <!-- ロゴ -->
            <a href="/" class="header__logo">
                <svg class="logo-icon" viewBox="0 0 40 40" width="32" height="32">
                    <defs>
                        <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" style="stop-color:#6366F1;stop-opacity:1" />
                            <stop offset="100%" style="stop-color:#3B82F6;stop-opacity:1" />
                        </linearGradient>
                    </defs>
                    <!-- ジオメトリック立方体 -->
                    <g stroke="url(#logoGradient)" stroke-width="1.5" fill="none" stroke-linecap="round" stroke-linejoin="round">
                        <!-- 正面 -->
                        <rect x="8" y="12" width="12" height="12" />
                        <!-- 上面 -->
                        <polyline points="8,12 14,6 26,6 20,12" />
                        <!-- 側面 -->
                        <polyline points="20,12 26,6" />
                        <polyline points="20,12 20,24" />
                        <polyline points="20,24 26,18" />
                        <polyline points="26,6 26,18" />
                    </g>
                </svg>
                <span class="logo-text">norinori1</span>
            </a>

            <!-- グローバルナビゲーション -->
            <nav class="header__nav" id="mainNav">
                <ul class="nav-list">
                    <!-- ABOUT -->
                    <li class="nav-item">
                        <a href="/about" class="nav-link" data-nav="about">
                            <svg class="nav-icon" viewBox="0 0 24 24" width="20" height="20">
                                <circle cx="12" cy="8" r="3" stroke="currentColor" stroke-width="1.5" fill="none"/>
                                <path d="M 8 14 Q 8 11 12 11 Q 16 11 16 14 L 16 18 Q 16 19 15 19 L 9 19 Q 8 19 8 18 Z" 
                                      stroke="currentColor" stroke-width="1.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
                            </svg>
                            <span class="nav-label">About</span>
                        </a>
                    </li>

                    <!-- WORKS -->
                    <li class="nav-item">
                        <a href="/works" class="nav-link" data-nav="works">
                            <svg class="nav-icon" viewBox="0 0 24 24" width="20" height="20">
                                <!-- ペン -->
                                <path d="M 5 19 L 19 5 M 19 5 L 21 3 M 21 3 Q 22.5 1.5 24 0 Q 22.5 1.5 21 3" 
                                      stroke="currentColor" stroke-width="1.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
                                <circle cx="5" cy="19" r="2" stroke="currentColor" stroke-width="1.5" fill="none"/>
                            </svg>
                            <span class="nav-label">Works</span>
                        </a>
                    </li>

                    <!-- NEWS -->
                    <li class="nav-item">
                        <a href="/news" class="nav-link" data-nav="news">
                            <svg class="nav-icon" viewBox="0 0 24 24" width="20" height="20">
                                <!-- メガホン -->
                                <path d="M 6 12 L 2 14 L 2 10 L 6 12" 
                                      stroke="currentColor" stroke-width="1.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
                                <circle cx="14" cy="12" r="6" 
                                        stroke="currentColor" stroke-width="1.5" fill="none"/>
                                <path d="M 20 8 Q 23 12 20 16" 
                                      stroke="currentColor" stroke-width="1.5" fill="none" stroke-linecap="round"/>
                            </svg>
                            <span class="nav-label">News</span>
                        </a>
                    </li>
                </ul>
            </nav>

            <!-- ハンバーガーメニュー（モバイル） -->
            <button class="header__menu-toggle" id="menuToggle" aria-label="メニュー開閉" aria-expanded="false">
                <span></span>
                <span></span>
                <span></span>
            </button>
        </div>
    </header>

    <!-- Main Content -->
    <main style="padding-top: 64px;">
        <!-- ここにコンテンツ -->
    </main>

    <script src="header.js"></script>
</body>
</html>
```

---

## 2. CSS スタイル (header.css)

```css
/* ========================================
   変数定義
   ======================================== */
:root {
    --header-height: 64px;
    --color-primary: #3B8FD9;
    --color-primary-dark: #1F5BA6;
    --color-secondary: #0099FF;
    --color-neutral-50: #FFFFFF;
    --color-neutral-200: #E2E8F0;
    --color-neutral-500: #64748B;
    --color-neutral-900: #0F172A;
    --border-color: rgba(59, 143, 217, 0.2);
    --transition: all 0.3s ease;
}

/* ========================================
   リセット
   ======================================== */
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

html {
    scroll-behavior: smooth;
}

/* ========================================
   ヘッダー
   ======================================== */
.header {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 1000;
    height: var(--header-height);
    background-color: var(--color-neutral-50);
    border-bottom: 1px solid var(--color-neutral-200);
    transition: var(--transition);
}

.header.scrolled {
    background-color: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(10px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.header__container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 2rem;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
}

/* ========================================
   ロゴ
   ======================================== */
.header__logo {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    text-decoration: none;
    transition: var(--transition);
    flex-shrink: 0;
}

.header__logo:hover {
    opacity: 0.8;
}

.logo-icon {
    width: 32px;
    height: 32px;
    flex-shrink: 0;
}

.logo-text {
    font-size: 1.25rem;
    font-weight: 700;
    font-family: 'Geist Mono', 'JetBrains Mono', monospace;
    color: var(--color-primary-dark);
    letter-spacing: -0.02em;
    white-space: nowrap;
}

/* ========================================
   ナビゲーション
   ======================================== */
.header__nav {
    flex: 1;
    display: flex;
    justify-content: flex-end;
    margin: 0;
    padding: 0;
}

.nav-list {
    display: flex;
    gap: 2rem;
    list-style: none;
    margin: 0;
    padding: 0;
    align-items: center;
}

.nav-item {
    height: 100%;
    display: flex;
    align-items: center;
}

.nav-link {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    height: 100%;
    padding: 0 0.5rem;
    text-decoration: none;
    color: var(--color-neutral-500);
    font-size: 0.9rem;
    font-weight: 500;
    transition: var(--transition);
    position: relative;
}

.nav-link:hover {
    color: var(--color-primary);
}

.nav-link:hover .nav-icon {
    stroke: var(--color-primary);
    color: var(--color-primary);
}

/* アクティブリンク */
.nav-link.active {
    color: var(--color-primary);
}

.nav-link.active::after {
    content: '';
    position: absolute;
    bottom: -1px;
    left: 0;
    right: 0;
    height: 2px;
    background-color: var(--color-primary);
    animation: slideIn 0.3s ease;
}

@keyframes slideIn {
    from {
        width: 0;
        left: 50%;
    }
    to {
        width: 100%;
        left: 0;
    }
}

.nav-icon {
    width: 20px;
    height: 20px;
    stroke: currentColor;
    stroke-width: 1.5;
    fill: none;
    stroke-linecap: round;
    stroke-linejoin: round;
    transition: var(--transition);
    flex-shrink: 0;
}

.nav-label {
    white-space: nowrap;
}

/* ========================================
   ハンバーガーメニュー（モバイル）
   ======================================== */
.header__menu-toggle {
    display: none;
    flex-direction: column;
    gap: 0.35rem;
    background: none;
    border: none;
    cursor: pointer;
    padding: 0.5rem;
    margin-right: -0.5rem;
    z-index: 1001;
}

.header__menu-toggle span {
    width: 24px;
    height: 2px;
    background-color: var(--color-neutral-500);
    transition: var(--transition);
    transform-origin: center;
}

.header__menu-toggle:hover span {
    background-color: var(--color-primary);
}

/* メニュー開いている状態 */
.header__menu-toggle.open span:nth-child(1) {
    transform: rotate(45deg) translate(8px, 8px);
    background-color: var(--color-primary);
}

.header__menu-toggle.open span:nth-child(2) {
    opacity: 0;
}

.header__menu-toggle.open span:nth-child(3) {
    transform: rotate(-45deg) translate(7px, -7px);
    background-color: var(--color-primary);
}

/* ========================================
   レスポンシブ
   ======================================== */
@media (max-width: 768px) {
    .header__container {
        padding: 0 1rem;
    }

    .header__menu-toggle {
        display: flex;
    }

    /* モバイル時のナビゲーション非表示 */
    .header__nav {
        position: absolute;
        top: var(--header-height);
        left: 0;
        right: 0;
        background-color: var(--color-neutral-800);
        border-bottom: 1px solid var(--border-color);
        flex-direction: column;
        max-height: 0;
        overflow: hidden;
        transition: max-height 0.3s ease;
    }

    /* メニュー開いている状態 */
    .header__nav.open {
        max-height: 200px;
    }

    .nav-list {
        flex-direction: column;
        gap: 0;
        width: 100%;
    }

    .nav-item {
        width: 100%;
        height: auto;
        border-bottom: 1px solid var(--border-color);
    }

    .nav-link {
        width: 100%;
        padding: 1rem;
        gap: 1rem;
    }

    .nav-link.active::after {
        display: none;
    }

    .nav-link.active {
        background-color: rgba(99, 102, 241, 0.1);
        border-left: 3px solid var(--color-primary);
        padding-left: calc(1rem - 3px);
    }

    .logo-text {
        font-size: 1.1rem;
    }
}

@media (max-width: 480px) {
    .header__container {
        padding: 0 0.75rem;
    }

    .logo-text {
        font-size: 1rem;
    }

    .nav-label {
        display: none; /* ラベルを非表示にしてアイコンのみ */
    }

    .nav-link {
        padding: 0.75rem;
    }

    .nav-icon {
        width: 24px;
        height: 24px;
    }
}

/* ========================================
   フォーカス（アクセシビリティ）
   ======================================== */
.nav-link:focus,
.header__logo:focus,
.header__menu-toggle:focus {
    outline: 2px solid var(--color-primary);
    outline-offset: 2px;
}

/* ========================================
   プリント対応
   ======================================== */
@media print {
    .header {
        position: static;
        margin-bottom: 2rem;
    }
}
```

---

## 3. JavaScript インタラクション (header.js)

```javascript
// ========================================
// ヘッダーコンポーネント
// ========================================

class HeaderComponent {
    constructor() {
        this.header = document.getElementById('mainHeader');
        this.nav = document.getElementById('mainNav');
        this.menuToggle = document.getElementById('menuToggle');
        this.navLinks = document.querySelectorAll('.nav-link');
        
        this.init();
    }

    init() {
        // イベントリスナー設定
        this.menuToggle.addEventListener('click', () => this.toggleMenu());
        this.navLinks.forEach(link => {
            link.addEventListener('click', () => this.handleNavClick(link));
        });

        // スクロール検出
        window.addEventListener('scroll', () => this.handleScroll());
        
        // ページロード時にアクティブリンク設定
        this.setActiveLink();
        
        // GA4イベント設定
        this.initGA4Tracking();
    }

    // ========================================
    // メニュー開閉
    // ========================================
    toggleMenu() {
        const isOpen = this.menuToggle.classList.contains('open');
        
        if (isOpen) {
            this.closeMenu();
        } else {
            this.openMenu();
        }
    }

    openMenu() {
        this.menuToggle.classList.add('open');
        this.menuToggle.setAttribute('aria-expanded', 'true');
        this.nav.classList.add('open');
    }

    closeMenu() {
        this.menuToggle.classList.remove('open');
        this.menuToggle.setAttribute('aria-expanded', 'false');
        this.nav.classList.remove('open');
    }

    // ========================================
    // ナビゲーション処理
    // ========================================
    handleNavClick(link) {
        // メニューを閉じる
        this.closeMenu();
        
        // アクティブリンク更新
        this.setActiveLinkByElement(link);
        
        // GA4 追跡
        const navLabel = link.getAttribute('data-nav');
        this.trackNavClick(navLabel);
    }

    setActiveLink() {
        const currentPath = window.location.pathname;
        this.navLinks.forEach(link => {
            const href = link.getAttribute('href');
            if (href === currentPath || (currentPath === '/' && href === '/')) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
    }

    setActiveLinkByElement(element) {
        this.navLinks.forEach(link => link.classList.remove('active'));
        element.classList.add('active');
    }

    // ========================================
    // スクロール検出
    // ========================================
    handleScroll() {
        if (window.scrollY > 50) {
            this.header.classList.add('scrolled');
        } else {
            this.header.classList.remove('scrolled');
        }
    }

    // ========================================
    // GA4 トラッキング
    // ========================================
    initGA4Tracking() {
        this.navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                const navLabel = link.getAttribute('data-nav');
                const url = link.getAttribute('href');
                this.trackNavClick(navLabel, url);
            });
        });
    }

    trackNavClick(navLabel, url = null) {
        if (typeof gtag !== 'undefined') {
            gtag('event', 'header_nav_click', {
                'nav_item': navLabel,
                'destination_url': url,
                'event_category': 'engagement',
                'event_label': `header_${navLabel}`
            });
        }
    }

    // ========================================
    // ユーティリティ
    // ========================================
    log(message) {
        console.log(`[Header] ${message}`);
    }
}

// ========================================
// 初期化
// ========================================
document.addEventListener('DOMContentLoaded', () => {
    new HeaderComponent();
});
```

---

## 4. SVG アイコン詳細

### ロゴアイコン（立方体）

**特徴**:
- Isometric 投影（45°角度）
- Gradient fill（primary → secondary）
- ストロークベース（手書き風）

```svg
<svg viewBox="0 0 40 40" width="32" height="32">
    <defs>
        <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:#6366F1;stop-opacity:1" />
            <stop offset="100%" style="stop-color:#3B82F6;stop-opacity:1" />
        </linearGradient>
    </defs>
    <g stroke="url(#logoGradient)" stroke-width="1.5" fill="none">
        <rect x="8" y="12" width="12" height="12" />
        <polyline points="8,12 14,6 26,6 20,12" />
        <polyline points="20,12 26,6" />
        <polyline points="20,12 20,24" />
        <polyline points="20,24 26,18" />
        <polyline points="26,6 26,18" />
    </g>
</svg>
```

### ABOUT アイコン（人物）

シンプルな人物シルエット。

```svg
<svg viewBox="0 0 24 24" width="20" height="20">
    <circle cx="12" cy="8" r="3" stroke="currentColor" stroke-width="1.5" fill="none"/>
    <path d="M 8 14 Q 8 11 12 11 Q 16 11 16 14 L 16 18 Q 16 19 15 19 L 9 19 Q 8 19 8 18 Z" 
          stroke="currentColor" stroke-width="1.5" fill="none" />
</svg>
```

### WORKS アイコン（ペン）

創作性を表現するペンアイコン。

```svg
<svg viewBox="0 0 24 24" width="20" height="20">
    <path d="M 5 19 L 19 5 M 19 5 L 21 3 M 21 3 Q 22.5 1.5 24 0 Q 22.5 1.5 21 3" 
          stroke="currentColor" stroke-width="1.5" fill="none" />
    <circle cx="5" cy="19" r="2" stroke="currentColor" stroke-width="1.5" fill="none"/>
</svg>
```

### NEWS アイコン（メガホン）

情報発信を表現するメガホン。

```svg
<svg viewBox="0 0 24 24" width="20" height="20">
    <path d="M 6 12 L 2 14 L 2 10 L 6 12" 
          stroke="currentColor" stroke-width="1.5" fill="none" />
    <circle cx="14" cy="12" r="6" 
            stroke="currentColor" stroke-width="1.5" fill="none"/>
    <path d="M 20 8 Q 23 12 20 16" 
          stroke="currentColor" stroke-width="1.5" fill="none" />
</svg>
```

---

## 5. 使用方法

### 基本的な実装

```html
1. header.css をヘッドに link
2. HTMLマークアップをコピペ
3. header.js をボディの最後に script
4. GA4スクリプトを追加（オプション）
```

### GA4を含める場合

```html
<!-- Google Analytics 4 -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-XXXXXXXXXX');
</script>
```

### React での使用

```jsx
// Header.jsx
import { useState, useEffect } from 'react';
import './header.css';

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (navItem) => {
    setMenuOpen(false);
    gtag('event', 'header_nav_click', {
      'nav_item': navItem
    });
  };

  return (
    <header className={`header ${scrolled ? 'scrolled' : ''}`}>
      <div className="header__container">
        <a href="/" className="header__logo">
          <svg className="logo-icon" viewBox="0 0 40 40">
            {/* SVGコンテンツ */}
          </svg>
          <span className="logo-text">norinori1</span>
        </a>

        <nav className={`header__nav ${menuOpen ? 'open' : ''}`}>
          <ul className="nav-list">
            <li><a href="/about" className="nav-link" onClick={() => handleNavClick('about')}>About</a></li>
            <li><a href="/works" className="nav-link" onClick={() => handleNavClick('works')}>Works</a></li>
            <li><a href="/news" className="nav-link" onClick={() => handleNavClick('news')}>News</a></li>
          </ul>
        </nav>

        <button 
          className={`header__menu-toggle ${menuOpen ? 'open' : ''}`}
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <span></span><span></span><span></span>
        </button>
      </div>
    </header>
  );
}
```

---

## 6. 機能一覧

✅ **実装済み機能**:
- [x] 固定ヘッダー（position: fixed）
- [x] グラデーションロゴ
- [x] ホバーエフェクト（カラー変更）
- [x] アクティブリンク表示（下線アニメーション）
- [x] スクロール検出（背景色 + backdrop-filter）
- [x] ハンバーガーメニュー（モバイル対応）
- [x] メニュートグルアニメーション
- [x] GA4イベント追跡
- [x] キーボードナビゲーション対応
- [x] アクセシビリティ（ARIA属性）

---

**最終更新**: 2025年3月27日
