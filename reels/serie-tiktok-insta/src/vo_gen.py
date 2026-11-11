"""Génère des voix off ElevenLabs phrase par phrase, avec horodatage des mots.
usage: python3 vo_gen.py vo_lines.json <reel A|B|C> <outdir> <voice_id> [model]
"""
import base64, json, os, subprocess, sys, urllib.error, urllib.request
lines_f, reel, out, voice = sys.argv[1:5]
model = sys.argv[5] if len(sys.argv) > 5 else "eleven_v4"
lines = json.load(open(lines_f))[reel]
os.makedirs(out, exist_ok=True)
meta = {}
for i, (k, text) in enumerate(lines):
    body = {"text": text, "model_id": model,
            "voice_settings": {"stability": 0.5, "similarity_boost": 0.75, "style": 0.0, "use_speaker_boost": True}}
    if i > 0: body["previous_text"] = lines[i - 1][1]
    if i + 1 < len(lines): body["next_text"] = lines[i + 1][1]
    req = urllib.request.Request(f"https://api.elevenlabs.io/v1/text-to-speech/{voice}/with-timestamps?output_format=mp3_44100_128",
                                 data=json.dumps(body).encode(), headers={"Content-Type": "application/json"}, method="POST")
    try:
        r = json.load(urllib.request.urlopen(req, timeout=120))
    except urllib.error.HTTPError as e:
        sys.exit(f"{k}: ElevenLabs {e.code} {e.read()[:300]}")
    open(f"{out}/{k}.mp3", "wb").write(base64.b64decode(r["audio_base64"]))
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", f"{out}/{k}.mp3", "-ac", "1", "-ar", "48000", f"{out}/{k}.wav"], check=True)
    al = r["alignment"]; words = []; cur = ""; s = e = None
    for c, a, b in zip(al["characters"], al["character_start_times_seconds"], al["character_end_times_seconds"]):
        if c.isspace():
            if cur: words.append([cur, round(s, 3), round(e, 3)]); cur = ""
            continue
        if not cur: s = a
        cur += c; e = b
    if cur: words.append([cur, round(s, 3), round(e, 3)])
    meta[k] = {"text": text, "words": words}
    print(k, words[0][1], words[-1][2], " ".join(f"{w}@{a:.2f}" for w, a, _ in words))
json.dump(meta, open(f"{out}/words.json", "w"), ensure_ascii=False, indent=1)
