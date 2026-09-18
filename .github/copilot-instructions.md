<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

## Project Setup Checklist for Astro + Tailwind CSS

- [x] Verify that the copilot-instructions.md file in the .github directory is created.
- [x] Scaffold the Astro project with Tailwind CSS
- [x] Install dependencies
- [x] Configure project (Tailwind CSS integrated)
- [x] Create layouts and update pages
- [x] Adapt complete project structure with all components
- [x] Ensure documentation is complete

## Project Info
- **Framework**: Astro (v5)
- **Styling**: Tailwind CSS (v4)
- **Language**: TypeScript
- **Type**: Web Application
- **Client**: Agrimatco Colombia

## Project Structure
```
src/
├── components/
│   ├── Hero.astro           # Landing section with CTA
│   ├── Features.astro       # Service pillars (3 columns)
│   ├── Coverage.astro       # Geographic coverage
│   ├── Products.astro       # Amcopaste product line (4 variants)
│   ├── FAQ.astro           # Frequently asked questions
│   └── Footer.astro        # Footer with contact & map
├── layouts/
│   └── Layout.astro        # Global layout with meta tags
├── pages/
│   └── index.astro         # Main landing page
└── styles/
    └── global.css          # Tailwind CSS import
```

## Setup Summary
✅ Astro project initialized with TypeScript strict mode
✅ Tailwind CSS installed and configured (v4)
✅ Complete layout structure (src/layouts/Layout.astro) with SEO meta tags
✅ Global styles configured (src/styles/global.css)
✅ Hero section with call-to-action buttons
✅ Features/Services section with 3 key pillars
✅ Geographic coverage section (Antioquia, Cundinamarca, Huila)
✅ Product catalog (Enraizamiento, Floración, Balance, Llenado)
✅ FAQ accordion component
✅ Footer with company info and embedded map
✅ All components responsive (mobile-first design)
✅ Project built successfully without errors

## Design System
- **Brand Color**: #007A48 (Green)
- **Text Color**: #111827 (Dark Gray)
- **Background**: #F9FAFB (Light Gray)
- **Font**: Plus Jakarta Sans (400-800 weights)
- **Breakpoints**: sm (640px), md (768px), lg (1024px)

## Quick Start
Run `npm run dev` to start the development server at http://localhost:4321

## Build & Deploy
```bash
npm run build          # Creates dist/ folder for production
npm run preview        # Preview production build locally
```
