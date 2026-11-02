import cv2
import numpy as np

def pts_to_d(pts):
    return f"M {pts[0][0]},{pts[0][1]} " + " ".join([f"L {p[0]},{p[1]}" for p in pts[1:]]) + " Z"

def extract_contours(mask, min_area=15, approx_eps=0.45):
    contours, hierarchy = cv2.findContours(mask, cv2.RETR_CCOMP, cv2.CHAIN_APPROX_TC89_KCOS)
    if hierarchy is None:
        return []
    path_list = []
    for i, cnt in enumerate(contours):
        if cv2.contourArea(cnt) < min_area:
            continue
        approx = cv2.approxPolyDP(cnt, approx_eps, True)
        if len(approx) < 3:
            continue
        pts = approx.reshape(-1, 2)
        path_list.append(pts_to_d(pts))
    return path_list

def build_paper_svg():
    ref_path = r'C:\Users\Mohammed sahil\.gemini\antigravity\brain\8771b7bb-9185-4395-a894-022cd4625b49\.user_uploaded\media_1793629414986_645bf219.jpg'
    img = cv2.imread(ref_path)
    if img is None:
        raise ValueError(f"Could not load reference image from {ref_path}")
    h, w = img.shape[:2]
    
    # Bilateral smoothing to remove JPEG compression noise while preserving edges
    smooth = cv2.bilateralFilter(img, d=5, sigmaColor=25, sigmaSpace=25)
    gray = cv2.cvtColor(smooth, cv2.COLOR_BGR2GRAY)
    
    svg_elements = []
    
    # 1. Base Sky Mist Gradient
    defs = '''  <defs>
    <linearGradient id="skyMist" x1="0" y1="0" x2="0" y2="100%">
      <stop offset="0%" stop-color="#223a4b" />
      <stop offset="16%" stop-color="#3a5d74" />
      <stop offset="38%" stop-color="#6488a0" />
      <stop offset="58%" stop-color="#99bcd3" />
      <stop offset="74%" stop-color="#b8d4e5" />
      <stop offset="100%" stop-color="#658ca3" />
    </linearGradient>
  </defs>'''
    
    svg_elements.append(f'  <rect width="{w}" height="{h}" fill="url(#skyMist)" />')
    
    # 2. Far Distant Forest & Mist Silhouettes (Layer 1 - softest cyan mist)
    m1 = (gray < 172).astype(np.uint8) * 255
    m1 = cv2.morphologyEx(m1, cv2.MORPH_OPEN, cv2.getStructuringElement(cv2.MORPH_RECT, (2, 2)))
    p1 = extract_contours(m1, min_area=25, approx_eps=0.55)
    if p1:
        svg_elements.append(f'  <!-- Layer 1: Distant Mist Forest -->\n  <path d="{" ".join(p1)}" fill="#6c91ab" opacity="0.9" />')
        
    # 3. Mid Forest Trees (Layer 2 - framing pine/cypress canopy)
    m2 = (gray < 138).astype(np.uint8) * 255
    m2 = cv2.morphologyEx(m2, cv2.MORPH_OPEN, cv2.getStructuringElement(cv2.MORPH_RECT, (2, 2)))
    p2 = extract_contours(m2, min_area=20, approx_eps=0.5)
    if p2:
        svg_elements.append(f'  <!-- Layer 2: Mid Forest Canopy -->\n  <path d="{" ".join(p2)}" fill="#4d738b" />')
        
    # 4. Deeper Forest, Distant Hills & Landscape (Layer 3)
    m3 = (gray < 108).astype(np.uint8) * 255
    m3 = cv2.morphologyEx(m3, cv2.MORPH_OPEN, cv2.getStructuringElement(cv2.MORPH_RECT, (2, 2)))
    p3 = extract_contours(m3, min_area=15, approx_eps=0.45)
    if p3:
        svg_elements.append(f'  <!-- Layer 3: Deep Forest & Base Landscape -->\n  <path d="{" ".join(p3)}" fill="#36596f" />')
        
    # 5. Glowing Illuminated Driveway Path (From Mansion hill down to the entrance gate)
    # The driveway must remain bright blue-slate mist (#537e97) so the dark cyclist (#0D0D0D) pops with maximum contrast!
    driveway_path = (
        "M 515,420 "
        "Q 560,435 605,460 "
        "Q 655,490 670,520 "
        "Q 682,545 668,580 "
        "L 668,628 "
        "L 742,628 "
        "L 738,575 "
        "Q 735,535 718,505 "
        "Q 695,475 640,450 "
        "Q 580,425 515,420 Z"
    )
    svg_elements.append(f'  <!-- Illuminated Cyan-Slate Driveway -->\n  <path d="{driveway_path}" fill="#4d7791" stroke="#36586d" stroke-width="1.2" />')
    
    # 6. Gothic Mansion Architecture (High Detail Facade, Roofs, Spires, Chimneys)
    # Mansion region: x in 215..540, y in 0..440
    # A. Mansion Body / Facade walls (gray < 88)
    m_house_body = np.zeros_like(gray)
    m_house_body[0:440, 215:540] = (gray[0:440, 215:540] < 88).astype(np.uint8) * 255
    p_house_body = extract_contours(m_house_body, min_area=12, approx_eps=0.35)
    if p_house_body:
        svg_elements.append(f'  <!-- Gothic Mansion Facade -->\n  <path d="{" ".join(p_house_body)}" fill="#254657" />')
        
    # B. Mansion Roofs, Spires, Chimneys & Eaves (gray < 48) - Deep shadow slate
    m_house_roof = np.zeros_like(gray)
    m_house_roof[0:440, 215:540] = (gray[0:440, 215:540] < 48).astype(np.uint8) * 255
    p_house_roof = extract_contours(m_house_roof, min_area=8, approx_eps=0.3)
    if p_house_roof:
        svg_elements.append(f'  <!-- Gothic Mansion Roof, Gables, Spires & Chimneys -->\n  <path d="{" ".join(p_house_roof)}" fill="#142631" />')

    # C. Sharp Architectural Enhancements on the Mansion:
    # 1. Main Spire Pinnacle & Finial (reaches up to y=4, sharp conical roof with finial tip)
    spire_svg = '''  <!-- Sharpened Mansion Turret Spire & Finial -->
  <g id="mansion-spire">
    <!-- Tall Conical Spire Needle -->
    <path d="M 398,58 L 401,8 L 404,58 Z" fill="#142631" stroke="#0D0D0D" stroke-width="0.8" />
    <path d="M 401,2 L 401,9 M 399.5,4 L 402.5,4" stroke="#0D0D0D" stroke-width="1.2" stroke-linecap="round" />
    <!-- Spire polygonal facets for dimensional lighting -->
    <path d="M 395,58 L 401,15 L 401,58 Z" fill="#1b303d" />
    <path d="M 401,58 L 401,15 L 407,58 Z" fill="#101f28" />
    <!-- Turret base corbel band -->
    <rect x="393" y="58" width="16" height="5" rx="1" fill="#142631" stroke="#0D0D0D" stroke-width="0.8" />
  </g>'''
    svg_elements.append(spire_svg)

    # 2. Chimney Stacks with authentic Victorian Pots
    chimneys_svg = '''  <!-- Architectural Chimney Stacks -->
  <g id="mansion-chimneys">
    <!-- Left Double Chimney Stack -->
    <path d="M 288,85 L 305,85 L 305,145 L 288,145 Z" fill="#142631" stroke="#0D0D0D" stroke-width="0.8" />
    <!-- Chimney cap moulding -->
    <rect x="286" y="82" width="21" height="4" fill="#1b303d" stroke="#0D0D0D" stroke-width="0.8" />
    <!-- Two Chimney Pots -->
    <path d="M 289,82 L 290,74 L 294,74 L 295,82 Z" fill="#101f28" stroke="#0D0D0D" stroke-width="0.8" />
    <path d="M 297,82 L 298,74 L 302,74 L 303,82 Z" fill="#101f28" stroke="#0D0D0D" stroke-width="0.8" />
    
    <!-- Central Chimney Group -->
    <path d="M 335,46 L 348,46 L 348,80 L 335,80 Z" fill="#142631" stroke="#0D0D0D" stroke-width="0.8" />
    <rect x="333" y="44" width="17" height="3" fill="#1b303d" stroke="#0D0D0D" stroke-width="0.8" />
    <path d="M 336,44 L 337,38 L 340,38 L 341,44 Z" fill="#101f28" stroke="#0D0D0D" stroke-width="0.8" />
    <path d="M 342,44 L 343,38 L 346,38 L 347,44 Z" fill="#101f28" stroke="#0D0D0D" stroke-width="0.8" />
    
    <!-- Right Chimney Stack -->
    <path d="M 425,98 L 439,98 L 439,150 L 425,150 Z" fill="#142631" stroke="#0D0D0D" stroke-width="0.8" />
    <rect x="423" y="95" width="18" height="4" fill="#1b303d" stroke="#0D0D0D" stroke-width="0.8" />
    <path d="M 426,95 L 427,88 L 431,88 L 432,95 Z" fill="#101f28" stroke="#0D0D0D" stroke-width="0.8" />
    <path d="M 433,95 L 434,88 L 437,88 L 438,95 Z" fill="#101f28" stroke="#0D0D0D" stroke-width="0.8" />
  </g>'''
    svg_elements.append(chimneys_svg)

    # 3. Porch Arcade with Classical Columns and open light arches
    porch_svg = '''  <!-- Front Porch Arcade with Lit Openings -->
  <g id="mansion-porch">
    <!-- Porch entablature / roof band -->
    <path d="M 448,276 L 522,276 L 526,285 L 444,285 Z" fill="#142631" stroke="#0D0D0D" stroke-width="1" />
    
    <!-- Porch Columns (4 upright columns with classical capitals and bases) -->
    <!-- Column 1 -->
    <rect x="452" y="285" width="6" height="70" fill="#1b3240" stroke="#0D0D0D" stroke-width="0.8" />
    <rect x="450" y="285" width="10" height="4" fill="#142631" />
    <rect x="450" y="351" width="10" height="4" fill="#142631" />
    
    <!-- Column 2 -->
    <rect x="474" y="285" width="6" height="70" fill="#1b3240" stroke="#0D0D0D" stroke-width="0.8" />
    <rect x="472" y="285" width="10" height="4" fill="#142631" />
    <rect x="472" y="351" width="10" height="4" fill="#142631" />
    
    <!-- Column 3 -->
    <rect x="496" y="285" width="6" height="70" fill="#1b3240" stroke="#0D0D0D" stroke-width="0.8" />
    <rect x="494" y="285" width="10" height="4" fill="#142631" />
    <rect x="494" y="351" width="10" height="4" fill="#142631" />
    
    <!-- Column 4 (Corner) -->
    <rect x="517" y="285" width="6" height="70" fill="#1b3240" stroke="#0D0D0D" stroke-width="0.8" />
    <rect x="515" y="285" width="10" height="4" fill="#142631" />
    <rect x="515" y="351" width="10" height="4" fill="#142631" />
  </g>'''
    svg_elements.append(porch_svg)

    # 4. Architectural Window Slats on the Main Facade (Misty reflections)
    windows_svg = '''  <!-- Facade Architectural Windows -->
  <g id="mansion-windows" fill="#3a6078" stroke="#12232d" stroke-width="1.2">
    <!-- 3rd Floor Dormer Windows -->
    <rect x="366" y="168" width="8" height="20" rx="1" />
    <line x1="370" y1="168" x2="370" y2="188" stroke="#12232d" stroke-width="0.8" />
    
    <rect x="390" y="168" width="8" height="20" rx="1" />
    <line x1="394" y1="168" x2="394" y2="188" stroke="#12232d" stroke-width="0.8" />
    
    <!-- 2nd Floor Tall Windows -->
    <rect x="365" y="212" width="10" height="30" rx="1" />
    <line x1="370" y1="212" x2="370" y2="242" stroke="#12232d" stroke-width="0.8" />
    <line x1="365" y1="224" x2="375" y2="224" stroke="#12232d" stroke-width="0.8" />

    <rect x="388" y="212" width="10" height="30" rx="1" />
    <line x1="393" y1="212" x2="393" y2="242" stroke="#12232d" stroke-width="0.8" />
    <line x1="388" y1="224" x2="398" y2="224" stroke="#12232d" stroke-width="0.8" />

    <rect x="412" y="212" width="10" height="30" rx="1" />
    <line x1="417" y1="212" x2="417" y2="242" stroke="#12232d" stroke-width="0.8" />
    <line x1="412" y1="224" x2="422" y2="224" stroke="#12232d" stroke-width="0.8" />
  </g>'''
    svg_elements.append(windows_svg)

    # 5. Terrace Balustrade in front of Mansion (x: 340..635, y: 395..425)
    balustrade_elements = [
        '  <!-- Midground Stone Balustrade -->',
        '  <g id="terrace-balustrade" fill="#142631" stroke="#0D0D0D">',
        '    <!-- Top Handrail -->',
        '    <rect x="340" y="396" width="295" height="5" rx="1" stroke-width="0.8" />',
        '    <!-- Bottom Base Rail -->',
        '    <rect x="340" y="420" width="295" height="5" rx="1" stroke-width="0.8" />',
    ]
    # Stone pillars dividing balustrade sections
    for px in [340, 430, 520, 630]:
        balustrade_elements.append(f'    <rect x="{px-2}" y="392" width="12" height="35" rx="1" fill="#1b3240" stroke="#0D0D0D" stroke-width="1" />')
        balustrade_elements.append(f'    <rect x="{px-4}" y="389" width="16" height="4" rx="1" fill="#142631" stroke="#0D0D0D" stroke-width="0.8" />')
    
    # Repeated vertical balusters with realistic 9px spacing
    for bx in range(352, 426, 9):
        balustrade_elements.append(f'    <path d="M {bx},401 L {bx+3},401 L {bx+4},406 L {bx+4},415 L {bx+3},420 L {bx},420 L {bx-1},415 L {bx-1},406 Z" stroke-width="0.5" />')
    for bx in range(442, 516, 9):
        balustrade_elements.append(f'    <path d="M {bx},401 L {bx+3},401 L {bx+4},406 L {bx+4},415 L {bx+3},420 L {bx},420 L {bx-1},415 L {bx-1},406 Z" stroke-width="0.5" />')
    for bx in range(532, 626, 9):
        balustrade_elements.append(f'    <path d="M {bx},401 L {bx+3},401 L {bx+4},406 L {bx+4},415 L {bx+3},420 L {bx},420 L {bx-1},415 L {bx-1},406 Z" stroke-width="0.5" />')
    balustrade_elements.append('  </g>')
    svg_elements.append("\n".join(balustrade_elements))

    # 7. Pure Solid Foreground Silhouettes (#0D0D0D)
    # Ground hills, left foreground tall cypress trees, hedges (Cumulative gray < 28)
    m_fg = (gray < 28).astype(np.uint8) * 255
    # Keep the driveway opening completely clear (from x:660 to x:740, y:510 to y:628) so the cyclist and gate entrance are never cut off
    m_fg[510:628, 660:740] = 0
    p_fg = extract_contours(m_fg, min_area=30, approx_eps=0.45)
    if p_fg:
        svg_elements.append(f'  <!-- Layer 4: Solid Foreground Silhouettes -->\n  <path d="{" ".join(p_fg)}" fill="#0D0D0D" stroke="#0D0D0D" stroke-width="0.8" stroke-linejoin="round" />')

    # 8. Victorian Open Wrought Iron Gate & Gatepost
    gate_svg = '''  <!-- Ornate Victorian Open Gate & Pillar -->
  <g id="victorian-gate" fill="#0D0D0D" stroke="#0D0D0D">
    <!-- Left Stone Pillar & Gargoyle Statue -->
    <path d="M 632,545 L 646,545 L 644,615 L 629,615 Z" stroke-width="1.2" />
    <rect x="628" y="540" width="22" height="6" rx="1" stroke-width="1" />
    <!-- Carved Gargoyle / Lion finial atop left pillar -->
    <path d="M 632,540 C 632,530 635,522 639,520 C 643,522 646,530 646,540 Z" />
    <circle cx="639" cy="519" r="3.5" />
    <path d="M 636,523 L 642,523" stroke="#4d7791" stroke-width="0.8" />
    
    <!-- Right Open Gate Leaf (Pivoting into driveway) -->
    <!-- Main Gate Frame Hinge Post -->
    <rect x="746" y="375" width="4" height="235" rx="1" stroke-width="1" />
    <!-- Gate Top Curved Iron Crest -->
    <path d="M 746,375 Q 730,360 715,385 Q 732,410 746,420 Z" fill="none" stroke-width="2.6" />
    <circle cx="725" cy="385" r="4.5" fill="none" stroke-width="1.6" />
    <!-- Gate Vertical Pickets -->
    <line x1="740" y1="410" x2="740" y2="605" stroke-width="2.2" />
    <line x1="734" y1="425" x2="734" y2="605" stroke-width="2" />
    <line x1="728" y1="440" x2="728" y2="605" stroke-width="2" />
    <line x1="722" y1="460" x2="722" y2="605" stroke-width="1.8" />
    <line x1="716" y1="480" x2="716" y2="605" stroke-width="1.8" />
    <line x1="710" y1="500" x2="710" y2="605" stroke-width="1.8" />
    <!-- Spearhead Finials on Gate Pickets -->
    <path d="M 739,410 L 740,403 L 741,410 Z" stroke-width="1" />
    <path d="M 733,425 L 734,418 L 735,425 Z" stroke-width="1" />
    <path d="M 727,440 L 728,433 L 729,440 Z" stroke-width="1" />
    <path d="M 721,460 L 722,453 L 723,460 Z" stroke-width="1" />
    <path d="M 715,480 L 716,473 L 717,480 Z" stroke-width="1" />
    <!-- Gate Horizontal Cross-Braces -->
    <line x1="710" y1="520" x2="746" y2="520" stroke-width="2.5" />
    <line x1="710" y1="585" x2="746" y2="585" stroke-width="2.5" />
    <!-- Decorative Scrolls inside Gate Frame -->
    <path d="M 728,520 Q 736,540 728,560 Q 720,540 728,520" fill="none" stroke-width="1.5" />
  </g>'''
    svg_elements.append(gate_svg)

    # 9. THE CYCLIST HERO (Important Focal Character - Placed ON TOP for 100% visibility)
    # Standing on illuminated driveway at x: 686..726, y: 538..616
    cyclist_svg = '''  <!-- THE CYCLIST HERO (Important Focal Character) -->
  <g id="hero-cyclist">
    <!-- Ground Contact Shadow -->
    <ellipse cx="704" cy="610" rx="20" ry="4" fill="rgba(10, 20, 28, 0.75)" />
    
    <!-- Rider Silhouette -->
    <!-- Newsboy / Delivery Cap with visor bill -->
    <path d="M 688,546 C 688,541 694,539 698,541 C 702,543 703,546 700,549 L 702,551 L 696,552 L 688,549 Z" fill="#0D0D0D" />
    <!-- Head and face in profile -->
    <circle cx="694" cy="547" r="4.5" fill="#0D0D0D" />
    <!-- Neck and collar -->
    <path d="M 693,551 L 696,551 L 695,555 L 692,555 Z" fill="#0D0D0D" />
    
    <!-- Torso / Heavy Campus Overcoat -->
    <path d="M 690,555 C 692,553 697,553 699,555 L 703,568 C 704,574 702,580 699,584 L 688,582 C 686,576 687,568 689,557 Z" fill="#0D0D0D" stroke="#0D0D0D" stroke-width="0.8" />
    
    <!-- Left Arm reaching to Handlebars -->
    <path d="M 692,558 L 701,564 L 704,570" fill="none" stroke="#0D0D0D" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round" />
    
    <!-- Right Arm holding Grips -->
    <path d="M 695,557 L 704,563 L 706,569" fill="none" stroke="#0D0D0D" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round" />

    <!-- Legs & Boots (Standing next to bike) -->
    <!-- Left Leg -->
    <path d="M 689,582 L 689,598 L 687,605 L 684,606" fill="none" stroke="#0D0D0D" stroke-width="3.8" stroke-linecap="round" stroke-linejoin="round" />
    <!-- Right Leg -->
    <path d="M 695,582 L 695,597 L 698,605 L 702,606" fill="none" stroke="#0D0D0D" stroke-width="3.6" stroke-linecap="round" stroke-linejoin="round" />

    <!-- THE BICYCLE -->
    <!-- Front Wheel (Crisp Circular Rim & Hub) -->
    <circle cx="718" cy="595" r="11" fill="none" stroke="#0D0D0D" stroke-width="2.2" />
    <circle cx="718" cy="595" r="1.5" fill="#0D0D0D" />
    <!-- Front Wheel Spokes -->
    <line x1="718" y1="584" x2="718" y2="606" stroke="#0D0D0D" stroke-width="0.7" opacity="0.85" />
    <line x1="707" y1="595" x2="729" y2="595" stroke="#0D0D0D" stroke-width="0.7" opacity="0.85" />

    <!-- Rear Wheel -->
    <circle cx="682" cy="595" r="11" fill="none" stroke="#0D0D0D" stroke-width="2.2" />
    <circle cx="682" cy="595" r="1.5" fill="#0D0D0D" />
    <!-- Rear Wheel Spokes -->
    <line x1="682" y1="584" x2="682" y2="606" stroke="#0D0D0D" stroke-width="0.7" opacity="0.85" />
    <line x1="671" y1="595" x2="693" y2="595" stroke="#0D0D0D" stroke-width="0.7" opacity="0.85" />

    <!-- Diamond Frame -->
    <!-- Bottom bracket -->
    <circle cx="699" cy="595" r="2.2" fill="#0D0D0D" />
    <!-- Chainstay (Rear hub to BB) -->
    <line x1="682" y1="595" x2="699" y2="595" stroke="#0D0D0D" stroke-width="2" />
    <!-- Seatstay (Rear hub to Saddle cluster) -->
    <line x1="682" y1="595" x2="694" y2="574" stroke="#0D0D0D" stroke-width="1.8" />
    <!-- Seat tube (BB to Saddle cluster) -->
    <line x1="699" y1="595" x2="694" y2="574" stroke="#0D0D0D" stroke-width="2" />
    <!-- Top tube (Crossbar from Saddle to Head tube) -->
    <line x1="694" y1="575" x2="711" y2="573" stroke="#0D0D0D" stroke-width="2" />
    <!-- Down tube (BB to Head tube) -->
    <line x1="699" y1="595" x2="711" y2="573" stroke="#0D0D0D" stroke-width="2.2" />
    <!-- Front Fork (Head tube to Front hub) -->
    <line x1="711" y1="571" x2="718" y2="595" stroke="#0D0D0D" stroke-width="2.4" />
    
    <!-- Saddle / Leather Seat -->
    <path d="M 689,573 C 691,571 697,571 698,574 L 691,574 Z" fill="#0D0D0D" stroke="#0D0D0D" stroke-width="1" />
    
    <!-- Handlebars and Stem -->
    <line x1="711" y1="573" x2="711" y2="567" stroke="#0D0D0D" stroke-width="2.2" />
    <path d="M 707,567 Q 711,564 715,567" fill="none" stroke="#0D0D0D" stroke-width="2.4" stroke-linecap="round" />
  </g>'''
    svg_elements.append(cyclist_svg)

    # 10. Watermark text matching the ref at bottom-left
    watermark_svg = '''  <!-- Reference Watermark Signature -->
  <text x="22" y="612" font-family="'Plus Jakarta Sans', sans-serif" font-weight="900" font-size="22" fill="#1b3648" letter-spacing="2">TAILED</text>'''
    svg_elements.append(watermark_svg)

    header = f'<svg viewBox="0 0 {w} {h}" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">\n{defs}\n'
    footer = '</svg>\n'
    full_svg = header + "\n".join(svg_elements) + "\n" + footer
    
    with open('frontend/public/paper-landscape.svg', 'w', encoding='utf-8') as f:
        f.write(full_svg)
        
    print(f"Generated paper-landscape.svg successfully! Size: {len(full_svg)} bytes.")

if __name__ == '__main__':
    build_paper_svg()
