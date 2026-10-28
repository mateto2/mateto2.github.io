import SiteIcon from './SiteIcon.jsx';
import React from 'react';
import BadgeSelector from './BadgeSelector.jsx';
import DesignSketchbook from './DesignSketchbook.jsx';
import './portfolio-home.css';

export const fields = [
  { id: 'filmmaker', n: '01', label: 'Filmmaker', verb: 'Histórias em movimento.', text: 'Um olhar atento. Um novo enquadramento. Histórias que ganham vida em vídeo.', meta: 'EXPLORAR FILMES', icon: 'film' },
  { id: 'designer', n: '02', label: 'Designer', verb: 'Ideias que ganham forma.', text: 'Cor, composição e personalidade. Um espaço para explorar minha linguagem visual.', meta: 'CONHECER A VERTENTE', icon: 'design' },
  { id: 'desenvolvedor', n: '03', label: 'Desenvolvedor', verb: 'Experiências que acontecem.', text: 'Do primeiro esboço à interação. Ideias transformadas em experiências digitais.', meta: 'CONHECER A VERTENTE', icon: 'code' },
  { id: 'fotografia', n: '04', label: 'Fotografia', verb: 'Instantes que ficam.', text: 'Luz, composição e tempo. Um espaço para os detalhes e as histórias que cabem em uma imagem.', meta: 'CONHECER A VERTENTE', icon: 'photo' },
];
function Sketch({ kind }) {
  return <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    {kind === 'film' ? <><path d="m10 24 39-3 3 30-40 2Z M10 24 35-16 6 12-39 4Z M19 10l6 12m6-15 6 13m6-15 5 13" /><path d="m28 31 12 7-11 8Z" /></> : kind === 'design' ? <><path d="m14 48 3-15L43 7l12 12-27 27-14 2Z M17 33l11 13 M39 11l12 12 M14 48l-4 7 14-3"/><path d="M8 13h11m-6-6v12m33 23 3 7 8 1-7 5-1 8-4-8-8-2 8-3Z"/></> : kind === 'photo' ? <><path d="M8 20h12l5-8h16l5 8h10v33H8Z"/><circle cx="32" cy="35" r="11"/><path d="M47 26h3"/></> : <><path d="m23 17-15 15 16 14m18-29 15 15-16 14M37 9 28 54"/><path d="M6 58q27-4 52 0"/></>}
  </svg>;
}
export default function PortfolioHome({ route }) {
  const detail = fields.find(f => f.id === route && f.id !== 'filmmaker');
  return <div className="portfolio-hub badge-hub">
    <header className="hub-header">
      <a href="#inicio" className="hub-logo" aria-label="Matheus, início">m<span><SiteIcon name="asterisk" /></span></a>
      <span className="hub-header-note">UM OLHAR. MUITAS POSSIBILIDADES.</span>
      <a href="#vertentes" className="hub-menu">Explorar meu universo <span><SiteIcon name="arrow-up-right" /></span></a>
    </header>
    {route === 'designer' ? <DesignSketchbook /> : detail ? <main className="hub-detail">
      <a href="#inicio" className="hub-back"><SiteIcon name="arrow-left" /> Todas as vertentes</a>
      <div className="hub-detail-icon"><Sketch kind={detail.icon}/></div>
      <span className="hub-kicker">VERTENTE {detail.n} / MATHEUS</span>
      <h1>{detail.label}<span className="hub-red">.</span></h1>
      <h2>{detail.verb}</h2><p>{detail.text}</p>
      <div className="hub-coming"><span className="hub-dot"/> Um novo capítulo em construção<span>Os projetos desta área chegam em breve.</span></div>
      <a className="hub-primary" href="#filmmaker">Enquanto isso, explore meus filmes <span><SiteIcon name="arrow-up-right" /></span></a>
    </main> : <main className="badge-home">
      <section className="badge-hero-heading" aria-labelledby="hub-title">
        <div><p className="hub-kicker"><span className="hub-dot"/> MATHEUS / CRIATIVO EM MOVIMENTO</p>
          <h1 id="hub-title">Um olhar.<br/><span>Várias formas de criar.</span></h1></div>
        <div className="badge-hero-note"><p>Entre filmes, design, código e fotografia.<br/>Escolha um crachá e conheça um lado do meu trabalho.</p><span>Não cabe tudo em um título. Ainda bem. <SiteIcon name="arrow-down-left" /></span></div>
      </section>
      <BadgeSelector fields={fields}/>
    </main>}
    <footer className="hub-footer"><span>MATHEUS <SiteIcon name="copyright" /> {new Date().getFullYear()}</span><span>Feito de curiosidade. E um pouco de tinta.</span><a href="#inicio">Tudo é perspectiva. <SiteIcon name="arrow-up-right" /></a></footer>
  </div>;
}
