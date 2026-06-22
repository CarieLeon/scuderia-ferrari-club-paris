# Scuderia Ferrari Club Paris — Site vitrine

Site vitrine du **Scuderia Ferrari Club Paris**, club officiel Ferrari. Construit
avec Next.js 15 (App Router), TypeScript, Tailwind CSS, Motion et Lenis.

## Stack technique

- **Next.js 15** (App Router) + **TypeScript**
- **Tailwind CSS 3** + `tailwindcss-animate`
- **Motion** (`motion/react`) pour les animations
- **Lenis** (`lenis/react`) pour le smooth scroll global
- **shadcn/ui** (Button, Card, Dialog) + **lucide-react**
- `next/image` pour toutes les images, `next/font` (Inter + Anton)

## Démarrage

```bash
npm install
npm run dev      # http://localhost:3000
```

```bash
npm run build    # build de production
npm run start    # sert le build de production
npm run lint     # ESLint
```

## Structure

```
public/
  images/            # logo, hero, rassemblement-3, champagne-2016, membres, diner-pozzi, f1-sf70h
  videos/Pozzi.mp4
src/
  app/               # routes App Router
    page.tsx                 # Accueil
    presentation/            # Présentation
    galerie/                 # Galerie (filtres + masonry + lightbox)
    evenements/              # Timeline des événements (+ vidéo Pozzi)
    actualites/              # Blog
    actualites/[slug]/       # Article (SSG)
    adhesion/                # Adhésion (avantages + formulaire)
    contact/                 # Contact (formulaire + infos)
    not-found.tsx            # 404
    sitemap.ts, robots.ts, layout.tsx, globals.css
  components/         # Header, Footer, HeroSlider, Gallery, Reveal, AnimatedCounter,
                     # SectionHeading, PageHeader, MembershipForm, ContactForm, ui/*
  lib/               # site.ts, images.ts, content.ts, image-dimensions.json, utils.ts
```

## Données & contenu

Tout le contenu éditorial (événements, articles, équipe, chiffres, avantages) est
centralisé dans `src/lib/content.ts`. Les chemins d'images et leurs dimensions
réelles (pour un masonry sans layout-shift) sont dans `src/lib/images.ts` et
`src/lib/image-dimensions.json`. La configuration globale (navigation, contact,
réseaux) est dans `src/lib/site.ts`.

## Formulaires

Les formulaires d'**adhésion** et de **contact** sont fonctionnels côté client
(validation + état de confirmation) mais **ne sont pas encore connectés à un
backend**. Pour envoyer réellement les messages, branchez un Route Handler
(`app/api/.../route.ts`) ou un service d'emailing (Resend, Formspree, etc.) dans
`src/components/MembershipForm.tsx` et `src/components/ContactForm.tsx`.

## Déploiement (Vercel)

Le projet est prêt pour Vercel sans configuration supplémentaire :

```bash
vercel        # déploiement preview
vercel --prod # déploiement production
```

Pensez à mettre à jour `siteConfig.url` dans `src/lib/site.ts` avec le domaine
final (utilisé pour les metadata SEO, le sitemap et l'Open Graph).
