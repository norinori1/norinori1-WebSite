# Works 詳細ページの検証記録

Issue #137。既存のBlueprintデザインに、3タブ・拡大ギャラリー・複数の作品リンクを実装しました。
関連作品と一覧のカードは同じ部品を使います。未追跡の `ltspice-mcp.toml` は保持しました。

## 検証結果

| 検証 | 結果 |
|---|---|
| `npm ci` | PASS。依存・ロックファイルの変更なし |
| `npm run lint` | PASS。警告なし |
| `npx tsc --noEmit` | PASS |
| `npm run test:works` | PASS。既存ギャラリー・Notionページ取得・安全なURL処理と詳細ページの追加テスト |
| `npm run build` | PASS。Notionトークンなしの通常環境 |
| 検証用本番ビルド | PASS。21作品の詳細ルートを生成 |
| Chromium画面・操作 | PASS。320／390／768／1280px × 明暗8パターン、ページ実行エラー0件 |

`browser-results.json` に最終結果を保存しています。画像が読み込まれた状態でキャプチャしました。
キャプチャの直接確認で見つけた固定ヘッダーとパンくずの重なりは修正し、全幅で再検証しました。

確認項目：初期タブ・直リンク・無効／空タブ・他クエリ保持・戻る／進む、矢印・Home／End・フォーカス、
390pxのタッチ操作、画像拡大・Enter／Space・Tab循環・Escape・フォーカス復帰、画像なし・CTAなし・追加URLのみ、
重複／不正URLの除外、長い作品名、関連作品の同カテゴリ優先と自身の除外、JS無効時の全本文表示。

15作品の旧本文を全行比較し、旧H1・掲載リンク・操作説明・コード例が作品紹介に残ることを確認しました。
トップレベルH1と入れ子、見出し揺れ・重複・空タブ、ギャラリー範囲・順序は分割関数のテストでも確認しました。

## データと実接続の区別

本文はNotion連携から取得した公開15作品のスナップショットです。
3タブ・ギャラリー・複数CTAの境界ケースは明示した検証fixtureで、本番CMSに作品や実績を追加していません。
キャプチャの図面画像は **VERIFICATION ARTWORK** と記した検証用画像で、実ゲーム画面ではありません。
描画・ルーティング・画像プロキシは実コードを動かし、SDKのfetch境界だけを置き換えています。
画像プロキシの307とリダイレクト先を確認してから、検証用画像を供給します。

Notionには実接続で `Additional Links` の任意リッチテキスト欄を追加しました。既存のプロパティ定義を保持し、
作品のLink・本文を更新していません。追加URLは1行1URLで登録できます。
サイトから実Notion APIへの接続は、ローカルにトークンがないため未検証です。
スキーマのbefore／afterはリポジトリ外の作業成果物に保存しています。

## 再現手順

通常チェック：`npm run lint`、`npx tsc --noEmit`、`npm run test:works`、`npm run build`。

画面検証用のビルド・サーバー（通常の実行経路からはfixtureを読み込みません）：

```powershell
node --require ./scripts/works-detail-fixture.cjs node_modules/next/dist/bin/next build
node --require ./scripts/works-detail-fixture.cjs node_modules/next/dist/bin/next start --port 3137
node scripts/verify-work-detail.mjs <playwright/index.mjs の絶対パス> <chrome.exe の絶対パス>
```

終了後はサーバーを停止し、通常ビルドで検証データの生成物を置き換えます。
タブ実装は [WAI-ARIA Tabs Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/tabs/) を参照しました。
