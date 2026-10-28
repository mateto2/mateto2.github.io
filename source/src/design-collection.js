// Add images to public/media/design/ and reference them here.
// "pages": two independent images. "spread": one image across the whole book.
// Keep descriptive alt text. Images are contained, never cropped.
const art = (file, title, category, alt) => ({ src: `/media/design/${file}.svg`, title, category, alt });

export const designSpreads = [
  {
    id: 'primeiros-tracos', layout: 'pages', title: 'Tudo começa com uma ideia.',
    left: art('01-perspectiva', 'Perspectiva', 'EXPERIMENTO TIPOGRÁFICO', 'Pôster azul com tipografia branca Perspectiva e linhas que convergem para um círculo vermelho.'),
    right: art('02-florescer', 'Florescer', 'FORMA & COR', 'Pôster creme com uma flor vermelha de pétalas arredondadas e a palavra florescer.'),
  },
  {
    id: 'fora-da-caixa', layout: 'spread', title: 'Algumas ideias precisam de mais espaço.',
    image: art('03-fora-da-caixa', 'Fora da caixa', 'PÔSTER EM PÁGINA DUPLA', 'Composição amarela com letras pretas Fora da caixa, uma moldura irregular e uma estrela azul.'),
  },
  {
    id: 'ritmo', layout: 'pages', title: 'Entre o ritmo e a pausa.',
    left: art('04-ritmo', 'Ritmo', 'IDENTIDADE VISUAL', 'Pôster rosa com formas geométricas verdes, quadriculado e a palavra ritmo.'),
    right: art('05-entrelinhas', 'Entrelinhas', 'DESIGN EDITORIAL', 'Pôster creme e preto com faixas onduladas e tipografia editorial Entrelinhas.'),
  },
  {
    id: 'mare', layout: 'spread', title: 'Deixar a imaginação correr.',
    image: art('06-mare', 'Maré', 'ESTUDO EM PÁGINA DUPLA', 'Panorama azul com ondas brancas e a palavra maré em letras grandes sobre o horizonte.'),
  },
  {
    id: 'encontros', layout: 'pages', title: 'Formas que se encontram.',
    left: art('07-orbita', 'Órbita', 'EXPLORAÇÃO GEOMÉTRICA', 'Pôster laranja com órbitas pretas elípticas e uma pequena esfera creme.'),
    right: art('08-casa', 'Casa', 'CONCEITO DE MARCA', 'Composição verde com uma casa geométrica rosa, um sol amarelo e o nome casa.'),
  },
  {
    id: 'em-movimento', layout: 'pages', title: 'A próxima página ainda está em branco.',
    left: art('09-agora', 'Agora', 'CARTAZ EXPERIMENTAL', 'Pôster vermelho com a palavra agora repetida em letras creme e uma seta diagonal azul.'),
    right: art('10-infinito', 'Infinito', 'ESTUDO DE COMPOSIÇÃO', 'Pôster lilás com um símbolo infinito azul formado por círculos concêntricos.'),
  },
];
