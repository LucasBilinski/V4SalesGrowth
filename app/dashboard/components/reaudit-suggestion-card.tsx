"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { shouldTriggerReaudit } from "@/app/actions/reaudit"
import { RefreshCw } from "lucide-react"

export function ReauditSuggestionCard({ userId }: { userId: string }) {
  const [showCard, setShowCard] = useState(false)
  const [reason, setReason] = useState("")
  const router = useRouter()

  useEffect(() => {
    const check = async () => {
      const result = await shouldTriggerReaudit(userId)
      if (result && result.shouldTrigger) {
        setReason(result.reason)
        setShowCard(true)
      }
    }
    check()
  }, [userId])

  if (!showCard) {
    return null
  }

  return (
    <div className="bg-zinc-900/80 border border-brand-red/50 text-white p-6 rounded-xl mt-6 animate-pulse-glow">
      <div className="flex items-start gap-4">
        <div className="bg-brand-red/20 p-2 rounded-full">
          <RefreshCw className="h-6 w-6 text-brand-red" />
        </div>
        <div>
          <h3 className="text-lg font-bold font-heading mb-1">É hora de medir sua evolução</h3>
          <p className="text-sm text-zinc-300 mb-4">{reason}</p>
          <Button onClick={() => router.push("/agente/auditor")} className="bg-brand-red hover:bg-brand-red/90">
            Rodar Nova Auditoria
          </Button>
        </div>
      </div>
    </div>
  )
}
