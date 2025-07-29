
# 💳 BLOCO 18 — LÓGICA DE CRÉDITOS, COBRANÇA POR TOKEN E CONTROLE DE CONSUMO

Este bloco define a **arquitetura completa de monetização e uso de créditos da V4SalesGrowth**, baseada em **modelo pay-per-know (créditos por token consumido)** com lógica de cobrança inteligente, dedução segura e segurança antifraude.

---

## 💡 01 — CONCEITO CENTRAL

- Cada ação que envolve IA consome **tokens**
- Tokens são cobrados do saldo do usuário
- A unidade de cobrança são **créditos**, onde 1 crédito = até 1000 tokens (input + output)
- O agente calcula a quantidade exata de tokens usados e deduz os créditos proporcionalmente

---

## 📏 02 — ESTRATÉGIA DE PRECIFICAÇÃO

| Modelo       | Valor médio de entrada         | Token médio (por requisição) |
|--------------|-------------------------------|------------------------------|
| Diagnóstico  | 1.200 - 2.000 tokens por bloco | ~7 créditos por diagnóstico  |
| Copilot Chat | 80 - 200 tokens por msg        | ~0.2 a 0.5 créditos           |
| Reauditoria  | 2.000 tokens                   | ~2 créditos                  |
| DeepResearch | 4.000 tokens                   | ~4 créditos                  |

---

## 🧠 03 — CÁLCULO DE CRÉDITOS POR TOKENS

```ts
// tokensUsados = input + output
const tokensUsados = usage.prompt_tokens + usage.completion_tokens;

const creditCost = Math.ceil(tokensUsados / 1000); // Arredondado para cima
```

---

## 🧾 04 — EXEMPLO PRÁTICO

- Usuário envia mensagem longa no Copilot
- IA gera resposta com 1300 tokens no total
- Resultado: `1300 / 1000 = 1.3 → arredonda para 2 créditos`
- Dedução acontece antes de enviar a resposta

---

## 🔁 05 — FLUXO COMPLETO DE COBRANÇA

1. Usuário envia mensagem para IA
2. Função `deductCredits()` roda
3. Se tiver saldo:
   - IA executa
   - Crédito é deduzido
   - Histórico é salvo
4. Se não tiver saldo:
   - Chat bloqueia envio
   - Prompt: “Você precisa recarregar créditos”

---

## 🧪 06 — FUNÇÕES E LÓGICAS NO BACKEND

| Função                 | Descrição                                    |
|------------------------|-----------------------------------------------|
| `deduct_user_credits`  | SQL — Dedução atômica com `FOR UPDATE`        |
| `increment_credit_balance` | SQL — Incremento por Stripe / Admin     |
| `calculateCreditCost()`| Backend — Cálculo baseado em usage OpenAI     |
| `logTopUp()`           | Registra toda transação de recarga            |

---

## 🧾 07 — HISTÓRICO DE TRANSAÇÕES

Tabela: `credit_topups`

| Campo         | Tipo     | Descrição                                |
|---------------|----------|-------------------------------------------|
| user_id       | UUID     | Identificador do usuário                  |
| amount        | INT      | Quantidade de créditos recarregados       |
| source        | TEXT     | Stripe, Admin, Manual                     |
| payment_id    | TEXT     | ID da Stripe                              |
| status        | TEXT     | completed, failed                         |

---

## 💥 08 — MECANISMOS DE BLOQUEIO

- Toda rota de IA checa saldo antes
- Sem saldo → resposta negada com aviso
- Rota de crédito integrada ao Stripe
- Toast e redirect automático para `/comprar-creditos`

---

## 💰 09 — OPÇÕES DE PACOTES NO STRIPE

| Plano   | Créditos | Preço     | Preço por crédito |
|---------|----------|-----------|--------------------|
| Start   | 100      | R$ 39,70  | R$ 0,397           |
| Growth  | 300      | R$ 99,70  | R$ 0,332           |
| Pro     | 800      | R$ 199,70 | R$ 0,249           |
| Master  | 2.000    | R$ 397,00 | R$ 0,198           |

- Stripe checkout com `price_id` já configurado no backend
- Webhook: atualiza saldo e status da transação

---

## 📉 10 — ESTATÍSTICAS DE USO E CONTROLE

Tabela: `usage_stats`

| Campo                  | Tipo | Finalidade                                  |
|------------------------|------|----------------------------------------------|
| total_blocks_completed | INT  | Quantidade de blocos finalizados            |
| total_reports          | INT  | Quantidade de relatórios gerados            |
| credits_consumed       | INT  | Créditos gastos                              |
| last_active_at         | TIMESTAMP | Último uso                             |

---

## ✅ CHECKLIST DE MONETIZAÇÃO

| Item                                  | Status |
|---------------------------------------|--------|
| Dedução segura com rollback           | ✅     |
| Arredondamento por 1000 tokens        | ✅     |
| Créditos por chat e por bloco         | ✅     |
| Histórico de consumo                  | ✅     |
| Recarregamento integrado ao Stripe    | ✅     |
| Funções SQL robustas com RLS          | ✅     |

---

> Esse bloco assegura que o modelo **pay-per-know** funcione com lógica real de uso, margem saudável e rastreabilidade completa — com engenharia de monetização segura e escalável.

É o **motor financeiro da plataforma.**
