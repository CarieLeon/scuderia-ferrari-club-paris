"use client";

import { Loader2 } from "lucide-react";
import { useState } from "react";

/**
 * Styled wrapper around an embedded Google Form. The form interior is served by
 * Google (cross-origin) so it keeps its own look; we frame it premium and add a
 * loading state. `data-lenis-prevent` lets the iframe scroll independently.
 */
export default function GoogleFormEmbed({
  src,
  title = "Formulaire d'adhésion",
  height = 1500,
}: {
  src: string;
  title?: string;
  height?: number;
}) {
  const [loaded, setLoaded] = useState(false);

  return (
    <div
      data-lenis-prevent
      className="relative overflow-hidden rounded-xl border border-white/10 bg-white shadow-[0_30px_80px_rgba(0,0,0,0.5)]"
    >
      {/* Top brand bar */}
      <div className="flex items-center gap-3 border-b border-black/10 bg-noir px-5 py-3">
        <span className="h-2.5 w-2.5 rounded-full bg-rosso" />
        <span className="text-xs font-semibold uppercase tracking-[0.2em] text-white/80">
          Formulaire d&apos;adhésion officiel
        </span>
      </div>

      {!loaded && (
        <div className="absolute inset-0 top-12 flex flex-col items-center justify-center gap-3 bg-white text-noir/60">
          <Loader2 className="h-6 w-6 animate-spin text-rosso" />
          <span className="text-sm">Chargement du formulaire…</span>
        </div>
      )}

      <iframe
        src={src}
        title={title}
        onLoad={() => setLoaded(true)}
        loading="lazy"
        style={{ height }}
        className="w-full"
      >
        Chargement du formulaire…
      </iframe>
    </div>
  );
}
