const fs = require('fs');
const path = 'c:\\Users\\Oem\\Documents\\GitHub\\lojaonline\\front-end\\src\\pages\\Admin.tsx';
let content = fs.readFileSync(path, 'utf8');

// Replace corrupted quotes
content = content.replace(/\\"/g, '"');

fs.writeFileSync(path, content, 'utf8');
console.log('Fixed Admin.tsx');
