import fs from 'fs';
const html = fs.readFileSync('index.html', 'utf8');
const fIdx = html.indexOf('uFa', 32400);
console.log('uFa pos:', fIdx);
if (fIdx !== -1) {
  console.log(html.substring(fIdx - 100, fIdx + 800));
}
