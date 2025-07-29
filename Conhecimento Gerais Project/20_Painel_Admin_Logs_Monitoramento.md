
# 🧭 BLOCO 20 — PAINEL ADMIN, MONITORAMENTO E LOGS ESTRATÉGICOS

Este bloco define a **estrutura do painel administrativo e arquitetura de monitoramento** da V4SalesGrowth, focada em rastreabilidade, controle de uso, segurança e gestão estratégica de dados.

---

## 🧩 01 — OBJETIVO DO PAINEL ADMINISTRATIVO

O painel administrativo é a central de controle dos gestores da plataforma. Ele permite:

- Visualizar todos os usuários da base
- Gerenciar créditos manualmente
- Auditar diagnósticos e relatórios
- Ver histórico de uso e consumo de tokens
- Exportar dados em lote
- Monitorar eventos relevantes do sistema

---

## 🧱 02 — ROTAS DO ADMIN

| Rota                     | Descrição                               | Proteção |
|--------------------------|------------------------------------------|----------|
| `/admin/usuarios`        | Lista e detalhes de usuários              | Admin    |
| `/admin/relatorios`      | Visualização de todos os relatórios       | Admin    |
| `/admin/logs`            | Visualização dos logs do sistema          | Admin    |

---

## 👥 03 — VISÃO GERAL DE USUÁRIOS

Componentes da tela:

- Tabela com:
  - Nome
  - Email
  - Data de criação
  - Créditos atuais
  - Última atividade
- Filtros por inativos, planos, mais ativos
- Ações rápidas:
  - Editar créditos
  - Resetar senha
  - Desativar conta

---

## 📄 04 — GERENCIAMENTO DE RELATÓRIOS

- Lista com:
  - Nome do usuário
  - Score final
  - Data de criação
  - Status (ativo, expirado, editado)
- Exportação em lote:
  - Seleção múltipla
  - Exportar como ZIP de PDFs ou JSONs
- Botão: Ver relatório completo

---

## 🧮 05 — VISUALIZAÇÃO DE ESTATÍSTICAS GERAIS

- Gráficos:
  - Diagnósticos por dia
  - Tokens consumidos por usuário
  - Créditos gastos por agente
- Tabela com top 10 usuários mais ativos
- KPI Cards:
  - Total de usuários
  - Total de relatórios
  - Média de créditos por usuário

---

## 🛡️ 06 — TABELA DE LOGS (`event_logs`)

| Campo         | Tipo     | Descrição                                  |
|---------------|----------|---------------------------------------------|
| event_type    | TEXT     | Tipo do evento: `login`, `relatorio`, etc.  |
| user_id       | UUID     | Usuário que gerou o evento                  |
| agent_name    | TEXT     | Nome do agente envolvido                    |
| details       | JSONB    | Dados adicionais do evento                  |
| timestamp     | TIMESTAMP | Data e hora do evento                     |

### Exemplos de Logs:

- `diagnostic_block_completed`
- `final_report_generated`
- `copilot_message_sent`
- `stripe_topup_completed`
- `export_report`

---

## 🔐 07 — CONTROLE DE ACESSO

- Apenas usuários com `profiles.role = 'admin'` acessam rotas `/admin`
- Proteção via middleware + verificação client-side
- Menu lateral exibe seção “Admin” apenas se o role for válido

---

## 🔍 08 — PESQUISA E FILTRO AVANÇADO

Todas as páginas admin possuem:

- Busca por nome / email / ID
- Filtros por:
  - Data
  - Status
  - Tipo de evento (em logs)
  - Score (em relatórios)

---

## 🛠️ 09 — FERRAMENTAS INTERNAS DE GESTÃO

- Acesso aos Webhooks do Stripe (testes / falhas)
- Função para crédito manual de usuários
- Botão para reset de senha via Supabase Admin
- Logs de tentativas de login inválidas

---

## ✅ 10 — CHECKLIST DE MONITORAMENTO

| Item                                | Status |
|-------------------------------------|--------|
| Painel de usuários com ações rápidas| ✅     |
| Visualização de relatórios em lote | ✅     |
| Logs detalhados em tempo real      | ✅     |
| Filtros e busca nos painéis        | ✅     |
| Segurança via role `admin`         | ✅     |
| Exportação de dados estruturados   | ✅     |
| Painel com KPIs e gráficos         | ✅     |

---

> Este bloco garante **controle total, visão estratégica e segurança da operação** da plataforma — essencial para escalar com responsabilidade e governança.

É o **cérebro gerencial do V4SalesGrowth.**
