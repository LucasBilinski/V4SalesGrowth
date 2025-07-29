"use client"

import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"

export type DepthLevel = "simples" | "completa" | "profunda"

const opcoes = [
  {
    id: "simples",
    label: "🟢 Resposta Simples",
    desc: "Resumo direto, sem aprofundamento.",
  },
  {
    id: "completa",
    label: "🟡 Resposta Completa",
    desc: "Explicação estruturada, equilibrada.",
  },
  {
    id: "profunda",
    label: "🔵 Resposta Profunda",
    desc: "Com benchmarks, contexto e densidade.",
  },
]

interface DepthSelectorProps {
  value: DepthLevel
  onValueChange: (value: DepthLevel) => void
}

export function DepthSelector({ value, onValueChange }: DepthSelectorProps) {
  return (
    <div className="space-y-3 rounded-xl bg-zinc-900/70 border border-zinc-800 p-4">
      <p className="text-sm font-medium text-center text-zinc-300">Selecione o nível de profundidade da resposta:</p>
      <div className="grid gap-3 grid-cols-1 md:grid-cols-3">
        {opcoes.map((op) => (
          <Card
            key={op.id}
            onClick={() => onValueChange(op.id as DepthLevel)}
            className={cn(
              "cursor-pointer transition-all hover:shadow-md border-2 bg-zinc-900 hover:bg-zinc-800",
              value === op.id
                ? "border-brand-red shadow-md shadow-brand-red/20"
                : "border-zinc-800 hover:border-zinc-700",
            )}
          >
            <CardContent className="p-3 text-center md:text-left">
              <p className="text-sm font-semibold text-white">{op.label}</p>
              <p className="text-xs text-zinc-400 mt-1">{op.desc}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
