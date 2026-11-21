import React from 'react';
import {Composition} from 'remotion';
import {ReelTest} from './ReelTest';
import {Montage, dureeMontage, type MontageProps} from './sublimnet/Montage';
import montage from './montage.json';
import {SublimReel, reelDuration, type SublimReelProps} from './sublimnet/SublimReel';

// Démo : reproduit les plans du montage Cupra pour vérifier la DA
const demo: SublimReelProps = {
  segments: [
    {src: 'rushes/cupra-reference.mp4', trimStart: 0, duration: 2, muted: true,
      header: {overline: 'SublimNet', title: 'Cupra 2025', subtitle: 'Rénovation intérieure complète', badge: 'avant'}},
    {src: 'rushes/cupra-reference.mp4', trimStart: 2.5, duration: 2, muted: true,
      header: {overline: 'SublimNet', title: 'Cupra 2025', subtitle: 'Rénovation intérieure complète', badge: 'apres'}},
    {src: 'rushes/cupra-reference.mp4', trimStart: 29, duration: 3, muted: true,
      header: {overline: 'Detailing automobile', title: 'SublimNet', subtitle: 'À domicile · Bordeaux'}},
  ],
  captions: [
    {text: 'Je', startMs: 4200, endMs: 4400, timestampMs: null, confidence: null},
    {text: ' vais', startMs: 4400, endMs: 4650, timestampMs: null, confidence: null},
    {text: ' vous', startMs: 4650, endMs: 4900, timestampMs: null, confidence: null},
    {text: ' laisser', startMs: 4900, endMs: 5400, timestampMs: null, confidence: null},
    {text: ' admirer', startMs: 5600, endMs: 6100, timestampMs: null, confidence: null},
    {text: ' le', startMs: 6100, endMs: 6300, timestampMs: null, confidence: null},
    {text: ' résultat.', startMs: 6300, endMs: 7000, timestampMs: null, confidence: null},
  ],
};

export const RemotionRoot: React.FC = () => (
  <>
    <Composition id="Montage" component={Montage} fps={30} width={1080} height={1920}
      durationInFrames={dureeMontage(montage as MontageProps)} defaultProps={montage as MontageProps}
      calculateMetadata={({props}) => ({durationInFrames: dureeMontage(props)})} />
    <Composition id="ReelTest" component={ReelTest} durationInFrames={90} fps={30} width={1080} height={1920}
      defaultProps={{titre: 'Sublimnet'}} />
    <Composition id="SublimReel" component={SublimReel} fps={30} width={1080} height={1920}
      durationInFrames={reelDuration(demo.segments, 30)} defaultProps={demo}
      calculateMetadata={({props}) => ({durationInFrames: reelDuration(props.segments, 30)})} />
  </>
);
