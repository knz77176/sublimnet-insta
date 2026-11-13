import React from "react";
import { AbsoluteFill, Img, staticFile } from "remotion";
import { C, INTER, MONO, SERIF, SERIF_I, BRAND_GRAD } from "../theme";
import { io, rand, TL, EIO, wordT } from "../lib";

const NAMES: Record<string, [string, string]> = {
  canape: ["Canapé", "Nettoyé chez vous"],
  matelas: ["Matelas", "Sans le déplacer"],
  tapis: ["Tapis", "Fibres ravivées"],
  siege: ["Siège auto", "Particuliers & pros"],
  phare: ["Phares", "Comme neufs"],
};

const Star: React.FC<{ x: number; y: number; s: number }> = ({ x, y, s }) => (
  <svg width="120" height="120" viewBox="-60 -60 120 120" style={{ position: "absolute", left: x - 60, top: y - 60, scale: String(s), opacity: Math.min(1, s * 1.4) }}>
    <path d="M0 -56 C 6 -10 10 -6 56 0 C 10 6 6 10 0 56 C -6 10 -10 6 -56 0 C -10 -6 -6 -10 0 -56 Z" fill="#fff" style={{ filter: "drop-shadow(0 0 10px #fff)" }} />
  </svg>
);

export const Montage: React.FC<{ t: number }> = ({ t }) => {
  const i = Math.min(TL.items.length - 1, Math.floor((t - TL.drop) / TL.item));
  const u = t - TL.drop - i * TL.item;
  const key = TL.items[i];
  const w = io(u, 0.32, 1.12, 0, 1, EIO);
  const punch = 1.22 - 0.12 * io(u, 0, 0.35) + 0.04 * u;
  const after = w > 0.55;
  const [name, sub] = NAMES[key];
  const diag = key === "phare";
  const edge = diag ? w * 140 - 20 : w * 100;
  const clip = diag ? `polygon(0 0, ${edge + 20}% 0, ${edge - 20}% 100%, 0 100%)` : `inset(0 ${100 - w * 100}% 0 0)`;
  const textIn = io(u, 0.05, 0.35);
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <AbsoluteFill style={{ scale: String(punch) }}>
        <Img src={staticFile(`tex/${key}_dirty.jpg`)} style={{ position: "absolute", width: 1080, height: 1920, objectFit: "cover", filter: "brightness(0.82) contrast(1.05)" }} />
        <Img src={staticFile(`tex/${key}_clean.jpg`)} style={{ position: "absolute", width: 1080, height: 1920, objectFit: "cover", clipPath: clip, filter: "brightness(1.1) contrast(1.1) saturate(1.2)" }} />
        {w > 0 && w < 1 && !diag && (
          <>
            <div style={{ position: "absolute", top: 0, bottom: 0, left: `${edge}%`, width: 26, translate: "-50% 0", background: "linear-gradient(90deg, rgba(160,240,255,0), rgba(220,250,255,0.95), rgba(160,240,255,0))", boxShadow: "0 0 60px 20px rgba(120,220,255,0.35)" }} />
            {Array.from({ length: 26 }, (_, k) => (
              <div key={k} style={{ position: "absolute", left: `calc(${edge}% + ${(rand(k) * 80 - 40) + Math.sin(u * 30 + k) * 12}px)`, top: rand(k + 7) * 1920, width: 6 + rand(k + 3) * 10, height: 6 + rand(k + 3) * 10, borderRadius: "50%", background: "rgba(220,250,255,0.75)", filter: "blur(2px)" }} />
            ))}
          </>
        )}
        {diag && w > 0 && w < 1 && (
          <div style={{ position: "absolute", top: -200, bottom: -200, left: `${edge}%`, width: 120, translate: "-50% 0", rotate: "12deg", background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.7), transparent)", filter: "blur(6px)" }} />
        )}
        {u > 1.05 && [0, 1, 2, 3].map((k) => <Star key={k} x={200 + rand(i * 9 + k) * 680} y={500 + rand(i * 9 + k + 4) * 900} s={Math.max(0, Math.sin(io(u, 1.08 + k * 0.08, 1.55 + k * 0.08) * Math.PI)) * (0.5 + rand(k) * 0.6)} />)}
      </AbsoluteFill>
      <AbsoluteFill style={{ background: "linear-gradient(180deg, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0) 28%, rgba(0,0,0,0) 62%, rgba(0,0,0,0.6) 100%)" }} />
      <div style={{ position: "absolute", top: 250, left: 0, right: 0, textAlign: "center", opacity: textIn, translate: `0px ${(1 - textIn) * 30}px` }}>
        <div style={{ display: "inline-block", fontFamily: MONO, fontSize: 30, letterSpacing: 8, padding: "10px 26px", borderRadius: 8, color: after ? "#08140d" : "#fff", background: after ? C.green : "rgba(255,77,94,0.9)" }}>
          {after ? "APRÈS" : "AVANT"}
        </div>
        <div style={{ fontFamily: SERIF_I, fontStyle: "italic", fontSize: 150, lineHeight: 1.05, color: "#fff", marginTop: 16, textShadow: "0 10px 50px rgba(0,0,0,0.6)" }}>{name}</div>
      </div>
      <div style={{ position: "absolute", top: 1290, left: 0, right: 0, textAlign: "center", fontFamily: INTER, fontWeight: 700, fontSize: 50, letterSpacing: 4, textTransform: "uppercase", color: "#fff", opacity: io(u, 0.5, 0.8), textShadow: "0 6px 30px rgba(0,0,0,0.8)" }}>
        {sub}
      </div>
      <div style={{ position: "absolute", top: 160, left: 0, right: 0, display: "flex", justifyContent: "center", gap: 10 }}>
        {TL.items.map((_, k) => (
          <div key={k} style={{ width: 70, height: 6, borderRadius: 3, background: k <= i ? "#fff" : "rgba(255,255,255,0.3)" }} />
        ))}
      </div>
      <AbsoluteFill style={{ background: "#fff", opacity: Math.max(0, 1 - u / 0.12) * 0.45 }} />
    </AbsoluteFill>
  );
};

export const Outro: React.FC<{ t: number; logoOnly?: boolean }> = ({ t }) => {
  const A = TL.outro;
  const lf = t - A;
  const neon = lf < 0.6 ? [1, 0.2, 0.9, 0.1, 1, 0.5, 1][Math.floor(lf / 0.085)] ?? 1 : 1;
  const logoIn = io(t, A + 0.05, A + 0.7);
  const tp = wordT("a9", "Particuliers"), tb = wordT("a9", "Bordeaux"), tdep = wordT("a9", "déplace");
  const cta = io(t, tdep - 0.2, tdep + 0.3);
  const press = 1 - 0.08 * Math.max(0, 1 - Math.abs(t - 63.4) / 0.12);
  const send = io(t, 64.6, 65.0);
  return (
    <AbsoluteFill style={{ fontFamily: INTER, color: C.ink }}>
      <div style={{ position: "absolute", top: 330, left: 0, right: 0, display: "flex", justifyContent: "center", opacity: logoIn * neon, scale: String(0.9 + 0.1 * logoIn), filter: `drop-shadow(0 0 ${30 * neon}px rgba(255,79,163,0.65)) drop-shadow(0 0 ${70 * neon}px rgba(139,92,246,0.45))` }}>
        <Img src={staticFile("logo.png")} style={{ width: 760 }} />
      </div>
      <div style={{ position: "absolute", top: 720, left: 70, right: 70, display: "flex", justifyContent: "center", gap: 14, flexWrap: "wrap" }}>
        {["Canapés", "Matelas", "Tapis", "Véhicules"].map((k, i) => {
          const a = io(t, A + 0.6 + i * 0.12, A + 0.95 + i * 0.12);
          return <div key={k} style={{ padding: "16px 30px", borderRadius: 50, fontSize: 38, fontWeight: 600, border: `1.5px solid ${C.glassBorder}`, background: "rgba(18,10,6,0.5)", opacity: a, translate: `0px ${(1 - a) * 24}px` }}>{k}</div>;
        })}
      </div>
      <div style={{ position: "absolute", top: 880, left: 0, right: 0, textAlign: "center" }}>
        <div style={{ fontFamily: SERIF, fontSize: 76, lineHeight: 1.1, opacity: io(t, tp - 0.15, tp + 0.25) }}>Particuliers & pros</div>
        <div style={{ fontFamily: SERIF_I, fontStyle: "italic", fontSize: 76, lineHeight: 1.1, opacity: io(t, tb - 0.15, tb + 0.25), backgroundImage: BRAND_GRAD, WebkitBackgroundClip: "text", color: "transparent", paddingBottom: 8 }}>Bordeaux & alentours</div>
      </div>
      <div style={{ position: "absolute", top: 1085, left: 0, right: 0, display: "flex", justifyContent: "center", opacity: cta, scale: String((0.9 + 0.1 * cta) * press) }}>
        <div style={{ padding: "26px 54px", borderRadius: 60, fontSize: 44, fontWeight: 700, color: "#fff", background: BRAND_GRAD, boxShadow: "0 0 60px rgba(255,79,163,0.45)" }}>Devis gratuit · lien en bio</div>
      </div>
      <div style={{ position: "absolute", top: 1290, left: 90, right: 90, textAlign: "center", opacity: send, translate: `0px ${(1 - send) * 20}px` }}>
        <div style={{ fontFamily: MONO, fontSize: 24, letterSpacing: 5, color: C.amber }}>SUBLIM·IA SUGGÈRE</div>
        <div style={{ fontSize: 46, fontWeight: 600, marginTop: 12, lineHeight: 1.2 }}>Envoie ça à quelqu'un qui a un canapé à sauver.</div>
      </div>
    </AbsoluteFill>
  );
};
