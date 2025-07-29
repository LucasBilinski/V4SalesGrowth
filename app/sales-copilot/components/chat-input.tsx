"use client"

import type React from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Send, Loader2 } from "lucide-react"

interface ChatInputProps {
  input: string
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void
  isLoading: boolean
  isPending: boolean
  placeholder?: string
}

export function ChatInput({
  input,
  handleInputChange,
  handleSubmit,
  isLoading,
  isPending,
  placeholder,
}: ChatInputProps) {
  return (
    <form onSubmit={handleSubmit} className="flex items-center gap-2">
      <Input
        value={input}
        onChange={handleInputChange}
        placeholder={placeholder || "Tire uma dúvida ou peça um plano..."}
        className="flex-grow bg-zinc-900 border-zinc-700 focus:ring-brand-red"
        disabled={isLoading || isPending}
      />
      <Button type="submit" disabled={isLoading || isPending || !input.trim()} size="icon">
        {isLoading || isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
      </Button>
    </form>
  )
}
