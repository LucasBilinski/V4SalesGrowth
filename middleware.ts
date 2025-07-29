import { NextResponse, type NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  // Encontra o cookie de autenticação do Supabase dinamicamente.
  const supabaseAuthCookie = request.cookies
    .getAll()
    .find((cookie) => cookie.name.startsWith("sb-") && cookie.name.endsWith("-auth-token"))
  const hasSession = !!supabaseAuthCookie

  const { pathname } = request.nextUrl

  // Rotas que um usuário logado não deve acessar (será redirecionado para o dashboard)
  const publicOnlyRoutes = ["/", "/login"]

  // Rotas que exigem que o usuário esteja logado
  const protectedRoutes = ["/dashboard", "/sales-copilot", "/comprar-creditos", "/relatorio"]

  if (hasSession) {
    // Se o usuário tem uma sessão e tenta acessar uma rota pública, redireciona para o dashboard.
    if (publicOnlyRoutes.includes(pathname)) {
      return NextResponse.redirect(new URL("/dashboard", request.url))
    }
  } else {
    // Se o usuário não tem uma sessão e tenta acessar uma rota protegida, redireciona para o login.
    if (protectedRoutes.some((route) => pathname.startsWith(route))) {
      return NextResponse.redirect(new URL("/login", request.url))
    }
  }

  // Permite o acesso se nenhuma das condições de redirecionamento for atendida.
  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - api/stripe-webhook (Stripe webhook)
     * Feel free to modify this pattern to include more paths.
     */
    "/((?!_next/static|_next/image|favicon.ico|api/stripe-webhook|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
}
