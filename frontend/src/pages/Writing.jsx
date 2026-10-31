import React, { useState } from "react";
import { useCart } from "../context/CartContext";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=DM+Mono:wght@400;500&display=swap');
  
  .writing-root select,
.writing-root input {
  background-color: #1a1a24 !important;
  color: #d0d0e0 !important;
  border-color: rgba(255,255,255,0.09) !important;
}

.writing-root select {
  color-scheme: dark;
}

  /* ===== Prevent global overrides ===== */
  .writing-root,
  .writing-root * {
    box-sizing: border-box;
  }

  .writing-root select,
  .writing-root input,
  .writing-root button {
    font-family: inherit;
    background-clip: padding-box;
  }

  /* Force dark form controls */
  .writing-root select,
  .writing-root input {
    color-scheme: dark;
  }

  .writing-root {
    min-height: 100vh;
    background: #0c0c10;
    display: flex;
    align-items: flex-start;
    justify-content: center;
    padding: 48px 16px;
    font-family: 'DM Sans', sans-serif;
  }

  .writing-card {
    width: 100%;
    max-width: 460px;
    background: #13131a;
    border: 1px solid rgba(255,255,255,0.07);
    border-radius: 20px;
    padding: 36px;
    box-shadow: 0 0 0 1px rgba(255,255,255,0.03), 0 24px 64px rgba(0,0,0,0.6);
  }

  .writing-header {
    margin-bottom: 32px;
  }

  .writing-eyebrow {
    font-family: 'DM Mono', monospace;
    font-size: 10px;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    color: #7c6fcd;
    margin: 0 0 8px 0;
  }

  .writing-title {
    font-size: 22px;
    font-weight: 600;
    color: #e8e8f0;
    margin: 0;
    letter-spacing: -0.3px;
  }

  .field-group {
    margin-bottom: 20px;
  }

  .writing-root .field-label {
    display: block;
    font-size: 11px;
    font-weight: 500;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: #666680;
    margin-bottom: 8px;
  }

  .writing-root .field-select {
    width: 100%;
    background: #1a1a24;
    border: 1px solid rgba(255,255,255,0.09);
    border-radius: 10px;
    color: #d0d0e0;
    font-family: 'DM Sans', sans-serif;
    font-size: 14px;
    padding: 11px 14px;
    outline: none;
    cursor: pointer;
    appearance: none;
    -webkit-appearance: none;
    color-scheme: dark;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23666680' d='M6 8L1 3h10z'/%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: right 14px center;
    transition: border-color 0.2s, background-color 0.2s;
  }

  .field-select:hover {
    border-color: rgba(124, 111, 205, 0.4);
    background-color: #1e1e2a;
  }

  .field-select:focus {
    border-color: rgba(124, 111, 205, 0.7);
    box-shadow: 0 0 0 3px rgba(124, 111, 205, 0.12);
  }

  /* Prevent white flash on Windows & Chromium */
  .field-select:focus,
  .field-select:active {
    background-color: #1a1a24;
  }

  .field-select option {
    background: #1a1a24;
    color: #d0d0e0;
  }

  .fields-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 12px;
  }

  .qty-group {
    margin-bottom: 24px;
  }

  .writing-root .qty-controls {
    display: flex;
    align-items: center;
    background: #1a1a24;
    border: 1px solid rgba(255,255,255,0.09);
    border-radius: 10px;
    overflow: hidden;
    width: fit-content;
  }

  .writing-root .qty-btn {
    background: transparent;
    border: none;
    color: #7c6fcd;
    font-size: 18px;
    width: 40px;
    height: 40px;
    cursor: pointer;
  }

  .qty-btn:hover {
    background: rgba(124, 111, 205, 0.15);
  }

  .writing-root .qty-display {
    font-family: 'DM Mono', monospace;
    font-size: 14px;
    color: #e0e0ee;
    min-width: 40px;
    text-align: center;
    border-left: 1px solid rgba(255,255,255,0.07);
    border-right: 1px solid rgba(255,255,255,0.07);
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .divider {
    height: 1px;
    background: rgba(255,255,255,0.06);
    margin: 24px 0;
  }

  .writing-root .total-row {
    display: flex;
    justify-content: space-between;
    margin-bottom: 20px;
  }

  .total-label {
    font-size: 12px;
    color: #555570;
    text-transform: uppercase;
  }

  .total-amount {
    font-family: 'DM Mono', monospace;
    font-size: 24px;
    color: #e8e8f0;
  }

  .total-currency {
    font-size: 14px;
    color: #7c6fcd;
    margin-right: 2px;
  }

  .writing-root .add-btn {
    width: 100%;
    background: #7c6fcd;
    border: none;
    border-radius: 10px;
    color: #fff;
    font-weight: 600;
    padding: 13px 20px;
    cursor: pointer;
    box-shadow: 0 4px 16px rgba(124, 111, 205, 0.25);
  }

  .add-btn:hover {
    background: #8f83d8;
  }

  .toast {
    margin-top: 14px;
    padding: 10px 14px;
    border-radius: 8px;
    font-size: 13px;
    text-align: center;
  }

  .toast-success {
    background: rgba(52,199,89,0.1);
    border: 1px solid rgba(52,199,89,0.2);
    color: #4cd964;
  }

  .toast-error {
    background: rgba(255,69,58,0.1);
    border: 1px solid rgba(255,69,58,0.2);
    color: #ff6b6b;
  }
`;

function Writing() {
  const { addToCart } = useCart();

  const [category, setCategory] = useState("");
  const [penType, setPenType] = useState("");
  const [color, setColor] = useState("");
  const [pencilType, setPencilType] = useState("");
  const [mechSize, setMechSize] = useState("");
  const [qty, setQty] = useState(1);
  const [message, setMessage] = useState("");

  const showMsg = (msg) => {
    setMessage(msg);
    setTimeout(() => setMessage(""), 2000);
  };

  let name = "";
  let price = 0;

  if (category === "pen" && penType && color) {
    name = `${penType} Pen (${color})`;
    price = 10;
  }

  if (category === "pencil" && pencilType) {
    name = `${pencilType} Pencil`;
    price = 10;
  }

  if (category === "mechanical" && mechSize) {
    name = `Mechanical Pencil (${mechSize})`;
    price = 50;
  }

  const handleAdd = () => {
    if (!name) return showMsg("Complete selection");
    addToCart({ name, price, quantity: qty });
    showMsg(`${name} added`);
    setCategory("");
    setPenType("");
    setColor("");
    setPencilType("");
    setMechSize("");
    setQty(1);
  };

  const isSuccess = message && message !== "Complete selection";

  return (
    <>
      <style>{styles}</style>
      <div className="writing-root">
        <div className="writing-card">
          <div className="writing-header">
            <p className="writing-eyebrow">Stationery</p>
            <h2 className="writing-title" style={{color:"red", fontSize:"40px"}}>
</h2>
          </div>

          <div className="field-group">
            <label className="field-label">Category</label>
            <select className="field-select" value={category} onChange={(e)=>{
              setCategory(e.target.value);
              setPenType("");
              setColor("");
              setPencilType("");
              setMechSize("");
            }}>
              <option value="">Choose a category</option>
              <option value="pen">Pen</option>
              <option value="pencil">Pencil</option>
              <option value="mechanical">Mechanical Pencil</option>
            </select>
          </div>

          {category === "pen" && (
  <div className="fields-row">
    <div className="field-group">
      <label className="field-label">Pen Type</label>
      <select className="field-select" value={penType} onChange={(e)=>setPenType(e.target.value)}>
        <option value="">Select type</option>
        <option>Ball</option>
        <option>Gel</option>
      </select>
    </div>

    <div className="field-group">
      <label className="field-label">Ink Color</label>
      <select className="field-select" value={color} onChange={(e)=>setColor(e.target.value)}>
        <option value="">Select color</option>
        <option>Blue</option>
        <option>Black</option>
        <option>Red</option>
        <option>Green</option>
      </select>
    </div>
  </div>
)}

{category === "pencil" && (
  <div className="field-group">
    <label className="field-label">Grade</label>
    <select className="field-select" value={pencilType} onChange={(e)=>setPencilType(e.target.value)}>
      <option value="">Select grade</option>
      <option>Normal</option>
      <option>HB</option>
      <option>2B</option>
    </select>
  </div>
)}

{category === "mechanical" && (
  <div className="field-group">
    <label className="field-label">Lead Size</label>
    <select className="field-select" value={mechSize} onChange={(e)=>setMechSize(e.target.value)}>
      <option value="">Select size</option>
      <option>0.5 mm</option>
      <option>0.7 mm</option>
    </select>
  </div>
)}

          {category && (
            <div className="qty-group">
              <label className="field-label">Quantity</label>
              <div className="qty-controls">
                <button className="qty-btn" onClick={()=>setQty(Math.max(1,qty-1))}>−</button>
                <div className="qty-display">{qty}</div>
                <button className="qty-btn" onClick={()=>setQty(qty+1)}>+</button>
              </div>
            </div>
          )}

          <div className="divider" />

          <div className="total-row">
            <span className="total-label">Total</span>
            <span className="total-amount"><span className="total-currency">₹</span>{price*qty}</span>
          </div>

          <button className="add-btn" onClick={handleAdd}>Add to Cart</button>

          {message && (
            <div className={`toast ${isSuccess ? "toast-success":"toast-error"}`}>
              {message}
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default Writing;