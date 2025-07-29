-- Habilitar RLS para a tabela de perfis
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
-- Política: Usuários podem ver seu próprio perfil
CREATE POLICY "Users can view their own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
-- Política: Usuários podem atualizar seu próprio perfil
CREATE POLICY "Users can update their own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Habilitar RLS para a tabela de créditos
ALTER TABLE public.credits ENABLE ROW LEVEL SECURITY;
-- Política: Usuários podem ver e modificar seus próprios créditos
CREATE POLICY "Users can manage their own credits" ON public.credits FOR ALL USING (auth.uid() = user_id);

-- Habilitar RLS para a tabela de diagnósticos
ALTER TABLE public.diagnostics ENABLE ROW LEVEL SECURITY;
-- Política: Usuários podem gerenciar seus próprios diagnósticos
CREATE POLICY "Users can manage their own diagnostics" ON public.diagnostics FOR ALL USING (auth.uid() = user_id);

-- Habilitar RLS para a tabela de relatórios
ALTER TABLE public.relatorios ENABLE ROW LEVEL SECURITY;
-- Política: Usuários podem gerenciar seus próprios relatórios
CREATE POLICY "Users can manage their own reports" ON public.relatorios FOR ALL USING (auth.uid() = user_id);

-- Habilitar RLS para a tabela de sessões do copiloto
ALTER TABLE public.copilot_sessions ENABLE ROW LEVEL SECURITY;
-- Política: Usuários podem gerenciar suas próprias sessões de copiloto
CREATE POLICY "Users can manage their own copilot sessions" ON public.copilot_sessions FOR ALL USING (auth.uid() = user_id);

-- Habilitar RLS para a tabela de histórico do agente
ALTER TABLE public.agent_history ENABLE ROW LEVEL SECURITY;
-- Política: Usuários podem gerenciar seu próprio histórico de agente
CREATE POLICY "Users can manage their own agent history" ON public.agent_history FOR ALL USING (auth.uid() = user_id);
