import React from 'react';
import {AbsoluteFill, Sequence, staticFile, useVideoConfig} from 'remotion';
import {Video} from '@remotion/media';
import type {Caption} from '@remotion/captions';
import {BrandHeader, type BrandHeaderProps} from './BrandHeader';
import {KaraokeCaptions} from './KaraokeCaptions';

export type ReelSegment = {
  /** Fichier dans public/, ex. « rushes/avant.mp4 » */
  src: string;
  /** Début dans le rush (secondes) */
  trimStart?: number;
  /** Durée du plan (secondes) */
  duration: number;
  /** Bloc en haut à gauche pendant ce plan */
  header: BrandHeaderProps;
  muted?: boolean;
};

export type SublimReelProps = {
  segments: ReelSegment[];
  captions: Caption[];
};

/** Modèle de Reel SublimNet : plans successifs + bloc haut-gauche + sous-titres karaoké. */
export const SublimReel: React.FC<SublimReelProps> = ({segments, captions}) => {
  const {fps} = useVideoConfig();
  let from = 0;
  return (
    <AbsoluteFill style={{backgroundColor: 'black'}}>
      {segments.map((s, i) => {
        const start = from;
        const dur = Math.round(s.duration * fps);
        from += dur;
        return (
          <Sequence key={i} from={start} durationInFrames={dur}>
            <AbsoluteFill>
              <Video
                src={staticFile(s.src)}
                trimBefore={Math.round((s.trimStart ?? 0) * fps)}
                muted={s.muted}
                style={{width: '100%', height: '100%', objectFit: 'cover'}}
              />
              {/* léger voile pour la lisibilité du texte */}
              <AbsoluteFill
                style={{
                  background:
                    'linear-gradient(180deg, rgba(0,0,0,0.45) 0%, rgba(0,0,0,0) 24%, rgba(0,0,0,0) 62%, rgba(0,0,0,0.35) 100%)',
                }}
              />
              <BrandHeader {...s.header} />
            </AbsoluteFill>
          </Sequence>
        );
      })}
      <KaraokeCaptions captions={captions} />
    </AbsoluteFill>
  );
};

export const reelDuration = (segments: ReelSegment[], fps: number) =>
  segments.reduce((acc, s) => acc + Math.round(s.duration * fps), 0);
