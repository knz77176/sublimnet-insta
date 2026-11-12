/* Kit TikTok : sous-titres mot à mot, accroches, révélations, punchs caméra. */
const TK = (() => {
  const A = K; // adkit helpers
  const { clamp, lerp, P, eo, eio, eob } = A;
  // ---- word-by-word captions built from the voice-over word timings
  let chunks = [], capEl = null, capIdx = -2;
  function buildCaptions(lines, opts = {}) {
    const rep = opts.replace || {};
    const maxW = opts.maxWords || 3, maxC = opts.maxChars || 16;
    chunks = [];
    for (const k of Object.keys(A.VO.lines)) {
      if (opts.skip && opts.skip.includes(k)) continue;
      let ws = A.VO.lines[k].words.filter(w => !/^[:;?!…,.]+$/.test(w[0]));
      if (opts.dropFirst && opts.dropFirst.includes(k)) ws = ws.slice(1);
      // merge tokens through a per-page rule (e.g. "Sublim Net point com." -> "sublimnet.com")
      const out = [];
      for (let i = 0; i < ws.length; i++) {
        let merged = false;
        for (const [seq, txt] of (opts.merge || [])) {
          const n = seq.length; const slice = ws.slice(i, i + n).map(w => w[0].toLowerCase().replace(/[,.:;!?…]/g, ''));
          if (slice.join(' ') === seq.join(' ')) { out.push([txt, ws[i][1], ws[i + n - 1][2]]); i += n - 1; merged = true; break; }
        }
        if (!merged) { const raw = ws[i][0]; const key = raw.toLowerCase().replace(/[,.:;!?…]/g, ''); out.push([rep[key] ?? raw.replace(/…/g, '...'), ws[i][1], ws[i][2]]); }
      }
      let cur = [];
      const flush = () => { if (cur.length) chunks.push({ k, words: cur }); cur = []; };
      out.forEach(w => {
        const len = cur.map(x => x[0]).join(' ').length + w[0].length;
        if (cur.length >= maxW || (cur.length && len > maxC)) flush();
        cur.push(w);
        if (/[.?!]$/.test(w[0]) && !/sublimnet\.com/i.test(w[0])) flush();
      });
      flush();
    }
    chunks.forEach((c, i) => { c.t0 = c.words[0][1] - 0.06; const nx = chunks[i + 1]; c.t1 = nx && nx.k === c.k ? nx.words[0][1] - 0.06 : A.VO.lines[c.k].end + 0.18; });
  }
  function captions(tt, hide) {
    if (!capEl) capEl = document.getElementById('cap');
    let idx = -1; for (let i = 0; i < chunks.length; i++) if (tt >= chunks[i].t0 && tt < chunks[i].t1) idx = i;
    if (hide && hide(tt)) idx = -1;
    if (idx !== capIdx) { capIdx = idx; capEl.innerHTML = idx < 0 ? '' : chunks[idx].words.map(w => `<span class="w">${w[0]}</span>`).join(''); }
    if (idx < 0) return;
    const c = chunks[idx]; const q = eob(P(tt, c.t0, c.t0 + 0.22), 2.2);
    capEl.style.transform = `scale(${(0.75 + 0.25 * q).toFixed(3)})`;
    capEl.querySelectorAll('.w').forEach((w, i) => w.classList.toggle('on', tt >= c.words[i][1] - 0.04 && (i + 1 >= c.words.length || tt < c.words[i + 1][1] - 0.04)));
  }
  // ---- camera punches: list of {t, s (zoom add), shake}
  function camera(tt, punches, base = 1) {
    let s = base, x = 0, y = 0, r = 0;
    for (const p of punches) {
      const d = tt - p.t; if (d < 0 || d > (p.dur || 0.5)) continue;
      const q = d / (p.dur || 0.5); const env = Math.exp(-q * 5);
      s += (p.z || 0.08) * env;
      const sh = (p.shake || 0) * env;
      x += Math.sin(d * 70) * sh; y += Math.cos(d * 55) * sh * 0.8; r += Math.sin(d * 45) * sh * 0.06;
    }
    return { s, x, y, r };
  }
  function pop(el, tt, t0, dur = 0.4, from = 0.4, k = 2.0) { const q = eob(P(tt, t0, t0 + dur), k); el.style.opacity = clamp(P(tt, t0, t0 + 0.08) * 1.0).toFixed(3); return from + (1 - from) * q; }
  function hide(el, tt, t1, dur = 0.25) { return 1 - eio(P(tt, t1, t1 + dur)); }
  return { buildCaptions, captions, camera, pop, hide };
})();
