CREATE OR REPLACE FUNCTION public.deduct_user_credits(p_user_id UUID, p_amount INT)
RETURNS INT
LANGUAGE plpgsql
AS $$
DECLARE
  current_balance INT;
  new_balance INT;
BEGIN
  -- Bloqueia a linha do usuário na tabela de créditos para evitar condições de corrida
  SELECT balance INTO current_balance FROM public.credits WHERE user_id = p_user_id FOR UPDATE;

  -- Se o usuário não tiver um registro de crédito ou o saldo for insuficiente, retorna NULL
  IF NOT FOUND OR current_balance < p_amount THEN
    RETURN NULL;
  END IF;

  -- Calcula o novo saldo e atualiza a tabela
  new_balance := current_balance - p_amount;
  UPDATE public.credits SET balance = new_balance, last_updated = now() WHERE user_id = p_user_id;

  -- Retorna o novo saldo
  RETURN new_balance;
END;
$$;
