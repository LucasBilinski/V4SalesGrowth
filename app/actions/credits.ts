"use server"

import { cookies } from "next/headers"
import { createClient } from "@/lib/supabase/server"
import { logEvent, incrementUsage } from "./analytics"

// 1. Importar o novo cliente de admin do Supabase
import { getSupabaseAdmin } from "@/lib/supabase/admin"

// --- Nova Lógica de Precificação por Token ---
const TOKEN_COST_REAL = 0.0001 // Custo base por token
const TOKEN_MARKUP = 10 // Markup sobre o custo
const PRICE_PER_TOKEN = TOKEN_COST_REAL * TOKEN_MARKUP // Preço final por token: 0.001

const LOW_CREDIT_THRESHOLD = 10 // Avisar usuário quando o saldo for menor ou igual a 10

/**
 * Deduz créditos com base no número de tokens consumidos.
 * @param userId O ID do usuário.
 * @param tokens O número total de tokens da transação.
 * @param moduleId O ID do módulo para registrar o consumo (opcional).
 * @returns Um objeto com o status da transação.
 */
export async function deductCreditsByTokens(userId: string, tokens: number, moduleId: string) {
  const cookieStore = cookies()
  const supabase = createClient(cookieStore)

  // Calcular o custo em créditos usando a nova fórmula
  const creditsToDeduct = Math.ceil(tokens * PRICE_PER_TOKEN)

  if (creditsToDeduct <= 0) {
    return { success: true, deducted: 0, remaining: null, nearLimit: false }
  }

  // 2. Verificar se o usuário tem saldo suficiente ANTES de tentar deduzir
  const { data: creditData } = await supabase.from("credits").select("balance").eq("user_id", userId).single()
  if (!creditData || creditData.balance < creditsToDeduct) {
    return { success: false, reason: "not_enough_credits", message: "Saldo insuficiente." }
  }

  // 3. Chamar a função RPC para deduzir os créditos
  const { data: newBalance, error: rpcError } = await supabase.rpc("deduct_user_credits", {
    p_user_id: userId,
    p_amount: creditsToDeduct,
  })

  if (rpcError) {
    console.error("Erro ao deduzir créditos por token (RPC):", rpcError)
    return { success: false, reason: "rpc_error", message: "Erro no servidor ao processar transação." }
  }

  // 4. Registrar o consumo nos analytics
  await incrementUsage(userId, "credits_consumed", creditsToDeduct)
  await logEvent(userId, "tokens_consumed", { tokens, credits: creditsToDeduct, module: moduleId })

  return {
    success: true,
    deducted: creditsToDeduct,
    remaining: newBalance,
    nearLimit: newBalance !== null && newBalance <= LOW_CREDIT_THRESHOLD,
  }
}

/**
 * Obtém o saldo de créditos atual de um usuário.
 * @param userId O ID do usuário.
 * @returns O saldo de créditos ou 0 se não encontrado.
 */
export async function getCreditBalance(userId: string) {
  if (!userId) return 0

  const cookieStore = cookies()
  const supabase = createClient(cookieStore)

  const { data, error } = await supabase.from("credits").select("balance").eq("user_id", userId).single()

  if (error || !data) {
    return 0
  }

  return data.balance
}

/**
 * Registra uma recarga de créditos, atualiza o saldo e loga os eventos.
 * Esta função agora usa o cliente de admin e é segura para ser chamada por webhooks.
 * @param userId O ID do usuário.
 * @param amount A quantidade de créditos a ser adicionada.
 * @param source A origem da recarga (ex: 'stripe', 'manual_admin').
 * @param paymentId O ID da transação, se aplicável.
 */
export async function logTopUp(userId: string, amount: number, source = "manual", paymentId: string | null = null) {
  const supabaseAdmin = getSupabaseAdmin() // Get client instance
  // 2. Usar o supabaseAdmin em vez do cliente baseado em cookies
  const { data: topUpRecord, error: topUpError } = await supabaseAdmin
    .from("credit_topups")
    .insert({
      user_id: userId,
      amount: amount,
      source: source,
      payment_id: paymentId,
      status: "completed",
    })
    .select()
    .single()

  if (topUpError) {
    console.error("Erro ao registrar recarga:", topUpError)
    return { success: false, message: "Falha ao auditar a transação." }
  }

  // 3. Chamar a RPC de incremento de saldo com o cliente de admin
  const { error: balanceError } = await supabaseAdmin.rpc("increment_credit_balance", {
    p_user_id: userId,
    p_amount: amount,
  })

  if (balanceError) {
    console.error("Erro ao atualizar saldo:", balanceError)
    // 4. Atualizar o status da recarga para 'failed' em caso de erro
    await supabaseAdmin.from("credit_topups").update({ status: "failed" }).eq("id", topUpRecord.id)
    return { success: false, message: "Falha ao atualizar o saldo de créditos." }
  }

  // O log de eventos pode continuar aqui, pois não depende de um cliente específico
  await logEvent(userId, "credits_purchased", { source, amount })

  return { success: true, message: `Recarga de ${amount} créditos concluída.` }
}
