-- Cria ou substitui a função para incrementar um campo numérico de forma atômica
CREATE OR REPLACE FUNCTION public.increment_stat_field(user_id_input UUID, field_name TEXT, increment_by INT)
RETURNS void
LANGUAGE plpgsql
AS $$
BEGIN
  -- Garante que o registro de estatísticas exista para o usuário
  INSERT INTO public.usage_stats (user_id)
  VALUES (user_id_input)
  ON CONFLICT (user_id) DO NOTHING;

  -- Executa o update dinâmico
  EXECUTE format('UPDATE public.usage_stats SET %I = %I + %s, last_active_at = now() WHERE user_id = %L',
                 field_name, field_name, increment_by, user_id_input);
END;
$$;
