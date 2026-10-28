import React, { useEffect, useRef } from 'react';
import { motion, useMotionValue, useReducedMotion, useSpring } from 'framer-motion';
import './dynamic-island.css';

function Eyes({ quiet }) {
  const x = useMotionValue(0), y = useMotionValue(0);
  const pupilX = useSpring(x, { stiffness: 180, damping: 20 });
  const pupilY = useSpring(y, { stiffness: 180, damping: 20 });
  const eyes = useRef(null);
  useEffect(() => {
    if (quiet) return;
    let frame = 0;
    let pointer = null;
    const update = () => {
      frame = 0;
      const rect = eyes.current?.getBoundingClientRect();
      if (!rect || !pointer) return;
      const dx = pointer.x - rect.left - rect.width / 2;
      const dy = pointer.y - rect.top - rect.height / 2;
      const direction = Math.atan2(dy, dx);
      const reach = Math.min(1, Math.hypot(dx, dy) / 100);
      x.set(Math.cos(direction) * 3.8 * reach);
      y.set(Math.sin(direction) * 3 * reach);
    };
    const look = event => {
      if (event.pointerType === 'touch') return;
      pointer = { x: event.clientX, y: event.clientY };
      if (!frame) frame = requestAnimationFrame(update);
    };
    const reset = () => { cancelAnimationFrame(frame); frame = 0; pointer = null; x.set(0); y.set(0); };
    window.addEventListener('pointermove', look);
    document.addEventListener('pointerleave', reset);
    window.addEventListener('blur', reset);
    return () => {
      reset();
      window.removeEventListener('pointermove', look);
      document.removeEventListener('pointerleave', reset);
      window.removeEventListener('blur', reset);
    };
  }, [quiet, x, y]);
  return <svg ref={eyes} viewBox="0 0 42 32" aria-hidden="true">
    <motion.g variants={quiet ? {} : { rest: { scaleY: 1 }, active: { scaleY: [1, .15, 1], transition: { duration: .38 } } }} style={{ transformOrigin: '21px 16px' }}>
      <path className="island-eye-white" d="M19 17c0 8-3 12-8 11S3 22 4 14 8 3 13 4s7 5 6 13ZM38 15c1 8-2 13-7 13s-8-4-8-12S26 3 31 3s7 5 7 12Z" />
      <motion.g className="island-pupils" style={{ x: pupilX, y: pupilY }}>
        <ellipse cx="12" cy="17" rx="2.6" ry="4.3" fill="currentColor" stroke="none" />
        <ellipse cx="31" cy="16" rx="2.6" ry="4.3" fill="currentColor" stroke="none" />
      </motion.g>
    </motion.g>
  </svg>;
}

function Icon({ kind, quiet }) {
  if (kind === 'eyes') return <Eyes quiet={quiet} />;
  if (kind === 'pencil') return <svg viewBox="0 0 40 40" aria-hidden="true">
    <motion.g style={{ transformOrigin: '12px 29px' }} variants={quiet ? {} : { rest: { rotate: 0, x: 0 }, active: { rotate: [0, -12, 6, -7, 0], x: [0, 2, -1, 2, 0], transition: { duration: .7 } } }}>
      <path d="m9 29 3-10L28 3l9 9-16 16-12 1ZM12 19l9 9M25 6l9 9M9 29l-3 5 6-2"/>
    </motion.g>
    <motion.path d="M15 34c5-4 5 4 10 0s7 2 10-1" variants={quiet ? {} : { rest: { pathLength: .35, opacity: .6 }, active: { pathLength: 1, opacity: 1, transition: { duration: .7 } } }}/>
  </svg>;
  if (kind === 'message') return <svg viewBox="0 0 40 40" aria-hidden="true">
    <motion.g style={{ transformOrigin: '20px 20px' }} variants={quiet ? {} : { rest: { y: 0, rotate: 0 }, active: { y: [0, -3, 0], rotate: [0, -7, 4, 0], transition: { duration: .6 } } }}>
      <path d="M7 7h26q3 0 3 4v15q0 4-4 4H17l-9 6v-6H7q-4 0-4-4V11q0-4 4-4Z"/>
      {[12, 20, 28].map((x, i) => <motion.circle key={x} cx={x} cy="19" r="1.5" fill="currentColor" stroke="none" variants={quiet ? {} : { rest: { opacity: .7 }, active: { opacity: [.3, 1, .7], transition: { duration: .5, delay: i * .1 } } }}/>) }
    </motion.g>
  </svg>;
  return <svg viewBox="0 0 40 40" aria-hidden="true">
    {kind === 'hammer' ? <motion.g style={{ transformOrigin: '28px 31px' }}
      variants={quiet ? {} : { rest: { rotate: 0 }, active: { rotate: [0, -28, 13, -12, 0], transition: { duration: .7 } } }}>
      <path d="m16 18 6-5 13 18q2 3-1 5t-5-1ZM8 8l6-4 5 5 5-1 5 7-5 4-6-4-6 5-5-6-4 2-2-4Z" />
      <path d="m6 27-3 3m10-5-1 5M3 22H0" />
    </motion.g> : <>
      <path d="M20 4C10 3 3 11 4 21s8 16 18 15 15-9 14-18S29 4 20 4ZM19 6v3m13 10h-3M20 31v3M6 20h3" />
      <motion.g style={{ transformOrigin: '20px 20px' }}
        variants={quiet ? {} : { rest: { rotate: -25 }, active: { rotate: [-25, 155, 345, 335], transition: { duration: 1, ease: [.25, .8, .3, 1] } } }}>
        <path d="m20 10 5 11-5 9-5-10Z" />
        <path d="m20 10 5 11-5-2Z" fill="currentColor" />
      </motion.g>
    </>}
  </svg>;
}

function Letters({ children, quiet }) {
  return <span className="island-letters" aria-hidden="true">{[...children].map((letter, i) =>
    <motion.span key={i} variants={quiet ? {} : {
      rest: { y: 0, rotate: 0 },
      active: { y: [0, -5, 1, 0], rotate: [0, i % 2 ? 8 : -8, 0], transition: { duration: .48, delay: i * .035 } },
    }}>{letter}</motion.span>
  )}</span>;
}

export default function DynamicIsland({ enabled, onNavigate, items = [['Work', 'hammer', null], ['About', 'eyes', 'about'], ['Explorer', 'compass', 'index']], current, label = 'Matheus navigation' }) {
  const quiet = useReducedMotion();
  return <div className="island-anchor" data-island="" inert={!enabled}>
    <nav className="dynamic-island" aria-label={label}>
      <div className="island-links">
        {items.map(([label, icon, destination]) =>
          <motion.button key={label} className="island-action"
            aria-label={label} aria-current={current === destination ? 'page' : undefined} aria-disabled={!destination} tabIndex={destination ? 0 : -1}
            initial="rest" animate="rest" whileHover="active" whileFocus="active"
            whileTap={!destination || quiet ? undefined : 'active'} onClick={destination ? () => onNavigate(destination) : undefined}>
            <Icon kind={icon} quiet={quiet} /><Letters quiet={quiet}>{label}</Letters>
          </motion.button>
        )}
      </div>
    </nav>
  </div>;
}
