import React from "react";
import { AbsoluteFill, Img, staticFile } from "remotion";
import { io, rand, TL } from "../lib";

/** Lampe-cage à filament (clin d'œil au plan d'ouverture de la référence) */
export const CageBulb: React.FC<{ t: number; size: number; on: number }> = ({ t, size, on }) => {
  const flicker = on * (0.86 + 0.14 * Math.abs(Math.sin(t * 37) * Math.sin(t * 13.7)));
  const longs = Array.from({ length: 9 }, (_, i) => {
    const ph = (i / 9) * Math.PI + t * 0.35;
    return { rx: Math.abs(Math.cos(ph)) * 170, front: Math.sin(ph) > 0 };
  });
  return (
    <svg width={size} height={size * 1.25} viewBox="-220 -260 440 550" style={{ overflow: "visible" }}>
      <defs>
        <radialGradient id="halo">
          <stop offset="0" stopColor="#fff1c9" stopOpacity={0.95 * flicker} />
          <stop offset="0.18" stopColor="#ffb547" stopOpacity={0.75 * flicker} />
          <stop offset="0.55" stopColor="#ff7a1a" stopOpacity={0.22 * flicker} />
          <stop offset="1" stopColor="#ff7a1a" stopOpacity="0" />
        </radialGradient>
        <filter id="fil" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="3" result="b" />
          <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>
      <circle r={330} fill="url(#halo)" />
      <line x1="0" y1="-260" x2="0" y2="-178" stroke="#3a2412" strokeWidth="10" />
      <rect x="-26" y="-190" width="52" height="30" rx="6" fill="#4a2c14" />
      <g stroke={`rgba(255,${170 + 60 * flicker},${90 + 60 * flicker},${0.35 + 0.5 * on})`} fill="none" strokeWidth="2.2">
        <circle r="170" />
        {longs.map((l, i) => (
          <ellipse key={i} rx={l.rx} ry="170" strokeOpacity={l.front ? 1 : 0.35} />
        ))}
        {[-120, -60, 0, 60, 120].map((y) => (
          <ellipse key={y} cy={y} rx={Math.sqrt(170 * 170 - y * y)} ry={Math.sqrt(170 * 170 - y * y) * 0.12} />
        ))}
      </g>
      <path
        d="M -34 40 L -34 -10 Q -28 -40 -20 -10 Q -12 -40 -4 -10 Q 4 -40 12 -10 Q 20 -40 28 -10 L 34 40"
        stroke={`rgb(255,${200 + 50 * flicker},${140 + 90 * flicker})`}
        strokeWidth={4 + 2 * on}
        fill="none"
        filter="url(#fil)"
        opacity={0.25 + 0.75 * flicker}
      />
    </svg>
  );
};

const PalmLeaf: React.FC<{ rot: number; len: number }> = ({ rot, len }) => (
  <g transform={`rotate(${rot})`}>
    <path d={`M0 0 Q ${len * 0.5} -18 ${len} 0`} stroke="#120703" strokeWidth="7" fill="none" />
    {Array.from({ length: 16 }, (_, i) => {
      const x = (i / 16) * len * 0.95 + 20;
      const l = 120 * Math.sin((i / 16) * Math.PI) + 30;
      return (
        <g key={i}>
          <path d={`M${x} ${-6} q ${l * 0.35} ${-l * 0.6} ${l * 0.9} ${-l}`} stroke="#140803" strokeWidth="16" strokeLinecap="round" fill="none" />
          <path d={`M${x} ${4} q ${l * 0.35} ${l * 0.6} ${l * 0.9} ${l}`} stroke="#140803" strokeWidth="16" strokeLinecap="round" fill="none" />
        </g>
      );
    })}
  </g>
);

/** Décor : pièce sombre et chaude, rideaux, bokeh, plante en avant-plan, lampe */
export const Room: React.FC<{ t: number; brand?: number }> = ({ t, brand = 0 }) => {
  const bulbOn = io(t, 0.08, 0.5);
  const rack = io(t, 0.9, 2.4); // mise au point qui glisse vers l'interface
  const sway = Math.sin(t * 0.35) * 18;
  const push = 1 + 0.035 * Math.min(1, t / 48);
  const bokeh = Array.from({ length: 16 }, (_, i) => {
    const r = 60 + rand(i) * 190;
    const x = rand(i + 40) * 1200 - 60 + Math.sin(t * 0.18 + i) * 30;
    const y = rand(i + 80) * 2000 - 40 + Math.cos(t * 0.15 + i * 2) * 26;
    const warm = rand(i + 120);
    const col = brand > 0.5 && i % 3 === 0 ? (i % 2 ? "255,79,163" : "139,92,246") : warm > 0.5 ? "255,170,80" : "255,120,40";
    return { r, x, y, col, a: (0.10 + rand(i + 160) * 0.22) * (0.5 + 0.5 * bulbOn) };
  });
  return (
    <AbsoluteFill style={{ background: "#0b0503", overflow: "hidden" }}>
      <AbsoluteFill style={{ scale: String(push) }}>
        {/* lumière chaude principale */}
        <AbsoluteFill
          style={{
            opacity: bulbOn,
            background: `radial-gradient(ellipse 70% 55% at ${30 + rack * 8}% ${22 + rack * 6}%, rgba(255,150,60,0.55) 0%, rgba(200,80,20,0.22) 40%, rgba(0,0,0,0) 75%),
              radial-gradient(ellipse 80% 60% at 80% 85%, rgba(${brand > 0 ? "139,60,200" : "120,40,10"},${0.25 + 0.2 * brand}) 0%, rgba(0,0,0,0) 70%)`,
          }}
        />
        {/* rideaux */}
        <AbsoluteFill
          style={{
            opacity: 0.55 * bulbOn,
            translate: `${sway}px 0px`,
            background:
              "repeating-linear-gradient(90deg, rgba(255,160,70,0.0) 0px, rgba(255,160,70,0.16) 60px, rgba(60,20,5,0.05) 120px, rgba(255,150,60,0.10) 170px, rgba(255,160,70,0.0) 220px)",
            filter: "blur(22px)",
            maskImage: "linear-gradient(90deg, transparent 0%, black 45%, black 100%)",
          }}
        />
        {/* bokeh */}
        {bokeh.map((b, i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              left: b.x - b.r,
              top: b.y - b.r,
              width: b.r * 2,
              height: b.r * 2,
              borderRadius: "50%",
              background: `radial-gradient(circle, rgba(${b.col},${b.a}) 0%, rgba(${b.col},${b.a * 0.6}) 55%, rgba(${b.col},0) 72%)`,
              filter: `blur(${8 + rack * 10}px)`,
            }}
          />
        ))}
        {/* lampe : nette au départ puis floutée (mise au point) */}
        <div
          style={{
            position: "absolute",
            left: 280 + rack * 330,
            top: 743 - rack * 720,
            filter: rack > 0.01 ? `blur(${rack * 26}px)` : "none",
            scale: String(1 + rack * 0.35),
            opacity: 1 - rack * 0.35,
          }}
        >
          <CageBulb t={t} size={520} on={bulbOn} />
        </div>
      </AbsoluteFill>
      {/* plante en avant-plan floue (profondeur) */}
      <svg
        width="700"
        height="1100"
        viewBox="0 0 700 1100"
        style={{
          position: "absolute",
          left: -230 + Math.sin(t * 0.5) * 6,
          bottom: -120,
          filter: "blur(9px)",
          opacity: 0.9 * bulbOn,
        }}
      >
        <g transform="translate(40 1080)">
          <PalmLeaf rot={-62 + Math.sin(t * 0.7) * 1.5} len={620} />
          <PalmLeaf rot={-40 + Math.sin(t * 0.6 + 1) * 1.5} len={560} />
          <PalmLeaf rot={-82 + Math.sin(t * 0.8 + 2) * 1.2} len={520} />
        </g>
      </svg>
    </AbsoluteFill>
  );
};

/** grain film + vignettage + étalonnage chaud */
export const FilmLook: React.FC<{ t: number; cool?: number }> = ({ t, cool = 0 }) => {
  const g = Math.floor(t * 24) % 4;
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <AbsoluteFill
        style={{
          background: `radial-gradient(ellipse 85% 70% at 50% 45%, rgba(0,0,0,0) 45%, rgba(0,0,0,${0.55 - cool * 0.15}) 100%)`,
        }}
      />
      <AbsoluteFill style={{ background: cool ? `rgba(20,60,90,${0.10 * cool})` : "rgba(255,120,30,0.05)", mixBlendMode: "soft-light" }} />
      <Img
        src={staticFile(`tex/grain${g}.png`)}
        style={{ width: "100%", height: "100%", objectFit: "cover", opacity: 0.11, mixBlendMode: "overlay", translate: `${(g % 2) * 7}px ${(g > 1 ? 1 : -1) * 5}px` }}
      />
    </AbsoluteFill>
  );
};

export const DUR = TL.duration;
