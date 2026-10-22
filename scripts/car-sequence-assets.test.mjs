import assert from 'node:assert/strict';
import test from 'node:test';
import { readFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import sharp from 'sharp';
import { SEQUENCE_FRAME_COUNT, SEQUENCE_KEYFRAMES } from '../src/components/club/sequence-timeline.ts';

test('every rendered frame ships in both responsive resolutions', async () => {
  for (const [variant, width, height] of [['desktop', 1280, 800], ['mobile', 768, 480]]) {
    for (let index = 0; index < SEQUENCE_FRAME_COUNT; index++) {
      const name = `frame-${String(index).padStart(3, '0')}.webp`;
      const file = new URL(`../public/images/car-sequence/${variant}/${name}`, import.meta.url);
      const metadata = await sharp(await readFile(file)).metadata();
      assert.equal(metadata.format, 'webp', `${variant}/${name}`);
      assert.equal(metadata.width, width, `${variant}/${name}`);
      assert.equal(metadata.height, height, `${variant}/${name}`);
    }
    const hashes = await Promise.all(SEQUENCE_KEYFRAMES.map(async index => {
      const name = `frame-${String(index).padStart(3, '0')}.webp`;
      const bytes = await readFile(new URL(`../public/images/car-sequence/${variant}/${name}`, import.meta.url));
      return createHash('sha256').update(bytes).digest('hex');
    }));
    assert.equal(new Set(hashes).size, 3, 'closed, open and overhead poses must be distinct images');
  }
});

test('the editable source retains its engine, normals and all four panel hinges', async () => {
  const buffer = await readFile(new URL('../public/models/ferrari-f40-rigged.glb', import.meta.url));
  assert.equal(buffer.subarray(0, 4).toString(), 'glTF');
  const length = buffer.readUInt32LE(12);
  const source = JSON.parse(buffer.subarray(20, 20 + length).toString());
  for (const name of ['hinge_left', 'hinge_right', 'hinge_front', 'hinge_rear']) {
    assert.ok(source.nodes.some(node => node.name === name && node.children?.length));
  }
  const parts = source.meshes.flatMap(mesh => mesh.primitives);
  assert.equal(parts.reduce((total, part) => total + source.accessors[part.indices].count / 3, 0), 245552);
  assert.ok(parts.every(part => part.attributes.NORMAL !== undefined));
  assert.ok(source.materials.some(material => material.name === 'F40_Mechanics.001'));
});
