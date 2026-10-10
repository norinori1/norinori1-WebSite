# Works ギャラリーの検証記録

2026-10-10、Issue #135 の作業ツリーで検証。ソースと成果物の SHA-256 は `manifest.json` に記録します。
未コミットの実装に対する結果であり、ベースコミット単体の結果ではありません。

Human Review の「カテゴリごとに絵がほしい」に対応し、7分類＋Other の SVG イラストを追加しました。
各見出しとジャンプナビで同じ絵を使い、既存の青い Blueprint 表現と明暗テーマに合わせています。
Unity・Roblox・Scratch は既存ロゴ、VRChat Worlds はポータル、VRChat Gimmicks は動くキューブ、
Avatar Assets はキャラクター、Developer Tools はコードエディター、Other は重なる作品を表しています。
絵は装飾として読み上げ・フォーカス対象から除外し、カテゴリ名は従来どおりテキストで表示します。
4画面幅で見出しの絵の表示・サイズ、ジャンプナビの絵、カテゴリ名の読み上げ、既存操作を再確認しました。

| 検証 | 結果 |
|---|---|
| `npm ci` | 完了（依存・ロックファイルは変更せず） |
| `npm run lint` | PASS |
| `npx tsc --noEmit` | PASS |
| `npm run test:works` | PASS：データ処理、Notion の205件・3ページ取得、既存セキュリティテスト |
| `npm run build` | PASS：通常環境。Notion トークン未設定時のエラー表示を含むビルド |
| 検証データを使った本番ビルド | PASS：`/works` と21作品の詳細ルートを生成 |
| Chromium での画面・操作 | PASS：`browser-results.json` に詳細を記録 |

画面検証は320・390・768・1280pxの明暗8パターン。列数は順に2・2・3・4です。
全幅で検索・パネル開閉・プラットフォームOR・全解除・横幅の収まりを確認しました。
タグAND、タグとプラットフォームの組み合わせ、全4並び順、Featured の両条件、空カテゴリの消失、0件リセットも確認しています。
画像なし、長いタイトル、最大2タグ、16:9、見出し階層、キーボード順序、閉じたパネルの非フォーカス化、フォーカス表示、Escape、固定ヘッダーを避けたカテゴリジャンプ、カード全体の詳細遷移を確認しました。
390pxではタッチ操作も確認しています。

保存済みテーマでの再読み込みに既存 `SiteHeader` の hydration 不一致を確認したため、
`useSyncExternalStore` でサーバーと初期描画のマウント判定を合わせました。
最終検証でページ実行エラーは0件。明暗切替と保存済みテーマの再読み込みを確認しました。

## スクリーンショット

各 `works-{幅}-{light|dark}.png` は本番モードの実画面です。
追加の4枚は `works-filters-320-dark.png`、`works-active-filters-light.png`、
`works-mobile-filters-light.png`、`works-empty-dark.png`。
全キャプチャでサムネイルの読み込み完了を確認し、文字・カード・操作の収まりを直接確認しました。

[カテゴリの SVG 一覧](category-artwork.svg) と [PNG プレビュー](category-artwork.png) は、
実画面の SVG から書き出した8カテゴリの絵です。画面キャプチャも SVG 追加後の最終版に更新しました。

## 検証データと実接続の区別

**ブラウザーの画面検証**は、Notion の15作品のスナップショットに6件の境界ケースを加えた検証データです。
未使用カテゴリ、チェックボックスだけの Featured、長い作品名・タグ、画像なしを含みます。
描画・ルーティング・画像プロキシは実装をそのまま動かし、Notion SDK が使う fetch の応答のみを置き換えています。
画像プロキシの307と遷移先を検証してから、検証用の図面サムネイルを供給しています。
スクリーンショットに写る図面サムネイル・Sample 作品は本番 CMS の登録内容ではありません。

**Notion の分類移行は実接続**で実行済みです。7分類を追加し、承認された13作品の Category だけを更新しました。
更新直前にスキーマ・全件・各作品を再取得して競合を確認し、更新後に15作品の保持を確認しています。
Category 以外の全プロパティ、本文、画像、cover、icon の比較結果は `notion-migration.json` に記録しています。
期限付き画像URLのクエリ署名を比較から除外し、画像本体のパスと順序を保持して比較しました。
Unity 4件、Scratch 6件、Developer Tools 3件、未設定2件。

ローカルに `.env.local` と Notion API トークンはありません。サイトからの実 Notion API 接続は未検証です。
連携ツールによる Notion の読み書き確認と、ローカル画面検証は別の証拠として扱っています。

## 再現手順

通常チェック：`npm ci`、`npm run lint`、`npx tsc --noEmit`、`npm run test:works`、`npm run build`。
追加のテストフレームワークは導入していません。

画面検証用ビルドとサーバー（本番環境へは公開しない）：

```powershell
node --require ./scripts/works-browser-fixture.cjs node_modules/next/dist/bin/next build
node --require ./scripts/works-browser-fixture.cjs node_modules/next/dist/bin/next start --port 3135
```

別のターミナルで、インストール済みの Playwright と Chromium を指定：

```powershell
node scripts/verify-works-browser.mjs <playwright/index.mjs の絶対パス> <chrome.exe の絶対パス>
```

通常の `npm run dev` / `npm run build` は検証用 fetch を読み込みません。
検証用サーバーを終了し、通常の `npm run build` を実行して検証データの生成物を置き換えてあります。
公開・マージは実施していません。作業開始時からあった無関係な `ltspice-mcp.toml` は保持しました。
