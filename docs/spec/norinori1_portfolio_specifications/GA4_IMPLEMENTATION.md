# GA4実装ガイド - HTMLコード例集

norinori1ポートフォリオサイトへのGoogle Analytics 4の実装例集です。

---

## 1. 基本実装（HTML）

```html
<!DOCTYPE html>
<html lang="ja">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>norinori1 - Game Developer Portfolio</title>
    
    <!-- Google Analytics 4 -->
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
    
    <style>
        /* スタイル */
    </style>
</head>
<body>
    <!-- コンテンツ -->
</body>
</html>
```

**重要**: `G-XXXXXXXXXX` を自分の GA4 測定ID に置き換えてください

---

## 2. カスタムイベント実装

### ゲームカードクリック追跡

```javascript
// game-tracking.js
const GameTracking = {
  trackGameClick(gameId, gameTitle, platform) {
    gtag('event', 'game_click', {
      'game_id': gameId,
      'game_title': gameTitle,
      'platform': platform,
      'event_category': 'engagement',
      'event_label': 'game_card_interaction',
      'timestamp': new Date().toISOString()
    });
  },

  trackGameExternalLink(gameId, gameTitle, url) {
    gtag('event', 'game_link_click', {
      'game_id': gameId,
      'game_title': gameTitle,
      'destination_url': url,
      'event_category': 'outbound',
      'event_label': 'external_game_link'
    });
  },

  init() {
    // ゲームカード要素にイベントリスナーを追加
    document.querySelectorAll('.game-card').forEach(card => {
      const gameId = card.dataset.gameId;
      const gameTitle = card.querySelector('h3').textContent;
      
      // カードそのものをクリック可能にする
      card.addEventListener('click', (e) => {
        // リンククリックの場合はスキップ（重複を防ぐ）
        if (e.target.tagName !== 'A') {
          this.trackGameClick(gameId, gameTitle, 'card');
        }
      });

      // CTA リンククリック追跡
      const ctaLink = card.querySelector('a[class*="cta"]');
      if (ctaLink) {
        ctaLink.addEventListener('click', (e) => {
          this.trackGameExternalLink(gameId, gameTitle, ctaLink.href);
        });
      }
    });
  }
};

// ページロード時に初期化
document.addEventListener('DOMContentLoaded', () => {
  GameTracking.init();
});
```

### プラットフォームリンククリック追跡

```javascript
// platform-tracking.js
const PlatformTracking = {
  trackPlatformClick(platformName, url) {
    gtag('event', 'platform_link_click', {
      'platform_name': platformName,
      'destination_url': url,
      'event_category': 'outbound',
      'event_label': 'social_platform'
    });
  },

  init() {
    document.querySelectorAll('.platform-card').forEach(card => {
      const link = card.querySelector('a');
      if (link) {
        const platformName = card.querySelector('h4').textContent;
        link.addEventListener('click', () => {
          this.trackPlatformClick(platformName, link.href);
        });
      }
    });
  }
};

document.addEventListener('DOMContentLoaded', () => {
  PlatformTracking.init();
});
```

### スクロール深度追跡

```javascript
// scroll-tracking.js
const ScrollTracking = {
  scrollPercentages: new Set(),

  init() {
    window.addEventListener('scroll', () => this.trackScroll());
  },

  trackScroll() {
    const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrolled = (window.scrollY / scrollHeight) * 100;
    const roundedScroll = Math.floor(scrolled / 10) * 10;

    if (!this.scrollPercentages.has(roundedScroll) && roundedScroll > 0 && roundedScroll <= 100) {
      this.scrollPercentages.add(roundedScroll);
      gtag('event', 'scroll_depth', {
        'event_category': 'engagement',
        'event_label': `${roundedScroll}% scrolled`,
        'value': roundedScroll
      });
    }
  }
};

document.addEventListener('DOMContentLoaded', () => {
  ScrollTracking.init();
});
```

### セクションビュー追跡

```javascript
// section-tracking.js
const SectionTracking = {
  observedSections: new Set(),

  init() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !this.observedSections.has(entry.target.id)) {
          this.observedSections.add(entry.target.id);
          
          gtag('event', 'section_view', {
            'section_id': entry.target.id,
            'section_name': entry.target.getAttribute('aria-label') || entry.target.id,
            'event_category': 'engagement',
            'event_label': 'section_view'
          });
        }
      });
    }, {
      threshold: 0.25
    });

    // すべてのセクションをオブザーブ
    document.querySelectorAll('section').forEach(section => {
      observer.observe(section);
    });
  }
};

document.addEventListener('DOMContentLoaded', () => {
  SectionTracking.init();
});
```

---

## 3. React 実装例

### GA4 プロバイダーコンポーネント

```jsx
// src/providers/GA4Provider.jsx
import { useEffect } from 'react';

export function GA4Provider({ children, measurementId }) {
  useEffect(() => {
    // GA4 スクリプトを動的に追加
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
    document.head.appendChild(script);

    // GA4 初期化
    window.dataLayer = window.dataLayer || [];
    function gtag(){window.dataLayer.push(arguments);}
    
    script.onload = () => {
      gtag('js', new Date());
      gtag('config', measurementId, {
        'page_path': window.location.pathname,
        'anonymize_ip': true
      });
    };
  }, [measurementId]);

  return <>{children}</>;
}
```

### ゲームカードコンポーネント

```jsx
// src/components/GameCard.jsx
import { useCallback } from 'react';

export function GameCard({ game }) {
  const handleCardClick = useCallback(() => {
    gtag('event', 'game_click', {
      'game_id': game.id,
      'game_title': game.title,
      'platform': 'card',
      'event_category': 'engagement'
    });
  }, [game.id, game.title]);

  const handleLinkClick = useCallback(() => {
    gtag('event', 'game_link_click', {
      'game_id': game.id,
      'game_title': game.title,
      'destination_url': game.link,
      'event_category': 'outbound'
    });
  }, [game.id, game.title, game.link]);

  return (
    <article className="game-card" onClick={handleCardClick}>
      <img src={game.thumbnail} alt={game.title} />
      <h3>{game.title}</h3>
      <p>{game.description}</p>
      <a href={game.link} onClick={handleLinkClick} target="_blank" rel="noopener noreferrer">
        Play Now →
      </a>
    </article>
  );
}
```

### ページトラッキングフック

```jsx
// src/hooks/usePageTracking.js
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom'; // React Router使用時

export function usePageTracking() {
  const location = useLocation();

  useEffect(() => {
    gtag('config', 'G-XXXXXXXXXX', {
      'page_path': location.pathname
    });
  }, [location.pathname]);
}
```

---

## 4. イベント一覧

### 自動追跡イベント

| イベント名 | 説明 | データ |
|-----------|------|--------|
| `page_view` | ページビュー | page_path, page_title |
| `scroll` | スクロール | scrolled_percentage |
| `click` | クリック | link_url, link_text |

### カスタムイベント

| イベント名 | トリガー | パラメータ |
|-----------|---------|----------|
| `game_click` | ゲームカードクリック | game_id, game_title, platform |
| `game_link_click` | ゲーム外部リンククリック | game_id, destination_url |
| `platform_link_click` | プラットフォームリンククリック | platform_name, destination_url |
| `scroll_depth` | スクロール深度到達 | scroll_percentage |
| `section_view` | セクション表示 | section_id, section_name |

---

## 5. ダッシュボード設定

### 推奨レポート

#### 1. ユーザーエンゲージメント

```
レポート内容:
- セッション数
- ユーザー数
- エンゲージメント率
- セッション時間

ディメンション:
- 日付
- デバイスカテゴリ
- 国
```

#### 2. ゲーム別パフォーマンス

```
レポート内容:
- game_click イベント数（ゲーム別）
- game_link_click イベント数
- クリック率

ディメンション:
- game_id
- game_title
```

#### 3. トラフィック獲得

```
レポート内容:
- 参照元別セッション数
- 参照元別ユーザー数

ディメンション:
- 参照元
- メディア
```

---

## 6. デバッグとトラブルシューティング

### GA4 デバッグモード

```javascript
// 開発環境でのみ有効化
if (process.env.NODE_ENV === 'development') {
  gtag('config', 'G-XXXXXXXXXX', {
    'debug_mode': true
  });
}
```

### コンソール確認

```javascript
// ブラウザのコンソールで実行
window.dataLayer

// GA4が初期化されているか確認
gtag('event', 'test_event', { 'test': true });

// Google Analytics リアルタイムで確認
// https://analytics.google.com -> リアルタイム
```

---

## 7. プライバシー & コンプライアンス

### クッキー同意バナー統合例

```javascript
// consent-banner.js
function initializeGA4AfterConsent() {
  const consentButton = document.getElementById('cookie-consent-accept');
  
  consentButton.addEventListener('click', () => {
    // ユーザーがクッキーに同意
    gtag('consent', 'update', {
      'analytics_storage': 'granted'
    });
    
    // GA4を初期化
    gtag('config', 'G-XXXXXXXXXX');
    
    // 同意を保存
    localStorage.setItem('ga-consent', 'granted');
  });
}

document.addEventListener('DOMContentLoaded', initializeGA4AfterConsent);
```

### GDPR コンプライアンス

```javascript
// GDPR対応GA4設定
gtag('config', 'G-XXXXXXXXXX', {
  'anonymize_ip': true,
  'allow_google_signals': false,
  'allow_ad_personalization_signals': false
});
```

---

**注意**: `G-XXXXXXXXXX` をあなたの実際の GA4 測定IDに置き換えてください

**測定IDの確認方法**:
1. [Google Analytics](https://analytics.google.com) にアクセス
2. 左側の「管理」をクリック
3. 「プロパティ」 → 「データストリーム」
4. ウェブサイトを選択
5. 測定ID（`G-` で始まる）をコピー
