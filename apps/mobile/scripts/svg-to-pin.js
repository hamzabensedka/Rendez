/**
 * One-time script: convert apps/mobile/assets/Gemini_Generated_Image_vvkjtpvvkjtpvvkj.svg
 * to apps/mobile/assets/salon-pin.png (black pin for map markers).
 * Run from repo root: node apps/mobile/scripts/svg-to-pin.js
 * Requires: npm install sharp --save-dev (in apps/mobile or root)
 */
const fs = require('fs');
const path = require('path');

const svgPath = path.join(__dirname, '../assets/Gemini_Generated_Image_vvkjtpvvkjtpvvkj.svg');
const outPath = path.join(__dirname, '../assets/salon-pin.png');

async function run() {
  let sharp;
  try {
    sharp = require('sharp');
  } catch {
    console.warn('Install sharp in apps/mobile: pnpm add -D sharp');
    process.exit(1);
  }
  const svg = fs.readFileSync(svgPath, 'utf8');
  await sharp(Buffer.from(svg))
    .resize(96, 96)
    .png()
    .toFile(outPath);
  console.log('Written', outPath);
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
