# Founders AI - Site Institucional

Site institucional da **Founders AI**, empresa de consultoria especializada em Inteligência Artificial Generativa, Infraestrutura de Servidores e Cloud Híbrida.

## 🚀 Tecnologias

- **Astro 5** - Static Site Generator otimizado para performance
- **Tailwind CSS 3** - Utility-first CSS com design system customizado
- **TypeScript** - Type safety em todo o projeto
- **GitHub Pages** - Hospedagem estática gratuita e confiável

## 🎨 Design System

- **Cores**: fundo #0d0f11 (preto grafite), painel #151719, texto #f1f0eb, muted #abaeae, destaque #d6b779 (dourado discreto), borda #303335
- **Tipografia**: Space Grotesk (headings) + Inter (body), via Google Fonts
- **Animações**: LEDs em CSS nos racks do hero (2 ciclos de 2s); desativadas com `prefers-reduced-motion: reduce`
- **Acessibilidade**: skip link para conteúdo principal, semântica HTML5 (header/nav/main/section/footer), ARIA labels, foco visível em interativos. Verificado por inspeção — não há afirmação de conformidade WCAG completa.

## 📦 Estrutura do Projeto

```
src/
├── components/
│   ├── Hero.astro          # Hero em duas colunas: cópia + racks de LEDs em CSS
│   ├── About.astro         # História (data center → IA generativa) + processo de 4 passos
│   ├── Services.astro      # 6 cards de serviços com número, descrição e bullets
│   ├── Technologies.astro  # Ecossistema tecnológico (IA, cloud, infra, observabilidade)
│   └── Contact.astro       # Contato em configuração: sem formulário, sem coleta de dados
├── layouts/
│   └── Layout.astro        # Layout raiz com SEO, a11y e fontes
├── pages/
│   └── index.astro         # Página principal (base /founders-ai/)
└── styles/
    └── global.css          # Tailwind v4 @theme + tokens CSS e utilitários
public/
├── favicon.svg             # Marca "A" em dourado
├── manifest.json           # PWA manifest (start_url /founders-ai/)
└── robots.txt              # SEO com sitemap do GitHub Pages
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

## 🌐 Hospedagem no GitHub Pages

O site é um site estático de projeto servido sob `/founders-ai/` (ex: `https://keltec-max.github.io/founders-ai/`). O build é gerado localmente com `npm run build` em `dist/`; não há deploy automático configurado neste repositório — publicar cabe a quem mantém o repositório.

## ♿ Acessibilidade

- Skip link "Pular para o conteúdo principal" → `#main-content`
- Semântica HTML5 (header, nav, main, section, footer)
- ARIA labels e `aria-hidden` em elementos decorativos
- Foco visível em interativos
- `prefers-reduced-motion` respeitado (animações desativadas)
- Sem formulário ativo: não há campos de entrada a validar

> Verificado por inspeção local (keyboard, foco, âncoras, reduced motion) nos viewports 1440×900, 390×844 e 320px. Não há afirmação de conformidade WCAG completa.

## 🔒 Segurança

- Site estático sem backend, sem coleta de dados e sem formulário ativo
- Sem hardcoded secrets, sem credenciais no código
- Cabeçalhos de segurança via meta tags no layout

## 📱 PWA Ready

- Web App Manifest configurado
- Ícones SVG escaláveis
- Shortcuts para Contato e Serviços
- Theme color consistente

## 📄 Licença

Proprietário - Founders AI © 2026