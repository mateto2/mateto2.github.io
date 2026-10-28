import React from 'react';
import SiteIcon from './SiteIcon.jsx';
import DesignSketchbook from './DesignSketchbook.jsx';
import './design-area.css';

export default function DesignArea() {
  return <main className="design-studio">
    <div className="design-topline"><a href="#inicio" className="design-back"><SiteIcon name="arrow-up-left" /> Todas as vertentes</a><span>02 / DESIGN GRÁFICO</span></div>
    <h1 className="design-page-title">Sketchbook</h1>
    <DesignSketchbook />
  </main>;
}
