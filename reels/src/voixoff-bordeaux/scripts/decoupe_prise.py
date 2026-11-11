"""Découpe une prise de voix off complète (un seul MP3 ElevenLabs) en 10 phrases.

usage: python3 decoupe_prise.py <prise.wav> <stt.json> <dossier_sortie>
stt.json = réponse de l'API ElevenLabs speech-to-text (scribe_v1, horodatage par mot).
Écrit l01.wav … l10.wav et lines.json (position de chaque mot dans sa phrase).
"""
import json, sys
import numpy as np, soundfile as sf

take, stt, out = sys.argv[1:4]
d = json.load(open(stt))
ws = [w for w in d["words"] if w.get("type") == "word"]
x, sr = sf.read(take)

# index du premier et du dernier mot de chaque phrase dans la transcription
groups = {"l01": (0, 4), "l02": (5, 13), "l03": (14, 17), "l04": (18, 20), "l05": (21, 26),
          "l06": (27, 34), "l07": (35, 38), "l08": (39, 43), "l09": (44, 50), "l10": (51, 57)}
keys = list(groups)
info = {}
for n, k in enumerate(keys):
    a, b = groups[k]
    s = ws[a]["start"] - 0.10
    e = ws[b]["end"] + 0.22
    if n + 1 < len(keys):
        e = min(e, ws[groups[keys[n + 1]][0]]["start"] - 0.04)
    if n > 0:
        s = max(s, ws[groups[keys[n - 1]][1]]["end"] + 0.02)
    seg = x[int(s * sr):int(e * sr)].copy()
    f = int(0.012 * sr)
    seg[:f] *= np.linspace(0, 1, f)
    seg[-f:] *= np.linspace(1, 0, f)
    sf.write(f"{out}/{k}.wav", seg, sr)
    info[k] = {"onset": round(ws[a]["start"] - s, 3), "dur": round(len(seg) / sr, 3),
               "words": [(w["text"], round(w["start"] - s, 2)) for w in ws[a:b + 1]]}
json.dump(info, open(f"{out}/lines.json", "w"), ensure_ascii=False, indent=1)
print("ok", len(info), "phrases")
