import cv2
import numpy as np
from vectorize_raven_receipt import extract_paths

def generate_raven_head():
    im = cv2.imread('Hooded Crow Perched on Parchment Scroll.png', cv2.IMREAD_UNCHANGED)
    if im is None:
        print("Image not found!")
        return

    h_crop = 460
    crop = im[:h_crop, :, :]
    h, w, _ = crop.shape

    a = crop[:, :, 3]
    fg_mask = a > 20
    bgr = crop[:, :, :3]
    smooth = cv2.bilateralFilter(bgr, d=5, sigmaColor=25, sigmaSpace=25)
    gray = cv2.cvtColor(smooth, cv2.COLOR_BGR2GRAY)
    r = smooth[:, :, 2].astype(float)
    g = smooth[:, :, 1].astype(float)
    b = smooth[:, :, 0].astype(float)

    # 1. Paper flap base under the rod
    # Paper hangs from y=400 to y=460 across x=235..789
    paper_mask = fg_mask & (g > 140) & (g > b + 3) & (r > 120) & (np.arange(h)[:, None] >= 390)
    paper_solid = paper_mask.copy()
    for y in range(430, h):
        paper_solid[y, 235:789] = True

    # 2. Bronze finials on the rod ends
    bronze_base = fg_mask & (r > 95) & (r > g + 4) & (g > b + 4) & (b < 120) & (np.arange(h)[:, None] >= 340)

    # 3. Wooden rod body & raven midtones
    raven_mid = fg_mask & (gray >= 35) & (gray < 85) & (~paper_solid) & (~bronze_base)

    # 4. Raven highlights
    raven_hi = fg_mask & (gray >= 85) & (gray < 150) & (~paper_solid) & (~bronze_base)

    # 5. Glowing yellow-green eyes
    eyes_mask = fg_mask & (r > 175) & (g > 185) & (b < 140) & (np.arange(h)[:, None] < 260)

    # 6. Deep black ink lines, claws, feathers, and shadows
    black_ink = fg_mask & (gray < 35) & (~eyes_mask)

    svg_layers = []

    # Paper flap
    p_paper = extract_paths(paper_solid, min_area=15, approx_eps=0.4)
    if p_paper:
        svg_layers.append('  <!-- Paper Flap -->')
        svg_layers.append(f'  <path d="{" ".join(p_paper)}" fill="#daead4" fill-rule="evenodd" />')

    # Bronze rod cuffs
    p_bronze = extract_paths(bronze_base, min_area=8, approx_eps=0.4)
    if p_bronze:
        svg_layers.append('  <!-- Bronze Rod Collars -->')
        svg_layers.append(f'  <path d="{" ".join(p_bronze)}" fill="#9C6F42" fill-rule="evenodd" />')

    # Raven midtones
    p_mid = extract_paths(raven_mid, min_area=10, approx_eps=0.45)
    if p_mid:
        svg_layers.append('  <!-- Raven Cloak & Timber -->')
        svg_layers.append(f'  <path d="{" ".join(p_mid)}" fill="#222B25" fill-rule="evenodd" />')

    # Raven highlights
    p_hi = extract_paths(raven_hi, min_area=8, approx_eps=0.4)
    if p_hi:
        svg_layers.append('  <!-- Feathers & Highlights -->')
        svg_layers.append(f'  <path d="{" ".join(p_hi)}" fill="#38473D" fill-rule="evenodd" />')

    # Black ink lineart & claws
    p_ink = extract_paths(black_ink, min_area=10, approx_eps=0.4)
    if p_ink:
        svg_layers.append('  <!-- Ink Lineart & Claws -->')
        svg_layers.append(f'  <path d="{" ".join(p_ink)}" fill="#0D1310" stroke="#0D1310" stroke-width="0.5" stroke-linejoin="round" fill-rule="evenodd" />')

    # Eyes glow
    p_eyes = extract_paths(eyes_mask, min_area=2, approx_eps=0.25)
    if p_eyes:
        svg_layers.append('  <!-- Occult Glowing Eyes -->')
        svg_layers.append(f'  <path d="{" ".join(p_eyes)}" fill="#E5FF94" filter="url(#eyeGlow)" fill-rule="evenodd" />')

    defs = '''  <defs>
    <filter id="eyeGlow" x="-50%" y="-50%" width="200%" height="200%">
      <feGaussianBlur stdDeviation="4" result="blur" />
      <feMerge>
        <feMergeNode in="blur" />
        <feMergeNode in="SourceGraphic" />
      </feMerge>
    </filter>
  </defs>'''

    svg_str = f'<svg viewBox="0 0 1024 {h_crop}" xmlns="http://www.w3.org/2000/svg" shape-rendering="geometricPrecision">\n{defs}\n' + '\n'.join(svg_layers) + '\n</svg>\n'

    with open('frontend/public/raven-receipt-top.svg', 'w', encoding='utf-8') as f:
        f.write(svg_str)

    print(f"Generated raven-receipt-top.svg! Size: {len(svg_str):,} bytes")

if __name__ == '__main__':
    generate_raven_head()
