-- Adiciona as colunas para controle de versão na tabela de relatórios
ALTER TABLE public.relatorios
ADD COLUMN version INT NOT NULL DEFAULT 1,
ADD COLUMN is_latest BOOLEAN NOT NULL DEFAULT TRUE;

-- Adiciona um comentário para explicar as novas colunas
COMMENT ON COLUMN public.relatorios.version IS 'Version number for the report, scoped to the user.';
COMMENT ON COLUMN public.relatorios.is_latest IS 'Indicates if this is the most recent report for the user.';
