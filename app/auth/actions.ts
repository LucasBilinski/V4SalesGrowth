"use server"

import { createClient } from "@/lib/supabase/server"
import { getSupabaseAdmin } from "@/lib/supabase/admin"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"

// Definindo um tipo para o estado do formulário para consistência
export type FormState = {
  error?: string
  message?: string
}

export async function signup(prevState: FormState | undefined, formData: FormData): Promise<FormState> {
  const cookieStore = cookies()
  const supabase = createClient(cookieStore)
  const supabaseAdmin = getSupabaseAdmin() // Get client instance

  const email = formData.get("email")?.toString()
  const password = formData.get("password")?.toString()
  const fullName = formData.get("full_name")?.toString()

  if (!email || !password || !fullName) {
    return { error: "Todos os campos são obrigatórios." }
  }

  // 1. Cria a conta do usuário
  const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
      },
    },
  })

  if (signUpError || !signUpData.user) {
    console.error("❌ Erro no signup:", signUpError?.message)
    if (signUpError?.message.includes("User already registered")) {
      return { error: "Este e-mail já está cadastrado." }
    }
    if (signUpError?.message.includes("Password should be at least 6 characters")) {
      return { error: "A senha deve ter no mínimo 6 caracteres." }
    }
    return { error: "Não foi possível criar a conta. Tente novamente." }
  }

  const userId = signUpData.user.id
  console.log("✅ Conta criada:", userId)

  // 2. Confirma o e-mail do usuário programaticamente usando o cliente admin
  const { error: updateError } = await supabaseAdmin.auth.admin.updateUserById(userId, {
    email_confirm: true,
  })

  if (updateError) {
    console.error("❌ Erro ao confirmar email:", updateError)
    // Deleta o usuário se a confirmação falhar para evitar contas "presas"
    await supabaseAdmin.auth.admin.deleteUser(userId)
    return { error: "Ocorreu um erro interno ao finalizar o cadastro." }
  }
  console.log("✅ Email confirmado programaticamente")

  // 3. Realiza o login para criar a sessão
  const { error: loginError } = await supabase.auth.signInWithPassword({ email, password })

  if (loginError) {
    console.error("❌ Erro no login automático:", loginError.message)
    return { error: "Erro ao logar após cadastro. Tente fazer login manualmente." }
  }
  console.log("🚀 Login automático realizado")

  // 4. Redireciona para o Sales Copilot
  redirect("/sales-copilot")
}

export async function login(prevState: FormState | undefined, formData: FormData): Promise<FormState> {
  console.log("🔄 Iniciando processo de login...")
  const cookieStore = cookies()
  const supabase = createClient(cookieStore)

  const email = formData.get("email")?.toString()
  const password = formData.get("password")?.toString()

  if (!email || !password) {
    return { error: "E-mail e senha são obrigatórios." }
  }

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    console.error("❌ Erro no login:", error.message)
    return { error: "Credenciais inválidas. Verifique seu e-mail e senha." }
  }

  console.log("✅ Login realizado com sucesso.")
  // O redirecionamento acontece após o retorno bem-sucedido da action
  redirect("/dashboard")
}
