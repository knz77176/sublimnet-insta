/* Moteur commun des Reels SublimNet : caméra 3D, tuiles, téléphone, textes, écran de fin.
   Chaque page définit le décor (#world) et éventuellement window.scene(t, E).
   Rendu déterministe : window.render(t) dessine l'image à l'instant t. */
const E = (() => {
  const $ = s => document.querySelector(s);
  const clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));
  const lerp = (a, b, t) => a + (b - a) * t;
  const P = (t, a, b) => clamp((t - a) / (b - a));
  const eio = x => x < .5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
  const eo = x => 1 - Math.pow(1 - x, 3);
  const eo5 = x => 1 - Math.pow(1 - x, 5);
  const eob = x => { const c1 = 1.5, c3 = c1 + 1; return 1 + c3 * Math.pow(x - 1, 3) + c1 * Math.pow(x - 1, 2); };
  const K = 1.34359, PH = { x: 834, y: 700 };
  let TL, TILES = [], capIdx = -2, popEls = [];
  const blink = t => (Math.floor(t * 2.2) % 2 === 0);
  const typed = (str, t, r) => { const n = Math.floor(P(t, r[0], r[1]) * str.length + (t >= r[0] ? 1 : 0)); return str.slice(0, clamp(n, 0, str.length)); };

  function off(el, anc) {
    let x = 0, y = 0, e = el;
    while (e && e !== anc) { x += e.offsetLeft; y += e.offsetTop; e = e.offsetParent; }
    return { x, y, w: el.offsetWidth, h: el.offsetHeight };
  }
  function worldCenter(id) {
    const el = document.getElementById(id); const o = off(el, $('#world'));
    return { cx: o.x + o.w / 2, cy: o.y + o.h / 2 };
  }

  const ICONS = `<svg width="78" height="14" viewBox="0 0 78 14"><g fill="#111"><rect x="0" y="9" width="3.4" height="5" rx="1"/><rect x="5" y="6.5" width="3.4" height="7.5" rx="1"/><rect x="10" y="4" width="3.4" height="10" rx="1"/><rect x="15" y="1" width="3.4" height="13" rx="1"/></g><path d="M31 4.5a10 10 0 0 1 13 0M33.5 7.5a6.2 6.2 0 0 1 8 0M36 10.4a2.4 2.4 0 0 1 3 0" stroke="#111" stroke-width="2" fill="none" stroke-linecap="round"/><rect x="51" y="1" width="23" height="12" rx="3.5" fill="none" stroke="#111" stroke-opacity=".45"/><rect x="53" y="3" width="16" height="8" rx="2" fill="#111"/></svg>`;

  function buildPhone() {
    const ph = $('#phone'); if (!ph) return;
    let shots = '';
    for (const s of TL.shotList || []) {
      if (s.kind === 'hero') shots += `<div class="shot" id="${s.id}"><img class="hero" src="assets/${s.id}.jpg"></div>`;
      else if (s.kind === 'recap') shots += `<div class="shot" id="${s.id}"><div class="hdr"><img src="assets/logo.svg"><div class="burger"></div></div><img src="assets/recap.jpg" style="position:absolute;left:0;top:84px;width:390px"></div>`;
      else shots += `<div class="shot" id="${s.id}"><img class="cover" src="assets/${s.id}.jpg"></div>`;
    }
    const hls = (TL.hl || []).map((h, i) => `<div class="hl" id="hl${i}"></div>`).join('');
    const sh = TL.sheet ? `<div id="dim"></div><div id="sheet"><div class="grab"></div>
      <svg width="88" height="88" viewBox="0 0 92 92"><defs><linearGradient id="cg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#774F9B"/><stop offset="1" stop-color="#4F74B9"/></linearGradient></defs>
      <circle id="ckC" cx="46" cy="46" r="40" fill="none" stroke="url(#cg)" stroke-width="5" stroke-linecap="round" transform="rotate(-90 46 46)" stroke-dasharray="251.3" stroke-dashoffset="251.3"/>
      <path id="ckP" d="M28 47 L41 60 L65 34" fill="none" stroke="url(#cg)" stroke-width="6" stroke-linecap="round" stroke-linejoin="round" stroke-dasharray="60" stroke-dashoffset="60"/></svg>
      <h2>Réservation confirmée</h2><p class="sub">${TL.sheet.sub || 'Merci, à très vite !'}</p>
      <div class="det">${(TL.sheet.rows || []).map(r => `<div><span>${r[0]}</span><b>${r[1]}</b></div>`).join('')}</div></div>` : '';
    ph.innerHTML = `<div id="screen"><div id="content">
      <div class="status"><span>10:02</span><span>${ICONS}</span></div>
      <div id="vp">${shots}${hls}
        <div id="bars"><div class="cbar"><div class="call">📞 Appeler</div><div class="wa">WhatsApp</div></div><div class="sbar"><span>sublimnet.com</span></div></div>
        ${sh}
      </div>
      <div id="tap"></div><div id="island"></div><div id="off"></div>
    </div></div>`;
  }

  function buildEnd() {
    const c = TL.endcard || {};
    $('#end').innerHTML = `
      <div id="endLogo"><img src="assets/logo.svg" alt=""></div>
      <div id="endTag">${c.tag || ''}</div>
      <div id="endSub">${c.sub || 'NETTOYAGE À DOMICILE · BORDEAUX'}</div>
      <div id="endStars"><i>★★★★★</i>5,0 sur Google</div>
      <div id="endBar"><svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="#6b7383" stroke-width="2.6"><circle cx="10.5" cy="10.5" r="7"/><path d="M16 16l5 5"/></svg><span id="url"></span><i class="caret" id="urlCaret"></i></div>
      <div id="endBtn">${c.btn || 'Réserver en ligne'}</div>
      <div id="endFoot">${c.foot || 'Bordeaux &amp; alentours · 7j/7'}</div>`;
  }

  /* ---------------- per-frame parts ---------------- */
  function pulseAmt(id, t) {
    let a = 0;
    for (const p of TL.pulses || []) if (p.id === id) a = Math.max(a, P(t, p.t - 0.05, p.t + 0.12) * (1 - P(t, p.t + 0.35, p.t + 0.75)));
    return a;
  }
  function tiles(t) {
    for (const ti of TILES) {
      const q = eo5(P(t, ti.delay - 0.32, ti.delay + 0.7));
      const pa = pulseAmt(ti.el.id, t);
      ti.el.style.transform = `translate3d(0, ${((1 - q) * 160).toFixed(1)}px, ${((1 - q) * -1100 + pa * 60).toFixed(1)}px) scale(${(1 + pa * 0.07).toFixed(4)})`;
      ti.el.style.opacity = clamp(q * 1.6).toFixed(3);
      if (ti.el.id && ti.el.id !== 'phone') ti.el.style.boxShadow = pa > 0.01
        ? `0 0 0 ${(6 * pa).toFixed(1)}px rgba(122,77,158,${(0.55 * pa).toFixed(2)}), 0 60px 90px -26px rgba(28,38,70,.38)` : '';
    }
  }
  function camera(t) {
    let st = { ...TL.camStart };
    for (const m of TL.cam) {
      if (t < m.t[0]) break;
      const q = eio(P(t, m.t[0], m.t[1]));
      const to = { ...m.to };
      if (to.focus) { const c = worldCenter(to.focus); to.cx = c.cx + (to.dx || 0); to.cy = c.cy + (to.dy || 0); }
      const nx = {};
      for (const k of ['cx', 'cy', 's', 'rx', 'rz', 'ay']) nx[k] = lerp(st[k], to[k] ?? st[k], q);
      st = nx;
    }
    st.cy += Math.sin(t * 0.7) * 5; st.rz += Math.sin(t * 0.45) * 0.35;
    $('#world').style.transform = `translate(540px, ${st.ay.toFixed(2)}px) rotateX(${st.rx.toFixed(3)}deg) rotateZ(${st.rz.toFixed(3)}deg) scale(${st.s.toFixed(4)}) translate(${-st.cx.toFixed(2)}px, ${-st.cy.toFixed(2)}px)`;
  }
  function captions(t) {
    const caps = TL.captions; let idx = -1;
    for (let i = 0; i < caps.length; i++) if (t >= caps[i].in - 0.01 && t < caps[i].out + 0.35) idx = i;
    const el = $('#cap');
    if (idx !== capIdx) {
      capIdx = idx;
      if (idx < 0) { el.innerHTML = ''; return; }
      const c = caps[idx];
      const mk = s => s.split(' ').map(w => `<span class="w">${w}</span>`).join('');
      el.innerHTML = `<div class="l1">${mk(c.a)}</div><div class="l2">${mk(c.b)}</div>`;
      for (const l of el.children) { l.style.fontSize = ''; const w = l.scrollWidth; if (w > 1000) l.style.fontSize = (parseFloat(getComputedStyle(l).fontSize) * 1000 / w).toFixed(1) + 'px'; }
    }
    if (idx < 0) return;
    const c = caps[idx]; const ws = el.querySelectorAll('.w'); const nA = c.a.split(' ').length;
    ws.forEach((w, i) => {
      const acc = i >= nA; const d = c.in + i * 0.07 + (acc ? 0.1 : 0);
      const q = eo(P(t, d, d + (acc ? 0.5 : 0.38))); const oq = eio(P(t, c.out, c.out + 0.3));
      w.style.opacity = (q * (1 - oq)).toFixed(3);
      w.style.filter = `blur(${((1 - q) * (acc ? 18 : 10) + oq * 10).toFixed(2)}px)`;
      w.style.transform = `translateY(${((1 - q) * 34 - oq * 26).toFixed(1)}px)`;
    });
  }
  function phone(t) {
    if (!$('#phone')) return;
    const on = TL.phoneOn == null ? 1e9 : TL.phoneOn;
    $('#off').style.opacity = (1 - eo(P(t, on, on + 0.35))).toFixed(3);
    // shots crossfade
    const list = TL.shots || [];
    for (const s of TL.shotList || []) {
      let op = 0;
      for (let i = 0; i < list.length; i++) {
        if (list[i].id !== s.id) continue;
        const tin = list[i].t, tout = i + 1 < list.length ? list[i + 1].t : 1e9;
        op = Math.max(op, P(t, tin, tin + 0.3) * (1 - P(t, tout, tout + 0.3)));
      }
      const el = document.getElementById(s.id);
      el.style.opacity = op.toFixed(3);
      const sc = list.find(x => x.id === s.id && x.scroll);
      el.style.transform = sc ? `translateY(${(-sc.scroll[2] * eio(P(t, sc.scroll[0], sc.scroll[1]))).toFixed(1)}px)` : '';
    }
    (TL.hl || []).forEach((h, i) => {
      const el = document.getElementById('hl' + i);
      const q = eob(P(t, h.t0, h.t0 + 0.35)) * (1 - P(t, h.t1, h.t1 + 0.25));
      const sc = (TL.shots || []).find(x => x.id === h.shot && x.scroll);
      const dy = sc ? -sc.scroll[2] * eio(P(t, sc.scroll[0], sc.scroll[1])) : 0;
      el.style.left = h.r[0] + 'px'; el.style.top = (h.r[1] + dy) + 'px'; el.style.width = h.r[2] + 'px'; el.style.height = h.r[3] + 'px';
      el.style.opacity = clamp(q).toFixed(3); el.style.transform = `scale(${(0.94 + 0.06 * q).toFixed(3)})`;
    });
    const tap = $('#tap'); tap.style.opacity = 0;
    for (const tp of TL.taps || []) {
      if (t < tp.t - 0.12 || t > tp.t + 0.4) continue;
      const a = P(t, tp.t - 0.12, tp.t), b = P(t, tp.t + 0.05, tp.t + 0.4);
      tap.style.left = tp.x + 'px'; tap.style.top = (tp.y + 47) + 'px';
      tap.style.opacity = (eo(a) * (1 - b)).toFixed(3);
      tap.style.transform = `scale(${(1.25 - 0.35 * eo(a) + 0.5 * b).toFixed(3)})`;
    }
    if (TL.sheet) {
      const s = TL.sheet, q = eo(P(t, s.t0, s.t1));
      $('#sheet').style.transform = `translateY(${((1 - q) * 105).toFixed(2)}%)`;
      $('#dim').style.opacity = q.toFixed(3);
      $('#ckC').setAttribute('stroke-dashoffset', (251.3 * (1 - eio(P(t, s.check, s.check + 0.35)))).toFixed(2));
      $('#ckP').setAttribute('stroke-dashoffset', (60 * (1 - eo(P(t, s.check + 0.25, s.check + 0.6)))).toFixed(2));
    }
  }
  function counts(t) {
    for (const c of TL.counts || []) {
      const el = document.getElementById(c.id); if (!el) continue;
      const q = eo(P(t, c.t, c.t + (c.dur || 0.6)));
      el.textContent = (c.pre || '') + Math.round(lerp(c.from || 0, c.to, q)) + (c.suf || '');
      const wrap = document.getElementById(c.id + 'w');
      if (wrap) wrap.style.opacity = P(t, c.t - 0.08, c.t + 0.12).toFixed(3);
    }
  }
  function pops(t) {
    for (const p of TL.pops || []) {
      const el = document.getElementById(p.id); if (!el) continue;
      const q = P(t, p.t, p.t + 0.42);
      el.style.opacity = clamp(q * 2.5).toFixed(3);
      el.style.transform = `scale(${(0.5 + 0.5 * eob(q)).toFixed(3)})`;
    }
  }
  function endcard(t) {
    const e = TL.end;
    const bq = eio(P(t, e.blur[0], e.blur[1]));
    $('#persp').style.filter = bq > 0 ? `blur(${(bq * 26).toFixed(2)}px)` : 'none';
    $('#persp').style.transform = `scale(${1 + bq * 0.06})`;
    $('#veil').style.opacity = bq.toFixed(3);
    $('#fog').style.opacity = (1 - bq).toFixed(3);
    const lq = P(t, e.logo[0], e.logo[1]);
    const L = $('#endLogo');
    L.style.clipPath = `inset(-20% ${(100 - eio(lq) * 100).toFixed(2)}% -20% 0)`;
    L.style.opacity = lq > 0 ? 1 : 0;
    L.style.transform = `translateY(${(1 - eo(lq)) * 20}px) scale(${0.96 + 0.04 * eo(lq)})`;
    const fade = (s, tt, dy = 24) => { const q = eo(P(t, tt, tt + 0.45)); const el = $(s); el.style.opacity = q.toFixed(3); el.style.transform = `translateY(${((1 - q) * dy).toFixed(1)}px)`; };
    fade('#endTag', e.tag, 30); fade('#endSub', e.sub ?? e.tag + 0.15); fade('#endStars', e.stars); fade('#endBar', e.bar, 30); fade('#endFoot', e.bar + 0.2);
    const bt = P(t, e.btn, e.btn + 0.45);
    $('#endBtn').style.opacity = clamp(bt * 3).toFixed(3);
    $('#endBtn').style.transform = `scale(${(0.6 + 0.4 * eob(bt)).toFixed(3)})`;
    $('#url').textContent = typed('sublimnet', t, e.url1) + (t >= e.url2[0] ? typed('.com', t, e.url2) : '');
    $('#urlCaret').style.opacity = (t < e.url1[0] || t > e.url2[1] + 0.3) ? (blink(t) ? 1 : 0) : 1;
  }

  function render(t) {
    tiles(t); phone(t); counts(t); pops(t);
    if (window.scene) window.scene(t, API);
    camera(t); captions(t); endcard(t);
  }

  async function boot(url) {
    TL = await (await fetch(url)).json();
    API.TL = TL;
    buildPhone(); buildEnd();
    TILES = [...document.querySelectorAll('#world > .tile, #phone')].map(el => {
      const x = parseFloat(el.style.left || 834), y = parseFloat(el.style.top || 700);
      const d = Math.hypot(x + 150 - 1114, y + 150 - 1150) / 1500;
      return { el, delay: d * 0.28 + (el.id === 'phone' ? 0.08 : 0) };
    });
    if (window.sceneInit) window.sceneInit(API);
    await document.fonts.ready;
    await Promise.all([...document.images].map(i => i.complete ? 0 : new Promise(r => { i.onload = i.onerror = r; })));
    render(0);
    return true;
  }
  const API = { $, clamp, lerp, P, eio, eo, eo5, eob, typed, blink, off, TL: null };
  window.render = render;
  return { boot, API };
})();
window.__ready = E.boot(document.body.dataset.timeline);
