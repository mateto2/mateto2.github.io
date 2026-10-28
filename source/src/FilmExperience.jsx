import SiteIcon from './SiteIcon.jsx';
import SiteFooter from './SiteFooter.jsx';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { animate, useMotionValue, useSpring } from 'framer-motion';
import Loader from './Loader.jsx';
import BrandEntrance from './BrandEntrance.jsx';
import Wall from './Wall.jsx';
import DynamicIsland from './DynamicIsland.jsx';
import PatternBackdrop from './PatternBackdrop.jsx';
import InkSymbol from './InkSymbol.jsx';
import ReelNotebook from './ReelNotebook.jsx';
import { clamp, reelPose, sceneAt, recycleTurn, reelIndex, SLOTS } from './reelPose.js';
import { reelAngle } from './reel-ring.ts';
import { createReelEntrance } from './reel-entrance-controller.js';
import { createStyleWriter } from './reel-style-writer.ts';
import { createReelGesture } from './reel-gesture.js';
import { bindReelEscapes } from './reel-escapes.js';
import { CRITICAL_SLOTS, reels } from './reels.js';
import './styles.css';

const TOTAL = CRITICAL_SLOTS.length * 2 + 2;
const reducedInitially = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export default function FilmExperience() {
  const formation = useMotionValue(reducedInitially ? 1 : 0);
  const expansion = useMotionValue(reducedInitially ? 1 : 0);
  const targetAngle = useMotionValue(0);
  const angle = useSpring(targetAngle, { stiffness: 70, damping: 24, mass: 1 });
  const [painted, setPainted] = useState(reducedInitially);
  const [cleared, setCleared] = useState(reducedInitially);
  const [homeEntrance, setHomeEntrance] = useState(reducedInitially);
  const [progress, setProgress] = useState({ loaded: 0, failures: 0 });
  const [paused, setPaused] = useState(reducedInitially);
  const [modal, setModal] = useState(null);
  const [current, setCurrent] = useState('01');
  const app = useRef(null), ring = useRef(null), camera = useRef(null);
  const headerBrand = useRef(null), cards = useRef([]), dialog = useRef(null);
  const assets = useRef(new Map()), entranceController = useRef(null);
  const preludeComplete = useRef(reducedInitially);
  const homeStarted = useRef(reducedInitially), homeExpansionStart = useRef(0);
  const entrance = useRef(!reducedInitially), reduced = useRef(reducedInitially);
  const motionPaused = useRef(paused), modalActive = useRef(false);
  const drag = useRef(null), pointer = useRef({ x: -100, y: -100 });
  const hovering = useRef(null), lastInteraction = useRef(0);
  const cardFocused = useRef(false);
  const notebookScroll = useRef(0);
  const turns = useRef(Array.from({ length: SLOTS }, (_, s) => recycleTurn(s * 22.5, 0)));

  const onAsset = useCallback((key, ok) => {
    if (assets.current.get(key) === true || assets.current.get(key) === ok) return;
    assets.current.set(key, ok);
    const values = [...assets.current.values()];
    const loaded = values.filter(Boolean).length;
    setProgress({ loaded, failures: values.filter(v => !v).length });
    entranceController.current?.setAssetsReady(loaded >= TOTAL);
  }, []);

  const skip = useCallback(() => {
    entranceController.current?.skip();
  }, []);

  const finishPrelude = useCallback(() => {
    preludeComplete.current = true;
    entranceController.current?.completePrelude();
  }, []);

  useEffect(() => {
    const controller = createReelEntrance({
      formation,
      expansion,
      animate,
      reducedMotion: reduced.current,
      waitForPrelude: true,
      onHomeEntrance: () => {
        homeExpansionStart.current = expansion.get();
        homeStarted.current = true;
        setHomeEntrance(true);
      },
      onComplete: () => { entrance.current = false; setCleared(true); },
    });
    entranceController.current = controller;
    controller.start();
    if (preludeComplete.current) controller.completePrelude();
    // Cached media may have fired its event before this effect mounted.
    controller.setAssetsReady([...assets.current.values()].filter(Boolean).length >= TOTAL);
    return () => {
      controller.stop();
      entranceController.current = null;
    };
  }, [formation, expansion]);

  useEffect(() => { motionPaused.current = paused; }, [paused]);
  useEffect(() => { modalActive.current = Boolean(modal); }, [modal]);

  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    return bindReelEscapes({
      documentTarget: document,
      windowTarget: window,
      media,
      isEntering: () => entrance.current,
      skip,
      onReducedMotion: matches => {
        reduced.current = matches;
        if (matches) setPaused(true);
      },
    });
  }, [skip]);

  useEffect(() => {
    const setStyle = createStyleWriter();
    let raf, previous = performance.now(), frame = 0;
    const render = (now) => {
      const dt = Math.min((now - previous) / 1000, 0.05);
      previous = now;
      frame++;
      const f = formation.get(), e = expansion.get();
      if (!reduced.current && !motionPaused.current && !drag.current && !modalActive.current
          && !hovering.current && !cardFocused.current && now - lastInteraction.current > 1600 && !document.hidden) {
        targetAngle.set(targetAngle.get() + dt * (entrance.current ? 1.1 : 2.3));
      }
      const scene = sceneAt(e, angle.get());
      const root = app.current, cylinder = ring.current;
      setStyle(cylinder, '--radius', `${scene.radius.toFixed(3)}px`);
      setStyle(cylinder, '--tilt', `${scene.tilt.toFixed(3)}deg`);
      setStyle(cylinder, '--roll', `${scene.roll.toFixed(3)}deg`);
      setStyle(cylinder, '--card-scale', scene.scale.toFixed(4));
      setStyle(cylinder, '--backface', e < 0.5 ? 'visible' : 'hidden');
      setStyle(camera.current, 'perspective', `${scene.perspective.toFixed(3)}px`);
      const entranceFit = Math.min(1, camera.current.clientWidth / 1200);
      const compactHeader = camera.current.clientWidth <= 800;
      const finalFit = compactHeader ? 0.84 : 1;
      setStyle(camera.current, '--scene-fit', String(entranceFit + (finalFit - entranceFit) * e));
      setStyle(camera.current, '--scene-y', `${45 + e * (compactHeader ? 25 : 17)}%`);
      setStyle(root, '--reveal', String(clamp((e - 0.06) / 0.45)));
      const homeReveal = !homeStarted.current ? 0 : e >= 1 ? 1
        : clamp((e - homeExpansionStart.current) / Math.max(0.0001, 1 - homeExpansionStart.current));
      setStyle(root, '--home-reveal', String(homeReveal));
      setStyle(root, '--headline-y', `${(1 - homeReveal) * 36}px`);
      setStyle(root, '--backdrop', String(1 - clamp(e / 0.4)));


      let closest = null, distance = Infinity;
      cards.current.forEach((card, slot) => {
        if (!card) return;
        const pose = reelPose(reelAngle(slot, 0), f, scene);
        const rad = pose.yaw * Math.PI / 180;
        const facing = scene.radius + scene.perspective * Math.cos(rad) > 0;
        const visible = !pose.behindCamera && (facing || e < 0.5) && pose.appear > 0;
        // Geometry coefficients change with rotation/formation only. Radius and
        // scale are shared CSS variables, written once on the cylinder.
        setStyle(card, '--x', (pose.x / scene.radius).toFixed(6));
        setStyle(card, '--z', (pose.z / scene.radius).toFixed(6));
        setStyle(card, '--yaw', `${pose.yaw.toFixed(4)}deg`);
        setStyle(card, 'opacity', pose.appear.toFixed(3));
        setStyle(card, 'visibility', visible ? 'visible' : 'hidden');
        const usable = visible && e > 0.72;
        if (card.tabIndex !== (usable ? 0 : -1)) card.tabIndex = usable ? 0 : -1;
        if (card.getAttribute('aria-hidden') !== String(!usable)) card.setAttribute('aria-hidden', String(!usable));
        const turn = recycleTurn(slot * 22.5, scene.rotation);
        if (e === 1 && pose.behindCamera && turn !== turns.current[slot] && document.activeElement !== card) {
          card.assignReel(reelIndex(slot, turn - recycleTurn(slot * 22.5, 0), reels.length));
          turns.current[slot] = turn;
        }
        const video = card.querySelector('video');
        const projectedX = pose.x * scene.perspective / (scene.perspective - pose.z);
        const halfWidth = 135 * scene.scale * scene.perspective / (scene.perspective - pose.z);
        const onScreen = Math.abs(projectedX) - halfWidth < camera.current.clientWidth / 2;
        const shouldPlay = visible && facing && onScreen && e > 0.65 && !motionPaused.current && !reduced.current && !document.hidden && !modalActive.current;
        if (video && video.dataset.playing !== String(shouldPlay)) {
          video.dataset.playing = String(shouldPlay);
          if (shouldPlay) {
            video.play().then(() => { video.dataset.started = 'true'; }).catch(() => {});
          } else video.pause();
        }
        if (visible && Math.abs(pose.x) < distance) { distance = Math.abs(pose.x); closest = card.dataset.reel; }
      });
      if (frame % 3 === 0 && !entrance.current && !drag.current && !modalActive.current) {
        const hit = document.elementFromPoint(pointer.current.x, pointer.current.y)?.closest('.reel-card');
        if (hit !== hovering.current) {
          if (hovering.current) hovering.current.removeAttribute('data-hover');
          if (hit) hit.setAttribute('data-hover', 'true');
          hovering.current = hit ?? null;
        }
      }
      if (frame % 12 === 0 && closest) setCurrent(previous => previous === closest ? previous : closest);
      raf = requestAnimationFrame(render);
    };
    raf = requestAnimationFrame(render);
    return () => { cancelAnimationFrame(raf); };
  }, [formation, expansion, targetAngle, angle]);

  useEffect(() => {
    const gesture = createReelGesture({
      isBlocked: () => entrance.current || modalActive.current,
      onTurn: delta => targetAngle.set(targetAngle.get() + delta),
      onDragChange: active => {
        drag.current = active;
        if (active) app.current?.setAttribute('data-dragging', 'true');
        else app.current?.removeAttribute('data-dragging');
      },
      onInteraction: () => { lastInteraction.current = performance.now(); },
    });
    const down = (event) => {
      const target = event.target;
      if (!(target instanceof Element)) return;
      const withinPage = app.current?.contains(target);
      const excluded = target.closest('dialog, [data-island], input, textarea, select, [contenteditable="true"]');
      const inScene = target.closest('.scene-viewport');
      // Touch can begin over the header, headline, controls, or footer.
      // Desktop mouse dragging remains confined to the wall.
      gesture.down(event, withinPage && !excluded && (event.pointerType === 'touch' || Boolean(inScene)));
    };
    const move = (event) => {
      pointer.current = { x: event.clientX, y: event.clientY };
      gesture.move(event);
    };
    const up = event => gesture.up(event);
    const cancel = event => gesture.cancel(event);
    const blur = () => gesture.cancel();
    const click = (event) => {
      if (!gesture.consumeClick(event)) return;
      event.preventDefault();
      event.stopPropagation();
    };
    const nativeDrag = event => {
      if (event.target instanceof Element && event.target.closest('.reel-card')) event.preventDefault();
    };
    const leave = () => {
      pointer.current = { x: -100, y: -100 };
      hovering.current?.removeAttribute('data-hover');
      hovering.current = null;
    };
    const wheel = (event) => {
      if (entrance.current || modalActive.current || event.ctrlKey) return;
      event.preventDefault();
      const delta = Math.abs(event.deltaX) > Math.abs(event.deltaY) ? event.deltaX : event.deltaY;
      const units = event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? window.innerHeight : 1;
      targetAngle.set(targetAngle.get() + clamp(delta * units, -180, 180) * 0.055);
      lastInteraction.current = performance.now();
    };
    window.addEventListener('pointerdown', down, true);
    window.addEventListener('pointermove', move);
    window.addEventListener('pointerup', up);
    window.addEventListener('pointercancel', cancel);
    window.addEventListener('blur', blur);
    window.addEventListener('click', click, true);
    window.addEventListener('dragstart', nativeDrag);
    document.addEventListener('pointerleave', leave);
    camera.current.addEventListener('wheel', wheel, { passive: false });
    const el = camera.current;
    return () => {
      gesture.cancel();
      window.removeEventListener('pointerdown', down, true);
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerup', up);
      window.removeEventListener('pointercancel', cancel);
      window.removeEventListener('blur', blur);
      window.removeEventListener('click', click, true);
      window.removeEventListener('dragstart', nativeDrag);
      document.removeEventListener('pointerleave', leave);
      el.removeEventListener('wheel', wheel);
    };
  }, [targetAngle]);

  useEffect(() => {
    if (modal && dialog.current && !dialog.current.open) dialog.current.showModal();
    if (!modal && dialog.current?.open) dialog.current.close();
    if (modal && dialog.current) dialog.current.scrollTop = modal.type === 'index' ? notebookScroll.current : 0;
  }, [modal]);

  const turn = (degrees) => {
    targetAngle.set(targetAngle.get() + degrees);
    lastInteraction.current = performance.now();
  };
  const openReel = useCallback((event, reel) => {
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    if (entrance.current) return;
    setModal({ type: 'film', reel });
  }, []);
  useEffect(() => {
    const openHash = () => {
      const match = window.location.hash.match(/^#film-(\d+)$/);
      if (match) {
        const reel = reels.find(r => r.id === match[1]);
        if (reel) { skip(); setModal({ type: 'film', reel }); }
      }
    };
    openHash();
    window.addEventListener('hashchange', openHash);
    return () => window.removeEventListener('hashchange', openHash);
  }, [skip]);

  return (
    <div className="film-page">
    <main className={`app${cleared ? ' is-ready' : ''}${homeEntrance ? ' is-home-entering' : ''}`} ref={app}
      onFocus={event => { cardFocused.current = Boolean(event.target.closest('.reel-card')); }}
      onBlur={() => { cardFocused.current = false; }}
      style={reducedInitially ? { '--reveal': 1, '--home-reveal': 1, '--backdrop': 0 } : undefined}>
      <div className="page-grain" />
      <div className="entrance-backdrop" aria-hidden="true" />
      <PatternBackdrop cleared={cleared} reducedMotion={reducedInitially} onComplete={() => setPainted(true)} onAsset={onAsset} />
      <div className="page-bands" aria-hidden="true" />
      <header className="header home-reveal">
        <a className="film-home-link" href="#inicio" aria-label="Voltar às vertentes"><SiteIcon name="arrow-left" /> Todas as vertentes</a>
        <span ref={headerBrand} className="header-wordmark wordmark" aria-hidden="true"><i className="brand-avatar"><img src="/media/matheus-avatar.png" alt="" /></i>Matheus</span>
        <DynamicIsland enabled={cleared} onNavigate={type => setModal({ type })} />
      </header>
      <BrandEntrance targetRef={headerBrand} painted={painted} instant={cleared} onDock={finishPrelude} onAsset={onAsset} />
      <section className="hero-copy home-reveal" aria-labelledby="hero-title" aria-hidden={!homeEntrance}>
        <div className="eyebrow mono painted-note"><InkSymbol /><span className="marker-type">VÍDEOS INDEPENDENTES, INFINITAS POSSIBILIDADES.</span></div>
        <h1 id="hero-title"><span className="headline-stroke"><span className="marker-type">Tudo é</span></span><br /><span className="headline-stroke"><span className="marker-type">perspectiva.</span></span></h1>
        <p className="painted-note"><InkSymbol kind="film" /><span className="marker-type">Coleção de histórias gravadas por mim.<br />Veja a que mais se assemelha com você.</span></p>
      </section>
      <Wall ringRef={ring} cameraRef={camera} cardRefs={cards} onAsset={onAsset} onOpen={openReel}
        onKeyDown={(event) => {
          if (entrance.current) return;
          if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
            event.preventDefault();
            turn(event.key === 'ArrowLeft' ? -22.5 : 22.5);
          }
        }} />
      <div className="wall-controls reveal" inert={!cleared}>
        <div className="collection-label painted-note"><InkSymbol kind="film" /><div><span className="mono marker-type">THE MOVING COLLECTION</span><span className="collection-count marker-type">{current}<i> / {reels.length}</i></span></div></div>
        <div className="drag-hint mono painted-note"><InkSymbol kind="arrow" /><span className="marker-type">DRAG TO CHANGE YOUR VIEW</span></div>
        <div className="control-buttons">
          <button aria-label="Previous reel" onClick={() => turn(-22.5)}><SiteIcon name="arrow-left" /></button>
          <button className="pause-button" aria-label={paused ? 'Play motion' : 'Pause motion'} onClick={() => setPaused(v => !v)}><SiteIcon name={paused ? 'play' : 'pause'} /></button>
          <button aria-label="Next reel" onClick={() => turn(22.5)}><SiteIcon name="arrow-right" /></button>
        </div>
      </div>
      <div className="footer reveal">
        <span className="mono">A LITTLE CURIOSITY GOES A LONG WAY.</span>
        <span className="footer-center">Stay open. Keep looking.</span>
        <button className="mono text-button" onClick={() => setModal({ type: 'about' })} inert={!cleared}>BEHIND THE FRAMES <SiteIcon name="arrow-up-right" /></button>
      </div>
      <Loader loaded={progress.loaded} failures={progress.failures} total={TOTAL} cleared={cleared} onSkip={skip} expansion={expansion} />
      <dialog ref={dialog} aria-labelledby="modal-title" className={`modal ${modal?.type === 'film' ? 'film-modal' : modal?.type === 'index' ? 'notebook-modal' : ''}`} onCancel={() => setModal(null)}
        onClick={(event) => { if (event.target === dialog.current) setModal(null); }} onClose={() => setModal(null)}>
        {modal && <div className="modal-content">
          <button className="modal-close" onClick={() => setModal(null)} aria-label="Close dialog" autoFocus><SiteIcon name="close" /></button>
          {modal.type === 'film' ? <>
            {modal.from === 'index' && <button className="notebook-return" onClick={() => setModal({ type: 'index' })}><SiteIcon name="arrow-left" /> Voltar ao caderno</button>}
            <span className="mono">{modal.reel.category}</span>
            <h2 id="modal-title">{modal.reel.title}</h2>
            <video src={modal.reel.fullVideo ?? modal.reel.video} poster={modal.reel.cover} controls autoPlay playsInline muted loop />
            <p className="credit">{modal.reel.credit}</p>
          </> : modal.type === 'index' ? <ReelNotebook reels={reels} onOpen={reel => {
            notebookScroll.current = dialog.current?.scrollTop ?? 0;
            setModal({ type: 'film', reel, from: 'index' });
          }} /> : <>
            <span className="mono">A NEW POINT OF VIEW</span>
            <h2 id="modal-title">Stay curious.<br />See differently.</h2>
            <p>Matheus is an experimental collection of moving images. A space to slow down, look around, and discover beauty in another direction.</p>
            <p>Drag the wall, scroll, or use the arrow controls. Open a frame to watch. The motion can always be paused.</p>
            <div className="about-detail mono">AN INTERACTIVE DEMO · REACT + MOTION<br />CSS 3D · NO WEBGL<br />COVERS: UNSPLASH · PREVIEWS: MIXKIT</div>
          </>}
        </div>}
      </dialog>
    </main>
    <SiteFooter />
    </div>
  );
}


