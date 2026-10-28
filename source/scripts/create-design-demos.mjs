// Original vector studies for the sketchbook demo. No external image requests.
import { mkdir, writeFile } from 'node:fs/promises';
const output = new URL('../public/media/design/', import.meta.url);
await mkdir(output, { recursive: true });
const text = (x, y, size, content, fill, extra = '') => `<text x="${x}" y="${y}" ${extra.includes('font-family=') ? '' : 'font-family="Arial,Helvetica,sans-serif"'} font-size="${size}" fill="${fill}" ${extra}>${content}</text>`;
const line = (x1,y1,x2,y2,color,width=1) => `<path d="M${x1} ${y1}L${x2} ${y2}" fill="none" stroke="${color}" stroke-width="${width}"/>`;
const label = (content, color = '#f5f0dd', width = 700) => text(40, 53, 12, 'MATHEUS — ESTUDOS VISUAIS', color, 'letter-spacing="2"') + text(width-40, 53, 12, content, color, 'text-anchor="end" letter-spacing="2"');
const svg = (bg, body, width = 700) => `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="900" viewBox="0 0 ${width} 900"><rect width="${width}" height="900" fill="${bg}"/>${body}</svg>`;
const save = (name, content) => writeFile(new URL(name + '.svg', output), content);

await save('01-perspectiva', svg('#2344d3',
  label('01 / TIPO') + text(35, 171, 103, 'PERS', '#f7f1dc', 'font-weight="900" letter-spacing="-8"') + text(35, 266, 103, 'PECTIVA', '#f7f1dc', 'font-weight="900" letter-spacing="-8"') +
  Array.from({length:20}, (_,i) => line(350, 510, -200+i*58, 838, '#c1cafa', 1.7)).join('') +
  Array.from({length:10}, (_,i) => `<ellipse cx="350" cy="510" rx="${45+i*29}" ry="${30+i*23}" fill="none" stroke="#c1cafa" stroke-width="1.5"/>`).join('') +
  '<circle cx="350" cy="510" r="66" fill="#ef4939"/>' + text(40, 864, 13, 'UM NOVO JEITO DE OLHAR.', '#f7f1dc', 'letter-spacing="3"')));

await save('02-florescer', svg('#ede6d2', label('02 / FORMA', '#b83b2d') +
  Array.from({length:10}, (_,i) => `<ellipse cx="350" cy="330" rx="65" ry="160" fill="#da432f" transform="rotate(${i*36} 350 440)"/>`).join('') +
  '<circle cx="350" cy="440" r="66" fill="#f1b644"/>' + text(43, 760, 104, 'florescer', '#c03929', 'font-family="Georgia,serif" letter-spacing="-7"') +
  text(48, 813, 15, 'DAR TEMPO ÀS IDEIAS.', '#b83b2d', 'letter-spacing="4"') + line(45, 844, 655, 844, '#b83b2d')));

await save('03-fora-da-caixa', svg('#f1cd48', label('03 / SEM LIMITES', '#22251e', 1400) +
  '<path d="M85 130 1260 110 1305 757 125 800Z" fill="none" stroke="#272820" stroke-width="3"/>' +
  text(35, 347, 250, 'fora da', '#20241d', 'font-weight="900" letter-spacing="-19"') + text(470, 625, 270, 'caixa.', '#20241d', 'font-weight="900" letter-spacing="-20"') +
  '<path d="m1104 178 27-109 35 105 103-45-65 90 108 37-112 16 34 108-83-75-57 91 4-111-111 5 93-59-74-83Z" fill="#2747ce"/>' +
  text(135, 741, 19, 'A CRIATIVIDADE NÃO', '#292a22', 'letter-spacing="3"') + text(135, 771, 19, 'PEDE LICENÇA.', '#292a22', 'letter-spacing="3"') +
  text(1290, 852, 15, 'IDEIAS QUE OCUPAM ESPAÇO', '#292a22', 'text-anchor="end" letter-spacing="3"') + '<path d="m1310 853 16-16m-16 0h16v16" fill="none" stroke="#292a22" stroke-width="2"/>', 1400));

await save('04-ritmo', svg('#edb9ca', label('04 / RITMO', '#225b3d') +
  text(28, 234, 175, 'ritmo', '#226246', 'font-weight="900" letter-spacing="-15"') +
  '<path d="M50 370h600v180H50Z" fill="#246648"/><path d="M50 370q75-160 150 0t150 0 150 0 150 0" fill="#246648"/>' +
  Array.from({length:32}, (_,i) => ((Math.floor(i/8)+i%8)%2===0 ? `<rect x="${50+(i%8)*75}" y="${550+Math.floor(i/8)*55}" width="75" height="55" fill="#246648"/>` : '')).join('') +
  text(50, 842, 13, 'ENCONTRAR O MOVIMENTO NA REPETIÇÃO.', '#225b3d', 'letter-spacing="2"')));

await save('05-entrelinhas', svg('#f0ece1', label('05 / EDITORIAL', '#242823') +
  text(40, 185, 94, 'Entre', '#232922', 'font-family="Georgia,serif" font-style="italic"') + text(210, 280, 94, 'linhas.', '#232922', 'font-family="Georgia,serif" font-style="italic"') +
  Array.from({length:19}, (_,i) => `<path d="M-25 ${365+i*22}C200 ${200+i*22} 420 ${590+i*22} 730 ${330+i*22}" fill="none" stroke="#252b23" stroke-width="8"/>`).join('') +
  '<rect y="805" width="700" height="95" fill="#f0ece1"/>' + text(40, 854, 12, 'O SILÊNCIO TAMBÉM FAZ PARTE DA COMPOSIÇÃO.', '#242823', 'letter-spacing="1.6"')));

await save('06-mare', svg('#b8d1e8', label('06 / FLUXO', '#2244ba', 1400) +
  '<circle cx="1100" cy="250" r="120" fill="#f6f0d8"/>' + text(90, 450, 440, 'maré', '#2349c3', 'font-family="Georgia,serif" font-style="italic" letter-spacing="-30"') +
  '<path d="M0 520Q175 430 350 520T700 520 1050 520 1400 520V900H0Z" fill="#244bc8"/>' +
  Array.from({length:11}, (_,i) => `<path d="M-50 ${570+i*28}Q150 ${490+i*28} 350 ${570+i*28}T750 ${570+i*28} 1150 ${570+i*28} 1550 ${570+i*28}" fill="none" stroke="#f2ebd7" stroke-width="2.5"/>`).join('') +
  text(55, 850, 16, 'TUDO QUE VAI, REINVENTA A VOLTA.', '#f5efdc', 'letter-spacing="4"'), 1400));

await save('07-orbita', svg('#e76b39', label('07 / ESPAÇO', '#282820') +
  text(36, 198, 138, 'órbita', '#282820', 'font-weight="900" letter-spacing="-9"') +
  Array.from({length:12}, (_,i) => `<ellipse cx="350" cy="505" rx="${90+i*17}" ry="245" transform="rotate(${i*15} 350 505)" fill="none" stroke="#262921" stroke-width="2.4"/>`).join('') +
  '<circle cx="488" cy="360" r="46" fill="#efe8cf"/>' + text(42, 847, 15, 'NADA SE CRIA PARADO.', '#282820', 'letter-spacing="3"')));

await save('08-casa', svg('#225940', label('08 / IDENTIDADE', '#e9e4d1') +
  '<circle cx="535" cy="225" r="78" fill="#efc55c"/><path d="m110 405 235-225 235 225v255H110Z" fill="#e6afba"/><path d="M285 660V485a60 60 0 0 1 120 0v175" fill="#225940"/>' +
  text(70, 795, 157, 'casa', '#efe9d6', 'font-family="Georgia,serif" letter-spacing="-8"') + text(80, 846, 12, 'UM LUGAR PARA PERTENCER.', '#efe9d6', 'letter-spacing="3"')));

await save('09-agora', svg('#e14532', label('09 / PRESENTE') +
  [270,450,630].map(y => text(23, y, 174, 'agora', '#f2e8ce', 'font-weight="900" letter-spacing="-14"')).join('') +
  '<path d="m420 725 175-175m-160 0h160v160" fill="none" stroke="#2544cc" stroke-width="53"/>' +
  text(40, 853, 14, 'O MOMENTO DE CRIAR É ESSE.', '#f2e8ce', 'letter-spacing="2"')));

await save('10-infinito', svg('#c5b6e0', label('10 / CONTINUA', '#2a42b9') +
  [210,490].map(cx => Array.from({length:10}, (_,i) => `<circle cx="${cx}" cy="420" r="${40+i*13}" fill="none" stroke="#3046be" stroke-width="5"/>`).join('')).join('') +
  text(47, 752, 112, 'infinito', '#3046be', 'font-family="Georgia,serif" font-style="italic" letter-spacing="-6"') + text(50, 845, 13, 'SEMPRE EXISTE UMA PRÓXIMA IDEIA.', '#2a42b9', 'letter-spacing="2"')));
console.log('Created 10 original sketchbook demo artworks.');
