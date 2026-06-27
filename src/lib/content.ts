/**
 * Editorial content — events, articles, team, stats, club values and
 * membership benefits. All copy is in French. Pages consume this directly.
 */

import {
  champagneImages,
  rassemblementImages,
  dinerPozziImages,
  dinerPozziBanner,
  f1Images,
} from "./images";

/* --------------------------------------------------------------- Events --- */

export type ClubEvent = {
  slug: string;
  title: string;
  date: string; // ISO for <time>
  dateLabel: string; // human label, FR
  location: string;
  category: string;
  excerpt: string;
  description: string[];
  cover: string;
  images: string[];
  /** Optional event video (served from /public/videos). */
  video?: string;
};

export const events: ClubEvent[] = [
  {
    slug: "rassemblement-ferrari-3",
    title: "Rassemblement Ferrari #3",
    date: "2017-09-17",
    dateLabel: "Septembre 2017",
    location: "Paris & Île-de-France",
    category: "Rassemblement",
    excerpt:
      "La troisième édition de notre grand rassemblement parisien : une marée rouge de Cheval Cabré au cœur de la capitale.",
    description: [
      "Pour sa troisième édition, le Rassemblement Ferrari du Club Paris a réuni des dizaines de membres et leurs voitures pour une journée entièrement dédiée à la passion de Maranello.",
      "Des 308 GTB aux dernières 488, en passant par les emblématiques F355, F430 et 458, chaque modèle a trouvé sa place dans une parade aussi sonore que spectaculaire à travers les plus beaux points de vue d'Île-de-France.",
      "La journée s'est conclue par un déjeuner convivial où passionnés de longue date et nouveaux membres ont partagé anecdotes, conseils mécaniques et projets de sorties futures.",
    ],
    cover: rassemblementImages[0],
    images: rassemblementImages,
  },
  {
    slug: "diner-rouge-charles-pozzi",
    title: "Dîner Rouge Charles Pozzi",
    date: "2017-02-23",
    dateLabel: "23 février 2017",
    location: "Showroom Charles Pozzi, Levallois",
    category: "Soirée privée",
    excerpt:
      "Une soirée d'exception au sein du mythique showroom Charles Pozzi, importateur historique de Ferrari en France.",
    description: [
      "Le Dîner Rouge a réuni les membres du club dans un lieu chargé d'histoire : le showroom Charles Pozzi, nom indissociable de l'aventure Ferrari en France.",
      "Entourés des dernières GT du constructeur, les convives ont profité d'une soirée placée sous le signe de l'élégance, de la gastronomie et des récits de course qui font la légende du Cheval Cabré.",
      "Un moment privilégié, fidèle à l'esprit du club : célébrer la marque dans un cadre intime et raffiné.",
    ],
    cover: dinerPozziBanner,
    images: dinerPozziImages,
    video: "/videos/Pozzi.mp4",
  },
  {
    slug: "week-end-champagne-2016",
    title: "Week-end Champagne 2016",
    date: "2016-10-08",
    dateLabel: "Automne 2016",
    location: "Reims & vignobles de Champagne",
    category: "Week-end",
    excerpt:
      "Deux jours sur les routes sinueuses du vignoble champenois, entre grandes maisons, dégustations et conduite plaisir.",
    description: [
      "Le week-end Champagne reste l'un des temps forts de la vie du club. Au volant de leurs Ferrari, les membres ont sillonné les routes vallonnées de la Montagne de Reims et de la Côte des Blancs.",
      "Au programme : visites de maisons de champagne prestigieuses, dégustations, et étapes gastronomiques dans des adresses choisies pour l'occasion.",
      "Entre les villages classés, les routes ouvertes et les arrêts photos face aux vignes, ce road-trip a offert un équilibre parfait entre passion automobile et art de vivre à la française.",
    ],
    cover: champagneImages[0],
    images: champagneImages,
  },
];

/**
 * Same events ordered chronologically (oldest → most recent) for the timeline,
 * so the page reads as a story unfolding forward in time.
 */
export const eventsChronological: ClubEvent[] = [...events].reverse();

/* ------------------------------------------------------------- Articles --- */

export type Article = {
  slug: string;
  title: string;
  date: string; // ISO
  dateLabel: string;
  category: string;
  readingTime: string;
  excerpt: string;
  cover: string;
  content: string[];
};

export const articles: Article[] = [
  {
    slug: "ferrari-sf70h-f1-2017",
    title: "Ferrari SF70H : le retour au sommet",
    date: "2017-02-24",
    dateLabel: "24 février 2017",
    category: "Formule 1",
    readingTime: "4 min",
    excerpt:
      "Présentée à Maranello, la SF70H marque l'ambition retrouvée de la Scuderia pour la saison 2017 de Formule 1.",
    cover: f1Images[0],
    content: [
      "Avec la SF70H, Ferrari signe la soixante-troisième monoplace de son histoire en Formule 1 et affiche une ambition claire : renouer avec la victoire au championnat du monde.",
      "Le nouveau règlement technique 2017 redonne aux voitures des dimensions plus généreuses et un appui aérodynamique accru. La SF70H en tire parti avec un design agressif, des pontons profondément sculptés et un aileron arrière abaissé qui lui confèrent une allure spectaculaire.",
      "Sous le capot, l'unité de puissance turbo hybride a été entièrement repensée pour combler l'écart avec la concurrence. Confiée à Sebastian Vettel et Kimi Räikkönen, la SF70H allait offrir à la Scuderia plusieurs victoires et raviver l'espoir des tifosi du monde entier.",
      "Pour les membres du Scuderia Ferrari Club Paris, chaque Grand Prix devient l'occasion de se rassembler, d'analyser les performances et de vibrer aux couleurs de Maranello.",
    ],
  },
  {
    slug: "ferrari-812-superfast",
    title: "Ferrari 812 Superfast : la quintessence du V12",
    date: "2017-03-07",
    dateLabel: "7 mars 2017",
    category: "Modèles",
    readingTime: "5 min",
    excerpt:
      "812 chevaux, un V12 atmosphérique d'anthologie : la 812 Superfast réinvente la grande tradition des GT avant de Ferrari.",
    cover: f1Images[1],
    content: [
      "Dévoilée au Salon de Genève, la 812 Superfast succède à la F12berlinetta et porte un nom évocateur : 812 pour ses 800 chevaux et son architecture à 12 cylindres, Superfast en hommage aux Ferrari de prestige des années 1950 et 1960.",
      "Son V12 atmosphérique de 6,5 litres développe 800 chevaux à 8 500 tr/min, faisant d'elle la Ferrari de série la plus puissante jamais produite à son lancement. Le 0 à 100 km/h est avalé en 2,9 secondes pour une vitesse de pointe supérieure à 340 km/h.",
      "Au-delà des chiffres, la 812 Superfast introduit la direction assistée électrique sur une Ferrari et un essieu arrière directeur qui décuplent l'agilité d'une GT pourtant taillée pour dévorer les kilomètres.",
      "Une voiture qui incarne à la perfection l'âme de la marque : la noblesse du douze cylindres atmosphérique, sublimée par la technologie la plus moderne.",
    ],
  },
  {
    slug: "ferrari-dino-50-ans",
    title: "Ferrari Dino : 50 ans d'une légende",
    date: "2017-06-15",
    dateLabel: "15 juin 2017",
    category: "Patrimoine",
    readingTime: "6 min",
    excerpt:
      "Un demi-siècle après la Dino 206 GT, retour sur la berlinette qui a bouleversé l'histoire de Ferrari.",
    cover: f1Images[2],
    content: [
      "En 1967, Ferrari présentait la Dino 206 GT, une voiture révolutionnaire à plus d'un titre. Baptisée en hommage à Alfredo « Dino » Ferrari, fils d'Enzo disparu prématurément, elle inaugurait une nouvelle philosophie chez le constructeur.",
      "Moteur V6 en position centrale arrière, lignes dessinées par Pininfarina d'une pureté absolue : la Dino rompait avec la tradition des grosses GT à moteur avant et ouvrait la voie aux Ferrari à moteur central qui feront la légende de la marque.",
      "Initialement commercialisée sous sa propre marque « Dino », distincte de Ferrari, elle reste aujourd'hui l'une des berlinettes les plus convoitées et les plus admirées des collectionneurs.",
      "Cinquante ans plus tard, la Dino continue d'incarner un sommet d'équilibre et d'élégance — une source d'inspiration intemporelle pour les passionnés du club.",
    ],
  },
];

/* ----------------------------------------------------------------- Team --- */

export type TeamMember = {
  name: string;
  role: string;
};

/** Bureau du club (source : page officielle « Le Team SFC »). */
export const teamMembers: TeamMember[] = [
  { name: "Karim Bentala", role: "Président" },
  { name: "Franck Guglielmazzi", role: "Vice-Président" },
  { name: "Pascal Launay", role: "Administrateur" },
];

/* ----------------------------------------------------------- Key figures --- */

export type Stat = { value: string; label: string };

/** Repères vérifiés (source : page officielle « Présentation »). */
export const stats: Stat[] = [
  { value: "2010", label: "Année de création" },
  { value: "2012", label: "Reconnu officiel par Ferrari" },
  { value: "1er", label: "Club Ferrari de France" },
];

/* --------------------------------------------------------------- Values --- */

export type ClubValue = { title: string; description: string };

export const values: ClubValue[] = [
  {
    title: "Passion",
    description:
      "L'amour inconditionnel de Ferrari nous rassemble. Chaque sortie est une célébration du mythe de Maranello.",
  },
  {
    title: "Partage",
    description:
      "Nous croyons aux rencontres et à la transmission. Le club est avant tout une communauté chaleureuse et bienveillante.",
  },
  {
    title: "Excellence",
    description:
      "À l'image de la marque, nous recherchons l'exigence et le raffinement dans chacun de nos événements.",
  },
  {
    title: "Héritage",
    description:
      "Des berlinettes historiques aux dernières GT, nous honorons l'histoire et le patrimoine du Cheval Cabré.",
  },
];

/* ----------------------------------------------------- Membership perks --- */

export type Advantage = { title: string; description: string };

export const advantages: Advantage[] = [
  {
    title: "Welcome Kit officiel",
    description:
      "À votre adhésion, recevez le coffret de bienvenue du club : carte de membre, goodies aux couleurs de la Scuderia et accès à l'espace membres.",
  },
  {
    title: "Événements privés",
    description:
      "Rassemblements, week-ends road-trip, dîners et soirées exclusives réservés aux membres tout au long de l'année.",
  },
  {
    title: "Réseau de passionnés",
    description:
      "Rejoignez une communauté soudée de propriétaires et d'amoureux de Ferrari, à Paris et bien au-delà.",
  },
  {
    title: "Reconnaissance officielle",
    description:
      "Le statut de club officiel ouvre des opportunités privilégiées auprès de Ferrari et de son réseau partenaire.",
  },
];

/* ----------------------------------------------- Membership formulas --- */

export type MembershipTier = {
  name: string;
  price: number;
  period: string;
  audience: string;
  perks: string[];
  featured?: boolean;
};

/** Formules et tarifs 2026 (source : page officielle « Devenir membre »). */
export const membershipTiers: MembershipTier[] = [
  {
    name: "Principal",
    price: 120,
    period: "/ an",
    audience: "L'adhésion complète, accès à tous les événements du club.",
    perks: [
      "Carte de membre officielle",
      "Welcome Kit du club",
      "Accès à tous les événements",
      "Réseau de passionnés",
    ],
    featured: true,
  },
  {
    name: "Famille",
    price: 60,
    period: "/ an",
    audience: "Pour un membre de la famille d'un adhérent (plus de 14 ans).",
    perks: ["Carte de membre", "Welcome Kit du club", "Accès accompagné aux sorties"],
  },
  {
    name: "Junior",
    price: 30,
    period: "/ an",
    audience: "Pour un membre de la famille d'un adhérent (moins de 14 ans).",
    perks: ["Carte de membre", "Welcome Kit du club"],
  },
  {
    name: "Tifosi",
    price: 120,
    period: "/ an",
    audience: "Pour les supporters : le Welcome Kit et la carte, sans accès aux événements.",
    perks: ["Carte de membre", "Welcome Kit du club"],
  },
];

export type MembershipStep = { title: string; description: string };

/** Comment adhérer, en 3 étapes (source : page officielle). */
export const membershipSteps: MembershipStep[] = [
  {
    title: "Partagez la passion",
    description:
      "Être passionné du Cheval Cabré et de la Scuderia Ferrari : c'est la seule véritable condition.",
  },
  {
    title: "Remplissez le formulaire",
    description:
      "Complétez le formulaire d'adhésion en ligne ci-dessous (ou la version papier sur demande).",
  },
  {
    title: "Envoyez votre règlement",
    description:
      "Réglez votre cotisation par virement bancaire ou par chèque à l'ordre du club pour valider votre adhésion.",
  },
];

export const membershipInfo = {
  formUrl:
    "https://docs.google.com/forms/d/e/1FAIpQLSf47LIxZZnc-5CvLSY-cOaTNXUK2dbpR7x0D58zGJLb7QYBeg/viewform?embedded=true",
  period:
    "Votre adhésion court du 1er janvier au 31 décembre. Les inscriptions à partir du 1er octobre sont valables pour l'année suivante.",
  payment: [
    "Virement bancaire — IBAN FR76 3000 3034 7000 0505 6477 874",
    "Chèque à l'ordre du Scuderia Ferrari Club Paris",
  ],
};

/* ------------------------------------------------------- Club narrative --- */

export const clubStory = {
  intro:
    "Né de la passion commune pour le Cheval Cabré, le Scuderia Ferrari Club Paris rassemble depuis 2010 celles et ceux qui font battre le cœur rouge de Maranello dans la capitale.",
  paragraphs: [
    "Reconnu comme club officiel par Ferrari, notre association cultive un attachement profond à l'histoire, aux valeurs et à l'esprit sportif de la marque la plus mythique de l'automobile.",
    "Tout au long de l'année, nous organisons rassemblements, road-trips, visites privées et soirées d'exception. Autant d'occasions de partager le plaisir de conduire, d'admirer des modèles d'hier et d'aujourd'hui, et de tisser des liens entre passionnés.",
    "Que vous soyez propriétaire d'une Ferrari ou simplement animé par l'amour de la marque, le club vous ouvre ses portes pour vivre la passion, ensemble.",
  ],
};
