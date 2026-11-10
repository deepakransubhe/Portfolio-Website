import fs from 'fs';
const c = fs.readFileSync('C:/Users/Deepak/.gemini/antigravity/brain/d74eed6b-2e38-4997-89ca-dbf321819a0d/scratch/allanleone_extracted/allanleone.com/assets/index-81028Cvm.js', 'utf8');

const vsIdx = c.indexOf('void main() {');
const vsEnd = c.indexOf('`', vsIdx);
const vs = c.substring(c.lastIndexOf('`', vsIdx) + 1, vsEnd);

const fsIdx = c.indexOf('#version 300 es', vsEnd);
const fsEnd = c.indexOf('`', fsIdx);
const fsShader = c.substring(fsIdx, fsEnd);

console.log('FS length:', fsShader.length);
fs.writeFileSync('allan_fs.glsl', fsShader);
console.log('Saved allan_fs.glsl');
