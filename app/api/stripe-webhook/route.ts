import { NextResponse } from "next/server"

export async function POST(req: Request) {
  return new NextResponse("Webhook temporarily disabled", { status: 200 })
}
