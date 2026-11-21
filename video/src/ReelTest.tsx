import React from 'react';
import {AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';

export const ReelTest: React.FC<{titre: string}> = ({titre}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const scale = spring({frame, fps, config: {damping: 12}});
  const opacity = interpolate(frame, [20, 40], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  return (
    <AbsoluteFill style={{background: 'linear-gradient(160deg,#111 0%,#3a2a5c 100%)', justifyContent: 'center', alignItems: 'center', fontFamily: 'sans-serif', color: 'white'}}>
      <div style={{fontSize: 140, fontWeight: 800, transform: `scale(${scale})`}}>{titre}</div>
      <div style={{fontSize: 56, marginTop: 40, opacity}}>Remotion fonctionne ✓</div>
    </AbsoluteFill>
  );
};
