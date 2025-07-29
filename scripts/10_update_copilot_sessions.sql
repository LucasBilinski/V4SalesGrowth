-- Adiciona uma coluna para armazenar as tarefas concluídas como um objeto JSON
ALTER TABLE public.copilot_sessions
ADD COLUMN completed_tasks JSONB DEFAULT '{}'::jsonb;

COMMENT ON COLUMN public.copilot_sessions.completed_tasks IS 'Stores a JSON object of completed task identifiers.';
