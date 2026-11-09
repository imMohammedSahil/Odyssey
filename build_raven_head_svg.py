import cv2
import numpy as np
from vectorize_raven_receipt import extract_paths

def generate_raven_head():
    im = cv2.imread('Hooded Crow Perched on Parchment Scroll.png', cv2.IMREAD_UNCHANGED)
    if im is None:
        print("Image not found!")
        return

    # Use h_crop = 480 so the claws grip over the rod and the paper flap descends smoothly into the receipt card
    h_crop = 480
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

    # 1. Paper flap base under the rod (x: 235..789, y: 400..480)
    paper_mask = fg_mask & (g > 140) & (g > b + 3) & (r > 120) & (np.arange(h)[:, None] >= 390)
    paper_solid = paper_mask.copy()
    for y in range(430, h):
        paper_solid[y, 235:789] = True

    # 2. Bronze finials on the rod ends
    bronze_base = fg_mask & (r > 95) & (r > g + 4) & (g > b + 4) & (b < 120) & (np.arange(h)[:, None] >= 340) & (np.arange(h)[:, None] <= 450)

    # 3. Claw fingers full detection:
    # Paint full fingers on both left claw (x: 155..280) and right claw (x: 660..790) from y=345 to y=442
    y_coords = np.arange(h)[:, None]
    x_coords = np.arange(w)[None, :]
    
    # Left foot fingers: 4 distinct finger bands
    # Finger 1: 156..184, Finger 2: 185..214, Finger 3: 215..244, Finger 4: 245..275
    # Right foot fingers: 4 distinct finger bands
    # Finger 1: 665..694, Finger 2: 695..724, Finger 3: 725..754, Finger 4: 755..785
    claw_zones = (
        ((x_coords >= 155) & (x_coords <= 280)) |
        ((x_coords >= 660) & (x_coords <= 790))
    ) & (y_coords >= 345) & (y_coords <= 444) & fg_mask & (~bronze_base)

    # Claw fingers body: includes both the upper joint and the gripping tips crossing the rod
    claw_fingers = claw_zones & (gray >= 18) & (~paper_solid)

    # 4. Raven body midtones
    raven_mid = fg_mask & (gray >= 35) & (gray < 85) & (~paper_solid) & (~bronze_base) & (~claw_fingers)

    # 5. Raven highlights & feathers
    raven_hi = fg_mask & (gray >= 85) & (gray < 155) & (~paper_solid) & (~bronze_base) & (~claw_fingers)

    # 6. Deep black ink lines & rod shadow
    # Exclude claw finger interiors so the fingers stay cleanly painted
    black_ink = fg_mask & (gray < 35) & (~claw_fingers)

    svg_layers = []

    # Paper flap
    p_paper = extract_paths(paper_solid, min_area=15, approx_eps=0.4)
    if p_paper:
        svg_layers.append('  <!-- Paper Flap Base -->')
        svg_layers.append(f'  <path d="{" ".join(p_paper)}" fill="#daead4" fill-rule="evenodd" />')

    # Bronze rod cuffs
    p_bronze = extract_paths(bronze_base, min_area=8, approx_eps=0.4)
    if p_bronze:
        svg_layers.append('  <!-- Bronze Rod Collars -->')
        svg_layers.append(f'  <path d="{" ".join(p_bronze)}" fill="#9C6F42" fill-rule="evenodd" />')

    # Raven body & cloak midtones
    p_mid = extract_paths(raven_mid, min_area=10, approx_eps=0.45)
    if p_mid:
        svg_layers.append('  <!-- Raven Cloak & Timber -->')
        svg_layers.append(f'  <path d="{" ".join(p_mid)}" fill="#222B25" fill-rule="evenodd" />')

    # Raven feathers & highlights
    p_hi = extract_paths(raven_hi, min_area=8, approx_eps=0.4)
    if p_hi:
        svg_layers.append('  <!-- Feathers & Highlights -->')
        svg_layers.append(f'  <path d="{" ".join(p_hi)}" fill="#38473D" fill-rule="evenodd" />')

    # Painted Claw Fingers & Gripping Tips
    p_claws = extract_paths(claw_fingers, min_area=5, approx_eps=0.35)
    if p_claws:
        svg_layers.append('  <!-- Painted Claw Fingers & Gripping Tips (Full Length) -->')
        svg_layers.append(f'  <path d="{" ".join(p_claws)}" fill="#44594C" stroke="#1B261F" stroke-width="1.2" stroke-linejoin="round" fill-rule="evenodd" />')

    # Black ink lineart, feathers, and shadows
    p_ink = extract_paths(black_ink, min_area=8, approx_eps=0.4)
    if p_ink:
        svg_layers.append('  <!-- Ink Lineart, Hood Void & Rod Shadows -->')
        svg_layers.append(f'  <path d="{" ".join(p_ink)}" fill="#0D1310" stroke="#0D1310" stroke-width="0.5" stroke-linejoin="round" fill-rule="evenodd" />')

    # Talon nails: sharp claw hooks curling around the rod
    talon_hooks = [
        # Left foot talons
        "M 166 418 Q 170 435 174 440 Q 172 432 170 422 Z",
        "M 194 420 Q 200 438 206 443 Q 202 434 198 424 Z",
        "M 224 421 Q 230 438 236 443 Q 232 433 228 424 Z",
        "M 254 418 Q 259 434 264 439 Q 260 430 257 421 Z",
        # Right foot talons
        "M 676 418 Q 672 434 668 439 Q 671 430 674 421 Z",
        "M 705 421 Q 699 438 693 443 Q 697 433 701 424 Z",
        "M 735 420 Q 729 438 723 443 Q 727 434 731 424 Z",
        "M 764 418 Q 759 435 754 440 Q 757 432 760 422 Z",
    ]
    svg_layers.append('  <!-- Sharp Talon Hooks -->')
    svg_layers.append(f'  <path d="{" ".join(talon_hooks)}" fill="#080C0A" stroke="#080C0A" stroke-width="0.8" />')

    # Occult Glowing Crimson Red Eyes (Perfect Almond Sockets with dual-layer intense glow)
    svg_layers.append('''  <!-- Occult Glowing Crimson Red Eyes -->
  <g class="raven-eyes-layer">
    <!-- Outer Crimson Aura -->
    <ellipse cx="468" cy="286" rx="14" ry="22" transform="rotate(22 468 286)" fill="#FF0D1A" filter="url(#redEyeGlow)" />
    <ellipse cx="588" cy="286" rx="14" ry="22" transform="rotate(-22 588 286)" fill="#FF0D1A" filter="url(#redEyeGlow)" />

    <!-- Vivid Red Eye Core -->
    <ellipse cx="468" cy="286" rx="13" ry="20" transform="rotate(22 468 286)" fill="#FF2635" />
    <ellipse cx="588" cy="286" rx="13" ry="20" transform="rotate(-22 588 286)" fill="#FF2635" />

    <!-- Hot Orange-Red Glint / Specular Slit -->
    <ellipse cx="469" cy="285" rx="5.5" ry="14" transform="rotate(22 469 285)" fill="#FFA2A2" opacity="0.92" />
    <ellipse cx="587" cy="285" rx="5.5" ry="14" transform="rotate(-22 587 285)" fill="#FFA2A2" opacity="0.92" />
  </g>''')

    defs = '''  <defs>
    <filter id="dropShadowBlur" x="-15%" y="-15%" width="130%" height="130%">
      <feGaussianBlur stdDeviation="8" />
    </filter>
    <filter id="redEyeGlow" x="-50%" y="-50%" width="200%" height="200%">
      <feGaussianBlur stdDeviation="4" result="blur1" />
      <feGaussianBlur stdDeviation="9" result="blur2" />
      <feMerge>
        <feMergeNode in="blur2" />
        <feMergeNode in="blur1" />
        <feMergeNode in="SourceGraphic" />
      </feMerge>
    </filter>
  </defs>'''

    svg_str = f'<svg viewBox="0 0 1024 {h_crop}" xmlns="http://www.w3.org/2000/svg" shape-rendering="geometricPrecision">\n{defs}\n' + '\n'.join(svg_layers) + '\n</svg>\n'

    with open('frontend/public/raven-receipt-top.svg', 'w', encoding='utf-8') as f:
        f.write(svg_str)

    print(f"Generated raven-receipt-top.svg! Size: {len(svg_str):,} bytes with almond crimson eyes and painted claw fingers!")

if __name__ == '__main__':
    generate_raven_head()
