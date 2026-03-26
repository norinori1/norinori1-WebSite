# FOOTER_PLATFORMS_DESIGN.md - フッター & プラットフォームセクション設計

ホームページのプラットフォーム/SNS セクションとフッターの仕様。

---

## プラットフォーム・SNS セクション

### ビジュアル構成

```
┌──────────────────────────────────────┐
│                                      │
│     Platforms & Social Links         │
│     私の活動拠点                     │
│                                      │
│  ┌────────┐  ┌────────┐  ┌────────┐│
│  │ itch.io│  │Twitter │  │GitHub  ││
│  └────────┘  └────────┘  └────────┘│
│                                      │
│  ┌────────┐  ┌────────┐  ┌────────┐│
│  │Scratch │  │Discord │  │Notion  ││
│  └────────┘  └────────┘  └────────┘│
│                                      │
└──────────────────────────────────────┘
```

### HTML構造

```html
<section class="platforms" id="platforms">
  <div class="container">
    <!-- セクションヘッダー -->
    <div class="section-header">
      <h2>Platforms & Social Links</h2>
      <p>私の活動拠点をフォローしてください</p>
    </div>

    <!-- プラットフォームグリッド -->
    <div class="platforms-grid">
      <!-- itch.io -->
      <a href="https://norinori1.itch.io" 
         class="platform-card" 
         target="_blank" 
         rel="noopener noreferrer">
        <div class="platform-card__icon">
          <svg viewBox="0 0 24 24">
            <!-- itch.io アイコン -->
            <path d="M 6 4 L 6 20 Q 6 22 8 22 L 10 22 Q 12 22 12 20 L 12 12 Q 12 12 12 12 L 14 12 Q 16 12 16 14 L 16 20 Q 16 22 18 22 L 20 22 Q 22 22 22 20 L 22 4"/>
          </svg>
        </div>
        <h3 class="platform-card__name">itch.io</h3>
        <p class="platform-card__description">
          ゲーム配布プラットフォーム
        </p>
        <span class="platform-card__link">Visit →</span>
      </a>

      <!-- X (Twitter) -->
      <a href="https://x.com/norinori1_" 
         class="platform-card" 
         target="_blank" 
         rel="noopener noreferrer">
        <div class="platform-card__icon">
          <svg viewBox="0 0 24 24">
            <!-- X (Twitter) アイコン -->
            <path d="M 4 4 L 20 20 M 20 4 L 4 20" stroke="currentColor" stroke-width="2" fill="none"/>
          </svg>
        </div>
        <h3 class="platform-card__name">X (Twitter)</h3>
        <p class="platform-card__description">
          開発日記とニュース
        </p>
        <span class="platform-card__link">Follow →</span>
      </a>

      <!-- GitHub -->
      <a href="https://github.com/norinori1" 
         class="platform-card" 
         target="_blank" 
         rel="noopener noreferrer">
        <div class="platform-card__icon">
          <svg viewBox="0 0 24 24">
            <!-- GitHub アイコン -->
            <path d="M 12 2 C 6.5 2 2 6.5 2 12 C 2 17.5 5.5 21.5 10 22 C 10.5 22 10.75 21.75 10.75 21.5 L 10.75 20.5 C 7.5 21 7 19 7 19 C 6.5 18 6 17 6 17 C 5 16 6 16 6 16 C 7 16 7.5 17 7.5 17 C 8.5 19 10 18.5 10.75 18.25 C 10.75 17.5 11 16.75 11.5 16.5 C 8.5 16.25 5.5 15 5.5 10.5 C 5.5 9 6 8 7.5 7 C 7.25 6.5 6.75 5 7.75 3.75 C 9 3.75 10 4.5 10.75 5 C 11.5 4.75 12.25 4.75 13 4.75 C 13.75 4.75 14.5 4.75 15.25 5 C 16 4.5 17 3.75 18.25 3.75 C 19.25 5 18.75 6.5 18.5 7 C 20 8 20.5 9 20.5 10.5 C 20.5 15 17.5 16.25 14.5 16.5 C 15 16.75 15.5 17.5 15.5 18.5 L 15.5 21.5 C 15.5 21.75 15.75 22 16.25 22 C 20.5 21.5 24 17.5 24 12 C 24 6.5 19.5 2 12 2 Z"/>
          </svg>
        </div>
        <h3 class="platform-card__name">GitHub</h3>
        <p class="platform-card__description">
          ソースコード & プロジェクト
        </p>
        <span class="platform-card__link">View →</span>
      </a>

      <!-- Scratch -->
      <a href="https://scratch.mit.edu/users/norinori1/" 
         class="platform-card" 
         target="_blank" 
         rel="noopener noreferrer">
        <div class="platform-card__icon">
          <svg viewBox="0 0 24 24">
            <!-- Scratch アイコン -->
            <circle cx="12" cy="12" r="8"/>
          </svg>
        </div>
        <h3 class="platform-card__name">Scratch</h3>
        <p class="platform-card__description">
          ビジュアルプログラミング
        </p>
        <span class="platform-card__link">View →</span>
      </a>

      <!-- Discord -->
      <a href="#" 
         class="platform-card" 
         title="Discord">
        <div class="platform-card__icon">
          <svg viewBox="0 0 24 24">
            <!-- Discord アイコン -->
            <path d="M 5 3 L 19 3 Q 21 3 21 5 L 21 19 Q 21 21 19 21 L 5 21 Q 3 21 3 19 L 3 5 Q 3 3 5 3 M 8 10 L 8 16 M 12 10 L 12 16 M 16 10 L 16 16"/>
          </svg>
        </div>
        <h3 class="platform-card__name">Discord</h3>
        <p class="platform-card__description">
          コミュニティ
        </p>
        <span class="platform-card__link">Join →</span>
      </a>

      <!-- unityroom -->
      <a href="https://unityroom.com" 
         class="platform-card" 
         target="_blank" 
         rel="noopener noreferrer">
        <div class="platform-card__icon">
          <svg viewBox="0 0 24 24">
            <!-- unityroom アイコン -->
            <path d="M 12 2 L 22 7 L 22 17 L 12 22 L 2 17 L 2 7 Z"/>
          </svg>
        </div>
        <h3 class="platform-card__name">unityroom</h3>
        <p class="platform-card__description">
          Unity ゲーム展示
        </p>
        <span class="platform-card__link">View →</span>
      </a>
    </div>
  </div>
</section>
```

### プラットフォームカードスタイル

```css
.platforms-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 2rem;
  margin: 3rem 0;
}

.platform-card {
  background: linear-gradient(135deg, #FFFFFF 0%, #F8FAFC 100%);
  border: 2px solid var(--color-neutral-200);
  border-radius: var(--border-radius-lg);
  padding: 2rem;
  text-decoration: none;
  transition: var(--transition);
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

/* グラデーション背景オーバーレイ */
.platform-card::before {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, rgba(59, 143, 217, 0) 0%, rgba(59, 143, 217, 0.1) 100%);
  opacity: 0;
  transition: var(--transition);
  z-index: 0;
}

.platform-card:hover::before {
  opacity: 1;
}

.platform-card:hover {
  border-color: #3B8FD9;
  transform: translateY(-8px);
  box-shadow: 0 12px 24px rgba(59, 143, 217, 0.15);
}

/* コンテンツはz-indexを上げて前面に */
.platform-card__icon,
.platform-card__name,
.platform-card__description,
.platform-card__link {
  position: relative;
  z-index: 1;
}

.platform-card__icon {
  width: 64px;
  height: 64px;
  margin-bottom: 1rem;
  color: #3B8FD9;
  display: flex;
  align-items: center;
  justify-content: center;
}

.platform-card__icon svg {
  width: 100%;
  height: 100%;
  stroke: currentColor;
  stroke-width: 1.5;
  fill: none;
}

.platform-card__name {
  font-size: 1.25rem;
  font-weight: 700;
  color: #0F172A;
  margin-bottom: 0.5rem;
}

.platform-card__description {
  font-size: 0.9rem;
  color: #64748B;
  margin-bottom: 1.5rem;
  flex-grow: 1;
}

.platform-card__link {
  color: #3B8FD9;
  font-weight: 600;
  transition: var(--transition);
}

.platform-card:hover .platform-card__link {
  color: #1F5BA6;
}

/* レスポンシブ */
@media (max-width: 768px) {
  .platforms-grid {
    grid-template-columns: 1fr;
  }
}
```

---

## フッター

### ビジュアル構成

```
┌──────────────────────────────────────┐
│                                      │
│  norinori1  |  Links  |  Social      │
│  プロフィール   Resources  SNS      │
│                                      │
├──────────────────────────────────────┤
│                                      │
│  Copyright © 2025 norinori1         │
│  Built with ❤️ using HTML/CSS/JS   │
│                                      │
└──────────────────────────────────────┘
```

### HTML構造

```html
<footer class="footer">
  <div class="container">
    <!-- フッターコンテンツ -->
    <div class="footer__content">
      <!-- ブランド情報 -->
      <div class="footer__section">
        <div class="footer__logo">
          <svg class="logo-icon-small">...</svg>
          <span>norinori1</span>
        </div>
        <p class="footer__description">
          ゲーム開発者・クリエイター。
          複数プラットフォームでユニークなゲーム体験を創造。
        </p>
        <div class="footer__social">
          <a href="https://x.com/norinori1_" title="Twitter" class="social-link">
            <svg viewBox="0 0 24 24">...</svg>
          </a>
          <a href="https://github.com/norinori1" title="GitHub" class="social-link">
            <svg viewBox="0 0 24 24">...</svg>
          </a>
          <a href="https://norinori1.itch.io" title="itch.io" class="social-link">
            <svg viewBox="0 0 24 24">...</svg>
          </a>
        </div>
      </div>

      <!-- リンク -->
      <div class="footer__section">
        <h4 class="footer__section-title">Navigation</h4>
        <ul class="footer__links">
          <li><a href="/">Home</a></li>
          <li><a href="/about">About</a></li>
          <li><a href="/works">Works</a></li>
          <li><a href="/news">News</a></li>
        </ul>
      </div>

      <!-- リソース -->
      <div class="footer__section">
        <h4 class="footer__section-title">Resources</h4>
        <ul class="footer__links">
          <li><a href="/privacy">Privacy Policy</a></li>
          <li><a href="/terms">Terms of Use</a></li>
          <li><a href="mailto:contact@norinori1.dev">Contact</a></li>
        </ul>
      </div>

      <!-- SNS -->
      <div class="footer__section">
        <h4 class="footer__section-title">Follow</h4>
        <ul class="footer__links">
          <li><a href="https://x.com/norinori1_" target="_blank">Twitter/X</a></li>
          <li><a href="https://github.com/norinori1" target="_blank">GitHub</a></li>
          <li><a href="https://norinori1.itch.io" target="_blank">itch.io</a></li>
        </ul>
      </div>
    </div>

    <!-- フッター下部 -->
    <div class="footer__bottom">
      <p class="footer__copyright">
        &copy; 2025 norinori1. All rights reserved.
      </p>
      <p class="footer__credit">
        Built with <span class="heart">❤️</span> using HTML, CSS, JavaScript & GA4
      </p>
    </div>
  </div>
</footer>
```

### フッタースタイル

```css
.footer {
  background-color: #0F172A;
  color: #F1F5F9;
  padding: 4rem 0 2rem;
  margin-top: 4rem;
}

.footer__content {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 3rem;
  margin-bottom: 3rem;
  padding-bottom: 3rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.footer__section {
  display: flex;
  flex-direction: column;
}

.footer__logo {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 1.25rem;
  font-weight: 700;
  margin-bottom: 1rem;
}

.logo-icon-small {
  width: 28px;
  height: 28px;
}

.footer__description {
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.7);
  line-height: 1.6;
  margin-bottom: 1rem;
}

.footer__social {
  display: flex;
  gap: 1rem;
}

.social-link {
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.1);
  border-radius: var(--border-radius-full);
  color: currentColor;
  transition: var(--transition);
  text-decoration: none;
}

.social-link:hover {
  background: rgba(59, 143, 217, 0.3);
  color: #A7D8E8;
}

.social-link svg {
  width: 18px;
  height: 18px;
  stroke: currentColor;
  fill: none;
  stroke-width: 1.5;
}

.footer__section-title {
  font-size: 0.95rem;
  font-weight: 700;
  margin-bottom: 1rem;
  color: #FFFFFF;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.footer__links {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.footer__links a {
  color: rgba(255, 255, 255, 0.7);
  text-decoration: none;
  transition: var(--transition);
  font-size: 0.9rem;
}

.footer__links a:hover {
  color: #A7D8E8;
  margin-left: 4px;
}

/* フッター下部 */
.footer__bottom {
  text-align: center;
  padding-top: 2rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.footer__copyright {
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.6);
  margin-bottom: 0.5rem;
}

.footer__credit {
  font-size: 0.85rem;
  color: rgba(255, 255, 255, 0.5);
}

.heart {
  animation: pulse 1.5s infinite;
}

@keyframes pulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.2); }
}

/* レスポンシブ */
@media (max-width: 768px) {
  .footer {
    padding: 2rem 0 1rem;
  }

  .footer__content {
    grid-template-columns: 1fr;
    gap: 2rem;
    margin-bottom: 2rem;
    padding-bottom: 2rem;
  }

  .footer__section-title {
    font-size: 0.85rem;
  }

  .footer__links a {
    font-size: 0.85rem;
  }
}
```

---

## プラットフォームセクション GA4トラッキング

```javascript
// プラットフォームカードクリック追跡
document.querySelectorAll('.platform-card').forEach(card => {
  card.addEventListener('click', (e) => {
    const platformName = card.querySelector('.platform-card__name').textContent;
    const url = card.getAttribute('href');
    
    gtag('event', 'platform_link_click', {
      'platform_name': platformName,
      'destination_url': url,
      'event_category': 'outbound',
      'event_label': 'platform_card'
    });
  });
});

// フッターリンククリック追跡
document.querySelectorAll('.footer__links a').forEach(link => {
  link.addEventListener('click', () => {
    const linkText = link.textContent;
    const url = link.getAttribute('href');
    
    gtag('event', 'footer_link_click', {
      'link_text': linkText,
      'destination_url': url,
      'event_category': 'engagement'
    });
  });
});

// ソーシャルリンククリック追跡
document.querySelectorAll('.social-link').forEach(link => {
  link.addEventListener('click', () => {
    const platform = link.getAttribute('title');
    const url = link.getAttribute('href');
    
    gtag('event', 'social_link_click', {
      'platform': platform,
      'destination_url': url,
      'event_category': 'outbound'
    });
  });
});
```

---

**最終更新**: 2025年3月27日
