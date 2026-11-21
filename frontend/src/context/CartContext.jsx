import { createContext, useContext, useState, useEffect } from "react";

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  // Initialize cart from localStorage so items persist on refresh
  const [cartItems, setCartItems] = useState(() => {
    try {
      const stored = localStorage.getItem("odysseyCart") || localStorage.getItem("cart");
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch (e) {
      console.warn("Could not load cart from storage:", e);
    }
    return [];
  });

  // Sync state changes to localStorage
  useEffect(() => {
    try {
      localStorage.setItem("odysseyCart", JSON.stringify(cartItems));
    } catch (e) {
      console.warn("Could not save cart to storage:", e);
    }
  }, [cartItems]);

  // Listen for storage events across tabs
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === "odysseyCart") {
        try {
          const updated = JSON.parse(e.newValue || "[]");
          if (Array.isArray(updated)) {
            setCartItems(updated);
          }
        } catch (err) {
          console.warn("Could not parse updated cart from storage event:", err);
        }
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  // Compute total
  const getCartTotal = () =>
    cartItems.reduce(
      (sum, item) => sum + (Number(item.price) || 0) * (Number(item.quantity) || 1),
      0
    );

  // ➕ Add item to cart
  const addToCart = (item) => {
    const qtyToAdd = Number(item.quantity) || 1; // ensure number

    setCartItems((prev) => {
      const existing = prev.find((i) => i.name === item.name);

      if (existing) {
        return prev.map((i) =>
          i.name === item.name
            ? { ...i, quantity: Number(i.quantity) + qtyToAdd }
            : i
        );
      }

      return [...prev, { ...item, quantity: qtyToAdd }];
    });
  };

  // ❌ remove item
  const removeFromCart = (index) => {
    setCartItems((prev) => prev.filter((_, i) => i !== index));
  };

  // 🔄 update quantity
  const updateQuantity = (index, quantity) => {
    const qty = Math.max(1, Number(quantity) || 1);

    setCartItems((prev) =>
      prev.map((item, i) =>
        i === index
          ? { ...item, quantity: qty, copies: qty }
          : item
      )
    );
  };

  // 🧹 clear cart
  const clearCart = () => {
    setCartItems([]);
    try {
      localStorage.removeItem("odysseyCart");
      localStorage.removeItem("cart");
    } catch (e) {
      console.warn("Could not clear cart in storage:", e);
    }
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getCartTotal,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
