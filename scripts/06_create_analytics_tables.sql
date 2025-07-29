-- Tabela para registrar eventos chave da plataforma
CREATE TABLE public.event_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  event_type VARCHAR(255) NOT NULL,
  agent_name VARCHAR(255),
  details JSONB,
  timestamp TIMESTAMPTZ DEFAULT now()
);
COMMENT ON TABLE public.event_logs IS 'Logs key user and system events for analytics.';

-- Tabela para agregar estatísticas de uso por usuário
CREATE TABLE public.usage_stats (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  total_blocks_completed INT DEFAULT 0,
  total_reports INT DEFAULT 0,
  total_copilot_sessions INT DEFAULT 0,
  credits_consumed INT DEFAULT 0,
  last_active_at TIMESTAMPTZ DEFAULT now()
);
COMMENT ON TABLE public.usage_stats IS 'Aggregates usage statistics for each user.';

-- Habilitar RLS
ALTER TABLE public.event_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins can see all event logs" ON public.event_logs FOR SELECT USING (true); -- Exemplo, ajustar para roles de admin

ALTER TABLE public.usage_stats ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can see their own stats" ON public.usage_stats FOR SELECT USING (auth.uid() = user_id);
