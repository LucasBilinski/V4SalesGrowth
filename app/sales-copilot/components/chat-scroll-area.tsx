"use client"

import type { Message } from "ai"
import { useEffect, useRef } from "react"
import { ChatMessage } from "./chat-message"
import { SmartTypingFeedbackWrapper } from "./smart-typing-feedback-wrapper"

interface ChatScrollAreaProps {
  messages: Message[]
  isLoading: boolean
}

export function ChatScrollArea({ messages, isLoading }: ChatScrollAreaProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }
  useEffect(scrollToBottom, [messages])

  const lastUserMessageContent = messages.filter((m) => m.role === "user").pop()?.content
  const showFeedback = isLoading && messages[messages.length - 1]?.role === "user"

  return (
    <div className="flex-grow overflow-y-auto p-4 space-y-4">
      {messages.map((m) => (
        <ChatMessage key={m.id} message={m} />
      ))}
      {/* 3. Substituir o loader antigo pelo novo componente dinâmico */}
      <SmartTypingFeedbackWrapper inputMessage={lastUserMessageContent} isLoading={showFeedback} />
      <div ref={messagesEndRef} />
    </div>
  )
}
