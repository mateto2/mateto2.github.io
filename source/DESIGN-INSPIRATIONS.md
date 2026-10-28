# Inspirações de design

Acesse o mural pelo footer em `#inspiracoes`. Design (`#designer`) contém apenas
o sketchbook. O endereço antigo `#designer-inspiracoes` abre a página do mural
por compatibilidade.
O mural de colagens em fundo preto é inspirado em https://matthewyu.dev/inspiration.
As imagens iniciais são exemplos locais: dez estudos gráficos e dez fotografias
da coleção de demonstração já existente. Não representam uma curadoria definitiva.

## Adicionar referências

Guarde imagens em `public/media/inspirations/` e edite a lista exportada em
`src/inspiration-collection.js`. Você pode substituir a lista inteira por objetos:

```js
export const inspirations = [
  {
    id: 'referencia-01',
    src: '/media/inspirations/minha-referencia.jpg',
    title: 'Título da referência',
    alt: 'Descrição visual da imagem',
    category: 'DESIGN EDITORIAL',
    credit: 'Nome do autor ou estúdio',
    source: 'https://exemplo.com/projeto',
    columns: 3,
    rows: 4,
  },
];
```

Use IDs únicos. `columns` (2–6) e `rows` (3–6) definem o tamanho no mural desktop.
No celular o mural se reorganiza em duas colunas com algumas imagens largas.
O mural recorta as miniaturas; tocar ou clicar abre a imagem completa, seus créditos
e a origem opcional. Escape, o botão Fechar e o fundo externo fecham a ampliação.
`demo: true` identifica exemplos na ampliação; omita em referências definitivas.
Mantenha os créditos e adicione imagens que você tenha autorização para exibir.
