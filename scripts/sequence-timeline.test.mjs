import assert from 'node:assert/strict';
import test from 'node:test';
import { scrollChapter, STORY_STOPS } from '../src/components/club/scroll-timeline.ts';
import { sequenceFrame, sequenceFramePose, sequenceProgress, SEQUENCE_KEYFRAMES, SEQUENCE_FRAME_COUNT } from '../src/components/club/sequence-timeline.ts';

test('the three scroll chapters land on complete closed, open, and overhead images', () => {
  assert.deepEqual(STORY_STOPS.map(p => sequenceFrame(p)), SEQUENCE_KEYFRAMES);
  assert.deepEqual(STORY_STOPS.map(scrollChapter), [0, 1, 2]);
  assert.deepEqual(sequenceFramePose(0), {opening: 0, overhead: 0});
  assert.deepEqual(sequenceFramePose(59), {opening: 1, overhead: 0});
  assert.deepEqual(sequenceFramePose(103), {opening: 1, overhead: 1});
});

test('the camera moves use every frame, stay in range, and advance monotonically', () => {
  const visited = new Set();
  let previous = -1;
  for (let i = 0; i <= 10000; i++) {
    const frame = sequenceFrame(i / 10000);
    assert.ok(Number.isInteger(frame) && frame >= 0 && frame < SEQUENCE_FRAME_COUNT);
    assert.ok(frame >= previous);
    assert.ok(frame - previous <= 1);
    visited.add(frame);
    previous = frame;
  }
  assert.equal(visited.size, SEQUENCE_FRAME_COUNT);
});

test('scrolling in reverse chooses exactly the same images without elapsed-time state', () => {
  const forward = Array.from({length: 1001}, (_, index) => sequenceFrame(index / 1000));
  const reverse = Array.from({length: 1001}, (_, index) => sequenceFrame((1000 - index) / 1000)).reverse();
  assert.deepEqual(forward, reverse);
  assert.equal(sequenceFrame(-10), 0);
  assert.equal(sequenceFrame(Infinity), 103);
  assert.equal(sequenceFrame(NaN), 0);
});

test('opening, inspection, and overhead poses hold while chapter text is read', () => {
  for (const p of [0, .06, .12]) assert.equal(sequenceFrame(p), 0);
  for (const p of [.47, .5, .55, .58]) assert.equal(sequenceFrame(p), 59);
  for (const p of [.86, .92, 1]) assert.equal(sequenceFrame(p), 103);
  assert.equal(sequenceFrame(.295), 30);
  assert.equal(sequenceFrame(.72), 81);
});

test('reduced motion snaps directly between the three held poses at chapter boundaries', () => {
  assert.deepEqual([0, .28, .29, .5, .6799, .68, 1].map(p => sequenceFrame(p, true)), [0, 0, 59, 59, 59, 103, 103]);
  assert.equal(sequenceProgress(.5, true), .47);
  assert.equal(sequenceProgress(.8, true), .88);
});
