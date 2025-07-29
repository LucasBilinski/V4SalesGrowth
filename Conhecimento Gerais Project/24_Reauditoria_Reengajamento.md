
# ♻️ BLOCO 24 — REAUDITORIA INTELIGENTE E REENGAJAMENTO ESTRATÉGICO

Este bloco define o sistema de reauditoria e reengajamento do usuário com base na inteligência do agente, eventos de comportamento, tempo de inatividade ou conclusão de planos anteriores.

---

## 🎯 01 — OBJETIVO

Permitir que a plataforma:

- Identifique **quando é hora de rodar uma nova auditoria**
- Acione o usuário com **convites estratégicos**
- Reative usuários inativos com **personalização contextual**
- Gere **engajamento contínuo com base em evolução**

---

## 🔁 02 — LÓGICA DE REAUDITORIA AUTOMÁTICA

### Gatilhos automáticos:

- 🟨 Última auditoria feita há mais de X dias (ex: 30 dias)
- 🔴 Mudança brusca no uso ou queda nos indicadores (via `usage_stats`)
- ✅ Finalização completa de um plano de ação (via `copilot_sessions`)
- 📉 Detecção de inatividade

### Endpoint backend:

```ts
POST /api/reauditoria/check

// Valida o user_id e retorna:

{
  "shouldReaudit": true,
  "reason": "Última auditoria tem mais de 45 dias"
}
```

---

## 🧠 03 — MEMÓRIA DE CADA REAUDITORIA

Cada auditoria gera um:

- Snapshot completo da sessão anterior
- Comparativo entre versões do relatório
- Identificação de avanços / regressões
- Sugestão de áreas para foco no novo diagnóstico

---

## 📊 04 — CÁLCULO DE SCORE DE EVOLUÇÃO

Nova métrica: `evolution_score`

```ts
evolution_score = (planos_concluidos / total_planos) + (relatorios_atuais - relatorios_anteriores)
```

- Exibido no dashboard
- Usado para recomendar reauditorias
- Serve como argumento para o agente

---

## 🔔 05 — REENGAJAMENTO VIA NOTIFICAÇÃO

### Tipos de notificações:

- 📬 E-mail: “Seu plano está desatualizado. Faça uma nova auditoria.”
- 🔔 Toast interno: “Faz 60 dias desde sua última evolução. Deseja reauditar?”
- 📣 Mensagem automática do Sales Copilot

---

## 🧩 06 — FUNÇÃO SQL OPCIONAL (BACKEND SUPABASE)

```sql
CREATE OR REPLACE FUNCTION should_trigger_reaudit(p_user_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
  last_report TIMESTAMPTZ;
BEGIN
  SELECT MAX(created_at) INTO last_report
  FROM relatorios
  WHERE user_id = p_user_id;

  IF last_report IS NULL OR last_report < now() - INTERVAL '45 days' THEN
    RETURN TRUE;
  ELSE
    RETURN FALSE;
  END IF;
END;
$$ LANGUAGE plpgsql;
```

---

## 🛠️ 07 — INTEGRAÇÃO COM DASHBOARD

No painel `/dashboard`:

- Mostrar alerta se houver reauditoria pendente
- Botão: “Iniciar nova auditoria estratégica”
- Tooltip com o motivo

---

## 📂 08 — VERSIONAMENTO DE RELATÓRIOS

Ao rodar nova auditoria:

- `relatorios.version` é incrementado
- `is_latest = true` apenas no novo
- O antigo é mantido para histórico

---

## ✅ 09 — CHECKLIST FINAL

| Item                                           | Status |
|------------------------------------------------|--------|
| Gatilho automático por tempo                   | ✅     |
| Gatilho por mudança de comportamento           | ✅     |
| Notificação via toast/email/IA                 | ✅     |
| API: `/api/reauditoria/check`                  | ✅     |
| Comparação entre relatórios                    | ✅     |
| Versionamento preservado                       | ✅     |
| Evolução exibida no dashboard                  | ✅     |

---

> Este bloco garante que a **evolução do cliente seja contínua, estratégica e personalizada**, elevando o lifetime value e maximizando o retorno do usuário.

É o **motor de crescimento e reativação** da plataforma.
