import React from "react";
import { AbsoluteFill } from "remotion";
import { C, INTER, MONO, SERIF_I } from "../theme";
import { envAt, io, TL } from "../lib";

type W = { w: string; s: number; e: number };
const chunk = (words: W[]) => {
  const out: W[][] = []; let cur: W[] = [];
  words.forEach((w, i) => {
    cur.push(w);
    const len = cur.map((x) => x.w).join(" ").length;
    const punct = /[.,:?!…]$/.test(w.w);
    const gap = i < words.length - 1 ? words[i + 1].s - w.e : 1;
    if (len > 24 || (punct && len > 8) || gap > 0.35 || cur.length >= 5) { out.push(cur); cur = []; }
  });
  if (cur.length) out.push(cur);
  return out;
};
const CHUNKS = TL.voice.map((v) => ({ ...v, chunks: chunk(v.words) }));

/** Orbe vocal de l'IA */
export const Orb: React.FC<{ t: number; size?: number }> = ({ t, size = 96 }) => {
  const a = envAt("ai", t);
  return (
    <div style={{ position: "relative", width: size, height: size }}>
      {[0, 1, 2].map((k) => (
        <div key={k} style={{ position: "absolute", inset: 0, borderRadius: "50%", border: `2px solid rgba(255,179,92,${0.5 - k * 0.15})`, scale: String(1 + a * (0.25 + k * 0.22) + 0.04 * Math.sin(t * 3 + k)) }} />
      ))}
      <div
        style={{
          position: "absolute", inset: size * 0.14, borderRadius: "50%",
          background: `radial-gradient(circle at 35% 30%, #fff3dc 0%, ${C.amber} 30%, ${C.amberDeep} 62%, #7a2a05 100%)`,
          boxShadow: `0 0 ${30 + a * 60}px rgba(255,140,40,${0.5 + a * 0.4})`,
          scale: String(0.92 + a * 0.16),
          rotate: `${t * 40}deg`,
        }}
      />
    </div>
  );
};

export const Captions: React.FC<{ t: number }> = ({ t }) => {
  const v = CHUNKS.find((x) => t >= x.start - 0.1 && t <= x.end + 0.35);
  if (!v) return null;
  const ck = v.chunks.find((c, i) => t < (v.chunks[i + 1]?.[0].s ?? 1e9) - 0.02) ?? v.chunks[v.chunks.length - 1];
  const founder = v.speaker === "founder";
  const lineIn = io(t, ck[0].s - 0.12, ck[0].s + 0.1);
  const out = 1 - io(t, v.end + 0.15, v.end + 0.35);
  const vin = io(t, v.start - 0.1, v.start + 0.2);
  const fa = envAt("founder", t);
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <div style={{ position: "absolute", top: 1235, left: 0, right: 0, display: "flex", flexDirection: "column", alignItems: "center", opacity: out * vin }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 18, height: 64 }}>
          {founder ? (
            <div style={{ display: "flex", gap: 6, alignItems: "center", height: 40 }}>
              {Array.from({ length: 7 }, (_, i) => (
                <div key={i} style={{ width: 6, borderRadius: 3, background: C.pink, height: 8 + fa * 32 * (0.5 + 0.5 * Math.abs(Math.sin(t * 9 + i * 1.3))) }} />
              ))}
            </div>
          ) : (
            <Orb t={t} size={60} />
          )}
          <div style={{ fontFamily: MONO, fontSize: 24, letterSpacing: 5, color: founder ? C.pink : C.amber, textTransform: "uppercase" }}>
            {founder ? "Le patron" : "Sublim·IA"}
          </div>
        </div>
        <div
          style={{
            maxWidth: 900, textAlign: "center", padding: "0 60px",
            fontFamily: founder ? SERIF_I : INTER, fontStyle: founder ? "italic" : "normal",
            fontSize: founder ? 70 : 54,
            fontWeight: founder ? 500 : 600,
            lineHeight: 1.12,
            letterSpacing: founder ? 0 : -0.5,
            color: C.ink,
            textShadow: "0 4px 30px rgba(0,0,0,0.85), 0 0 2px rgba(0,0,0,0.9)",
            opacity: lineIn,
            translate: `0px ${(1 - lineIn) * 18}px`,
            filter: lineIn < 0.99 ? `blur(${(1 - lineIn) * 8}px)` : "none",
          }}
        >
          {ck.map((w, i) => {
            const active = t >= w.s - 0.04;
            const now = t >= w.s - 0.04 && t <= w.e + 0.05;
            return (
              <span
                key={i}
                style={{
                  opacity: active ? 1 : 0.38,
                  ...(now && !founder
                    ? { color: C.amber }
                    : now && founder
                      ? { color: C.pink }
                      : {}),
                }}
              >
                {w.w}{i < ck.length - 1 ? " " : ""}
              </span>
            );
          })}
        </div>
      </div>
    </AbsoluteFill>
  );
};
