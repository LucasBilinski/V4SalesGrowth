
# 🧠 BLOCO 02 — SISTEMA DE CRÉDITOS E PAGAMENTO POR USO (PAY-PER-KNOW)

Este documento define **exatamente** como o sistema de créditos funcionará na plataforma **V4SalesGrowth**. Ele deverá ser implementado de forma **automatizada, segura e transparente**, e será o **único meio de uso da inteligência artificial na plataforma**.

---

## 💡 VISÃO GERAL DO MODELO

- O sistema funciona no modelo **Pay Per Know**.
- Usuários **não ganham créditos gratuitos** ao se cadastrar.
- O acesso às funcionalidades depende **exclusivamente do saldo de créditos**.
- Cada **interação com o sistema consome créditos** com base na quantidade de tokens utilizados (entrada + saída).
- O usuário pode **recarregar seu saldo** via Stripe.

---

## 🏛️ ENTIDADES DO BANCO DE DADOS (SUPABASE)

### 🧾 `credits`
Tabela que armazena o saldo atual de cada usuário.

| Campo        | Tipo      | Descrição                     |
|--------------|-----------|-------------------------------|
| id           | UUID      | ID da linha                   |
| user_id      | UUID      | Referência ao auth.users      |
| balance      | INT       | Saldo de créditos             |
| last_updated | TIMESTAMP | Atualização mais recente      |

---

### 💰 `credit_topups`
Tabela que registra todas as transações de recarga (via Stripe).

| Campo        | Tipo    | Descrição                          |
|--------------|---------|-------------------------------------|
| id           | UUID    | ID da recarga                      |
| user_id      | UUID    | Usuário                            |
| amount       | INT     | Quantidade de créditos adicionados |
| source       | TEXT    | Fonte ("stripe")                   |
| payment_id   | TEXT    | ID da transação Stripe             |
| status       | TEXT    | 'completed', 'failed', etc.        |
| created_at   | TIMESTAMP | Data da transação                |

---

### 🔄 Funções (RPCs)
1. `increment_credit_balance(p_user_id UUID, p_amount INT)`  
   → Adiciona saldo ao usuário

2. `deduct_user_credits(p_user_id UUID, p_amount INT)`  
   → Deduz saldo com verificação de saldo suficiente

---

## ⚙️ COMPORTAMENTO DO SISTEMA

### 🔐 RESTRIÇÃO ABSOLUTA:
- Qualquer ação que utilize IA (diagnóstico, chat, análise) **deve ser bloqueada se o saldo for 0**.

### 💬 EXEMPLO:
Ao tentar iniciar um chat com IA:
```ts
if (user.credits < custoDaMensagem) {
  return "Você não possui créditos suficientes. Clique aqui para recarregar.";
}
```

---

## 🧾 LÓGICA DE DEDUÇÃO DE CRÉDITOS

Cada interação deve considerar:

- Número de tokens de entrada (`input`)
- Número de tokens de saída (`output`)
- Custo por mil tokens

### 💰 Conversão de tokens para crédito:

| Tipo        | Tokens     | Custo em créditos |
|-------------|------------|-------------------|
| 1000 tokens | ≈ 1000     | 1 crédito         |

> **Nota:** A cada 1000 tokens totais consumidos, o sistema deduz 1 crédito.
> Se for <1000, pode usar `Math.ceil((input + output) / 1000)`.

---

## 💳 INTEGRAÇÃO COM STRIPE

### Planos e preços (exemplo):

| Produto | Preço em R$ | Créditos |
|---------|-------------|----------|
| Starter | R$ 39,90     | 40       |
| Growth  | R$ 97,00     | 100      |
| Pro     | R$ 197,00    | 220      |
| Ultra   | R$ 297,00    | 300      |

> O usuário compra, e ao final da transação (webhook), os créditos são adicionados via `increment_credit_balance()`.

---

## ✅ REGRAS DO SISTEMA

1. O saldo de créditos **deve ser carregado ao fazer login e exibido no topo do dashboard**
2. Todas as **requisições ao agente** devem **deduzir créditos automaticamente**
3. Sem saldo, o sistema **não pode gerar nenhuma resposta**
4. A IA deve responder de forma empática quando os créditos forem insuficientes
5. O usuário pode consultar seu histórico de uso e recargas
6. Toda transação deve gerar um evento em `event_logs`

---

## 🔄 BOAS PRÁTICAS

- Sempre registrar a dedução com um `try/catch`
- Logar eventos de sucesso e falha
- Nunca executar IA se `deduct_user_credits` retornar `NULL`
- Responder ao usuário em português

---

## 📌 CHECKLIST DE IMPLEMENTAÇÃO

- [ ] Criar tabelas `credits`, `credit_topups`
- [ ] Criar funções `increment_credit_balance`, `deduct_user_credits`
- [ ] Criar integração completa com Stripe + Webhook
- [ ] Criar action `getUserCredits()`
- [ ] Bloquear uso de IA se saldo for zero
- [ ] Atualizar dashboard para exibir créditos
- [ ] Adicionar botão de "Recarregar Créditos"
- [ ] Implementar dedução por token (input + output)
