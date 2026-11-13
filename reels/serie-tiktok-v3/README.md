# Série TikTok v3 – SublimNet (format natif, accrocheur)

3 vidéos 1080×1920, 30 i/s, son -14 LUFS, pensées pour arrêter le scroll (pas des pubs classiques) :
accroche dans la première seconde, vraies photos et vidéos avant/après, révélations au curseur, vraies captures du
site sublimnet.com dans un téléphone avec les infos clés encadrées, tampons et autocollants de prix, sous-titres mot à
mot synchronisés sur la voix, barre de progression, appel à l'action final avec le logo SublimNet complet.

Palette : #0E0B1D · #2A1E4D · #5A3B8C · #8B7CC7 · #C9C2E3 · #3A3A52. Police : **Playfair Display** pour tous les
textes (fichiers fournis, `src/pfd/`, licence OFL). Logo : `src/assets/logo.png`. Voix off : prises ElevenLabs
« Sophie » (`../serie-tiktok-insta/src/vo_sophie/`).

**Couleurs d'origine** : les photos iPhone (Display P3) sont converties fidèlement en sRGB, les vidéos HDR du tapis
sont recalées sur le rendu de l'iPhone (captures fournies, `src/clips/grade_clips.py`), aucun filtre ni assombrissement n'est appliqué sur les photos, et
l'export est en BT.709 (la norme lue par les téléphones et TikTok).

**Photos affichées en entier** : aucune photo n'est recadrée ni zoomée. Les photos verticales remplissent l'écran
telles quelles ; la photo 3:4 du siège beige est affichée complète sur un fond flouté d'elle-même. Les vidéos du tapis
(iPhone 4K HDR) sont converties en SDR et passées au ralenti ×0,5.

## Médias par vidéo (aucune photo partagée entre deux vidéos)

| Vidéo | Photos / vidéos | Captures du site |
|---|---|---|
| `01-avant-apres-voiture.mp4` (25,4 s) | siège beige avant/après, volant avant/après | choix de formule, liste des formules (Express 50 €, Confort 90 €) |
| `02-combien-ca-coute.mp4` (22,7 s) | portière avant/après, **vidéos tapis de sol avant/après** | prix canapé (2 places 40 €), prix matelas (enfant 35 €), distance « Frais de déplacement : Offerts », récapitulatif (total 45,00 €) |
| `03-5-raisons.mp4` (20,5 s) | banquette arrière avant/après | accueil (5.0 sur Google, 14 avis), créneaux 07:30/14:30 7j/7, rayon de 20 km offert, calendrier, formulaire « Vos coordonnées » |

Non utilisés dans les vidéos : la palette de couleurs (utilisée pour les couleurs) et les vidéos de référence d'autres
comptes (servies de modèle de style uniquement).

## Déroulé

- **01** – « Ce siège… 😳 attends la fin 👀 » (taches entourées) → curseur avant/après → « on vient chez vous » →
  « Et le volant… 🤢 » → curseur avant/après + Express dès 50 € → site : Citadine, Confort, Confort 90 € encadré →
  7j/7, Bordeaux, déplacement offert → logo + sublimnet.com.
- **02** – vidéo tapis sale + portière sale « Combien ça coûte VRAIMENT ? 🤔 » → « Le résultat ✨ » portière au curseur
  puis vidéo tapis propre avec l'avant en incrustation → site : canapé 40 €, matelas 35 € → voiture dès 45 € (extérieur
  citadine) → site : déplacement « Offerts » + tampon OFFERT → récapitulatif réel, total encadré → logo + sublimnet.com.
- **03** – banquette « Pourquoi choisir SublimNet ? 👇 » avec curseur avant/après → 1 à domicile, 2 5,0 Google, 3 7j/7,
  4 rayon de 20 km offert, 5 calendrier → formulaire → « C'est réservé ! » → « Sublime, et net. » + sublimnet.com.

## Couvertures TikTok (`covers/`)

Une couverture par vidéo, 1080×1920, sur le modèle fourni : photo avant en haut, après en bas, pastilles « • AVANT »
(rose #EC4899) et « • APRÈS » (cyan #22D3EE), bandeau sombre au centre avec « SUBLIMNET · DETAILING À DOMICILE »,
titre en Playfair Display italique, trait en dégradé rose → violet #8B5CF6 → cyan, sous-titre en italique.

| Couverture | Photos | Titre | Sous-titre |
|---|---|---|---|
| `01-cover.jpg` | siège beige avant/après | Avant / Après | Sièges & volant, chez vous |
| `02-cover.jpg` | tapis avant/après (images des vidéos) | Le vrai prix | Nettoyage à domicile · Bordeaux |
| `03-cover.jpg` | banquette arrière avant/après | Pourquoi choisir / SublimNet ? | 5 bonnes raisons |

Modèle : `src/cover.html` + `src/cover.js` (titres et cadrages modifiables en haut de `cover.js`).

## Légendes proposées

**01** – Ce siège n'avait pas vu un nettoyage depuis longtemps… 😳 Résultat à domicile, à Bordeaux ✨
Express dès 50 € · Confort dès 90 € 👉 sublimnet.com
`#avantapres #nettoyageauto #detailing #bordeaux #satisfying #carcleaning`

**02** – Le vrai prix d'un nettoyage à domicile à Bordeaux 💸 Canapé dès 40 €, matelas dès 35 €, voiture dès 45 €,
déplacement offert jusqu'à 20 km 👉 sublimnet.com
`#bordeaux #nettoyagecanape #nettoyagematelas #prix #satisfying`

**03** – 5 raisons de nous confier votre canapé, matelas ou voiture 👇 Sublime, et net. 👉 sublimnet.com
`#bordeaux #nettoyageadomicile #avantapres #detailing #gironde`

## Fabrication (`src/`)

`planner.py` (calage de la voix) → `tkA.html`, `tkB.html`, `tkC.html` (+ `tk.js`, `tk2.js`, `tk.css`, `adkit.js`)
rendues image par image avec `render2.js` / `render_ad.sh` → `make_audio.py` + `audio.py` (musique, impacts, montées,
bruitages, voix) → `enc.sh` (montage final). Les vidéos du tapis sont dans `src/clips/*.mp4` (SDR) ; pour le rendu,
extraire leurs images : `ffmpeg -i src/clips/tapis_av.mp4 -q:v 3 assets/clips/tapis_av/%03d.jpg` (idem `tapis_ap`).
