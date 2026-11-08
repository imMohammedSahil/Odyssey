import cv2
import numpy as np
from PIL import Image
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

def extract_paths(mask, min_area=12, approx_eps=0.5, sharp_angle=45.0):
    contours, _ = cv2.findContours(mask.astype(np.uint8), cv2.RETR_CCOMP, cv2.CHAIN_APPROX_TC89_KCOS)
    paths = []
    for cnt in contours:
        area = cv2.contourArea(cnt)
        if area < min_area:
            continue
        approx = cv2.approxPolyDP(cnt, approx_eps, True)
        if len(approx) < 3:
            continue
        pts = approx.reshape(-1, 2).astype(float)
        p_str = pts_to_smooth_path(pts, sharp_angle_deg=sharp_angle)
        if p_str:
            paths.append(p_str)
    return paths

def build_wizard_svg():
    t0 = time.time()
    img_path = 'Enchanted Greenlight_ The Wizard’s Door.png'
    img_pil = Image.open(img_path).convert('RGB')
    arr = np.array(img_pil)
    h, w, _ = arr.shape
    print(f"Loaded {w}x{h} reference image in {time.time()-t0:.2f}s")

    # Bilateral smoothing for noise-free graphic-novel cel separation
    bgr = cv2.cvtColor(arr, cv2.COLOR_RGB2BGR)
    smooth = cv2.bilateralFilter(bgr, d=5, sigmaColor=25, sigmaSpace=25)
    gray = cv2.cvtColor(smooth, cv2.COLOR_BGR2GRAY)

    # Coords of focal points (Physical tip of wooden wand)
    wand_x, wand_y = 910, 331
    grimoire_x, grimoire_y = 1347, 813
    door_x, door_y = 1090, 480

    defs = f'''  <defs>
    <!-- Dark Occult Wall Base Gradient -->
    <linearGradient id="occultWallGradient" x1="0" y1="0" x2="0" y2="100%">
      <stop offset="0%" stop-color="#020B07" />
      <stop offset="35%" stop-color="#05170E" />
      <stop offset="70%" stop-color="#082316" />
      <stop offset="100%" stop-color="#020805" />
    </linearGradient>

    <!-- Floor Perspective Vignette -->
    <linearGradient id="floorDepthGradient" x1="0" y1="690" x2="0" y2="941" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#082A1B" stop-opacity="0.85" />
      <stop offset="60%" stop-color="#051B11" stop-opacity="0.95" />
      <stop offset="100%" stop-color="#020805" stop-opacity="1.0" />
    </linearGradient>

    <!-- Radiant Wand Core Bloom (White-hot incandescence at wand tip x={wand_x}, y={wand_y}) -->
    <radialGradient id="wandBloomCore" cx="{wand_x}" cy="{wand_y}" r="220" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#FFFFFF" stop-opacity="1.0" />
      <stop offset="10%" stop-color="#FFFFFF" stop-opacity="0.95" />
      <stop offset="22%" stop-color="#DCFFE7" stop-opacity="0.80" />
      <stop offset="40%" stop-color="#60FFA0" stop-opacity="0.45" />
      <stop offset="62%" stop-color="#23BD60" stop-opacity="0.18" />
      <stop offset="82%" stop-color="#0D6B35" stop-opacity="0.04" />
      <stop offset="100%" stop-color="#02140A" stop-opacity="0" />
    </radialGradient>

    <!-- Wide Atmospheric Room Light Cast from Wand -->
    <radialGradient id="wandRoomAura" cx="{wand_x}" cy="{wand_y}" r="640" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#46E880" stop-opacity="0.45" />
      <stop offset="35%" stop-color="#229C52" stop-opacity="0.25" />
      <stop offset="70%" stop-color="#0D4B27" stop-opacity="0.10" />
      <stop offset="100%" stop-color="#031A0D" stop-opacity="0" />
    </radialGradient>

    <!-- Doorway Green Light Wash (x={door_x}, y={door_y}) -->
    <radialGradient id="doorWash" cx="{door_x}" cy="{door_y}" rx="270" ry="330" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#44DD76" stop-opacity="0.38" />
      <stop offset="45%" stop-color="#1E8B46" stop-opacity="0.20" />
      <stop offset="100%" stop-color="#052814" stop-opacity="0" />
    </radialGradient>

    <!-- Floor Light Beam Strike towards Grimoire (from {wand_x},{wand_y} to {grimoire_x},{grimoire_y}) -->
    <linearGradient id="floorMagicBeam" x1="{wand_x}" y1="{wand_y}" x2="{grimoire_x}" y2="{grimoire_y}" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#80FFAE" stop-opacity="0.80" />
      <stop offset="40%" stop-color="#40E278" stop-opacity="0.55" />
      <stop offset="80%" stop-color="#179C4A" stop-opacity="0.25" />
      <stop offset="100%" stop-color="#0A5025" stop-opacity="0" />
    </linearGradient>

    <!-- Grimoire Ancient Tome Arcane Aura (x={grimoire_x}, y={grimoire_y}) -->
    <radialGradient id="grimoireAura" cx="{grimoire_x}" cy="{grimoire_y}" rx="160" ry="90" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#7BFF9F" stop-opacity="0.75" />
      <stop offset="35%" stop-color="#34D469" stop-opacity="0.45" />
      <stop offset="75%" stop-color="#0E5E2C" stop-opacity="0.15" />
      <stop offset="100%" stop-color="#031A0D" stop-opacity="0" />
    </radialGradient>

    <!-- Soft Plasma Glow Filter for Magic Tendrils -->
    <filter id="plasmaGlow" x="-30%" y="-30%" width="160%" height="160%">
      <feGaussianBlur stdDeviation="4.0" result="glow" />
      <feMerge>
        <feMergeNode in="glow" />
        <feMergeNode in="SourceGraphic" />
      </feMerge>
    </filter>
  </defs>'''

    svg_layers = []

    # Layer 0: Base Chamber Wall
    svg_layers.append('  <!-- Layer 0: Dark Occult Wall Base -->')
    svg_layers.append(f'  <rect width="{w}" height="{h}" fill="url(#occultWallGradient)" />')

    # Layer 1: Atmospheric Room Illumination & Door Wash
    svg_layers.append('  <!-- Layer 1: Atmospheric Room Bloom & Doorway Light Wash -->')
    svg_layers.append(f'  <circle cx="{wand_x}" cy="{wand_y}" r="640" fill="url(#wandRoomAura)" />')
    svg_layers.append(f'  <ellipse cx="{door_x}" cy="{door_y}" rx="270" ry="330" fill="url(#doorWash)" />')

    # Layer 2-7: Progressive Color Tones of Room & Geometry
    color_steps = [
        ("Layer 2: Chamber Deep Forest Tone", 30, 52, "#062618", 28, 0.60),
        ("Layer 3: Ambient Chamber Moss Tone", 52, 78, "#0B3B24", 24, 0.55),
        ("Layer 4: Midtone Emerald Wall & Door Base", 78, 108, "#145A37", 20, 0.50),
        ("Layer 5: Vibrant Emerald Wall & Robe Midtone", 108, 142, "#23854F", 16, 0.45),
        ("Layer 6: Radiant Emerald Light Wash", 142, 178, "#39B86D", 12, 0.40),
        ("Layer 7: Luminous Mint Illumination", 178, 205, "#5FE291", 10, 0.38),
    ]

    for name, min_g, max_g, hex_col, min_area, eps in color_steps:
        mask = (gray >= min_g) & (gray < max_g)
        k = cv2.getStructuringElement(cv2.MORPH_RECT, (2, 2))
        mask_clean = cv2.morphologyEx(mask.astype(np.uint8) * 255, cv2.MORPH_OPEN, k)
        paths = extract_paths(mask_clean, min_area=min_area, approx_eps=eps)
        if paths:
            svg_layers.append(f'  <!-- {name} -->')
            svg_layers.append(f'  <path d="{" ".join(paths)}" fill="{hex_col}" fill-rule="evenodd" />')

    # Layer 8: Floor Perspective Lighting & Grimoire Beam
    svg_layers.append('  <!-- Layer 8: Floor Perspective Depth, Beam & Grimoire Arcane Aura -->')
    svg_layers.append(f'  <ellipse cx="{grimoire_x}" cy="{grimoire_y}" rx="160" ry="90" fill="url(#grimoireAura)" />')

    # Layer 9: Razor-Sharp Mignola Comic Void Black Ink & Deep Shadows
    # Deep ink regions + Canny edges for line art (face, glasses, cloak folds, book demon, door moldings, picture frames)
    black_mask = (gray < 36).astype(np.uint8) * 255
    edges = cv2.Canny(smooth, 26, 75)
    k_edge = cv2.getStructuringElement(cv2.MORPH_RECT, (2, 2))
    edges_dil = cv2.dilate(edges, k_edge)
    black_combined = cv2.bitwise_or(black_mask, edges_dil)

    # Exclude bright magic cores so lineart doesn't cut across glowing plasma cores
    bright_cores = (gray > 195)
    black_combined[bright_cores] = 0

    k_clean = cv2.getStructuringElement(cv2.MORPH_RECT, (2, 2))
    black_clean = cv2.morphologyEx(black_combined, cv2.MORPH_OPEN, k_clean)
    black_paths = extract_paths(black_clean, min_area=12, approx_eps=0.5)
    if black_paths:
        svg_layers.append('  <!-- Layer 9: Razor-Sharp Mignola Comic Void Black Ink, Billowing Cloak Folds, Framing & Demon Grimoire Details -->')
        svg_layers.append(f'  <path d="{" ".join(black_paths)}" fill="#020804" stroke="#020804" stroke-width="0.5" stroke-linejoin="round" stroke-linecap="round" fill-rule="evenodd" />')

    # Layer 10: Ethereal Magic Plasma Swirls & Glowing Ribbons (Drawn on top of ink lines for true glowing comic bloom!)
    # 10A: Outer plasma aura
    plasma_outer = (gray >= 170)
    p_outer = extract_paths(plasma_outer, min_area=8, approx_eps=0.45)
    if p_outer:
        svg_layers.append('  <!-- Layer 10A: Ethereal Magic Plasma Outer Halo -->')
        svg_layers.append(f'  <path d="{" ".join(p_outer)}" fill="#38DE79" opacity="0.65" filter="url(#plasmaGlow)" fill-rule="evenodd" />')

    # 10B: Luminous mint ribbon body
    plasma_body = (gray >= 195)
    p_body = extract_paths(plasma_body, min_area=6, approx_eps=0.4)
    if p_body:
        svg_layers.append('  <!-- Layer 10B: Luminous Mint Magical Energy Ribbons -->')
        svg_layers.append(f'  <path d="{" ".join(p_body)}" fill="#72FFA5" fill-rule="evenodd" />')

    # 10C: Bright neon mint ribbon highlights
    plasma_hi = (gray >= 220)
    p_hi = extract_paths(plasma_hi, min_area=5, approx_eps=0.35)
    if p_hi:
        svg_layers.append('  <!-- Layer 10C: Bright Neon Mint Ribbon Highlights -->')
        svg_layers.append(f'  <path d="{" ".join(p_hi)}" fill="#B4FFD3" fill-rule="evenodd" />')

    # 10D: Incandescent White-Hot Magic Filaments & Wand Core
    white_filaments = (gray >= 240)
    p_white = extract_paths(white_filaments, min_area=3, approx_eps=0.3)
    if p_white:
        svg_layers.append('  <!-- Layer 10D: Incandescent White-Hot Magic Filaments & Wand Core -->')
        svg_layers.append(f'  <path d="{" ".join(p_white)}" fill="#FFFFFF" fill-rule="evenodd" />')

    # 10E: Floating magical motes & spark embers
    motes_mask = (gray >= 175) & (~plasma_body)
    motes_clean = cv2.morphologyEx(motes_mask.astype(np.uint8) * 255, cv2.MORPH_OPEN, cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (2, 2)))
    p_motes = extract_paths(motes_clean, min_area=2, approx_eps=0.3)
    if p_motes:
        svg_layers.append('  <!-- Layer 10E: Floating Arcane Motes & Spark Embers -->')
        svg_layers.append(f'  <path d="{" ".join(p_motes)}" fill="#8AFFBA" fill-rule="evenodd" />')

    # Layer 11: Wand Bloom Core Flare (Smooth outward atmospheric decay with no sharp circular boundary)
    svg_layers.append(f'  <!-- Layer 11: Wand Tip Radiant Core Incandescence (Smooth outward atmospheric decay) -->\n  <circle cx="{wand_x}" cy="{wand_y}" r="240" fill="url(#wandBloomCore)" />')

    # Layer 12: Inscribed Down Arrow Mark on Center Door Panel (Environment Matched)
    door_inscription = '''  <!-- Layer 12: Inscribed Down Arrow Mark on Center Door Panel (Environment Matched) -->
  <g id="doorArrowMark" transform="translate(1112, 510)">
    <!-- Deep carved relief shadow in comic black-green ink -->
    <path d="M 0,22 L -14,6 L -5,6 L -5,-18 L 5,-18 L 5,6 L 14,6 Z"
          fill="#020a05" transform="translate(2, 2)" opacity="0.95" />
    <!-- Chiseled stone arrow face illuminated by wand's radiant greenlight -->
    <path d="M 0,22 L -14,6 L -5,6 L -5,-18 L 5,-18 L 5,6 L 14,6 Z"
          fill="#8AFFBA" stroke="#04160b" stroke-width="2"
          stroke-linejoin="round" />
  </g>'''
    svg_layers.append(door_inscription)

    # Assemble complete SVG
    header = f'<svg viewBox="0 0 {w} {h}" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg" shape-rendering="geometricPrecision">\n{defs}\n'
    footer = '</svg>\n'
    full_svg = header + "\n".join(svg_layers) + "\n" + footer

    out_file = 'frontend/public/wizard-enchanted-greenlight.svg'
    with open(out_file, 'w', encoding='utf-8') as f:
        f.write(full_svg)

    print(f"Generated Wizard Enchanted Greenlight SVG at {out_file}! Size: {len(full_svg):,} bytes in {time.time()-t0:.2f}s")

if __name__ == '__main__':
    build_wizard_svg()
