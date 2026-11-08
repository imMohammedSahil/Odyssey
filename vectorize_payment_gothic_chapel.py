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
    <!-- Misty Gothic Night Atmosphere Gradient (Deep Moody Midnight) -->
    <linearGradient id="gothicFogSky" x1="0" y1="0" x2="0" y2="100%">
      <stop offset="0%" stop-color="#3B464D" />
      <stop offset="35%" stop-color="#4C575E" />
      <stop offset="70%" stop-color="#38434A" />
      <stop offset="100%" stop-color="#222B30" />
    </linearGradient>

    <!-- Lantern Glass Flame Bloom (Confined strictly to lantern glass aperture, r=30) -->
    <radialGradient id="lanternRedMistBloom" cx="755" cy="405" r="30" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#FF5538" stop-opacity="0.95" />
      <stop offset="40%" stop-color="#E03422" stop-opacity="0.75" />
      <stop offset="75%" stop-color="#9C241C" stop-opacity="0.35" />
      <stop offset="100%" stop-color="#6B1812" stop-opacity="0" />
    </radialGradient>

    <radialGradient id="bloomLanternLeft" cx="348" cy="385" r="50" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#FFF2E6" stop-opacity="0.9" />
      <stop offset="25%" stop-color="#FF5A36" stop-opacity="0.7" />
      <stop offset="60%" stop-color="#D91E18" stop-opacity="0.25" />
      <stop offset="100%" stop-color="#7D0C08" stop-opacity="0" />
    </radialGradient>

    <radialGradient id="bloomChurchDoor" cx="505" cy="318" r="30" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#FFE8D6" stop-opacity="0.85" />
      <stop offset="40%" stop-color="#FF4024" stop-opacity="0.45" />
      <stop offset="100%" stop-color="#B3120A" stop-opacity="0" />
    </radialGradient>

    <radialGradient id="bloomShrineAperture" cx="414" cy="342" r="20" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#FFF0DE" stop-opacity="0.95" />
      <stop offset="40%" stop-color="#FF482B" stop-opacity="0.7" />
      <stop offset="100%" stop-color="#C4150C" stop-opacity="0" />
    </radialGradient>

    <radialGradient id="bloomTowerBelfry" cx="651" cy="77" r="24" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#FFE8D6" stop-opacity="0.9" />
      <stop offset="40%" stop-color="#FF381E" stop-opacity="0.6" />
      <stop offset="100%" stop-color="#A81008" stop-opacity="0" />
    </radialGradient>

    <radialGradient id="bloomTowerWindow" cx="658" cy="315" r="16" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#FFE8D6" stop-opacity="0.85" />
      <stop offset="45%" stop-color="#FF381E" stop-opacity="0.55" />
      <stop offset="100%" stop-color="#A81008" stop-opacity="0" />
    </radialGradient>

    <radialGradient id="pathMoonGlow" cx="540" cy="480" rx="260" ry="100" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#8BAEA4" stop-opacity="0.18" />
      <stop offset="60%" stop-color="#55756C" stop-opacity="0.06" />
      <stop offset="100%" stop-color="#222B30" stop-opacity="0" />
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
        svg_layers.append(f'  <!-- Layer 1: Distant Fog & Treeline Silhouette -->\n  <path d="{" ".join(p1)}" fill="#323E45" opacity="0.85" />')

    # Layer 2: Midground Distant Graveyard Hills & Crosses (gray < 145)
    m2 = (gray < 145).astype(np.uint8) * 255
    m2 = cv2.morphologyEx(m2, cv2.MORPH_OPEN, cv2.getStructuringElement(cv2.MORPH_RECT, (2, 2)))
    p2 = extract_paths(m2, min_area=25, approx_eps=0.5)
    if p2:
        svg_layers.append(f'  <!-- Layer 2: Midground Graveyard Hills & Tombstones -->\n  <path d="{" ".join(p2)}" fill="#242E34" />')

    # Layer 3: Dark Atmospheric Valley Fog
    natural_mist = (gray >= 88) & (gray < 142) & (y_coords[:h, 0] > 300)[:, None] & (smooth[:, :, 2] > 70)
    p_mist = extract_paths(natural_mist.astype(np.uint8) * 255, min_area=15, approx_eps=0.5)
    if p_mist:
        svg_layers.append(f'  <!-- Layer 3: Dark Valley Mist -->\n  <path d="{" ".join(p_mist)}" fill="#354249" opacity="0.55" />')

    # Layer 4: Church Masonry, Shrine & Solid Ground Contours (gray < 125)
    m3 = (gray < 125).astype(np.uint8) * 255
    m3 = cv2.morphologyEx(m3, cv2.MORPH_OPEN, cv2.getStructuringElement(cv2.MORPH_RECT, (2, 2)))
    p3 = extract_paths(m3, min_area=20, approx_eps=0.45)
    if p3:
        svg_layers.append(f'  <!-- Layer 4: Church Masonry & Solid Ground (Deep Moody Slate) -->\n  <path d="{" ".join(p3)}" fill="#161E23" />')

    # Layer 5 (Part A): Cobblestone Path Highlights & Atmospheric Moonlit Path Glow
    cobble_roi = np.zeros((h, w), dtype=bool)
    cobble_roi[370:576, 230:720] = True
    cobble_bright = cobble_roi & (gray >= 145) & (g > 140) & (b > 130)
    cobble_mid = cobble_roi & (gray >= 105) & (gray < 145) & (g > 100) & (b > 90)

    p_cobble_mid = extract_paths(cobble_mid.astype(np.uint8) * 255, min_area=8, approx_eps=0.4)
    if p_cobble_mid:
        svg_layers.append(f'  <!-- Layer 5A: Cobblestone Path Dark Tint Base -->\n  <path d="{" ".join(p_cobble_mid)}" fill="#3B4C46" />')

    p_cobble_bright = extract_paths(cobble_bright.astype(np.uint8) * 255, min_area=6, approx_eps=0.35)
    if p_cobble_bright:
        svg_layers.append(f'  <!-- Layer 5B: Cobblestone Moonlit Subdued Highlights -->\n  <path d="{" ".join(p_cobble_bright)}" fill="#607A72" />')

    # Ambient moonlit glow on the path
    svg_layers.append('  <!-- Cobblestone Path Atmospheric Glow -->\n  <ellipse cx="530" cy="480" rx="260" ry="100" fill="url(#pathMoonGlow)" />')

    # Layer 6: Realistic Atmospheric Lantern Glows (Confined Strictly to Lantern Glass, Zero Fog Wash)
    svg_layers.append('  <!-- Layer 6: Lantern Glass Flame Bloom -->')
    svg_layers.append('  <circle cx="755" cy="405" r="30" fill="url(#lanternRedMistBloom)" />')
    svg_layers.append('  <circle cx="348" cy="385" r="50" fill="url(#bloomLanternLeft)" />')
    svg_layers.append('  <circle cx="505" cy="318" r="30" fill="url(#bloomChurchDoor)" />')
    svg_layers.append('  <circle cx="414" cy="342" r="20" fill="url(#bloomShrineAperture)" />')
    svg_layers.append('  <circle cx="651" cy="77" r="24" fill="url(#bloomTowerBelfry)" />')
    svg_layers.append('  <circle cx="658" cy="315" r="16" fill="url(#bloomTowerWindow)" />')

    # Layer 7: Deep Gothic Shadow Slate, Church Under-eaves, Wall & Shingles (gray < 95)
    # Renders in ultra-deep gothic dark slate (#111619 - dark, not pitch black #0D0D0D)
    m4 = (gray < 95).astype(np.uint8) * 255
    m4 = cv2.morphologyEx(m4, cv2.MORPH_OPEN, cv2.getStructuringElement(cv2.MORPH_RECT, (2, 2)))
    p4 = extract_paths(m4, min_area=15, approx_eps=0.45)
    if p4:
        svg_layers.append(f'  <!-- Layer 7: Deep Gothic Shadow Slate, Church Wall & Under-eaves (#111619) -->\n  <path d="{" ".join(p4)}" fill="#111619" />')

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
