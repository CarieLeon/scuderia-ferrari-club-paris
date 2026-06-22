import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import PageHeader from "@/components/PageHeader";
import Reveal from "@/components/Reveal";

import { articles } from "@/lib/content";

export const metadata: Metadata = {
  title: "Actualités",
  description:
    "L'actualité Ferrari vue par le Scuderia Ferrari Club Paris : Formule 1, modèles d'exception et patrimoine du Cheval Cabré.",
};

export default function ActualitesPage() {
  const [featured, ...rest] = articles;

  return (
    <>
      <PageHeader
        eyebrow="Le Journal"
        title="Actualités"
        description="L'actualité Ferrari vue par le club : Formule 1, modèles d'exception et patrimoine."
      />

      <section className="container py-24 md:py-32">
        {/* Featured — à la une */}
        {featured && (
          <Reveal>
            <Link
              href={`/actualites/${featured.slug}`}
              aria-label={`Lire l'article : ${featured.title}`}
              className="group relative grid overflow-hidden rounded-xl border border-white/10 bg-card transition-all duration-300 hover:-translate-y-1 hover:border-rosso hover:shadow-[0_30px_70px_rgba(255,40,0,0.20)] lg:grid-cols-2"
            >
              {/* Cover */}
              <div className="relative aspect-[16/10] overflow-hidden lg:aspect-auto lg:h-full lg:min-h-[26rem]">
                <Image
                  src={featured.cover}
                  alt={featured.title}
                  fill
                  priority
                  sizes="(min-width: 1024px) 50vw, 100vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-ink/10 to-transparent lg:bg-gradient-to-r" />
                <span className="absolute left-5 top-5 inline-flex items-center gap-2 rounded-full border border-gold/40 bg-ink/70 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-gold backdrop-blur">
                  À la une
                </span>
              </div>

              {/* Body */}
              <div className="relative flex flex-col justify-center gap-6 p-8 md:p-12">
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs font-semibold uppercase tracking-widest">
                  <span className="text-rosso">{featured.category}</span>
                  <span className="text-white/20">·</span>
                  <span className="text-muted-foreground">
                    {featured.dateLabel}
                  </span>
                  <span className="text-white/20">·</span>
                  <span className="text-muted-foreground">
                    {featured.readingTime} de lecture
                  </span>
                </div>

                <h2 className="display-title text-3xl leading-tight text-white transition-colors duration-300 group-hover:text-rosso sm:text-4xl lg:text-5xl">
                  {featured.title}
                </h2>

                <p className="max-w-xl text-base leading-relaxed text-muted-foreground md:text-lg">
                  {featured.excerpt}
                </p>

                <span className="mt-2 inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-widest text-rosso">
                  Lire l'article
                  <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1.5" />
                </span>
              </div>
            </Link>
          </Reveal>
        )}

        {/* Grid */}
        <div className="mt-12 grid gap-8 md:mt-16 md:grid-cols-2 lg:grid-cols-3">
          {rest.map((article, index) => (
            <Reveal
              key={article.slug}
              as="article"
              delay={index * 0.08}
              className="h-full"
            >
              <Link
                href={`/actualites/${article.slug}`}
                aria-label={`Lire l'article : ${article.title}`}
                className="group relative flex h-full flex-col overflow-hidden rounded-lg border border-white/10 bg-card transition-all duration-300 hover:-translate-y-1 hover:border-rosso hover:shadow-[0_20px_50px_rgba(255,40,0,0.18)]"
              >
                <div className="relative aspect-[16/10] overflow-hidden">
                  <Image
                    src={article.cover}
                    alt={article.title}
                    fill
                    sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-ink/60 via-transparent to-transparent" />
                </div>

                <div className="flex flex-1 flex-col gap-4 p-6">
                  <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 text-[0.7rem] font-semibold uppercase tracking-widest">
                    <span className="text-rosso">{article.category}</span>
                    <span className="text-white/20">·</span>
                    <span className="text-muted-foreground">
                      {article.dateLabel}
                    </span>
                    <span className="text-white/20">·</span>
                    <span className="text-muted-foreground">
                      {article.readingTime}
                    </span>
                  </div>

                  <h3 className="display-title text-2xl leading-tight text-white transition-colors duration-300 group-hover:text-rosso">
                    {article.title}
                  </h3>

                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {article.excerpt}
                  </p>

                  <span className="mt-auto inline-flex items-center gap-2 pt-2 text-sm font-semibold uppercase tracking-widest text-rosso">
                    Lire l'article
                    <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1.5" />
                  </span>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>
    </>
  );
}
