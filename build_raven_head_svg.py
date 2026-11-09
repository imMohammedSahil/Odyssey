import cv2
import numpy as np
from vectorize_raven_receipt import extract_paths

def generate_raven_head():
    im = cv2.imread('Hooded Crow Perched on Parchment Scroll.png', cv2.IMREAD_UNCHANGED)
    if im is None:
        print("Image not found!")
        return

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

    # 3. Rod surface zones that user marked green to paint BLACK:
    # - Left rod conical tip (x < 130, y >= 360)
    # - Left rod strip (x: 180..220, y >= 370)
    # - Right rod strip between beak & right claw (x: 615..660, y >= 370)
    # - Right rod surface around/under right claw (x: 660..785, y >= 370)
    y_coords = np.arange(h)[:, None]
    x_coords = np.arange(w)[None, :]
    
    rod_marked_black = fg_mask & (y_coords >= 365) & (y_coords <= 445) & (
        (x_coords <= 135) |
        ((x_coords >= 185) & (x_coords <= 220)) |
        ((x_coords >= 615) & (x_coords <= 660)) |
        ((x_coords >= 695) & (x_coords <= 785))
    ) & (~bronze_base)

    # 4. Claw fingers (actual fingers only, excluding the rod surface)
    # Left foot: 4 fingers (160..180, 186..210, 216..240, 246..270)
    # Right foot: 3 visible fingers (660..695)
    claw_fingers = (
        (((x_coords >= 155) & (x_coords <= 280) & (y_coords <= 415)) |
         ((x_coords >= 160) & (x_coords <= 182) & (y_coords <= 438)) |
         ((x_coords >= 190) & (x_coords <= 212) & (y_coords <= 440)) |
         ((x_coords >= 220) & (x_coords <= 242) & (y_coords <= 440)) |
         ((x_coords >= 250) & (x_coords <= 272) & (y_coords <= 435)) |
         ((x_coords >= 660) & (x_coords <= 692) & (y_coords <= 438)))
    ) & fg_mask & (y_coords >= 345) & (~bronze_base) & (~paper_solid) & (~rod_marked_black)

    # 5. Raven body midtones (excluding the rod patches that must be black)
    raven_mid = fg_mask & (gray >= 35) & (gray < 85) & (~paper_solid) & (~bronze_base) & (~claw_fingers) & (~rod_marked_black)

    # 6. Raven feathers & highlights (strictly above the rod, y < 365, to keep rod pure black)
    raven_hi = fg_mask & (gray >= 85) & (gray < 155) & (y_coords < 365) & (~paper_solid) & (~bronze_base) & (~claw_fingers)

    # 7. Deep black ink lines, rod timber, and shadows (includes all marked rod patches!)
    black_ink = (fg_mask & (gray < 35) & (~claw_fingers)) | rod_marked_black

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

    # Painted Claw Fingers
    p_claws = extract_paths(claw_fingers, min_area=5, approx_eps=0.35)
    if p_claws:
        svg_layers.append('  <!-- Painted Claw Fingers -->')
        svg_layers.append(f'  <path d="{" ".join(p_claws)}" fill="#44594C" stroke="#1B261F" stroke-width="1.2" stroke-linejoin="round" fill-rule="evenodd" />')

    # Black ink lineart, wooden rod, and shadows (Rod is solid dark black!)
    p_ink = extract_paths(black_ink, min_area=8, approx_eps=0.4)
    if p_ink:
        svg_layers.append('  <!-- Ink Lineart, Solid Black Wood Rod & Shadows -->')
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
    ]
    svg_layers.append('  <!-- Sharp Talon Hooks -->')
    svg_layers.append(f'  <path d="{" ".join(talon_hooks)}" fill="#080C0A" stroke="#080C0A" stroke-width="0.8" />')

    # Occult Glowing Crimson Red Eyes (Positioned precisely at the user's arrow targets: x=524, y=315 and x=600, y=301)
    svg_layers.append('''  <!-- Occult Glowing Crimson Red Eyes (At Socket Arrow Targets) -->
  <g class="raven-eyes-layer">
    <!-- Outer Crimson Glow Aura -->
    <ellipse cx="524" cy="315" rx="11" ry="16" transform="rotate(18 524 315)" fill="#FF0D1A" filter="url(#redEyeGlow)" />
    <ellipse cx="600" cy="301" rx="11" ry="16" transform="rotate(-18 600 301)" fill="#FF0D1A" filter="url(#redEyeGlow)" />

    <!-- Vivid Red Eye Core -->
    <ellipse cx="524" cy="315" rx="10" ry="14" transform="rotate(18 524 315)" fill="#FF2635" />
    <ellipse cx="600" cy="301" rx="10" ry="14" transform="rotate(-18 600 301)" fill="#FF2635" />

    <!-- Hot Specular Glint Slit -->
    <ellipse cx="525" cy="314" rx="4" ry="10" transform="rotate(18 525 314)" fill="#FFA8A8" opacity="0.9" />
    <ellipse cx="599" cy="300" rx="4" ry="10" transform="rotate(-18 599 300)" fill="#FFA8A8" opacity="0.9" />
  </g>''')

    defs = '''  <defs>
    <filter id="dropShadowBlur" x="-15%" y="-15%" width="130%" height="130%">
      <feGaussianBlur stdDeviation="8" />
    </filter>
    <filter id="redEyeGlow" x="-50%" y="-50%" width="200%" height="200%">
      <feGaussianBlur stdDeviation="5" result="blur1" />
      <feGaussianBlur stdDeviation="10" result="blur2" />
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

    print(f"Generated raven-receipt-top.svg! Size: {len(svg_str):,} bytes with socket-aligned crimson eyes and solid black rod!")

if __name__ == '__main__':
    generate_raven_head()
