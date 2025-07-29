
# 🛡️ BLOCO 14 — SISTEMA DE PERMISSÕES, NÍVEIS DE ACESSO E ADMINISTRAÇÃO INTERNA

Este documento define o sistema de **controle de acesso inteligente e seguro** da plataforma V4SalesGrowth, incluindo tipos de usuário, permissões por recurso, acesso a dados sensíveis e lógica de administração de créditos e relatórios.

---

## 👥 01 — TIPOS DE USUÁRIOS

| Tipo           | Descrição                                               |
|----------------|----------------------------------------------------------|
| Usuário Padrão | Qualquer pessoa que se registra e consome créditos       |
| Admin          | Equipe interna V4 com visão de gestão                    |
| Super Admin    | Fundadores ou desenvolvedores com acesso irrestrito      |

---

## 🔐 02 — PERMISSÕES POR NÍVEL

| Recurso                     | Usuário | Admin | Super Admin |
|-----------------------------|---------|-------|--------------|
| Ver histórico de IA         | ✅      | ✅    | ✅           |
| Consumir créditos (IA)      | ✅      | ✅    | ✅           |
| Acessar painel geral        | ✅      | ✅    | ✅           |
| Recarregar créditos (Stripe)| ✅      | ✅    | ✅           |
| Visualizar qualquer relatório | ❌    | ✅    | ✅           |
| Ver todas contas de usuário | ❌      | ✅    | ✅           |
| Modificar créditos de outro usuário | ❌ | ✅  | ✅           |
| Acessar painel /admin       | ❌      | ✅    | ✅           |
| Visualizar analytics globais| ❌      | ✅    | ✅           |

---

## 📂 03 — TABELA `profiles` (COM TIPO DE USUÁRIO)

| Campo     | Tipo     | Descrição                         |
|-----------|----------|-----------------------------------|
| id        | UUID     | Vinculado a `auth.users`          |
| full_name | TEXT     | Nome completo                     |
| avatar_url| TEXT     | URL da imagem                     |
| role      | TEXT     | `user` | `admin` | `super_admin` |

> O campo `role` define as permissões do usuário.

---

## 🧠 04 — COMPORTAMENTO DO FRONTEND

### a) Ao logar:

- A role é lida de `profiles.role`
- Contexto é salvo via `supabase.auth.getUser()`
- Middleware protege rotas com base na role

### b) Exemplo de rotas protegidas:

```tsx
if (user?.role !== 'admin') {
  return redirect('/unauthorized');
}
```

---

## 📁 05 — ROTAS EXCLUSIVAS DE ADMIN

| Rota                   | Permissão mínima | Finalidade                             |
|------------------------|------------------|----------------------------------------|
| `/admin/relatorios`    | admin             | Ver todos relatórios da base           |
| `/admin/usuarios`      | admin             | Ver usuários cadastrados               |
| `/admin/creditos`      | admin             | Ajustar créditos manualmente           |
| `/admin/logs`          | admin             | Ver logs e eventos                     |
| `/admin/auditoria`     | super_admin       | Auditoria de mudanças e contexto IA    |

---

## 🔄 06 — FUNÇÕES ADMINISTRATIVAS CRÍTICAS

| Função                    | Descrição                                 |
|---------------------------|--------------------------------------------|
| `grantCredits(uuid, qtd)` | Adiciona créditos manualmente              |
| `updateUserRole()`        | Muda role para `admin` ou `super_admin`    |
| `logEvent()`              | Cria entrada em `event_logs`               |

---

## ⚙️ 07 — CRIAÇÃO DE SUPER ADMIN

Após deploy inicial, a primeira conta criada pode ser marcada manualmente como `super_admin`:

```sql
UPDATE profiles SET role = 'super_admin' WHERE id = 'UUID';
```

---

## 🔄 08 — ADMIN MANAGEMENT INTERNO

| Módulo                      | Controle via painel? | Backend automático? |
|-----------------------------|----------------------|----------------------|
| Ver todos usuários          | ✅                   | ✅                   |
| Editar saldo de créditos    | ✅                   | ✅ (com trigger logs)|
| Resetar relatórios          | ✅                   | ✅                   |
| Exportar base               | ✅                   | 🔒 Somente SuperAdmin|
| Criar usuários manuais      | 🔜                   | 🔜                   |

---

## 🧱 09 — BOAS PRÁTICAS

- Todos acessos logados em `event_logs`
- Toda alteração em dados sensíveis gera snapshot
- SuperAdmins têm privilégios irreversíveis
- Recomendado usar 2FA (via Supabase Auth ou Auth0 no futuro)

---

## ✅ CHECKLIST DE SEGURANÇA

| Item                                  | Status |
|---------------------------------------|--------|
| Campo `role` no profile               | ✅     |
| Middleware por tipo de usuário        | ✅     |
| Painel admin isolado                  | ✅     |
| Logs de alteração                     | ✅     |
| Política RLS aplicada ao Supabase     | ✅     |
| Rotas protegidas no frontend          | ✅     |
| Painel de logs do sistema             | ✅     |

---

> Este sistema permite **controle granular, transparente e seguro** de toda a operação da plataforma — essencial para escalabilidade e governança.
