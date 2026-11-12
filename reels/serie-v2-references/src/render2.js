// usage: node render2.js <url> <outdir> <w> <h> stills t1 t2 ... | all <fps> <dur> [start end]
const { chromium } = require('playwright'); const fs = require('fs');
(async () => {
  const [url, outdir, w, h, mode, ...rest] = process.argv.slice(2);
  fs.mkdirSync(outdir, { recursive: true });
  const b = await chromium.launch({ args: ['--font-render-hinting=none', '--disable-web-security', '--allow-file-access-from-files'] });
  const p = await b.newPage({ viewport: { width: +w, height: +h }, deviceScaleFactor: 1 });
  p.on('pageerror', e => console.log('[err]', e.message)); p.on('console', m => { if (m.type() === 'error') console.log('[console]', m.text()); });
  await p.goto(url); await p.evaluate(() => window.__ready);
  const cdp = await p.context().newCDPSession(p);
  const shot = async f => { const r = await cdp.send('Page.captureScreenshot', { format: 'png', fromSurface: true }); fs.writeFileSync(f, Buffer.from(r.data, 'base64')); };
  const frame = async t => { await p.evaluate(t => window.render(t), t); await p.evaluate(() => (window.__frameReady ? window.__frameReady() : null)); await p.evaluate(() => new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r)))); };
  if (mode === 'stills') { for (const t of rest) { await frame(+t); await shot(`${outdir}/t${(+t).toFixed(2)}.png`); } }
  else {
    const [fps, dur, start = 0, end] = rest.map(Number); const n = Math.round(dur * fps);
    for (let i = start; i < (end || n); i++) { await frame(i / fps); await shot(`${outdir}/f${String(i).padStart(5, '0')}.png`); }
  }
  await b.close();
})();
