import cv2
import numpy as np

def build_widescreen_svg():
    img_path = r'C:/Users/Mohammed sahil/.gemini/antigravity/brain/6ae0dc26-2eb3-43b0-98fa-53e04794531e/.user_uploaded/media_1794073222891_5d971939.jpg'
    img = cv2.imread(img_path)
    if img is None:
        raise ValueError(f"Could not load image: {img_path}")
    orig_h, orig_w = img.shape[:2] # 629 x 736

    # Target 16:9 widescreen canvas: 1120 x 630
    canvas_w = 1120
    canvas_h = 630
    ox = (canvas_w - orig_w) // 2 # 192

    # Smooth image
    smooth = cv2.bilateralFilter(img, d=5, sigmaColor=22, sigmaSpace=22)
    gray = cv2.cvtColor(smooth, cv2.COLOR_BGR2GRAY)
    b, g, r = smooth[:, :, 0], smooth[:, :, 1], smooth[:, :, 2]

    # Masks
    black_mask = (r < 44) & (g < 50) & (b < 44)
    black_mask[orig_h-4:orig_h, :] = True

    lantern_core_mask = (r > 175) & (g > 185) & (b > 75)
    yellow_glass_mask = (r > 125) & (g > 135) & (b < 140) & (~lantern_core_mask) & (~black_mask)
    yellow_stone_glow = (r > 100) & (g > 125) & (b < 110) & (gray > 115) & (~lantern_core_mask) & (~yellow_glass_mask) & (~black_mask)

    wood_shovel_mask = (r > 80) & (r > g + 12) & (r > b + 25) & (~black_mask)

    roi_shovel_blade = np.zeros((orig_h, orig_w), dtype=bool)
    roi_shovel_blade[545:625, 530:580] = True
    shovel_blade_mask = roi_shovel_blade & (gray >= 55) & (gray < 110) & (b > 50) & (~black_mask) & (~wood_shovel_mask)

    roi_sky_zone = np.zeros((orig_h, orig_w), dtype=bool)
    roi_sky_zone[:460, :] = True

    cloud_hi_mask = roi_sky_zone & (gray > 175) & (g > 170) & (~lantern_core_mask) & (~yellow_glass_mask) & (~black_mask)
    cloud_mid_mask = roi_sky_zone & (gray > 142) & (gray <= 175) & (g > 142) & (~lantern_core_mask) & (~yellow_glass_mask) & (~yellow_stone_glow) & (~black_mask)

    roi_mist = np.zeros((orig_h, orig_w), dtype=bool)
    roi_mist[390:530, 240:560] = True
    mist_mask = roi_mist & (gray > 138) & (g > 142) & (~black_mask) & (~lantern_core_mask) & (~yellow_glass_mask)

    grass_mask = (g > 68) & (g > r * 1.18) & (g > b * 1.22) & (gray < 145) & (~black_mask) & (~yellow_stone_glow) & (~wood_shovel_mask)
    grass_hi_mask = grass_mask & (gray >= 95)
    grass_dark_mask = grass_mask & (gray < 95)

    non_sky = (gray < 142) | (smooth[:, :, 2] < 70) | (smooth[:, :, 1] < 125)
    non_sky[:160, :300] = (gray[:160, :300] < 120)
    non_sky[:200, 560:] = (gray[:200, 560:] < 120)
    non_sky[380:, :] = True

    k_bridge = cv2.getStructuringElement(cv2.MORPH_RECT, (5, 5))
    ground_base_mask = cv2.dilate(non_sky.astype(np.uint8), k_bridge) > 0
    ground_base_mask[:350, 320:540] = ground_base_mask[:350, 320:540] & (gray[:350, 320:540] < 125)

    stone_mask = non_sky & (~grass_mask) & (~black_mask) & (~wood_shovel_mask) & (~shovel_blade_mask) & (~lantern_core_mask) & (~yellow_glass_mask) & (~yellow_stone_glow)
    stone_dark_mask = stone_mask & (gray < 72)
    stone_mid_mask = stone_mask & (gray >= 72) & (gray < 112)
    stone_hi_mask = stone_mask & (gray >= 112)

    kernel_clean = cv2.getStructuringElement(cv2.MORPH_RECT, (2, 2))
    def mask_to_svg_paths(mask, min_area=3, approx_eps=0.22, offset_x=ox):
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
            d = f"M {pts[0][0] + offset_x},{pts[0][1]} " + " ".join([f"L {p[0] + offset_x},{p[1]}" for p in pts[1:]]) + " Z"
            paths.append(d)
        return " ".join(paths)

    path_ground_base = mask_to_svg_paths(ground_base_mask, min_area=15, approx_eps=0.45)
    path_cloud_mid = mask_to_svg_paths(cloud_mid_mask, min_area=8, approx_eps=0.35)
    path_cloud_hi = mask_to_svg_paths(cloud_hi_mask, min_area=8, approx_eps=0.35)
    path_mist = mask_to_svg_paths(mist_mask, min_area=6, approx_eps=0.35)
    path_grass_dark = mask_to_svg_paths(grass_dark_mask, min_area=6, approx_eps=0.28)
    path_grass_hi = mask_to_svg_paths(grass_hi_mask, min_area=6, approx_eps=0.28)
    path_stone_dark = mask_to_svg_paths(stone_dark_mask, min_area=6, approx_eps=0.26)
    path_stone_mid = mask_to_svg_paths(stone_mid_mask, min_area=5, approx_eps=0.24)
    path_stone_hi = mask_to_svg_paths(stone_hi_mask, min_area=4, approx_eps=0.22)
    path_yellow_stone = mask_to_svg_paths(yellow_stone_glow, min_area=3, approx_eps=0.20)
    path_wood = mask_to_svg_paths(wood_shovel_mask, min_area=2, approx_eps=0.18)
    path_shovel_blade = mask_to_svg_paths(shovel_blade_mask, min_area=3, approx_eps=0.18)
    path_yellow_glass = mask_to_svg_paths(yellow_glass_mask, min_area=2, approx_eps=0.18)
    path_lantern_core = mask_to_svg_paths(lantern_core_mask, min_area=2, approx_eps=0.18)
    path_black_ink = mask_to_svg_paths(black_mask, min_area=2, approx_eps=0.18)

    # Widescreen wing fences on Left (0..ox) and Right (canvas_w-ox..canvas_w):
    # Left wing ground: y ~ 450 to 630
    left_ground = f"M 0,440 L {ox+10},460 L {ox+10},630 L 0,630 Z"
    # Right wing ground: y ~ 520 to 630
    right_ground = f"M {canvas_w - ox - 10},510 L {canvas_w},490 L {canvas_w},630 L {canvas_w - ox - 10},630 Z"
    
    # Left & Right decorative fence continuation
    fence_elements = []
    # Left pickets
    for fx in range(15, ox + 5, 24):
        fy_top = int(140 + (fx / ox) * 60)
        fy_bot = int(450 + (fx / ox) * 20)
        # picket
        fence_elements.append(f'<path d="M {fx-3},{fy_top+18} L {fx-3},{fy_bot} L {fx+3},{fy_bot} L {fx+3},{fy_top+18} Z" fill="#0A120E" />')
        # arrowhead spearhead
        fence_elements.append(f'<path d="M {fx},{fy_top} L {fx+8},{fy_top+18} L {fx-8},{fy_top+18} Z" fill="#0A120E" />')
    # Left horizontal rails
    fence_elements.append(f'<path d="M 0,260 L {ox+5},305 L {ox+5},313 L 0,268 Z" fill="#0A120E" />')
    fence_elements.append(f'<path d="M 0,380 L {ox+5},415 L {ox+5},423 L 0,388 Z" fill="#0A120E" />')

    # Right pickets
    for fx in range(canvas_w - ox - 5, canvas_w - 15, 26):
        rel = (fx - (canvas_w - ox)) / ox
        fy_top = int(320 + rel * 70)
        fy_bot = int(520 + rel * 20)
        fence_elements.append(f'<path d="M {fx-3},{fy_top+18} L {fx-3},{fy_bot} L {fx+3},{fy_bot} L {fx+3},{fy_top+18} Z" fill="#0A120E" />')
        fence_elements.append(f'<path d="M {fx},{fy_top} L {fx+8},{fy_top+18} L {fx-8},{fy_top+18} Z" fill="#0A120E" />')
    # Right horizontal rails
    fence_elements.append(f'<path d="M {canvas_w - ox - 5},450 L {canvas_w},485 L {canvas_w},493 L {canvas_w - ox - 5},458 Z" fill="#0A120E" />')

    fence_wings_svg = "\n  ".join(fence_elements)

    left_lamp_cx = 362 + ox
    left_lamp_cy = 75
    right_lamp_cx = 552 + ox
    right_lamp_cy = 122
    dist_lamp_cx = 417 + ox
    dist_lamp_cy = 414

    svg_defs = f'''  <defs>
    <!-- Sky Gradient -->
    <linearGradient id="graveyardSky" x1="0" y1="0" x2="0" y2="100%">
      <stop offset="0%" stop-color="#336F5F" />
      <stop offset="30%" stop-color="#468F7A" />
      <stop offset="65%" stop-color="#5EAE93" />
      <stop offset="100%" stop-color="#78C6A8" />
    </linearGradient>

    <!-- Glowing Lantern Bloom Radial Gradients -->
    <radialGradient id="leftLanternBloom" cx="{left_lamp_cx}" cy="{left_lamp_cy}" r="110" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#FFFEC9" stop-opacity="0.95" />
      <stop offset="20%" stop-color="#FDE465" stop-opacity="0.75" />
      <stop offset="50%" stop-color="#B8E676" stop-opacity="0.45" />
      <stop offset="80%" stop-color="#6DBA8E" stop-opacity="0.15" />
      <stop offset="100%" stop-color="#336F5F" stop-opacity="0" />
    </radialGradient>

    <radialGradient id="rightLanternBloom" cx="{right_lamp_cx}" cy="{right_lamp_cy}" r="95" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#FFFEC9" stop-opacity="0.95" />
      <stop offset="20%" stop-color="#FDE465" stop-opacity="0.75" />
      <stop offset="50%" stop-color="#B8E676" stop-opacity="0.45" />
      <stop offset="80%" stop-color="#6DBA8E" stop-opacity="0.15" />
      <stop offset="100%" stop-color="#336F5F" stop-opacity="0" />
    </radialGradient>

    <radialGradient id="distLanternBloom" cx="{dist_lamp_cx}" cy="{dist_lamp_cy}" r="35" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#FFFEC9" stop-opacity="0.95" />
      <stop offset="35%" stop-color="#FDD85D" stop-opacity="0.7" />
      <stop offset="70%" stop-color="#95D890" stop-opacity="0.3" />
      <stop offset="100%" stop-color="#5EAE93" stop-opacity="0" />
    </radialGradient>

    <!-- Mist Gradient -->
    <linearGradient id="mistGradient" x1="0" y1="0" x2="0" y2="100%">
      <stop offset="0%" stop-color="#D0FFEE" stop-opacity="0.9" />
      <stop offset="50%" stop-color="#9AF1C8" stop-opacity="0.65" />
      <stop offset="100%" stop-color="#56B790" stop-opacity="0.2" />
    </linearGradient>

    <filter id="softGlow" x="-30%" y="-30%" width="160%" height="160%">
      <feGaussianBlur stdDeviation="3.5" result="blur" />
      <feComposite in="SourceGraphic" in2="blur" operator="over" />
    </filter>
  </defs>'''

    elements = []
    # 1. Base Sky Rect (full 1120x630 canvas)
    elements.append(f'  <!-- Layer 1: Atmospheric Night Sky -->\n  <rect width="{canvas_w}" height="{canvas_h}" fill="url(#graveyardSky)" />')

    # 2. Lantern Glow Blooms
    elements.append(f'  <!-- Layer 2: Lantern Atmosphere Blooms -->')
    elements.append(f'  <circle cx="{left_lamp_cx}" cy="{left_lamp_cy}" r="110" fill="url(#leftLanternBloom)" />')
    elements.append(f'  <circle cx="{right_lamp_cx}" cy="{right_lamp_cy}" r="95" fill="url(#rightLanternBloom)" />')
    elements.append(f'  <circle cx="{dist_lamp_cx}" cy="{dist_lamp_cy}" r="35" fill="url(#distLanternBloom)" />')

    # 3. Clouds
    if path_cloud_mid:
        elements.append(f'  <!-- Layer 3: Cloud Midtones -->\n  <path d="{path_cloud_mid}" fill="#7AC4A7" fill-rule="evenodd" />')
    if path_cloud_hi:
        elements.append(f'  <!-- Layer 4: Cloud Highlights -->\n  <path d="{path_cloud_hi}" fill="#A6E6CD" fill-rule="evenodd" />')

    # 4. Solid Ground Foundation + Widescreen ground wings
    elements.append(f'  <!-- Layer 5: Ground Base & Wings -->\n  <path d="{left_ground} {right_ground}" fill="#162D26" />')
    if path_ground_base:
        elements.append(f'  <path d="{path_ground_base}" fill="#162D26" fill-rule="evenodd" />')

    # 5. Cemetery Grass & Turf
    if path_grass_dark:
        elements.append(f'  <!-- Layer 6: Grass Dark Green -->\n  <path d="{path_grass_dark}" fill="#27563C" fill-rule="evenodd" />')
    if path_grass_hi:
        elements.append(f'  <!-- Layer 7: Grass Lime Highlights -->\n  <path d="{path_grass_hi}" fill="#40845C" fill-rule="evenodd" />')

    # 6. Eerie Green Mist
    if path_mist:
        elements.append(f'  <!-- Layer 8: Eerie Cemetery Mist -->\n  <path d="{path_mist}" fill="url(#mistGradient)" fill-rule="evenodd" />')

    # 7. Stone Dark Shading
    if path_stone_dark:
        elements.append(f'  <!-- Layer 9: Slate Stone Dark Shading -->\n  <path d="{path_stone_dark}" fill="#1F3C34" fill-rule="evenodd" />')

    # 8. Cobblestone & Pillar Midtones
    if path_stone_mid:
        elements.append(f'  <!-- Layer 10: Cobblestone & Pillar Midtones -->\n  <path d="{path_stone_mid}" fill="#3B6358" fill-rule="evenodd" />')

    # 9. Cobblestone & Pillar Highlights
    if path_stone_hi:
        elements.append(f'  <!-- Layer 11: Cobblestone & Pillar Highlights -->\n  <path d="{path_stone_hi}" fill="#5E8F81" fill-rule="evenodd" />')

    # 10. Warm Yellow Light Cast on Pillars
    if path_yellow_stone:
        elements.append(f'  <!-- Layer 12: Warm Lantern Light Cast on Stone -->\n  <path d="{path_yellow_stone}" fill="#B8BE52" fill-rule="evenodd" />')

    # 11. Shovel
    if path_wood:
        elements.append(f'  <!-- Layer 13: Shovel Wooden Handle -->\n  <path d="{path_wood}" fill="#9E6738" fill-rule="evenodd" />')
    if path_shovel_blade:
        elements.append(f'  <!-- Layer 14: Shovel Steel Blade -->\n  <path d="{path_shovel_blade}" fill="#4D6E66" fill-rule="evenodd" />')

    # 12. Lantern Glass Panes
    if path_yellow_glass:
        elements.append(f'  <!-- Layer 15: Glowing Lantern Glass Panes -->\n  <path d="{path_yellow_glass}" fill="#F4D048" fill-rule="evenodd" />')

    # 13. White-Hot Flame Core
    if path_lantern_core:
        elements.append(f'  <!-- Layer 16: White-Hot Lantern Core -->\n  <path d="{path_lantern_core}" fill="#FFFECF" fill-rule="evenodd" filter="url(#softGlow)" />')

    # 14. Widescreen Fence Wings
    elements.append(f'  <!-- Layer 17: Widescreen Extension Fence Pickets -->\n  {fence_wings_svg}')

    # 15. Razor-Sharp Comic Black Ink Lineart
    if path_black_ink:
        elements.append(f'  <!-- Layer 18: Pure Vector Comic Black Ink Lineart -->\n  <path d="{path_black_ink}" fill="#0A120E" fill-rule="evenodd" stroke="#0A120E" stroke-width="0.32" stroke-linejoin="round" />')

    header = f'<svg viewBox="0 0 {canvas_w} {canvas_h}" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">\n{svg_defs}\n'
    footer = '</svg>\n'

    full_svg = header + "\n".join(elements) + "\n" + footer

    out_file = 'frontend/public/graveyard-gate-landscape.svg'
    with open(out_file, 'w', encoding='utf-8') as f:
        f.write(full_svg)

    print(f"Generated 16:9 Widescreen SVG: {out_file} ({len(full_svg):,} bytes)")

if __name__ == '__main__':
    build_widescreen_svg()
