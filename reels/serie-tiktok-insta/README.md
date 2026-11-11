# Série Reels TikTok / Instagram – SublimNet

3 vidéos 1080×1920 (9:16), 30 i/s, son normalisé à -14 LUFS, prêtes pour TikTok et Instagram.
Même style que le reel « réservation » : widgets façon iPhone, téléphone avec les vraies captures du site,
textes animés en **Playfair Display**, logo et couleurs SublimNet (violet #774B92, bleu #4F74B9, marine #0D3857).
Voix off : ElevenLabs, voix « Maliras'care », modèle Eleven v4. Musique et bruitages créés pour les vidéos (libres de droits).

| Fichier | Durée | Sujet |
|---|---|---|
| `01-voiture-comme-neuve.mp4` | 28,7 s | Intérieur auto : miettes → propre, preuve avant/après, Express dès 50 €, Confort dès 90 € |
| `02-prix-sans-surprise.mp4` | 22,9 s | Les prix : canapé dès 40 €, matelas dès 35 €, voiture dès 45 €, déplacement offert, total affiché |
| `03-pourquoi-sublimnet.mp4` | 23,7 s | 5 raisons : à domicile, 5,0 sur Google, 7j/7, déplacement offert, réservation en 1 minute |

Prix « dès » = tarifs citadine / plus petite taille de la grille tarifaire.

## Textes de la voix off

**01 – Votre voiture, comme neuve**
> Miettes, poils, taches sur les sièges… Votre voiture mérite mieux. Avec SublimNet, on vient la nettoyer chez vous.
> La preuve en image. Express : aspiration, plastiques et vitres. Dès cinquante euros. Confort : les sièges en plus.
> Dès quatre-vingt-dix euros. Sept jours sur sept, à Bordeaux et alentours. SublimNet. Réservez sur sublimnet.com.

**02 – Les prix, sans surprise**
> Nettoyage à domicile : combien ça coûte ? Un canapé ? Dès quarante euros. Un matelas ? Dès trente-cinq euros.
> Votre voiture ? Dès quarante-cinq euros. Le déplacement est offert jusqu'à vingt kilomètres.
> Et le total s'affiche avant de réserver. SublimNet. Réservez sur sublimnet.com.

**03 – Pourquoi SublimNet ?**
> Pourquoi choisir SublimNet ? Un : on vient chez vous. Deux : cinq étoiles sur Google. Trois : sept jours sur sept.
> Quatre : le déplacement est offert. Cinq : vous réservez en ligne, en une minute. SublimNet. Sublime, et net.
> Réservez sur sublimnet.com.

## Légendes proposées pour la publication

**01** – Miettes, poils, taches… On vient nettoyer votre voiture chez vous, à Bordeaux 🚗✨
Express dès 50 € · Confort dès 90 €. Réservation en ligne en 1 minute 👉 sublimnet.com
`#nettoyageauto #bordeaux #detailing #lavageauto #avantapres #nettoyageadomicile`

**02** – Combien coûte un nettoyage à domicile ? Canapé dès 40 €, matelas dès 35 €, voiture dès 45 €.
Déplacement offert jusqu'à 20 km, et le total s'affiche avant de réserver 👉 sublimnet.com
`#nettoyagecanape #nettoyagematelas #bordeaux #talence #nettoyageadomicile`

**03** – 5 raisons de choisir SublimNet 👇 On vient chez vous · 5,0 sur Google · 7j/7 · déplacement offert ·
réservation en 1 minute. Sublime, et net. 👉 sublimnet.com
`#bordeaux #nettoyageadomicile #nettoyagecanape #nettoyageauto #gironde`

## Refaire le rendu (`src/`)

1. Voix : `python3 vo_gen.py vo_lines.json A vo/A <voice_id> eleven_v4` (idem B, C) – horodatage des mots dans `vo/<R>/words.json`.
2. Calage : `python3 make_pages.py && python3 plan.py` → `reelA/B/C.html` + `tA/tB/tC.json`.
3. Images : servir `src/` (`python3 -m http.server 8766`) puis `render_all.sh <dossier> 8766 A B C`
   (chemins à adapter dans le script).
4. Son : `python3 audio.py tA.json vo/A mixA.wav` (idem B, C).
5. Assemblage : `ffmpeg -framerate 30 -i framesA/f%05d.png -i mixA.wav -af loudnorm=I=-14:TP=-1.5:LRA=11 -c:v libx264 -crf 17 -pix_fmt yuv420p -c:a aac -b:a 192k -shortest reelA.mp4`
