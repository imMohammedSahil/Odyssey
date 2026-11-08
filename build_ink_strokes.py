import cv2
import numpy as np
import networkx as nx
import os
import json
import math
from skimage.morphology import skeletonize

def extract_directed_strokes(skel_mask, stroke_type, wand_x, wand_y, min_length=5):
    y_indices, x_indices = np.where(skel_mask)
    pts_set = set(zip(x_indices, y_indices))
    if not pts_set:
        return []

    G = nx.Graph()
    for x, y in pts_set:
        G.add_node((x, y))
        for dx in (-1, 0, 1):
            for dy in (-1, 0, 1):
                if dx == 0 and dy == 0:
                    continue
                nx_pt = (x + dx, y + dy)
                if nx_pt in pts_set:
                    G.add_edge((x, y), nx_pt)

    critical = {n for n, d in G.degree() if d != 2}
    visited_edges = set()
    raw_paths = []

    # 1. Paths between critical nodes (endpoints & junctions)
    for u in critical:
        for v in G.neighbors(u):
            edge = tuple(sorted((u, v)))
            if edge in visited_edges:
                continue
            visited_edges.add(edge)
            path = [u, v]
            curr = v
            prev = u
            while G.degree(curr) == 2:
                nbrs = list(G.neighbors(curr))
                nxt = nbrs[0] if nbrs[1] == prev else nbrs[1]
                path.append(nxt)
                edge_n = tuple(sorted((curr, nxt)))
                visited_edges.add(edge_n)
                prev = curr
                curr = nxt
                if curr in critical or curr == u:
                    break
            raw_paths.append(path)

    # 2. Pure cycles with only degree-2 nodes
    for comp in nx.connected_components(G):
        sub = G.subgraph(comp)
        if all(d == 2 for _, d in sub.degree()):
            cycle_nodes = list(nx.cycle_basis(sub)[0])
            cycle_nodes.append(cycle_nodes[0])
            raw_paths.append(cycle_nodes)

    strokes = []
    for path in raw_paths:
        if len(path) < min_length:
            continue

        # Simplify polyline with approxPolyDP
        pts_np = np.array(path, dtype=np.int32).reshape(-1, 1, 2)
        approx = cv2.approxPolyDP(pts_np, epsilon=1.3, closed=False)
        pts = approx.reshape(-1, 2).tolist()
        if len(pts) < 2:
            continue

        # Orient outward from wand tip
        d_start = math.hypot(pts[0][0] - wand_x, pts[0][1] - wand_y)
        d_end = math.hypot(pts[-1][0] - wand_x, pts[-1][1] - wand_y)
        if d_end < d_start:
            pts.reverse()
            d_start, d_end = d_end, d_start

        dists = [math.hypot(p[0] - wand_x, p[1] - wand_y) for p in pts]
        min_d = min(dists)
        max_d = max(dists)

        length = sum(
            math.hypot(pts[i][0] - pts[i-1][0], pts[i][1] - pts[i-1][1])
            for i in range(1, len(pts))
        )

        if length < 5:
            continue

        strokes.append({
            "pts": pts,
            "minD": round(min_d, 1),
            "maxD": round(max_d, 1),
            "len": round(length, 1),
            "type": stroke_type
        })

    return strokes

def main():
    f = [x for x in os.listdir('.') if 'Enchanted' in x][0]
    img = cv2.imdecode(np.fromfile(f, dtype=np.uint8), cv2.IMREAD_COLOR)
    h, w, _ = img.shape
    print(f"Loaded image {w}x{h}")
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)

    wand_x, wand_y = 928, 328

    print("Skeletonizing ink lines (gray < 52)...")
    ink_mask = (gray < 52).astype(bool)
    ink_skel = skeletonize(ink_mask)

    print("Skeletonizing plume ribbons (gray > 200)...")
    plume_mask = (gray > 200).astype(bool)
    plume_skel = skeletonize(plume_mask)

    print("Extracting directed strokes...")
    ink_strokes = extract_directed_strokes(ink_skel, "ink", wand_x, wand_y, min_length=6)
    plume_strokes = extract_directed_strokes(plume_skel, "plume", wand_x, wand_y, min_length=5)

    all_strokes = ink_strokes + plume_strokes
    all_strokes.sort(key=lambda s: s["minD"])

    print(f"Total strokes extracted: {len(all_strokes)}")
    print(f"Ink strokes: {len(ink_strokes)}, Plume strokes: {len(plume_strokes)}")
    print(f"Click 1 reach (<=210px): {sum(1 for s in all_strokes if s['minD'] <= 210)}")
    print(f"Click 2 reach (<=360px): {sum(1 for s in all_strokes if s['minD'] <= 360)}")

    out_file = "frontend/public/wizard-ink-strokes.json"
    with open(out_file, "w") as fp:
        json.dump(all_strokes, fp)
    print(f"Saved {out_file} ({os.path.getsize(out_file) / 1024:.1f} KB)")

if __name__ == "__main__":
    main()
