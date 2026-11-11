# Reel « Réservez en ligne » – Bordeaux, avec voix off

Vidéo finale : `reels/sublimnet-reel-voixoff-bordeaux.mp4` (29 s, 1080×1920, 30 i/s, son AAC normalisé à -14 LUFS)
Couverture : `reels/sublimnet-reel-voixoff-bordeaux-cover.jpg`

## Texte de la voix off

Voix : ElevenLabs, voix « Sophie – Engaging and Warm » (modèle v4), prise générée sur elevenlabs.io.
La prise complète est dans `voix-sophie/take.mp3` ; elle est découpée en 10 phrases
(`scripts/decoupe_prise.py`, d'après la transcription horodatée `stt.json`) puis chaque
phrase est placée sur la vidéo (`timeline.json` → `vo`).
Ancienne version (voix « Maliras'care ») : `voix-elevenlabs/`.

| Temps | Voix off | Texte à l'écran |
|---|---|---|
| 0:00 | Samedi, dix heures. À Bordeaux. | Samedi, **10 h.** |
| 0:03 | Le canapé a pris cher… et la voiture aussi. | Le canapé a **pris cher.** |
| 0:06 | Vous tapez SublimNet. | Vous tapez **SublimNet.** |
| 0:08 | Le site s'ouvre. | Le site **s'ouvre.** |
| 0:10 | Vous choisissez : auto, canapé, ou matelas. | Vous **choisissez.** |
| 0:14 | Votre adresse à Bordeaux : le déplacement est offert. | Votre **adresse.** → Déplacement **offert.** |
| 0:17 | Vous choisissez votre créneau. | Votre **créneau.** |
| 0:19 | Vous confirmez. Et c'est réservé. | Vous **confirmez.** → C'est **réservé.** |
| 0:22 | Une minute suffit. On vient chez vous. | Une minute **suffit.** → On vient **chez vous.** |
| 0:24 | SublimNet. Réservez en ligne, sur sublimnet.com. | Logo, « Réserver en ligne », sublimnet.com |

## Refaire le rendu

1. Voix off : `ffmpeg -i voix-sophie/take.mp3 -ac 1 -ar 48000 take.wav` puis
   `python3 scripts/decoupe_prise.py take.wav voix-sophie/stt.json <dossier_voix>`.
   (Génération par API, autre voix : `scripts/voix_off_elevenlabs.py <dossier> <voice_id>`.)
   (Ancienne voix de synthèse locale : `scripts/voix_off.py`, Kokoro TTS.)
2. Servir ce dossier (`python3 -m http.server 8765`) puis rendre les images :
   `node scripts/render.js http://127.0.0.1:8765/reel.html frames all 30 29`
3. Son (musique + bruitages synthétisés, donc libres de droits, + voix off) :
   `python3 scripts/audio.py timeline.json <dossier_voix_off> mix.wav`
4. Assemblage :
   `ffmpeg -framerate 30 -i frames/f%05d.png -i mix.wav -af loudnorm=I=-14:TP=-1.5:LRA=11 -c:v libx264 -crf 17 -pix_fmt yuv420p -c:a aac -b:a 192k -shortest reel.mp4`

Tous les timings (voix, taps, textes, caméra) sont dans `timeline.json`.
