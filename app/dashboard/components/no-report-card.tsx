import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FilePlus, ArrowRight } from "lucide-react"
import Link from "next/link"

export function NoReportCard() {
  return (
    <Card className="bg-zinc-900/80 border-zinc-800 border-dashed">
      <CardHeader>
        <div className="flex items-center gap-3">
          <FilePlus className="h-8 w-8 text-zinc-500" />
          <div>
            <CardTitle className="text-xl font-heading">Nenhum Diagnóstico Encontrado</CardTitle>
            <CardDescription>O primeiro passo para a alta performance é entender seu ponto de partida.</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-zinc-300 mb-4">
          Use o Sales Copilot para fazer uma auditoria completa da sua operação comercial e gerar seu primeiro relatório
          estratégico.
        </p>
        <Button asChild variant="secondary">
          <Link href="/sales-copilot">
            Gerar Primeiro Diagnóstico <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </CardContent>
    </Card>
  )
}
