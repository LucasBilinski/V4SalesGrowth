import { Loader2 } from "lucide-react"

const mensagens: { [key: string]: string } = {
  diagnostico: "📊 Realizando diagnóstico técnico e comparando com padrões de mercado...",
  plano_acao: "🛠️ Estruturando plano estratégico com base nos seus desafios...",
  execucao: "🎯 Acompanhando execução e analisando próximo passo...",
  analise_funil: "📈 Analisando funil de conversão e identificando gargalos...",
  pre_reuniao: "🧠 Preparando insights e recomendações para sua reunião...",
  default: "💬 Sales Copilot está processando sua solicitação...",
}

export function SmartTypingFeedback({ module = "default" }: { module: string }) {
  const texto = mensagens[module] || mensagens.default
  return (
    <div className="flex items-center gap-3 text-sm text-zinc-400 italic px-4 py-2 animate-pulse">
      <Loader2 className="w-4 h-4 animate-spin" />
      <p>{texto}</p>
    </div>
  )
}
