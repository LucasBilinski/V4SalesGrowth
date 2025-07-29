import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Rocket } from "lucide-react"

interface CopilotProgressProps {
  reportVersion: number
  stage: string
  completedSteps: number
  totalSteps: number
  lastUpdate: string
}

export function CopilotProgressTracker({
  reportVersion,
  stage,
  completedSteps,
  totalSteps,
  lastUpdate,
}: CopilotProgressProps) {
  const progress = totalSteps > 0 ? Math.floor((completedSteps / totalSteps) * 100) : 0

  return (
    <Card className="bg-zinc-900/80 border-zinc-800">
      <CardHeader>
        <div className="flex items-center gap-3">
          <Rocket className="h-6 w-6 text-brand-red" />
          <div>
            <CardTitle className="text-lg">Execução do Plano com Copiloto</CardTitle>
            <CardDescription>
              Baseado no Diagnóstico v{reportVersion} • Etapa atual:{" "}
              <span className="text-white font-medium">{stage}</span>
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Progress value={progress} className="w-full h-3 mb-2" />
        <div className="flex justify-between items-center">
          <p className="text-xs text-zinc-400">
            {completedSteps} de {totalSteps} etapas concluídas ({progress}%)
          </p>
          <p className="text-xs text-zinc-500 italic">Última atualização: {lastUpdate}</p>
        </div>
      </CardContent>
    </Card>
  )
}
