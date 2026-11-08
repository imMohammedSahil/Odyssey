w, h = 1672, 941
wand_x, wand_y = 929, 328

svg = f'''<svg viewBox="0 0 {w} {h}" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg" shape-rendering="geometricPrecision">
  <defs>
    <!-- Tight White-Hot Wand Tip Circular Core Orb -->
    <radialGradient id="wandTipOrb" cx="{wand_x}" cy="{wand_y}" r="52" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#FFFFFF" stop-opacity="1.0" />
      <stop offset="30%" stop-color="#FFFFFF" stop-opacity="0.98" />
      <stop offset="55%" stop-color="#D4FFE0" stop-opacity="0.90" />
      <stop offset="75%" stop-color="#46F887" stop-opacity="0.65" />
      <stop offset="90%" stop-color="#14A84D" stop-opacity="0.18" />
      <stop offset="100%" stop-color="#000000" stop-opacity="0.0" />
    </radialGradient>

    <!-- Outer Soft Halo tightly hugging the orb -->
    <radialGradient id="wandTipOuterHalo" cx="{wand_x}" cy="{wand_y}" r="85" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#60FFA0" stop-opacity="0.55" />
      <stop offset="45%" stop-color="#1EB859" stop-opacity="0.20" />
      <stop offset="80%" stop-color="#085525" stop-opacity="0.04" />
      <stop offset="100%" stop-color="#000000" stop-opacity="0.0" />
    </radialGradient>
  </defs>

  <!-- 1. Tight Outer Soft Glow -->
  <circle cx="{wand_x}" cy="{wand_y}" r="85" fill="url(#wandTipOuterHalo)" />

  <!-- 2. Pure Incandescent Core Orb -->
  <circle cx="{wand_x}" cy="{wand_y}" r="52" fill="url(#wandTipOrb)" />

  <!-- 3. Brilliant White-Hot Filament Center -->
  <circle cx="{wand_x}" cy="{wand_y}" r="22" fill="#FFFFFF" opacity="0.98" />
</svg>
'''

with open('frontend/public/wand-spark-flame.svg', 'w', encoding='utf-8') as f:
    f.write(svg)

print('Generated tighter wand-tip circle spark SVG!')
