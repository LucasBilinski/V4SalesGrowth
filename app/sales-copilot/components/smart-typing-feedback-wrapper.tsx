"use client"

import { useEffect, useState } from "react"
import { SmartTypingFeedback } from "./smart-typing-feedback"
import { detectarModuloPorMensagem } from "@/lib/intent-detector"

interface SmartTypingFeedbackWrapperProps {
  inputMessage?: string
  isLoading?: boolean
}

export function SmartTypingFeedbackWrapper({ inputMessage = "", isLoading = false }: SmartTypingFeedbackWrapperProps) {
  const [moduloDetectado, setModuloDetectado] = useState("default")

  useEffect(() => {
    if (inputMessage && isLoading) {
      const tipo = detectarModuloPorMensagem(inputMessage)
      setModuloDetectado(tipo)
    } else if (!isLoading) {
      // Reseta o módulo quando o carregamento termina
      setModuloDetectado("default")
    }
  }, [inputMessage, isLoading])

  if (!isLoading) return null

  return <SmartTypingFeedback module={moduloDetectado} />
}
