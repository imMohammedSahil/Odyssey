import React from "react";
import { useCart } from "../context/CartContext";

export default function TestCart() {
  const { cartItems, addToCart } = useCart();

  return (
    <div style={{ padding: 20 }}>
      <h2>Cart Test</h2>

      <button onClick={() => addToCart({ name: "Blue Pen", quantity: 1 })}>
        Add Blue Pen
      </button>

      <button onClick={() => addToCart({ name: "Red Pen", quantity: 2 })}>
        Add Red Pen
      </button>

      <h3>Cart Items:</h3>
      {cartItems.map(item => (
        <p key={item.name}>
          {item.name} — {item.quantity}
        </p>
      ))}
    </div>
  );
}