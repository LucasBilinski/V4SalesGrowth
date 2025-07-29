"use server"

import { cookies } from "next/headers"
import { createClient } from "@/lib/supabase/server"

/**
 * Registra um evento de analytics.
 * @param userId O ID do usuário.
 * @param eventType O tipo do evento (ex: 'report_generated').
 * @param details Detalhes adicionais em formato JSON.
 * @param agentName O nome do agente associado, se houver.
 */
export async function logEvent(userId: string, eventType: string, details = {}, agentName: string | null = null) {
  const cookieStore = cookies()
  const supabase = createClient(cookieStore)

  const { error } = await supabase.from("event_logs").insert({
    user_id: userId,
    event_type: eventType,
    details,
    agent_name: agentName,
  })

  if (error) {
    console.error(`Erro ao registrar evento '${eventType}':`, error)
  }
}

/**
 * Incrementa uma métrica de uso para um usuário.
 * @param userId O ID do usuário.
 * @param metricField O nome da coluna na tabela 'usage_stats'.
 * @param amount O valor a ser incrementado.
 */
export async function incrementUsage(userId: string, metricField: string, amount = 1) {
  const cookieStore = cookies()
  const supabase = createClient(cookieStore)

  const { error } = await supabase.rpc("increment_stat_field", {
    user_id_input: userId,
    field_name: metricField,
    increment_by: amount,
  })

  if (error) {
    console.error(`Erro ao incrementar métrica '${metricField}':`, error)
  }
}
