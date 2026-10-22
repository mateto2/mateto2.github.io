import React, { forwardRef, useCallback, useEffect, useRef, useState } from 'react';
import { CRITICAL_SLOTS, reels } from './reels.js';
import { SLOTS } from './reelPose.js';

export const ReelCard = forwardRef(function ReelCard({ slot, onAsset, onOpen }, ref) {
  const critical = CRITICAL_SLOTS.includes(slot);
  const [reel, setReel] = useState(reels[slot % reels.length]);
  const node = useRef(null);
  const retry = useRef({ count: 0, timer: null });
  useEffect(() => {
    retry.current.count = 0;
    return () => clearTimeout(retry.current.timer);
  }, [reel.id]);
  const videoFailed = event => {
    if (!critical) return;
    onAsset(`${slot}:video`, false);
    if (retry.current.count >= 2) return;
    const video = event.currentTarget;
    const delay = ++retry.current.count * 400;
    clearTimeout(retry.current.timer);
    retry.current.timer = setTimeout(() => {
      if (node.current?.contains(video)) video.load();
    }, delay);
  };
  const setNode = useCallback((el) => {
    node.current = el;
    if (el) {
      // The scene calls this only while the slot is behind the camera.
      el.assignReel = (index) => setReel(reels[index]);
    }
    ref(el);
  }, [ref]);

  return (
    <a ref={setNode} className="reel-card" href={`#film-${reel.id}`}
      aria-label={`Watch ${reel.title}`} data-slot={slot} data-reel={reel.id}
      onClick={(event) => onOpen(event, reel)}>
      <div className="reel-surface">
        <img src={reel.cover} alt="" draggable="false"
          decoding="async" fetchPriority={critical ? 'high' : 'low'}
          onLoad={() => critical && onAsset(`${slot}:cover`, true)}
          onError={() => critical && onAsset(`${slot}:cover`, false)} />
        <video key={reel.id} src={reel.video} muted loop playsInline
          preload={critical ? 'auto' : 'none'} tabIndex={-1} aria-hidden="true"
          onLoadedData={() => { clearTimeout(retry.current.timer); if (critical) onAsset(`${slot}:video`, true); }}
          onError={videoFailed} />
        <div className="card-shade" />
        <span className="card-number mono">R/{reel.id}</span>
        <span className="card-play" aria-hidden="true">↗</span>
        <div className="card-caption"><span className="mono">{reel.category}</span><strong>{reel.title}</strong></div>
      </div>
    </a>
  );
});

export default function Wall({ ringRef, cameraRef, cardRefs, onAsset, onOpen, onKeyDown }) {
  // Stable refs avoid ref churn during loader progress renders.
  const callbacks = useRef(Array.from({ length: SLOTS }, (_, i) => (el) => { cardRefs.current[i] = el; }));
  return (
    <div className="scene-viewport" ref={cameraRef}
      onKeyDown={onKeyDown} aria-label="Film wall. Drag, scroll, or use arrow keys to explore." role="region">
      <div className="ring" ref={ringRef}>
        {Array.from({ length: SLOTS }, (_, slot) => (
          <ReelCard key={slot} slot={slot} ref={callbacks.current[slot]} onAsset={onAsset} onOpen={onOpen} />
        ))}
      </div>
    </div>
  );
}
