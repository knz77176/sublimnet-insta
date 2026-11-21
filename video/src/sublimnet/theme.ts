// DA SublimNet — relevée sur le montage « Cupra 2025 ».
// Toutes les mesures sont pour un canvas 1080×1920 (Reel / TikTok).
import {loadFont as loadLora} from '@remotion/google-fonts/Lora';
import {loadFont as loadPlayfair} from '@remotion/google-fonts/PlayfairDisplay';

const lora = loadLora('normal', {weights: ['400', '600'], subsets: ['latin', 'latin-ext']});
loadLora('italic', {weights: ['600', '700'], subsets: ['latin', 'latin-ext']});
const playfair = loadPlayfair('normal', {weights: ['600', '700'], subsets: ['latin', 'latin-ext']});

export const fonts = {
  // Bloc en haut à gauche (sur-titre, titre italique, sous-titre)
  header: lora.fontFamily,
  // Sous-titres karaoké
  caption: playfair.fontFamily,
};

export const colors = {
  white: '#ffffff',
  lavender: '#c9c3ea', // sous-titre du bloc + mots non prononcés
  overline: '#e9e6f5',
  gradient: 'linear-gradient(90deg, #d63a8f 0%, #8a5cf6 50%, #3fc7e6 100%)', // magenta → violet → cyan
  avant: '#ff3b4e',
  apres: '#3fc7e6',
};

// Emplacement du bloc en haut à gauche
export const header = {
  left: 66,
  top: 167,
  overlineSize: 26,
  overlineSpacing: '0.32em',
  ruleWidth: 92,
  ruleHeight: 3,
  titleSize: 82,
  subtitleSize: 31,
  badgeSize: 20,
};

// Emplacement des sous-titres
export const caption = {
  centerY: 1455, // ≈ 76 % de la hauteur
  size: 54,
  sidePadding: 90,
};

export const textShadow = '0 2px 10px rgba(0,0,0,0.55), 0 1px 2px rgba(0,0,0,0.6)';
