
# 🚀 BLOCO 08 — JORNADA DO USUÁRIO E FLUXO DE EVOLUÇÃO COMERCIAL

Este documento define toda a **experiência do cliente dentro da plataforma V4SalesGrowth**, desde o momento do cadastro até a execução de um plano de ação com o Copiloto de IA. Cada etapa foi pensada para ser consultiva, inteligente e gerar resultados reais para times comerciais.

---

## 🧭 VISÃO GERAL DA JORNADA

```
Cadastro/Login
     ↓
Diagnóstico com Auditor
     ↓
Geração de Relatório Estratégico (com SWOT)
     ↓
Acesso ao Sales Copilot (plano de ação prático)
     ↓
Execução do Plano de Ação (etapa por etapa)
     ↓
Análise de Evolução e Sugestão de Reauditoria
     ↓
Ciclo contínuo de Melhoria Comercial
```

---

## 👤 01 — CADASTRO E LOGIN

- Rota: `/login`
- O usuário entra com e-mail e senha
- Sem confirmação de e-mail necessária
- Usuário inicia com **0 créditos**
- É imediatamente redirecionado para `/sales-copilot` com UI de boas-vindas
- Instrução visual clara para “Comece pelo Diagnóstico”

---

## 🔍 02 — DIAGNÓSTICO COM AUDITOR

- Rota: `/diagnostico`
- Agente especialista em Diagnóstico Comercial
- Dividido em **6 Blocos temáticos**:
  1. Perfil e Estrutura
  2. Funil e Processo Comercial
  3. Tráfego e Atração
  4. Engajamento e Conversão
  5. Retenção e Pós-venda
  6. Ferramentas, CRM e Time

- Cada bloco:
  - Exibe 3-5 perguntas (formato Typeform UX)
  - Gera **um mini-relatório de bloco** com notas e insights

---

## 📊 03 — RELATÓRIO FINAL E SWOT

- Ao final do diagnóstico:
  - O sistema compila todas respostas
  - Envia ao GPT-4o para gerar:
    - Diagnóstico final
    - Análise SWOT
    - Score por pilar
    - Plano de ação (curto, médio, longo prazo)

- Este relatório:
  - Fica salvo em `/relatorios`
  - Serve de base para o Copiloto

---

## 🤖 04 — SALESCOPILOT (EXECUÇÃO GUIADA)

- Rota: `/sales-copilot`
- Interface de “execução estratégica com IA”
- Estrutura em 3 colunas:
  1. **Resumo do plano de ação**
  2. **Checklists por fase**
  3. **Chat com o agente executor**

- O SalesCopilot:
  - Garante contexto total do relatório
  - Explica cada tarefa
  - Dá dicas para implementar
  - Motiva e interage com o usuário

---

## 📈 05 — EVOLUÇÃO E MEMÓRIA INTELIGENTE

- Cada interação com o Copiloto é registrada:
  - Tabela: `agent_history`
  - Tabela: `copilot_sessions`

- O agente é capaz de:
  - Retomar tarefas em aberto
  - Criar histórico de execução
  - Recomendar quando é hora de reauditar
  - Exportar progresso

---

## 🔁 06 — REAUDITORIA (RESTART ESTRATÉGICO)

- Se passaram X dias ou Y tarefas:
  - O sistema sugere reauditoria
  - Usuário pode reiniciar o ciclo com um novo diagnóstico
  - Relatórios antigos são versionados (`is_latest = false`)

---

## 🛠️ 07 — ÁREAS DE SUPORTE E MELHORIA

- O usuário terá acesso a:
  - Painel de créditos (saldo + botão de compra)
  - Histórico de relatórios
  - Sessões do Copiloto anteriores
  - Exportar relatórios (PDF)
  - Simulador de ROI futuro (em `/analytics`)

---

## 🎯 OBJETIVO DA JORNADA

> Ajudar o usuário a identificar **seus gargalos comerciais**, **receber um plano de ação**, e **executá-lo com ajuda do agente IA**, evoluindo de forma contínua e mensurável.

---

## ✅ CHECKLIST FINAL DA JORNADA

| Etapa                    | Status |
|--------------------------|--------|
| Cadastro/Login fluído    | [ ]    |
| Diagnóstico guiado       | [ ]    |
| Relatório gerado         | [ ]    |
| Copiloto em funcionamento| [ ]    |
| Execução com histórico   | [ ]    |
| Exportação de PDF        | [ ]    |
| Reauditoria programada   | [ ]    |
| Compra de créditos       | [ ]    |

---

Esta jornada é o coração da plataforma. O usuário deve se sentir **guiado, acompanhado e evoluindo o tempo todo.**
