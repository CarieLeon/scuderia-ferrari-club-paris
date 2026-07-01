import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Calendar, MapPin } from "lucide-react";

import PageHeader from "@/components/PageHeader";
import Reveal from "@/components/Reveal";
import Gallery from "@/components/Gallery";
import { Button } from "@/components/ui/button";
import { eventsChronological } from "@/lib/content";

export const metadata: Metadata = {
  title: "Nos Événements",
  description:
    "Rassemblements, soirées privées et road-trips : retour en images sur les temps forts qui rythment la vie du Scuderia Ferrari Club Paris.",
};

export default function EvenementsPage() {
  return (
    <>
      <PageHeader
        eyebrow="Agenda"
        title="Nos Événements"
        description="Retour sur les temps forts qui rythment la vie du club."
      />

      <section className="bg-carbon-texture">
        <div className="container py-24 md:py-32">
          {/* Intro line */}
          <Reveal className="mb-16 max-w-2xl md:mb-24">
            <span className="eyebrow mb-5">La chronique du club</span>
            <p className="text-lg leading-relaxed text-muted-foreground">
              Des escapades dans les vignobles aux rassemblements parisiens,
              déroulez le fil de notre histoire — des premières sorties aux
              derniers grands rendez-vous qui font vibrer le Cheval Cabré.
            </p>
          </Reveal>

          {/* Timeline */}
          <div className="relative">
            {/* Vertical rail */}
            <span
              aria-hidden
              className="pointer-events-none absolute bottom-0 left-[11px] top-2 w-px bg-gradient-to-b from-rosso via-rosso/40 to-transparent md:left-[15px]"
            />

            <ol className="space-y-24 md:space-y-32">
              {eventsChronological.map((event, index) => (
                <li key={event.slug} id={event.slug} className="relative scroll-mt-28">
                  <Reveal>
                    <article className="relative pl-12 md:pl-16">
                      {/* Marker dot */}
                      <span
                        aria-hidden
                        className="absolute left-0 top-1.5 flex h-6 w-6 items-center justify-center rounded-full bg-background ring-2 ring-rosso/30 md:h-8 md:w-8"
                      >
                        <span className="h-2.5 w-2.5 rounded-full bg-rosso shadow-[0_0_14px_rgba(255,40,0,0.9)] md:h-3 md:w-3" />
                      </span>

                      {/* Step index */}
                      <span className="font-display text-sm uppercase tracking-[0.25em] text-rosso">
                        Étape {String(index + 1).padStart(2, "0")}
                      </span>

                      {/* Meta row */}
                      <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs uppercase tracking-widest text-muted-foreground">
                        <span className="inline-flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-rosso" />
                          <time dateTime={event.date}>{event.dateLabel}</time>
                        </span>
                        <span aria-hidden className="hidden text-muted-foreground sm:inline">
                          ·
                        </span>
                        <span className="inline-flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-rosso" />
                          {event.location}
                        </span>
                        <span className="inline-flex items-center rounded-full border border-rosso/40 bg-rosso/10 px-3 py-1 text-[0.65rem] font-semibold tracking-widest text-rosso">
                          {event.category}
                        </span>
                      </div>

                      {/* Title */}
                      <h2 className="display-title mt-5 text-4xl text-foreground sm:text-5xl lg:text-6xl">
                        {event.title}
                      </h2>

                      <span className="rule mt-7 block max-w-[140px]" />

                      {/* Description */}
                      <div className="mt-7 max-w-3xl space-y-5">
                        {event.description.map((paragraph, i) => (
                          <p
                            key={i}
                            className="text-base leading-relaxed text-muted-foreground md:text-lg"
                          >
                            {paragraph}
                          </p>
                        ))}
                      </div>

                      {/* Event video */}
                      {event.video && (
                        <div className="mt-12">
                          <span className="eyebrow mb-6">La vidéo</span>
                          <div className="group relative overflow-hidden rounded-lg border border-border bg-black shadow-[0_30px_80px_rgba(0,0,0,0.55)]">
                            <video
                              controls
                              preload="metadata"
                              playsInline
                              poster={event.cover}
                              className="aspect-video w-full object-cover"
                            >
                              <source src={event.video} type="video/mp4" />
                              Votre navigateur ne prend pas en charge la lecture
                              vidéo.
                            </video>
                          </div>
                        </div>
                      )}

                      {/* Photo gallery */}
                      <div className="mt-12">
                        <span className="eyebrow mb-6">La galerie</span>
                        <Gallery
                          images={event.images.map((src, i) => ({
                            src,
                            alt: `${event.title} — photo ${i + 1}`,
                          }))}
                          pageSize={8}
                        />
                      </div>
                    </article>
                  </Reveal>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      {/* Closing CTA */}
      <section className="border-t border-border bg-background">
        <div className="container py-24 text-center md:py-32">
          <Reveal>
            <span className="eyebrow justify-center">Vivez l'aventure</span>
            <h2 className="display-title mx-auto mt-5 max-w-3xl text-4xl text-foreground sm:text-5xl lg:text-6xl">
              Et si le prochain souvenir était <span className="text-gradient-rosso">le vôtre</span> ?
            </h2>
            <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground">
              Rejoignez le Scuderia Ferrari Club Paris et prenez part aux
              rassemblements, road-trips et soirées d'exception qui nous réunissent.
            </p>
            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Button asChild size="lg">
                <Link href="/adhesion">
                  Devenir membre
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link href="/galerie">Explorer la galerie</Link>
              </Button>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
