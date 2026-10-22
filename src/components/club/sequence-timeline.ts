/** The two camera moves share a held three-quarter view between frames 59 and 60. */
export const SEQUENCE_FRAME_COUNT = 104;
export const SEQUENCE_ASSET_VERSION = "studio-v4-2";
export const SEQUENCE_WIDTH = 1280;
export const SEQUENCE_HEIGHT = 800;
export const SEQUENCE_KEYFRAMES = [0, 59, 103] as const;

export function sequenceProgress(progress: number, reducedMotion = false) {
  const p = Number.isNaN(progress) ? 0 : Math.min(1, Math.max(0, progress));
  return reducedMotion ? (p < 0.29 ? 0 : p < 0.68 ? 0.47 : 0.88) : p;
}

/** Scroll chooses an exact pre-rendered pose; reversing scroll retraces the same frames. */
export function sequenceFrame(progress: number, reducedMotion = false) {
  const p = sequenceProgress(progress, reducedMotion);
  if (p <= 0.12) return 0;
  if (p < 0.47) return Math.round(((p - 0.12) / 0.35) * 59);
  if (p <= 0.58) return 59;
  if (p < 0.86) return 59 + Math.round(((p - 0.58) / 0.28) * 44);
  return 103;
}

/** Metadata for the pose actually drawn, including when a nearby loaded frame is shown. */
export function sequenceFramePose(frame: number) {
  const index = Math.min(103, Math.max(0, Math.round(frame)));
  const p = index <= 59 ? 0.12 + (index / 59) * 0.35 : 0.58 + ((index - 59) / 44) * 0.28;
  const transition = (start: number, end: number) => {
    const value = Math.min(1, Math.max(0, (p - start) / (end - start)));
    return value * value * (3 - 2 * value);
  };
  return { opening: transition(0.2, 0.46), overhead: transition(0.58, 0.86) };
}
