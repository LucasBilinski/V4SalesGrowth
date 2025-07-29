"use client"

import { toast } from "sonner"
import { CreditCard, AlertTriangle } from "lucide-react"
import { useRouter } from "next/navigation"

/**
 * Exibe um toast de alerta quando os créditos do usuário estão baixos.
 * @param remaining O número de créditos restantes.
 */
export function showLowCreditsToast(remaining: number) {
  const router = useRouter()
  toast.warning("Seus créditos estão acabando!", {
    description: `Você tem apenas ${remaining} créditos restantes. Recarregue para não interromper seu fluxo.`,
    icon: <AlertTriangle className="h-5 w-5 text-yellow-500" />,
    action: {
      label: "Recarregar",
      onClick: () => router.push("/comprar-creditos"), // Alterado de /dashboard para /comprar-creditos
    },
    duration: 8000,
  })
}

/**
 * Exibe um toast de erro quando o usuário não tem créditos suficientes.
 */
export function showNoCreditsToast() {
  const router = useRouter()
  toast.error("Créditos Insuficientes", {
    description: "Por favor, recarregue seus créditos para continuar usando o Sales Copilot.",
    icon: <CreditCard className="h-5 w-5 text-red-500" />,
    action: {
      label: "Recarregar Agora",
      onClick: () => router.push("/comprar-creditos"), // Alterado de /dashboard para /comprar-creditos
    },
    duration: 10000,
  })
}
