const fs = require('fs');

const data = fs.readFileSync('C:/Users/Track Computers/.gemini/antigravity/brain/2214dc55-6571-49b5-9ed8-34cc8e7032db/.system_generated/logs/overview.txt', 'utf8');

const lines = data.split('\n');
let fileLines = {};

for (const line of lines) {
  if (!line.trim()) continue;
  try {
    const obj = JSON.parse(line);
    if (obj.tool_responses) {
      for (const res of obj.tool_responses) {
        if (res.name === 'view_file' && res.response && res.response.output) {
          const out = res.response.output;
          if (out.includes('c:/Flashvision/sale_orders_app/src/context/AppContext.jsx')) {
             const outLines = out.split('\n');
             for (const o of outLines) {
                 const m = o.match(/^(\d+): (.*)$/);
                 if (m) {
                     fileLines[parseInt(m[1])] = m[2];
                 }
             }
          }
        }
      }
    }
  } catch (e) {
  }
}

const maxLn = Math.max(...Object.keys(fileLines).map(Number));
console.log('Max line found:', maxLn, 'Total extracted:', Object.keys(fileLines).length);

let reconstructed = '';
for (let i = 1; i <= maxLn; i++) {
  reconstructed += (fileLines[i] !== undefined ? fileLines[i] : '// MISSING LINE ' + i) + '\n';
}

fs.writeFileSync('reconstructed_AppContext.jsx', reconstructed);
console.log('Written to reconstructed_AppContext.jsx');
