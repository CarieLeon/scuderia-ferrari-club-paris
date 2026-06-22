"use client";

import { AnimatePresence, motion } from "motion/react";
import { ChevronLeft, ChevronRight, X, ZoomIn } from "lucide-react";
import Image from "next/image";
import { useCallback, useEffect, useMemo, useState } from "react";

import { getImageDims } from "@/lib/image-dimensions";
import { cn } from "@/lib/utils";

export type GalleryItem = {
  src: string;
  alt: string;
  category?: string;
};

type GalleryProps = {
  images: GalleryItem[];
  /** Show category filter pills. */
  withFilters?: boolean;
  categories?: { key: string; label: string }[];
  /** Masonry (CSS columns) instead of a square grid. */
  masonry?: boolean;
  /** Progressive loading chunk size. Omit to render everything at once. */
  pageSize?: number;
  className?: string;
};

export default function Gallery({
  images,
  withFilters = false,
  categories = [],
  masonry = false,
  pageSize,
  className,
}: GalleryProps) {
  const [activeCat, setActiveCat] = useState<string>("all");
  const [visible, setVisible] = useState<number>(pageSize ?? images.length);
  const [lightbox, setLightbox] = useState<number | null>(null);

  const filtered = useMemo(() => {
    if (!withFilters || activeCat === "all") return images;
    return images.filter((img) => img.category === activeCat);
  }, [images, withFilters, activeCat]);

  const shown = filtered.slice(0, visible);
  const hasMore = visible < filtered.length;

  const selectCat = (key: string) => {
    setActiveCat(key);
    setVisible(pageSize ?? images.length);
  };

  const close = useCallback(() => setLightbox(null), []);
  const go = useCallback(
    (dir: 1 | -1) =>
      setLightbox((cur) =>
        cur === null ? cur : (cur + dir + filtered.length) % filtered.length,
      ),
    [filtered.length],
  );

  useEffect(() => {
    if (lightbox === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight") go(1);
      if (e.key === "ArrowLeft") go(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [lightbox, close, go]);

  const current = lightbox !== null ? filtered[lightbox] : null;

  return (
    <div className={className}>
      {/* Filters */}
      {withFilters && categories.length > 0 && (
        <div className="mb-10 flex flex-wrap justify-center gap-2">
          {categories.map((cat) => (
            <button
              key={cat.key}
              type="button"
              onClick={() => selectCat(cat.key)}
              className={cn(
                "rounded-full border px-5 py-2 text-xs font-semibold uppercase tracking-widest transition-all duration-300",
                activeCat === cat.key
                  ? "border-rosso bg-rosso text-white"
                  : "border-white/15 text-white/60 hover:border-white/40 hover:text-white",
              )}
            >
              {cat.label}
            </button>
          ))}
        </div>
      )}

      {/* Grid */}
      {masonry ? (
        <div className="gap-4 [column-fill:_balance] sm:columns-2 lg:columns-3 [&>*]:mb-4">
          {shown.map((img, i) => {
            const dims = getImageDims(img.src);
            return (
              <GalleryTile
                key={img.src}
                img={img}
                width={dims.w}
                height={dims.h}
                index={i}
                onOpen={() => setLightbox(filtered.indexOf(img))}
                masonry
              />
            );
          })}
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3">
          {shown.map((img) => (
            <GalleryTile
              key={img.src}
              img={img}
              index={0}
              onOpen={() => setLightbox(filtered.indexOf(img))}
            />
          ))}
        </div>
      )}

      {/* Load more */}
      {hasMore && (
        <div className="mt-12 flex justify-center">
          <button
            type="button"
            onClick={() => setVisible((v) => v + (pageSize ?? 12))}
            className="rounded-full border border-white/20 px-8 py-3 text-xs font-semibold uppercase tracking-widest text-white transition-all duration-300 hover:border-rosso hover:bg-rosso"
          >
            Voir plus de photos
          </button>
        </div>
      )}

      {/* Lightbox */}
      <AnimatePresence>
        {current && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] flex items-center justify-center bg-black/95 backdrop-blur-md"
            onClick={close}
          >
            <button
              type="button"
              aria-label="Fermer"
              onClick={close}
              className="absolute right-5 top-5 z-10 flex h-11 w-11 items-center justify-center rounded-full border border-white/15 text-white/80 transition-colors hover:border-rosso hover:text-rosso"
            >
              <X className="h-5 w-5" />
            </button>

            <button
              type="button"
              aria-label="Photo précédente"
              onClick={(e) => {
                e.stopPropagation();
                go(-1);
              }}
              className="absolute left-3 z-10 flex h-12 w-12 items-center justify-center rounded-full border border-white/15 text-white/80 transition-colors hover:border-rosso hover:text-rosso md:left-8"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>
            <button
              type="button"
              aria-label="Photo suivante"
              onClick={(e) => {
                e.stopPropagation();
                go(1);
              }}
              className="absolute right-3 z-10 flex h-12 w-12 items-center justify-center rounded-full border border-white/15 text-white/80 transition-colors hover:border-rosso hover:text-rosso md:right-8"
            >
              <ChevronRight className="h-6 w-6" />
            </button>

            <motion.figure
              key={current.src}
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
              className="relative mx-auto flex w-full max-w-[1600px] flex-col items-center px-12 sm:px-16 md:px-20"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative h-[72vh] w-full sm:h-[80vh]">
                <Image
                  src={current.src}
                  alt={current.alt}
                  fill
                  priority
                  sizes="(max-width: 1600px) 92vw, 1600px"
                  className="rounded-md object-contain drop-shadow-[0_30px_60px_rgba(0,0,0,0.6)]"
                />
              </div>
              <figcaption className="mt-5 flex flex-wrap items-center justify-center gap-3 text-xs uppercase tracking-widest text-white/60">
                <span className="font-display text-base text-rosso">
                  {(lightbox ?? 0) + 1} / {filtered.length}
                </span>
                <span className="hidden sm:inline">{current.alt}</span>
              </figcaption>
            </motion.figure>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ------------------------------------------------------------- One tile --- */

function GalleryTile({
  img,
  width,
  height,
  index,
  onOpen,
  masonry = false,
}: {
  img: GalleryItem;
  width?: number;
  height?: number;
  index: number;
  onOpen: () => void;
  masonry?: boolean;
}) {
  const [loaded, setLoaded] = useState(false);

  return (
    <button
      type="button"
      onClick={onOpen}
      className={cn(
        "group relative block w-full overflow-hidden rounded-md border border-white/10 bg-carbon",
        masonry ? "break-inside-avoid" : "aspect-square",
      )}
    >
      <span
        className={cn(
          "absolute inset-0 z-0 bg-carbon transition-opacity duration-700",
          loaded ? "opacity-0" : "animate-pulse opacity-100",
        )}
      />
      {masonry ? (
        <Image
          src={img.src}
          alt={img.alt}
          width={width}
          height={height}
          loading="lazy"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          onLoad={() => setLoaded(true)}
          className={cn(
            "h-auto w-full object-cover transition-all duration-700 group-hover:scale-[1.04]",
            loaded ? "opacity-100" : "opacity-0",
          )}
        />
      ) : (
        <Image
          src={img.src}
          alt={img.alt}
          fill
          loading="lazy"
          sizes="(max-width: 768px) 50vw, 33vw"
          onLoad={() => setLoaded(true)}
          className={cn(
            "object-cover transition-all duration-700 group-hover:scale-[1.06]",
            loaded ? "opacity-100" : "opacity-0",
          )}
        />
      )}

      {/* Hover overlay */}
      <span className="absolute inset-0 z-10 flex items-center justify-center bg-gradient-to-t from-black/70 via-black/0 to-black/0 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
        <span className="flex h-12 w-12 items-center justify-center rounded-full border border-white/40 text-white backdrop-blur-sm">
          <ZoomIn className="h-5 w-5" />
        </span>
      </span>
      <span className="pointer-events-none absolute inset-0 z-10 ring-rosso/0 transition-all duration-300 group-hover:ring-2 group-hover:ring-rosso/70" />
    </button>
  );
}
