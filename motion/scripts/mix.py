"""Mixe voix + SFX + musique d'après src/timeline.json -> public/audio/mix.wav (-14 LUFS)."""
import json, subprocess, numpy as np, sys, os
SR = 48000
tl = json.load(open("src/timeline.json")); N = int(tl["duration"] * SR)
def load(path, filt=None):
    cmd = ["ffmpeg", "-v", "error", "-i", path]
    if filt: cmd += ["-af", filt]
    cmd += ["-ac", "2", "-ar", str(SR), "-f", "f32le", "-"]
    return np.frombuffer(subprocess.run(cmd, capture_output=True, check=True).stdout, np.float32).reshape(-1, 2).copy()
def db(g): return 10 ** (g / 20)
def place(bus, x, t, gain=0.0, fade_in=0.0, fade_out=0.0):
    x = x * db(gain); n = len(x)
    if fade_in: k = int(fade_in * SR); x[:k] *= np.linspace(0, 1, min(k, n))[:, None]
    if fade_out: k = int(fade_out * SR); k = min(k, n); x[n - k:] *= np.linspace(1, 0, k)[:, None]
    i = int(t * SR); j = min(N, i + n)
    if j > i: bus[i:j] += x[: j - i]
AI_FX = "highpass=f=95,equalizer=f=3200:t=q:w=1.2:g=2.5,equalizer=f=250:t=q:w=1:g=-1.5,aecho=0.85:0.55:28|55:0.10|0.06,loudnorm=I=-16:TP=-2"
FD_FX = "highpass=f=75,equalizer=f=180:t=q:w=1:g=1.5,acompressor=threshold=-20dB:ratio=3,loudnorm=I=-16:TP=-2"
voice = np.zeros((N, 2), np.float32)
for v in tl["voice"]:
    x = load(f"public/audio/vo/{v['id']}.mp3", AI_FX if v["speaker"] == "ai" else FD_FX)
    if v["speaker"] == "founder":  # léger décalage stéréo = voix "dans la pièce"
        x[:, 0] *= 0.92
    place(voice, x, v["start"])
sfx = np.zeros((N, 2), np.float32); cache = {}
for c in tl["sfx"]:
    if c["name"] not in cache:
        x = load(f"public/audio/sfx/{c['name']}.mp3"); x /= (np.abs(x).max() + 1e-9); cache[c["name"]] = x * db(-1)
    x = cache[c["name"]].copy()
    if "dur" in c: x = x[: int(c["dur"] * SR)]
    place(sfx, x * db(-8), c["t"], c["gain"], 0.005, c.get("fade", 0.02))
music = np.zeros((N, 2), np.float32); amb = np.zeros((N, 2), np.float32)
for m in tl["music"]:
    x = load(f"public/audio/sfx/{m['name']}.mp3", "loudnorm=I=-14:TP=-1.5")
    L = int((m["until"] - m["t"]) * SR)
    if m.get("loop") and len(x) < L:  # boucle avec fondu enchaîné de 50 ms
        xf = int(0.05 * SR); out = x.copy()
        while len(out) < L:
            a = out[-xf:] * np.linspace(1, 0, xf)[:, None] + x[:xf] * np.linspace(0, 1, xf)[:, None]
            out = np.concatenate([out[:-xf], a, x[xf:]])
        x = out
    place(amb if m["name"] == "room" else music, x[:L], m["t"], m["gain"], m["fadeIn"], m["fadeOut"])
# ducking : la musique baisse sous la voix (enveloppe lissée)
env = np.abs(voice).max(1); win = int(0.12 * SR)
env = np.convolve(env, np.ones(win) / win, "same"); env = np.clip(env / 0.08, 0, 1)
att = int(0.25 * SR); env = np.convolve(env, np.ones(att) / att, "same")
music *= (1 - 0.55 * env)[:, None]
mix = voice + sfx + music + amb
tmp = "public/audio/_premix.wav"
subprocess.run(["ffmpeg", "-v", "error", "-y", "-f", "f32le", "-ar", str(SR), "-ac", "2", "-i", "-", tmp], input=mix.astype(np.float32).tobytes(), check=True)
subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", tmp, "-af", "loudnorm=I=-14:TP=-1.0:LRA=11,alimiter=limit=0.89", "-ar", "48000", "public/audio/mix.wav"], check=True)
os.remove(tmp); print("mix ok", tl["duration"], "s")
