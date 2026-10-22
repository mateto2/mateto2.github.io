import React, { useEffect, useRef } from 'react';
import { createStyleWriter } from './reel-style-writer.ts';

const sequence = Array.from({ length: 10 }, (_, i) => i);

/** The number is derived solely from successful image/video load events. */
export default function Loader({ loaded, total, failures, cleared, onSkip, expansion }) {
  const root = useRef(null);
  const caption = useRef(null);
  const percent = Math.floor(loaded / total * 100);
  const digits = String(percent).padStart(3, '0').split('').map(Number);

  useEffect(() => {
    const setStyle = createStyleWriter();
    const paint = (e) => {
      const opacity = String(Math.max(0, 1 - e / 0.24));
      setStyle(root.current, 'opacity', opacity);
    };
    paint(expansion.get());
    return expansion.on('change', paint);
  }, [expansion]);

  useEffect(() => {
    if (cleared) return;
    const label = 'LOADING REELS';
    const glyphs = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ/0123456789';
    let frame = 0;
    const id = setInterval(() => {
      frame++;
      if (caption.current) {
        // A text treatment only; it never changes progress or entrance timing.
        caption.current.textContent = label.split('').map((char, i) =>
          char === ' ' || (frame + i) % 17 > 1 ? char : glyphs[(frame * 7 + i) % glyphs.length],
        ).join('');
      }
    }, 110);
    return () => clearInterval(id);
  }, [cleared]);

  return (<>
    <div ref={root} className="loader-ui" hidden={cleared}>
      <div className="loader-note mono"><span className="status-dot" /> A NEW POINT OF VIEW</div>
      <div className="loader-bottom">
        <div>
          <p className="mono loader-caption" aria-hidden="true" ref={caption}>LOADING REELS</p>
          <p className="loading-detail">{failures ? 'Some assets are unavailable. You can skip ahead.' : 'Good things take a different angle.'}</p>
        </div>
        <div className="load-meter">
          <div className="counter" role="progressbar" aria-label="Loading reel covers, previews, background, and portrait"
            aria-valuemin={0} aria-valuemax={100} aria-valuenow={percent}
            aria-valuetext={`${loaded} of ${total} assets loaded`}>
            {digits.map((digit, i) => (
              <span className="digit-window" key={i} aria-hidden="true">
                <span className="digit-strip" style={{ transform: `translateY(-${digit * 10}%)` }}>
                  {sequence.map((n) => <span key={n}>{n}</span>)}
                </span>
              </span>
            ))}
            <span className="percent-symbol" aria-hidden="true">%</span>
          </div>
          <div className="counter-track"><span style={{ width: `${percent}%` }} /></div>
          <p className="mono asset-count">{String(loaded).padStart(2, '0')} / {total} ASSETS READY</p>
        </div>
      </div>
    </div>
    <button className="text-button mono skip entrance-skip" hidden={cleared} onClick={onSkip}>
      SKIP INTRO <span>↗</span>
    </button>
  </>);
}
