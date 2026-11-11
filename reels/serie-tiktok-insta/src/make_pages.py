"""Écrit reelA.html, reelB.html, reelC.html (décor + scène propre à chaque Reel)."""
import os
HERE = os.path.dirname(os.path.abspath(__file__))

def T(x, y, cls, inner="", id_=None, wide=False):
    i = f' id="{id_}"' if id_ else ""
    w = " wide" if wide else ""
    return f'<div class="tile {cls}{w}"{i} style="left:{x}px;top:{y}px">{inner}</div>\n'

FILL_SIDES = "".join([
    T(124, 180, "white"), T(124, 516, "dark"), T(124, 852, "white"), T(124, 1188, "dark"), T(124, 1524, "white"), T(124, 1860, "dark"),
    T(1804, 180, "dark"), T(1804, 516, "white"), T(1804, 852, "dark"), T(1804, 1188, "white"), T(1804, 1524, "dark"), T(1804, 1860, "white"),
])

def price(lbl, num_id, val, desc, dès=True):
    d = '<div class="desc" style="margin-top:14px">dès</div>' if dès else '<div style="height:42px"></div>'
    return (f'<div class="pad"><div class="lbl">{lbl}</div><div id="{num_id}w">{d}'
            f'<div class="big" style="font-size:98px"><span id="{num_id}">{val}</span><span style="font-size:70px"> €</span></div></div>'
            f'<div class="desc" style="margin-top:10px">{desc}</div></div>')

def emoji_tile(e, lbl, idn):
    return (f'<div class="face dirty" id="{idn}d"><div class="pad"><div class="emoji">{e}</div><div class="lbl" style="margin-top:38px">{lbl}</div></div></div>'
            f'<div class="face clean" id="{idn}c"><div class="pad"><div class="emoji">✨</div><div class="lbl" style="margin-top:38px">Propre</div></div></div>')

def numtile(n, lbl, desc, extra=""):
    return (f'<div class="pad"><div class="num" style="font-size:112px">{n}</div>{extra}'
            f'<div style="position:absolute;left:0;bottom:0"><div class="lbl">{lbl}</div><div class="desc" style="margin-top:6px">{desc}</div></div></div>')

HEAD = """<!doctype html><html lang="fr"><head><meta charset="utf-8"><title>{title}</title>
<link rel="stylesheet" href="fonts/fonts.css"><link rel="stylesheet" href="fonts/playfair.css"><link rel="stylesheet" href="engine.css">
<style>
.face{{position:absolute;inset:0}} .clean{{opacity:0}}
.qm{{font-family:var(--serif);font-style:italic;font-weight:800;font-size:200px;line-height:1;position:absolute;left:0;right:0;top:34px;text-align:center}}
.white .qm{{background:linear-gradient(95deg,#7a4d9e,#5a6cc0);-webkit-background-clip:text;background-clip:text;color:transparent}}
.white .num{{background:linear-gradient(95deg,#7a4d9e,#5a6cc0);-webkit-background-clip:text;background-clip:text;color:transparent;padding-right:.1em}}
.pill{{position:absolute;padding:5px 12px;border-radius:999px;font-weight:800;font-size:12.5px;letter-spacing:.12em;color:#fff;z-index:12}}
.bub{{position:absolute;font-size:25px;font-weight:600;padding:14px 22px;border-radius:26px;white-space:nowrap}}
{css}
</style></head>
<body data-timeline="{tl}"><div id="stage"><div id="persp"><div id="world">
"""
TAIL = """<div id="phone"></div>
</div></div>
<div id="fog"></div><div id="cap"></div><div id="veil"></div><div id="end"></div>
</div>
<script>{js}</script>
<script src="engine.js"></script>
</body></html>
"""

# ------------------------------------------------------------------ Reel A : voiture
notif = ('<div class="pad" id="notifIn" style="opacity:0">'
         '<div style="display:flex;align-items:center;gap:16px"><div style="width:64px;height:64px;border-radius:16px;background:#fff;display:grid;place-items:center"><img src="assets/logo.svg" style="width:56px"></div>'
         '<div class="lbl" style="color:#c39ae0">SublimNet</div><div style="margin-left:auto;color:#8b8d96;font-size:21px">maintenant</div></div>'
         '<div style="font-family:var(--serif);font-weight:700;font-size:44px;margin-top:26px">Votre intervenant arrive 🚗</div>'
         '<div class="desc" style="margin-top:12px">Nettoyage auto · chez vous · 14:30</div></div>')
worldA = (FILL_SIDES +
    T(460, 4, "white") + T(796, 4, "dark", notif, "notif", wide=True) + T(1468, 4, "dark") +
    T(460, 340, "white", emoji_tile("🍪", "Miettes", "e1"), "e1") + T(796, 340, "dark", emoji_tile("🐾", "Poils", "e2"), "e2") +
    T(1132, 340, "white", emoji_tile("☕", "Taches", "e3"), "e3") + T(1468, 340, "white") +
    T(460, 700, "white", price("Express", "nExp", "0", "Aspiration · plastiques · vitres"), "tExp") +
    T(460, 1036, "dark", '<div class="pad"><div class="lbl">7j/7</div><div class="big" style="font-size:72px;margin-top:22px">07:30</div><div class="big" style="font-size:72px;margin-top:8px">14:30</div></div>', "t7j") +
    T(460, 1372, "white", '<div class="pad"><div class="lbl">Google</div><div class="big" style="font-size:104px;margin-top:14px">5,0</div><div style="color:#F5B301;font-size:30px;letter-spacing:3px;margin-top:10px">★★★★★</div></div>') +
    T(460, 1708, "dark") +
    T(1468, 700, "grad", price("Confort", "nConf", "0", "Sièges inclus"), "tConf") +
    T(1468, 1036, "dark", price("Extérieur", "nExt", "45", "Carrosserie · jantes"), "tExt") +
    T(1468, 1372, "dark") + T(1468, 1708, "white") +
    T(796, 1916, "navy", '<div class="pad"><div class="lbl">Bordeaux &amp; alentours</div><div class="big" style="font-size:76px;margin-top:22px">Déplacement offert</div></div>', "tBdx", wide=True))
jsA = r"""
window.sceneInit = (A) => {
  const vp = A.$('#s_hero');
  vp.insertAdjacentHTML('beforeend', `<div id="seam" style="position:absolute;left:194px;top:0;width:2.5px;height:630px;background:linear-gradient(#fff0,#fff,#fff0);box-shadow:0 0 14px #fff;z-index:12;opacity:0"></div>
    <div class="pill" id="pAv" style="left:22px;top:560px;background:rgba(20,22,30,.72)">AVANT</div>
    <div class="pill" id="pAp" style="left:300px;top:560px;background:linear-gradient(95deg,#7a4d9e,#5a6cc0)">APRÈS</div>`);
  A.TL.pops = (A.TL.pops || []).concat([{id:'pAv', t:A.TL.x.avant}, {id:'pAp', t:A.TL.x.apres}]);
};
window.scene = (t, A) => {
  const X = A.TL.x;
  for (const k of ['e1','e2','e3']) {
    const q = A.P(t, X.clean + (k==='e2'?0.08:k==='e3'?0.16:0), X.clean + 0.45 + (k==='e2'?0.08:k==='e3'?0.16:0));
    const d = A.$('#'+k+'d'), c = A.$('#'+k+'c');
    const pop = A.P(t, X[k], X[k] + 0.4);
    d.style.opacity = (1 - q).toFixed(3); d.style.transform = `scale(${(0.55 + 0.45*A.eob(pop)) * (1 - 0.3*q)})`;
    c.style.opacity = q.toFixed(3); c.style.transform = `scale(${0.6 + 0.4*A.eob(q)}) rotate(${(1-q)*-20}deg)`;
  }
  A.$('#notifIn').style.opacity = A.P(t, X.notif, X.notif + 0.3).toFixed(3);
  A.$('#notifIn').style.transform = `translateY(${(1 - A.eo(A.P(t, X.notif, X.notif + 0.4))) * 30}px)`;
  const s = A.P(t, X.avant - 0.1, X.avant + 0.4) * (1 - A.P(t, X.seamOut, X.seamOut + 0.3));
  A.$('#seam').style.opacity = s.toFixed(3);
};
"""

# ------------------------------------------------------------------ Reel B : prix
search = ('<div class="pad"><div class="lbl" style="color:#6b7280">Recherche</div>'
          '<div style="margin-top:30px;height:110px;border-radius:55px;background:#fff;box-shadow:0 10px 30px -10px rgba(28,38,70,.25);display:flex;align-items:center;gap:18px;padding:0 34px;font-size:31px;font-weight:700;color:var(--ink)">'
          '<svg width="38" height="38" viewBox="0 0 24 24" fill="none" stroke="#6b7383" stroke-width="2.6"><circle cx="10.5" cy="10.5" r="7"/><path d="M16 16l5 5"/></svg><span id="sq"></span><i class="caret" id="sqc" style="display:inline-block;width:3px;height:38px;background:#5a6cc0"></i></div></div>')
def qm(): return '<div class="qm">?</div>'
worldB = (FILL_SIDES +
    T(460, 4, "white", qm(), "q1") + T(796, 4, "white", search, "search", wide=True) + T(1468, 4, "dark", qm(), "q2") +
    T(460, 340, "dark", qm(), "q3") + T(796, 340, "dark", '<div class="qm" style="top:46px">€</div>') + T(1132, 340, "grad", qm(), "q4") + T(1468, 340, "white", qm(), "q5") +
    T(460, 700, "white", price("Canapé", "nCan", "0", "2 à 7 places"), "tCan") +
    T(460, 1036, "dark", price("Voiture", "nAuto", "0", "Citadine · extérieur"), "tAuto") +
    T(460, 1372, "white") + T(460, 1708, "dark") +
    T(1468, 700, "grad", price("Matelas", "nMat", "0", "Enfant, 1 ou 2 places"), "tMat") +
    T(1468, 1036, "navy", '<div class="pad"><div class="lbl">Déplacement</div><div id="nKmw"><div class="big" style="font-size:84px;margin-top:60px;white-space:nowrap"><span id="nKm">0</span> km</div></div><div class="desc" style="margin-top:12px">offerts</div></div>', "tDep") +
    T(1468, 1372, "dark") + T(1468, 1708, "white") +
    T(796, 1916, "white", '<div class="pad"><div class="lbl">Récapitulatif</div><div class="big" style="font-size:80px;margin-top:22px;font-style:italic">Zéro surprise</div><div class="desc" style="margin-top:12px">Le total s\'affiche avant de réserver</div></div>', "tTot", wide=True))
jsB = r"""
window.scene = (t, A) => {
  const X = A.TL.x;
  A.$('#sq').textContent = A.typed('prix nettoyage canapé', t, X.type);
  A.$('#sqc').style.opacity = A.blink(t) || (t > X.type[0] && t < X.type[1]) ? 1 : 0;
  ['q1','q2','q3','q4','q5'].forEach((k, i) => {
    const el = A.$('#'+k+' .qm'); const w = Math.sin((t * 5) + i * 1.3) * 8 * A.P(t, X.wob[0], X.wob[0] + 0.3) * (1 - A.P(t, X.wob[1], X.wob[1] + 0.3));
    el.style.transform = `rotate(${w.toFixed(2)}deg)`;
  });
};
"""

# ------------------------------------------------------------------ Reel C : 5 raisons
msgs = ('<div class="pad"><div style="display:flex;align-items:center;gap:14px">'
        '<div style="width:44px;height:44px;border-radius:50%;background:#f08a3c;display:grid;place-items:center;font-weight:800;font-size:20px">L</div>'
        '<div style="width:44px;height:44px;border-radius:50%;background:#2fb36b;display:grid;place-items:center;font-weight:800;font-size:20px;margin-left:-22px;border:3px solid #1d1e22">S</div>'
        '<div style="font-weight:700;font-size:28px;margin-left:8px">Les voisins</div><div style="margin-left:auto;color:#8b8d96;font-size:21px">maintenant</div></div></div>'
        '<div class="bub" id="mb1" style="left:36px;top:112px;background:#3a3b41;color:#fff;opacity:0">Tu connais un pro pour le canapé ?</div>'
        '<div class="bub" id="mb2" style="right:36px;top:194px;background:linear-gradient(95deg,#7a4d9e,#5a6cc0);color:#fff;opacity:0">SublimNet, sans hésiter 👌</div>')
worldC = (FILL_SIDES +
    T(460, 4, "white") + T(796, 4, "dark", msgs, "msgs", wide=True) + T(1468, 4, "dark") +
    T(460, 340, "white", numtile("1", "À domicile", "On vient chez vous"), "r1") +
    T(796, 340, "dark", numtile("2", "Google", '<span style="color:#F5B301;letter-spacing:2px" id="stars">★★★★★</span> 5,0'), "r2") +
    T(1132, 340, "grad", numtile("3", "7j/7", "07:30 · 14:30"), "r3") + T(1468, 340, "white") +
    T(460, 700, "navy", numtile("4", "Déplacement", "Offert · 20 km"), "r4") +
    T(460, 1036, "dark") + T(460, 1372, "white") + T(460, 1708, "dark") +
    T(1468, 700, "white", numtile("5", "En ligne", "Réservé en 1 min"), "r5") +
    T(1468, 1036, "dark") + T(1468, 1372, "white") + T(1468, 1708, "dark") +
    T(796, 1916, "grad", '<div class="pad"><div class="lbl">À domicile</div><div class="big" style="font-size:66px;margin-top:26px;font-style:italic">Auto · Canapé · Matelas</div></div>', None, wide=True))
jsC = r"""
window.scene = (t, A) => {
  const X = A.TL.x;
  for (const [id, tt] of [['mb1', X.mb1], ['mb2', X.mb2]]) {
    const q = A.eob(A.P(t, tt, tt + 0.35)); const e = A.$('#'+id);
    e.style.opacity = A.P(t, tt, tt + 0.12).toFixed(3); e.style.transform = `scale(${(0.6 + 0.4 * q).toFixed(3)})`;
    e.style.transformOrigin = id === 'mb1' ? '0 50%' : '100% 50%';
  }
  const s = A.P(t, X.stars, X.stars + 0.8); const n = Math.round(s * 5);
  A.$('#stars').innerHTML = '★'.repeat(n) + `<span style="color:#55565c">${'★'.repeat(5 - n)}</span>`;
};
"""

for name, title, tl, world, js in [("reelA", "Voiture comme neuve", "tA.json", worldA, jsA),
                                   ("reelB", "Les prix", "tB.json", worldB, jsB),
                                   ("reelC", "Pourquoi SublimNet", "tC.json", worldC, jsC)]:
    open(os.path.join(HERE, name + ".html"), "w").write(HEAD.format(title=title, tl=tl, css="") + world + TAIL.format(js=js))
print("ok")
