"use server"

import { createClient } from "@/lib/supabase/server"
import { cookies } from "next/headers"

export async function getAllReportsForUser(userId: string) {
  const cookieStore = cookies()
  const supabase = createClient(cookieStore)

  const { data, error } = await supabase
    .from("relatorios")
    .select("id, version, score_final, created_at")
    .eq("user_id", userId)
    .order("version", { ascending: false })

  if (error) {
    console.error("Erro ao buscar relatórios:", error)
    return []
  }
  return data
}

export async function getAllDiagnosticsForUser(userId: string) {
  const cookieStore = cookies()
  const supabase = createClient(cookieStore)

  // Agrupando por sessão de diagnóstico para não poluir a UI
  // Esta é uma simplificação. Uma abordagem mais robusta poderia agrupar por um `session_id`.
  const { data, error } = await supabase
    .from("diagnostics")
    .select("id, block_title, created_at")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Erro ao buscar diagnósticos:", error)
    return []
  }
  // Retornando uma lista simplificada para a UI
  return data.filter(
    (d, i, self) => i === self.findIndex((t) => t.block_title.split(":")[0] === d.block_title.split(":")[0]),
  )
}
