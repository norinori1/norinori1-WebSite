# Works本文の移行記録

Issue #138。#137の実装・検証・Draft PR作成後に、Notion Games DBの公開作品15件を反映しました。
実装SHA: `406c61ae416f1a6d793521898b70638e93e0cf63`。
この記録と検証fixtureの追加で、アプリの実装は変更していません。

先行2作品（ZINTOROAD / Puzzle Ball 3!）の確認・承認後、残る13作品をユーザーの指示で反映しました。
対象一覧と全ページの原文を保存し、各更新の直前・直後に本文・プロパティ・編集日時を取得しています。
各ページは該当見出し・段落の更新とセクション追加のみを使い、ページ全置換はしていません。

## 結果

Games DBの最終再取得は16件、公開実作品15件。Slug / Status未設定のコピー用テンプレート1件は対象外です。
全行の原文・元URL・コード例を比較し、すべての意味のある本文を保持しました。
技術情報は既存のEngines / Repositoryだけを使用し、操作説明は作品紹介、受賞・掲載・制作の裏話はニュース・実績へ整理しました。
登録済みのTitle / Slug / Status / Featured / Category / Description / Link / Additional Links / Thumbnail等とcover / iconは保持しました。
移行前後のDB全16行のプロパティ比較も一致しています。本文画像は全作品0件で、画像や架空の実績は追加していません。

| Slug | 状態 | タブ数 | 原文・元リンク・プロパティ |
|---|---|---|---|
| `block-crush-scratch` | 反映済み | 2 | 保持 |
| `block-crushing-game` | 反映済み | 3 | 保持 |
| `block-miner` | 反映済み | 2 | 保持 |
| `challenge-from-5-peope` | 反映済み | 3 | 保持 |
| `github-railway-map` | 反映済み | 2 | 保持 |
| `polarity-under` | 反映済み | 3 | 保持 |
| `puzzle-ball` | 反映済み | 3 | 保持 |
| `puzzle-ball-2` | 反映済み | 3 | 保持 |
| `puzzle-ball-3` | 反映済み | 3 | 保持 |
| `puzzle-ball-stage-maker` | 反映済み | 2 | 保持 |
| `rogue-lycan` | 反映済み | 2 | 保持 |
| `scratch-data-structures-generator` | 反映済み | 2 | 保持 |
| `scratch-text-asset-creator` | 反映済み | 2 | 保持 |
| `super-easy-game-blood-cancer` | 反映済み | 3 | 保持 |
| `zintoroad` | 反映済み | 3 | 保持 |

詳細: [ネイティブ取得結果の照合記録](native-results.json)、[原文と実反映後の全文比較](content-diff.json)。

## 原文の扱い

- Puzzle Ball 2 / 3の「Scratch Coath」とROGUE LYCANの「異欲作」は、訂正を確定せず原文を保持しました。
- 育成ゲームのTitle末尾のbr表記はプロパティのため保持しました。
- Scratch Text Asset Creatorの1行にあった先頭のスペースは、Notionが子ブロックのインデントへ変換しました。
  その段階で照合を停止し、既存の段落をトップレベルへ戻してから続行しました。行頭の1スペースだけを除き、文言とコード例は保持しています。
- Notion拡張Markdownで自動除去される通常の空行を除いて照合しています。`<empty-block/>`は保持しました。

## 表示検証

実反映後の15作品を再取得した[snapshot.json](snapshot.json)を、#137のSDK fetch境界に渡して本番ビルド・描画しました。
Chromiumで15作品 × 1280 / 390pxの30ケース、全タブの操作・元文保持・横幅を確認しました。
ページ実行エラー0件、横方向のはみ出し0件。本文画像がないため空ギャラリーもありません。
[ブラウザー結果](browser-results.json)に全件の結果を保存しています。

[ZINTOROADの実績・PC](zintoroad-1280-news.png)、
[Puzzle Ball 3!の作品紹介・スマホ](puzzle-ball-3-390-intro.png)、
[長い操作説明・スマホ](puzzle-ball-2-390-intro.png)、
[文字とコード例・スマホ](scratch-text-asset-creator-390-intro.png)。

本文は実Notionの最終取得内容です。画像はVERIFICATION ARTWORKと明示した検証用画像で、実ゲーム画面ではありません。
関連作品には#137検証用の境界ケースも含まれます。ネイティブNotion更新の成功と、サイトから実Notion APIへの接続確認は区別しています。
サイトの実API接続はローカルトークンがなく未検証、VercelのプレビューはSSO保護のため公開サイトとしての表示確認は未実施です。

## 再現

リポジトリのルートから、稼働中のNextサーバーを停止し、生成された`.next/cache/fetch-cache`だけを削除してから実行します。
Nextのfetch-cacheが前回のfixture本文を再利用するため、内容を切り替える際はキャッシュを残さないでください。

```powershell
node --require ./docs/verification/works-content-migration/fixture.cjs node_modules/next/dist/bin/next build
node --require ./docs/verification/works-content-migration/fixture.cjs node_modules/next/dist/bin/next start --port 3138
node ./docs/verification/works-content-migration/verify.mjs <playwright/index.mjs の絶対パス> <chrome.exe の絶対パス>
```

検証fixtureは通常のdev / buildでは読み込まれません。検証後はサーバーを停止して通常ビルドへ戻します。
#137のlint・typecheck・unit tests・タブ／ギャラリー操作の結果は[詳細UIの検証記録](../work-detail/README.md)にあります。
移行記録を追加した状態でもlint（警告なし）と通常buildがPASSし、検証用サーバーは停止して通常の生成物へ戻しました。
アプリ・既存テストのソースは上記の実装SHAと一致しています。

## 復元

[rollback.json](rollback.json)は、実取得した反映後本文に対する最小限の逆差分です。
全15件で元の本文に戻ることを文字列レベルで検証済みです。Notionへの復元は実行していません。

1. 復元を依頼されたら対象ページを再取得し、編集日時と本文が保存済みの最終取得内容と一致することを確認します。
   他者編集があれば逆差分を適用せず、その編集を保持する復元案を作ります。
2. 1ページずつ`update_content`で逆差分を適用し、プロパティ・cover・iconは指定しません。
3. 実行結果が曖昧なら再取得／非同期タスクの照会で判断し、同じ変更を無条件に再送しません。
4. 反映後の本文・元URL・順序・プロパティを原文へ照合します。Scratch Text Asset Creatorは元の行頭スペースをNotionが再度インデントへ変換し得るため、段落の階層も確認します。

署名付き画像URL等を含む完全なbefore / after、ページごとの実行前intent・API応答・readbackは、
リポジトリ外の`C:/Users/Takumi/orca/artifacts/norinori1-WebSite/works-137-138`へ保存しています。
リポジトリ内の検証記録にはトークンや期限付きファイルURLを含めていません。
