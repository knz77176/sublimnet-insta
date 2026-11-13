import { Easing, interpolate } from "remotion";
import tl from "./timeline.json";
import env from "./env.json";

export const TL = tl;
export const ENV = env as { ai: number[]; founder: number[] };
export const EO = Easing.bezier(0.16, 1, 0.3, 1);
export const EIO = Easing.bezier(0.65, 0, 0.35, 1);

/** interpolation bornée en secondes */
export const io = (t: number, a: number, b: number, from = 0, to = 1, easing = EO) =>
  interpolate(t, [a, b], [from, to], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing });

/** présence 0..1 entre a et b avec fondus */
export const win = (t: number, a: number, b: number, fi = 0.45, fo = 0.4) => Math.min(io(t, a, a + fi), 1 - io(t, b - fo, b));

/** apparition "verre" : flou -> net, léger zoom et montée ; sortie floue */
export const reveal = (t: number, a: number, b: number, dist = 46): React.CSSProperties => {
  const i = io(t, a, a + 0.55);
  const o = io(t, b - 0.4, b, 0, 1, EIO);
  const blur = (1 - i) * 22 + o * 18;
  return {
    opacity: i * (1 - o),
    filter: blur > 0.05 ? `blur(${blur.toFixed(2)}px)` : "none",
    scale: String(0.93 + 0.07 * i + 0.06 * o),
    translate: `0px ${((1 - i) * dist - o * 30).toFixed(1)}px`,
  };
};

/** bruit pseudo-aléatoire déterministe */
export const rand = (i: number) => {
  const x = Math.sin(i * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
};

export const voiceAt = (id: string) => TL.voice.find((v) => v.id === id)!;
export const wordT = (id: string, needle: string, k = 0) =>
  voiceAt(id).words.filter((w) => w.w.toLowerCase().includes(needle.toLowerCase()))[k].s;
export const envAt = (who: "ai" | "founder", t: number) => ENV[who][Math.max(0, Math.min(ENV[who].length - 1, Math.round(t * TL.fps)))] ?? 0;
