export type ClubProduct = {
  id: string;
  name: string;
  detail: string;
  price: number;
  image: string;
  imageAlt: string;
};

// A concept collection for the landing-page demonstration, not a sales catalogue.
export const CLUB_PRODUCTS: readonly ClubProduct[] = [
  {
    id: "casquette-rosso",
    name: "Casquette Rosso",
    detail: "Le rouge en tête · Taille réglable",
    price: 35,
    image: "/images/collection/cap.webp",
    imageAlt: "Casquette rouge de la collection concept Club Paris",
  },
  {
    id: "tshirt-club-paris",
    name: "T-shirt Club Paris",
    detail: "L’esprit collectif · Unisexe, taille L",
    price: 55,
    image: "/images/collection/tshirt.webp",
    imageAlt: "T-shirt de la collection concept Club Paris",
  },
  {
    id: "porte-cles-heritage",
    name: "Porte-clés Heritage",
    detail: "Une passion qui vous accompagne",
    price: 25,
    image: "/images/collection/keyring.webp",
    imageAlt: "Porte-clés de la collection concept Club Paris",
  },
];

const euroFormatter = new Intl.NumberFormat("fr-FR", {
  style: "currency",
  currency: "EUR",
  maximumFractionDigits: 0,
});

export function formatEuro(value: number): string {
  return euroFormatter.format(value);
}
