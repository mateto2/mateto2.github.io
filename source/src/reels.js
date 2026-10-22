import portfolio from './portfolio.json';
// Demo editorial collection. Replace this array with a CMS response: the wall
// always keeps exactly 16 slots, regardless of this array's length.
const photographs = [
  'photo-1518837695005-2083093ee35b',
  'photo-1464822759023-fed622ff2c3b',
  'photo-1470252649378-9c29740c9fa8',
  'photo-1519681393784-d120267933ba',
  'photo-1500534623283-312aade485b7',
  'photo-1469474968028-56623f02e42e',
  'photo-1472214103451-9374bd1c798e',
  'photo-1441974231531-c6227db76b6e',
  'photo-1500530855697-b586d89ba3ee',
  'photo-1470770841072-f978cf4d019e',
  'photo-1465146344425-f00d5f5c8f07',
  'photo-1501785888041-af3ef285b470',
  'photo-1426604966848-d7adac402bff',
  'photo-1447752875215-b2761acb3c5d',
  'photo-1433086966358-54859d0ed716',
  'photo-1511497584788-876760111969',
];
const names = [
  ['Tidal feelings', 'OCEAN / 01'],
  ['Above it all', 'ALTITUDE / 02'],
  ['Golden hour', 'LIGHT / 03'],
  ['After the quiet', 'NIGHT / 04'],
  ['Somewhere slow', 'EARTH / 05'],
  ['The way out', 'WANDER / 06'],
  ['A softer world', 'LAND / 07'],
  ['Into the green', 'FOREST / 08'],
  ['Off the map', 'ESCAPE / 09'],
  ['Still in motion', 'WATER / 10'],
  ['Small wonders', 'DETAIL / 11'],
  ['Room to breathe', 'SPACE / 12'],
  ['Other horizons', 'DISTANCE / 13'],
  ['Wild at heart', 'NATURE / 14'],
  ['Falling forward', 'FLOW / 15'],
  ['Everything alive', 'WILD / 16'],
  ['Blue between', 'OCEAN / 17'],
  ['No fixed address', 'WANDER / 18'],
  ['An open ending', 'LIGHT / 19'],
  ['A little further', 'ESCAPE / 20'],
  ['Under the canopy', 'FOREST / 21'],
  ['In our nature', 'EARTH / 22'],
  ['Passing through', 'SPACE / 23'],
  ['Another beginning', 'FLOW / 24'],
];
const demos = names.map(([title, category], i) => ({
  id: String(i + 1).padStart(2, '0'),
  title,
  category,
  cover: `/media/covers/${i % photographs.length}.jpg`,
  coverSource: `https://images.unsplash.com/${photographs[i % photographs.length]}?auto=format&fit=crop&w=540&q=85`,
  video: ['/media/ocean.mp4', '/media/41576.mp4', '/media/4075.mp4', '/media/51585.mp4'][i % 4],
  // Video previews are demo footage; covers are an editorial image collection.
  credit: 'Preview footage: Mixkit. Cover photography: Unsplash.',
}));
// Personal films replace the first demo entries. Covers come from each actual film.
export const reels = demos.map((demo, index) => {
  const film = portfolio[index];
  if (!film) return demo;
  return {
    id: film.id,
    title: `História ${film.id}`,
    category: `POR MATHEUS / ${film.id}`,
    cover: `/media/portfolio/${film.id}.jpg`,
    video: `/media/portfolio/${film.id}-preview.mp4`,
    fullVideo: `/media/portfolio/${film.id}.mp4`,
    credit: 'Vídeo realizado por Matheus.',
  };
});
export const CRITICAL_SLOTS = [0, 1, 2, 14, 15];
