# Nátalis Persianas — Contexto do Projeto

## Stack
- HTML estático single-page hospedado no **Cloudflare Pages**
- Tailwind CSS estático: `npm run css` gera `public/tailwind.css` a partir de `tailwind.config.js` (rodar sempre que mudar classes no HTML; `npm run build` já faz isso)
- AOS (Animate On Scroll); ícones em sprite SVG inline no início do `<body>` (Font Awesome Free, sem a fonte de ícones)
- Fontes: Montserrat 400/500/600/700 (corpo) e Playfair Display 700/800 (títulos)
- Galeria e avaliações ficam no HTML (não são mais geradas por JS), para buscadores e IAs lerem
- `public/404.html` devolve 404 real; não recriar `_redirects` com `/* /index.html 200`
- `public/llms.txt`: resumo do negócio para IAs; manter em dia com nota, contagem de avaliações e produtos
- Deploy automático: push em `main` → Cloudflare Pages build

## Paleta atual (identidade visual da apresentação comercial)
```
brand-blue:  #2d4255  (slate-navy — botões, fundos escuros)
brand-cyan:  #4e6d80  (azul aço — depoimentos, accents)
brand-slate: #8ba0b0  (slate médio — decorações, texturas)
brand-light: #edf3f7  (off-white azulado — fundo geral)
brand-dark:  #1a2535  (texto escuro)
```

## WhatsApp
Número: `5541999613079`  
Sempre usar `wa.me`: `https://wa.me/5541999613079?text=...`

## SEO atual
- Title: "Persianas e Cortinas Sob Medida em Curitiba | Nátalis"
- Meta description: configurada
- Canonical: `https://natalispersianas.com.br/`
- Open Graph + Twitter Card: configurados (`public/og-image.jpg`, 1200x630)
- Schema.org: JSON-LD `HomeGoodsStore` no `<head>` (telefone = WhatsApp, o mesmo do perfil no Google)
- `public/sitemap.xml` (só a home; atualizar `lastmod` quando o conteúdo mudar) e `public/robots.txt`

## Assets
- Imagens em `/public/assets/` — formato WebP preferido
- Script de otimização: `scripts/optimize-images.js`
- `public/og-image.jpg` fica fora de `assets/` de propósito: é servido só para
  crawlers de link preview, que lidam melhor com JPEG do que com WebP

## Pendências SEO
- [x] Adicionar `<link rel="canonical">`
- [x] Criar `sitemap.xml`
- [x] Criar `robots.txt`
- [x] Adicionar Schema.org LocalBusiness em JSON-LD
- [x] Converter links WhatsApp de `api.whatsapp` para `wa.me`
- [x] FAQ visível (`#faq`) com JSON-LD `FAQPage`, só com fatos já afirmados na página
- [ ] Ampliar o FAQ com respostas da cliente: prazo de entrega, garantia, formas de pagamento, cidades atendidas
