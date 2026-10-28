# Sketchbook de design gráfico

Acesse `#designer` pelo crachá Designer. O caderno contém 10 artes vetoriais
originais de demonstração distribuídas em 6 aberturas (12 páginas): 4 pares
de artes independentes e 2 imagens panorâmicas. As artes estão identificadas
como exemplos no site.

## Colocar suas imagens

1. Salve JPG, PNG, WebP, AVIF ou SVG em `public/media/design/`.
2. Edite a lista `designSpreads` em `src/design-collection.js`.
3. Para fotos ou arquivos com outras extensões, use um objeto como os exemplos
   abaixo em vez do atalho `art(...)` das demonstrações.
4. Rode `npm run build` para gerar a versão publicável em `dist/`.

Uma arte por página:

```js
{
  id: 'meus-cartazes',
  layout: 'pages',
  title: 'Uma frase sobre estes trabalhos.',
  left: {
    src: '/media/design/cartaz-01.jpg',
    title: 'Título do projeto',
    category: 'IDENTIDADE VISUAL',
    alt: 'Descrição do que aparece na imagem.',
  },
  right: {
    src: '/media/design/cartaz-02.webp',
    title: 'Outro projeto',
    category: 'DESIGN EDITORIAL',
    alt: 'Descrição da segunda arte.',
  },
},
```

Uma arte horizontal nas duas páginas:

```js
{
  id: 'meu-panorama',
  layout: 'spread',
  title: 'Uma ideia que ocupa as duas páginas.',
  image: {
    src: '/media/design/panorama.jpg',
    title: 'Nome do projeto',
    category: 'PÁGINA DUPLA',
    alt: 'Descrição completa da composição panorâmica.',
  },
},
```

As imagens mantêm a proporção original, sem cortes. Artes próximas de 7:9
funcionam bem individualmente; para páginas duplas, use aproximadamente 14:9.
A dobra central recebe sombra, por isso evite colocar detalhes muito pequenos
exatamente no centro. A ordem da lista determina a ordem das páginas.

## Interação

- Clique na metade direita/esquerda ou use os botões laterais para folhear.
- Arraste horizontalmente; a rolagem vertical e o zoom por pinça continuam livres.
- Com foco no livro, use ←/→, Home (início) e End (fim).
- Os seis marcadores levam diretamente a uma abertura; a quantidade acompanha a lista.
- Durante a animação, novas viradas ficam bloqueadas para evitar folhas sobrepostas.
- Movimento reduzido troca as páginas sem animação.

`DesignSketchbook.jsx` controla o caderno; `design-sketchbook.css` contém papel,
capa, lombada, sombras e animação CSS 3D. Não há dependências novas.
`scripts/create-design-demos.mjs` regenera apenas os dez SVGs de demonstração.
Não execute esse script para substituir suas artes reais.

Este projeto é estático: trocar arquivos e recompilar atualiza a coleção.
Não existe upload público ou armazenamento de imagens pelo navegador.
