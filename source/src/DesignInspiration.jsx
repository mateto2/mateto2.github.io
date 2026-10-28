import React, { useEffect, useRef, useState } from 'react';
import SiteIcon from './SiteIcon.jsx';
import { inspirations } from './inspiration-collection.js';

export default function DesignInspiration({ standalone = false }) {
  const Heading = standalone ? 'h1' : 'h2';
  const [selected, setSelected] = useState(null);
  const dialog = useRef(null);
  useEffect(() => {
    if (selected && !dialog.current.open) dialog.current.showModal();
    if (!selected && dialog.current.open) dialog.current.close();
  }, [selected]);
  useEffect(() => {
    if (!selected) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = previous; };
  }, [selected]);

  return <section id="designer-inspiracoes" className="inspiration-section" aria-labelledby="inspiration-heading">
    <div className="inspiration-heading"><Heading id="inspiration-heading">Inspirações</Heading><span>{String(inspirations.length).padStart(2, '0')} REFERÊNCIAS / EM EXPANSÃO</span></div>
    <p className="inspiration-note">Uma primeira composição com imagens de exemplo. Aos poucos, minhas referências ganham lugar por aqui.</p>
    <div className="inspiration-board">
      <div className="inspiration-board-label"><span>MATHEUS / ARQUIVO VISUAL</span><span>CLIQUE PARA OLHAR DE PERTO <SiteIcon name="arrow-down-left"/></span></div>
      <div className="inspiration-collage">
        {inspirations.map((item, index) => <button key={item.id} className="inspiration-piece" style={{ '--columns': item.columns || 3, '--rows': item.rows || 4 }} onClick={() => setSelected(item)} aria-label={`Ampliar ${item.title}`}>
          <img src={item.src} alt={item.alt} loading={index < 6 ? 'eager' : 'lazy'} decoding="async" draggable="false"/>
          <span className="inspiration-piece-caption">{item.title}<SiteIcon name="arrow-up-right"/></span>
        </button>)}
      </div>
      {!inspirations.length && <p className="inspiration-empty">O mural está aberto às próximas descobertas.</p>}
      <div className="inspiration-board-footer"><span>CONTINUAR OLHANDO. CONTINUAR CRIANDO.</span><SiteIcon name="asterisk"/></div>
    </div>
    <dialog ref={dialog} className="inspiration-dialog" aria-labelledby="inspiration-detail-title" onCancel={() => setSelected(null)} onClose={() => setSelected(null)} onClick={event => { if (event.target === dialog.current) setSelected(null); }}>
      {selected && <div className="inspiration-detail">
        <button className="inspiration-close" aria-label="Fechar inspiração" autoFocus onClick={() => setSelected(null)}><SiteIcon name="close"/></button>
        <img src={selected.src} alt={selected.alt}/>
        <div className="inspiration-detail-caption"><div><span>{selected.category}{selected.demo ? ' / EXEMPLO' : ''}</span><h2 id="inspiration-detail-title">{selected.title}</h2><p>{selected.credit}</p></div>
          {selected.source && <a href={selected.source} target="_blank" rel="noopener noreferrer">Ver origem <SiteIcon name="arrow-up-right"/></a>}
        </div>
      </div>}
    </dialog>
  </section>;
}
