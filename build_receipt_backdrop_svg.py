import cv2
import numpy as np
import json

def build_backdrop():
    img_path = r'C:\Holidays\Odyssey\receipt-reference.png'
    img = cv2.imread(img_path)
    if img is None:
        raise ValueError(f"Could not load image: {img_path}")
    h, w = img.shape[:2]

    with open('paper_contour.json', 'r') as f:
        contour_data = json.load(f)
    d_abs = contour_data['d_abs']
    d_rel = contour_data['d_rel']
    card_w = contour_data['w']
    card_h = contour_data['h']
    card_x = contour_data['x']
    card_y = contour_data['y']

    # Create paper mask in image coordinates
    paper_mask_img = np.zeros((h, w), dtype=np.uint8)
    # Parse d_abs into contour
    pts = []
    tokens = d_abs.replace('M ', '').replace(' Z', '').split(' L ')
    for t in tokens:
        parts = t.strip().split(',')
        if len(parts) == 2:
            pts.append([int(parts[0]), int(parts[1])])
    pts = np.array(pts, dtype=np.int32)
    cv2.fillPoly(paper_mask_img, [pts], 255)

    # Dilate slightly so black ink of paper edge remains intact
    k_paper = cv2.getStructuringElement(cv2.MORPH_RECT, (3, 3))
    paper_mask_inner = cv2.erode(paper_mask_img, k_paper)

    smooth = cv2.bilateralFilter(img, d=5, sigmaColor=25, sigmaSpace=25)

    # Cluster background outside paper
    bg_img = smooth.copy()
    
    # 26 clusters
    data = np.float32(bg_img.reshape((-1, 3)))
    criteria = (cv2.TERM_CRITERIA_EPS + cv2.TERM_CRITERIA_MAX_ITER, 35, 0.4)
    K = 26
    ret, label, center = cv2.kmeans(data, K, None, criteria, 10, cv2.KMEANS_PP_CENTERS)
    center = np.uint8(center)
    labels = label.reshape((h, w))

    clusters = []
    for idx, bgr in enumerate(center):
        b, g, r = int(bgr[0]), int(bgr[1]), int(bgr[2])
        hex_col = f'#{r:02x}{g:02x}{b:02x}'
        lum = 0.299 * r + 0.587 * g + 0.114 * b
        is_black = (r < 38 and g < 38 and b < 38)
        is_lime = (g > 150 and g > r * 1.05 and b < 130)
        is_paper = (r > 200 and g > 185 and b > 160)

        clusters.append({
            'idx': idx,
            'hex': hex_col,
            'lum': lum,
            'is_black': is_black,
            'is_lime': is_lime,
            'is_paper': is_paper
        })

    # Group layers
    bg_lime = [c for c in clusters if c['is_lime'] and not c['is_black']]
    bg_lime.sort(key=lambda x: -x['lum'])

    props = [c for c in clusters if not c['is_lime'] and not c['is_paper'] and not c['is_black']]
    props.sort(key=lambda x: x['lum'])

    black_layers = [c for c in clusters if c['is_black']]

    ordered = bg_lime + props + black_layers

    kernel_clean = cv2.getStructuringElement(cv2.MORPH_RECT, (2, 2))

    def mask_to_svg_paths(mask, min_area=6, approx_eps=0.45):
        clean = cv2.morphologyEx(mask.astype(np.uint8)*255, cv2.MORPH_OPEN, kernel_clean)
        contours, hierarchy = cv2.findContours(clean, cv2.RETR_CCOMP, cv2.CHAIN_APPROX_TC89_KCOS)
        if hierarchy is None or not contours:
            return ""
        path_list = []
        for cnt in contours:
            if cv2.contourArea(cnt) < min_area:
                continue
            approx = cv2.approxPolyDP(cnt, approx_eps, True)
            if len(approx) < 3:
                continue
            p = approx.reshape(-1, 2)
            d = f"M {p[0][0]},{p[0][1]} " + " ".join([f"L {pt[0]},{pt[1]}" for pt in p[1:]]) + " Z"
            path_list.append(d)
        return " ".join(path_list)

    svg_elements = []

    # Sky gradient
    svg_defs = '''  <defs>
    <linearGradient id="toxicSky" x1="0" y1="0" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#A6F81B" />
      <stop offset="50%" stop-color="#BDF928" />
      <stop offset="100%" stop-color="#93E012" />
    </linearGradient>
    <filter id="comicShadow" x="-10%" y="-10%" width="130%" height="130%">
      <feDropShadow dx="10" dy="12" stdDeviation="0" flood-color="#000000" flood-opacity="0.8" />
    </filter>
  </defs>'''

    svg_elements.append(f'  <!-- Base Toxic Comic Sky -->\n  <rect width="{w}" height="{h}" fill="url(#toxicSky)" />')

    print("Extracting background scene outside receipt...")
    for c in ordered:
        idx = c['idx']
        color = c['hex']
        min_a = 6
        eps = 0.44

        if c['is_black']:
            color = '#0D0D0D'
            min_a = 4
            eps = 0.38

        # Mask outside paper
        mask = (labels == idx) & (paper_mask_inner == 0)

        path_d = mask_to_svg_paths(mask, min_area=min_a, approx_eps=eps)
        if not path_d:
            continue

        stroke_attr = ""
        if c['is_black']:
            stroke_attr = ' stroke="#0D0D0D" stroke-width="0.5" stroke-linejoin="round"'

        svg_elements.append(f'  <path d="{path_d}" fill="{color}" fill-rule="evenodd"{stroke_attr} />')

    # Add torn paper base in center with comic drop shadow
    svg_elements.append(f'''  <!-- Torn Receipt Parchment Base -->
  <path d="{d_abs}" fill="#FCEDD3" filter="url(#comicShadow)" stroke="#0D0D0D" stroke-width="3.5" stroke-linejoin="round" />
  <path d="{d_abs}" fill="#F4E0C4" opacity="0.3" />''')

    header = f'<svg viewBox="0 0 {w} {h}" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">\n{svg_defs}\n'
    footer = '</svg>\n'

    full_svg = header + "\n".join(svg_elements) + "\n" + footer

    out_file = 'frontend/public/receipt-backdrop-clean.svg'
    with open(out_file, 'w', encoding='utf-8') as f:
        f.write(full_svg)

    print(f"Clean backdrop SVG generated: {out_file} ({len(full_svg):,} bytes)")

if __name__ == '__main__':
    build_backdrop()
