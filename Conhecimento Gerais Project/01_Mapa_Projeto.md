
# 📦 BLOCO 01 — MAPEAMENTO GERAL DO PROJETO `V4SalesGrowth`

Este documento serve como base de referência para a arquitetura, rotas, componentes e estrutura lógica da plataforma. Toda a aplicação se baseia nesse mapa para garantir consistência entre design, navegação, lógica de negócios e dados.

---

## 🧭 VISÃO GERAL DO PROJETO

O projeto `V4SalesGrowth` é um ecossistema de inteligência comercial com IA, operando no modelo **Pay Per Know**. O foco é evoluir vendedores e empresas através de auditoria, diagnóstico e copiloto de vendas — com base em dados, benchmarkings e IA estratégica.

---

## 🧩 ROTAS E FLUXO PRINCIPAL

| Página                  | Rota               | Objetivo                                                   |
|------------------------|--------------------|------------------------------------------------------------|
| Landing Page           | `/`                | Apresentação da proposta e CTA para login                  |
| Login / Cadastro       | `/login`           | Entrada na plataforma                                      |
| Dashboard              | `/sales-copilot`   | Área principal com chat e controle do usuário              |
| Diagnóstico (Auditor)  | `/sales-copilot/diagnostico` | Auditoria estratégica em blocos guiados              |
| Execução (Copiloto)    | `/sales-copilot/execucao`   | Execução do plano de ação guiado                          |
| Relatório Individual   | `/relatorio/[id]`  | Exibição de relatório final gerado                        |
| Página de Créditos     | `/credits`         | Compra e gerenciamento de créditos                         |

---

## 🧱 ESTRUTURA DE COMPONENTES

### 📁 `/components/ui`
- Botões, inputs, selects, checkboxes
- Cards, modais, tabs, tooltips
- Sistema de toasts (via Sonner)

### 📁 `/components/layout`
- `Header.tsx` – Cabeçalho superior
- `Sidebar.tsx` – Navegação lateral inteligente
- `PageContainer.tsx` – Container central padronizado

### 📁 `/components/chat`
- Interface do agente copiloto
- Histórico da conversa
- Contador de tokens / créditos consumidos

### 📁 `/components/diagnostic`
- Blocos sequenciais de perguntas
- Avaliação e lógica de pontuação (score)

### 📁 `/components/relatorio`
- Gráficos (KPI)
- SWOT
- Planos de ação de curto, médio e longo prazo

---

## 🔌 LÓGICA BACKEND / SERVER ACTIONS

| Pasta                     | Função                              |
|--------------------------|-------------------------------------|
| `/lib/supabase/client.ts`| Cliente para acesso público         |
| `/lib/supabase/admin.ts` | Acesso server-side (Service Role)   |
| `/app/actions/auth.ts`   | Signup, login, logout               |
| `/app/actions/auditor.ts`| Salvamento dos blocos de diagnóstico|
| `/app/actions/chat.ts`   | Chat IA do Copiloto                 |

---

## 🧠 INTEGRAÇÃO DE IA

Toda interação com a IA ocorre via:
- Chat do Copiloto (execução contínua)
- Diagnóstico (blocos orientados)
- Respostas são validadas via token e consumo de créditos
- Integração com OpenAI (GPT-4o)

---

## 💳 PAGAMENTO E CRÉDITOS

- Stripe para checkout
- Webhook para registrar recargas em `credit_topups`
- Tabela `credits` controla o saldo
- Toda interação com IA deduz créditos com base em tokens usados
- Sem saldo → Bloqueio de uso com mensagem educada

---

## 🧮 BASE DE DADOS (SUPABASE)

| Tabela              | Função                                      |
|---------------------|---------------------------------------------|
| `profiles`          | Dados públicos do usuário                   |
| `credits`           | Saldo de créditos                           |
| `credit_topups`     | Recargas feitas (via Stripe)                |
| `diagnostics`       | Blocos respondidos                          |
| `relatorios`        | Plano completo final                        |
| `copilot_sessions`  | Progresso do plano em execução              |
| `agent_history`     | Log das mensagens no chat                   |
| `event_logs`        | Eventos do sistema                          |
| `usage_stats`       | Estatísticas de uso por usuário             |

---

## 🎨 DESIGN E ESTÉTICA

- Layout responsivo via Tailwind
- Cores principais: Vermelho V4 (#e50914), Preto, Branco
- Tipografia: Montserrat (texto), Archivo Black (títulos)
- Padrão visual minimalista, direto, tecnológico

---

## 🗂️ PASTA `design/` RECOMENDADA

Criar `/design/` com arquivos de referência como:

- `landing-layout.png`
- `dashboard-wireframe.png`
- `relatorio-kpi.png`
- `chat-agent-flow.png`

---

## ✅ CHECKLIST DE IMPLEMENTAÇÃO INICIAL

- [ ] Rotas principais criadas
- [ ] Componentes base de layout prontos
- [ ] Sidebar com navegação funcional
- [ ] Chat IA conectado
- [ ] Sistema de créditos ativado
- [ ] Supabase conectado e funcional
- [ ] Webhook Stripe configurado
- [ ] SQLs aplicados no Supabase

---

**Este documento é a base de entendimento estrutural do projeto. Toda ação deve respeitar esta arquitetura.**
