import React from 'react';
import { siteContact } from './site-contact.js';
import './site-footer.css';

const pages = [['Início', '#inicio'], ['Sobre', '#sobre'], ['Inspirações', '#inspiracoes']];

export default function SiteFooter() {
  const contacts = [
    ['Instagram', siteContact.instagram],
    ['Substack', siteContact.substack],
    ['LinkedIn', siteContact.linkedin],
    ['YouTube', siteContact.youtube],
    ['WhatsApp', siteContact.whatsapp],
    ['Email', siteContact.email ? `mailto:${siteContact.email}` : ''],
  ];
  return <footer className="site-footer">
    <a className="site-footer-brand" href="#inicio" aria-label="Matheus Creative Lab, início"><span>Matheus</span><span>Creative Lab</span></a>
    <nav className="site-footer-social" aria-label="Redes sociais e contato">
      {contacts.map(([label, href]) => href ? <a key={label} href={href} target={label === 'Email' ? undefined : '_blank'} rel={label === 'Email' ? undefined : 'noopener noreferrer'}>{label}</a> : <span key={label} className="site-footer-pending" aria-label={`${label}, em breve`} title="Em breve">{label}<small>Em breve</small></span>)}
    </nav>
    <nav className="site-footer-pages" aria-label="Páginas do portfólio">
      {pages.map(([label, href]) => <a key={href} href={href}>{label}</a>)}
    </nav>
  </footer>;
}
