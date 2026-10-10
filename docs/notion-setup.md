# Notion CMS セットアップガイド

このガイドでは、Notion を CMS として使用して Works（ゲーム作品）と News（お知らせ）を管理する手順を説明します。

---

## 目次

1. [Notion Integration の作成](#1-notion-integration-の作成)
2. [Works（Games）データベースの作成](#2-worksgames-データベースの作成)
3. [News データベースの作成](#3-news-データベースの作成)
4. [データベースを Integration に共有する](#4-データベースを-integration-に共有する)
5. [データベース ID の確認方法](#5-データベース-id-の確認方法)
6. [Vercel 環境変数の設定](#6-vercel-環境変数の設定)
7. [Vercel へのデプロイと動作確認](#7-vercel-へのデプロイと動作確認)
8. [コンテンツの更新について](#8-コンテンツの更新について)
9. [よくあるエラーとトラブルシューティング](#9-よくあるエラーとトラブルシューティング)

---

## 1. Notion Integration の作成

1. [https://www.notion.so/my-integrations](https://www.notion.so/my-integrations) にアクセスします。
2. **「+ New integration」** をクリックします。
3. 以下を設定します：
   - **Name**：任意（例：`norinori1 Website`）
   - **Associated workspace**：使用するワークスペースを選択
   - **Type**：`Internal integration`
4. **「Submit」** をクリックします。
5. 作成後に表示される **Internal Integration Token**（`secret_...` で始まる文字列）をコピーして安全な場所に保管します。

> ⚠️ トークンは絶対に Git にコミットしないでください。

---

## 2. Works（Games）データベースの作成

Notion でゲーム作品を管理するデータベースを作成します。

### 作成手順

1. Notion で新しいページを作成し、`/database` と入力して「Table – Full page」を選択します。
2. データベース名を **「Games」** または **「Works」** などわかりやすい名前にします。

### 必須プロパティ一覧

| プロパティ名 | 型 | 説明 |
|---|---|---|
| `Title` | Title（タイトル） | 作品名（デフォルトで存在する） |
| `Slug` | Text（テキスト） | URLスラグ（例：`zintoroad`）。**ユニークであること** |
| `Description` | Text（テキスト） | 作品の短い説明文 |
| `Link` | URL | 作品へのリンク（itch.io等） |
| `Additional Links` | Text（テキスト、任意） | 追加のプレイ先・配布先。1行に1つのHTTP／HTTPS URL |
| `Status` | Select（セレクト） | 公開状態。選択肢：`Latest`、`Featured`、`Released` |
| `Category` | Select（セレクト） | 作品の種類。下記の7分類。未設定でも作品は表示される |
| `Tags` | Multi-select（マルチセレクト） | タグ（例：`Unity`、`Puzzle`、`Action`） |
| `Platforms` | Multi-select（マルチセレクト） | 対応プラットフォーム（例：`PC`、`Web`、`Discord`） |
| `Thumbnail` | Files & media（ファイル） | サムネイル画像 |
| `Featured` | Checkbox（チェックボックス） | 注目作品フラグ（一覧でソートに使用） |

### 詳細ページのリンクと本文

`Link` がメインCTA、`Additional Links` が記載順の補助CTAです。Linkが空／無効なら最初の有効な追加URLをメインにします。
空行・不正URL・重複URLは表示しません。追加欄自体がなくても従来のLinkで動作します。
ボタンのアイコンはリンク先に合わせて切り替わります。`Repository` は技術タブ用で、プレイ先として自動追加しません。

本文はNotionネイティブのH1を正確に「作品紹介」「技術・開発」「ニュース・実績」にします。
作品紹介以外は任意です。H2以下はタブ内の小見出しで、トップレベルH1だけが境界です。
境界がない旧本文と境界前の本文は作品紹介へ残します。表記揺れは本文として残し、重複セクションは出現順に連結します。
見出し・空段落・区切りだけの任意タブは非表示です。Engines／安全なRepositoryがあれば技術タブに表示します。
`?tab=intro`、`?tab=tech`、`?tab=news` で直接共有できます。

作品紹介のH2「スクリーンショット」から次のH1／H2までの直下画像は拡大できるギャラリーになります。
入れ子や技術図解など、それ以外の画像は通常の本文表示です。画像なしの節を作る必要はありません。

### Category とギャラリーの分類

`Category` は作品の種類、`Tags` はジャンル・特徴、`Platforms` は対応環境を表します。
Unity / Roblox / Scratch の分類を Platforms から推測しません。
Category の選択肢は次の順で設定してください。

1. `Unity Games`
2. `Roblox Games`
3. `Scratch Games`
4. `VRChat Worlds`
5. `VRChat Gimmicks`
6. `Avatar Assets`
7. `Developer Tools`

Category が未設定、または上記以外の値でも、作品は末尾の `Other / 未分類` に表示されます。
`Other` を Notion の選択肢として追加する必要はありません。
絞り込み後に作品がないカテゴリは、見出しとジャンプナビの両方を非表示にします。
一覧は複数ページを取得するため、100件を超えた作品も表示対象になります。

### 既存作品の移行

更新直前にスキーマと全作品を再取得し、Category の新しい選択肢や分類済みの値があれば、
既存の判断を上書きせず確認してください。変更は Category の追加と次の13作品への設定に限定します。

| Category | 作品 |
|---|---|
| Unity Games | ZINTOROAD、POLARITY UNDER、Block Crushing Game、Puzzle Ball Stage Maker |
| Scratch Games | 5人からの挑戦状、Block Crush Game [Scratch Edition]、Block Miner、Puzzle Ball、Puzzle ball 2、Puzzle Ball 3! |
| Developer Tools | Github-Railway-Map、Scratch Data Structures Generator、Scratch Text Asset Creator |
| 未設定（Other に表示） | ROGUE LYCAN、血液がんの治療に伴走する超簡単！育成ゲーム |

本文、画像、Title、Slug、Status、Featured、Tags、Platforms、リンクなど、Category 以外は保持します。
更新後に再取得し、15作品が残っていること、分類が一致すること、ほかのプロパティ・本文が変わっていないことを確認してください。
未分類の2作品は、種類の判断が決まってから Category だけを設定します。

一覧はチェックボックス `Featured` または `Status = Featured` を注目作品として強調します。
デフォルトはカテゴリ内で注目作品優先・タイトル昇順です。タイトル順・ステータス順を選ぶとその順序を優先します。
トップページの注目作品取得条件（`Status = Featured`）は従来どおりです。
タグはすべてに一致（AND）、プラットフォームはいずれかに一致（OR）、両者は AND で組み合わせます。

### ローカル検証

`npm run test:works` は追加フレームワークを使わず、TypeScript で簡易テストをコンパイルして実行します。
カテゴリ・検索・ソート・フィルターの組み合わせと、Notion SDK を模擬した205レコードの複数ページ取得を確認します。
画面用の検証データと Notion 実接続の結果は区別してください。

### ページ本文について

各ゲーム作品のレコードをクリックしてページを開くと、プロパティの下に「本文」エリアがあります。  
ここに見出し・段落・画像・コード・リスト等を使って作品の詳細説明を書くと、サイトの `/works/[slug]` ページに表示されます。

---

## 3. News データベースの作成

お知らせや更新情報を管理するデータベースを作成します。

### 作成手順

Games DB と同様に、新しいページで Table データベースを作成し、名前を **「News」** にします。

### 必須プロパティ一覧

| プロパティ名 | 型 | 説明 |
|---|---|---|
| `Title` | Title（タイトル） | 記事タイトル（デフォルトで存在する） |
| `Slug` | Text（テキスト） | URLスラグ（例：`zintoroad-release`）。**ユニークであること** |
| `Excerpt` | Text（テキスト） | 記事の抜粋（一覧ページに表示） |
| `Date` | Date（日付） | 公開日 |
| `Status` | Select（セレクト） | 公開状態。選択肢：`Published`、`Draft` |
| `Tags` | Multi-select（マルチセレクト） | タグ（例：`Release`、`Update`、`Event`） |
| `CoverImage` | Files & media（ファイル） | カバー画像 |
| `Featured` | Checkbox（チェックボックス） | 注目記事フラグ |

### 公開設定について

**`Status` が `Published` のレコードのみ**サイトに表示されます。  
下書き中は `Draft` のままにしておけばサイトに表示されません。

### ページ本文について

Works と同様に、各記事のページ本文がそのまま `/news/[slug]` ページの記事本文になります。

---

## 4. データベースを Integration に共有する

Integration がデータベースにアクセスするには、明示的に共有する必要があります。

### 手順

1. Games データベースのページを開きます。
2. 右上の **「...」（その他）** メニューをクリックします。
3. **「Connections」** または **「Connect to」** を選択します。
4. 作成した Integration（例：`norinori1 Website`）を検索して選択します。
5. **「Confirm」** をクリックします。
6. **News データベースでも同じ手順**を繰り返します。

---

## 5. データベース ID の確認方法

### ブラウザの URL から確認する方法

データベースページをブラウザで開くと、URL が以下のような形になります：

```
https://www.notion.so/yourworkspace/xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx?v=...
```

`/yourworkspace/` の後ろにある **32文字の英数字** がデータベース ID です。

例：
```
https://www.notion.so/myspace/abc123def456...789xyz?v=111...
                               ^^^^^^^^^^^^^^^^^^^^^^^^^^^^
                               これがデータベース ID（32文字）
```

> ハイフンなしで32文字の場合、Notion API には次のようにハイフン区切りで渡されることもあります：  
> `xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx`  
> どちらの形式でも Vercel の環境変数に設定できます。

---

## 6. Vercel 環境変数の設定

### 設定する環境変数

| 変数名 | 値 | 説明 |
|---|---|---|
| `NOTION_TOKEN` | `secret_...` | Step 1 で取得した Integration Token |
| `NOTION_GAMES_DB` | データベース ID | Games/Works データベースの ID |
| `NOTION_NEWS_DB` | データベース ID | News データベースの ID |
| `NEXT_PUBLIC_SITE_URL` | `https://your-project.vercel.app` | サイトの本番 URL（OGPメタデータ用）|

### Vercel での設定手順

1. [https://vercel.com/dashboard](https://vercel.com/dashboard) にアクセスします。
2. 対象プロジェクトをクリックします。
3. **「Settings」** タブを開きます。
4. 左メニューの **「Environment Variables」** をクリックします。
5. 各変数を **「Production」**（必要に応じて Preview/Development にも）追加します。
6. **「Save」** をクリックします。

> ⚠️ `NOTION_TOKEN` は `NEXT_PUBLIC_` プレフィックスを付けないでください。  
> クライアントサイドに公開されると、誰でもあなたの Notion ワークスペースにアクセスできてしまいます。

---

## 7. Vercel へのデプロイと動作確認

### 初回デプロイ

1. GitHub リポジトリ（`norinori1/norinori1-WebSite`）を [Vercel にインポート](https://vercel.com/new) します。
2. Framework Preset が **「Next.js」** に自動設定されることを確認します。
3. Build Command はデフォルトの `next build` のままで OK です。
4. 環境変数を設定した後、**「Deploy」** をクリックします。

### 動作確認チェックリスト

- [ ] `/` トップページが表示される
- [ ] ヘッダーの **Works** リンクが `/works` に移動する
- [ ] ヘッダーの **News** リンクが `/news` に移動する
- [ ] ヘッダーの **About** リンクが `/about` に移動する
- [ ] `/works` に Notion の Works データが表示される
- [ ] `/works/[slug]` で作品詳細と Notion ページ本文が表示される
- [ ] `/news` に Notion の News データが表示される（Status = Published のみ）
- [ ] `/news/[slug]` で記事詳細と Notion ページ本文が表示される
- [ ] サムネイル・カバー画像が正常に表示される

---

## 8. コンテンツの更新について

### 自動更新（`revalidate`）

このサイトは **最大 1 時間（3600 秒）** のキャッシュで動作しています。  
Notion でコンテンツを更新すると、最大 1 時間以内に自動的にサイトに反映されます。

- すぐに反映させたい場合は、Vercel ダッシュボードの **「Redeploy」** または **「Invalidate Cache」** を使ってください。

### 新しいコンテンツを追加する手順

1. Notion の Games または News データベースに新しいページ（レコード）を追加します。
2. **`Slug`** プロパティに URL スラグを設定します（例：`my-new-game`）。Slug は重複しないようにしてください。
3. News の場合は **`Status`** を `Published`、**`Date`** を設定します。
4. ページ本文に詳細情報を記述します。
5. 最大 1 時間後に `https://yoursite.vercel.app/works/my-new-game` または `/news/my-new-game` でアクセスできるようになります。

---

## 9. よくあるエラーとトラブルシューティング

### `NOTION_TOKEN environment variable is not set`

**原因**：Vercel に `NOTION_TOKEN` 環境変数が設定されていません。  
**対処**：[Step 6](#6-vercel-環境変数の設定) の手順で環境変数を設定し、再デプロイしてください。

---

### `NOTION_GAMES_DB environment variable is not set`

**原因**：`NOTION_GAMES_DB` 環境変数が未設定です。  
**対処**：データベース ID を確認して環境変数を設定してください。

---

### `Could not find database with ID: ...`

**原因**：データベース ID が間違っているか、Integration がデータベースに共有されていません。  
**対処**：
- データベース ID を再確認してください。
- Notion のデータベースページで Integration が正しく接続されているか確認してください（[Step 4](#4-データベースを-integration-に共有する)）。

---

### `object_not_found` エラー

**原因**：Integration がデータベースへのアクセス権を持っていません。  
**対処**：データベースページの「Connections」から Integration を追加してください。

---

### サムネイル・カバー画像が表示されない

**原因**：Notion の画像 URL は一時的な署名付き URL（有効期限あり）です。また、ドメインが `next.config.ts` の `remotePatterns` に含まれていない可能性があります。  
**対処**：
- 画像 URL のドメインを確認し、必要なら `next.config.ts` の `remotePatterns` に追加してください。
- Notion にアップロードした画像は S3 の署名付き URL が使われるため、時間が経つと URL が変わることがあります。

---

### Works が一覧に表示されない

**原因**：`Status` プロパティが空か、正しく設定されていない可能性があります。  
**対処**：各レコードの `Status` に `Latest`、`Featured`、`Released` のいずれかを設定してください。

---

### News が一覧に表示されない

**原因**：`Status` が `Published` になっていないか、`Slug` が空の可能性があります。  
**対処**：
- `Status` を `Published` に設定してください。
- `Slug` プロパティにユニークな値を入力してください。

---

## 補足：ローカル開発環境

ローカルで開発する場合は、プロジェクトルートに `.env.local` ファイルを作成してください：

```bash
# .env.local
NOTION_TOKEN=secret_xxxxxxxxxxxxxxxxxx
NOTION_GAMES_DB=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
NOTION_NEWS_DB=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

> `.env.local` は `.gitignore` に含まれているため、Git にコミットされません。
