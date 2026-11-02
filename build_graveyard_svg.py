import cv2
import numpy as np

def pts_to_d(pts, ox=0, oy=0, scale_x=1.0, scale_y=1.0):
    coords = [f"{int(round(p[0]*scale_x + ox))},{int(round(p[1]*scale_y + oy))}" for p in pts]
    return f"M {coords[0]} " + " ".join([f"L {c}" for c in coords[1:]]) + " Z"

def extract_paths(mask, min_area=15, approx_eps=0.4, ox=0, oy=0, sx=1.0, sy=1.0):
    contours, hierarchy = cv2.findContours(mask, cv2.RETR_CCOMP, cv2.CHAIN_APPROX_TC89_KCOS)
    if hierarchy is None:
        return []
    path_list = []
    for cnt in contours:
        if cv2.contourArea(cnt) < min_area:
            continue
        approx = cv2.approxPolyDP(cnt, approx_eps, True)
        if len(approx) < 3:
            continue
        pts = approx.reshape(-1, 2)
        path_list.append(pts_to_d(pts, ox, oy, sx, sy))
    return path_list

def generate_svg():
    ref_path = r'C:\Users\Mohammed sahil\.gemini\antigravity\brain\8771b7bb-9185-4395-a894-022cd4625b49\.user_uploaded\media_1793630499506_2b4beb15.jpg'
    img = cv2.imread(ref_path)
    if img is None:
        raise ValueError(f"Could not load image from {ref_path}")
    orig_h, orig_w = img.shape[:2] # 1024 x 791
    
    # Target landscape canvas: 1200 x 675 (16:9 widescreen)
    canvas_w = 1200
    canvas_h = 675
    
    # We want the active height of the art (y: 0..800) to fit in ~600px of the canvas
    scale = 675.0 / 880.0 # ~0.767
    scaled_w = orig_w * scale # ~606.7
    ox = (canvas_w - scaled_w) / 2.0 # centered: ~296.6
    oy = 0.0 # top-aligned so the tree and red sky reach the top!
    
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    hsv = cv2.cvtColor(img, cv2.COLOR_BGR2HSV)
    
    # 1. Black Ink Mask (the tree, stone outlines, shadows, grass blades, suit, solid ground)
    _, black_mask = cv2.threshold(gray, 48, 255, cv2.THRESH_BINARY_INV)
    
    # 2. Stone Midtone Mask (weathered mauve granite)
    stone_mask = (hsv[:, :, 1] < 92) & (gray > 48) & (gray < 172)
    stone_mask = cv2.morphologyEx(stone_mask.astype(np.uint8)*255, cv2.MORPH_OPEN, cv2.getStructuringElement(cv2.MORPH_RECT, (2, 2)))
    
    # 3. Crypt Arch Flame Glow (inside the right mausoleum arch)
    arch_mask = np.zeros_like(gray)
    arch_mask[440:540, 650:orig_w] = (((hsv[440:540, 650:orig_w, 0] < 12) | (hsv[440:540, 650:orig_w, 0] > 168)) & 
                                     (hsv[440:540, 650:orig_w, 1] > 130) & 
                                     (hsv[440:540, 650:orig_w, 2] < 195)).astype(np.uint8) * 255

    # 4. Figure Face / Skin Mask (pale bone/chalk skin on the bald head)
    face_mask = np.zeros_like(gray)
    face_mask[510:600, 350:425] = ((gray[510:600, 350:425] > 70) & (gray[510:600, 350:425] < 150)).astype(np.uint8) * 255
    
    # Extract path data
    p_stone = extract_paths(stone_mask, min_area=12, approx_eps=0.4, ox=ox, oy=oy, sx=scale, sy=scale)
    p_arch = extract_paths(arch_mask, min_area=8, approx_eps=0.4, ox=ox, oy=oy, sx=scale, sy=scale)
    p_face = extract_paths(face_mask, min_area=10, approx_eps=0.35, ox=ox, oy=oy, sx=scale, sy=scale)
    p_black = extract_paths(black_mask, min_area=8, approx_eps=0.35, ox=ox, oy=oy, sx=scale, sy=scale)
    
    # Moon position in scaled canvas
    moon_cx = int(round(622 * scale + ox))
    moon_cy = int(round(138 * scale + oy))
    moon_r = int(round(31 * scale))
    
    svg = []
    svg.append(f'<svg viewBox="0 0 {canvas_w} {canvas_h}" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">')
    
    # Defs
    svg.append('  <defs>')
    svg.append('    <linearGradient id="bloodSky" x1="0" y1="0" x2="0" y2="100%">')
    svg.append('      <stop offset="0%" stop-color="#E83A40" />')
    svg.append('      <stop offset="50%" stop-color="#EC4447" />')
    svg.append('      <stop offset="100%" stop-color="#DF353B" />')
    svg.append('    </linearGradient>')
    svg.append('  </defs>')
    
    # Full bleed crimson sky across entire 1200 canvas
    svg.append(f'  <!-- Crimson Blood Sky -->')
    svg.append(f'  <rect width="{canvas_w}" height="{canvas_h}" fill="url(#bloodSky)" />')
    
    # Full bleed solid black ground across lower section
    ground_y = int(round(720 * scale + oy)) # ~552px
    svg.append(f'  <!-- Full Bleed Ground Baseline -->')
    svg.append(f'  <rect x="0" y="{ground_y}" width="{canvas_w}" height="{canvas_h - ground_y}" fill="#0D0D0D" />')
    
    # Left sky tree extension (branches reaching into the left sky for cinematic panoramic fill)
    left_branches_svg = f'''  <!-- Extended Left Tree Branches -->
  <g fill="#0D0D0D" stroke="#0D0D0D">
    <path d="M {int(ox)+15},160 Q 200,120 120,90 Q 60,65 0,80 L 0,110 Q 50,100 110,115 Q 180,135 {int(ox)+25},175 Z" />
    <path d="M 120,90 Q 80,40 30,30 L 25,40 Q 70,50 110,95 Z" />
    <path d="M {int(ox)+10},240 Q 180,210 90,200 Q 40,195 0,220 L 0,240 Q 50,220 100,225 Q 190,230 {int(ox)+20},255 Z" />
    <path d="M 90,200 Q 60,160 10,150 L 8,160 Q 50,170 85,205 Z" />
    <path d="M {int(ox)+5},320 Q 150,300 0,290 L 0,310 Q 140,315 {int(ox)+10},335 Z" />
  </g>'''
    svg.append(left_branches_svg)
    
    # Right sky extension (distant mausoleum wall and cemetery fence in dark silhouette)
    right_cemetery_svg = f'''  <!-- Extended Right Cemetery Architecture -->
  <g fill="#886E71" stroke="#0D0D0D">
    <!-- Extended Crypt Wall -->
    <rect x="{int(ox + scaled_w)-5}" y="{int(round(310*scale))}" width="{canvas_w - int(ox + scaled_w) + 10}" height="{canvas_h - int(round(310*scale))}" fill="#886E71" />
  </g>
  <g fill="#0D0D0D" stroke="#0D0D0D">
    <!-- Crypt cornice continuation -->
    <rect x="{int(ox + scaled_w)-10}" y="{int(round(310*scale))}" width="{canvas_w - int(ox + scaled_w) + 10}" height="14" fill="#0D0D0D" />
    <rect x="{int(ox + scaled_w)-10}" y="{int(round(335*scale))}" width="{canvas_w - int(ox + scaled_w) + 10}" height="8" fill="#0D0D0D" />
    <!-- Distant Headstone Silhouettes on the right -->
    <path d="M 1060,{ground_y} L 1060,{ground_y-55} Q 1075,{ground_y-75} 1090,{ground_y-55} L 1090,{ground_y} Z" />
    <path d="M 1120,{ground_y} L 1120,{ground_y-70} L 1145,{ground_y-70} L 1145,{ground_y} Z" />
    <!-- Distant Cross on Right -->
    <path d="M 1130,{ground_y-110} L 1135,{ground_y-110} L 1135,{ground_y-70} L 1130,{ground_y-70} Z" />
    <path d="M 1122,{ground_y-98} L 1143,{ground_y-98} L 1143,{ground_y-93} L 1122,{ground_y-93} Z" />
  </g>'''
    svg.append(right_cemetery_svg)
    
    # Pale Moon
    svg.append(f'  <!-- Pale Dusky Moon -->')
    svg.append(f'  <circle cx="{moon_cx}" cy="{moon_cy}" r="{moon_r}" fill="#BA9DA0" opacity="0.95" />')
    svg.append(f'  <circle cx="{moon_cx}" cy="{moon_cy}" r="{moon_r+2}" fill="none" stroke="#A38184" stroke-width="1" opacity="0.6" />')
    
    # Crypt Archway Flame Glow
    if p_arch:
        svg.append(f'  <!-- Crypt Portal Flame Glow -->')
        svg.append(f'  <path d="{" ".join(p_arch)}" fill="#B82833" />')
        
    # Stone Midtones (Crypts, Tombstones, Grass backdrop, Celtic Cross)
    if p_stone:
        svg.append(f'  <!-- Weathered Stone Architecture & Tombstone Midtones -->')
        svg.append(f'  <path d="{" ".join(p_stone)}" fill="#886E71" />')
        
    # Pale Skin of Suited Figure
    if p_face:
        svg.append(f'  <!-- Pale Suited Figure Face -->')
        svg.append(f'  <path d="{" ".join(p_face)}" fill="#BA9DA0" />')
        
    # Solid Graphic Ink Black (The Bare Tree, All Silhouettes, Inking Lines, Suited Figure & Ground)
    if p_black:
        svg.append(f'  <!-- Solid Graphic Ink Black Silhouettes & Shadows -->')
        svg.append(f'  <path d="{" ".join(p_black)}" fill="#0D0D0D" stroke="#0D0D0D" stroke-width="0.6" stroke-linejoin="round" />')
        
    svg.append('</svg>\n')
    
    output_svg = "\n".join(svg)
    
    out_file = 'frontend/public/paper-landscape.svg'
    with open(out_file, 'w', encoding='utf-8') as f:
        f.write(output_svg)
        
    print(f"Generated widescreen graveyard backdrop: {out_file} ({len(output_svg)} bytes)")

if __name__ == '__main__':
    generate_svg()

