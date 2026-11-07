import cv2
import numpy as np

def build_receipt_svg():
    img_path = r'C:\Holidays\Odyssey\receipt-reference.png'
    img = cv2.imread(img_path)
    if img is None:
        raise ValueError(f"Could not load image: {img_path}")
    h, w = img.shape[:2]
    print(f"Loaded image {w}x{h}")

    # Bilateral smoothing to remove noise while keeping sharp vector comic edges
    smooth = cv2.bilateralFilter(img, d=5, sigmaColor=25, sigmaSpace=25)

    # Multi-palette clustering (K=26) for true color accuracy
    data = np.float32(smooth.reshape((-1, 3)))
    criteria = (cv2.TERM_CRITERIA_EPS + cv2.TERM_CRITERIA_MAX_ITER, 35, 0.4)
    K = 26
    ret, label, center = cv2.kmeans(data, K, None, criteria, 10, cv2.KMEANS_PP_CENTERS)
    center = np.uint8(center)
    labels = label.reshape((h, w))

    clusters = []
    for idx, bgr in enumerate(center):
        b, g, r = int(bgr[0]), int(bgr[1]), int(bgr[2])
        hex_col = f'#{r:02x}{g:02x}{b:02x}'
        count = int(np.sum(labels == idx))
        lum = 0.299 * r + 0.587 * g + 0.114 * b
        is_black = (r < 38 and g < 38 and b < 38)
        is_paper = (r > 200 and g > 185 and b > 160)
        is_lime = (g > 150 and g > r * 1.05 and b < 130)
        is_pink = (r > 150 and r > g * 1.5)
        is_yellow = (r > 200 and g > 175 and b < 90)

        clusters.append({
            'idx': idx,
            'bgr': (b, g, r),
            'hex': hex_col,
            'lum': lum,
            'count': count,
            'is_black': is_black,
            'is_paper': is_paper,
            'is_lime': is_lime,
            'is_pink': is_pink,
            'is_yellow': is_yellow
        })

    # Layer ordering:
    # 1. Lime background atmosphere & sky
    # 2. Distant clouds, terrain, props (pink, yellow, neutrals)
    # 3. Torn receipt paper base
    # 4. Receipt color accents (pink banner, yellow tape, green pill, red stamp)
    # 5. Final sharp black ink contours & silhouettes
    
    bg_lime = [c for c in clusters if c['is_lime'] and not c['is_black']]
    bg_lime.sort(key=lambda x: -x['lum'])

    props_neutrals = [c for c in clusters if not c['is_lime'] and not c['is_paper'] and not c['is_black']]
    props_neutrals.sort(key=lambda x: x['lum'])

    paper_layers = [c for c in clusters if c['is_paper'] and not c['is_black']]
    paper_layers.sort(key=lambda x: x['lum'])

    black_layers = [c for c in clusters if c['is_black']]

    ordered = bg_lime + props_neutrals + paper_layers + black_layers

    # Morphological kernel for smoothing micro-noise
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
            pts = approx.reshape(-1, 2)
            d = f"M {pts[0][0]},{pts[0][1]} " + " ".join([f"L {p[0]},{p[1]}" for p in pts[1:]]) + " Z"
            path_list.append(d)
        return " ".join(path_list)

    svg_elements = []
    
    # 1. Base gradient rect for toxic lime comic sky
    svg_defs = '''  <defs>
    <linearGradient id="toxicSky" x1="0" y1="0" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#A6F81B" />
      <stop offset="50%" stop-color="#BDF928" />
      <stop offset="100%" stop-color="#93E012" />
    </linearGradient>
  </defs>'''
    svg_elements.append(f'  <!-- Base Toxic Comic Sky -->\n  <rect width="{w}" height="{h}" fill="url(#toxicSky)" />')

    print("Extracting vector paths layer by layer...")
    for c in ordered:
        idx = c['idx']
        color = c['hex']
        min_a = 5
        eps = 0.42
        
        if c['is_black']:
            color = '#0D0D0D'
            min_a = 4
            eps = 0.38
        elif c['is_paper']:
            min_a = 8
            eps = 0.40

        mask = (labels == idx)
        # For paper, bridge under mortar/text so background never leaks through paper
        if c['is_paper'] and c['lum'] > 220:
            k_bridge = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (5, 5))
            mask = cv2.dilate(mask.astype(np.uint8), k_bridge) > 0

        path_d = mask_to_svg_paths(mask, min_area=min_a, approx_eps=eps)
        if not path_d:
            continue

        stroke_attr = ""
        if c['is_black']:
            stroke_attr = ' stroke="#0D0D0D" stroke-width="0.5" stroke-linejoin="round"'
        
        svg_elements.append(f'  <path d="{path_d}" fill="{color}" fill-rule="evenodd"{stroke_attr} />')

    header = f'<svg viewBox="0 0 {w} {h}" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">\n{svg_defs}\n'
    footer = '</svg>\n'

    full_svg = header + "\n".join(svg_elements) + "\n" + footer

    out_file = 'frontend/public/receipt-landscape.svg'
    with open(out_file, 'w', encoding='utf-8') as f:
        f.write(full_svg)

    print(f"Vector SVG generated: {out_file} ({len(full_svg):,} bytes)")

if __name__ == '__main__':
    build_receipt_svg()
