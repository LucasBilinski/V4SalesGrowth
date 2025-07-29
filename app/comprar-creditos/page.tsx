import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { PurchaseCreditsClientPage } from "./components/purchase-credits-client-page"
import Link from "next/link"
import { Bot, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"

export default async function ComprarCreditosPage() {
  const cookieStore = cookies()
  const supabase = createClient(cookieStore)

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  return (
    <div className="flex min-h-screen flex-col bg-black font-sans text-white">
      <header className="sticky top-0 z-50 border-b border-zinc-800 bg-black/80 backdrop-blur-sm">
        <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
          <Link href="/dashboard" className="flex items-center gap-2">
            <Bot className="h-8 w-8 text-brand-red" />
            <span className="text-xl font-heading font-bold">V4SalesAI</span>
          </Link>
          <Button asChild variant="ghost">
            <Link href="/dashboard">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Voltar ao Dashboard
            </Link>
          </Button>
        </div>
      </header>
      <main className="flex-grow">
        <PurchaseCreditsClientPage user={user} />
      </main>
    </div>
  )
}
