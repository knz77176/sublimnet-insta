import { loadFont } from "@remotion/fonts";
import { staticFile } from "remotion";
import fonts from "./fonts.json";

fonts.forEach((f) => {
  loadFont({ family: f.family, url: staticFile(`fonts/${f.file}`), weight: f.weight, style: f.style, unicodeRange: f.unicodeRange, format: "woff2" });
});
export const INTER = "Inter";
export const SERIF = "CormorantGaramond";
export const SERIF_I = "CormorantGaramond";
export const MONO = "JetBrainsMono";
export const C = {
  ink: "#f7efe6",
  dim: "rgba(247,239,230,0.62)",
  faint: "rgba(247,239,230,0.38)",
  amber: "#ffb35c",
  amberDeep: "#ff7a1a",
  green: "#3ee08f",
  red: "#ff4d5e",
  pink: "#ff4fa3",
  violet: "#8b5cf6",
  cyan: "#22d3ee",
  glassBorder: "rgba(255,226,196,0.20)",
};
export const BRAND_GRAD = `linear-gradient(90deg, ${C.pink} 0%, ${C.violet} 55%, ${C.cyan} 100%)`;

export const glass: React.CSSProperties = {
  background: "linear-gradient(160deg, rgba(255,236,214,0.13) 0%, rgba(255,236,214,0.045) 45%, rgba(20,10,6,0.30) 100%), rgba(18,10,6,0.46)",
  border: `1.5px solid ${C.glassBorder}`,
  borderRadius: 38,
  boxShadow: "0 40px 90px rgba(0,0,0,0.55), inset 0 1.5px 0 rgba(255,240,220,0.22), inset 0 -20px 60px rgba(255,140,40,0.06)",
  color: C.ink,
  fontFamily: INTER,
};
