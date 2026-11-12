const { chromium } = require('playwright'); const fs = require('fs');
(async () => { const b = await chromium.launch();
  for (const R of ['A', 'B', 'C']) { const p = await b.newPage({ viewport: { width: 1080, height: 1920 } });
    await p.goto(`http://127.0.0.1:8768/tk${R}.html`); await p.evaluate(() => window.__ready);
    const ev = await p.evaluate(() => ({ t: T.t, cuts: T.cuts, punch: T.punch })); fs.writeFileSync(`ev${R}.json`, JSON.stringify(ev, null, 1)); await p.close(); }
  await b.close(); })();
