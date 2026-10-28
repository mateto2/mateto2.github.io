import React, { Suspense, lazy, useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import PortfolioHome from './PortfolioHome.jsx';
const FilmExperience = lazy(() => import('./FilmExperience.jsx'));
function Portfolio() {
  const [route, setRoute] = useState(() => window.location.hash.slice(1));
  useEffect(() => {
    const navigate = () => { setRoute(window.location.hash.slice(1)); if (window.location.hash !== '#vertentes') window.scrollTo(0, 0); };
    window.addEventListener('hashchange', navigate);
    return () => window.removeEventListener('hashchange', navigate);
  }, []);
  useEffect(() => { if (route === 'vertentes') document.getElementById('vertentes')?.scrollIntoView({ behavior: 'instant', block: 'start' }); }, [route]);
  const film = route === 'filmmaker' || /^film-\d+$/.test(route);
  useEffect(() => { document.title = film ? 'Matheus — Filmmaker' : route === 'designer' ? 'Matheus — Design gráfico / Sketchbook' : 'Matheus — Ideias em várias formas'; }, [film, route]);
  return film ? <Suspense fallback={<div className="hub-loading">Abrindo minhas histórias… <a href="#inicio">Voltar ao início</a></div>}><FilmExperience /></Suspense> : <PortfolioHome route={route} />;
}
createRoot(document.getElementById('root')).render(<Portfolio />);
