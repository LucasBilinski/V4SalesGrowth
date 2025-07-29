import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { Bot } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ReportSummaryCard } from "./components/report-summary-card"
import { CreditCounter } from "./components/credit-counter"
import { CopilotProgressTracker } from "./components/copilot-progress-tracker"
import { EvolutionTimeline, type TimelineItem } from "./components/evolution-timeline"
import { formatDistanceToNow } from "date-fns"
import { ptBR } from "date-fns/locale"
import { NoReportCard } from "./components/no-report-card"
import { StartCopilotCard } from "./components/start-copilot-card"

// Helper para contar "passos" em um plano de ação.
const countSteps = (text: string | null) =>
  text ? text.split("\n").filter((line) => line.trim().length > 0).length : 0

export default async function DashboardPage() {
  const cookieStore = cookies()
  const supabase = createClient(cookieStore)

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  // Fetch all data in parallel
  const [profileData, creditBalanceData, latestReportData, copilotSessionData, allReportsData] = await Promise.all([
    supabase.from("profiles").select("full_name").eq("id", user.id).single(),
    supabase.from("credits").select("balance").eq("user_id", user.id).single(),
    supabase.from("relatorios").select("*, user_id").eq("user_id", user.id).eq("is_latest", true).single(),
    supabase
      .from("copilot_sessions")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(1)
      .single(),
    supabase
      .from("relatorios")
      .select("id, version, created_at")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false }),
  ])

  const profile = profileData.data
  const creditBalance = creditBalanceData.data?.balance ?? 0
  const latestReport = latestReportData.data
  const copilotSession = copilotSessionData.data
  const allReports = allReportsData.data ?? []

  const daysSinceLastAudit = latestReport
    ? Math.floor((new Date().getTime() - new Date(latestReport.created_at).getTime()) / (1000 * 3600 * 24))
    : null

  const timelineItems: TimelineItem[] = allReports.map((report) => ({
    type: "relatorio",
    title: `Diagnóstico v${report.version} concluído`,
    subtitle: `Um novo plano de ação foi gerado.`,
    timestamp: report.created_at,
    link: `/relatorio/${report.id}`,
  }))
  timelineItems.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())

  const signOut = async () => {
    "use server"
    const cookieStore = cookies()
    const supabase = createClient(cookieStore)
    await supabase.auth.signOut()
    return redirect("/login")
  }

  return (
    <div className="flex min-h-screen flex-col bg-black font-sans text-white">
      <header className="sticky top-0 z-50 border-b border-zinc-800 bg-black/80 backdrop-blur-sm">
        <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
          <Link href="/dashboard" className="flex items-center gap-2">
            <Bot className="h-8 w-8 text-brand-red" />
            <span className="text-xl font-heading font-bold">V4SalesAI</span>
          </Link>
          <form action={signOut}>
            <Button variant="ghost" size="sm">
              Sair
            </Button>
          </form>
        </div>
      </header>

      <main className="flex-grow container mx-auto p-4 md:p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold font-heading">Olá, {profile?.full_name || user.email}</h1>
          <p className="text-zinc-400">Seu painel de controle estratégico. O Sales Copilot está pronto para agir.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <StartCopilotCard />

            {latestReport && daysSinceLastAudit !== null ? (
              <ReportSummaryCard
                report={latestReport}
                daysSinceLastAudit={daysSinceLastAudit}
                formattedDate={formatDistanceToNow(new Date(latestReport.created_at), {
                  addSuffix: true,
                  locale: ptBR,
                })}
              />
            ) : (
              <NoReportCard />
            )}
          </div>

          <div className="space-y-6">
            <CreditCounter initialBalance={creditBalance} user={{ id: user.id, email: user.email }} />
            {copilotSession && latestReport && (
              <CopilotProgressTracker
                reportVersion={latestReport.version}
                stage={copilotSession.stage || "N/A"}
                completedSteps={copilotSession.completed_steps || 0}
                totalSteps={
                  countSteps(latestReport.plan_curto) +
                  countSteps(latestReport.plan_medio) +
                  countSteps(latestReport.plan_longo)
                }
                lastUpdate={formatDistanceToNow(new Date(copilotSession.created_at), {
                  addSuffix: true,
                  locale: ptBR,
                })}
              />
            )}
            <EvolutionTimeline items={timelineItems} />
          </div>
        </div>
      </main>
    </div>
  )
}
