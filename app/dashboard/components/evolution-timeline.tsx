import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { GitCommitVertical, FileText, Rocket } from "lucide-react"
import Link from "next/link"

export interface TimelineItem {
  type: "diagnostico" | "relatorio" | "copiloto" | "export"
  title: string
  subtitle?: string
  timestamp: string
  link?: string
}

const iconMap = {
  relatorio: <FileText className="h-5 w-5 text-white" />,
  copiloto: <Rocket className="h-5 w-5 text-white" />,
  diagnostico: <FileText className="h-5 w-5 text-white" />,
  export: <FileText className="h-5 w-5 text-white" />,
}

export function EvolutionTimeline({ items }: { items: TimelineItem[] }) {
  return (
    <Card className="bg-zinc-900/80 border-zinc-800">
      <CardHeader>
        <div className="flex items-center gap-3">
          <GitCommitVertical className="h-6 w-6 text-brand-red" />
          <div>
            <CardTitle className="text-lg">Sua Linha do Tempo</CardTitle>
            <CardDescription>O registro da sua evolução comercial.</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {items.length > 0 ? (
          <div className="relative pl-4">
            <div className="absolute left-4 top-0 h-full w-0.5 bg-zinc-800" />
            <ul className="space-y-8">
              {items.map((item, index) => (
                <li key={index} className="relative">
                  <div className="absolute -left-2.5 top-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-brand-red">
                    {iconMap[item.type]}
                  </div>
                  <div className="ml-8">
                    <p className="text-sm font-medium text-white">{item.title}</p>
                    {item.subtitle && <p className="text-xs text-zinc-400">{item.subtitle}</p>}
                    <p className="text-xs text-zinc-500 italic mt-1">
                      {new Date(item.timestamp).toLocaleDateString("pt-BR", {
                        day: "2-digit",
                        month: "long",
                        year: "numeric",
                      })}
                    </p>
                    {item.link && (
                      <Link
                        href={item.link}
                        className="text-xs text-brand-red hover:underline mt-1 inline-block font-semibold"
                      >
                        Visualizar
                      </Link>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <p className="text-sm text-zinc-400 text-center py-4">Nenhum evento na sua linha do tempo ainda.</p>
        )}
      </CardContent>
    </Card>
  )
}
