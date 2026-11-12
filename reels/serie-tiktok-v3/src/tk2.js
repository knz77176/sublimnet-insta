/* v5 helpers: real video clips (image sequences), screenshot highlights, frame-ready wait */
const TK2 = (() => {
  const F = 436 / 603; // screenshot (603 px wide) -> phone screen (436 px)
  // highlight rect given in 603-scale screenshot coords
  function hlStyle(x, y, w, h, pad = 6) { return `left:${(x * F - pad).toFixed(1)}px;top:${(y * F - pad).toFixed(1)}px;width:${(w * F + 2 * pad).toFixed(1)}px;height:${(h * F + 2 * pad).toFixed(1)}px`; }
  function tapStyle(x, y) { return `left:${(x * F).toFixed(1)}px;top:${(y * F).toFixed(1)}px`; }
  // clip: frames assets/clips/<dir>/NNN.jpg recorded at 60 fps; speed 0.5 = slow motion
  function clip(img, dir, n, tt, t0, speed = 0.5) {
    const i = Math.max(0, Math.min(n - 1, Math.floor((tt - t0) * 60 * speed)));
    const src = `assets/clips/${dir}/${String(i + 1).padStart(3, '0')}.jpg`;
    if (img.getAttribute('src') !== src) img.setAttribute('src', src);
  }
  // ring: grows in with a little overshoot and pulses
  function ring(el, tt, t0, t1 = 99) {
    const q = K.eob(K.P(tt, t0, t0 + 0.3), 2.2); const on = tt >= t0 && tt < t1;
    el.style.opacity = on ? K.clamp(K.P(tt, t0, t0 + 0.06)).toFixed(3) : 0;
    el.style.transform = `scale(${(1.25 - 0.25 * q + 0.02 * Math.sin((tt - t0) * 9)).toFixed(4)})`;
  }
  function tap(el, tt, t0) {
    const d = tt - t0; el.style.opacity = d < 0 || d > 0.6 ? 0 : (1 - d / 0.6).toFixed(3);
    el.style.transform = `scale(${(0.6 + 0.9 * K.eo(K.clamp(d / 0.6))).toFixed(3)})`;
  }
  window.__frameReady = async () => { await Promise.all([...document.querySelectorAll('img.clip')].map(i => (i.decode ? i.decode().catch(() => 0) : 0))); };
  return { F, hlStyle, tapStyle, clip, ring, tap };
})();
