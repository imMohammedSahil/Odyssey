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
    img_path = r'C:/Users/Mohammed sahil/.gemini/antigravity/brain/25f8873c-4373-4f93-938e-d0dbaee43d77/.user_uploaded/media_1794127207406_caddc69f.jpg'
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
    thresh_2x = np.clip(70 - (y_coords / h2) * 16, 52, 70)
    black_2x = (gray_2x < thresh_2x).astype(np.uint8) * 255
    black_2x[h2-4:h2, :] = 255

    # Canny edges to preserve building corners and tombstone outlines
    edges_1x = cv2.Canny(smooth, 35, 90)
    edges_2x = cv2.resize(edges_1x, (w2, h2), interpolation=cv2.INTER_NEAREST)
    k_edge = cv2.getStructuringElement(cv2.MORPH_RECT, (2, 2))
    edges_dil = cv2.dilate(edges_2x, k_edge)
    black_2x = cv2.bitwise_or(black_2x, edges_dil)

    # USER REQUEST: Make the house / church surfaces framing the red glow SOLID BLACK
    # This covers the church roof, eave overhangs, side wall, and low ground around the glow
    church_glow_frame = np.zeros((h2, w2), dtype=bool)
    # Church wall & roof above/left of glow:
    church_glow_frame[int(180*scale):int(465*scale), int(510*scale):int(676*scale)] = True
    # Low stone foundation / terrain around glow:
    church_glow_frame[int(385*scale):int(465*scale), int(600*scale):int(710*scale)] = True

    # Turn church surface into solid black Void Black (excluding the glowing red window/apertures)
    solid_black_church = church_glow_frame & (gray_2x < 120) & (~red_cores_2x)
    black_2x[solid_black_church] = 255

    defs = '''  <defs>
    <!-- Misty Gothic Atmosphere Gradient -->
    <linearGradient id="gothicFogSky" x1="0" y1="0" x2="0" y2="100%">
      <stop offset="0%" stop-color="#73848E" />
      <stop offset="25%" stop-color="#8B9BA3" />
      <stop offset="50%" stop-color="#A5B4BC" />
      <stop offset="68%" stop-color="#93A2AA" />
      <stop offset="85%" stop-color="#6F7E86" />
      <stop offset="100%" stop-color="#4C585E" />
    </linearGradient>

    <!-- Natural Ambient Red Mist Bloom around Right Lantern -->
    <radialGradient id="lanternRedMistBloom" cx="745" cy="395" r="160" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#FF5538" stop-opacity="0.85" />
      <stop offset="25%" stop-color="#E03422" stop-opacity="0.55" />
      <stop offset="55%" stop-color="#9C241C" stop-opacity="0.30" />
      <stop offset="80%" stop-color="#6B1812" stop-opacity="0.10" />
      <stop offset="100%" stop-color="#6B1812" stop-opacity="0" />
    </radialGradient>

    <radialGradient id="bloomLanternLeft" cx="348" cy="385" r="85" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#FFF2E6" stop-opacity="0.9" />
      <stop offset="20%" stop-color="#FF5A36" stop-opacity="0.75" />
      <stop offset="55%" stop-color="#D91E18" stop-opacity="0.3" />
      <stop offset="85%" stop-color="#7D0C08" stop-opacity="0.08" />
      <stop offset="100%" stop-color="#7D0C08" stop-opacity="0" />
    </radialGradient>

    <radialGradient id="bloomChurchDoor" cx="505" cy="318" r="50" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#FFE8D6" stop-opacity="0.85" />
      <stop offset="35%" stop-color="#FF4024" stop-opacity="0.5" />
      <stop offset="75%" stop-color="#B3120A" stop-opacity="0.12" />
      <stop offset="100%" stop-color="#B3120A" stop-opacity="0" />
    </radialGradient>

    <radialGradient id="bloomShrineAperture" cx="414" cy="342" r="28" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#FFF0DE" stop-opacity="0.95" />
      <stop offset="35%" stop-color="#FF482B" stop-opacity="0.8" />
      <stop offset="75%" stop-color="#C4150C" stop-opacity="0.2" />
      <stop offset="100%" stop-color="#C4150C" stop-opacity="0" />
    </radialGradient>

    <radialGradient id="bloomTowerBelfry" cx="651" cy="77" r="32" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#FFE8D6" stop-opacity="0.9" />
      <stop offset="35%" stop-color="#FF381E" stop-opacity="0.65" />
      <stop offset="80%" stop-color="#A81008" stop-opacity="0.15" />
      <stop offset="100%" stop-color="#A81008" stop-opacity="0" />
    </radialGradient>

    <radialGradient id="bloomTowerWindow" cx="658" cy="315" r="32" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#FFE8D6" stop-opacity="0.85" />
      <stop offset="35%" stop-color="#FF381E" stop-opacity="0.6" />
      <stop offset="80%" stop-color="#A81008" stop-opacity="0.15" />
      <stop offset="100%" stop-color="#A81008" stop-opacity="0" />
    </radialGradient>

    <radialGradient id="pathMoonGlow" cx="540" cy="480" rx="260" ry="100" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#C5DFD7" stop-opacity="0.32" />
      <stop offset="60%" stop-color="#8BAEA4" stop-opacity="0.1" />
      <stop offset="100%" stop-color="#4C585E" stop-opacity="0" />
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
        svg_layers.append(f'  <!-- Layer 1: Distant Fog & Treeline Silhouette -->\n  <path d="{" ".join(p1)}" fill="#6C7E86" opacity="0.85" />')

    # Layer 2: Midground Distant Graveyard Hills & Crosses (gray < 145)
    m2 = (gray < 145).astype(np.uint8) * 255
    m2 = cv2.morphologyEx(m2, cv2.MORPH_OPEN, cv2.getStructuringElement(cv2.MORPH_RECT, (2, 2)))
    p2 = extract_paths(m2, min_area=25, approx_eps=0.5)
    if p2:
        svg_layers.append(f'  <!-- Layer 2: Midground Graveyard Hills & Tombstones -->\n  <path d="{" ".join(p2)}" fill="#54656D" />')

    # Layer 3: Natural Atmospheric Valley Fog
    natural_mist = (gray >= 88) & (gray < 142) & (y_coords[:h, 0] > 300)[:, None] & (smooth[:, :, 2] > 70)
    p_mist = extract_paths(natural_mist.astype(np.uint8) * 255, min_area=15, approx_eps=0.5)
    if p_mist:
        svg_layers.append(f'  <!-- Layer 3: Organic Valley Mist -->\n  <path d="{" ".join(p_mist)}" fill="#8EA1AA" opacity="0.75" />')

    # Layer 4: Church Masonry, Shrine & Solid Ground Contours (gray < 125)
    m3 = (gray < 125).astype(np.uint8) * 255
    m3 = cv2.morphologyEx(m3, cv2.MORPH_OPEN, cv2.getStructuringElement(cv2.MORPH_RECT, (2, 2)))
    p3 = extract_paths(m3, min_area=20, approx_eps=0.45)
    if p3:
        svg_layers.append(f'  <!-- Layer 4: Church Masonry & Solid Ground -->\n  <path d="{" ".join(p3)}" fill="#38474F" />')

    # Layer 5: Deep Shadow Slate, Under-eaves, Church Shingles & Foreground Ground (gray < 95)
    m4 = (gray < 95).astype(np.uint8) * 255
    m4 = cv2.morphologyEx(m4, cv2.MORPH_OPEN, cv2.getStructuringElement(cv2.MORPH_RECT, (2, 2)))
    p4 = extract_paths(m4, min_area=15, approx_eps=0.45)
    if p4:
        svg_layers.append(f'  <!-- Layer 5: Deep Slate Stone, Shingles & Foreground Ground -->\n  <path d="{" ".join(p4)}" fill="#253137" />')

    # Layer 6: Cobblestone Path Moonlit Highlights
    cobble_roi = np.zeros((h, w), dtype=bool)
    cobble_roi[370:576, 230:720] = True
    cobble_bright = cobble_roi & (gray >= 145) & (g > 140) & (b > 130)
    cobble_mid = cobble_roi & (gray >= 105) & (gray < 145) & (g > 100) & (b > 90)

    p_cobble_mid = extract_paths(cobble_mid.astype(np.uint8) * 255, min_area=8, approx_eps=0.4)
    if p_cobble_mid:
        svg_layers.append(f'  <!-- Layer 6A: Cobblestone Path Cool Tint Base -->\n  <path d="{" ".join(p_cobble_mid)}" fill="#6E8A83" />')

    p_cobble_bright = extract_paths(cobble_bright.astype(np.uint8) * 255, min_area=6, approx_eps=0.35)
    if p_cobble_bright:
        svg_layers.append(f'  <!-- Layer 6B: Cobblestone Moonlit Highlights -->\n  <path d="{" ".join(p_cobble_bright)}" fill="#A6C5BB" />')

    # Ambient moonlit glow on the path
    svg_layers.append('  <!-- Cobblestone Path Atmospheric Glow -->\n  <ellipse cx="530" cy="480" rx="260" ry="100" fill="url(#pathMoonGlow)" />')

    # Layer 7: Realistic Atmospheric Red Lantern Glow over Mist (Seamless Radial Bloom)
    svg_layers.append('  <!-- Layer 7: Seamless Atmospheric Red Mist Bloom -->')
    svg_layers.append('  <circle cx="745" cy="395" r="160" fill="url(#lanternRedMistBloom)" />')
    svg_layers.append('  <circle cx="348" cy="385" r="85" fill="url(#bloomLanternLeft)" />')
    svg_layers.append('  <circle cx="505" cy="318" r="50" fill="url(#bloomChurchDoor)" />')
    svg_layers.append('  <circle cx="414" cy="342" r="28" fill="url(#bloomShrineAperture)" />')
    svg_layers.append('  <circle cx="651" cy="77" r="32" fill="url(#bloomTowerBelfry)" />')
    svg_layers.append('  <circle cx="658" cy="315" r="32" fill="url(#bloomTowerWindow)" />')

    # Layer 8: Intense Glowing Cores & Flames
    p_red = extract_paths(red_cores, min_area=4, approx_eps=0.35)
    if p_red:
        svg_layers.append(f'  <!-- Layer 8A: Lantern Glowing Red Cores -->\n  <path d="{" ".join(p_red)}" fill="#FF3B2B" />')

    red_hot = cv2.inRange(hsv, (5, 110, 190), (28, 255, 255))
    p_hot = extract_paths(red_hot, min_area=3, approx_eps=0.3)
    if p_hot:
        svg_layers.append(f'  <!-- Layer 8B: Lantern White-Hot Flame Centers -->\n  <path d="{" ".join(p_hot)}" fill="#FFE6B3" />')

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
