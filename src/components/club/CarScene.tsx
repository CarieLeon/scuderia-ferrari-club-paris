"use client";

import { useEffect, useRef, type RefObject } from "react";
import { scrollPose } from "./scroll-timeline";

interface Props {
  progress: RefObject<number>;
  reducedMotion: boolean;
  onReady: () => void;
  onError: () => void;
}

/** A real articulated model. Scroll poses move the camera and every panel hinge. */
export default function CarScene({ progress, reducedMotion, onReady, onError }: Props) {
  const host = useRef<HTMLDivElement>(null);
  const reduce = useRef(reducedMotion);
  useEffect(() => { reduce.current = reducedMotion; }, [reducedMotion]);

  useEffect(() => {
    if (!host.current) return;
    const container = host.current;
    let disposed = false;
    let cleanup = () => {};
    let frame = 0;
    const init = async () => {
      const [THREE, { GLTFLoader }, { DRACOLoader }, { HDRLoader }, { Reflector }] = await Promise.all([
        import("three"),
        import("three/addons/loaders/GLTFLoader.js"),
        import("three/addons/loaders/DRACOLoader.js"),
        import("three/addons/loaders/HDRLoader.js"),
        import("three/addons/objects/Reflector.js"),
      ]);
      if (disposed) return;
      const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, window.innerWidth < 700 ? 1.5 : 1.8));
      renderer.outputColorSpace = THREE.SRGBColorSpace;
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.0;
      renderer.setClearColor(0x000000, 0);
      renderer.domElement.setAttribute("aria-label", "Ferrari F40 en 3D : rotation, ouverture des portes et capots, puis vue du dessus pilotées par le défilement");
      renderer.domElement.setAttribute("role", "img");
      container.appendChild(renderer.domElement);
      const scene = new THREE.Scene();
      scene.fog = new THREE.Fog(0x171a19, 13, 38);
      const camera = new THREE.PerspectiveCamera(34, 1, 0.1, 70);
      const pmrem = new THREE.PMREMGenerator(renderer);
      let environment: ReturnType<typeof pmrem.fromEquirectangular> | undefined;
      scene.add(new THREE.HemisphereLight(0xf9f5ef, 0x181819, 0.2));
      const key = new THREE.DirectionalLight(0xffffff, 2.4);
      key.position.set(-4, 7, -4);
      scene.add(key);
      const fill = new THREE.DirectionalLight(0xe7edff, 0.55);
      fill.position.set(4, 3, 3);
      scene.add(fill);
      const red = new THREE.PointLight(0xf11731, 6, 14, 2);
      red.position.set(-4, 1.5, 2);
      scene.add(red);
      const floorGeometry = new THREE.PlaneGeometry(70, 70);
      const floor = new Reflector(floorGeometry, {
        color: 0x373d3a,
        textureWidth: window.innerWidth < 700 ? 512 : 1024,
        textureHeight: window.innerWidth < 700 ? 512 : 1024,
        multisample: 0,
        clipBias: 0.003,
      });
      floor.rotation.x = -Math.PI / 2;
      floor.position.y = -0.025;
      scene.add(floor);
      const floorVeil = new THREE.Mesh(new THREE.PlaneGeometry(70, 70), new THREE.MeshBasicMaterial({ color: 0x1a1e1c, transparent: true, opacity: 0.73, depthWrite: false, toneMapped: false }));
      floorVeil.rotation.x = -Math.PI / 2;
      floorVeil.position.y = -0.015;
      scene.add(floorVeil);
      let observer: ResizeObserver | undefined;
      let visibility: IntersectionObserver | undefined;
      let shadowTexture: InstanceType<typeof THREE.Texture> | undefined;
      const draco = new DRACOLoader();
      const replacedMaterials = new Set<InstanceType<typeof THREE.Material>>();
      let cleaned = false;
      const releaseObject = (root: InstanceType<typeof THREE.Object3D>) => {
        const geometries = new Set<InstanceType<typeof THREE.BufferGeometry>>();
        const materials = new Set<InstanceType<typeof THREE.Material>>();
        root.traverse(object => {
          if (object instanceof THREE.Mesh) {
            geometries.add(object.geometry);
            (Array.isArray(object.material) ? object.material : [object.material]).forEach(material => materials.add(material));
          }
        });
        geometries.forEach(geometry => geometry.dispose());
        materials.forEach(material => material.dispose());
      };
      const contextLost = (event: Event) => { event.preventDefault(); if (!disposed) { disposed = true; cleanup(); onError(); } };
      renderer.domElement.addEventListener("webglcontextlost", contextLost);
      cleanup = () => {
        if (cleaned) return;
        cleaned = true;
        window.cancelAnimationFrame(frame);
        observer?.disconnect(); visibility?.disconnect();
        renderer.domElement.removeEventListener("webglcontextlost", contextLost);
        releaseObject(scene);
        replacedMaterials.forEach(material => material.dispose());
        shadowTexture?.dispose(); floor.getRenderTarget().dispose();
        environment?.dispose(); pmrem.dispose(); draco.dispose(); renderer.dispose();
        renderer.domElement.remove();
      };
      const hdr = await new HDRLoader().loadAsync("/models/environment/studio-small-05-1k.hdr");
      if (disposed) { hdr.dispose(); return; }
      environment = pmrem.fromEquirectangular(hdr);
      hdr.dispose();
      scene.environment = environment.texture;
      scene.environmentIntensity = 1.1;
      scene.environmentRotation.y = 2.3;
      const shadowCanvas = document.createElement("canvas");
      shadowCanvas.width = shadowCanvas.height = 256;
      const shadowContext = shadowCanvas.getContext("2d")!;
      const contact = shadowContext.createRadialGradient(128, 128, 20, 128, 128, 126);
      contact.addColorStop(0, "rgba(0,0,0,0.65)");
      contact.addColorStop(0.55, "rgba(0,0,0,0.35)");
      contact.addColorStop(1, "rgba(0,0,0,0)");
      shadowContext.fillStyle = contact;
      shadowContext.fillRect(0, 0, 256, 256);
      shadowTexture = new THREE.CanvasTexture(shadowCanvas);
      const shadow = new THREE.Mesh(new THREE.PlaneGeometry(3.4, 6), new THREE.MeshBasicMaterial({ map: shadowTexture, transparent: true, opacity: 0.65, depthWrite: false, blending: THREE.MultiplyBlending, premultipliedAlpha: true, toneMapped: false }));
      shadow.rotation.x = -Math.PI / 2;
      shadow.position.y = -0.006;
      scene.add(shadow);
      draco.setDecoderPath("/models/draco/");
      const loader = new GLTFLoader().setDRACOLoader(draco);
      const gltf = await loader.loadAsync("/models/ferrari-f40-rigged.glb");
      if (disposed) {
        releaseObject(gltf.scene);
        return;
      }
      const car = gltf.scene;
      car.name = "scroll-ferrari";
      const paint = new THREE.MeshPhysicalMaterial({ color: 0xd7070c, metalness: 0.05, roughness: 0.24, clearcoat: 1, clearcoatRoughness: 0.12 });
      const dark = new THREE.MeshStandardMaterial({ color: 0x141618, metalness: 0.25, roughness: 0.5 });
      const glass = new THREE.MeshPhysicalMaterial({ color: 0x293c42, metalness: 0, roughness: 0.1, transparent: true, opacity: 0.3, side: THREE.DoubleSide, depthWrite: false });
      car.traverse(object => {
        if (!(object instanceof THREE.Mesh)) return;
        const material = Array.isArray(object.material) ? object.material[0] : object.material;
        const name = material.name.toLowerCase();
        if (name === "material") object.material = paint;
        else if (name.includes("cockpit") || name.includes("interior") || name.includes("carbon") || name.includes("carpet") || name.includes("plastic") || name.includes("leather")) object.material = dark;
        else if (name.includes("window") || name.includes("glass") || name === "f40_headlights") object.material = glass;
        else if (material instanceof THREE.MeshStandardMaterial) {
          // Preserve the detailed source's distinct brakes, rims, seats and engine.
          material.roughness = Math.max(material.roughness, name.includes("mechanics") ? 0.28 : 0.16);
          if (name.includes("mechanics.001")) material.metalness = 0.12;
        }
        if (object.material !== material) replacedMaterials.add(material);
        object.geometry.computeBoundingBox();
      });
      scene.add(car);
      const hinges = {
        left: car.getObjectByName("hinge_left"),
        right: car.getObjectByName("hinge_right"),
        front: car.getObjectByName("hinge_front"),
        rear: car.getObjectByName("hinge_rear"),
      };
      if (!hinges.left || !hinges.right || !hinges.front || !hinges.rear) throw new Error("Missing articulated car panels");
      const framingMeshes: InstanceType<typeof THREE.Mesh>[] = [];
      car.traverse(object => {
        if (object instanceof THREE.Mesh) {
          object.geometry.computeBoundingBox();
          framingMeshes.push(object);
        }
      });
      const floorStart = new THREE.Color(0x1a1e1c);
      const floorEnd = new THREE.Color(0x404744);
      const target = new THREE.Vector3(0, 0.63, 0);
      const position = new THREE.Vector3();
      const corner = new THREE.Vector3();
      const size = { width: 0, height: 0 };
      let visible = true;
      let dirty = true;
      let last = -1;
      let eased = progress.current ?? 0;
      const resize = () => {
        size.width = container.clientWidth;
        size.height = container.clientHeight;
        renderer.setSize(size.width, size.height);
        camera.aspect = size.width / size.height;
        camera.setViewOffset(size.width, size.height, 0, -size.height * 0.055, size.width, size.height);
        camera.updateProjectionMatrix();
        dirty = true;
      };
      observer = new ResizeObserver(resize);
      observer.observe(container);
      visibility = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; dirty = true; });
      visibility.observe(container);
      resize();
      let previousTime = 0;
      let announced = false;
      let lastReduced = reduce.current;
      const render = (now: number) => {
        if (disposed) return;
        frame = window.requestAnimationFrame(render);
        if (lastReduced !== reduce.current) { dirty = true; lastReduced = reduce.current; }
        const desired = progress.current ?? 0;
        const deltaTime = Math.min(0.05, (now - previousTime) / 1000 || 0.016);
        previousTime = now;
        eased = reduce.current ? desired : THREE.MathUtils.lerp(eased, desired, 1 - Math.exp(-14 * deltaTime));
        if (Math.abs(eased - desired) < 0.0001) eased = desired;
        if (!visible || (!dirty && Math.abs(eased - last) < 0.00001)) return;
        last = eased;
        dirty = false;
        const pose = scrollPose(eased, reduce.current);
        hinges.left!.rotation.y = -pose.opening * 1.08;
        hinges.right!.rotation.y = pose.opening * 1.08;
        hinges.front!.rotation.x = -pose.opening * 1.0;
        hinges.rear!.rotation.x = pose.opening * 1.1;
        car.updateMatrixWorld(true);
        camera.position.set(pose.camera.x, pose.camera.y, pose.camera.z).add(target);
        camera.up.set(0, Math.cos(pose.overhead * Math.PI / 2), -Math.sin(pose.overhead * Math.PI / 2));
        camera.lookAt(target);
        camera.updateMatrixWorld();
        // Fit the actual open silhouette, including door tips, at every aspect ratio.
        let horizontal = 0;
        let vertical = 0;
        for (const mesh of framingMeshes) {
          const bounds = mesh.geometry.boundingBox!;
          for (let mask = 0; mask < 8; mask++) {
            corner.set(mask & 1 ? bounds.max.x : bounds.min.x, mask & 2 ? bounds.max.y : bounds.min.y, mask & 4 ? bounds.max.z : bounds.min.z).applyMatrix4(mesh.matrixWorld).project(camera);
            horizontal = Math.max(horizontal, Math.abs(corner.x));
            vertical = Math.max(vertical, Math.abs(corner.y + 0.11));
          }
        }
        const portrait = camera.aspect < 0.8;
        // Art-directed close framing: side profile can extend beyond a phone's edges.
        const widthLimit = portrait ? THREE.MathUtils.lerp(1.3, 1.18, pose.orbit) : THREE.MathUtils.lerp(1.0, 0.98, pose.orbit);
        const heightLimit = portrait ? THREE.MathUtils.lerp(0.5, 0.65 - 0.13 * pose.overhead, pose.orbit) : THREE.MathUtils.lerp(0.7, 0.72 + 0.13 * pose.overhead, pose.orbit);
        const fit = THREE.MathUtils.clamp(Math.max(horizontal / widthLimit, vertical / heightLimit), 0.52, 2.8);
        position.copy(camera.position).sub(target).multiplyScalar(fit);
        camera.position.copy(target).add(position);
        camera.lookAt(target);
        camera.updateMatrixWorld();
        red.intensity = 6 * (1 - 0.7 * pose.overhead);
        floorVeil.material.opacity = 0.78 + 0.04 * pose.overhead;
        floorVeil.material.color.lerpColors(floorStart, floorEnd, pose.overhead);
        renderer.domElement.dataset.framing = [horizontal, vertical, fit, camera.position.distanceTo(target)].map(value => value.toFixed(3)).join(",");
        renderer.domElement.dataset.progress = pose.progress.toFixed(4);
        renderer.domElement.dataset.opening = pose.opening.toFixed(4);
        renderer.domElement.dataset.overhead = pose.overhead.toFixed(4);

        renderer.render(scene, camera);
        if (!announced) { announced = true; onReady(); }
      };
      frame = window.requestAnimationFrame(render);
    };
    init().catch(() => { if (!disposed) { disposed = true; cleanup(); onError(); } });
    return () => { disposed = true; window.cancelAnimationFrame(frame); cleanup(); };
  }, [progress, onReady, onError]);

  return <div ref={host} style={{ position: "absolute", inset: 0, pointerEvents: "none", zIndex: -1 }} />;
}
