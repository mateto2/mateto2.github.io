import React, { useCallback, useEffect, useRef, useState } from 'react';

/** The real video ending, rather than a timeout, releases the card formation. */
export default function PatternBackdrop({ cleared, reducedMotion, onComplete, onAsset }) {
  const video = useRef(null);
  const ended = useRef(reducedMotion);
  const [done, setDone] = useState(reducedMotion);
  const finish = useCallback(() => {
    if (ended.current) return;
    ended.current = true;
    video.current?.pause();
    setDone(true);
    onComplete();
  }, [onComplete]);

  useEffect(() => {
    if (!cleared) return;
    ended.current = true;
    video.current?.pause();
    setDone(true);
  }, [cleared]);

  useEffect(() => {
    const element = video.current;
    if (!element || cleared || reducedMotion) return;
    element.defaultPlaybackRate = 1.5;
    element.playbackRate = 1.5;
    let active = true;
    const resume = () => {
      if (!active || ended.current) return;
      if (document.hidden) element.pause();
      else element.play().catch(error => { if (active && error.name !== 'AbortError') finish(); });
    };
    resume();
    document.addEventListener('visibilitychange', resume);
    return () => {
      active = false;
      element.pause();
      document.removeEventListener('visibilitychange', resume);
    };
  }, [cleared, reducedMotion, finish]);

  return <div className="scene-pattern" aria-hidden="true">
    <img src="/media/pattern-finished.jpg" alt="" fetchPriority="high"
      onLoad={() => onAsset('scene:pattern', true)} onError={() => onAsset('scene:pattern', false)} />
    {!reducedMotion && <video ref={video} className="pattern-drawing" hidden={done || cleared}
      src="/media/pattern-drawing.mp4" poster="/media/pattern-start.jpg"
      preload="auto" muted playsInline disablePictureInPicture tabIndex={-1}
      onEnded={finish} onError={finish} />}
  </div>;
}
