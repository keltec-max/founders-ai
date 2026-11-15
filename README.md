# Founders AI - Site Institucional

Site institucional da **Founders AI**, empresa de consultoria especializada em Inteligência Artificial Generativa, Infraestrutura de Servidores e Cloud Híbrida.

## 🚀 Tecnologias

- **Astro 5** - Static Site Generator otimizado para performance
- **Tailwind CSS 3** - Utility-first CSS com design system customizado
- **TypeScript** - Type safety em todo o projeto
- **GitHub Pages** - Hospedagem estática gratuita e confiável

## 🎨 Design System

- **Cores**: Slate 950 (background) + Gold 500/600 (accent)
- **Tipografia**: Space Grotesk (headings) + Inter (body)
- **Animações**: SVG SMIL + CSS (respeita `prefers-reduced-motion`)
- **Acessibilidade**: WCAG 2.2 AA compliant

## 📦 Estrutura do Projeto

```
src/
├── components/
│   ├── Hero.astro          # Hero com background SVG animado (data center)
│   ├── About.astro         # Sobre nós + diferenciais + stats
│   ├── Services.astro      # 6 cards de serviços
│   ├── Technologies.astro  # Tech stack + certificações
│   └── Contact.astro       # Formulário Formspree + info de contato
├── layouts/
│   └── Layout.astro        # Layout raiz com SEO, a11y, fonts
├── pages/
│   └── index.astro         # Página principal
├── styles/
│   └── global.css          # Tailwind v4 @theme + utilitários customizados
public/
├── favicon.svg             # Logo "F" estilo Forbes
├── manifest.json           # PWA manifest
└── robots.txt              # SEO
.github/workflows/
└── deploy.yml              # GitHub Actions para Pages
```

## 🛠️ Desenvolvimento Local

```bash
# Instalar dependências
npm install

# Iniciar servidor de desenvolvimento
npm run dev

# Build para produção
npm run build

# Preview do build
npm run preview
```

## 🌐 Deploy no GitHub Pages

1. Push para branch `main`/`master`
2. GitHub Actions executa build e deploy automaticamente
3. Site disponível em `https://<usuario>.github.io/<repo>/` ou domínio customizado

### Configuração de domínio customizado

1. Adicione arquivo `CNAME` em `public/` com seu domínio
2. Configure DNS (A records para GitHub Pages IPs + CNAME www)
3. Ative "Enforce HTTPS" nas settings do Pages

## ♿ Acessibilidade

- Skip link para conteúdo principal
- Semântica HTML5 correta (header, main, section, footer)
- ARIA labels e roles apropriados
- Foco visível (`focus-visible`) em todos os interativos
- Contraste AA em todos os textos
- `prefers-reduced-motion` respeitado
- Formulário com validação client-side e anúncios ARIA

## 🔒 Segurança

- Headers via meta tags (X-Content-Type-Options, Referrer-Policy)
- Formspree para formulário (sem backend próprio)
- Honeypot anti-spam no formulário
- CSP-ready (pode adicionar via `_headers` se necessário)

## 📱 PWA Ready

- Web App Manifest configurado
- Ícones SVG escaláveis
- Shortcuts para Contato e Serviços
- Theme color consistente

## 📄 Licença

Proprietário - Founders AI © 2024