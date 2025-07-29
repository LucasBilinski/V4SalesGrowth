"use client"

import { Button } from "@/components/ui/button"
import { Bot } from "lucide-react"

const iceBreakers = [
  {
    prompt: "Quero iniciar um novo diagnóstico da minha operação.",
    action: "startDiagnosis",
  },
  {
    prompt: "Crie um plano tático para aumentar minha taxa de conversão.",
    action: "general",
  },
  {
    prompt: "Preciso de ajuda para me preparar para uma reunião de vendas importante.",
    action: "general",
  },
  {
    prompt: "Qual a melhor forma de fazer follow-up com um lead frio?",
    action: "general",
  },
]

interface BreakerPanelProps {
  onSelect: (action: string, prompt?: string) => void
}

export function BreakerPanel({ onSelect }: BreakerPanelProps) {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center p-4">
      <Bot className="h-16 w-16 text-brand-red mb-4" />
      <h2 className="text-2xl font-bold font-heading mb-2">Olá! Sou seu Sales Copilot.</h2>
      <p className="text-zinc-400 mb-8 max-w-md">
        Estou pronto para analisar sua operação, criar planos estratégicos e ajudar você a vender mais. Como posso
        ajudar hoje?
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-w-2xl w-full">
        {iceBreakers.map(({ prompt, action }) => (
          <Button
            key={prompt}
            variant="outline"
            className="text-left justify-start h-auto py-3 bg-zinc-900 border-zinc-800 hover:bg-zinc-800"
            onClick={() => onSelect(action, prompt)}
          >
            {prompt}
          </Button>
        ))}
      </div>
    </div>
  )
}
