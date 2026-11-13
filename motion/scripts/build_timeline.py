"""Construit src/timeline.json : voix (avec mots horodatés), cues SFX et musique."""
import json, sys
VO = "public/audio/vo"
lines = {l["id"]: l for l in json.load(open(f"{VO}/lines.json"))}
START = {"a1": 1.30, "a2": 7.95, "a3": 10.85, "f1": 15.05, "a4": 18.25, "f2": 24.60,
         "a5": 27.75, "a6": 29.75, "a7": 36.15, "a8": 42.30, "f3": 46.50, "a9": 57.30}
DROP = 48.60; BEAT = 0.42857; ITEM = 4 * BEAT; END = 66.0
voice = []
for id_, t0 in START.items():
    d = json.load(open(f"{VO}/{id_}.stt.json"))
    ws = [w for w in d["words"] if w["type"] == "word"]
    voice.append({"id": id_, "speaker": lines[id_]["speaker"], "text": lines[id_]["text"], "start": t0,
                  "end": round(t0 + ws[-1]["end"], 3),
                  "words": [{"w": w["text"], "s": round(t0 + w["start"], 3), "e": round(t0 + w["end"], 3)} for w in ws]})
V = {v["id"]: v for v in voice}
def word_t(id_, needle, k=0):
    hits = [w for w in V[id_]["words"] if needle.lower() in w["w"].lower()]
    return hits[k]["s"]
sfx = []
def cue(name, t, gain=0.0, dur=None, fade=0.0):
    sfx.append({"name": name, "t": round(t, 3), "gain": gain, **({"dur": dur} if dur else {}), **({"fade": fade} if fade else {})})
# intro
cue("lamp_click", 0.05, 8); cue("ui_boot", 0.85, 0); cue("ui_open", 1.45, -2); cue("ui_open2", 2.35, -3); cue("ui_count", 2.7, -6)
cue("notif_one", word_t("a1", "Clio") - 0.05, -2)
# analytics
cue("whoosh_soft", 7.75, -4); cue("ui_open", 8.0, -3); cue("data_blips", 8.55, -6)
# messages
cue("whoosh_soft", 10.65, -4); cue("notif_stack", 10.95, -3); cue("notif_one", 12.6, -6); cue("notif_one", 13.7, -7)
# fondateur : injection-extraction
cue("glitch", 14.95, -8); cue("ui_open2", 15.25, -3); cue("spray", word_t("f1", "injection") - 0.05, -10); cue("extraction", word_t("f1", "injection") + 0.5, -14, dur=1.8, fade=0.6)
# devis
cue("whoosh_soft", 18.05, -4); cue("ui_open", 18.3, -3); cue("ui_click", 19.55, -2)
for t in (20.35, 20.75, 21.15, 21.55): cue("ui_blip", t, 2)
cue("ui_click", 21.95, -2); cue("typing", 22.2, -4, dur=3.4, fade=0.3)
cue("ui_click", word_t("f2", "tapis"), -2); cue("ui_click", word_t("f2", "diagnostic") + 0.25, 0)
# agent + scan
cue("ui_open2", 27.5, -3); cue("data_blips", 28.0, -6); cue("scan", 28.5, -12, dur=6.6, fade=1.2)
for k in ("Acariens", "Odeur", "Couleur"): cue("ui_open2", word_t("a6", k) - 0.08, -5)
cue("ui_blip", word_t("a6", "commenter"), 0)
# carte
cue("whoosh_soft", 35.85, -4); cue("ui_open", 36.1, -3); cue("map_ping", word_t("a7", "Chartron") - 0.05, -3); cue("map_ping", word_t("a7", "itinéraire"), -5)
# appel
cue("ring", 40.9, -2); cue("ring", 44.3, -12)
cue("ui_click", 47.45, 0); cue("riser", DROP - 3.0, 0); cue("glitch", DROP - 0.3, -6); cue("impact", DROP, 2)
# montage avant/après
items = ["canape", "matelas", "tapis", "siege", "phare"]
for i, it in enumerate(items):
    t = DROP + i * ITEM
    if i: cue("whoosh_fast", t - 0.12, -6)
    cue("extraction" if it != "phare" else "swipe_clean", t + 0.35, -13 if it != "phare" else -6, dur=1.1, fade=0.3)
    cue("sparkle", t + 1.15, 0)
OUT_T = DROP + len(items) * ITEM
cue("whoosh_soft", OUT_T - 0.1, -3); cue("impact", OUT_T, -10); cue("sparkle", OUT_T + 0.4, 2)
cue("ui_click", 63.4, -2); cue("ui_blip", 64.6, 2); cue("lamp_click", END - 0.75, 8)
music = [
    {"name": "music_amb", "t": 0.5, "until": DROP - 0.4, "gain": -11, "fadeIn": 1.5, "fadeOut": 2.0, "loop": True},
    {"name": "music_beat", "t": DROP - 0.62, "until": END - 0.6, "gain": -4, "fadeIn": 0.4, "fadeOut": 1.0, "loop": True},
    {"name": "room", "t": 0.0, "until": END, "gain": -26, "fadeIn": 0.2, "fadeOut": 0.8, "loop": True},
]
tl = {"fps": 30, "duration": END, "drop": DROP, "beat": BEAT, "item": ITEM, "outro": round(OUT_T, 3),
      "items": items, "voice": voice, "sfx": sorted(sfx, key=lambda c: c["t"]), "music": music}
json.dump(tl, open("src/timeline.json", "w"), ensure_ascii=False, indent=1)
print("voice", [(v["id"], v["start"], v["end"]) for v in voice]); print("sfx cues", len(sfx), "outro", OUT_T)
