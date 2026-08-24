import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Calendar, MapPin } from "lucide-react";

import Gallery from "@/components/Gallery";
import HeroSlider from "@/components/HeroSlider";
import Reveal from "@/components/Reveal";
import SectionHeading from "@/components/SectionHeading";
import { Button } from "@/components/ui/button";
import { events } from "@/lib/content";
import { clubStory } from "@/lib/content";
import {
  galleryHomeSelection,
  groupPhoto,
  heroImages,
} from "@/lib/images";

export const metadata: Metadata = {
  title: "Scuderia Ferrari Club Paris — Club officiel Ferrari",
  description:
    "Scuderia Ferrari Club Paris, club officiel Ferrari. Rassemblements, week-ends d'exception et soirées privées pour les passionnés du Cheval Cabré.",
};

export default function HomePage() {
  return (
    <>
      {/* ----------------------------------------------------------- Hero --- */}
      <HeroSlider
        images={heroImages}
        title="Scuderia Ferrari Club Paris"
        subtitle="Club Officiel Ferrari — Partagez votre passion"
      />

      {/* -------------------------------------------------------- Le Club --- */}
      <section className="container py-24 md:py-32">
        <div className="grid items-center gap-14 lg:grid-cols-2 lg:gap-20">
          {/* Left — narrative */}
          <Reveal>
            <SectionHeading
              eyebrow="Le Club"
              title={
                <>
                  Une passion
                  <br />
                  <span className="text-gradient-rosso">rouge Maranello</span>
                </>
              }
            />
            <p className="mt-7 text-lg leading-relaxed text-foreground/90">
              {clubStory.intro}
            </p>
            <p className="mt-5 text-base leading-relaxed text-muted-foreground">
              {clubStory.paragraphs[0]}
            </p>
            <p className="mt-5 text-base leading-relaxed text-muted-foreground">
              {clubStory.paragraphs[1]}
            </p>

            <div className="rule mt-10 max-w-xs" />

            <div className="mt-8">
              <Button asChild variant="outline" size="lg">
                <Link href="/presentation">
                  Découvrir le club
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </Reveal>

          {/* Right — framed group photo */}
          <Reveal direction="left" delay={0.1}>
            <div className="group relative">
              {/* Offset rosso accent frame */}
              <div className="absolute -inset-3 -z-10 rounded-2xl bg-rosso/10 blur-2xl transition-opacity duration-500 group-hover:opacity-90 sm:-inset-4" />
              <div
                aria-hidden
                className="absolute -right-4 -top-4 hidden h-24 w-24 rounded-tr-2xl border-r-2 border-t-2 border-rosso/60 sm:block"
              />
              <div
                aria-hidden
                className="absolute -bottom-4 -left-4 hidden h-24 w-24 rounded-bl-2xl border-b-2 border-l-2 border-rosso/60 sm:block"
              />

              <div className="relative aspect-[4/5] overflow-hidden rounded-xl border border-border bg-card shadow-[0_30px_80px_rgba(0,0,0,0.55)] transition-all duration-500 group-hover:border-rosso/50 group-hover:shadow-[0_30px_90px_rgba(255,40,0,0.22)]">
                <Image
                  src={groupPhoto}
                  alt="Membres du Scuderia Ferrari Club Paris réunis autour de leurs Ferrari"
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-transparent to-transparent" />

                {/* Floating premium stat */}
                <div className="absolute bottom-6 left-6 rounded-lg border border-white/10 bg-ink/70 px-5 py-3 backdrop-blur-md">
                  <span className="block font-display text-3xl leading-none text-gold">
                    2010
                  </span>
                  <span className="mt-1 block text-[11px] font-semibold uppercase tracking-[0.22em] text-white/60">
                    Depuis
                  </span>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ----------------------------------------------------- Événements --- */}
      <section className="bg-carbon-texture border-y border-border">
        <div className="container py-24 md:py-32">
          <SectionHeading
            eyebrow="Temps forts"
            title={
              <>
                Nos <span className="text-gradient-rosso">Événements</span>
              </>
            }
            description="Rassemblements, road-trips et soirées privées : tout au long de l'année, le club fait vivre la passion Ferrari à travers des moments d'exception."
          />

          <div className="mt-16 grid gap-8 md:grid-cols-3">
            {events.map((event, i) => (
              <Reveal key={event.slug} delay={i * 0.08} className="h-full">
                <Link
                  href={`/evenements#${event.slug}`}
                  className="group relative flex h-full flex-col overflow-hidden rounded-lg border border-border bg-card transition-all duration-300 hover:-translate-y-1 hover:border-rosso hover:shadow-[0_20px_50px_rgba(255,40,0,0.18)]"
                >
                  {/* Cover */}
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <Image
                      src={event.cover}
                      alt={`${event.title} — Scuderia Ferrari Club Paris`}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/10 to-transparent" />
                    <span className="absolute left-4 top-4 rounded-full border border-rosso/40 bg-ink/70 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-rosso backdrop-blur-sm">
                      {event.category}
                    </span>
                  </div>

                  {/* Body */}
                  <div className="flex flex-1 flex-col p-6">
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                      <span className="inline-flex items-center gap-1.5">
                        <Calendar className="h-3.5 w-3.5 text-rosso" />
                        {event.dateLabel}
                      </span>
                      <span className="inline-flex items-center gap-1.5">
                        <MapPin className="h-3.5 w-3.5 text-rosso" />
                        {event.location}
                      </span>
                    </div>

                    <h3 className="mt-4 font-display text-2xl uppercase leading-tight tracking-tight text-foreground transition-colors duration-300 group-hover:text-rosso">
                      {event.title}
                    </h3>

                    <p className="mt-3 flex-1 text-sm leading-relaxed text-muted-foreground">
                      {event.excerpt}
                    </p>

                    <span className="mt-6 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-rosso">
                      Voir l&apos;événement
                      <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                    </span>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* -------------------------------------------------------- Galerie --- */}
      <section className="container py-24 md:py-32">
        <SectionHeading
          eyebrow="En images"
          align="center"
          title={
            <>
              La <span className="text-gradient-rosso">Galerie</span>
            </>
          }
          description="Un aperçu de nos rassemblements et de nos plus belles sorties. Cliquez sur une photo pour l'agrandir."
        />

        <Reveal className="mt-16" delay={0.05}>
          <Gallery
            images={galleryHomeSelection.map((src, i) => ({
              src,
              alt: `Galerie Scuderia Ferrari Club Paris ${i + 1}`,
            }))}
          />
        </Reveal>

        <Reveal className="mt-14 flex justify-center" delay={0.1}>
          <Button asChild size="lg">
            <Link href="/galerie">
              Voir toute la galerie
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </Reveal>
      </section>

      {/* ------------------------------------------------ Devenir membre --- */}
      <section className="relative overflow-hidden border-y border-border bg-background">
        {/* Rosso radial glow */}
        <div className="absolute inset-0 bg-rosso-glow opacity-90" />
        <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-transparent to-background/80" />
        <div className="grain absolute inset-0" aria-hidden />

        <div className="container relative z-10 py-28 text-center md:py-36">
          <Reveal>
            <span className="eyebrow mx-auto mb-7 justify-center">
              Rejoignez-nous
            </span>
          </Reveal>

          <Reveal delay={0.08}>
            <h2 className="display-title mx-auto max-w-4xl text-4xl text-foreground sm:text-5xl lg:text-6xl">
              Vivez la passion Ferrari,{" "}
              <span className="text-gradient-rosso">ensemble</span>
            </h2>
          </Reveal>

          <Reveal delay={0.16}>
            <div className="mx-auto mt-8 h-px w-24 bg-gradient-to-r from-transparent via-gold to-transparent" />
          </Reveal>

          <Reveal delay={0.22}>
            <p className="mx-auto mt-8 max-w-2xl text-lg leading-relaxed text-muted-foreground">
              Propriétaire d&apos;une Ferrari ou simplement animé par l&apos;amour
              du Cheval Cabré, le club vous ouvre ses portes. Welcome Kit officiel,
              événements privés et un réseau de passionnés vous attendent.
            </p>
          </Reveal>

          <Reveal delay={0.3}>
            <div className="mt-12 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Button asChild size="lg">
                <Link href="/adhesion">
                  Devenir membre
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link href="/contact">Nous contacter</Link>
              </Button>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
