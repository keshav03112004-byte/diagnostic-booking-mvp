"""Rebuild hero product visual from the exact design scan."""
from pathlib import Path
import numpy as np
from PIL import Image

ROOT = Path(r'e:\diagnostic-booking-mvp')
MOCK = ROOT / 'public' / 'hero-mockup-ref.png'
OUT = ROOT / 'public' / 'images' / 'hero-product.png'


def soft_edge_vignette(img: Image.Image, fade: int = 5) -> Image.Image:
    rgba = img.convert('RGBA')
    w, h = rgba.size
    alpha = np.full((h, w), 255, dtype=np.float32)
    for i in range(fade):
        t = i / max(fade, 1)
        s = t * t * (3 - 2 * t)
        a = 255.0 * s
        alpha[i, :] = np.minimum(alpha[i, :], a)
        alpha[h - 1 - i, :] = np.minimum(alpha[h - 1 - i, :], a)
        alpha[:, i] = np.minimum(alpha[:, i], a)
        alpha[:, w - 1 - i] = np.minimum(alpha[:, w - 1 - i], a)
    arr = np.asarray(rgba).astype(np.float32)
    arr[:, :, 3] = np.minimum(arr[:, :, 3], alpha)
    return Image.fromarray(arr.astype(np.uint8), 'RGBA')


def main():
    mock = Image.open(MOCK).convert('RGBA')
    w, h = mock.size
    crop = mock.crop((548, 100, w, 528))
    target_w = 780
    scale = target_w / crop.width
    crop = crop.resize((target_w, int(round(crop.height * scale))), Image.Resampling.LANCZOS)
    result = soft_edge_vignette(crop, fade=5)
    result.save(OUT, optimize=True)
    print('saved', OUT, result.size)


if __name__ == '__main__':
    main()
