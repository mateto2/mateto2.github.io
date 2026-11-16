import React, { useEffect, useRef } from 'react';
import './things-wordmark.css';

// One thing per letter of "Matheus". Replace a file in public/media/things/
// (same name, transparent square PNG) to swap the object without touching code.
export const things = [
  { ch: 'M', src: '/media/things/filmmaker.png', label: 'Filmes' },
  { ch: 'a', src: '/media/things/designer.png', label: 'Design' },
  { ch: 't', src: '/media/things/desenvolvedor.png', label: 'Código' },
  { ch: 'h', src: '/media/things/fotografia.png', label: 'Fotografia' },
  { ch: 'e', src: '/media/things/bone.png', label: 'Boné azul' },
  { ch: 'u', src: '/media/things/oculos.png', label: 'Óculos' },
  { ch: 's', src: '/media/things/ideia.png', label: 'Ideias' },
];

const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));
const smooth = t => { const x = clamp(t, 0, 1); return x * x * (3 - 2 * x); };
const WAVE_STEP = 0.085, WAVE_HOLD = 0.75, IDLE_REPLAY = 8;

export default function ThingsWordmark() {
  const root = useRef(null);
  const slots = useRef([]);
  const caption = useRef(null);

  useEffect(() => {
    const el = root.current;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
    const state = things.map(() => ({ a: 0, v: 0, rot: 0, ok: false, cache: {} }));
    const pointer = { x: 0, y: 0, on: false, touch: false };
    let wave = null, lastActive = performance.now(), frame = 0, prev = 0, ready = false;
    let centers = [], size = 60;

    const write = (s, node, key, value) => { if (s.cache[key] !== value) { node.style[key] = value; s.cache[key] = value; } };
    const measure = () => {
      const box = el.getBoundingClientRect();
      size = parseFloat(getComputedStyle(el).fontSize) || 60;
      centers = slots.current.map(node => { const r = node.getBoundingClientRect(); return { x: r.left + r.width / 2 - box.left, y: r.top + r.height / 2 - box.top }; });
    };
    const playWave = now => { wave = now; };

    // Preload every thing so a letter never turns into an empty box.
    let pending = things.length;
    const settle = () => { if (--pending <= 0 && !ready) { ready = true; measure(); if (!reduced.matches) playWave(performance.now() + 350); } };
    things.forEach((t, i) => {
      const img = new Image();
      img.onload = () => { state[i].ok = true; settle(); };
      img.onerror = settle;
      img.src = t.src;
    });
    const fallback = window.setTimeout(() => { pending = 0; settle(); }, 2500);

    const tick = now => {
      frame = requestAnimationFrame(tick);
      if (document.hidden) { prev = now; return; }
      const dt = Math.min(1 / 30, prev ? (now - prev) / 1000 : 0);
      prev = now;
      if (!ready || !centers.length) return;
      if (reduced.matches) { pointer.on = false; wave = null; }
      if (!pointer.on && !wave && now - lastActive > IDLE_REPLAY * 1000 && !reduced.matches) playWave(now);
      let best = -1, bestA = .55;
      state.forEach((s, i) => {
        const c = centers[i];
        let target = 0, lean = 0;
        if (pointer.on) {
          // Lens: the letter nearest the pointer becomes the biggest thing and leans away.
          const dx = c.x - pointer.x, dy = (c.y - pointer.y) * .6;
          const dist = Math.hypot(dx, dy);
          target = smooth(1 - dist / (size * .95));
          lean = clamp(dx / size, -1, 1) * 16;
        }
        if (wave !== null) {
          const local = (now - wave) / 1000 - i * WAVE_STEP;
          if (local > 0 && local < WAVE_HOLD) target = Math.max(target, 1);
          lean = lean || Math.sin(local * 5) * 8;
        }
        if (!s.ok) target = 0;
        s.v += ((target - s.a) * 240 - s.v * 19) * dt; // a little underdamped: ~8% overshoot
        s.a += s.v * dt;
        s.rot += (lean - s.rot) * Math.min(1, dt * 10);
        const node = slots.current[i];
        const g = clamp(1 - s.a, 0, 1.3), o = Math.max(0, s.a);
        write(s, node.firstChild, 'transform', `translate3d(0,${(-s.a * size * .06).toFixed(2)}px,0) scale(${g.toFixed(3)})`);
        write(s, node.lastChild, 'transform', `translate3d(-50%,-50%,0) rotate(${s.rot.toFixed(1)}deg) scale(${o.toFixed(3)})`);
        if (s.a > bestA) { bestA = s.a; best = i; }
      });
      if (wave !== null && (now - wave) / 1000 > things.length * WAVE_STEP + WAVE_HOLD + .6) { wave = null; lastActive = now; }
      const cap = caption.current;
      if (cap) {
        const text = best >= 0 && pointer.on ? things[best].label : '';
        if (cap.dataset.text !== text) { cap.dataset.text = text; if (text) cap.textContent = text; cap.classList.toggle('is-visible', Boolean(text)); }
        if (best >= 0) cap.style.transform = `translate3d(${centers[best].x.toFixed(1)}px,0,0) translateX(-50%)`;
      }
    };
    frame = requestAnimationFrame(tick);

    const move = e => {
      const box = el.getBoundingClientRect();
      pointer.x = e.clientX - box.left; pointer.y = e.clientY - box.top;
      const pad = size * .6;
      pointer.on = !reduced.matches && pointer.x > -pad && pointer.x < box.width + pad && pointer.y > -pad && pointer.y < box.height + pad;
      if (pointer.on) lastActive = performance.now();
    };
    const leave = () => { pointer.on = false; lastActive = performance.now(); };
    const focus = () => { if (!reduced.matches) playWave(performance.now()); };
    const resize = () => measure();
    const mouseLeave = e => { if (e.pointerType === 'mouse') leave(); };
    const touchEnd = e => { if (e.pointerType !== 'mouse') leave(); };
    window.addEventListener('pointermove', move, { passive: true });
    el.addEventListener('pointerdown', move);
    el.addEventListener('pointerleave', mouseLeave);
    window.addEventListener('pointerup', touchEnd);
    window.addEventListener('pointercancel', touchEnd);
    el.addEventListener('focus', focus);
    window.addEventListener('resize', resize);
    document.fonts?.ready.then(measure);
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    return () => {
      cancelAnimationFrame(frame);
      window.clearTimeout(fallback);
      observer.disconnect();
      window.removeEventListener('pointermove', move);
      window.removeEventListener('resize', resize);
      window.removeEventListener('pointerup', touchEnd);
      window.removeEventListener('pointercancel', touchEnd);
      el.removeEventListener('pointerdown', move);
      el.removeEventListener('pointerleave', mouseLeave);
      el.removeEventListener('focus', focus);
    };
  }, []);

  return <a ref={root} href="#inicio" className="hub-logo things-wordmark" aria-label="Matheus, início">
    <span className="things-word" aria-hidden="true">
      {things.map((t, i) => <span key={t.ch + i} className="things-slot" ref={node => { slots.current[i] = node; }}>
        <span className="things-glyph">{t.ch}</span>
        <img className="things-object" src={t.src} alt="" draggable="false" decoding="async"/>
      </span>)}
    </span>
    <span ref={caption} className="things-caption" aria-hidden="true"/>
  </a>;
}
