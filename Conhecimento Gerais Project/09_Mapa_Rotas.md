
# 🗺️ BLOCO 09 — MAPA DE ROTAS, PÁGINAS E NAVEGAÇÃO ESTRUTURADA

Este documento define toda a **arquitetura de rotas da plataforma V4SalesGrowth**, detalhando as URLs acessíveis, comportamento de redirecionamento, visibilidade condicional e regras de autenticação via middleware.

---

## 🧠 01 — ROTAS PÚBLICAS

Estas rotas são acessíveis sem autenticação e devem ter proteção contra usuários logados acessarem de novo.

| Caminho       | Descrição                             | Proteção                       |
|---------------|----------------------------------------|--------------------------------|
| `/`           | Landing page principal                 | Redireciona para `/sales-copilot` se logado |
| `/login`      | Tela de login e cadastro               | Redireciona se logado         |
| `/api/stripe-webhook` | Webhook para Stripe (sem interface) | Externa / sem autenticação    |

---

## 🔐 02 — ROTAS PROTEGIDAS (AUTH)

Estas rotas exigem sessão ativa via Supabase. A verificação é feita por middleware e também em componentes react (`useSession()`).

| Caminho               | Descrição                                  |
|------------------------|---------------------------------------------|
| `/sales-copilot`       | Página principal após login (dashboard IA) |
| `/diagnostico`         | Fluxo de diagnóstico comercial (por blocos)|
| `/relatorios`          | Histórico de relatórios finalizados        |
| `/relatorio/[id]`      | Relatório específico + SWOT + plano         |
| `/copiloto/[id]`       | Sessão do plano de ação do relatório `id`  |
| `/comprar`             | Tela de recarga de créditos via Stripe     |
| `/perfil`              | Dados do usuário (futuro)                  |
| `/analytics`           | Visão de performance e evolução comercial  |

---

## 🧪 03 — ROTAS INTERNAS (API ROUTES - BACKEND ONLY)

Utilizadas por actions internas ou webhooks. Nunca devem ser públicas diretamente no frontend.

| Caminho                          | Função                                |
|----------------------------------|----------------------------------------|
| `/api/stripe-webhook`           | Recebe confirmação de pagamento       |
| `/api/credits/balance`          | Consulta saldo                        |
| `/api/credits/purchase`         | Cria session do Stripe                |
| `/api/ai/diagnostico`           | Chama GPT para montar relatório       |
| `/api/ai/copiloto`              | Mensagem com IA em execução           |
| `/api/export/pdf`               | Gera PDF do relatório                 |
| `/api/event/log`                | Registra evento em `event_logs`      |

---

## 🌐 04 — MIDDLEWARE DE REDIRECIONAMENTO

Local: `middleware.ts`

### Comportamentos:

- Se usuário **sem login** tentar acessar rota protegida → redireciona para `/login`
- Se usuário logado acessar `/login` ou `/` → redireciona para `/sales-copilot`
- Token de sessão é checado via Supabase cookie JWT

---

## 🧭 05 — MENU LATERAL E SIDEBAR (NAVEGAÇÃO LOGADA)

Visível dentro do layout `/sales-copilot`, `/relatorios`, `/diagnostico`, etc.

| Ícone        | Nome            | Caminho          |
|--------------|------------------|------------------|
| 🧠           | Sales Copilot    | `/sales-copilot` |
| 🧪           | Diagnóstico      | `/diagnostico`   |
| 📄           | Relatórios       | `/relatorios`    |
| ⚡           | Créditos         | `/comprar`       |
| 📊           | Analytics        | `/analytics`     |

---

## 📱 06 — REGRAS DE MOBILE & RESPONSIVIDADE

- A sidebar é collapsable em telas pequenas
- O botão de menu (hamburger) ativa o drawer lateral
- O layout é sempre com **header fixo + conteúdo scroll**

---

## 🛑 07 — ROTAS BLOQUEADAS (FUTURO)

Estas rotas ainda não existem mas estão reservadas:

- `/configuracoes`
- `/suporte`
- `/roleplay`
- `/calendario`
- `/auditoria-historica`

---

## ✅ CHECKLIST DE ROTAS IMPLEMENTADAS

| Caminho         | Status     |
|------------------|------------|
| `/`              | ✅ OK      |
| `/login`         | ✅ OK      |
| `/sales-copilot` | ✅ OK      |
| `/diagnostico`   | ✅ OK      |
| `/relatorios`    | ✅ OK      |
| `/relatorio/[id]`| ✅ OK      |
| `/copiloto/[id]` | ✅ OK      |
| `/comprar`       | ✅ OK      |
| `/api/...`       | ✅ OK      |

---

> Esta estrutura garante navegação fluida, controle total de sessão, proteção de dados e orientação clara por parte do sistema ao usuário.

Este bloco define **a organização de rotas e acesso** para todas as telas da aplicação.
