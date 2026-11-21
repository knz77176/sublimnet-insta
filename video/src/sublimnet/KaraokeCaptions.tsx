import React from 'react';
import {useCurrentFrame, useVideoConfig} from 'remotion';
import {createTikTokStyleCaptions, type Caption} from '@remotion/captions';
import {caption, colors, fonts, textShadow} from './theme';

/**
 * Sous-titres style SublimNet : 2-4 mots à la fois, mot prononcé en blanc,
 * le reste en lavande. `captions` = format @remotion/captions (ms).
 */
export const KaraokeCaptions: React.FC<{captions: Caption[]; combineMs?: number}> = ({
  captions,
  combineMs = 900,
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const nowMs = (frame / fps) * 1000;
  const {pages} = createTikTokStyleCaptions({captions, combineTokensWithinMilliseconds: combineMs});
  const page = pages.find((p, i) => nowMs >= p.startMs && nowMs < (pages[i + 1]?.startMs ?? p.startMs + p.durationMs));
  if (!page) return null;

  return (
    <div
      style={{
        position: 'absolute',
        left: caption.sidePadding,
        right: caption.sidePadding,
        top: caption.centerY,
        transform: 'translateY(-50%)',
        textAlign: 'center',
        fontFamily: fonts.caption,
        fontWeight: 600,
        fontSize: caption.size,
        lineHeight: 1.2,
        textShadow,
        whiteSpace: 'pre-wrap',
      }}
    >
      {page.tokens.map((t, i) => (
        <span key={i} style={{color: nowMs >= t.fromMs ? colors.white : colors.lavender}}>
          {t.text}
        </span>
      ))}
    </div>
  );
};
