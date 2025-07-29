
# 🧭 BLOCO 17 — ROTAS, FLUXO DE TELAS E ORGANIZAÇÃO DE INTERFACE

Este bloco define toda a **arquitetura visual, fluxo de navegação e estrutura de rotas** da aplicação V4SalesGrowth — com foco em UX modular, interface clara, navegação guiada e flexibilidade para escalar novos recursos.

---

## 🌐 01 — ESTRUTURA PRINCIPAL DE ROTAS

| Rota                   | Descrição                                                | Acesso          |
|------------------------|-----------------------------------------------------------|-----------------|
| `/`                    | Landing page pública com call to action                  | Público         |
| `/login`               | Login e criação de conta via Supabase                    | Público         |
| `/sales-copilot`       | Página principal após login (chat + blocos ativos)       | Usuários logados|
| `/relatorio/[id]`      | Visualização de relatório gerado                         | Usuários logados|
| `/comprar-creditos`    | Página de checkout de créditos                           | Usuários logados|
| `/perfil`              | Edição de perfil e gerenciamento de conta                | Usuários logados|
| `/admin/usuarios`      | Painel de usuários                                        | Admin           |
| `/admin/relatorios`    | Painel com todos relatórios da base                      | Admin           |
| `/admin/logs`          | Visualização completa de logs e eventos                  | Admin           |

---

## 🧱 02 — ESTRUTURA DE TELAS (UX FLOW)

```plaintext
[ Landing Page ]
     ↓ CTA
[ Login ]
     ↓ Cadastro (sem e-mail obrigatório)
[ sales-copilot ]
     ↳ Chat IA
     ↳ Blocos do Diagnóstico
     ↳ Relatórios anteriores
     ↳ Plano de Ação
     ↳ Botão: Comprar Créditos
     ↳ Perfil / Créditos

[ Admin Panel ]
     ↳ Usuários
     ↳ Logs
     ↳ Relatórios

[ Exportação ]
     ↳ Relatório PDF
     ↳ JSON das sessões
```

---

## 📐 03 — ORGANIZAÇÃO EM LAYOUTS

A aplicação usa estrutura modular de layouts:

```
app/
├── layout.tsx            → Layout principal (com <Sidebar />)
├── page.tsx              → Landing page
├── login/
│   └── page.tsx
├── sales-copilot/
│   └── page.tsx
├── relatorio/
│   └── [id]/
│       └── page.tsx
├── admin/
│   ├── usuarios/
│   ├── relatorios/
│   └── logs/
```

---

## 🧭 04 — SIDEBAR INTELIGENTE (NAVEGAÇÃO PRINCIPAL)

- Exibido após login
- Mostra:
  - Créditos atuais
  - Links:
    - Sales Copilot
    - Relatórios
    - Comprar Créditos
    - Perfil
    - Admin (se `user.role === 'admin'`)

---

## 💬 05 — FLUXO DE DIAGNÓSTICO

| Etapa                       | Componente / Rota                  |
|-----------------------------|------------------------------------|
| Início                      | `/sales-copilot` com prompt        |
| Bloco 1 a 6                 | Chat com form / cards por etapa    |
| Finalização                 | Geração do relatório + versão      |
| Plano de Ação               | IA retorna listas curto / médio / longo
| Evolução Contínua           | IA propõe reauditorias, ajustes

---

## 🔐 06 — MIDDLEWARE E PROTEÇÃO DE ROTAS

- Rotas protegidas exigem Supabase session
- Middleware redireciona para `/login` se não autenticado
- Admin é verificado via `profiles.role`

---

## 🧩 07 — ESTRUTURA VISUAL DE COMPONENTES

| Componente         | Uso                                                        |
|--------------------|------------------------------------------------------------|
| `ChatInterface`    | Conversa com IA                                            |
| `BlocoDiagnostico` | Coleta de respostas de cada bloco                          |
| `RelatorioCard`    | Lista visual dos relatórios                                |
| `Sidebar`          | Navegação lateral                                           |
| `CreditCounter`    | Exibição de créditos no topo                               |
| `Toast` (Sonner)   | Feedback de ações (respostas salvas, erro, etc.)           |

---

## 🔀 08 — ESTRATÉGIAS DE FLUXO FLEXÍVEL

- A navegação não é linear: IA pode sugerir pular etapas ou voltar
- Usuário pode:
  - Retomar diagnóstico antigo
  - Refazer apenas 1 bloco
  - Ativar Copilot direto, sem novo diagnóstico
  - Recarregar créditos sem sair do chat

---

## 💼 09 — FLUXO DE COMPRA DE CRÉDITOS

1. Usuário clica em “Comprar Créditos” no sidebar
2. É redirecionado para `/comprar-creditos`
3. Seleciona plano
4. Redirecionado ao Stripe (checkout)
5. Stripe retorna para plataforma
6. Webhook do Stripe dispara:
   - incrementa `credits` via função RPC
   - salva em `credit_topups`
7. Toast: “✅ Créditos adicionados com sucesso!”

---

## 📤 10 — EXPORTAÇÃO DE RELATÓRIOS

- Opção aparece ao fim de cada diagnóstico
- Exporta:
  - Relatório PDF
  - Plano de Ação JSON
  - Histórico da IA

---

## ✅ CHECKLIST FINAL

| Elemento                             | Status |
|--------------------------------------|--------|
| Roteamento por autenticação          | ✅     |
| Redirecionamento pós-login           | ✅     |
| Sidebar adaptável por role           | ✅     |
| Estrutura modular por rota           | ✅     |
| Flow de diagnóstico e plano de ação  | ✅     |
| Admin isolado por rota               | ✅     |
| Compra de créditos via Stripe        | ✅     |
| Exportação de relatórios             | ✅     |

---

> Este bloco garante uma navegação fluida, lógica e escalável — com experiência centrada no usuário, modularidade de jornada e rotas estruturadas para crescimento.

É o **mapa da plataforma em movimento.**
