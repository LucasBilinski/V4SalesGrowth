"use server"

import { cookies } from "next/headers"
import { createClient } from "@/lib/supabase/server"

const REAUDIT_THRESHOLD_DAYS = 30 // Disparar após 30 dias

/**
 * Verifica se uma reauditoria deve ser sugerida ao usuário.
 * @param userId O ID do usuário.
 * @returns Um objeto indicando se a reauditoria deve ser acionada e o motivo.
 */
export async function shouldTriggerReaudit(userId: string) {
  const cookieStore = cookies()
  const supabase = createClient(cookieStore)

  const { data: latestReport, error } = await supabase
    .from("relatorios")
    .select("created_at")
    .eq("user_id", userId)
    .eq("is_latest", true)
    .single()

  if (error || !latestReport) {
    return { shouldTrigger: false, reason: "" }
  }

  const daysSinceLastAudit = Math.floor(
    (new Date().getTime() - new Date(latestReport.created_at).getTime()) / (1000 * 3600 * 24),
  )

  if (daysSinceLastAudit >= REAUDIT_THRESHOLD_DAYS) {
    return {
      shouldTrigger: true,
      reason: `Sua última análise foi há ${daysSinceLastAudit} dias. É um bom momento para medir sua evolução.`,
    }
  }

  return { shouldTrigger: false, reason: "" }
}
