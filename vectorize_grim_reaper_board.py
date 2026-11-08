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

    # 5. Red Fabrics, Heraldry, Ribbons, and Occult Sigil
    red_rich = (r > 90) & (r > g * 1.35) & (r > b * 1.35)
    red_bright = (r > 135) & (r > g * 1.45) & (r > b * 1.45)
    red_dark = (r > 60) & (r > g * 1.22) & (r > b * 1.22) & (~red_rich)

    # Sigil on parchment
    sigil_mask = red_rich & (r > 105) & (~qr_inner_zone)

    # 6. Carved Wood Plaque Typography
    y_grid, x_grid = np.ogrid[:h, :w]
    # "MAKE YOUR OFFERING"
    text_make_offering = (y_grid >= 630) & (y_grid <= 700) & (x_grid >= 220) & (x_grid <= 740) & red_rich
    text_make_offering_bright = (y_grid >= 630) & (y_grid <= 700) & (x_grid >= 220) & (x_grid <= 740) & red_bright

    # "TO COMPLETE THE RITUAL"
    text_to_complete = (y_grid >= 700) & (y_grid <= 740) & (x_grid >= 225) & (x_grid <= 735) & (gray > 110)
    text_to_complete_bright = (y_grid >= 700) & (y_grid <= 740) & (x_grid >= 225) & (x_grid <= 735) & (gray > 150)

    # "✦ Present your tribute through the sacred sigil below. ✦"
    text_subtitle = (y_grid >= 740) & (y_grid <= 775) & (x_grid >= 250) & (x_grid <= 700) & (gray > 75) & (gray < 170)

    # Right Banner Printer / Campus Icon
    printer_icon = (y_grid >= 425) & (y_grid <= 530) & (x_grid >= 740) & (x_grid <= 805) & (gray > 95) & (r > 115) & (g > 75)

    # 7. Parchment Scroll Paper
    parch_zone = (y_grid >= 290) & (y_grid <= 650) & (x_grid >= 250) & (x_grid <= 690)
    parchment_body = (parch_zone & (gray > 110) & (r > 115) & (g > 95) & (b > 65) & (~red_rich) & (~flame_halo)) | (qr_inner_zone & clean_fg)
    parchment_light = parch_zone & (gray > 155) & (r > 155) & (g > 135) & (b > 95) & (~red_rich) & (~qr_inner_zone)

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

    <!-- Hanging Lantern Radial Flame -->
    <radialGradient id="lanternFlameGrad" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#FFFAD1" />
      <stop offset="25%" stop-color="#FFA826" />
      <stop offset="65%" stop-color="#DE3C16" />
      <stop offset="100%" stop-color="#73150A" />
    </radialGradient>

    <!-- Candle Flame Radial -->
    <radialGradient id="candleFlameGrad" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#FFFFF0" />
      <stop offset="30%" stop-color="#FFB338" />
      <stop offset="70%" stop-color="#E64415" />
      <stop offset="100%" stop-color="#6B1309" />
    </radialGradient>

    <!-- Parchment Paper Shading Gradient -->
    <linearGradient id="parchmentGrad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#E0CEB4" />
      <stop offset="50%" stop-color="#EFE0CA" />
      <stop offset="100%" stop-color="#D4C0A3" />
    </linearGradient>
  </defs>''')

    # Group: Character & Shrine Container
    svg_parts.append('  <g id="ritualShrineGroup" class="shrine-vector-group">')

    # Layer 0: Deep Silhouette Underlay (Prevents pinholes)
    fg_paths = extract_paths(clean_fg, min_area=80, approx_eps=0.7)
    if fg_paths:
        svg_parts.append(f'    <!-- Layer 0: Silhouette Base -->')
        svg_parts.append(f'    <path d="{" ".join(fg_paths)}" fill="#120F0E" />')

    # Layer 1: Dark Wood & Cloak Folds
    w_deep_paths = extract_paths(wood_deep, min_area=12, approx_eps=0.55)
    if w_deep_paths:
        svg_parts.append(f'    <!-- Layer 1: Deep Timber & Robe Shadows -->')
        svg_parts.append(f'    <path d="{" ".join(w_deep_paths)}" fill="#261C17" />')

    # Layer 2: Stone Rubble & Cobblestone Base
    st_b_paths = extract_paths(stone_body, min_area=10, approx_eps=0.55)
    if st_b_paths:
        svg_parts.append(f'    <!-- Layer 2: Boulders & Stone Rubble -->')
        svg_parts.append(f'    <path d="{" ".join(st_b_paths)}" fill="#383234" />')
    st_m_paths = extract_paths(stone_mid, min_area=10, approx_eps=0.5)
    if st_m_paths:
        svg_parts.append(f'    <path d="{" ".join(st_m_paths)}" fill="#544B4E" />')
    st_l_paths = extract_paths(stone_light, min_area=10, approx_eps=0.5)
    if st_l_paths:
        svg_parts.append(f'    <path d="{" ".join(st_l_paths)}" fill="#7A6F73" />')

    # Layer 3: Midtone Timber Planks
    w_mid_paths = extract_paths(wood_mid, min_area=10, approx_eps=0.5)
    if w_mid_paths:
        svg_parts.append(f'    <!-- Layer 3: Weathered Timber Planks -->')
        svg_parts.append(f'    <path d="{" ".join(w_mid_paths)}" fill="#47352B" />')

    # Layer 4: Timber Grain & Edge Highlights
    w_l_paths = extract_paths(wood_light, min_area=10, approx_eps=0.5)
    if w_l_paths:
        svg_parts.append(f'    <!-- Layer 4: Timber Grain & Edge Relief -->')
        svg_parts.append(f'    <path d="{" ".join(w_l_paths)}" fill="#6B5041" />')
    w_hl_paths = extract_paths(wood_highlight, min_area=8, approx_eps=0.45)
    if w_hl_paths:
        svg_parts.append(f'    <path d="{" ".join(w_hl_paths)}" fill="#8A6B57" />')

    # Layer 5: Bone Claws & Dripping Wax Pillars
    b_b_paths = extract_paths(bone_body, min_area=8, approx_eps=0.45)
    if b_b_paths:
        svg_parts.append(f'    <!-- Layer 5: Skeletal Claws & Candle Wax -->')
        svg_parts.append(f'    <path d="{" ".join(b_b_paths)}" fill="#82715F" />')
    b_l_paths = extract_paths(bone_light, min_area=8, approx_eps=0.45)
    if b_l_paths:
        svg_parts.append(f'    <path d="{" ".join(b_l_paths)}" fill="#C7B49B" />')

    # Layer 6: Red Fabric Banners & Ribbons
    r_dark_paths = extract_paths(red_dark, min_area=8, approx_eps=0.5)
    if r_dark_paths:
        svg_parts.append(f'    <!-- Layer 6: Crimson Fabric & Ribbons -->')
        svg_parts.append(f'    <path d="{" ".join(r_dark_paths)}" fill="#541410" />')
    r_rich_paths = extract_paths(red_rich, min_area=8, approx_eps=0.45)
    if r_rich_paths:
        svg_parts.append(f'    <path d="{" ".join(r_rich_paths)}" fill="#9C261E" />')
    r_bright_paths = extract_paths(red_bright, min_area=8, approx_eps=0.45)
    if r_bright_paths:
        svg_parts.append(f'    <path d="{" ".join(r_bright_paths)}" fill="#CC382B" />')

    # Right Banner Printer Icon
    pr_paths = extract_paths(printer_icon, min_area=4, approx_eps=0.4)
    if pr_paths:
        svg_parts.append(f'    <!-- Odyssey Print Emblem on Banner -->')
        svg_parts.append(f'    <path d="{" ".join(pr_paths)}" fill="#D8C4A9" />')

    # Layer 7: Torn Parchment Scroll Base & Shading
    p_b_paths = extract_paths(parchment_body, min_area=10, approx_eps=0.5)
    if p_b_paths:
        svg_parts.append(f'    <!-- Layer 7: Torn Parchment Scroll -->')
        svg_parts.append(f'    <path d="{" ".join(p_b_paths)}" fill="url(#parchmentGrad)" />')
    p_l_paths = extract_paths(parchment_light, min_area=10, approx_eps=0.45)
    if p_l_paths:
        svg_parts.append(f'    <path d="{" ".join(p_l_paths)}" fill="#F5E8D3" />')

    # Occult Sigil Ring & Markings on Parchment
    sig_paths = extract_paths(sigil_mask, min_area=6, approx_eps=0.4)
    if sig_paths:
        svg_parts.append(f'    <!-- Sacred Occult Sigil & Boundary Runes -->')
        svg_parts.append(f'    <path d="{" ".join(sig_paths)}" fill="#A8281E" />')

    # Layer 8: Carved Plaque Typography
    t_crimson_paths = extract_paths(text_make_offering, min_area=4, approx_eps=0.35)
    if t_crimson_paths:
        svg_parts.append(f'    <!-- Carved Plaque: MAKE YOUR OFFERING -->')
        svg_parts.append(f'    <path d="{" ".join(t_crimson_paths)}" fill="#B8281E" />')
    t_crimson_br_paths = extract_paths(text_make_offering_bright, min_area=4, approx_eps=0.35)
    if t_crimson_br_paths:
        svg_parts.append(f'    <path d="{" ".join(t_crimson_br_paths)}" fill="#E0382B" />')

    t_white_paths = extract_paths(text_to_complete, min_area=4, approx_eps=0.35)
    if t_white_paths:
        svg_parts.append(f'    <!-- Carved Plaque: TO COMPLETE THE RITUAL -->')
        svg_parts.append(f'    <path d="{" ".join(t_white_paths)}" fill="#DDD0BF" />')
    t_white_br_paths = extract_paths(text_to_complete_bright, min_area=4, approx_eps=0.35)
    if t_white_br_paths:
        svg_parts.append(f'    <path d="{" ".join(t_white_br_paths)}" fill="#F5EEE4" />')

    t_sub_paths = extract_paths(text_subtitle, min_area=4, approx_eps=0.35)
    if t_sub_paths:
        svg_parts.append(f'    <!-- Carved Plaque: Subtitle & Star Glyph -->')
        svg_parts.append(f'    <path d="{" ".join(t_sub_paths)}" fill="#A6947D" />')

    # Layer 9: Comic Inking & Void Black Contours
    ink_paths = extract_paths(ink_mask, min_area=6, approx_eps=0.4)
    if ink_paths:
        svg_parts.append(f'    <!-- Layer 9: Mignola Comic Void Black Inking -->')
        svg_parts.append(f'    <path d="{" ".join(ink_paths)}" fill="#0D0D0D" />')

    # Layer 10: Flickering Lantern & Candle Flames
    f_halo_paths = extract_paths(flame_halo, min_area=5, approx_eps=0.4)
    if f_halo_paths:
        svg_parts.append(f'    <!-- Layer 10: Animated Ritual Flames -->')
        svg_parts.append(f'    <g id="ritualFlames" filter="url(#ritualFlameGlow)" class="flame-flicker-group">')
        svg_parts.append(f'      <path d="{" ".join(f_halo_paths)}" fill="#FF5E14" />')
        f_core_paths = extract_paths(flame_core, min_area=4, approx_eps=0.35)
        if f_core_paths:
            svg_parts.append(f'      <path d="{" ".join(f_core_paths)}" fill="#FFAE26" />')
        f_cen_paths = extract_paths(flame_center, min_area=4, approx_eps=0.3)
        if f_cen_paths:
            svg_parts.append(f'      <path d="{" ".join(f_cen_paths)}" fill="#FFF28F" />')
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

    svg_parts.append('  </g>')
    svg_parts.append('</svg>')

    out_svg = "\n".join(svg_parts)
    out_path = 'frontend/public/grim-reaper-ritual-board.svg'
    with open(out_path, 'w', encoding='utf-8') as f:
        f.write(out_svg)

    print(f"Generated {out_path} ({len(out_svg)} bytes) in {time.time()-t0:.2f}s")

if __name__ == "__main__":
    build_accurate_grim_reaper_svg()
