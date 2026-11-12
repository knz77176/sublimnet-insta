"""Recale les couleurs des vidéos du tapis sur le rendu iPhone (captures fournies).
Couleurs ajustées par un polynôme RVB de degré 3 (grade_iphone.json), ajusté sur la 1re image de chaque vidéo
face à la capture d'écran iPhone correspondante. usage: python3 grade_clips.py <dossier_images_av> <dossier_images_ap>"""
import sys, json, glob, os
import numpy as np
from PIL import Image
CF = json.load(open(os.path.join(os.path.dirname(os.path.abspath(__file__)), "grade_iphone.json")))
def feats(x):
    r, g, b = x[:, 0], x[:, 1], x[:, 2]
    return np.stack([np.ones_like(r), r, g, b, r*r, g*g, b*b, r*g, r*b, g*b, r**3, g**3, b**3, r*r*g, r*r*b, g*g*r, g*g*b, b*b*r, b*b*g, r*g*b], 1)
v = np.arange(256, dtype=np.float32) / 255
G, B = np.meshgrid(v, v, indexing="ij"); gb = np.stack([G.ravel(), B.ravel()], 1)
for key, d in zip(("av", "ap"), sys.argv[1:3]):
    M = np.asarray(CF[key], np.float32); lut = np.zeros((256, 256, 256, 3), np.uint8)
    for r in range(256):
        x = np.concatenate([np.full((gb.shape[0], 1), v[r], np.float32), gb], 1)
        lut[r] = (np.clip(feats(x) @ M, 0, 1) * 255 + 0.5).astype(np.uint8).reshape(256, 256, 3)
    for f in sorted(glob.glob(f"{d}/*.jpg")):
        a = np.asarray(Image.open(f).convert("RGB")); Image.fromarray(lut[a[..., 0], a[..., 1], a[..., 2]]).save(f, quality=95)
