
# 🔁 BLOCO 12 — REAUDITORIA, CICLO CONTÍNUO E EVOLUÇÃO GUIADA

Este documento define a **lógica inteligente de reauditoria** e o mecanismo de **evolução contínua da performance comercial do usuário** dentro da plataforma V4SalesGrowth.

---

## 🎯 OBJETIVO PRINCIPAL

- Promover a melhoria constante da operação comercial do usuário
- Identificar novas lacunas com base no uso real da plataforma
- Estimular o recomeço da auditoria sempre que necessário
- Atuar como um **sistema de consultoria evolutiva com IA**

---

## 🧠 01 — CONCEITO DE REAUDITORIA

A reauditoria é um processo de reinício cíclico do diagnóstico quando:

1. O usuário já executou parte ou todo o plano anterior
2. Seu cenário mudou (equipe, ferramentas, funil, etc)
3. O agente IA identificou novos padrões, falhas ou evolução

---

## 🔄 02 — COMO ACONTECE A REAUDITORIA

### 💡 A reauditoria pode ser:

| Tipo                | Disparador                        |
|---------------------|-----------------------------------|
| Proativa (pelo sistema) | Detecta sinais em `usage_stats` ou `copilot_sessions` |
| Reativa (usuário)   | Usuário clica em “Reauditar”      |
| Forçada             | Quando uma atualização estrutural exige novo diagnóstico |

---

## 🔍 03 — SINAIS QUE DISPARAM REAUDITORIA

O sistema executa checagens periódicas com base em:

### a) `usage_stats`:

- Passaram mais de **X dias** desde o último diagnóstico
- Houve uso do Copiloto em **N tarefas** sem revalidação

### b) `agent_history`:

- O usuário está frequentemente pedindo ajuda em tópicos já diagnosticados
- Reincidência em dores já abordadas

### c) `relatorios`:

- Relatórios antigos com `is_latest = false` superam 90 dias

---

## 📣 04 — AÇÕES DO SISTEMA

Quando detectada a necessidade de reauditoria, o sistema:

1. Exibe banner em `/sales-copilot`:
   > “Percebemos que seu cenário pode ter mudado. Deseja refazer seu diagnóstico estratégico?”

2. Oferece botão: **“Iniciar Nova Auditoria”**

3. Caso aceito:
   - Cria nova entrada em `diagnostics`
   - Gera novo `relatorio`
   - Marca o anterior com `is_latest = false`

---

## 🧠 05 — BENEFÍCIOS DA REAUDITORIA

- Mantém o plano de ação sempre relevante
- Atualiza a memória do agente IA
- Permite evolução do score da empresa
- Recalibra a estratégia de execução

---

## 🔧 06 — COMO É IMPLEMENTADA

### a) Tabela `relatorios`:

- Coluna `version` (int)
- Coluna `is_latest` (bool)

### b) Função `shouldTriggerReaudit()`:

- Verifica se critérios estão preenchidos
- Retorna booleano

### c) Frontend `/sales-copilot`:

- Se função retornar `true`, exibe sugestão
- Botão de nova auditoria aciona flow completo

---

## 📁 07 — HISTÓRICO DE AUDITORIAS

- O usuário pode acessar relatórios antigos
- Pode comparar versões anteriores com a atual
- Gera valor de inteligência contínua e percepção de evolução

---

## 🧭 08 — EVOLUÇÃO COMO UM CICLO

```
Diagnóstico Inicial
   ↓
Plano de Ação com IA
   ↓
Execução Guiada
   ↓
Análise de Resultados
   ↓
Nova Auditoria
   ↓
Versão 2.0 do Plano
   ↓
[Repete]
```

---

## ✅ CHECKLIST DE REAUDITORIA

| Item                                        | Status |
|---------------------------------------------|--------|
| Função `shouldTriggerReaudit` criada        | ✅     |
| Lógica de X dias ou tarefas implementada    | ✅     |
| `is_latest` funcionando corretamente         | ✅     |
| UI de sugestão implementada                 | ✅     |
| Histórico de relatórios visível             | ✅     |

---

> O sistema de reauditoria torna a plataforma **viva e estratégica**, sempre adaptando o plano de ação à realidade do usuário.

Ele garante que **nenhum diagnóstico fique obsoleto** e que o agente IA **evolua junto com a empresa**.
