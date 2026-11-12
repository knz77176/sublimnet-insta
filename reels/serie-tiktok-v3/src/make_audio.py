"""Audio TikTok (voix Sophie + musique rythmée + bruitages) pour tkA/tkB/tkC. usage: python3 make_audio.py A|B|C"""
import json, os, subprocess, sys
H = os.path.dirname(os.path.abspath(__file__)); R = sys.argv[1]
vo = json.load(open(f"{H}/vo{R}.json")); ev = json.load(open(f"{H}/ev{R}.json")); t = ev["t"]
tl = {"duration": vo["duration"], "vo": {k: v["file"] for k, v in vo["lines"].items()}}
if R == "A":
    tl["music"] = {"bpm": 122, "prog": [[45, 57, 60, 64, 67, 71], [41, 53, 57, 60, 64, 69], [48, 55, 60, 64, 67, 72], [43, 55, 59, 62, 67, 71]]}
    tl["end"] = {"blur": [t["s8"]]}
    tl["sfx"] = {"whoosh": ev["cuts"], "impact": [t["wipe1"] - 0.15, t["s4"], t["p5"], t["p6"], t["s8"]],
                 "riser": [[t["wipe1"] - 0.15, 1.3]], "shimmer": [t["wipe1"] - 0.1, t["sl1"]],
                 "bubble": [t["h1"], t["h2"], t["chez"] + 0.1, t["bdg"], t["k1"], t["k2"], t["k3"], t["k4"], t["e1"], t["e2"]],
                 "tap": [t["c1"], t["c2"]]}
elif R == "B":
    tl["music"] = {"bpm": 120, "prog": [[38, 50, 53, 57, 60, 64], [34, 46, 53, 57, 62, 65], [41, 53, 57, 60, 64, 69], [36, 48, 55, 60, 64, 69]]}
    tl["end"] = {"blur": [t["end"]]}
    tl["sfx"] = {"whoosh": ev["cuts"], "impact": [t["h2"], t["st"] + 0.15, t["end"]],
                 "riser": [[t["h2"], 0.9], [t["st"] + 0.15, 1.0]],
                 "bubble": [t["h1"], t["h3"], t["d2"], t["t2"], t["e1"], t["e2"]],
                 "keysCan": [t["dCan"] - 0.1, t["dCan"] + 0.45, 9], "keysMat": [t["dMat"] - 0.1, t["dMat"] + 0.45, 9], "keysVoi": [t["dVoi"] - 0.1, t["dVoi"] + 0.45, 9],
                 "shimmer": [t["dCan"] + 0.45, t["dMat"] + 0.45, t["dVoi"] + 0.45], "success": [t["t2"] - 0.3]}
else:
    tl["music"] = {"bpm": 124, "prog": [[40, 52, 55, 59, 62, 66], [36, 48, 55, 59, 64, 67], [43, 55, 59, 62, 67, 71], [42, 54, 57, 62, 66, 69]]}
    tl["end"] = {"blur": [t["end"]]}
    tl["sfx"] = {"whoosh": ev["cuts"], "impact": [t["wipe1"] - 0.15, t["st"] + 0.15, t["end"]], "riser": [[t["wipe1"] - 0.15, 1.1]],
                 "shimmer": [t["wipe1"] - 0.1, t["tag"]], "bubble": [t["h1"], t["h2"], t["chez"] + 0.1, t["r1"], t["r2"], t["r3"], t["r4"], t["r5"], t["e2"]],
                 "keysStars": [t["stars"], t["stars"] + 0.7, 5], "keysDays": [t["days"], t["days"] + 0.7, 7], "success": [t["done"]]}
json.dump(tl, open(f"{H}/tlaudio{R}.json", "w"), indent=1)
subprocess.run(["python3", "-I", f"{H}/audio.py", f"{H}/tlaudio{R}.json", f"{H}/vo/{R}", f"{H}/mix{R}.wav", f"{H}/stem{R}"], check=True)
for st in ("music", "vo", "sfx"):
    out = subprocess.run(["ffmpeg", "-v", "info", "-i", f"{H}/stem{R}_{st}.wav", "-af", "ebur128", "-f", "null", "-"], capture_output=True, text=True).stderr
    print(R, st, [l.strip() for l in out.splitlines() if l.strip().startswith("I:")][-1:])
