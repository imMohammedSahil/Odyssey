import cv2
import numpy as np

def pts_to_d(pts, ox=0, oy=0, sx=1.0, sy=1.0):
    coords = [f"{int(round(p[0]*sx + ox))},{int(round(p[1]*sy + oy))}" for p in pts]
    return f"M {coords[0]} " + " ".join([f"L {c}" for c in coords[1:]]) + " Z"

def extract_precise_paths(crop, ox, oy, sx=1.0, sy=1.0):
    h, w = crop.shape[:2]
    gray = cv2.cvtColor(crop, cv2.COLOR_BGR2GRAY)
    rgb = cv2.cvtColor(crop, cv2.COLOR_BGR2RGB)
    
    # Accurate segmentation:
    is_red_sky = (rgb[:, :, 0] > 165) & (rgb[:, :, 1] < 75) & (rgb[:, :, 2] < 85)
    black_mask = (gray < 52).astype(np.uint8) * 255
    earth_mask = (~is_red_sky).astype(np.uint8) * 255
    flame_mask = ((rgb[:, :, 0] > 110) & (rgb[:, :, 0] < 175) & (rgb[:, :, 1] < 45) & (rgb[:, :, 2] < 55)).astype(np.uint8) * 255
    
    face_mask = np.zeros_like(gray)
    if w > 200 and h > 300:
        face_mask = ((gray > 80) & (gray < 160) & 
                     (np.abs(rgb[:, :, 0].astype(int) - rgb[:, :, 1].astype(int)) < 25) &
                     (np.abs(rgb[:, :, 0].astype(int) - rgb[:, :, 2].astype(int)) < 25)).astype(np.uint8) * 255

    def get_d_list(mask, min_area=4, eps=0.15):
        cnts, _ = cv2.findContours(mask, cv2.RETR_CCOMP, cv2.CHAIN_APPROX_TC89_KCOS)
        res = []
        for c in cnts:
            if cv2.contourArea(c) < min_area:
                continue
            approx = cv2.approxPolyDP(c, eps, True)
            if len(approx) < 3:
                continue
            res.append(pts_to_d(approx.reshape(-1, 2), ox, oy, sx, sy))
        return res
        
    p_earth = get_d_list(earth_mask, min_area=20, eps=0.25)
    p_flame = get_d_list(flame_mask, min_area=6, eps=0.2)
    p_face = get_d_list(face_mask, min_area=12, eps=0.2)
    p_black = get_d_list(black_mask, min_area=4, eps=0.15)
    
    return p_earth, p_flame, p_face, p_black

def build_seamless_mignola():
    ref_path = r'C:\Users\Mohammed sahil\.gemini\antigravity\brain\8771b7bb-9185-4395-a894-022cd4625b49\.user_uploaded\media_1793630499506_2b4beb15.jpg'
    img = cv2.imread(ref_path)
    if img is None:
        raise ValueError(f"Could not load image from {ref_path}")
    orig_h, orig_w = img.shape[:2] # 1024 x 791
    
    canvas_w = 1200
    canvas_h = 675
    ground_y = 535
    
    # 1. Left Wing: Gnarled Tree & Crypt from ground up (x: 0..325, y: 0..740)
    left_crop = img[0:740, 0:325]
    left_scale = 0.90
    left_ox = 0
    left_oy = ground_y - int(740 * left_scale)
    p_earth_l, p_flame_l, p_face_l, p_black_l = extract_precise_paths(left_crop, left_ox, left_oy, left_scale, left_scale)
    
    # 2. Right Wing: Temple Tomb & Mausoleum WITH FLAMING ARCHWAY (x: 490..791, y: 260..740)
    right_crop = img[260:740, 490:791]
    right_scale = 0.95
    # Place right wing so the entire mausoleum AND archway are 100% visible on screen
    # right_crop is 301px wide -> scaled width is 286px.
    # ox = 890 puts it at x: 890..1176, fully framed before the right edge!
    right_ox = 885
    right_oy = ground_y - int((740 - 260) * right_scale)
    p_earth_r, p_flame_r, p_face_r, p_black_r = extract_precise_paths(right_crop, right_ox, right_oy, right_scale, right_scale)
    
    # 3. Center Wing: Rolling Cemetery Hill, Hero in Suit, Celtic Cross & Tombstones (x: 260..535, y: 330..740)
    center_crop = img[330:740, 260:535]
    center_scale = 0.95
    # Place center wing in the middle (x: 470..730), framing the card
    center_ox = 470
    center_oy = ground_y - int((740 - 330) * center_scale)
    p_earth_c, p_flame_c, p_face_c, p_black_c = extract_precise_paths(center_crop, center_ox, center_oy, center_scale, center_scale)
    
    # 4. Authentic Moon from reference art
    moon_crop = img[100:165, 580:655]
    rgb_moon = cv2.cvtColor(moon_crop, cv2.COLOR_BGR2RGB)
    gray_moon = cv2.cvtColor(moon_crop, cv2.COLOR_BGR2GRAY)
    moon_mask = ((rgb_moon[:, :, 0] > 130) & (rgb_moon[:, :, 1] > 95) & (rgb_moon[:, :, 2] > 105) & 
                 (gray_moon > 100) & (rgb_moon[:, :, 0] < 205)).astype(np.uint8) * 255
    cnts_moon, _ = cv2.findContours(moon_mask, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_TC89_KCOS)
    moon_d = []
    moon_ox, moon_oy = 825, 75
    moon_scale = 1.15
    for c in cnts_moon:
        if cv2.contourArea(c) < 50:
            continue
        approx = cv2.approxPolyDP(c, 0.2, True)
        moon_d.append(pts_to_d(approx.reshape(-1, 2), moon_ox, moon_oy, moon_scale, moon_scale))
        
    svg = []
    svg.append(f'<svg viewBox="0 0 {canvas_w} {canvas_h}" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">')
    
    # Gradient
    svg.append('  <defs>')
    svg.append('    <linearGradient id="bloodSky" x1="0" y1="0" x2="0" y2="100%">')
    svg.append('      <stop offset="0%" stop-color="#E83A40" />')
    svg.append('      <stop offset="60%" stop-color="#EC4447" />')
    svg.append('      <stop offset="100%" stop-color="#D93339" />')
    svg.append('    </linearGradient>')
    svg.append('  </defs>')
    
    # Base Sky
    svg.append(f'  <rect width="{canvas_w}" height="{canvas_h}" fill="url(#bloodSky)" />')
    
    # Moon
    if moon_d:
        svg.append(f'  <path d="{" ".join(moon_d)}" fill="#BA9DA0" opacity="0.95" />')
    else:
        svg.append(f'  <circle cx="850" cy="95" r="28" fill="#BA9DA0" opacity="0.95" />')
        
    # Solid Ground Baseline (y: 535 to 675)
    svg.append(f'  <rect x="0" y="{ground_y}" width="{canvas_w}" height="{canvas_h - ground_y}" fill="#0D0D0D" />')
    
    # Continuous rolling earth mauve layer bridging left, center, and right:
    # We add a continuous connecting hill path from x: 0 to 1200:
    hill_connect = [
        f"M 0,{ground_y} L 0,420 Q 150,410 300,435 Q 400,445 470,430 L 740,430 Q 820,440 890,380 L 1200,380 L 1200,{ground_y} Z"
    ]
    all_earth = p_earth_l + p_earth_c + p_earth_r + hill_connect
    svg.append(f'  <!-- Continuous Weathered Stone Architecture & Cemetery Hills -->')
    svg.append(f'  <path d="{" ".join(all_earth)}" fill="#886E71" />')
    
    # Arch Flame Glow
    all_flame = p_flame_l + p_flame_c + p_flame_r
    if all_flame:
        svg.append(f'  <!-- Crypt Arch Flame Glow -->')
        svg.append(f'  <path d="{" ".join(all_flame)}" fill="#B82833" />')
        
    # Pale Skin of Hero
    all_face = p_face_l + p_face_c + p_face_r
    if all_face:
        svg.append(f'  <!-- Pale Hero Face & Collar -->')
        svg.append(f'  <path d="{" ".join(all_face)}" fill="#BA9DA0" />')
        
    # Horizon Grass Blades connecting the landscape across all 1200px
    grass_elements = []
    for gx in range(0, canvas_w, 6):
        gh = 22 + ((gx * 7) % 17) * 2
        grass_elements.append(f"M {gx},{ground_y} L {gx+3},{ground_y-gh} L {gx+6},{ground_y} Z")
    if grass_elements:
        svg.append(f'  <path d="{" ".join(grass_elements)}" fill="#0D0D0D" />')
        
    # Graphic Ink Black (twigs, cross, hero suit, mortar lines, shadows, tombstones)
    all_black = p_black_l + p_black_c + p_black_r
    if all_black:
        svg.append(f'  <!-- Authentic Graphic Ink Black -->')
        svg.append(f'  <path d="{" ".join(all_black)}" fill="#0D0D0D" stroke="#0D0D0D" stroke-width="0.3" stroke-linejoin="round" />')
        
    svg.append('</svg>\n')
    
    full_svg = "\n".join(svg)
    out_file = 'frontend/public/paper-landscape.svg'
    with open(out_file, 'w', encoding='utf-8') as f:
        f.write(full_svg)
        
    print(f"Generated seamless authentic Mignola backdrop: {out_file} ({len(full_svg)} bytes)")

if __name__ == '__main__':
    build_seamless_mignola()
