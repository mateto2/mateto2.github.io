import SiteIcon from './SiteIcon.jsx';
import React, { useEffect, useRef, useState } from 'react';
import { useReducedMotion } from 'framer-motion';
import { designSpreads } from './design-collection.js';
import './design-sketchbook.css';

const number = value => String(value).padStart(2, '0');

function Page({ spread, side, index }) {
  const panoramic = spread.layout === 'spread';
  const item = panoramic ? spread.image : spread[side];
  return <div className={`sketch-page sketch-page-${side}${panoramic ? ' sketch-page-panorama' : ''}`}>
    <div className="sketch-page-heading"><span>MATHEUS / ESTUDOS VISUAIS</span><span>{panoramic ? 'PÁGINA DUPLA' : 'DESIGN GRÁFICO'}</span></div>
    <div className="sketch-art-window">
      {item && <img className="sketch-art" src={item.src} alt={panoramic && side === 'right' ? '' : item.alt} draggable="false" decoding="async" />}
      {!panoramic && item && <span className="sketch-tape" aria-hidden="true" />}
    </div>
    <div className="sketch-page-caption"><span>{item?.title || 'Mais ideias em breve'}<small>{item?.category || 'CONTINUA…'}</small></span><span className="sketch-page-number">{number(index * 2 + (side === 'left' ? 1 : 2))}</span></div>
  </div>;
}

export default function DesignSketchbook() {
  const [index, setIndex] = useState(0);
  const [turn, setTurn] = useState(null);
  const reducedMotion = useReducedMotion();
  const lock = useRef(false);
  const gesture = useRef(null);
  const book = useRef(null);
  const active = designSpreads[index];
  const last = designSpreads.length - 1;

  function goTo(target) {
    if (lock.current || target === index || target < 0 || target > last) return;
    if (reducedMotion) { setIndex(target); return; }
    lock.current = true;
    setTurn({ from: index, to: target, direction: target > index ? 'next' : 'previous' });
  }

  // A fallback finishes the turn even if animationend is interrupted by a tab change.
  useEffect(() => {
    if (!turn) return;
    const timeout = window.setTimeout(finishTurn, reducedMotion ? 0 : 1000);
    return () => window.clearTimeout(timeout);
  }, [turn, reducedMotion]);

  // Warm only the adjacent artwork, keeping the other portfolio sections lightweight.
  useEffect(() => {
    for (const spread of designSpreads.slice(Math.max(0, index - 1), index + 2)) {
      for (const item of spread.layout === 'spread' ? [spread.image] : [spread.left, spread.right]) {
        if (item) { const image = new Image(); image.src = item.src; }
      }
    }
  }, [index]);

  function finishTurn() {
    if (!turn) return;
    setIndex(turn.to);
    setTurn(null);
    lock.current = false;
  }

  function onKeyDown(event) {
    if (event.altKey || event.ctrlKey || event.metaKey || event.target.closest('button, a')) return;
    const target = { ArrowRight: index + 1, ArrowLeft: index - 1, Home: 0, End: last }[event.key];
    if (target !== undefined) { event.preventDefault(); goTo(target); }
  }

  function pointerDown(event) {
    if (!event.isPrimary || event.button !== 0 || lock.current) return;
    gesture.current = { id: event.pointerId, x: event.clientX, y: event.clientY };
    event.currentTarget.setPointerCapture(event.pointerId);
  }

  function pointerUp(event) {
    const start = gesture.current;
    gesture.current = null;
    if (!start || start.id !== event.pointerId) return;
    const dx = event.clientX - start.x;
    const dy = event.clientY - start.y;
    if (Math.abs(dx) > 38 && Math.abs(dx) > Math.abs(dy) * 1.3) goTo(index + (dx < 0 ? 1 : -1));
    else if (Math.abs(dx) < 8 && Math.abs(dy) < 8) {
      const bounds = book.current.getBoundingClientRect();
      goTo(index + (event.clientX < bounds.left + bounds.width / 2 ? -1 : 1));
    }
  }

  const leftIndex = turn?.direction === 'previous' ? turn.to : index;
  const rightIndex = turn?.direction === 'next' ? turn.to : index;

  return <section className="design-sketchbook" aria-label="Projetos de design" onKeyDown={onKeyDown}>
    <section className="sketch-gallery" aria-label="Sketchbook de design gráfico" aria-roledescription="carrossel">
      <div className="sketch-stage">
        <span className="sketch-margin-note" aria-hidden="true">cor, forma & outras ideias</span>
        <button className="sketch-arrow sketch-arrow-prev" aria-label="Páginas anteriores" disabled={index === 0 || !!turn} onClick={() => goTo(index - 1)}><svg viewBox="0 0 32 48" aria-hidden="true"><path d="M25 5 8 24l17 19" /></svg></button>
        <div className="sketch-book" ref={book} tabIndex={0} role="group" aria-label={`Livro, páginas ${index * 2 + 1} e ${index * 2 + 2}. Use as setas do teclado para folhear.`} aria-describedby="sketch-instructions" aria-busy={!!turn} onPointerDown={pointerDown} onPointerUp={pointerUp} onPointerCancel={() => { gesture.current = null; }} onLostPointerCapture={() => { gesture.current = null; }}>
          <div className="sketch-cover" aria-hidden="true" />
          <div className="sketch-paper-stack" aria-hidden="true" />
          <div className="sketch-open-pages" aria-hidden={!!turn || undefined}>
            <Page spread={designSpreads[leftIndex]} side="left" index={leftIndex} />
            <Page spread={designSpreads[rightIndex]} side="right" index={rightIndex} />
          </div>
          <div className="sketch-spine" aria-hidden="true" />
          {turn && <div key={`${turn.from}-${turn.to}`} className={`sketch-turn sketch-turn-${turn.direction}`} aria-hidden="true" onAnimationEnd={event => { if (event.target === event.currentTarget) finishTurn(); }}>
            <div className="sketch-turn-front"><Page spread={active} side={turn.direction === 'next' ? 'right' : 'left'} index={index} /></div>
            <div className="sketch-turn-back"><Page spread={designSpreads[turn.to]} side={turn.direction === 'next' ? 'left' : 'right'} index={turn.to} /></div>
          </div>}
        </div>
        <button className="sketch-arrow sketch-arrow-next" aria-label="Próximas páginas" disabled={index === last || !!turn} onClick={() => goTo(index + 1)}><svg viewBox="0 0 32 48" aria-hidden="true"><path d="m7 5 17 19L7 43" /></svg></button>
        <span className="sketch-edition" aria-hidden="true">VOL. 01<br/>EM CONSTANTE<br/>CONSTRUÇÃO</span>
      </div>
      <div className="sketch-caption" aria-live="polite" aria-atomic="true"><span>{number(index + 1)} <i>/ {number(designSpreads.length)}</i></span><p>{active.title}</p><span>{active.layout === 'spread' ? 'PÁGINA DUPLA' : 'PÁGINAS INDIVIDUAIS'}</span></div>
      <nav className="sketch-pagination" aria-label="Escolher páginas">{designSpreads.map((spread, i) => <button key={spread.id} aria-label={`Abrir páginas ${i * 2 + 1} e ${i * 2 + 2}: ${spread.title}`} aria-current={index === i ? 'true' : undefined} disabled={!!turn} onClick={() => goTo(i)}><span /></button>)}</nav>
      <p className="sketch-instructions" id="sketch-instructions">Clique nas páginas, use as setas ou deslize para folhear.</p>
    </section>
    <div className="design-colophon"><span className="design-colophon-star" aria-hidden="true"><SiteIcon name="asterisk" /></span><p>Um espaço para experimentar.<span>10 artes de exemplo. Em breve, novas histórias visuais.</span></p><span className="design-colophon-label">SKETCHBOOK / EDIÇÃO DEMO</span></div>
  </section>;
}
