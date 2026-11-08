w, h = 1672, 941
wand_x, wand_y = 928, 328

defs = f'''  <defs>
    <!-- Crisp Smooth Falloff Mask -->
    <mask id="sparkAlphaFade">
      <radialGradient id="fadeGrad" cx="{wand_x}" cy="{wand_y}" r="150" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stop-color="#FFFFFF" stop-opacity="1.0" />
        <stop offset="35%" stop-color="#FFFFFF" stop-opacity="0.95" />
        <stop offset="65%" stop-color="#FFFFFF" stop-opacity="0.45" />
        <stop offset="90%" stop-color="#FFFFFF" stop-opacity="0.08" />
        <stop offset="100%" stop-color="#000000" stop-opacity="0.0" />
      </radialGradient>
      <rect width="{w}" height="{h}" fill="url(#fadeGrad)" />
    </mask>

    <!-- Rich Incandescent Core Bloom (r=75 like 7ee34fc) -->
    <radialGradient id="seamlessBulbGlow" cx="{wand_x}" cy="{wand_y}" r="75" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#FFFFFF" stop-opacity="1.0" />
      <stop offset="25%" stop-color="#FFFFFF" stop-opacity="0.98" />
      <stop offset="50%" stop-color="#E2FFF0" stop-opacity="0.85" />
      <stop offset="72%" stop-color="#5EFF9A" stop-opacity="0.55" />
      <stop offset="90%" stop-color="#18B856" stop-opacity="0.18" />
      <stop offset="100%" stop-color="#021C0A" stop-opacity="0.0" />
    </radialGradient>

    <!-- Broad Ambient Green Glow (r=135) -->
    <radialGradient id="broadAtmosphere" cx="{wand_x}" cy="{wand_y}" r="135" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#56FFA0" stop-opacity="0.65" />
      <stop offset="35%" stop-color="#1EB859" stop-opacity="0.38" />
      <stop offset="68%" stop-color="#0E652F" stop-opacity="0.14" />
      <stop offset="92%" stop-color="#04200E" stop-opacity="0.02" />
      <stop offset="100%" stop-color="#000000" stop-opacity="0.0" />
    </radialGradient>

    <!-- Anamorphic Lens Flare Star Rays -->
    <linearGradient id="rayH" x1="{wand_x - 70}" y1="{wand_y}" x2="{wand_x + 70}" y2="{wand_y}" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#46F887" stop-opacity="0.0" />
      <stop offset="35%" stop-color="#A6FFC8" stop-opacity="0.5" />
      <stop offset="50%" stop-color="#FFFFFF" stop-opacity="0.95" />
      <stop offset="65%" stop-color="#A6FFC8" stop-opacity="0.5" />
      <stop offset="100%" stop-color="#46F887" stop-opacity="0.0" />
    </linearGradient>

    <linearGradient id="rayV" x1="{wand_x}" y1="{wand_y - 70}" x2="{wand_x}" y2="{wand_y + 70}" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#46F887" stop-opacity="0.0" />
      <stop offset="35%" stop-color="#A6FFC8" stop-opacity="0.5" />
      <stop offset="50%" stop-color="#FFFFFF" stop-opacity="0.95" />
      <stop offset="65%" stop-color="#A6FFC8" stop-opacity="0.5" />
      <stop offset="100%" stop-color="#46F887" stop-opacity="0.0" />
    </linearGradient>
  </defs>'''

svg = [f'<svg viewBox="0 0 {w} {h}" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg" shape-rendering="geometricPrecision">']
svg.append(defs)

svg.append('  <!-- Teasing Wand Spark Flare (Rich, Big, Zero Blurs) -->')
svg.append('  <g mask="url(#sparkAlphaFade)">')

# 1. Atmospheric green light spread (r=135)
svg.append(f'    <circle cx="{wand_x}" cy="{wand_y}" r="135" fill="url(#broadAtmosphere)" />')

# 2. Subtle lens rays
svg.append(f'    <path d="M {wand_x - 70} {wand_y} Q {wand_x} {wand_y - 2} {wand_x + 70} {wand_y} Q {wand_x} {wand_y + 2} {wand_x - 70} {wand_y} Z" fill="url(#rayH)" />')
svg.append(f'    <path d="M {wand_x} {wand_y - 70} Q {wand_x - 2} {wand_y} {wand_x} {wand_y + 70} Q {wand_x + 2} {wand_y} {wand_x} {wand_y - 70} Z" fill="url(#rayV)" />')

# 3. Rich incandescent core bloom (r=75)
svg.append(f'    <circle cx="{wand_x}" cy="{wand_y}" r="75" fill="url(#seamlessBulbGlow)" />')

# 4. Brilliant white-hot filament center (r=24)
svg.append(f'    <circle cx="{wand_x}" cy="{wand_y}" r="24" fill="#FFFFFF" opacity="0.98" />')

svg.append('  </g>')
svg.append('</svg>')

full_svg = '\n'.join(svg)
with open('frontend/public/wand-spark-flame.svg', 'w', encoding='utf-8') as f:
    f.write(full_svg)

print(f'Generated rich teasing wand spark SVG! Size: {len(full_svg):,} bytes')
