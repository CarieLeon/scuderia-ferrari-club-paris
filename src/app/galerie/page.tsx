import type { Metadata } from "next";

import Gallery from "@/components/Gallery";
import Reveal from "@/components/Reveal";
import { galleryCategories, galleryImages } from "@/lib/images";
import PageHeader from "@/components/PageHeader";

export const metadata: Metadata = {
  title: "Galerie",
  description:
    "Les rassemblements, week-ends et soirées du Scuderia Ferrari Club Paris en images : Ferrari de légende et moments d'exception.",
};

export default function GaleriePage() {
  return (
    <>
      <PageHeader
        eyebrow="Galerie"
        title="La Galerie"
        description="Toutes nos photos de rassemblements, week-ends et soirées."
      />

      <section className="container py-20 md:py-28">
        <Reveal
          as="p"
          className="mx-auto mb-12 max-w-2xl text-center text-base leading-relaxed text-muted-foreground md:mb-16"
        >
          <span className="text-gradient-rosso font-semibold">
            {galleryImages.length} clichés
          </span>{" "}
          pour revivre nos plus belles sorties — du rugissement des V8 sur les
          routes à la lueur des soirées rouge passion. Filtrez par catégorie et
          cliquez sur une photo pour l&apos;ouvrir en plein écran.
        </Reveal>

        <Gallery
          images={galleryImages}
          withFilters
          categories={galleryCategories}
          masonry
          pageSize={15}
        />
      </section>
    </>
  );
}
