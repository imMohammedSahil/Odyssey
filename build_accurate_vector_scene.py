import cv2
import numpy as np

def build_vector_scene():
    img_path = r'C:\Holidays\Odyssey\receipt-reference.png'
    img = cv2.imread(img_path)
    if img is None:
        raise ValueError(f"Could not load image: {img_path}")
    h, w = img.shape[:2]
    print(f"Loaded {w}x{h} image")

    # Use bilateral filter with small sigma to preserve 1px comic lines
    smooth = cv2.bilateralFilter(img, d=3, sigmaColor=12, sigmaSpace=12)

    # 1. Void black comic ink (threshold: R, G, B < 48)
    black_mask = (smooth[:, :, 2] < 48) & (smooth[:, :, 1] < 48) & (smooth[:, :, 0] < 48)
    black_mask[h-4:h, :] = True

    # EXCLUDE dynamic text areas from black mask so React can render live order text
    # Row 1: Order ID (x: 555..760, y: 236..256)
    black_mask[236:256, 555:760] = False
    # Row 2: Order Date (x: 555..760, y: 264..284)
    black_mask[264:284, 555:760] = False
    # Row 3: Payment Method (x: 555..760, y: 292..312)
    black_mask[292:312, 555:760] = False
    # Row 4: Items (x: 555..760, y: 320..340)
    black_mask[320:340, 555:760] = False
    # Pink banner text: Total Paid / ₹540.00 (x: 275..735, y: 366..415)
    black_mask[366:415, 275:735] = False
    # Barcode number below barcode (x: 430..555, y: 485..508)
    black_mask[485:508, 430:555] = False

    # 2. Paper Mask (Parchment center receipt)
    roi_paper = np.zeros((h, w), dtype=bool)
    roi_paper[88:542, 172:832] = True
    paper_base = roi_paper & (smooth[:, :, 2] > 180) & (smooth[:, :, 1] > 165) & (smooth[:, :, 0] > 135) & (~black_mask)
    k_paper = cv2.getStructuringElement(cv2.MORPH_RECT, (15, 15))
    paper_closed = cv2.morphologyEx(paper_base.astype(np.uint8), cv2.MORPH_CLOSE, k_paper) > 0
    paper_contours, _ = cv2.findContours(paper_closed.astype(np.uint8), cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_TC89_KCOS)
    paper_contour = max(paper_contours, key=cv2.contourArea)
    paper_mask = np.zeros((h, w), dtype=np.uint8)
    cv2.fillPoly(paper_mask, [paper_contour], 255)
    paper_mask = paper_mask > 0

    # 3. Yellow Layers (Caution hazard stripes, ODYSSEY BASECAMP sign, brush streak, crate badge)
    yellow_mask = (smooth[:, :, 2] > 190) & (smooth[:, :, 1] > 160) & (smooth[:, :, 0] < 85) & (~black_mask)

    # 4. Neon Toxic Lime (Status pill, illuminated watchtower door)
    neon_lime_mask = (smooth[:, :, 1] > 195) & (smooth[:, :, 2] > 140) & (smooth[:, :, 0] < 80) & (~black_mask) & (~yellow_mask)

    # 5. Hot Pink / Magenta / Crimson (Sludge, backpack, flag, pink banner, RECEIPT title)
    pink_mask = (smooth[:, :, 2] > 160) & (smooth[:, :, 2] > smooth[:, :, 1] * 1.45) & (~black_mask)

    # 6. Deep Crimson / Red Stamp
    stamp_mask = paper_mask & (smooth[:, :, 2] > 130) & (smooth[:, :, 1] < 65) & (smooth[:, :, 0] < 65) & (~black_mask)
    pink_mask = pink_mask & (~stamp_mask)

    # 7. Sky Halftone / Speedlines (outside paper, olive/green tones)
    sky_halftone_mask = (~paper_mask) & (smooth[:, :, 1] > 145) & (smooth[:, :, 1] <= 195) & (smooth[:, :, 0] < 90) & (~black_mask) & (~pink_mask)

    # 8. Neutrals / Architecture / Props (Watchtower metal, crate, rocks, rubble)
    props_mask = (~paper_mask) & (~sky_halftone_mask) & (~pink_mask) & (~yellow_mask) & (~neon_lime_mask) & (~black_mask)

    # 9. Paper Shading / Stains
    paper_shade_mask = paper_mask & (smooth[:, :, 2] <= 235) & (smooth[:, :, 1] <= 218) & (~black_mask) & (~pink_mask) & (~yellow_mask) & (~neon_lime_mask) & (~stamp_mask)

    # Helper function to convert binary mask to SVG paths
    def mask_to_svg_paths(mask, min_area=3, approx_eps=0.28):
        clean = mask.astype(np.uint8) * 255
        contours, hierarchy = cv2.findContours(clean, cv2.RETR_CCOMP, cv2.CHAIN_APPROX_TC89_KCOS)
        if hierarchy is None or not contours:
            return ""
        paths = []
        for cnt in contours:
            if cv2.contourArea(cnt) < min_area:
                continue
            approx = cv2.approxPolyDP(cnt, approx_eps, True)
            if len(approx) < 3:
                continue
            p = approx.reshape(-1, 2)
            d = f"M {p[0][0]},{p[0][1]} " + " ".join([f"L {pt[0]},{pt[1]}" for pt in p[1:]]) + " Z"
            paths.append(d)
        return " ".join(paths)

    print("Tracing high-fidelity pure vector paths...")
    path_paper_base = mask_to_svg_paths(paper_mask, min_area=50, approx_eps=0.4)
    path_paper_shade = mask_to_svg_paths(paper_shade_mask, min_area=5, approx_eps=0.3)
    path_props = mask_to_svg_paths(props_mask, min_area=5, approx_eps=0.3)
    path_sky_halftone = mask_to_svg_paths(sky_halftone_mask, min_area=4, approx_eps=0.3)
    path_pink = mask_to_svg_paths(pink_mask, min_area=4, approx_eps=0.28)
    path_neon_lime = mask_to_svg_paths(neon_lime_mask, min_area=4, approx_eps=0.28)
    path_yellow = mask_to_svg_paths(yellow_mask, min_area=4, approx_eps=0.28)
    path_stamp = mask_to_svg_paths(stamp_mask, min_area=2, approx_eps=0.25)
    path_black_ink = mask_to_svg_paths(black_mask, min_area=2, approx_eps=0.22)

    svg_defs = '''  <defs>
    <linearGradient id="toxicSkyGrad" x1="0" y1="0" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#BAF414" />
      <stop offset="50%" stop-color="#C5F92B" />
      <stop offset="100%" stop-color="#8FE704" />
    </linearGradient>
    <filter id="comicShadow" x="-10%" y="-10%" width="125%" height="125%">
      <feDropShadow dx="8" dy="10" stdDeviation="0" flood-color="#0D0D0D" flood-opacity="0.8" />
    </filter>
  </defs>'''

    elements = []
    # 1. Base Comic Sky
    elements.append(f'  <!-- Layer 1: Toxic Acid Sky Base -->\n  <rect width="{w}" height="{h}" fill="url(#toxicSkyGrad)" />')

    # 2. Sky Halftones
    if path_sky_halftone:
        elements.append(f'  <!-- Layer 2: Sky Halftones & Texture -->\n  <path d="{path_sky_halftone}" fill="#98DC08" fill-rule="evenodd" />')

    # 3. Watchtower, Crate & Terrain Props
    if path_props:
        elements.append(f'  <!-- Layer 3: Watchtower, Crate, Rubble & Props -->\n  <path d="{path_props}" fill="#54593E" fill-rule="evenodd" />')

    # 4. Pink Sludge, Flag, Backpack & Banner
    if path_pink:
        elements.append(f'  <!-- Layer 4: Pink Sludge, Backpack, Flag & Accents -->\n  <path d="{path_pink}" fill="#F72678" fill-rule="evenodd" />')

    # 5. Neon Lime (Illuminated window, status pill)
    if path_neon_lime:
        elements.append(f'  <!-- Layer 5: Neon Lime Pill & Glows -->\n  <path d="{path_neon_lime}" fill="#B8F414" fill-rule="evenodd" />')

    # 6. Yellow Accents (Caution tape, basecamp sign)
    if path_yellow:
        elements.append(f'  <!-- Layer 6: Caution Yellow Stripes & Sign -->\n  <path d="{path_yellow}" fill="#F9EC1B" fill-rule="evenodd" />')

    # 7. Torn Receipt Paper Base
    if path_paper_base:
        elements.append(f'  <!-- Layer 7: Torn Parchment Paper Base -->\n  <path d="{path_paper_base}" fill="#FCEDD3" filter="url(#comicShadow)" stroke="#0D0D0D" stroke-width="2.5" stroke-linejoin="round" />')

    # 8. Paper Creases & Shading
    if path_paper_shade:
        elements.append(f'  <!-- Layer 8: Paper Shading & Stains -->\n  <path d="{path_paper_shade}" fill="#F0DFC3" fill-rule="evenodd" opacity="0.65" />')

    # 9. Red Rubber Stamp
    if path_stamp:
        elements.append(f'  <!-- Layer 9: Outbreak Confirmed Red Rubber Stamp -->\n  <path d="{path_stamp}" fill="#C82136" fill-rule="evenodd" />')

    # 10. Razor-Sharp Black Ink Lineart, Fence, Barbed Wire, Outlines & Barcode
    if path_black_ink:
        elements.append(f'  <!-- Layer 10: Pure Vector Black Comic Ink Lineart -->\n  <path d="{path_black_ink}" fill="#0D0D0D" fill-rule="evenodd" stroke="#0D0D0D" stroke-width="0.35" stroke-linejoin="round" />')

    header = f'<svg viewBox="0 0 {w} {h}" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg">\n{svg_defs}\n'
    footer = '</svg>\n'

    full_svg = header + "\n".join(elements) + "\n" + footer

    out_file = 'frontend/public/receipt-landscape.svg'
    with open(out_file, 'w', encoding='utf-8') as f:
        f.write(full_svg)

    print(f"Generated 100% PURE VECTOR SVG: {out_file} ({len(full_svg):,} bytes)")

if __name__ == '__main__':
    build_vector_scene()
