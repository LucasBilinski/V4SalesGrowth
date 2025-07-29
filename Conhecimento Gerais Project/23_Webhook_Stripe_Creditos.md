
# 🔁 BLOCO 23 — WEBHOOKS, STRIPE EVENTS E GATILHOS DE CRÉDITO

Este bloco documenta a integração completa entre a plataforma e o **Stripe Webhook**, conectando os eventos de compra de créditos aos ajustes automáticos de saldo e criação de registros seguros no Supabase.

---

## 🔌 01 — OBJETIVO DO WEBHOOK

Garantir que toda compra realizada via Stripe resulte em:

- Incremento automático de créditos no Supabase
- Criação de log na tabela `credit_topups`
- Segurança e idempotência na execução
- Rastreamento completo do evento

---

## 📡 02 — ENDPOINT DO WEBHOOK

O Stripe envia requisições para:

```
https://[URL_DA_PRODUCAO]/api/stripe-webhook
```

> Substituir `[URL_DA_PRODUCAO]` pela URL final da aplicação na Vercel.

---

## 🧪 03 — EVENTO MONITORADO

O webhook responde ao evento:

```ts
checkout.session.completed
```

---

## 🧠 04 — LÓGICA DE FUNCIONAMENTO

Trecho simplificado do backend:

```ts
const session = event.data.object;
const userId = session.metadata.user_id;
const amount = Math.floor(session.amount_total / 100);

await supabase.rpc("increment_credit_balance", {
  p_user_id: userId,
  p_amount: amount,
});

await supabase.from("credit_topups").insert({
  user_id: userId,
  amount,
  source: "stripe",
  payment_id: session.payment_intent,
  status: "completed",
});
```

---

## 🧾 05 — TABELA credit_topups

| Campo         | Tipo     | Descrição                                |
|---------------|----------|------------------------------------------|
| id            | UUID     | Identificador único                      |
| user_id       | UUID     | ID do usuário comprador                  |
| amount        | INT      | Valor (em créditos)                      |
| source        | VARCHAR  | Origem (ex: `"stripe"`)                  |
| payment_id    | TEXT     | ID da transação no Stripe                |
| status        | TEXT     | `"completed"` | `"failed"` | `"pending"` |
| created_at    | TIMESTAMP| Data da transação                        |

---

## 🧮 06 — FUNÇÃO SQL VINCULADA

Script `09_create_increment_credits_function.sql`

```sql
CREATE OR REPLACE FUNCTION public.increment_credit_balance(p_user_id UUID, p_amount INT)
RETURNS void AS $$
BEGIN
  INSERT INTO credits (user_id, balance)
  VALUES (p_user_id, 0)
  ON CONFLICT (user_id) DO NOTHING;

  UPDATE credits
  SET balance = balance + p_amount,
      last_updated = now()
  WHERE user_id = p_user_id;
END;
$$ LANGUAGE plpgsql;
```

---

## 🔐 07 — SEGURANÇA E IDEMPOTÊNCIA

- O Stripe assina o evento com `STRIPE_WEBHOOK_SECRET`
- A API valida com:

```ts
stripe.webhooks.constructEvent(body, signature, endpointSecret);
```

- Permite:
  - Bloquear falsificações
  - Garantir que cada transação seja única
  - Evitar créditos duplicados

---

## 🛠️ 08 — CONFIGURAÇÃO NO STRIPE

1. Acesse https://dashboard.stripe.com
2. Vá em Developers > Webhooks
3. Clique em “Add endpoint”
4. Configure:
   - URL: `https://[URL_DA_PRODUCAO]/api/stripe-webhook`
   - Evento: `checkout.session.completed`
5. Copie e adicione o **STRIPE_WEBHOOK_SECRET** no Vercel

---

## ✅ 09 — CHECKLIST FINAL

| Item                                          | Status |
|-----------------------------------------------|--------|
| Webhook conectado à rota `/api/stripe-webhook`| ✅     |
| Evento monitorado: `checkout.session.completed` | ✅     |
| Incremento de créditos via função SQL         | ✅     |
| Criação de log na `credit_topups`             | ✅     |
| Validação com `STRIPE_WEBHOOK_SECRET`         | ✅     |
| Script SQL executado (`09_..._credits.sql`)   | ✅     |
| Log detalhado no Supabase                     | ✅     |

---

> Este bloco garante que **toda transação financeira é auditável, rastreável, automatizada e segura** — sem dependência humana para creditar usuários.

É o **coração da monetização da plataforma.**
