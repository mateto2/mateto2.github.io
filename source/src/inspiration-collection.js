import { designSpreads } from './design-collection.js';

// Replace these demo entries with your references. See DESIGN-INSPIRATIONS.md.
const posters = designSpreads.flatMap(spread => spread.layout === 'spread' ? [spread.image] : [spread.left, spread.right]);
const photos = [
  ['O movimento do mar', 'Ondas e água azul vistas do alto.'],
  ['Linhas da montanha', 'Montanha e suas formas naturais.'],
  ['Luz que transforma', 'Paisagem iluminada pela luz do sol.'],
  ['Depois do silêncio', 'Paisagem de montanhas sob o céu.'],
  ['Camadas de luz', 'Sol sobre um horizonte de montanhas em camadas.'],
  ['Outros horizontes', 'Montanhas e horizonte em uma paisagem aberta.'],
  ['Um lugar para respirar', 'Campo verde sob o céu.'],
  ['Entre as árvores', 'Luz e vegetação em uma floresta.'],
  ['Pelo caminho', 'Estrada entre formações rochosas avermelhadas.'],
  ['Reflexos', 'Água e montanhas em uma paisagem.'],
];

export const inspirations = posters.flatMap((art, index) => [
  { id: `estudo-${index + 1}`, ...art, category: 'ESTUDO VISUAL', credit: 'Arte demonstrativa do portfólio', demo: true, columns: index % 3 === 0 ? 4 : 2, rows: index % 3 === 0 ? 4 : 3 },
  { id: `foto-${index + 1}`, src: `/media/covers/${index}.jpg`, title: photos[index][0], alt: photos[index][1], category: 'FOTOGRAFIA', credit: 'Unsplash · coleção de demonstração', demo: true, columns: index % 2 ? 3 : 4, rows: index % 3 === 0 ? 3 : 4 },
]);
