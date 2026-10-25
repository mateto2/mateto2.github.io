/** Dragging a badge never follows its link. Vertical touch gestures keep scrolling. */
export function createBadgeGesture(onChange) {
  let pointer = null;
  let suppress = false;
  const reset = () => { pointer = null; onChange(null); };
  return {
    down(e, origin = { x: 0, y: 0 }) {
      if (pointer || e.button !== 0 || e.isPrimary === false) return;
      suppress = false;
      pointer = { id: e.pointerId, x: e.clientX, y: e.clientY, origin, touch: e.pointerType === 'touch', dragging: false };
    },
    move(e) {
      if (!pointer || e.pointerId !== pointer.id) return false;
      const dx = e.clientX - pointer.x, dy = e.clientY - pointer.y;
      if (!pointer.dragging) {
        if (Math.hypot(dx, dy) < 7) return false;
        if (pointer.touch && Math.abs(dy) > Math.abs(dx)) { reset(); return false; }
        pointer.dragging = true;
      }
      suppress = true;
      onChange({ x: pointer.origin.x + dx, y: pointer.origin.y + dy });
      return true;
    },
    up(e) { if (pointer?.id === e.pointerId) reset(); },
    cancel(e) { if (!e || pointer?.id === e.pointerId) { suppress = false; reset(); } },
    consumeClick(e) {
      if (e.detail === 0) return false;
      const consumed = suppress; suppress = false; return consumed;
    },
  };
}

// Full travel near the pointer, with gradual resistance only toward the edges.
export function badgeDragPose(x, y, travel = 340) {
  const resist = (value, limit) => Math.sign(value) * (Math.abs(value) <= limit ? Math.abs(value) : limit + 70 * (1 - Math.exp(-(Math.abs(value) - limit) / 140)));
  const dx = resist(x, travel);
  const dy = resist(y, y < 0 ? 75 : 150);
  return {
    x: dx,
    y: dy,
    roll: -48 * Math.tanh(dx / 280),
    yaw: 38 * Math.tanh(dx / 240),
    pitch: -24 * Math.tanh(dy / 150),
  };
}

// The ribbon and clasp share one endpoint, including while the body rebounds.
export function badgeRibbonPath(x, y, roll, length) {
  const endY = length + y;
  const radians = roll * Math.PI / 180;
  const slack = Math.max(0, -y) * .65;
  return `M 0 0 C ${-x * .16 - slack} ${length * .45}, ${x + Math.sin(radians) * 28} ${endY - Math.cos(radians) * 28}, ${x} ${endY}`;
}
