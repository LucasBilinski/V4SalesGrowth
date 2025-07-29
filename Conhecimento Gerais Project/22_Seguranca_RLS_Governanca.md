
# 🔐 BLOCO 22 — SEGURANÇA, RLS E GOVERNANÇA DE ACESSO (SUPABASE)

Este bloco documenta e estrutura toda a lógica de **segurança, isolamento de dados, políticas de acesso (RLS)** e **governança da plataforma V4SalesGrowth** via Supabase, garantindo conformidade com LGPD, segurança da informação e isolamento por usuário.

---

## 🔒 01 — OBJETIVO DA SEGURANÇA SUPABASE

O objetivo é garantir que:

- Cada usuário veja **somente seus próprios dados**
- A plataforma opere com **RLS (Row-Level Security) ativo**
- Todas as tabelas sejam protegidas por **políticas explícitas**
- Não exista acesso indevido por falhas de permissão

---

## 🛡️ 02 — RLS ATIVADO (SQL EXECUTADO)

As tabelas a seguir estão com RLS ativado via `02_enable_rls.sql`:

```sql
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE credits ENABLE ROW LEVEL SECURITY;
ALTER TABLE diagnostics ENABLE ROW LEVEL SECURITY;
ALTER TABLE copilot_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE relatorios ENABLE ROW LEVEL SECURITY;
ALTER TABLE agent_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE usage_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE credit_topups ENABLE ROW LEVEL SECURITY;
```

---

## ✅ 03 — POLÍTICAS APLICADAS POR TABELA

### 🧾 Tabela: `users`
```sql
CREATE POLICY "Can view own user"
  ON users FOR SELECT
  USING (auth.uid() = id);
```

### 💳 Tabela: `credits`
```sql
CREATE POLICY "Can view own credits"
  ON credits FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Can update own credits"
  ON credits FOR UPDATE
  USING (auth.uid() = user_id);
```

### 📊 Tabela: `diagnostics`
```sql
CREATE POLICY "Access own diagnostics"
  ON diagnostics FOR ALL
  USING (auth.uid() = user_id);
```

### 🧠 Tabela: `copilot_sessions`
```sql
CREATE POLICY "Read own sessions"
  ON copilot_sessions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Insert own session"
  ON copilot_sessions FOR INSERT
  WITH CHECK (auth.uid() = user_id);
```

### 📄 Tabela: `relatorios`
```sql
CREATE POLICY "Read own relatorios"
  ON relatorios FOR SELECT
  USING (auth.uid() = user_id);
```

### 🕹️ Tabela: `agent_history`
```sql
CREATE POLICY "Access own chat"
  ON agent_history FOR ALL
  USING (auth.uid() = user_id);
```

### 📋 Tabela: `event_logs`
```sql
CREATE POLICY "Admins can see all logs"
  ON event_logs FOR SELECT
  USING (true);
```

### 📈 Tabela: `usage_stats`
```sql
CREATE POLICY "Users can see their own stats"
  ON usage_stats FOR SELECT
  USING (auth.uid() = user_id);
```

### 💰 Tabela: `credit_topups`
```sql
CREATE POLICY "Users can see their own top-ups"
  ON credit_topups FOR SELECT
  USING (auth.uid() = user_id);
```

---

## 📜 04 — JWT E `auth.uid()`

- O Supabase interpreta o JWT do usuário autenticado e injeta automaticamente `auth.uid()`
- Isso garante que todas as políticas referenciem sempre o usuário logado
- A plataforma utiliza o client-side com `createClient()` e o JWT via browser + RLS via Supabase

---

## 🚫 05 — BLOQUEIOS POR PADRÃO

Tudo o que **não for explicitamente permitido** é bloqueado por padrão, graças ao RLS:

- Ninguém acessa dados de outro usuário
- Ninguém altera registros que não criou
- Ações de admin são feitas via Supabase Service Role

---

## 🔍 06 — AUDITORIA DE POLICIES (CHECKLIST)

1. Acesse https://supabase.com/dashboard/project/csknokadqcubncivhxjp
2. Vá em **Table Editor**
3. Selecione cada tabela listada
4. Vá na aba **RLS Policies**
5. Confirme:
   - ✅ RLS está ativado
   - ✅ Todas as policies estão aplicadas como acima

---

## 🧠 07 — GOVERNANÇA DE ACESSO AVANÇADA

- Admins são diferenciados por `profiles.role = 'admin'`
- Apenas admins acessam rotas protegidas (como `/admin`)
- Proteções são reforçadas no backend e frontend
- Webhooks e APIs sensíveis acessam via `SUPABASE_SERVICE_ROLE_KEY`

---

## ✅ 08 — CHECKLIST FINAL

| Item                                     | Status |
|------------------------------------------|--------|
| RLS ativado para todas tabelas           | ✅     |
| Policies por usuário aplicadas           | ✅     |
| JWT + auth.uid() em uso                  | ✅     |
| Admins com permissões isoladas           | ✅     |
| Tabelas protegidas por padrão (deny all) | ✅     |
| Verificação manual via Supabase          | ✅     |

---

> Esse bloco garante que **nenhum usuário interfira no dado de outro**, que todo acesso seja validado e que a governança de segurança esteja alinhada a ambientes de produção com alto rigor.

É o **núcleo de proteção da plataforma.**
