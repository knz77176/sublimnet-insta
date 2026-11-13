import React from "react";
import { glass } from "../theme";
import { reveal } from "../lib";

export const Card: React.FC<{
  t: number; a: number; b: number; y: number; w: number; h?: number; x?: number;
  tiltX?: number; tiltY?: number; pad?: number; radius?: number; style?: React.CSSProperties; children?: React.ReactNode;
}> = ({ t, a, b, y, w, h, x, tiltX = 4, tiltY = -3, pad = 40, radius, style, children }) => {
  const drift = Math.sin((t + a) * 0.8) * 6;
  const ry = tiltY + Math.sin((t + a) * 0.4) * 1.5;
  return (
    <div
      style={{
        position: "absolute", left: x ?? (1080 - w) / 2, top: y, width: w, height: h, padding: pad, boxSizing: "border-box",
        ...glass, ...(radius ? { borderRadius: radius } : {}), ...reveal(t, a, b),
        transform: `perspective(1800px) rotateX(${tiltX}deg) rotateY(${ry}deg) translateY(${drift}px)`,
        ...style,
      }}
    >
      {children}
    </div>
  );
};

export const Label: React.FC<{ children: React.ReactNode; color?: string; size?: number; style?: React.CSSProperties }> = ({ children, color = "rgba(247,239,230,0.55)", size = 24, style }) => (
  <div style={{ fontSize: size, letterSpacing: 4, textTransform: "uppercase", color, fontWeight: 500, ...style }}>{children}</div>
);
