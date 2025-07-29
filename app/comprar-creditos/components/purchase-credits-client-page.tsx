"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { toast } from "sonner"
import type { User } from "@supabase/supabase-js"
import { Check, Loader2, Star, AlertTriangle } from "lucide-react"
import { cn } from "@/lib/utils"

const plans = [
  { id: "start", name: "Start", price: "19,70", credits: 197, popular: false },
  { id: "growth", name: "Growth", price: "39,70", credits: 397, popular: true },
  { id: "pro", name: "Pro", price: "69,70", credits: 697, popular: false },
  { id: "master", name: "Master", price: "99,70", credits: 997, popular: false },
]

export function PurchaseCreditsClientPage({ user }: { user: User }) {
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null)
  const searchParams = useSearchParams()

  useEffect(() => {
    if (searchParams.get("motivo") === "saldo-insuficiente") {
      toast.error("Seu saldo acabou!", {
        description: "Recarregue seus créditos para continuar usando o Sales Copilot.",
        icon: <AlertTriangle className="h-5 w-5" />,
        duration: 8000,
      })
    }
  }, [searchParams])

  async function handleBuy(planoId: string) {
    setLoadingPlan(planoId)
    try {
      const res = await fetch("/api/stripe/create-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user.id, plano: planoId }),
      })
      const data = await res.json()

      if (data?.url) {
        window.location.href = data.url
      } else {
        toast.error("Erro ao redirecionar para o pagamento.", {
          description: data.error || "Por favor, tente novamente.",
        })
      }
    } catch (err) {
      console.error(err)
      toast.error("Ocorreu um erro ao iniciar a compra.")
    } finally {
      setLoadingPlan(null)
    }
  }

  return (
    <div className="container mx-auto max-w-5xl py-12 px-4 md:py-20">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold font-heading">
          Escolha seu Pacote de <span className="text-brand-red">Créditos</span>
        </h1>
        <p className="mt-4 max-w-2xl mx-auto text-lg text-zinc-300">
          Créditos são usados para alimentar todas as ações dos agentes de IA. Recarregue para continuar sua jornada de
          alta performance.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {plans.map((p) => (
          <Card
            key={p.id}
            className={cn(
              "relative flex flex-col bg-zinc-900/80 border-2 text-center p-6 transition-all duration-300 hover:-translate-y-2",
              loadingPlan === p.id && "opacity-50",
              p.popular ? "border-brand-red" : "border-zinc-800 hover:border-zinc-700",
            )}
          >
            {p.popular && (
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-brand-red text-white px-4 py-1 text-sm font-bold rounded-full flex items-center gap-1 shadow-lg shadow-brand-red/20">
                <Star className="w-4 h-4" /> MAIS POPULAR
              </div>
            )}
            <div className="flex-grow">
              <h2 className="text-2xl font-bold font-heading mt-4">{p.name}</h2>
              <p className="text-5xl font-bold my-4">
                {p.credits}
                <span className="text-lg font-normal text-zinc-400 ml-1">créditos</span>
              </p>
              <p className="text-xl font-semibold text-zinc-200">
                R$ <span className="font-bold">{p.price}</span>
              </p>
            </div>
            <Button
              className={cn(
                "w-full mt-6 font-bold",
                p.popular ? "bg-brand-red hover:bg-brand-red/90 animate-pulse-glow" : "bg-zinc-700 hover:bg-zinc-600",
              )}
              onClick={() => handleBuy(p.id)}
              disabled={!!loadingPlan}
            >
              {loadingPlan === p.id ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <>
                  <Check className="mr-2 h-5 w-5" /> Comprar Agora
                </>
              )}
            </Button>
          </Card>
        ))}
      </div>
    </div>
  )
}

export default PurchaseCreditsClientPage
