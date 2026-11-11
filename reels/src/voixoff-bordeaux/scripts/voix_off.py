import sys, json, numpy as np, soundfile as sf
from kokoro_onnx import Kokoro
M=sys.argv[1]; OUT=sys.argv[2]
k = Kokoro(M+"/kokoro-v1.0.onnx", M+"/voices-v1.0.bin")
lines = [
 ("l01","Samedi, dix heures. À Bordeaux."),
 ("l02","Le canapé a pris cher… et la voiture aussi."),
 ("l03","Vous tapez SublimNet."),
 ("l04","Le site s'ouvre."),
 ("l05","Vous choisissez : auto, canapé, ou matelas."),
 ("l06","Votre adresse à Bordeaux : le déplacement est offert."),
 ("l07","Vous choisissez votre créneau."),
 ("l08","Vous confirmez. Et c'est réservé."),
 ("l09","Une minute suffit. On vient chez vous."),
 ("l10","SublimNet. Réservez en ligne, sur Sublim Net point com."),
]
info={}
for key,txt in lines:
    ph = k.tokenizer.phonemize(txt, "fr-fr")
    s, sr = k.create(txt, voice="ff_siwis", speed=float(sys.argv[3]), lang="fr-fr")
    # trim silence
    a = np.abs(s); thr = 0.01
    idx = np.where(a>thr)[0]
    s = s[max(0,idx[0]-int(0.03*sr)) : min(len(s), idx[-1]+int(0.08*sr))]
    sf.write(f"{OUT}/{key}.wav", s, sr)
    info[key]=round(len(s)/sr,3)
    print(key, info[key], "|", ph)
json.dump(info, open(f"{OUT}/durations.json","w"), indent=1)
print("total", sum(info.values()))
