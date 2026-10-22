"use client";

import { useEffect, useRef, type RefObject } from "react";
import {
  SEQUENCE_ASSET_VERSION,
  SEQUENCE_FRAME_COUNT,
  SEQUENCE_HEIGHT,
  SEQUENCE_KEYFRAMES,
  SEQUENCE_WIDTH,
  sequenceFrame,
  sequenceFramePose,
  sequenceProgress,
} from "./sequence-timeline";

interface Props {
  progress: RefObject<number>;
  reducedMotion: boolean;
  onReady: () => void;
  onError: () => void;
}

interface DecodedFrame {
  source: CanvasImageSource;
  release: () => void;
  used: number;
}

/** Pre-rendered studio images: scroll controls the pose without a real-time WebGL scene. */
export default function CarSequence({ progress, reducedMotion, onReady, onError }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reduce = useRef(reducedMotion);
  const motionChanged = useRef<(() => void) | null>(null);

  useEffect(() => {
    reduce.current = reducedMotion;
    motionChanged.current?.();
  }, [reducedMotion]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext("2d", { alpha: true });
    if (!context) { onError(); return; }
    const host = canvas.parentElement!;
    const mobileAssets = (host.clientWidth || window.innerWidth) < 700;
    const variant = mobileAssets ? "mobile" : "desktop";
    const keys = new Set<number>(SEQUENCE_KEYFRAMES);
    // Compressed WebPs may fill the browser cache; decoded RGBA surfaces stay bounded.
    const blobs = new Map<number, Blob>();
    const decoded = new Map<number, DecodedFrame>();
    const active = new Map<number, AbortController>();
    const queued = new Map<number, { priority: number; decode: boolean }>();
    const failed = new Set<number>();
    const concurrency = 4;
    const nearRadius = mobileAssets ? 5 : 9;
    let cacheLimit = mobileAssets ? 26 : 32;
    let disposed = false;
    let announced = false;
    let firstFrameFailed = false;
    let intersecting = true;
    let visible = !document.hidden;
    let dirty = true;
    let animation = 0;
    let idle = 0;
    let idleUsesTimeout = false;
    let used = 0;
    let target = sequenceFrame(progress.current ?? 0, reduce.current);
    let direction = 1;
    let lastDrawn = -1;
    let width = 0;
    let height = 0;
    let dpr = 1;

    const evict = () => {
      while (decoded.size > cacheLimit) {
        const candidates = [...decoded].filter(([index]) => !keys.has(index) && index !== target && index !== lastDrawn);
        candidates.sort((a, b) => a[1].used - b[1].used);
        const oldest = candidates[0];
        if (!oldest) break;
        oldest[1].release();
        decoded.delete(oldest[0]);
      }
    };

    const featherFrame = (image: Omit<DecodedFrame, "used">, imageWidth: number, imageHeight: number, signal: AbortSignal, index: number): Omit<DecodedFrame, "used"> => {
      if (disposed || signal.aborted) return image;
      const surface = document.createElement("canvas");
      surface.width = imageWidth;
      surface.height = imageHeight;
      const release = () => { surface.width = surface.height = 1; };
      try {
        const maskContext = surface.getContext("2d", { alpha: true });
        if (!maskContext) { release(); return image; }
        maskContext.drawImage(image.source, 0, 0, imageWidth, imageHeight);
        maskContext.globalCompositeOperation = "destination-in";
        // Fade the studio backplate at its edges while keeping the whole car opaque.
        const horizontal = maskContext.createLinearGradient(0, 0, imageWidth, 0);
        horizontal.addColorStop(0, "rgba(0,0,0,0)");
        const overhead = sequenceFramePose(index).overhead;
        const sideFeather = 0.06 + 0.18 * overhead;
        horizontal.addColorStop(sideFeather, "rgba(0,0,0,1)");
        horizontal.addColorStop(1 - sideFeather, "rgba(0,0,0,1)");
        horizontal.addColorStop(1, "rgba(0,0,0,0)");
        maskContext.fillStyle = horizontal;
        maskContext.fillRect(0, 0, imageWidth, imageHeight);
        const vertical = maskContext.createLinearGradient(0, 0, 0, imageHeight);
        vertical.addColorStop(0, "rgba(0,0,0,0)");
        vertical.addColorStop(0.06, "rgba(0,0,0,1)");
        vertical.addColorStop(Math.min(0.98, 0.87 + 0.12 * Math.sqrt(overhead)), "rgba(0,0,0,1)");
        vertical.addColorStop(1, "rgba(0,0,0,0)");
        maskContext.fillStyle = vertical;
        maskContext.fillRect(0, 0, imageWidth, imageHeight);
        maskContext.globalCompositeOperation = "source-over";
      } catch {
        release();
        return image;
      }
      image.release();
      return { source: surface, release };
    };

    const decodeBlob = async (blob: Blob, signal: AbortSignal, index: number): Promise<Omit<DecodedFrame, "used">> => {
      if (typeof window.createImageBitmap === "function") {
        try {
          const bitmap = await window.createImageBitmap(blob);
          return featherFrame({ source: bitmap, release: () => bitmap.close() }, bitmap.width, bitmap.height, signal, index);
        } catch (error) {
          if (signal.aborted) throw error;
          // Safari versions with incomplete WebP ImageBitmap support use an image element.
        }
      }
      const url = URL.createObjectURL(blob);
      const image = new window.Image();
      image.decoding = "async";
      try {
        await new Promise<void>((resolve, reject) => {
          const clear = () => {
            image.onload = null;
            image.onerror = null;
            signal.removeEventListener("abort", abort);
          };
          const abort = () => { clear(); image.src = ""; reject(new DOMException("Aborted", "AbortError")); };
          image.onload = () => { clear(); resolve(); };
          image.onerror = () => { clear(); reject(new Error("Unable to decode sequence frame")); };
          signal.addEventListener("abort", abort, { once: true });
          if (signal.aborted) abort();
          else image.src = url;
        });
        return featherFrame({ source: image, release: () => { image.src = ""; } }, image.naturalWidth, image.naturalHeight, signal, index);
      } finally {
        URL.revokeObjectURL(url);
      }
    };

    const requestTick = () => {
      if (!disposed && visible && !animation) animation = window.requestAnimationFrame(tick);
    };

    const queue = (index: number, priority: number, shouldDecode = true) => {
      if (failed.has(index) || decoded.has(index) || active.has(index) || (!shouldDecode && blobs.has(index))) return;
      const existing = queued.get(index);
      if (!existing || priority < existing.priority) queued.set(index, { priority, decode: shouldDecode || !!existing?.decode });
    };

    const cancelIdle = () => {
      if (!idle) return;
      if (idleUsesTimeout) window.clearTimeout(idle);
      else window.cancelIdleCallback(idle);
      idle = 0;
    };

    const scheduleBackground = () => {
      if (disposed || idle || !visible || active.size >= concurrency) return;
      let missing = false;
      for (let index = 0; index < SEQUENCE_FRAME_COUNT; index++) {
        if (!blobs.has(index) && !active.has(index) && !failed.has(index)) { missing = true; break; }
      }
      if (!missing) return;
      const fill = () => {
        idle = 0;
        if (disposed || !visible) return;
        let slots = concurrency - active.size;
        for (let index = 0; index < SEQUENCE_FRAME_COUNT && slots > 0; index++) {
          if (!blobs.has(index) && !active.has(index) && !failed.has(index)) {
            queue(index, 1000 + index, false);
            slots--;
          }
        }
        pump();
      };
      if (typeof window.requestIdleCallback === "function") {
        idleUsesTimeout = false;
        idle = window.requestIdleCallback(fill, { timeout: 1500 });
      } else {
        idleUsesTimeout = true;
        idle = window.setTimeout(fill, 150);
      }
    };

    const pump = () => {
      if (disposed || !visible) return;
      while (active.size < concurrency && queued.size) {
        const [index, task] = [...queued].sort((a, b) => a[1].priority - b[1].priority)[0];
        queued.delete(index);
        if (failed.has(index) || decoded.has(index) || active.has(index)) continue;
        const controller = new AbortController();
        active.set(index, controller);
        void (async () => {
          let blob = blobs.get(index);
          if (!blob) {
            const name = String(index).padStart(3, "0");
            const response = await fetch(`/images/car-sequence/${variant}/frame-${name}.webp?v=${SEQUENCE_ASSET_VERSION}`, { signal: controller.signal, cache: "force-cache" });
            if (!response.ok) throw new Error(`Sequence frame ${index}: ${response.status}`);
            blob = await response.blob();
            if (disposed) return;
            blobs.set(index, blob);
          }
          // A frame that became distant during download stays compressed until needed.
          if (task.decode || keys.has(index) || Math.abs(index - target) <= nearRadius) {
            if (!keys.has(index) && Math.abs(index - target) > nearRadius + 2) return;
            const image = await decodeBlob(blob, controller.signal, index);
            if (disposed) { image.release(); return; }
            decoded.set(index, { ...image, used: ++used });
            evict();
            dirty = true;
            requestTick();
          }
        })().catch(() => {
          if (disposed || controller.signal.aborted) return;
          failed.add(index);
          if (index === 0 && !firstFrameFailed) {
            firstFrameFailed = true;
            onError();
          }
        }).finally(() => {
          active.delete(index);
          if (!disposed) { pump(); requestTick(); }
        });
      }
      if (!queued.size) scheduleBackground();
    };

    const queueCurrent = () => {
      // Discard obsolete requests after a rapid jump; in-flight requests remain reusable.
      queued.clear();
      queue(0, -4);
      queue(target, -3);
      queue(59, -2);
      queue(103, -1);
      for (let distance = 1; distance <= nearRadius; distance++) {
        const ahead = target + distance * direction;
        const behind = target - distance * direction;
        if (ahead >= 0 && ahead < SEQUENCE_FRAME_COUNT) queue(ahead, distance * 2);
        if (behind >= 0 && behind < SEQUENCE_FRAME_COUNT) queue(behind, distance * 2 + 1);
      }
      pump();
    };

    const draw = () => {
      let nearest = -1;
      let distance = Infinity;
      for (const index of decoded.keys()) {
        if (reduce.current && !keys.has(index)) continue;
        const difference = Math.abs(index - target);
        if (difference < distance || (difference === distance && (index - nearest) * direction > 0)) {
          distance = difference;
          nearest = index;
        }
      }
      if (nearest < 0 || !width || !height) return;
      if (!dirty && nearest === lastDrawn) return;
      const image = decoded.get(nearest)!;
      image.used = ++used;
      const portrait = width / height < 0.8;
      const orbitAmount = Math.min(1, nearest / 59);
      const orbit = orbitAmount * orbitAmount * (3 - 2 * orbitAmount);
      const widthRatio = portrait ? 1.2 + 0.25 * orbit : 1.05;
      const heightRatio = portrait ? 0.65 : height < 600 ? 0.66 : 0.88;
      const scale = Math.min(width * widthRatio / SEQUENCE_WIDTH, height * heightRatio / SEQUENCE_HEIGHT);
      const imageWidth = SEQUENCE_WIDTH * scale;
      const imageHeight = SEQUENCE_HEIGHT * scale;
      context.setTransform(dpr, 0, 0, dpr, 0, 0);
      context.clearRect(0, 0, width, height);
      // Keep the vehicle centered through the three manually composed viewpoints.
      const pose = sequenceFramePose(nearest);
      const sourceCenter = 0.554 - 0.043 * orbit + 0.034 * pose.overhead;
      const sourceCenterX = 0.512 + 0.036 * orbit - 0.048 * pose.overhead;
      context.drawImage(image.source, width / 2 - imageWidth * sourceCenterX, height * 0.57 - imageHeight * sourceCenter, imageWidth, imageHeight);
      lastDrawn = nearest;
      dirty = false;
      canvas.dataset.sequenceFrame = String(nearest);
      canvas.dataset.targetFrame = String(target);
      canvas.dataset.opening = pose.opening.toFixed(4);
      canvas.dataset.overhead = pose.overhead.toFixed(4);
      if (!announced) { announced = true; onReady(); }
      evict();
    };

    function tick() {
      animation = 0;
      if (disposed || !visible) return;
      const p = sequenceProgress(progress.current ?? 0, reduce.current);
      const next = sequenceFrame(p);
      canvas!.dataset.progress = p.toFixed(4);
      if (next !== target) {
        direction = next > target ? 1 : -1;
        target = next;
        dirty = true;
        queueCurrent();
      }
      draw();
      requestTick();
    }

    const resize = () => {
      width = host.clientWidth;
      height = host.clientHeight;
      const portrait = width / height < 0.8;
      dpr = Math.min(window.devicePixelRatio || 1, portrait ? 1.5 : 2);
      cacheLimit = portrait ? 26 : 32;
      canvas.width = Math.max(1, Math.round(width * dpr));
      canvas.height = Math.max(1, Math.round(height * dpr));
      context.imageSmoothingEnabled = true;
      context.imageSmoothingQuality = "high";
      dirty = true;
      evict();
      requestTick();
    };
    const updateVisibility = () => {
      visible = intersecting && !document.hidden;
      if (visible) { dirty = true; queueCurrent(); requestTick(); }
      else { window.cancelAnimationFrame(animation); animation = 0; cancelIdle(); }
    };
    const resizeObserver = new ResizeObserver(resize);
    const intersectionObserver = new IntersectionObserver(([entry]) => {
      intersecting = entry.isIntersecting;
      updateVisibility();
    });
    motionChanged.current = () => { dirty = true; requestTick(); };
    resizeObserver.observe(host);
    intersectionObserver.observe(host);
    document.addEventListener("visibilitychange", updateVisibility);
    resize();
    queueCurrent();

    return () => {
      disposed = true;
      motionChanged.current = null;
      window.cancelAnimationFrame(animation);
      cancelIdle();
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
      document.removeEventListener("visibilitychange", updateVisibility);
      queued.clear();
      active.forEach(controller => controller.abort());
      active.clear();
      decoded.forEach(image => image.release());
      decoded.clear();
      blobs.clear();
    };
  }, [progress, onReady, onError]);

  return <div style={{ position: "absolute", inset: 0, pointerEvents: "none", zIndex: -1 }}><canvas ref={canvasRef} role="img" aria-label="Ferrari F40 : rotation, ouverture des portes et capots, puis vue du dessus, pilotées par le défilement" style={{ display: "block", width: "100%", height: "100%" }} /></div>;
}
