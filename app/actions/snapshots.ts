"use server"

import { cookies } from "next/headers"
import { createClient } from "@/lib/supabase/server"

/**
 * Salva um snapshot de contexto na tabela de histórico do agente.
 * @param userId O ID do usuário.
 * @param agentName O nome do agente.
 * @param snapshot O objeto JSON de contexto.
 * @returns Objeto de sucesso ou falha.
 */
export async function saveAgentSnapshot(userId: string, agentName: string, snapshot: object) {
  const cookieStore = cookies()
  const supabase = createClient(cookieStore)

  const { error } = await supabase.from("agent_history").insert({
    user_id: userId,
    agent_name: agentName,
    message: "📌 Snapshot automático salvo",
    is_user: false,
    context_snapshot: snapshot,
  })

  if (error) {
    console.error("Erro ao salvar snapshot:", error)
    return { success: false, message: "Não foi possível salvar o contexto." }
  }
  return { success: true }
}

/**
 * Recupera o snapshot de contexto mais recente para um agente/usuário.
 * @param userId O ID do usuário.
 * @param agentName O nome do agente.
 * @returns O objeto de snapshot ou nulo.
 */
export async function getLatestSnapshot(userId: string, agentName: string) {
  const cookieStore = cookies()
  const supabase = createClient(cookieStore)

  const { data, error } = await supabase
    .from("agent_history")
    .select("context_snapshot")
    .eq("user_id", userId)
    .eq("agent_name", agentName)
    .not("context_snapshot", "is", null)
    .order("timestamp", { ascending: false })
    .limit(1)
    .single()

  if (error || !data) {
    return null
  }
  return data.context_snapshot
}
