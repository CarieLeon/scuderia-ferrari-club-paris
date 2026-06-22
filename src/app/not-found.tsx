import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Images } from "lucide-react";

import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Page introuvable",
  description:
    "La page que vous cherchez a quitté la piste. Retrouvez le chemin vers l'accueil du Scuderia Ferrari Club Paris.",
};

export default function NotFound() {
  return (
    <section className="relative grain min-h-[80vh] overflow-hidden bg-carbon-texture pt-32 pb-24 md:pt-40 md:pb-32">
      {/* Ambient rosso glow */}
      <div
        aria-hidden
        className="bg-rosso-glow pointer-events-none absolute inset-0 -z-10 opacity-70"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-0 -z-10 h-[420px] w-[420px] -translate-x-1/2 rounded-full bg-rosso/20 blur-[160px]"
      />

      <div className="container flex min-h-[60vh] flex-col items-center justify-center text-center">
        {/* Eyebrow */}
        <p className="eyebrow mb-8 justify-center">Erreur 404</p>

        {/* Huge display number */}
        <h1 className="display-title text-gradient-rosso text-[26vw] leading-[0.82] sm:text-[22vw] md:text-[16rem] lg:text-[20rem]">
          404
        </h1>

        {/* Thin divider */}
        <div className="rule mx-auto mt-2 w-40 max-w-[60vw] md:w-56" />

        {/* Headline */}
        <h2 className="display-title mt-10 text-3xl text-blanc sm:text-4xl md:text-5xl">
          Page introuvable
        </h2>

        {/* Sub line */}
        <p className="mt-5 max-w-xl text-base text-muted-foreground sm:text-lg">
          La page que vous cherchez a quitté la piste. Reprenons la ligne droite
          ensemble.
        </p>

        {/* Actions */}
        <div className="mt-12 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
          <Button asChild size="lg">
            <Link href="/">
              <ArrowLeft />
              Retour à l&apos;accueil
            </Link>
          </Button>
          <Button asChild size="lg" variant="outline">
            <Link href="/galerie">
              <Images />
              Explorer la galerie
            </Link>
          </Button>
        </div>

        {/* Signature accent */}
        <p className="mt-14 text-xs uppercase tracking-[0.35em] text-muted-foreground/70">
          Scuderia Ferrari Club <span className="text-rosso">Paris</span>
        </p>
      </div>
    </section>
  );
}
