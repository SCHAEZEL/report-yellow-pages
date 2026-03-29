/**
 * update-index.js
 * 从 GitHub API 获取真实文件名，更新 index.html 中的 reports 和 projects 数组
 * 用法: node scripts/update-index.js
 */
const https = require('https');
const fs = require('fs');
const path = require('path');

function fetchJson(url) {
  return new Promise((resolve, reject) => {
    https.get(url, { headers: { 'User-Agent': 'OpenClaw' } }, res => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try { resolve(JSON.parse(data)); }
        catch (e) { reject(e); }
      });
    }).on('error', reject);
  });
}

async function main() {
  const repo = 'SCHAEZEL/report-yellow-pages';
  const branch = 'main';

  const [reportsRes, demosRes] = await Promise.all([
    fetchJson(`https://api.github.com/repos/${repo}/contents/reports?ref=${branch}`),
    fetchJson(`https://api.github.com/repos/${repo}/contents/demos?ref=${branch}`)
  ]);

  const reports = reportsRes
    .filter(f => f.name.endsWith('.md') && f.name !== 'content-ideas.md')
    .map(f => {
      const numMatch = f.name.match(/^(\d+)-/);
      const num = numMatch ? numMatch[1] : '';
      const title = numMatch ? f.name.replace(/^\d+-/, '').replace('.md', '') : f.name.replace('.md', '');
      return {
        num,
        title,
        file: f.name,
        path: `./reports/${f.name}`
      };
    })
    .sort((a, b) => (parseInt(a.num) || 0) - (parseInt(b.num) || 0));

  const projects = demosRes
    .filter(f => f.type === 'dir')
    .map(f => {
      const nameMap = {
        'ai-agent-tracker': 'AI Agent Tracker',
        'ai-unicorn-tracker': 'AI Unicorn Tracker',
        'ai-video-battle': 'AI Video Battle',
        'china-ai-landscape': 'China AI Landscape',
        'china-ev-global-dashboard': 'China EV Dashboard',
        'ai-glasses-earbuds-dashboard': 'AI Glasses & Earbuds Dashboard',
        'ai-coding-tools-battle': 'AI Coding Tools Battle',
        'china-ai-education-map': 'China AI Education Map'
      };
      return {
        name: nameMap[f.name] || f.name.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '),
        desc: '',
        url: `./demos/${f.name}/index.html`
      };
    });

  // Read existing HTML
  const htmlPath = path.join(__dirname, '..', 'index.html');
  let html = fs.readFileSync(htmlPath, 'utf8');

  // Replace reports array
  const reportsStr = `const reports = ${JSON.stringify(reports, null, 2)};`;
  html = html.replace(/const reports = \[[\s\S]*?\];\s*$/m, reportsStr);

  // Replace projects array
  const projectsStr = `const projects = ${JSON.stringify(projects, null, 2)};`;
  html = html.replace(/const projects = \[[\s\S]*?\];\s*$/m, projectsStr);

  fs.writeFileSync(htmlPath, html, 'utf8');
  console.log(`Updated index.html: ${reports.length} reports, ${projects.length} demos`);
}

main().catch(e => { console.error(e); process.exit(1); });
