
# 📤 BLOCO 19 — ESTRATÉGIA DE EXPORTAÇÕES, PDF, JSON E HISTÓRICO

Este bloco define a lógica completa de **exportação de relatórios, planos de ação e histórico de interações com IA** da plataforma V4SalesGrowth — com foco em rastreabilidade, segurança, padronização e valor consultivo tangível ao usuário.

---

## 📦 01 — CONTEÚDOS EXPORTÁVEIS

| Tipo                    | Formato | Descrição                                                       |
|-------------------------|---------|------------------------------------------------------------------|
| Relatório Final         | PDF     | Diagnóstico estratégico + análise SWOT + plano de ação completo |
| Relatório JSON          | JSON    | Dados estruturados para uso técnico ou integração externa       |
| Histórico de Conversa   | JSON    | Sessão de chat com IA, pergunta + resposta                      |
| Plano de Ação Detalhado | PDF     | Curto / Médio / Longo prazo em formato de checklist             |

---

## 🧱 02 — ESTRUTURA DE PASTAS DE EXPORTAÇÃO (NO BACKEND)

```
/lib/export/
├── generateReportPDF.ts         → Cria o relatório em PDF com layout visual
├── generateReportJSON.ts        → Gera JSON estruturado do relatório
├── exportConversationJSON.ts    → Exporta histórico do Copilot
├── utils/pdfHelpers.ts          → Funções de layout (logos, fontes, seções)
```

---

## 🖨️ 03 — RELATÓRIO PDF

- Gerado com biblioteca como `pdf-lib` ou `puppeteer` (caso render HTML)
- Possui:
  - Capa com logo
  - Nome da empresa
  - Data do relatório
  - Blocos respondidos
  - Diagnóstico final (score)
  - Plano de ação (tabelado)
  - Análise SWOT visual
- Assinatura final: “Gerado por Sales Copilot – V4SalesGrowth”

---

## 🔗 04 — RELATÓRIO JSON

Formato:

```json
{
  "user_id": "uuid",
  "relatorio_id": "uuid",
  "score_final": 84,
  "swot": {
    "strengths": ["..."],
    "weaknesses": ["..."]
  },
  "plano_acao": {
    "curto_prazo": [...],
    "medio_prazo": [...],
    "longo_prazo": [...]
  },
  "created_at": "2025-07-28T00:00:00"
}
```

---

## 💬 05 — HISTÓRICO DE CONVERSA (JSON)

Exporta:

- Mensagens do usuário
- Respostas do agente
- Tokens gastos
- Snapshot de contexto
- Timestamp

Usado para:
- Auditoria interna
- Continuidade em outros sistemas
- Treinamento supervisionado do agente

---

## 🎯 06 — LÓGICA DE ACIONAMENTO

| Acionador                    | Resultado                                          |
|-----------------------------|----------------------------------------------------|
| Após gerar relatório        | PDF e JSON disponíveis para download               |
| Ao clicar em “Exportar”     | Exporta versão mais recente                        |
| Na sessão do Copilot        | Botão: “Baixar histórico”                          |
| Via API interna             | `/api/export/report/pdf?id=123`                   |

---

## 🔐 07 — CONTROLE DE ACESSO E SEGURANÇA

- Apenas o `owner` do relatório pode exportar
- Admin pode exportar qualquer relatório
- Logs de exportação salvos na tabela `event_logs` com tipo `export_report`
- Downloads limitados por tempo (validade de link)

---

## 🧮 08 — CUSTO DE EXPORTAÇÃO

- Cada exportação de relatório **consome 1 crédito**
- Exportação de histórico JSON **é gratuita**
- Exportação em massa (admin) é limitada a 10 por vez

---

## 🧩 09 — USO ADMINISTRATIVO

Admin tem acesso a:

- Painel de todos os relatórios
- Botão de exportação em lote
- Exportação por usuário ou por período
- Integração com BigQuery (futuro)

---

## ✅ 10 — CHECKLIST FINAL

| Item                                     | Status |
|------------------------------------------|--------|
| Geração de PDF com layout visual         | ✅     |
| JSON de relatório completo               | ✅     |
| Exportação de histórico de IA            | ✅     |
| Links de download com segurança          | ✅     |
| Custo de créditos implementado           | ✅     |
| Logs de exportação salvos                | ✅     |
| Permissões por usuário / admin           | ✅     |

---

> Este bloco garante que todo **o valor entregue pela IA se transforme em ativo tangível**, exportável e reaproveitável — com controle, segurança e padrão.

É a **ponte entre inteligência e execução.**
