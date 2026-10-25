import React, { useEffect, useRef, useState } from 'react';
import { motion, useAnimationFrame, useMotionValue, useReducedMotion, useSpring } from 'framer-motion';
import { createBadgeGesture } from './badge-gesture.js';
import './badge-selector.css';

function Clasp() {
  return <svg className="badge-clasp" viewBox="0 0 60 88" fill="none" aria-hidden="true"><defs><linearGradient id="clasp-metal" x1="10" y1="0" x2="50" y2="15" gradientUnits="userSpaceOnUse"><stop stopColor="#a2a4a5"/><stop offset=".4" stopColor="#fff"/><stop offset=".65" stopColor="#8c9298"/><stop offset="1" stopColor="#e0e3e5"/></linearGradient></defs><path d="M13 7v9c0 24 34 24 34 0V7" stroke="url(#clasp-metal)" strokeWidth="6"/><rect x="24" y="33" width="12" height="16" rx="5" fill="url(#clasp-metal)"/><path d="m28 46-9 25c-2 8 4 11 12 11h8c7 0 8-6 5-12l-9-21" stroke="url(#clasp-metal)" strokeWidth="7"/><path d="m30 52 8 23" stroke="#6f7782" strokeWidth="2"/><path d="M26 78h12" stroke="#fff" strokeWidth="2"/></svg>;
}
function BadgeArtwork({ type }) {
  if (type === 'filmmaker') return <div className="badge-art-film"><img src="/media/portfolio/01.jpg" alt="" draggable="false"/><span className="badge-rec"><i/> REC</span><span className="badge-frame-corner"/><span className="badge-timecode">00:00:01:24</span><div className="badge-film-caption">feito para<br/><em>sentir.</em></div></div>;
  if (type === 'designer') return <div className="badge-art-design"><span className="badge-design-word">Aa<span>✳</span></span><div className="badge-color-chips"><i/><i/><i/></div><span className="badge-design-line">FORMA · COR · INTENÇÃO</span></div>;
  if (type === 'desenvolvedor') return <div className="badge-art-code"><div className="badge-window-dots"><i/><i/><i/><span>ideia.jsx</span></div><div className="badge-code-content"><span>01&nbsp; <b>const</b> ideia = {'{'}</span><span>02&nbsp; &nbsp;olhar: <em>'curioso'</em>,</span><span>03&nbsp; &nbsp;limites: <em>null</em></span><span>04&nbsp; {'}'};</span><span className="badge-code-gap">05&nbsp; criar(ideia);<i/></span></div><strong>&lt;/&gt;</strong></div>;
  return <div className="badge-art-photo"><div className="badge-photo-avatar"><img src="/media/matheus-avatar.png" alt="" draggable="false"/></div><span className="badge-photo-cross">+</span><span className="badge-photo-settings">f / 1.8 &nbsp; ISO 100</span><span className="badge-photo-label">UM NOVO OLHAR</span></div>;
}
function HangingBadge({ field, index, paused }) {
  const reduced = useReducedMotion();
  const rollTarget = useMotionValue(0), yawTarget = useMotionValue(0), liftTarget = useMotionValue(0);
  const roll = useSpring(rollTarget, { stiffness: 54, damping: 7, mass: 1.3 });
  const yaw = useSpring(yawTarget, { stiffness: 70, damping: 12 });
  const lift = useSpring(liftTarget, { stiffness: 75, damping: 12 });
  const [dragging, setDragging] = useState(false);
  const focused = useRef(false), drag = useRef(null), entered = useRef(0);
  const rest = [-4, 3, -2, 4][index];
  const gesture = useRef(null);
  if (!gesture.current) gesture.current = createBadgeGesture(value => { drag.current = value; setDragging(Boolean(value)); });
  useEffect(() => {
    const cancel = () => gesture.current.cancel();
    window.addEventListener('blur', cancel);
    return () => { window.removeEventListener('blur', cancel); };
  }, []);
  useEffect(() => {
    if (!reduced) return;
    gesture.current.cancel(); roll.jump(0); yaw.jump(0); lift.jump(0);
  }, [reduced, roll, yaw, lift]);
  useAnimationFrame(t => {
    if (document.hidden || reduced) return;
    if (!entered.current) entered.current = t;
    const idle = paused || focused.current ? 0 : Math.sin((t - entered.current) / 1100 + index * 1.65) * 1.8;
    rollTarget.set(drag.current ? rest + drag.current.roll : rest + idle);
    yawTarget.set(drag.current ? drag.current.yaw : paused || focused.current ? 0 : Math.sin(t / 1800 + index) * 4);
    liftTarget.set(drag.current?.lift ?? 0);
  });
  return <div className={`badge-lane badge-lane-${field.id}`} style={{ '--badge-order': index }}>
    <span className="badge-peg" aria-hidden="true"/>
    <motion.div className="badge-suspension" style={{ rotate: reduced ? 0 : roll, y: reduced ? 0 : lift }}>
      <div className="badge-lanyard" aria-hidden="true"><span>MATHEUS &nbsp; / &nbsp; {field.label.toUpperCase()} &nbsp; / &nbsp; CRIATIVO</span></div>
      <Clasp/>
      <motion.a href={`#${field.id}`} className={`identity-badge${dragging ? ' is-dragging' : ''}`} style={{ rotateY: reduced ? 0 : yaw }}
        aria-label={`Explorar ${field.label}`} aria-describedby="badge-instructions"
        onPointerDown={e => { if (!reduced) gesture.current.down(e); }}
        onPointerMove={e => { if (gesture.current.move(e)) e.currentTarget.setPointerCapture(e.pointerId); }}
        onPointerUp={e => { gesture.current.up(e); if (e.currentTarget.hasPointerCapture(e.pointerId)) e.currentTarget.releasePointerCapture(e.pointerId); }}
        onPointerCancel={e => gesture.current.cancel(e)}
        onLostPointerCapture={e => gesture.current.up(e)}
        onClick={e => { if (gesture.current.consumeClick(e)) e.preventDefault(); }}
        onDragStart={e => e.preventDefault()}
        onFocus={() => { focused.current = true; }} onBlur={() => { focused.current = false; }}>
        <div className="badge-slot" aria-hidden="true"/>
        <div className="badge-id-line"><span>MATHEUS / PORTFÓLIO</span><span>#{field.n}</span></div>
        <div className="badge-artwork" aria-hidden="true"><BadgeArtwork type={field.id}/></div>
        <div className="badge-title"><h3>{field.label}</h3><p>{field.verb}</p></div>
        <div className="badge-bottom"><span>{field.id === 'filmmaker' ? 'EXPLORAR FILMES' : 'EXPLORAR VERTENTE'}</span><span className="badge-open-arrow" aria-hidden="true">↗</span></div>
        <div className="badge-laminate" aria-hidden="true"/>
      </motion.a>
    </motion.div>
  </div>;
}
export default function BadgeSelector({ fields }) {
  const reduced = useReducedMotion();
  const [paused, setPaused] = useState(false);
  return <section className="badge-section" id="vertentes" aria-label="Escolha uma das quatro vertentes">
    <div className="badge-stage">
      <span className="badge-backdrop-word" aria-hidden="true">Matheus<span>✳</span></span>
      <div className="badge-rack">{fields.map((field, i) => <HangingBadge key={field.id} field={field} index={i} paused={paused}/>)}</div>
    </div>
    <div className="badge-instructions"><p id="badge-instructions"><span aria-hidden="true">↔</span> {reduced ? 'Escolha um crachá para explorar.' : 'Arraste para brincar. Clique para explorar.'}</p><span className="badge-four">QUATRO VERTENTES. UM MESMO OLHAR.</span>{!reduced && <button type="button" aria-pressed={paused} onClick={() => setPaused(v => !v)}>{paused ? '▷ Retomar balanço' : 'Ⅱ Pausar balanço'}</button>}</div>
  </section>;
}
