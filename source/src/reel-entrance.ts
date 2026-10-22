/** Fraction of formation reserved for each card's swing. */
export const DEAL = 0.42;

export interface Scene {
  radius: number;
  perspective: number;
  scale: number;
  rotation?: number;
}

/**
 * Pure entrance pose. The resting angle determines deal order; the unbounded
 * spring rotation is applied afterward so it never changes that order.
 */
export function reelPose(angle: number, formation: number, scene: Scene) {
  const around = ((angle + 180) % 360 + 360) % 360;
  const order = around / 360;
  const t = Math.max(0, Math.min(1, (formation - order * (1 - DEAL)) / DEAL));
  const dealt = 1 - (1 - t) ** 3;
  const placed = -180 + around * dealt;
  const yaw = placed + (scene.rotation ?? 0);
  const r = yaw * Math.PI / 180;
  const radius = scene.radius - (1 - dealt) * order * 24;
  const z = -Math.cos(r) * radius;
  return {
    x: -Math.sin(r) * radius,
    y: 0,
    z,
    yaw,
    scale: scene.scale,
    appear: Math.min(1, t * 2.5),
    behindCamera: z >= scene.perspective - 2,
  };
}
