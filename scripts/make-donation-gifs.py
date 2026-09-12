#!/usr/bin/env python3
"""Donation GIFs for the s1r1us.ai gift pages (FUNDING.yml fold, build #113).

SEO rule: every filename is the keyword phrase for its donation page, and the
page repeats the same phrase in alt/title (see seoImgAlt in src/lib/brand.ts).
Three GIFs per donation page — 1 large (480x270) + 2 medium (200x200):

  /sponsor-ai-bitcoin-trading-bot
    Sponsor-AI-Bitcoin-Trading-Bot.gif            (large)
    Sponsor-Open-Source-Bitcoin-Bot-Heart.gif     (medium)
    Crowdfund-AI-Bitcoin-Trading-Bot-Goal.gif     (medium)
  /c0ff33
    Buy-Me-a-Coffee-Bitcoin-USDC-Gift.gif         (large)
    Coffee-Tip-AI-Bitcoin-Trading-Bot.gif         (medium)
    Crypto-Coffee-Donation-Open-Source-Bot.gif    (medium)
  /f33d
    Feed-Hosting-Donation-AI-Bitcoin-Trading-Bot.gif  (large)
    Bitcoin-USDC-Server-Hosting-Gift.gif          (medium)
    Transparent-On-Chain-Funding-Bitcoin-Bot.gif  (medium)

Same conventions as make-lock-gifs.py: transparent background, no black halo,
255-color adaptive palette with index 255 transparent, disposal=2.
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

GOLD = (255, 210, 40)
GOLD_HI = (255, 236, 110)
DARK = (18, 12, 4)
MAGENTA = (220, 40, 220)
MAGENTA_HI = (255, 120, 255)
CYAN = (80, 220, 255)
USDC_BLUE = (39, 117, 202)
GREEN = (70, 220, 120)


def clamp(n: float) -> int:
    return max(0, min(255, int(n)))


def rgba(c: tuple[int, int, int], a: int = 255) -> tuple[int, int, int, int]:
    return (clamp(c[0]), clamp(c[1]), clamp(c[2]), a)


def canvas_for(size: tuple[int, int]) -> Image.Image:
    return Image.new("RGBA", (size[0] * SCALE, size[1] * SCALE), (0, 0, 0, 0))


def btc_coin(d: ImageDraw.ImageDraw, cx: float, cy: float, r: float, pulse: float = 0.0) -> None:
    """Gold coin with a drawn Bitcoin B glyph (shapes only, no fonts)."""
    r = r * (1.0 + 0.04 * pulse)
    d.ellipse([cx - r, cy - r, cx + r, cy + r], fill=rgba(DARK))
    r2 = r * 0.92
    d.ellipse([cx - r2, cy - r2, cx + r2, cy + r2], fill=rgba(GOLD))
    r3 = r * 0.78
    d.ellipse([cx - r3, cy - r3, cx + r3, cy + r3], outline=rgba(GOLD_HI, 230), width=max(2, int(r * 0.07)))
    w = max(3, int(r * 0.14))
    sx = cx - r * 0.22
    top, bot = cy - r * 0.42, cy + r * 0.42
    d.line([sx, top, sx, bot], fill=rgba(DARK), width=w)
    for yy in (top, cy, bot):
        d.line([sx, yy, cx + r * 0.10, yy], fill=rgba(DARK), width=w)
    for byy in (cy - r * 0.21, cy + r * 0.21):
        br = r * 0.24
        bx = cx + r * 0.10
        d.arc([bx - br, byy - br, bx + br, byy + br], start=-90, end=90, fill=rgba(DARK), width=w)
    for tx in (sx + r * 0.16, sx + r * 0.38):
        d.line([tx, top - r * 0.16, tx, top], fill=rgba(DARK), width=max(2, w - 2))
        d.line([tx, bot, tx, bot + r * 0.16], fill=rgba(DARK), width=max(2, w - 2))


def usdc_coin(d: ImageDraw.ImageDraw, cx: float, cy: float, r: float) -> None:
    d.ellipse([cx - r, cy - r, cx + r, cy + r], fill=rgba(DARK))
    r2 = r * 0.92
    d.ellipse([cx - r2, cy - r2, cx + r2, cy + r2], fill=rgba(USDC_BLUE))
    w = max(3, int(r * 0.14))
    r3 = r * 0.55
    d.arc([cx - r3, cy - r3, cx + r3, cy + r3], start=115, end=345, fill=rgba((255, 255, 255)), width=w)
    d.line([cx, cy - r * 0.75, cx, cy + r * 0.75], fill=rgba((255, 255, 255)), width=max(2, w - 2))


def heart(d: ImageDraw.ImageDraw, cx: float, cy: float, r: float, color: tuple[int, int, int], glow: float) -> None:
    r = r * (1.0 + 0.10 * glow)
    lobe = r * 0.52
    ly = cy - r * 0.30
    for lx in (cx - r * 0.42, cx + r * 0.42):
        d.ellipse([lx - lobe, ly - lobe, lx + lobe, ly + lobe], fill=rgba(color))
    d.polygon([(cx - r * 0.92, ly + lobe * 0.35), (cx + r * 0.92, ly + lobe * 0.35), (cx, cy + r * 0.85)], fill=rgba(color))
    hr = r * 0.30
    hx, hy = cx - r * 0.34, cy - r * 0.44
    d.ellipse([hx - hr, hy - hr, hx + hr, hy + hr], fill=rgba(MAGENTA_HI, 150 + int(80 * glow)))


def sparkle(d: ImageDraw.ImageDraw, cx: float, cy: float, r: float, a: int, color=GOLD_HI) -> None:
    if a <= 0:
        return
    w = max(2, int(r * 0.22))
    d.line([cx - r, cy, cx + r, cy], fill=rgba(color, a), width=w)
    d.line([cx, cy - r, cx, cy + r], fill=rgba(color, a), width=w)


def steam(d: ImageDraw.ImageDraw, x: float, top: float, h: float, t: float, a: int, w: int) -> None:
    pts = []
    for i in range(14):
        f = i / 13
        yy = top - f * h
        xx = x + math.sin(2 * math.pi * (f * 1.4 + t)) * h * 0.10 * (0.4 + f)
        pts.append((xx, yy))
    fade = a
    for i in range(len(pts) - 1):
        seg_a = int(fade * (1.0 - (i / len(pts)) * 0.8))
        d.line([pts[i], pts[i + 1]], fill=rgba((235, 235, 245), seg_a), width=w)


def cup(d: ImageDraw.ImageDraw, cx: float, cy: float, r: float, pulse: float) -> None:
    """Gold coffee cup with dark coffee, handle, saucer."""
    bw = r * (1.0 + 0.03 * pulse)
    x0, x1 = cx - bw, cx + bw
    y0, y1 = cy - r * 0.62, cy + r * 0.62
    d.rounded_rectangle([x0 - r * 0.16, y1 + r * 0.10, x1 + r * 0.16, y1 + r * 0.30], radius=r * 0.10, fill=rgba(DARK))
    hr = r * 0.42
    hx = x1 + r * 0.06
    d.arc([hx - hr, cy - hr - r * 0.05, hx + hr, cy + hr - r * 0.05], start=-75, end=95, fill=rgba(DARK), width=max(4, int(r * 0.16)))
    d.rounded_rectangle([x0, y0, x1, y1], radius=r * 0.18, fill=rgba(DARK))
    d.rounded_rectangle([x0 + r * 0.07, y0 + r * 0.07, x1 - r * 0.07, y1 - r * 0.07], radius=r * 0.14, fill=rgba(GOLD))
    d.ellipse([x0 + r * 0.10, y0 - r * 0.10, x1 - r * 0.10, y0 + r * 0.16], fill=rgba((44, 26, 12)))
    d.ellipse([x0 + r * 0.18, y0 - r * 0.05, x1 - r * 0.18, y0 + r * 0.11], fill=rgba((84, 52, 22)))


def server(d: ImageDraw.ImageDraw, cx: float, cy: float, w: float, h: float, t: float) -> None:
    """Server rack tower with cycling LEDs and a coin slot on top."""
    x0, y0 = cx - w / 2, cy - h / 2
    x1, y1 = cx + w / 2, cy + h / 2
    d.rounded_rectangle([x0, y0, x1, y1], radius=w * 0.08, fill=rgba(DARK))
    d.rounded_rectangle([x0 + w * 0.05, y0 + h * 0.03, x1 - w * 0.05, y1 - h * 0.03], radius=w * 0.06, fill=rgba((40, 34, 48)))
    slot_w = w * 0.44
    d.rounded_rectangle([cx - slot_w / 2, y0 - h * 0.035, cx + slot_w / 2, y0 + h * 0.015], radius=h * 0.012, fill=rgba(GOLD))
    rows = 4
    for i in range(rows):
        ry0 = y0 + h * (0.10 + i * 0.22)
        ry1 = ry0 + h * 0.15
        d.rounded_rectangle([x0 + w * 0.10, ry0, x1 - w * 0.10, ry1], radius=w * 0.03, fill=rgba((22, 18, 30)))
        for j in range(3):
            phase = (t * 2 + i * 0.27 + j * 0.13) % 1.0
            on = phase < 0.5
            col = (GREEN if j == 0 else CYAN if j == 1 else MAGENTA)
            lr = w * 0.035
            lx = x0 + w * (0.16 + j * 0.10)
            ly = (ry0 + ry1) / 2
            d.ellipse([lx - lr, ly - lr, lx + lr, ly + lr], fill=rgba(col, 255 if on else 70))
        d.line([x0 + w * 0.52, (ry0 + ry1) / 2, x1 - w * 0.14, (ry0 + ry1) / 2], fill=rgba((90, 80, 110)), width=max(2, int(w * 0.02)))


def chain_link(d: ImageDraw.ImageDraw, cx: float, cy: float, r: float, color: tuple[int, int, int], a: int, w: int) -> None:
    d.ellipse([cx - r, cy - r * 0.62, cx + r, cy + r * 0.62], outline=rgba(color, a), width=w)


def bar_track(d: ImageDraw.ImageDraw, x0: float, y0: float, x1: float, y1: float, fill_f: float) -> None:
    rad = (y1 - y0) / 2
    d.rounded_rectangle([x0, y0, x1, y1], radius=rad, fill=rgba(DARK))
    d.rounded_rectangle([x0 + 4, y0 + 4, x1 - 4, y1 - 4], radius=rad - 3, fill=rgba((40, 34, 48)))
    fx = x0 + 4 + (x1 - x0 - 8) * max(0.04, min(1.0, fill_f))
    d.rounded_rectangle([x0 + 4, y0 + 4, fx, y1 - 4], radius=rad - 3, fill=rgba(GOLD))
    d.rounded_rectangle([x0 + 4, y0 + 4, fx, y0 + (y1 - y0) * 0.45], radius=rad - 3, fill=rgba(GOLD_HI, 160))


# ---------------------------------------------------------------- frames ----

def frame_sponsor_large(t: float) -> Image.Image:
    im = canvas_for(LARGE)
    d = ImageDraw.Draw(im, "RGBA")
    W, H = im.size
    pulse = 0.5 + 0.5 * math.sin(2 * math.pi * t)
    heart(d, W * 0.30, H * 0.52, H * 0.30, MAGENTA, pulse)
    btc_coin(d, W * 0.68, H * 0.50, H * 0.30, pulse)
    usdc_coin(d, W * 0.88, H * 0.70, H * 0.13)
    for i, (sx, sy) in enumerate([(0.12, 0.20), (0.48, 0.16), (0.84, 0.24), (0.52, 0.82), (0.16, 0.80)]):
        a = int(230 * max(0.0, math.sin(2 * math.pi * (t + i * 0.2))))
        sparkle(d, W * sx, H * sy, H * 0.045, a)
    return im.resize(LARGE, Image.Resampling.LANCZOS)


def frame_sponsor_heart(t: float) -> Image.Image:
    im = canvas_for(MEDIUM)
    d = ImageDraw.Draw(im, "RGBA")
    W, H = im.size
    pulse = 0.5 + 0.5 * math.sin(2 * math.pi * t)
    heart(d, W * 0.50, H * 0.46, H * 0.34, MAGENTA, pulse)
    btc_coin(d, W * 0.50, H * 0.47, H * 0.15, pulse)
    a = int(220 * max(0.0, math.sin(2 * math.pi * (t + 0.5))))
    sparkle(d, W * 0.16, H * 0.18, H * 0.05, a)
    sparkle(d, W * 0.84, H * 0.22, H * 0.05, int(a * 0.8))
    return im.resize(MEDIUM, Image.Resampling.LANCZOS)


def frame_crowdfund_goal(t: float) -> Image.Image:
    im = canvas_for(MEDIUM)
    d = ImageDraw.Draw(im, "RGBA")
    W, H = im.size
    fill_f = 0.12 + 0.84 * t
    bar_track(d, W * 0.10, H * 0.62, W * 0.90, H * 0.78, fill_f)
    flag_x = W * 0.88
    d.line([flag_x, H * 0.40, flag_x, H * 0.62], fill=rgba(DARK), width=max(3, int(W * 0.015)))
    d.polygon([(flag_x, H * 0.40), (flag_x + W * 0.10, H * 0.45), (flag_x, H * 0.50)], fill=rgba(GREEN))
    cx = W * 0.10 + (W * 0.80) * max(0.04, min(1.0, fill_f))
    btc_coin(d, cx, H * 0.42, H * 0.135, math.sin(2 * math.pi * t))
    heart(d, W * 0.18, H * 0.24, H * 0.085, MAGENTA, 0.5 + 0.5 * math.sin(2 * math.pi * (t + 0.3)))
    return im.resize(MEDIUM, Image.Resampling.LANCZOS)


def frame_coffee_large(t: float) -> Image.Image:
    im = canvas_for(LARGE)
    d = ImageDraw.Draw(im, "RGBA")
    W, H = im.size
    pulse = 0.5 + 0.5 * math.sin(2 * math.pi * t)
    cup(d, W * 0.36, H * 0.58, H * 0.26, pulse)
    for k, sxf in enumerate((0.30, 0.36, 0.42)):
        steam(d, W * sxf, H * 0.36, H * 0.26, t + k * 0.33, 200, max(3, int(H * 0.02)))
    drop = (t * 2) % 1.0
    cy = H * (0.10 + 0.34 * drop)
    btc_coin(d, W * 0.66, cy, H * 0.135, 0)
    usdc_coin(d, W * 0.80, H * (0.44 - 0.30 * drop), H * 0.105)
    sparkle(d, W * 0.88, H * 0.20, H * 0.045, int(220 * pulse))
    sparkle(d, W * 0.12, H * 0.24, H * 0.045, int(220 * (1 - pulse)))
    return im.resize(LARGE, Image.Resampling.LANCZOS)


def frame_coffee_tip(t: float) -> Image.Image:
    im = canvas_for(MEDIUM)
    d = ImageDraw.Draw(im, "RGBA")
    W, H = im.size
    pulse = 0.5 + 0.5 * math.sin(2 * math.pi * t)
    cup(d, W * 0.46, H * 0.62, H * 0.24, pulse)
    steam(d, W * 0.42, H * 0.42, H * 0.24, t, 210, max(3, int(H * 0.025)))
    steam(d, W * 0.52, H * 0.42, H * 0.22, t + 0.5, 180, max(3, int(H * 0.02)))
    drop = (t * 2) % 1.0
    btc_coin(d, W * 0.76, H * (0.16 + 0.24 * drop), H * 0.12, 0)
    return im.resize(MEDIUM, Image.Resampling.LANCZOS)


def frame_coffee_crypto(t: float) -> Image.Image:
    im = canvas_for(MEDIUM)
    d = ImageDraw.Draw(im, "RGBA")
    W, H = im.size
    pulse = 0.5 + 0.5 * math.sin(2 * math.pi * t)
    cup(d, W * 0.50, H * 0.64, H * 0.22, pulse)
    steam(d, W * 0.50, H * 0.46, H * 0.20, t, 190, max(3, int(H * 0.02)))
    orbit = 2 * math.pi * t
    btc_coin(d, W * 0.50 + W * 0.30 * math.cos(orbit), H * 0.30 + H * 0.10 * math.sin(orbit), H * 0.115, pulse)
    usdc_coin(d, W * 0.50 - W * 0.30 * math.cos(orbit), H * 0.30 - H * 0.10 * math.sin(orbit), H * 0.105)
    return im.resize(MEDIUM, Image.Resampling.LANCZOS)


def frame_feed_large(t: float) -> Image.Image:
    im = canvas_for(LARGE)
    d = ImageDraw.Draw(im, "RGBA")
    W, H = im.size
    server(d, W * 0.30, H * 0.52, W * 0.26, H * 0.74, t)
    drop = (t * 2) % 1.0
    arc_x = W * (0.78 - 0.36 * drop)
    arc_y = H * (0.20 + 0.55 * drop * drop)
    btc_coin(d, arc_x, arc_y, H * 0.125, 0)
    usdc_coin(d, W * (0.88 - 0.36 * ((t * 2 + 0.5) % 1.0)), H * (0.16 + 0.55 * (((t * 2 + 0.5) % 1.0) ** 2)), H * 0.10)
    pulse = 0.5 + 0.5 * math.sin(2 * math.pi * t)
    heart(d, W * 0.62, H * 0.74, H * 0.10, MAGENTA, pulse)
    sparkle(d, W * 0.90, H * 0.62, H * 0.045, int(220 * pulse), CYAN)
    sparkle(d, W * 0.54, H * 0.14, H * 0.045, int(220 * (1 - pulse)))
    return im.resize(LARGE, Image.Resampling.LANCZOS)


def frame_feed_gift(t: float) -> Image.Image:
    im = canvas_for(MEDIUM)
    d = ImageDraw.Draw(im, "RGBA")
    W, H = im.size
    server(d, W * 0.42, H * 0.56, W * 0.44, H * 0.68, t)
    drop = (t * 2) % 1.0
    btc_coin(d, W * 0.42, H * (0.06 + 0.10 * drop), H * 0.105, 0)
    usdc_coin(d, W * 0.82, H * (0.30 + 0.18 * math.sin(2 * math.pi * t)), H * 0.10)
    return im.resize(MEDIUM, Image.Resampling.LANCZOS)


def frame_chain_funding(t: float) -> Image.Image:
    im = canvas_for(MEDIUM)
    d = ImageDraw.Draw(im, "RGBA")
    W, H = im.size
    w = max(4, int(H * 0.028))
    links = 4
    for i in range(links):
        phase = (t + i / links) % 1.0
        glow = 0.5 + 0.5 * math.sin(2 * math.pi * phase)
        col = GOLD if i % 2 == 0 else CYAN
        chain_link(d, W * (0.20 + i * 0.20), H * 0.62, W * 0.125, col, 130 + int(120 * glow), w)
    btc_coin(d, W * 0.35, H * 0.28, H * 0.13, math.sin(2 * math.pi * t))
    usdc_coin(d, W * 0.66, H * 0.28, H * 0.115)
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
    write_gif("Sponsor-AI-Bitcoin-Trading-Bot.gif", frame_sponsor_large)
    write_gif("Sponsor-Open-Source-Bitcoin-Bot-Heart.gif", frame_sponsor_heart)
    write_gif("Crowdfund-AI-Bitcoin-Trading-Bot-Goal.gif", frame_crowdfund_goal)
    write_gif("Buy-Me-a-Coffee-Bitcoin-USDC-Gift.gif", frame_coffee_large)
    write_gif("Coffee-Tip-AI-Bitcoin-Trading-Bot.gif", frame_coffee_tip)
    write_gif("Crypto-Coffee-Donation-Open-Source-Bot.gif", frame_coffee_crypto)
    write_gif("Feed-Hosting-Donation-AI-Bitcoin-Trading-Bot.gif", frame_feed_large)
    write_gif("Bitcoin-USDC-Server-Hosting-Gift.gif", frame_feed_gift)
    write_gif("Transparent-On-Chain-Funding-Bitcoin-Bot.gif", frame_chain_funding)


if __name__ == "__main__":
    main()
