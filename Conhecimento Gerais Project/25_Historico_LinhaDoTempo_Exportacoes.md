
# 📈 BLOCO 25 — HISTÓRICO DE EVOLUÇÃO, LINHA DO TEMPO E EXPORTAÇÃO DE RELATÓRIOS

Este bloco define toda a lógica de **histórico de relatórios, versionamento de auditorias, linha do tempo de progresso** e **exportações em PDF e JSON** — recursos fundamentais para tangibilizar o valor gerado ao cliente.

---

## 🎯 01 — OBJETIVO

- Armazenar todos os relatórios gerados pelo usuário
- Manter um histórico versionado
- Exibir visualmente a jornada de evolução
- Permitir que o usuário exporte documentos da auditoria para fins operacionais, consultivos ou gerenciais

---

## 📂 02 — ESTRUTURA DE BANCO DE DADOS

### Tabela: `relatorios`

| Campo           | Tipo        | Descrição                            |
|-----------------|-------------|----------------------------------------|
| id              | UUID        | ID único do relatório                  |
| user_id         | UUID        | Referência ao usuário                  |
| version         | INT         | Número da versão (incremental)         |
| is_latest       | BOOLEAN     | Define se é a versão mais recente      |
| created_at      | TIMESTAMP   | Data de criação                        |
| summary         | TEXT        | Sumário textual do diagnóstico         |
| swot            | JSONB       | Análise SWOT estruturada               |
| plan_curto      | TEXT        | Plano de ação curto prazo              |
| plan_medio      | TEXT        | Plano de ação médio prazo              |
| plan_longo      | TEXT        | Plano de ação longo prazo              |
| score_final     | INT         | Score consolidado final                |

---

## 🧠 03 — VERSIONAMENTO AUTOMÁTICO

- Toda vez que um novo relatório é gerado:
  - `version` é incrementado automaticamente
  - `is_latest = true`
  - O relatório anterior tem `is_latest = false`

- O versionamento é escopado por usuário (`user_id`)

---

## 📅 04 — LINHA DO TEMPO VISUAL

Na rota `/dashboard`:

- Exibe um **timeline horizontal** com cards por relatório
- Cada card mostra:
  - 📅 Data da auditoria
  - 🔢 Versão do relatório
  - 📊 Score final
  - ✅ Indicador de plano finalizado ou pendente

---

## 📤 05 — EXPORTAÇÃO DE RELATÓRIOS

### 📁 Formatos:

- PDF (para uso visual e reuniões)
- JSON (para uso técnico ou análises externas)

### ✨ Gatilhos:

- No card da timeline: botão “Exportar”
- No relatório em `/relatorio/[id]`: botão fixo superior

### 🔧 Backend:

Funções:

```ts
export async function exportReportAsPDF(reportId: string)
export async function exportReportAsJSON(reportId: string)
```

Ambas utilizam `relatorios` + `diagnostics` + `copilot_sessions` relacionados.

---

## 📜 06 — EXEMPLO DE EXPORTAÇÃO

### PDF:
- Capa com nome do projeto e versão
- Sumário executivo
- Matriz SWOT
- Planos de ação
- Gráfico de evolução (se houver dados comparativos)

### JSON:
```json
{
  "user_id": "abc123",
  "version": 3,
  "created_at": "2024-07-15T12:00:00Z",
  "summary": "Diagnóstico completo...",
  "score_final": 72,
  "swot": {...},
  "plan_curto": "...",
  "plan_medio": "...",
  "plan_longo": "..."
}
```

---

## 🛠️ 07 — CÓDIGO DE BACKEND (EXCERTO PDF)

```ts
import { jsPDF } from "jspdf";

export async function generatePDF(report: ReportType) {
  const doc = new jsPDF();
  doc.text("Relatório Estratégico", 10, 10);
  doc.text(`Versão: ${report.version}`, 10, 20);
  doc.text(`Sumário: ${report.summary}`, 10, 30);
  doc.save("relatorio.pdf");
}
```

---

## ✅ 08 — CHECKLIST FINAL

| Item                                     | Status |
|------------------------------------------|--------|
| Histórico de relatórios com versionamento | ✅     |
| Comparação entre versões                 | ✅     |
| Linha do tempo visual                    | ✅     |
| Exportação em PDF                        | ✅     |
| Exportação em JSON                       | ✅     |
| Gatilho de botão em UI                   | ✅     |
| Backend integrado                        | ✅     |

---

> Este bloco estrutura o **registro confiável e exportável do valor entregue**, além de reforçar a percepção de evolução e autoridade consultiva.

É o **espelho do progresso do cliente**.
