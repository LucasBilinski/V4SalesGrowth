import { AlertTriangle } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function SupabaseError() {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <Card className="max-w-md bg-zinc-900 border-zinc-800">
        <CardHeader>
          <div className="flex items-center gap-3">
            <AlertTriangle className="h-8 w-8 text-yellow-500" />
            <div>
              <CardTitle className="text-white">Configuração Necessária</CardTitle>
              <CardDescription>O Supabase não está configurado</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="text-zinc-300">
          <p className="mb-4">Para usar a V4SalesAI, você precisa configurar as variáveis de ambiente do Supabase:</p>
          <ul className="list-disc list-inside space-y-2 text-sm">
            <li>
              <code className="bg-zinc-800 px-2 py-1 rounded">NEXT_PUBLIC_SUPABASE_URL</code>
            </li>
            <li>
              <code className="bg-zinc-800 px-2 py-1 rounded">NEXT_PUBLIC_SUPABASE_ANON_KEY</code>
            </li>
            <li>
              <code className="bg-zinc-800 px-2 py-1 rounded">SUPABASE_SERVICE_ROLE_KEY</code>
            </li>
          </ul>
          <p className="mt-4 text-xs text-zinc-400">Encontre essas chaves no painel do Supabase em Settings → API</p>
        </CardContent>
      </Card>
    </div>
  )
}
