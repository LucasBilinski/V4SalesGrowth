import { createClient } from "@/lib/supabase/server"
import { handleSalesCopilotChat } from "@/app/actions/chat-handler"
import { cookies } from "next/headers"
import type { Request } from "next/server"
import { noCreditsMessage } from "@/lib/prompts" // Importar a nova mensagem

export const maxDuration = 30

export async function POST(req: Request) {
  try {
    const { messages, depth } = await req.json() // Extrai 'depth' do corpo da requisição

    const cookieStore = cookies()
    const supabase = createClient(cookieStore)
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return new Response("Unauthorized", { status: 401 })
    }

    const streamResponse = await handleSalesCopilotChat({ userId: user.id, messages, depth }) // Passa 'depth' para o handler

    return streamResponse
  } catch (error) {
    if (error.message.includes("Créditos insuficientes")) {
      return new Response(noCreditsMessage, { status: 402 }) // Retorna a mensagem customizada
    }
    console.error("[API /sales-copilot ERROR]", error)
    return new Response("Erro interno no Sales Copilot.", { status: 500 })
  }
}
