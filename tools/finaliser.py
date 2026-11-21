#!/usr/bin/env python3
"""Étapes 6-7 : normalise le son (-14 LUFS, standard Reels/TikTok) et vérifie la vidéo finale.

  python tools/finaliser.py export/brut.mp4 export/sublimnet_final.mp4
"""
import json, subprocess, sys
from pathlib import Path

src, dst = Path(sys.argv[1]), Path(sys.argv[2])
# passe 1 : mesure
r = subprocess.run(["ffmpeg", "-hide_banner", "-i", str(src), "-af", "loudnorm=I=-14:TP=-1.5:LRA=11:print_format=json",
                    "-vn", "-f", "null", "-"], capture_output=True, text=True)
m = json.loads(r.stderr[r.stderr.rindex("{"):r.stderr.rindex("}") + 1])
# passe 2 : normalisation linéaire, vidéo copiée sans ré-encodage
af = (f"loudnorm=I=-14:TP=-1.5:LRA=11:measured_I={m['input_i']}:measured_TP={m['input_tp']}:"
      f"measured_LRA={m['input_lra']}:measured_thresh={m['input_thresh']}:offset={m['target_offset']}:linear=true")
subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", str(src), "-c:v", "copy", "-af", af, "-ar", "48000",
                "-c:a", "aac", "-b:a", "320k", "-movflags", "+faststart", str(dst)], check=True)

# vérifications
p = json.loads(subprocess.run(["ffprobe", "-v", "error", "-print_format", "json", "-show_format", "-show_streams", str(dst)],
                              capture_output=True, text=True).stdout)
v = next(s for s in p["streams"] if s["codec_type"] == "video")
a = [s for s in p["streams"] if s["codec_type"] == "audio"]
d = float(p["format"]["duration"])
vol = subprocess.run(["ffmpeg", "-i", str(dst), "-af", "volumedetect", "-vn", "-f", "null", "-"], capture_output=True, text=True).stderr
moy = [l.split(":")[1].strip() for l in vol.splitlines() if "mean_volume" in l]
planche = dst.with_name(dst.stem + "_controle.jpg")
subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", str(dst), "-vf", "fps=1/2,scale=216:-2,tile=10x6:padding=4",
                "-frames:v", "1", str(planche)], check=True)
print(f"Durée : {d:.1f} s ({'OK' if d <= 120 else 'TROP LONG > 2 min'})")
print(f"Vidéo : {v['codec_name']} {v['width']}x{v['height']} {v['r_frame_rate']} i/s")
print(f"Son   : {'OK' if a else 'ABSENT'} · volume moyen {moy[0] if moy else '?'} (avant : {m['input_i']} LUFS)")
print(f"Planche de contrôle : {planche}")
