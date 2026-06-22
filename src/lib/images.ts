/**
 * Image manifests — every photo lives under /public/images/<folder>/.
 * These arrays are generated from the exact filenames on disk so that
 * <Image> always resolves a real asset. Do not rename without re-syncing.
 */

export type GalleryCategory =
  | "rassemblements"
  | "champagne"
  | "diners"
  | "membres"
  | "f1";

export type GalleryImage = {
  src: string;
  alt: string;
  category: GalleryCategory;
};

/* ---------------------------------------------------------------- Hero --- */

export const heroImages: string[] = [
  "/images/hero/KBRossocorsaday-II-0670-scaled.jpg",
  "/images/hero/KB-_MG_2922-scaled.jpg",
  "/images/hero/IMG_8668-scaled.jpg",
  "/images/hero/8703a97c-fbd4-43e8-9498-247819e19774.jpg",
];

/** Group / club photo used in the "Le Club" section. */
export const groupPhoto = "/images/hero/IMG_8668-scaled.jpg";

/* ----------------------------------------------------- Rassemblement #3 --- */

export const rassemblementImages: string[] = Array.from(
  { length: 35 },
  (_, i) =>
    `/images/rassemblement-3/Scuderia-ferrari-club-paris-rassemblement-ferrari-3_${i + 1}.jpg`,
);

/* ------------------------------------------------ Week-end Champagne 2016 --- */
// Files are numbered 1–47 with 43 missing. Numbers 1–15 end in "Club.jpg",
// numbers 16+ end in "Club-.jpg" (trailing dash).

const champagneNumbers = Array.from({ length: 47 }, (_, i) => i + 1).filter(
  (n) => n !== 43,
);

export const champagneImages: string[] = champagneNumbers.map((n) => {
  const suffix = n <= 15 ? "" : "-";
  return `/images/champagne-2016/${n}-Week-end-Champagne-2016-Scuderia-Ferrari-Club${suffix}.jpg`;
});

/* ----------------------------------------------- Dîner Rouge Charles Pozzi --- */

export const dinerPozziImages: string[] = [
  "/images/diner-pozzi/IMG_20170223_220832.jpg",
  "/images/diner-pozzi/IMG_20170223_222123.jpg",
];

export const dinerPozziBanner =
  "/images/diner-pozzi/Scuderia-Ferrari-Club-Charles-Pozzi-825x284.jpg";

/* ------------------------------------------------------ Membres F355 Spider --- */

export const membresImages: string[] = Array.from(
  { length: 7 },
  (_, i) => `/images/membres/Ferrari-355-spider-${i + 1}.jpg`,
);

/* ----------------------------------------------------------- Ferrari SF70H --- */

export const f1Images: string[] = [
  "/images/f1-sf70h/8a2f73c6-d052-4b71-b78b-2d424e8cdde4.jpg",
  "/images/f1-sf70h/d1044b70-be4a-4613-b048-828b8e40b1fd.jpg",
  "/images/f1-sf70h/d85be5c0-960c-4163-b0f8-1a93fb72f976.jpg",
  "/images/f1-sf70h/Ferrari-SF70H-640x284.jpg",
];

/* ----------------------------------------------- Combined gallery manifest --- */

const withCat = (
  srcs: string[],
  category: GalleryCategory,
  altBase: string,
): GalleryImage[] =>
  srcs.map((src, i) => ({
    src,
    category,
    alt: `${altBase} — photo ${i + 1}`,
  }));

export const galleryImages: GalleryImage[] = [
  ...withCat(rassemblementImages, "rassemblements", "Rassemblement Ferrari #3"),
  ...withCat(champagneImages, "champagne", "Week-end Champagne 2016"),
  ...withCat(dinerPozziImages, "diners", "Dîner Rouge Charles Pozzi"),
  ...withCat(membresImages, "membres", "Ferrari F355 Spider — membres"),
  ...withCat(f1Images, "f1", "Ferrari SF70H — Formule 1"),
];

export const galleryCategories: { key: GalleryCategory | "all"; label: string }[] =
  [
    { key: "all", label: "Toutes" },
    { key: "rassemblements", label: "Rassemblements" },
    { key: "champagne", label: "Champagne" },
    { key: "diners", label: "Dîners" },
    { key: "membres", label: "Membres" },
    { key: "f1", label: "F1" },
  ];

/** A curated 9-image excerpt for the home page gallery teaser (3×3). */
export const galleryHomeSelection: string[] = [
  rassemblementImages[0],
  champagneImages[3],
  rassemblementImages[8],
  champagneImages[12],
  rassemblementImages[15],
  champagneImages[20],
  rassemblementImages[22],
  champagneImages[30],
  rassemblementImages[28],
];
