import test from 'node:test';
import assert from 'node:assert/strict';
import { createReelGesture } from './reel-gesture.js';
import { bindReelEscapes } from './reel-escapes.js';

const pointer = (x, id = 1) => ({ clientX: x, pointerId: id, button: 0, isPrimary: true });
function gestureHarness() {
  const state = { blocked: false, turns: [], dragging: false };
  state.gesture = createReelGesture({
    isBlocked: () => state.blocked,
    onTurn: delta => state.turns.push(delta),
    onDragChange: active => { state.dragging = active; },
    onInteraction() {},
  });
  return state;
}

test('swipes cannot rotate during entrance or dialogs, but work after unlocking', () => {
  const h = gestureHarness();
  h.blocked = true;
  h.gesture.down(pointer(100), true);
  h.gesture.move(pointer(20));
  assert.deepEqual(h.turns, []);
  h.blocked = false;
  h.gesture.down(pointer(100), true);
  h.gesture.move(pointer(20));
  assert.deepEqual(h.turns, [10.4]);
  h.gesture.up(pointer(20));
  assert.equal(h.dragging, false);
});

test('small pointer movements preserve taps without moving the spring target', () => {
  const h = gestureHarness();
  h.gesture.down(pointer(100), true);
  h.gesture.move(pointer(105));
  h.gesture.up(pointer(105));
  assert.deepEqual(h.turns, []);
  assert.equal(h.gesture.consumeClick({ detail: 1 }), false);
});

test('a swipe suppresses its click, while the next tap and keyboard activation work', () => {
  const h = gestureHarness();
  h.gesture.down(pointer(100), true);
  h.gesture.move(pointer(140));
  h.gesture.up(pointer(140));
  assert.equal(h.gesture.consumeClick({ detail: 0 }), false);
  assert.equal(h.gesture.consumeClick({ detail: 1 }), true);
  h.gesture.down(pointer(50), true);
  h.gesture.up(pointer(50));
  assert.equal(h.gesture.consumeClick({ detail: 1 }), false);
});

test('secondary pointers cannot hijack or finish the active swipe', () => {
  const h = gestureHarness();
  h.gesture.down(pointer(100), true);
  h.gesture.down(pointer(400, 2), true);
  h.gesture.move(pointer(0, 2));
  h.gesture.up(pointer(0, 2));
  assert.deepEqual(h.turns, []);
  assert.equal(h.dragging, true);
  h.gesture.move(pointer(50));
  assert.deepEqual(h.turns, [6.5]);
  h.gesture.cancel(pointer(50));
  assert.equal(h.dragging, false);
  assert.equal(h.gesture.consumeClick({ detail: 1 }), false);
});

test('excluded starts and a mid-gesture block do not rotate the ring', () => {
  const h = gestureHarness();
  h.gesture.down(pointer(100), false);
  h.gesture.move(pointer(0));
  assert.deepEqual(h.turns, []);
  h.gesture.down(pointer(100), true);
  h.blocked = true;
  h.gesture.move(pointer(0));
  assert.deepEqual(h.turns, []);
  assert.equal(h.dragging, false);
});

function escapesHarness(matches = false) {
  const state = { entering: true, skips: 0, reduced: false };
  const documentTarget = new EventTarget(), windowTarget = new EventTarget();
  const media = Object.assign(new EventTarget(), { matches });
  const cleanup = bindReelEscapes({
    documentTarget, windowTarget, media,
    isEntering: () => state.entering,
    skip: () => { state.skips++; state.entering = false; },
    onReducedMotion: value => { state.reduced = value; },
  });
  const dispatch = (target, type, extra = {}) => {
    const event = Object.assign(new Event(type, { cancelable: true }), extra);
    target.dispatchEvent(event);
    return event;
  };
  return { state, documentTarget, windowTarget, media, cleanup, dispatch };
}

test('Escape and Tab skip, without preventing normal keyboard focus behavior', () => {
  for (const key of ['Escape', 'Tab']) {
    const h = escapesHarness();
    const event = h.dispatch(h.documentTarget, 'keydown', { key });
    assert.equal(h.state.skips, 1);
    assert.equal(event.defaultPrevented, false);
    h.cleanup();
  }
});

test('wheel, touch scroll, and scroll keys are blocked without skipping', () => {
  const h = escapesHarness();
  for (const type of ['wheel', 'touchmove']) {
    assert.equal(h.dispatch(h.windowTarget, type).defaultPrevented, true);
  }
  for (const key of [' ', 'PageDown', 'PageUp', 'ArrowDown', 'ArrowUp', 'Home', 'End']) {
    assert.equal(h.dispatch(h.documentTarget, 'keydown', { key }).defaultPrevented, true);
  }
  assert.equal(h.state.skips, 0);
  h.state.entering = false;
  assert.equal(h.dispatch(h.windowTarget, 'wheel').defaultPrevented, false);
  h.cleanup();
});

test('initial and newly enabled reduced motion both skip and pause motion', () => {
  const initial = escapesHarness(true);
  assert.equal(initial.state.skips, 1);
  assert.equal(initial.state.reduced, true);
  initial.cleanup();
  const h = escapesHarness();
  h.media.matches = true;
  h.dispatch(h.media, 'change');
  assert.equal(h.state.skips, 1);
  assert.equal(h.state.reduced, true);
  h.cleanup();
});

test('cleanup removes scroll, keyboard, and media listeners', () => {
  const h = escapesHarness();
  h.cleanup();
  assert.equal(h.dispatch(h.windowTarget, 'wheel').defaultPrevented, false);
  h.dispatch(h.documentTarget, 'keydown', { key: 'Escape' });
  h.media.matches = true;
  h.dispatch(h.media, 'change');
  assert.equal(h.state.skips, 0);
  assert.equal(h.state.reduced, false);
});
