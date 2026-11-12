"""Place les phrases de voix off (prises Sophie découpées) et écrit vo{A,B,C}.json pour les pages et l'audio."""
import json, os
import numpy as np, soundfile as sf
H = os.path.dirname(os.path.abspath(__file__))
CFG = {
    "A": dict(order=["a1","a2","a3","a4","a5","a6","a7","a8"], start=0.55, hold=2.2,
              gaps={"a2":0.45,"a3":0.5,"a4":0.55,"a5":0.7,"a6":0.55,"a7":0.55,"a8":1.35}),
    "B": dict(order=["b1","b2","b3","b4","b5","b6","b7"], start=1.15, hold=2.4,
              gaps={"b2":0.8,"b3":0.6,"b4":0.75,"b5":0.8,"b6":0.7,"b7":1.0}),
    "C": dict(order=["c1","c2","c3","c4","c5","c6","c7","c8"], start=0.7, hold=2.2,
              gaps={"c2":0.6,"c3":0.6,"c4":0.6,"c5":0.75,"c6":0.6,"c7":0.8,"c8":0.35}),
}
def bounds(p):
    x, sr = sf.read(p); idx = np.where(np.abs(x) > 0.012)[0]; return idx[0]/sr, idx[-1]/sr
for R, c in CFG.items():
    W = json.load(open(f"{H}/vo/{R}/words.json"))
    out = {"lines": {}}; cur = c["start"]
    for i, k in enumerate(c["order"]):
        s0, s1 = bounds(f"{H}/vo/{R}/{k}.wav")
        st = cur - s0
        out["lines"][k] = {"file": round(st, 3), "on": round(cur, 3), "end": round(st + s1, 3), "text": W[k]["text"],
                           "words": [[w[0], round(st + w[1], 3), round(st + w[2], 3)] for w in W[k]["words"]]}
        nxt = c["order"][i + 1] if i + 1 < len(c["order"]) else None
        cur = st + s1 + c["gaps"].get(nxt, 0.5)
    out["duration"] = round(out["lines"][c["order"][-1]]["end"] + c["hold"], 2)
    json.dump(out, open(f"{H}/vo{R}.json", "w"), ensure_ascii=False, indent=1)
    print(R, out["duration"], " ".join(f"{k}:{v['on']:.2f}-{v['end']:.2f}" for k, v in out["lines"].items()))
