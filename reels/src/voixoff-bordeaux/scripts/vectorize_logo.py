import sys, numpy as np, potrace
from PIL import Image, ImageFilter
src, out = sys.argv[1], sys.argv[2]
im = np.asarray(Image.open(src).convert("RGB")).astype(float)
H, W, _ = im.shape
# background: smooth plane fitted on border pixels
ys, xs = np.mgrid[0:H, 0:W]
border = np.zeros((H, W), bool); border[:4,:]=border[-4:,:]=border[:,:4]=border[:,-4:]=True
A = np.c_[xs[border], ys[border], np.ones(border.sum())]
bg = np.zeros_like(im)
for c in range(3):
    coef, *_ = np.linalg.lstsq(A, im[...,c][border], rcond=None)
    bg[...,c] = coef[0]*xs + coef[1]*ys + coef[2]
d = (bg - im).max(axis=2)
alpha = np.clip(d / 150.0, 0, 1)
# column colours of solid ink
solid = alpha > 0.85
cols = []
for x in range(W):
    m = solid[:, x]
    if m.sum() >= 2: cols.append((x, im[m, x].mean(axis=0)))
xs_ink = np.array([c[0] for c in cols]); x0, x1 = xs_ink.min(), xs_ink.max()
# gradient stops (smoothed)
stops = []
for f in np.linspace(0, 1, 11):
    cx = x0 + f*(x1-x0)
    sel = [c for x, c in cols if abs(x-cx) <= (x1-x0)*0.06]
    c = np.mean(sel, axis=0)
    stops.append((f, "#%02x%02x%02x" % tuple(int(v) for v in c)))
print(stops)
# upscale alpha and trace
S = 8
a_img = Image.fromarray((alpha*255).astype(np.uint8)).resize((W*S, H*S), Image.BICUBIC).filter(ImageFilter.GaussianBlur(S*0.6))
bm = np.asarray(a_img) > 120
path = potrace.Bitmap(~bm).trace(turdsize=20, alphamax=1.0, opticurve=True, opttolerance=0.3)
parts = []
for curve in path:
    s = curve.start_point; d_ = [f"M{s.x:.1f},{s.y:.1f}"]
    for seg in curve.segments:
        if seg.is_corner:
            d_.append(f"L{seg.c.x:.1f},{seg.c.y:.1f}L{seg.end_point.x:.1f},{seg.end_point.y:.1f}")
        else:
            d_.append(f"C{seg.c1.x:.1f},{seg.c1.y:.1f} {seg.c2.x:.1f},{seg.c2.y:.1f} {seg.end_point.x:.1f},{seg.end_point.y:.1f}")
    parts.append("".join(d_) + "Z")
# bbox of ink
yy, xx = np.where(bm)
bx0, by0, bx1, by1 = xx.min()-S*2, yy.min()-S*2, xx.max()+S*2, yy.max()+S*2
gx0, gx1 = x0*S, x1*S
svg = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="{bx0} {by0} {bx1-bx0} {by1-by0}">
<defs><linearGradient id="g" gradientUnits="userSpaceOnUse" x1="{gx0}" y1="0" x2="{gx1}" y2="0">
{''.join(f'<stop offset="{f:.2f}" stop-color="{c}"/>' for f,c in stops)}
</linearGradient></defs>
<path fill="url(#g)" fill-rule="evenodd" d="{' '.join(parts)}"/></svg>'''
open(out, "w").write(svg)
print("paths", len(parts), "viewBox", bx1-bx0, by1-by0)
