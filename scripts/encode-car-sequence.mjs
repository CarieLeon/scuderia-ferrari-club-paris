/** Encode the native Blender frames as responsive, locally served WebPs.
 * node scripts/encode-car-sequence.mjs <render-folder> [output-folder]
 */
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { resolve, join } from 'node:path';
import sharp from 'sharp';

const input = process.argv[2];
if (!input) throw new Error('Pass the folder containing frame-000.png to frame-103.png.');
const output = resolve(process.argv[3] && !process.argv[3].startsWith('--') ? process.argv[3] : 'public/images/car-sequence');
const waitForRenders = process.argv.includes('--wait-for-renders');
for (const variant of ['desktop', 'mobile']) await mkdir(join(output, variant), { recursive: true });
let total = { desktop: 0, mobile: 0 };
// Keep encoding sequential so the renderer can use the GPU and most memory.
const order = [0, 59, 103, ...Array.from({ length: 104 }, (_, index) => index).filter(index => ![0, 59, 103].includes(index))];
for (const frame of order) {
  const name = `frame-${String(frame).padStart(3, '0')}`;
  let source;
  const deadline = Date.now() + 30 * 60 * 1000;
  while (!source) {
    try {
      const bytes = await readFile(join(input, `${name}.png`));
      await sharp(bytes).stats(); // Blender may still be writing the PNG.
      source = bytes;
    } catch (error) {
      if (!waitForRenders || Date.now() > deadline) throw error;
      await new Promise(resolve => setTimeout(resolve, 500));
    }
  }
  const metadata = await sharp(source).metadata();
  if (metadata.width !== 1280 || metadata.height !== 800) throw new Error(`Unexpected dimensions: ${name}`);
  for (const [variant, width, quality] of [['desktop', 1280, 84], ['mobile', 768, 79]]) {
    const encoded = await sharp(source).resize({ width }).removeAlpha().webp({ quality, effort: 5 }).toBuffer();
    await writeFile(join(output, variant, `${name}.webp`), encoded);
    total[variant] += encoded.length;
  }
  if (frame % 20 === 0 || [0, 59, 103].includes(frame)) console.log(`Encoded ${name}`);
}
const manifest = { count: 104, width: 1280, height: 800, mobileWidth: 768, mobileHeight: 480, keyframes: [0, 59, 103], bytes: total };
await writeFile(join(output, 'manifest.json'), JSON.stringify(manifest, null, 2) + '\n');
console.log(manifest);
