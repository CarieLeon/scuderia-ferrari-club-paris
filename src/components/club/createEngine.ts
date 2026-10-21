import * as THREE from "three";
import { mergeGeometries } from "three/addons/utils/BufferGeometryUtils.js";

/** An illustrative, compact V8 assembly for the articulated car's rear cavity. */
export default function createEngine(): THREE.Group {
  const engine = new THREE.Group();
  engine.name = "illustrative-v8-assembly";

  const alloy = new THREE.MeshStandardMaterial({ color: 0x9b9da0, metalness: 0.86, roughness: 0.33 });
  const polished = new THREE.MeshStandardMaterial({ color: 0xc5c8c9, metalness: 0.92, roughness: 0.23 });
  const darkMetal = new THREE.MeshStandardMaterial({ color: 0x24272a, metalness: 0.78, roughness: 0.42 });
  const carbon = new THREE.MeshStandardMaterial({ color: 0x101214, metalness: 0.28, roughness: 0.61 });
  const rubber = new THREE.MeshStandardMaterial({ color: 0x151719, metalness: 0.04, roughness: 0.87 });
  const red = new THREE.MeshStandardMaterial({ color: 0xb30e21, metalness: 0.34, roughness: 0.4 });

  const box = new THREE.BoxGeometry(1, 1, 1);
  const fastener = new THREE.CylinderGeometry(0.009, 0.009, 0.009, 6);
  const washer = new THREE.CylinderGeometry(0.013, 0.013, 0.003, 12);

  const part = (
    geometry: THREE.BufferGeometry,
    material: THREE.Material,
    x: number,
    y: number,
    z: number,
    name: string,
  ) => {
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(x, y, z);
    mesh.name = name;
    engine.add(mesh);
    return mesh;
  };

  const block = (
    width: number,
    height: number,
    depth: number,
    material: THREE.Material,
    x: number,
    y: number,
    z: number,
    name: string,
  ) => {
    const mesh = part(box, material, x, y, z, name);
    mesh.scale.set(width, height, depth);
    return mesh;
  };

  const roundedBox = (width: number, height: number, depth: number, radius: number) => {
    const shape = new THREE.Shape();
    const x = -width / 2;
    const y = -height / 2;
    shape.moveTo(x + radius, y);
    shape.lineTo(x + width - radius, y);
    shape.quadraticCurveTo(x + width, y, x + width, y + radius);
    shape.lineTo(x + width, y + height - radius);
    shape.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    shape.lineTo(x + radius, y + height);
    shape.quadraticCurveTo(x, y + height, x, y + height - radius);
    shape.lineTo(x, y + radius);
    shape.quadraticCurveTo(x, y, x + radius, y);
    const geometry = new THREE.ExtrudeGeometry(shape, {
      depth: depth - 0.02,
      steps: 1,
      bevelEnabled: true,
      bevelThickness: 0.01,
      bevelSize: 0.006,
      bevelSegments: 2,
      curveSegments: 3,
    });
    geometry.translate(0, 0, -depth / 2 + 0.01);
    return geometry;
  };

  const tube = (
    points: [number, number, number][],
    radius: number,
    material: THREE.Material,
    name: string,
    segments = 12,
  ) => {
    const curve = new THREE.CatmullRomCurve3(points.map(point => new THREE.Vector3(...point)));
    return part(new THREE.TubeGeometry(curve, segments, radius, 8, false), material, 0, 0, 0, name);
  };

  // A low central crankcase connects the two outward-leaning cylinder banks.
  block(0.43, 0.095, 0.76, darkMetal, 0, 0.7075, 1.075, "crankcase");
  block(0.29, 0.028, 0.72, carbon, 0, 0.674, 1.075, "oil-sump");
  const cover = roundedBox(0.195, 0.085, 0.69, 0.026);
  const head = roundedBox(0.225, 0.054, 0.715, 0.015);
  const gasket = roundedBox(0.214, 0.016, 0.704, 0.009);
  const cylinder = new THREE.CylinderGeometry(0.069, 0.064, 0.14, 12);
  const cylinderPositions = [0.815, 0.985, 1.155, 1.325];

  for (const side of [-1, 1]) {
    for (const [index, z] of cylinderPositions.entries()) {
      const bore = part(cylinder, alloy, side * 0.19, 0.771, z, `cylinder-${side}-${index}`);
      bore.rotation.z = -side * 0.38;
    }
    part(head, alloy, side * 0.285, 0.812, 1.07, `cylinder-head-${side}`);
    part(gasket, carbon, side * 0.285, 0.849, 1.07, `cover-gasket-${side}`);
    part(cover, red, side * 0.285, 0.892, 1.07, `red-valve-cover-${side}`);

    // Fine exposed ribs catch the overhead light without relying on textures.
    for (let rib = 0; rib < 3; rib++) {
      block(0.007, 0.007, 0.58, alloy, side * (0.267 + rib * 0.022), 0.939, 1.07, `cover-rib-${side}-${rib}`);
    }
    for (const [index, z] of cylinderPositions.entries()) {
      for (const edge of [-1, 1]) {
        const x = side * 0.285 + edge * 0.076;
        part(washer, darkMetal, x, 0.938, z, `washer-${side}-${edge}-${index}`);
        part(fastener, polished, x, 0.943, z, `cover-bolt-${side}-${edge}-${index}`);
      }
      // Each cast intake runner arches from the central plenum to one bank.
      tube([
        [side * 0.074, 0.937, z],
        [side * 0.12, 0.973, z - 0.005],
        [side * 0.174, 0.952, z - 0.008],
        [side * 0.202, 0.9, z],
        [side * 0.208, 0.843, z],
      ], 0.024, alloy, `intake-runner-${side}-${index}`);
    }

    // Outboard insulated harnesses and fuel rails read clearly in the top view.
    block(0.025, 0.024, 0.66, polished, side * 0.406, 0.824, 1.07, `fuel-rail-${side}`);
    tube([
      [side * 0.395, 0.84, 0.73],
      [side * 0.44, 0.848, 0.79],
      [side * 0.443, 0.849, 1.2],
      [side * 0.411, 0.81, 1.42],
    ], 0.011, rubber, `wiring-harness-${side}`);
    for (const [index, z] of cylinderPositions.entries()) {
      block(0.031, 0.021, 0.032, carbon, side * 0.392, 0.85, z, `injector-connector-${side}-${index}`);
    }
  }

  part(roundedBox(0.155, 0.093, 0.65, 0.025), carbon, 0, 0.951, 1.07, "central-intake-plenum");
  block(0.046, 0.012, 0.55, red, 0, 1.007, 1.07, "plenum-red-spine");
  for (const z of [0.832, 1.308]) {
    block(0.165, 0.011, 0.018, alloy, 0, 0.994, z, "plenum-band");
    part(fastener, polished, -0.061, 1.005, z, "plenum-band-bolt");
    part(fastener, polished, 0.061, 1.005, z, "plenum-band-bolt");
  }

  // A short intake neck at the forward end, with rubber coupling and two clamps.
  tube([[0, 0.922, 0.776], [0, 0.894, 0.724], [0, 0.853, 0.695]], 0.052, rubber, "intake-coupling", 8);
  const clampGeometry = new THREE.TorusGeometry(0.054, 0.004, 6, 16);
  for (const z of [0.696, 0.727]) {
    const clamp = part(clampGeometry, polished, 0, z === 0.696 ? 0.87 : 0.903, z, "intake-clamp");
    clamp.rotation.x = -0.45;
  }

  // Rear accessory housing, belt and two visible pulleys stay inside the cavity.
  block(0.33, 0.125, 0.051, darkMetal, 0, 0.764, 1.457, "accessory-housing");
  const pulleyGeometry = new THREE.CylinderGeometry(0.049, 0.049, 0.018, 20);
  for (const [index, x] of [-0.112, 0.112].entries()) {
    const pulley = part(pulleyGeometry, darkMetal, x, 0.773, 1.488, `accessory-pulley-${index}`);
    pulley.rotation.x = Math.PI / 2;
    const hub = part(new THREE.CylinderGeometry(0.017, 0.017, 0.02, 8), alloy, x, 0.773, 1.488, `pulley-hub-${index}`);
    hub.rotation.x = Math.PI / 2;
  }
  block(0.224, 0.012, 0.013, rubber, 0, 0.822, 1.49, "accessory-belt-upper");
  block(0.224, 0.012, 0.013, rubber, 0, 0.724, 1.49, "accessory-belt-lower");

  // All parts are static, so submit only one draw per finish on mobile GPUs.
  engine.updateMatrixWorld(true);
  const batches = new Map<THREE.Material, THREE.BufferGeometry[]>();
  const sourceGeometries = new Set<THREE.BufferGeometry>();
  for (const object of engine.children) {
    if (!(object instanceof THREE.Mesh)) continue;
    const material = object.material as THREE.Material;
    const geometry = object.geometry.index ? object.geometry.toNonIndexed() : object.geometry.clone();
    geometry.applyMatrix4(object.matrixWorld);
    sourceGeometries.add(object.geometry);
    const geometries = batches.get(material) ?? [];
    geometries.push(geometry);
    batches.set(material, geometries);
  }
  engine.clear();
  for (const [material, geometries] of batches) {
    const geometry = mergeGeometries(geometries, false);
    if (geometry) {
      geometry.computeBoundingSphere();
      const mesh = new THREE.Mesh(geometry, material);
      mesh.name = "engine-finish-batch";
      engine.add(mesh);
    }
    geometries.forEach(source => source.dispose());
  }
  sourceGeometries.forEach(geometry => geometry.dispose());
  return engine;
}
