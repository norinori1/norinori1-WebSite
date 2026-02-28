# norinori1-WebSite

norinori1 のポートフォリオWebサイト

## 技術スタック

- [Next.js](https://nextjs.org/) (App Router)
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/)

## 開発環境のセットアップ

### 前提条件

- Node.js 18.x 以上
- npm 9.x 以上

### インストール

```bash
npm install
```

### 開発サーバーの起動

```bash
npm run dev
```

ブラウザで [http://localhost:3000](http://localhost:3000) を開いてください。

### ビルド

```bash
npm run build
```

### リント

```bash
npm run lint
```

## ディレクトリ構成

```
.
├── app/
│   ├── layout.tsx   # レイアウト（メタデータ）
│   ├── page.tsx     # トップページ
│   ├── globals.css  # グローバルCSS
│   └── favicon.ico  # ファビコン
├── public/          # 静的ファイル
├── next.config.ts   # Next.js設定
├── tailwind.config  # Tailwind設定（postcss.config.mjs）
└── tsconfig.json    # TypeScript設定
```
