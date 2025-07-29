"use server"

import { cookies } from "next/headers"
import { createClient } from "@/lib/supabase/server"
import { onboardingPromptSalesCopilot } from "@/lib/prompts"

const AGENT_NAME = "Sales Copilot"

/**
 * Garante que a mensagem de onboarding exista para um usuário.
 * Se for a primeira interação, insere a mensagem no histórico.
 * @param userId O ID do usuário.
 */
export async function ensureOnboardingMessage(userId: string) {
  const cookieStore = cookies()
  const supabase = createClient(cookieStore)
  const AGENT_NAME = "Sales Copilot" // Adicionado para contexto

  try {
    // 1. Verifica se já existe alguma mensagem para este agente
    const { count, error: countError } = await supabase
      .from("agent_history")
      .select("*", { count: "exact", head: true })
      .eq("user_id", userId)
      .eq("agent_name", AGENT_NAME)

    if (countError) {
      throw countError
    }

    // 2. Se não houver mensagens (count === 0), insere a de onboarding
    if (count === 0) {
      const { error: insertError } = await supabase.from("agent_history").insert({
        user_id: userId,
        agent_name: AGENT_NAME,
        message: onboardingPromptSalesCopilot,
        is_user: false, // Mensagem do agente
      })

      if (insertError) {
        throw insertError
      }
    }
  } catch (error) {
    console.error("Falha crítica ao garantir mensagem de onboarding, mas a aplicação continuará:", error)
    // O erro é logado, mas não é relançado, impedindo o crash da página.
  }
}

/**
 * Registra uma nova mensagem no histórico de um agente.
 * @param userId O ID do usuário.
 * @param agentName O nome do agente (ex: 'Auditor', 'Copiloto').
 * @param message O conteúdo da mensagem.
 * @param isUser Verdadeiro se a mensagem for do usuário, falso se for do agente.
 * @returns Um objeto indicando sucesso ou falha.
 */
export async function logMessage(userId: string, agentName: string, message: string, isUser: boolean) {
  const cookieStore = cookies()
  const supabase = createClient(cookieStore)

  const { error } = await supabase.from("agent_history").insert({
    user_id: userId,
    agent_name: agentName,
    message: message,
    is_user: isUser,
  })

  if (error) {
    console.error("Erro ao registrar mensagem:", error)
    return { success: false, message: "Não foi possível salvar a mensagem." }
  }

  return { success: true }
}

/**
 * Recupera o histórico de conversas de um agente para um usuário.
 * @param userId O ID do usuário.
 * @param agentName O nome do agente.
 * @param limit O número de mensagens a serem recuperadas (padrão: 20).
 * @returns Uma lista de mensagens do histórico.
 */
export async function getAgentHistory(userId: string, agentName: string, limit = 100) {
  const cookieStore = cookies()
  const supabase = createClient(cookieStore)

  const { data, error } = await supabase
    .from("agent_history")
    .select("message, is_user, timestamp")
    .eq("user_id", userId)
    .eq("agent_name", agentName)
    .order("timestamp", { ascending: false })
    .limit(limit)

  if (error) {
    console.error("Erro ao buscar histórico:", error)
    return []
  }

  // Retorna em ordem cronológica
  return data.reverse()
}
