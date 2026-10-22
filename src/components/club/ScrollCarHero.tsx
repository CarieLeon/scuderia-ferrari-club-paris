"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import { ArrowDown, ArrowDownRight, ArrowUpRight } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { clamp01, scrollChapter, STORY_STOPS } from "./scroll-timeline";
import { SEQUENCE_ASSET_VERSION } from "./sequence-timeline";
import styles from "./ScrollCarHero.module.css";

const CarSequence = dynamic(() => import("./CarSequence"), { ssr: false });
const chapters = [
  { label: "La passion", title: "L’ITALIE AU CŒUR.", second: "PARIS EN ROUGE.", copy: "Une silhouette. Une émotion.\nL’histoire commence ici.", detail: "FERRARI F40" },
  { label: "Le design", title: "CHAQUE LIGNE", second: "A SON HISTOIRE.", copy: "Les portes s’ouvrent. Le regard change.\nLa passion se révèle, sous tous les angles.", detail: "LE DESIGN, SOUS UN AUTRE ANGLE" },
  { label: "La mécanique", title: "L’ÉMOTION", second: "À CŒUR OUVERT.", copy: "Sous la carrosserie, une même passion.\nEt l’envie de la partager.", detail: "LA MÉCANIQUE DE LA PASSION" },
];

export default function ScrollCarHero() {
  const story = useRef<HTMLElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const progress = useRef(0);
  const currentChapter = useRef(0);
  const [chapter, setChapter] = useState(0);
  const [ready, setReady] = useState(false);
  const [fallback, setFallback] = useState(false);
  const [reduced, setReduced] = useState(false);
  const current = chapters[chapter];
  const markReady = useCallback(() => setReady(true), []);
  const markFallback = useCallback(() => setFallback(true), []);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updateMotion = () => setReduced(media.matches);
    updateMotion();
    media.addEventListener("change", updateMotion);
    let frame = 0;
    const update = () => {
      frame = 0;
      if (!story.current || !stage.current) return;
      const box = story.current.getBoundingClientRect();
      const distance = story.current.offsetHeight - stage.current.offsetHeight;
      const value = distance > 0 ? clamp01(-box.top / distance) : 0;
      progress.current = value;
      stage.current.style.setProperty("--scroll-progress", String(value));
      const next = scrollChapter(value);
      if (next !== currentChapter.current) {
        currentChapter.current = next;
        setChapter(next);
      }
    };
    const schedule = () => { if (!frame) frame = window.requestAnimationFrame(update); };
    update();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      media.removeEventListener("change", updateMotion);
    };
  }, []);

  const goTo = (index: number) => {
    if (!story.current || !stage.current) return;
    const start = window.scrollY + story.current.getBoundingClientRect().top;
    const distance = story.current.offsetHeight - stage.current.offsetHeight;
    window.scrollTo({ top: start + distance * STORY_STOPS[index], behavior: reduced ? "instant" : "smooth" });
  };

  return <section ref={story} className={`${styles.story} ${fallback ? styles.fallback : ""}`} aria-label="Explorez la Ferrari au fil du défilement">
    <div ref={stage} className={styles.stage} data-car-ready={ready} data-car-chapter={chapter}>
      <div className={styles.atmosphere} />
      <div aria-hidden={ready && !fallback} className={`${styles.poster} ${!ready || fallback ? styles.posterVisible : ""}`}><picture><source media="(max-width: 700px)" srcSet={`/images/car-sequence/mobile/frame-000.webp?v=${SEQUENCE_ASSET_VERSION}`} /><Image src={`/images/car-sequence/desktop/frame-000.webp?v=${SEQUENCE_ASSET_VERSION}`} alt="Ferrari F40 rouge dans un studio sombre" width={1280} height={800} priority unoptimized /></picture></div>
      {!fallback && <CarSequence progress={progress} reducedMotion={reduced} onReady={markReady} onError={markFallback} />}
      <div className={styles.topline}><span><i /> SCUDERIA FERRARI CLUB PARIS</span><span>48°51′ N &nbsp; 2°21′ E</span></div>
      <div className={styles.copy} aria-live="polite" aria-atomic="true"><span className={styles.chapterEyebrow}>{String(chapter + 1).padStart(2, "0")} / {current.label}</span><h1 key={chapter}><span>{current.title}</span><strong>{current.second}</strong></h1><p>La passion Ferrari. L’esprit parisien.</p></div>
      <div className={styles.modelLabel}>{fallback ? "LA PASSION FERRARI" : current.detail}</div>
      {chapter === 2 && !fallback && <div className={styles.mechanicalNote}><span>SOUS LA CARROSSERIE</span><strong>Le cœur du mythe.</strong><p>L’ingénierie se découvre.<br />La passion se partage.</p><a href="#le-club">Rencontrer le club <ArrowUpRight size={15} /></a></div>}
      <div className={styles.bottom}><div className={styles.bottomCopy}><p>{current.copy}</p><a href="#le-club">Entrez dans le club <span><ArrowDownRight size={18} /></span></a></div><div className={styles.controls}><span>{fallback ? "DÉCOUVRIR LE CLUB" : ready ? "FAITES DÉFILER POUR EXPLORER" : "L’ÉMOTION PREND FORME"}</span><div className={styles.steps}>{chapters.map((item, index) => <button key={item.label} type="button" disabled={!ready} onClick={() => goTo(index)} aria-label={`Voir ${item.label}`} aria-pressed={chapter === index} className={chapter === index ? styles.active : ""}><b>{String(index + 1).padStart(2, "0")}</b><span>{item.label}</span></button>)}</div><div className={styles.progress}><i /></div></div></div>
      {!fallback && <span className={styles.scrollCue} aria-hidden="true"><ArrowDown size={14} /></span>}
      <a className={styles.credit} href="https://sketchfab.com/3d-models/ferrari-f40-52a66c41cfcd4f999fb1b1c49bf24d70" target="_blank" rel="noreferrer">Création originale : Black Snow · CC BY 4.0</a>
    </div>
  </section>;
}
