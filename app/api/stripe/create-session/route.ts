import { stripe } from "@/lib/stripe"
import { NextResponse } from "next/server"
import { headers } from "next/headers"

// Seus Price IDs reais do Stripe devem ser colocados aqui.
// Estes são placeholders.
const PRICING = {
  start: { price_id: "price_1Rpj532f6hyTXKFX5eLLPQsZ", creditos: 197 },
  growth: { price_id: "price_1Rpj612f6hyTXKFXxis1bDWu", creditos: 397 },
  pro: { price_id: "price_1Rpj6i2f6hyTXKFXxjFV5Ulf", creditos: 697 },
  master: { price_id: "price_1Rpj7I2f6hyTXKFXaLM7Z9Ct", creditos: 997 },
}

export async function POST(req: Request) {
  try {
    const origin = headers().get("origin")
    const { userId, plano } = await req.json()

    if (!userId || !plano) {
      return NextResponse.json({ error: "userId e plano são obrigatórios." }, { status: 400 })
    }

    const planoSelecionado = PRICING[plano as keyof typeof PRICING]

    if (!planoSelecionado) {
      return NextResponse.json({ error: "Plano inválido." }, { status: 400 })
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: [
        {
          price: planoSelecionado.price_id,
          quantity: 1,
        },
      ],
      metadata: {
        user_id: userId,
        creditos: planoSelecionado.creditos,
      },
      // URL de sucesso atualizada para a nova página
      success_url: `${origin}/obrigado`,
      cancel_url: `${origin}/comprar-creditos?canceled=true`,
    })

    return NextResponse.json({ url: session.url })
  } catch (error: any) {
    console.error("[STRIPE_SESSION_ERROR]", error)
    return NextResponse.json({ error: "Erro ao criar sessão com Stripe." }, { status: 500 })
  }
}
