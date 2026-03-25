import { writeFileSync } from 'fs';
import { createCanvas } from '@napi-rs/canvas';

function createIcon(size) {
  const canvas = createCanvas(size, size);
  const ctx = canvas.getContext('2d');

  // Dark background
  ctx.fillStyle = '#0d0d0f';
  ctx.fillRect(0, 0, size, size);

  // Emoji centered
  const fontSize = Math.round(size * 0.65);
  ctx.font = `${fontSize}px "Apple Color Emoji"`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('\ud83d\udcaa', size / 2, size / 2 + size * 0.03);

  return canvas.toBuffer('image/png');
}

writeFileSync('public/icons/icon-192.png', createIcon(192));
writeFileSync('public/icons/icon-512.png', createIcon(512));
writeFileSync('public/icons/apple-touch-icon.png', createIcon(180));

console.log('Icons generated successfully');
