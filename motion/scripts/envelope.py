"""Enveloppe vocale par image (30 i/s) pour l'orbe IA et l'indicateur fondateur -> src/env.json"""
import json, subprocess, numpy as np
tl = json.load(open("src/timeline.json")); fps = tl["fps"]; n = int(tl["duration"] * fps)
out = {"ai": np.zeros(n), "founder": np.zeros(n)}
for v in tl["voice"]:
    raw = subprocess.run(["ffmpeg", "-v", "error", "-i", f"public/audio/vo/{v['id']}.mp3", "-ac", "1", "-ar", "24000", "-f", "f32le", "-"], capture_output=True).stdout
    x = np.frombuffer(raw, np.float32); hop = 24000 // fps
    rms = np.array([np.sqrt(np.mean(x[i:i + hop] ** 2)) for i in range(0, len(x) - hop, hop)])
    f0 = int(round(v["start"] * fps)); arr = out[v["speaker"]]
    m = min(len(rms), n - f0); arr[f0:f0 + m] = np.maximum(arr[f0:f0 + m], rms[:m])
for k in out:
    a = out[k] / (np.percentile(out[k][out[k] > 0.01], 95) + 1e-9)
    a = np.convolve(np.clip(a, 0, 1.2), np.ones(3) / 3, "same")
    out[k] = [round(float(x), 2) for x in a]
json.dump(out, open("src/env.json", "w"))
print("ok", n)
