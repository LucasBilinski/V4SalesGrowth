"use server"

import { cookies } from "next/headers"
import { createClient } from "@/lib/supabase/server"
import { logEvent, incrementUsage } from "./analytics"
import { createVersionedReport } from "./reports"
import { openai } from "@ai-sdk/openai"
import { generateObject } from "ai"
import { z } from "zod"
import { systemPromptAuditor } from "@/lib/prompts"
import { deductCreditsByTokens } from "./credits" // Importar a função correta

const AGENT_NAME = "Auditor"

export async function saveDiagnosticBlock(userId: string, blockNumber: number, blockTitle: string, answer: string) {
  const cookieStore = cookies()
  const supabase = createClient(cookieStore)

  // A dedução de créditos para o bloco de diagnóstico agora será tratada pelo chat-handler principal
  // Esta função apenas salva o progresso.

  const { error: diagnosticError } = await supabase.from("diagnostics").insert({
    user_id: userId,
    block_number: blockNumber + 1,
    block_title: blockTitle,
    response_text: answer,
  })

  if (diagnosticError) {
    console.error("Erro ao salvar diagnóstico:", diagnosticError)
    return { success: false, message: "Não foi possível salvar seu progresso." }
  }

  await logEvent(userId, "diagnostic_block_completed", { block: blockNumber + 1 }, AGENT_NAME)
  await incrementUsage(userId, "total_blocks_completed")

  return { success: true, message: "Progresso salvo com sucesso." }
}

export async function generateFinalReport(userId: string) {
  const cookieStore = cookies()
  const supabase = createClient(cookieStore)

  const { data: diagnostics, error: diagnosticsError } = await supabase
    .from("diagnostics")
    .select("block_title, response_text")
    .eq("user_id", userId)
    .order("block_number", { ascending: true })

  if (diagnosticsError || !diagnostics || diagnostics.length === 0) {
    return { error: "Não foi possível encontrar dados do diagnóstico para gerar o relatório." }
  }

  const userResponses = diagnostics
    .map((d) => `Bloco: ${d.block_title}\nResposta: ${d.response_text}`)
    .join("\n\n---\n\n")

  const finalPrompt = `Com base nas seguintes respostas do usuário, gere um relatório estratégico completo:\n\n${userResponses}`

  try {
    // A dedução de créditos ocorrerá após a geração, baseada nos tokens usados.
    const { object: reportData, usage } = await generateObject({
      model: openai("gpt-4o"),
      system: systemPromptAuditor,
      prompt: finalPrompt,
      schema: z.object({
        summary: z.string().describe("Um resumo executivo da análise, destacando os principais insights."),
        swot: z.object({
          strengths: z.array(z.string()).describe("Forças identificadas na operação."),
          weaknesses: z.array(z.string()).describe("Fraquezas e gargalos principais."),
          opportunities: z.array(z.string()).describe("Oportunidades de melhoria e crescimento."),
          threats: z.array(z.string()).describe("Riscos e ameaças ao processo comercial."),
        }),
        plan_curto: z.string().describe("Plano de ação detalhado para os próximos 30 dias, em tópicos."),
        plan_medio: z.string().describe("Plano de ação detalhado para os próximos 90 dias, em tópicos."),
        plan_longo: z.string().describe("Plano de ação detalhado para os próximos 6 meses, em tópicos."),
        score_final: z.number().min(0).max(100).describe("Uma nota de 0 a 100 para a maturidade comercial atual."),
      }),
    })

    // Deduz créditos com base no uso real de tokens
    const creditResult = await deductCreditsByTokens(userId, usage.totalTokens, "plano_acao")
    if (!creditResult.success) {
      return { error: creditResult.message || "Créditos insuficientes para gerar o relatório." }
    }

    const { data: newReport, error: reportError } = await createVersionedReport(userId, reportData)

    if (reportError || !newReport) {
      return { error: "Falha ao salvar o relatório gerado." }
    }

    await logEvent(userId, "final_report_generated", { reportId: newReport.id }, AGENT_NAME)
    await incrementUsage(userId, "total_reports")

    return { reportId: newReport.id }
  } catch (e) {
    console.error("Erro ao gerar objeto com a IA:", e)
    return { error: "Ocorreu um erro ao gerar seu relatório. Tente novamente." }
  }
}
