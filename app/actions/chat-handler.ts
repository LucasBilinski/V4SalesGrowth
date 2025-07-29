"use server"

import { buildSalesCopilotPrompt } from "@/lib/prompt-builder"
import { askSalesCopilot } from "@/lib/ai-caller"
import { logMessage } from "./history"
import { getConversationContext, getActionPlanContext } from "./context"
import { deductCreditsByTokens, getCreditBalance } from "./credits" // Importar getCreditBalance
import type { Message } from "ai"

type DepthLevel = "simples" | "completa" | "profunda"

function applyResponseDepth({ userChoice, basePrompt }: { userChoice: DepthLevel; basePrompt: string }) {
  const levels = {
    simples: "Responda de forma direta, clara e resumida. Use o mínimo necessário de tokens.",
    completa: "Responda com boa estrutura, explicando o porquê de cada ponto, mas sem se estender demais.",
    profunda:
      "Responda com profundidade estratégica, trazendo dados de mercado, benchmarks, análises comparativas e sugestões densas. Use tokens de forma inteligente, sem medo de se expandir.",
  }
  const suffix = levels[userChoice] || levels.completa
  return `${basePrompt}\n\n---\n\n🧠 PREFERÊNCIA DE ESTILO:\n${suffix}`
}

interface HandleChatArgs {
  userId: string
  messages: Message[]
  depth?: DepthLevel
}

export async function handleSalesCopilotChat({ userId, messages, depth = "completa" }: HandleChatArgs) {
  // Pre-flight check for credits
  const currentBalance = await getCreditBalance(userId)
  if (currentBalance <= 0) {
    throw new Error("Créditos insuficientes")
  }

  const userMessage = messages[messages.length - 1]
  const history = messages.slice(0, -1)
  const agentName = "Sales Copilot"

  // A dedução de créditos foi movida para depois da chamada da IA

  await logMessage(userId, agentName, userMessage.content, true)

  const generalContext = await getConversationContext(userId)
  const planContext = await getActionPlanContext(userId)
  const { promptMessages, moduleId } = buildSalesCopilotPrompt({
    userMessage: userMessage.content,
    history,
    customContext: generalContext,
  })

  const systemMessage = promptMessages.find((m) => m.role === "system")
  if (systemMessage) {
    systemMessage.content = applyResponseDepth({
      userChoice: depth,
      basePrompt: systemMessage.content as string,
    })
  }

  if (moduleId === "execucao" && planContext && systemMessage) {
    systemMessage.content += `\n\n${planContext}`
  }

  const streamResult = await askSalesCopilot({
    userId: userId,
    messages: promptMessages,
  })

  // Processa a dedução de créditos em segundo plano, sem bloquear o streaming
  streamResult.usage.then(async (usage) => {
    const totalTokens = usage.totalTokens
    await deductCreditsByTokens(userId, totalTokens, moduleId || "consulta_geral")
  })

  return streamResult.toAIStreamResponse()
}
