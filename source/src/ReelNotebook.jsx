import SiteIcon from './SiteIcon.jsx';
import React, { useEffect, useRef } from 'react';
import './notebook.css';

export default function ReelNotebook({ reels, onOpen }) {
  return <article className="notebook-paper">
    <div className="notebook-binding" aria-hidden="true" />
    <header className="notebook-heading">
      <span className="notebook-kicker">EXPLORER / {reels.length} VÍDEOS</span>
      <h2 id="modal-title">Histórias que<br />eu contei<span aria-hidden="true"><SiteIcon name="asterisk" /></span></h2>
      <p>Escolha uma história e dê play.</p>
    </header>
    <ol className="notebook-list">
      {reels.map(reel => <li key={reel.id}>
        <a href={`#film-${reel.id}`} aria-label={`Assistir a ${reel.title}`}
          onClick={event => {
            if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
            event.preventDefault();
            onOpen(reel);
          }}>
          <span className="notebook-number">{reel.id}</span>
          <NotebookPreview reel={reel} />
          <strong>{reel.title}</strong>
          <span className="notebook-arrow" aria-hidden="true"><SiteIcon name="arrow-up-right" /></span>
        </a>
      </li>)}
    </ol>
    <p className="notebook-signoff">continua na próxima ideia… <span aria-hidden="true"><SiteIcon name="arrow-flow" /></span></p>
  </article>;
}

function NotebookPreview({ reel }) {
  const ref = useRef(null);
  useEffect(() => {
    const video = ref.current;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
    let visible = false;
    const sync = () => {
      if (visible && !document.hidden && !reduced.matches) video.play().catch(() => {});
      else video.pause();
    };
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible && !video.getAttribute('src')) video.src = reel.video;
      sync();
    }, { threshold: .4 });
    observer.observe(video);
    document.addEventListener('visibilitychange', sync);
    reduced.addEventListener('change', sync);
    return () => { observer.disconnect(); video.pause(); document.removeEventListener('visibilitychange', sync); reduced.removeEventListener('change', sync); };
  }, [reel.video]);
  return <span className="notebook-preview" aria-hidden="true"><video ref={ref} poster={reel.cover} muted loop playsInline preload="none" tabIndex={-1} /><span><SiteIcon name="play" /></span></span>;
}
