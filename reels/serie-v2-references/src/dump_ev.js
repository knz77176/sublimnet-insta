const { chromium } = require('playwright'); const fs = require('fs');
(async () => {
  const b = await chromium.launch();
  for (const [R, w, h] of [['A', 1600, 1000], ['B', 1600, 1000], ['C', 1600, 900]]) {
    const p = await b.newPage({ viewport: { width: w, height: h } });
    await p.goto(`http://127.0.0.1:8767/ad${R}.html`); await p.evaluate(() => window.__ready);
    const ev = await p.evaluate(() => ({ t: T.t, clicks: T.clicks || [], steps: T.steps || [] }));
    fs.writeFileSync(`ev${R}.json`, JSON.stringify(ev, null, 1)); await p.close();
  }
  await b.close();
})();
