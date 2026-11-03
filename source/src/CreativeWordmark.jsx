import React, { useEffect, useId, useRef, useState } from 'react';
import './creative-wordmark.css';

const words = ['Matheus', 'Creative Lab'];
export default function CreativeWordmark() {
  const id = useId().replace(/:/g, '');
  const root = useRef(null);
  const [metrics, setMetrics] = useState(null);
  useEffect(() => {
    let alive = true;
    document.fonts.ready.then(() => {
      const ctx = document.createElement('canvas').getContext('2d');
      ctx.font = '800 100px "DM Sans"';
      const measured = words.map(word => {
        let x = 8;
        const letters = [...word].map(char => {
          const width = ctx.measureText(char).width;
          const letter = { char, x, width };
          x += width - 8.5;
          return letter;
        });
        return { letters, width: x + 12 };
      });
      if (alive) setMetrics(measured);
    });
    return () => { alive = false; };
  }, []);
  const reset = () => root.current?.querySelectorAll('.balloon-letter').forEach(el => el.style.setProperty('--inflate', 0));
  const reactToPointer = e => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    root.current.querySelectorAll('.balloon-letter').forEach(el => {
      const r = el.getBoundingClientRect();
      const distance = Math.hypot(e.clientX - (r.left + r.width / 2), e.clientY - (r.top + r.height / 2));
      el.style.setProperty('--inflate', Math.max(0, 1 - distance / Math.max(85, r.height * 1.15)).toFixed(3));
    });
  };
  return <a href="#inicio" className="creative-wordmark" aria-label="Matheus Creative Lab, início" ref={root} tabIndex={0}
    onPointerMove={reactToPointer} onPointerDown={reactToPointer} onPointerLeave={reset} onPointerUp={e => { if (e.pointerType !== 'mouse') reset(); }} onPointerCancel={reset}
    onFocus={() => { if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) root.current.querySelectorAll('.balloon-letter').forEach(el => el.style.setProperty('--inflate', 1)); }} onBlur={reset}>
    <svg className="balloon-definitions" aria-hidden="true"><defs>
      <filter id={`${id}-gloss`} x="-30%" y="-35%" width="170%" height="180%" colorInterpolationFilters="sRGB">
        <feGaussianBlur in="SourceAlpha" stdDeviation="2.8" result="rounded"/>
        <feSpecularLighting in="rounded" surfaceScale="9" specularConstant="1.3" specularExponent="24" lightingColor="#ffffff" result="light"><fePointLight x="-100" y="-180" z="280"/></feSpecularLighting>
        <feComposite in="light" in2="SourceAlpha" operator="in" result="shine"/>
        <feComposite in="SourceGraphic" in2="shine" operator="arithmetic" k1="0" k2="1" k3="1" k4="0" result="gloss"/>
        <feDropShadow in="gloss" dx="1" dy="3" stdDeviation="1.3" floodOpacity=".3"/>
      </filter>
    </defs></svg>
    {metrics ? metrics.map(({ letters, width }, w) => <svg key={words[w]} className="balloon-word" viewBox={`0 0 ${width} 112`} style={{ width: `${width / Math.max(...metrics.map(line => line.width)) * 100}%` }} aria-hidden="true">
      {letters.map(({ char, x }, i) => <g key={i} className="balloon-letter">
        <text x={x} y="100" className="balloon-flat">{char}</text>
        <text x={x} y="100" className="balloon-volume" filter={`url(#${id}-gloss)`}>{char}</text>
      </g>)}
    </svg>) : <span className="wordmark-fallback">Matheus Creative Lab</span>}
  </a>;
}
