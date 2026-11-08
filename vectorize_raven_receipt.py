import cv2
import numpy as np
from PIL import Image
import time
import os

def pts_to_smooth_path(pts, sharp_angle_deg=45.0):
    n = len(pts)
    if n < 3:
        return ""
    cos_sharp = np.cos(np.radians(sharp_angle_deg))
    is_sharp = []
    for i in range(n):
        p_prev = pts[(i - 1) % n]
        p_curr = pts[i]
        p_next = pts[(i + 1) % n]
        v1 = p_curr - p_prev
        v2 = p_next - p_curr
        n1 = np.linalg.norm(v1)
        n2 = np.linalg.norm(v2)
        if n1 == 0 or n2 == 0:
            is_sharp.append(True)
            continue
        v1 /= n1
        v2 /= n2
        dot = np.clip(np.dot(v1, v2), -1.0, 1.0)
        is_sharp.append(dot < cos_sharp)

    mids = [(pts[i] + pts[(i + 1) % n]) / 2.0 for i in range(n)]
    d_parts = [f"M {mids[0][0]:.1f},{mids[0][1]:.1f}"]
    for i in range(n):
        nxt = (i + 1) % n
        curr_pt = pts[nxt]
        nxt_mid = mids[nxt]
        if is_sharp[nxt]:
            d_parts.append(f"L {curr_pt[0]:.1f},{curr_pt[1]:.1f} L {nxt_mid[0]:.1f},{nxt_mid[1]:.1f}")
        else:
            d_parts.append(f"Q {curr_pt[0]:.1f},{curr_pt[1]:.1f} {nxt_mid[0]:.1f},{nxt_mid[1]:.1f}")
    d_parts.append("Z")
    return " ".join(d_parts)

def extract_paths(mask, min_area=8, approx_eps=0.45, sharp_angle=45.0):
    contours, _ = cv2.findContours(mask.astype(np.uint8), cv2.RETR_CCOMP, cv2.CHAIN_APPROX_TC89_KCOS)
    paths = []
    for cnt in contours:
        if cv2.contourArea(cnt) < min_area:
            continue
        approx = cv2.approxPolyDP(cnt, approx_eps, True)
        if len(approx) < 3:
            continue
        pts = approx.reshape(-1, 2).astype(float)
        p_str = pts_to_smooth_path(pts, sharp_angle_deg=sharp_angle)
        if p_str:
            paths.append(p_str)
    return paths

def build_raven_receipt_svg():
    t0 = time.time()
    img_bgr = cv2.imread('clean_raven_scroll_bg.png')
    h, w, _ = img_bgr.shape
    print(f"Loaded reference image: {w}x{h}")

    # 1. Background checkerboard isolation
    diff = np.max(img_bgr, axis=2) - np.min(img_bgr, axis=2)
    bg_cand = (diff <= 8) & (img_bgr[:, :, 0] > 180) & (img_bgr[:, :, 1] > 180) & (img_bgr[:, :, 2] > 180)
    ff_mask = np.zeros((h+2, w+2), np.uint8)
    for pt in [(0, 0), (w-1, 0), (0, h-1), (w-1, h-1), (w//2, 0), (0, h//2), (w-1, h//2)]:
        if bg_cand[pt[1], pt[0]]:
            cv2.floodFill(img_bgr.copy(), ff_mask, pt, (0, 0, 0), (8, 8, 8), (8, 8, 8))
    bg_mask = ff_mask[1:-1, 1:-1] > 0
    fg_mask = ~bg_mask

    # Bilateral smoothing for noise-free graphic-novel cel separation
    smooth = cv2.bilateralFilter(img_bgr, d=5, sigmaColor=25, sigmaSpace=25)
    gray = cv2.cvtColor(smooth, cv2.COLOR_BGR2GRAY)
    r = smooth[:, :, 2].astype(float)
    g = smooth[:, :, 1].astype(float)
    b = smooth[:, :, 0].astype(float)

    # Extract full silhouette
    k_close = cv2.getStructuringElement(cv2.MORPH_RECT, (3, 3))
    fg_clean = cv2.morphologyEx(fg_mask.astype(np.uint8) * 255, cv2.MORPH_CLOSE, k_close)
    fg_paths = extract_paths(fg_clean > 0, min_area=40, approx_eps=0.5)

    svg_layers = []

    # Layer 0: Drop shadow ambient base
    svg_layers.append('  <!-- Layer 0: Drop shadow ambient base -->')
    if fg_paths:
        svg_layers.append(f'  <path d="{" ".join(fg_paths)}" fill="#000000" opacity="0.55" transform="translate(6, 12)" filter="url(#dropShadowBlur)" />')

    # Layer 1: Parchment scroll body & smoke
    parchment_base = fg_mask & (g > 150) & (g > b + 10) & (r > 130)
    p_parch = extract_paths(parchment_base, min_area=15, approx_eps=0.45)
    if p_parch:
        svg_layers.append('  <!-- Layer 1: Parchment Scroll Base & Smoke Tendril -->')
        svg_layers.append(f'  <path d="{" ".join(p_parch)}" fill="#C2DCB2" fill-rule="evenodd" />')

    # Layer 2: Parchment subtle highlights
    parch_hi = parchment_base & (g >= 205)
    p_phi = extract_paths(parch_hi, min_area=8, approx_eps=0.4)
    if p_phi:
        svg_layers.append('  <!-- Layer 2: Parchment Crease Highlights -->')
        svg_layers.append(f'  <path d="{" ".join(p_phi)}" fill="#D5EAC6" fill-rule="evenodd" />')

    # Layer 3: Parchment distress & shadows
    parch_sh = parchment_base & (g < 185)
    p_psh = extract_paths(parch_sh, min_area=10, approx_eps=0.45)
    if p_psh:
        svg_layers.append('  <!-- Layer 3: Parchment Fold & Edge Shadows -->')
        svg_layers.append(f'  <path d="{" ".join(p_psh)}" fill="#A7C897" fill-rule="evenodd" />')

    # Layer 4: Bronze scroll rod cuffs
    bronze_base = fg_mask & (r > 105) & (r > g + 8) & (g > b + 8) & (b < 110)
    p_bronze = extract_paths(bronze_base, min_area=8, approx_eps=0.4)
    if p_bronze:
        svg_layers.append('  <!-- Layer 4: Bronze Rod Collars Base -->')
        svg_layers.append(f'  <path d="{" ".join(p_bronze)}" fill="#9A6E44" fill-rule="evenodd" />')

    bronze_hi = bronze_base & (r > 165)
    p_bhi = extract_paths(bronze_hi, min_area=4, approx_eps=0.35)
    if p_bhi:
        svg_layers.append('  <!-- Layer 5: Bronze Metallic Highlights -->')
        svg_layers.append(f'  <path d="{" ".join(p_bhi)}" fill="#CFA06E" fill-rule="evenodd" />')

    # Layer 6: Raven hood & wings slate midtones
    raven_mid = fg_mask & (gray >= 38) & (gray < 85) & (~parchment_base) & (~bronze_base)
    p_rmid = extract_paths(raven_mid, min_area=12, approx_eps=0.45)
    if p_rmid:
        svg_layers.append('  <!-- Layer 6: Raven Cloak & Timber Midtones -->')
        svg_layers.append(f'  <path d="{" ".join(p_rmid)}" fill="#2D3830" fill-rule="evenodd" />')

    raven_hi = fg_mask & (gray >= 85) & (gray < 140) & (~parchment_base) & (~bronze_base)
    p_rhi = extract_paths(raven_hi, min_area=8, approx_eps=0.4)
    if p_rhi:
        svg_layers.append('  <!-- Layer 7: Raven Feather & Hood Highlights -->')
        svg_layers.append(f'  <path d="{" ".join(p_rhi)}" fill="#3F4F44" fill-rule="evenodd" />')

    # Layer 8: Stone buttons on bottom
    stone_btn = fg_mask & (smooth[:, :, 1] > 130) & (smooth[:, :, 1] < 185) & (np.arange(h)[:, None] > 820)
    p_sbtn = extract_paths(stone_btn, min_area=15, approx_eps=0.4)
    if p_sbtn:
        svg_layers.append('  <!-- Layer 8: Stone Action Buttons Base -->')
        svg_layers.append(f'  <path d="{" ".join(p_sbtn)}" fill="#9ABF8B" fill-rule="evenodd" />')

    # Layer 9: Raven glowing yellow-green eyes
    eyes_mask = fg_mask & (r > 180) & (g > 190) & (b < 140) & (np.arange(h)[:, None] < 260)
    p_eyes = extract_paths(eyes_mask, min_area=3, approx_eps=0.25)
    if p_eyes:
        svg_layers.append('  <!-- Layer 9: Raven Glowing Occult Eyes -->')
        svg_layers.append(f'  <path d="{" ".join(p_eyes)}" fill="#F5FFA3" filter="url(#eyeGlow)" fill-rule="evenodd" />')

    # Layer 10: Mignola Comic Void Black Ink Lines, Folds, Ribbons, Borders
    black_ink = fg_mask & (gray < 38) & (~eyes_mask)
    edges = cv2.Canny(smooth, 28, 80)
    k_edge = cv2.getStructuringElement(cv2.MORPH_RECT, (2, 2))
    edges_dil = cv2.dilate(edges, k_edge)
    black_comb = cv2.bitwise_or(black_ink.astype(np.uint8) * 255, edges_dil)
    black_comb[bg_mask] = 0
    black_comb[eyes_mask] = 0
    p_ink = extract_paths(black_comb > 0, min_area=10, approx_eps=0.45)
    if p_ink:
        svg_layers.append('  <!-- Layer 10: Razor-Sharp Mignola Comic Black Ink Lineart & Ribbons -->')
        svg_layers.append(f'  <path d="{" ".join(p_ink)}" fill="#101713" stroke="#101713" stroke-width="0.5" stroke-linejoin="round" fill-rule="evenodd" />')

    defs = '''  <defs>
    <filter id="dropShadowBlur" x="-15%" y="-15%" width="130%" height="130%">
      <feGaussianBlur stdDeviation="10" />
    </filter>
    <filter id="eyeGlow" x="-50%" y="-50%" width="200%" height="200%">
      <feGaussianBlur stdDeviation="3.5" result="blur" />
      <feMerge>
        <feMergeNode in="blur" />
        <feMergeNode in="SourceGraphic" />
      </feMerge>
    </filter>
  </defs>'''

    header = f'<svg viewBox="0 0 {w} {h}" xmlns="http://www.w3.org/2000/svg" shape-rendering="geometricPrecision">\n{defs}\n'
    footer = '</svg>\n'
    full_svg = header + "\n".join(svg_layers) + "\n" + footer

    out_file = 'frontend/public/raven-receipt-scroll.svg'
    with open(out_file, 'w', encoding='utf-8') as f:
        f.write(full_svg)

    print(f"Generated Clean Raven Receipt Scroll SVG at {out_file}! Size: {len(full_svg):,} bytes in {time.time()-t0:.2f}s")

if __name__ == '__main__':
    build_raven_receipt_svg()
