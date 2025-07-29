import { Button } from "@/components/ui/button"
import { Bot, Plus } from "lucide-react"
import Link from "next/link"

export function SidebarSessions() {
  // Placeholder para o histórico de chats.
  const chatHistory = [
    { id: "1", title: "Diagnóstico Inicial" },
    { id: "2", title: "Plano para Q4" },
    { id: "3", title: "Análise de Concorrente" },
  ]

  return (
    <div className="h-full flex flex-col bg-zinc-900/80 border-r border-zinc-800 p-4">
      <div className="flex items-center justify-between mb-4">
        <Link href="/dashboard" className="flex items-center gap-2">
          <Bot className="h-7 w-7 text-brand-red" />
          <span className="text-lg font-heading font-bold">V4SalesAI</span>
        </Link>
      </div>
      <Button className="w-full justify-start gap-2 mb-4">
        <Plus className="h-4 w-4" />
        Nova Sessão
      </Button>
      <div className="flex-grow overflow-y-auto">
        <h2 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2">Histórico</h2>
        <nav className="flex flex-col gap-1">
          {chatHistory.map((chat) => (
            <Button
              key={chat.id}
              variant="ghost"
              className="w-full justify-start text-zinc-300 hover:bg-zinc-800 hover:text-white"
            >
              <span className="truncate">{chat.title}</span>
            </Button>
          ))}
        </nav>
      </div>
    </div>
  )
}
