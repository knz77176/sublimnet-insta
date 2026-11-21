#!/usr/bin/env python3
"""
Étapes 1 et 3 du montage SublimNet : inventaire + analyse des rushs.

  python tools/analyse_rushes.py "D:\\DCIM\\DJI_001"

- Liste tous les .MP4 et .LRF (durée, résolution, correspondance MP4 <-> LRF).
- Analyse chaque vidéo via son .LRF (rapide) — ou le .MP4 s'il n'y a pas de .LRF.
- Extrait une image toutes les 5 s dans apercus/<nom>/.
- Mesure, à 5 images/s : netteté (variance du laplacien), luminosité, mouvement
  caméra (différence moyenne entre images), volume audio.
- Détecte les passages stables, nets, bien exposés (>= 1,2 s) -> analyse/candidats.csv
- Écrit analyse/rushes.json (tout le détail) et une planche contact par vidéo.

Le dossier source n'est JAMAIS modifié : lecture seule (ffmpeg lit les .LRF directement).
Dépendances : ffmpeg/ffprobe dans le PATH, Python 3.9+, numpy, Pillow.
"""
import json, os, subprocess, sys, csv
from pathlib import Path

import numpy as np

W, H = 96, 170          # taille d'analyse (vertical) — suffisant pour mouvement/netteté
FPS_ANALYSE = 5
SEUILS = dict(
    mouvement_max=9.0,  # diff moyenne (0-255) entre 2 images à 5 i/s ; au-delà = caméra qui bouge trop
    nettete_min=55.0,   # variance du laplacien ; en dessous = flou
    lum_min=38.0,       # luminosité moyenne ; en dessous = trop sombre
    duree_min=1.2,      # durée mini d'un passage exploitable (s)
)


def run(cmd):
    return subprocess.run(cmd, capture_output=True, check=True).stdout


def probe(path):
    out = json.loads(run(["ffprobe", "-v", "error", "-print_format", "json", "-show_format", "-show_streams", str(path)]))
    v = next((s for s in out["streams"] if s["codec_type"] == "video"), {})
    rot = 0
    for sd in v.get("side_data_list", []) or []:
        if "rotation" in sd:
            rot = int(sd["rotation"])
    w, h = v.get("width", 0), v.get("height", 0)
    if abs(rot) in (90, 270):
        w, h = h, w
    return dict(
        duree=round(float(out["format"].get("duration", 0)), 2),
        largeur=w, hauteur=h, rotation=rot,
        fps=v.get("r_frame_rate", "?"), codec=v.get("codec_name", "?"),
        audio=any(s["codec_type"] == "audio" for s in out["streams"]),
    )


def frames_gris(path, vertical):
    """Lit la vidéo en niveaux de gris, 5 i/s, taille réduite (recadrée en 9:16 si horizontale)."""
    vf = f"fps={FPS_ANALYSE},"
    vf += f"scale={W}:{H}:force_original_aspect_ratio=increase,crop={W}:{H}" if True else ""
    raw = run(["ffmpeg", "-v", "error", "-i", str(path), "-vf", vf, "-pix_fmt", "gray", "-f", "rawvideo", "-"])
    return np.frombuffer(raw, np.uint8).reshape(-1, H, W).astype(np.float32)


def volume_par_seconde(path, duree):
    try:
        raw = run(["ffmpeg", "-v", "error", "-i", str(path), "-vn", "-ac", "1", "-ar", "8000", "-f", "s16le", "-"])
    except subprocess.CalledProcessError:
        return []
    a = np.frombuffer(raw, np.int16).astype(np.float32) / 32768
    n = int(len(a) // 8000)
    return [round(float(20 * np.log10(np.sqrt(np.mean(a[i * 8000:(i + 1) * 8000] ** 2)) + 1e-6)), 1) for i in range(n)]


def laplacien(f):
    l = -4 * f[1:-1, 1:-1] + f[:-2, 1:-1] + f[2:, 1:-1] + f[1:-1, :-2] + f[1:-1, 2:]
    return float(l.var())


def segments_stables(t, mvt, net, lum):
    # flou = absolu OU relatif (moins de 45 % de la netteté médiane de la vidéo)
    seuil_net = max(SEUILS["nettete_min"], 0.45 * float(np.median(net)))
    ok = (mvt <= SEUILS["mouvement_max"]) & (net >= seuil_net) & (lum >= SEUILS["lum_min"])
    segs, debut = [], None
    for i, v in enumerate(list(ok) + [False]):
        if v and debut is None:
            debut = i
        elif not v and debut is not None:
            d, f = t[debut], t[i - 1] + 1 / FPS_ANALYSE
            if f - d >= SEUILS["duree_min"]:
                sl = slice(debut, i)
                segs.append(dict(debut=round(d, 2), fin=round(f, 2), duree=round(f - d, 2),
                                 mouvement=round(float(mvt[sl].mean()), 2),
                                 nettete=round(float(net[sl].mean()), 1),
                                 luminosite=round(float(lum[sl].mean()), 1)))
            debut = None
    return segs


def main():
    src = Path(sys.argv[1] if len(sys.argv) > 1 else r"D:\DCIM\DJI_001")
    travail = Path(sys.argv[2] if len(sys.argv) > 2 else ".")
    (travail / "apercus").mkdir(parents=True, exist_ok=True)
    (travail / "analyse").mkdir(parents=True, exist_ok=True)

    fichiers = sorted(p for p in src.iterdir() if p.suffix.upper() in (".MP4", ".LRF"))
    par_nom = {}
    for p in fichiers:
        par_nom.setdefault(p.stem, {})[p.suffix.upper()[1:]] = p

    rushes, lignes_csv = [], []
    print(f"{len(par_nom)} vidéos dans {src}\n")
    for nom, f in sorted(par_nom.items()):
        hq, lrf = f.get("MP4"), f.get("LRF")
        analyse = lrf or hq
        info = probe(hq or lrf)
        info_a = probe(analyse) if analyse != (hq or lrf) else info
        note = "" if hq and lrf else ("pas de .LRF -> analyse sur le .MP4" if hq else "pas de .MP4 -> le .LRF sera utilisé pour le montage")
        print(f"- {nom}: {info['duree']:.1f}s {info['largeur']}x{info['hauteur']} {info['codec']} {note}")

        # aperçus toutes les 5 s
        dossier = travail / "apercus" / nom
        dossier.mkdir(exist_ok=True)
        subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", str(analyse), "-vf", "fps=1/5,scale=360:-2",
                        str(dossier / "t%04d.jpg")], check=False)
        subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", str(analyse), "-vf",
                        "fps=1/5,scale=180:-2,tile=8x6:padding=4", "-frames:v", "1",
                        str(travail / "apercus" / f"{nom}_planche.jpg")], check=False)

        fr = frames_gris(analyse, info_a["hauteur"] >= info_a["largeur"])
        t = np.arange(len(fr)) / FPS_ANALYSE
        lum = fr.mean(axis=(1, 2))
        net = np.array([laplacien(x) for x in fr])
        mvt = np.r_[0, np.abs(np.diff(fr, axis=0)).mean(axis=(1, 2))]
        mvt = np.convolve(mvt, np.ones(3) / 3, mode="same")  # lissage
        segs = segments_stables(t, mvt, net, lum)
        vol = volume_par_seconde(analyse, info["duree"])

        for s in segs:
            # score 0-10 : netteté (log) + stabilité + durée exploitable
            s["score"] = round(2.0 * np.log10(max(s["nettete"], 1)) + (SEUILS["mouvement_max"] - s["mouvement"]) * 0.4 + min(s["duree"], 4) * 0.5, 2)
            lignes_csv.append(dict(video=nom, **s))
        rushes.append(dict(nom=nom, mp4=str(hq) if hq else None, lrf=str(lrf) if lrf else None,
                           analyse_sur=str(analyse), note=note, **info,
                           stable_pct=round(100 * sum(s["duree"] for s in segs) / max(info["duree"], 0.1), 1),
                           segments_stables=segs,
                           par_seconde=dict(
                               mouvement=[round(float(x), 1) for x in mvt[::FPS_ANALYSE]],
                               nettete=[round(float(x)) for x in net[::FPS_ANALYSE]],
                               luminosite=[round(float(x)) for x in lum[::FPS_ANALYSE]],
                               volume_db=vol)))
        print(f"    {len(segs)} passages stables ({rushes[-1]['stable_pct']} % de la vidéo)")

    (travail / "analyse" / "rushes.json").write_text(json.dumps(dict(source=str(src), seuils=SEUILS, rushes=rushes), indent=1, ensure_ascii=False), encoding="utf-8")
    with open(travail / "analyse" / "candidats.csv", "w", newline="", encoding="utf-8") as fh:
        w = csv.DictWriter(fh, fieldnames=["video", "debut", "fin", "duree", "mouvement", "nettete", "luminosite", "score"])
        w.writeheader()
        for l in sorted(lignes_csv, key=lambda x: -x["score"]):
            w.writerow(l)
    total = sum(r["duree"] for r in rushes)
    print(f"\nTotal rushs : {total/60:.1f} min · {len(lignes_csv)} passages stables -> analyse/candidats.csv")


if __name__ == "__main__":
    main()
