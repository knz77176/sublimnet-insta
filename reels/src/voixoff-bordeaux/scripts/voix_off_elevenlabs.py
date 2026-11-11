"""Voix off ElevenLabs pour le reel SublimNet.

usage: python3 voix_off_elevenlabs.py <dossier_sortie> [voice_id] [model_id]

La clé API n'est jamais lue ici : dans la session cloud, le proxy réseau ajoute
l'en-tête xi-api-key aux requêtes vers api.elevenlabs.io. En local, exporter
ELEVENLABS_API_KEY.
Chaque phrase est générée séparément (une piste par phrase) avec les
horodatages par caractère, pour caler l'animation sur la voix.
"""
import base64, json, os, sys, urllib.request

OUT = sys.argv[1]
VOICE = sys.argv[2] if len(sys.argv) > 2 else os.environ.get("ELEVENLABS_VOICE_ID", "")
MODEL = sys.argv[3] if len(sys.argv) > 3 else "eleven_multilingual_v2"
API = "https://api.elevenlabs.io/v1"

LINES = [
    ("l01", "Samedi, dix heures. À Bordeaux."),
    ("l02", "Le canapé a pris cher… et la voiture aussi."),
    ("l03", "Vous tapez SublimNet."),
    ("l04", "Le site s'ouvre."),
    ("l05", "Vous choisissez : auto, canapé, ou matelas."),
    ("l06", "Votre adresse à Bordeaux : le déplacement est offert."),
    ("l07", "Vous choisissez votre créneau."),
    ("l08", "Vous confirmez. Et c'est réservé."),
    ("l09", "Une minute suffit. On vient chez vous."),
    ("l10", "SublimNet. Réservez en ligne, sur sublimnet point com."),
]


def call(path, body=None):
    headers = {"Content-Type": "application/json", "Accept": "application/json"}
    if os.environ.get("ELEVENLABS_API_KEY"):
        headers["xi-api-key"] = os.environ["ELEVENLABS_API_KEY"]
    data = json.dumps(body).encode() if body is not None else None
    req = urllib.request.Request(API + path, data=data, headers=headers, method="POST" if data else "GET")
    with urllib.request.urlopen(req, timeout=120) as r:
        return json.load(r)


def main():
    if not VOICE:
        sys.exit("voice_id manquant")
    os.makedirs(OUT, exist_ok=True)
    meta = {}
    prev = None
    for i, (key, text) in enumerate(LINES):
        body = {
            "text": text,
            "model_id": MODEL,
            "voice_settings": {"stability": 0.45, "similarity_boost": 0.8, "style": 0.25, "use_speaker_boost": True},
        }
        # continuité d'intonation entre les phrases
        if i > 0:
            body["previous_text"] = LINES[i - 1][1]
        if i + 1 < len(LINES):
            body["next_text"] = LINES[i + 1][1]
        r = call(f"/text-to-speech/{VOICE}/with-timestamps?output_format=mp3_44100_192", body)
        with open(f"{OUT}/{key}.mp3", "wb") as f:
            f.write(base64.b64decode(r["audio_base64"]))
        meta[key] = {"text": text, "alignment": r.get("alignment")}
        print(key, "ok")
    json.dump(meta, open(f"{OUT}/alignment.json", "w"), ensure_ascii=False, indent=1)


if __name__ == "__main__":
    main()
