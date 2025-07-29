import { NextResponse } from "next/server"

export async function POST(req: Request) {
  return NextResponse.json({ error: "Stripe temporarily disabled" }, { status: 500 })
}
