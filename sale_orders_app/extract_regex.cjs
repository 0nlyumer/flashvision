const fs = require('fs');
const path = require('path');
const brain = 'C:/Users/Track Computers/.gemini/antigravity/brain';
const dirs = fs.readdirSync(brain);
let fileLines = {};

for(const dir of dirs){
  const log = path.join(brain, dir, '.system_generated', 'logs', 'overview.txt');
  if(fs.existsSync(log)){
    const d = fs.readFileSync(log, 'utf8');
    const matches = [...d.matchAll(/(\d+): (.*?)(?=\\n|\")/g)];
    for(const m of matches){
      if(parseInt(m[1]) > 0 && parseInt(m[1]) < 1500) {
        fileLines[parseInt(m[1])] = m[2].replace(/\\\\/g, '\\').replace(/\\"/g, '"').replace(/\\t/g, '\t');
      }
    }
  }
}

const maxLn = Math.max(...Object.keys(fileLines).map(Number));
console.log('Max line:', maxLn, 'Extracted:', Object.keys(fileLines).length);

let rec = '';
for(let i=1; i<=maxLn; i++){
  rec += (fileLines[i] !== undefined ? fileLines[i] : '// MISSING LINE '+i) + '\n';
}
fs.writeFileSync('reconstructed_AppContext.jsx', rec);
