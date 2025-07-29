"use client"

import { toast } from "sonner"
import { CheckCircle, Rocket, RefreshCcw } from "lucide-react"

type ToastType = "diagnostico" | "plano" | "reauditoria"

/**
 * Dispara um evento global para que o chat possa processar uma mensagem sintética.
 * @param message A mensagem a ser enviada para o chat.
 */
const dispatchCopilotSuggestion = (message: string) => {
  window.dispatchEvent(new CustomEvent("copilot:suggestion", { detail: message }))
}

/**
 * Exibe toasts de conclusão inteligentes com ações que engajam o usuário no próximo passo.
 * @param type O tipo de toast a ser exibido.
 */
export function showCompletionToast(type: ToastType = "diagnostico") {
  switch (type) {
    case "diagnostico":
      toast.success("Diagnóstico concluído! Deseja iniciar o Plano de Ação agora?", {
        icon: <CheckCircle className="text-green-500 w-5 h-5" />,
        action: {
          label: "Criar Plano",
          onClick: () => dispatchCopilotSuggestion("Quero um plano de ação para os pontos diagnosticados"),
        },
        duration: 10000,
      })
      break
    case "plano":
      toast.message("Plano criado com sucesso! Vamos colocar em prática?", {
        icon: <Rocket className="text-blue-500 w-5 h-5" />,
        action: {
          label: "Começar Execução",
          onClick: () => dispatchCopilotSuggestion("Quero começar a execução do plano"),
        },
        duration: 10000,
      })
      break
    case "reauditoria":
      toast.message("Já faz um tempo desde sua última análise.", {
        description: "Recomendamos rodar uma nova auditoria para medir sua evolução.",
        icon: <RefreshCcw className="text-orange-500 w-5 h-5" />,
        action: {
          label: "Rodar Agora",
          onClick: () => dispatchCopilotSuggestion("Quero fazer uma nova auditoria"),
        },
        duration: 15000,
      })
      break
    default:
      break
  }
}
