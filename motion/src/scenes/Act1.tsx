import React from "react";
import { Img, staticFile } from "remotion";
import { Card, Label } from "../ui/Card";
import { C, INTER, MONO, SERIF, SERIF_I, BRAND_GRAD } from "../theme";
import { io, wordT, rand, reveal } from "../lib";

/* ---------- Accroche (0 → 4.6 s) ---------- */
export const Hook: React.FC<{ t: number }> = ({ t }) => {
  const a = io(t, 0.1, 0.6), o = io(t, 4.1, 4.6);
  const l2 = io(t, 0.45, 1.0);
  return (
    <div style={{ position: "absolute", top: 150, left: 80, right: 80, textAlign: "center", opacity: 1 - o, filter: o > 0 ? `blur(${o * 14}px)` : "none" }}>
      <div style={{ fontFamily: SERIF, fontSize: 92, lineHeight: 1.0, color: C.ink, opacity: a, translate: `0px ${(1 - a) * 30}px`, textShadow: "0 6px 40px rgba(0,0,0,0.7)" }}>
        J'ai confié ma boîte
        <br />de nettoyage
      </div>
      <div style={{ fontFamily: SERIF_I, fontStyle: "italic", fontSize: 104, lineHeight: 1.05, opacity: l2, translate: `0px ${(1 - l2) * 30}px`, backgroundImage: BRAND_GRAD, WebkitBackgroundClip: "text", color: "transparent", paddingBottom: 10 }}>
        à une IA.
      </div>
      <div style={{ fontFamily: MONO, fontSize: 30, letterSpacing: 6, color: "#ffc98a", marginTop: 16, opacity: io(t, 1.1, 1.6) }}>
        ELLE A UN PEU TROP D'HUMOUR
      </div>
    </div>
  );
};

/* ---------- Dashboard (1.3 → 7.85 s) ---------- */
const Counter: React.FC<{ t: number; t0: number; to: number }> = ({ t, t0, to }) => {
  const v = Math.round(io(t, t0 - 0.3, t0 + 0.5, 0, to));
  return <>{v}</>;
};
export const Dashboard: React.FC<{ t: number }> = ({ t }) => {
  const END = 7.85;
  const tq = wordT("a1", "quatorze"), ts = wordT("a1", "six"), tc = wordT("a1", "Clio");
  const tile = (t0: number): React.CSSProperties => ({ ...reveal(t, t0 - 0.25, END + 0.2, 30) });
  return (
    <>
      <Card t={t} a={1.45} b={END} y={550} w={900} h={250} pad={44}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", height: "100%" }}>
          <div>
            <Label>Bordeaux · nuit claire</Label>
            <div style={{ fontSize: 132, fontWeight: 200, lineHeight: 1, marginTop: 8 }}>12°</div>
          </div>
          <div style={{ textAlign: "right" }}>
            <Label>Ven. 13 nov.</Label>
            <div style={{ fontSize: 132, fontWeight: 200, lineHeight: 1, marginTop: 8, fontVariantNumeric: "tabular-nums" }}>
              19:4{Math.min(9, 2 + Math.floor(Math.max(0, t - 1.5) / 3))}
            </div>
          </div>
        </div>
      </Card>
      <div style={{ position: "absolute", top: 830, left: 90, right: 90, fontFamily: INTER, ...reveal(t, 2.3, END + 0.1) }}>
        <Label color={C.amber}>Missions du jour · terminées</Label>
        <div style={{ height: 4, borderRadius: 2, background: "rgba(255,255,255,0.12)", marginTop: 16, overflow: "hidden" }}>
          <div style={{ width: `${io(t, 2.4, 6.6, 0, 100)}%`, height: "100%", background: C.green, boxShadow: `0 0 18px ${C.green}` }} />
        </div>
      </div>
      {[
        { t0: tq, k: "Canapés", n: 14 },
        { t0: ts, k: "Matelas", n: 6 },
      ].map((m, i) => (
        <div key={m.k} style={{ position: "absolute", top: 890, left: 90 + i * 300, width: 280, height: 300, padding: 30, boxSizing: "border-box", borderRadius: 34, background: "rgba(18,10,6,0.5)", border: `1.5px solid ${C.glassBorder}`, fontFamily: INTER, color: C.ink, ...tile(m.t0) }}>
          <Label size={22}>{m.k}</Label>
          <div style={{ fontSize: 140, fontWeight: 300, lineHeight: 1.05, marginTop: 14, fontVariantNumeric: "tabular-nums" }}>
            <Counter t={t} t0={m.t0} to={m.n} />
          </div>
          <div style={{ fontSize: 24, color: C.green }}>● propres</div>
        </div>
      ))}
      <div style={{ position: "absolute", top: 890, left: 690, width: 300, height: 300, padding: 30, boxSizing: "border-box", borderRadius: 34, background: "linear-gradient(160deg, rgba(255,77,94,0.22), rgba(18,10,6,0.55))", border: `1.5px solid rgba(255,120,120,0.45)`, fontFamily: INTER, color: C.ink, ...tile(tc) }}>
        <Label size={22} color="rgba(255,190,190,0.9)">Véhicule</Label>
        <div style={{ fontSize: 70, fontWeight: 600, marginTop: 12, letterSpacing: -1 }}>Clio</div>
        <svg width="180" height="60" viewBox="0 0 180 60" style={{ marginTop: 6 }}>
          <path d="M10 44 L22 26 Q30 14 50 14 L110 14 Q126 14 138 26 L160 30 Q172 32 172 44 Z" fill="none" stroke={C.ink} strokeWidth="3" />
          <circle cx="45" cy="46" r="9" fill="#120a06" stroke={C.ink} strokeWidth="3" />
          <circle cx="135" cy="46" r="9" fill="#120a06" stroke={C.ink} strokeWidth="3" />
          {[0, 1, 2].map((k) => (
            <path key={k} d={`M${70 + k * 18} 8 q 6 -8 0 -16`} stroke={C.red} strokeWidth="3" fill="none" opacity={0.4 + 0.6 * Math.abs(Math.sin(t * 4 + k))} />
          ))}
        </svg>
        <div style={{ marginTop: 10, fontSize: 24, color: "#ffb4b4", fontWeight: 600 }}>Odeur : chien mouillé</div>
      </div>
    </>
  );
};

/* ---------- "fait le tour de Bordeaux" (7.85 → 10.75 s) ---------- */
const TOWNS = ["Bordeaux", "Mérignac", "Pessac", "Talence", "Bègles", "Le Bouscat", "Cenon", "Bruges", "Lormont"];
export const Viral: React.FC<{ t: number }> = ({ t }) => {
  const A = 7.95, B = 10.75;
  const draw = io(t, 8.2, 10.0);
  const pts = Array.from({ length: 11 }, (_, i) => [i * 76, 230 - Math.pow(i / 10, 2.2) * 200 - rand(i) * 18]);
  const d = pts.map((p, i) => `${i ? "L" : "M"}${p[0]} ${p[1]}`).join(" ");
  return (
    <>
      <Card t={t} a={A} b={B} y={420} w={900} h={460} pad={40}>
        <div style={{ display: "flex", gap: 30 }}>
          <div style={{ width: 260, height: 330, borderRadius: 24, overflow: "hidden", position: "relative", flexShrink: 0 }}>
            <Img src={staticFile("tex/canape_dirty.jpg")} style={{ position: "absolute", width: 260, height: 330, objectFit: "cover", filter: "grayscale(0.85) brightness(1.15)" }} />
            <Img src={staticFile("tex/canape_clean.jpg")} style={{ position: "absolute", width: 260, height: 330, objectFit: "cover", filter: "grayscale(0.9) brightness(1.55)", clipPath: `inset(0 0 0 ${50 - 8 * Math.sin(t * 2)}%)` }} />
            <div style={{ position: "absolute", top: 0, bottom: 0, left: `${50 - 8 * Math.sin(t * 2)}%`, width: 3, background: "#fff", boxShadow: "0 0 16px #fff" }} />
            <div style={{ position: "absolute", bottom: 14, left: 14, fontFamily: MONO, fontSize: 18, color: "#fff" }}>AVANT</div>
            <div style={{ position: "absolute", bottom: 14, right: 14, fontFamily: MONO, fontSize: 18, color: "#fff" }}>APRÈS</div>
          </div>
          <div style={{ flex: 1 }}>
            <Label>Reel · canapé blanc</Label>
            <div style={{ fontSize: 50, fontWeight: 600, marginTop: 10, lineHeight: 1.05 }}>En tendance à Bordeaux</div>
            <svg width="530" height="240" viewBox="-10 -10 780 260" style={{ marginTop: 10 }}>
              <defs>
                <linearGradient id="gl" x1="0" x2="1">
                  <stop offset="0" stopColor={C.amber} />
                  <stop offset="1" stopColor={C.green} />
                </linearGradient>
              </defs>
              <path d={d} fill="none" stroke="url(#gl)" strokeWidth="7" strokeLinecap="round" strokeDasharray="1400" strokeDashoffset={1400 * (1 - draw)} />
              <circle cx={pts[Math.min(10, Math.floor(draw * 10))][0]} cy={pts[Math.min(10, Math.floor(draw * 10))][1]} r="12" fill={C.green} opacity={draw} />
            </svg>
          </div>
        </div>
      </Card>
      <div style={{ position: "absolute", top: 920, left: 80, right: 80, display: "flex", flexWrap: "wrap", gap: 14, justifyContent: "center", ...reveal(t, A + 0.3, B) }}>
        {TOWNS.map((n, i) => {
          const on = io(t, 8.6 + i * 0.16, 8.8 + i * 0.16);
          return (
            <div key={n} style={{ fontFamily: INTER, fontSize: 30, padding: "12px 24px", borderRadius: 40, border: `1.5px solid rgba(62,224,143,${0.2 + on * 0.6})`, background: `rgba(62,224,143,${on * 0.16})`, color: on > 0.5 ? C.ink : C.faint, boxShadow: on > 0.5 ? "0 0 22px rgba(62,224,143,0.25)" : "none" }}>
              {on > 0.5 ? "● " : "○ "}{n}
            </div>
          );
        })}
      </div>
    </>
  );
};

/* ---------- Messagerie qui déborde (10.75 → 15.0 s) ---------- */
const MSGS = [
  ["Inès · Talence", "C'est combien pour un canapé 3 places ?"],
  ["Karim", "Vous venez jusqu'à Pessac ?"],
  ["Julie", "Mon matelas a besoin de vous..."],
  ["Thomas", "Dispo samedi pour l'intérieur d'une Golf ?"],
  ["Manon", "Le chat a encore frappé. Au secours."],
  ["Agence immo · Chartrons", "Vous faites les états des lieux de sortie ?"],
  ["Sarah", "Le tapis du salon, c'est possible ?"],
];
export const Messages: React.FC<{ t: number }> = ({ t }) => {
  const A = 10.85, B = 15.05;
  const count = Math.round(io(t, 11.0, 13.9, 0, 209, (x) => x));
  const exitO = io(t, B - 0.45, B);
  return (
    <div style={{ position: "absolute", inset: 0, opacity: 1 - exitO, filter: exitO > 0 ? `blur(${exitO * 16}px)` : "none" }}>
      <div style={{ position: "absolute", top: 360, left: 90, right: 90, display: "flex", justifyContent: "space-between", alignItems: "center", fontFamily: INTER, ...reveal(t, A, B + 1) }}>
        <div style={{ color: C.ink, fontSize: 48, fontWeight: 600 }}>Messages</div>
        <div style={{ minWidth: 120, height: 76, borderRadius: 40, background: C.red, color: "#fff", fontSize: 44, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", padding: "0 22px", boxShadow: "0 0 40px rgba(255,77,94,0.6)", scale: String(1 + 0.12 * Math.abs(Math.sin(t * 9)) * (t < 13.9 ? 1 : 0)), fontVariantNumeric: "tabular-nums" }}>
          {count}
        </div>
      </div>
      {MSGS.map(([who, txt], i) => {
        const t0 = 11.0 + i * 0.36;
        const st = io(t, t0, t0 + 0.5);
        const depth = Math.max(0, (t - t0) / 0.36);
        return (
          <div key={i} style={{ position: "absolute", left: 90, right: 90, top: 470 + i * 112 - (1 - st) * 120, opacity: st * (1 - Math.max(0, depth - 9) * 0.2), filter: st < 0.99 ? `blur(${(1 - st) * 14}px)` : "none", padding: "20px 28px", borderRadius: 30, background: "rgba(22,12,8,0.62)", border: `1.5px solid ${C.glassBorder}`, display: "flex", gap: 22, alignItems: "center", fontFamily: INTER, boxShadow: "0 20px 50px rgba(0,0,0,0.45)" }}>
            <div style={{ width: 62, height: 62, borderRadius: "50%", background: `linear-gradient(135deg, ${["#ff9a4a", "#ff4fa3", "#8b5cf6", "#22d3ee", "#3ee08f", "#ffcf5c", "#ff6b6b"][i]}, #3a1a0a)`, color: "#fff", fontWeight: 700, fontSize: 28, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              {who[0]}
            </div>
            <div style={{ minWidth: 0 }}>
              <div style={{ fontSize: 24, color: C.dim, fontWeight: 600 }}>{who}</div>
              <div style={{ fontSize: 31, color: C.ink, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{txt}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

/* ---------- Injection → extraction (15.0 → 18.05 s) ---------- */
export const Method: React.FC<{ t: number }> = ({ t }) => {
  const A = 15.2, B = 18.05;
  const ti = wordT("f1", "injection");
  const p1 = io(t, ti - 0.1, ti + 0.6), p2 = io(t, ti + 0.6, ti + 1.4);
  return (
    <Card t={t} a={A} b={B} y={430} w={900} h={740} pad={44} tiltX={6}>
      <Label color={C.amber}>Méthode SublimNet</Label>
      <div style={{ fontFamily: SERIF, fontSize: 84, lineHeight: 1, marginTop: 14 }}>Pas de miracle.</div>
      <div style={{ display: "flex", gap: 18, marginTop: 30 }}>
        {[["1 · Injection", p1, C.cyan], ["2 · Extraction", p2, C.green]].map(([k, p, col]) => (
          <div key={k as string} style={{ flex: 1, padding: "18px 24px", borderRadius: 40, fontSize: 34, fontWeight: 600, border: `2px solid ${col}`, background: `rgba(255,255,255,${0.04 + (p as number) * 0.1})`, color: (p as number) > 0.5 ? C.ink : C.faint, boxShadow: (p as number) > 0.5 ? `0 0 30px ${col}55` : "none" }}>
            {k as string}
          </div>
        ))}
      </div>
      <svg width="812" height="330" viewBox="0 0 812 330" style={{ marginTop: 26 }}>
        <rect x="0" y="210" width="812" height="120" rx="18" fill="#3a2a1c" />
        <rect x="0" y="150" width="812" height="64" fill="#7a5a3c" />
        {Array.from({ length: 70 }, (_, i) => (
          <line key={i} x1={6 + i * 11.6} y1={150} x2={6 + i * 11.6 + Math.sin(i) * 4} y2={110 + rand(i) * 18} stroke="#b08a60" strokeWidth="5" strokeLinecap="round" />
        ))}
        <rect x={300} y={10} width={212} height={60} rx="14" fill="#1b1310" stroke={C.ink} strokeWidth="2" />
        <text x="406" y="48" textAnchor="middle" fill={C.ink} fontFamily={MONO} fontSize="22">BUSE</text>
        {Array.from({ length: 22 }, (_, i) => {
          const ph = (t * 1.6 + rand(i)) % 1;
          const x = 320 + rand(i + 9) * 172;
          const down = p1 > 0.3 && p2 < 0.5;
          return down ? (
            <circle key={i} cx={x} cy={76 + ph * 150} r="6" fill={C.cyan} opacity={0.9 * (1 - ph * 0.5)} />
          ) : p2 > 0.2 ? (
            <circle key={i} cx={x + Math.sin(ph * 6) * 8} cy={200 - ph * 130} r={5 + rand(i) * 4} fill="#7b5a3a" opacity={0.95 * (1 - ph)} />
          ) : null;
        })}
      </svg>
    </Card>
  );
};
