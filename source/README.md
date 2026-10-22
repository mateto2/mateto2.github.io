# Matheus

A React + Motion homepage hero using a single, persistent CSS 3D cylinder.
No canvas, WebGL, or Three.js.

## Read in this order

1. `src/reel-entrance.ts` and `src/reelPose.test.js` — pure geometry, angular deal
   order, stack depth, fade, and camera culling. `src/reelPose.js` re-exports the
   pose and contains the scene adapter and arbitrary-length recycling.
   `src/reel-scene.ts` defines the shared loader-to-hero interpolation.
2. `src/Loader.jsx` — real asset progress, rolling digit columns, scrambled caption,
   and the instant skip control.
3. `src/Wall.jsx`, then `src/main.jsx` — exactly 16 persistent link elements, the
   entrance lifecycle, spring rotation, rendering, and media playback.

## Run

```sh
npm install
npm run dev
npm test
npm run build
```

Node 24 was used for verification. The test runner uses `--test-isolation=none`
to work in environments that restrict child processes.

## Scene contract

`formation` starts after the supplied 8-second drawing video ends, then runs linearly for 2.6 seconds. Card progress is staggered in angular
order, then eased with `1 - (1 - progress)^3`. Cards swing from -180 degrees;
their initial depth offsets are less than 24px and disappear as they are dealt.
Opacity reaches one at 40% of each card's local deal. Undealt cards have zero opacity.

`expansion` begins only after formation completes **and** every critical cover
and video has emitted a successful load event. It runs for 1.9 seconds with
`[0.5, 0, 0.15, 1]`. Radius, tilt, roll, perspective, scale, page opacity,
headline displacement, derive from it. The wordmark stays fixed at its measured header position.
Radius, perspective, tilt, and roll interpolate linearly in expansion. Card
scale follows `0.52 + (2.3 - 0.52) * expansion²`, reaching 0.965 at the midpoint.
`reelScene(expansion, camera)` accepts a custom final perspective (default 450px);
`sceneAt` clamps progress and attaches spring rotation before rendering.
The DOM scene never unmounts during handoff.

`src/reel-entrance-controller.js` gates the reveal from formation completion and
real asset readiness, whichever arrives last. It launches expansion and a
cancellable numeric 1.05-second handoff signal together; the latter sets
`homeEntrance` while expansion is still running (1.9 seconds). Header and
headline appearance then derive from the remaining expansion. There is no
timeline or third visual MotionValue. Skip and unmount cancel all controls.

The loader measures five initially front-facing cards, two assets each, plus the final background frame and portrait.
`img.onload` and `video.loadeddata` contribute to the twelve-asset denominator.
Failed assets never count as loaded. An explicit failure message and the skip
button remain available; no timer claims success.

Rotation is separate interaction state: an unbounded target feeds a Motion
spring (`stiffness: 70`, `damping: 24`, `mass: 1`). Pointer, touch, wheel, and arrow
controls adjust the target. Automatic rotation also adjusts this same target.
No wrapped angle is assigned to the spring.

One animation frame loop computes poses. `src/reel-style-writer.ts` caches the
last successfully written string for each element/property, avoiding DOM style
reads and redundant writes even when CSS serializes numbers or spacing
differently. Each renderer lifecycle gets a fresh cache; replacement elements
get their own cache. The loader uses the same writer for its opacity.
Radius/tilt/roll/scale are inherited variables on the ring; perspective belongs
on its camera parent. Hit-testing runs once every three frames. Only visible,
camera-facing, on-screen videos play. Hidden documents and dialogs pause them.
Hover and card keyboard focus suspend automatic rotation.

Slots change their assigned reel only while their center is behind the camera.
The 24-item demo exercises recycling; `reels.js` accepts any positive list length.
Collections smaller than 16 repeat across the fixed slots.

Escape, Tab, and Skip finish the entrance immediately. Reduced motion bypasses
the loader and starts paused. No scroll input changes the scene during entrance.
The skip button stays visible for the entire entrance, including expansion.
`src/reel-escapes.js` also responds to reduced-motion changes while loading.
Afterward, a horizontal phone swipe anywhere on the page turns the ring;
buttons and links still respond to taps. Dialogs, the dynamic island, and text inputs are excluded.
`src/reel-gesture.js` tracks one pointer and suppresses accidental clicks after
swipes. Vertical scrolling and pinch zoom remain available after the entrance.
Every card is a labeled anchor, and the full collection is also available in the
keyboard-accessible index. The native dialog contains focus while open.

## Dynamic island

`src/DynamicIsland.jsx` and `src/dynamic-island.css` implement the always-visible
header navigation. The supplied image is bundled unchanged at
`public/media/island-pattern.jpg`. Blue marker-style SVG backgrounds and off-white
lettering echo its palette. Work is reserved and has no action. About opens the project introduction.
Explorer, with an animated compass needle, opens the notebook collection. No expansion or back
control is needed. Narrow layouts place the complete navigation in a second
header row and fit the wall below the headline.

Hand-drawn SVG icons swing, blink and spin on hover or keyboard focus; letters
bounce in sequence. The About pupils track the direction of the pointer anywhere
on the page through springs, with at most one geometry read per animation frame.
Touch opens each section with a tap. Reduced motion disables decorative motion.
The navigation becomes interactive after the entrance.

## Demo assets

The collection is illustrative, with 16 Unsplash covers and four Mixkit nature
previews reused across 24 editorial titles. Replace `src/reels.js` with your
real reel metadata and media. All cover images and previews are stored locally.
The source URLs for cover attribution remain in `coverSource`.

Preview sources:

- https://assets.mixkit.co/videos/2213/2213-360.mp4
- https://assets.mixkit.co/videos/41576/41576-360.mp4
- https://assets.mixkit.co/videos/4075/4075-360.mp4
- https://assets.mixkit.co/videos/51585/51585-360.mp4

Font families are DM Sans and IBM Plex Mono, with local system fallbacks.

## Drawing video and portrait

`src/PatternBackdrop.jsx` plays the supplied blue-and-red-on-white 8-second video once,
muted and inline at 1.5x (about 5.33 seconds).
The video ended event releases formation through the entrance controller's
`completePrelude()` gate; only after the 2.6-second card formation and asset
readiness does the 1.9-second expansion begin. Background tabs pause the drawing.
Playback errors fall back to the final still and release the gate. Skip pauses
the video and immediately finishes the scene. Reduced motion uses the still only.

`public/media/pattern-drawing.mp4` retains the original video stream with audio
removed and fast-start metadata. `pattern-start.jpg` and `pattern-finished.jpg`
come from its first and final frames, so the video does not switch back to the
old static pattern. There is no radial reveal mask. White header/footer bands
frame the video and final background, using shared responsive CSS dimensions.

The original transparent `matheus-avatar.png` sits left of the wordmark visibly taller than the
capital M. CSS crops the empty transparent margins without editing
the artwork. It stays with the wordmark inside the white header throughout the entrance.

## Portfolio copy and marker labels

The hero is in Brazilian Portuguese: “Tudo é perspectiva.” Its eyebrow and
supporting copy describe independent videos and stories filmed by Matheus.
The background uses the replacement blue-and-red-on-white drawing video supplied by the
user. Pale text panels and lateral captions have been removed. Rounded blue
marker strokes, textured off-white lettering and animated decorative symbols
connect the hero and carousel controls to the island. Hover animation respects
reduced motion. Footer wording is intentionally unchanged.

Critical video previews retry actual failed loads at most twice (400/800 ms),
with cleanup on replacement/unmount. Only successful loadeddata events advance
progress; exhausted failures keep the existing explicit skip path.

## Explorer notebook

`src/ReelNotebook.jsx` and `src/notebook.css` present all 24 entries as a dotted
white notebook page, with subtle paper folds, a spiral binding and blue Caveat
handwriting. The font is bundled in `public/fonts/` with its SIL Open Font License.
Each numbered row is a real video link. Opening a video preserves the notebook
scroll position; “Voltar ao caderno” restores it. Escape and the close button keep
the native dialog dismissal behavior. The duplicate header index button and the
old Process content were removed. Work remains visible with aria-disabled and
no action; its hammer decoration is retained.

The user restored the previous blue/red drawing video, retaining 1.5x playback.
The wordmark and larger portrait now remain in the header throughout loading;
the bottom-right percentage uses a smaller responsive size (64/54/42px).

## Filmes pessoais e piscada

Os 11 filmes diferentes enviados em 22/10/2026 substituem as primeiras 11 entradas.
Os dois arquivos AF24424B eram idênticos (SHA-256), por isso aparecem uma única vez.
`src/portfolio.json` registra a correspondência com os nomes originais; os títulos
“História 01” a “História 11” são provisórios. As outras 13 entradas continuam demos.
As versões completas preservam duração, proporção e áudio em MP4 H.264/AAC;
as prévias são mudas, de até 8 segundos, e as capas vêm dos próprios vídeos.
O player usa fullVideo, enquanto parede e caderno usam a prévia leve.

A abertura mantém o rosto original durante toda a piscada. Uma pálpebra SVG
animada sobre o olho fecha e reabre em 0,5 segundo; só então o rosto vai ao
cabeçalho, seguido pelo nome digitado. Escape, Tab, Skip e movimento reduzido
continuam levando diretamente ao estado final, de olhos abertos.
