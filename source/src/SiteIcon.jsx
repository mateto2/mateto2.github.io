import React from 'react';
import './site-icon.css';

// External SVG artwork: shapes stay identical across desktop and mobile fonts.
// Icons are decorative; their containing links/buttons provide accessible labels.
export default function SiteIcon({ name, className = '' }) {
  return <svg className={`site-icon ${className}`} width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true" focusable="false">
    <use href={`/media/ui-icons.svg#${name}`} />
  </svg>;
}
