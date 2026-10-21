/** Deterministic, reversible scroll poses. Values never depend on elapsed time. */
export const STORY_STOPS = [0, 0.47, 0.88] as const;
export const clamp01 = (value: number) => Math.min(1, Math.max(0, value));
export function easeBetween(start: number, end: number, progress: number) {
  const value = clamp01((progress - start) / (end - start));
  return value * value * (3 - 2 * value);
}
export function scrollPose(progress: number, reducedMotion = false) {
  let p = clamp01(progress);
  if (reducedMotion) p = p < 0.29 ? 0 : p < 0.68 ? 0.47 : 0.88;
  const orbit = easeBetween(0.12, 0.47, p);
  const opening = easeBetween(0.2, 0.46, p);
  const overhead = easeBetween(0.58, 0.86, p);
  return {
    progress: p,
    orbit,
    opening,
    overhead,
    chapter: (p < 0.29 ? 0 : p < 0.68 ? 1 : 2) as 0 | 1 | 2,
    camera: {
      x: (-6.5 + 1.9 * orbit) * (1 - overhead),
      y: 2.05 + 1.7 * orbit + 4.1 * overhead,
      z: (-1.4 + 6.2 * orbit) * (1 - overhead),
    },
  };
}
