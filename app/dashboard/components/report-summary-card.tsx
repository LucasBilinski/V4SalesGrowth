"use client"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertTriangle, FileText } from "lucide-react"
import { ReportExportButtons } from "./report-export-buttons" // 1. Importar o novo componente

// Definindo o tipo para o relatório para garantir consistência
type Report = {
  id: string
  version: number
  score_final: number | null
  summary: string | null
  created_at: string
  user_id: string // 2. Adicionar user_id para passar aos botões de exportação
}

interface ReportSummaryCardProps {
  report: Report
  daysSinceLastAudit: number
  formattedDate: string
}

export function ReportSummaryCard({ report, daysSinceLastAudit, formattedDate }: ReportSummaryCardProps) {
  const shouldReaudit = daysSinceLastAudit >= 30

  return (
    <Card className="bg-zinc-900/80 border-zinc-800">
      <CardHeader>
        <div className="flex items-center gap-3">
          <FileText className="h-6 w-6 text-brand-red" />
          <div>
            <CardTitle className="text-lg">Último Diagnóstico Estratégico</CardTitle>
            <CardDescription>
              Versão: {report.version} • Score: {report.score_final || "N/A"} • {formattedDate}
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-zinc-300 line-clamp-3">{report.summary || "Nenhum resumo disponível."}</p>
      </CardContent>
      <CardFooter className="flex flex-col items-start gap-4">
        {/* 3. Adicionar os botões de exportação */}
        <ReportExportButtons reportId={report.id} userId={report.user_id} />
        {shouldReaudit && (
          <div className="flex items-center gap-2 text-xs text-yellow-400/90 pt-2">
            <AlertTriangle className="h-4 w-4" />
            <span>Sua última auditoria foi há {daysSinceLastAudit} dias. Recomendamos uma nova análise.</span>
          </div>
        )}
      </CardFooter>
    </Card>
  )
}
