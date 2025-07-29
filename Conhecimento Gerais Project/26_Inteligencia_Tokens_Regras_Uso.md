
# 🧠 BLOCO 26 — INTELIGÊNCIA DE TOKENS, ESTIMATIVAS E REGRAS DE USO

Este bloco define a estratégia de controle de consumo de IA com base em **tokens**, central para o modelo Pay-per-Know. Ele prevê regras de cobrança, limites, avisos e gerenciamento de créditos baseado em uso real.

---

## 🎯 01 — OBJETIVO

- Garantir **controle de custo por usuário**
- Operar com lógica de **consumo por token (input + output)**
- **Deduzir créditos** com base no uso
- Prevenir abusos e garantir escalabilidade
- Possibilitar que o usuário entenda seu consumo e planeje

---

## 🧮 02 — TOKENIZAÇÃO (OPENAI E LLMs)

Toda mensagem enviada ou recebida é convertida em **tokens**:

- Token ≠ palavra
- 1 token ≈ 0.75 palavras (média)
- Exemplo:
  - Pergunta: 15 tokens
  - Resposta: 250 tokens
  - Total da interação: 265 tokens

---

## 🔢 03 — CONVERSÃO: TOKENS PARA CRÉDITOS

| Faixa de tokens | Custo estimado | Créditos deduzidos |
|-----------------|----------------|---------------------|
| 0–500           | R$ 0,01–0,02   | 1 crédito           |
| 501–1000        | R$ 0,02–0,04   | 2 créditos          |
| 1001–2000       | R$ 0,05–0,08   | 3 créditos          |
| > 2000          | R$ 0,10+       | 5 créditos          |

> A lógica de dedução é baseada em faixas com arredondamento por cima.

---

## 📐 04 — CÁLCULO DOS TOKENS (CÓDIGO)

```ts
import GPTTokenizer from "gpt-tokenizer";

function calcularTokens(mensagem: string): number {
  const encoder = new GPTTokenizer("gpt-4");
  return encoder.encode(mensagem).length;
}
```

---

## ⚖️ 05 — REGRA DE COBRANÇA

- Deduzir os tokens de `input + output` de cada interação
- Converter tokens em créditos com base na tabela de faixas
- Se o usuário **não tiver saldo**, bloquear nova interação
- Exibir um aviso: “Você precisa recarregar créditos para continuar”

---

## 🔔 06 — ALERTAS AUTOMÁTICOS

- 🔴 Quando créditos = 0 → Bloquear imediatamente
- 🟡 Quando créditos ≤ 10 → Toast: “Seus créditos estão acabando”
- ✅ Quando crédito recarregado → Toast de confirmação
- 📧 (Opcional): Email automático quando zerar

---

## 💳 07 — BACKEND DE DEDUÇÃO

Função SQL:

```sql
CREATE OR REPLACE FUNCTION deduct_user_credits(p_user_id UUID, p_amount INT)
RETURNS INT AS $$
DECLARE
  current_balance INT;
  new_balance INT;
BEGIN
  SELECT balance INTO current_balance
  FROM credits WHERE user_id = p_user_id
  FOR UPDATE;

  IF NOT FOUND OR current_balance < p_amount THEN
    RETURN NULL;
  END IF;

  new_balance := current_balance - p_amount;

  UPDATE credits
  SET balance = new_balance, last_updated = now()
  WHERE user_id = p_user_id;

  RETURN new_balance;
END;
$$ LANGUAGE plpgsql;
```

---

## 📊 08 — REGISTRO DE USO

Tabela: `usage_stats`

| Campo              | Tipo    | Descrição                          |
|--------------------|---------|------------------------------------|
| total_blocks_completed | INT | Blocos do diagnóstico              |
| total_reports      | INT     | Relatórios finalizados             |
| total_copilot_sessions | INT | Sessões do copiloto                |
| credits_consumed   | INT     | Total de créditos usados           |
| last_active_at     | TIMESTAMP | Último uso da plataforma        |

---

## ✅ 09 — CHECKLIST FINAL

| Item                                       | Status |
|--------------------------------------------|--------|
| Tokenização funcionando                    | ✅     |
| Dedução com base no uso                    | ✅     |
| Faixas de conversão definidas              | ✅     |
| Função SQL `deduct_user_credits` aplicada  | ✅     |
| Alerta de crédito baixo                    | ✅     |
| Integração com Stripe para recarga         | ✅     |
| Registro de uso na `usage_stats`           | ✅     |

---

> Este bloco garante que **cada usuário pague exatamente pelo que consome**, mantendo o modelo Pay-per-Know escalável, controlado e transparente.

É o **motor financeiro e estratégico do projeto.**
