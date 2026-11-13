import React from "react";
import { AbsoluteFill, Img, staticFile } from "remotion";
import { Card, Label } from "../ui/Card";
import { C, INTER, MONO, SERIF } from "../theme";
import { io, wordT, reveal, rand, EIO, voiceAt } from "../lib";

/* ---------- Devis (18.05 → 27.55 s) ---------- */
const OPTS = ["Véhicule", "Canapé", "Matelas", "Tapis", "Pro · flotte"];
const DETAIL = "Canapé d'angle · velours beige · 1 chat · jus de raisin (beaucoup)";
export const Devis: React.FC<{ t: number }> = ({ t }) => {
  const press = (t0: number) => 1 - 0.08 * Math.max(0, 1 - Math.abs(t - t0) / 0.12);
  // menu
  const menu = reveal(t, 18.3, 20.15);
  const sel = io(t, 18.9, 19.2);
  // sélecteur
  const idx = 4 - io(t, 20.25, 20.45, 0, 1) - io(t, 20.65, 20.85, 0, 1) - io(t, 21.05, 21.25, 0, 1) - io(t, 21.45, 21.65, 0, 0.0001);
  // détail
  const typed = Math.floor(io(t, 22.25, 25.4, 0, DETAIL.length, (x) => x));
  const tt = wordT("f2", "tapis"), td = wordT("f2", "diagnostic") + 0.25;
  const chip = io(t, tt - 0.15, tt + 0.25);
  const btn = io(t, voiceAt("f2").start + 0.3, voiceAt("f2").start + 0.8);
  const fired = io(t, td, td + 0.3);
  return (
    <>
      <div style={{ position: "absolute", top: 400, left: 120, fontFamily: INTER, color: C.ink, ...menu }}>
        <div style={{ fontSize: 56, fontWeight: 600, letterSpacing: 2 }}>MENU</div>
        {["Planning", "Devis", "Clients", "Avis Google"].map((k, i) => (
          <div key={k} style={{ fontSize: 58, marginTop: 34, marginLeft: 40, fontWeight: 500, opacity: k === "Devis" ? 1 : 0.45 - sel * 0.2, color: k === "Devis" ? C.ink : C.dim, translate: `${k === "Devis" ? sel * 30 : 0}px 0px` }}>
            {k}
            {i === 1 && (
              <span style={{ display: "inline-flex", alignItems: "center", gap: 12, marginLeft: 36, padding: "12px 30px", borderRadius: 50, fontSize: 36, background: "rgba(62,224,143,0.18)", border: `2px solid ${C.green}`, color: C.green, boxShadow: "0 0 30px rgba(62,224,143,0.35)", opacity: io(t, 19.2, 19.45), scale: String(press(19.55)) }}>
                ● Nouveau devis
              </span>
            )}
          </div>
        ))}
      </div>
      <div style={{ position: "absolute", top: 420, left: 0, right: 0, height: 620, ...reveal(t, 20.05, 22.45) }}>
        <Label style={{ textAlign: "center", fontFamily: INTER }}>Que nettoie-t-on ?</Label>
        {OPTS.map((o, i) => {
          const d = i - idx;
          const sel = Math.max(0, 1 - Math.abs(d));
          const picked = io(t, 21.95, 22.1) * (i === 1 ? 1 : 0);
          return (
            <div key={o} style={{ position: "absolute", left: "50%", top: 300 + d * 150, translate: "-50% -50%", padding: "22px 54px", borderRadius: 60, fontFamily: INTER, fontSize: 62, fontWeight: 600, color: C.ink, whiteSpace: "nowrap", background: `rgba(30,18,12,${0.4 + sel * 0.35})`, border: `2px solid rgba(255,226,196,${0.12 + sel * 0.3})`, opacity: Math.max(0, 1 - Math.abs(d) * 0.42), filter: Math.abs(d) > 0.05 ? `blur(${Math.abs(d) * 4}px)` : "none", scale: String((0.8 + sel * 0.2) * (i === 1 ? press(21.95) : 1)), boxShadow: picked ? `0 0 50px ${C.amber}88` : "none", ...(picked ? { borderColor: C.amber } : {}) }}>
              {o}
            </div>
          );
        })}
      </div>
      <div style={{ position: "absolute", top: 420, left: 80, right: 80, fontFamily: INTER, color: C.ink, ...reveal(t, 22.1, 27.55) }}>
        <div style={{ display: "flex", gap: 30, alignItems: "flex-start" }}>
          <div style={{ fontSize: 46, fontWeight: 600, paddingTop: 30 }}>Détail</div>
          <div style={{ flex: 1, minHeight: 120, padding: "30px 34px", borderRadius: 34, fontSize: 40, lineHeight: 1.35, background: "rgba(20,12,8,0.6)", border: `1.5px solid ${C.glassBorder}`, boxShadow: "0 30px 60px rgba(0,0,0,0.5)" }}>
            {DETAIL.slice(0, typed)}
            <span style={{ opacity: Math.floor(t * 3) % 2 ? 1 : 0, color: C.amber }}>|</span>
          </div>
        </div>
        <div style={{ display: "flex", gap: 16, marginTop: 34, marginLeft: 166, flexWrap: "wrap" }}>
          {["Canapé d'angle", "Velours"].map((k) => (
            <div key={k} style={{ padding: "14px 28px", borderRadius: 40, fontSize: 32, border: `1.5px solid ${C.glassBorder}`, background: "rgba(255,255,255,0.06)", opacity: io(t, 23.0, 23.4) }}>{k}</div>
          ))}
          <div style={{ padding: "14px 28px", borderRadius: 40, fontSize: 32, border: `2px solid ${C.amber}`, color: C.amber, background: "rgba(255,179,92,0.12)", opacity: chip, scale: String(0.7 + 0.3 * chip) }}>+ Tapis du salon ×2</div>
        </div>
        <div style={{ marginTop: 60, marginLeft: 166, display: "inline-flex", alignItems: "center", gap: 18, padding: "28px 48px", borderRadius: 60, fontSize: 42, fontWeight: 700, color: "#160b05", background: `linear-gradient(90deg, ${C.amber}, #ffd29a)`, boxShadow: `0 0 ${40 + fired * 80}px rgba(255,179,92,${0.45 + fired * 0.4})`, opacity: btn, scale: String((0.85 + 0.15 * btn) * press(td)) }}>
          <span style={{ width: 22, height: 22, borderRadius: "50%", background: "#160b05", opacity: 0.8 }} />
          Lancer le diagnostic
        </div>
      </div>
    </>
  );
};

/* ---------- Agent IA (27.5 → 29.75 s) ---------- */
export const Agent: React.FC<{ t: number }> = ({ t }) => {
  const A = 27.5, B = 29.8;
  const step1 = io(t, 28.2, 28.3);
  return (
    <Card t={t} a={A} b={B} y={440} w={900} h={640} pad={40}>
      <div style={{ padding: "26px 30px", borderRadius: 26, background: "rgba(255,255,255,0.10)", fontSize: 36, lineHeight: 1.3 }}>
        Diagnostic textile complet : canapé d'angle + 2 tapis
      </div>
      <div style={{ marginTop: 34, fontSize: 30, fontWeight: 600, color: C.amber, fontFamily: MONO }}>Sublim·IA · agent</div>
      <div style={{ marginTop: 18, fontSize: 30, color: C.dim, lineHeight: 1.7 }}>
        <div>{step1 > 0.5 ? <span style={{ color: C.green }}>✓</span> : "○"} Lecture de la fiche client</div>
        <div>{t > 28.9 ? <span style={{ color: C.green }}>✓</span> : "○"} Analyse des fibres · velours</div>
        <div style={{ color: C.ink }}>
          <span style={{ display: "inline-block", rotate: `${t * 400}deg`, color: C.amber }}>◌</span> Cartographie des taches…
        </div>
      </div>
      <div style={{ marginTop: 30, height: 120, borderRadius: 22, overflow: "hidden", background: "rgba(255,255,255,0.06)", position: "relative" }}>
        <div style={{ position: "absolute", top: 0, bottom: 0, width: 260, left: `${((t * 0.9) % 1.4) * 100 - 30}%`, background: "linear-gradient(90deg, transparent, rgba(255,179,92,0.35), transparent)" }} />
      </div>
    </Card>
  );
};

/* ---------- Diagnostic (29.65 → 35.9 s) ---------- */
const NODES = [
  { k: "Acariens", v: "nombreux", x: 600, y: 470, sx: 420, sy: 760, word: "Acariens" },
  { k: "Taches", v: "3 détectées", x: 90, y: 1000, sx: 760, sy: 1180, word: "Acariens", off: 0.7 },
  { k: "Odeur", v: "discutable", x: 610, y: 860, sx: 760, sy: 1180, word: "Odeur" },
  { k: "Couleur d'origine", v: "introuvable", x: 90, y: 560, sx: 420, sy: 760, word: "Couleur" },
  { k: "Protocole", v: "injection-extraction", x: 300, y: 1100, sx: 300, sy: 1350, word: "commenter", off: 0.2 },
];
export const Diagnostic: React.FC<{ t: number }> = ({ t }) => {
  const A = 29.65, B = 35.95;
  const p = io(t, A, A + 0.6) * (1 - io(t, B - 0.45, B, 0, 1, EIO));
  const scanY = 300 + ((t - A) * 520) % 1500;
  const pct = Math.round(io(t, A, 35.2, 0, 100, (x) => x));
  return (
    <AbsoluteFill style={{ opacity: p }}>
      <Img src={staticFile("tex/canape_dirty.jpg")} style={{ position: "absolute", width: 1080, height: 1920, objectFit: "cover", scale: String(1.08 + (t - A) * 0.012), filter: "brightness(0.55) saturate(1.1) sepia(0.25)" }} />
      <AbsoluteFill style={{ background: "linear-gradient(180deg, rgba(10,5,3,0.75) 0%, rgba(10,5,3,0.15) 30%, rgba(10,5,3,0.2) 60%, rgba(10,5,3,0.85) 100%)" }} />
      <div style={{ position: "absolute", left: 0, right: 0, top: scanY, height: 4, background: C.amber, boxShadow: `0 0 40px 12px rgba(255,179,92,0.45)`, opacity: 0.85 }} />
      <div style={{ position: "absolute", left: 0, right: 0, top: scanY - 220, height: 220, background: "linear-gradient(180deg, transparent, rgba(255,179,92,0.10))" }} />
      <div style={{ position: "absolute", top: 300, left: 90, right: 90, display: "flex", justifyContent: "space-between", fontFamily: MONO, fontSize: 26, color: C.amber, letterSpacing: 3 }}>
        <span>DIAGNOSTIC · VELOURS BEIGE</span>
        <span>{pct}%</span>
      </div>
      <svg width="1080" height="1920" style={{ position: "absolute", inset: 0 }}>
        {NODES.map((n, i) => {
          const t0 = wordT("a6", n.word) + (n.off ?? 0) - 0.08;
          const a = io(t, t0, t0 + 0.4);
          const r = 46 + 8 * Math.sin(t * 4 + i);
          return (
            <g key={i} opacity={a}>
              <circle cx={n.sx} cy={n.sy} r={r} fill="none" stroke="#fff" strokeWidth="2" strokeDasharray="8 8" />
              <circle cx={n.sx} cy={n.sy} r={6} fill={C.red} />
              <path d={`M${n.sx} ${n.sy} L${n.sx} ${n.y + 46} L${n.x + 190} ${n.y + 46}`} fill="none" stroke="rgba(255,255,255,0.55)" strokeWidth="2" strokeDasharray="900" strokeDashoffset={900 * (1 - a)} />
            </g>
          );
        })}
      </svg>
      {NODES.map((n, i) => {
        const t0 = wordT("a6", n.word) + (n.off ?? 0) - 0.08;
        const a = io(t, t0 + 0.1, t0 + 0.5);
        return (
          <div key={i} style={{ position: "absolute", left: n.x, top: n.y, width: 380, padding: "16px 22px", borderRadius: 16, border: "2.5px solid rgba(255,255,255,0.9)", boxShadow: "0 0 24px rgba(255,255,255,0.45), inset 0 0 18px rgba(255,255,255,0.15)", background: "rgba(10,6,4,0.55)", fontFamily: INTER, opacity: a, scale: String(0.85 + 0.15 * a), filter: a < 0.99 ? `blur(${(1 - a) * 8}px)` : "none" }}>
            <div style={{ fontFamily: MONO, fontSize: 18, color: C.faint }}>NODE_0{i + 1}</div>
            <div style={{ display: "flex", alignItems: "center", gap: 12, fontSize: 32, color: C.ink, fontWeight: 600 }}>
              <span style={{ width: 14, height: 14, borderRadius: "50%", background: i === 4 ? C.green : C.red, boxShadow: `0 0 12px ${i === 4 ? C.green : C.red}` }} />
              {n.k}
            </div>
            <div style={{ fontSize: 28, color: i === 4 ? C.green : C.amber, marginTop: 2 }}>{n.v}</div>
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

/* ---------- Carte Bordeaux (35.85 → 40.95 s) ---------- */
export const BordeauxMap: React.FC<{ t: number; progress: number; pins?: number }> = ({ t, progress, pins = 1 }) => {
  const streets = Array.from({ length: 34 }, (_, i) => {
    const a = rand(i) * Math.PI, cx = 100 + rand(i + 5) * 600, cy = 80 + rand(i + 9) * 600;
    return `M${cx - Math.cos(a) * 260} ${cy - Math.sin(a) * 260} L${cx + Math.cos(a) * 260} ${cy + Math.sin(a) * 260}`;
  });
  const route = "M560 560 L520 520 L470 470 L470 400 L430 340 L440 280 L470 230";
  return (
    <svg width="820" height="760" viewBox="0 0 820 760">
      <defs>
        <radialGradient id="mapfade" cx="50%" cy="45%" r="60%">
          <stop offset="0.6" stopColor="#000" stopOpacity="0" />
          <stop offset="1" stopColor="#000" stopOpacity="0.7" />
        </radialGradient>
      </defs>
      <rect width="820" height="760" fill="#140c08" />
      {streets.map((d, i) => <path key={i} d={d} stroke="rgba(255,210,170,0.10)" strokeWidth={i % 5 ? 2 : 5} />)}
      <path d="M520 780 C 700 640, 720 470, 610 330 S 470 120, 560 -20" stroke="#1f3a52" strokeWidth="58" fill="none" strokeLinecap="round" />
      <path d="M520 780 C 700 640, 720 470, 610 330 S 470 120, 560 -20" stroke="#2c5577" strokeWidth="24" fill="none" opacity="0.6" />
      <text x="700" y="560" fill="rgba(130,180,220,0.6)" fontFamily={MONO} fontSize="20" rotate="0">GARONNE</text>
      {[["Chartrons", 330, 220], ["Mérignac", 60, 470], ["Pessac", 90, 690], ["Talence", 330, 700], ["La Bastide", 680, 430], ["Le Bouscat", 150, 140]].map(([n, x, y], i) => (
        <g key={n as string} opacity={i === 0 ? 1 : 0.55 * Math.min(1, pins)}>
          <text x={x as number} y={y as number} fill={i === 0 ? C.ink : "rgba(247,239,230,0.6)"} fontFamily={INTER} fontSize={i === 0 ? 30 : 24} fontWeight={i === 0 ? 700 : 500}>{n as string}</text>
        </g>
      ))}
      <path d={route} stroke={C.amber} strokeWidth="9" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="520" strokeDashoffset={520 * (1 - progress)} style={{ filter: `drop-shadow(0 0 10px ${C.amber})` }} />
      <circle cx="560" cy="560" r="14" fill={C.cyan} />
      <circle cx="560" cy="560" r={20 + (t * 30) % 30} fill="none" stroke={C.cyan} opacity={1 - ((t * 30) % 30) / 30} />
      <g opacity={io(progress, 0.85, 1)} transform={`translate(470 ${230 - 20 * (1 - io(progress, 0.85, 1))})`}>
        <path d="M0 0 C -26 -30 -26 -62 0 -62 C 26 -62 26 -30 0 0 Z" fill={C.red} />
        <circle cy="-40" r="9" fill="#fff" />
      </g>
      <rect width="820" height="760" fill="url(#mapfade)" />
    </svg>
  );
};
export const MapScene: React.FC<{ t: number }> = ({ t }) => {
  const A = 36.05, B = 41.0;
  const prog = io(t, wordT("a7", "itinéraire") - 0.6, wordT("a7", "itinéraire") + 0.8, 0, 1, EIO) * 0.8 + io(t, wordT("a7", "Chartron") - 0.2, wordT("a7", "Chartron") + 0.3) * 0.2;
  return (
    <Card t={t} a={A} b={B} y={380} w={900} h={860} pad={40} tiltX={8}>
      <div style={{ borderRadius: 26, overflow: "hidden", height: 600 }}>
        <BordeauxMap t={t} progress={Math.min(1, prog)} />
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", marginTop: 26, alignItems: "center" }}>
        <div>
          <Label>Demain · 10:00</Label>
          <div style={{ fontFamily: SERIF, fontSize: 64, lineHeight: 1.05 }}>Chartrons</div>
        </div>
        <div style={{ textAlign: "right" }}>
          <div style={{ fontSize: 56, fontWeight: 300, color: C.amber }}>≈ 12 min</div>
          <div style={{ fontSize: 24, color: C.dim }}>canapé d'angle + 2 tapis</div>
        </div>
      </div>
    </Card>
  );
};

/* ---------- Appel entrant (40.9 → 48.6 s) ---------- */
export const Call: React.FC<{ t: number; drop: number }> = ({ t, drop }) => {
  const A = 40.95;
  const acc = 47.45;
  const a = io(t, A, A + 0.5);
  const zoom = io(t, acc + 0.05, drop, 0, 1, EIO);
  const ring = t < acc ? Math.sin(t * 22) * 2.2 * (Math.sin(t * 2.4) > 0 ? 1 : 0.2) : 0;
  const press = 1 - 0.1 * Math.max(0, 1 - Math.abs(t - acc) / 0.12);
  return (
    <div style={{ position: "absolute", left: 160, top: 420, width: 760, height: 720, opacity: a * (1 - io(t, drop - 0.25, drop)), scale: String((0.9 + 0.1 * a) * (1 + zoom * 1.6)), filter: zoom > 0.02 ? `blur(${zoom * 16}px)` : a < 0.99 ? `blur(${(1 - a) * 16}px)` : "none", rotate: `${ring}deg` }}>
      <div style={{ width: "100%", height: "100%", borderRadius: 60, padding: 50, boxSizing: "border-box", textAlign: "center", fontFamily: INTER, color: C.ink, background: "linear-gradient(170deg, rgba(255,236,214,0.15), rgba(18,10,6,0.6))", border: `1.5px solid ${C.glassBorder}`, boxShadow: "0 50px 100px rgba(0,0,0,0.6)" }}>
        <Label>Appel entrant</Label>
        <div style={{ position: "relative", width: 190, height: 190, margin: "36px auto 0" }}>
          {[0, 1, 2].map((k) => {
            const ph = ((t * 0.9 + k / 3) % 1);
            return <div key={k} style={{ position: "absolute", inset: 0, borderRadius: "50%", border: `3px solid ${C.green}`, scale: String(1 + ph * 0.9), opacity: (1 - ph) * (t < acc ? 1 : 0) }} />;
          })}
          <div style={{ position: "absolute", inset: 0, borderRadius: "50%", background: "linear-gradient(135deg, #5a6b7c, #1c232b)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 72, fontWeight: 700 }}>GM</div>
        </div>
        <div style={{ fontSize: 64, fontWeight: 700, marginTop: 34, letterSpacing: -1 }}>Garage · Mérignac</div>
        <div style={{ display: "inline-block", marginTop: 18, padding: "10px 26px", borderRadius: 30, fontSize: 30, color: C.amber, border: `1.5px solid ${C.amber}` }}>Flotte · 12 véhicules</div>
        <div style={{ display: "flex", justifyContent: "space-around", marginTop: 54 }}>
          <div style={{ width: 120, height: 120, borderRadius: "50%", background: C.red, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 54, rotate: "135deg" }}>✆</div>
          <div style={{ width: 120, height: 120, borderRadius: "50%", background: C.green, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 54, scale: String(press * (1 + (t < acc ? 0.06 * Math.abs(Math.sin(t * 5)) : 0))), boxShadow: `0 0 ${t > acc ? 90 : 30}px ${C.green}` }}>✆</div>
        </div>
      </div>
    </div>
  );
};

export const Flash: React.FC<{ t: number; at: number; dur?: number; color?: string }> = ({ t, at, dur = 0.5, color = "#fff" }) => {
  const o = Math.max(0, 1 - Math.abs(t - at) / dur) ** 2;
  return o > 0.001 ? <AbsoluteFill style={{ background: color, opacity: o, mixBlendMode: "screen" }} /> : null;
};
