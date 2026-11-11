"""Music bed + sound design + voice-over mix for the SublimNet reel.
usage: python3 audio.py timeline.json vo_dir out.wav
Everything is synthesised here (no samples), so the track is royalty-free.
"""
import sys, json, numpy as np, soundfile as sf
from scipy.signal import butter, sosfilt, resample_poly

TLp, VOD, OUT = sys.argv[1:4]
TL = json.load(open(TLp))
SR = 48000
DUR = TL["duration"]
N = int(DUR * SR)
rng = np.random.default_rng(7)

def bp(x, lo, hi, order=2):
    return sosfilt(butter(order, [lo, hi], btype="band", fs=SR, output="sos"), x)
def lp(x, f, order=2):
    return sosfilt(butter(order, f, btype="low", fs=SR, output="sos"), x)
def hp(x, f, order=2):
    return sosfilt(butter(order, f, btype="high", fs=SR, output="sos"), x)
def mtof(m):
    return 440.0 * 2 ** ((m - 69) / 12)
def place(buf, sig, t, gain=1.0, pan=0.0):
    i = int(t * SR)
    if i < 0:
        sig, i = sig[-i:], 0
    if i >= len(buf):
        return
    sig = sig[: len(buf) - i]
    l = np.cos((pan + 1) * np.pi / 4); r = np.sin((pan + 1) * np.pi / 4)
    buf[i:i + len(sig), 0] += sig * gain * l * 1.414
    buf[i:i + len(sig), 1] += sig * gain * r * 1.414

# ---------------------------------------------------------------- music
BPM = 100.0
beat = 60.0 / BPM
bar = 4 * beat
music = np.zeros((N, 2))

# chords (midi): Gmaj9, D/F#, Em9, Asus4->A
prog = [
    [43, 55, 59, 62, 66, 69],   # G  : G2 G3 B3 D4 F#4 A4
    [42, 54, 57, 62, 66, 69],   # D/F#
    [40, 52, 55, 59, 62, 66],   # Em9
    [45, 57, 62, 64, 69, 71],   # Asus
]

def pad_voice(f, dur, amp):
    n = int(dur * SR); t = np.arange(n) / SR
    s = np.zeros(n)
    for det in (-0.08, 0.0, 0.08):
        ff = f * 2 ** (det / 12)
        for h in range(1, 7):
            s += np.sin(2 * np.pi * ff * h * t + rng.uniform(0, 6.28)) / (h ** 1.6)
    env = np.minimum(1, t / 0.6) * np.minimum(1, (dur - t) / 0.5).clip(0, 1)
    return s * env * amp

def pluck(f, dur=0.6, amp=0.2, tau=0.22):
    n = int(dur * SR); t = np.arange(n) / SR
    s = np.sin(2 * np.pi * f * t) + 0.35 * np.sin(2 * np.pi * 2 * f * t) * np.exp(-t / 0.07) + 0.12 * np.sin(2 * np.pi * 3.01 * f * t) * np.exp(-t / 0.04)
    env = np.exp(-t / tau) * np.minimum(1, t / 0.004)
    return s * env * amp

def kick(amp=0.9):
    n = int(0.35 * SR); t = np.arange(n) / SR
    f = 45 + 85 * np.exp(-t / 0.035)
    ph = 2 * np.pi * np.cumsum(f) / SR
    return np.sin(ph) * np.exp(-t / 0.12) * amp

def snap(amp=0.25):
    n = int(0.18 * SR); t = np.arange(n) / SR
    s = bp(rng.standard_normal(n), 900, 5000) * np.exp(-t / 0.045)
    return s * amp

def hat(amp=0.06):
    n = int(0.06 * SR); t = np.arange(n) / SR
    return hp(rng.standard_normal(n), 7000) * np.exp(-t / 0.015) * amp

def bass(f, dur, amp=0.35):
    n = int(dur * SR); t = np.arange(n) / SR
    s = np.sin(2 * np.pi * f * t) + 0.25 * np.sin(2 * np.pi * 2 * f * t)
    env = np.minimum(1, t / 0.01) * np.exp(-t / 0.5)
    return s * env * amp

END = TL["end"]["blur"][0]          # end-card impact
BUILD0 = END - 2.4
nbars = int(np.ceil(DUR / bar)) + 1
padL = np.zeros(N); padR = np.zeros(N)
for b in range(nbars):
    t0 = b * bar
    if t0 >= DUR:
        break
    ch = prog[b % 4]
    # pad
    for k, m in enumerate(ch[1:]):
        v = pad_voice(mtof(m), bar + 0.6, 0.028)
        i = int(t0 * SR); v = v[: N - i]
        (padL if k % 2 else padR)[i:i + len(v)] += v
        (padR if k % 2 else padL)[i:i + len(v)] += v * 0.6
    # arp (8ths), sparser in the intro
    arp = [ch[2] + 12, ch[3] + 12, ch[4] + 12, ch[3] + 12, ch[5] + 12, ch[4] + 12, ch[3] + 12, ch[2] + 12]
    for j, m in enumerate(arp):
        tt = t0 + j * beat / 2
        if tt >= DUR - 0.3:
            break
        if tt < bar and j % 2:
            continue
        if BUILD0 + 1.6 < tt < END:
            continue
        place(music, pluck(mtof(m), amp=0.085 if j % 2 else 0.11), tt, pan=(-0.35 if j % 2 else 0.35))
    # groove from bar 2 until the build ends
    if bar <= t0 < END:
        for q in range(4):
            tb = t0 + q * beat
            if tb >= END - 0.35:
                continue
            if q in (0, 2):
                place(music, kick(0.55), tb)
                place(music, bass(mtof(ch[0]), beat * 1.8, 0.22), tb)
            if q in (1, 3) and t0 >= 2 * bar:
                place(music, snap(0.16), tb, pan=0.05)
            for e in (0.5,):
                place(music, hat(0.05), tb + e * beat, pan=0.25)
music[:, 0] += lp(padL, 2600); music[:, 1] += lp(padR, 2600)

# build riser before the end card
n = int(2.2 * SR); t = np.arange(n) / SR
riser = rng.standard_normal(n)
riser = np.concatenate([bp(riser[i:i + 4800], 300 + 6000 * (i / n) ** 2, 400 + 9000 * (i / n) ** 2) for i in range(0, n, 4800)])[:n]
riser *= (t / 2.2) ** 2.2 * 0.22
place(music, riser, END - 2.2)
# impact on the end card: sub boom + wide chord
place(music, kick(0.9), END)
n = int(5.8 * SR); t = np.arange(n) / SR
place(music, np.sin(2 * np.pi * mtof(31) * t) * np.exp(-t / 1.2) * 0.35, END)
for k, m in enumerate([55, 59, 62, 66, 69, 74, 78]):
    place(music, pluck(mtof(m), dur=5.5, amp=0.06, tau=1.6), END + 0.02 * k, pan=(k / 3 - 1))
# final fade
fade = np.ones(N)
f0 = int((DUR - 1.4) * SR); fade[f0:] = np.linspace(1, 0, N - f0) ** 1.5
music *= fade[:, None]

# ---------------------------------------------------------------- sfx
sfx = np.zeros((N, 2))
S = TL["sfx"]
def whoosh(dur=0.55, amp=0.16):
    n = int(dur * SR); t = np.arange(n) / SR
    x = rng.standard_normal(n)
    chunks = []
    for i in range(0, n, 2400):
        p = i / n
        c = 500 + 2600 * np.sin(np.pi * p)
        chunks.append(bp(x[i:i + 2400], c * 0.5, c * 1.6))
    s = np.concatenate(chunks)[:n]
    return s * np.sin(np.pi * t / dur) ** 2 * amp
for tt in S["whoosh"]:
    place(sfx, whoosh(), tt - 0.12, pan=0.0)
def ding(f1, f2, amp=0.12):
    a = pluck(f1, dur=0.9, amp=amp, tau=0.25); b = pluck(f2, dur=0.9, amp=amp, tau=0.35)
    out = np.zeros(int(1.0 * SR)); out[:len(a)] += a; i = int(0.09 * SR); out[i:i + len(b)] += b[: len(out) - i]
    return out
for k, tt in enumerate(S["ding"]):
    place(sfx, ding(mtof(81), mtof(88) if k == 0 else mtof(86)), tt, pan=0.15)
def click(amp=0.18, f=2600):
    n = int(0.03 * SR); t = np.arange(n) / SR
    s = (np.sin(2 * np.pi * f * t) * 0.6 + hp(rng.standard_normal(n), 2500) * 0.5) * np.exp(-t / 0.006)
    return s * amp
for tt in S["tap"]:
    place(sfx, click(0.22, 1900), tt - 0.01)
for key in ("keysSearch", "keysAddr", "keysUrl"):
    a, b, cnt = S[key]
    for i in range(int(cnt)):
        tt = a + (b - a) * i / cnt + rng.uniform(-0.01, 0.01)
        place(sfx, click(0.07 + rng.uniform(0, 0.03), 3200 + rng.uniform(-500, 500)), tt, pan=rng.uniform(-0.2, 0.2))
# success chime
for k, m in enumerate([76, 79, 83, 88]):
    place(sfx, pluck(mtof(m), dur=1.4, amp=0.10, tau=0.5), S["success"] + 0.085 * k, pan=-0.2 + 0.13 * k)
# logo shimmer + button pop
n = int(1.2 * SR); t = np.arange(n) / SR
shim = hp(rng.standard_normal(n), 6000) * np.sin(np.pi * t / 1.2) ** 2 * 0.05
place(sfx, shim, S["pop"][0])
n = int(0.09 * SR); t = np.arange(n) / SR
f = 380 + 900 * t / 0.09
pop = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t / 0.03) * 0.2
place(sfx, pop, S["pop"][1])

# ---------------------------------------------------------------- voice
vo = np.zeros(N)
for key, tt in TL["vo"].items():
    s, sr = sf.read(f"{VOD}/{key}.wav")
    if s.ndim > 1:
        s = s.mean(axis=1)
    s = resample_poly(s, SR, sr)
    s = s / (np.abs(s).max() + 1e-9) * 0.8
    i = int(tt * SR); s = s[: N - i]
    vo[i:i + len(s)] += s
# gentle presence / de-mud
vo = hp(vo, 90) + 0.25 * bp(vo, 2500, 6000)

# ducking envelope from VO activity
act = np.abs(vo) > 0.02
w = int(0.01 * SR)
act = np.convolve(act.astype(float), np.ones(w) / w, mode="same") > 0
duck = np.where(act, 0.42, 1.0)
# smooth: fast attack, slow release
g = np.empty(N); cur = 1.0
a_att = np.exp(-1 / (0.06 * SR)); a_rel = np.exp(-1 / (0.35 * SR))
for i in range(0, N, 48):
    tgt = duck[i]
    a = a_att if tgt < cur else a_rel
    cur = tgt + (cur - tgt) * a ** 48
    g[i:i + 48] = cur

mix = music * g[:, None] * 0.9 + sfx + np.stack([vo, vo], axis=1)
peak = np.abs(mix).max()
mix = mix / peak * 0.89
sf.write(OUT, mix.astype(np.float32), SR, subtype="FLOAT")
print("written", OUT, "peak before norm", round(float(peak), 3))
if len(sys.argv) > 4:
    sc = 0.89 / peak
    sf.write(sys.argv[4] + "_music.wav", (music * g[:, None] * 0.9 * sc).astype(np.float32), SR, subtype="FLOAT")
    sf.write(sys.argv[4] + "_vo.wav", (np.stack([vo, vo], 1) * sc).astype(np.float32), SR, subtype="FLOAT")
    sf.write(sys.argv[4] + "_sfx.wav", (sfx * sc).astype(np.float32), SR, subtype="FLOAT")
