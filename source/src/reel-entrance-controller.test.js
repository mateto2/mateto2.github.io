import test from 'node:test';
import assert from 'node:assert/strict';
import { createReelEntrance } from './reel-entrance-controller.js';

function harness(reducedMotion = false, waitForPrelude = false) {
  let now = 0;
  const events = [], animations = [];
  const value = () => ({ current: 0, set(next) { this.current = next; } });
  const formation = value(), expansion = value();
  const controller = createReelEntrance({
    formation, expansion, reducedMotion, waitForPrelude,
    animate(subject, target, options) {
      const animation = {
        subject, target, options, ends: now + options.duration, stopped: false, done: false,
        stop() { this.stopped = true; },
      };
      animations.push(animation);
      return animation;
    },
    onHomeEntrance: () => events.push(['home', now]),
    onComplete: () => events.push(['complete', now]),
  });
  function advance(seconds) {
    const end = now + seconds;
    while (true) {
      const next = animations.filter(a => !a.stopped && !a.done && a.ends <= end)
        .sort((a, b) => a.ends - b.ends)[0];
      if (!next) break;
      now = next.ends;
      next.done = true;
      if (typeof next.subject !== 'number') next.subject.set(next.target);
      next.options.onComplete();
    }
    now = end;
  }
  return { controller, formation, expansion, events, animations, advance };
}

test('fast assets wait for formation; home overlaps the expanding ring', () => {
  const h = harness();
  h.controller.start();
  h.controller.setAssetsReady(true);
  h.advance(2.59);
  assert.equal(h.animations.length, 1);
  h.advance(0.02);
  assert.equal(h.animations.length, 3);
  assert.equal(h.animations[0].options.ease, 'linear');
  assert.deepEqual(h.animations[1].options.ease, [0.5, 0, 0.15, 1]);
  h.advance(1.05);
  assert.deepEqual(h.events, [['home', 2.6 + 1.05]]);
  assert.equal(h.expansion.current, 0); // Fake animation hasn't completed yet.
  h.advance(0.85);
  assert.deepEqual(h.events, [['home', 2.6 + 1.05], ['complete', 4.5]]);
  assert.equal(h.expansion.current, 1);
});

test('slow or failed assets hold the formed ring until actual readiness', () => {
  const h = harness();
  h.controller.start();
  h.controller.setAssetsReady(false);
  h.advance(10);
  assert.equal(h.formation.current, 1);
  assert.equal(h.expansion.current, 0);
  assert.equal(h.animations.length, 1);
  h.controller.setAssetsReady(true);
  assert.equal(h.animations.length, 3);
  h.advance(1.9);
  assert.deepEqual(h.events, [['home', 11.05], ['complete', 11.9]]);
});

test('repeated starts and ready events cannot launch duplicate reveals', () => {
  const h = harness();
  h.controller.start();
  h.controller.start();
  h.controller.setAssetsReady(true);
  h.advance(2.6);
  h.controller.setAssetsReady(true);
  h.controller.setAssetsReady(false);
  h.controller.setAssetsReady(true);
  h.advance(2);
  assert.equal(h.animations.length, 3);
  assert.equal(h.events.length, 2);
});

test('skip works during formation, asset wait, and either half of expansion', () => {
  for (const at of [0.5, 2.7, 3, 3.8]) {
    const h = harness();
    h.controller.start();
    if (at !== 2.7) h.controller.setAssetsReady(true);
    h.advance(at);
    h.controller.skip();
    assert.equal(h.formation.current, 1);
    assert.equal(h.expansion.current, 1);
    assert.ok(h.animations.every(a => a.stopped));
    h.controller.setAssetsReady(true);
    h.controller.skip();
    h.advance(10);
    assert.equal(h.events.filter(([name]) => name === 'home').length, 1);
    assert.equal(h.events.filter(([name]) => name === 'complete').length, 1);
  }
});

test('reduced motion completes immediately without starting animations', () => {
  const h = harness(true);
  h.controller.start();
  assert.equal(h.animations.length, 0);
  assert.equal(h.formation.current, 1);
  assert.equal(h.expansion.current, 1);
  assert.deepEqual(h.events, [['home', 0], ['complete', 0]]);
});

test('unmount cancels every control and ignores even late completion callbacks', () => {
  const h = harness();
  h.controller.start();
  h.controller.setAssetsReady(true);
  h.advance(2.6);
  h.controller.stop();
  for (const animation of h.animations) animation.options.onComplete();
  h.controller.setAssetsReady(true);
  h.controller.skip();
  h.advance(10);
  assert.ok(h.animations.every(a => a.stopped));
  assert.deepEqual(h.events, []);
});

test('the drawing video must end before any card formation starts, even with ready assets', () => {
  const h = harness(false, true);
  h.controller.start();
  h.controller.setAssetsReady(true);
  h.advance(8);
  assert.equal(h.animations.length, 0);
  assert.equal(h.formation.current, 0);
  h.controller.completePrelude();
  h.controller.completePrelude();
  assert.equal(h.animations.length, 1);
  h.advance(2.6);
  assert.equal(h.animations.length, 3);
  h.advance(1.9);
  assert.equal(h.expansion.current, 1);
  assert.deepEqual(h.events.map(([name]) => name), ['home', 'complete']);
});

test('a prelude completed before start is remembered without starting animations early', () => {
  const h = harness(false, true);
  h.controller.completePrelude();
  assert.equal(h.animations.length, 0);
  h.controller.start();
  h.controller.start();
  assert.equal(h.animations.length, 1);
});

test('skip during the video completes the entrance and ignores its late ended event', () => {
  const h = harness(false, true);
  h.controller.start();
  h.controller.skip();
  h.controller.completePrelude();
  h.controller.setAssetsReady(true);
  assert.equal(h.animations.length, 0);
  assert.equal(h.formation.current, 1);
  assert.equal(h.expansion.current, 1);
  assert.deepEqual(h.events, [['home', 0], ['complete', 0]]);
});

test('unmount during the video cannot start a later card animation', () => {
  const h = harness(false, true);
  h.controller.start();
  h.controller.stop();
  h.controller.completePrelude();
  h.controller.setAssetsReady(true);
  assert.equal(h.animations.length, 0);
  assert.deepEqual(h.events, []);
});

test('reduced motion bypasses the video gate as well as the card animations', () => {
  const h = harness(true, true);
  h.controller.start();
  assert.equal(h.animations.length, 0);
  assert.equal(h.expansion.current, 1);
  assert.deepEqual(h.events, [['home', 0], ['complete', 0]]);
});
