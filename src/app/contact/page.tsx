import type { Metadata } from "next";
import { Mail, MapPin, Phone, Clock, ArrowUpRight } from "lucide-react";

import ContactForm from "@/components/ContactForm";
import PageHeader from "@/components/PageHeader";
import Reveal from "@/components/Reveal";
import SocialIcons from "@/components/SocialIcons";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Contactez le Scuderia Ferrari Club Paris. Une question, une envie de nous rejoindre ou de collaborer ? Écrivez-nous, nous vous répondrons rapidement.",
};

const contactRows = [
  {
    icon: Mail,
    label: "Email",
    value: siteConfig.email,
    href: `mailto:${siteConfig.email}`,
    hint: "Réponse sous 48 h",
  },
  {
    icon: Phone,
    label: "Téléphone",
    value: siteConfig.phone,
    href: `tel:${siteConfig.phone.replace(/\s+/g, "")}`,
    hint: "Du lundi au vendredi",
  },
  {
    icon: MapPin,
    label: "Localisation",
    value: siteConfig.city,
    href: null,
    hint: "Île-de-France",
  },
];

export default function ContactPage() {
  return (
    <>
      <PageHeader
        eyebrow="Contact"
        title="Nous contacter"
        description="Une question, une envie de nous rejoindre ? Écrivez-nous."
      />

      <section className="container py-24 md:py-32">
        <div className="grid gap-12 lg:grid-cols-[5fr_7fr] lg:gap-16">
          {/* LEFT — Coordonnées */}
          <div className="flex flex-col">
            <Reveal>
              <span className="eyebrow mb-5">Coordonnées</span>
              <h2 className="display-title text-3xl text-foreground sm:text-4xl">
                Le <span className="text-gradient-rosso">Cheval Cabré</span> à
                portée de voix
              </h2>
              <p className="mt-5 max-w-md text-base leading-relaxed text-muted-foreground">
                Que vous soyez propriétaire d&apos;une Ferrari, passionné du
                Cheval Cabré ou partenaire potentiel, l&apos;équipe du{" "}
                <span className="text-foreground">{siteConfig.name}</span> sera
                ravie d&apos;échanger avec vous.
              </p>
            </Reveal>

            <div className="mt-10 space-y-4">
              {contactRows.map((row, i) => {
                const Icon = row.icon;
                const inner = (
                  <>
                    <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg border border-rosso/30 bg-rosso/10 text-rosso transition-colors duration-300 group-hover:bg-rosso group-hover:text-white">
                      <Icon className="h-5 w-5" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-xs uppercase tracking-[0.2em] text-muted-foreground">
                        {row.label}
                      </span>
                      <span className="mt-1 block truncate text-base font-medium text-foreground">
                        {row.value}
                      </span>
                      <span className="mt-0.5 block text-xs text-muted-foreground/80">
                        {row.hint}
                      </span>
                    </span>
                    {row.href && (
                      <ArrowUpRight className="h-4 w-4 shrink-0 text-muted-foreground transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-rosso" />
                    )}
                  </>
                );

                return (
                  <Reveal key={row.label} delay={i * 0.08}>
                    {row.href ? (
                      <a
                        href={row.href}
                        className="group flex items-center gap-4 rounded-lg border border-border bg-card p-4 transition-all duration-300 hover:-translate-y-1 hover:border-rosso hover:shadow-[0_20px_50px_rgba(255,40,0,0.18)]"
                      >
                        {inner}
                      </a>
                    ) : (
                      <div className="group flex items-center gap-4 rounded-lg border border-border bg-card p-4">
                        {inner}
                      </div>
                    )}
                  </Reveal>
                );
              })}
            </div>

            <Reveal delay={0.24} className="mt-10">
              <div className="rule mb-8" />
              <span className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                Suivez-nous
              </span>
              <div className="mt-4 flex items-center gap-5">
                <SocialIcons />
                <span className="hidden text-sm text-muted-foreground sm:inline">
                  Coulisses, rassemblements &amp; sorties exclusives.
                </span>
              </div>
            </Reveal>

            {/* Decorative carbon panel */}
            <Reveal delay={0.3} className="mt-auto pt-12">
              <div className="grain relative overflow-hidden rounded-lg border border-border bg-carbon-texture p-7">
                <div className="absolute inset-0 bg-rosso-glow opacity-40" />
                <div className="relative">
                  <span className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-gold">
                    <Clock className="h-4 w-4" />
                    Club officiel depuis {siteConfig.officialYear}
                  </span>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                    Reconnu par Ferrari, le {siteConfig.shortName} cultive
                    l&apos;art de vivre italien et la passion du sport
                    automobile au cœur de la capitale.
                  </p>
                </div>
              </div>
            </Reveal>
          </div>

          {/* RIGHT — Formulaire */}
          <Reveal direction="left" delay={0.1}>
            <Card className="relative overflow-hidden bg-card/80 backdrop-blur">
              <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-rosso to-transparent" />
              <CardHeader className="p-7 pb-2 sm:p-9 sm:pb-3">
                <span className="eyebrow mb-3">Formulaire</span>
                <CardTitle className="display-title text-2xl text-foreground sm:text-3xl">
                  Envoyez-nous un message
                </CardTitle>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  Remplissez ce formulaire et nous reviendrons vers vous dans
                  les plus brefs délais. Tous les champs marqués sont requis.
                </p>
              </CardHeader>
              <CardContent className="p-7 pt-6 sm:p-9 sm:pt-7">
                <ContactForm />
              </CardContent>
            </Card>
          </Reveal>
        </div>
      </section>
    </>
  );
}
