const { chromium } = require('playwright');
(async () => { const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1080, height: 1920 }, deviceScaleFactor: 1 });
  p.on('pageerror', e => console.log('[err]', e.message));
  await p.goto('http://127.0.0.1:8769/why.html'); await p.evaluate(() => window.__ready);
  await p.screenshot({ path: 'why.png' }); await b.close(); })();
