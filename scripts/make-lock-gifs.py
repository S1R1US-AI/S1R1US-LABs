#!/usr/bin/env python3
"""Professional padlock GIFs. Transparent background. Gold metal. No rainbow."""
from __future__ import annotations

import math
from pathlib import Path

from PIL import Image, ImageDraw, ImageFilter

OUT_DIR = Path("/workspace/public")
SIZE = 160
SCALE = 4
N = 16
DURATION_MS = 80


def clamp(n: float) -> int:
    return max(0, min(255, int(n)))


def rgb(r: float, g: float, b: float, a: int = 255) -> tuple[int, int, int, int]:
    return (clamp(r), clamp(g), clamp(b), a)


def fill_mask(mask: Image.Image, color: tuple[int, int, int, int]) -> Image.Image:
    layer = Image.new("RGBA", mask.size, color)
    out = Image.new("RGBA", mask.size, (0, 0, 0, 0))
    out.paste(layer, mask=mask)
    return out


def u_shackle_mask(size: int, box: tuple[int, int, int, int], thick: int) -> Image.Image:
    """U-shaped shackle: top arch + two legs. Transparent interior and open bottom."""
    x0, y0, x1, y1 = box
    w = x1 - x0
    mask = Image.new("L", (size, size), 0)
    d = ImageDraw.Draw(mask)
    # Outer arch (top half of a circle sitting on the legs)
    d.pieslice([x0, y0, x1, y0 + w], 180, 0, fill=255)
    d.rectangle([x0, y0 + w // 2, x0 + thick, y1], fill=255)
    d.rectangle([x1 - thick, y0 + w // 2, x1, y1], fill=255)
    # Punch interior
    d.pieslice([x0 + thick, y0 + thick, x1 - thick, y0 + w - thick], 180, 0, fill=0)
    d.rectangle([x0 + thick, y0 + w // 2, x1 - thick, y1 + 4], fill=0)
    return mask


def draw_padlock(open_shackle: bool, t: float) -> Image.Image:
    S = SIZE * SCALE
    canvas = Image.new("RGBA", (S, S), (0, 0, 0, 0))

    cx = S // 2
    body_w = int(S * 0.56)
    body_h = int(S * 0.42)
    x0 = cx - body_w // 2
    x1 = cx + body_w // 2
    y0 = int(S * 0.46)
    y1 = y0 + body_h
    rad = int(S * 0.07)

    thick = int(S * 0.095)
    inner = int(body_w * 0.42)
    sx0 = cx - inner // 2 - thick
    sx1 = cx + inner // 2 + thick
    sy1 = y0 + int(S * 0.04)
    sy0 = sy1 - int(S * 0.36)
    pulse = 0.5 + 0.5 * math.sin(2 * math.pi * t)
    spec = (math.sin(2 * math.pi * (t + 0.15)) + 1) / 2

    # --- shackle ---
    smask = u_shackle_mask(S, (sx0, sy0, sx1, sy1), thick)
    steel = fill_mask(smask, rgb(186 + 18 * spec, 194 + 14 * spec, 206))
    # inner edge (darker, inset)
    inner_mask = u_shackle_mask(S, (sx0 + 6, sy0 + 6, sx1 - 6, sy1 - 2), max(4, thick - 14))
    steel.alpha_composite(fill_mask(inner_mask, rgb(70, 76, 88, 160)))
    # highlight on left-top of arch
    hi = Image.new("L", (S, S), 0)
    hd = ImageDraw.Draw(hi)
    hd.arc([sx0 + 10, sy0 + 10, sx1 - 28, sy0 + (sx1 - sx0) - 20], 200, 320, fill=255, width=max(3, thick // 5))
    steel.alpha_composite(fill_mask(hi, rgb(245, 248, 255, 200)))

    if open_shackle:
        lift = int(S * 0.015 * math.sin(2 * math.pi * t))
        steel = steel.rotate(-18, resample=Image.Resampling.BICUBIC, center=(cx + int(S * 0.02), sy1), fillcolor=(0, 0, 0, 0))
        shifted = Image.new("RGBA", (S, S), (0, 0, 0, 0))
        shifted.alpha_composite(steel, (int(-S * 0.08), int(-S * 0.09) + lift))
        steel = shifted
    else:
        j = int(S * 0.004 * math.sin(2 * math.pi * t))
        shifted = Image.new("RGBA", (S, S), (0, 0, 0, 0))
        shifted.alpha_composite(steel, (0, j))
        steel = shifted
    canvas.alpha_composite(steel)

    # --- brass body (no baked black matte — CSS drop-shadow follows the lock) ---
    body = Image.new("RGBA", (S, S), (0, 0, 0, 0))
    bd = ImageDraw.Draw(body, "RGBA")
    bd.rounded_rectangle([x0, y0, x1, y1], radius=rad, fill=rgb(118, 82, 18))
    bd.rounded_rectangle([x0 + 5, y0 + 5, x1 - 5, y1 - 7], radius=rad - 3, fill=rgb(196, 148, 36))
    # top plate
    bd.rounded_rectangle([x0 + 10, y0 + 8, x1 - 14, y0 + int(body_h * 0.42)], radius=rad - 6, fill=rgb(228 + 20 * spec, 186 + 10 * spec, 64))
    # left highlight
    bd.rectangle([x0 + 12, y0 + 22, x0 + int(body_w * 0.16), y1 - 22], fill=rgb(255, 226, 130, 160))
    # traveling gold specular (no hue rotate)
    sx = int(x0 + 24 + spec * (body_w * 0.45))
    bd.ellipse([sx, y0 + 16, sx + int(S * 0.14), y0 + int(S * 0.18)], fill=rgb(255, 244, 196, 140))
    canvas.alpha_composite(body)

    rd = ImageDraw.Draw(canvas, "RGBA")
    # rivets
    for rx, ry in ((x0 + 26, y0 + 26), (x1 - 26, y0 + 26), (x0 + 26, y1 - 26), (x1 - 26, y1 - 26)):
        rd.ellipse([rx - 8, ry - 8, rx + 8, ry + 8], fill=rgb(92, 64, 16), outline=rgb(232, 192, 78), width=3)
        rd.ellipse([rx - 3, ry - 4, rx + 1, ry], fill=rgb(255, 230, 140, 180))

    # keyhole
    kx, ky = cx, int(y0 + body_h * 0.58)
    rd.ellipse([kx - 18, ky - 24, kx + 18, ky + 12], fill=rgb(24, 16, 8), outline=rgb(78, 52, 14), width=4)
    rd.polygon([(kx - 9, ky + 6), (kx + 9, ky + 6), (kx + 7, ky + 40), (kx - 7, ky + 40)], fill=rgb(24, 16, 8))
    rd.ellipse([kx - 8, ky - 18, kx + 5, ky - 4], fill=rgb(90, 68, 28, 160))

    # LED — red locked / green unlocked. Pulse only. Never rainbow.
    led_y = y0 + int(S * 0.065)
    led_r = int(S * 0.032 + pulse * S * 0.01)
    if open_shackle:
        glow_c = (36, 220, 88, int(36 + 50 * pulse))
        core = rgb(90 + 50 * pulse, 255, 120)
        rim = rgb(16, 92, 36)
    else:
        glow_c = (255, 36, 36, int(36 + 50 * pulse))
        core = rgb(255, 48 + 36 * pulse, 48)
        rim = rgb(120, 16, 16)
    glow = Image.new("RGBA", (S, S), (0, 0, 0, 0))
    gd = ImageDraw.Draw(glow, "RGBA")
    gr = led_r * 2
    gd.ellipse([cx - gr, led_y - gr, cx + gr, led_y + gr], fill=glow_c)
    canvas.alpha_composite(glow.filter(ImageFilter.GaussianBlur(6)))
    rd = ImageDraw.Draw(canvas, "RGBA")
    rd.ellipse([cx - led_r, led_y - led_r, cx + led_r, led_y + led_r], fill=core, outline=rim, width=3)
    rd.ellipse([cx - led_r // 2, led_y - led_r // 2 - 2, cx + 1, led_y], fill=(255, 255, 255, 200))

    return canvas.resize((SIZE, SIZE), Image.Resampling.LANCZOS)


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


if __name__ == "__main__":
    main()
