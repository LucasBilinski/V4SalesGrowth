"use server"

import { cookies } from "next/headers"
import { createClient } from "@/lib/supabase/server"
import { getLatestReportForCopilot } from "./reports"
import { logEvent } from "./analytics"

const AGENT_NAME = "Copilot"

/**
 * Obtém o estado completo para a página do Copiloto.
 * Busca o último relatório e a sessão de copiloto associada (ou cria uma nova).
 * @param userId O ID do usuário.
 * @returns O estado necessário para a página do Copiloto.
 */
export async function getCopilotState(userId: string) {
  const cookieStore = cookies()
  const supabase = createClient(cookieStore)

  // 1. Buscar o relatório mais recente
  const reportResult = await getLatestReportForCopilot(userId)
  if (reportResult.error || !reportResult.data) {
    return { error: reportResult.error }
  }
  const latestReport = reportResult.data

  // 2. Buscar uma sessão de copiloto existente para este relatório
  const { data: existingSession, error: sessionError } = await supabase
    .from("copilot_sessions")
    .select("*")
    .eq("user_id", userId)
    .eq("related_report_id", latestReport.id)
    .single()

  if (existingSession) {
    return { data: { report: latestReport, session: existingSession } }
  }

  // 3. Se não houver sessão, criar uma nova
  const { data: newSession, error: newSessionError } = await supabase
    .from("copilot_sessions")
    .insert({
      user_id: userId,
      related_report_id: latestReport.id,
      stage: "Início",
      completed_tasks: {},
    })
    .select()
    .single()

  if (newSessionError) {
    console.error("Erro ao criar nova sessão de copiloto:", newSessionError)
    return { error: "Não foi possível iniciar a sessão do Copiloto." }
  }

  await logEvent(userId, "copilot_session_started", { reportId: latestReport.id }, AGENT_NAME)

  return { data: { report: latestReport, session: newSession } }
}

/**
 * Atualiza o progresso de uma sessão do Copiloto.
 * @param sessionId O ID da sessão.
 * @param completedTasks O objeto JSON com as tarefas concluídas.
 * @param completedSteps O número total de tarefas concluídas.
 * @returns O resultado da operação.
 */
export async function updateCopilotProgress(sessionId: string, completedTasks: object, completedSteps: number) {
  const cookieStore = cookies()
  const supabase = createClient(cookieStore)

  const { error } = await supabase
    .from("copilot_sessions")
    .update({
      completed_tasks: completedTasks,
      completed_steps: completedSteps,
      stage: "Em Execução",
    })
    .eq("id", sessionId)

  if (error) {
    console.error("Erro ao atualizar progresso do copiloto:", error)
    return { success: false, message: "Não foi possível salvar seu progresso." }
  }

  return { success: true }
}
