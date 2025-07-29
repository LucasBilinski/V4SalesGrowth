-- Tabela para registrar todas as transações de recarga de crédito
CREATE TABLE public.credit_topups (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  amount INT NOT NULL,
  source VARCHAR(50) NOT NULL DEFAULT 'manual', -- ex: 'stripe', 'manual_admin'
  payment_id TEXT, -- ID da transação do Stripe
  status VARCHAR(50) NOT NULL DEFAULT 'completed', -- ex: 'pending', 'completed', 'failed'
  created_at TIMESTAMPTZ DEFAULT now()
);
COMMENT ON TABLE public.credit_topups IS 'Logs all credit purchase and top-up transactions for auditing.';

-- Habilitar RLS
ALTER TABLE public.credit_topups ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can see their own top-ups" ON public.credit_topups FOR SELECT USING (auth.uid() = user_id);
-- A inserção será feita via backend seguro (webhooks) ou por admins.
