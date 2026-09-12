#!/usr/bin/env python3
"""BTC M1N3Rz GIFs for the s1r1us.ai /Bitcoin-Miners page.

SEO rule: every filename is the keyword phrase for the page, and the page
repeats the same phrase in alt/title (see seoImgAlt in src/lib/brand.ts).
Three GIFs — 1 large (480x270) + 2 medium (200x200) — theme: connecting
bitcoin miners to an AI hive swarm ("Bitcoin Miner for accumulation system"):

  /Bitcoin-Miners
    Bitcoin-Miner-for-Accumulation-System.gif     (large)
    Connect-Bitcoin-Miners-to-AI-Hive-Swarm.gif   (medium)
    Solo-CKPool-Bitcoin-Miner-Hash-Power.gif      (medium)

Palette mirrors the BTC M1N3Rz desk view: bright green hash with yellow and
blue contrasts. Same conventions as make-donation-gifs.py: transparent
background, no black halo, 255-color adaptive palette with index 255
transparent, disposal=2.
"""
from __future__ import annotations

import math
from pathlib import Path

from PIL import Image, ImageDraw

ROOT = Path(__file__).resolve().parent.parent
OUT_DIR = ROOT / "public"
SCALE = 3
N = 12
DURATION_MS = 90

LARGE = (480, 270)
MEDIUM = (200, 200)

HASH_GREEN = (57, 255, 20)
GREEN_DIM = (24, 140, 16)
YELLOW = (255, 208, 36)
YELLOW_HI = (255, 240, 130)
BLUE = (56, 189, 248)
BLUE_DIM = (30, 90, 140)
GOLD = (255, 210, 40)
DARK = (10, 22, 8)
STEEL = (70, 86, 96)


def clamp(n: float) -> int:
    return max(0, min(255, int(n)))


def rgba(c: tuple[int, int, int], a: int = 255) -> tuple[int, int, int, int]:
    return (clamp(c[0]), clamp(c[1]), clamp(c[2]), a)


def canvas_for(size: tuple[int, int]) -> Image.Image:
    return Image.new("RGBA", (size[0] * SCALE, size[1] * SCALE), (0, 0, 0, 0))


def miner_rig(d: ImageDraw.ImageDraw, x: float, y: float, w: float, h: float, t: float, seed: int) -> None:
    """One ASIC miner box with blinking status LEDs and fan."""
    d.rounded_rectangle([x, y, x + w, y + h], radius=w * 0.08, fill=rgba(DARK), outline=rgba(STEEL), width=max(2, int(w * 0.03)))
    # fan circle
    fx, fy, fr = x + w * 0.30, y + h * 0.52, min(w, h) * 0.26
    d.ellipse([fx - fr, fy - fr, fx + fr, fy + fr], outline=rgba(BLUE), width=max(2, int(fr * 0.16)))
    ang = 2 * math.pi * ((t * 2 + seed * 0.23) % 1.0)
    for k in range(3):
        a2 = ang + k * 2 * math.pi / 3
        d.line([fx, fy, fx + fr * 0.72 * math.cos(a2), fy + fr * 0.72 * math.sin(a2)], fill=rgba(BLUE, 220), width=max(2, int(fr * 0.14)))
    # LED row — oscillating hash blink
    for i in range(3):
        on = 0.5 + 0.5 * math.sin(2 * math.pi * (t * 3 + seed * 0.37 + i * 0.29))
        col = HASH_GREEN if i != 1 else YELLOW
        lx = x + w * (0.58 + i * 0.13)
        d.ellipse([lx, y + h * 0.30, lx + w * 0.07, y + h * 0.30 + w * 0.07], fill=rgba(col, 90 + int(160 * on)))
    # power cord stub
    d.line([x + w * 0.5, y + h, x + w * 0.5, y + h * 1.12], fill=rgba(STEEL), width=max(2, int(w * 0.03)))


def hive_hex(d: ImageDraw.ImageDraw, cx: float, cy: float, r: float, t: float) -> None:
    """AI hive: layered hexagon with orbiting agent dots."""
    for ring, col, a in ((1.0, HASH_GREEN, 255), (0.72, YELLOW, 235), (0.45, BLUE, 255)):
        pts = []
        for k in range(6):
            a6 = math.pi / 6 + k * math.pi / 3
            pts.append((cx + r * ring * math.cos(a6), cy + r * ring * math.sin(a6)))
        d.polygon(pts, outline=rgba(col, a), width=max(2, int(r * 0.09)))
    pulse = 0.5 + 0.5 * math.sin(2 * math.pi * t)
    d.ellipse([cx - r * 0.16, cy - r * 0.16, cx + r * 0.16, cy + r * 0.16], fill=rgba(YELLOW_HI, 150 + int(100 * pulse)))
    # orbiting swarm agents
    for i in range(6):
        a2 = 2 * math.pi * ((t + i / 6) % 1.0)
        ox, oy = cx + r * 1.22 * math.cos(a2), cy + r * 1.22 * math.sin(a2)
        col = HASH_GREEN if i % 3 == 0 else (YELLOW if i % 3 == 1 else BLUE)
        d.ellipse([ox - r * 0.07, oy - r * 0.07, ox + r * 0.07, oy + r * 0.07], fill=rgba(col, 230))


def hash_stream(d: ImageDraw.ImageDraw, x0: float, y0: float, x1: float, y1: float, t: float, seed: int) -> None:
    """Dotted packet stream from miner to hive — hash flowing into the swarm."""
    n = 7
    for i in range(n):
        p = ((t * 1.5 + i / n + seed * 0.17) % 1.0)
        px, py = x0 + (x1 - x0) * p, y0 + (y1 - y0) * p
        col = HASH_GREEN if i % 3 else YELLOW
        r = 3 + 2 * math.sin(math.pi * p)
        d.ellipse([px - r * SCALE, py - r * SCALE, px + r * SCALE, py + r * SCALE], fill=rgba(col, 60 + int(195 * math.sin(math.pi * p))))


def btc_coin(d: ImageDraw.ImageDraw, cx: float, cy: float, r: float, wob: float) -> None:
    rx = r * (0.82 + 0.18 * abs(wob))
    d.ellipse([cx - rx, cy - r, cx + rx, cy + r], fill=rgba(GOLD), outline=rgba(YELLOW_HI), width=max(2, int(r * 0.1)))
    bw = max(3, int(r * 0.16))
    bh = r * 0.52
    d.line([cx - rx * 0.18, cy - bh, cx - rx * 0.18, cy + bh], fill=rgba(DARK), width=bw)
    for dy in (-bh, 0, bh):
        d.arc([cx - rx * 0.2, cy + dy - bh * 0.52, cx + rx * 0.5, cy + dy + bh * 0.52], -95, 95, fill=rgba(DARK), width=bw)


# ------------------------------------------------------------- frames -------

def frame_miners_large(t: float) -> Image.Image:
    """Large: rack of bitcoin miners streaming hash up into the AI hive swarm."""
    im = canvas_for(LARGE)
    d = ImageDraw.Draw(im)
    W, H = im.size
    hx, hy, hr = W * 0.78, H * 0.32, H * 0.21
    hive_hex(d, hx, hy, hr, t)
    btc_coin(d, hx, hy - hr * 1.2, hr * 0.30, math.sin(2 * math.pi * t))
    rig_w, rig_h = W * 0.155, H * 0.22
    for i in range(3):
        rx, ry = W * (0.05 + i * 0.19), H * 0.62
        miner_rig(d, rx, ry, rig_w, rig_h, t, i)
        hash_stream(d, rx + rig_w * 0.5, ry, hx - hr * 0.4, hy + hr * 0.5, t, i)
    # oscillating hash power tape along the bottom
    pts = []
    for k in range(48):
        fx = k / 47
        amp = math.sin(2 * math.pi * (fx * 2.2 + t)) * 0.5 + math.sin(2 * math.pi * (fx * 5.1 - t)) * 0.28
        pts.append((W * 0.03 + fx * W * 0.94, H * 0.945 - amp * H * 0.035))
    d.line(pts, fill=rgba(HASH_GREEN, 235), width=max(2, int(H * 0.012)), joint="curve")
    d.line([(p[0], p[1] + H * 0.02) for p in pts], fill=rgba(BLUE, 130), width=max(2, int(H * 0.008)), joint="curve")
    return im.resize(LARGE, Image.Resampling.LANCZOS)


def frame_miners_swarm(t: float) -> Image.Image:
    """Medium: one miner connecting up to the hive — swarm orbit + packet stream."""
    im = canvas_for(MEDIUM)
    d = ImageDraw.Draw(im)
    W, H = im.size
    hive_hex(d, W * 0.5, H * 0.30, H * 0.17, t)
    rig_w, rig_h = W * 0.34, H * 0.20
    rx, ry = W * 0.33, H * 0.68
    miner_rig(d, rx, ry, rig_w, rig_h, t, 1)
    hash_stream(d, W * 0.5, ry, W * 0.5, H * 0.30 + H * 0.17, t, 2)
    return im.resize(MEDIUM, Image.Resampling.LANCZOS)


def frame_miners_hash(t: float) -> Image.Image:
    """Medium: solo CKPool hash power graph — bright green wave, yellow/blue contrast bars."""
    im = canvas_for(MEDIUM)
    d = ImageDraw.Draw(im)
    W, H = im.size
    # axis frame
    d.line([W * 0.08, H * 0.10, W * 0.08, H * 0.86, W * 0.94, H * 0.86], fill=rgba(STEEL), width=max(2, int(H * 0.012)))
    bars = 9
    for i in range(bars):
        p = 0.5 + 0.5 * math.sin(2 * math.pi * (t + i * 0.13))
        bx = W * (0.12 + i * 0.09)
        bh = H * (0.10 + 0.42 * p)
        col = BLUE if i % 3 == 2 else (YELLOW if i % 3 == 1 else GREEN_DIM)
        d.rectangle([bx, H * 0.86 - bh, bx + W * 0.055, H * 0.86], fill=rgba(col, 200))
    pts = []
    for k in range(40):
        fx = k / 39
        amp = 0.5 + 0.34 * math.sin(2 * math.pi * (fx * 1.8 + t)) + 0.12 * math.sin(2 * math.pi * (fx * 4.4 - t * 2))
        pts.append((W * 0.09 + fx * W * 0.84, H * 0.86 - amp * H * 0.58))
    d.line(pts, fill=rgba(HASH_GREEN), width=max(3, int(H * 0.02)), joint="curve")
    hx, hy = pts[-1]
    d.ellipse([hx - H * 0.02, hy - H * 0.02, hx + H * 0.02, hy + H * 0.02], fill=rgba(YELLOW_HI))
    btc_coin(d, W * 0.86, H * 0.18, H * 0.075, math.sin(2 * math.pi * t))
    return im.resize(MEDIUM, Image.Resampling.LANCZOS)


# ------------------------------------------------------------------ save ----

def rgba_to_p(im: Image.Image) -> Image.Image:
    alpha = im.getchannel("A")
    rgb_im = Image.new("RGB", im.size, (0, 0, 0))
    rgb_im.paste(im.convert("RGB"), mask=alpha.point(lambda a: 255 if a >= 20 else 0))
    pal = rgb_im.quantize(colors=255, method=Image.Quantize.FASTOCTREE, dither=Image.Dither.NONE)
    pal.putpalette((pal.getpalette() or [])[: 255 * 3] + [0, 0, 0])
    px = pal.load()
    ap = alpha.load()
    w, h = pal.size
    for y in range(h):
        for x in range(w):
            if ap[x, y] < 20:
                px[x, y] = 255
    pal.info["transparency"] = 255
    pal.info["disposal"] = 2
    return pal


def write_gif(name: str, frame_fn) -> None:
    frames = [rgba_to_p(frame_fn(i / N)) for i in range(N)]
    dest = OUT_DIR / name
    frames[0].save(
        dest,
        save_all=True,
        append_images=frames[1:],
        loop=0,
        duration=DURATION_MS,
        disposal=2,
        transparency=255,
        optimize=False,
    )
    print(dest.name, dest.stat().st_size, "bytes")


def main() -> None:
    write_gif("Bitcoin-Miner-for-Accumulation-System.gif", frame_miners_large)
    write_gif("Connect-Bitcoin-Miners-to-AI-Hive-Swarm.gif", frame_miners_swarm)
    write_gif("Solo-CKPool-Bitcoin-Miner-Hash-Power.gif", frame_miners_hash)


if __name__ == "__main__":
    main()
