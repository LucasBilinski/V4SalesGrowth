"use client"

import { useRef, useEffect } from "react"
import Image from "next/image"
import { motion } from "framer-motion"

const features = [
  {
    title: "Agente Auditor",
    description:
      "Um diagnóstico profundo que revela gargalos, calcula taxas de conversão e cria um plano de ação estratégico baseado em benchmarks reais do mercado.",
    image: "/auditor-visual-final.png",
  },
  {
    title: "Agente Copiloto",
    description:
      "Seu guia de execução contínua. O Copiloto transforma o relatório em ações diárias, ajudando seu time a implementar cada etapa e evoluir em tempo real.",
    image: "/copilot-visual.png",
  },
  {
    title: "Ecossistema Inteligente",
    description:
      "Agentes com memória e lógica adaptativa. A V4SalesAI não é um chatbot, é um sistema vivo que aprende com seu processo comercial.",
    image: "/ecosystem-visual.png",
  },
]

export function GlowingFeaturesGrid() {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top
      container.style.setProperty("--mouse-x", `${x}px`)
      container.style.setProperty("--mouse-y", `${y}px`)
    }

    container.addEventListener("mousemove", handleMouseMove)

    return () => {
      container.removeEventListener("mousemove", handleMouseMove)
    }
  }, [])

  return (
    <section className="py-20 md:py-28">
      <div className="container mx-auto px-4 md:px-6 text-center">
        <h2 className="font-heading text-3xl md:text-4xl font-bold">
          Sua Operação Comercial, <span className="text-brand-red">Amplificada.</span>
        </h2>
        <p className="mt-4 max-w-2xl mx-auto text-lg text-zinc-300">
          Ferramentas de I.A. construídas para um único propósito: acelerar suas vendas.
        </p>
      </div>
      <div
        ref={containerRef}
        className="relative container mx-auto px-4 md:px-6 mt-16 grid grid-cols-1 lg:grid-cols-3 gap-8 group"
      >
        {/* Efeito de Spotlight */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_400px_at_var(--mouse-x)_var(--mouse-y),rgba(229,9,20,0.15),transparent_80%)] opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10"></div>

        {features.map((feature, index) => (
          <motion.div
            key={feature.title}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1, ease: "easeOut" }}
            className="relative bg-zinc-900 border border-white/10 rounded-2xl overflow-hidden group-[.no-hover]:border-transparent transition-all duration-300 hover:border-brand-red/50 hover:-translate-y-2"
          >
            <div className="h-48 relative overflow-hidden">
              <Image
                src={feature.image || "/placeholder.svg"}
                alt={feature.title}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 to-transparent"></div>
            </div>
            <div className="p-6">
              <h3 className="font-heading text-2xl font-bold text-white mb-4">{feature.title}</h3>
              <p className="text-zinc-400 text-base">{feature.description}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  )
}
