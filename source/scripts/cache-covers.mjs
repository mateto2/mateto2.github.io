import { mkdir, writeFile } from 'node:fs/promises';
import { reels } from '../src/reels.js';

await mkdir('public/media/covers', { recursive: true });
const unique = [...new Set(reels.map(reel => reel.coverSource))];
for (let batch = 0; batch < unique.length; batch += 4) {
  await Promise.all(unique.slice(batch, batch + 4).map(async (url, i) => {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`Cover ${batch + i}: HTTP ${response.status}`);
    await writeFile(`public/media/covers/${batch + i}.jpg`, Buffer.from(await response.arrayBuffer()));
  }));
}
console.log(`Cached ${unique.length} cover images.`);
