# HL Parfums

Dois aplicativos independentes no mesmo repositório, ligados ao mesmo banco (Supabase):

| Pasta | O que é | Projeto na Vercel |
|---|---|---|
| `/` (raiz) | **Loja / catálogo** público | Root Directory: *(vazio)* |
| `/admin` | **Painel administrativo** (login, ofertas, nova oferta, lixeira) | Root Directory: `admin` |

A loja não tem nenhuma rota nem link para o painel.

## Publicar na Vercel
1. **Add New → Project → importar `lucasdiaas79/hl-parfums`** → Framework: Next.js → Root Directory vazio → Deploy. (Loja)
2. **Add New → Project → importar o mesmo repositório de novo** → Root Directory: `admin` → Deploy. (Painel)
3. Em cada projeto, **Settings → Domains** para ligar o domínio próprio (ex.: `hlparfums.com.br` na loja e `admin.hlparfums.com.br` no painel).
4. No projeto do **painel**, defina a variável `NEXT_PUBLIC_STORE_URL` com o endereço final da loja (usada no botão "Ver loja").

Nenhuma outra variável é obrigatória: URL e chave pública do Supabase já têm padrão no código (`.env.example` mostra como trocar).

## Banco (Supabase)
- `supabase/migrations/0001_catalogo.sql` — estrutura e segurança
- `supabase/seed.sql` — catálogo inicial (151 perfumes)
- `supabase/migrations/0002_painel.sql` — lixeira, histórico de preço, limpeza automática (30 dias) e administrador inicial

## Painel
- Login pelo número (sem +55) e senha. Internamente o número vira o e-mail `NUMERO@hlparfums.app` no Supabase Auth.
- Para dar acesso a alguém: criar o usuário em Authentication → Users (e-mail `NUMERO@hlparfums.app`, "Auto confirm") e inserir o `user_id` na tabela `admins`.
- A foto é tratada no navegador (modelo U²-Net `u2netp`, Apache-2.0): remove o fundo, aplica preto e enquadra em 675×900 WebP.
