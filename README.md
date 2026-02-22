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
│  │  - index.astro (メイン発見UI)                         │  │
│  │  - pricing.astro (料金プラン)                         │  │
│  │  - account.astro (アカウント管理)                     │  │
│  └───────────────────────────────────────────────────────┘  │
│  ┌───────────────────────────────────────────────────────┐  │
│  │  API Routes (Serverless Functions)                    │  │
│  │  - /api/generate.ts (OpenAI streaming proxy)          │  │
│  │  - /api/create-checkout.ts (Stripe checkout session)  │  │
│  │  - /api/create-portal.ts (Stripe billing portal)      │  │
│  │  - /api/stripe-webhook.ts (Stripe webhook handler)    │  │
│  └───────────────────────────────────────────────────────┘  │
└──────────┬─────────────────┬─────────────────┬──────────────┘
           │                 │                 │
           ↓                 ↓                 ↓
    ┌──────────┐      ┌──────────┐      ┌──────────┐
    │  Neon    │      │ Supabase │      │  Stripe  │
    │ Postgres │      │   Auth   │      │ Checkout │
    │          │      │          │      │  Portal  │
    └──────────┘      └──────────┘      └──────────┘
           ↓
    ┌──────────┐      ┌──────────┐
    │Wikipedia │      │ OpenAI   │
    │ Random   │      │   API    │
    │   API    │      │          │
    └──────────┘      └──────────┘
```

## 技術スタック選定理由

### なぜこの構成？

| 技術 | 選定理由 |
|------|---------|
| **Astro** | 静的コンテンツが多い本アプリに最適。Lighthouse 100点が現実的。必要な箇所のみReact islandsで動的UIを実装 |
| **Neon Postgres** | Supabaseより安定。PostgreSQL serverless。Vercel統合が簡単。従量課金で初期コストほぼゼロ |
| **Supabase Auth** | 認証機能のみ使用。実績あり、実装が簡単。OAuth連携もサポート |
| **Stripe** | 課金UIをすべてStripe側でホスト（Checkout + Billing Portal）。実装が最小限で済む |
| **Vercel** | Astroの完全サポート、エッジファンクション、自動デプロイ。無料枠が充実 |

### 要件との対応

✅ **SEO**: Astroの静的生成により完璧なSEO対応
✅ **Lighthouse 95-100点**: 静的HTML + 最小限のJavaScript
✅ **将来の拡張性**: PostgresでRDB、認証・課金基盤が整備済み
✅ **課金実装が簡単**: Stripe Checkoutで決済UIは外部ホスト

## ディレクトリ構成

```
enliminal/
├── src/
│   ├── pages/
│   │   ├── index.astro              # メインページ
│   │   ├── pricing.astro            # 料金ページ
│   │   ├── account.astro            # アカウント管理
│   │   └── api/
│   │       ├── generate.ts          # OpenAI streaming proxy
│   │       ├── create-checkout.ts   # Stripe checkout session作成
│   │       ├── create-portal.ts     # Stripe billing portal作成
│   │       └── stripe-webhook.ts    # Stripe webhook処理
│   ├── islands/
│   │   ├── DiscoverButton.tsx       # メインのキーワード発見UI
│   │   └── PricingCard.tsx          # 料金プランカード
│   ├── components/
│   │   └── Layout.astro             # 共通レイアウト
│   └── lib/
│       ├── stripe.ts                # Stripe SDK初期化
│       ├── supabase.ts              # Supabase Auth設定
│       └── db.ts                    # Neon Postgres接続
├── docs/
│   ├── goal.md                      # プロジェクトのゴール
│   └── task/
│       └── astro-implementation.md  # 実装プラン
├── draft/
│   └── prototype-3.html             # デザインプロトタイプ
├── .env.example                     # 環境変数のサンプル
├── package.json
├── astro.config.mjs
└── README.md                        # このファイル
```

## データベーススキーマ

### Neon Postgres

```sql
-- ユーザーテーブル
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- サブスクリプションテーブル
CREATE TABLE subscriptions (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  stripe_customer_id TEXT UNIQUE NOT NULL,
  status TEXT NOT NULL,  -- active, canceled, past_due
  plan_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- キーワード閲覧履歴
CREATE TABLE keyword_history (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  keyword TEXT NOT NULL,
  description TEXT,
  viewed_at TIMESTAMPTZ DEFAULT NOW()
);
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
# Neon Postgres
DATABASE_URL=postgresql://user:password@host/dbname

# Supabase Auth（認証のみ使用）
PUBLIC_SUPABASE_URL=https://xxx.supabase.co
PUBLIC_SUPABASE_ANON_KEY=eyJxxx
SUPABASE_SERVICE_ROLE_KEY=eyJxxx

# Stripe
PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_xxx
STRIPE_SECRET_KEY=sk_test_xxx
STRIPE_WEBHOOK_SECRET=whsec_xxx

# OpenAI
OPENAI_API_KEY=sk-xxx
```

### 3. データベースのセットアップ

Neon Postgresでデータベースを作成し、上記スキーマを実行：

```bash
# Neonのダッシュボードでプロジェクトを作成
# DATABASE_URLを取得して .env に設定
# スキーマを実行（Neon SQL Editor or psql）
```

### 4. 開発サーバーの起動

```bash
bun run dev
```

http://localhost:4421 でアプリケーションが起動します。

## デプロイ手順

### Vercelへのデプロイ

1. GitHubリポジトリにプッシュ
2. Vercelダッシュボードでプロジェクトをインポート
3. 環境変数を設定（上記の環境変数をすべて設定）
4. デプロイ

```bash
# または Vercel CLIを使用
bunx vercel
vercel
```

### Stripe Webhookの設定

デプロイ後、Stripe DashboardでWebhookエンドポイントを設定：

```
https://your-domain.vercel.app/api/stripe-webhook
```

イベント:
- `customer.subscription.created`
- `customer.subscription.updated`
- `customer.subscription.deleted`

## 課金実装の概要

### Stripeフロー

1. **Checkout Session作成** (`/api/create-checkout.ts`)
   - フロントエンドから価格IDを受け取る
   - Stripe Checkout Sessionを作成
   - Checkoutページにリダイレクト

2. **決済完了** (Stripe Checkout hosted page)
   - ユーザーがStripeのページで決済
   - 成功時にリダイレクト

3. **Webhook処理** (`/api/stripe-webhook.ts`)
   - サブスクリプションステータスをDBに保存
   - イベントログを記録

4. **Billing Portal** (`/api/create-portal.ts`)
   - 既存顧客の管理UIをStripe側で提供
   - プラン変更、キャンセル、支払い方法更新が可能

### メリット

- 決済UIの実装不要（Stripe Checkoutがホスト）
- PCI DSS準拠の心配不要
- 多言語・多通貨対応が自動
- 顧客管理UIも外部ホスト（Billing Portal）

## コスト試算（MVP）

| サービス | プラン | 月間想定コスト |
|---------|-------|--------------|
| Astro | OSS | 無料 |
| Vercel | Hobby | 無料（100GB bandwidth/月） |
| Neon Postgres | Free Tier | 無料（512MB storage, 0.5 compute hours/月） |
| Supabase Auth | Free Tier | 無料（50,000 MAU） |
| Stripe | 決済手数料のみ | 決済額の3.6% |
| OpenAI API | 従量課金 | ~$0.01/request × リクエスト数 |

**月間1,000ユーザー × 10リクエスト = 10,000リクエスト**
- OpenAI コスト: ~$100
- その他: ほぼ無料

→ 小規模であればOpenAI APIコストのみで運用可能

## 次のステップ（実装フェーズ）

実装の詳細は `docs/task/astro-implementation.md` を参照：

1. ✅ アーキテクチャ設計完了
2. ⬜ Astroプロジェクトのスケルトン作成
3. ⬜ Neon PostgreSQL セットアップ
4. ⬜ Supabase Auth 設定
5. ⬜ プロトタイプ（draft/prototype-3.html）をAstroコンポーネントに移植
6. ⬜ Wikipedia API 連携
7. ⬜ OpenAI streaming 実装
8. ⬜ Stripe 統合（後のフェーズ）

## ライセンス

MIT

## 貢献

IssueやPull Requestを歓迎します。
