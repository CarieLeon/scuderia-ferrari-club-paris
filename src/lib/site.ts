/**
 * Global site configuration: brand, navigation, contact and social links.
 * Single source of truth — imported by Header, Footer, Contact, metadata, etc.
 */

export const siteConfig = {
  name: "Scuderia Ferrari Club Paris",
  shortName: "SFC Paris",
  tagline: "Club Officiel Ferrari — Partagez votre passion",
  description:
    "Le Scuderia Ferrari Club Paris réunit les passionnés du Cheval Cabré autour de rassemblements, week-ends d'exception et soirées privées. Club officiel reconnu par Ferrari.",
  url: "https://scuderia-ferrari-club-paris.fr",
  locale: "fr_FR",
  foundingYear: 2010,
  officialYear: 2012,
  email: "contact@scuderia-ferrari-club-paris.fr",
  phone: "+33 1 42 00 00 00",
  city: "Paris, France",
  logo: "/images/logo/logo-sfc-scaled.jpg",
  signature: "/images/logo/cropped-signature-2.jpg",
  favicon: "/images/logo/Favicon-Scuderia-Ferrari-Club.png",
} as const;

export type NavItem = { label: string; href: string };

export const navItems: NavItem[] = [
  { label: "Accueil", href: "/" },
  { label: "Présentation", href: "/presentation" },
  { label: "Galerie", href: "/galerie" },
  { label: "Événements", href: "/evenements" },
  { label: "Actualités", href: "/actualites" },
  { label: "Contact", href: "/contact" },
];

export type SocialLink = {
  label: string;
  href: string;
  icon: "instagram" | "facebook" | "youtube";
};

export const socialLinks: SocialLink[] = [
  { label: "Instagram", href: "https://www.instagram.com/", icon: "instagram" },
  { label: "Facebook", href: "https://www.facebook.com/", icon: "facebook" },
  { label: "YouTube", href: "https://www.youtube.com/", icon: "youtube" },
];
