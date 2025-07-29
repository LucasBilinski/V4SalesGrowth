
# 💳 BLOCO 07 — SISTEMA DE CRÉDITOS E CONSUMO POR TOKENS

Este documento detalha o funcionamento do sistema de créditos Pay-per-Know, incluindo precificação, lógica de consumo por tokens, dedução automática e políticas de acesso.

---

## 🎯 VISÃO GERAL

- O sistema da V4SalesGrowth é baseado em consumo por **créditos**.
- Cada interação com o agente consome créditos proporcionais à quantidade de tokens utilizados.
- Os usuários precisam **recarregar créditos** para continuar usando a plataforma.

---

## 📐 UNIDADE DE MEDIDA

- 1 crédito = 1000 tokens (input + output somados)
- Exemplo:
  - Pergunta: 250 tokens
  - Resposta: 750 tokens
  - Total: 1000 tokens → 1 crédito deduzido

---

## 💰 PRECIFICAÇÃO DOS PACOTES

| Plano   | Créditos | Preço (BRL) | Preço por crédito |
|---------|----------|-------------|--------------------|
| Start   | 100      | R$ 37,00    | R$ 0,37            |
| Growth  | 300      | R$ 97,00    | R$ 0,32            |
| Pro     | 1000     | R$ 297,00   | R$ 0,29            |
| Master  | 3000     | R$ 697,00   | R$ 0,23            |

> Todos planos são de compra única (one-time). Não há renovação automática.

---

## 🧠 LÓGICA DE DEDUÇÃO DE CRÉDITOS

1. Usuário envia mensagem no chat do agente
2. A aplicação:
   - Recupera o contexto do histórico
   - Gera o prompt completo
   - Calcula o número estimado de tokens input + output
3. A função `deduct_user_credits` é chamada com:
   - `user_id`
   - `tokens / 1000` arredondado para cima (ceil)
4. Se o saldo for suficiente:
   - A requisição para IA é executada
   - O resultado é salvo no `agent_history`
5. Se saldo for insuficiente:
   - A mensagem de aviso é mostrada: "Você precisa recarregar seus créditos para continuar."

---

## 📂 ESTRUTURA DE CÓDIGO RELACIONADA

| Arquivo                                      | Função                                      |
|---------------------------------------------|---------------------------------------------|
| `/lib/utils/tokenUsage.ts`                  | Estima tokens input/output com tokenizer    |
| `/lib/supabase/functions.ts`                | Wrapper de chamadas RPC                     |
| `/lib/llm/openai.ts`                        | Integração com OpenAI e função de dedução   |
| `/lib/credits/check.ts`                     | Verifica saldo antes de cada chamada        |
| `/lib/credits/addTopup.ts`                  | Registra recarga manual ou via Stripe       |
| `/lib/credits/useCredits.ts`                | Hook de controle de consumo                 |

---

## 📊 REGISTROS E CONTROLE

### Tabela `credits`

- Guarda o saldo atual do usuário
- Atualiza `last_updated` em cada alteração

### Tabela `credit_topups`

- Registra cada recarga (via Stripe ou Admin)
- Campos: `amount`, `source`, `payment_id`, `status`

### Tabela `usage_stats`

- Total de créditos consumidos por usuário
- Total de blocos completados
- Atualizado automaticamente

---

## 🛠️ FUNÇÕES CRÍTICAS (RPC Supabase)

### `deduct_user_credits`

- Trava a linha do usuário com `FOR UPDATE`
- Impede uso negativo
- Atualiza o saldo

### `increment_credit_balance`

- Usado no webhook do Stripe
- Adiciona créditos ao saldo e registra em `credit_topups`

---

## 🚨 RESTRIÇÕES DE USO

- ⚠️ Se o saldo = 0 → o agente não executa nenhuma ação
- ⚠️ O botão "Executar" ou "Enviar" deve ser desabilitado quando o saldo for insuficiente
- ⚠️ O sistema deve mostrar alerta e botão de "Comprar Créditos"

---

## 🧪 TESTES RECOMENDADOS

| Ação                          | Esperado                                         |
|------------------------------|--------------------------------------------------|
| Saldo = 0                    | Mensagem de aviso + bloqueio do agente           |
| Saldo insuficiente (parcial)| Mensagem avisando tokens excedem o saldo atual   |
| Compra via Stripe            | Créditos adicionados corretamente                |
| Chat IA                      | Deduz corretamente os créditos por token         |
| Dashboard                    | Exibe créditos atualizados em tempo real         |

---

Este sistema garante que a plataforma seja financeiramente escalável, controlada e justa para o usuário — pagando somente pelo uso.
