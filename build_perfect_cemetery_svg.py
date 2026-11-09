import cv2
import numpy as np

def build_perfect_cemetery_svg():
    img_path = r'C:\Holidays\Odyssey\Crimson Sky Cemetery Panorama.png'
    img = cv2.imread(img_path)
    if img is None:
        raise ValueError(f"Could not load image: {img_path}")
    h, w = img.shape[:2]
    print(f"Loaded {w}x{h} image")

    # Bilateral smoothing to remove compression artifacts while preserving comic line edges
    smooth = cv2.bilateralFilter(img, d=5, sigmaColor=25, sigmaSpace=25)

    # 1. Sky mask (Crimson Red background)
    # R > 115, R > B * 2.1, R > G * 2.1, B < 75
    sky_mask = (smooth[:, :, 2] > 115) & (smooth[:, :, 2] > smooth[:, :, 0] * 2.1) & (smooth[:, :, 2] > smooth[:, :, 1] * 2.1) & (smooth[:, :, 0] < 75)

    # 2. Moon detection (upper right circle around x: 1212, y: 141)
    moon_crop = smooth[:300, 1100:1300]
    moon_local = (moon_crop[:, :, 2] > 110) & (moon_crop[:, :, 0] > 90) & (moon_crop[:, :, 1] > 90)
    moon_mask = np.zeros((h, w), dtype=bool)
    moon_mask[:300, 1100:1300] = moon_local
    # Exclude moon from sky
    sky_mask = sky_mask & (~moon_mask)

    # 3. Solid black ink silhouettes (Mignola ink lineart & shadows)
    black_mask = (smooth[:, :, 2] < 35) & (smooth[:, :, 1] < 25) & (smooth[:, :, 0] < 28)
    # Ensure bottom 8 rows are solid black ground anchor
    black_mask[h-8:h, :] = True

    # 4. Stone architecture and tombstones
    stone_mask = (~sky_mask) & (~black_mask) & (~moon_mask)

    # Bridge stone under black mortar lines and cracks so red sky NEVER leaks through
    kernel_bridge = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (9, 9))
    stone_base_mask = (cv2.dilate(stone_mask.astype(np.uint8), kernel_bridge) > 0) & (~sky_mask) & (~moon_mask)

    # Tonal bands within stone architecture
    gray = cv2.cvtColor(smooth, cv2.COLOR_BGR2GRAY)
    stone_deep_mask = stone_base_mask & (gray < 68)
    stone_shadow_mask = stone_base_mask & (gray >= 68) & (gray < 90)
    stone_highlight_mask = stone_base_mask & (gray > 130)

    kernel_clean = cv2.getStructuringElement(cv2.MORPH_RECT, (2, 2))

    def mask_to_svg_paths(mask, min_area=8, approx_eps=0.45):
        clean = cv2.morphologyEx(mask.astype(np.uint8)*255, cv2.MORPH_OPEN, kernel_clean)
        contours, _ = cv2.findContours(clean, cv2.RETR_CCOMP, cv2.CHAIN_APPROX_TC89_KCOS)
        if not contours:
            return ""
        path_list = []
        for cnt in contours:
            if cv2.contourArea(cnt) < min_area:
                continue
            approx = cv2.approxPolyDP(cnt, approx_eps, True)
            if len(approx) < 3:
                continue
            pts = approx.reshape(-1, 2)
            d = f"M {pts[0][0]},{pts[0][1]} " + " ".join([f"L {p[0]},{p[1]}" for p in pts[1:]]) + " Z"
            path_list.append(d)
        return " ".join(path_list)

    print("Tracing stone base...")
    path_stone_base = mask_to_svg_paths(stone_base_mask, min_area=15, approx_eps=0.55)

    print("Tracing stone shadows...")
    path_stone_shadow = mask_to_svg_paths(stone_shadow_mask, min_area=12, approx_eps=0.5)

    print("Tracing stone deep shadows...")
    path_stone_deep = mask_to_svg_paths(stone_deep_mask, min_area=10, approx_eps=0.5)

    print("Tracing stone highlights...")
    path_stone_hi = mask_to_svg_paths(stone_highlight_mask, min_area=8, approx_eps=0.45)

    print("Tracing black ink lineart & silhouettes...")
    path_black = mask_to_svg_paths(black_mask, min_area=5, approx_eps=0.42)

    svg_defs = '''  <defs>
    <filter id="moonGlow" x="-30%" y="-30%" width="160%" height="160%">
      <feGaussianBlur stdDeviation="5" result="blur" />
      <feComposite in="SourceGraphic" in2="blur" operator="over" />
    </filter>
    <linearGradient id="skyCrimson" x1="0" y1="0" x2="0" y2="100%">
      <stop offset="0%" stop-color="#FB383E" />
      <stop offset="35%" stop-color="#FA343A" />
      <stop offset="68%" stop-color="#CB2E33" />
      <stop offset="100%" stop-color="#80191D" />
    </linearGradient>
  </defs>'''

    elements = []
    # 1. Base Crimson Sky
    elements.append(f'  <!-- Base Crimson Sky -->\n  <rect width="{w}" height="{h}" fill="url(#skyCrimson)" />')

    # 2. Authentic Pale Moon
    elements.append('''  <!-- Pale Moon -->
  <circle cx="1212" cy="141" r="34" fill="#D6C2C4" filter="url(#moonGlow)" />
  <circle cx="1212" cy="141" r="32" fill="#E2CFD1" />''')

    # 3. Stone Architecture Base (Exact OG color #8D6B6D)
    if path_stone_base:
        elements.append(f'  <!-- Stone Architecture Base (OG Stone Mauve) -->\n  <path d="{path_stone_base}" fill="#8D6B6D" fill-rule="evenodd" />')

    # 4. Stone Shadows & Eaves
    if path_stone_shadow:
        elements.append(f'  <!-- Stone Shadows (OG Receding Walls) -->\n  <path d="{path_stone_shadow}" fill="#735557" fill-rule="evenodd" />')

    if path_stone_deep:
        elements.append(f'  <!-- Stone Deep Shadows (OG Under-Eaves) -->\n  <path d="{path_stone_deep}" fill="#5A4144" fill-rule="evenodd" />')

    if path_stone_hi:
        elements.append(f'  <!-- Stone Highlights -->\n  <path d="{path_stone_hi}" fill="#A58387" fill-rule="evenodd" />')

    # 5. Foreground Comic Ink Silhouettes & Mortar Lines
    if path_black:
        elements.append(f'  <!-- Void Black Comic Lineart & Silhouettes -->\n  <path d="{path_black}" fill="#0D0D0D" fill-rule="evenodd" stroke="#0D0D0D" stroke-width="0.5" stroke-linejoin="round" />')

    # Edge-to-edge solid ground anchor at the bottom
    elements.append(f'  <!-- Edge-to-edge ground anchor -->\n  <rect x="0" y="{h-15}" width="{w}" height="15" fill="#0D0D0D" />')

    header = f'<svg viewBox="0 0 {w} {h}" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">\n{svg_defs}\n'
    footer = '</svg>\n'

    full_svg = header + "\n".join(elements) + "\n" + footer

    out_file = 'frontend/public/paper-landscape.svg'
    with open(out_file, 'w', encoding='utf-8') as f:
        f.write(full_svg)

    print(f"Successfully generated perfect SVG at {out_file}! Size: {len(full_svg):,} bytes.")

if __name__ == '__main__':
    build_perfect_cemetery_svg()

