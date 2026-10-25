# Portfólio Matheus

Site: https://mateto2.github.io/

A raiz contém o site compilado para GitHub Pages. O código editável está em `source/`.

## Desenvolvimento

```sh
cd source
npm ci
npm run dev
```

## Atualizar o site

Execute `npm run build` dentro de `source/` e copie o conteúdo de `source/dist/`
para a raiz do repositório, preservando `.git`, `source/` e `.nojekyll`.
Faça commit das alterações e envie para `main`.

Inclui 11 vídeos pessoais (os dois arquivos AF24424B enviados eram idênticos),
capas extraídas dos filmes, prévias leves, caderno Explorer e abertura com piscada.
Os títulos História 01–11 são provisórios; as demais entradas ainda são modelos.

## Entrada por vertentes

A homepage reúne Filmmaker, Designer, Desenvolvedor e Fotografia em quatro crachás suspensos. A experiência original
de vídeos está em `#filmmaker`; Designer e Desenvolvedor têm apresentações
iniciais em construção. `#film-01` e demais links de vídeos continuam válidos.
O código da homepage fica em `source/src/PortfolioHome.jsx`; a parede está
em `source/src/FilmExperience.jsx`, carregada somente ao entrar em Filmmaker.

Os crachás usam CSS 3D e molas do Motion para balanço e arraste. Clique abre a
vertente; arraste não navega. Há pausa e suporte a movimento reduzido. O conteúdo
visual dos crachás é provisório. Fotografia abre uma apresentação inicial.
