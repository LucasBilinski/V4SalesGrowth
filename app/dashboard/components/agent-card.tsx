import Link from "next/link"
import type { ReactNode } from "react"

interface AgentCardProps {
  title: string
  description: string
  icon: ReactNode
  route: string
}

export function AgentCard({ title, description, icon, route }: AgentCardProps) {
  return (
    <Link
      href={route}
      className="group block bg-zinc-900/80 border border-zinc-800 hover:border-brand-red/70 hover:shadow-lg hover:shadow-brand-red/10 p-6 rounded-xl transition-all duration-300 hover:-translate-y-1"
    >
      <div className="mb-4">{icon}</div>
      <h3 className="text-xl font-bold font-heading mb-2 text-white">{title}</h3>
      <p className="text-sm text-zinc-400 leading-relaxed">{description}</p>
    </Link>
  )
}
