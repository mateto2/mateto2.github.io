import SiteIcon from './SiteIcon.jsx';
import React, { useEffect, useId, useRef, useState } from 'react';
import { motion, useAnimationFrame, useMotionValue, useReducedMotion, useSpring, useTransform } from 'framer-motion';
import { badgeDragPose, badgeRibbonPath, createBadgeGesture } from './badge-gesture.js';
import './badge-selector.css';

function Clasp() {
  return <svg className="badge-clasp" viewBox="0 0 60 88" fill="none" aria-hidden="true"><defs><linearGradient id="clasp-metal" x1="10" y1="0" x2="50" y2="15" gradientUnits="userSpaceOnUse"><stop stopColor="#a2a4a5"/><stop offset=".4" stopColor="#fff"/><stop offset=".65" stopColor="#8c9298"/><stop offset="1" stopColor="#e0e3e5"/></linearGradient></defs><path d="M13 7v9c0 24 34 24 34 0V7" stroke="url(#clasp-metal)" strokeWidth="6"/><rect x="24" y="33" width="12" height="16" rx="5" fill="url(#clasp-metal)"/><path d="m28 46-9 25c-2 8 4 11 12 11h8c7 0 8-6 5-12l-9-21" stroke="url(#clasp-metal)" strokeWidth="7"/><path d="m30 52 8 23" stroke="#6f7782" strokeWidth="2"/><path d="M26 78h12" stroke="#fff" strokeWidth="2"/></svg>;
}
function BadgeArtwork({ type }) {
  const [alternateReady, setAlternateReady] = useState(false);
  const [foregroundReady, setForegroundReady] = useState(false);
  if (type === 'fotografia') return <span className="badge-photo-art">
    <img className="badge-portrait badge-portrait-fotografia" src="/media/badges/fotografia.png" alt="" draggable="false" decoding="async"/>
    <span className={`badge-photo-alternate${alternateReady ? ' is-ready' : ''}`}>
      <img className="badge-portrait badge-portrait-fotografia-hover" src="/media/badges/fotografia-hover.png" alt="" draggable="false" decoding="async"
        onLoad={() => setAlternateReady(true)} onError={() => setAlternateReady(false)}/>
    </span>
  </span>;
  if (type !== 'desenvolvedor') return <img className={`badge-portrait badge-portrait-${type}`} src={`/media/badges/${type}.png`} alt="" draggable="false" decoding="async"/>;
  // A single foreground stays fixed; only the background opacity changes.
  return <span className="badge-developer-art">
    <img className={`badge-portrait badge-portrait-fallback${foregroundReady ? ' is-hidden' : ''}`} src="/media/badges/desenvolvedor.png" alt="" draggable="false" decoding="async"/>
    <img className={`badge-portrait badge-portrait-background${alternateReady && foregroundReady ? ' is-ready' : ''}`}
      src="/media/badges/desenvolvedor-background.png" alt="" draggable="false" decoding="async"
      onLoad={() => setAlternateReady(true)} onError={() => setAlternateReady(false)}/>
    <img className={`badge-portrait badge-portrait-foreground${foregroundReady ? ' is-ready' : ''}`}
      src="/media/badges/desenvolvedor-foreground.png" alt="" draggable="false" decoding="async"
      onLoad={() => setForegroundReady(true)} onError={() => setForegroundReady(false)}/>
  </span>;
}
function HangingBadge({ field, index, active, onActivate }) {
  const reduced = useReducedMotion();
  const ribbonId = useId().replace(/:/g, '');
  const lane = useRef(null);
  const length = useMotionValue(110);
  const travel = useRef(340);
  const [dragging, setDragging] = useState(false);
  const [touchPreview, setTouchPreview] = useState(false);
  const previewPointer = useRef(null), previewTimer = useRef(null);
  const finishTouchPreview = (event, linger = false) => {
    if (event && previewPointer.current !== event.pointerId) return;
    previewPointer.current = null;
    window.clearTimeout(previewTimer.current);
    if (linger) previewTimer.current = window.setTimeout(() => setTouchPreview(false), 1200);
    else setTouchPreview(false);
  };
  const drag = useRef(null), entered = useRef(0);
  const hover = useRef({ x: 0, y: 0 });
  const rest = [-5, 4, -3, 5][index];
  const xTarget = useMotionValue(0), yTarget = useMotionValue(0);
  const rollTarget = useMotionValue(rest), yawTarget = useMotionValue(0), pitchTarget = useMotionValue(0);
  // Follow the hand promptly; release into a softer, underdamped suspension.
  const spring = dragging ? { stiffness: 330, damping: 28, mass: .9 } : { stiffness: 46, damping: 5.8, mass: 1.25 };
  const x = useSpring(xTarget, spring), y = useSpring(yTarget, spring);
  const roll = useSpring(rollTarget, { stiffness: 52, damping: 6.5, mass: 1.4 });
  const yaw = useSpring(yawTarget, { stiffness: 65, damping: 8, mass: 1.2 });
  const pitch = useSpring(pitchTarget, { stiffness: 65, damping: 8, mass: 1.2 });
  const ribbon = useTransform([x, y, roll, length], ([dx, dy, angle, size]) => badgeRibbonPath(dx, dy, angle, size));
  const gesture = useRef(null);
  if (!gesture.current) gesture.current = createBadgeGesture(value => { drag.current = value; setDragging(Boolean(value)); });
  useEffect(() => {
    const measure = () => {
      length.set(parseFloat(getComputedStyle(lane.current).getPropertyValue('--strap-length')) || 110);
      travel.current = Math.min(340, window.innerWidth * .55);
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(lane.current);
    const cancel = () => { gesture.current.cancel(); hover.current = { x: 0, y: 0 }; finishTouchPreview(); };
    window.addEventListener('resize', measure);
    window.addEventListener('blur', cancel);
    return () => { observer.disconnect(); window.removeEventListener('resize', measure); window.removeEventListener('blur', cancel); window.clearTimeout(previewTimer.current); };
  }, [length]);
  useEffect(() => {
    if (!reduced) return;
    gesture.current.cancel();
    [xTarget, yTarget, rollTarget, yawTarget, pitchTarget].forEach(value => value.set(0));
    [x, y, roll, yaw, pitch].forEach(value => value.jump(0));
  }, [reduced, x, y, roll, yaw, pitch, xTarget, yTarget, rollTarget, yawTarget, pitchTarget]);
  useAnimationFrame(t => {
    if (document.hidden || reduced) return;
    if (!entered.current) entered.current = t;
    const elapsed = (t - entered.current) / 1000;
    const phase = elapsed * 1.45 + index * 1.7;
    const idle = Math.sin(phase);
    const body = drag.current ? badgeDragPose(drag.current.x, drag.current.y, travel.current) : null;
    xTarget.set(body ? body.x : idle * 13);
    yTarget.set(body ? body.y : Math.cos(phase * 2) * 3 - 3);
    rollTarget.set(body ? rest + body.roll : rest + idle * 6);
    yawTarget.set(body ? body.yaw : Math.sin(phase * .7) * 10 + hover.current.x * 12);
    pitchTarget.set(body ? body.pitch : hover.current.y * -9);
  });
  return <div ref={lane} className={`badge-lane badge-lane-${field.id}${active ? ' is-active' : ''}`} style={{ '--badge-order': index }}>
    <span className="badge-peg" aria-hidden="true"/>
    <svg className="badge-ribbon" aria-hidden="true">
      <defs><pattern id={`weave-${ribbonId}`} width="3" height="3" patternUnits="userSpaceOnUse"><path d="M0 0h3M0 1.5h3" stroke="white" strokeOpacity=".12" strokeWidth=".6"/></pattern></defs>
      <motion.path className="badge-ribbon-edge" d={ribbon}/>
      <motion.path className="badge-ribbon-fabric" d={ribbon}/>
      <motion.path className="badge-ribbon-weave" d={ribbon} stroke={`url(#weave-${ribbonId})`}/>
      <motion.path id={`ribbon-${ribbonId}`} className="badge-ribbon-stitch" d={ribbon}/>
      <text className="badge-ribbon-label"><textPath href={`#ribbon-${ribbonId}`} startOffset="12">MATHEUS / CRIATIVO</textPath></text>
    </svg>
    <div className="badge-suspension">
      <motion.div className="badge-body" style={{ x, y, rotate: roll }}>
        <Clasp/>
        <motion.a href={`#${field.id}`} className={`identity-badge${dragging ? ' is-dragging' : ''}${touchPreview ? ' is-touch-preview' : ''}`} style={{ rotateY: yaw, rotateX: pitch }}
          aria-label={`Explorar ${field.label}`} aria-describedby="badge-instructions"
          onPointerDown={e => {
            if (['desenvolvedor', 'fotografia'].includes(field.id) && e.pointerType !== 'mouse' && e.isPrimary !== false && e.button === 0) {
              window.clearTimeout(previewTimer.current);
              previewPointer.current = e.pointerId;
              setTouchPreview(true);
            }
            if (!reduced && gesture.current.down(e, { x: x.get(), y: y.get() })) {
              onActivate(index);
              e.currentTarget.setPointerCapture(e.pointerId);
            }
          }}
          onPointerMove={e => {
            if (gesture.current.move(e)) return;
            if (e.pointerType !== 'mouse') return;
            const box = e.currentTarget.getBoundingClientRect();
            hover.current = { x: (e.clientX - box.left) / box.width - .5, y: (e.clientY - box.top) / box.height - .5 };
          }}
          onPointerLeave={() => { hover.current = { x: 0, y: 0 }; }}
          onPointerUp={e => { gesture.current.up(e); finishTouchPreview(e, true); if (e.currentTarget.hasPointerCapture(e.pointerId)) e.currentTarget.releasePointerCapture(e.pointerId); }}
          onPointerCancel={e => { gesture.current.cancel(e); finishTouchPreview(e); }}
          onLostPointerCapture={e => { gesture.current.up(e); finishTouchPreview(e); }}
          onClick={e => { if (gesture.current.consumeClick(e)) e.preventDefault(); }}
          onDragStart={e => e.preventDefault()}>
          <div className="badge-slot" aria-hidden="true"/>
          <div className="badge-id-line"><span>MATHEUS / PORTFÓLIO</span><span>#{field.n}</span></div>
          <div className="badge-artwork" aria-hidden="true"><BadgeArtwork type={field.id}/></div>
          <div className="badge-title"><h3>{field.label}</h3><p>{field.verb}</p></div>
          <div className="badge-bottom"><span>{field.id === 'filmmaker' ? 'EXPLORAR FILMES' : 'EXPLORAR VERTENTE'}</span><span className="badge-open-arrow" aria-hidden="true"><SiteIcon name="arrow-up-right" /></span></div>
          <div className="badge-laminate" aria-hidden="true"/>
        </motion.a>
      </motion.div>
    </div>
  </div>;
}
export default function BadgeSelector({ fields }) {
  const reduced = useReducedMotion();
  const [active, setActive] = useState(null);
  return <section className="badge-section" id="vertentes" aria-label="Escolha uma das quatro vertentes">
    <div className="badge-stage">
      <span className="badge-backdrop-word" aria-hidden="true">Matheus<span><SiteIcon name="asterisk" /></span></span>
      <div className="badge-rack">{fields.map((field, i) => <HangingBadge key={field.id} field={field} index={i} active={active === i} onActivate={setActive}/>)}</div>
    </div>
    <div className="badge-instructions"><p id="badge-instructions"><span aria-hidden="true"><SiteIcon name="arrow-both" /></span> {reduced ? 'Escolha um crachá.' : 'Arraste para brincar. Toque para explorar.'}</p></div>
  </section>;
}
