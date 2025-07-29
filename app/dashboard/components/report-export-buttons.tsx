"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { exportReportToPDF, exportHistoryToJSON } from "@/lib/export"
import { createClient } from "@/lib/supabase/client"
import { FileText, BrainCircuit, Loader2 } from "lucide-react"

interface ReportExportButtonsProps {
  reportId: string
  userId: string
}

export function ReportExportButtons({ reportId, userId }: ReportExportButtonsProps) {
  const [isPdfLoading, setIsPdfLoading] = useState(false)
  const [isJsonLoading, setIsJsonLoading] = useState(false)
  const supabase = createClient()

  const handleExportPDF = async () => {
    setIsPdfLoading(true)
    toast.loading("Gerando seu relatório em PDF...")
    try {
      await exportReportToPDF(supabase, reportId)
      toast.success("Relatório PDF exportado com sucesso!")
    } catch (error) {
      toast.error("Falha ao exportar PDF.")
      console.error(error)
    } finally {
      setIsPdfLoading(false)
    }
  }

  const handleExportJSON = async () => {
    setIsJsonLoading(true)
    toast.loading("Exportando histórico do agente...")
    try {
      // Assumindo que o histórico relevante é do Auditor para este relatório
      await exportHistoryToJSON(supabase, userId, "Auditor")
      toast.success("Histórico JSON exportado com sucesso!")
    } catch (error) {
      toast.error("Falha ao exportar JSON.")
      console.error(error)
    } finally {
      setIsJsonLoading(false)
    }
  }

  return (
    <div className="flex flex-wrap gap-3">
      <Button
        onClick={handleExportPDF}
        disabled={isPdfLoading}
        variant="outline"
        className="bg-white text-black hover:bg-zinc-200"
      >
        {isPdfLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <FileText className="mr-2 h-4 w-4" />}
        Exportar Relatório (PDF)
      </Button>
      <Button onClick={handleExportJSON} disabled={isJsonLoading} variant="secondary">
        {isJsonLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <BrainCircuit className="mr-2 h-4 w-4" />}
        Histórico do Agente (JSON)
      </Button>
    </div>
  )
}
