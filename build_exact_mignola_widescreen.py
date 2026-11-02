import cv2
import numpy as np

def pts_to_d(pts, ox=0, oy=0, sx=1.0, sy=1.0):
    coords = [f"{int(round(p[0]*sx + ox))},{int(round(p[1]*sy + oy))}" for p in pts]
    return f"M {coords[0]} " + " ".join([f"L {c}" for c in coords[1:]]) + " Z"

def extract_precise_paths(crop, ox, oy, sx=1.0, sy=1.0):
    h, w = crop.shape[:2]
    gray = cv2.cvtColor(crop, cv2.COLOR_BGR2GRAY)
    rgb = cv2.cvtColor(crop, cv2.COLOR_BGR2RGB)
    
    # Accurate segmentation matching reference artwork palette:
    # 1. Red Sky
    is_red_sky = (rgb[:, :, 0] > 165) & (rgb[:, :, 1] < 75) & (rgb[:, :, 2] < 85)
    
    # 2. Solid Ink Black (fine lines, silhouettes, shadows)
    black_mask = (gray < 52).astype(np.uint8) * 255
    
    # 3. Weathered Stone Silhouette (continuous earth layer under black ink)
    earth_mask = (~is_red_sky).astype(np.uint8) * 255
    
    # 4. Arch Flame Glow
    flame_mask = ((rgb[:, :, 0] > 110) & (rgb[:, :, 0] < 175) & (rgb[:, :, 1] < 45) & (rgb[:, :, 2] < 55)).astype(np.uint8) * 255
    
    # 5. Pale Skin / Collar
    face_mask = np.zeros_like(gray)
    if w > 200 and h > 300:
        face_mask = ((gray > 80) & (gray < 160) & 
                     (np.abs(rgb[:, :, 0].astype(int) - rgb[:, :, 1].astype(int)) < 25) &
                     (np.abs(rgb[:, :, 0].astype(int) - rgb[:, :, 2].astype(int)) < 25)).astype(np.uint8) * 255
    
    # High-precision contour extraction with minimal approximation
    def get_d_list(mask, min_area=3, eps=0.15):
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

def build_accurate_mignola_backdrop():
    ref_path = r'C:\Users\Mohammed sahil\.gemini\antigravity\brain\8771b7bb-9185-4395-a894-022cd4625b49\.user_uploaded\media_1793630499506_2b4beb15.jpg'
    img = cv2.imread(ref_path)
    if img is None:
        raise ValueError(f"Could not load image from {ref_path}")
    orig_h, orig_w = img.shape[:2] # 1024 x 791
    
    canvas_w = 1200
    canvas_h = 675
    ground_y = 540
    
    # 1. Left Wing: Gnarled Tree & Crypt from ground up (x: 0..425, y: 0..720)
    left_crop = img[0:720, 0:425]
    left_scale = 0.85
    left_ox = -110
    left_oy = ground_y - int(720 * left_scale)
    p_earth_l, p_flame_l, p_face_l, p_black_l = extract_precise_paths(left_crop, left_ox, left_oy, left_scale, left_scale)
    
    # 2. Right Wing: Temple Tomb & Glowing Mausoleum (x: 480..791, y: 280..760)
    right_crop = img[280:760, 480:791]
    right_scale = 1.05
    right_ox = 920
    right_oy = ground_y - int((760 - 280) * right_scale)
    p_earth_r, p_flame_r, p_face_r, p_black_r = extract_precise_paths(right_crop, right_ox, right_oy, right_scale, right_scale)
    
    # 3. Center Wing: Celtic Cross, Hero Figure & Tombstones (x: 275..520, y: 340..760)
    center_crop = img[340:760, 275:520]
    center_scale = 0.95
    center_ox = 485
    center_oy = ground_y - int((760 - 340) * center_scale)
    p_earth_c, p_flame_c, p_face_c, p_black_c = extract_precise_paths(center_crop, center_ox, center_oy, center_scale, center_scale)
    
    # 4. Authentic Moon contour from reference image (x: 580..655, y: 100..165)
    moon_crop = img[100:165, 580:655]
    rgb_moon = cv2.cvtColor(moon_crop, cv2.COLOR_BGR2RGB)
    gray_moon = cv2.cvtColor(moon_crop, cv2.COLOR_BGR2GRAY)
    moon_mask = ((rgb_moon[:, :, 0] > 130) & (rgb_moon[:, :, 1] > 95) & (rgb_moon[:, :, 2] > 105) & 
                 (gray_moon > 100) & (rgb_moon[:, :, 0] < 205)).astype(np.uint8) * 255
    cnts_moon, _ = cv2.findContours(moon_mask, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_TC89_KCOS)
    moon_d = []
    moon_ox, moon_oy = 835, 75
    moon_scale = 1.1
    for c in cnts_moon:
        if cv2.contourArea(c) < 50:
            continue
        approx = cv2.approxPolyDP(c, 0.2, True)
        moon_d.append(pts_to_d(approx.reshape(-1, 2), moon_ox, moon_oy, moon_scale, moon_scale))
    
    svg = []
    svg.append(f'<svg viewBox="0 0 {canvas_w} {canvas_h}" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">')
    
    # Linear gradient for the vermilion blood sky
    svg.append('  <defs>')
    svg.append('    <linearGradient id="bloodSky" x1="0" y1="0" x2="0" y2="100%">')
    svg.append('      <stop offset="0%" stop-color="#E83A40" />')
    svg.append('      <stop offset="60%" stop-color="#EC4447" />')
    svg.append('      <stop offset="100%" stop-color="#D93339" />')
    svg.append('    </linearGradient>')
    svg.append('  </defs>')
    
    # Layer 1: Sky Base
    svg.append(f'  <!-- Layer 1: Blood Sky -->')
    svg.append(f'  <rect width="{canvas_w}" height="{canvas_h}" fill="url(#bloodSky)" />')
    
    # Layer 2: Authentic Moon Silhouette
    if moon_d:
        svg.append(f'  <!-- Layer 2: Authentic Dusky Moon -->')
        svg.append(f'  <path d="{" ".join(moon_d)}" fill="#BA9DA0" opacity="0.95" />')
    else:
        svg.append(f'  <circle cx="850" cy="95" r="28" fill="#BA9DA0" opacity="0.95" />')
        
    # Layer 3: Solid Ground Baseline
    svg.append(f'  <!-- Solid Ground Baseline -->')
    svg.append(f'  <rect x="0" y="{ground_y}" width="{canvas_w}" height="{canvas_h - ground_y}" fill="#0D0D0D" />')
    
    # Layer 4: Continuous Weathered Stone Architecture & Hills (Mauve Underlayer)
    all_earth = p_earth_l + p_earth_c + p_earth_r
    if all_earth:
        svg.append(f'  <!-- Layer 4: Weathered Stone Architecture, Hills & Crypts -->')
        svg.append(f'  <path d="{" ".join(all_earth)}" fill="#886E71" />')
        
    # Layer 5: Flaming Crypt Archway Glow
    all_flame = p_flame_l + p_flame_c + p_flame_r
    if all_flame:
        svg.append(f'  <!-- Layer 5: Crypt Arch Flame Glow -->')
        svg.append(f'  <path d="{" ".join(all_flame)}" fill="#B82833" />')
        
    # Layer 6: Pale Skin & Collar
    all_face = p_face_l + p_face_c + p_face_r
    if all_face:
        svg.append(f'  <!-- Layer 6: Pale Suited Hero Face & Collar -->')
        svg.append(f'  <path d="{" ".join(all_face)}" fill="#BA9DA0" />')
        
    # Seamless midground connecting grass
    grass_elements = []
    for gx in range(0, canvas_w, 6):
        gh = 22 + ((gx * 7) % 17) * 2
        grass_elements.append(f"M {gx},{ground_y} L {gx+3},{ground_y-gh} L {gx+6},{ground_y} Z")
    if grass_elements:
        svg.append(f'  <!-- Horizon Cemetery Grass -->')
        svg.append(f'  <path d="{" ".join(grass_elements)}" fill="#0D0D0D" />')
        
    # Layer 7: High-Precision Graphic Ink Black (All fine twigs, brick courses, Celtic knot cross, suited figure, shadows)
    all_black = p_black_l + p_black_c + p_black_r
    if all_black:
        svg.append(f'  <!-- Layer 7: Authentic High-Precision Mignola Graphic Ink Black -->')
        svg.append(f'  <path d="{" ".join(all_black)}" fill="#0D0D0D" stroke="#0D0D0D" stroke-width="0.3" stroke-linejoin="round" />')
        
    svg.append('</svg>\n')
    
    full_svg = "\n".join(svg)
    out_file = 'frontend/public/paper-landscape.svg'
    with open(out_file, 'w', encoding='utf-8') as f:
        f.write(full_svg)
        
    print(f"Generated high-precision authentic Mignola backdrop: {out_file} ({len(full_svg)} bytes)")

if __name__ == '__main__':
    build_accurate_mignola_backdrop()
