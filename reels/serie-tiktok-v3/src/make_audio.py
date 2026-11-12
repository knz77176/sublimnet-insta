"""Audio TikTok (voix Sophie + musique rythmée + bruitages) pour tkA/tkB/tkC. usage: python3 make_audio.py A|B|C"""
import json, os, subprocess, sys
H = os.path.dirname(os.path.abspath(__file__)); R = sys.argv[1]
vo = json.load(open(f"{H}/vo{R}.json")); ev = json.load(open(f"{H}/ev{R}.json")); t = ev["t"]
tl = {"duration": vo["duration"], "vo": {k: v["file"] for k, v in vo["lines"].items()}}
if R == "A":
    tl["music"] = {"bpm": 122, "prog": [[45, 57, 60, 64, 67, 71], [41, 53, 57, 60, 64, 69], [48, 55, 60, 64, 67, 72], [43, 55, 59, 62, 67, 71]]}
    tl["end"] = {"blur": [t["s8"]]}
    tl["sfx"] = {"whoosh": ev["cuts"], "impact": [t["wipe1"] - 0.15, t["sl1"] - 0.1, t["p5"], t["p6"], t["s8"]],
                 "riser": [[t["wipe1"] - 0.15, 1.3], [t["sl1"] - 0.1, 1.0]], "shimmer": [t["wipe1"] - 0.1, t["sl1"], t["p6"]],
                 "bubble": [t["h1"], t["h2"], t["chez"] + 0.1, t["bdg"], t["k1"], t["k2"], t["k3"], t["k4"], t["e1"], t["e2"]],
                 "tap": [t["c1"], t["c2"], t["c3"], t["tapA"], t["tapB"]]}
elif R == "B":
    tl["music"] = {"bpm": 120, "prog": [[38, 50, 53, 57, 60, 64], [34, 46, 53, 57, 62, 65], [41, 53, 57, 60, 64, 69], [36, 48, 55, 60, 64, 69]]}
    tl["end"] = {"blur": [t["end"]]}
    tl["sfx"] = {"whoosh": ev["cuts"], "impact": [t["h2"], t["rv1"] - 0.15, t["st"] + 0.15, t["end"]],
                 "riser": [[t["rv1"] - 0.15, 0.9], [t["st"] + 0.15, 1.0]],
                 "bubble": [t["h1"], t["h3"], t["dCan"] + 0.05, t["dMat"] + 0.05, t["t2"], t["e1"], t["e2"]],
                 "keysVoi": [t["dVoi"], t["dVoi"] + 0.45, 9],
                 "shimmer": [t["rv1"] - 0.1, t["mat"] + 0.1, t["dCan"], t["dMat"]], "success": [t["t2"] - 0.05]}
else:
    tl["music"] = {"bpm": 124, "prog": [[40, 52, 55, 59, 62, 66], [36, 48, 55, 59, 64, 67], [43, 55, 59, 62, 67, 71], [42, 54, 57, 62, 66, 69]]}
    tl["end"] = {"blur": [t["end"]]}
    tl["sfx"] = {"whoosh": ev["cuts"], "impact": [t["wipe1"] - 0.15, t["st"] + 0.15, t["end"]], "riser": [[t["wipe1"] - 0.15, 1.1]],
                 "shimmer": [t["wipe1"] - 0.1, t["tag"]], "bubble": [t["h1"], t["h2"], t["chez"] + 0.1, t["r1"], t["r2"], t["r3"], t["r4"], t["r5"], t["days"] + 0.1, t["form"], t["e2"]],
                 "keysStars": [t["stars"], t["stars"] + 0.7, 5], "success": [t["done"]], "tap": [t["c1"], t["tap5"]]}
json.dump(tl, open(f"{H}/tlaudio{R}.json", "w"), indent=1)
subprocess.run(["python3", "-I", f"{H}/audio.py", f"{H}/tlaudio{R}.json", f"{H}/vo/{R}", f"{H}/mix{R}.wav", f"{H}/stem{R}"], check=True)
for st in ("music", "vo", "sfx"):
    out = subprocess.run(["ffmpeg", "-v", "info", "-i", f"{H}/stem{R}_{st}.wav", "-af", "ebur128", "-f", "null", "-"], capture_output=True, text=True).stderr
    print(R, st, [l.strip() for l in out.splitlines() if l.strip().startswith("I:")][-1:])
