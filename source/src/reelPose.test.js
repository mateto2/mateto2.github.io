import test from 'node:test';
import assert from 'node:assert/strict';
import { reelPose, sceneAt, recycleTurn, reelIndex, SLOTS } from './reelPose.js';
import { REEL_SLOTS, reelAngle } from './reel-ring.ts';
import { DEAL } from './reel-entrance.ts';
import { reelScene } from './reel-scene.ts';

const near = (actual, expected, epsilon = 1e-8) => assert.ok(
  Math.abs(actual - expected) < epsilon, `${actual} should equal ${expected}`,
);

test('reelAngle maps the 16 slots to their signed resting angles', () => {
  assert.equal(REEL_SLOTS, 16);
  assert.equal(SLOTS, REEL_SLOTS);
  assert.deepEqual(Array.from({ length: REEL_SLOTS }, (_, slot) => reelAngle(slot, 0)), [
    0, 22.5, 45, 67.5, 90, 112.5, 135, 157.5,
    -180, -157.5, -135, -112.5, -90, -67.5, -45, -22.5,
  ]);
});

test('reelAngle wraps positive and negative turns into a half-open range', () => {
  for (const angle of [-1080, -540, -360, -180, -0.25, 0, 180, 360, 540, 1080]) {
    for (let slot = 0; slot < REEL_SLOTS; slot++) {
      const result = reelAngle(slot, angle);
      assert.ok(result >= -180 && result < 180);
      near(result, reelAngle(slot, angle + 720));
    }
  }
  assert.equal(reelAngle(0, 180), -180);
  assert.equal(reelAngle(0, -180), -180);
  near(reelAngle(0, 179.99), 179.99);
  near(reelAngle(0, 180.01), -179.99);
});

test('reelAngle supports custom counts, out-of-range slots, and fractional rotation', () => {
  assert.equal(reelAngle(1, 0, 8), 45);
  assert.equal(reelAngle(7, 10, 8), -35);
  assert.equal(reelAngle(-1, 0), -22.5);
  assert.equal(reelAngle(16, 0), 0);
  assert.equal(reelAngle(0, -22.75), -22.75);
});

test('normalized slot input preserves every intermediate formation pose', () => {
  for (let slot = 0; slot < REEL_SLOTS; slot++) {
    for (const formation of [0, 0.1, 0.4, 0.7, 1]) {
      const scene = sceneAt(0.5, -725.25);
      assert.deepEqual(
        reelPose(reelAngle(slot, 0), formation, scene),
        reelPose(slot * 360 / REEL_SLOTS, formation, scene),
      );
    }
  }
});

test('all 16 cards begin at the front, with the waiting stack invisible', () => {
  for (let slot = 0; slot < SLOTS; slot++) {
    const pose = reelPose(slot * 360 / SLOTS, 0, sceneAt(0));
    near(pose.x, 0);
    const dealRank = (slot + SLOTS / 2) % SLOTS;
    near(pose.z, 460 - dealRank / SLOTS * 24);
    near(pose.yaw, -180);
    assert.equal(pose.appear, 0);
  }
});

test('completed formation puts every slot on its exact cylinder position', () => {
  for (let slot = 0; slot < SLOTS; slot++) {
    const angle = slot * 360 / SLOTS;
    const pose = reelPose(angle, 1, sceneAt(1));
    near(pose.x, -Math.sin(angle * Math.PI / 180) * 1800);
    near(pose.z, -Math.cos(angle * Math.PI / 180) * 1800);
    near(pose.yaw, reelAngle(slot, 0));
    near(pose.x ** 2 + pose.z ** 2, 1800 ** 2, 1e-6);
    assert.equal(pose.appear, 1);
  }
});

test('cardinal angles use inward-facing yaw and the specified signs', () => {
  const scene = sceneAt(1);
  near(reelPose(0, 1, scene).z, -1800);
  near(reelPose(90, 1, scene).x, -1800);
  near(reelPose(180, 1, scene).z, 1800);
  near(reelPose(270, 1, scene).x, 1800);
});

test('deal follows angular order and uses an ease-out cubic', () => {
  const scene = sceneAt(0);
  assert.ok(reelPose(202.5, 0.1, scene).appear > 0);
  assert.equal(reelPose(157.5, 0.1, scene).appear, 0);
  const order = 0.5;
  const halfway = order * (1 - DEAL) + DEAL / 2;
  near(reelPose(0, halfway, scene).yaw, -180 + 180 * 0.875);
});

test('stack depth contracts smoothly to the shared radius as a card is dealt', () => {
  const scene = sceneAt(0);
  const start = reelPose(0, 0, scene);
  const halfway = reelPose(0, 0.5 * (1 - DEAL) + DEAL / 2, scene);
  const end = reelPose(0, 1, scene);
  near(Math.hypot(start.x, start.z), 448);
  near(Math.hypot(halfway.x, halfway.z), 458.5);
  near(Math.hypot(end.x, end.z), 460);
});

test('fade uses local deal progress and never exposes waiting cards', () => {
  const scene = sceneAt(0);
  const start = 0.5 * (1 - DEAL);
  assert.equal(reelPose(0, start - 0.001, scene).appear, 0);
  assert.equal(reelPose(0, start, scene).appear, 0);
  near(reelPose(0, start + DEAL * 0.2, scene).appear, 0.5);
  near(reelPose(0, start + DEAL * 0.4, scene).appear, 1);
  assert.equal(reelPose(0, 1, scene).appear, 1);
});

test('spring rotation rotates the partially dealt stack without changing its timing', () => {
  const base = reelPose(0, 0.35, sceneAt(0));
  const rotated = reelPose(0, 0.35, sceneAt(0, 90));
  near(rotated.yaw - base.yaw, 90);
  near(rotated.x, base.z);
  near(rotated.z, -base.x);
  near(rotated.appear, base.appear);
  near(Math.hypot(rotated.x, rotated.z), Math.hypot(base.x, base.z));
});

test('camera culling uses the adjusted stack depth', () => {
  const scene = { radius: 460, perspective: 455, scale: 0.52 };
  assert.equal(reelPose(0, 0, scene).behindCamera, false);
  assert.equal(reelPose(-180, 0, scene).behindCamera, true);
});

test('expansion derives all five shared properties, including exact endpoints', () => {
  assert.deepEqual(sceneAt(0), {radius:460, tilt:-22, roll:-20, perspective:1000, scale:0.52, rotation:0});
  assert.deepEqual(sceneAt(1), {radius:1800, tilt:-0, roll:-0, perspective:450, scale:2.3, rotation:0});
  near(sceneAt(0.5).radius, 1130);
  near(sceneAt(0.5).perspective, 725);
});

test('reelScene retains both endpoints and gives scale a quadratic midpoint', () => {
  assert.deepEqual(reelScene(0), {radius:460, perspective:1000, tilt:-22, roll:-20, scale:0.52});
  assert.deepEqual(reelScene(1), {radius:1800, perspective:450, tilt:-0, roll:-0, scale:2.3});
  const middle = reelScene(0.5);
  near(middle.radius, 1130);
  near(middle.perspective, 725);
  near(middle.tilt, -11);
  near(middle.roll, -10);
  near(middle.scale, 0.965);
  near(reelScene(0.25).scale, 0.63125);
  near(reelScene(0.75).scale, 1.52125);
});

test('custom camera changes only perspective and preserves the loader endpoint', () => {
  assert.deepEqual(reelScene(0, 600), reelScene(0));
  for (const expansion of [0.25, 0.5, 1]) {
    const { perspective, ...custom } = reelScene(expansion, 600);
    const { perspective: defaultPerspective, ...standard } = reelScene(expansion);
    assert.deepEqual(custom, standard);
    near(perspective - defaultPerspective, 150 * expansion);
  }
  near(reelScene(0.5, 600).perspective, 800);
  near(reelScene(1, 600).perspective, 600);
});

test('scene adapter passes the shared scene and rotation through to the pose', () => {
  const scene = sceneAt(0.5, -725, 600);
  assert.deepEqual(scene, { ...reelScene(0.5, 600), rotation: -725 });
  near(reelPose(0, 1, scene).scale, 0.965);
  near(reelPose(0, 1, reelScene(0.5)).scale, 0.965);
});

test('camera culling follows the perspective plane, not a hemisphere heuristic', () => {
  assert.equal(reelPose(180, 1, sceneAt(0)).behindCamera, false);
  assert.equal(reelPose(180, 1, sceneAt(1)).behindCamera, true);
  assert.equal(reelPose(0, 1, sceneAt(1)).behindCamera, false);
  assert.equal(reelPose(90, 1, sceneAt(1)).behindCamera, false);
});

test('rotation remains continuous through full turns and geometry is periodic', () => {
  const a = reelPose(22.5, 1, sceneAt(1, 359.99));
  const b = reelPose(22.5, 1, sceneAt(1, 360.01));
  assert.ok(Math.abs(a.x - b.x) < 1);
  const c = reelPose(22.5, 1, sceneAt(1, 719.99));
  near(a.x, c.x);
  near(a.z, c.z);
  near(c.yaw - a.yaw, 360);
});

test('formation/expansion clamp and inputs are never mutated', () => {
  const scene = Object.freeze(sceneAt(0.5));
  assert.deepEqual(reelPose(-90, 2, scene), reelPose(270, 1, scene));
  assert.deepEqual(sceneAt(-1), sceneAt(0));
  assert.deepEqual(sceneAt(3), sceneAt(1));
  for (const v of Object.values(reelPose(37, 0.6, scene))) {
    if (typeof v === 'number') assert.ok(Number.isFinite(v));
  }
});

test('recycling changes only at the hidden back in both directions', () => {
  for (let slot = 0; slot < SLOTS; slot++) {
    const angle = slot * 22.5;
    const crossing = 180 - angle;
    const before = recycleTurn(angle, crossing - 0.01);
    const after = recycleTurn(angle, crossing + 0.01);
    assert.equal(after - before, 1);
    assert.ok(reelPose(angle, 1, sceneAt(1, crossing)).behindCamera);
    assert.notEqual(reelIndex(slot, before, 29), reelIndex(slot, after, 29));
    assert.equal(recycleTurn(angle, crossing - 0.01), before);
  }
});

test('arbitrary reel counts, including fewer than 16, wrap safely', () => {
  for (const count of [1, 3, 16, 29, 100]) {
    for (let turn = -10; turn <= 10; turn++) {
      const index = reelIndex(15, turn, count);
      assert.ok(index >= 0 && index < count);
    }
  }
  assert.throws(() => reelIndex(0, 0, 0), RangeError);
});
