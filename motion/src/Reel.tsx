import React from "react";
import { AbsoluteFill, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { Audio } from "@remotion/media";
import { Room, FilmLook } from "./ui/Room";
import { Captions } from "./ui/Captions";
import { Hook, Dashboard, Viral, Messages, Method } from "./scenes/Act1";
import { Devis, Agent, Diagnostic, MapScene, Call, Flash } from "./scenes/Act2";
import { Montage, Outro } from "./scenes/Act3";
import { TL, io } from "./lib";

const In: React.FC<{ t: number; a: number; b: number; children: React.ReactNode }> = ({ t, a, b, children }) => (t >= a - 0.05 && t <= b + 0.05 ? <>{children}</> : null);

export const Reel: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const D = TL.drop, O = TL.outro, END = TL.duration;
  const montage = t >= D && t < O;
  const shake = { translate: `${(Math.sin(t * 1.3) * 3 + Math.sin(t * 7.1) * 0.8).toFixed(2)}px ${(Math.cos(t * 1.1) * 3).toFixed(2)}px` };
  const lampOff = t > END - 0.72;
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <Audio src={staticFile("audio/mix.wav")} />
      {!montage && !lampOff && <Room t={t < O ? t : 2.5 + (t - O)} brand={io(t, O, O + 1)} />}
      {!lampOff && (
        <AbsoluteFill style={shake}>
          <In t={t} a={0} b={4.6}><Hook t={t} /></In>
          <In t={t} a={1.4} b={8.1}><Dashboard t={t} /></In>
          <In t={t} a={7.9} b={10.8}><Viral t={t} /></In>
          <In t={t} a={10.8} b={15.1}><Messages t={t} /></In>
          <In t={t} a={15.1} b={18.1}><Method t={t} /></In>
          <In t={t} a={18.2} b={27.6}><Devis t={t} /></In>
          <In t={t} a={27.45} b={29.85}><Agent t={t} /></In>
          <In t={t} a={29.6} b={36.0}><Diagnostic t={t} /></In>
          <In t={t} a={36.0} b={41.0}><MapScene t={t} /></In>
          <In t={t} a={40.9} b={D}><Call t={t} drop={D} /></In>
          {montage && <Montage t={t} />}
          <In t={t} a={O} b={END}><Outro t={t} /></In>
          {!montage && <Captions t={t} />}
        </AbsoluteFill>
      )}
      {!lampOff && <FilmLook t={t} cool={montage ? 0.35 : 0} />}
      <Flash t={t} at={D} dur={0.35} />
      <Flash t={t} at={O} dur={0.25} color="#ffd6b0" />
      <AbsoluteFill style={{ background: "#000", opacity: io(t, 0, 0.12, 1, 0) }} />
    </AbsoluteFill>
  );
};
