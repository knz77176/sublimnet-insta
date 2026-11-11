"""Calcule les timelines tA/tB/tC.json à partir des voix off (horodatage des mots)."""
import json, os, sys
import numpy as np, soundfile as sf
HERE = os.path.dirname(os.path.abspath(__file__))

def bounds(path):
    x, sr = sf.read(path)
    idx = np.where(np.abs(x) > 0.012)[0]
    return idx[0] / sr, idx[-1] / sr

class Plan:
    def __init__(self, reel, order, gaps, start=0.45, hold=1.7):
        self.reel = reel
        self.W = json.load(open(f"{HERE}/vo/{reel}/words.json"))
        self.st, self.on_, self.en = {}, {}, {}
        cur = start
        for k in order:
            s0, s1 = bounds(f"{HERE}/vo/{reel}/{k}.wav")
            self.st[k] = cur - s0; self.on_[k] = cur; self.en[k] = cur - s0 + s1
            nxt = order[order.index(k) + 1] if k != order[-1] else None
            cur = self.en[k] + gaps.get(nxt, 0.5)
        self.duration = round(self.en[order[-1]] + hold, 2)
    def on(self, k): return round(self.on_[k], 3)
    def w(self, k, word, nth=0):
        ws = self.W[k]["words"]
        if isinstance(word, int):
            return round(self.st[k] + ws[word][1], 3)
        hits = [i for i, x in enumerate(ws) if x[0].lower().strip(",.:;!?…").startswith(word.lower())]
        return round(self.st[k] + ws[hits[nth]][1], 3)
    def we(self, k, word):
        ws = self.W[k]["words"]
        hits = [i for i, x in enumerate(ws) if x[0].lower().strip(",.:;!?…").startswith(word.lower())]
        return round(self.st[k] + ws[hits[0]][2], 3)
    def vo(self): return {k: round(v, 3) for k, v in self.st.items()}

def mv(t0, t1, to): return {"t": [round(t0, 3), round(t1, 3)], "to": to}
def cap(i, o, a, b): return {"in": round(i, 3), "out": round(o, 3), "a": a, "b": b}

START = {"cx": 1040, "cy": 1000, "s": 0.62, "rx": 42, "rz": -30, "ay": 760}
TOP = {"cx": 946, "cy": 500, "s": 1.05, "rx": 10, "rz": -4, "ay": 1010}
PHONE = {"cx": 1114, "cy": 1290, "s": 1.25, "rx": 7, "rz": -2, "ay": 1130}
LEFT_UP = {"cx": 927, "cy": 1290, "s": 1.12, "rx": 7, "rz": -2.5, "ay": 1130}
RIGHT_UP = {"cx": 1301, "cy": 1290, "s": 1.12, "rx": 7, "rz": -1.5, "ay": 1130}
LEFT_LOW = {"cx": 927, "cy": 1380, "s": 1.12, "rx": 7, "rz": -2.5, "ay": 1130}
RIGHT_LOW = {"cx": 1301, "cy": 1380, "s": 1.12, "rx": 7, "rz": -1.5, "ay": 1130}
WIDE = {"cx": 1114, "cy": 1160, "s": 0.6, "rx": 18, "rz": -11, "ay": 1080}

def endblock(p, k, tag_t=None, btn_t=None, bar_t=None):
    o = p.on(k)
    tag = tag_t if tag_t is not None else o + 0.45
    btn = btn_t if btn_t is not None else p.w(k, "réservez")
    bar = bar_t if bar_t is not None else btn + 0.35
    return {"blur": [o - 0.5, o + 0.1], "logo": [o - 0.2, o + 0.7], "tag": tag, "sub": tag + 0.18, "stars": tag + 0.32,
            "btn": btn, "bar": bar, "url1": [p.w(k, "sublim", 1 if p.W[k]["text"].startswith("SublimNet") else 0), p.w(k, "point") - 0.05],
            "url2": [p.w(k, "point"), p.we(k, "com") + 0.1]}

def sfx_common(tl, extra):
    whoosh = [m["t"][0] for m in tl["cam"][1:]] + [tl["end"]["blur"][0]]
    s = {"whoosh": [0.05] + whoosh, "shimmer": [tl["end"]["logo"][0]], "bubble": [tl["end"]["btn"]],
         "keysUrl": [tl["end"]["url1"][0], tl["end"]["url2"][1], 13]}
    for k, v in extra.items():
        s[k] = s.get(k, []) + v if isinstance(v, list) and k in s else v
    return s

# ------------------------------------------------------------------ A
p = Plan("A", ["a1", "a2", "a3", "a4", "a5", "a6", "a7", "a8"], {"a2": 0.35, "a3": 0.45, "a4": 0.55, "a5": 0.65, "a6": 0.5, "a7": 0.55, "a8": 0.6})
on = p.on
phoneOn = on("a4") - 0.55
A = {
    "fps": 30, "duration": p.duration, "vo": p.vo(),
    "music": {"bpm": 104, "prog": [[45, 57, 60, 64, 67, 71], [41, 53, 57, 60, 64, 69], [48, 55, 60, 64, 67, 72], [43, 55, 59, 62, 64, 71]]},
    "camStart": START,
    "cam": [mv(0, 2.0, TOP), mv(on("a3") - 0.35, on("a3") + 0.35, {"focus": "notif", "s": 1.15, "rx": 9, "rz": -3, "ay": 930}),
            mv(on("a4") - 0.6, on("a4") + 0.15, PHONE), mv(on("a5") - 0.5, on("a5") + 0.2, LEFT_UP),
            mv(on("a6") - 0.45, on("a6") + 0.25, RIGHT_UP), mv(on("a7") - 0.4, on("a7") + 0.8, WIDE)],
    "phoneOn": phoneOn,
    "shotList": [{"id": "s_hero", "kind": "hero"}, {"id": "s_formules", "kind": "cover"}],
    "shots": [{"id": "s_hero", "t": phoneOn}, {"id": "s_formules", "t": on("a5") - 0.35}],
    "hl": [{"shot": "s_formules", "r": [17, 202, 356, 119], "t0": p.w("a5", "aspiration") - 0.2, "t1": on("a6") - 0.3},
           {"shot": "s_formules", "r": [17, 334, 356, 101], "t0": p.w("a6", "les") - 0.1, "t1": on("a7") - 0.2}],
    "pulses": [{"id": "tExp", "t": on("a5") + 0.05}, {"id": "tExp", "t": p.w("a5", "dès")}, {"id": "tConf", "t": on("a6")},
               {"id": "tConf", "t": p.w("a6", "dès")}, {"id": "t7j", "t": on("a7")}, {"id": "tBdx", "t": p.w("a7", "bordeaux")}],
    "counts": [{"id": "nExp", "t": p.w("a5", "dès"), "to": 50}, {"id": "nConf", "t": p.w("a6", "dès"), "to": 90}],
    "x": {"e1": p.w("a1", "miettes"), "e2": p.w("a1", "poils"), "e3": p.w("a1", "taches"), "clean": p.w("a2", "mieux"),
          "notif": on("a3") + 0.25, "avant": p.w("a4", "preuve"), "apres": p.w("a4", "image"), "seamOut": on("a5") - 0.3},
    "captions": [cap(on("a1") - 0.15, on("a2") - 0.4, "Miettes, poils,", "taches…"),
                 cap(on("a2") - 0.1, on("a3") - 0.35, "Votre voiture", "mérite mieux."),
                 cap(on("a3") - 0.1, p.w("a3", "on") - 0.4, "Avec", "SublimNet,"),
                 cap(p.w("a3", "on") - 0.05, on("a4") - 0.35, "On vient", "chez vous."),
                 cap(on("a4") - 0.1, on("a5") - 0.35, "La preuve", "en image."),
                 cap(on("a5") - 0.1, on("a6") - 0.35, "Express", "dès 50 €."),
                 cap(on("a6") - 0.1, on("a7") - 0.35, "Confort", "dès 90 €."),
                 cap(on("a7") - 0.1, on("a8") - 0.55, "7j/7,", "à Bordeaux.")],
    "endcard": {"tag": "Votre voiture, comme neuve.", "sub": "NETTOYAGE AUTO À DOMICILE · BORDEAUX"},
}
A["end"] = endblock(p, "a8")
A["sfx"] = sfx_common(A, {"bubble": [A["x"]["e1"], A["x"]["e2"], A["x"]["e3"]] + [c["t"] + 0.5 for c in A["counts"]],
                          "shimmer": [A["x"]["clean"]], "ding": [A["x"]["notif"]], "tap": [h["t0"] + 0.15 for h in A["hl"]]})

# ------------------------------------------------------------------ B
p = Plan("B", ["b1", "b2", "b3", "b4", "b5", "b6", "b7"], {"b2": 0.6, "b3": 0.5, "b4": 0.5, "b5": 0.5, "b6": 0.55, "b7": 0.6})
on = p.on
phoneOn = on("b2") - 0.5
B = {
    "fps": 30, "duration": p.duration, "vo": p.vo(),
    "music": {"bpm": 96, "prog": [[48, 55, 60, 64, 67, 74], [45, 57, 60, 64, 67, 72], [41, 53, 57, 60, 64, 67], [43, 55, 59, 62, 67, 71]]},
    "camStart": START,
    "cam": [mv(0, 2.0, {"cx": 1114, "cy": 330, "s": 1.05, "rx": 10, "rz": -4, "ay": 880}),
            mv(on("b2") - 0.5, on("b2") + 0.2, LEFT_UP), mv(on("b3") - 0.45, on("b3") + 0.25, RIGHT_UP),
            mv(on("b4") - 0.45, on("b4") + 0.25, LEFT_LOW), mv(on("b5") - 0.45, on("b5") + 0.25, RIGHT_LOW),
            mv(on("b6") - 0.5, on("b6") + 0.3, {"cx": 1114, "cy": 1400, "s": 1.15, "rx": 7, "rz": -2, "ay": 1150})],
    "phoneOn": phoneOn,
    "shotList": [{"id": "s_canape", "kind": "cover"}, {"id": "s_matelas", "kind": "cover"}, {"id": "s_formules", "kind": "cover"},
                 {"id": "s_distance", "kind": "cover"}, {"id": "recap", "kind": "recap"}],
    "shots": [{"id": "s_canape", "t": phoneOn}, {"id": "s_matelas", "t": on("b3") - 0.3}, {"id": "s_formules", "t": on("b4") - 0.3},
              {"id": "s_distance", "t": on("b5") - 0.3}, {"id": "recap", "t": on("b6") - 0.3}],
    "hl": [{"shot": "s_canape", "r": [17, 172, 171, 78], "t0": p.w("b2", "dès") - 0.1, "t1": on("b3") - 0.35},
           {"shot": "s_matelas", "r": [17, 319, 171, 77], "t0": p.w("b3", "dès") - 0.1, "t1": on("b4") - 0.35},
           {"shot": "s_formules", "r": [17, 87, 356, 102], "t0": p.w("b4", "dès") - 0.1, "t1": on("b5") - 0.35},
           {"shot": "s_distance", "r": [17, 195, 360, 67], "t0": p.w("b5", "offert") - 0.1, "t1": on("b6") - 0.35},
           {"shot": "recap", "r": [30, 270, 332, 44], "t0": p.w("b6", "total") - 0.1, "t1": on("b7") - 0.5}],
    "pulses": [{"id": "tCan", "t": p.w("b2", "canapé")}, {"id": "tMat", "t": p.w("b3", "matelas")}, {"id": "tAuto", "t": p.w("b4", "voiture")},
               {"id": "tDep", "t": p.w("b5", "offert")}, {"id": "tTot", "t": p.w("b6", "total")}],
    "counts": [{"id": "nCan", "t": p.w("b2", "dès"), "to": 40}, {"id": "nMat", "t": p.w("b3", "dès"), "to": 35},
               {"id": "nAuto", "t": p.w("b4", "dès"), "to": 45}, {"id": "nKm", "t": p.w("b5", "vingt") - 0.2, "to": 20}],
    "x": {"type": [on("b1") + 0.1, on("b1") + 1.5], "wob": [on("b1"), on("b2") - 0.2]},
    "captions": [cap(on("b1") - 0.15, p.w("b1", "combien") - 0.4, "Nettoyage", "à domicile :"),
                 cap(p.w("b1", "combien") - 0.05, on("b2") - 0.4, "Combien", "ça coûte ?"),
                 cap(on("b2") - 0.1, on("b3") - 0.35, "Canapé", "dès 40 €."),
                 cap(on("b3") - 0.1, on("b4") - 0.35, "Matelas", "dès 35 €."),
                 cap(on("b4") - 0.1, on("b5") - 0.35, "Voiture", "dès 45 €."),
                 cap(on("b5") - 0.1, on("b6") - 0.35, "Déplacement", "offert."),
                 cap(on("b6") - 0.1, on("b7") - 0.55, "Zéro", "surprise.")],
    "endcard": {"tag": "Les prix, sans surprise."},
}
B["end"] = endblock(p, "b7")
B["sfx"] = sfx_common(B, {"keysSearch": [B["x"]["type"][0], B["x"]["type"][1], 21], "bubble": [c["t"] + 0.55 for c in B["counts"]],
                          "tap": [h["t0"] + 0.15 for h in B["hl"]]})

# ------------------------------------------------------------------ C
p = Plan("C", ["c1", "c2", "c3", "c4", "c5", "c6", "c7", "c8"], {"c2": 0.55, "c3": 0.5, "c4": 0.5, "c5": 0.55, "c6": 0.55, "c7": 0.6, "c8": 0.45})
on = p.on
phoneOn = on("c5") - 0.5
mins = p.w("c6", "minute")
C = {
    "fps": 30, "duration": p.duration, "vo": p.vo(),
    "music": {"bpm": 100, "prog": [[43, 55, 59, 62, 66, 69], [42, 54, 57, 62, 66, 69], [40, 52, 55, 59, 62, 66], [45, 57, 62, 64, 69, 71]]},
    "camStart": START,
    "cam": [mv(0, 1.9, {"focus": "msgs", "s": 1.15, "rx": 9, "rz": -3, "ay": 900}),
            mv(on("c2") - 0.45, on("c2") + 0.25, {"focus": "r1", "s": 1.45, "rx": 8, "rz": -3, "ay": 960}),
            mv(on("c3") - 0.45, on("c3") + 0.25, {"focus": "r2", "s": 1.45, "rx": 8, "rz": -3, "ay": 960}),
            mv(on("c4") - 0.45, on("c4") + 0.25, {"focus": "r3", "s": 1.45, "rx": 8, "rz": -3, "ay": 960}),
            mv(on("c5") - 0.5, on("c5") + 0.25, LEFT_UP), mv(on("c6") - 0.45, on("c6") + 0.25, RIGHT_UP),
            mv(mins - 0.7, mins + 0.05, {"cx": 1114, "cy": 1420, "s": 1.3, "rx": 6, "rz": -2, "ay": 1150})],
    "phoneOn": phoneOn,
    "shotList": [{"id": "s_hero", "kind": "hero"}, {"id": "s_service", "kind": "cover"}],
    "shots": [{"id": "s_hero", "t": phoneOn}, {"id": "s_service", "t": on("c6") - 0.3}],
    "taps": [{"t": p.w("c6", "réservez") + 0.1, "x": 286, "y": 342}],
    "sheet": {"t0": mins - 0.4, "t1": mins - 0.05, "check": mins - 0.25, "sub": "Merci, à très vite !",
              "rows": [["Prestation", "Canapé · 3 places"], ["Créneau", "Dim. · 14:30"], ["Adresse", "Bordeaux"]]},
    "pulses": [{"id": "r1", "t": p.w("c2", "on")}, {"id": "r2", "t": p.w("c3", "cinq")}, {"id": "r3", "t": p.w("c4", "sept")},
               {"id": "r4", "t": p.w("c5", "offert")}, {"id": "r5", "t": p.w("c6", "réservez")}],
    "x": {"mb1": 0.3, "mb2": p.w("c1", "sublimnet"), "stars": p.w("c3", "cinq")},
    "captions": [cap(on("c1") - 0.15, on("c2") - 0.4, "Pourquoi", "SublimNet ?"),
                 cap(on("c2") - 0.1, on("c3") - 0.35, "1. On vient", "chez vous."),
                 cap(on("c3") - 0.1, on("c4") - 0.35, "2. Cinq étoiles", "sur Google."),
                 cap(on("c4") - 0.1, on("c5") - 0.35, "3. Sept jours", "sur sept."),
                 cap(on("c5") - 0.1, on("c6") - 0.35, "4. Déplacement", "offert."),
                 cap(on("c6") - 0.1, on("c7") - 0.55, "5. Réservé", "en une minute.")],
    "endcard": {"tag": "Sublime, et net."},
}
C["end"] = endblock(p, "c8", tag_t=p.w("c7", "sublime"), btn_t=on("c8"), bar_t=on("c8") - 0.1)
C["end"]["blur"] = [on("c7") - 0.5, on("c7") + 0.1]
C["end"]["logo"] = [on("c7") - 0.2, on("c7") + 0.7]
C["sfx"] = sfx_common(C, {"ding": [C["x"]["mb1"], C["x"]["mb2"]], "tap": [C["taps"][0]["t"]], "success": [C["sheet"]["check"]],
                          "bubble": [x["t"] + 0.1 for x in C["pulses"][:4]]})

for name, d in (("tA.json", A), ("tB.json", B), ("tC.json", C)):
    json.dump(d, open(f"{HERE}/{name}", "w"), ensure_ascii=False, indent=1)
    print(name, "durée", d["duration"], "s")
