import React from 'react';
import {interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {colors, fonts, header, textShadow} from './theme';

export type ZoneCardProps = {
  numero: number;
  total: number;
  titre: string; // « Porte conducteur »
  matiere: string; // « Plastiques »
  etapes: string[]; // « Aspiration en profondeur »…
  /** frame (relative à la zone) où l'on passe de AVANT à APRÈS */
  basculeFrame: number;
};

const pad = (n: number) => String(n).padStart(2, '0');

/** Carte de zone « 03 / 14 — Siège conducteur — Cuir & Alcantara — ● AVANT/APRÈS — étapes ». */
export const ZoneCard: React.FC<ZoneCardProps> = ({numero, total, titre, matiere, etapes, basculeFrame}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const sp = (d: number, f = frame) => spring({frame: f - d, fps, config: {damping: 200}, durationInFrames: 16});
  const rise = (d: number, f = frame) => ({
    opacity: sp(d, f),
    transform: `translateY(${interpolate(sp(d, f), [0, 1], [16, 0])}px)`,
  });
  const apres = frame >= basculeFrame;
  const fApres = frame - basculeFrame;
  const badgeAnim = apres ? sp(0, fApres) : sp(12);
  const couleur = apres ? colors.apres : colors.avant;

  return (
    <div style={{position: 'absolute', left: header.left, top: header.top, right: 60, textShadow}}>
      <div style={{...rise(0), display: 'flex', alignItems: 'center', gap: 18, fontFamily: fonts.header, color: colors.overline}}>
        <span style={{fontSize: 34, fontWeight: 600, letterSpacing: '0.08em'}}>{pad(numero)}</span>
        <span style={{fontSize: 30, opacity: 0.75, letterSpacing: '0.08em'}}>/ {pad(total)}</span>
        <span style={{width: 92 * sp(3), height: 3, borderRadius: 2, background: colors.gradient, marginLeft: 6}} />
      </div>
      <div
        style={{
          ...rise(5),
          marginTop: 14,
          fontFamily: fonts.header,
          fontWeight: 700,
          fontSize: 80,
          lineHeight: 1.04,
          color: colors.white,
        }}
      >
        {titre}
      </div>
      <div style={{...rise(9), marginTop: 6, fontFamily: fonts.header, fontStyle: 'italic', fontSize: 40, color: colors.lavender}}>
        {matiere}
      </div>
      <div
        style={{
          opacity: badgeAnim,
          transform: `translateX(${interpolate(badgeAnim, [0, 1], [-12, 0])}px)`,
          marginTop: 30,
          display: 'flex',
          alignItems: 'center',
          gap: 16,
          fontFamily: fonts.header,
          fontWeight: 600,
          fontSize: 27,
          letterSpacing: '0.3em',
          color: colors.overline,
        }}
      >
        <span style={{width: 15, height: 15, borderRadius: 99, background: couleur, boxShadow: `0 0 14px ${couleur}`}} />
        {apres ? 'APRÈS' : 'AVANT'}
      </div>
      {apres ? (
        <div style={{marginTop: 22}}>
          {etapes.map((e, i) => (
            <div
              key={e}
              style={{
                ...rise(8 + i * 9, fApres),
                display: 'flex',
                gap: 18,
                fontFamily: fonts.header,
                fontSize: 36,
                lineHeight: 1.55,
                color: colors.white,
              }}
            >
              <span style={{opacity: 0.7}}>—</span>
              {e}
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
};
