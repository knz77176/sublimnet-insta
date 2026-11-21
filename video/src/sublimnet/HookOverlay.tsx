import React from 'react';
import {interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {colors, fonts, header, textShadow} from './theme';

/** Accroche des 2 premières secondes : petit label + grande phrase serif, mot clé en dégradé. */
export const HookOverlay: React.FC<{petit: string; texte: string}> = ({petit, texte}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const sp = (d: number) => spring({frame: frame - d, fps, config: {damping: 18, stiffness: 160}, durationInFrames: 14});
  // *mot* = mis en valeur (italique dégradé)
  const parts = texte.split(/(\*[^*]+\*)/g).filter(Boolean);
  return (
    <div style={{position: 'absolute', left: header.left, right: 70, top: header.top, textShadow}}>
      {petit ? (
        <div
          style={{
            opacity: sp(0),
            fontFamily: fonts.header,
            fontWeight: 600,
            fontSize: 26,
            letterSpacing: '0.32em',
            textTransform: 'uppercase',
            color: colors.overline,
          }}
        >
          {petit}
        </div>
      ) : null}
      <div style={{marginTop: 18, width: 92 * sp(2), height: 3, borderRadius: 2, background: colors.gradient}} />
      <div
        style={{
          marginTop: 22,
          opacity: sp(3),
          transform: `translateY(${interpolate(sp(3), [0, 1], [24, 0])}px)`,
          fontFamily: fonts.header,
          fontWeight: 700,
          fontSize: 92,
          lineHeight: 1.06,
          color: colors.white,
        }}
      >
        {parts.map((p, i) =>
          p.startsWith('*') ? (
            <span
              key={i}
              style={{
                fontStyle: 'italic',
                background: colors.gradient,
                WebkitBackgroundClip: 'text',
                backgroundClip: 'text',
                color: 'transparent',
                textShadow: 'none',
                filter: 'drop-shadow(0 2px 8px rgba(0,0,0,0.5))',
              }}
            >
              {p.slice(1, -1)}
            </span>
          ) : (
            <span key={i}>{p}</span>
          ),
        )}
      </div>
    </div>
  );
};
