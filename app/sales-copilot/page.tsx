import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import ChatLayout from "./components/chat-layout"
import { getAgentHistory, ensureOnboardingMessage } from "@/app/actions/history"
import { getAllReportsForUser, getAllDiagnosticsForUser } from "@/app/actions/documents"

export default async function SalesCopilotPage() {
  const cookieStore = cookies()
  const supabase = createClient(cookieStore)
  const { data } = await supabase.auth.getUser()
  const user = data.user

  if (!user) {
    redirect("/login")
  }

  // 1. Garante que a mensagem de onboarding exista antes de buscar o histórico
  await ensureOnboardingMessage(user.id)

  // 2. Busca todos os dados em paralelo, agora incluindo a mensagem de onboarding se for o caso
  const [initialMessagesData, reportsData, diagnosticsData] = await Promise.all([
    getAgentHistory(user.id, "Sales Copilot", 100),
    getAllReportsForUser(user.id),
    getAllDiagnosticsForUser(user.id),
  ])

  const initialMessages = initialMessagesData.map((msg: any) => ({
    id: msg.timestamp,
    role: msg.is_user ? "user" : "assistant",
    content: msg.message,
  }))

  return (
    <ChatLayout user={user} initialMessages={initialMessages} reports={reportsData} diagnostics={diagnosticsData} />
  )
}
