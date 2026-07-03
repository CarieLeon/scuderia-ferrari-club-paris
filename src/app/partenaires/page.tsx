import type { Metadata } from "next";
import { ExternalLink } from "lucide-react";

import PageHeader from "@/components/PageHeader";
import Reveal from "@/components/Reveal";
import { partners } from "@/lib/content";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Partenaires",
  description:
    "Les partenaires du Scuderia Ferrari Club Paris qui accompagnent le club et ses membres tout au long de l'année.",
};

const cardClass =
  "flex h-full flex-col items-center rounded-xl border border-border bg-white p-8 text-center shadow-sm transition-all duration-300";

export default function PartenairesPage() {
  return (
    <>
      <PageHeader
        eyebrow="Ils nous accompagnent"
        title="Partenaires"
        description="Le Scuderia Ferrari Club Paris s'entoure de partenaires de confiance qui accompagnent le club et ses membres tout au long de l'année."
      />

      <section className="container py-24 md:py-32">
        {/* Ferrari — affiliation officielle du club */}
        <Reveal className="mx-auto mb-16 max-w-5xl">
          <a
            href="https://www.ferrari.com/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Ferrari — site officiel (nouvel onglet)"
            className="group flex flex-col items-center gap-8 rounded-2xl border border-border bg-white px-8 py-10 text-center shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-gold/50 hover:shadow-[0_24px_60px_rgba(0,0,0,0.12)] sm:flex-row sm:gap-12 sm:text-left md:px-14"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/partenaires/ferrari-horse.svg"
              alt="Ferrari — Cavallino Rampante"
              className="h-24 w-auto shrink-0 sm:h-28"
            />
            <div className="flex-1">
              <span className="inline-flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.3em] text-neutral-500">
                <span className="h-px w-8 bg-rosso" aria-hidden />
                Affiliation officielle
              </span>
              <h2 className="mt-3 font-display text-3xl uppercase leading-none tracking-tight text-noir sm:text-4xl">
                Ferrari
              </h2>
              <p className="mt-3 max-w-md text-sm leading-relaxed text-neutral-600">
                Le Scuderia Ferrari Club Paris est un club officiel reconnu par
                Ferrari S.p.A. depuis 2012 — le premier Scuderia Ferrari Club de
                France.
              </p>
            </div>
            <span className="inline-flex shrink-0 items-center gap-2 text-xs font-semibold uppercase tracking-widest text-rosso transition-transform duration-300 group-hover:translate-x-1">
              Découvrir Ferrari
              <ExternalLink className="size-3.5" aria-hidden />
            </span>
          </a>
        </Reveal>

        <Reveal className="mx-auto mb-10 max-w-5xl">
          <span className="eyebrow justify-center">Nos partenaires</span>
        </Reveal>

        <div className="mx-auto grid max-w-5xl gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {partners.map((partner, i) => {
            const inner = (
              <>
                <div className="flex h-28 w-full items-center justify-center">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={partner.logo}
                    alt={`Logo ${partner.name}`}
                    loading="lazy"
                    className="max-h-24 w-auto max-w-[85%] object-contain"
                  />
                </div>
                <div className="mt-6 flex flex-col items-center gap-1.5">
                  <h2 className="font-display text-lg uppercase tracking-tight text-noir">
                    {partner.name}
                  </h2>
                  {partner.url && (
                    <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest text-rosso">
                      Visiter le site
                      <ExternalLink className="size-3.5" aria-hidden />
                    </span>
                  )}
                </div>
              </>
            );

            return (
              <Reveal key={partner.name} delay={i * 0.08} className="h-full">
                {partner.url ? (
                  <a
                    href={partner.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`${partner.name} — visiter le site (nouvel onglet)`}
                    className={cn(
                      cardClass,
                      "hover:-translate-y-1 hover:border-rosso/40 hover:shadow-[0_20px_50px_rgba(255,40,0,0.10)]",
                    )}
                  >
                    {inner}
                  </a>
                ) : (
                  <div className={cardClass}>{inner}</div>
                )}
              </Reveal>
            );
          })}
        </div>
      </section>
    </>
  );
}
