"""Builds the 360 Biz Health SVG logo (src/assets/brand/*.svg) from Inter glyph outlines, matching the
geometry measured from the brand PDF (page 1, primary logo)."""
import sys
from fontTools.ttLib import TTFont
from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.pens.transformPen import TransformPen
from fontTools.pens.boundsPen import BoundsPen

FD = sys.argv[1]
OUT = sys.argv[2]
bold = TTFont(f"{FD}/inter-latin-700-normal.woff2")
reg = TTFont(f"{FD}/inter-latin-400-normal.woff2")

def glyph_bounds(font, ch):
    gs = font.getGlyphSet(); name = font.getBestCmap()[ord(ch)]
    bp = BoundsPen(gs); gs[name].draw(bp); return bp.bounds, gs[name].width

def text_path(font, text, x0, baseline, scale, tracking=0.0):
    gs = font.getGlyphSet(); cmap = font.getBestCmap()
    pen = SVGPathPen(gs)
    x = x0
    for ch in text:
        name = cmap[ord(ch)]
        tp = TransformPen(pen, (scale, 0, 0, -scale, x, baseline))
        gs[name].draw(tp)
        x += gs[name].width * scale + tracking
    return pen.getCommands(), x

# measured target geometry (PDF raster @100dpi)
(b3, adv3) = glyph_bounds(bold, "3")
cap_h = 352.0
s1 = cap_h / (b3[3] - b3[1])
base1 = 174 + b3[3] * s1          # top of "3" at y=174
x_three = 166 - b3[0] * s1
d36, xend = text_path(bold, "36", x_three, base1, s1, 8.0)
(b6, adv6) = glyph_bounds(bold, "6")
six_right = x_three + adv3 * s1 + b6[2] * s1
print("six right", six_right, "(target 740)")

(bB, _) = glyph_bounds(reg, "B")
s2 = 154.0 / (bB[3] - bB[1])
base2 = 578 + bB[3] * s2
xB = 163 - bB[0] * s2
# fit "Biz Health" width to measured 969 with tracking
gs = reg.getGlyphSet(); cmap = reg.getBestCmap()
txt = "Biz Health"
natural = sum(gs[cmap[ord(c)]].width for c in txt[:-1]) * s2
(bh, _) = glyph_bounds(reg, "h")
natural_w = natural + bh[2] * s2 - bB[0] * s2
track = (969 - natural_w) / (len(txt) - 1)
print("biz natural", natural_w, "tracking", track)
dbiz, _ = text_path(reg, txt, xB, base2, s2, track)

cx, cy, r_mid, sw = 960.5, 352.0, 151.0, 51.0
dot_cx, dot_cy, dot_r = 1062.0, 244.0, 46.0
gap_r = dot_r + 14

minx, miny, maxx, maxy = 150, 160, 1150, 750
W, H = maxx - minx, maxy - miny

def svg(fg, dot, bg=None, title="360 Biz Health"):
    rect = f'<rect x="{minx}" y="{miny}" width="{W}" height="{H}" fill="{bg}"/>' if bg else ""
    return f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="{minx} {miny} {W} {H}" role="img" aria-labelledby="t"><title id="t">{title}</title>{rect}
<defs><mask id="m" maskUnits="userSpaceOnUse" x="{minx}" y="{miny}" width="{W}" height="{H}"><rect x="{minx}" y="{miny}" width="{W}" height="{H}" fill="#fff"/><circle cx="{dot_cx}" cy="{dot_cy}" r="{gap_r}" fill="#000"/></mask></defs>
<path fill="{fg}" d="{d36}"/>
<circle cx="{cx}" cy="{cy}" r="{r_mid}" fill="none" stroke="{fg}" stroke-width="{sw}" mask="url(#m)"/>
<circle cx="{dot_cx}" cy="{dot_cy}" r="{dot_r}" fill="{dot}"/>
<path fill="{fg}" d="{dbiz}"/>
</svg>'''

def icon(fg, dot, bg):
    # ring mark only, centred in a square with the PDF icon padding
    pad = 70
    size = 2 * (cx - 784) + 2 * pad
    ox, oy = cx - size / 2, cy - size / 2
    rect = f'<rect x="{ox}" y="{oy}" width="{size}" height="{size}" rx="{size*0.18}" fill="{bg}"/>' if bg else ""
    return f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="{ox} {oy} {size} {size}">{rect}
<defs><mask id="m" maskUnits="userSpaceOnUse" x="{minx}" y="{miny}" width="{W}" height="{H}"><rect x="{ox}" y="{oy}" width="{size}" height="{size}" fill="#fff"/><circle cx="{dot_cx}" cy="{dot_cy}" r="{gap_r}" fill="#000"/></mask></defs>
<circle cx="{cx}" cy="{cy}" r="{r_mid}" fill="none" stroke="{fg}" stroke-width="{sw}" mask="url(#m)"/>
<circle cx="{dot_cx}" cy="{dot_cy}" r="{dot_r}" fill="{dot}"/></svg>'''

import os
os.makedirs(OUT, exist_ok=True)
open(f"{OUT}/logo.svg", "w").write(svg("#0C4727", "#F26423"))
open(f"{OUT}/logo-reverse.svg", "w").write(svg("#F9F4EA", "#F26423"))
open(f"{OUT}/logo-preview-on-cream.svg", "w").write(svg("#0C4727", "#F26423", "#F9F4EA"))
open(f"{OUT}/mark.svg", "w").write(icon("#F9F4EA", "#F26423", "#0C4727"))
open(f"{OUT}/mark-plain.svg", "w").write(icon("#0C4727", "#F26423", None))
# export raw geometry for the React component
import json
json.dump({"viewBox": [minx, miny, W, H], "d36": d36, "dbiz": dbiz, "ring": [cx, cy, r_mid, sw], "dot": [dot_cx, dot_cy, dot_r], "gap": gap_r}, open(f"{OUT}/logo-geometry.json", "w"))
