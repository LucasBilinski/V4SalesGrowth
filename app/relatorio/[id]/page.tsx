import { cookies } from "next/headers"
import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import Link from "next/link"
import { Bot, ArrowLeft, FileText, CheckCircle, AlertTriangle, Target, Zap } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { ReportExportButtons } from "@/app/dashboard/components/report-export-buttons"
import { Button } from "@/components/ui/button"

// Componente simples para renderizar texto com quebras de linha como parágrafos
function MarkdownRenderer({ text }: { text: string | null }) {
  if (!text) return <p className="text-zinc-400">Nenhuma informação fornecida.</p>
  return (
    <div className="space-y-2">
      {text.split("\n").map((line, index) => (
        <p key={index} className="text-zinc-300">
          {line}
        </p>
      ))}
    </div>
  )
}

// Componente para a Análise SWOT
function SwotAnalysis({ swot }: { swot: any }) {
  const swotItems = [
    { title: "Forças", items: swot?.strengths || [], icon: <CheckCircle className="h-6 w-6 text-green-500" /> },
    { title: "Fraquezas", items: swot?.weaknesses || [], icon: <AlertTriangle className="h-6 w-6 text-yellow-500" /> },
    { title: "Oportunidades", items: swot?.opportunities || [], icon: <Zap className="h-6 w-6 text-blue-500" /> },
    { title: "Ameaças", items: swot?.threats || [], icon: <Target className="h-6 w-6 text-red-500" /> },
  ]

  return (
    <Card className="bg-zinc-900/80 border-zinc-800">
      <CardHeader>
        <CardTitle className="text-xl font-heading">Análise SWOT</CardTitle>
        <CardDescription>Uma visão 360° da sua operação comercial atual.</CardDescription>
      </CardHeader>
      <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {swotItems.map((item) => (
          <div key={item.title} className="bg-zinc-900 p-4 rounded-lg border border-zinc-700">
            <div className="flex items-center gap-3 mb-3">
              {item.icon}
              <h3 className="font-bold text-lg text-white">{item.title}</h3>
            </div>
            <ul className="space-y-2 pl-4 list-disc list-inside text-zinc-300">
              {item.items.length > 0 ? (
                item.items.map((text: string, index: number) => <li key={index}>{text}</li>)
              ) : (
                <li className="list-none text-zinc-500 italic">Nenhum ponto identificado.</li>
              )}
            </ul>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}

export default async function ReportPage({ params }: { params: { id: string } }) {
  const cookieStore = cookies()
  const supabase = createClient(cookieStore)

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  const { data: report, error } = await supabase
    .from("relatorios")
    .select("*")
    .eq("id", params.id)
    .eq("user_id", user.id)
    .single()

  if (error || !report) {
    redirect("/dashboard")
  }

  return (
    <div className="flex min-h-screen flex-col bg-black font-sans text-white">
      <header className="sticky top-0 z-50 border-b border-zinc-800 bg-black/80 backdrop-blur-sm">
        <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
          <Link href="/dashboard" className="flex items-center gap-2">
            <Bot className="h-8 w-8 text-brand-red" />
            <span className="text-xl font-heading font-bold">V4SalesAI</span>
          </Link>
          <Button asChild variant="ghost">
            <Link href="/dashboard">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Voltar ao Dashboard
            </Link>
          </Button>
        </div>
      </header>

      <main className="flex-grow container mx-auto p-4 md:p-8">
        <div className="space-y-8">
          {/* Cabeçalho do Relatório */}
          <div className="p-6 rounded-xl bg-zinc-900/80 border border-zinc-800">
            <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
              <div>
                <div className="flex items-center gap-3">
                  <FileText className="h-8 w-8 text-brand-red" />
                  <h1 className="text-2xl md:text-3xl font-bold font-heading">Diagnóstico Estratégico</h1>
                </div>
                <p className="text-zinc-400 mt-1">
                  Relatório v{report.version} • Gerado em{" "}
                  {new Date(report.created_at).toLocaleDateString("pt-BR", { dateStyle: "long" })}
                </p>
              </div>
              <div className="flex flex-col items-start md:items-end gap-2">
                <p className="text-sm text-zinc-300">Score de Maturidade Comercial</p>
                <Badge variant="destructive" className="text-2xl px-4 py-1 bg-brand-red text-white">
                  {report.score_final || "N/A"}
                </Badge>
              </div>
            </div>
            <div className="mt-6 border-t border-zinc-700 pt-6">
              <ReportExportButtons reportId={report.id} userId={user.id} />
            </div>
          </div>

          {/* Resumo Executivo */}
          <Card className="bg-zinc-900/80 border-zinc-800">
            <CardHeader>
              <CardTitle className="text-xl font-heading">Resumo Executivo</CardTitle>
              <CardDescription>Os principais insights da sua análise.</CardDescription>
            </CardHeader>
            <CardContent>
              <MarkdownRenderer text={report.summary} />
            </CardContent>
          </Card>

          {/* Análise SWOT */}
          <SwotAnalysis swot={report.swot} />

          {/* Plano de Ação */}
          <Card className="bg-zinc-900/80 border-zinc-800">
            <CardHeader>
              <CardTitle className="text-xl font-heading">Plano de Ação</CardTitle>
              <CardDescription>Suas próximas etapas para a alta performance.</CardDescription>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible defaultValue="item-1" className="w-full">
                <AccordionItem value="item-1">
                  <AccordionTrigger className="text-lg font-semibold">Curto Prazo (Próximos 30 dias)</AccordionTrigger>
                  <AccordionContent>
                    <MarkdownRenderer text={report.plan_curto} />
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-2">
                  <AccordionTrigger className="text-lg font-semibold">Médio Prazo (Próximos 90 dias)</AccordionTrigger>
                  <AccordionContent>
                    <MarkdownRenderer text={report.plan_medio} />
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-3">
                  <AccordionTrigger className="text-lg font-semibold">Longo Prazo (Próximos 6 meses)</AccordionTrigger>
                  <AccordionContent>
                    <MarkdownRenderer text={report.plan_longo} />
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
