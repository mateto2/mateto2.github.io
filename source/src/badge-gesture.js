/** Dragging a badge never follows its link. Vertical touch gestures keep scrolling. */
export function createBadgeGesture(onChange) {
  let pointer = null;
  let suppress = false;
  const reset = () => { pointer = null; onChange(null); };
  return {
    down(e) {
      if (pointer || e.button !== 0 || e.isPrimary === false) return;
      suppress = false;
      pointer = { id: e.pointerId, x: e.clientX, y: e.clientY, touch: e.pointerType === 'touch', dragging: false };
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
      onChange({ roll: Math.max(-22, Math.min(22, -dx * .13)), yaw: Math.max(-18, Math.min(18, dx * .10)), lift: Math.max(-12, Math.min(12, dy * .08)) });
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
