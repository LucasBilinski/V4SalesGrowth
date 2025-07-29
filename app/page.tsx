"use client"
import { motion } from "framer-motion"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { TrustedByCarousel } from "@/app/components/trusted-by-carousel"
import { Bot, BarChart3, BrainCircuit, Rocket, Check, X, ArrowRight } from "lucide-react"
import { useState, useEffect, useRef } from "react"
import { cn } from "@/lib/utils"
import { getFullYear } from "@/lib/utils"
import { ChatSimulationSection } from "@/app/components/chat-simulation-section"

const useScroll = () => {
  const [scrolled, setScrolled] = useState(false)
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10)
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])
  return scrolled
}

export default function LandingPageV4SalesAI() {
  return (
    <div className="flex flex-col min-h-screen bg-black font-sans text-white">
      <Header />
      <main className="flex-grow">
        <HeroSection />
        <TrustedBySection />
        <DetailedServicesSection />
        <ChatSimulationSection />
        <WhyUseAISection />
        <PricingSection />
        <FinalCTASection />
      </main>
      <Footer />
    </div>
  )
}

function Header() {
  const scrolled = useScroll()
  return (
    <header
      className={cn(
        "sticky top-0 z-50 transition-all duration-300",
        scrolled ? "bg-black/80 backdrop-blur-sm border-b border-zinc-800" : "bg-transparent",
      )}
    >
      <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
        <Link href="/" className="flex items-center gap-2">
          <Bot className="h-8 w-8 text-brand-red" />
          <span className="text-xl font-heading font-bold">V4SalesAI</span>
        </Link>
        <nav className="flex items-center gap-4">
          <Button variant="ghost" asChild>
            <Link href="/login">Login</Link>
          </Button>
          <Button className="bg-brand-red hover:bg-brand-red/90 text-white" asChild>
            <Link href="/login">Começar Agora</Link>
          </Button>
        </nav>
      </div>
    </header>
  )
}

function HeroSection() {
  return (
    <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 text-center">
      <div className="container mx-auto px-4 md:px-6 relative">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="font-heading text-4xl md:text-6xl lg:text-7xl font-bold tracking-tighter"
        >
          <span className="text-brand-red">Inteligência Comercial com IA</span> <br className="hidden md:block" /> para
          Quem Quer Vender Mais
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mt-6 max-w-3xl mx-auto text-lg md:text-xl text-zinc-300"
        >
          Um copiloto de vendas estratégico que entende, analisa, planeja e executa ao seu lado.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-8 flex flex-col items-center justify-center gap-4"
        >
          <Button
            size="lg"
            className="relative bg-brand-red hover:bg-brand-red/90 text-white font-bold px-8 py-6 text-lg animate-pulse-glow"
            asChild
          >
            <Link href="/login">Começar com Créditos Gratuitos</Link>
          </Button>
          <p className="text-sm text-zinc-400">💰 Pague apenas pelos insights que consumir</p>
        </motion.div>
      </div>
    </section>
  )
}

function TrustedBySection() {
  return (
    <section className="py-20 md:py-28 bg-black">
      <div className="container mx-auto px-4 md:px-6 text-center">
        <h2 className="text-3xl md:text-4xl font-bold font-heading tracking-tight">
          Confiado pelas <span className="text-brand-red">maiores operações comerciais</span> do Brasil
        </h2>
        <p className="mt-3 text-base md:text-lg text-zinc-400">
          Inteligência validada por empresas que movem bilhões em vendas
        </p>
      </div>
      <div className="mt-12">
        <TrustedByCarousel />
      </div>
    </section>
  )
}

function DetailedServicesSection() {
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

  const servicos = [
    {
      icon: <BarChart3 className="h-8 w-8 text-brand-red" />,
      title: "Diagnóstico Estratégico",
      bullets: [
        "Mapeamento completo do seu funil comercial",
        "Análise de taxas de conversão por etapa",
        "Detecção de gargalos e oportunidades ocultas",
        "Benchmarking com dados reais de mercado",
        "Relatório inteligente gerado por IA (GPT-4o)",
      ],
    },
    {
      icon: <BrainCircuit className="h-8 w-8 text-brand-red" />,
      title: "Plano de Ação Inteligente",
      bullets: [
        "Transformação automática do diagnóstico em plano tático",
        "Tarefas divididas por urgência e impacto",
        "Recomendações detalhadas com instruções práticas",
        "Estrutura replicável para qualquer time comercial",
        "Atualizações adaptativas conforme a evolução do cliente",
      ],
    },
    {
      icon: <Rocket className="h-8 w-8 text-brand-red" />,
      title: "Execução Guiada com IA",
      bullets: [
        "IA consultiva ativa durante toda a jornada",
        "Respostas personalizadas para desafios reais",
        "Suporte motivacional e técnico no dia a dia",
        "Detecção de travas e sugestões de reestruturação",
        "Loop de reauditoria para ciclos de melhoria contínua",
      ],
    },
  ]

  return (
    <section className="py-20 md:py-28 bg-black">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-16">
          <h2 className="font-heading text-3xl md:text-4xl font-bold">
            Explore o que a <span className="text-brand-red">IA faz por você</span>
          </h2>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-zinc-400">
            Cada etapa foi desenhada com inteligência para evoluir seu processo comercial de ponta a ponta.
          </p>
        </div>
        <motion.div
          ref={containerRef}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={{
            visible: { transition: { staggerChildren: 0.15 } },
            hidden: {},
          }}
          className="relative grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto group"
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_400px_at_var(--mouse-x)_var(--mouse-y),rgba(229,9,20,0.08),transparent_80%)] opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10"></div>
          {servicos.map((servico) => (
            <motion.div
              key={servico.title}
              variants={{
                hidden: { opacity: 0, y: 50 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
              }}
              className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-8 flex flex-col hover:border-brand-red/70 hover:-translate-y-2 transition-all duration-300 shadow-lg shadow-transparent hover:shadow-brand-red/10"
            >
              <div className="flex items-center gap-4 mb-6">
                <div className="bg-zinc-800 p-3 rounded-full border border-zinc-700">{servico.icon}</div>
                <h3 className="font-heading text-xl font-bold text-white">{servico.title}</h3>
              </div>
              <ul className="space-y-3">
                {servico.bullets.map((item, j) => (
                  <li key={j} className="flex items-start gap-3">
                    <Check className="h-5 w-5 text-brand-red flex-shrink-0 mt-0.5" />
                    <span className="text-zinc-300">{item}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

function WhyUseAISection() {
  const comparisonData = [
    {
      feature: "Geração de diagnóstico",
      traditional: "Manual, inconsistente",
      copilot: "Inteligente e adaptado",
    },
    {
      feature: "Plano de ação",
      traditional: "Genérico ou inexistente",
      copilot: "Prioritizado por IA",
    },
    {
      feature: "Suporte no dia a dia",
      traditional: "Nenhum",
      copilot: "Chat consultivo em tempo real",
    },
  ]

  return (
    <section className="py-20 md:py-28">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-16">
          <h2 className="font-heading text-3xl md:text-4xl font-bold">
            Por que usar <span className="text-brand-red">IA no Comercial?</span>
          </h2>
        </div>
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="max-w-4xl mx-auto bg-zinc-900/80 border border-zinc-800 rounded-2xl shadow-2xl shadow-brand-red/10"
        >
          <div className="grid grid-cols-3 text-center font-semibold text-zinc-400 p-4 border-b border-zinc-800">
            <div className="text-left"></div>
            <div>Planilhas / Métodos Tradicionais</div>
            <div className="text-brand-red">Sales Copilot com IA</div>
          </div>
          <div className="divide-y divide-zinc-800">
            {comparisonData.map((item) => (
              <div key={item.feature} className="grid grid-cols-3 items-center text-center p-5">
                <div className="text-left font-semibold text-white">{item.feature}</div>
                <div className="flex items-center justify-center gap-2 text-zinc-400">
                  <X className="h-5 w-5 text-red-500/80 flex-shrink-0" />
                  <span>{item.traditional}</span>
                </div>
                <div className="flex items-center justify-center gap-2 text-white">
                  <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
                  <span>{item.copilot}</span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}

function PricingSection() {
  const plans = [
    {
      title: "Start",
      price: "197",
      credits: "197 créditos",
      description: "Diagnóstico completo com IA para entender sua operação comercial.",
      button: "Escolher Start",
      href: "/login",
    },
    {
      title: "Growth",
      price: "397",
      credits: "397 créditos",
      description: "Diagnóstico + acompanhamento inicial da execução com IA.",
      button: "Escolher Growth",
      href: "/login",
      popular: true,
    },
    {
      title: "Pro",
      price: "697",
      credits: "697 créditos",
      description: "Plano completo de estruturação com Copilot estratégico.",
      button: "Escolher Pro",
      href: "/login",
    },
    {
      title: "Master",
      price: "997",
      credits: "997 créditos",
      description: "Para empresas que querem acompanhamento contínuo e profundo.",
      button: "Escolher Master",
      href: "/login",
    },
  ]

  return (
    <section className="py-20 md:py-28 bg-black" id="planos">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-16">
          <h2 className="font-heading text-3xl md:text-4xl font-bold">
            Comece com créditos e <span className="text-brand-red">pague apenas pelo que usar</span>
          </h2>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-zinc-300">
            Créditos são usados para alimentar todas as ações dos agentes de IA. Recarregue para continuar sua jornada
            de alta performance.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
          {plans.map((plan) => (
            <div
              key={plan.title}
              className={cn(
                "relative bg-zinc-900/50 border-2 rounded-2xl p-6 flex flex-col hover:-translate-y-2 transition-all duration-300",
                plan.popular
                  ? "border-brand-red shadow-2xl shadow-brand-red/20"
                  : "border-zinc-800 hover:border-brand-red/50",
              )}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-brand-red text-white px-4 py-1 text-sm font-bold rounded-full shadow-lg shadow-brand-red/20">
                  MAIS POPULAR
                </div>
              )}
              <div className="flex-grow pt-4">
                <h3 className="font-heading text-2xl font-bold">{plan.title}</h3>
                <p className="text-zinc-400 mt-2 mb-4 font-semibold">{plan.credits}</p>
                <p className="text-5xl font-bold my-4">
                  <span className="text-zinc-400 text-2xl font-medium align-top">R$ </span>
                  {plan.price}
                </p>
                <p className="text-zinc-300 text-sm leading-relaxed mb-6 flex-grow">{plan.description}</p>
              </div>
              <Button
                asChild
                className={cn(
                  "w-full mt-auto font-bold text-base py-6",
                  plan.popular
                    ? "bg-brand-red hover:bg-brand-red/90 text-white"
                    : "bg-zinc-800 hover:bg-zinc-700 text-zinc-200",
                )}
              >
                <Link href={plan.href}>{plan.button}</Link>
              </Button>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function FinalCTASection() {
  return (
    <section className="py-20 md:py-28">
      <div className="container mx-auto px-4 md:px-6 text-center">
        <h2 className="font-heading text-4xl md:text-5xl font-bold tracking-tighter">
          Pronto para <span className="text-brand-red">evoluir sua operação</span> com IA?
        </h2>
        <p className="mt-4 max-w-2xl mx-auto text-lg text-zinc-300">
          Crie sua conta e receba créditos gratuitos para começar seu diagnóstico estratégico agora.
        </p>
        <div className="mt-8">
          <Button
            size="lg"
            className="relative bg-brand-red hover:bg-brand-red/90 text-white font-bold px-8 py-6 text-lg animate-pulse-glow"
            asChild
          >
            <Link href="/login">
              Começar Agora com IA <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  )
}

function Footer() {
  return (
    <footer className="border-t border-zinc-800">
      <div className="container mx-auto flex flex-col md:flex-row items-center justify-between py-6 px-4 md:px-6 text-sm text-zinc-400">
        <div className="flex items-center gap-2">
          <Bot className="h-5 w-5 text-zinc-500" />
          <p>Um produto com +R$1 Bi transacionado em vendas.</p>
        </div>
        <div className="flex gap-4 mt-4 md:mt-0">
          <Link href="#" className="hover:text-white">
            Termos de Uso
          </Link>
          <Link href="#" className="hover:text-white">
            Política de Privacidade
          </Link>
          <p>&copy; {getFullYear()} V4SalesAI</p>
        </div>
      </div>
    </footer>
  )
}
