# DA SublimNet (modèle « Cupra 2025 »)

Modèle Remotion qui reprend le style du montage Cupra. Toutes les valeurs sont dans `theme.ts`.

## Bloc en haut à gauche (`BrandHeader`)
- **Sur-titre** : Lora SemiBold, 26 px, majuscules espacées (0,32 em). Ex. « SUBLIMNET », « DETAILING AUTOMOBILE »
- **Trait** : 92 × 3 px, dégradé magenta → violet → cyan
- **Titre** : Lora Bold *Italique*, 82 px, blanc. Ex. « Cupra 2025 », « SublimNet »
- **Sous-titre** : Lora Regular, 31 px, lavande `#c9c3ea`. Ex. « Rénovation intérieure complète », « À domicile · Bordeaux »
- **Badge** (optionnel) : point rouge « AVANT » / point cyan « APRÈS »
- Position : 66 px du bord gauche, 167 px du haut (canvas 1080×1920)

## Sous-titres (`KaraokeCaptions`)
- Playfair Display SemiBold, 54 px, centrés à ~76 % de la hauteur
- Mot prononcé en blanc, le reste en lavande, ombre portée douce

## Utilisation
Composition `SublimReel` : liste de plans (`segments`, chacun avec son bloc haut-gauche) + sous-titres.
Mettre les rushs dans `public/rushes/` (non versionné).
