/** One pointer at a time; taps stay taps and all movement goes to the spring target. */
export function createReelGesture({ isBlocked, onTurn, onDragChange, onInteraction }) {
  let pointer = null;
  let suppressClick = false;
  return {
    down(event, allowed) {
      if (pointer || event.isPrimary === false || event.button !== 0) return;
      suppressClick = false;
      if (!allowed || isBlocked()) return;
      pointer = { id: event.pointerId, startX: event.clientX, lastX: event.clientX, moved: false };
      onDragChange(true);
      onInteraction();
    },
    move(event) {
      if (!pointer || pointer.id !== event.pointerId) return;
      if (isBlocked()) { this.cancel(); return; }
      if (!pointer.moved && Math.abs(event.clientX - pointer.startX) <= 6) return;
      const dx = event.clientX - pointer.lastX;
      pointer.lastX = event.clientX;
      pointer.moved = true;
      suppressClick = true;
      onTurn(-dx * 0.13);
      onInteraction();
    },
    up(event) {
      if (!pointer || pointer.id !== event.pointerId) return;
      pointer = null;
      onDragChange(false);
      onInteraction();
    },
    cancel(event) {
      if (event && pointer && event.pointerId !== pointer.id) return;
      const wasDragging = Boolean(pointer);
      pointer = null;
      suppressClick = false;
      if (wasDragging) onDragChange(false);
    },
    consumeClick(event) {
      // Keyboard and assistive-technology activations have no pointer click count.
      if (event.detail === 0 || !suppressClick) return false;
      suppressClick = false;
      return true;
    },
  };
}
