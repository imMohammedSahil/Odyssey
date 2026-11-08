import cv2
from PIL import Image
import numpy as np

img = Image.open('Enchanted Greenlight_ The Wizard’s Door.png').convert('RGB')
arr = np.array(img)
smooth = cv2.bilateralFilter(arr, d=5, sigmaColor=25, sigmaSpace=25)
gray = cv2.cvtColor(smooth, cv2.COLOR_RGB2GRAY)

from vectorize_wizard_greenlight import extract_paths

w, h = 1672, 941
wand_x, wand_y = 910, 331

# Confine tightly to a realistic radius r=58px around the wand tip
Y, X = np.ogrid[:h, :w]
dist = np.hypot(X - wand_x, Y - wand_y)
tight_zone = dist <= 58.0

# Extract real organic filaments from the artwork
core_filaments = tight_zone & (gray >= 244)
p_core = extract_paths(core_filaments, min_area=2, approx_eps=0.25)

hot_filaments = tight_zone & (gray >= 220) & (gray < 244)
p_hot = extract_paths(hot_filaments, min_area=3, approx_eps=0.3)

# Wand wooden tip contact silhouette right below the spark
wand_zone = (dist <= 65.0) & (X <= wand_x + 5) & (Y >= wand_y - 2) & (gray < 55)
p_wand = extract_paths(wand_zone, min_area=4, approx_eps=0.35)

svg = f'''<svg viewBox="0 0 {w} {h}" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg" shape-rendering="geometricPrecision">
  <defs>
    <!-- Multi-tiered Realistic Optical Bloom Gradients -->
    <radialGradient id="sparkHaze" cx="{wand_x}" cy="{wand_y}" r="64" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#FFFFFF" stop-opacity="0.95" />
      <stop offset="25%" stop-color="#E4FFF0" stop-opacity="0.85" />
      <stop offset="50%" stop-color="#60FFA0" stop-opacity="0.55" />
      <stop offset="78%" stop-color="#14B052" stop-opacity="0.18" />
      <stop offset="100%" stop-color="#021C0A" stop-opacity="0.0" />
    </radialGradient>

    <radialGradient id="sparkIncandescence" cx="{wand_x}" cy="{wand_y}" r="38" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#FFFFFF" stop-opacity="1.0" />
      <stop offset="35%" stop-color="#FFFFFF" stop-opacity="0.98" />
      <stop offset="60%" stop-color="#C2FFD8" stop-opacity="0.88" />
      <stop offset="85%" stop-color="#46F887" stop-opacity="0.45" />
      <stop offset="100%" stop-color="#129E48" stop-opacity="0.0" />
    </radialGradient>

    <!-- Thin Optical Diffraction Rays (Lens Spikes) -->
    <linearGradient id="rayH" x1="{wand_x - 72}" y1="{wand_y}" x2="{wand_x + 72}" y2="{wand_y}" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#46F887" stop-opacity="0.0" />
      <stop offset="35%" stop-color="#A6FFC8" stop-opacity="0.6" />
      <stop offset="50%" stop-color="#FFFFFF" stop-opacity="1.0" />
      <stop offset="65%" stop-color="#A6FFC8" stop-opacity="0.6" />
      <stop offset="100%" stop-color="#46F887" stop-opacity="0.0" />
    </linearGradient>

    <linearGradient id="rayV" x1="{wand_x}" y1="{wand_y - 72}" x2="{wand_x}" y2="{wand_y + 72}" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#46F887" stop-opacity="0.0" />
      <stop offset="35%" stop-color="#A6FFC8" stop-opacity="0.6" />
      <stop offset="50%" stop-color="#FFFFFF" stop-opacity="1.0" />
      <stop offset="65%" stop-color="#A6FFC8" stop-opacity="0.6" />
      <stop offset="100%" stop-color="#46F887" stop-opacity="0.0" />
    </linearGradient>

    <!-- Diagonal cross ray -->
    <linearGradient id="rayDiag" x1="{wand_x - 42}" y1="{wand_y - 42}" x2="{wand_x + 42}" y2="{wand_y + 42}" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#46F887" stop-opacity="0.0" />
      <stop offset="40%" stop-color="#FFFFFF" stop-opacity="0.75" />
      <stop offset="60%" stop-color="#FFFFFF" stop-opacity="0.75" />
      <stop offset="100%" stop-color="#46F887" stop-opacity="0.0" />
    </linearGradient>

    <!-- Organic Plasma Bloom Filter -->
    <filter id="plasmaBloom" x="-50%" y="-50%" width="200%" height="200%">
      <feGaussianBlur stdDeviation="2.2" result="blur" />
      <feMerge>
        <feMergeNode in="blur" />
        <feMergeNode in="SourceGraphic" />
      </feMerge>
    </filter>
  </defs>

  <!-- 1. Wooden Wand Tip Contact Silhouette -->
  {f'<path d="{" ".join(p_wand)}" fill="#020804" stroke="#020804" stroke-width="0.8" />' if p_wand else ''}

  <!-- 2. Optical Volumetric Bloom Halo -->
  <circle cx="{wand_x}" cy="{wand_y}" r="64" fill="url(#sparkHaze)" />

  <!-- 3. Optical Diffraction Starburst Rays (Subtle lens glare) -->
  <path d="M {wand_x - 72} {wand_y} Q {wand_x} {wand_y - 1.8} {wand_x + 72} {wand_y} Q {wand_x} {wand_y + 1.8} {wand_x - 72} {wand_y} Z" fill="url(#rayH)" />
  <path d="M {wand_x} {wand_y - 72} Q {wand_x - 1.8} {wand_y} {wand_x} {wand_y + 72} Q {wand_x + 1.8} {wand_y} {wand_x} {wand_y - 72} Z" fill="url(#rayV)" />
  <path d="M {wand_x - 38} {wand_y - 38} L {wand_x + 38} {wand_y + 38}" stroke="url(#rayDiag)" stroke-width="1.2" stroke-linecap="round" opacity="0.6" />
  <path d="M {wand_x - 38} {wand_y + 38} L {wand_x + 38} {wand_y - 38}" stroke="url(#rayDiag)" stroke-width="1.2" stroke-linecap="round" opacity="0.6" />

  <!-- 4. Real Organic Plasma Corona Filaments from Artwork -->
  {f'<path d="{" ".join(p_hot)}" fill="#54F68C" opacity="0.9" filter="url(#plasmaBloom)" fill-rule="evenodd" />' if p_hot else ''}

  <!-- 5. Incandescent Core Bloom -->
  <circle cx="{wand_x}" cy="{wand_y}" r="38" fill="url(#sparkIncandescence)" />

  <!-- 6. Real White-Hot Filaments -->
  {f'<path d="{" ".join(p_core)}" fill="#FFFFFF" fill-rule="evenodd" />' if p_core else ''}

  <!-- 7. Central White-Hot Filament Star Core -->
  <circle cx="{wand_x}" cy="{wand_y}" r="14" fill="#FFFFFF" opacity="1.0" />
</svg>
'''

with open('frontend/public/wand-spark-flame.svg', 'w', encoding='utf-8') as f:
    f.write(svg)

print('Generated ultra-realistic wand-tip spark SVG!')
