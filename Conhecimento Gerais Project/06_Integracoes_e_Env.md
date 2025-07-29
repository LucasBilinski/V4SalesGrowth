
# 🌐 BLOCO 06 — INTEGRAÇÕES & VARIÁVEIS DE AMBIENTE (V4SalesGrowth)

Este documento define todas as integrações externas da plataforma e as variáveis de ambiente necessárias para funcionamento completo e seguro em produção.

---

## 🔗 01 — SUPABASE

Plataforma de autenticação, banco de dados e controle de sessão.

### 🔐 Variáveis obrigatórias:

```env
NEXT_PUBLIC_SUPABASE_URL=https://csknokadqcubncivhxjp.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_JWT_SECRET=XDRYxRBzbdHc0iRZYFPm1BNociHjpWZpJ73StOc3UAwTxKrD...
SUPABASE_URL=https://csknokadqcubncivhxjp.supabase.co
```

> ⚠️ As chaves reais devem ser mantidas seguras e só adicionadas via painel da Vercel.

---

## 🐘 02 — POSTGRESQL (DO SUPABASE)

Acesso direto ao banco Postgres do Supabase (para Prisma ou queries avançadas).

### 🔐 Variáveis:

```env
POSTGRES_URL=postgres://postgres.csknokadqcubncivhxjp:senha@aws-0-sa-east-1.pooler.supabase.com:6543/postgres?sslmode=require
POSTGRES_URL_NON_POOLING=postgres://postgres.csknokadqcubncivhxjp:senha@aws-0-sa-east-1.pooler.supabase.com:5432/postgres?sslmode=require
POSTGRES_PRISMA_URL=postgres://postgres.csknokadqcubncivhxjp:senha@aws-0-sa-east-1.pooler.supabase.com:6543/postgres?sslmode=require&pgbouncer=true
POSTGRES_USER=postgres
POSTGRES_PASSWORD=senha
POSTGRES_DATABASE=postgres
POSTGRES_HOST=db.csknokadqcubncivhxjp.supabase.co
```

> Essas credenciais são usadas internamente para ações administrativas. Evite usar no frontend.

---

## 💳 03 — STRIPE (PAGAMENTOS)

Responsável por cobrar e registrar créditos consumíveis por uso.

### 🔐 Variáveis:

```env
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

### 🧾 Price IDs (produtos reais configurados no Stripe):

| Plano    | Price ID                      |
|----------|-------------------------------|
| Start    | `price_123abcStart`           |
| Growth   | `price_456defGrowth`          |
| Pro      | `price_789ghiPro`             |
| Master   | `price_987zyxMaster`          |

> Os IDs acima devem ser colocados dentro do código `/app/api/stripe/create-session/route.ts`.

---

### 🔁 Webhook do Stripe

#### URL:
```
https://v4salesgrowth.vercel.app/api/stripe-webhook
```

#### Eventos habilitados:
- `checkout.session.completed`
- `invoice.payment_succeeded`
- `invoice.payment_failed`

> O endpoint chama a função `increment_credit_balance` no Supabase e registra a transação em `credit_topups`.

---

## 🧠 04 — OPENAI (IA - SALES COPILOT)

Responsável por toda a inteligência do agente (GPT-4o).

### 🔐 Variável:

```env
OPENAI_API_KEY=sk-proj-...
```

### Modelo padrão:

```ts
model: "gpt-4o"
temperature: 0.7
context_window: 128000
```

---

## 🛡️ 05 — SEGURANÇA E BOAS PRÁTICAS

- ✅ Todas variáveis devem estar cadastradas na Vercel via **Settings > Environment Variables**
- ✅ Todas como **“All Environments”**
- ❌ Nunca coloque chaves diretamente no código
- ✅ O arquivo `.env.local` só existe localmente para debug
- ✅ Desmarcar “Use existing build cache” ao dar redeploy

---

## 🧪 06 — CHECKLIST DE TESTES

| Verificação                           | Status |
|--------------------------------------|--------|
| Supabase conectado corretamente       | [ ]    |
| Autenticação funcionando              | [ ]    |
| Stripe criando checkout sessions      | [ ]    |
| Créditos sendo creditados via webhook| [ ]    |
| OpenAI respondendo via agente IA     | [ ]    |
| Todas variáveis ativas na Vercel     | [ ]    |

---

Este documento garante que todas integrações estejam corretamente conectadas, seguras e funcionais para a operação da plataforma em produção.
