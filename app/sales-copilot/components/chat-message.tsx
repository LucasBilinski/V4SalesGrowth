import type { Message } from "ai"
import { cn } from "@/lib/utils"
import { Bot, User } from "lucide-react"
import { memo } from "react"

// Usando um parser de markdown simples para converter para HTML.
// Em um projeto real, uma biblioteca como 'marked' ou 'react-markdown' seria ideal.
const simpleMarkdown = (text: string) => {
  return text
    .replace(/\[([^\]]+)\]$$([^)]+)$$/g, '<a href="$2" class="text-brand-red hover:underline font-bold">$1</a>') // Links
    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>") // Negrito
    .replace(/\*(.*?)\*/g, "<em>$1</em>") // Itálico
    .replace(/`([^`]+)`/g, "<code>$1</code>") // Código inline
    .replace(/\n/g, "<br />") // Novas linhas
}

const ChatMessage = memo(({ message, isLoading = false }: { message: Message; isLoading?: boolean }) => {
  const isUser = message.role === "user"

  return (
    <div className={cn("flex items-start gap-3 w-full", isUser ? "justify-end" : "justify-start")}>
      {!isUser && (
        <div className="flex-shrink-0 h-8 w-8 rounded-full bg-brand-red/20 flex items-center justify-center">
          <Bot className="h-5 w-5 text-brand-red" />
        </div>
      )}
      <div
        className={cn(
          "max-w-lg lg:max-w-2xl rounded-xl px-4 py-3",
          isUser ? "bg-brand-red text-white rounded-br-none" : "bg-zinc-900 text-zinc-200 rounded-bl-none",
          isLoading && "animate-pulse",
        )}
      >
        <div
          className="prose prose-sm prose-invert prose-p:m-0"
          dangerouslySetInnerHTML={{ __html: simpleMarkdown(message.content) }}
        />
      </div>
      {isUser && (
        <div className="flex-shrink-0 h-8 w-8 rounded-full bg-zinc-700 flex items-center justify-center">
          <User className="h-5 w-5 text-zinc-300" />
        </div>
      )}
    </div>
  )
})

ChatMessage.displayName = "ChatMessage"

export { ChatMessage }
