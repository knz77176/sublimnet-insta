"""Génère les textures macro avant/après (1080x1920) pour le montage SublimNet."""
import numpy as np, sys
from PIL import Image, ImageFilter, ImageDraw
OUT = sys.argv[1]
W, H = 1080, 1920
rng = np.random.default_rng(7)

def up(a, w=W, h=H):
    im = Image.fromarray(((a - a.min()) / (np.ptp(a) + 1e-9) * 255).astype(np.uint8))
    return np.asarray(im.resize((w, h), Image.BICUBIC), dtype=np.float32) / 255

def fbm(scale, oct=5, w=W, h=H, seed=None):
    r = np.random.default_rng(seed) if seed is not None else rng
    out = np.zeros((h, w), np.float32); amp = 1; tot = 0
    for o in range(oct):
        s = scale * 2 ** o
        gw, gh = max(2, int(w / W * s)), max(2, int(h / W * s))
        out += amp * up(r.random((gh, gw)), w, h); tot += amp; amp *= 0.5
    return out / tot

def macro_dof(img):
    """flou de profondeur de champ type macro : net au centre, flou en haut/bas"""
    pil = Image.fromarray(np.clip(img, 0, 255).astype(np.uint8))
    blur = np.asarray(pil.filter(ImageFilter.GaussianBlur(14)), np.float32)
    y = np.linspace(-1, 1, H)[:, None]
    m = np.clip((np.abs(y) - 0.32) / 0.55, 0, 1) ** 1.4
    return img * (1 - m[..., None]) + blur * m[..., None]

def stain(mask_scale, cx, cy, r, seed, rim=True):
    yy, xx = np.mgrid[0:H, 0:W].astype(np.float32)
    d = np.sqrt(((xx - cx) / r) ** 2 + ((yy - cy) / (r * 0.85)) ** 2)
    n = fbm(mask_scale, 4, seed=seed)
    d = d + (n - 0.5) * 0.9
    body = np.clip((1 - d) * 3.5, 0, 1)
    if rim:
        ring = np.exp(-((d - 0.95) ** 2) / 0.004) * 0.9
        body = np.clip(body * 0.7 + ring, 0, 1)
    return body

def apply_stain(img, m, color, strength):
    c = np.array(color, np.float32)
    mult = 1 - m[..., None] * strength * (1 - c / 255)
    return img * mult

def grime(img, amt, seed, tint=(120, 95, 70)):
    g = fbm(3, 5, seed=seed)
    g = np.clip((g - 0.35) * 1.8, 0, 1) * amt
    t = np.array(tint, np.float32) / 255
    return img * (1 - g[..., None] * (1 - t))

def save(img, name):
    Image.fromarray(np.clip(img, 0, 255).astype(np.uint8)).save(f"{OUT}/{name}.jpg", quality=90)

yy, xx = np.mgrid[0:H, 0:W].astype(np.float32)

# ---------- VELOURS BEIGE (canapé) ----------
base = np.array([196, 170, 136], np.float32)
sheen = fbm(2.5, 5, seed=1)
pile = up(rng.random((H // 3, W // 2)))  # grain fin
streak = up(rng.random((60, 900)))  # traînées de poil couché
lum = 0.72 + 0.55 * (sheen - 0.5) + 0.10 * (pile - 0.5) + 0.12 * (streak - 0.5)
# couture de coussin
seam_y = H * 0.58 + 70 * np.sin(xx / W * 2.2 + 0.4)
dd = yy - seam_y
lum *= 1 - 0.55 * np.exp(-(dd ** 2) / 300) 
lum *= 1 + 0.18 * np.exp(-((dd + 28) ** 2) / 900) + 0.14 * np.exp(-((dd - 30) ** 2) / 900)
lum *= 0.9 + 0.2 * (1 - np.abs(yy / H - 0.45))
velvet = base * lum[..., None]
velvet = macro_dof(velvet)
save(velvet, "canape_clean")
d = grime(velvet.copy(), 0.55, 11)
d = apply_stain(d, stain(3, 420, 760, 240, 21), (90, 20, 70), 0.85)   # jus de raisin
d = apply_stain(d, stain(4, 760, 1180, 150, 22), (80, 30, 60), 0.75)
d = apply_stain(d, stain(3, 300, 1350, 120, 23), (110, 70, 40), 0.6)   # café
# poils de chat
pil = Image.fromarray(np.clip(d, 0, 255).astype(np.uint8)); dr = ImageDraw.Draw(pil)
for i in range(70):
    x0, y0 = rng.uniform(80, 1000), rng.uniform(450, 1500); a = rng.uniform(0, 6.28); L = rng.uniform(30, 80)
    pts = [(x0 + np.cos(a + k * 0.04) * k * L / 10, y0 + np.sin(a + k * 0.04) * k * L / 10) for k in range(11)]
    dr.line(pts, fill=(235, 228, 215), width=2)
d = np.asarray(pil, np.float32)
save(macro_dof(d * 0.97), "canape_dirty")

# ---------- MATELAS MATELASSÉ ----------
P = 210
u = (xx + yy * 0.9) / P; v = (xx - yy * 0.9) / P
fu, fv = u - np.floor(u), v - np.floor(v)
h = np.sin(np.pi * fu) * np.sin(np.pi * fv)
gy, gx = np.gradient(h)
light = 0.70 + 9.0 * (-gx * 0.6 - gy * 0.8) + 0.38 * h
seam = np.exp(-(np.minimum(fu, 1 - fu) ** 2) / 0.004) + np.exp(-(np.minimum(fv, 1 - fv) ** 2) / 0.004)
light *= 1 - 0.22 * np.clip(seam, 0, 1)
stitch = ((np.sin(u * 80) > 0.6) & (np.minimum(fv, 1 - fv) < 0.012)) | ((np.sin(v * 80) > 0.6) & (np.minimum(fu, 1 - fu) < 0.012))
light = np.where(stitch, light * 0.75, light)
weave = 0.04 * (up(rng.random((H // 2, W // 2))) - 0.5)
mat = np.array([238, 236, 232], np.float32) * (light + weave)[..., None]
mat = macro_dof(mat)
save(mat, "matelas_clean")
d = grime(mat.copy(), 0.45, 31, (170, 150, 110))
d = apply_stain(d, stain(2.5, 560, 820, 330, 41), (200, 160, 70), 0.7)   # auréole jaune
d = apply_stain(d, stain(3, 330, 1260, 170, 42), (190, 140, 80), 0.6)
d = apply_stain(d, stain(5, 800, 1380, 90, 43), (120, 90, 70), 0.5)
save(macro_dof(d), "matelas_dirty")

# ---------- TAPIS BERBÈRE ----------
loops = np.sin(xx * 0.55) * np.sin(yy * 0.55 + np.sin(xx * 0.05)) 
fib = up(rng.random((H // 2, W // 2)))
P2 = 300
a1 = ((xx + yy * 0.62) / P2) % 1; a2 = ((xx - yy * 0.62) / P2) % 1
dl = np.minimum(np.minimum(a1, 1 - a1), np.minimum(a2, 1 - a2))
dia = np.clip(1 - (dl - 0.035) / 0.02, 0, 1) * (0.75 + 0.25 * fbm(6, 3, seed=4))
cream = np.array([232, 224, 206], np.float32); terra = np.array([62, 48, 40], np.float32)
col = cream * (1 - dia[..., None]) + terra * dia[..., None]
lum = 0.82 + 0.16 * loops + 0.22 * (fib - 0.5) + 0.25 * (fbm(2, 4, seed=5) - 0.5)
rug = macro_dof(col * lum[..., None])
save(rug, "tapis_clean")
d = grime(rug.copy(), 0.75, 51, (95, 80, 65))
d = apply_stain(d, stain(3, 600, 950, 260, 61), (70, 55, 40), 0.75)   # boue
d = apply_stain(d, stain(4, 300, 600, 140, 62), (60, 50, 45), 0.6)
lane = np.exp(-((xx - 540 - 120 * np.sin(yy / 500)) ** 2) / 60000)
d = d * (1 - 0.35 * lane[..., None])
save(macro_dof(d), "tapis_dirty")

# ---------- SIÈGE AUTO (tissu anthracite) ----------
weave = np.sin(xx * 1.4) * np.sin(yy * 1.4) + 0.5 * np.sin((xx + yy) * 0.7)
fleck = (rng.random((H, W)) > 0.985).astype(np.float32)
fleck = np.asarray(Image.fromarray((fleck * 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(0.8)), np.float32) / 255
lum = 0.75 + 0.12 * weave + 0.35 * (fbm(2, 4, seed=8) - 0.5)
# panneaux cousus (bandes verticales type siège)
px = (xx / 300 + 0.15 * np.sin(yy / 400)) % 1
panel = 0.75 + 0.35 * np.sin(np.pi * px) ** 0.6
seamc = np.exp(-(np.minimum(px, 1 - px) ** 2) / 0.0006)
lum = lum * panel * (1 - 0.5 * seamc)
seatcol = np.array([66, 68, 76], np.float32) + fleck[..., None] * np.array([60, 70, 110], np.float32)
seat = macro_dof(seatcol * lum[..., None] * 1.25)
save(seat, "siege_clean")
d = grime(seat.copy(), 0.4, 71, (150, 120, 90))
d = d + stain(3, 520, 900, 230, 81, rim=True)[..., None] * np.array([38, 28, 14], np.float32)  # auréole claire (café séché)
crumbs = (rng.random((H, W)) > 0.9993).astype(np.float32)
crumbs = np.asarray(Image.fromarray((crumbs * 255).astype(np.uint8)).filter(ImageFilter.MaxFilter(5)).filter(ImageFilter.GaussianBlur(1.2)), np.float32) / 255
crumbs *= np.exp(-((yy - 1000) / 650) ** 4)
d = d * (1 - crumbs[..., None]) + crumbs[..., None] * np.array([200, 170, 120], np.float32)
save(macro_dof(d), "siege_dirty")

# ---------- PHARE ----------
# carrosserie sombre métallisée avec reflets
body = np.array([22, 26, 34], np.float32) * (0.7 + 0.6 * fbm(1.2, 3, seed=9))[..., None]
body += (np.exp(-((yy - 420 - 0.35 * xx) ** 2) / 9000) * 60)[..., None]
body += (np.exp(-((yy - 1560 + 0.2 * xx) ** 2) / 4000) * 35)[..., None]
cx, cy, RX, RY = 540, 960, 430, 250
ex = (xx - cx) / RX; ey = (yy - cy) / RY
# forme de phare biseautée (superellipse inclinée)
e = (np.abs(ex) ** 2.6 + np.abs(ey + 0.25 * ex) ** 2.6)
lens = np.clip((1 - e) * 40, 0, 1)
inner = np.zeros((H, W, 3), np.float32) + np.array([28, 30, 36], np.float32)
# cuvette chromée avec stries
r1 = np.sqrt((xx - 380) ** 2 + (yy - 990) ** 2)
bowl = np.clip(1 - r1 / 230, 0, 1)
inner += (bowl ** 0.6 * (120 + 60 * np.cos(r1 / 9)))[..., None] * np.array([1, 1, 1.06])
# lentille projecteur (boule de verre)
r2 = np.sqrt((xx - 380) ** 2 + (yy - 990) ** 2)
ball = np.clip((105 - r2) / 4, 0, 1)
inner = inner * (1 - ball[..., None]) + ball[..., None] * np.array([12, 14, 20], np.float32)
inner += (np.exp(-(((xx - 350) / 38) ** 2 + ((yy - 950) / 26) ** 2)) * 255)[..., None]
inner += (np.exp(-(((xx - 410) / 70) ** 2 + ((yy - 1040) / 14) ** 2)) * 120)[..., None]
# second module
r3 = np.sqrt((xx - 690) ** 2 + (yy - 920) ** 2)
inner += (np.clip(1 - r3 / 120, 0, 1) ** 0.7 * (110 + 70 * np.cos(r3 / 6)))[..., None]
inner += (np.exp(-(r3 / 22) ** 2) * 255)[..., None]
# LED en L
led = np.exp(-((yy - (1150 - 0.18 * (xx - 540))) ** 2) / 90) * ((xx > 200) & (xx < 860))
led += np.exp(-((xx - 860) ** 2) / 90) * ((yy > 840) & (yy < 1110))
inner += (np.clip(led, 0, 1) * 255)[..., None] * np.array([0.92, 0.97, 1.0])
inner += (np.exp(-((yy - (1150 - 0.18 * (xx - 540))) ** 2) / 2500) * ((xx > 200) & (xx < 860)) * 90)[..., None] * np.array([0.7, 0.85, 1.0])
# reflet de vitre
spec = np.exp(-(((xx - 300) / 300) ** 2 + ((yy - 790 + 0.2 * (xx - 300)) / 26) ** 2)) * 150
clean = body * (1 - lens[..., None]) + np.clip(inner, 0, 255) * lens[..., None] + (spec * lens)[..., None]
rim = np.exp(-((e - 1) ** 2) / 0.003) * 110
clean += rim[..., None]
save(clean, "phare_clean")
haze = np.asarray(Image.fromarray(np.clip(inner, 0, 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(9)), np.float32)
ox = fbm(5, 4, seed=12)
cracks = (np.abs(np.sin(xx * 0.09 + ox * 18) * np.sin(yy * 0.05 + ox * 12)) < 0.03).astype(np.float32) * 0.22
yel = haze * np.array([0.95, 0.78, 0.42]) * 0.62 + np.array([95, 72, 22]) * (0.7 + 0.6 * ox)[..., None]
yel *= (1 - cracks)[..., None] * 0.95 + 0.05
dirty = body * (1 - lens[..., None]) + yel * lens[..., None] + rim[..., None] * 0.4
dirty = apply_stain(dirty, stain(4, 600, 1100, 130, 13), (120, 100, 70), 0.35)
save(dirty, "phare_dirty")

# ---------- GRAIN ----------
for i in range(4):
    n = rng.normal(128, 38, (960, 540)).clip(0, 255).astype(np.uint8)
    Image.fromarray(n).save(f"{OUT}/grain{i}.png")
print("done")
