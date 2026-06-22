import dims from "./image-dimensions.json";

export type Dimensions = { w: number; h: number };

const map = dims as Record<string, Dimensions>;

/** Real pixel dimensions for a /public image, with a 4:3 fallback. */
export function getImageDims(src: string): Dimensions {
  return map[src] ?? { w: 1024, h: 768 };
}
