"use client"

import jsPDF from "jspdf"
import autoTable from "jspdf-autotable"
import type { createClient } from "./supabase/client"

type SupabaseClient = ReturnType<typeof createClient>

/**
 * Gera e baixa um PDF de um relatório de diagnóstico.
 * Esta função deve ser chamada de um componente no lado do cliente.
 * @param supabase O cliente Supabase do lado do cliente.
 * @param reportId O ID do relatório a ser exportado.
 */
export async function exportReportToPDF(supabase: SupabaseClient, reportId: string) {
  const { data: report, error } = await supabase.from("relatorios").select("*").eq("id", reportId).single()

  if (error || !report) {
    alert("Erro ao buscar relatório para exportação.")
    return
  }

  const doc = new jsPDF()
  doc.text(`Diagnóstico Estratégico – Versão ${report.version}`, 14, 20)
  doc.text(`Score Final: ${report.score_final || "N/A"}`, 14, 30)
  doc.text("Resumo:", 14, 40)
  doc.autoTable({
    startY: 45,
    body: [[report.summary || ""]],
    theme: "plain",
  })

  autoTable(doc, {
    startY: doc.previousAutoTable.finalY + 10,
    head: [["Plano de Ação", "Descrição"]],
    body: [
      ["Curto Prazo", report.plan_curto || ""],
      ["Médio Prazo", report.plan_medio || ""],
      ["Longo Prazo", report.plan_longo || ""],
    ],
  })

  doc.save(`diagnostico_v${report.version}.pdf`)
}

/**
 * Gera e baixa um arquivo JSON com o histórico de um agente.
 * Esta função deve ser chamada de um componente no lado do cliente.
 * @param supabase O cliente Supabase do lado do cliente.
 * @param userId O ID do usuário.
 * @param agentName O nome do agente.
 */
export async function exportHistoryToJSON(supabase: SupabaseClient, userId: string, agentName: string) {
  const { data, error } = await supabase
    .from("agent_history")
    .select("*")
    .eq("user_id", userId)
    .eq("agent_name", agentName)
    .order("timestamp", { ascending: true })

  if (error || !data) {
    alert("Erro ao buscar histórico para exportação.")
    return
  }

  const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" })
  const url = URL.createObjectURL(blob)
  const link = document.createElement("a")
  link.href = url
  link.download = `historico_${agentName}.json`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}
