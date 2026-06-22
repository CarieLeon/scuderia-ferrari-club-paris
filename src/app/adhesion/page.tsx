import type { Metadata } from "next";
import Image from "next/image";
import {
  BadgeCheck,
  Calendar,
  Check,
  CreditCard,
  FileText,
  Gift,
  Quote,
  Users,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

import GoogleFormEmbed from "@/components/GoogleFormEmbed";
import PageHeader from "@/components/PageHeader";
import Reveal from "@/components/Reveal";
import SectionHeading from "@/components/SectionHeading";
import { cn } from "@/lib/utils";
import {
  advantages,
  membershipInfo,
  membershipSteps,
  membershipTiers,
} from "@/lib/content";
import { heroImages, membresImages } from "@/lib/images";

export const metadata: Metadata = {
  title: "Adhésion",
  description:
    "Devenez membre du Scuderia Ferrari Club Paris, club officiel. Formules 2026, avantages, welcome kit et formulaire d'adhésion en ligne pour vivre la passion Ferrari.",
};

const advantageIcons: LucideIcon[] = [Gift, Calendar, Users, BadgeCheck];
const paymentIcons: LucideIcon[] = [CreditCard, FileText];

export default function AdhesionPage() {
  return (
    <>
      <PageHeader
        eyebrow="Rejoignez-nous"
        title="Adhésion"
        description="Vivez la passion Ferrari au sein d'un club officiel — formules 2026, avantages et adhésion en ligne."
        image={heroImages[1]}
      />

      {/* ------------------------------------------------ Les avantages --- */}
      <section className="container py-24 md:py-32">
        <SectionHeading
          eyebrow="Privilèges membres"
          title="Les avantages"
          description="Adhérer au Scuderia Ferrari Club Paris, c'est rejoindre un cercle d'exception et profiter d'attentions pensées pour les amoureux du Cheval Cabré."
          align="center"
        />

        <div className="mt-16 grid gap-6 sm:grid-cols-2">
          {advantages.map((advantage, index) => {
            const Icon = advantageIcons[index % advantageIcons.length];
            return (
              <Reveal key={advantage.title} delay={index * 0.08}>
                <article className="group relative h-full overflow-hidden rounded-lg border border-white/10 bg-card p-8 transition-all duration-300 hover:-translate-y-1 hover:border-rosso hover:shadow-[0_20px_50px_rgba(255,40,0,0.18)] sm:p-10">
                  <span className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold/60 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                  <div className="flex items-start gap-5">
                    <span className="relative grid size-14 shrink-0 place-items-center rounded-full border border-gold/30 bg-gold/5 text-gold transition-colors duration-300 group-hover:border-rosso/60 group-hover:bg-rosso/10 group-hover:text-rosso">
                      <Icon className="size-6" strokeWidth={1.6} aria-hidden />
                    </span>
                    <div className="space-y-3">
                      <span className="block font-display text-sm uppercase tracking-[0.25em] text-gold/70">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <h3 className="font-display text-2xl uppercase tracking-tight text-white">
                        {advantage.title}
                      </h3>
                      <p className="text-base leading-relaxed text-muted-foreground">
                        {advantage.description}
                      </p>
                    </div>
                  </div>
                </article>
              </Reveal>
            );
          })}
        </div>
      </section>

      {/* -------------------------------------------------- Les formules --- */}
      <section className="relative overflow-hidden bg-carbon-texture py-24 md:py-32">
        <div className="absolute inset-0 bg-rosso-glow opacity-30" aria-hidden />
        <div className="container relative z-10">
          <SectionHeading
            eyebrow="Tarifs 2026"
            title="Les formules"
            description="Quatre formules pour rejoindre le club, du passionné le plus engagé aux supporters du Cheval Cabré."
            align="center"
          />

          <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {membershipTiers.map((tier, index) => (
              <Reveal key={tier.name} delay={index * 0.08} className="h-full">
                <article
                  className={cn(
                    "group relative flex h-full flex-col rounded-xl border bg-card p-7 transition-all duration-300 hover:-translate-y-1",
                    tier.featured
                      ? "border-rosso/60 shadow-[0_25px_60px_rgba(255,40,0,0.2)] lg:scale-[1.03]"
                      : "border-white/10 hover:border-rosso/50",
                  )}
                >
                  {tier.featured && (
                    <span className="absolute -top-3 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-rosso px-4 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-white shadow-lg">
                      Le plus complet
                    </span>
                  )}

                  <h3 className="font-display text-2xl uppercase tracking-tight text-white">
                    {tier.name}
                  </h3>

                  <div className="mt-4 flex items-end gap-1">
                    <span
                      className={cn(
                        "font-display text-5xl leading-none",
                        tier.featured ? "text-gradient-rosso" : "text-white",
                      )}
                    >
                      {tier.price}€
                    </span>
                    <span className="mb-1 text-xs uppercase tracking-widest text-muted-foreground">
                      {tier.period}
                    </span>
                  </div>

                  <p className="mt-4 min-h-[3.5rem] text-sm leading-relaxed text-muted-foreground">
                    {tier.audience}
                  </p>

                  <span className="rule my-6 block" />

                  <ul className="space-y-3">
                    {tier.perks.map((perk) => (
                      <li key={perk} className="flex items-start gap-2.5 text-sm text-blanc/90">
                        <Check className="mt-0.5 size-4 shrink-0 text-rosso" />
                        {perk}
                      </li>
                    ))}
                  </ul>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ----------------------------------------------- Comment adhérer --- */}
      <section className="border-y border-white/10 bg-ink py-24 md:py-32">
        <div className="container">
          <SectionHeading
            eyebrow="Mode d'emploi"
            title="Comment adhérer"
            description="Trois étapes simples pour rejoindre la grande famille du Cheval Cabré."
          />

          <div className="mt-16 grid gap-10 md:grid-cols-3">
            {membershipSteps.map((step, index) => (
              <Reveal key={step.title} delay={index * 0.1}>
                <div className="relative">
                  <span className="font-display text-6xl leading-none text-rosso/90">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <h3 className="mt-4 font-display text-xl uppercase tracking-tight text-white">
                    {step.title}
                  </h3>
                  <p className="mt-3 text-base leading-relaxed text-muted-foreground">
                    {step.description}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal delay={0.1}>
            <div className="mt-14 flex items-start gap-4 rounded-lg border border-gold/20 bg-gold/[0.04] p-6">
              <Calendar className="mt-0.5 size-5 shrink-0 text-gold" />
              <p className="text-sm leading-relaxed text-blanc/85">
                {membershipInfo.period}
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* --------------------------------------- Formulaire en ligne --- */}
      <section className="relative overflow-hidden bg-carbon-texture py-24 md:py-32">
        <div className="absolute inset-0 bg-rosso-glow opacity-40" aria-hidden />
        <div className="container relative z-10">
          <SectionHeading
            eyebrow="Adhésion en ligne"
            title="Le formulaire"
            description="Complétez le formulaire d'adhésion officiel ci-dessous. Une candidature, le début d'une belle aventure rouge."
          />

          <div className="mt-16 grid items-start gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:gap-12">
            {/* Left — info panel */}
            <Reveal direction="left" className="space-y-6 lg:sticky lg:top-28">
              {/* Ambiance + quote */}
              <div className="grain relative aspect-[4/3] overflow-hidden rounded-2xl border border-gold/20">
                <Image
                  src={membresImages[0]}
                  alt="Ferrari F355 Spider d'un membre du Scuderia Ferrari Club Paris"
                  fill
                  sizes="(min-width: 1024px) 40vw, 100vw"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-tr from-ink via-ink/70 to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-t from-rosso/25 via-transparent to-gold/10" />
                <div className="absolute inset-0 flex flex-col justify-between p-7">
                  <span className="eyebrow text-gold">Cercle privé</span>
                  <div>
                    <Quote className="mb-4 size-8 text-gold/70" strokeWidth={1.4} aria-hidden />
                    <p className="max-w-xs font-display text-xl uppercase leading-tight tracking-tight text-white sm:text-2xl">
                      Une passion ne se vit jamais aussi bien qu'à plusieurs.
                    </p>
                  </div>
                </div>
              </div>

              {/* Welcome kit highlight */}
              <div className="flex items-center gap-4 rounded-lg border border-gold/20 bg-gold/[0.04] p-5">
                <span className="grid size-11 shrink-0 place-items-center rounded-full border border-gold/40 bg-gold/10 text-gold">
                  <Gift className="size-5" strokeWidth={1.6} aria-hidden />
                </span>
                <p className="text-sm leading-relaxed text-blanc/90">
                  <span className="font-semibold text-gold">Welcome Kit offert</span>{" "}
                  à chaque adhésion : carte de membre et goodies Scuderia.
                </p>
              </div>

              {/* Payment methods */}
              <div className="rounded-lg border border-white/10 bg-card p-6">
                <h3 className="eyebrow mb-5">Règlement de la cotisation</h3>
                <ul className="space-y-4">
                  {membershipInfo.payment.map((method, i) => {
                    const Icon = paymentIcons[i % paymentIcons.length];
                    return (
                      <li key={method} className="flex items-start gap-3 text-sm text-blanc/85">
                        <span className="grid size-9 shrink-0 place-items-center rounded-md border border-white/10 bg-white/[0.03] text-rosso">
                          <Icon className="size-4" />
                        </span>
                        <span className="pt-1.5 leading-relaxed">{method}</span>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </Reveal>

            {/* Right — the Google Form */}
            <Reveal direction="right" delay={0.1}>
              <GoogleFormEmbed src={membershipInfo.formUrl} />
              <p className="mt-5 text-xs leading-relaxed text-muted-foreground">
                Formulaire hébergé par Google Forms. Vos informations ne servent
                qu'au traitement de votre demande d'adhésion.
              </p>
            </Reveal>
          </div>
        </div>
      </section>
    </>
  );
}
