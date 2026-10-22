import test from 'node:test';
import assert from 'node:assert/strict';
import { createWriteCache, createStyleWriter } from './reel-style-writer.ts';

function node() {
  const writes = [];
  const style = {
    getPropertyValue() { throw new Error('Style comparisons must not read the DOM'); },
    setProperty(key, value) { writes.push([key, value]); },
  };
  return { style, writes };
}

test('unchanged frames do not rewrite numeric strings that CSS would serialize differently', () => {
  const setStyle = createStyleWriter();
  const card = node();
  for (let frame = 0; frame < 120; frame++) {
    setStyle(card, 'opacity', '1.000'); // CSS serializes this as "1".
    setStyle(card, 'transform', 'translate3d(0px,0px,0px)'); // CSS inserts spaces.
  }
  assert.equal(card.writes.length, 2);
  setStyle(card, 'opacity', '0.500');
  setStyle(card, 'opacity', '0.500');
  setStyle(card, 'opacity', '1.000');
  assert.deepEqual(card.writes.slice(2), [['opacity', '0.500'], ['opacity', '1.000']]);
});

test('all 16 cards and a replacement node receive their own initial values', () => {
  const setStyle = createStyleWriter();
  const cards = Array.from({ length: 16 }, node);
  for (const card of cards) setStyle(card, 'opacity', '1.000');
  cards[7] = node();
  for (const card of cards) setStyle(card, 'opacity', '1.000');
  assert.ok(cards.every(card => card.writes.length === 1));
  setStyle(null, 'opacity', '1.000');
});

test('properties and separate renderer lifecycles do not share cached state', () => {
  const first = createStyleWriter();
  const ring = node();
  first(ring, '--tilt', '0deg');
  first(ring, '--roll', '0deg');
  first(ring, '--tilt', '0deg');
  const remounted = createStyleWriter();
  remounted(ring, '--tilt', '0deg');
  assert.deepEqual(ring.writes, [['--tilt', '0deg'], ['--roll', '0deg'], ['--tilt', '0deg']]);
});

test('an apply failure is retried instead of being cached as a success', () => {
  const write = createWriteCache();
  let attempts = 0;
  assert.throws(() => write('radius', '460px', () => { attempts++; throw new Error('failed'); }));
  write('radius', '460px', () => attempts++);
  write('radius', '460px', () => attempts++);
  assert.equal(attempts, 2);
});
