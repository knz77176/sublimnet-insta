"""Construit la timeline audio de chaque pub (voix, musique, bruitages) à partir de vo{R}.json et ev{R}.json,
puis appelle audio.py. usage: python3 make_audio.py A|B|C"""
import json, os, subprocess, sys
H = os.path.dirname(os.path.abspath(__file__))
R = sys.argv[1]
vo = json.load(open(f"{H}/vo{R}.json")); ev = json.load(open(f"{H}/ev{R}.json")); t = ev["t"]
tl = {"duration": vo["duration"], "vo": {k: v["file"] for k, v in vo["lines"].items()}}
if R == "A":
    tl["music"] = {"bpm": 104, "prog": [[48, 55, 60, 64, 67, 74], [45, 57, 60, 64, 67, 71], [41, 53, 57, 60, 64, 67], [43, 55, 60, 62, 64, 69]]}
    tl["end"] = {"blur": [t["logo2"] - 0.05]}
    tl["sfx"] = {"whoosh": [t["logoOut"], t["mapIn"], t["panel"], t["reserve"] + 0.05, t["shrink"]],
                 "bubble": t["pills"] + [t["chez"], t["card"], t["ba"]],
                 "tap": ev["clicks"], "keysType": [t["type"][0], t["type"][1], 8],
                 "success": [t["reserve"] + 0.75], "shimmer": [t["logoIn"], t["logo2"]]}
elif R == "B":
    tl["music"] = {"bpm": 90, "prog": [[38, 50, 53, 57, 60, 64], [34, 46, 53, 57, 62, 65], [41, 53, 57, 60, 64, 69], [36, 48, 55, 60, 64, 69]]}
    tl["end"] = {"blur": [t["logo"] - 0.05]}
    tl["sfx"] = {"whoosh": [0.85, t["flash"], t["voi"], t["dep"], t["tot"], t["arcs"]],
                 "shimmer": [0.9, t["off"], t["logo"]],
                 "bubble": [t["dCan"] - 0.12, t["dMat"] - 0.12, t["tx"], t["tx"] + 0.18, t["off"]],
                 "keysCan": [t["dCan"] - 0.08, t["dCan"] + 0.5, 10], "keysMat": [t["dMat"] - 0.08, t["dMat"] + 0.5, 10],
                 "keysAuto": [t["dAuto"], t["dAuto"] + 0.45, 8], "keysTot": [t["tnum"], t["tnum"] + 0.85, 14],
                 "success": [t["rsv"]]}
else:
    tl["music"] = {"bpm": 96, "prog": [[40, 52, 55, 59, 62, 66], [36, 48, 55, 59, 64, 67], [43, 55, 59, 62, 67, 71], [42, 54, 57, 62, 66, 69]]}
    tl["end"] = {"blur": [t["icon"] - 0.05]}
    tl["sfx"] = {"whoosh": [0.05, t["live"], t["revs"], t["inp"], t["uiOut"]],
                 "bubble": [t["chip"], t["send"], t["reply"], t["expand"]],
                 "tap": [t["send"] - 0.02], "keysType": [t["type"][0], t["type"][1], 18],
                 "ding": [t["liveHi"]], "shimmer": [t["icon"], t["tag"]]}
json.dump(tl, open(f"{H}/tlaudio{R}.json", "w"), indent=1)
subprocess.run(["python3", "-I", f"{H}/audio.py", f"{H}/tlaudio{R}.json", f"{H}/vo/{R}", f"{H}/mix{R}.wav", f"{H}/stem{R}"], check=True)
for st in ("music", "vo", "sfx"):
    out = subprocess.run(["ffmpeg", "-v", "info", "-i", f"{H}/stem{R}_{st}.wav", "-af", "ebur128", "-f", "null", "-"], capture_output=True, text=True).stderr
    print(R, st, [l.strip() for l in out.splitlines() if l.strip().startswith("I:")][-1:])
