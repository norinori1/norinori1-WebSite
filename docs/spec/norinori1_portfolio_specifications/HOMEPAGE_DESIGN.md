# HOMEPAGE_DESIGN.md - ホームページ・ランディングセクション設計

norinori1ポートフォリオサイトのホームページ全体設計仕様。
白ベース + ロゴブルーのカラースキーム反映。

---

## ページ全体構造

```
┌─────────────────────────────────────┐
│       グローバルヘッダー（白）       │
├─────────────────────────────────────┤
│                                     │
│     1. ヒーロー/ランディング        │
│        (グラデーション背景)         │
│                                     │
├─────────────────────────────────────┤
│                                     │
│     2. フィーチャーゲーム           │
│        (カード型グリッド)           │
│                                     │
├─────────────────────────────────────┤
│                                     │
│     3. スキル/技術スタック          │
│        (並列カード)                 │
│                                     │
├─────────────────────────────────────┤
│                                     │
│     4. プラットフォーム/SNS         │
│        (リンク集)                   │
│                                     │
├─────────────────────────────────────┤
│     フッター                        │
└─────────────────────────────────────┘
```

---

## 1. ヒーロー/ランディングセクション

### ビジュアル構成

```
┌──────────────────────────────────────┐
│                                      │
│    [グラデーション背景]              │
│                                      │
│    norinori1                         │
│    Game Developer & Creator          │
│                                      │
│    Unity × TensorFlow 研究中         │
│    複数プラットフォーム展開          │
│                                      │
│    [CTA Button] [Secondary Button]   │
│                                      │
│  ───────────────────────────────     │
│                                      │
└──────────────────────────────────────┘
```

### 仕様詳細

#### 背景

**グラデーション**:
- 開始色: ロゴブルー濃 (#1F5BA6)
- 終了色: 薄いブルー (#A7D8E8)
- 方向: 135° (左上→右下)
- 不透明度: 10% 程度の暗さレイヤー

**SVGパターン**:
- ジオメトリック要素（立方体・ポリゴン）を背景に配置
- 低コントラスト（opacity: 0.1-0.2）
- アニメーション: 微妙な float/rotate

#### テキストレイアウト

```html
<section class="hero">
  <div class="hero__container">
    <div class="hero__content">
      <!-- ロゴアイコン（大きいサイズ） -->
      <svg class="hero__logo-large">...</svg>
      
      <!-- タイトル -->
      <h1 class="hero__title">norinori1</h1>
      
      <!-- サブタイトル -->
      <p class="hero__subtitle">Game Developer & Creator</p>
      
      <!-- 説明テキスト -->
      <p class="hero__description">
        複数のゲーム開発プラットフォーム（Unity、Roblox、Scratch）で
        ユニークなゲーム体験を創造しています。
        最新の技術（Unity × TensorFlow）にも取り組み中。
      </p>
      
      <!-- CTA ボタン -->
      <div class="hero__cta">
        <a href="/works" class="button button--primary">
          作品を見る
        </a>
        <a href="/about" class="button button--secondary">
          プロフィール
        </a>
      </div>
    </div>
    
    <!-- スクロール示唆 -->
    <div class="hero__scroll-indicator">
      <svg class="scroll-arrow">...</svg>
      <p>Scroll to explore</p>
    </div>
  </div>
</section>
```

#### CSSスタイル

```css
.hero {
  min-height: 100vh;
  padding-top: var(--header-height);
  background: linear-gradient(135deg, #1F5BA6 0%, #A7D8E8 100%);
  position: relative;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* グラデーション背景 */
.hero::before {
  content: '';
  position: absolute;
  inset: 0;
  background-image: 
    url('data:image/svg+xml...');
  opacity: 0.15;
  z-index: 0;
}

.hero__container {
  position: relative;
  z-index: 1;
  max-width: 800px;
  padding: 0 2rem;
  text-align: center;
}

.hero__content {
  animation: fadeInUp 1s ease-out;
}

.hero__logo-large {
  width: 120px;
  height: 120px;
  margin: 0 auto 2rem;
  filter: drop-shadow(0 4px 12px rgba(0,0,0,0.1));
}

.hero__title {
  font-size: 3.5rem;
  font-weight: 700;
  color: #FFFFFF;
  margin-bottom: 0.5rem;
  text-shadow: 0 2px 8px rgba(0,0,0,0.2);
}

.hero__subtitle {
  font-size: 1.5rem;
  font-weight: 400;
  color: rgba(255, 255, 255, 0.9);
  margin-bottom: 1.5rem;
}

.hero__description {
  font-size: 1rem;
  line-height: 1.8;
  color: rgba(255, 255, 255, 0.8);
  max-width: 600px;
  margin: 0 auto 2.5rem;
}

.hero__cta {
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
}

/* スクロール示唆 */
.hero__scroll-indicator {
  position: absolute;
  bottom: 2rem;
  left: 50%;
  transform: translateX(-50%);
  text-align: center;
  color: rgba(255, 255, 255, 0.7);
  animation: bounce 2s infinite;
}

.scroll-arrow {
  width: 24px;
  height: 24px;
  margin: 0 auto 0.5rem;
  stroke: currentColor;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes bounce {
  0%, 100% { transform: translateX(-50%) translateY(0); }
  50% { transform: translateX(-50%) translateY(-10px); }
}

/* レスポンシブ */
@media (max-width: 768px) {
  .hero {
    min-height: calc(100vh - var(--header-height));
  }

  .hero__title {
    font-size: 2.5rem;
  }

  .hero__subtitle {
    font-size: 1.25rem;
  }

  .hero__cta {
    flex-direction: column;
    gap: 1rem;
  }

  .button {
    width: 100%;
  }
}
```

### ボタンスタイル

```css
.button {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 2rem;
  border-radius: var(--border-radius-lg);
  border: 2px solid transparent;
  font-size: 1rem;
  font-weight: 600;
  text-decoration: none;
  cursor: pointer;
  transition: var(--transition);
  white-space: nowrap;
}

/* プライマリボタン */
.button--primary {
  background-color: #FFFFFF;
  color: #1F5BA6;
  border-color: #FFFFFF;
}

.button--primary:hover {
  background-color: rgba(255, 255, 255, 0.9);
  transform: translateY(-2px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
}

/* セカンダリボタン */
.button--secondary {
  background-color: transparent;
  color: #FFFFFF;
  border-color: #FFFFFF;
}

.button--secondary:hover {
  background-color: rgba(255, 255, 255, 0.1);
  border-color: rgba(255, 255, 255, 0.8);
  transform: translateY(-2px);
}

/* アウトラインボタン */
.button--outline {
  background-color: transparent;
  color: #3B8FD9;
  border-color: #3B8FD9;
}

.button--outline:hover {
  background-color: rgba(59, 143, 217, 0.1);
}
```

---

## 2. フィーチャーゲームセクション

### レイアウト

```
┌──────────────────────────────────────┐
│                                      │
│     Featured Games                   │
│     最新・注目ゲームを表示           │
│                                      │
│  ┌────────┬────────┬────────┐       │
│  │ Game 1 │ Game 2 │ Game 3 │       │
│  ├────────┼────────┼────────┤       │
│  │ Game 4 │ Game 5 │        │       │
│  └────────┴────────┴────────┘       │
│                                      │
│        [View All Games →]            │
│                                      │
└──────────────────────────────────────┘
```

### HTML構造

```html
<section class="featured-games" id="featured-games">
  <div class="container">
    <!-- セクションヘッダー -->
    <div class="section-header">
      <h2>Featured Games</h2>
      <p>最新作や注目ゲームをピックアップ</p>
    </div>

    <!-- ゲームグリッド -->
    <div class="games-grid">
      <!-- ゲームカード（複数） -->
      <article class="game-card" data-game-id="zintoroad">
        <div class="game-card__image-wrapper">
          <img 
            src="assets/images/games/zintoroad-thumbnail.png"
            alt="ZINTOROAD"
            class="game-card__image"
            loading="lazy"
          />
          <div class="game-card__overlay">
            <span class="badge badge--latest">Latest</span>
          </div>
        </div>

        <div class="game-card__content">
          <h3 class="game-card__title">ZINTOROAD</h3>
          <p class="game-card__description">
            Survivor-like Rogue-lite × Resource Management
          </p>

          <div class="game-card__meta">
            <div class="game-card__tags">
              <span class="tag">Unity</span>
              <span class="tag">Strategic</span>
            </div>
            <div class="game-card__platforms">
              <span class="platform-badge">PC</span>
              <span class="platform-badge">Web</span>
            </div>
          </div>

          <a href="https://norinori1.itch.io/zintoroad-beta" 
             class="game-card__link"
             target="_blank"
             rel="noopener noreferrer">
            Play Now →
          </a>
        </div>
      </article>

      <!-- その他のゲームカード... -->
    </div>

    <!-- 全て見るリンク -->
    <div class="section-footer">
      <a href="/works" class="link-more">
        View all games →
      </a>
    </div>
  </div>
</section>
```

### ゲームカードスタイル

```css
.games-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 2rem;
  margin: 3rem 0;
}

.game-card {
  background: #FFFFFF;
  border-radius: var(--border-radius-lg);
  overflow: hidden;
  transition: var(--transition);
  cursor: pointer;
  border: 1px solid var(--color-neutral-200);
}

.game-card:hover {
  transform: translateY(-8px);
  border-color: #3B8FD9;
  box-shadow: 0 12px 24px rgba(59, 143, 217, 0.15);
}

.game-card__image-wrapper {
  position: relative;
  width: 100%;
  padding-bottom: 66.67%; /* 3:2 aspect ratio */
  overflow: hidden;
  background: #E2E8F0;
}

.game-card__image {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: var(--transition);
}

.game-card:hover .game-card__image {
  transform: scale(1.05);
}

.game-card__overlay {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0);
  display: flex;
  align-items: flex-start;
  padding: 1rem;
  transition: var(--transition);
  z-index: 10;
}

.game-card:hover .game-card__overlay {
  background: rgba(0, 0, 0, 0.15);
}

.game-card__content {
  padding: 1.5rem;
}

.game-card__title {
  font-size: 1.25rem;
  font-weight: 700;
  color: #0F172A;
  margin-bottom: 0.5rem;
}

.game-card__description {
  font-size: 0.9rem;
  color: #64748B;
  margin-bottom: 1rem;
  line-height: 1.5;
}

.game-card__meta {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-bottom: 1rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid var(--color-neutral-200);
}

.game-card__tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.tag {
  display: inline-block;
  padding: 0.25rem 0.75rem;
  background: #E2E8F0;
  color: #1F5BA6;
  border-radius: var(--border-radius-full);
  font-size: 0.75rem;
  font-weight: 600;
}

.platform-badge {
  display: inline-block;
  padding: 0.25rem 0.5rem;
  background: #A7D8E8;
  color: #0F172A;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 600;
}

.game-card__link {
  display: block;
  color: #3B8FD9;
  text-decoration: none;
  font-weight: 600;
  transition: var(--transition);
}

.game-card__link:hover {
  color: #1F5BA6;
}

/* Badge */
.badge {
  display: inline-block;
  padding: 0.5rem 1rem;
  background: #3B8FD9;
  color: #FFFFFF;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.05em;
}

.badge--latest {
  background: linear-gradient(135deg, #3B8FD9 0%, #1F5BA6 100%);
}

/* レスポンシブ */
@media (max-width: 768px) {
  .games-grid {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
}
```

---

## 3. スキル/技術スタックセクション

### レイアウト

```
┌──────────────────────────────────────┐
│                                      │
│     Skills & Technologies            │
│                                      │
│  ┌────────────┐  ┌────────────┐     │
│  │ Engines    │  │ Platforms  │     │
│  │ • Unity    │  │ • Web      │     │
│  │ • C#       │  │ • Discord  │     │
│  └────────────┘  └────────────┘     │
│                                      │
│  ┌────────────┐  ┌────────────┐     │
│  │ Learning   │  │ Tools      │     │
│  │ • TensorFlow│ │ • Git      │     │
│  │ • ML       │  │ • Node.js  │     │
│  └────────────┘  └────────────┘     │
│                                      │
└──────────────────────────────────────┘
```

### HTML構造

```html
<section class="skills" id="skills">
  <div class="container">
    <div class="section-header">
      <h2>Skills & Technologies</h2>
      <p>ゲーム開発の技術スタック</p>
    </div>

    <div class="skills-grid">
      <!-- スキルカード1: エンジン -->
      <div class="skill-card">
        <div class="skill-card__icon">
          <svg viewBox="0 0 24 24">
            <!-- Unity/Engine アイコン -->
          </svg>
        </div>
        <h3 class="skill-card__title">Game Engines</h3>
        <ul class="skill-list">
          <li>
            <span class="skill-name">Unity</span>
            <span class="skill-level">Expert</span>
          </li>
          <li>
            <span class="skill-name">Roblox Studio</span>
            <span class="skill-level">Advanced</span>
          </li>
          <li>
            <span class="skill-name">Scratch</span>
            <span class="skill-level">Advanced</span>
          </li>
        </ul>
      </div>

      <!-- スキルカード2: 言語 -->
      <div class="skill-card">
        <div class="skill-card__icon">
          <svg viewBox="0 0 24 24">
            <!-- Code アイコン -->
          </svg>
        </div>
        <h3 class="skill-card__title">Languages</h3>
        <ul class="skill-list">
          <li>
            <span class="skill-name">C#</span>
            <span class="skill-level">Expert</span>
          </li>
          <li>
            <span class="skill-name">Luau (Roblox)</span>
            <span class="skill-level">Advanced</span>
          </li>
          <li>
            <span class="skill-name">JavaScript</span>
            <span class="skill-level">Intermediate</span>
          </li>
        </ul>
      </div>

      <!-- スキルカード3: 研究領域 -->
      <div class="skill-card">
        <div class="skill-card__icon">
          <svg viewBox="0 0 24 24">
            <!-- Research アイコン -->
          </svg>
        </div>
        <h3 class="skill-card__title">Research</h3>
        <ul class="skill-list">
          <li>
            <span class="skill-name">Unity × TensorFlow</span>
            <span class="skill-level">Learning</span>
          </li>
          <li>
            <span class="skill-name">ML/AI in Games</span>
            <span class="skill-level">Learning</span>
          </li>
        </ul>
      </div>

      <!-- スキルカード4: ツール -->
      <div class="skill-card">
        <div class="skill-card__icon">
          <svg viewBox="0 0 24 24">
            <!-- Tools アイコン -->
          </svg>
        </div>
        <h3 class="skill-card__title">Tools & Workflow</h3>
        <ul class="skill-list">
          <li>
            <span class="skill-name">Git / GitHub</span>
            <span class="skill-level">Advanced</span>
          </li>
          <li>
            <span class="skill-name">VS Code</span>
            <span class="skill-level">Expert</span>
          </li>
        </ul>
      </div>
    </div>
  </div>
</section>
```

### スキルカードスタイル

```css
.skills-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 2rem;
  margin: 3rem 0;
}

.skill-card {
  background: #FFFFFF;
  border: 1px solid var(--color-neutral-200);
  border-radius: var(--border-radius-lg);
  padding: 2rem;
  transition: var(--transition);
}

.skill-card:hover {
  border-color: #3B8FD9;
  box-shadow: 0 8px 16px rgba(59, 143, 217, 0.1);
  transform: translateY(-4px);
}

.skill-card__icon {
  width: 48px;
  height: 48px;
  margin-bottom: 1rem;
  color: #3B8FD9;
}

.skill-card__icon svg {
  width: 100%;
  height: 100%;
  stroke: currentColor;
  fill: none;
  stroke-width: 1.5;
}

.skill-card__title {
  font-size: 1.25rem;
  font-weight: 700;
  color: #0F172A;
  margin-bottom: 1rem;
}

.skill-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.skill-list li {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 0;
  border-bottom: 1px solid var(--color-neutral-200);
  font-size: 0.9rem;
}

.skill-list li:last-child {
  border-bottom: none;
}

.skill-name {
  font-weight: 600;
  color: #0F172A;
}

.skill-level {
  display: inline-block;
  padding: 0.25rem 0.5rem;
  background: #A7D8E8;
  color: #0F172A;
  border-radius: 3px;
  font-size: 0.75rem;
  font-weight: 600;
}

/* レスポンシブ */
@media (max-width: 768px) {
  .skills-grid {
    grid-template-columns: 1fr;
  }
}
```

---

## 4. セクション共通スタイル

```css
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
}

section {
  padding: 4rem 0;
  background: #FFFFFF;
}

section:nth-child(even) {
  background: #F8FAFC;
}

.section-header {
  text-align: center;
  margin-bottom: 3rem;
}

.section-header h2 {
  font-size: 2.5rem;
  font-weight: 700;
  color: #0F172A;
  margin-bottom: 0.5rem;
}

.section-header p {
  font-size: 1.1rem;
  color: #64748B;
}

.section-footer {
  text-align: center;
  margin-top: 2rem;
}

.link-more {
  display: inline-block;
  color: #3B8FD9;
  text-decoration: none;
  font-weight: 600;
  transition: var(--transition);
}

.link-more:hover {
  color: #1F5BA6;
  margin-right: -5px;
}

/* レスポンシブ */
@media (max-width: 768px) {
  section {
    padding: 2rem 0;
  }

  .section-header h2 {
    font-size: 1.75rem;
  }

  .section-header p {
    font-size: 1rem;
  }
}
```

---

## GA4トラッキング

```javascript
// セクション表示トラッキング
const sectionObserver = new IntersectionObserver((entries) => {
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
  sectionObserver.observe(section);
});

// ゲームカードクリック
document.querySelectorAll('.game-card').forEach(card => {
  card.addEventListener('click', () => {
    const gameId = card.dataset.gameId;
    gtag('event', 'game_card_click', {
      'game_id': gameId,
      'event_category': 'engagement'
    });
  });
});
```

---

**次のファイル**: FOOTER_DESIGN.md, PLATFORMS_SECTION.md

**最終更新**: 2025年3月27日
