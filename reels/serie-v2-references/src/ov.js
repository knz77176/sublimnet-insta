const { chromium } = require('playwright');
(async () => { const b = await chromium.launch(); for (const v of ['A', 'B', 'C']) { const p = await b.newPage({ viewport: { width: 1080, height: 1920 } });
  await p.goto(`http://127.0.0.1:8767/scene.html?v=${v}&ov=only`); await p.evaluate(() => window.__ready); await p.waitForTimeout(400);
  await p.screenshot({ path: `ov${v}.png`, omitBackground: true }); await p.close(); } await b.close(); })();
