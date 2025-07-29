-- Cria a função que será executada pelo gatilho
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER -- Executa com os privilégios do criador da função
AS $$
BEGIN
 -- Insere o perfil público do usuário, usando o email como fallback para o nome
 INSERT INTO public.profiles (id, full_name)
 VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email));

 -- Insere o saldo inicial de créditos para o novo usuário
 INSERT INTO public.credits (user_id, balance)
 VALUES (NEW.id, 15); -- Saldo inicial de 15 créditos

 RETURN NEW;
END;
$$;

-- Cria o gatilho que chama a função após cada novo usuário ser criado na tabela auth.users
CREATE TRIGGER on_auth_user_created
 AFTER INSERT ON auth.users
 FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
