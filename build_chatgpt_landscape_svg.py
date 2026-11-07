import cv2
import numpy as np

def build_svg():
    img_path = r'C:\Holidays\Odyssey\Glowing Graveyard Gate in Green Fog.png'
    img = cv2.imread(img_path)
    if img is None:
        raise ValueError(f"Could not load image: {img_path}")
    h, w = img.shape[:2]
    print(f"Loaded {w}x{h} image")

    scale = 1280.0 / w
    target_w = int(w * scale)
    target_h = int(h * scale)
    resized = cv2.resize(img, (target_w, target_h), interpolation=cv2.INTER_AREA)

    smooth = cv2.bilateralFilter(resized, d=5, sigmaColor=22, sigmaSpace=22)
    gray = cv2.cvtColor(smooth, cv2.COLOR_BGR2GRAY)
    b, g, r = smooth[:, :, 0], smooth[:, :, 1], smooth[:, :, 2]

    # 1. Solid Black Comic Ink Lineart
    black_mask = (r < 44) & (g < 50) & (b < 44)
    black_mask[target_h-4:target_h, :] = True

    # EXCLUDE original "GRAVEYARD" letters from black mask so we can render "CHECKOUT"
    # Arch letters zone: y ~ 95..152, x ~ 642..848
    # Keep the lower iron arch bar (y >= 152) and upper filigree (y <= 95)
    for y in range(95, 152):
        for x in range(642, 848):
            # The arch curves up in the center: y_curve ≈ 148 - 35 * (1 - ((x - 745)/105)**2)
            # Mask out the letter bodies
            black_mask[y, x] = False

    # 2. Lantern Hot Cores & Warm Yellows
    lantern_core_mask = (r > 175) & (g > 185) & (b > 75)
    yellow_glass_mask = (r > 125) & (g > 135) & (b < 140) & (~lantern_core_mask) & (~black_mask)
    yellow_stone_glow = (r > 100) & (g > 125) & (b < 110) & (gray > 115) & (~lantern_core_mask) & (~yellow_glass_mask) & (~black_mask)

    # 3. Shovel wood handle
    wood_shovel_mask = (r > 80) & (r > g + 12) & (r > b + 25) & (~black_mask)

    # 4. Sky Zone
    roi_sky = np.zeros((target_h, target_w), dtype=bool)
    roi_sky[:int(target_h * 0.65), :] = True

    cloud_hi_mask = roi_sky & (gray > 175) & (g > 170) & (~lantern_core_mask) & (~yellow_glass_mask) & (~black_mask)
    cloud_mid_mask = roi_sky & (gray > 142) & (gray <= 175) & (g > 142) & (~lantern_core_mask) & (~yellow_glass_mask) & (~yellow_stone_glow) & (~black_mask)

    # 5. Distant Mist
    roi_mist = np.zeros((target_h, target_w), dtype=bool)
    roi_mist[int(target_h*0.45):int(target_h*0.75), :] = True
    mist_mask = roi_mist & (gray > 138) & (g > 142) & (~black_mask) & (~lantern_core_mask) & (~yellow_glass_mask)

    # 6. Grass & Cemetery Ground
    grass_mask = (g > 68) & (g > r * 1.18) & (g > b * 1.22) & (gray < 145) & (~black_mask) & (~yellow_stone_glow) & (~wood_shovel_mask)
    grass_hi_mask = grass_mask & (gray >= 95)
    grass_dark_mask = grass_mask & (gray < 95)

    # 7. Solid Ground Foundation
    non_sky = (gray < 142) | (smooth[:, :, 2] < 70) | (smooth[:, :, 1] < 125)
    non_sky[int(target_h*0.55):, :] = True
    k_bridge = cv2.getStructuringElement(cv2.MORPH_RECT, (5, 5))
    ground_base_mask = cv2.dilate(non_sky.astype(np.uint8), k_bridge) > 0

    # 8. Stone Tonal Layers
    stone_mask = non_sky & (~grass_mask) & (~black_mask) & (~wood_shovel_mask) & (~lantern_core_mask) & (~yellow_glass_mask) & (~yellow_stone_glow)
    stone_dark_mask = stone_mask & (gray < 72)
    stone_mid_mask = stone_mask & (gray >= 72) & (gray < 112)
    stone_hi_mask = stone_mask & (gray >= 112)

    kernel_clean = cv2.getStructuringElement(cv2.MORPH_RECT, (2, 2))
    def mask_to_svg_paths(mask, min_area=4, approx_eps=0.25):
        clean = cv2.morphologyEx(mask.astype(np.uint8) * 255, cv2.MORPH_OPEN, kernel_clean)
        contours, hierarchy = cv2.findContours(clean, cv2.RETR_CCOMP, cv2.CHAIN_APPROX_TC89_KCOS)
        if hierarchy is None or not contours:
            return ""
        paths = []
        for cnt in contours:
            if cv2.contourArea(cnt) < min_area:
                continue
            approx = cv2.approxPolyDP(cnt, approx_eps, True)
            if len(approx) < 3:
                continue
            pts = approx.reshape(-1, 2)
            d = f"M {pts[0][0]},{pts[0][1]} " + " ".join([f"L {p[0]},{p[1]}" for p in pts[1:]]) + " Z"
            paths.append(d)
        return " ".join(paths)

    print("Extracting paths...")
    path_ground_base = mask_to_svg_paths(ground_base_mask, min_area=20, approx_eps=0.45)
    path_cloud_mid = mask_to_svg_paths(cloud_mid_mask, min_area=10, approx_eps=0.35)
    path_cloud_hi = mask_to_svg_paths(cloud_hi_mask, min_area=10, approx_eps=0.35)
    path_mist = mask_to_svg_paths(mist_mask, min_area=8, approx_eps=0.35)
    path_grass_dark = mask_to_svg_paths(grass_dark_mask, min_area=8, approx_eps=0.28)
    path_grass_hi = mask_to_svg_paths(grass_hi_mask, min_area=8, approx_eps=0.28)
    path_stone_dark = mask_to_svg_paths(stone_dark_mask, min_area=8, approx_eps=0.26)
    path_stone_mid = mask_to_svg_paths(stone_mid_mask, min_area=6, approx_eps=0.24)
    path_stone_hi = mask_to_svg_paths(stone_hi_mask, min_area=5, approx_eps=0.22)
    path_yellow_stone = mask_to_svg_paths(yellow_stone_glow, min_area=4, approx_eps=0.20)
    path_wood = mask_to_svg_paths(wood_shovel_mask, min_area=3, approx_eps=0.18)
    path_yellow_glass = mask_to_svg_paths(yellow_glass_mask, min_area=3, approx_eps=0.18)
    path_lantern_core = mask_to_svg_paths(lantern_core_mask, min_area=3, approx_eps=0.18)
    path_black_ink = mask_to_svg_paths(black_mask, min_area=3, approx_eps=0.18)

    l_cx, l_cy = int(755 * scale), int(115 * scale)
    r_cx, r_cy = int(1165 * scale), int(185 * scale)

    # Curved iron text path matching the arch contour
    # Arch starts at (645, 155), peaks at (746, 114), ends at (848, 155)
    arch_curve = "M 644,152 Q 746,106 848,152"

    svg_defs = f'''  <defs>
    <linearGradient id="graveyardSky" x1="0" y1="0" x2="0" y2="100%">
      <stop offset="0%" stop-color="#336F5F" />
      <stop offset="30%" stop-color="#468F7A" />
      <stop offset="65%" stop-color="#5EAE93" />
      <stop offset="100%" stop-color="#78C6A8" />
    </linearGradient>

    <radialGradient id="leftLanternBloom" cx="{l_cx}" cy="{l_cy}" r="140" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#FFFEC9" stop-opacity="0.95" />
      <stop offset="20%" stop-color="#FDE465" stop-opacity="0.75" />
      <stop offset="50%" stop-color="#B8E676" stop-opacity="0.45" />
      <stop offset="80%" stop-color="#6DBA8E" stop-opacity="0.15" />
      <stop offset="100%" stop-color="#336F5F" stop-opacity="0" />
    </radialGradient>

    <radialGradient id="rightLanternBloom" cx="{r_cx}" cy="{r_cy}" r="120" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#FFFEC9" stop-opacity="0.95" />
      <stop offset="20%" stop-color="#FDE465" stop-opacity="0.75" />
      <stop offset="50%" stop-color="#B8E676" stop-opacity="0.45" />
      <stop offset="80%" stop-color="#6DBA8E" stop-opacity="0.15" />
      <stop offset="100%" stop-color="#336F5F" stop-opacity="0" />
    </radialGradient>

    <linearGradient id="mistGradient" x1="0" y1="0" x2="0" y2="100%">
      <stop offset="0%" stop-color="#D0FFEE" stop-opacity="0.9" />
      <stop offset="50%" stop-color="#9AF1C8" stop-opacity="0.65" />
      <stop offset="100%" stop-color="#56B790" stop-opacity="0.2" />
    </linearGradient>

    <filter id="softGlow" x="-30%" y="-30%" width="160%" height="160%">
      <feGaussianBlur stdDeviation="3.5" result="blur" />
      <feComposite in="SourceGraphic" in2="blur" operator="over" />
    </filter>

    <path id="archTextCurve" d="{arch_curve}" fill="none" />
  </defs>'''

    elements = []
    elements.append(f'  <!-- Layer 1: Atmospheric Night Sky -->\n  <rect width="{target_w}" height="{target_h}" fill="url(#graveyardSky)" />')
    elements.append(f'  <!-- Layer 2: Lantern Atmosphere Blooms -->')
    elements.append(f'  <circle cx="{l_cx}" cy="{l_cy}" r="140" fill="url(#leftLanternBloom)" />')
    elements.append(f'  <circle cx="{r_cx}" cy="{r_cy}" r="120" fill="url(#rightLanternBloom)" />')

    if path_cloud_mid:
        elements.append(f'  <!-- Layer 3: Cloud Midtones -->\n  <path d="{path_cloud_mid}" fill="#7AC4A7" fill-rule="evenodd" />')
    if path_cloud_hi:
        elements.append(f'  <!-- Layer 4: Cloud Highlights -->\n  <path d="{path_cloud_hi}" fill="#A6E6CD" fill-rule="evenodd" />')
    if path_ground_base:
        elements.append(f'  <!-- Layer 5: Ground Base Foundation -->\n  <path d="{path_ground_base}" fill="#162D26" fill-rule="evenodd" />')
    if path_grass_dark:
        elements.append(f'  <!-- Layer 6: Grass Dark Green -->\n  <path d="{path_grass_dark}" fill="#27563C" fill-rule="evenodd" />')
    if path_grass_hi:
        elements.append(f'  <!-- Layer 7: Grass Lime Highlights -->\n  <path d="{path_grass_hi}" fill="#40845C" fill-rule="evenodd" />')
    if path_mist:
        elements.append(f'  <!-- Layer 8: Eerie Cemetery Mist -->\n  <path d="{path_mist}" fill="url(#mistGradient)" fill-rule="evenodd" />')
    if path_stone_dark:
        elements.append(f'  <!-- Layer 9: Slate Stone Dark Shading -->\n  <path d="{path_stone_dark}" fill="#1F3C34" fill-rule="evenodd" />')
    if path_stone_mid:
        elements.append(f'  <!-- Layer 10: Cobblestone & Pillar Midtones -->\n  <path d="{path_stone_mid}" fill="#3B6358" fill-rule="evenodd" />')
    if path_stone_hi:
        elements.append(f'  <!-- Layer 11: Cobblestone & Pillar Highlights -->\n  <path d="{path_stone_hi}" fill="#5E8F81" fill-rule="evenodd" />')
    if path_yellow_stone:
        elements.append(f'  <!-- Layer 12: Warm Lantern Light Cast on Stone -->\n  <path d="{path_yellow_stone}" fill="#B8BE52" fill-rule="evenodd" />')
    if path_wood:
        elements.append(f'  <!-- Layer 13: Shovel Wooden Handle -->\n  <path d="{path_wood}" fill="#9E6738" fill-rule="evenodd" />')
    if path_yellow_glass:
        elements.append(f'  <!-- Layer 14: Glowing Lantern Glass Panes -->\n  <path d="{path_yellow_glass}" fill="#F4D048" fill-rule="evenodd" />')
    if path_lantern_core:
        elements.append(f'  <!-- Layer 15: White-Hot Lantern Core -->\n  <path d="{path_lantern_core}" fill="#FFFECF" fill-rule="evenodd" filter="url(#softGlow)" />')
    if path_black_ink:
        elements.append(f'  <!-- Layer 16: Razor-Sharp Comic Black Ink Lineart -->\n  <path d="{path_black_ink}" fill="#0A120E" fill-rule="evenodd" stroke="#0A120E" stroke-width="0.32" stroke-linejoin="round" />')

    # Layer 17: Curved Iron "CHECKOUT" Lettering along the arch
    arch_text_svg = '''  <!-- Layer 17: Gothic Iron Arch "CHECKOUT" Lettering -->
  <text font-family="'Titan One', 'Archivo Black', Impact, sans-serif" font-weight="900" font-size="25" fill="#0A120E" stroke="#0A120E" stroke-width="0.8" letter-spacing="4px">
    <textPath href="#archTextCurve" startOffset="50%" text-anchor="middle">
      CHECKOUT
    </textPath>
  </text>'''
    elements.append(arch_text_svg)

    header = f'<svg viewBox="0 0 {target_w} {target_h}" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">\n{svg_defs}\n'
    footer = '</svg>\n'

    full_svg = header + "\n".join(elements) + "\n" + footer

    out_file = 'frontend/public/graveyard-gate-landscape.svg'
    with open(out_file, 'w', encoding='utf-8') as f:
        f.write(full_svg)

    print(f"Generated 16:9 Vector SVG with CHECKOUT: {out_file} ({len(full_svg):,} bytes)")

if __name__ == '__main__':
    build_svg()
