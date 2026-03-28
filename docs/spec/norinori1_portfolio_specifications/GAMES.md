# GAMES.md - norinori1 ゲーム・ツール作品データ定義

このファイルではnorinori1が制作したゲーム作品とツールのすべての情報を定義します。

---

## データ形式

各プロジェクトは以下の構造で定義されます：

```yaml
- id: [unique-identifier]
  type: [game / tool]
  title: [Display Title]
  description: [Short description]
  link: [External link URL]
  tags: [Array of tags]
  platforms: [Array of platforms]
  status: [Latest / Featured / Released]
  engines: [Array of game engines / tech stack]
  genre: [Genre classification]
```

---

## ゲーム作品リスト

### 1. ZINTOROAD

```yaml
id: zintoroad
type: game
title: ZINTOROAD
description: "Survivor-like Rogue-lite × Real-Time Resource Management"
thumbnail: "assets/images/games/zintoroad-thumbnail.png"
link: "https://norinori1.itch.io/zintoroad-beta"
tags:
  - Unity
  - Strategic
  - Resource Management
  - Rogue-lite
platforms:
  - PC
  - Web
status: "Latest"
releaseDate: "2025-12-15"
engines:
  - Unity
  - C#
genre: "Tactical Strategy"
```

---

### 2. ROGUE LYCAN

```yaml
id: rogue-lycan
type: game
title: ROGUE LYCAN
description: "Discord Activity Rogue-like Game"
thumbnail: "assets/images/games/rogue-lycan-thumbnail.png"
link: "https://norinori1.github.io/Rogue-Lycan-Discord-Activity/"
tags:
  - Discord
  - Web
  - Rogue-like
  - Multiplayer
platforms:
  - Discord
  - Web
status: "Featured"
engines:
  - HTML5
  - JavaScript
  - Discord API
genre: "Rogue-like"
repository: "https://github.com/norinori1/Rogue-Lycan-Discord-Activity"
```

---

### 3. POLARITY UNDER

```yaml
id: polarity-under
type: game
title: POLARITY UNDER
description: "Puzzle-based Action Game"
thumbnail: "assets/images/games/polarity-under-thumbnail.png"
link: "https://unityroom.com/games/polarity-under"
tags:
  - Unity
  - Puzzle
  - Action
  - Indie
platforms:
  - Web
  - Windows
status: "Released"
engines:
  - Unity
  - C#
genre: "Puzzle Action"
```

---

### 4. Puzzle Ball Stage Maker

```yaml
id: puzzle-ball-stage-maker
type: game
title: "Puzzle Ball Stage Maker"
description: "Creative puzzle game stage editor"
thumbnail: "assets/images/games/puzzle-ball-stage-maker-thumbnail.png"
link: "https://norinori1.itch.io/puzzle-ball-stage-maker"
tags:
  - Puzzle
  - Creative
  - Level Editor
platforms:
  - Web
status: "Featured"
engines:
  - Unity
  - C#
genre: "Puzzle"
```

---

### 5. Block Crushing Game

```yaml
id: block-crushing-game
type: game
title: "Block Crushing Game"
description: "Classic block-crushing puzzle mechanics"
thumbnail: "assets/images/games/block-crushing-thumbnail.png"
link: "https://norinori1.itch.io/block-crushing-game"
tags:
  - Puzzle
  - Casual
  - Classic
platforms:
  - Web
  - Download
status: "Released"
engines:
  - Unity
  - C#
genre: "Puzzle"
```

---

### 6. Block Crush Game [Scratch Edition]

```yaml
id: block-crush-scratch
type: game
title: "Block Crush Game [Scratch Edition]"
description: "Scratch version of block-crushing gameplay"
thumbnail: "assets/images/games/block-crush-scratch-thumbnail.png"
link: "https://norinori1.itch.io/block-crush-game-scratch-edition"
tags:
  - Scratch
  - Puzzle
  - Educational
platforms:
  - Web
status: "Released"
engines:
  - Scratch
genre: "Puzzle"
```

---

### 7. Puzzle Ball 3!

```yaml
id: puzzle-ball-3
type: game
title: "Puzzle Ball 3!"
description: "Advanced puzzle ball mechanics"
thumbnail: "assets/images/games/puzzle-ball-3-thumbnail.png"
link: "https://norinori1.itch.io/puzzle-ball-3"
tags:
  - Puzzle
  - Physics
  - Challenging
platforms:
  - Web
status: "Released"
engines:
  - Unity
  - C#
genre: "Puzzle"
```

---

## ツール・ユーティリティ

### 1. Scratch Text Asset Creator

```yaml
id: scratch-text-asset-creator
type: tool
title: "Scratch Text Asset Creator"
description: "Create text-based assets for Scratch projects"
thumbnail: "assets/images/tools/scratch-text-asset-creator-thumbnail.png"
link: "https://norinori1.github.io/Scratch-Text-Asset-Creator/"
tags:
  - Scratch
  - Utility
  - Open Source
  - Web Tool
platforms:
  - Web
status: "Released"
engines:
  - HTML5
  - JavaScript
  - Canvas API
genre: "Developer Tool"
repository: "https://github.com/norinori1/Scratch-Text-Asset-Creator"
```

---

### 2. Scratch Data Structures Generator

```yaml
id: scratch-data-structures-generator
type: tool
title: "Scratch Data Structures Generator"
description: "Generate complex data structures for Scratch"
thumbnail: "assets/images/tools/scratch-data-structures-generator-thumbnail.png"
link: "https://norinori1.github.io/Scratch-Data-Stractures-Generator/"
tags:
  - Scratch
  - Developer Tool
  - Code Generation
  - Open Source
platforms:
  - Web
status: "Released"
engines:
  - HTML5
  - JavaScript
  - JSON
genre: "Developer Tool"
repository: "https://github.com/norinori1/Scratch-Data-Stractures-Generator"
```

---

## JSON形式への変換例

```json
{
  "projects": [
    {
      "id": "zintoroad",
      "type": "game",
      "title": "ZINTOROAD",
      "description": "Survivor-like Rogue-lite × Real-Time Resource Management",
      "thumbnail": "assets/images/games/zintoroad-thumbnail.png",
      "link": "https://norinori1.itch.io/zintoroad-beta",
      "tags": ["Unity", "Strategic", "Resource Management"],
      "platforms": ["PC", "Web"],
      "status": "Latest",
      "engines": ["Unity", "C#"]
    },
    {
      "id": "rogue-lycan",
      "type": "game",
      "title": "ROGUE LYCAN",
      "description": "Discord Activity Rogue-like Game",
      "thumbnail": "assets/images/games/rogue-lycan-thumbnail.png",
      "link": "https://norinori1.github.io/Rogue-Lycan-Discord-Activity/",
      "tags": ["Discord", "Web", "Rogue-like"],
      "platforms": ["Discord", "Web"],
      "status": "Featured",
      "engines": ["HTML5", "JavaScript", "Discord API"]
    },
    {
      "id": "scratch-text-asset-creator",
      "type": "tool",
      "title": "Scratch Text Asset Creator",
      "description": "Create text-based assets for Scratch projects",
      "link": "https://norinori1.github.io/Scratch-Text-Asset-Creator/",
      "tags": ["Scratch", "Utility", "Open Source"],
      "platforms": ["Web"],
      "status": "Released"
    },
    {
      "id": "scratch-data-structures-generator",
      "type": "tool",
      "title": "Scratch Data Structures Generator",
      "description": "Generate complex data structures for Scratch",
      "link": "https://norinori1.github.io/Scratch-Data-Stractures-Generator/",
      "tags": ["Scratch", "Developer Tool"],
      "platforms": ["Web"],
      "status": "Released"
    }
  ]
}
```

---

## 画像アセット要件

### サムネイル（必須）

| プロジェクトID | ファイル名 | 解像度 | コピペ防止 |
|---------|-----------|--------|----------|
| zintoroad | zintoroad-thumbnail.png | 360×240px | ✓ |
| rogue-lycan | rogue-lycan-thumbnail.png | 360×240px | ✓ |
| polarity-under | polarity-under-thumbnail.png | 360×240px | ✓ |
| puzzle-ball-stage-maker | puzzle-ball-stage-maker-thumbnail.png | 360×240px | ✓ |
| block-crushing-game | block-crushing-thumbnail.png | 360×240px | ✓ |
| block-crush-scratch | block-crush-scratch-thumbnail.png | 360×240px | ✓ |
| puzzle-ball-3 | puzzle-ball-3-thumbnail.png | 360×240px | ✓ |
| scratch-text-asset-creator | scratch-text-asset-creator-thumbnail.png | 360×240px | ✓ |
| scratch-data-structures-generator | scratch-data-structures-generator-thumbnail.png | 360×240px | ✓ |

**配置**: `assets/images/games/` / `assets/images/tools/`

---

**最終更新**: 2025年3月27日  
**データオーナー**: norinori1
