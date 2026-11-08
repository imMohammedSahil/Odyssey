import cv2
from PIL import Image
import numpy as np

img = Image.open('Enchanted Greenlight_ The Wizard’s Door.png').convert('RGB')
arr = np.array(img)
smooth = cv2.bilateralFilter(arr, d=5, sigmaColor=25, sigmaSpace=25)
gray = cv2.cvtColor(smooth, cv2.COLOR_RGB2GRAY)

from vectorize_wizard_greenlight import extract_paths

w, h = 1672, 941
wand_x, wand_y = 912, 344

# Zone around wand and wizard hand: x: 740..1040, y: 190..470
zone = np.zeros_like(gray, dtype=bool)
zone[190:470, 740:1040] = True

core_mask = zone & (gray >= 235)
p_core = extract_paths(core_mask, min_area=3, approx_eps=0.3)

hi_mask = zone & (gray >= 210) & (gray < 235)
p_hi = extract_paths(hi_mask, min_area=4, approx_eps=0.35)

mint_mask = zone & (gray >= 175) & (gray < 210)
p_mint = extract_paths(mint_mask, min_area=5, approx_eps=0.4)

outer_mask = zone & (gray >= 120) & (gray < 175)
p_outer = extract_paths(outer_mask, min_area=8, approx_eps=0.45)

wand_stick = zone & (gray < 42)
p_wand = extract_paths(wand_stick, min_area=8, approx_eps=0.45)

defs = '''  <defs>
    <!-- Realistic Multi-tiered Optical Wand Flare -->
    <radialGradient id="sparkHalo" cx="912" cy="344" r="260" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#FFFFFF" stop-opacity="0.95" />
      <stop offset="14%" stop-color="#E2FFE9" stop-opacity="0.85" />
      <stop offset="32%" stop-color="#62FF98" stop-opacity="0.65" />
      <stop offset="62%" stop-color="#18B85A" stop-opacity="0.32" />
      <stop offset="85%" stop-color="#085025" stop-opacity="0.10" />
      <stop offset="100%" stop-color="#02180A" stop-opacity="0" />
    </radialGradient>

    <radialGradient id="sparkCoreBloom" cx="912" cy="344" r="75" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#FFFFFF" stop-opacity="1.0" />
      <stop offset="28%" stop-color="#D4FFE0" stop-opacity="0.95" />
      <stop offset="65%" stop-color="#46F887" stop-opacity="0.75" />
      <stop offset="100%" stop-color="#129E48" stop-opacity="0" />
    </radialGradient>

    <!-- Horizontal & Diagonal Anamorphic Flare Streaks -->
    <linearGradient id="lensStreakH" x1="680" y1="344" x2="1144" y2="344" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#38DE79" stop-opacity="0" />
      <stop offset="35%" stop-color="#72FFA5" stop-opacity="0.45" />
      <stop offset="50%" stop-color="#FFFFFF" stop-opacity="0.95" />
      <stop offset="65%" stop-color="#72FFA5" stop-opacity="0.45" />
      <stop offset="100%" stop-color="#38DE79" stop-opacity="0" />
    </linearGradient>

    <linearGradient id="lensStreakV" x1="912" y1="180" x2="912" y2="508" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#38DE79" stop-opacity="0" />
      <stop offset="40%" stop-color="#72FFA5" stop-opacity="0.35" />
      <stop offset="50%" stop-color="#FFFFFF" stop-opacity="0.9" />
      <stop offset="60%" stop-color="#72FFA5" stop-opacity="0.35" />
      <stop offset="100%" stop-color="#38DE79" stop-opacity="0" />
    </linearGradient>

    <filter id="flameGlow" x="-30%" y="-30%" width="160%" height="160%">
      <feGaussianBlur stdDeviation="3.5" result="glow" />
      <feMerge>
        <feMergeNode in="glow" />
        <feMergeNode in="SourceGraphic" />
      </feMerge>
    </filter>
  </defs>'''

svg = [f'<svg viewBox="0 0 {w} {h}" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg" shape-rendering="geometricPrecision">']
svg.append(defs)

# 1. Atmospheric soft bloom halo
svg.append('  <!-- 1. Atmospheric Optical Halo -->')
svg.append('  <circle cx="912" cy="344" r="260" fill="url(#sparkHalo)" />')

# 2. Anamorphic lens flare streaks
svg.append('  <!-- 2. Optical Lens Flare Rays -->')
svg.append('  <ellipse cx="912" cy="344" rx="230" ry="3.5" fill="url(#lensStreakH)" />')
svg.append('  <ellipse cx="912" cy="344" rx="3.5" ry="160" fill="url(#lensStreakV)" opacity="0.65" />')

# 3. Outer organic emerald plasma tendrils
if p_outer:
    svg.append('  <!-- 3. Outer Organic Emerald Plasma -->')
    svg.append(f'  <path d="{" ".join(p_outer)}" fill="#1FB357" opacity="0.75" filter="url(#flameGlow)" fill-rule="evenodd" />')

# 4. Inked wand stick & wizard hand silhouette
if p_wand:
    svg.append('  <!-- 4. Wand Stick & Hand Inked Silhouette -->')
    svg.append(f'  <path d="{" ".join(p_wand)}" fill="#020804" stroke="#020804" stroke-width="0.7" fill-rule="evenodd" />')

# 5. Mint plasma flame body
if p_mint:
    svg.append('  <!-- 5. Mint Flame Tendrils -->')
    svg.append(f'  <path d="{" ".join(p_mint)}" fill="#54F68C" fill-rule="evenodd" />')

# 6. Neon mint flame highlight
if p_hi:
    svg.append('  <!-- 6. Neon Mint Highlights -->')
    svg.append(f'  <path d="{" ".join(p_hi)}" fill="#B4FFD3" fill-rule="evenodd" />')

# 7. White-hot incandescent plasma filaments & core
if p_core:
    svg.append('  <!-- 7. Incandescent White-Hot Filaments -->')
    svg.append(f'  <path d="{" ".join(p_core)}" fill="#FFFFFF" fill-rule="evenodd" />')

# 8. Core bloom star
svg.append('  <!-- 8. Core Incandescence Star -->')
svg.append('  <circle cx="912" cy="344" r="75" fill="url(#sparkCoreBloom)" />')

svg.append('</svg>')

full_svg = '\n'.join(svg)
with open('frontend/public/wand-spark-flame.svg', 'w', encoding='utf-8') as f:
    f.write(full_svg)

print(f'Generated frontend/public/wand-spark-flame.svg! Size: {len(full_svg):,} bytes')
