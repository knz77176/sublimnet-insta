// usage: node render.js <url> <outdir> <mode: stills|all> [times...]
const { chromium } = require('playwright'); const fs = require('fs');
(async () => {
  const [url, outdir, mode, ...rest] = process.argv.slice(2);
  fs.mkdirSync(outdir, { recursive: true });
  const b = await chromium.launch({ args: ['--font-render-hinting=none'] });
  const p = await b.newPage({ viewport: { width: 1080, height: 1920 }, deviceScaleFactor: 1 });
  p.on('console', m => console.log('[page]', m.text())); p.on('pageerror', e => console.log('[err]', e.message));
  await p.goto(url); await p.evaluate(() => window.__ready);
  const cdp = await p.context().newCDPSession(p);
  const shot = async (file) => {
    const r = await cdp.send('Page.captureScreenshot', { format: 'png', fromSurface: true });
    fs.writeFileSync(file, Buffer.from(r.data, 'base64'));
  };
  if (mode === 'stills') {
    for (const t of rest) { await p.evaluate(t => window.render(+t), t); await p.evaluate(() => new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r)))); await shot(`${outdir}/t${(+t).toFixed(2)}.png`); }
  } else {
    const [fps, dur, start = 0, end] = rest.map(Number); const n = Math.round(dur * fps);
    const t0 = Date.now();
    for (let i = start; i < (end || n); i++) {
      await p.evaluate(t => window.render(t), i / fps);
      await p.evaluate(() => new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r))));
      await shot(`${outdir}/f${String(i).padStart(5, '0')}.png`);
      if (i % 60 === 0) console.log('frame', i, ((Date.now() - t0) / 1000).toFixed(1) + 's');
    }
  }
  await b.close();
})();
