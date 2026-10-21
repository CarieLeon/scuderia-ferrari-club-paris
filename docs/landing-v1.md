# Landing page V1 — Scuderia Ferrari Club Paris

La nouvelle page d’accueil suit la vidéo de référence : rouge laqué, studio sombre, reflets métalliques et mise en scène automobile. L’accroche « L’Italie au cœur. Paris en rouge. » relie l’héritage de Maranello à la communauté parisienne. Les sections claires apportent des pauses de lecture ; les photos d’archives restent celles du club.

## Parcours

- Introduction en trois chapitres contrôlés par les boutons et les indicateurs.
- Histoire courte, expériences, galerie et accès aux pages existantes.
- Trois produits concept avec visuels générés, prix illustratifs et panier local.
- Menu mobile, FAQ, navigation clavier et respect du mouvement réduit.

Le panier n’a aucun serveur de commande, ne collecte aucune coordonnée et ne déclenche aucun paiement. Les quantités sont limitées à vingt par article. Le navigateur conserve le panier ; la simulation le vide après l’action explicite du visiteur.

## Développement

```sh
npm ci
npm run dev
npm run build
```

Next.js et eslint-config-next sont fixés à 15.5.28 ; Sharp transitif à 0.35.5, conformément au correctif de sécurité Next.js d’octobre 2026. Le build génère les 17 routes et contrôle les types. Un avertissement de ref préexistant demeure dans le Header des anciennes pages.

## Visuels

Outil utilisé : ImageGen intégré, puis optimisation WebP. Les photographies des expériences proviennent de `public/images/` dans le dépôt. Les nouveaux visuels sont illustratifs ; les objets ne constituent pas une offre commerciale officielle.

- `public/images/club-v1/enzo-studio.webp` : Enzo rouge, studio anthracite, sol réfléchissant, lumière rouge, cadrage trois quarts. 1672 × 941, 126 Ko.
- `public/images/collection/cap.webp` : casquette rouge, broderie Paris, coton détaillé, socle noir. 900 × 900, 68 Ko.
- `public/images/collection/tshirt.webp` : t-shirt noir plié, étiquette Club Paris, reflet rouge. 900 × 900, 59 Ko.
- `public/images/collection/keyring.webp` : porte-clés cuir rouge Paris et acier brossé, suspension au-dessus du socle. 900 × 900, 60 Ko.

Prompt commun produits : « Use case: product-mockup. Asset type: square product card image for Scuderia Ferrari Club Paris demonstration merchandise collection. Composition centered single product with ample dark empty space around all edges; product fills center 65% of frame. Premium surreal immaculate showroom art direction coherent with red Enzo against dark studio floor, deep charcoal #141414, crimson red #df202c and grey metallic highlights. Photorealistic high resolution, tasteful softbox overhead. No watermark, no extra props, no people, no website UI. »

Sujets ajoutés à ce prompt : casquette rouge brodée PARIS sans logo Ferrari ; t-shirt noir plié avec étiquette CLUB PARIS sans logo Ferrari ; porte-clés cuir rouge marqué PARIS avec anneau acier sans logo Ferrari. Éclairage latéral rouge et matière réaliste pour chaque objet.

Prompt hero : « Use case: ads-marketing. Asset type: high-end automotive club website hero photograph, cinematic photorealistic 3D automotive render, very wide landscape 16:9. A red Ferrari Enzo supercar, low front three-quarter view, entire car visible, nose pointing left, glossy red paint, black alloy wheels, realistic glass and reflections. Limitless dark charcoal studio, polished black reflective floor, softbox light, deep crimson light behind car, faint haze. Car dominates lower middle and right; generous empty upper 30% for title. Luxurious precise minimalist art direction, red lacquer, brushed aluminium, dramatic shadow, analog film grain. No people, buildings, text, watermark or website UI. »

## Vérifications

Build de production local et Vercel réussis. Contrôle navigateur à 1440 × 950 et 390 × 844 : chapitres, ancres, menu mobile, FAQ, absence de débordement horizontal, ajout des trois produits, quantités, total, persistance après rechargement, suppression et simulation. Relecture indépendante du code et correction du contraste des textes secondaires.

La prévisualisation conserve la protection Vercel existante et demande une connexion. La production n’a pas été remplacée.
