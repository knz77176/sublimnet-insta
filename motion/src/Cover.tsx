import React from "react";
import { AbsoluteFill, Img, staticFile } from "remotion";
import { Room, FilmLook } from "./ui/Room";
import { Orb } from "./ui/Captions";
import { C, MONO, SERIF, SERIF_I, BRAND_GRAD } from "./theme";

/** Couverture du Reel (zone sûre 1080x1350 centrale pour la grille) */
export const Cover: React.FC = () => (
  <AbsoluteFill>
    <Room t={2.6} />
    <div style={{ position: "absolute", top: 560, left: 0, right: 0, textAlign: "center" }}>
      <div style={{ display: "flex", justifyContent: "center", marginBottom: 30 }}><Orb t={1} size={130} /></div>
      <div style={{ fontFamily: MONO, fontSize: 30, letterSpacing: 8, color: C.amber }}>SUBLIM·IA · ÉPISODE 1</div>
      <div style={{ fontFamily: SERIF, fontSize: 120, lineHeight: 1.0, color: C.ink, marginTop: 26, textShadow: "0 8px 50px rgba(0,0,0,0.8)" }}>
        Mon IA gère
        <br />ma boîte de
        <br />nettoyage.
      </div>
      <div style={{ fontFamily: SERIF_I, fontStyle: "italic", fontSize: 96, marginTop: 10, backgroundImage: BRAND_GRAD, WebkitBackgroundClip: "text", color: "transparent", paddingBottom: 10 }}>
        Elle a de l'humour.
      </div>
    </div>
    <div style={{ position: "absolute", bottom: 330, left: 0, right: 0, display: "flex", justifyContent: "center" }}>
      <Img src={staticFile("logo.png")} style={{ width: 380, filter: "drop-shadow(0 0 30px rgba(255,79,163,0.6))" }} />
    </div>
    <FilmLook t={0.5} />
  </AbsoluteFill>
);
