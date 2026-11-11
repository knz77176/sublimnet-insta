"""Découpe une prise complète (un MP3 par vidéo) en phrases, grâce à l'alignement forcé ElevenLabs.
usage: python3 split_take.py <take.mp3> <forced_alignment.json> vo_lines.json <reel> <outdir>"""
import json, os, subprocess, sys
import numpy as np, soundfile as sf
take, fa, lines_f, reel, out = sys.argv[1:6]
os.makedirs(out, exist_ok=True)
wav = os.path.join(out, "_take.wav")
subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", take, "-ac", "1", "-ar", "48000", wav], check=True)
x, sr = sf.read(wav)
ws = [w for w in json.load(open(fa))["words"] if w["text"].strip()]
lines = json.load(open(lines_f))[reel]
groups, i = [], 0
for k, text in lines:
    n = len(text.split()); groups.append((k, text, ws[i:i + n])); i += n
assert i == len(ws), (i, len(ws))
meta = {}
for gi, (k, text, g) in enumerate(groups):
    s = g[0]["start"] - 0.10
    e = max(w["end"] for w in g) + 0.22
    if gi > 0: s = max(s, max(w["end"] for w in groups[gi - 1][2]) + 0.02)
    if gi + 1 < len(groups): e = min(e, groups[gi + 1][2][0]["start"] - 0.04)
    seg = x[int(s * sr):int(e * sr)].copy()
    f = int(0.012 * sr); seg[:f] *= np.linspace(0, 1, f); seg[-f:] *= np.linspace(1, 0, f)
    sf.write(os.path.join(out, f"{k}.wav"), seg, sr)
    meta[k] = {"text": text, "words": [[w["text"], round(w["start"] - s, 3), round(w["end"] - s, 3)] for w in g]}
    print(k, f"{s:.2f}-{e:.2f}", " ".join(f"{w[0]}@{w[1]:.2f}" for w in meta[k]["words"]))
json.dump(meta, open(os.path.join(out, "words.json"), "w"), ensure_ascii=False, indent=1)
os.remove(wav)
