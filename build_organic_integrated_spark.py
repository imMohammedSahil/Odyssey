w, h = 1672, 941
wand_x, wand_y = 928, 328

# Pure concentrated incandescent spark strictly at the wand tip (NO background/door/hand duplicates)
defs = f'''  <defs>
    <!-- Concentrated Wand Tip Incandescent Spark (Tight, pure light core) -->
    <radialGradient id="pureTipCore" cx="{wand_x}" cy="{wand_y}" r="38" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#FFFFFF" stop-opacity="1.0" />
      <stop offset="35%" stop-color="#FFFFFF" stop-opacity="0.98" />
      <stop offset="60%" stop-color="#D4FFE0" stop-opacity="0.85" />
      <stop offset="82%" stop-color="#46F887" stop-opacity="0.5" />
      <stop offset="95%" stop-color="#14A84D" stop-opacity="0.15" />
      <stop offset="100%" stop-color="#000000" stop-opacity="0.0" />
    </radialGradient>

    <!-- Tight Soft Corona (r=62) -->
    <radialGradient id="tightTipCorona" cx="{wand_x}" cy="{wand_y}" r="62" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#72FFA5" stop-opacity="0.65" />
      <stop offset="45%" stop-color="#24C862" stop-opacity="0.30" />
      <stop offset="78%" stop-color="#0E7836" stop-opacity="0.08" />
      <stop offset="100%" stop-color="#000000" stop-opacity="0.0" />
    </radialGradient>
  </defs>'''

svg = [f'<svg viewBox="0 0 {w} {h}" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg" shape-rendering="geometricPrecision">']
svg.append(defs)

# 1. Tight soft green corona
svg.append(f'  <circle cx="{wand_x}" cy="{wand_y}" r="62" fill="url(#tightTipCorona)" />')

# 2. Concentrated incandescent core
svg.append(f'  <circle cx="{wand_x}" cy="{wand_y}" r="38" fill="url(#pureTipCore)" />')

# 3. Brilliant white-hot star filament center
svg.append(f'  <circle cx="{wand_x}" cy="{wand_y}" r="15" fill="#FFFFFF" opacity="0.98" />')

svg.append('</svg>')

full_svg = '\n'.join(svg)
with open('frontend/public/wand-spark-flame.svg', 'w', encoding='utf-8') as f:
    f.write(full_svg)

print(f'Generated concentrated wand tip spark! Size: {len(full_svg):,} bytes')
