// ✅ SALES COPILOT — ROUTER DE MÓDULOS INTELIGENTES
// Função: Detectar intenções no texto do usuário e ativar módulos internos de forma programática

/**
 * Mapeia automaticamente o tipo de tarefa em execução para exibir a mensagem correta no SmartTypingFeedback.
 * @param mensagem A mensagem do usuário.
 * @returns O ID do módulo detectado ou 'default'.
 */
export function detectarModuloPorMensagem(mensagem = ""): string {
  const texto = mensagem.toLowerCase()
  if (texto.includes("diagnóstico") || texto.includes("auditoria") || texto.includes("mapear")) {
    return "diagnostico"
  }
  if (texto.includes("plano de ação") || texto.includes("estruturação") || texto.includes("organizar plano")) {
    return "plano_acao"
  }
  if (texto.includes("executar") || texto.includes("ação atual") || texto.includes("me ajude a fazer")) {
    return "execucao"
  }
  if (texto.includes("funil") || texto.includes("conversão") || texto.includes("taxas de etapa")) {
    return "analise_funil"
  }
  if (texto.includes("reunião") || texto.includes("me preparar") || texto.includes("briefing")) {
    return "pre_reuniao"
  }
  return "default"
}
