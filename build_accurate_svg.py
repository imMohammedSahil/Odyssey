import cv2
import numpy as np

def build_svg():
    img = cv2.imread('Fondo de Halloween con casa _ Vector Premium.jpg')
    h, w = img.shape[:2]
    
    # Smooth slightly to eliminate jpeg noise while preserving edges
    smooth = cv2.bilateralFilter(img, d=5, sigmaColor=30, sigmaSpace=30)
    
    # Segment colors using K-Means with 16 distinct clusters
    data = np.float32(smooth.reshape((-1, 3)))
    criteria = (cv2.TERM_CRITERIA_EPS + cv2.TERM_CRITERIA_MAX_ITER, 30, 0.5)
    K = 16
    ret, label, center = cv2.kmeans(data, K, None, criteria, 15, cv2.KMEANS_PP_CENTERS)
    center = np.uint8(center)
    labels = label.reshape((h, w))
    
    clusters = []
    for idx, bgr in enumerate(center):
        b, g, r = int(bgr[0]), int(bgr[1]), int(bgr[2])
        hex_col = f'#{r:02x}{g:02x}{b:02x}'
        lum = 0.299 * r + 0.587 * g + 0.114 * b
        is_orange = (r > 140) and (r > b + 40)
        is_black = (r < 25 and g < 25 and b < 25)
        clusters.append({
            'idx': idx,
            'bgr': (b, g, r),
            'hex': hex_col,
            'lum': lum,
            'is_orange': is_orange,
            'is_black': is_black,
            'count': np.sum(labels == idx)
        })
        
    # Group and layer order
    sky_swirls = [c for c in clusters if not c['is_black'] and not c['is_orange'] and c['lum'] < 190]
    sky_swirls.sort(key=lambda x: x['lum'])
    
    moon_layers = [c for c in clusters if not c['is_black'] and not c['is_orange'] and c['lum'] >= 190]
    moon_layers.sort(key=lambda x: x['lum'])
    
    orange_layers = [c for c in clusters if c['is_orange']]
    orange_layers.sort(key=lambda x: x['lum'])
    
    black_layers = [c for c in clusters if c['is_black']]
    
    # Layer stack order
    ordered = sky_swirls + moon_layers + orange_layers + black_layers
    
    svg_defs = '''  <defs>
    <filter id="moonGlow" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="4" result="blur" />
      <feComposite in="SourceGraphic" in2="blur" operator="over" />
    </filter>
  </defs>'''
    
    svg_elements = []
    
    # Base background rect in darkest sky purple
    base_color = sky_swirls[0]['hex'] if sky_swirls else '#371550'
    svg_elements.append(f'  <rect width="{w}" height="{h}" fill="{base_color}" />')
    
    for c in ordered:
        idx = c['idx']
        color = c['hex']
        if c['is_black']:
            color = '#0D0D0D'
            
        mask = np.uint8(labels == idx) * 255
        
        # Clean mask
        kernel = cv2.getStructuringElement(cv2.MORPH_RECT, (2, 2))
        mask = cv2.morphologyEx(mask, cv2.MORPH_OPEN, kernel)
        
        contours, hierarchy = cv2.findContours(mask, cv2.RETR_CCOMP, cv2.CHAIN_APPROX_TC89_KCOS)
        if hierarchy is None:
            continue
            
        path_list = []
        for i, cnt in enumerate(contours):
            if cv2.contourArea(cnt) < 3:
                continue
            # Epsilon for curve approximation
            approx = cv2.approxPolyDP(cnt, 0.45, True)
            if len(approx) < 3:
                continue
            pts = approx.reshape(-1, 2)
            d = f"M {pts[0][0]},{pts[0][1]} " + " ".join([f"L {p[0]},{p[1]}" for p in pts[1:]]) + " Z"
            path_list.append(d)
            
        if path_list:
            combined = " ".join(path_list)
            stroke = ' stroke="#0D0D0D" stroke-width="0.8" stroke-linejoin="round"' if c['is_black'] else ''
            svg_elements.append(f'  <path d="{combined}" fill="{color}" fill-rule="evenodd"{stroke} />')

    # SHARPENING OVERLAY FOR KEY ELEMENTS:
    # 1. House Windows: Crisp orthogonal glowing window panes with black mullion crosses
    windows_svg = '''  <!-- Sharpened Architectural Windows -->
  <g id="sharpened-windows">
    <!-- Tower Window (Arched 2x2) -->
    <path d="M 87,143 Q 94,136 101,143 L 101,164 L 87,164 Z" fill="#E67418" stroke="#0D0D0D" stroke-width="1.2" />
    <line x1="94" y1="138" x2="94" y2="164" stroke="#0D0D0D" stroke-width="1" />
    <line x1="87" y1="151" x2="101" y2="151" stroke="#0D0D0D" stroke-width="1" />

    <!-- 2nd Floor Windows (4 double windows with clean orthogonal frames) -->
    <rect x="60" y="215" width="12" height="22" rx="1" fill="#E67418" stroke="#0D0D0D" stroke-width="1.2" />
    <line x1="66" y1="215" x2="66" y2="237" stroke="#0D0D0D" stroke-width="1" />
    <line x1="60" y1="226" x2="72" y2="226" stroke="#0D0D0D" stroke-width="1" />

    <rect x="86" y="215" width="13" height="22" rx="1" fill="#E67418" stroke="#0D0D0D" stroke-width="1.2" />
    <line x1="92" y1="215" x2="92" y2="237" stroke="#0D0D0D" stroke-width="1" />
    <line x1="86" y1="226" x2="99" y2="226" stroke="#0D0D0D" stroke-width="1" />

    <rect x="139" y="215" width="12" height="22" rx="1" fill="#E67418" stroke="#0D0D0D" stroke-width="1.2" />
    <line x1="145" y1="215" x2="145" y2="237" stroke="#0D0D0D" stroke-width="1" />
    <line x1="139" y1="226" x2="151" y2="226" stroke="#0D0D0D" stroke-width="1" />

    <rect x="165" y="215" width="13" height="22" rx="1" fill="#E67418" stroke="#0D0D0D" stroke-width="1.2" />
    <line x1="171" y1="215" x2="171" y2="237" stroke="#0D0D0D" stroke-width="1" />
    <line x1="165" y1="226" x2="178" y2="226" stroke="#0D0D0D" stroke-width="1" />

    <!-- 1st Floor Windows (4 double windows) -->
    <rect x="60" y="246" width="12" height="22" rx="1" fill="#E67418" stroke="#0D0D0D" stroke-width="1.2" />
    <line x1="66" y1="246" x2="66" y2="268" stroke="#0D0D0D" stroke-width="1" />
    <line x1="60" y1="257" x2="72" y2="257" stroke="#0D0D0D" stroke-width="1" />

    <rect x="86" y="246" width="13" height="22" rx="1" fill="#E67418" stroke="#0D0D0D" stroke-width="1.2" />
    <line x1="92" y1="246" x2="92" y2="268" stroke="#0D0D0D" stroke-width="1" />
    <line x1="86" y1="257" x2="99" y2="257" stroke="#0D0D0D" stroke-width="1" />

    <rect x="139" y="246" width="12" height="22" rx="1" fill="#E67418" stroke="#0D0D0D" stroke-width="1.2" />
    <line x1="145" y1="246" x2="145" y2="268" stroke="#0D0D0D" stroke-width="1" />
    <line x1="139" y1="257" x2="151" y2="257" stroke="#0D0D0D" stroke-width="1" />

    <rect x="165" y="246" width="13" height="22" rx="1" fill="#E67418" stroke="#0D0D0D" stroke-width="1.2" />
    <line x1="171" y1="246" x2="171" y2="268" stroke="#0D0D0D" stroke-width="1" />
    <line x1="165" y1="257" x2="178" y2="257" stroke="#0D0D0D" stroke-width="1" />
  </g>'''
    svg_elements.append(windows_svg)
    
    # 2. Fence Sharpening: Crisp rails and symmetrical spearhead pickets
    fence_svg = '''  <!-- Sharpened Gothic Fence -->
  <g id="sharpened-fence" stroke="#0D0D0D" stroke-linecap="round" fill="none">
    <!-- Horizontal Rails -->
    <line x1="418" y1="324" x2="590" y2="324" stroke-width="1.8" />
    <line x1="418" y1="344" x2="590" y2="344" stroke-width="1.8" />
    
    <!-- Vertical Spearhead Pickets -->
    <!-- picket 1 -->
    <path d="M 420,355 L 420,314 L 421.5,308 L 423,314 L 423,355" stroke-width="1.4" fill="#0D0D0D" />
    <path d="M 436,355 L 436,312 L 437.5,306 L 439,312 L 439,355" stroke-width="1.4" fill="#0D0D0D" />
    <path d="M 454,355 L 454,310 L 455.5,304 L 457,310 L 457,355" stroke-width="1.4" fill="#0D0D0D" />
    <path d="M 472,355 L 472,312 L 473.5,306 L 475,312 L 475,355" stroke-width="1.4" fill="#0D0D0D" />
    <path d="M 490,355 L 490,314 L 491.5,308 L 493,314 L 493,355" stroke-width="1.4" fill="#0D0D0D" />
    <path d="M 508,355 L 508,312 L 509.5,306 L 511,312 L 511,355" stroke-width="1.4" fill="#0D0D0D" />
    <path d="M 526,355 L 526,310 L 527.5,304 L 529,310 L 529,355" stroke-width="1.4" fill="#0D0D0D" />
    <path d="M 544,355 L 544,312 L 545.5,306 L 547,312 L 547,355" stroke-width="1.4" fill="#0D0D0D" />
    <path d="M 562,355 L 562,314 L 563.5,308 L 565,314 L 565,355" stroke-width="1.4" fill="#0D0D0D" />
    <path d="M 580,355 L 580,312 L 581.5,306 L 583,312 L 583,355" stroke-width="1.4" fill="#0D0D0D" />
  </g>'''
    svg_elements.append(fence_svg)

    header = f'<svg viewBox="0 0 {w} {h}" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">\n{svg_defs}\n'
    footer = '</svg>\n'
    
    full_svg = header + "\n".join(svg_elements) + "\n" + footer
    
    with open('frontend/public/correction-landscape.svg', 'w', encoding='utf-8') as f:
        f.write(full_svg)
        
    print(f"Successfully generated accurate vector SVG! Size: {len(full_svg)} bytes.")

if __name__ == '__main__':
    build_svg()

