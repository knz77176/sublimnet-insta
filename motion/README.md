# SublimNet · motion (Remotion)

Chaîne de fabrication des Reels **Sublim·IA** : la DA est inspirée d'un format « assistant IA » cinématique (lumière ambrée, interfaces en verre, voix off, sound design d'interface), adaptée à l'identité SublimNet (logo néon rose → violet → cyan).

## Fabriquer / modifier un épisode
```bash
npm i
# 1. voix (ElevenLabs) : éditer les répliques dans scripts/gen_vo.py puis
python3 scripts/gen_vo.py public/audio/vo      # + transcription mot à mot (*.stt.json) via speech-to-text
# 2. sons : scripts/gen_sfx.py (bibliothèque déjà dans public/audio/sfx)
# 3. timeline commune voix + SFX + musique
python3 -I scripts/build_timeline.py
python3 -I scripts/envelope.py                  # enveloppe vocale -> orbe de l'IA
python3 -I scripts/mix.py                       # -> public/audio/mix.wav (ducking, -14 LUFS)
# 4. textures avant/après (si besoin)
python3 -I scripts/textures.py public/tex
# 5. aperçu / rendu
npx remotion studio
npx remotion render SublimIA out/sublim-ia.mp4 --crf=17
npx remotion still Cover out/cover.jpg
```

## Structure
- `src/timeline.json` : source de vérité du timing (voix + mots horodatés, cues SFX, musique, drop, montage).
- `src/ui/Room.tsx` : décor (lampe-cage, rideaux, bokeh, plante, grain, vignettage).
- `src/ui/Captions.tsx` : sous-titres karaoké + orbe vocal de l'IA / indicateur « Le patron ».
- `src/scenes/Act1.tsx` : accroche, dashboard, tendance, messagerie, méthode.
- `src/scenes/Act2.tsx` : devis, agent IA, diagnostic, carte de Bordeaux, appel entrant.
- `src/scenes/Act3.tsx` : montage avant/après calé sur le beat (140 BPM), outro logo + CTA.

Voix : IA = voix FR « Maliras'care » (générée sur le compte), patron = « Eric » (multilingual v2).
Musique et SFX générés avec ElevenLabs Sound Effects (l'API Music n'est pas disponible sur le plan gratuit).
