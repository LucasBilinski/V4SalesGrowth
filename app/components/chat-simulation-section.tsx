"use client"

import { useState, useEffect, memo } from "react"
import { motion, useMotionValue, useTransform, animate, AnimatePresence } from "framer-motion"
import { Bot, User } from "lucide-react"
import { cn } from "@/lib/utils"

const chatScript = [
  {
    role: "user",
    content: "Minha taxa de conversão de propostas está muito baixa. Não sei o que fazer.",
  },
  {
    role: "assistant",
    content: "Entendido. Analisando seu funil e comparando com benchmarks de mercado em tempo real...",
  },
  {
    role: "assistant",
    content:
      "Detectei o gargalo principal. Seu processo de follow-up pode ser otimizado. Sugiro um plano de 3 ações imediatas. Deseja ver?",
  },
  { role: "user", content: "Sim, por favor!" },
  {
    role: "assistant",
    content:
      "Plano de Ação: 1. Implementar cadência de 5 contatos. 2. Usar o template 'Reconexão de Valor'. 3. Agendar re-apresentação focada em ROI. Posso te guiar em cada etapa.",
  },
]

const TypingAnimation = memo(({ text, onComplete }: { text: string; onComplete: () => void }) => {
  const count = useMotionValue(0)
  const rounded = useTransform(count, (latest) => Math.round(latest))
  const displayText = useTransform(rounded, (latest) => text.slice(0, latest))

  useEffect(() => {
    const controls = animate(count, text.length, {
      type: "tween",
      duration: text.length * 0.04,
      ease: "linear",
      onComplete,
    })
    return controls.stop
  }, [text, count, onComplete])

  return (
    <div className="flex items-center">
      <motion.span>{displayText}</motion.span>
      <motion.div
        className="inline-block h-4 w-0.5 bg-zinc-400 ml-1"
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 1, 0] }}
        transition={{ duration: 0.8, repeat: Number.POSITIVE_INFINITY }}
      />
    </div>
  )
})
TypingAnimation.displayName = "TypingAnimation"

export function ChatSimulationSection() {
  const [messages, setMessages] = useState<(typeof chatScript)[number][]>([])
  const [currentTypingMessage, setCurrentTypingMessage] = useState("")

  useEffect(() => {
    setMessages([])
    setCurrentTypingMessage("")
    let messageIndex = 0
    let timeoutId: NodeJS.Timeout

    const processNextMessage = () => {
      if (messageIndex >= chatScript.length) {
        // Restart after a delay
        timeoutId = setTimeout(() => {
          setMessages([])
          setCurrentTypingMessage("")
          messageIndex = 0
          processNextMessage()
        }, 5000)
        return
      }

      const currentMessage = chatScript[messageIndex]

      if (currentMessage.role === "user") {
        setMessages((prev) => [...prev, currentMessage])
        messageIndex++
        timeoutId = setTimeout(processNextMessage, 1500)
      } else {
        setCurrentTypingMessage(currentMessage.content)
      }
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          if (timeoutId) clearTimeout(timeoutId)
          processNextMessage()
        } else {
          if (timeoutId) clearTimeout(timeoutId)
          setMessages([])
          setCurrentTypingMessage("")
          messageIndex = 0
        }
      },
      { threshold: 0.5 },
    )

    const target = document.querySelector("#chat-simulation-container")
    if (target) observer.observe(target)

    return () => {
      if (target) observer.unobserve(target)
      if (timeoutId) clearTimeout(timeoutId)
    }
  }, [])

  const handleTypingComplete = () => {
    const completedMessage = chatScript.find((msg) => msg.content === currentTypingMessage)
    if (completedMessage) {
      setMessages((prev) => [...prev, completedMessage])
    }
    setCurrentTypingMessage("")

    const nextIndex = chatScript.findIndex((msg) => msg.content === currentTypingMessage) + 1
    setTimeout(() => {
      if (nextIndex < chatScript.length) {
        const nextMessage = chatScript[nextIndex]
        if (nextMessage.role === "user") {
          setMessages((prev) => [...prev, nextMessage])
          setTimeout(() => {
            const nextNextIndex = nextIndex + 1
            if (nextNextIndex < chatScript.length) {
              setCurrentTypingMessage(chatScript[nextNextIndex].content)
            }
          }, 1500)
        } else {
          setCurrentTypingMessage(nextMessage.content)
        }
      } else {
        // Restart logic
        setTimeout(() => {
          setMessages([])
          setCurrentTypingMessage(chatScript.find((msg) => msg.role === "assistant")?.content || "")
        }, 5000)
      }
    }, 1000)
  }

  return (
    <section id="chat-simulation-container" className="relative py-20 md:py-28 bg-black overflow-hidden">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(229,9,20,0.3),rgba(255,255,255,0))] opacity-40"></div>
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-16">
          <h2 className="font-heading text-3xl md:text-4xl font-bold">
            Sua Jornada, <span className="text-brand-red">em Tempo Real</span>
          </h2>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-zinc-400">
            A V4SalesAI não é um painel estático. É uma conversa contínua com um especialista que te guia para a alta
            performance.
          </p>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="group max-w-3xl mx-auto bg-zinc-900/30 border border-zinc-800 rounded-2xl shadow-2xl shadow-brand-red/10 backdrop-blur-lg transition-all duration-300 hover:shadow-brand-red/20 hover:scale-[1.02]"
        >
          <div className="h-12 flex items-center px-4 border-b border-zinc-800">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            </div>
            <p className="mx-auto text-sm text-zinc-400">Sales Copilot</p>
          </div>
          <div className="p-6 h-96 flex flex-col space-y-4 overflow-hidden">
            <AnimatePresence>
              {messages.map((msg, i) => (
                <motion.div
                  key={i}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.4 }}
                  className={cn("flex items-start gap-3 max-w-sm", msg.role === "user" ? "self-end" : "self-start")}
                >
                  {msg.role === "assistant" && (
                    <div className="flex-shrink-0 h-8 w-8 rounded-full bg-brand-red/20 flex items-center justify-center border border-brand-red/30">
                      <Bot className="h-5 w-5 text-brand-red" />
                    </div>
                  )}
                  <div
                    className={cn(
                      "rounded-xl px-4 py-2.5 text-sm shadow-md",
                      msg.role === "user"
                        ? "bg-brand-red text-white rounded-br-none"
                        : "bg-zinc-800 text-zinc-200 rounded-bl-none",
                    )}
                  >
                    {msg.content}
                  </div>
                  {msg.role === "user" && (
                    <div className="flex-shrink-0 h-8 w-8 rounded-full bg-zinc-700 flex items-center justify-center border border-zinc-600">
                      <User className="h-5 w-5 text-zinc-300" />
                    </div>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
            {currentTypingMessage && (
              <motion.div
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-start gap-3 max-w-sm self-start"
              >
                <div className="flex-shrink-0 h-8 w-8 rounded-full bg-brand-red/20 flex items-center justify-center border border-brand-red/30">
                  <Bot className="h-5 w-5 text-brand-red" />
                </div>
                <div className="rounded-xl px-4 py-2.5 bg-zinc-800 text-zinc-200 text-sm shadow-md">
                  <TypingAnimation text={currentTypingMessage} onComplete={handleTypingComplete} />
                </div>
              </motion.div>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
