import { writeFileSync } from 'fs';
import { deflateSync } from 'zlib';

function crc32(buf) {
  let crc = 0xFFFFFFFF;
  const table = new Int32Array(256);
  for (let i = 0; i < 256; i++) {
    let c = i;
    for (let j = 0; j < 8; j++) {
      c = (c & 1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1);
    }
    table[i] = c;
  }
  for (let i = 0; i < buf.length; i++) {
    crc = table[(crc ^ buf[i]) & 0xFF] ^ (crc >>> 8);
  }
  return (crc ^ 0xFFFFFFFF) | 0;
}

function createPNG(size) {
  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

  // IHDR
  const ihdr = Buffer.alloc(25);
  ihdr.writeUInt32BE(13, 0);
  ihdr.write('IHDR', 4);
  ihdr.writeUInt32BE(size, 8);
  ihdr.writeUInt32BE(size, 12);
  ihdr.writeUInt8(8, 16);
  ihdr.writeUInt8(2, 17);
  ihdr.writeUInt8(0, 18);
  ihdr.writeUInt8(0, 19);
  ihdr.writeUInt8(0, 20);
  ihdr.writeInt32BE(crc32(ihdr.subarray(4, 21)), 21);

  // Image data: dark background with colored circle
  const rawData = [];
  const bg = [13, 13, 15];
  const accent = [232, 83, 58];
  const center = size / 2;
  const radius = size * 0.3;

  for (let y = 0; y < size; y++) {
    rawData.push(0);
    for (let x = 0; x < size; x++) {
      const dist = Math.sqrt((x - center) ** 2 + (y - center) ** 2);
      if (dist < radius) {
        rawData.push(accent[0], accent[1], accent[2]);
      } else {
        rawData.push(bg[0], bg[1], bg[2]);
      }
    }
  }

  const compressed = deflateSync(Buffer.from(rawData));
  const idat = Buffer.alloc(compressed.length + 12);
  idat.writeUInt32BE(compressed.length, 0);
  idat.write('IDAT', 4);
  compressed.copy(idat, 8);
  idat.writeInt32BE(crc32(Buffer.concat([Buffer.from('IDAT'), compressed])), compressed.length + 8);

  const iend = Buffer.from([0, 0, 0, 0, 73, 69, 78, 68, 174, 66, 96, 130]);

  return Buffer.concat([signature, ihdr, idat, iend]);
}

writeFileSync('public/icons/icon-192.png', createPNG(192));
writeFileSync('public/icons/icon-512.png', createPNG(512));
writeFileSync('public/icons/apple-touch-icon.png', createPNG(180));

console.log('Icons generated successfully');
