# Nátalis Persianas — Contexto do Projeto

## Stack
- HTML estático single-page hospedado no **Cloudflare Pages**
- Tailwind CSS via CDN (config inline no `<head>`)
- AOS (Animate On Scroll), Font Awesome 6
- Fontes: Montserrat (corpo), Playfair Display (títulos), Dancing Script (decorativo)
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
- Title: "Nátalis Persianas, Elegância e Conforto"
- Canonical: não configurado ainda
- Schema.org: não configurado ainda
- sitemap.xml: não existe ainda
- robots.txt: não existe ainda

## Assets
- Imagens em `/public/assets/` — formato WebP preferido
- Script de otimização: `scripts/optimize-images.js`

## Pendências SEO
- [ ] Adicionar `<link rel="canonical">`
- [ ] Criar `sitemap.xml`
- [ ] Criar `robots.txt`
- [ ] Adicionar Schema.org LocalBusiness em JSON-LD
- [ ] Converter links WhatsApp de `api.whatsapp` para `wa.me`
