"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CreditCard, PlusCircle } from "lucide-react"
import { PurchaseCreditsModal } from "./purchase-credits-modal"

interface CreditCounterProps {
  initialBalance: number
  user: { id: string; email: string | undefined }
}

export function CreditCounter({ initialBalance, user }: CreditCounterProps) {
  return (
    <Card className="bg-zinc-900/80 border-zinc-800">
      <CardHeader className="flex flex-row items-center justify-between">
        <div className="flex items-center gap-3">
          <CreditCard className="h-6 w-6 text-brand-red" />
          <div>
            <CardTitle className="text-lg">Seus Créditos</CardTitle>
            <CardDescription>Saldo disponível para usar os agentes.</CardDescription>
          </div>
        </div>
        <span className="text-3xl font-bold font-heading text-white">{initialBalance}</span>
      </CardHeader>
      <CardContent>
        <PurchaseCreditsModal userId={user.id}>
          <Button size="sm" className="w-full">
            <PlusCircle className="mr-2 h-4 w-4" />
            Recarregar Créditos
          </Button>
        </PurchaseCreditsModal>
      </CardContent>
    </Card>
  )
}
