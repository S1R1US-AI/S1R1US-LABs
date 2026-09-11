#!/usr/bin/env python3
"""Cartoon padlock GIFs: magenta shackle, gold body, transparent background.

No black halo / circle. Motion is a soft pulse plus (open) shackle lift.
"""
from __future__ import annotations

import math
from pathlib import Path

from PIL import Image, ImageDraw

ROOT = Path(__file__).resolve().parent.parent
OUT_DIR = ROOT / "public"
SIZE = 96
SCALE = 5
N = 12
DURATION_MS = 90


def clamp(n: float) -> int:
    return max(0, min(255, int(n)))


def rgba(r: float, g: float, b: float, a: int = 255) -> tuple[int, int, int, int]:
    return (clamp(r), clamp(g), clamp(b), a)


def u_shackle(size: int, box: tuple[int, int, int, int], thick: int) -> Image.Image:
    x0, y0, x1, y1 = box
    w = x1 - x0
    mask = Image.new("L", (size, size), 0)
    d = ImageDraw.Draw(mask)
    d.pieslice([x0, y0, x1, y0 + w], 180, 0, fill=255)
    d.rectangle([x0, y0 + w // 2, x0 + thick, y1], fill=255)
    d.rectangle([x1 - thick, y0 + w // 2, x1, y1], fill=255)
    d.pieslice([x0 + thick, y0 + thick, x1 - thick, y0 + w - thick], 180, 0, fill=0)
    d.rectangle([x0 + thick, y0 + w // 2, x1 - thick, y1 + 4], fill=0)
    return mask


def fill_mask(mask: Image.Image, color: tuple[int, int, int, int]) -> Image.Image:
    layer = Image.new("RGBA", mask.size, color)
    out = Image.new("RGBA", mask.size, (0, 0, 0, 0))
    out.paste(layer, mask=mask)
    return out


def draw_padlock(open_shackle: bool, t: float) -> Image.Image:
    S = SIZE * SCALE
    canvas = Image.new("RGBA", (S, S), (0, 0, 0, 0))
    cx = S // 2
    pulse = 0.5 + 0.5 * math.sin(2 * math.pi * t)

    body_w = int(S * 0.62)
    body_h = int(S * 0.52)
    x0 = cx - body_w // 2
    x1 = cx + body_w // 2
    y0 = int(S * 0.40)
    y1 = y0 + body_h
    rad = int(S * 0.12)

    thick = int(S * 0.13)
    inner = int(body_w * 0.36)
    sx0 = cx - inner // 2 - thick
    sx1 = cx + inner // 2 + thick
    sy1 = y0 + int(S * 0.06)
    sy0 = sy1 - int(S * 0.42)

    smask = u_shackle(S, (sx0, sy0, sx1, sy1), thick)
    mag = 220 + 20 * pulse
    shackle = fill_mask(smask, rgba(mag, 40, 220))
    rim = u_shackle(S, (sx0 + 4, sy0 + 4, sx1 - 4, sy1 - 2), max(6, thick - 10))
    shackle.alpha_composite(fill_mask(rim, rgba(255, 120, 255, 160)))

    if open_shackle:
        lift = int(S * 0.012 * math.sin(2 * math.pi * t))
        shackle = shackle.rotate(
            -22, resample=Image.Resampling.BICUBIC, center=(cx, sy1), fillcolor=(0, 0, 0, 0)
        )
        shifted = Image.new("RGBA", (S, S), (0, 0, 0, 0))
        shifted.alpha_composite(shackle, (int(-S * 0.02), int(-S * 0.08) + lift))
        shackle = shifted
    canvas.alpha_composite(shackle)

    body = Image.new("RGBA", (S, S), (0, 0, 0, 0))
    bd = ImageDraw.Draw(body, "RGBA")
    bd.rounded_rectangle([x0, y0, x1, y1], radius=rad, fill=rgba(18, 12, 4))
    bd.rounded_rectangle([x0 + 6, y0 + 6, x1 - 6, y1 - 6], radius=rad - 4, fill=rgba(255, 210, 40))
    bd.rounded_rectangle(
        [x0 + 14, y0 + 12, x1 - 22, y0 + int(body_h * 0.42)],
        radius=rad - 8,
        fill=rgba(255, 236, 110, 200),
    )
    canvas.alpha_composite(body)

    rd = ImageDraw.Draw(canvas, "RGBA")
    kx, ky = cx, int(y0 + body_h * 0.58)
    kr = int(S * 0.075)
    rd.ellipse([kx - kr, ky - kr, kx + kr, ky + kr], fill=rgba(12, 8, 8))
    rd.polygon(
        [
            (kx - int(kr * 0.45), ky + int(kr * 0.4)),
            (kx + int(kr * 0.45), ky + int(kr * 0.4)),
            (kx + int(kr * 0.32), ky + int(kr * 1.55)),
            (kx - int(kr * 0.32), ky + int(kr * 1.55)),
        ],
        fill=rgba(12, 8, 8),
    )

    return crop_to_lock(canvas).resize((SIZE, SIZE), Image.Resampling.LANCZOS)


def crop_to_lock(im: Image.Image) -> Image.Image:
    """Tight square crop around the lock so the GIF has no black disc and little empty pad."""
    alpha = im.getchannel("A")
    bbox = alpha.point(lambda a: 255 if a >= 12 else 0).getbbox()
    if not bbox:
        return im
    x0, y0, x1, y1 = bbox
    pad = int(max(x1 - x0, y1 - y0) * 0.08)
    x0 = max(0, x0 - pad)
    y0 = max(0, y0 - pad)
    x1 = min(im.width, x1 + pad)
    y1 = min(im.height, y1 + pad)
    side = max(x1 - x0, y1 - y0)
    cx = (x0 + x1) // 2
    cy = (y0 + y1) // 2
    left = max(0, cx - side // 2)
    top = max(0, cy - side // 2)
    if left + side > im.width:
        left = im.width - side
    if top + side > im.height:
        top = im.height - side
    return im.crop((left, top, left + side, top + side))


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


def write_gif(open_shackle: bool, dest: Path) -> None:
    frames = [rgba_to_p(draw_padlock(open_shackle, i / N)) for i in range(N)]
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
    write_gif(False, OUT_DIR / "lock-closed.gif")
    write_gif(True, OUT_DIR / "lock-open.gif")
    alias = OUT_DIR / "AI-Agent-Lock-System-for-AI-Agent-BTC-Trading-Bot.gif"
    alias.write_bytes((OUT_DIR / "lock-open.gif").read_bytes())
    print("alias", alias.name, alias.stat().st_size, "bytes")


if __name__ == "__main__":
    main()
