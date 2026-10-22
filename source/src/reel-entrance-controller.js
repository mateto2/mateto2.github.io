/**
 * Event-driven entrance, with exactly two visual MotionValues.
 * The numeric 1.05s animation is only a cancellable handoff signal.
 */
export function createReelEntrance({
  formation, expansion, animate, onHomeEntrance, onComplete, reducedMotion = false,
  waitForPrelude = false,
}) {
  let formed = false;
  let waiting = true;
  let started = false;
  let revealing = false;
  let finished = false;
  let active = true;
  let homeStarted = false;
  let preludeComplete = !waitForPrelude;
  let dealing = false;
  const controls = [];

  const startHome = () => {
    if (!active || homeStarted) return;
    homeStarted = true;
    onHomeEntrance();
  };

  const tryReveal = () => {
    if (!active || finished || revealing || !formed || waiting) return;
    revealing = true;
    controls.push(animate(expansion, 1, {
      duration: 1.9,
      ease: [0.5, 0, 0.15, 1],
      onComplete: () => {
        if (!active || finished) return;
        finished = true;
        startHome();
        onComplete();
      },
    }));
    controls.push(animate(0, 1, {
      duration: 1.05,
      onComplete: () => { if (!finished) startHome(); },
    }));
  };

  const skip = () => {
    if (!active || finished) return;
    finished = true;
    controls.forEach(control => control.stop());
    formation.set(1);
    expansion.set(1);
    startHome();
    onComplete();
  };

  const tryFormation = () => {
    if (!active || finished || !started || !preludeComplete || dealing) return;
    dealing = true;
    controls.push(animate(formation, 1, {
      duration: 2.6,
      ease: 'linear',
      onComplete: () => {
        if (!active || finished) return;
        formed = true;
        tryReveal();
      },
    }));
  };

  return {
    start() {
      if (!active || started || finished) return;
      started = true;
      if (reducedMotion) { skip(); return; }
      tryFormation();
    },
    completePrelude() {
      preludeComplete = true;
      tryFormation();
    },
    setAssetsReady(ready) {
      waiting = !ready;
      tryReveal();
    },
    skip,
    stop() {
      active = false;
      controls.forEach(control => control.stop());
    },
  };
}
