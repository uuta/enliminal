# Enliminal

**行ってみよう。飛んでみよう** — ランダムなキーワードと出会い、新しい視点を発見するアプリケーション

## 概要

Enliminalは、ユーザーが予期しない専門的なキーワードと出会い、その説明を通じて新しい知識と視点を得ることができるWebアプリケーションです。毎日の占いのように、思わぬキーワードとの出会いが行動変容を促すことを目的としています。

## アーキテクチャ

```
┌─────────────────────────────────────────────────────────────┐
│                         User Browser                         │
│                      (Astro + React islands)                 │
└───────────────────────┬─────────────────────────────────────┘
                        │
                        ↓
┌─────────────────────────────────────────────────────────────┐
│                        Vercel                                │
│  ┌───────────────────────────────────────────────────────┐  │
│  │  Static Pages (SSG)                                   │  │
│  │  - index.astro (ランディングページ)                   │  │
│  │  - discover.astro (キーワード発見UI)                  │  │
│  └───────────────────────────────────────────────────────┘  │
│  ┌───────────────────────────────────────────────────────┐  │
│  │  API Routes (Serverless Functions)                    │  │
│  │  - /api/gemini/generate (Gemini streaming proxy)      │  │
│  │  - /api/openai/generate (OpenAI streaming proxy)      │  │
│  │  - /api/keyword/random  (ランダムキーワード取得)      │  │
│  │  - /api/papers          (関連論文 Semantic Scholar)   │  │
│  │  - /api/videos          (関連動画 YouTube)            │  │
│  └───────────────────────────────────────────────────────┘  │
└──────────┬──────────────────────────────────────────────────┘
           │
           ↓
┌──────────────────────────────────────────────────────────────┐
│  External APIs                                               │
│  Wikipedia Random API  │  HackerNews API                    │
│  Semantic Scholar API  │  YouTube Data API v3               │
│  Google Gemini API     │  OpenAI API                        │
└──────────────────────────────────────────────────────────────┘
```

## 技術スタック

| 技術 | 選定理由 |
|------|---------|
| **Astro** | 静的コンテンツが多い本アプリに最適。Lighthouse 100点が現実的。必要な箇所のみReact islandsで動的UIを実装 |
| **Neon Postgres** | Supabaseより安定。PostgreSQL serverless。Vercel統合が簡単。従量課金で初期コストほぼゼロ |
| **Supabase Auth** | 認証機能のみ使用。実績あり、実装が簡単。OAuth連携もサポート |
| **Stripe** | 課金UIをすべてStripe側でホスト（Checkout + Billing Portal）。実装が最小限で済む |
| **Vercel** | Astroの完全サポート、エッジファンクション、自動デプロイ。無料枠が充実 |

## ディレクトリ構成

```
enliminal/
├── src/
│   ├── pages/
│   │   ├── index.astro              # ランディングページ
│   │   ├── discover.astro           # キーワード発見ページ
│   │   └── api/
│   │       ├── gemini/
│   │       │   └── generate.ts      # Gemini streaming proxy
│   │       ├── openai/
│   │       │   └── generate.ts      # OpenAI streaming proxy
│   │       ├── keyword/
│   │       │   └── random.ts        # ランダムキーワード取得 (Wikipedia / HackerNews)
│   │       ├── papers.ts            # 関連論文取得 (Semantic Scholar)
│   │       ├── videos.ts            # 関連動画取得 (YouTube)
│   │       └── __tests__/
│   │           └── generate.test.ts
│   ├── islands/
│   │   ├── DiscoverContent.tsx      # メインのキーワード発見UI (React island)
│   │   ├── DiscoverSkeleton.tsx     # スケルトンローディングUI (React island)
│   │   ├── StageButton.tsx          # ステージボタン (React island)
│   │   ├── MermaidDiagram.tsx       # Mermaidダイアグラム表示 (React island)
│   │   └── __tests__/
│   │       ├── DiscoverContent.test.tsx
│   │       └── StageButton.test.tsx
│   ├── layouts/
│   │   └── Layout.astro             # 共通レイアウト
│   ├── lib/
│   │   ├── wikipedia.ts             # Wikipedia Random API クライアント
│   │   ├── hackernews.ts            # HackerNews API クライアント
│   │   ├── semanticScholar.ts       # Semantic Scholar API クライアント
│   │   ├── youtube.ts               # YouTube Data API クライアント
│   │   ├── generateContent.ts       # AI コンテンツ生成ロジック
│   │   ├── aiPrompt.ts              # AI プロンプト定義
│   │   ├── streamResponse.ts        # streaming レスポンスユーティリティ
│   │   └── __tests__/
│   │       ├── wikipedia.test.ts    # Wikipedia クライアントのユニットテスト
│   │       ├── wikipedia.latency.ts # Wikipedia API レイテンシ計測（手動実行）
│   │       └── hackernews.latency.ts # HackerNews API レイテンシ計測（手動実行）
│   ├── styles/
│   │   ├── global.css               # グローバルスタイル
│   │   └── tokens.ts                # デザイントークン
│   └── test/
│       └── setup.ts                 # Vitest セットアップ
├── docs/                            # 設計ドキュメント
├── draft/
│   └── prototype-3.html             # デザインプロトタイプ（参照用）
├── .env.example                     # 環境変数のサンプル
├── .lighthouserc.json               # Lighthouse CI 設定
├── package.json
├── astro.config.mjs
└── README.md                        # このファイル
```

## セットアップ手順

### 1. 依存関係のインストール

```bash
bun install
```

### 2. 環境変数の設定

`.env.example` を `.env` にコピーし、各種APIキーを設定：

```bash
cp .env.example .env
```

必要な環境変数：

```bash
# 現在必要（フェーズ1）
GEMINI_API_KEY=
OPENAI_API_KEY=
YOUTUBE_API_KEY=

# フェーズ2 — 認証・課金（未実装）
DATABASE_URL=
PUBLIC_SUPABASE_URL=
PUBLIC_SUPABASE_ANON_KEY=
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
```

### 3. 開発サーバーの起動

```bash
bun run dev
```

http://localhost:4421 でアプリケーションが起動します。

## スクリプト

| コマンド | 説明 |
|---------|------|
| `bun run dev` | 開発サーバー起動 (http://localhost:4421) |
| `bun run build` | 本番ビルド |
| `bun run preview` | 本番ビルドのプレビュー |
| `bun test` | ユニットテスト (Vitest) |
| `bun run lhci` | ビルド後 Lighthouse CI 実行（`/` 対象） |
| `bun run lint` | ESLint |

## テスト

### ユニットテスト

```bash
bun test
```

### Lighthouse CI

```bash
# ビルドを実行してから / に対してLighthouse CIを実行
bun run lhci
```

`/discover` は外部APIに依存するため、Lighthouse CIの対象から除外されています。

### レイテンシ計測（手動実行）

```bash
# Wikipedia API レイテンシ計測（実際にネットワーク通信）
bun run src/lib/__tests__/wikipedia.latency.ts

# HackerNews API レイテンシ計測（2リクエスト逐次実行）
bun run src/lib/__tests__/hackernews.latency.ts
```

## デプロイ

### Vercelへのデプロイ

1. GitHubリポジトリにプッシュ
2. Vercelダッシュボードでプロジェクトをインポート
3. 環境変数を設定
4. デプロイ

```bash
# Vercel CLI を使用する場合
bunx vercel
```

## 実装状況

- ✅ コア発見ページ（`discover.astro`）
- ✅ AI コンテンツ生成（Gemini + OpenAI streaming）
- ✅ Wikipedia & HackerNews キーワードソース
- ✅ 関連論文取得（Semantic Scholar）
- ✅ 関連動画取得（YouTube）
- ✅ スケルトンローディング状態
- ✅ Lighthouse CI 設定済み
- ⬜ 認証（Supabase Auth）
- ⬜ 課金（Stripe）
- ⬜ データベーススキーマ（Neon Postgres）

## ライセンス

MIT
