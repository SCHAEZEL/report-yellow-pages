const fs = require('fs');
const h = fs.readFileSync('E:/ClaudeCode/Startup/projects/report-yellow-pages/index.html', 'utf8');

// Find the projects array start
const projectsIdx = h.indexOf('const projects = [');
console.log('projects array starts at:', projectsIdx);

// Find url in the projects data
const dataUrlIdx = h.indexOf('url:', projectsIdx + 10);
console.log('first url: in projects at:', dataUrlIdx);
console.log('content:', JSON.stringify(h.substring(dataUrlIdx - 5, dataUrlIdx + 50)));
