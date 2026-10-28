# Crachá Desenvolvedor: camadas fixas

Modo: edição com a ferramenta integrada `image_gen`, skill `imagegen`.
Saídas: `public/media/badges/desenvolvedor-foreground.png` e
`public/media/badges/desenvolvedor-background.png`.
Ambas usam o mesmo contêiner e enquadramento CSS. Só a opacidade do fundo muda.

## Prompt do recorte

Use case: background-extraction. Edit target: the supplied square white-background portrait. Remove ONLY the white/light-gray background to actual transparent alpha. Preserve the complete existing character, hair, glasses, face, shirt and ALL original colors, lighting, geometry and proportions exactly. Do not redraw or reinterpret. Keep the same square canvas and EXACT subject positioning and scale, with the same top margin and bottom crop. No added shadows, borders, text or objects. This transparent cutout will be a single stationary foreground layer over changing backgrounds on a website.

## Prompt do fundo

Use case: precise-object-edit. Edit target: supplied square portrait with black programming code background. Remove the entire person (hair, face, glasses, body and shirt) completely. Fill that entire region seamlessly with the same black background and syntax-highlighted JavaScript code, continuing the existing three columns of code. Preserve existing background, exact colors, typography size and composition around the edges. Output a full square background-only code texture for a website badge. No person, no face, no objects, no logos, no watermark. Keep the bright cyan, magenta, yellow, green and white code on black as in the original.
