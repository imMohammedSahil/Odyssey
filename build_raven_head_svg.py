import cv2
import numpy as np
from vectorize_raven_receipt import extract_paths

def generate_raven_head():
    im = cv2.imread('Hooded Crow Perched on Parchment Scroll.png', cv2.IMREAD_UNCHANGED)
    if im is None:
        print("Image not found!")
        return

    # Crop down to y=525 to capture full claw fingers and curved talons
    h_crop = 525
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
    # Paper hangs from y=400 to y=525 across x=235..789
    paper_mask = fg_mask & (g > 140) & (g > b + 3) & (r > 120) & (np.arange(h)[:, None] >= 390)
    paper_solid = paper_mask.copy()
    for y in range(430, h):
        paper_solid[y, 235:789] = True

    # 2. Bronze finials on the rod ends
    bronze_base = fg_mask & (r > 95) & (r > g + 4) & (g > b + 4) & (b < 120) & (np.arange(h)[:, None] >= 340) & (np.arange(h)[:, None] <= 450)

    # 3. Claw fingers detection (Left claw x: 155..290, Right claw x: 655..805, y: 350..525)
    y_coords = np.arange(h)[:, None]
    x_coords = np.arange(w)[None, :]
    claw_zone = fg_mask & (y_coords >= 345) & (y_coords <= 525) & (
        ((x_coords >= 155) & (x_coords <= 290)) | ((x_coords >= 655) & (x_coords <= 805))
    )
    # Claw fingers skin (slate/greenish midtones)
    claw_fingers = claw_zone & (gray >= 30) & (gray < 110) & (~bronze_base)

    # 4. Raven body midtones
    raven_mid = fg_mask & (gray >= 35) & (gray < 85) & (~paper_solid) & (~bronze_base) & (~claw_fingers)

    # 5. Raven highlights & claw highlights
    raven_hi = fg_mask & (gray >= 85) & (gray < 155) & (~paper_solid) & (~bronze_base)

    # 6. User-exact glowing crimson RED eyes
    user_im = cv2.imread(r'C:\Users\Mohammed sahil\.gemini\antigravity\brain\012f1c37-ea01-42e6-af50-d01d3f0d7b0f\.user_uploaded\media_1794195212746_1b68a51f.jpg')
    eyes_mask = np.zeros((h, w), dtype=bool)
    if user_im is not None:
        ub, ug, ur = user_im[:, :, 0], user_im[:, :, 1], user_im[:, :, 2]
        blue_draw = (ub > 180) & (ur < 50) & (ug < 140)

        # Left eye interior
        l_eye_box = blue_draw[210:305, 425:505]
        cnts_l, _ = cv2.findContours(l_eye_box.astype(np.uint8), cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_NONE)
        if len(cnts_l):
            c_left = max(cnts_l, key=cv2.contourArea)
            l_mask = np.zeros_like(l_eye_box, dtype=np.uint8)
            cv2.drawContours(l_mask, [c_left], -1, 255, -1)
            # erode slightly to avoid taking the blue border itself
            kernel = np.ones((3, 3), np.uint8)
            l_mask_clean = cv2.erode(l_mask, kernel)
            eyes_mask[210:305, 425:505] |= (l_mask_clean > 0)

        # Right eye interior
        r_eye_box = blue_draw[245:315, 585:648]
        cnts_r, _ = cv2.findContours(r_eye_box.astype(np.uint8), cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_NONE)
        if len(cnts_r):
            c_right = max(cnts_r, key=cv2.contourArea)
            r_mask = np.zeros_like(r_eye_box, dtype=np.uint8)
            cv2.drawContours(r_mask, [c_right], -1, 255, -1)
            r_mask_clean = cv2.erode(r_mask, kernel)
            eyes_mask[245:315, 585:648] |= (r_mask_clean > 0)

    # 7. Deep black ink lines, shadows, and talons
    black_ink = fg_mask & (gray < 35) & (~eyes_mask)

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

    # Claw fingers (painted full fingers and tips)
    p_claws = extract_paths(claw_fingers, min_area=6, approx_eps=0.35)
    if p_claws:
        svg_layers.append('  <!-- Claw Fingers & Gripping Tips -->')
        svg_layers.append(f'  <path d="{" ".join(p_claws)}" fill="#44594C" stroke="#25332A" stroke-width="0.5" fill-rule="evenodd" />')

    # Black ink lineart, claws curvature, and hood shadows
    p_ink = extract_paths(black_ink, min_area=8, approx_eps=0.4)
    if p_ink:
        svg_layers.append('  <!-- Ink Lineart, Hood Void & Talons -->')
        svg_layers.append(f'  <path d="{" ".join(p_ink)}" fill="#0D1310" stroke="#0D1310" stroke-width="0.5" stroke-linejoin="round" fill-rule="evenodd" />')

    # Occult Crimson Red Eyes (with vibrant glow and specular inner core)
    p_eyes = extract_paths(eyes_mask, min_area=4, approx_eps=0.3)
    if p_eyes:
        svg_layers.append('  <!-- Occult Glowing Crimson Red Eyes -->')
        svg_layers.append(f'  <path d="{" ".join(p_eyes)}" fill="#FF1E28" filter="url(#redEyeGlow)" fill-rule="evenodd" />')
        svg_layers.append(f'  <path d="{" ".join(p_eyes)}" fill="#FF3B30" fill-rule="evenodd" />')
        # Core inner glint
        eyes_eroded = cv2.erode(eyes_mask.astype(np.uint8), np.ones((4, 4), np.uint8)) > 0
        p_core = extract_paths(eyes_eroded, min_area=3, approx_eps=0.3)
        if p_core:
            svg_layers.append(f'  <path d="{" ".join(p_core)}" fill="#FFA8A8" opacity="0.85" fill-rule="evenodd" />')

    defs = '''  <defs>
    <filter id="dropShadowBlur" x="-15%" y="-15%" width="130%" height="130%">
      <feGaussianBlur stdDeviation="8" />
    </filter>
    <filter id="redEyeGlow" x="-50%" y="-50%" width="200%" height="200%">
      <feGaussianBlur stdDeviation="6" result="blur1" />
      <feGaussianBlur stdDeviation="12" result="blur2" />
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

    print(f"Generated raven-receipt-top.svg! Size: {len(svg_str):,} bytes with glowing red eyes and painted fingers!")

if __name__ == '__main__':
    generate_raven_head()
