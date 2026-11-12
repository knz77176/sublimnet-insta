const { chromium } = require('playwright'); const fs = require('fs'); const path = require('path');
(async () => { const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 2000, height: 700 } });
  const svg = fs.readFileSync(path.join(__dirname, 'assets/logo.svg'), 'utf8');
  await p.setContent(`<html><body style="margin:0;background:transparent"><div id="l" style="width:1800px;padding:30px">${svg.replace('<svg ', '<svg style="width:1800px;display:block" ')}</div></body></html>`);
  await (await p.$('#l')).screenshot({ path: path.join(__dirname, 'assets/logo.png'), omitBackground: true }); await b.close(); })();
