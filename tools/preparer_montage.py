#!/usr/bin/env python3
"""
Étapes 4-5 du montage SublimNet : à partir de plan.json, prépare chaque plan
(découpe dans le .MP4 HQ, stabilisation légère si besoin, recadrage 1080x1920 30 i/s,
étalonnage léger) puis écrit video/src/montage.json pour Remotion.

  python tools/preparer_montage.py plan.json

plan.json : voir plan.exemple.json. Chaque plan = {"video": "<nom sans extension>",
"debut": s, "duree": s, "zoom": 1.0, "ancre": "centre|haut|bas", "vitesse": 1.0,
"stabiliser": "auto|oui|non"}.
"""
import json, os, shutil, subprocess, sys, urllib.request, uuid
from pathlib import Path

RACINE = Path(__file__).resolve().parent.parent
VIDEO = RACINE / "video"
CLIPS = VIDEO / "public" / "clips"
FPS = 30
DUREE_MAX = 120.0


def sh(cmd):
    r = subprocess.run(cmd, capture_output=True, text=True)
    if r.returncode != 0:
        raise RuntimeError(f"Échec : {' '.join(map(str, cmd))[:300]}\n{r.stderr[-1500:]}")
    return r.stdout


def has_filter(name):
    return name in subprocess.run(["ffmpeg", "-hide_banner", "-filters"], capture_output=True, text=True).stdout


VIDSTAB = has_filter("vidstabdetect")


def source_pour(nom, rushes):
    r = rushes[nom]
    if r.get("mp4"):
        return Path(r["mp4"]), False
    return Path(r["lrf"]), True  # pas de MP4 HQ : on prend le LRF (noté dans le journal)


def mouvement_moyen(r, debut, duree):
    m = r["par_seconde"]["mouvement"][int(debut): int(debut + duree) + 1]
    return sum(m) / len(m) if m else 0


def preparer_plan(p, rushes, journal):
    r = rushes[p["video"]]
    src, est_lrf = source_pour(p["video"], rushes)
    vitesse = float(p.get("vitesse", 1.0))
    duree_src = p["duree"] * vitesse
    zoom = float(p.get("zoom", 1.0))
    ancre = p.get("ancre", "centre")
    stab = p.get("stabiliser", "auto")
    mvt = mouvement_moyen(r, p["debut"], duree_src)
    stabiliser = stab == "oui" or (stab == "auto" and mvt > 4.0)
    cle = f'{p["video"]}_{p["debut"]:.2f}_{p["duree"]:.2f}_{zoom}_{ancre}_{vitesse}_{int(stabiliser)}'
    sortie = CLIPS / (cle.replace(".", "-") + ".mp4")
    if sortie.exists():
        return sortie.name, stabiliser, est_lrf

    # recadrage 9:16 + zoom + ancre
    y = {"haut": "0", "bas": "ih-oh", "centre": "(ih-oh)/2"}[ancre]
    cadre = (f"scale=w='if(gt(a,9/16),-2,{int(1080*zoom)})':h='if(gt(a,9/16),{int(1920*zoom)},-2)',"
             f"crop=1080:1920:(iw-ow)/2:{y}")
    etalonnage = "eq=contrast=1.06:saturation=1.10:gamma=0.98,unsharp=5:5:0.4"
    vit = f",setpts=PTS/{vitesse}" if vitesse != 1 else ""
    filtres = []
    tmp = None
    if stabiliser:
        if VIDSTAB:
            tmp = CLIPS / f"_{uuid.uuid4().hex}.trf"
            # vidstab lit/écrit le .trf dans le dossier courant : on se place dans CLIPS
            subprocess.run(["ffmpeg", "-v", "error", "-y", "-ss", str(p["debut"]), "-t", str(duree_src), "-i", str(src),
                            "-vf", f"vidstabdetect=shakiness=5:accuracy=15:result={tmp.name}", "-f", "null", "-"],
                           cwd=CLIPS, check=True, capture_output=True)
            filtres.append(f"vidstabtransform=input={tmp.name}:smoothing=12:zoom=4:optzoom=0:interpol=bicubic")
        else:
            filtres.append("deshake=rx=24:ry=24")
    filtres += [cadre, etalonnage]
    vf = ",".join(filtres) + vit + f",fps={FPS},format=yuv420p"
    af = f"atempo={vitesse}" if vitesse != 1 else "anull"
    cmd = ["ffmpeg", "-v", "error", "-y", "-ss", str(p["debut"]), "-t", str(duree_src), "-i", str(src),
           "-vf", vf, "-af", af, "-c:v", "libx264", "-preset", "medium", "-crf", "16",
           "-c:a", "aac", "-b:a", "192k", "-ar", "48000", "-ac", "2", "-movflags", "+faststart", sortie.name]
    if not r.get("audio", True):
        cmd[cmd.index("-af"):cmd.index("-af") + 2] = ["-an"]
    subprocess.run(cmd, cwd=CLIPS, check=True, capture_output=True)
    # contrôle : un plan ne doit contenir aucune coupure / changement brutal
    r2 = subprocess.run(["ffmpeg", "-i", sortie.name, "-vf", "select='gt(scene,0.35)',showinfo", "-f", "null", "-"],
                        cwd=CLIPS, capture_output=True, text=True).stderr
    sauts = [l.split("pts_time:")[1].split()[0] for l in r2.splitlines() if "pts_time:" in l]
    if sauts:
        print(f"  ⚠ changement brutal dans {p['video']} @{p['debut']}s à +{', +'.join(sauts)}s : vérifier ce plan")
    if tmp and (CLIPS / tmp.name).exists():
        (CLIPS / tmp.name).unlink()
    return sortie.name, stabiliser, est_lrf


def transcrire(clip_path, decalage_ms):
    """Sous-titres mot par mot : ElevenLabs Scribe (clé ELEVENLABS_API_KEY ou proxy), sinon faster-whisper."""
    wav = clip_path.with_suffix(".wav")
    sh(["ffmpeg", "-v", "error", "-y", "-i", str(clip_path), "-vn", "-ac", "1", "-ar", "16000", str(wav)])
    mots = []
    try:
        limite = "----" + uuid.uuid4().hex
        corps = b""
        for k, v in dict(model_id="scribe_v1", language_code="fra", timestamps_granularity="word").items():
            corps += f'--{limite}\r\nContent-Disposition: form-data; name="{k}"\r\n\r\n{v}\r\n'.encode()
        corps += f'--{limite}\r\nContent-Disposition: form-data; name="file"; filename="a.wav"\r\nContent-Type: audio/wav\r\n\r\n'.encode()
        corps += wav.read_bytes() + f"\r\n--{limite}--\r\n".encode()
        req = urllib.request.Request("https://api.elevenlabs.io/v1/speech-to-text", data=corps, method="POST", headers={
            "xi-api-key": os.environ.get("ELEVENLABS_API_KEY", "dummy"),
            "Content-Type": f"multipart/form-data; boundary={limite}"})
        d = json.load(urllib.request.urlopen(req, timeout=300))
        mots = [(w["text"], w["start"], w["end"]) for w in d["words"] if w.get("type") == "word"]
    except Exception as e:
        print(f"  ElevenLabs indisponible ({e}) -> faster-whisper")
        from faster_whisper import WhisperModel
        seg, _ = WhisperModel("small", device="cpu", compute_type="int8").transcribe(str(wav), language="fr", word_timestamps=True)
        mots = [(w.word.strip(), w.start, w.end) for s in seg for w in s.words]
    wav.unlink(missing_ok=True)
    return [dict(text=(" " if i else "") + t, startMs=int(decalage_ms + a * 1000), endMs=int(decalage_ms + b * 1000),
                 timestampMs=None, confidence=None) for i, (t, a, b) in enumerate(mots)]


journal_decisions = []


def preparer_logo(src, dst):
    """Logo néon sur fond noir -> PNG transparent (alpha = luminosité), sinon copie telle quelle."""
    from PIL import Image
    import numpy as np
    im = Image.open(src).convert("RGBA")
    a = np.asarray(im).astype(np.float32)
    if a[..., 3].min() < 250:  # déjà transparent
        shutil.copy(src, dst)
        return
    rgb = a[..., :3]
    alpha = np.clip((rgb.max(axis=2) - 18) / (255 - 18), 0, 1)
    alpha = alpha ** 0.8
    out = np.zeros_like(a)
    out[..., :3] = np.clip(rgb / np.maximum(alpha[..., None], 1e-3), 0, 255)
    out[..., 3] = alpha * 255
    Image.fromarray(out.astype(np.uint8)).save(dst)


def main():
    plan_path = Path(sys.argv[1] if len(sys.argv) > 1 else "plan.json").resolve()
    plan = json.loads(plan_path.read_text(encoding="utf-8"))
    travail = plan_path.parent
    rushes = {r["nom"]: r for r in json.loads((travail / "analyse" / "rushes.json").read_text(encoding="utf-8"))["rushes"]}
    CLIPS.mkdir(parents=True, exist_ok=True)
    journal = []

    # logo + musique
    if (travail / "logo.png").exists():
        preparer_logo(travail / "logo.png", VIDEO / "public" / "logo.png")
    else:
        journal_decisions.append("logo.png absent du dossier de travail : logo existant de video/public conservé")

    blocs, t = [], 0.0
    captions = []
    fc_captions_par_clip = {}

    def plans(liste, etiquette):
        nonlocal t
        out = []
        for p in liste:
            nom, stab, lrf = preparer_plan(p, rushes, journal)
            out.append(dict(clip=f"clips/{nom}", duree=p["duree"]))
            note = (" [stabilisé]" if stab else "") + (" [LRF basse déf. — pas de MP4]" if lrf else "")
            journal.append(f"| {t:6.1f}s | {etiquette} | {p['video']} | {p['debut']:.1f}→{p['debut']+p['duree']*p.get('vitesse',1):.1f}s | {p['duree']:.1f}s |{note}")
            print(f"  {etiquette:<28} {p['video']} @{p['debut']:.1f}s ({p['duree']:.1f}s){note}")
            t += p["duree"]
        return out

    a = plan.get("accroche")
    if a:
        blocs.append(dict(type="accroche", petit=a.get("petit", ""), texte=a["texte"], plans=plans(a["plans"], "Accroche")))
    i = plan["intro"]
    blocs.append(dict(type="intro", titre=plan["vehicule"], sousTitre=plan.get("sous_titre", "Rénovation intérieure complète"),
                      plansAvant=plans(i.get("avant", []), "Intro — avant"), plansApres=plans(i.get("apres", []), "Intro — après")))
    fc = plan.get("face_camera")
    if fc:
        debut_fc = t
        pl = plans(fc["plans"], "Face caméra")
        if fc.get("sous_titres", True):
            off = debut_fc * 1000
            for x in pl:
                captions += transcrire(VIDEO / "public" / x["clip"], off)
                off += x["duree"] * 1000
        blocs.append(dict(type="facecam", plans=pl))
    zones = plan["zones"]
    for n, z in enumerate(zones, 1):
        blocs.append(dict(type="zone", numero=n, total=len(zones), titre=z["titre"], matiere=z["matiere"], etapes=z["etapes"],
                          plansAvant=plans(z["avant"], f"Zone {n:02d} {z['titre']} — avant"),
                          plansApres=plans(z["apres"], f"Zone {n:02d} {z['titre']} — après")))
    fin = plan.get("fin", {})
    blocs.append(dict(type="fin", duree=fin.get("duree", 4.0)))
    t += fin.get("duree", 4.0)

    montage = dict(fps=FPS, blocs=blocs, captions=captions,
                   musique=plan.get("musique", "audio/boucle.mp3"), volumeMusique=plan.get("volume_musique", 0.14),
                   duree=round(t, 2))
    (VIDEO / "src" / "montage.json").write_text(json.dumps(montage, indent=1, ensure_ascii=False), encoding="utf-8")
    (travail / "analyse" / "plans_utilises.md").write_text(
        "| Début | Partie | Rush | Extrait | Durée | Notes\n|---|---|---|---|---|---|\n" + "\n".join(journal) + "\n", encoding="utf-8")
    print(f"\nDurée totale : {t:.1f} s ({'OK' if t <= DUREE_MAX else 'TROP LONG'})  ·  {len(captions)} mots sous-titrés")
    if t > DUREE_MAX:
        sys.exit("La vidéo dépasse 2 min : raccourcir le plan.")


if __name__ == "__main__":
    main()
