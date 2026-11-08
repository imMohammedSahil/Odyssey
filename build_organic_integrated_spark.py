import cv2
from PIL import Image
import numpy as np

img = Image.open('Enchanted Greenlight_ The Wizard’s Door.png').convert('RGB')
arr = np.array(img)
smooth = cv2.bilateralFilter(arr, d=5, sigmaColor=25, sigmaSpace=25)
gray = cv2.cvtColor(smooth, cv2.COLOR_RGB2GRAY)

from vectorize_wizard_greenlight import extract_paths

w, h = 1672, 941
wand_x, wand_y = 928, 328

Y, X = np.ogrid[:h, :w]
theta = np.radians(43.0)
cos_t = np.cos(theta)
sin_t = np.sin(theta)

dx = X - wand_x
dy = Y - wand_y

u = dx * cos_t - dy * sin_t
v = dx * sin_t + dy * cos_t

u_norm = np.where(u >= 0, u / 120.0, u / 90.0)
v_norm = v / 50.0
zone = (u_norm**2 + v_norm**2) <= 1.0

# 1. Wooden wand stick (meeting the bulb smoothly)
wand_mask = zone & (u < 5) & (gray < 45)
p_wand = extract_paths(wand_mask, min_area=5, approx_eps=0.4)

# 2. Outer emerald atmosphere
outer_mask = zone & (gray >= 135) & (gray < 195)
p_outer = extract_paths(outer_mask, min_area=6, approx_eps=0.4)

# 3. Mint plasma flame & neck fold
mint_mask = zone & (gray >= 195) & (gray < 235)
p_mint = extract_paths(mint_mask, min_area=4, approx_eps=0.35)

# 4. White-hot neck tendrils (feathered, no hard shapes)
white_mask = zone & (gray >= 235) & (u > 8)
p_white_neck = extract_paths(white_mask, min_area=3, approx_eps=0.3)

defs = f'''  <defs>
    <!-- Ultra-Smooth Feathered Optical Core Glow (Continuous Gaussian Falloff, ZERO hard edges) -->
    <radialGradient id="smoothBulbOpticalGlow" cx="{wand_x}" cy="{wand_y}" r="68" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#FFFFFF" stop-opacity="1.0" />
      <stop offset="20%" stop-color="#FFFFFF" stop-opacity="0.95" />
      <stop offset="42%" stop-color="#E0FFE8" stop-opacity="0.80" />
      <stop offset="62%" stop-color="#72FFA5" stop-opacity="0.48" />
      <stop offset="80%" stop-color="#24C862" stop-opacity="0.20" />
      <stop offset="94%" stop-color="#0E7836" stop-opacity="0.05" />
      <stop offset="100%" stop-color="#000000" stop-opacity="0.0" />
    </radialGradient>

    <!-- Wider Ambient Green Halo -->
    <radialGradient id="smoothAmbientHalo" cx="{wand_x}" cy="{wand_y}" r="150" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#62FF98" stop-opacity="0.65" />
      <stop offset="35%" stop-color="#22D065" stop-opacity="0.35" />
      <stop offset="70%" stop-color="#0E7836" stop-opacity="0.12" />
      <stop offset="100%" stop-color="#000000" stop-opacity="0.0" />
    </radialGradient>

    <!-- Upward Neck Blend Gradient -->
    <linearGradient id="smoothNeckBeam" x1="{wand_x}" y1="{wand_y}" x2="{wand_x + 55}" y2="{wand_y - 65}" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#FFFFFF" stop-opacity="0.95" />
      <stop offset="45%" stop-color="#B6FFD4" stop-opacity="0.75" />
      <stop offset="80%" stop-color="#46F887" stop-opacity="0.30" />
      <stop offset="100%" stop-color="#14B052" stop-opacity="0.0" />
    </linearGradient>

    <!-- High-Quality Feather Filter for Soft Light Bleed -->
    <filter id="softGlowFilter" x="-40%" y="-40%" width="180%" height="180%">
      <feGaussianBlur stdDeviation="5.0" result="blur" />
      <feMerge>
        <feMergeNode in="blur" />
        <feMergeNode in="SourceGraphic" />
      </feMerge>
    </filter>

    <filter id="featherNeck" x="-30%" y="-30%" width="160%" height="160%">
      <feGaussianBlur stdDeviation="3.0" />
    </filter>
  </defs>'''

svg = [f'<svg viewBox="0 0 {w} {h}" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg" shape-rendering="geometricPrecision">']
svg.append(defs)

# 1. Wide Ambient Green Halo
svg.append(f'  <!-- 1. Ambient Green Halo -->\n  <circle cx="{wand_x}" cy="{wand_y}" r="150" fill="url(#smoothAmbientHalo)" />')

# 2. Wooden wand stick (grounding the light onto the wood)
if p_wand:
    svg.append(f'  <!-- 2. Wooden Wand Stick -->\n  <path d="{" ".join(p_wand)}" fill="#020804" stroke="#020804" stroke-width="0.7" />')

# 3. Outer Emerald Plasma Corona
if p_outer:
    svg.append(f'  <!-- 3. Emerald Corona -->\n  <path d="{" ".join(p_outer)}" fill="#1EB859" opacity="0.7" filter="url(#softGlowFilter)" fill-rule="evenodd" />')

# 4. Mint Flame Body
if p_mint:
    svg.append(f'  <!-- 4. Mint Plasma Body -->\n  <path d="{" ".join(p_mint)}" fill="#54F68C" opacity="0.85" filter="url(#featherNeck)" fill-rule="evenodd" />')

# 5. Upward Neck Beam Wash (Smooth continuous flare along the neck)
svg.append(f'  <!-- 5. Upward Neck Beam Flare -->\n  <ellipse cx="{wand_x + 24}" cy="{wand_y - 28}" rx="32" ry="16" transform="rotate(-43 {wand_x + 24} {wand_y - 28})" fill="url(#smoothNeckBeam)" filter="url(#featherNeck)" />')

# 6. Feathered White-Hot Neck Filaments
if p_white_neck:
    svg.append(f'  <!-- 6. White-Hot Neck Filaments -->\n  <path d="{" ".join(p_white_neck)}" fill="#FFFFFF" opacity="0.9" filter="url(#featherNeck)" fill-rule="evenodd" />')

# 7. Ultra-Smooth Feathered Optical Core (Continuous seamless falloff - NO hard white dot!)
svg.append(f'  <!-- 7. Seamless Feathered Optical Core Glow -->\n  <circle cx="{wand_x}" cy="{wand_y}" r="68" fill="url(#smoothBulbOpticalGlow)" filter="url(#softGlowFilter)" />')

svg.append('</svg>')

full_svg = '\n'.join(svg)
with open('frontend/public/wand-spark-flame.svg', 'w', encoding='utf-8') as f:
    f.write(full_svg)

print(f'Generated seamless feathered wand flame! Size: {len(full_svg):,} bytes')
