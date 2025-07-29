"use server"

import { cookies } from "next/headers"
import { createClient } from "@/lib/supabase/server"

/**
 * Busca o contexto geral de um usuário para enriquecer as chamadas à IA.
 * Retorna um resumo do último relatório e o estado da sessão do copiloto.
 * @param userId O ID do usuário.
 * @returns Uma string formatada com o contexto ou uma string vazia.
 */
export async function getConversationContext(userId: string) {
  const cookieStore = cookies()
  const supabase = createClient(cookieStore)

  const [latestReportData, copilotSessionData] = await Promise.all([
    supabase
      .from("relatorios")
      .select("version, score_final, summary")
      .eq("user_id", userId)
      .eq("is_latest", true)
      .single(),
    supabase
      .from("copilot_sessions")
      .select("stage, completed_steps")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(1)
      .single(),
  ])

  let contextString = ""

  if (latestReportData.data) {
    const report = latestReportData.data
    contextString += `O usuário possui um relatório (v${report.version}) com score ${report.score_final || "N/A"}. Resumo: "${report.summary?.substring(0, 150)}...". `
  } else {
    contextString += "O usuário ainda não completou um diagnóstico. "
  }

  if (copilotSessionData.data) {
    const session = copilotSessionData.data
    contextString += `Ele está na etapa "${session.stage}" do plano, com ${session.completed_steps || 0} passos concluídos.`
  }

  return contextString ? `[Contexto Atual do Usuário: ${contextString.trim()}]` : ""
}

/**
 * Busca o plano de ação completo do último relatório de um usuário.
 * @param userId O ID do usuário.
 * @returns Uma string formatada com o plano de ação completo ou null.
 */
export async function getActionPlanContext(userId: string) {
  const cookieStore = cookies()
  const supabase = createClient(cookieStore)

  const { data: report, error } = await supabase
    .from("relatorios")
    .select("plan_curto, plan_medio, plan_longo")
    .eq("user_id", userId)
    .eq("is_latest", true)
    .single()

  if (error || !report) {
    return null
  }

  const plan = `
    **Plano de Curto Prazo:**
    ${report.plan_curto || "Nenhuma ação definida."}

    **Plano de Médio Prazo:**
    ${report.plan_medio || "Nenhuma ação definida."}

    **Plano de Longo Prazo:**
    ${report.plan_longo || "Nenhuma ação definida."}
  `

  // A função agora apenas retorna o plano, a decisão de como usá-lo fica na API route.
  return `--- PLANO DE AÇÃO ATUAL ---\n${plan}`
}
