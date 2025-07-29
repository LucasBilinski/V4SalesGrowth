"use client"

import type React from "react"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Check, Loader2, Star } from "lucide-react"
import { cn } from "@/lib/utils"

const plans = [
  { id: "start", name: "Start", credits: 197, price: "R$ 19,70", popular: false },
  { id: "growth", name: "Growth", credits: 397, price: "R$ 39,70", popular: true },
  { id: "pro", name: "Pro", credits: 697, price: "R$ 69,70", popular: false },
  { id: "master", name: "Master", credits: 997, price: "R$ 99,70", popular: false },
]

interface PurchaseCreditsModalProps {
  userId: string
  children: React.ReactNode
}

export function PurchaseCreditsModal({ userId, children }: PurchaseCreditsModalProps) {
  const [selectedPlan, setSelectedPlan] = useState("growth")
  const [isLoading, setIsLoading] = useState(false)

  const handlePurchase = async () => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/stripe/create-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, plano: selectedPlan }),
      })

      const { url, error } = await response.json()

      if (error) {
        throw new Error(error)
      }

      if (url) {
        window.location.href = url
      }
    } catch (error) {
      console.error(error)
      alert("Ocorreu um erro. Tente novamente.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[650px] bg-zinc-900 border-zinc-800 text-white">
        <DialogHeader>
          <DialogTitle className="text-2xl font-heading text-center">Recarregar Créditos</DialogTitle>
          <DialogDescription className="text-center text-zinc-400">
            Escolha um pacote de créditos para continuar evoluindo sua operação com o Sales Copilot.
          </DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-4">
          {plans.map((plan) => (
            <Card
              key={plan.id}
              onClick={() => setSelectedPlan(plan.id)}
              className={cn(
                "cursor-pointer transition-all border-2 bg-zinc-800/50 hover:bg-zinc-800 relative",
                selectedPlan === plan.id
                  ? "border-brand-red shadow-md shadow-brand-red/20"
                  : "border-zinc-700 hover:border-zinc-600",
              )}
            >
              {plan.popular && (
                <div className="absolute -top-3 right-2 bg-brand-red text-white px-2 py-0.5 text-xs font-bold rounded-full flex items-center gap-1">
                  <Star className="w-3 h-3" /> Popular
                </div>
              )}
              <CardContent className="p-4 text-center">
                <p className="font-bold text-lg font-heading">{plan.name}</p>
                <p className="text-2xl font-bold my-2">{plan.credits}</p>
                <p className="text-xs text-zinc-400 mb-2">créditos</p>
                <p className="text-sm font-semibold text-brand-red">{plan.price}</p>
              </CardContent>
            </Card>
          ))}
        </div>
        <Button
          onClick={handlePurchase}
          disabled={isLoading}
          size="lg"
          className="w-full bg-brand-red hover:bg-brand-red/90"
        >
          {isLoading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <Check className="mr-2 h-5 w-5" />}
          Comprar Pacote {plans.find((p) => p.id === selectedPlan)?.name}
        </Button>
      </DialogContent>
    </Dialog>
  )
}
