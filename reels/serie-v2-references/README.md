# Série v2 – Reels TikTok / Instagram SublimNet « écran filmé »

Les 3 Reels de la série (voiture, prix, pourquoi SublimNet) refaits dans le style des 3 vidéos de référence :
une pub en motion design jouée sur un écran, filmée dans une pièce sombre, avec des textes TikTok en surimpression.
Format 1080×1920, 30 i/s, son -14 LUFS. Voix off : prises ElevenLabs « Sophie » (voir `../serie-tiktok-insta/src/vo_sophie/`).

| Fichier | Durée | Référence suivie | Mise en scène |
|---|---|---|---|
| `01-voiture-comme-neuve.mp4` | 27,7 s | Réf. 1 (pub « Airbnb » sur MacBook) | MacBook dans le noir, interface blanche, accent violet SublimNet |
| `02-prix-sans-surprise.mp4` | 23,8 s | Réf. 3 (pub « Revolut » sur laptop) | Laptop en gros plan, noir profond, halo bleu |
| `03-pourquoi-sublimnet.mp4` | 22,8 s | Réf. 2 (pub « Spotify » sur téléviseur) | Téléviseur sur mur à lames de bois, lampe-boule, néon violet |

## Ce qui a été repris des références

**Réf. 1 → 01 Voiture** : fond blanc cassé, une seule couleur d'accent, ombres très douces, curseur macOS.
Logo tracé à la main → barre de recherche (Adresse « Bordeaux », Service, Créneau) → carte claire avec rivière
(la Garonne, quartiers de Bordeaux, étiquettes de prix) → épingle « Chez vous » → fiche avec photo avant/après →
fiche qui s'ouvre en panneau (formules Express 50 € / Confort 90 €, créneau, total, « Réserver ») → remplissage violet
« C'est réservé ! » + confettis → la carte se réduit en point → logo + « Réservez sur sublimnet.com ».
Textes TikTok : cadres blancs, police TikTok Sans, en haut et sur le clavier.

**Réf. 3 → 02 Prix** : noir profond et lumière bleue. Puce lumineuse → éclat de rayons + logo → titre
« Combien ça coûte ? » → flash → téléphone 3D (listes de prix réelles) avec pastilles lumineuses dont les chiffres
roulent (dès 40,00 € / dès 35,00 €) → point lumineux qui trace une carte → carte bleue « Extérieur · Citadine 45 € »
→ carte en points avec trajet Talence → Bordeaux, rayon de 20 km, « Déplacement offert » → total qui roule jusqu'à
50,00 € → arcs lumineux → éclat + logo + « Réservez sur sublimnet.com » → point final.
Surimpression : icône d'app SublimNet + « Les vrais prix 💸 » en Playfair Display italique.

**Réf. 2 → 03 Pourquoi** : interface sombre avec accent néon, caméra qui plonge en 3D dans l'interface et zoome
d'une zone à l'autre (puces Tous/Avis/Auto…, carte « Intervenant en route », avis Google 5 étoiles qui se
remplissent, réactions et commentaires, message tapé « Dispo ce dimanche ? » → réponse « Oui ! 7j/7 »), puis textes
cinétiques sur fond noir (« Le déplacement est [20 km] offert. », « Vous réservez en ligne. », « En une minute. »),
icône qui zoome puis logo + « Sublime, et net. » + sublimnet.com. Bandeau « 01…05 » pour suivre les 5 raisons.
Surimpression : texte blanc ombré « 5 raisons de choisir SublimNet 👇 ».

Identité SublimNet conservée : logo vectorisé, violet #774B92 / bleu #4F74B9, Playfair Display pour les titres,
Manrope pour l'interface, vrais prix de la grille tarifaire, vraies captures et photo avant/après du site.

## Fabrication (`src/`)

1. `planner.py` : place les phrases de la voix off → `vo{A,B,C}.json`.
2. `adA.html`, `adB.html`, `adC.html` (+ `adkit.js`) : la pub en plein écran (1600×1000 / 1600×900), rendue
   image par image (`render2.js`, `render_ad.sh`).
3. `scene.html?v=A|B|C&ov=none` : chaque image de la pub posée sur l'écran (MacBook / laptop / téléviseur),
   lumière de l'écran sur le clavier et la pièce, bougé de caméra ; `ov=only` exporte les textes TikTok (`ov*.png`).
4. `make_audio.py` + `audio.py` : musique et bruitages synthétisés (libres de droits) calés sur les événements
   (`ev*.json`), voix off, ducking.
5. `enc.sh` : halo (bloom), vignettage et grain de capture vidéo, textes TikTok nets par-dessus, son normalisé.
