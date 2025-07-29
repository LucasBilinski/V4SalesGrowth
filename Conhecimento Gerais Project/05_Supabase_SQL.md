
# 🧩 BLOCO 05 — BANCO DE DADOS SUPABASE & SCRIPTS SQL (V4SalesGrowth)

Este documento é o guia oficial de estrutura de banco de dados da plataforma. Todas as tabelas, gatilhos, funções e políticas RLS foram otimizadas para performance, segurança e controle total de auditoria.

---

## ✅ 01 — TABELAS FUNDAMENTAIS

### 🔐 `profiles`
Armazena dados públicos do usuário.

```sql
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  avatar_url TEXT
);
```

---

### 💳 `credits`
Controle do saldo de créditos do usuário.

```sql
CREATE TABLE public.credits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  balance INT NOT NULL DEFAULT 0,
  last_updated TIMESTAMPTZ DEFAULT now()
);
```

---

### 💰 `credit_topups`
Log de recargas de créditos (via Stripe ou admin).

```sql
CREATE TABLE public.credit_topups (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  amount INT NOT NULL,
  source VARCHAR(50) NOT NULL DEFAULT 'manual',
  payment_id TEXT,
  status VARCHAR(50) NOT NULL DEFAULT 'completed',
  created_at TIMESTAMPTZ DEFAULT now()
);
```

---

### 🧠 `diagnostics`
Blocos respondidos do agente auditor.

```sql
CREATE TABLE public.diagnostics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  block_number INT NOT NULL,
  block_title TEXT NOT NULL,
  response_text TEXT,
  score INT,
  version VARCHAR(255) DEFAULT '1.0',
  created_at TIMESTAMPTZ DEFAULT now()
);
```

---

### 📈 `relatorios`
Relatório final com SWOT e plano de ação.

```sql
CREATE TABLE public.relatorios (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  diagnostic_id UUID REFERENCES public.diagnostics(id) ON DELETE SET NULL,
  summary TEXT,
  swot JSONB,
  plan_curto TEXT,
  plan_medio TEXT,
  plan_longo TEXT,
  score_final INT,
  version INT NOT NULL DEFAULT 1,
  is_latest BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT now()
);
```

---

### 🤖 `copilot_sessions`
Progresso da execução com o Copiloto.

```sql
CREATE TABLE public.copilot_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  related_report_id UUID REFERENCES public.relatorios(id) ON DELETE CASCADE,
  notes TEXT,
  stage VARCHAR(255),
  completed_steps INT DEFAULT 0,
  completed_tasks JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT now()
);
```

---

### 💬 `agent_history`
Histórico das interações com o agente IA.

```sql
CREATE TABLE public.agent_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  agent_name VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  is_user BOOLEAN NOT NULL,
  context_snapshot JSONB,
  timestamp TIMESTAMPTZ DEFAULT now()
);
```

---

### 📊 `usage_stats`
Estatísticas por usuário.

```sql
CREATE TABLE public.usage_stats (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  total_blocks_completed INT DEFAULT 0,
  total_reports INT DEFAULT 0,
  total_copilot_sessions INT DEFAULT 0,
  credits_consumed INT DEFAULT 0,
  last_active_at TIMESTAMPTZ DEFAULT now()
);
```

---

### 📜 `event_logs`
Log de ações no sistema (auditoria).

```sql
CREATE TABLE public.event_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  event_type VARCHAR(255) NOT NULL,
  agent_name VARCHAR(255),
  details JSONB,
  timestamp TIMESTAMPTZ DEFAULT now()
);
```

---

## ⚙️ 02 — FUNÇÕES SQL (RPCs)

### `deduct_user_credits`

```sql
CREATE OR REPLACE FUNCTION public.deduct_user_credits(p_user_id UUID, p_amount INT)
RETURNS INT AS $$
DECLARE
  current_balance INT;
  new_balance INT;
BEGIN
  SELECT balance INTO current_balance FROM public.credits WHERE user_id = p_user_id FOR UPDATE;
  IF NOT FOUND OR current_balance < p_amount THEN RETURN NULL; END IF;
  new_balance := current_balance - p_amount;
  UPDATE public.credits SET balance = new_balance, last_updated = now() WHERE user_id = p_user_id;
  RETURN new_balance;
END;
$$ LANGUAGE plpgsql;
```

---

### `increment_credit_balance`

```sql
CREATE OR REPLACE FUNCTION public.increment_credit_balance(p_user_id UUID, p_amount INT)
RETURNS void AS $$
BEGIN
  INSERT INTO public.credits (user_id, balance)
  VALUES (p_user_id, 0) ON CONFLICT (user_id) DO NOTHING;

  UPDATE public.credits
  SET balance = balance + p_amount, last_updated = now()
  WHERE user_id = p_user_id;
END;
$$ LANGUAGE plpgsql;
```

---

## 🔐 03 — POLÍTICAS DE SEGURANÇA (RLS)

### Exemplo (credits)

```sql
ALTER TABLE public.credits ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage their own credits"
ON public.credits FOR ALL USING (auth.uid() = user_id);
```

> Repetir padrão para todas as tabelas com RLS: credits, diagnostics, relatorios, copilot_sessions, etc.

---

## 🧠 04 — TRIGGERS

### `on_auth_user_created`

```sql
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name)
  VALUES (NEW.id, NEW.raw_user_meta_data->>'full_name');

  INSERT INTO public.credits (user_id, balance)
  VALUES (NEW.id, 0); -- sem saldo inicial

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
```

---

## 📌 05 — ORDEM DE EXECUÇÃO DOS SCRIPTS

1. Tabelas (`01_create_tables.sql`)
2. RLS (`02_enable_rls.sql`)
3. Triggers (`03_triggers.sql`)
4. RPCs (`04_functions.sql`)
5. Dados iniciais (`05_seed.sql`, se necessário)

---

Este bloco define toda a estrutura de dados, segurança e funções do Supabase para a aplicação. Use este documento como referência absoluta de backend.
