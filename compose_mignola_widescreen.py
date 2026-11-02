import cv2
import numpy as np

def pts_to_d(pts, ox=0, oy=0, sx=1.0, sy=1.0):
    coords = [f"{int(round(p[0]*sx + ox))},{int(round(p[1]*sy + oy))}" for p in pts]
    return f"M {coords[0]} " + " ".join([f"L {c}" for c in coords[1:]]) + " Z"

def extract_paths_from_crop(crop, ox, oy, sx=1.0, sy=1.0):
    h, w = crop.shape[:2]
    gray = cv2.cvtColor(crop, cv2.COLOR_BGR2GRAY)
    hsv = cv2.cvtColor(crop, cv2.COLOR_BGR2HSV)
    
    # 1. Black Ink Mask
    _, black_mask = cv2.threshold(gray, 48, 255, cv2.THRESH_BINARY_INV)
    
    # 2. Stone Midtone Mask
    stone_mask = (hsv[:, :, 1] < 92) & (gray > 48) & (gray < 172)
    stone_mask = cv2.morphologyEx(stone_mask.astype(np.uint8)*255, cv2.MORPH_OPEN, cv2.getStructuringElement(cv2.MORPH_RECT, (2, 2)))
    
    # 3. Red Flame / Arch Glow
    arch_mask = (((hsv[:, :, 0] < 12) | (hsv[:, :, 0] > 168)) & (hsv[:, :, 1] > 130) & (hsv[:, :, 2] < 195)).astype(np.uint8) * 255
    
    # Extract contours
    def get_d_list(mask, min_area=12, eps=0.35):
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
        
    p_arch = get_d_list(arch_mask, min_area=8, eps=0.4)
    p_stone = get_d_list(stone_mask, min_area=10, eps=0.4)
    p_black = get_d_list(black_mask, min_area=8, eps=0.35)
    
    return p_stone, p_arch, p_black

def build_widescreen_backdrop():
    ref_path = r'C:\Users\Mohammed sahil\.gemini\antigravity\brain\8771b7bb-9185-4395-a894-022cd4625b49\.user_uploaded\media_1793630499506_2b4beb15.jpg'
    img = cv2.imread(ref_path)
    if img is None:
        raise ValueError(f"Could not load image from {ref_path}")
    orig_h, orig_w = img.shape[:2] # 1024 x 791
    
    canvas_w = 1200
    canvas_h = 675
    
    # Extract the 3 authentic components from the Mignola artwork:
    # 1. Left Tree & Left Crypt: x: 0..415, y: 0..470
    left_crop = img[0:470, 0:415]
    
    # 2. Right Mausoleum with glowing archway & tombstones: x: 520..791, y: 300..710
    right_crop = img[300:710, 520:791]
    
    # 3. Center Celtic Cross & Suited Pale Figure: x: 275..520, y: 350..720
    center_crop = img[350:720, 275:520]
    
    # Component layout across widescreen 1200x675:
    # Left Tree sits on left side:
    left_ox, left_oy = 15, 20
    left_scale = 1.12
    p_stone_l, p_arch_l, p_black_l = extract_paths_from_crop(left_crop, left_ox, left_oy, left_scale, left_scale)
    
    # Right Mausoleum sits on right side:
    right_ox, right_oy = 875, 145
    right_scale = 1.15
    p_stone_r, p_arch_r, p_black_r = extract_paths_from_crop(right_crop, right_ox, right_oy, right_scale, right_scale)
    
    # Center Celtic Cross & Hero sits in center:
    center_ox, center_oy = 475, 185
    center_scale = 1.05
    p_stone_c, p_arch_c, p_black_c = extract_paths_from_crop(center_crop, center_ox, center_oy, center_scale, center_scale)
    
    # Moon in upper-right sky
    moon_cx = 940
    moon_cy = 85
    moon_r = 30
    
    ground_y = 540
    
    svg = []
    svg.append(f'<svg viewBox="0 0 {canvas_w} {canvas_h}" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">')
    
    # Sky Gradient
    svg.append('  <defs>')
    svg.append('    <linearGradient id="bloodSky" x1="0" y1="0" x2="0" y2="100%">')
    svg.append('      <stop offset="0%" stop-color="#E7383E" />')
    svg.append('      <stop offset="55%" stop-color="#EC4447" />')
    svg.append('      <stop offset="100%" stop-color="#D93339" />')
    svg.append('    </linearGradient>')
    svg.append('  </defs>')
    
    # Full bleed crimson sky
    svg.append(f'  <rect width="{canvas_w}" height="{canvas_h}" fill="url(#bloodSky)" />')
    
    # Moon
    svg.append(f'  <!-- Moon -->')
    svg.append(f'  <circle cx="{moon_cx}" cy="{moon_cy}" r="{moon_r}" fill="#BA9DA0" opacity="0.95" />')
    svg.append(f'  <circle cx="{moon_cx}" cy="{moon_cy}" r="{moon_r+2}" fill="none" stroke="#A38184" stroke-width="1.2" opacity="0.6" />')
    
    # Solid black ground across baseline
    svg.append(f'  <!-- Solid Ground Baseline -->')
    svg.append(f'  <rect x="0" y="{ground_y}" width="{canvas_w}" height="{canvas_h - ground_y}" fill="#0D0D0D" />')
    
    # Combine stone paths
    all_stone = p_stone_l + p_stone_c + p_stone_r
    if all_stone:
        svg.append(f'  <!-- Authentic Stone Architecture, Crypts & Tombstones -->')
        svg.append(f'  <path d="{" ".join(all_stone)}" fill="#886E71" />')
        
    # Combine arch flame glows
    all_arch = p_arch_l + p_arch_c + p_arch_r
    if all_arch:
        svg.append(f'  <!-- Crypt Portal Flame Glow -->')
        svg.append(f'  <path d="{" ".join(all_arch)}" fill="#B82833" />')

    # Spiky grass connecting the hills along the horizon
    grass_elements = []
    for gx in range(380, 890, 8):
        gh = 25 + (gx % 13) * 3
        grass_elements.append(f"M {gx},{ground_y} L {gx+4},{ground_y-gh} L {gx+8},{ground_y} Z")
    if grass_elements:
        svg.append(f'  <!-- Midground Graveyard Grass -->')
        svg.append(f'  <path d="{" ".join(grass_elements)}" fill="#0D0D0D" />')
        
    # Combine black inking & silhouettes (The bare tree, crypt outlines, Celtic cross, suited figure, tombstones)
    all_black = p_black_l + p_black_c + p_black_r
    if all_black:
        svg.append(f'  <!-- Authentic Mignola Graphic Black Ink Silhouettes -->')
        svg.append(f'  <path d="{" ".join(all_black)}" fill="#0D0D0D" stroke="#0D0D0D" stroke-width="0.5" stroke-linejoin="round" />')
        
    svg.append('</svg>\n')
    
    full_svg = "\n".join(svg)
    out_file = 'frontend/public/paper-landscape.svg'
    with open(out_file, 'w', encoding='utf-8') as f:
        f.write(full_svg)
    print(f"Generated clean widescreen Mignola backdrop: {out_file} ({len(full_svg)} bytes)")

if __name__ == '__main__':
    build_widescreen_backdrop()

