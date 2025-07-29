import { streamText, type CoreMessage } from "ai"
import { openai } from "@ai-sdk/openai"

interface AskCopilotArgs {
  userId: string
  messages: CoreMessage[]
}

/**
 * Função de baixo nível que faz a chamada direta para a API da IA.
 * A dedução de créditos agora acontece ANTES desta função ser chamada.
 * @param args Argumentos para a chamada, incluindo ID do usuário e mensagens.
 * @returns Um stream de texto da IA.
 */
export async function askSalesCopilot(args: AskCopilotArgs) {
  const systemPrompt = args.messages.find((m) => m.role === "system")?.content as string
  const otherMessages = args.messages.filter((m) => m.role !== "system")

  const result = await streamText({
    model: openai("gpt-4o"),
    system: systemPrompt,
    messages: otherMessages,
    // O callback onCompletion foi removido, pois a dedução é feita antes.
  })

  return result
}
