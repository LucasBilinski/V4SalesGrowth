import { headers } from "next/headers"
import { NextResponse } from "next/server"
import type Stripe from "stripe"
import { stripe } from "@/lib/stripe"
import { logTopUp } from "@/app/actions/credits"

export async function POST(req: Request) {
  const body = await req.text()
  const signature = headers().get("Stripe-Signature") as string

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET!)
  } catch (err: any) {
    console.error("⚠️ Erro na verificação do webhook Stripe:", err.message)
    return new NextResponse(`Webhook Error: ${err.message}`, { status: 400 })
  }

  const session = event.data.object as Stripe.Checkout.Session

  if (event.type === "checkout.session.completed") {
    if (!session?.metadata?.user_id || !session?.metadata?.creditos) {
      return new NextResponse("Webhook Error: Metadados da sessão (user_id, creditos) ausentes.", { status: 400 })
    }

    const userId = session.metadata.user_id
    const creditsPurchased = Number(session.metadata.creditos)

    if (isNaN(creditsPurchased) || creditsPurchased <= 0) {
      return new NextResponse("Webhook Error: Valor de créditos inválido.", { status: 400 })
    }

    // Delegar a lógica para a action refatorada
    await logTopUp(userId, creditsPurchased, "stripe", session.payment_intent as string)
    console.log(`✅ Créditos (${creditsPurchased}) processados para o usuário ${userId}`)
  }

  return new NextResponse(null, { status: 200 })
}
