"use client";

import { motion, type Variants } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";

type HeroSliderProps = {
  images: string[];
  eyebrow?: string;
  title: string;
  subtitle: string;
  intervalMs?: number;
};

const container: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.04, delayChildren: 0.3 },
  },
};

const letter: Variants = {
  hidden: { opacity: 0, y: "0.5em", rotateX: -40 },
  visible: {
    opacity: 1,
    y: 0,
    rotateX: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  },
};

export default function HeroSlider({
  images,
  eyebrow = "Club Officiel Ferrari",
  title,
  subtitle,
  intervalMs = 5000,
}: HeroSliderProps) {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const id = setInterval(
      () => setActive((prev) => (prev + 1) % images.length),
      intervalMs,
    );
    return () => clearInterval(id);
  }, [images.length, intervalMs]);

  const words = title.split(" ");

  return (
    <section className="relative flex h-[100svh] min-h-[640px] w-full items-center justify-center overflow-hidden">
      {/* Background slides */}
      <div className="absolute inset-0">
        {images.map((src, i) => (
          <motion.div
            key={src}
            className="absolute inset-0"
            initial={false}
            animate={{
              opacity: i === active ? 1 : 0,
              scale: i === active ? 1.08 : 1,
            }}
            transition={{
              opacity: { duration: 1.6, ease: "easeInOut" },
              scale: { duration: 6.5, ease: "easeOut" },
            }}
          >
            <Image
              src={src}
              alt=""
              fill
              priority={i === 0}
              sizes="100vw"
              className="object-cover"
            />
          </motion.div>
        ))}
      </div>

      {/* Overlays for legibility */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/45 to-ink" />
      <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-transparent to-transparent" />
      <div className="absolute inset-0 bg-rosso-glow opacity-70 mix-blend-screen" />

      {/* Content */}
      <div className="container relative z-10 flex flex-col items-center text-center">
        <motion.span
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="eyebrow mb-7 text-white/80"
        >
          {eyebrow}
        </motion.span>

        <motion.h1
          variants={container}
          initial="hidden"
          animate="visible"
          aria-label={title}
          className="display-title text-[clamp(2.75rem,9vw,8rem)] text-white [perspective:600px]"
        >
          {words.map((word, wi) => (
            <span key={wi} className="mr-[0.25em] inline-block whitespace-nowrap">
              {word.split("").map((char, ci) => (
                <motion.span
                  key={ci}
                  variants={letter}
                  className="inline-block [transform-style:preserve-3d]"
                >
                  {char}
                </motion.span>
              ))}
            </span>
          ))}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.9 }}
          className="mt-7 max-w-xl text-base text-white/75 sm:text-lg"
        >
          {subtitle}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.1 }}
          className="mt-10 flex flex-col gap-4 sm:flex-row"
        >
          <Button asChild size="lg">
            <Link href="/adhesion">Devenir membre</Link>
          </Button>
          <Button asChild size="lg" variant="outline">
            <Link href="/presentation">Découvrir le club</Link>
          </Button>
        </motion.div>
      </div>

      {/* Slide indicators */}
      <div className="absolute bottom-10 left-1/2 z-10 flex -translate-x-1/2 items-center gap-3">
        {images.map((src, i) => (
          <button
            key={src}
            type="button"
            aria-label={`Voir la photo ${i + 1}`}
            onClick={() => setActive(i)}
            className="group flex h-6 items-center"
          >
            <span
              className={`block h-[3px] rounded-full transition-all duration-500 ${
                i === active
                  ? "w-10 bg-rosso"
                  : "w-5 bg-white/30 group-hover:bg-white/60"
              }`}
            />
          </button>
        ))}
      </div>

      {/* Scroll cue */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.6, duration: 1 }}
        className="absolute bottom-9 right-6 z-10 hidden items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.3em] text-white/50 md:flex"
      >
        <span>Défiler</span>
        <motion.span
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 1.6, repeat: Infinity }}
          className="block h-8 w-px bg-gradient-to-b from-rosso to-transparent"
        />
      </motion.div>
    </section>
  );
}
