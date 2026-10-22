/** Scroll is blocked, never treated as a request to skip the entrance. */
export function bindReelEscapes({ documentTarget, windowTarget, media, isEntering, skip, onReducedMotion }) {
  const change = () => {
    onReducedMotion(media.matches);
    if (media.matches) skip();
  };
  const keydown = event => {
    if (!isEntering()) return;
    if (event.key === 'Escape' || event.key === 'Tab') {
      skip(); // Preserve Tab's normal focus movement.
    } else if ([' ', 'PageDown', 'PageUp', 'ArrowDown', 'ArrowUp', 'Home', 'End'].includes(event.key)) {
      event.preventDefault();
    }
  };
  const lock = event => { if (isEntering()) event.preventDefault(); };
  documentTarget.addEventListener('keydown', keydown, { capture: true });
  windowTarget.addEventListener('wheel', lock, { passive: false, capture: true });
  windowTarget.addEventListener('touchmove', lock, { passive: false, capture: true });
  media.addEventListener('change', change);
  change();
  return () => {
    documentTarget.removeEventListener('keydown', keydown, { capture: true });
    windowTarget.removeEventListener('wheel', lock, { capture: true });
    windowTarget.removeEventListener('touchmove', lock, { capture: true });
    media.removeEventListener('change', change);
  };
}
