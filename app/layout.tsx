import type React from "react"
import type { Metadata } from "next"
import { Montserrat, Archivo_Black } from "next/font/google"
import "./globals.css"
import { cn } from "@/lib/utils"
import { Toaster } from "sonner" // 1. Importar o Toaster

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
})

const archivoBlack = Archivo_Black({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-archivo-black",
})

export const metadata: Metadata = {
  title: "V4SalesAI — Ecossistema de Evolução Comercial com A.I",
  description: "A plataforma de inteligência comercial mais avançada do Brasil.",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-BR">
      <body className={cn("bg-black text-white antialiased", montserrat.variable, archivoBlack.variable)}>
        <div className="fixed left-0 top-0 -z-10 h-full w-full">
          <div className="relative h-full w-full bg-black">
            <div className="absolute bottom-0 left-0 right-0 top-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:14px_24px]"></div>
            <div className="absolute left-0 right-0 top-[-10%] h-[1000px] w-[1000px] rounded-full bg-[radial-gradient(circle_400px_at_50%_300px,#f7373722,transparent)]"></div>
          </div>
        </div>
        {children}
        <Toaster richColors /> {/* 2. Adicionar o componente Toaster aqui */}
      </body>
    </html>
  )
}
