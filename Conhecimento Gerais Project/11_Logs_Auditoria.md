
# 📊 BLOCO 11 — LOGS, MONITORAMENTO E AUDITORIA TÉCNICA

Este documento define a estratégia de **observabilidade técnica da plataforma V4SalesGrowth**, cobrindo logs de eventos, métricas de uso, versionamento de relatórios, registro de sessões, e rastreabilidade de atividades de IA.

---

## 🎯 OBJETIVOS

- Rastrear toda a jornada do usuário
- Registrar o uso dos agentes
- Auditar conversas, ações e transações
- Medir progresso e engajamento
- Garantir accountability e segurança de dados

---

## 📂 01 — TABELAS DE MONITORAMENTO (SUPABASE)

### `event_logs`

| Campo        | Tipo       | Descrição                             |
|--------------|------------|----------------------------------------|
| id           | UUID       | ID do evento                          |
| user_id      | UUID       | Quem gerou o evento                   |
| event_type   | string     | Tipo (`diagnostic_completed`, etc)    |
| agent_name   | string     | Nome do agente                        |
| details      | JSONB      | Payload adicional                     |
| timestamp    | timestamp  | Quando ocorreu                        |

> Todos eventos críticos da plataforma são registrados aqui.

---

### `usage_stats`

| Campo               | Tipo       | Descrição                                |
|---------------------|------------|-------------------------------------------|
| user_id             | UUID       | Referência para o usuário                 |
| total_blocks_completed | int     | Blocos de diagnóstico finalizados         |
| total_reports       | int        | Quantidade de relatórios gerados          |
| total_copilot_sessions | int     | Sessões com o Sales Copilot               |
| credits_consumed    | int        | Total de créditos usados                  |
| last_active_at      | timestamp  | Última vez ativo                          |

> Essa tabela é atualizada automaticamente com cada interação relevante.

---

### `agent_history`

| Campo        | Tipo       | Descrição                         |
|--------------|------------|------------------------------------|
| user_id      | UUID       | Usuário da mensagem               |
| agent_name   | string     | Nome do agente                    |
| message      | text       | Conteúdo da mensagem              |
| is_user      | boolean    | True = usuário / False = IA       |
| context_snapshot | JSONB | Estado do contexto do agente      |
| timestamp    | timestamp  | Momento exato da mensagem         |

---

### `copilot_sessions`

| Campo              | Tipo     | Descrição                                |
|--------------------|----------|-------------------------------------------|
| user_id            | UUID     | Referência para o usuário                 |
| related_report_id  | UUID     | Vinculado a qual relatório                |
| completed_tasks    | JSONB    | Tarefas concluídas                        |
| stage              | string   | Fase atual da sessão                      |
| notes              | text     | Anotações internas                        |
| created_at         | timestamp| Data de início da sessão                  |

---

## ⚙️ 02 — TRIGGERS E FUNÇÕES

### `increment_stat_field(user_id, campo, valor)`

- Atualiza qualquer campo da `usage_stats` dinamicamente
- Ex: somar 1 ao `total_reports`

### `deduct_user_credits` + `increment_credit_balance`

- Atualizam o uso de créditos + saldo em tempo real

---

## 💬 03 — LOGS DE AGENTES

Cada vez que o usuário:
- **conclui um bloco**
- **gera um relatório**
- **conversa com IA**
- **executa uma tarefa**

→ é criado um log em `event_logs` e/ou `agent_history`.

---

## 🕵️ 04 — AUDITORIA DE VERSÕES

### `relatorios`

- Cada relatório gerado possui `version`
- Campo `is_latest` controla se é o mais atual
- Permite comparar versões diferentes de diagnóstico

---

## 🛠️ 05 — EXEMPLOS DE USO

### Ao finalizar um diagnóstico:

```sql
INSERT INTO event_logs (
  user_id,
  event_type,
  agent_name,
  details
) VALUES (
  '123-uuid',
  'diagnostic_completed',
  'auditor',
  '{"blocos":6,"tempo":"12min"}'
);
```

---

## 🔒 06 — POLÍTICAS DE SEGURANÇA (RLS)

- Todas tabelas têm Row-Level Security
- Usuários só acessam seus próprios dados
- Admins podem ser habilitados futuramente

---

## 📈 07 — DASHBOARD INTERNO (FUTURO)

Métricas para admin (em `/analytics` ou painel interno):

| Métrica                     | Fonte             |
|-----------------------------|-------------------|
| Usuários ativos no mês      | usage_stats       |
| Créditos consumidos         | usage_stats       |
| Conversas com IA            | agent_history     |
| Diagnósticos concluídos     | event_logs        |
| Score médio por bloco       | diagnostics       |

---

## ✅ CHECKLIST TÉCNICO

| Item                          | Status |
|-------------------------------|--------|
| event_logs implementado       | ✅     |
| usage_stats com triggers      | ✅     |
| agent_history em produção     | ✅     |
| RLS aplicado em todas tabelas | ✅     |
| Snapshots de contexto salvos  | ✅     |
| Auditoria de versões em relatórios | ✅ |

---

Este sistema garante **visibilidade total**, auditoria de uso e estrutura de dados para escalar a plataforma com inteligência.
