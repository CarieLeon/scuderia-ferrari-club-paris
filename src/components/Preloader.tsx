"use client";

import {
  animate,
  AnimatePresence,
  motion,
  useMotionValue,
  useTransform,
} from "motion/react";
import Image from "next/image";
import { useEffect, useState } from "react";

import { siteConfig } from "@/lib/site";

// easeOutExpo-ish for the count, easeInOutQuint for the reveal.
const EASE_COUNT = [0.16, 1, 0.3, 1] as const;
const EASE_DOOR = [0.83, 0, 0.17, 1] as const;

/**
 * Cinematic intro loader (ferrari.com style). A single continuous tween drives
 * the progress bar (via scaleX) and the counter (via a motion value, so there
 * are no per-frame React re-renders) for a perfectly smooth fill. When it
 * completes, two panels split open like a garage door to reveal the site.
 */
export default function Preloader() {
  const [done, setDone] = useState(false);

  const count = useMotionValue(0);
  const display = useTransform(count, (v) =>
    String(Math.round(v)).padStart(3, "0"),
  );
  const scaleX = useTransform(count, [0, 100], [0, 1]);
  const headLeft = useTransform(count, [0, 100], ["0%", "100%"]);

  useEffect(() => {
    const root = document.documentElement;
    root.style.overflow = "hidden";

    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    const controls = animate(count, 100, {
      duration: reduce ? 0.6 : 2.3,
      ease: EASE_COUNT,
      onComplete: () => {
        window.setTimeout(() => {
          setDone(true);
          root.style.overflow = "";
        }, 360);
      },
    });

    return () => {
      controls.stop();
      root.style.overflow = "";
    };
  }, [count]);

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          key="preloader"
          className="pointer-events-none fixed inset-0 z-[100] overflow-hidden"
          aria-hidden
        >
          {/* Garage-door panels */}
          <motion.div
            className="absolute inset-x-0 top-0 h-[50.5%] bg-ink"
            exit={{ y: "-100%" }}
            transition={{ duration: 1.05, ease: EASE_DOOR, delay: 0.12 }}
          />
          <motion.div
            className="absolute inset-x-0 bottom-0 h-[50.5%] bg-ink"
            exit={{ y: "100%" }}
            transition={{ duration: 1.05, ease: EASE_DOOR, delay: 0.12 }}
          />

          {/* Breathing rosso glow */}
          <motion.div
            className="pointer-events-none absolute inset-0 bg-rosso-glow"
            initial={{ opacity: 0.35 }}
            animate={{ opacity: [0.35, 0.6, 0.35] }}
            transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
            exit={{ opacity: 0 }}
          />

          {/* Center seam flash */}
          <motion.div
            className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-gradient-to-r from-transparent via-rosso to-transparent"
            initial={{ opacity: 0, scaleX: 0.3 }}
            exit={{ opacity: [0, 1, 0], scaleX: 1.5 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          />

          {/* Content */}
          <motion.div
            className="absolute inset-0 flex flex-col items-center justify-center px-6"
            exit={{ opacity: 0, scale: 0.97, filter: "blur(6px)" }}
            transition={{ duration: 0.4, ease: "easeIn" }}
          >
            {/* Logo with a shine sweep */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, ease: EASE_COUNT }}
              className="relative overflow-hidden"
            >
              <Image
                src={siteConfig.logo}
                alt={siteConfig.name}
                width={2560}
                height={567}
                priority
                className="h-12 w-auto sm:h-14"
              />
              <motion.div
                className="pointer-events-none absolute inset-0 -skew-x-12 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                initial={{ x: "-160%" }}
                animate={{ x: "160%" }}
                transition={{
                  duration: 1.6,
                  ease: "easeInOut",
                  delay: 0.6,
                  repeat: Infinity,
                  repeatDelay: 1,
                }}
              />
            </motion.div>

            {/* Progress track */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="relative mt-12 h-[3px] w-60 overflow-visible rounded-full bg-white/12 sm:w-72"
            >
              {/* Filled portion (GPU transform = smooth) */}
              <motion.div
                style={{ scaleX }}
                className="absolute inset-0 origin-left rounded-full bg-rosso shadow-[0_0_14px_rgba(255,40,0,0.7)]"
              />
              {/* Leading glow head */}
              <motion.span
                style={{ left: headLeft }}
                className="absolute top-1/2 h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white shadow-[0_0_18px_5px_rgba(255,40,0,0.85)]"
              />
            </motion.div>

            {/* Label + live counter */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="mt-6 flex w-60 items-center justify-between sm:w-72"
            >
              <span className="text-[10px] font-semibold uppercase tracking-[0.35em] text-white/40">
                Chargement
              </span>
              <motion.span className="font-display text-base tabular-nums tracking-wide text-rosso">
                {display}
              </motion.span>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
