import cv2
from PIL import Image
import numpy as np

img = Image.open('Enchanted Greenlight_ The Wizard’s Door.png').convert('RGB')
arr = np.array(img)
smooth = cv2.bilateralFilter(arr, d=5, sigmaColor=25, sigmaSpace=25)
gray = cv2.cvtColor(smooth, cv2.COLOR_RGB2GRAY)

from vectorize_wizard_greenlight import extract_paths

w, h = 1672, 941

# Integrated organic zone:
# From wand stick (820, 420) through bulb (929, 328) to plume base (1010, 210)
Y, X = np.ogrid[:h, :w]

# Rotated distance along the wand-flame-neck axis (angle ~ -43 degrees)
# Origin at bulb center (929, 328)
theta = np.radians(43.0)
cos_t = np.cos(theta)
sin_t = np.sin(theta)

dx = X - 932
dy = Y - 322

# u runs along wand-plume axis (negative toward wand, positive toward plume)
u = dx * cos_t - dy * sin_t
# v is perpendicular
v = dx * sin_t + dy * cos_t

# Organic asymmetric envelope:
# Longer along the axis (u from -90 to +110), tighter across (v from -45 to +45)
# Tapers naturally at both ends!
u_norm = np.where(u >= 0, u / 125.0, u / 95.0)
v_norm = v / 52.0
dist_flame = u_norm**2 + v_norm**2
zone = dist_flame <= 1.0

# 1. White-hot core and neck (The bulb and the neck pointed to by Arrow 2)
white_mask = zone & (gray >= 232)
p_white = extract_paths(white_mask, min_area=3, approx_eps=0.3)

# 2. Luminous mint flame & plume fold (pointed to by Arrow 3)
mint_mask = zone & (gray >= 195) & (gray < 232)
p_mint = extract_paths(mint_mask, min_area=4, approx_eps=0.35)

# 3. Outer emerald corona
outer_mask = zone & (gray >= 135) & (gray < 195)
p_outer = extract_paths(outer_mask, min_area=6, approx_eps=0.4)

# 4. Wooden wand stick meeting the bulb (pointed to by Arrow 1)
wand_mask = zone & (u < 10) & (gray < 45)
p_wand = extract_paths(wand_mask, min_area=5, approx_eps=0.4)

defs = f'''  <defs>
    <!-- Organic Asymmetric Falloff Mask (Conforms to Wand & Plume Neck) -->
    <radialGradient id="integratedFlameBloom" cx="932" cy="322" r="140" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#FFFFFF" stop-opacity="0.95" />
      <stop offset="25%" stop-color="#D4FFE0" stop-opacity="0.85" />
      <stop offset="55%" stop-color="#46F887" stop-opacity="0.45" />
      <stop offset="85%" stop-color="#0E7836" stop-opacity="0.10" />
      <stop offset="100%" stop-color="#000000" stop-opacity="0.0" />
    </radialGradient>

    <!-- Incandescent Core Glow at Bulb -->
    <radialGradient id="bulbCore" cx="928" cy="328" r="48" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#FFFFFF" stop-opacity="1.0" />
      <stop offset="45%" stop-color="#FFFFFF" stop-opacity="0.98" />
      <stop offset="72%" stop-color="#D4FFE0" stop-opacity="0.85" />
      <stop offset="100%" stop-color="#46F887" stop-opacity="0.0" />
    </radialGradient>

    <!-- Upward Flare Glow along the Neck (Arrow 2) -->
    <linearGradient id="neckFlare" x1="915" y1="340" x2="975" y2="275" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#FFFFFF" stop-opacity="0.95" />
      <stop offset="50%" stop-color="#B4FFD5" stop-opacity="0.85" />
      <stop offset="100%" stop-color="#46F887" stop-opacity="0.0" />
    </linearGradient>

    <!-- Organic Plasma Soft Glow Filter -->
    <filter id="flameBlur" x="-30%" y="-30%" width="160%" height="160%">
      <feGaussianBlur stdDeviation="3.0" result="glow" />
      <feMerge>
        <feMergeNode in="glow" />
        <feMergeNode in="SourceGraphic" />
      </feMerge>
    </filter>
  </defs>'''

svg = [f'<svg viewBox="0 0 {w} {h}" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg" shape-rendering="geometricPrecision">']
svg.append(defs)

# 1. Soft atmospheric light wash around the flame
svg.append('  <!-- 1. Atmospheric Ambient Green Bloom -->')
svg.append('  <circle cx="932" cy="322" r="140" fill="url(#integratedFlameBloom)" />')

# 2. Wooden wand stick (Arrow 1)
if p_wand:
    svg.append('  <!-- 2. Wooden Wand Stick (Arrow 1) -->')
    svg.append(f'  <path d="{" ".join(p_wand)}" fill="#020804" stroke="#020804" stroke-width="0.8" />')

# 3. Outer emerald corona & plume edge (Arrow 3)
if p_outer:
    svg.append('  <!-- 3. Outer Emerald Corona & Plume Edge (Arrow 3) -->')
    svg.append(f'  <path d="{" ".join(p_outer)}" fill="#1FB357" opacity="0.75" filter="url(#flameBlur)" fill-rule="evenodd" />')

# 4. Mint plasma flame body & plume fold
if p_mint:
    svg.append('  <!-- 4. Luminous Mint Plasma Body & Plume Fold -->')
    svg.append(f'  <path d="{" ".join(p_mint)}" fill="#54F68C" fill-rule="evenodd" />')

# 5. Flared Neck Gradient Fill (Arrow 2)
svg.append('  <!-- 5. Flared Neck Light Wash (Arrow 2) -->')
svg.append('  <ellipse cx="945" cy="308" rx="28" ry="14" transform="rotate(-43 945 308)" fill="url(#neckFlare)" opacity="0.9" />')

# 6. Incandescent bulb & white-hot neck filaments (Arrows 1 & 2)
if p_white:
    svg.append('  <!-- 6. White-Hot Incandescent Bulb & Neck Filaments -->')
    svg.append(f'  <path d="{" ".join(p_white)}" fill="#FFFFFF" fill-rule="evenodd" />')

# 7. Pure incandescent bulb core
svg.append('  <!-- 7. Pure Incandescent Bulb Core -->')
svg.append('  <circle cx="928" cy="328" r="28" fill="url(#bulbCore)" />')
svg.append('  <circle cx="928" cy="328" r="14" fill="#FFFFFF" />')

svg.append('</svg>')

full_svg = '\n'.join(svg)
with open('frontend/public/wand-spark-flame.svg', 'w', encoding='utf-8') as f:
    f.write(full_svg)

print(f'Generated fully integrated organic wand flame! Size: {len(full_svg):,} bytes')
