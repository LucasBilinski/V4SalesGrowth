"use server"

import { cookies } from "next/headers"
import { createClient } from "@/lib/supabase/server"

/**
 * Define todos os relatórios de um usuário como não sendo o mais recente.
 * Essencial para ser executado antes de salvar um novo relatório.
 * @param userId O ID do usuário.
 */
async function invalidateLatestReports(userId: string) {
  const cookieStore = cookies()
  const supabase = createClient(cookieStore)

  const { error } = await supabase.from("relatorios").update({ is_latest: false }).eq("user_id", userId)

  if (error) {
    console.error("Erro ao invalidar relatórios antigos:", error)
  }
}

/**
 * Calcula a próxima versão para um novo relatório de um usuário.
 * @param userId O ID do usuário.
 * @returns O número da próxima versão.
 */
async function getNextReportVersion(userId: string) {
  const cookieStore = cookies()
  const supabase = createClient(cookieStore)

  const { data, error } = await supabase
    .from("relatorios")
    .select("version")
    .eq("user_id", userId)
    .order("version", { ascending: false })
    .limit(1)
    .single()

  if (error || !data) {
    return 1 // Primeiro relatório
  }

  return data.version + 1
}

/**
 * Cria um novo relatório, gerenciando o versionamento automaticamente.
 * @param userId O ID do usuário.
 * @param reportData Os dados do novo relatório.
 * @returns O relatório criado.
 */
export async function createVersionedReport(userId: string, reportData: any) {
  await invalidateLatestReports(userId)
  const nextVersion = await getNextReportVersion(userId)

  const cookieStore = cookies()
  const supabase = createClient(cookieStore)

  const { data, error } = await supabase
    .from("relatorios")
    .insert({
      ...reportData,
      user_id: userId,
      version: nextVersion,
      is_latest: true,
    })
    .select()
    .single()

  if (error) {
    console.error("Erro ao criar relatório versionado:", error)
    return { error: "Não foi possível salvar o novo relatório." }
  }

  return { data }
}

/**
 * Busca o relatório mais recente de um usuário para o Copiloto.
 * @param userId O ID do usuário.
 * @returns O relatório mais recente ou um erro.
 */
export async function getLatestReportForCopilot(userId: string) {
  const cookieStore = cookies()
  const supabase = createClient(cookieStore)

  const { data, error } = await supabase
    .from("relatorios")
    .select("id, version, plan_curto, plan_medio, plan_longo")
    .eq("user_id", userId)
    .eq("is_latest", true)
    .single()

  if (error || !data) {
    return { error: "Nenhum relatório encontrado para iniciar o Copiloto." }
  }

  return { data }
}
