# Série v2 – Reels TikTok / Instagram SublimNet « écran filmé »

Les 3 Reels de la série (voiture, prix, pourquoi SublimNet) refaits dans le style des 3 vidéos de référence.
Les vidéos 01 et 02 : une pub en motion design jouée sur un écran filmé dans une pièce sombre, avec des textes TikTok.
La vidéo 03 : en plein écran vertical (une seule interface).

**Palette SublimNet utilisée partout** : #0E0B1D · #2A1E4D · #5A3B8C · #8B7CC7 · #C9C2E3 · #3A3A52
(le logo est recoloré dans cette palette : violet #5A3B8C → #8B7CC7 sur fond clair, blanc → #C9C2E3 sur fond sombre).
**Photos avant/après** : vos photos de siège en tissu et de volant (vidéos 01 et 03).
Format 1080×1920, 30 i/s, son -14 LUFS. Voix off : prises ElevenLabs « Sophie » (voir `../serie-tiktok-insta/src/vo_sophie/`).

| Fichier | Durée | Référence suivie | Mise en scène |
|---|---|---|---|
| `01-voiture-comme-neuve.mp4` | 27,7 s | Réf. 1 (pub « Airbnb » sur MacBook) | MacBook dans le noir, interface claire aux couleurs de la palette |
| `02-prix-sans-surprise.mp4` | 23,8 s | Réf. 3 (pub « Revolut » sur laptop) | Laptop en gros plan, noir profond, halo violet |
| `03-pourquoi-sublimnet.mp4` | 22,8 s | Réf. 2 (pub « Spotify ») | Plein écran vertical, interface sombre au néon lavande |

## Ce qui a été repris des références

**Réf. 1 → 01 Voiture** : fond blanc cassé, une seule couleur d'accent, ombres très douces, curseur macOS.
Logo tracé à la main → barre de recherche (Adresse « Bordeaux », Service, Créneau) → carte claire avec rivière
(la Garonne, quartiers de Bordeaux, étiquettes de prix) → épingle « Chez vous » → fiche avec le siège avant/après →
fiche qui s'ouvre en panneau : volant avant/après avec curseur pendant « Express », siège avant/après pendant « Confort »
(formules Express 50 € / Confort 90 €, créneau, total, « Réserver ») → remplissage violet
« C'est réservé ! » + confettis → la carte se réduit en point → logo + « Réservez sur sublimnet.com ».
Textes TikTok : cadres blancs, police TikTok Sans, en haut et sur le clavier.

**Réf. 3 → 02 Prix** : noir profond et lumière violette (palette). Puce lumineuse → éclat de rayons + logo → titre
« Combien ça coûte ? » → flash → téléphone 3D (listes de prix réelles) avec pastilles lumineuses dont les chiffres
roulent (dès 40,00 € / dès 35,00 €) → point lumineux qui trace une carte → carte violette « Extérieur · Citadine 45 € »
→ carte en points avec trajet Talence → Bordeaux, rayon de 20 km, « Déplacement offert » → total qui roule jusqu'à
50,00 € → arcs lumineux → éclat + logo + « Réservez sur sublimnet.com » → point final.
Surimpression : icône d'app SublimNet + « Les vrais prix 💸 » en Playfair Display italique.

**Réf. 2 → 03 Pourquoi** (plein écran 1080×1920) : titre « Pourquoi choisir SublimNet ? », interface sombre avec accent
néon lavande, caméra qui plonge en 3D dans l'interface et zoome d'une zone à l'autre (puces Tous/Avis/Auto…, carte
avant/après avec vos photos de siège, carte « Intervenant en route », avis Google 5 étoiles qui se
remplissent, réactions et commentaires, message tapé « Dispo ce dimanche ? » → réponse « Oui ! 7j/7 »), puis textes
cinétiques sur fond noir (« Le déplacement est [20 km] offert. », « Vous réservez en ligne. », « En une minute. »),
icône qui zoome puis logo + « Sublime, et net. » + sublimnet.com. Bandeau « 01…05 » pour suivre les 5 raisons, bouton « Réserver en ligne » à la fin.

Identité SublimNet : logo vectorisé recoloré dans la palette, Playfair Display pour les titres, Manrope pour l'interface,
vrais prix de la grille tarifaire, vraies captures du site, vos photos avant/après (siège, volant).

## Fabrication (`src/`)

1. `planner.py` : place les phrases de la voix off → `vo{A,B,C}.json`.
2. `adA.html`, `adB.html` (+ `adkit.js`) : la pub (1600×1000) ; `adC2.html` : la vidéo 03 en plein écran 1080×1920 ; rendues
   image par image (`render2.js`, `render_ad.sh`).
3. `scene.html?v=A|B&ov=none` : chaque image de la pub posée sur l'écran (MacBook / laptop),
   lumière de l'écran sur le clavier et la pièce, bougé de caméra ; `ov=only` exporte les textes TikTok (`ov*.png`).
4. `make_audio.py` + `audio.py` : musique et bruitages synthétisés (libres de droits) calés sur les événements
   (`ev*.json`), voix off, ducking.
5. `enc.sh` (01, 02) : halo (bloom), vignettage et grain de capture vidéo, textes TikTok nets par-dessus, son normalisé ;
   `enc_full.sh` (03) : montage plein écran.
