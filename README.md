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
npm run test:scroll # séquence, réversibilité et intégrité des images
```

## Introduction animée

L’accueil utilise une séquence de 104 images calculées dans Blender Cycles. Le
scroll choisit l’image affichée dans un canvas 2D : profil, ouverture des portes
et capots, puis vue du moteur. Les boutons atteignent les trois poses fixes ;
la préférence de mouvement réduit passe directement de l’une à l’autre.
Les premières images apparaissent sans attendre le chargement de toute la série.
Les fichiers mobiles et le cache des images décodées limitent la mémoire utilisée.

Les images livrées sont dans `public/images/car-sequence`. Le modèle F40 original
de Black Snow est conservé comme source éditable sous `public/models`, avec ses
crédits CC BY 4.0. Il n’est pas chargé par le navigateur.

Pour recalculer la séquence avec Blender 5.2 et Cycles :

```bash
blender --background --python scripts/render-car-sequence.py -- \
  --source public/models/ferrari-f40-rigged.glb \
  --outputdir work/f40-sequence --start 0 --end 103 \
  --width 1280 --height 800 --samples 32 --device AUTO --keys-first
node scripts/encode-car-sequence.mjs work/f40-sequence
npm run test:scroll
```

Le script d’encodage produit les deux résolutions WebP. Lors d’un remplacement
d’images déjà publiées, incrémenter `SEQUENCE_ASSET_VERSION` pour renouveler leur
cache navigateur. Le rendu est également possible sur CPU avec `--device CPU`.

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
                     # SectionHeading, PageHeader, Preloader, GoogleFormEmbed, ContactForm, ui/*
  lib/               # site.ts, images.ts, content.ts, image-dimensions.json, utils.ts
```

## Données & contenu

Tout le contenu éditorial (événements, articles, équipe, chiffres, avantages) est
centralisé dans `src/lib/content.ts`. Les chemins d'images et leurs dimensions
réelles (pour un masonry sans layout-shift) sont dans `src/lib/images.ts` et
`src/lib/image-dimensions.json`. La configuration globale (navigation, contact,
réseaux) est dans `src/lib/site.ts`.

## Formulaires

L'**adhésion** utilise le vrai **Google Form** du club, intégré en iframe
(`src/components/GoogleFormEmbed.tsx`) — les soumissions arrivent directement
dans le formulaire Google.

Le formulaire de **contact** (`src/components/ContactForm.tsx`) est fonctionnel
côté client (validation + état de confirmation) mais **n'est pas encore connecté
à un backend**. Pour envoyer réellement les messages, branchez un Route Handler
(`app/api/.../route.ts`) ou un service d'emailing (Resend, Formspree, etc.).

## Déploiement (Vercel)

Le projet est prêt pour Vercel sans configuration supplémentaire :

```bash
vercel        # déploiement preview
vercel --prod # déploiement production
```

Pensez à mettre à jour `siteConfig.url` dans `src/lib/site.ts` avec le domaine
final (utilisé pour les metadata SEO, le sitemap et l'Open Graph).
