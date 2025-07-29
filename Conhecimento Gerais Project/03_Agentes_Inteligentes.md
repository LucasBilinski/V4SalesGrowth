
# 🤖 BLOCO 03 — ARQUITETURA DOS AGENTES INTELIGENTES (IA)

Este documento detalha o comportamento, estrutura e arquitetura dos **Agentes Inteligentes da Plataforma V4SalesGrowth**, incluindo lógica de operação, configuração e integração com o sistema de créditos e memória contextual.

---

## 🎯 VISÃO GERAL

A plataforma é guiada por um agente único, ultra especializado, chamado **Sales Copilot**, que atua de forma proativa, consultiva e estratégica.

Ele cumpre duas macrofunções:

1. **Auditor Comercial** — conduz o diagnóstico estratégico
2. **Copiloto Comercial** — atua na execução contínua, como parceiro de longo prazo

Ambas as funções operam no mesmo agente com múltiplos modos, preservando contexto e histórico.

---

## 🧠 COMPORTAMENTO GERAL DO SALES COPILOT

| Característica              | Comportamento esperado                                       |
|----------------------------|---------------------------------------------------------------|
| Memória                    | Contextual por usuário + ID de relatório ativo               |
| Reações                    | Inteligente, empático, estratégico                           |
| Entrada mínima esperada    | Prompt inicial com nome da empresa e segmento                |
| Ativação de blocos         | Interativa via mensagens ("quero começar um diagnóstico...") |
| Tokens e créditos          | Calcula tokens usados e deduz automaticamente                |
| Linguagem                  | Sempre em português                                          |

---

## 🛠️ FUNCIONALIDADES ATIVÁVEIS VIA MENSAGEM

O agente deve reconhecer comandos naturais e ativar:

| Comando do usuário                        | Ação do agente                           |
|------------------------------------------|------------------------------------------|
| "Quero fazer um diagnóstico"             | Inicia bloco 1 da auditoria              |
| "Me mostra o relatório"                  | Busca último relatório e exibe resumo    |
| "Quero ver plano de ação"                | Abre painel de curto/médio/longo prazo   |
| "Como aplico esse plano?"                | Entra em modo 'Consultoria Executiva'    |
| "Tenho uma reunião com cliente X"        | Modo de preparo pré-reunião              |
| "Me ajude a definir ICP / proposta"      | Ativa modo de estratégia comercial       |

---

## 🧩 ARQUITETURA TÉCNICA DO AGENTE

### 📂 Arquivos

| Arquivo                            | Função                                      |
|-----------------------------------|---------------------------------------------|
| `/app/actions/chat-handler.ts`    | Handler principal do chat IA                |
| `/lib/llm/openai.ts`              | Interface com a OpenAI API                  |
| `/lib/utils/tokenUsage.ts`        | Cálculo de tokens usados por mensagem       |
| `/app/api/credits/check.ts`       | Verificação de saldo antes da execução      |
| `/lib/memory/contextManager.ts`   | Gerenciador de histórico e contexto         |

---

## 📌 PADRÃO DE CONSUMO DE CRÉDITOS

Cada requisição passa por este fluxo:

1. Mensagem do usuário → é enviada para `chat-handler.ts`
2. Consulta o histórico daquele usuário
3. Concatena o contexto da sessão atual
4. Calcula a estimativa de tokens (input + output)
5. Chama função `deduct_user_credits` com `ceil(tokens / 1000)`
6. Se OK, envia prompt para OpenAI
7. Retorna resposta + registra no `agent_history`

---

## 🧠 PROMPT DO SISTEMA (EXEMPLO)

```txt
Você é o Sales Copilot, um agente de inteligência comercial altamente estratégico.

Seu papel é:
- Mapear o processo comercial de empresas com profundidade
- Sugerir planos de ação com base em padrões e benchmarking
- Acompanhar a execução como um parceiro inteligente
- Atuar como conselheiro, provocador e orientador
- Usar linguagem clara, inteligente e empática

⚠️ Sempre fale em português.
⚠️ Sempre explique o porquê de cada resposta.
⚠️ Sempre mantenha a conversa fluida e consultiva.
```

---

## 🧩 INTEGRAÇÃO COM MEMÓRIA E CONTEXTO

### 🔄 `agent_history`
- Guarda o histórico de cada interação
- Inclui:
  - mensagem
  - é do usuário?
  - context_snapshot (resumo automático da conversa)
  - timestamp

### 🧠 `contextManager.ts`
- Recupera últimos X blocos de conversa
- Remove redundância
- Mantém tópicos relevantes ativos

---

## 🔒 RESTRIÇÕES

- ⚠️ O agente **não pode executar nenhuma função** se o usuário não tiver créditos
- ⚠️ O agente deve avisar e sugerir recarga
- ⚠️ O agente não pode dar dicas técnicas sobre código ou programação

---

## 🛠️ CHECKLIST DE IMPLEMENTAÇÃO

- [ ] Implementar `chat-handler.ts` com consumo de token e créditos
- [ ] Criar estrutura de comandos por mensagem (comando → ação)
- [ ] Conectar OpenAI com prompt de sistema configurável
- [ ] Garantir verificação de saldo antes de enviar prompt
- [ ] Criar memória contextual por sessão (opcional com Redis / Supabase)
- [ ] Integrar com painel de relatório/plano de ação

---

Este agente é o coração da plataforma. Ele deve ser estratégico, fluido, natural, e atuar como um verdadeiro especialista consultivo em vendas.
