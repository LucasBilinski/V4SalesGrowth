import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { History, MessageSquare } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { ptBR } from "date-fns/locale"

type AgentHistory = {
  id: string
  agent_name: string
  message: string
  is_user: boolean
  timestamp: string
}

export function SessionHistoryCard({ history }: { history: AgentHistory[] }) {
  return (
    <Card className="bg-zinc-900/80 border-zinc-800">
      <CardHeader>
        <div className="flex items-center gap-3">
          <History className="h-6 w-6 text-brand-red" />
          <div>
            <CardTitle className="text-lg">Histórico Recente</CardTitle>
            <CardDescription>Suas últimas interações com os agentes.</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {history.length > 0 ? (
          <ul className="space-y-4">
            {history.map((item) => (
              <li key={item.id} className="flex items-start gap-3">
                <div className="flex-shrink-0 mt-1">
                  <MessageSquare className="h-4 w-4 text-zinc-500" />
                </div>
                <div>
                  <p className="text-sm text-zinc-300 line-clamp-2">
                    <span className="font-bold text-brand-red">{item.agent_name}:</span> {item.message}
                  </p>
                  <p className="text-xs text-zinc-500">
                    {formatDistanceToNow(new Date(item.timestamp), { addSuffix: true, locale: ptBR })}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-zinc-400 text-center py-4">Nenhuma interação recente.</p>
        )}
      </CardContent>
    </Card>
  )
}
