const START = { radius: 460, perspective: 1000, tilt: -22, roll: -20, scale: 0.52 };

/** Loader and hero are endpoints of the same scene; expansion is in [0, 1]. */
export function reelScene(expansion: number, camera = 450) {
  return {
    radius: START.radius + (1800 - START.radius) * expansion,
    perspective: START.perspective + (camera - START.perspective) * expansion,
    tilt: START.tilt * (1 - expansion),
    roll: START.roll * (1 - expansion),
    scale: START.scale + (2.3 - START.scale) * expansion * expansion,
  };
}
