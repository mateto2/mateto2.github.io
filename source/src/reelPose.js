import { REEL_SLOTS } from './reel-ring.ts';
import { reelScene } from './reel-scene.ts';
export { reelPose } from './reel-entrance.ts';

export const SLOTS = REEL_SLOTS;
export const clamp = (n, min = 0, max = 1) => Math.max(min, Math.min(max, n));
export const mod = (n, d) => ((n % d) + d) % d;
/** Clamp scene progress at the app boundary and attach unbounded spring rotation. */
export function sceneAt(expansion, rotation = 0, camera = 450) {
  return {
    ...reelScene(clamp(expansion), camera),
    rotation,
  };
}

/** Back recycling happens in a sector that is hidden at full expansion. */
export function recycleTurn(slotAngle, rotation) {
  return Math.floor((slotAngle + rotation + 180) / 360);
}

export function reelIndex(slot, turn, reelCount) {
  if (!Number.isInteger(reelCount) || reelCount < 1) throw new RangeError('reelCount must be positive');
  return mod(slot - turn * SLOTS, reelCount);
}
