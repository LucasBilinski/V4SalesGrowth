-- Cria ou substitui a função para incrementar o saldo de créditos de forma atômica
CREATE OR REPLACE FUNCTION public.increment_credit_balance(p_user_id UUID, p_amount INT)
RETURNS void
LANGUAGE plpgsql
AS $$
BEGIN
  -- Garante que o registro de créditos exista para o usuário
  INSERT INTO public.credits (user_id, balance)
  VALUES (p_user_id, 0)
  ON CONFLICT (user_id) DO NOTHING;

  -- Executa o update
  UPDATE public.credits
  SET
    balance = balance + p_amount,
    last_updated = now()
  WHERE user_id = p_user_id;
END;
$$;
