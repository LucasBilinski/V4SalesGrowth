"use client"

import type React from "react"
import { useRouter } from "next/navigation"
import { useState, useTransition } from "react"
import type { User } from "@supabase/supabase-js"
import type { Message } from "ai"
import { useChat } from "ai/react"
import { toast } from "sonner"
import { SidebarSessions } from "./sidebar-sessions"
import { Button } from "@/components/ui/button"
import { FolderOpen, Menu, Sparkles } from "lucide-react"
import { useAppStore } from "@/lib/store"
import { DocumentsDrawer } from "./documents-drawer"
import { ChatScrollArea } from "./chat-scroll-area"
import { ChatInput } from "./chat-input"
import { BreakerPanel } from "./breaker-panel"
import { Progress } from "@/components/ui/progress"
import { DIAGNOSTIC_BLOCKS, TOTAL_BLOCKS } from "@/lib/constants"
import { saveDiagnosticBlock, generateFinalReport } from "@/app/actions/auditor"
import { showCompletionToast } from "@/app/components/toasts"
import { detectarModuloPorMensagem } from "@/lib/intent-detector"
import { getCreditBalance } from "@/app/actions/credits"
import { showLowCreditsToast } from "./credits-toast-alerts"
import { TriggerableDepthSelector } from "./triggerable-depth-selector"
import type { DepthLevel } from "./depth-selector"
import { showNoCreditsToast } from "./credits-toast-alerts"

type Report = { id: string; version: number; score_final: number | null; created_at: string }
type Diagnostic = { id: string; block_title: string; created_at: string }

interface ChatLayoutProps {
  user: User
  initialMessages: Message[]
  reports: Report[]
  diagnostics: Diagnostic[]
}

const DEPTH_SIGNAL = "[ACTION:REQUEST_DEPTH]"

export default function ChatLayout({ user, initialMessages, reports, diagnostics }: ChatLayoutProps) {
  const router = useRouter()
  const { toggleDrawer } = useAppStore()
  const [isDiagnosing, setIsDiagnosing] = useState(false)
  const [diagnosticStep, setDiagnosticStep] = useState(0)
  const [isPending, startTransition] = useTransition()
  const [depth, setDepth] = useState<DepthLevel>("completa")
  const [currentBlock, setCurrentBlock] = useState(DIAGNOSTIC_BLOCKS[0]) // Declare currentBlock variable

  const { messages, input, handleInputChange, handleSubmit, isLoading, setMessages, append } = useChat({
    api: "/api/chat/sales-copilot",
    initialMessages,
    id: user.id,
    body: {
      depth: depth,
    },
    onError: (error) => {
      append({
        id: `error-${Date.now()}`,
        role: "assistant",
        content: error.message,
      })
    },
    onFinish: async (message) => {
      if (message.content.includes(DEPTH_SIGNAL)) {
        const cleanedMessage = message.content.replace(DEPTH_SIGNAL, "").trim()
        setMessages((prev) => prev.map((m) => (m.id === message.id ? { ...m, content: cleanedMessage } : m)))
        window.dispatchEvent(new CustomEvent("copilot:depth_request"))
      }

      const balance = await getCreditBalance(user.id)
      if (balance > 0 && balance <= 10) {
        showLowCreditsToast(balance)
      }

      const lastUserMessage = messages.filter((m) => m.role === "user").pop()
      if (lastUserMessage) {
        const intent = detectarModuloPorMensagem(lastUserMessage.content)
        if (intent === "plano_acao") {
          showCompletionToast("plano")
        }
      }
    },
  })

  // Wrapper para o handleSubmit que detecta a intenção antes de enviar
  const customHandleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    handleSubmit(e)
  }

  const handleDepthChosen = (chosenDepth: DepthLevel) => {
    const lastUserMessage = messages.findLast((m) => m.role === "user")
    if (!lastUserMessage) return

    setDepth(chosenDepth)

    const newMessages = messages.filter((m) => m.id !== messages.findLast((msg) => msg.role === "assistant")?.id)
    setMessages(newMessages)

    append({ role: "user", content: lastUserMessage.content })
  }

  const startDiagnosis = () => {
    setIsDiagnosing(true)
    setDiagnosticStep(0)
    const firstBlock = DIAGNOSTIC_BLOCKS[0]
    setCurrentBlock(firstBlock) // Set currentBlock to the first block
    setMessages([
      ...messages,
      {
        id: `diag-start-${Date.now()}`,
        role: "assistant",
        content: `Excelente! Vamos começar o Diagnóstico Estratégico.\n\n**${firstBlock.title}**\n\n${firstBlock.questions.join(
          "\n",
        )}`,
      },
    ])
  }

  const handleBreakerSelect = (action: string, prompt?: string) => {
    if (action === "startDiagnosis") {
      startDiagnosis()
    } else if (prompt) {
      append({ role: "user", content: prompt })
    }
  }

  const handleDiagnosticSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const answer = input
    startTransition(async () => {
      append({ role: "user", content: answer })

      const result = await saveDiagnosticBlock(user.id, diagnosticStep, currentBlock.title, answer)
      if (!result.success) {
        showNoCreditsToast()
        setIsDiagnosing(false)
        append({
          id: `diag-error-${Date.now()}`,
          role: "assistant",
          content: `Parece que você não tem créditos suficientes para continuar o diagnóstico. Por favor, recarregue e tente novamente.`,
        })
        return
      }

      const nextStep = diagnosticStep + 1
      if (nextStep < TOTAL_BLOCKS) {
        setDiagnosticStep(nextStep)
        const nextBlock = DIAGNOSTIC_BLOCKS[nextStep]
        setCurrentBlock(nextBlock) // Set currentBlock to the next block
        append({
          id: `diag-step-${nextStep}`,
          role: "assistant",
          content: `Ótimo, vamos para o próximo.\n\n**${nextBlock.title}**\n\n${nextBlock.questions.join("\n")}`,
        })
      } else {
        setIsDiagnosing(false)
        append({
          id: `diag-end-${Date.now()}`,
          role: "assistant",
          content:
            "Diagnóstico Concluído! Todas as suas respostas foram analisadas. O próximo passo é consolidar tudo em um relatório estratégico.",
        })
        showCompletionToast("diagnostico")
      }
    })
  }

  const handleGenerateReport = () => {
    startTransition(async () => {
      toast.loading("Gerando seu relatório estratégico...", {
        description: "O Sales Copilot está consolidando todos os insights.",
      })
      const result = await generateFinalReport(user.id)
      if (result?.error) {
        toast.error("Falha ao gerar relatório", { description: result.error })
        showNoCreditsToast()
      } else if (result?.reportId) {
        toast.dismiss()
        showCompletionToast("plano")
        router.push(`/relatorio/${result.reportId}`)
      }
    })
  }

  const isFinalStep = !isDiagnosing && messages[messages.length - 1]?.id.startsWith("diag-end")

  return (
    <div className="h-screen w-full flex bg-black">
      <SidebarSessions />
      <main className="flex-1 flex flex-col relative">
        <header className="flex items-center justify-between p-4 border-b border-zinc-800">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="md:hidden">
              <Menu />
            </Button>
            <h1 className="text-lg font-semibold">Sessão de Chat</h1>
          </div>
          <Button variant="outline" onClick={toggleDrawer} className="gap-2 bg-transparent">
            <FolderOpen className="h-4 w-4" />
            Documentos
          </Button>
        </header>
        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="flex-1 relative">
            {messages.length > 0 ? (
              <ChatScrollArea messages={messages} isLoading={isLoading} />
            ) : (
              <BreakerPanel onSelect={handleBreakerSelect} />
            )}
          </div>
          <div className="p-4 border-t border-zinc-800 bg-black space-y-4">
            {isFinalStep ? (
              <Button
                onClick={handleGenerateReport}
                disabled={isPending}
                size="lg"
                className="w-full animate-pulse-glow"
              >
                <Sparkles className="mr-2 h-4 w-4" />
                Gerar Relatório Estratégico Final
              </Button>
            ) : (
              <>
                {isDiagnosing ? (
                  <div className="mb-2">
                    <Progress value={((diagnosticStep + 1) / TOTAL_BLOCKS) * 100} className="w-full h-2" />
                    <p className="text-xs text-zinc-400 mt-2 text-center">
                      Bloco {diagnosticStep + 1} de {TOTAL_BLOCKS}: {currentBlock.title}
                    </p>
                  </div>
                ) : (
                  <TriggerableDepthSelector onDepthChosen={handleDepthChosen} />
                )}
                <ChatInput
                  input={input}
                  handleInputChange={handleInputChange}
                  handleSubmit={isDiagnosing ? handleDiagnosticSubmit : customHandleSubmit}
                  isLoading={isLoading}
                  isPending={isPending}
                  placeholder={isDiagnosing ? "Sua resposta detalhada aqui..." : "Tire uma dúvida ou peça um plano..."}
                />
              </>
            )}
          </div>
        </div>
        <DocumentsDrawer reports={reports} diagnostics={diagnostics} />
      </main>
    </div>
  )
}
