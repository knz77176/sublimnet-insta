/* Kit commun des pubs SublimNet (rendu déterministe image par image). */
const K = (() => {
  const clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));
  const lerp = (a, b, t) => a + (b - a) * t;
  const P = (t, a, b) => clamp((t - a) / (b - a));
  const eio = x => x < .5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
  const eio2 = x => x < .5 ? 2 * x * x : 1 - Math.pow(-2 * x + 2, 2) / 2;
  const eo = x => 1 - Math.pow(1 - x, 3);
  const eo4 = x => 1 - Math.pow(1 - x, 4);
  const eo5 = x => 1 - Math.pow(1 - x, 5);
  const ei = x => x * x * x;
  const eob = (x, s = 1.6) => { const c3 = s + 1; return 1 + c3 * Math.pow(x - 1, 3) + s * Math.pow(x - 1, 2); };
  const spring = (x, k = 7, d = 4.2) => x <= 0 ? 0 : 1 - Math.exp(-d * x) * Math.cos(k * x);
  const $ = s => document.querySelector(s);
  const el = (tag, cls, html, parent) => { const e = document.createElement(tag); if (cls) e.className = cls; if (html != null) e.innerHTML = html; (parent || document.body).appendChild(e); return e; };
  let VO = null;
  function line(k) { return VO.lines[k]; }
  function on(k) { return VO.lines[k].on; }
  function end(k) { return VO.lines[k].end; }
  const norm = s => s.toLowerCase().replace(/[,.:;!?…]/g, '');
  function W(k, word, nth = 0) {
    const ws = VO.lines[k].words; let n = 0;
    for (const w of ws) if (norm(w[0]).startsWith(norm(word))) { if (n === nth) return w[1]; n++; }
    throw new Error('mot introuvable ' + k + ' ' + word);
  }
  function WE(k, word, nth = 0) {
    const ws = VO.lines[k].words; let n = 0;
    for (const w of ws) if (norm(w[0]).startsWith(norm(word))) { if (n === nth) return w[2]; n++; }
    throw new Error('mot introuvable ' + k + ' ' + word);
  }
  const typed = (str, t, a, b) => { if (t < a) return ''; const n = Math.floor(P(t, a, b) * str.length) + 1; return str.slice(0, Math.min(n, str.length)); };
  const fmt = (v, dec = 2) => v.toFixed(dec).replace('.', ',').replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  // odometer: each digit rolls; returns html
  function odo(value, dec = 2, suffix = ' €') {
    const s = fmt(value, dec);
    let html = '';
    for (const ch of s) {
      if (/\d/.test(ch)) html += `<span class="dg">${ch}</span>`; else html += `<span class="sp">${ch}</span>`;
    }
    return html + `<span class="sp">${suffix}</span>`;
  }
  // smooth pseudo-noise for camera/hand shake
  const noise = (t, seed = 1) => Math.sin(t * 1.3 + seed) * .5 + Math.sin(t * 2.17 + seed * 2.3) * .3 + Math.sin(t * 3.71 + seed * 4.1) * .2;
  async function boot(voUrl, build, render) {
    VO = await (await fetch(voUrl)).json();
    K.VO = VO;
    build();
    await document.fonts.ready;
    await Promise.all([...document.images].map(i => i.complete ? 0 : new Promise(r => { i.onload = i.onerror = r; })));
    window.render = t => render(t);
    render(0);
    return true;
  }
  return { clamp, lerp, P, eio, eio2, eo, eo4, eo5, ei, eob, spring, $, el, on, end, line, W, WE, typed, fmt, odo, noise, boot, VO: null };
})();
