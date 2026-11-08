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

def extract_paths(mask, min_area=6, approx_eps=0.45, sharp_angle=45.0):
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

def build_accurate_gothic_chapel_svg():
    t0 = time.time()
    local_path = 'payment_gothic_chapel_reference.jpg'
    img_path = local_path if os.path.exists(local_path) else r'C:/Users/Mohammed sahil/.gemini/antigravity/brain/25f8873c-4373-4f93-938e-d0dbaee43d77/.user_uploaded/media_1794127207406_caddc69f.jpg'
    img = cv2.imread(img_path)
    if img is None:
        raise ValueError(f"Could not load image: {img_path}")

    h, w = img.shape[:2] # 576 x 1024
    print(f"Loaded {w}x{h} image in {time.time()-t0:.2f}s")

    smooth = cv2.bilateralFilter(img, d=5, sigmaColor=22, sigmaSpace=22)
    gray = cv2.cvtColor(smooth, cv2.COLOR_BGR2GRAY)
    b, g, r = smooth[:, :, 0], smooth[:, :, 1], smooth[:, :, 2]

    # Red flame cores mask to protect lantern lights from being blackened
    hsv = cv2.cvtColor(img, cv2.COLOR_BGR2HSV)
    red_m1 = cv2.inRange(hsv, (0, 75, 95), (15, 255, 255))
    red_m2 = cv2.inRange(hsv, (165, 75, 95), (180, 255, 255))
    red_cores = (red_m1 | red_m2)

    # Super-sampled black lineart mask
    scale = 2.0
    w2, h2 = int(w * scale), int(h * scale)
    gray_2x = cv2.resize(gray, (w2, h2), interpolation=cv2.INTER_LANCZOS4)
    red_cores_2x = cv2.resize(red_cores, (w2, h2), interpolation=cv2.INTER_NEAREST) > 0
    
    y_coords = np.arange(h2)[:, None]
    thresh_2x = np.clip(74 - (y_coords / h2) * 18, 54, 74)
    black_2x = ((gray_2x < thresh_2x) & (~red_cores_2x)).astype(np.uint8) * 255
    black_2x[h2-4:h2, :] = 255

    # Canny edges to preserve building corners and tombstone outlines
    edges_1x = cv2.Canny(smooth, 35, 90)
    edges_2x = cv2.resize(edges_1x, (w2, h2), interpolation=cv2.INTER_NEAREST)
    k_edge = cv2.getStructuringElement(cv2.MORPH_RECT, (2, 2))
    edges_dil = cv2.dilate(edges_2x, k_edge)
    black_2x = cv2.bitwise_or(black_2x, edges_dil)
    black_2x[red_cores_2x] = 0

    defs = '''  <defs>
    <!-- Misty Gothic Night Atmosphere Gradient (Deep Moonlit Midnight) -->
    <linearGradient id="gothicFogSky" x1="0" y1="0" x2="0" y2="100%">
      <stop offset="0%" stop-color="#4B5861" />
      <stop offset="35%" stop-color="#5C6B75" />
      <stop offset="70%" stop-color="#47555D" />
      <stop offset="100%" stop-color="#2D3940" />
    </linearGradient>

    <!-- Multi-tiered Realistic Lantern Illumination (Rightmost Lantern) -->
    <!-- 1. Outer Atmospheric Red Mist Halo (Organic scattering in fog, r=72) -->
    <radialGradient id="lanternMistHalo" cx="755" cy="405" r="72" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#FF5226" stop-opacity="0.85" />
      <stop offset="30%" stop-color="#E62810" stop-opacity="0.65" />
      <stop offset="60%" stop-color="#A8190A" stop-opacity="0.35" />
      <stop offset="85%" stop-color="#6B0E06" stop-opacity="0.10" />
      <stop offset="100%" stop-color="#6B0E06" stop-opacity="0" />
    </radialGradient>

    <!-- 2. Vibrant Inner Core Flame & Glass Glow (Incandescent core, r=40) -->
    <radialGradient id="lanternCoreGlow" cx="755" cy="405" r="40" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#FFF6B8" stop-opacity="1.0" />
      <stop offset="20%" stop-color="#FFA62B" stop-opacity="0.95" />
      <stop offset="48%" stop-color="#FF3814" stop-opacity="0.90" />
      <stop offset="78%" stop-color="#CC1608" stop-opacity="0.65" />
      <stop offset="100%" stop-color="#7A0B04" stop-opacity="0" />
    </radialGradient>

    <!-- 3. Ground Cast Light on Cobblestones Beneath Lantern -->
    <radialGradient id="lanternGroundCast" cx="755" cy="446" rx="52" ry="18" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#FF4C1C" stop-opacity="0.70" />
      <stop offset="45%" stop-color="#CC2410" stop-opacity="0.38" />
      <stop offset="80%" stop-color="#730E06" stop-opacity="0.10" />
      <stop offset="100%" stop-color="#730E06" stop-opacity="0" />
    </radialGradient>

    <!-- Realistic Left Lantern (Porch) Illumination -->
    <radialGradient id="lanternLeftMistHalo" cx="348" cy="385" r="68" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#FF5226" stop-opacity="0.82" />
      <stop offset="30%" stop-color="#E62810" stop-opacity="0.60" />
      <stop offset="60%" stop-color="#A8190A" stop-opacity="0.32" />
      <stop offset="85%" stop-color="#6B0E06" stop-opacity="0.10" />
      <stop offset="100%" stop-color="#6B0E06" stop-opacity="0" />
    </radialGradient>

    <radialGradient id="lanternLeftCoreGlow" cx="348" cy="385" r="36" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#FFF6B8" stop-opacity="1.0" />
      <stop offset="20%" stop-color="#FFA62B" stop-opacity="0.95" />
      <stop offset="48%" stop-color="#FF3814" stop-opacity="0.90" />
      <stop offset="78%" stop-color="#CC1608" stop-opacity="0.65" />
      <stop offset="100%" stop-color="#7A0B04" stop-opacity="0" />
    </radialGradient>

    <radialGradient id="lanternLeftGroundCast" cx="348" cy="432" rx="46" ry="16" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#FF4C1C" stop-opacity="0.65" />
      <stop offset="45%" stop-color="#CC2410" stop-opacity="0.35" />
      <stop offset="80%" stop-color="#730E06" stop-opacity="0.10" />
      <stop offset="100%" stop-color="#730E06" stop-opacity="0" />
    </radialGradient>

    <!-- Realistic Church Arched Doorway Glow -->
    <radialGradient id="churchDoorHalo" cx="505" cy="318" r="52" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#FF5226" stop-opacity="0.80" />
      <stop offset="35%" stop-color="#E02810" stop-opacity="0.55" />
      <stop offset="70%" stop-color="#9C150A" stop-opacity="0.25" />
      <stop offset="100%" stop-color="#660C05" stop-opacity="0" />
    </radialGradient>

    <radialGradient id="churchDoorCore" cx="505" cy="318" r="28" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#FFF6B8" stop-opacity="0.98" />
      <stop offset="25%" stop-color="#FFA62B" stop-opacity="0.92" />
      <stop offset="55%" stop-color="#FF3814" stop-opacity="0.85" />
      <stop offset="80%" stop-color="#B81408" stop-opacity="0.55" />
      <stop offset="100%" stop-color="#660C05" stop-opacity="0" />
    </radialGradient>

    <radialGradient id="churchDoorGroundCast" cx="505" cy="342" rx="36" ry="10" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#FF4C1C" stop-opacity="0.55" />
      <stop offset="50%" stop-color="#B81408" stop-opacity="0.25" />
      <stop offset="100%" stop-color="#660C05" stop-opacity="0" />
    </radialGradient>

    <!-- Realistic Wall Shrine Aperture -->
    <radialGradient id="shrineApertureHalo" cx="414" cy="342" r="30" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#FF5226" stop-opacity="0.75" />
      <stop offset="40%" stop-color="#D92410" stop-opacity="0.45" />
      <stop offset="100%" stop-color="#6B0E06" stop-opacity="0" />
    </radialGradient>

    <radialGradient id="shrineApertureCore" cx="414" cy="342" r="16" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#FFF8D0" stop-opacity="1.0" />
      <stop offset="30%" stop-color="#FFA828" stop-opacity="0.95" />
      <stop offset="65%" stop-color="#FF3412" stop-opacity="0.85" />
      <stop offset="100%" stop-color="#780C04" stop-opacity="0" />
    </radialGradient>

    <!-- Realistic Tower Belfry Light -->
    <radialGradient id="towerBelfryHalo" cx="651" cy="77" r="36" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#FF5226" stop-opacity="0.80" />
      <stop offset="40%" stop-color="#E02810" stop-opacity="0.50" />
      <stop offset="100%" stop-color="#6B0E06" stop-opacity="0" />
    </radialGradient>

    <radialGradient id="towerBelfryCore" cx="651" cy="77" r="18" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#FFF6B8" stop-opacity="1.0" />
      <stop offset="30%" stop-color="#FFA62B" stop-opacity="0.92" />
      <stop offset="65%" stop-color="#FF3814" stop-opacity="0.80" />
      <stop offset="100%" stop-color="#7A0B04" stop-opacity="0" />
    </radialGradient>

    <!-- Realistic Tower Window Light -->
    <radialGradient id="towerWindowHalo" cx="658" cy="315" r="26" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#FF5226" stop-opacity="0.75" />
      <stop offset="45%" stop-color="#D92410" stop-opacity="0.45" />
      <stop offset="100%" stop-color="#6B0E06" stop-opacity="0" />
    </radialGradient>

    <radialGradient id="towerWindowCore" cx="658" cy="315" r="14" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#FFF6B8" stop-opacity="1.0" />
      <stop offset="30%" stop-color="#FFA62B" stop-opacity="0.92" />
      <stop offset="65%" stop-color="#FF3814" stop-opacity="0.80" />
      <stop offset="100%" stop-color="#7A0B04" stop-opacity="0" />
    </radialGradient>

    <!-- Realistic Cemetery Candle Points (Embers & Mini Halos) -->
    <radialGradient id="cemeteryEmberHalo1" cx="28" cy="410" r="18" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#FF5226" stop-opacity="0.85" />
      <stop offset="45%" stop-color="#D92410" stop-opacity="0.45" />
      <stop offset="100%" stop-color="#6B0E06" stop-opacity="0" />
    </radialGradient>
    <radialGradient id="cemeteryEmberCore1" cx="28" cy="410" r="8" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#FFF8D0" stop-opacity="1.0" />
      <stop offset="40%" stop-color="#FFA62B" stop-opacity="0.95" />
      <stop offset="100%" stop-color="#FF3814" stop-opacity="0.85" />
    </radialGradient>

    <radialGradient id="cemeteryEmberHalo2" cx="515" cy="422" r="18" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#FF5226" stop-opacity="0.85" />
      <stop offset="45%" stop-color="#D92410" stop-opacity="0.45" />
      <stop offset="100%" stop-color="#6B0E06" stop-opacity="0" />
    </radialGradient>
    <radialGradient id="cemeteryEmberCore2" cx="515" cy="422" r="8" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#FFF8D0" stop-opacity="1.0" />
      <stop offset="40%" stop-color="#FFA62B" stop-opacity="0.95" />
      <stop offset="100%" stop-color="#FF3814" stop-opacity="0.85" />
    </radialGradient>

    <radialGradient id="cemeteryEmberHalo3" cx="590" cy="412" r="18" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#FF5226" stop-opacity="0.85" />
      <stop offset="45%" stop-color="#D92410" stop-opacity="0.45" />
      <stop offset="100%" stop-color="#6B0E06" stop-opacity="0" />
    </radialGradient>
    <radialGradient id="cemeteryEmberCore3" cx="590" cy="412" r="8" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#FFF8D0" stop-opacity="1.0" />
      <stop offset="40%" stop-color="#FFA62B" stop-opacity="0.95" />
      <stop offset="100%" stop-color="#FF3814" stop-opacity="0.85" />
    </radialGradient>

    <radialGradient id="cemeteryEmberHalo4" cx="647" cy="426" r="18" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#FF5226" stop-opacity="0.85" />
      <stop offset="45%" stop-color="#D92410" stop-opacity="0.45" />
      <stop offset="100%" stop-color="#6B0E06" stop-opacity="0" />
    </radialGradient>
    <radialGradient id="cemeteryEmberCore4" cx="647" cy="426" r="8" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#FFF8D0" stop-opacity="1.0" />
      <stop offset="40%" stop-color="#FFA62B" stop-opacity="0.95" />
      <stop offset="100%" stop-color="#FF3814" stop-opacity="0.85" />
    </radialGradient>

    <radialGradient id="pathMoonGlow" cx="540" cy="480" rx="260" ry="100" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#9EC2B8" stop-opacity="0.22" />
      <stop offset="60%" stop-color="#608076" stop-opacity="0.08" />
      <stop offset="100%" stop-color="#273238" stop-opacity="0" />
    </radialGradient>
  </defs>'''

    svg_layers = []
    # Layer 0: Base Sky Mist
    svg_layers.append(f'  <!-- Layer 0: Deep Gothic Fog & Mist Sky -->\n  <rect width="{w}" height="{h}" fill="url(#gothicFogSky)" />')

    # Layer 1: Distant Background Hills & Distant Fog (gray < 172)
    m1 = (gray < 172).astype(np.uint8) * 255
    m1 = cv2.morphologyEx(m1, cv2.MORPH_OPEN, cv2.getStructuringElement(cv2.MORPH_RECT, (2, 2)))
    p1 = extract_paths(m1, min_area=30, approx_eps=0.55)
    if p1:
        svg_layers.append(f'  <!-- Layer 1: Distant Fog & Treeline Silhouette -->\n  <path d="{" ".join(p1)}" fill="#44525B" opacity="0.85" />')

    # Layer 2: Midground Distant Graveyard Hills & Crosses (gray < 145)
    m2 = (gray < 145).astype(np.uint8) * 255
    m2 = cv2.morphologyEx(m2, cv2.MORPH_OPEN, cv2.getStructuringElement(cv2.MORPH_RECT, (2, 2)))
    p2 = extract_paths(m2, min_area=25, approx_eps=0.5)
    if p2:
        svg_layers.append(f'  <!-- Layer 2: Midground Graveyard Hills & Tombstones -->\n  <path d="{" ".join(p2)}" fill="#35424B" />')

    # Layer 3: Dark Atmospheric Valley Fog
    natural_mist = (gray >= 88) & (gray < 142) & (y_coords[:h, 0] > 300)[:, None] & (smooth[:, :, 2] > 70)
    p_mist = extract_paths(natural_mist.astype(np.uint8) * 255, min_area=15, approx_eps=0.5)
    if p_mist:
        svg_layers.append(f'  <!-- Layer 3: Dark Valley Mist -->\n  <path d="{" ".join(p_mist)}" fill="#465761" opacity="0.60" />')

    # Layer 4: Church Masonry, Shrine & Solid Ground Contours (gray < 125) - Brightened Moonlit Slate for entire home
    m3 = (gray < 125).astype(np.uint8) * 255
    m3 = cv2.morphologyEx(m3, cv2.MORPH_OPEN, cv2.getStructuringElement(cv2.MORPH_RECT, (2, 2)))
    p3 = extract_paths(m3, min_area=20, approx_eps=0.45)
    if p3:
        svg_layers.append(f'  <!-- Layer 4: Church Masonry & Solid Ground (Bright Moonlit Slate) -->\n  <path d="{" ".join(p3)}" fill="#253138" />')

    # Layer 5 (Part A): Cobblestone Path Highlights & Atmospheric Moonlit Path Glow
    cobble_roi = np.zeros((h, w), dtype=bool)
    # Winding cobblestone road naturally below the church foundation:
    cobble_roi[385:430, 240:590] = True
    cobble_roi[430:576, 220:720] = True
    cobble_bright = cobble_roi & (gray >= 145) & (g > 140) & (b > 130)
    cobble_mid = cobble_roi & (gray >= 105) & (gray < 145) & (g > 100) & (b > 90)

    p_cobble_mid = extract_paths(cobble_mid.astype(np.uint8) * 255, min_area=8, approx_eps=0.4)
    if p_cobble_mid:
        svg_layers.append(f'  <!-- Layer 5A: Cobblestone Path Dark Tint Base -->\n  <path d="{" ".join(p_cobble_mid)}" fill="#4D6058" />')

    p_cobble_bright = extract_paths(cobble_bright.astype(np.uint8) * 255, min_area=6, approx_eps=0.35)
    if p_cobble_bright:
        svg_layers.append(f'  <!-- Layer 5B: Cobblestone Moonlit Subdued Highlights -->\n  <path d="{" ".join(p_cobble_bright)}" fill="#7A978E" />')

    # Ambient moonlit glow on the path
    svg_layers.append('  <!-- Cobblestone Path Atmospheric Glow -->\n  <ellipse cx="530" cy="480" rx="260" ry="100" fill="url(#pathMoonGlow)" />')

    # Layer 6: Realistic Multi-tiered Atmospheric Light Sources (All matched to realistic rightmost lantern style)
    svg_layers.append('  <!-- Layer 6: Realistic Multi-tiered Atmospheric Light Sources -->')
    # 1. Rightmost Hanging Lantern
    svg_layers.append('  <circle cx="755" cy="405" r="72" fill="url(#lanternMistHalo)" />')
    svg_layers.append('  <ellipse cx="755" cy="446" rx="52" ry="18" fill="url(#lanternGroundCast)" />')
    svg_layers.append('  <circle cx="755" cy="405" r="40" fill="url(#lanternCoreGlow)" />')

    # 2. Leftmost Church Porch Hanging Lantern
    svg_layers.append('  <circle cx="348" cy="385" r="68" fill="url(#lanternLeftMistHalo)" />')
    svg_layers.append('  <ellipse cx="348" cy="432" rx="46" ry="16" fill="url(#lanternLeftGroundCast)" />')
    svg_layers.append('  <circle cx="348" cy="385" r="36" fill="url(#lanternLeftCoreGlow)" />')

    # 3. Church Arched Doorway Glowing Portal
    svg_layers.append('  <circle cx="505" cy="318" r="52" fill="url(#churchDoorHalo)" />')
    svg_layers.append('  <ellipse cx="505" cy="342" rx="36" ry="10" fill="url(#churchDoorGroundCast)" />')
    svg_layers.append('  <circle cx="505" cy="318" r="28" fill="url(#churchDoorCore)" />')

    # 4. Church Wall Shrine Aperture
    svg_layers.append('  <circle cx="414" cy="342" r="30" fill="url(#shrineApertureHalo)" />')
    svg_layers.append('  <circle cx="414" cy="342" r="16" fill="url(#shrineApertureCore)" />')

    # 5. Tower Belfry Spire Light
    svg_layers.append('  <circle cx="651" cy="77" r="36" fill="url(#towerBelfryHalo)" />')
    svg_layers.append('  <circle cx="651" cy="77" r="18" fill="url(#towerBelfryCore)" />')

    # 6. Tower Arched Window Light
    svg_layers.append('  <circle cx="658" cy="315" r="26" fill="url(#towerWindowHalo)" />')
    svg_layers.append('  <circle cx="658" cy="315" r="14" fill="url(#towerWindowCore)" />')

    # 7. Cemetery Ground Red Candle Markers
    svg_layers.append('  <circle cx="28" cy="410" r="18" fill="url(#cemeteryEmberHalo1)" />')
    svg_layers.append('  <circle cx="28" cy="410" r="8" fill="url(#cemeteryEmberCore1)" />')
    svg_layers.append('  <circle cx="515" cy="422" r="18" fill="url(#cemeteryEmberHalo2)" />')
    svg_layers.append('  <circle cx="515" cy="422" r="8" fill="url(#cemeteryEmberCore2)" />')
    svg_layers.append('  <circle cx="590" cy="412" r="18" fill="url(#cemeteryEmberHalo3)" />')
    svg_layers.append('  <circle cx="590" cy="412" r="8" fill="url(#cemeteryEmberCore3)" />')
    svg_layers.append('  <circle cx="647" cy="426" r="18" fill="url(#cemeteryEmberHalo4)" />')
    svg_layers.append('  <circle cx="647" cy="426" r="8" fill="url(#cemeteryEmberCore4)" />')

    # Layer 7: ONLY THE MARKED UNDER-EAVE CHURCH WALL & RIGHT GAP IS DARKENED (#111619)
    # Rest of the home remains bright moonlit slate (#253138)
    y_coords_1x = np.arange(h)[:, None]
    x_coords_1x = np.arange(w)[None, :]
    roi_marked_left = (x_coords_1x >= 645) & (x_coords_1x <= 745) & (y_coords_1x >= 180) & (y_coords_1x <= 450)
    roi_marked_right = (x_coords_1x >= 775) & (x_coords_1x <= 830) & (y_coords_1x >= 330) & (y_coords_1x <= 395)
    marked_zone = roi_marked_left | roi_marked_right
    m_marked = (gray < 125) & marked_zone
    p_marked = extract_paths(m_marked.astype(np.uint8) * 255, min_area=8, approx_eps=0.45)
    if p_marked:
        svg_layers.append(f'  <!-- Layer 7: Deep Gothic Shadow Slate ONLY on Marked Under-eaves & Wall (#111619) -->\n  <path d="{" ".join(p_marked)}" fill="#111619" />')

    # Layer 8: Intense Glowing Cores & Flames
    p_red = extract_paths(red_cores, min_area=4, approx_eps=0.35)
    if p_red:
        svg_layers.append(f'  <!-- Layer 8A: Lantern Glowing Red Cores -->\n  <path d="{" ".join(p_red)}" fill="#FF2E17" />')

    red_hot = cv2.inRange(hsv, (5, 110, 190), (28, 255, 255))
    p_hot = extract_paths(red_hot, min_area=3, approx_eps=0.3)
    if p_hot:
        svg_layers.append(f'  <!-- Layer 8B: Lantern White-Hot Flame Centers -->\n  <path d="{" ".join(p_hot)}" fill="#FFFFD9" />')

    # Layer 9: Razor-Sharp Comic Void Black Ink Lineart, Solid Black Church Walls & Silhouettes
    black_contours, _ = cv2.findContours(black_2x, cv2.RETR_CCOMP, cv2.CHAIN_APPROX_TC89_KCOS)
    black_paths = []
    for cnt in black_contours:
        if cv2.contourArea(cnt) < 3.0:
            continue
        approx = cv2.approxPolyDP(cnt, 0.55, True)
        if len(approx) < 3:
            continue
        pts = approx.reshape(-1, 2) / scale
        p_str = pts_to_smooth_path(pts, sharp_angle_deg=45.0)
        if p_str:
            black_paths.append(p_str)

    svg_layers.append('  <!-- Layer 9: Razor-Sharp Comic Void Black Ink, Solid Black Church Walls & Silhouettes -->')
    svg_layers.append(f'  <path d="{" ".join(black_paths)}" fill="#0D0D0D" stroke="#0D0D0D" stroke-width="0.5" stroke-linejoin="miter" stroke-miterlimit="4" />')

    header = f'<svg viewBox="0 0 {w} {h}" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">\n{defs}\n'
    footer = '</svg>\n'
    full_svg = header + "\n".join(svg_layers) + "\n" + footer

    out_file = 'frontend/public/graveyard-gate-landscape.svg'
    with open(out_file, 'w', encoding='utf-8') as f:
        f.write(full_svg)

    print(f"Generated solid black church framed Gothic Chapel SVG at {out_file}! Size: {len(full_svg):,} bytes in {time.time()-t0:.2f}s")

if __name__ == '__main__':
    build_accurate_gothic_chapel_svg()
