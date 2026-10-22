import type { Metadata } from "next";
import ClubLanding from "@/components/club/ClubLanding";

export const metadata: Metadata = {
  title: "Scuderia Ferrari Club Paris — Paris en rouge",
  description: "Une même passion, des émotions à partager. Découvrez le Scuderia Ferrari Club Paris : rencontres, escapades et art de vivre autour du Cheval Cabré.",
  openGraph: {
    title: "Scuderia Ferrari Club Paris — Paris en rouge",
    description: "La passion Ferrari, l’esprit parisien. Entrez dans le club.",
    images: [{ url: "/images/club-v1/enzo-studio.webp", width: 1672, height: 941, alt: "Ferrari Enzo rouge dans un studio sombre" }],
  },
};

export default function HomePage() {
  return <ClubLanding />;
}
