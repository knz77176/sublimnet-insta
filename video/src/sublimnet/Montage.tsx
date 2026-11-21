import React from 'react';
import {AbsoluteFill, interpolate, Sequence, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {Audio, Video} from '@remotion/media';
import type {Caption} from '@remotion/captions';
import {BrandHeader} from './BrandHeader';
import {ZoneCard} from './ZoneCard';
import {EndScreen} from './EndScreen';
import {HookOverlay} from './HookOverlay';
import {KaraokeCaptions} from './KaraokeCaptions';

type Plan = {clip: string; duree: number};
export type Bloc =
  | {type: 'accroche'; petit: string; texte: string; plans: Plan[]}
  | {type: 'intro'; titre: string; sousTitre: string; plansAvant: Plan[]; plansApres: Plan[]}
  | {type: 'facecam'; plans: Plan[]}
  | {type: 'zone'; numero: number; total: number; titre: string; matiere: string; etapes: string[]; plansAvant: Plan[]; plansApres: Plan[]}
  | {type: 'fin'; duree: number};

export type MontageProps = {
  fps: number;
  blocs: Bloc[];
  captions: Caption[];
  musique: string | null;
  volumeMusique: number;
  logo?: string;
};

const f = (s: number, fps: number) => Math.round(s * fps);
const sum = (p: Plan[], fps: number) => p.reduce((a, x) => a + f(x.duree, fps), 0);

export const dureeBloc = (b: Bloc, fps: number) => {
  switch (b.type) {
    case 'accroche':
    case 'facecam':
      return sum(b.plans, fps);
    case 'intro':
    case 'zone':
      return sum(b.plansAvant, fps) + sum(b.plansApres, fps);
    case 'fin':
      return f(b.duree, fps);
  }
};
export const dureeMontage = (p: MontageProps) => p.blocs.reduce((a, b) => a + dureeBloc(b, p.fps), 0);

/** Un plan vidéo, avec un très léger zoom continu pour garder de la vie. */
const Shot: React.FC<{clip: string; frames: number; volume?: number}> = ({clip, frames, volume = 1}) => {
  const frame = useCurrentFrame();
  const scale = interpolate(frame, [0, frames], [1.0, 1.035]);
  return (
    <AbsoluteFill style={{overflow: 'hidden'}}>
      <Video
        src={staticFile(clip)}
        volume={volume}
        objectFit="cover"
        style={{width: '100%', height: '100%', transform: `scale(${scale})`}}
      />
    </AbsoluteFill>
  );
};

const Shots: React.FC<{plans: Plan[]; volume?: number}> = ({plans, volume}) => {
  const {fps} = useVideoConfig();
  let from = 0;
  return (
    <>
      {plans.map((p, i) => {
        const d = f(p.duree, fps);
        const s = from;
        from += d;
        return (
          <Sequence key={i} from={s} durationInFrames={d} layout="none">
            <Shot clip={p.clip} frames={d} volume={volume} />
          </Sequence>
        );
      })}
    </>
  );
};

/** Vignette sombre légère + dégradé haut pour la lisibilité du texte. */
const Vignette: React.FC = () => (
  <>
    <AbsoluteFill style={{background: 'radial-gradient(120% 85% at 50% 50%, transparent 55%, rgba(0,0,0,0.55) 100%)'}} />
    <AbsoluteFill
      style={{
        background: 'linear-gradient(180deg, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.15) 30%, transparent 45%, transparent 70%, rgba(0,0,0,0.25) 100%)',
      }}
    />
  </>
);

/** Petit flash blanc sur la bascule AVANT -> APRÈS. */
const Flash: React.FC = () => {
  const frame = useCurrentFrame();
  return <AbsoluteFill style={{backgroundColor: 'white', opacity: interpolate(frame, [0, 2, 7], [0, 0.35, 0], {extrapolateRight: 'clamp'})}} />;
};

const BlocView: React.FC<{b: Bloc; logo: string}> = ({b, logo}) => {
  const {fps} = useVideoConfig();
  if (b.type === 'fin') return <EndScreen logo={logo} />;
  if (b.type === 'accroche')
    return (
      <AbsoluteFill>
        <Shots plans={b.plans} />
        <Vignette />
        <HookOverlay petit={b.petit} texte={b.texte} />
      </AbsoluteFill>
    );
  if (b.type === 'facecam')
    return (
      <AbsoluteFill>
        <Shots plans={b.plans} />
        <Vignette />
        <BrandHeader overline="Detailing automobile" title="SublimNet" subtitle="À domicile · Bordeaux" />
      </AbsoluteFill>
    );
  const av = sum(b.plansAvant, fps);
  return (
    <AbsoluteFill>
      <Shots plans={b.plansAvant} />
      <Sequence from={av} layout="none">
        <Shots plans={b.plansApres} />
      </Sequence>
      <Vignette />
      {av > 0 ? (
        <Sequence from={av} durationInFrames={8} layout="none">
          <Flash />
        </Sequence>
      ) : null}
      {b.type === 'intro' ? (
        <>
          <Sequence durationInFrames={av} layout="none">
            <BrandHeader overline="SublimNet" title={b.titre} subtitle={b.sousTitre} badge="avant" />
          </Sequence>
          <Sequence from={av} layout="none">
            <BrandHeader overline="SublimNet" title={b.titre} subtitle={b.sousTitre} badge="apres" />
          </Sequence>
        </>
      ) : (
        <ZoneCard numero={b.numero} total={b.total} titre={b.titre} matiere={b.matiere} etapes={b.etapes} basculeFrame={av} />
      )}
    </AbsoluteFill>
  );
};

export const Montage: React.FC<MontageProps> = (props) => {
  const {fps, durationInFrames} = useVideoConfig();
  const logo = props.logo ?? 'logo.png';
  // fenêtre face caméra -> on baisse la musique sous la voix
  let t = 0;
  const fenetres: [number, number][] = [];
  props.blocs.forEach((b) => {
    const d = dureeBloc(b, fps);
    if (b.type === 'facecam') fenetres.push([t, t + d]);
    t += d;
  });
  const vol = (fr: number) => {
    const voix = fenetres.some(([a, z]) => fr >= a - 10 && fr <= z + 10);
    const fade = interpolate(fr, [0, 20, durationInFrames - 45, durationInFrames], [0, 1, 1, 0], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    });
    return props.volumeMusique * (voix ? 0.35 : 1) * fade;
  };

  let from = 0;
  return (
    <AbsoluteFill style={{backgroundColor: 'black'}}>
      {props.blocs.map((b, i) => {
        const d = dureeBloc(b, fps);
        const s = from;
        from += d;
        return (
          <Sequence key={i} from={s} durationInFrames={d}>
            <BlocView b={b} logo={logo} />
          </Sequence>
        );
      })}
      <KaraokeCaptions captions={props.captions} />
      {props.musique ? <Audio src={staticFile(props.musique)} loop volume={vol} /> : null}
    </AbsoluteFill>
  );
};
