import React, { useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import './portfolio-home.css';

const fields = [
  { id: 'filmmaker', n: '01', label: 'Filmmaker', verb: 'Histórias em movimento.', text: 'Um olhar atento. Um novo enquadramento. Histórias que ganham vida em vídeo.', meta: 'EXPLORAR FILMES', icon: 'film' },
  { id: 'designer', n: '02', label: 'Designer', verb: 'Ideias que ganham forma.', text: 'Cor, composição e personalidade. Um espaço para explorar minha linguagem visual.', meta: 'CONHECER A VERTENTE', icon: 'design' },
  { id: 'desenvolvedor', n: '03', label: 'Desenvolvedor', verb: 'Experiências que acontecem.', text: 'Do primeiro esboço à interação. Ideias transformadas em experiências digitais.', meta: 'CONHECER A VERTENTE', icon: 'code' },
];
function Sketch({ kind }) {
  return <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    {kind === 'film' ? <><path d="m10 24 39-3 3 30-40 2Z M10 24 35-16 6 12-39 4Z M19 10l6 12m6-15 6 13m6-15 5 13" /><path d="m28 31 12 7-11 8Z" /></> : kind === 'design' ? <><path d="m14 48 3-15L43 7l12 12-27 27-14 2Z M17 33l11 13 M39 11l12 12 M14 48l-4 7 14-3"/><path d="M8 13h11m-6-6v12m33 23 3 7 8 1-7 5-1 8-4-8-8-2 8-3Z"/></> : <><path d="m23 17-15 15 16 14m18-29 15 15-16 14M37 9 28 54"/><path d="M6 58q27-4 52 0"/></>}
  </svg>;
}
export default function PortfolioHome({ route }) {
  const reduced = useReducedMotion();
  const [active, setActive] = useState('filmmaker');
  const detail = fields.find(f => f.id === route && f.id !== 'filmmaker');
  return <div className="portfolio-hub">
    <header className="hub-header">
      <a href="#inicio" className="hub-logo" aria-label="Matheus, início">m<span>✳</span></a>
      <span className="hub-header-note">UM OLHAR. MUITAS POSSIBILIDADES.</span>
      <a href="#vertentes" className="hub-menu">Explorar meu universo <span>↗</span></a>
    </header>
    {detail ? <main className="hub-detail">
      <a href="#inicio" className="hub-back">← Todas as vertentes</a>
      <div className="hub-detail-icon"><Sketch kind={detail.icon}/></div>
      <span className="hub-kicker">VERTENTE {detail.n} / MATHEUS</span>
      <h1>{detail.label}<span className="hub-red">.</span></h1>
      <h2>{detail.verb}</h2><p>{detail.text}</p>
      <div className="hub-coming"><span className="hub-dot"/> Um novo capítulo em construção<span>Os projetos desta área chegam em breve.</span></div>
      <a className="hub-primary" href="#filmmaker">Enquanto isso, explore meus filmes <span>↗</span></a>
    </main> : <main>
      <section className="hub-hero" aria-labelledby="hub-title">
        <div className="hub-hero-copy">
          <motion.div initial={reduced ? false : {opacity:0,y:16}} animate={{opacity:1,y:0}} transition={{duration:.55}}>
            <p className="hub-kicker"><span className="hub-dot"/> PORTFÓLIO CRIATIVO / MATHEUS</p>
            <h1 id="hub-title">Uma ideia.<br/><span className="hub-underlined">Vários caminhos<svg viewBox="0 0 600 25" preserveAspectRatio="none" aria-hidden="true"><path d="M5 16 Q250 -2 594 10 M36 23 Q300 5 565 16"/></svg></span><span className="hub-red">.</span></h1>
            <p className="hub-intro">Filmo histórias, desenho possibilidades<br className="hub-desktop-break"/> e desenvolvo novas formas de conectar tudo isso.</p>
            <a href="#vertentes" className="hub-primary">Escolha por onde começar <span>↓</span></a>
          </motion.div>
          <span className="hub-margin-note">Criar é não caber em uma coisa só.</span>
        </div>
        <motion.div className={`hub-art hub-art-${active}`} initial={reduced ? false : {opacity:0,scale:.92,rotate:-3}} animate={{opacity:1,scale:1,rotate:0}} transition={{duration:.8,ease:[.2,.8,.2,1]}} aria-hidden="true">
          <div className="hub-orbit"/><span className="hub-art-star">✳</span>
          <div className="hub-mini-film"><img src="/media/portfolio/01.jpg" alt=""/><span>REC <i/> 00:01</span></div>
          <div className="hub-swatches"><span/><span/><span/><small>MINHA PALETA ↗</small></div>
          <div className="hub-code-sticker">&lt;ideia /&gt;<span>feito para acontecer.</span></div>
          <div className="hub-portrait"><img src="/media/matheus-avatar.png" alt="" fetchPriority="high"/></div>
          <span className="hub-hi">oi, eu sou o Matheus!<svg viewBox="0 0 130 60"><path d="M5 8q100-10 104 42m-17-12 17 12 12-18"/></svg></span>
          <span className="hub-art-caption">IMAGEM + FORMA + INTERAÇÃO</span>
        </motion.div>
      </section>
      <section className="hub-fields" id="vertentes" aria-labelledby="fields-title">
        <div className="hub-fields-heading"><h2 id="fields-title">Três formas de contar a mesma inquietação.</h2><span>ESCOLHA UMA VERTENTE ↙</span></div>
        <div className="hub-field-grid">{fields.map(field => <a className={`hub-field hub-field-${field.id}`} href={`#${field.id}`} key={field.id} onMouseEnter={() => setActive(field.id)} onFocus={() => setActive(field.id)}>
          <div className="hub-field-top"><span>{field.n} /</span><Sketch kind={field.icon}/><span className="hub-field-arrow">↗</span></div>
          <h3>{field.label}</h3><p>{field.verb}</p><span className="hub-field-meta">{field.meta}<span>{field.id === 'filmmaker' ? 'PLAY' : 'EM CONSTRUÇÃO'}</span></span>
        </a>)}</div>
      </section>
    </main>}
    <footer className="hub-footer"><span>MATHEUS © {new Date().getFullYear()}</span><span>Feito de curiosidade. E um pouco de tinta.</span><a href="#inicio">Tudo é perspectiva. ↗</a></footer>
  </div>;
}
