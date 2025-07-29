import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Rocket, ArrowRight } from "lucide-react"
import Link from "next/link"

export function StartCopilotCard() {
  return (
    <Card className="bg-zinc-900/80 border-zinc-800 hover:border-brand-red/70 transition-all group">
      <CardHeader>
        <div className="flex items-center gap-3">
          <Rocket className="h-8 w-8 text-brand-red" />
          <div>
            <CardTitle className="text-xl font-heading">Sales Copilot</CardTitle>
            <CardDescription>Sua central de inteligência comercial está pronta.</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-zinc-300 mb-4">
          Inicie uma conversa para diagnosticar sua operação, criar um plano de ação, preparar-se para reuniões ou tirar
          dúvidas estratégicas.
        </p>
        <Button asChild className="bg-brand-red hover:bg-brand-red/90 animate-pulse-glow">
          <Link href="/sales-copilot">
            Conversar com o Copilot <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </CardContent>
    </Card>
  )
}
