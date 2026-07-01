import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ArrowLeft, ArrowRight, Calendar, Clock } from "lucide-react";

import Reveal from "@/components/Reveal";
import SectionHeading from "@/components/SectionHeading";
import { Button } from "@/components/ui/button";
import { articles } from "@/lib/content";

export async function generateStaticParams() {
  return articles.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const article = articles.find((a) => a.slug === slug);

  if (!article) {
    return {
      title: "Actualité introuvable",
      description: "Cette actualité du Scuderia Ferrari Club Paris est introuvable.",
    };
  }

  return {
    title: article.title,
    description: article.excerpt,
    openGraph: {
      title: article.title,
      description: article.excerpt,
      images: [article.cover],
    },
  };
}

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = articles.find((a) => a.slug === slug);

  if (!article) notFound();

  const others = articles.filter((a) => a.slug !== article.slug);

  return (
    <article>
      {/* ----------------------------------------------------------- Hero --- */}
      <header className="relative h-[60vh] min-h-[460px] w-full overflow-hidden">
        <Image
          src={article.cover}
          alt={article.title}
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        {/* Dark gradient overlay for legibility */}
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/70 to-ink/30" />
        <div className="absolute inset-0 bg-gradient-to-r from-ink/70 via-transparent to-transparent" />

        <div className="container relative z-10 flex h-full flex-col justify-end pb-12 pt-44">
          <Reveal className="max-w-4xl">
            <Link
              href="/actualites"
              className="group mb-8 inline-flex items-center gap-2 text-sm font-medium uppercase tracking-widest text-muted-foreground transition-colors hover:text-rosso"
            >
              <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
              Toutes les actualités
            </Link>

            <div className="mb-5 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-blanc/80">
              <span className="inline-flex items-center rounded-full border border-rosso/60 bg-rosso/10 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-rosso">
                {article.category}
              </span>
              <span className="inline-flex items-center gap-2">
                <Calendar className="h-4 w-4 text-rosso" />
                <time dateTime={article.date}>{article.dateLabel}</time>
              </span>
              <span className="inline-flex items-center gap-2">
                <Clock className="h-4 w-4 text-rosso" />
                {article.readingTime} de lecture
              </span>
            </div>

            <h1 className="display-title text-4xl text-white sm:text-5xl lg:text-6xl">
              {article.title}
            </h1>
          </Reveal>
        </div>
      </header>

      {/* ----------------------------------------------------------- Body --- */}
      <section className="container py-20 md:py-28">
        <Reveal className="mx-auto max-w-3xl">
          <p className="rule mb-12" />

          <p className="mb-12 border-l-2 border-rosso pl-6 text-xl font-medium leading-relaxed text-foreground">
            {article.excerpt}
          </p>

          <div className="space-y-7">
            {article.content.map((paragraph, i) => (
              <p
                key={i}
                className="text-lg leading-relaxed text-muted-foreground"
              >
                {paragraph}
              </p>
            ))}
          </div>

          <div className="rule mt-14 mb-10" />

          <div className="flex flex-col items-start gap-6 sm:flex-row sm:items-center sm:justify-between">
            <Link
              href="/actualites"
              className="group inline-flex items-center gap-2 text-sm font-medium uppercase tracking-widest text-muted-foreground transition-colors hover:text-rosso"
            >
              <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
              Retour aux actualités
            </Link>
            <Button asChild size="lg">
              <Link href="/adhesion">Rejoindre le club</Link>
            </Button>
          </div>
        </Reveal>
      </section>

      {/* -------------------------------------------------- Autres articles --- */}
      <section className="bg-carbon-texture border-t border-border py-24 md:py-32">
        <div className="container">
          <SectionHeading
            eyebrow="À lire également"
            title="Autres articles"
            description="Poursuivez votre lecture avec d'autres récits issus de l'univers du Cheval Cabré."
          />

          <div className="mt-14 grid gap-8 md:grid-cols-2">
            {others.map((other, i) => (
              <Reveal key={other.slug} delay={i * 0.08}>
                <Link
                  href={`/actualites/${other.slug}`}
                  className="group relative flex h-full flex-col overflow-hidden rounded-lg border border-border bg-card transition-all duration-300 hover:-translate-y-1 hover:border-rosso hover:shadow-[0_20px_50px_rgba(255,40,0,0.18)]"
                >
                  <div className="relative aspect-[16/9] overflow-hidden">
                    <Image
                      src={other.cover}
                      alt={other.title}
                      fill
                      sizes="(min-width: 768px) 50vw, 100vw"
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-transparent to-transparent" />
                    <span className="absolute left-4 top-4 inline-flex items-center rounded-full border border-rosso/60 bg-ink/70 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-rosso backdrop-blur">
                      {other.category}
                    </span>
                  </div>

                  <div className="flex flex-1 flex-col p-6">
                    <div className="mb-3 flex items-center gap-x-4 text-xs uppercase tracking-widest text-muted-foreground">
                      <time dateTime={other.date}>{other.dateLabel}</time>
                      <span className="inline-flex items-center gap-1.5">
                        <Clock className="h-3.5 w-3.5" />
                        {other.readingTime}
                      </span>
                    </div>

                    <h3 className="display-title text-2xl leading-tight text-foreground transition-colors group-hover:text-rosso">
                      {other.title}
                    </h3>

                    <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                      {other.excerpt}
                    </p>

                    <span className="mt-auto inline-flex items-center gap-2 pt-6 text-sm font-medium uppercase tracking-widest text-rosso">
                      Lire l&apos;article
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </span>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>

          {/* ---------------------------------------------------- CTA band --- */}
          <Reveal className="mt-20">
            <div className="grain relative overflow-hidden rounded-2xl border border-border bg-card px-8 py-14 text-center md:px-16 md:py-20">
              <div className="absolute inset-0 bg-rosso-glow opacity-50" />
              <div className="relative z-10 mx-auto max-w-2xl">
                <span className="eyebrow mb-5 justify-center">Rejoignez-nous</span>
                <h2 className="display-title text-3xl text-foreground sm:text-4xl lg:text-5xl">
                  Vivez la passion <span className="text-gradient-rosso">Ferrari</span> à nos côtés
                </h2>
                <p className="mx-auto mt-5 max-w-xl text-lg leading-relaxed text-muted-foreground">
                  Rassemblements, road-trips et soirées d&apos;exception : devenez
                  membre du Scuderia Ferrari Club Paris et faites battre le cœur
                  rouge de Maranello.
                </p>
                <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
                  <Button asChild size="lg">
                    <Link href="/adhesion">Adhérer au club</Link>
                  </Button>
                  <Button asChild size="lg" variant="outline">
                    <Link href="/actualites">Toutes les actualités</Link>
                  </Button>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </article>
  );
}
