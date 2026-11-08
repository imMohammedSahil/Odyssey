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

# Generous natural bounding region (2x larger than before so NO paths get cut off by an oval boundary)
Y, X = np.ogrid[:h, :w]
dx = X - wand_x
dy = Y - wand_y
dist = np.hypot(dx, dy)
# Generous 260px radius - well beyond the light reach
broad_zone = dist <= 260.0

# Extract TRUE organic artwork paths without any artificial ellipse clipping
p_outer = extract_paths(broad_zone & (gray >= 130) & (gray < 195), min_area=8, approx_eps=0.45)
p_mint = extract_paths(broad_zone & (gray >= 195) & (gray < 235), min_area=5, approx_eps=0.4)
p_white = extract_paths(broad_zone & (gray >= 235), min_area=3, approx_eps=0.3)
p_wand = extract_paths(broad_zone & (X <= wand_x + 10) & (Y >= wand_y - 10) & (gray < 45), min_area=6, approx_eps=0.4)

defs = f'''  <defs>
    <!-- Seamless 360° Non-Linear Optical Falloff Mask (Zero Oval/Box Boundaries) -->
    <mask id="infiniteSoftFalloff">
      <radialGradient id="pureGaussianFade" cx="{wand_x}" cy="{wand_y}" r="220" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stop-color="#FFFFFF" stop-opacity="1.0" />
        <stop offset="25%" stop-color="#FFFFFF" stop-opacity="0.9" />
        <stop offset="50%" stop-color="#FFFFFF" stop-opacity="0.5" />
        <stop offset="75%" stop-color="#FFFFFF" stop-opacity="0.15" />
        <stop offset="92%" stop-color="#FFFFFF" stop-opacity="0.02" />
        <stop offset="100%" stop-color="#000000" stop-opacity="0.0" />
      </radialGradient>
      <rect width="{w}" height="{h}" fill="url(#pureGaussianFade)" />
    </mask>

    <!-- Ultra-Smooth Core Bloom -->
    <radialGradient id="seamlessBulbGlow" cx="{wand_x}" cy="{wand_y}" r="75" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#FFFFFF" stop-opacity="1.0" />
      <stop offset="20%" stop-color="#FFFFFF" stop-opacity="0.95" />
      <stop offset="45%" stop-color="#DFFFF0" stop-opacity="0.75" />
      <stop offset="70%" stop-color="#5EFF9A" stop-opacity="0.4" />
      <stop offset="90%" stop-color="#18B856" stop-opacity="0.12" />
      <stop offset="100%" stop-color="#021C0A" stop-opacity="0.0" />
    </radialGradient>

    <!-- Broad Atmospheric Green Radiance -->
    <radialGradient id="broadAtmosphere" cx="{wand_x}" cy="{wand_y}" r="210" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#56FFA0" stop-opacity="0.65" />
      <stop offset="35%" stop-color="#1EB859" stop-opacity="0.35" />
      <stop offset="65%" stop-color="#0E652F" stop-opacity="0.12" />
      <stop offset="90%" stop-color="#04200E" stop-opacity="0.02" />
      <stop offset="100%" stop-color="#000000" stop-opacity="0.0" />
    </radialGradient>

    <!-- Diffuse Blur Filter for Natural Light Dispersion -->
    <filter id="diffuseLight" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="6.0" />
    </filter>

    <filter id="coronaBlur" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="3.5" />
    </filter>
  </defs>'''

svg = [f'<svg viewBox="0 0 {w} {h}" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg" shape-rendering="geometricPrecision">']
svg.append(defs)

# Wrap EVERYTHING inside the seamless mask so all shapes dissolve to 0 smoothly
svg.append('  <!-- Unified Flame with Seamless Gaussian Alpha Falloff -->')
svg.append('  <g mask="url(#infiniteSoftFalloff)">')

# 1. Atmospheric green light spread
svg.append(f'    <circle cx="{wand_x}" cy="{wand_y}" r="210" fill="url(#broadAtmosphere)" />')

# 2. Wooden wand stick (naturally silhouetted)
if p_wand:
    svg.append(f'    <path d="{" ".join(p_wand)}" fill="#020804" stroke="#020804" stroke-width="0.8" />')

# 3. Natural emerald wall and smoke corona
if p_outer:
    svg.append(f'    <path d="{" ".join(p_outer)}" fill="#1EB859" opacity="0.75" filter="url(#diffuseLight)" fill-rule="evenodd" />')

# 4. Mint plasma flame body & smoke fold
if p_mint:
    svg.append(f'    <path d="{" ".join(p_mint)}" fill="#54F68C" opacity="0.9" filter="url(#coronaBlur)" fill-rule="evenodd" />')

# 5. White-hot plasma core & neck filaments
if p_white:
    svg.append(f'    <path d="{" ".join(p_white)}" fill="#FFFFFF" opacity="0.95" filter="url(#coronaBlur)" fill-rule="evenodd" />')

# 6. Ultra-smooth feathered incandescent center (Zero hard dot, zero oval border)
svg.append(f'    <circle cx="{wand_x}" cy="{wand_y}" r="75" fill="url(#seamlessBulbGlow)" filter="url(#coronaBlur)" />')

svg.append('  </g>')
svg.append('</svg>')

full_svg = '\n'.join(svg)
with open('frontend/public/wand-spark-flame.svg', 'w', encoding='utf-8') as f:
    f.write(full_svg)

print(f'Generated seamless natural flame without any oval cutoffs! Size: {len(full_svg):,} bytes')
