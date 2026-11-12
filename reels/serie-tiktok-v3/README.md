# Série TikTok v3 – SublimNet (format natif, accrocheur)

3 vidéos 1080×1920, 30 i/s, son -14 LUFS, pensées pour arrêter le scroll (pas des pubs classiques) :
accroche dans la première seconde, vraies photos avant/après, révélations au curseur, zooms et secousses sur les
temps forts, tampons et autocollants de prix, sous-titres mot à mot (style CapCut) synchronisés sur la voix,
barre de progression, appel à l'action final avec le logo SublimNet complet dans un carré blanc.

Palette : #0E0B1D · #2A1E4D · #5A3B8C · #8B7CC7 · #C9C2E3 · #3A3A52. Logo : `src/assets/logo.png` (logo complet,
couleurs d'origine). Voix off : prises ElevenLabs « Sophie » (`../serie-tiktok-insta/src/vo_sophie/`).

| Fichier | Durée | Accroche | Déroulé |
|---|---|---|---|
| `01-avant-apres-voiture.mp4` | 25,4 s | « Ce siège… 😳 / attends la fin 👀 » | siège sale entouré en rouge → révélation après → « on vient chez vous » → « Et le volant… 🤢 » → curseur avant/après + Express dès 50 € → siège avant/après en écran partagé + Confort dès 90 € → 7j/7, Bordeaux, déplacement offert → logo + sublimnet.com |
| `02-combien-ca-coute.mp4` | 20,4 s | « Combien ça coûte VRAIMENT ? 🤔 » | montage rapide de photos sales → cartes prix qui roulent (canapé 40 €, matelas 35 €, voiture 45 €) → tampon « OFFERT » (déplacement jusqu'à 20 km) → total affiché, pas de frais cachés → logo + sublimnet.com |
| `03-5-raisons.mp4` | 20,5 s | « Pourquoi choisir SublimNet ? 👇 » sur révélation avant/après | 1 on vient chez vous → 2 5,0 sur Google (14 avis) → 3 7j/7 → 4 déplacement offert → 5 réservé en 1 minute → « Sublime, et net. » + sublimnet.com |

## Légendes proposées

**01** – Ce siège n'avait pas vu un nettoyage depuis longtemps… 😳 Résultat à domicile, à Bordeaux ✨
Express dès 50 € · Confort dès 90 € 👉 sublimnet.com
`#avantapres #nettoyageauto #detailing #bordeaux #satisfying #carcleaning`

**02** – Le vrai prix d'un nettoyage à domicile à Bordeaux 💸 Canapé dès 40 €, matelas dès 35 €, voiture dès 45 €,
déplacement offert jusqu'à 20 km 👉 sublimnet.com
`#bordeaux #nettoyagecanape #nettoyagematelas #prix #astuce`

**03** – 5 raisons de nous confier votre canapé, matelas ou voiture 👇 Sublime, et net. 👉 sublimnet.com
`#bordeaux #nettoyageadomicile #avantapres #petitebusiness #gironde`

## Fabrication (`src/`)

`planner.py` (calage de la voix) → `tkA.html`, `tkB.html`, `tkC.html` (+ `tk.js`, `tk.css`, `adkit.js`) rendues image par
image avec `render2.js` / `render_ad.sh` → `make_audio.py` + `audio.py` (musique, impacts, montées, bruitages, voix) →
`enc.sh` (montage final).
