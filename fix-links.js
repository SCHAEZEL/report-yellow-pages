const fs = require('fs');
const path = 'E:/ClaudeCode/Startup/projects/report-yellow-pages/index.html';
let html = fs.readFileSync(path, 'utf8');

// Replace local path values with GitHub URLs (path key is NOT quoted)
html = html.replace(/path:"\.\/reports\//g, 'path:"https://github.com/SCHAEZEL/report-yellow-pages/blob/main/reports/');

// Replace local demo urls with GitHub tree URLs (url key is NOT quoted)
html = html.replace(/url:"\.\/demos\//g, 'url:"https://github.com/SCHAEZEL/report-yellow-pages/tree/main/demos/');

// Update renderReports to use r.path directly instead of prepending ./reports/
html = html.replace(
  'return `<a class="card" href="./reports/${r.file}" target="_blank">',
  'return `<a class="card" href="${r.path}" target="_blank">'
);

fs.writeFileSync(path, html, 'utf8');
console.log('Done');
