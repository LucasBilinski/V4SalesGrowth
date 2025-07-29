"use client"

import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from "@/components/ui/drawer"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useAppStore } from "@/lib/store"
import { FileText, ClipboardList, BarChart3, ExternalLink } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

type Report = { id: string; version: number; score_final: number | null; created_at: string }
type Diagnostic = { id: string; block_title: string; created_at: string }

interface DocumentsDrawerProps {
  reports: Report[]
  diagnostics: Diagnostic[]
}

export function DocumentsDrawer({ reports, diagnostics }: DocumentsDrawerProps) {
  const { isDrawerOpen, closeDrawer } = useAppStore()

  return (
    <Drawer open={isDrawerOpen} onOpenChange={(open) => !open && closeDrawer()} direction="right">
      <DrawerContent className="bg-zinc-900 border-zinc-800 text-white h-full w-full max-w-md ml-auto">
        <div className="container mx-auto py-4 h-full flex flex-col">
          <DrawerHeader>
            <DrawerTitle className="text-2xl font-heading">Seus Documentos</DrawerTitle>
          </DrawerHeader>
          <Tabs defaultValue="reports" className="flex-grow flex flex-col overflow-hidden">
            <TabsList className="grid w-full grid-cols-2 bg-zinc-800">
              <TabsTrigger value="reports">
                <FileText className="mr-2 h-4 w-4" />
                Relatórios
              </TabsTrigger>
              <TabsTrigger value="diagnostics">
                <ClipboardList className="mr-2 h-4 w-4" />
                Diagnósticos
              </TabsTrigger>
            </TabsList>
            <TabsContent value="reports" className="flex-grow overflow-y-auto mt-4 pr-2">
              <DocumentList items={reports} type="report" />
            </TabsContent>
            <TabsContent value="diagnostics" className="flex-grow overflow-y-auto mt-4 pr-2">
              <DocumentList items={diagnostics} type="diagnostic" />
            </TabsContent>
          </Tabs>
        </div>
      </DrawerContent>
    </Drawer>
  )
}

function DocumentList({ items, type }: { items: (Report | Diagnostic)[]; type: "report" | "diagnostic" }) {
  if (items.length === 0) {
    return <p className="text-zinc-400 text-center mt-8">Nenhum documento encontrado.</p>
  }

  return (
    <ul className="space-y-3">
      {items.map((item) => (
        <li
          key={item.id}
          className="flex items-center justify-between bg-zinc-800/50 p-3 rounded-lg border border-zinc-700 hover:border-brand-red/50 transition-colors"
        >
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="flex-shrink-0">
              {type === "report" ? (
                <BarChart3 className="h-5 w-5 text-brand-red" />
              ) : (
                <ClipboardList className="h-5 w-5 text-brand-red" />
              )}
            </div>
            <div className="flex-grow overflow-hidden">
              <p className="font-semibold truncate">
                {type === "report"
                  ? `Relatório v${(item as Report).version} (Score: ${(item as Report).score_final || "N/A"})`
                  : `Diagnóstico: ${(item as Diagnostic).block_title.split(":")[0]}`}
              </p>
              <p className="text-xs text-zinc-400">
                {new Date(item.created_at).toLocaleDateString("pt-BR", { dateStyle: "long" })}
              </p>
            </div>
          </div>
          {type === "report" && (
            <Button variant="ghost" size="sm" asChild className="flex-shrink-0">
              <Link href={`/relatorio/${item.id}`} target="_blank">
                Ver <ExternalLink className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          )}
        </li>
      ))}
    </ul>
  )
}
