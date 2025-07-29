"use client"

import { CheckCircle, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Bot } from "lucide-react"
import { useEffect } from "react"
import { toast } from "sonner"

export default function ObrigadoPage() {
  useEffect(() => {
    toast.success("Pagamento confirmado!", {
      description: "Seus créditos foram adicionados à sua conta.",
      icon: <CheckCircle className="w-5 h-5" />,
    })
  }, [])

  return (
    <div className="flex min-h-screen flex-col bg-black font-sans text-white">
      <header className="sticky top-0 z-50 border-b border-zinc-800 bg-black/80 backdrop-blur-sm">
        <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
          <Link href="/dashboard" className="flex items-center gap-2">
            <Bot className="h-8 w-8 text-brand-red" />
            <span className="text-xl font-heading font-bold">V4SalesAI</span>
          </Link>
        </div>
      </header>
      <main className="flex-grow flex items-center justify-center">
        <div className="text-center space-y-4 p-6">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto animate-pulse" />
          <h1 className="text-3xl md:text-4xl font-bold font-heading">Pagamento Confirmado!</h1>
          <p className="text-zinc-400 text-lg max-w-md mx-auto">
            Seus créditos foram adicionados à sua conta. Agora você pode usar o Sales Copilot com ainda mais liberdade.
          </p>
          <Button asChild size="lg" className="mt-6 bg-brand-red hover:bg-brand-red/90 animate-pulse-glow">
            <Link href="/sales-copilot">
              Voltar ao Sales Copilot <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </main>
    </div>
  )
}
