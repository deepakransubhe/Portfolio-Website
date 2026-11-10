import fs from 'fs';
const shader = fs.readFileSync('allan_fs.glsl', 'utf8');
const matches = [...shader.matchAll(/\$\{[^\}]+\}/g)];
console.log('Template expressions in shader:', matches.map(m => m[0]));
