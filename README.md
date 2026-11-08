# HL Parfums — Loja (catálogo)

Catálogo público da HL Parfums. Pedidos pelo WhatsApp. O painel administrativo fica em outro repositório: `lucasdiaas79/hl-parfums-admin`. Os dois usam o mesmo banco no Supabase.

## Publicar na Vercel
Add New → Project → importar este repositório → Next.js → Deploy. Depois, Settings → Domains para o domínio da loja.
Nenhuma variável é obrigatória (URL e chave pública do Supabase têm padrão; veja `.env.example`).

## Como funciona
- Lê os perfumes do Supabase e atualiza sozinho a cada 1 minuto; se o banco estiver fora do ar, usa a cópia local em `src/data/catalogo.json`.
- Mostra perfumes Disponíveis e Esgotados (com selo e botão "Avise-me"); itens ocultos ou na Lixeira não aparecem.
- Fotos do catálogo inicial em `public/fotos`; fotos novas (enviadas pelo painel) vêm do Storage do Supabase.

## Banco (Supabase) — pasta `supabase/`
- `migrations/0001_catalogo.sql` — estrutura e regras de segurança
- `seed.sql` — catálogo inicial (151 perfumes)
- `migrations/0002_painel.sql` — lixeira, histórico de preço, limpeza automática (30 dias) e administrador inicial
