
# 🧠 DOCUMENTAÇÃO CONTEXTUAL – V4SalesGrowth

Este diretório contém **toda a inteligência estratégica, técnica, operacional e comercial** da plataforma V4SalesGrowth. Ele serve como **base referencial obrigatória** para qualquer agente de IA, desenvolvedor, colaborador ou mantenedor do projeto.

---

## 📂 Estrutura da Pasta

Os arquivos estão nomeados por blocos numerados, como:

- `01_Visao_Geral.md`
- `02_Arquitetura_Tecnica.md`
- ...
- `23_Webhook_Stripe_Creditos.md`

Cada um desses arquivos representa uma **camada do sistema**, com instruções precisas sobre funcionamento, decisões técnicas, fluxos, regras de negócio e integrações.

---

## 🧠 Como usar com IA (ex: Cursor, GPTs ou agentes)

Sempre que for usar este projeto com uma IA que tenha acesso ao filesystem, siga este protocolo:

### Etapa 1 – Leitura obrigatória
Instrua a IA com o seguinte comando:

```
Leia todos os arquivos da pasta /docs/contexto_geral.
Você só pode tomar decisões com base no conteúdo destes arquivos.
É proibido usar qualquer inferência externa ou outro repositório de dados.
```

### Etapa 2 – Restrições
A IA deve seguir as seguintes regras:

- ❌ NÃO usar código herdado de outros projetos
- ❌ NÃO inferir lógicas que não estejam nos arquivos
- ❌ NÃO propor mudanças estruturais sem validação nos documentos

- ✅ SIM, deve referenciar explicitamente os arquivos nos quais se baseou
- ✅ SIM, deve operar em cima da arquitetura oficial descrita aqui
- ✅ SIM, deve manter as decisões de branding, naming, rotas e tokens já definidas

---

## 🎯 Finalidade

Esta documentação substitui longas reuniões, onboarding demorado e desalinhamentos estratégicos.

> **Tudo o que a plataforma precisa ser, já está aqui.**

Se surgir dúvida, **a resposta está em algum dos arquivos.** Se não estiver, **o arquivo deve ser criado ou atualizado**.

---

## 🔐 Padrões de acesso

- Esta pasta **deve estar presente no repositório oficial**
- Nunca deve ser excluída ou sobrescrita automaticamente
- Deve ser referenciada em qualquer refatoração de infraestrutura

---

## ✅ Status

- [x] Documentação de arquitetura técnica
- [x] Estratégia de segurança e RLS
- [x] Lógica de créditos e monetização
- [x] Webhooks, Stripe e OpenAI
- [x] Memória e DeepResearch do agente
- [x] Organização de rotas, UX, dashboards e IA

---

> Este é o **cérebro organizacional do projeto**. Use com inteligência. Expanda com responsabilidade.
