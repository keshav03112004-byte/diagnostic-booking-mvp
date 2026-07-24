from PIL import Image
from pathlib import Path

root = Path(r'e:\diagnostic-booking-mvp\public')
logo = Image.open(root / 'logo.png').convert('RGBA')
pixels = logo.load()
w, h = logo.size


def row_has_content(y):
    for x in range(w):
        r, g, b, a = pixels[x, y]
        if a > 20 and (r > 30 or g > 30 or b > 30):
            return True
    return False


content_ys = [y for y in range(h) if row_has_content(y)]
# Gap between icon and wordmark
gap_start = None
in_gap = False
for y in range(content_ys[0], content_ys[-1] + 1):
    has = row_has_content(y)
    if not has and not in_gap:
        in_gap = True
        gap_start = y
    elif has and in_gap:
        break

# Prefer icon-only crop (above the wordmark gap)
icon_bottom = (gap_start - 1) if gap_start else content_ys[-1]
icon = logo.crop((0, 0, w, icon_bottom + 1))

# Trim transparent / empty padding around the mark
alpha = icon.split()[-1]
bbox = alpha.getbbox()
if bbox:
    # Expand slightly so the plus sign isn't clipped
    pad_trim = 4
    l, t, r, b = bbox
    icon = icon.crop((
        max(0, l - pad_trim),
        max(0, t - pad_trim),
        min(icon.width, r + pad_trim),
        min(icon.height, b + pad_trim),
    ))

size = 512
# Small padding so the mark fills most of the favicon
edge = 18
canvas = Image.new('RGBA', (size, size), (255, 255, 255, 255))

iw, ih = icon.size
scale = min((size - edge * 2) / iw, (size - edge * 2) / ih)
nw, nh = max(1, int(iw * scale)), max(1, int(ih * scale))
resized = icon.resize((nw, nh), Image.Resampling.LANCZOS)

x = (size - nw) // 2
y = (size - nh) // 2
canvas.paste(resized, (x, y), resized)

out = Image.new('RGB', (size, size), (255, 255, 255))
out.paste(canvas, (0, 0), canvas)

# Also write a crisp 32/48 size for browser tabs
for name in ('favicon.png', 'apple-touch-icon.png'):
    out.save(root / name, 'PNG', optimize=True)

# Multi-size ICO for better browser tab clarity
ico_sizes = [(16, 16), (32, 32), (48, 48)]
ico_images = [out.resize(s, Image.Resampling.LANCZOS) for s in ico_sizes]
ico_images[0].save(
    root / 'favicon.ico',
    format='ICO',
    sizes=[(im.width, im.height) for im in ico_images],
    append_images=ico_images[1:],
)

print(f'icon crop: {icon.size}, favicon filled on white @ {size}x{size}')
print('saved favicon.png, apple-touch-icon.png, favicon.ico')
