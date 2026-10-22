export const REEL_SLOTS = 16;

/** Slot plus rotation, normalized to [-180, 180). Keep spring state unwrapped. */
export function reelAngle(slot: number, angle: number, slots = REEL_SLOTS) {
  return ((slot * 360 / slots + angle + 180) % 360 + 360) % 360 - 180;
}
