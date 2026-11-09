// ISO/IEC 15417 Code 128B Specification
const CODE128_PATTERNS = [
  "212222", "222122", "222221", "121223", "121322", "131222", "122213", "122312", "132212", "221213",
  "221312", "231212", "112232", "122132", "122231", "113222", "123122", "123221", "223211", "221132",
  "221231", "213212", "223112", "312131", "311222", "321122", "321221", "312212", "322112", "322211",
  "212123", "212321", "232121", "111323", "131123", "131321", "112313", "132113", "132311", "211313",
  "231113", "231311", "112133", "112331", "132131", "113123", "113321", "133121", "313121", "211331",
  "231131", "213113", "213311", "213131", "311123", "311321", "331121", "312113", "312311", "332111",
  "314111", "221411", "431111", "111224", "111422", "121124", "121421", "141122", "141221", "112214",
  "112412", "122114", "122411", "142112", "142211", "241211", "221114", "413111", "241112", "134111",
  "111242", "121142", "121241", "114212", "124112", "124211", "411212", "421112", "421211", "212141",
  "214121", "412121", "111143", "111341", "131141", "114113", "114311", "411113", "411311", "113141",
  "114131", "311141", "411131", "211412", "211214", "211232", "2331112"
];

function generateCode128Svg(rawText) {
  const text = String(rawText || "ODY-CAMPUS");
  const codes = [104];
  let checkSum = 104;

  for (let i = 0; i < text.length; i++) {
    const val = text.charCodeAt(i) - 32;
    if (val >= 0 && val <= 95) {
      codes.push(val);
      checkSum += (i + 1) * val;
    }
  }

  codes.push(checkSum % 103);
  codes.push(106);

  const bars = [];
  let x = 10;

  for (let c = 0; c < codes.length; c++) {
    const pattern = CODE128_PATTERNS[codes[c]];
    if (!pattern) continue;
    for (let p = 0; p < pattern.length; p++) {
      const w = parseInt(pattern[p], 10);
      const isBar = p % 2 === 0;
      if (isBar) {
        bars.push({ x, w });
      }
      x += w;
    }
  }

  x += 10;
  return { bars, totalWidth: x };
}

export function downloadOrPrintReceipt(order) {
  const receiptData = {
    orderId: order.orderId || order._id || "OD-ONLINE",
    items: order.items || [],
    total: order.total || 0,
    date: order.date || new Date().toLocaleString(),
    status: (order.status || "CONFIRMED").toUpperCase(),
    pickupCounter: "MAIN LIBRARY BASECAMP • PICKUP DESK 04",
  };

  const codeString = `ODY-${receiptData.orderId.replace(/[^a-zA-Z0-9]/g, "").slice(0, 12).toUpperCase()}`;
  const { bars, totalWidth } = generateCode128Svg(codeString);

  const barcodeBarsHtml = bars
    .map(b => `<rect x="${b.x}" y="0" width="${b.w}" height="32" fill="#0b160e" />`)
    .join("");

  const itemsHtml = (receiptData.items || []).map(item => `
    <div class="rcpt-pdf-table-row">
      <div class="rcpt-pdf-td desc">
        <div class="rcpt-pdf-item-name">${item.name || item.title || "Item"}</div>
        ${item.specs ? `<div class="rcpt-pdf-item-specs">${item.specs}</div>` : ""}
      </div>
      <div class="rcpt-pdf-td qty">×${item.quantity || item.qty || 1}</div>
      <div class="rcpt-pdf-td price">₹${((Number(item.price) || 0) * (Number(item.quantity || item.qty) || 1)).toFixed(0)}</div>
    </div>
  `).join("");

  const fullHtml = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <title>Receipt-${receiptData.orderId}</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@600;700;800;900&family=JetBrains+Mono:wght@500;600;700;800&family=Plus+Jakarta+Sans:wght@500;600;700;800&display=swap" rel="stylesheet">
  <style>
    @page {
      size: A4 portrait;
      margin: 0mm;
    }
    *, *::before, *::after {
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
      color-adjust: exact !important;
      box-sizing: border-box !important;
    }
    html, body {
      margin: 0 !important;
      padding: 0 !important;
      width: 210mm !important;
      height: 297mm !important;
      max-height: 297mm !important;
      background: #000000 !important;
      background-color: #000000 !important;
      color: #0b140e !important;
      overflow: hidden !important;
      font-family: 'Plus Jakarta Sans', sans-serif;
    }
    .rcpt-pdf-document {
      display: flex !important;
      flex-direction: column !important;
      justify-content: space-between !important;
      align-items: center !important;
      width: 210mm !important;
      height: 297mm !important;
      max-height: 297mm !important;
      margin: 0 !important;
      padding: 9mm 12mm 7mm !important;
      background: #000000 !important;
      background-color: #000000 !important;
      box-sizing: border-box !important;
      overflow: hidden !important;
    }
    .rcpt-pdf-frame {
      width: 100% !important;
      height: 100% !important;
      max-height: 100% !important;
      display: flex !important;
      flex-direction: column !important;
      justify-content: space-between !important;
      align-items: center !important;
      border: 1px solid rgba(82, 227, 137, 0.45) !important;
      outline: 1px solid rgba(218, 234, 212, 0.16) !important;
      outline-offset: -4px !important;
      padding: 7mm 7mm 5mm !important;
      box-sizing: border-box !important;
      position: relative !important;
    }
    .rcpt-pdf-card {
      width: 100% !important;
      max-width: 170mm !important;
      background: #daead4 !important;
      background-image: 
        radial-gradient(ellipse at 50% 12%, rgba(255, 255, 255, 0.45) 0%, rgba(218, 234, 212, 0.25) 55%, rgba(193, 214, 185, 0.45) 100%),
        linear-gradient(180deg, #daead4 0%, #d4e5ce 45%, #c5dec0 100%) !important;
      border: 1.8px solid #0f1c13 !important;
      outline: 1px solid rgba(15, 28, 19, 0.35) !important;
      outline-offset: -5px !important;
      padding: 16px 22px 14px !important;
      box-sizing: border-box !important;
      display: flex !important;
      flex-direction: column !important;
      gap: 10px !important;
    }
    .rcpt-pdf-head {
      display: flex !important;
      flex-direction: column !important;
      align-items: center !important;
      text-align: center !important;
      gap: 2px !important;
    }
    .rcpt-pdf-emblem-wrap {
      width: 44px !important;
      height: 44px !important;
      margin-bottom: 2px !important;
      display: flex !important;
      align-items: center !important;
      justify-content: center !important;
    }
    .rcpt-pdf-emblem-svg {
      width: 100% !important;
      height: 100% !important;
      display: block !important;
    }
    .rcpt-pdf-pretitle {
      font-family: 'Cinzel', serif !important;
      font-size: 8.5px !important;
      letter-spacing: 0.28em !important;
      color: #1a2a1f !important;
      font-weight: 700 !important;
    }
    .rcpt-pdf-title {
      font-family: 'Cinzel', serif !important;
      font-size: 20px !important;
      font-weight: 900 !important;
      letter-spacing: 0.12em !important;
      color: #0b140e !important;
      margin: 1px 0 !important;
      line-height: 1.15 !important;
    }
    .rcpt-pdf-subtitle {
      font-family: 'JetBrains Mono', monospace !important;
      font-size: 7.5px !important;
      letter-spacing: 0.22em !important;
      color: #2b4533 !important;
      font-weight: 600 !important;
      text-transform: uppercase !important;
    }
    .rcpt-pdf-divider-ornate {
      width: 100% !important;
      display: flex !important;
      align-items: center !important;
      justify-content: center !important;
      position: relative !important;
      margin: 3px 0 !important;
    }
    .rcpt-pdf-divider-ornate::before,
    .rcpt-pdf-divider-ornate::after {
      content: '' !important;
      flex: 1 !important;
      height: 1px !important;
      background: rgba(15, 28, 19, 0.4) !important;
    }
    .rcpt-pdf-ornate-diamond {
      padding: 0 8px !important;
      font-size: 8px !important;
      color: #1e452c !important;
    }
    .rcpt-pdf-meta-grid {
      display: grid !important;
      grid-template-columns: 1fr 1fr !important;
      gap: 7px 16px !important;
      padding: 7px 12px !important;
      background: rgba(15, 28, 19, 0.04) !important;
      border: 1px solid rgba(15, 28, 19, 0.18) !important;
      border-radius: 2px !important;
    }
    .rcpt-pdf-meta-cell {
      display: flex !important;
      flex-direction: column !important;
      gap: 2px !important;
    }
    .rcpt-pdf-meta-label {
      font-family: 'Cinzel', serif !important;
      font-size: 7.5px !important;
      letter-spacing: 0.18em !important;
      color: #2e4a36 !important;
      font-weight: 700 !important;
    }
    .rcpt-pdf-meta-val {
      font-family: 'Plus Jakarta Sans', sans-serif !important;
      font-size: 11px !important;
      font-weight: 800 !important;
      color: #0b140e !important;
    }
    .rcpt-pdf-meta-val.mono {
      font-family: 'JetBrains Mono', monospace !important;
      font-size: 9.5px !important;
      letter-spacing: 0.04em !important;
    }
    .rcpt-pdf-meta-val.status-badge {
      display: inline-block !important;
      font-family: 'JetBrains Mono', monospace !important;
      font-size: 8.5px !important;
      font-weight: 700 !important;
      letter-spacing: 0.1em !important;
      color: #0b140e !important;
      background: rgba(82, 227, 137, 0.35) !important;
      border: 1px solid rgba(15, 28, 19, 0.35) !important;
      padding: 2px 6px !important;
      border-radius: 2px !important;
      align-self: flex-start !important;
    }
    .rcpt-pdf-divider-dashed {
      border-top: 1px dashed rgba(15, 28, 19, 0.35) !important;
      margin: 1px 0 !important;
    }
    .rcpt-pdf-manifest {
      display: flex !important;
      flex-direction: column !important;
      gap: 5px !important;
    }
    .rcpt-pdf-table-head {
      display: flex !important;
      justify-content: space-between !important;
      padding-bottom: 3px !important;
      border-bottom: 1px solid rgba(15, 28, 19, 0.3) !important;
    }
    .rcpt-pdf-th {
      font-family: 'Cinzel', serif !important;
      font-size: 7.5px !important;
      letter-spacing: 0.16em !important;
      color: #2b4533 !important;
      font-weight: 800 !important;
    }
    .rcpt-pdf-th.desc { flex: 1 !important; text-align: left !important; }
    .rcpt-pdf-th.qty { width: 44px !important; text-align: center !important; }
    .rcpt-pdf-th.price { width: 68px !important; text-align: right !important; }
    .rcpt-pdf-table-body {
      display: flex !important;
      flex-direction: column !important;
      gap: 5px !important;
    }
    .rcpt-pdf-table-row {
      display: flex !important;
      justify-content: space-between !important;
      align-items: baseline !important;
      padding: 2px 0 !important;
      border-bottom: 1px dotted rgba(15, 28, 19, 0.18) !important;
    }
    .rcpt-pdf-td.desc { flex: 1 !important; text-align: left !important; }
    .rcpt-pdf-td.qty {
      width: 44px !important;
      text-align: center !important;
      font-family: 'JetBrains Mono', monospace !important;
      font-size: 9.5px !important;
      font-weight: 600 !important;
      color: #1a2a1f !important;
    }
    .rcpt-pdf-td.price {
      width: 68px !important;
      text-align: right !important;
      font-family: 'JetBrains Mono', monospace !important;
      font-size: 11.5px !important;
      font-weight: 800 !important;
      color: #0b140e !important;
    }
    .rcpt-pdf-item-name {
      font-family: 'Plus Jakarta Sans', sans-serif !important;
      font-size: 10.5px !important;
      font-weight: 800 !important;
      color: #0b140e !important;
    }
    .rcpt-pdf-item-specs {
      font-family: 'JetBrains Mono', monospace !important;
      font-size: 7.5px !important;
      color: #3b5742 !important;
      margin-top: 1px !important;
    }
    .rcpt-pdf-total-box {
      display: flex !important;
      justify-content: space-between !important;
      align-items: center !important;
      padding: 7px 12px !important;
      background: rgba(15, 28, 19, 0.08) !important;
      border: 1.5px solid #0f1c13 !important;
      box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.3) !important;
    }
    .rcpt-pdf-total-left {
      display: flex !important;
      flex-direction: column !important;
      gap: 1px !important;
    }
    .rcpt-pdf-total-label {
      font-family: 'Cinzel', serif !important;
      font-size: 9px !important;
      font-weight: 900 !important;
      letter-spacing: 0.18em !important;
      color: #0b140e !important;
    }
    .rcpt-pdf-total-sub {
      font-family: 'JetBrains Mono', monospace !important;
      font-size: 6.5px !important;
      letter-spacing: 0.14em !important;
      color: #315139 !important;
    }
    .rcpt-pdf-total-amount {
      font-family: 'Cinzel', serif !important;
      font-size: 19px !important;
      font-weight: 900 !important;
      letter-spacing: 0.06em !important;
      color: #0b140e !important;
    }
    .rcpt-pdf-barcode-section {
      display: flex !important;
      flex-direction: column !important;
      align-items: center !important;
      gap: 4px !important;
      padding-top: 5px !important;
      border-top: 1px dashed rgba(15, 28, 19, 0.35) !important;
    }
    .rcpt-pdf-barcode-svg {
      width: 72% !important;
      max-width: 250px !important;
      height: 32px !important;
      display: block !important;
      shape-rendering: crispEdges !important;
    }
    .rcpt-pdf-barcode-text {
      font-family: 'JetBrains Mono', monospace !important;
      font-size: 8px !important;
      font-weight: 700 !important;
      letter-spacing: 0.28em !important;
      color: #122116 !important;
    }
    .rcpt-pdf-card-stamp {
      font-family: 'Cinzel', serif !important;
      font-size: 6.5px !important;
      letter-spacing: 0.22em !important;
      color: #3b5742 !important;
      text-align: center !important;
      font-weight: 700 !important;
      text-transform: uppercase !important;
    }
    .rcpt-pdf-page-footer {
      width: 100% !important;
      display: flex !important;
      flex-direction: column !important;
      align-items: center !important;
      gap: 5px !important;
      margin-top: auto !important;
      padding-top: 6px !important;
    }
    .rcpt-pdf-footer-rule {
      width: 100% !important;
      height: 1px !important;
      background: linear-gradient(90deg, transparent, rgba(82, 227, 137, 0.45) 20%, rgba(82, 227, 137, 0.45) 80%, transparent) !important;
    }
    .rcpt-pdf-footer-row {
      width: 100% !important;
      display: flex !important;
      justify-content: space-between !important;
      align-items: center !important;
      font-family: 'Cinzel', serif !important;
      font-size: 7px !important;
      letter-spacing: 0.2em !important;
      color: rgba(218, 234, 212, 0.7) !important;
      text-transform: uppercase !important;
    }
  </style>
</head>
<body>
  <div class="rcpt-pdf-document">
    <div class="rcpt-pdf-frame">
      <div class="rcpt-pdf-card">
        <div class="rcpt-pdf-head">
          <div class="rcpt-pdf-emblem-wrap">
            <svg class="rcpt-pdf-emblem-svg" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="40" cy="40" r="37" stroke="#0e1a12" stroke-width="1.5" stroke-dasharray="3 2" />
              <circle cx="40" cy="40" r="33" stroke="#0e1a12" stroke-width="0.8" />
              <circle cx="40" cy="40" r="30" stroke="rgba(35, 133, 75, 0.4)" stroke-width="0.5" />
              <path d="M40 18 C35 24 33 30 33 36 C33 39 34 41 36 43 C30 43 25 46 23 51 C29 50 34 50 38 52 C37 55 35 59 33 63 C37 60 41 57 44 57 C42 61 41 64 40 68 C46 62 51 56 54 49 C56 49 58 49 60 48 C58 47 57 46 55 45 C57 41 57 34 52 27 C48 22 44 19 40 18 Z" fill="#0e1a12" />
              <circle cx="43" cy="28" r="1.8" fill="#52e389" />
              <path d="M40 8.2 L41.1 12 L44.5 13 L41.1 14 L40 17.5 L38.9 14 L35.5 13 L38.9 12 Z" fill="#23854b" />
            </svg>
          </div>
          <span class="rcpt-pdf-pretitle">— THE RAVEN ARCHIVES • EST. 2026 —</span>
          <h1 class="rcpt-pdf-title">SUPPLY ORDER RECEIPT</h1>
          <span class="rcpt-pdf-subtitle">AUTHENTICATED CAMPUS SCRIPTORIUM DISPATCH RECORD</span>
          <div class="rcpt-pdf-divider-ornate">
            <span class="rcpt-pdf-ornate-diamond">❖</span>
          </div>
        </div>

        <div class="rcpt-pdf-meta-grid">
          <div class="rcpt-pdf-meta-cell">
            <span class="rcpt-pdf-meta-label">ORDER REFERENCE</span>
            <span class="rcpt-pdf-meta-val mono">${receiptData.orderId}</span>
          </div>
          <div class="rcpt-pdf-meta-cell">
            <span class="rcpt-pdf-meta-label">DISPATCH STATUS</span>
            <span class="rcpt-pdf-meta-val status-badge">${receiptData.status}</span>
          </div>
          <div class="rcpt-pdf-meta-cell">
            <span class="rcpt-pdf-meta-label">COLLECTION POINT</span>
            <span class="rcpt-pdf-meta-val">${receiptData.pickupCounter}</span>
          </div>
          <div class="rcpt-pdf-meta-cell">
            <span class="rcpt-pdf-meta-label">RECORDED AT</span>
            <span class="rcpt-pdf-meta-val">${receiptData.date}</span>
          </div>
        </div>

        <div class="rcpt-pdf-divider-dashed"></div>

        <div class="rcpt-pdf-manifest">
          <div class="rcpt-pdf-table-head">
            <span class="rcpt-pdf-th desc">ITEM DESCRIPTION</span>
            <span class="rcpt-pdf-th qty">QTY</span>
            <span class="rcpt-pdf-th price">AMOUNT</span>
          </div>
          <div class="rcpt-pdf-table-body">
            ${itemsHtml}
          </div>
        </div>

        <div class="rcpt-pdf-total-box">
          <div class="rcpt-pdf-total-left">
            <span class="rcpt-pdf-total-label">TOTAL OFFERING PAID</span>
            <span class="rcpt-pdf-total-sub">OFFICIALLY TENDERED & SETTLED</span>
          </div>
          <span class="rcpt-pdf-total-amount">₹${receiptData.total}</span>
        </div>

        <div class="rcpt-pdf-barcode-section">
          <svg viewBox="0 0 ${totalWidth} 32" preserveAspectRatio="none" class="rcpt-pdf-barcode-svg">
            ${barcodeBarsHtml}
          </svg>
          <span class="rcpt-pdf-barcode-text">* ${codeString} *</span>
        </div>

        <div class="rcpt-pdf-card-stamp">
          ODYSSEY SCRIPTORIUM • ARCHIVAL DISPATCH VERIFICATION SEAL
        </div>
      </div>

      <div class="rcpt-pdf-page-footer">
        <div class="rcpt-pdf-footer-rule"></div>
        <div class="rcpt-pdf-footer-row">
          <span>ODYSSEY CAMPUS PRINT ARCHIVES</span>
          <span>FOLIO 1 OF 1</span>
          <span>RECORD REF: ${receiptData.orderId}</span>
        </div>
      </div>
    </div>
  </div>
</body>
</html>`;

  // Hidden print iframe to trigger immediate browser PDF / Print
  const iframe = document.createElement("iframe");
  iframe.style.position = "fixed";
  iframe.style.top = "-9999px";
  iframe.style.left = "-9999px";
  iframe.style.width = "0";
  iframe.style.height = "0";
  iframe.style.border = "none";
  document.body.appendChild(iframe);

  const doc = iframe.contentWindow.document;
  doc.open();
  doc.write(fullHtml);
  doc.close();

  setTimeout(() => {
    try {
      iframe.contentWindow.focus();
      iframe.contentWindow.print();
    } catch (e) {
      console.warn("Direct iframe print failed, falling back to popup window:", e);
      const printWindow = window.open("", "_blank");
      if (printWindow) {
        printWindow.document.write(fullHtml);
        printWindow.document.close();
        printWindow.focus();
        printWindow.print();
      }
    }

    setTimeout(() => {
      if (document.body.contains(iframe)) {
        document.body.removeChild(iframe);
      }
    }, 2500);
  }, 350);
}

