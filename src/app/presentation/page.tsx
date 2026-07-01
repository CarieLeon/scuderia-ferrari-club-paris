import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Award,
  Heart,
  Sparkles,
  Star,
  Trophy,
  Users,
} from "lucide-react";

import Gallery, { type GalleryItem } from "@/components/Gallery";
import PageHeader from "@/components/PageHeader";
import Reveal from "@/components/Reveal";
import SectionHeading from "@/components/SectionHeading";
import { Button } from "@/components/ui/button";
import {
  clubStory,
  events,
  stats,
  teamMembers,
  values,
} from "@/lib/content";
import {
  champagneImages,
  groupPhoto,
  heroImages,
  membresImages,
  rassemblementImages,
} from "@/lib/images";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "Présentation",
  description:
    "Découvrez le Scuderia Ferrari Club Paris : notre histoire, nos valeurs, notre équipe et les rassemblements qui font vibrer la communauté du Cheval Cabré depuis 2010.",
};

const valueIcons = [Heart, Users, Trophy, Star] as const;

/** Build the "événements phares" teaser from the first images of each event. */
const teaserItems: GalleryItem[] = [
  ...rassemblementImages.slice(0, 3),
  ...champagneImages.slice(0, 3),
].map((src, i) => ({
  src,
  alt: `Moments forts du Scuderia Ferrari Club Paris ${i + 1}`,
  category: i < 3 ? "Rassemblement" : "Week-end Champagne",
}));

function initials(name: string): string {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export default function PresentationPage() {
  return (
    <>
      <PageHeader
        eyebrow="Le Club"
        title="Présentation"
        description={
          <>
            Depuis 2010, une même passion pour le Cheval Cabré. Le{" "}
            <span className="text-blanc">Scuderia Ferrari Club Paris</span>{" "}
            réunit propriétaires et amoureux de Maranello autour d&apos;un même
            feu rouge.
          </>
        }
        image={groupPhoto}
      />

      {/* ---------------------------------------------------- Notre histoire --- */}
      <section className="container py-24 md:py-32">
        <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-16">
          {/* Editorial copy */}
          <div className="lg:col-span-7">
            <SectionHeading
              eyebrow="Notre histoire"
              title={
                <>
                  Une passion née à <br className="hidden sm:block" />
                  <span className="text-gradient-rosso">Maranello</span>,
                  cultivée à Paris
                </>
              }
            />

            <Reveal
              as="p"
              delay={0.05}
              className="mt-8 text-xl font-medium leading-relaxed text-foreground"
            >
              {clubStory.intro}
            </Reveal>

            <div className="mt-6 space-y-5 text-base leading-relaxed text-muted-foreground sm:text-lg">
              {clubStory.paragraphs.map((paragraph, i) => (
                <Reveal as="p" key={i} delay={0.1 + i * 0.06}>
                  {paragraph}
                </Reveal>
              ))}
            </div>

            <Reveal
              delay={0.3}
              className="mt-10 flex flex-wrap items-center gap-8 border-t border-border pt-8"
            >
              <div>
                <p className="font-display text-4xl uppercase leading-none text-foreground sm:text-5xl">
                  {siteConfig.foundingYear}
                </p>
                <p className="mt-2 text-xs uppercase tracking-[0.2em] text-muted-foreground">
                  Année de fondation
                </p>
              </div>
              <div className="hidden h-12 w-px bg-gradient-to-b from-transparent via-border to-transparent sm:block" />
              <div className="flex items-center gap-3">
                <Award className="h-9 w-9 shrink-0 text-rosso" aria-hidden />
                <div>
                  <p className="font-display text-lg uppercase leading-none text-foreground">
                    Club officiel Ferrari
                  </p>
                  <p className="mt-1.5 text-xs uppercase tracking-[0.2em] text-muted-foreground">
                    Reconnu par la marque
                  </p>
                </div>
              </div>
            </Reveal>
          </div>

          {/* Side image */}
          <div className="lg:col-span-5">
            <Reveal direction="left" className="relative">
              <div className="relative aspect-[4/5] overflow-hidden rounded-lg border border-white/10">
                <Image
                  src={heroImages[3]}
                  alt="Rassemblement de Ferrari du Scuderia Ferrari Club Paris"
                  fill
                  sizes="(max-width: 1024px) 100vw, 40vw"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-transparent to-transparent" />
              </div>
              {/* Overlapping accent card */}
              <div className="absolute -bottom-6 -left-6 hidden max-w-[200px] rounded-lg border border-rosso/40 bg-card/95 p-5 shadow-[0_20px_50px_rgba(255,40,0,0.18)] backdrop-blur sm:block">
                <Sparkles className="h-6 w-6 text-gold" aria-hidden />
                <p className="mt-3 text-sm leading-snug text-foreground">
                  Des berlinettes historiques aux dernières GT, sous le signe du{" "}
                  <span className="text-rosso">Cheval Cabré</span>.
                </p>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------- Nos valeurs --- */}
      <section className="bg-carbon-texture border-y border-border">
        <div className="container py-24 md:py-32">
          <SectionHeading
            eyebrow="Ce qui nous rassemble"
            title="Nos valeurs"
            description="Quatre principes guident chacune de nos sorties et chacun de nos rendez-vous, à l'image de l'exigence et de la passion de la marque."
            align="center"
            className="mx-auto"
          />

          <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {values.map((value, i) => {
              const Icon = valueIcons[i % valueIcons.length];
              return (
                <Reveal key={value.title} delay={i * 0.08}>
                  <article className="group relative flex h-full flex-col overflow-hidden rounded-lg border border-border bg-card p-7 transition-all duration-300 hover:-translate-y-1 hover:border-rosso hover:shadow-[0_20px_50px_rgba(255,40,0,0.18)]">
                    <span className="pointer-events-none absolute right-5 top-4 font-display text-5xl leading-none text-foreground/5 transition-colors duration-300 group-hover:text-rosso/20">
                      0{i + 1}
                    </span>
                    <span className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-full border border-rosso/30 bg-rosso/10 text-rosso transition-colors duration-300 group-hover:bg-rosso group-hover:text-white">
                      <Icon className="h-6 w-6" aria-hidden />
                    </span>
                    <h3 className="font-display text-2xl uppercase tracking-tight text-foreground">
                      {value.title}
                    </h3>
                    <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                      {value.description}
                    </p>
                  </article>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------ Chiffres clés --- */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-background" />
        <div className="absolute inset-0 bg-rosso-glow opacity-40" />
        <div className="container relative z-10 py-20 md:py-24">
          <Reveal className="mx-auto mb-14 max-w-2xl text-center">
            <span className="eyebrow mb-4 justify-center">En quelques chiffres</span>
            <h2 className="display-title text-3xl text-foreground sm:text-4xl">
              Chiffres clés
            </h2>
          </Reveal>

          <div className="grid grid-cols-1 gap-y-12 sm:grid-cols-3">
            {stats.map((stat, i) => (
              <Reveal
                key={stat.label}
                delay={i * 0.08}
                className="relative px-4 text-center sm:px-6"
              >
                {i > 0 && (
                  <span className="absolute left-0 top-1/2 hidden h-16 w-px -translate-y-1/2 bg-gradient-to-b from-transparent via-border to-transparent sm:block" />
                )}
                <span className="block font-display text-5xl uppercase leading-none text-gradient-rosso sm:text-6xl lg:text-7xl">
                  {stat.value}
                </span>
                <p className="mt-4 text-xs uppercase tracking-[0.2em] text-muted-foreground sm:text-sm">
                  {stat.label}
                </p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ----------------------------------------------------------- L'équipe --- */}
      <section className="container py-24 md:py-32">
        <SectionHeading
          eyebrow="Le team"
          title="L'équipe du club"
          description="Des bénévoles passionnés au service de la communauté, qui imaginent et orchestrent chaque rendez-vous du Scuderia Ferrari Club Paris."
        />

        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {teamMembers.map((member, i) => (
            <Reveal key={member.name} delay={(i % 3) * 0.08}>
              <article className="group relative flex h-full flex-col overflow-hidden rounded-lg border border-border bg-card transition-all duration-300 hover:-translate-y-1 hover:border-rosso hover:shadow-[0_20px_50px_rgba(255,40,0,0.18)]">
                {/* Avatar / initials block */}
                <div className="relative aspect-[4/3] overflow-hidden bg-gradient-to-br from-carbon via-noir to-ink">
                  <div className="absolute inset-0 bg-rosso-glow opacity-50 transition-opacity duration-500 group-hover:opacity-80" />
                  <span className="absolute inset-0 flex items-center justify-center font-display text-7xl uppercase tracking-tight text-white/10 transition-all duration-500 group-hover:scale-105 group-hover:text-rosso/40">
                    {initials(member.name)}
                  </span>
                  <span className="absolute bottom-4 left-5 h-px w-10 bg-rosso" />
                </div>

                <div className="flex flex-1 flex-col p-6">
                  <h3 className="font-display text-xl uppercase tracking-tight text-foreground">
                    {member.name}
                  </h3>
                  <p className="mt-2 text-xs font-semibold uppercase tracking-[0.18em] text-rosso">
                    {member.role}
                  </p>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </section>

      {/* -------------------------------------------------- Événements phares --- */}
      <section className="bg-carbon-texture border-y border-border">
        <div className="container py-24 md:py-32">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
            <SectionHeading
              eyebrow="Temps forts"
              title="Événements phares"
              description="Rassemblements, road-trips et soirées privées : un aperçu des moments qui rythment la vie du club."
              className="max-w-2xl"
            />
            <Reveal direction="left" delay={0.1} className="shrink-0">
              <Button asChild variant="outline" size="lg">
                <Link href="/evenements">
                  Tous les événements
                  <ArrowRight className="ml-2 h-4 w-4" aria-hidden />
                </Link>
              </Button>
            </Reveal>
          </div>

          <Reveal delay={0.1} className="mt-14">
            <Gallery images={teaserItems} masonry className="mt-0" />
          </Reveal>

          {/* Featured event chips */}
          <div className="mt-14 grid gap-4 sm:grid-cols-3">
            {events.map((event, i) => (
              <Reveal key={event.slug} delay={i * 0.08}>
                <Link
                  href="/evenements"
                  className="group relative flex h-full items-center gap-4 overflow-hidden rounded-lg border border-border bg-card p-5 transition-all duration-300 hover:-translate-y-1 hover:border-rosso hover:shadow-[0_20px_50px_rgba(255,40,0,0.18)]"
                >
                  <span className="font-display text-3xl uppercase leading-none text-rosso/80 transition-colors group-hover:text-rosso">
                    0{i + 1}
                  </span>
                  <div className="min-w-0">
                    <p className="truncate font-display text-base uppercase tracking-tight text-foreground">
                      {event.title}
                    </p>
                    <p className="mt-1 text-xs uppercase tracking-[0.18em] text-muted-foreground">
                      {event.dateLabel}
                    </p>
                  </div>
                  <ArrowRight className="ml-auto h-4 w-4 shrink-0 text-muted-foreground transition-all group-hover:translate-x-1 group-hover:text-rosso" aria-hidden />
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* --------------------------------------------------------------- CTA --- */}
      <section className="container py-24 md:py-32">
        <Reveal>
          <div className="relative overflow-hidden rounded-2xl border border-white/10">
            <Image
              src={membresImages[0]}
              alt="Ferrari F355 Spider d'un membre du club"
              fill
              sizes="100vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-ink via-ink/90 to-ink/50" />
            <div className="absolute inset-0 bg-rosso-glow opacity-40" />

            <div className="relative z-10 flex flex-col items-start gap-8 px-8 py-16 sm:px-14 sm:py-20 lg:max-w-2xl">
              <span className="eyebrow text-white/70">Rejoignez-nous</span>
              <h2 className="display-title text-4xl text-white sm:text-5xl lg:text-6xl">
                Vivez la passion <span className="text-gradient-rosso">ensemble</span>
              </h2>
              <p className="max-w-xl text-base leading-relaxed text-white/80 sm:text-lg">
                Propriétaire d&apos;une Ferrari ou simplement animé par l&apos;amour
                de la marque, le club vous ouvre ses portes. Adhérez et prenez part
                à nos prochains rendez-vous au volant du Cheval Cabré.
              </p>
              <div className="flex flex-wrap gap-4">
                <Button asChild size="lg">
                  <Link href="/adhesion">
                    Adhérer au club
                    <ArrowRight className="ml-2 h-4 w-4" aria-hidden />
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="border-white/40 text-white hover:bg-white/5">
                  <Link href="/contact">Nous contacter</Link>
                </Button>
              </div>
            </div>
          </div>
        </Reveal>
      </section>
    </>
  );
}
