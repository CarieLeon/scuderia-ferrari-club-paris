/** Held viewpoints reached by the hero controls and reduced-motion preference. */
export const STORY_STOPS = [0, 0.47, 0.88] as const;
export const clamp01 = (value: number) => Math.min(1, Math.max(0, value));
export const scrollChapter = (progress: number): 0 | 1 | 2 => progress < 0.29 ? 0 : progress < 0.68 ? 1 : 2;
