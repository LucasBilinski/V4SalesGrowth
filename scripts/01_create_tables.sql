-- Tabela para armazenar perfis de usuário, estendendo a tabela auth.users
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  avatar_url TEXT
);
-- Comentário sobre a tabela de perfis
COMMENT ON TABLE public.profiles IS 'Stores public profile information for each user, extending the built-in auth.users table.';

-- Tabela para gerenciar os créditos de cada usuário
CREATE TABLE public.credits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  balance INT NOT NULL DEFAULT 10, -- Usuários começam com 10 créditos
  last_updated TIMESTAMPTZ DEFAULT now()
);
-- Comentário sobre a tabela de créditos
COMMENT ON TABLE public.credits IS 'Manages the credit balance for each user to use the AI agents.';

-- Tabela para armazenar os resultados de cada bloco do diagnóstico
CREATE TABLE public.diagnostics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  block_number INT NOT NULL,
  block_title TEXT NOT NULL,
  response_text TEXT,
  score INT,
  version VARCHAR(255) DEFAULT '1.0',
  created_at TIMESTAMPTZ DEFAULT now()
);
-- Comentário sobre a tabela de diagnósticos
COMMENT ON TABLE public.diagnostics IS 'Stores results from each step of the diagnostic agent.';

-- Tabela para armazenar os relatórios finais gerados
CREATE TABLE public.relatorios (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  diagnostic_id UUID REFERENCES public.diagnostics(id) ON DELETE SET NULL,
  summary TEXT,
  swot JSONB,
  plan_curto TEXT,
  plan_medio TEXT,
  plan_longo TEXT,
  score_final INT,
  created_at TIMESTAMPTZ DEFAULT now()
);
-- Comentário sobre a tabela de relatórios
COMMENT ON TABLE public.relatorios IS 'Contains the final generated reports based on diagnostics.';

-- Tabela para as sessões do Agente Copiloto
CREATE TABLE public.copilot_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  related_report_id UUID REFERENCES public.relatorios(id) ON DELETE CASCADE,
  notes TEXT,
  stage VARCHAR(255),
  completed_steps INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);
-- Comentário sobre a tabela de sessões do copiloto
COMMENT ON TABLE public.copilot_sessions IS 'Tracks user progress and notes during copilot-guided execution.';

-- Tabela para o histórico de conversas com todos os agentes
CREATE TABLE public.agent_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  agent_name VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  is_user BOOLEAN NOT NULL,
  context_snapshot JSONB,
  timestamp TIMESTAMPTZ DEFAULT now()
);
-- Comentário sobre a tabela de histórico do agente
COMMENT ON TABLE public.agent_history IS 'Logs all interactions between users and AI agents for memory and continuity.';
