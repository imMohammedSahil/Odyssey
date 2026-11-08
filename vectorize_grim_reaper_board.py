import cv2
import numpy as np
import time
import os

def pts_to_smooth_path(pts, sharp_angle_deg=45.0):
    n = len(pts)
    if n < 3:
        return ""
    cos_sharp = np.cos(np.radians(sharp_angle_deg))
    is_sharp = []
    for i in range(n):
        p_prev = pts[(i - 1) % n]
        p_curr = pts[i]
        p_next = pts[(i + 1) % n]
        v1 = p_curr - p_prev
        v2 = p_next - p_curr
        n1 = np.linalg.norm(v1)
        n2 = np.linalg.norm(v2)
        if n1 == 0 or n2 == 0:
            is_sharp.append(True)
            continue
        v1 /= n1
        v2 /= n2
        dot = np.clip(np.dot(v1, v2), -1.0, 1.0)
        is_sharp.append(dot < cos_sharp)

    mids = [(pts[i] + pts[(i + 1) % n]) / 2.0 for i in range(n)]
    d_parts = [f"M {mids[0][0]:.1f},{mids[0][1]:.1f}"]
    for i in range(n):
        nxt = (i + 1) % n
        curr_pt = pts[nxt]
        nxt_mid = mids[nxt]
        if is_sharp[nxt]:
            d_parts.append(f"L {curr_pt[0]:.1f},{curr_pt[1]:.1f} L {nxt_mid[0]:.1f},{nxt_mid[1]:.1f}")
        else:
            d_parts.append(f"Q {curr_pt[0]:.1f},{curr_pt[1]:.1f} {nxt_mid[0]:.1f},{nxt_mid[1]:.1f}")
    d_parts.append("Z")
    return " ".join(d_parts)

def extract_paths(mask, min_area=8, approx_eps=0.45, sharp_angle=45.0):
    contours, _ = cv2.findContours(mask.astype(np.uint8), cv2.RETR_CCOMP, cv2.CHAIN_APPROX_TC89_KCOS)
    paths = []
    for cnt in contours:
        if cv2.contourArea(cnt) < min_area:
            continue
        approx = cv2.approxPolyDP(cnt, approx_eps, True)
        if len(approx) < 3:
            continue
        pts = approx.reshape(-1, 2).astype(float)
        p_str = pts_to_smooth_path(pts, sharp_angle_deg=sharp_angle)
        if p_str:
            paths.append(p_str)
    return paths

def build_accurate_grim_reaper_svg():
    t0 = time.time()
    img_path = 'grim_reaper_board_reference.jpg'
    img = cv2.imread(img_path)
    if img is None:
        raise ValueError(f"Could not load image: {img_path}")

    h, w = img.shape[:2] # 1024 x 935
    print(f"Loaded {w}x{h} reference image in {time.time()-t0:.2f}s")

    # Bilateral smoothing for noise-free comic art cel separation
    smooth = cv2.bilateralFilter(img, d=5, sigmaColor=25, sigmaSpace=25)
    gray = cv2.cvtColor(smooth, cv2.COLOR_BGR2GRAY)
    b, g, r = smooth[:, :, 0], smooth[:, :, 1], smooth[:, :, 2]
    hsv = cv2.cvtColor(smooth, cv2.COLOR_BGR2HSV)

    # 1. Total Foreground Silhouette (Mask out outside background)
    fg_mask = (gray >= 15) | (r >= 20) | (g >= 20) | (b >= 20)
    kernel_fg = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (5, 5))
    clean_fg = cv2.morphologyEx(fg_mask.astype(np.uint8), cv2.MORPH_CLOSE, kernel_fg) > 0

    # Remove floating bottom tail artifact (spurious dangling flap below base stones)
    clean_fg[956:, :] = False
    clean_fg[945:, 380:510] = False

    # 2. Glowing Eyes of the Grim Reaper
    eye_zone = np.zeros_like(gray, dtype=bool)
    eye_zone[85:140, 430:510] = True
    eyes_halo = eye_zone & (g > 120) & (g > r * 0.95) & (g > b * 0.95)
    eyes_core = eye_zone & (g > 165)
    eyes_hotspot = eye_zone & (g > 195)

    # 3. Lantern & Candle Flames
    flame_halo = (r > 185) & (g > 75) & (b < 110) & (r > g * 1.08)
    flame_core = (r > 220) & (g > 130) & (b < 95)
    flame_center = (r > 240) & (g > 190) & (b < 120)

    # 4. QR Code Zone Preparation:
    # In the reference image, the center of the parchment scroll has an un-scannable static QR code (x: 365-585, y: 385-595).
    # We clear out the static QR code noise from the parchment so it forms a clean antique background,
    # and preserve the surrounding red occult sigil ring and triquetra!
    qr_inner_zone = np.zeros_like(gray, dtype=bool)
    qr_inner_zone[385:595, 365:585] = True

    # 5. Clean Heraldic Fabrics & Carved Relief Text (ZERO Blood Splatters)
    y_grid, x_grid = np.ogrid[:h, :w]

    # Legitimate Heraldic & Architectural Zones:
    roi_right_banner = (x_grid >= 685) & (x_grid <= 815) & (y_grid >= 340) & (y_grid <= 630)
    roi_left_banner = (x_grid >= 110) & (x_grid <= 210) & (y_grid >= 310) & (y_grid <= 570)
    roi_left_ribbon = (x_grid >= 130) & (x_grid <= 220) & (y_grid >= 780) & (y_grid <= 930)
    roi_center_crest = (x_grid >= 460) & (x_grid <= 490) & (y_grid >= 285) & (y_grid <= 318)
    roi_plaque_text = (y_grid >= 630) & (y_grid <= 700) & (x_grid >= 220) & (x_grid <= 740)

    allowed_red_zone = roi_right_banner | roi_left_banner | roi_left_ribbon | roi_center_crest | roi_plaque_text

    raw_red_rich = (r > 90) & (r > g * 1.35) & (r > b * 1.35)
    raw_red_bright = (r > 135) & (r > g * 1.45) & (r > b * 1.45)
    raw_red_dark = (r > 60) & (r > g * 1.22) & (r > b * 1.22) & (~raw_red_rich)

    # Filtered red: only legitimate banners, emblems, and carved text remain. All blood splatters eliminated!
    red_rich = raw_red_rich & allowed_red_zone
    red_bright = raw_red_bright & allowed_red_zone
    red_dark = raw_red_dark & allowed_red_zone

    # Sigil on parchment is cleaned (zero blood splatters on scroll)
    sigil_mask = np.zeros_like(gray, dtype=bool)

    # 6. Carved Wood Plaque Typography
    # "MAKE YOUR OFFERING"
    text_make_offering = roi_plaque_text & raw_red_rich
    text_make_offering_bright = roi_plaque_text & raw_red_bright

    # "TO COMPLETE THE RITUAL"
    text_to_complete = (y_grid >= 700) & (y_grid <= 740) & (x_grid >= 225) & (x_grid <= 735) & (gray > 110)
    text_to_complete_bright = (y_grid >= 700) & (y_grid <= 740) & (x_grid >= 225) & (x_grid <= 735) & (gray > 150)

    # "✦ Present your tribute through the sacred sigil below. ✦"
    text_subtitle = (y_grid >= 740) & (y_grid <= 775) & (x_grid >= 250) & (x_grid <= 700) & (gray > 75) & (gray < 170)

    # Right Banner Printer / Campus Icon
    printer_icon = (y_grid >= 425) & (y_grid <= 530) & (x_grid >= 740) & (x_grid <= 805) & (gray > 95) & (r > 115) & (g > 75)

    # 7. Clean Antique Parchment Scroll Paper (Seamless, Unstained & Pristine)
    parch_zone = (y_grid >= 290) & (y_grid <= 650) & (x_grid >= 250) & (x_grid <= 690)
    raw_parch = parch_zone & ((gray > 55) | (r > 70)) & (x_grid >= 260) & (x_grid <= 680)
    k_parch = cv2.getStructuringElement(cv2.MORPH_RECT, (11, 11))
    parch_closed = cv2.morphologyEx(raw_parch.astype(np.uint8), cv2.MORPH_CLOSE, k_parch)
    contours_p, _ = cv2.findContours(parch_closed, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
    parch_mask = np.zeros_like(gray, dtype=bool)
    if contours_p:
        cnt_p = max(contours_p, key=cv2.contourArea)
        cv2.drawContours(parch_mask.view(np.uint8), [cnt_p], -1, 1, thickness=-1)

    parchment_body = parch_mask & clean_fg & (~flame_halo)
    parchment_light = parchment_body & (gray > 130) & (~qr_inner_zone)

    # 8. Skeletal Claws & Wax Pillars
    bone_zone = np.zeros_like(gray, dtype=bool)
    bone_zone[150:350, 100:300] = True # left hand claws
    bone_zone[150:350, 700:900] = True # right hand claws
    bone_zone[800:950, 600:750] = True # bottom right candle wax
    bone_zone[150:280, 650:750] = True # top right candle wax
    bone_zone[770:880, 120:340] = True # book pages / edges
    bone_body = bone_zone & (gray > 85) & (r > 85) & (g > 75) & (b > 65) & (~red_rich)
    bone_light = bone_zone & (gray > 135) & (r > 135) & (g > 120) & (b > 100) & (~red_rich)

    # 9. Stone Rubble at Base
    stone_zone = (y_grid >= 820)
    stone_body = stone_zone & clean_fg & (gray > 35) & (~red_rich) & (~flame_halo) & (~bone_body)
    stone_mid = stone_zone & clean_fg & (gray > 65) & (~red_rich) & (~flame_halo) & (~bone_body)
    stone_light = stone_zone & clean_fg & (gray > 100) & (~red_rich) & (~flame_halo) & (~bone_body)

    # 10. Weathered Timber Planks & Cloak Folds
    wood_mask = clean_fg & (~parchment_body) & (~bone_body) & (~red_rich) & (~stone_body) & (~flame_halo) & (~eyes_halo)
    wood_deep = wood_mask & (gray > 22) & (gray <= 48)
    wood_mid = wood_mask & (gray > 48) & (gray <= 80)
    wood_light = wood_mask & (gray > 80) & (gray <= 125)
    wood_highlight = wood_mask & (gray > 125)

    # 11. Comic Void Black Inking
    # Exclude bright flames, eyes, parchment QR inner zone, and bright text
    ink_exclude = eyes_halo | flame_halo | qr_inner_zone | text_make_offering | text_to_complete | text_subtitle
    ink_mask = clean_fg & (gray < 32) & (~ink_exclude)

    print("Extracting detailed smooth SVG paths...")
    svg_parts = []
    svg_parts.append('<!-- Odyssey Gothic Grim Reaper Ritual Shrine - 100% Pure Vector Asset -->')
    svg_parts.append(f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {w} {h}" width="100%" height="100%" fill="none" style="overflow: visible;">')
    
    # SVG Definitions
    svg_parts.append('''  <defs>
    <!-- Occult Green Eye Glow Filter -->
    <filter id="reaperEyePulse" x="-60%" y="-60%" width="220%" height="220%">
      <feGaussianBlur in="SourceGraphic" stdDeviation="4" result="blur1" />
      <feGaussianBlur in="SourceGraphic" stdDeviation="8" result="blur2" />
      <feMerge>
        <feMergeNode in="blur2" />
        <feMergeNode in="blur1" />
        <feMergeNode in="SourceGraphic" />
      </feMerge>
    </filter>

    <!-- Warm Fire Flame Glow Filter -->
    <filter id="ritualFlameGlow" x="-50%" y="-50%" width="200%" height="200%">
      <feGaussianBlur in="SourceGraphic" stdDeviation="3.5" result="flameBlur" />
      <feMerge>
        <feMergeNode in="flameBlur" />
        <feMergeNode in="SourceGraphic" />
      </feMerge>
    </filter>

    <!-- Green Eyes Radial Gradient -->
    <radialGradient id="greenEyeGrad" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#E8FFF2" />
      <stop offset="35%" stop-color="#38E54D" />
      <stop offset="75%" stop-color="#14732C" />
      <stop offset="100%" stop-color="#083814" />
    </radialGradient>

    <!-- Hanging Lantern Radial Flame (Matches Background Gothic Lanterns) -->
    <radialGradient id="lanternFlameGrad" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#FFF6B8" />
      <stop offset="25%" stop-color="#FFA62B" />
      <stop offset="65%" stop-color="#FF3814" />
      <stop offset="100%" stop-color="#6B0E06" />
    </radialGradient>

    <!-- Candle Flame Radial -->
    <radialGradient id="candleFlameGrad" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#FFFFF0" />
      <stop offset="30%" stop-color="#FFA826" />
      <stop offset="70%" stop-color="#E63810" />
      <stop offset="100%" stop-color="#6B1309" />
    </radialGradient>

    <!-- Moonlit Antique Parchment Paper Shading Gradient -->
    <linearGradient id="parchmentGrad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#C8C2B7" />
      <stop offset="50%" stop-color="#DDD7CB" />
      <stop offset="100%" stop-color="#BFB8AB" />
    </linearGradient>

    <!-- Atmospheric Ground Fog Drift across Base Rocks -->
    <linearGradient id="shrineGroundMist" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#2D3B40" stop-opacity="0" />
      <stop offset="55%" stop-color="#223035" stop-opacity="0.3" />
      <stop offset="100%" stop-color="#141E22" stop-opacity="0.75" />
    </linearGradient>
  </defs>''')

    # Group: Character & Shrine Container
    svg_parts.append('  <g id="ritualShrineGroup" class="shrine-vector-group">')

    # Layer 0: Deep Silhouette Underlay (Matches Gothic Midnight Void)
    fg_paths = extract_paths(clean_fg, min_area=80, approx_eps=0.7)
    if fg_paths:
        svg_parts.append(f'    <!-- Layer 0: Silhouette Base -->')
        svg_parts.append(f'    <path d="{" ".join(fg_paths)}" fill="#0E1418" />')

    # Layer 1: Dark Wood & Cloak Folds (Cold Gothic Slate Wood)
    w_deep_paths = extract_paths(wood_deep, min_area=12, approx_eps=0.55)
    if w_deep_paths:
        svg_parts.append(f'    <!-- Layer 1: Deep Timber & Robe Shadows -->')
        svg_parts.append(f'    <path d="{" ".join(w_deep_paths)}" fill="#1B2328" />')

    # Layer 2: Stone Rubble & Cobblestone Base (Matches Graveyard Cobblestone Path & Teal-Moss)
    st_b_paths = extract_paths(stone_body, min_area=10, approx_eps=0.55)
    if st_b_paths:
        svg_parts.append(f'    <!-- Layer 2: Boulders & Stone Rubble -->')
        svg_parts.append(f'    <path d="{" ".join(st_b_paths)}" fill="#232E35" />')
    st_m_paths = extract_paths(stone_mid, min_area=10, approx_eps=0.5)
    if st_m_paths:
        svg_parts.append(f'    <path d="{" ".join(st_m_paths)}" fill="#384750" />')
    st_l_paths = extract_paths(stone_light, min_area=10, approx_eps=0.5)
    if st_l_paths:
        svg_parts.append(f'    <path d="{" ".join(st_l_paths)}" fill="#546B64" />')

    # Layer 3: Midtone Timber Planks (Weathered Bog Oak)
    w_mid_paths = extract_paths(wood_mid, min_area=10, approx_eps=0.5)
    if w_mid_paths:
        svg_parts.append(f'    <!-- Layer 3: Weathered Timber Planks -->')
        svg_parts.append(f'    <path d="{" ".join(w_mid_paths)}" fill="#2D3941" />')

    # Layer 4: Timber Grain & Edge Highlights (Moonlit Slate Relief)
    w_l_paths = extract_paths(wood_light, min_area=10, approx_eps=0.5)
    if w_l_paths:
        svg_parts.append(f'    <!-- Layer 4: Timber Grain & Edge Relief -->')
        svg_parts.append(f'    <path d="{" ".join(w_l_paths)}" fill="#445560" />')
    w_hl_paths = extract_paths(wood_highlight, min_area=8, approx_eps=0.45)
    if w_hl_paths:
        svg_parts.append(f'    <path d="{" ".join(w_hl_paths)}" fill="#667C88" />')

    # Layer 5: Bone Claws & Dripping Wax Pillars (Aged Skeletal Ivory)
    b_b_paths = extract_paths(bone_body, min_area=8, approx_eps=0.45)
    if b_b_paths:
        svg_parts.append(f'    <!-- Layer 5: Skeletal Claws & Candle Wax -->')
        svg_parts.append(f'    <path d="{" ".join(b_b_paths)}" fill="#6E726E" />')
    b_l_paths = extract_paths(bone_light, min_area=8, approx_eps=0.45)
    if b_l_paths:
        svg_parts.append(f'    <path d="{" ".join(b_l_paths)}" fill="#AEAFA2" />')

    # Layer 6: Red Fabric Banners & Ribbons (Gothic Crimson)
    r_dark_paths = extract_paths(red_dark, min_area=8, approx_eps=0.5)
    if r_dark_paths:
        svg_parts.append(f'    <!-- Layer 6: Crimson Fabric & Ribbons -->')
        svg_parts.append(f'    <path d="{" ".join(r_dark_paths)}" fill="#4A1210" />')
    r_rich_paths = extract_paths(red_rich, min_area=8, approx_eps=0.45)
    if r_rich_paths:
        svg_parts.append(f'    <path d="{" ".join(r_rich_paths)}" fill="#8E201A" />')
    r_bright_paths = extract_paths(red_bright, min_area=8, approx_eps=0.45)
    if r_bright_paths:
        svg_parts.append(f'    <path d="{" ".join(r_bright_paths)}" fill="#BA2820" />')

    # Right Banner Printer Icon
    pr_paths = extract_paths(printer_icon, min_area=4, approx_eps=0.4)
    if pr_paths:
        svg_parts.append(f'    <!-- Odyssey Print Emblem on Banner -->')
        svg_parts.append(f'    <path d="{" ".join(pr_paths)}" fill="#C4BCB0" />')

    # Layer 7: Torn Parchment Scroll Base & Shading (Moonlit Antique Vellum)
    p_b_paths = extract_paths(parchment_body, min_area=10, approx_eps=0.5)
    if p_b_paths:
        svg_parts.append(f'    <!-- Layer 7: Torn Parchment Scroll -->')
        svg_parts.append(f'    <path d="{" ".join(p_b_paths)}" fill="url(#parchmentGrad)" />')
    p_l_paths = extract_paths(parchment_light, min_area=10, approx_eps=0.45)
    if p_l_paths:
        svg_parts.append(f'    <path d="{" ".join(p_l_paths)}" fill="#ECE7DD" />')

    # Layer 8: Carved Plaque Typography
    t_crimson_paths = extract_paths(text_make_offering, min_area=4, approx_eps=0.35)
    if t_crimson_paths:
        svg_parts.append(f'    <!-- Carved Plaque: MAKE YOUR OFFERING -->')
        svg_parts.append(f'    <path d="{" ".join(t_crimson_paths)}" fill="#9C221A" />')
    t_crimson_br_paths = extract_paths(text_make_offering_bright, min_area=4, approx_eps=0.35)
    if t_crimson_br_paths:
        svg_parts.append(f'    <path d="{" ".join(t_crimson_br_paths)}" fill="#C82E24" />')

    t_white_paths = extract_paths(text_to_complete, min_area=4, approx_eps=0.35)
    if t_white_paths:
        svg_parts.append(f'    <!-- Carved Plaque: TO COMPLETE THE RITUAL -->')
        svg_parts.append(f'    <path d="{" ".join(t_white_paths)}" fill="#C6C2B8" />')
    t_white_br_paths = extract_paths(text_to_complete_bright, min_area=4, approx_eps=0.35)
    if t_white_br_paths:
        svg_parts.append(f'    <path d="{" ".join(t_white_br_paths)}" fill="#E6E2D8" />')

    t_sub_paths = extract_paths(text_subtitle, min_area=4, approx_eps=0.35)
    if t_sub_paths:
        svg_parts.append(f'    <!-- Carved Plaque: Subtitle & Star Glyph -->')
        svg_parts.append(f'    <path d="{" ".join(t_sub_paths)}" fill="#828E8C" />')

    # Layer 9: Comic Inking & Void Black Contours
    ink_paths = extract_paths(ink_mask, min_area=6, approx_eps=0.4)
    if ink_paths:
        svg_parts.append(f'    <!-- Layer 9: Mignola Comic Void Black Inking -->')
        svg_parts.append(f'    <path d="{" ".join(ink_paths)}" fill="#090E11" />')

    # Layer 10: Flickering Lantern & Candle Flames (Matches Background Lantern Flame Cores)
    f_halo_paths = extract_paths(flame_halo, min_area=5, approx_eps=0.4)
    if f_halo_paths:
        svg_parts.append(f'    <!-- Layer 10: Animated Ritual Flames -->')
        svg_parts.append(f'    <g id="ritualFlames" filter="url(#ritualFlameGlow)" class="flame-flicker-group">')
        svg_parts.append(f'      <path d="{" ".join(f_halo_paths)}" fill="#FF4414" />')
        f_core_paths = extract_paths(flame_core, min_area=4, approx_eps=0.35)
        if f_core_paths:
            svg_parts.append(f'      <path d="{" ".join(f_core_paths)}" fill="#FFA62B" />')
        f_cen_paths = extract_paths(flame_center, min_area=4, approx_eps=0.3)
        if f_cen_paths:
            svg_parts.append(f'      <path d="{" ".join(f_cen_paths)}" fill="#FFF4B8" />')
        svg_parts.append(f'    </g>')

    # Layer 11: Glowing Mint-Green Eyes
    eye_h_paths = extract_paths(eyes_halo, min_area=4, approx_eps=0.35)
    if eye_h_paths:
        svg_parts.append(f'    <!-- Layer 11: Occult Pulsing Green Eyes -->')
        svg_parts.append(f'    <g id="reaperPulsingEyes" filter="url(#reaperEyePulse)" class="eyes-pulse-group">')
        svg_parts.append(f'      <path d="{" ".join(eye_h_paths)}" fill="url(#greenEyeGrad)" />')
        eye_c_paths = extract_paths(eyes_core, min_area=3, approx_eps=0.3)
        if eye_c_paths:
            svg_parts.append(f'      <path d="{" ".join(eye_c_paths)}" fill="#61FF78" />')
        eye_hs_paths = extract_paths(eyes_hotspot, min_area=3, approx_eps=0.25)
        if eye_hs_paths:
            svg_parts.append(f'      <path d="{" ".join(eye_hs_paths)}" fill="#E6FFF0" />')
        svg_parts.append(f'    </g>')

    # Layer 12: Atmospheric Ground Fog Blend (Feathers the base boulders into the cobblestone mist)
    svg_parts.append('    <!-- Layer 12: Atmospheric Ground Mist Feather -->')
    svg_parts.append(f'    <path d="M 120,890 Q 460,860 830,890 L 830,956 L 120,956 Z" fill="url(#shrineGroundMist)" pointer-events="none" />')

    svg_parts.append('  </g>')
    svg_parts.append('</svg>')

    out_svg = "\n".join(svg_parts)
    out_path = 'frontend/public/grim-reaper-ritual-board.svg'
    with open(out_path, 'w', encoding='utf-8') as f:
        f.write(out_svg)

    print(f"Generated {out_path} ({len(out_svg)} bytes) in {time.time()-t0:.2f}s")

if __name__ == "__main__":
    build_accurate_grim_reaper_svg()
