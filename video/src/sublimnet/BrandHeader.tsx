import React from 'react';
import {interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {colors, fonts, header, textShadow} from './theme';

export type BrandHeaderProps = {
  overline: string; // ex. « DETAILING AUTOMOBILE »
  title: string; // ex. « Cupra 2025 »
  subtitle?: string; // ex. « Rénovation intérieure complète »
  badge?: 'avant' | 'apres' | null;
};

/** Petit bloc en haut à gauche qui explique ce qui se passe dans la vidéo. */
export const BrandHeader: React.FC<BrandHeaderProps> = ({overline, title, subtitle, badge}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const enter = (delay: number) => spring({frame: frame - delay, fps, config: {damping: 200}, durationInFrames: 18});
  const rise = (delay: number) => ({
    opacity: enter(delay),
    transform: `translateY(${interpolate(enter(delay), [0, 1], [14, 0])}px)`,
  });

  return (
    <div style={{position: 'absolute', left: header.left, top: header.top, textShadow}}>
      <div
        style={{
          ...rise(0),
          fontFamily: fonts.header,
          fontWeight: 600,
          fontSize: header.overlineSize,
          letterSpacing: header.overlineSpacing,
          textTransform: 'uppercase',
          color: colors.overline,
        }}
      >
        {overline}
      </div>
      <div
        style={{
          marginTop: 18,
          width: header.ruleWidth * enter(4),
          height: header.ruleHeight,
          borderRadius: 2,
          background: colors.gradient,
        }}
      />
      <div
        style={{
          ...rise(6),
          marginTop: 17,
          fontFamily: fonts.header,
          fontStyle: 'italic',
          fontWeight: 700,
          fontSize: header.titleSize,
          lineHeight: 1.05,
          color: colors.white,
        }}
      >
        {title}
      </div>
      {subtitle ? (
        <div
          style={{
            ...rise(10),
            marginTop: 10,
            fontFamily: fonts.header,
            fontWeight: 400,
            fontSize: header.subtitleSize,
            color: colors.lavender,
          }}
        >
          {subtitle}
        </div>
      ) : null}
      {badge ? (
        <div
          style={{
            ...rise(14),
            marginTop: 16,
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            fontFamily: fonts.header,
            fontWeight: 600,
            fontSize: header.badgeSize,
            letterSpacing: '0.3em',
            color: colors.white,
          }}
        >
          <span
            style={{
              width: 11,
              height: 11,
              borderRadius: 99,
              background: badge === 'avant' ? colors.avant : colors.apres,
              boxShadow: `0 0 10px ${badge === 'avant' ? colors.avant : colors.apres}`,
            }}
          />
          {badge === 'avant' ? 'AVANT' : 'APRÈS'}
        </div>
      ) : null}
    </div>
  );
};
