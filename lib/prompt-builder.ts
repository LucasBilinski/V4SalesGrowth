// ✅ SALES COPILOT — PROMPT BUILDER DINÂMICO COM CONTEXTO DE MÓDULO
// Objetivo: Construir dinamicamente o array de mensagens para o GPT-4 com base no módulo ativado, histórico e mensagem do usuário

import { systemPromptSalesCopilot } from "./prompts"
import { detectarModuloPorMensagem } from "./intent-detector"
import type { Message } from "ai"

interface BuildPromptArgs {
  userMessage: string
  history?: Message[]
  customContext?: string // Contexto geral já formatado
  planContext?: string // Contexto específico do plano de ação
}

/**
 * Constrói o array de mensagens para a chamada da IA,
 * detectando a intenção e injetando o contexto relevante.
 * @param args Argumentos para a construção do prompt.
 * @returns Um objeto com o array de mensagens e o ID do módulo detectado.
 */
export function buildSalesCopilotPrompt({
  userMessage,
  history = [],
  customContext = "",
  planContext = "",
}: BuildPromptArgs) {
  const moduleId = detectarModuloPorMensagem(userMessage)

  // Adiciona um contexto prioritário se um módulo for detectado
  const moduleContext = moduleId
    ? `\n\n---
📦 CONTEXTO PRIORITÁRIO: O usuário deseja iniciar ou continuar o módulo: "${moduleId.toUpperCase()}". Adapte sua resposta para esse módulo. Ofereça as próximas etapas guiadas, seja consultivo e leve o usuário ao objetivo desse módulo.
---`
    : ""

  // O contexto do plano de ação tem prioridade máxima quando presente
  const finalContext = planContext || moduleContext

  const personalizedSystemPrompt = `${customContext}${systemPromptSalesCopilot}${finalContext}`

  const promptMessages: Message[] = [
    { role: "system", content: personalizedSystemPrompt },
    ...history,
    { role: "user", content: userMessage },
  ]

  return {
    promptMessages,
    moduleId,
  }
}
