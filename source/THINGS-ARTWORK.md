# Nome "Matheus" feito de coisas

`src/ThingsWordmark.jsx` substitui o antigo vídeo `creative-lab-logo.mp4` no canto
superior esquerdo. Cada letra de "Matheus" (DM Sans 800, mesma fonte e espaçamento do rodapé) é um slot com
a letra e uma imagem por cima. Uma mola por letra leva o valor de 0 (letra) a 1
(objeto): `v += ((alvo - a) * 240 - v * 19) * dt`, com cerca de 8% de ultrapassagem.

- **Abertura:** uma onda passa da esquerda para a direita, cada letra vira objeto e volta.
- **Mouse/toque:** efeito lupa; a letra mais próxima vira o objeto e mostra uma legenda.
- **Parado:** a onda se repete a cada 8 segundos sem interação.
- **Teclado:** o foco (Tab) dispara a onda. Movimento reduzido mostra só as letras.

## Objetos atuais (provisórios)

Emojis 3D Fluent da Microsoft, licença MIT (`public/media/things/FLUENT-EMOJI-LICENSE.txt`).

| Letra | Arquivo | Legenda |
|---|---|---|
| M | `filmmaker.png` (câmera de cinema) | Filmes |
| a | `designer.png` (paleta) | Design |
| t | `desenvolvedor.png` (notebook) | Código |
| h | `fotografia.png` (câmera com flash) | Fotografia |
| e | `bone.png` (boné) | Boné azul |
| u | `oculos.png` (óculos) | Óculos |
| s | `ideia.png` (lâmpada) | Ideias |

## Trocar pelos seus objetos

Gere cada imagem, remova o fundo (PNG transparente, quadrado, objeto centralizado)
e salve com o **mesmo nome** em `public/media/things/`. Para mudar a legenda ou a
ordem, edite a lista `things` no topo de `ThingsWordmark.jsx`.

Estilo comum (cole no fim de cada prompt):

> Style: a premium glossy 3D emoji icon: soft rounded chunky shapes, smooth glossy plastic and soft clay materials, bright saturated colours, soft studio lighting with gentle highlights, a slight three-quarter view, one single object only, centered with generous empty margin, on a pure seamless flat white background (#ffffff), no ground shadow, no text, no logos. Square 1:1, 1024x1024.

Assuntos:

- **M, filmmaker:** `Subject: a compact cinema video camera with a blue body and a small red record light.`
- **a, designer:** `Subject: a chunky pencil crossed with a paintbrush dipped in bright blue and red paint.`
- **t, desenvolvedor:** `Subject: an open laptop showing colourful lines of code on a dark screen.`
- **h, fotografia:** `Subject: a retro photo camera with a big lens and a glowing flash.`
- **e, você (anexe seu avatar):** `Subject: a 3D emoji head of the young man in the attached reference image: wavy brown hair, royal blue baseball cap worn backwards, thick black rectangular glasses, moustache and goatee, warm tan skin, a friendly confident smile. Keep his likeness but make it a cute glossy 3D emoji head, head only, no body.` Salve como `bone.png` ou troque o arquivo na lista.
- **u, óculos:** `Subject: thick black rectangular glasses with small white flower details on the hinges.`
- **s, ideia:** `Subject: a glowing light bulb with small sparkles around it.`
