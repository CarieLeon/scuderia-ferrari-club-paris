import assert from 'node:assert/strict';
import test from 'node:test';
import { readFileSync } from 'node:fs';
import { scrollPose, STORY_STOPS, easeBetween } from '../src/components/club/scroll-timeline.ts';

test('the named chapters correspond to distinct closed, open and overhead poses', () => {
  const [closed, open, top] = STORY_STOPS.map(p => scrollPose(p));
  assert.deepEqual([closed.chapter, open.chapter, top.chapter], [0, 1, 2]);
  assert.equal(closed.opening, 0);
  assert.equal(open.opening, 1);
  assert.equal(open.overhead, 0);
  assert.equal(top.overhead, 1);
  assert.ok(top.camera.y > open.camera.y);
  assert.ok(Math.abs(top.camera.x) < .001);
});

test('camera and hinges move continuously, with no unbounded values or backwards opening', () => {
  let previous = scrollPose(0);
  for (let i = 1; i <= 1000; i++) {
    const pose = scrollPose(i / 1000);
    for (const value of [pose.opening, pose.overhead, pose.orbit]) assert.ok(value >= 0 && value <= 1);
    for (const value of Object.values(pose.camera)) assert.ok(Number.isFinite(value));
    assert.ok(pose.opening >= previous.opening);
    assert.ok(pose.overhead >= previous.overhead);
    assert.ok(Math.abs(pose.camera.x - previous.camera.x) < .1);
    assert.ok(Math.abs(pose.camera.y - previous.camera.y) < .1);
    assert.ok(Math.abs(pose.camera.z - previous.camera.z) < .1);
    previous = pose;
  }
});

test('scrolling back produces the exact same poses instead of playing an elapsed-time animation', () => {
  const forward = Array.from({length:101}, (_,i) => scrollPose(i / 100));
  const backward = Array.from({length:101}, (_,i) => scrollPose((100 - i) / 100)).reverse();
  assert.deepEqual(backward, forward);
  assert.deepEqual(scrollPose(-1), scrollPose(0));
  assert.deepEqual(scrollPose(2), scrollPose(1));
});

test('reduced motion snaps to the three complete key poses', () => {
  assert.deepEqual(scrollPose(.15, true), scrollPose(STORY_STOPS[0]));
  assert.deepEqual(scrollPose(.5, true), scrollPose(STORY_STOPS[1]));
  assert.deepEqual(scrollPose(.95, true), scrollPose(STORY_STOPS[2]));
});

test('mechanical opening and camera ascent have deliberate holds between transitions', () => {
  assert.equal(easeBetween(.2,.46,.2), 0);
  assert.equal(easeBetween(.2,.46,.46), 1);
  assert.equal(scrollPose(.55).opening, 1);
  assert.equal(scrollPose(.55).overhead, 0);
  assert.equal(scrollPose(.9).overhead, 1);
});

test('the shipped car contains all four articulated hinges and uses a local Draco decoder', () => {
  const buffer = readFileSync(new URL('../public/models/ferrari-458-rigged.glb', import.meta.url));
  assert.equal(buffer.subarray(0,4).toString(), 'glTF');
  const jsonLength = buffer.readUInt32LE(12);
  const gltf = JSON.parse(buffer.subarray(20,20 + jsonLength).toString());
  for (const name of ['hinge_left','hinge_right','hinge_front','hinge_rear']) {
    assert.ok(gltf.nodes.some(node => node.name === name && node.children?.length));
  }
  assert.ok(readFileSync(new URL('../public/models/draco/draco_decoder.wasm', import.meta.url)).length > 10000);
});
