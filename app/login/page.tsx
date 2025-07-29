"use client"

import { Label } from "@/components/ui/label"
import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Bot, UserPlus, LogIn, Loader2 } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"
import { signup, login } from "@/app/auth/actions"
import { useActionState } from "react"

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true)

  return (
    <div className="flex min-h-screen items-center justify-center bg-black p-4 font-sans">
      {/* Background Aurora */}
      <div className="fixed left-0 top-0 -z-10 h-full w-full">
        <div className="relative h-full w-full bg-black">
          <div className="absolute bottom-0 left-0 right-0 top-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:14px_24px]"></div>
          <div className="absolute left-0 right-0 top-[-10%] h-[1000px] w-[1000px] rounded-full bg-[radial-gradient(circle_400px_at_50%_300px,#f7373722,transparent)]"></div>
        </div>
      </div>

      <div className="w-full max-w-md">
        <Link href="/" className="mb-8 flex justify-center">
          <Bot className="h-12 w-12 text-brand-red" />
        </Link>
        <AnimatePresence mode="wait">
          <motion.div
            key={isLogin ? "login" : "signup"}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {isLogin ? <LoginForm setIsLogin={setIsLogin} /> : <SignUpForm setIsLogin={setIsLogin} />}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}

const AuthFormWrapper = ({
  children,
  title,
  description,
}: { children: React.ReactNode; title: string; description: string }) => (
  <div className="w-full space-y-6 rounded-2xl border border-zinc-800 bg-black/50 p-8 shadow-2xl shadow-brand-red/10 backdrop-blur-lg">
    <div className="text-center">
      <h2 className="text-center text-3xl font-bold tracking-tight text-white font-heading">{title}</h2>
      <p className="mt-2 text-center text-sm text-zinc-400">{description}</p>
    </div>
    {children}
  </div>
)

function SubmitButton({
  children,
  isPending,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { children: React.ReactNode; isPending: boolean }) {
  return (
    <Button
      type="submit"
      className="w-full bg-brand-red hover:bg-brand-red/90 text-white font-bold animate-pulse-glow"
      disabled={isPending}
      {...props}
    >
      {isPending ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : children}
    </Button>
  )
}

const LoginForm = ({ setIsLogin }: { setIsLogin: (value: boolean) => void }) => {
  const [state, formAction, isPending] = useActionState(login, undefined)

  return (
    <AuthFormWrapper title="Acesse sua Conta" description="Bem-vindo de volta à V4SalesAI.">
      <form action={formAction} className="space-y-6">
        <FloatingLabelInput id="email" label="E-mail" type="email" name="email" />
        <FloatingLabelInput id="password" label="Senha" type="password" name="password" />
        {state?.error && <p className="text-sm text-red-500 text-center">{state.error}</p>}
        <SubmitButton isPending={isPending}>
          <LogIn className="mr-2 h-5 w-5" />
          Entrar
        </SubmitButton>
      </form>
      <SocialLogin />
      <div className="text-center text-sm text-zinc-400">
        <button onClick={() => setIsLogin(false)} className="font-medium text-brand-red hover:text-brand-red/80">
          Não tem uma conta? Crie agora
        </button>
      </div>
    </AuthFormWrapper>
  )
}

const SignUpForm = ({ setIsLogin }: { setIsLogin: (value: boolean) => void }) => {
  const [state, formAction, isPending] = useActionState(signup, undefined)

  return (
    <AuthFormWrapper title="Crie sua Conta" description="Comece sua jornada para a alta performance.">
      <form action={formAction} className="space-y-6">
        <FloatingLabelInput id="full_name" label="Nome Completo" type="text" name="full_name" />
        <FloatingLabelInput id="email" label="E-mail" type="email" name="email" />
        <FloatingLabelInput id="password" label="Senha" type="password" name="password" />
        {/* A confirmação de senha pode ser feita no cliente, mas a simplicidade aqui foca no fluxo do servidor */}
        {state?.error && <p className="text-sm text-red-500 text-center">{state.error}</p>}
        {state?.message && <p className="text-sm text-green-500 text-center">{state.message}</p>}
        <SubmitButton isPending={isPending}>
          <UserPlus className="mr-2 h-5 w-5" />
          Criar Conta
        </SubmitButton>
      </form>
      <SocialLogin />
      <div className="text-center text-sm text-zinc-400">
        <button onClick={() => setIsLogin(true)} className="font-medium text-brand-red hover:text-brand-red/80">
          Já tem uma conta? Faça login
        </button>
      </div>
    </AuthFormWrapper>
  )
}

const SocialLogin = () => (
  <>
    <div className="relative">
      <div className="absolute inset-0 flex items-center">
        <div className="w-full border-t border-zinc-700" />
      </div>
      <div className="relative flex justify-center text-sm">
        <span className="bg-black px-2 text-zinc-500">Ou continue com</span>
      </div>
    </div>
    <div className="grid grid-cols-1 gap-3">
      <Button variant="outline" className="w-full bg-transparent border-zinc-700 hover:bg-zinc-800 hover:text-white">
        <svg className="mr-2 h-5 w-5" role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <title>Google</title>
          <path
            fill="currentColor"
            d="M12.48 10.92v3.28h7.84c-.24 1.84-.85 3.18-1.73 4.1-1.02 1.02-2.62 1.9-4.63 1.9-3.87 0-7-3.13-7-7s3.13-7 7-7c2.25 0 3.67.9 4.5 1.7l2.5-2.5C20.04 2.62 16.87 1 12.48 1 5.88 1 1 5.88 1 12.48s4.88 11.48 11.48 11.48c6.3 0 11-4.4 11-11.15 0-.76-.07-1.5-.2-2.23h-9.8z"
          />
        </svg>
        Google
      </Button>
    </div>
  </>
)

const FloatingLabelInput = ({
  id,
  label,
  type,
  name,
}: {
  id: string
  label: string
  type: string
  name: string
}) => {
  return (
    <div className="relative">
      <Input
        id={id}
        name={name}
        type={type}
        required
        className="peer h-12 bg-zinc-900 border-zinc-700 focus:ring-brand-red focus:border-brand-red pt-4 placeholder:text-transparent"
        placeholder={label}
      />
      <Label
        htmlFor={id}
        className="absolute left-3 top-3 text-zinc-400 transition-all duration-300 peer-placeholder-shown:top-3 peer-placeholder-shown:text-base peer-focus:-top-0.5 peer-focus:text-brand-red peer-focus:text-xs peer-[:not(:placeholder-shown)]:-top-0.5 peer-[:not(:placeholder-shown)]:text-brand-red peer-[:not(:placeholder-shown)]:text-xs"
      >
        {label}
      </Label>
    </div>
  )
}
