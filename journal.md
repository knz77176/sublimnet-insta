# Journal de montage SublimNet

## ⚠️ État : vidéo finale NON produite, il manque les rushs

- `D:\DCIM\DJI_001` se trouve sur le PC (DESKTOP-2048MMB). La session cloud ne peut pas le lire : le dossier
  apparaît dans Remote Control, mais le PC ne le propose pas aux sessions cloud (application Claude à mettre à jour sur Windows,
  ou fonction pas encore ouverte au compte).
- `exemple1.mp4`, `exemple2.mp4` et `logo.png` ne sont pas dans le dossier de travail cloud.
- Le dossier en lecture seule n'a jamais été touché (et ne pouvait pas l'être).

**Ce qui a été fait à la place :** toute la chaîne de montage, construite et testée de bout en bout sur un
« faux dossier DJI » (3 .MP4 + 4 .LRF, dont un .LRF sans .MP4) découpé dans la vidéo Cupra
(= exemple2). Résultat : `export/sublimnet_demo.mp4` (46,4 s, 1080x1920, 30 i/s, H.264, son -14 LUFS).
Le jour où les rushs sont accessibles, le montage réel se fait en lançant les 4 commandes ci-dessous.

## Lancer le vrai montage (sur le PC, dans le dossier du dépôt)

Prérequis : Node.js 18+, Python 3.9+ (`pip install numpy pillow`), ffmpeg dans le PATH (`winget install Gyan.FFmpeg`).
Copier `logo.png` dans le dossier du dépôt. Pour les sous-titres : variable `ELEVENLABS_API_KEY`
(sinon `pip install faster-whisper`).

```
cd video && npm install && cd ..
python tools/analyse_rushes.py "D:\DCIM\DJI_001" .
```
→ `apercus/` (1 image / 5 s par vidéo + planches), `analyse/rushes.json`, `analyse/candidats.csv` (passages stables classés).
Ensuite, écrire `plan.json` sur le modèle de `plan.exemple.json` en choisissant les passages dans `candidats.csv`
et les aperçus (c'est l'étape où Claude Code, lancé sur le PC, fait le choix des plans).
```
python tools/preparer_montage.py plan.json
cd video && npx remotion render Montage ../export/_brut.mp4 --codec=h264 --crf=16 --audio-bitrate=320k && cd ..
python tools/finaliser.py export/_brut.mp4 export/sublimnet_final.mp4
```

## Décisions prises (mode autonome)

| Sujet | Décision | Pourquoi |
|---|---|---|
| Analyse | Sur les .LRF (basse déf.), montage sur les .MP4 HQ ; un .LRF sans .MP4 est utilisé quand même et signalé `[LRF basse déf.]` | Demande + rapidité (testé avec `DJI_..._0004_D.LRF` seul) |
| Plan stable | À 5 i/s : mouvement ≤ 9 (diff. moyenne d'images), netteté ≥ 45 % de la médiane de la vidéo, luminosité ≥ 38, durée ≥ 1,2 s | Élimine flou, tremblé, sombre et temps morts |
| Stabilisation | vidstab 2 passes (lissage 12, zoom 4 %) si mouvement > 4, sinon rien ; deshake en secours | « Légère » : pas d'effet flottant |
| Contrôle des plans | Détection auto des changements brutaux dans chaque plan (scene > 0,35) | A trouvé 8 plans mal calés dans la démo, tous corrigés et revérifiés à l'image |
| Rythme | Plans de 1,2 à 2,6 s, coupes franches, micro-zoom 3,5 % par plan, flash blanc de 7 images sur la bascule AVANT → APRÈS | exemple1 (rythme) + exemple2 (structure) |
| Accroche | Visuel = avant le plus sale → après ; texte « 1 an de saleté, *effacé* zone par zone. » (skill viral-hooks : 3 couches visuel / voix / texte, promesse = contenu réel) | Contraste avant/après = meilleur arrêt du scroll pour du detailing |
| DA | Relevée sur exemple2 : Lora (bloc + zones), Playfair Display (sous-titres), dégradé rose → violet → cyan, bloc en haut à gauche à 66 px / 167 px, vignette sombre | Mesures superposées à la vidéo d'origine |
| Sous-titres | ElevenLabs Scribe (mots horodatés), faster-whisper en secours | Le modèle Whisper ne se télécharge pas depuis le cloud (Hugging Face bloqué) |
| Musique | Boucle de 22 s générée par ElevenLabs (lo-fi deep house douce, 100 bpm), volume 14 %, baissée à 35 % sous la voix, fondus | API musique ElevenLabs réservée aux comptes payants → effets sonores en boucle |
| Son | Son d'origine ASMR à 100 %, puis normalisation -14 LUFS / -1,5 dBTP | Standard Reels/TikTok (la démo était à -31 LUFS, trop faible) |
| Logo | Logo néon sur fond noir rendu transparent automatiquement (alpha = luminosité) | Évite le rectangle sombre autour du logo sur l'écran de fin |
| CapCut / DaVinci | Non utilisés | Pas pilotables depuis le cloud Linux ; Remotion + ffmpeg couvrent tout |

## Plans utilisés dans la démo (`plan.exemple.json`)

| Début | Partie | Rush | Extrait | Durée | Notes
|---|---|---|---|---|---|
|    0.0s | Accroche | DJI_20251101_0003_D | 30.0→31.2s | 1.2s | [stabilisé]
|    1.2s | Accroche | DJI_20251101_0003_D | 34.2→35.5s | 1.3s | [stabilisé]
|    2.5s | Intro — avant | DJI_20251101_0001_D | 0.2→1.5s | 1.3s | [stabilisé]
|    3.8s | Intro — après | DJI_20251101_0001_D | 2.2→3.6s | 1.4s | [stabilisé]
|    5.2s | Face caméra | DJI_20251101_0001_D | 4.0→10.0s | 6.0s | [stabilisé]
|   11.2s | Zone 01 Porte conducteur — avant | DJI_20251101_0002_D | 4.2→6.0s | 1.8s | [stabilisé]
|   13.0s | Zone 01 Porte conducteur — après | DJI_20251101_0002_D | 6.7→9.1s | 2.4s | [stabilisé]
|   15.4s | Zone 02 Siège conducteur — avant | DJI_20251101_0002_D | 13.0→15.0s | 2.0s | [stabilisé]
|   17.4s | Zone 02 Siège conducteur — après | DJI_20251101_0002_D | 18.0→20.6s | 2.6s | [stabilisé]
|   20.0s | Zone 03 Tableau de bord — avant | DJI_20251101_0002_D | 25.0→27.0s | 2.0s | [stabilisé]
|   22.0s | Zone 03 Tableau de bord — après | DJI_20251101_0002_D | 30.0→32.6s | 2.6s | [stabilisé]
|   24.6s | Zone 04 Tapis passager — avant | DJI_20251101_0003_D | 5.0→7.0s | 2.0s | [stabilisé]
|   26.6s | Zone 04 Tapis passager — après | DJI_20251101_0003_D | 10.0→11.9s | 1.9s | [stabilisé]
|   28.5s | Zone 05 Places arrière — avant | DJI_20251101_0003_D | 17.5→19.5s | 2.0s | [stabilisé]
|   30.5s | Zone 05 Places arrière — après | DJI_20251101_0003_D | 22.0→24.4s | 2.4s | [stabilisé]
|   32.9s | Zone 06 Banquette arrière — avant | DJI_20251101_0003_D | 30.0→32.0s | 2.0s | [stabilisé]
|   34.9s | Zone 06 Banquette arrière — après | DJI_20251101_0003_D | 34.0→36.6s | 2.6s |
|   37.5s | Zone 07 Coffre — avant | DJI_20251101_0003_D | 44.2→46.2s | 2.0s | [stabilisé]
|   39.5s | Zone 07 Coffre — après | DJI_20251101_0003_D | 47.4→49.8s | 2.4s | [stabilisé]
|   41.9s | Écran de fin | — | — | 4.5s |

Limite connue de la démo : la vidéo de référence a déjà ses textes incrustés. Les plans de zone sont recadrés pour les masquer,
mais sur le face caméra on voit encore des doublons. Les vrais rushs DJI n'auront pas ce problème.
