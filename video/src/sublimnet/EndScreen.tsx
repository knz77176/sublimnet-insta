import React from 'react';
import {AbsoluteFill, Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {colors, fonts} from './theme';

/** Écran de fin noir : logo néon, baseline, téléphone, réseaux, site. */
export const EndScreen: React.FC<{logo: string}> = ({logo}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const sp = (d: number) => spring({frame: frame - d, fps, config: {damping: 200}, durationInFrames: 20});
  const rise = (d: number) => ({opacity: sp(d), transform: `translateY(${interpolate(sp(d), [0, 1], [18, 0])}px)`});
  const glow = 0.75 + 0.25 * Math.sin(frame / 9);

  return (
    <AbsoluteFill style={{backgroundColor: '#050407', alignItems: 'center', justifyContent: 'center', color: colors.white}}>
      <AbsoluteFill
        style={{background: 'radial-gradient(60% 35% at 50% 42%, rgba(138,92,246,0.20), rgba(214,58,143,0.06) 55%, transparent 75%)'}}
      />
      <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: -60}}>
        <Img
          src={staticFile(logo)}
          style={{
            width: 640,
            opacity: sp(0),
            transform: `scale(${interpolate(sp(0), [0, 1], [0.92, 1])})`,
            filter: `drop-shadow(0 0 ${18 * glow}px rgba(214,58,143,0.55)) drop-shadow(0 0 ${36 * glow}px rgba(63,199,230,0.35))`,
          }}
        />
        <div style={{...rise(8), marginTop: 50, width: 120, height: 3, borderRadius: 2, background: colors.gradient}} />
        <div style={{...rise(10), marginTop: 26, fontFamily: fonts.header, fontStyle: 'italic', fontSize: 38, color: colors.lavender}}>
          Detailing automobile à domicile · Bordeaux
        </div>
        <div style={{...rise(14), marginTop: 40, fontFamily: fonts.header, fontWeight: 600, fontSize: 82, letterSpacing: '0.02em'}}>
          07 79 72 60 76
        </div>
        <div style={{...rise(18), marginTop: 46, display: 'flex', alignItems: 'stretch'}}>
          {[
            ['SNAPCHAT', 'sublimnett', colors.avant],
            ['INSTAGRAM', '@sublimnet', colors.apres],
          ].map(([label, val, c], i) => (
            <div
              key={label}
              style={{
                padding: '0 56px',
                textAlign: 'center',
                borderLeft: i ? '1px solid rgba(255,255,255,0.18)' : 'none',
              }}
            >
              <div style={{fontFamily: fonts.header, fontWeight: 600, fontSize: 22, letterSpacing: '0.3em', color: c}}>{label}</div>
              <div style={{fontFamily: fonts.header, fontSize: 38, marginTop: 10}}>{val}</div>
            </div>
          ))}
        </div>
        <div style={{...rise(22), marginTop: 56, fontFamily: fonts.header, fontSize: 28, letterSpacing: '0.12em', opacity: 0.7}}>
          sublimnet.com
        </div>
      </div>
    </AbsoluteFill>
  );
};
