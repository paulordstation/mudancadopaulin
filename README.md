# NovaRota — Checklist de Mudança

App de checklist para organizar uma mudança: viagem, gastos fixos mensais e itens da casa nova. Dark mode, detalhes em roxo neon, animações com Framer Motion, dados persistidos no Supabase.

## Stack

- React + TypeScript + Vite
- Supabase (Postgres) para persistência
- Framer Motion (animações) e Lucide Icons (ícones vetorizados)

## Rodando localmente

```bash
npm install
npm run dev
```

Precisa de um arquivo `.env.local` na raiz (veja `.env.example`):

```
VITE_SUPABASE_URL=https://seu-projeto.supabase.co
VITE_SUPABASE_ANON_KEY=sua-anon-key
```

Esse arquivo é ignorado pelo Git — cada máquina/deploy configura o seu.

## Banco de dados

O schema (tabela `checklist_items`, políticas de acesso e itens iniciais) está em [supabase/schema.sql](supabase/schema.sql). Rode esse script uma vez no SQL Editor do seu projeto Supabase antes de usar o app.

A tabela não tem autenticação — a chave `anon` tem CRUD liberado via RLS. Nunca use as chaves `service_role`/`secret` no frontend.

## Deploy

Deploy feito na [Vercel](https://vercel.com), importando este repositório do GitHub. A Vercel detecta o build do Vite automaticamente (`vite build` → `dist/`). É preciso configurar as mesmas duas variáveis de ambiente (`VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`) nas Environment Variables do projeto na Vercel.

## Scripts

- `npm run dev` — servidor de desenvolvimento
- `npm run build` — checagem de tipos + build de produção
- `npm run lint` — Oxlint
- `npm run preview` — serve o build de produção localmente
