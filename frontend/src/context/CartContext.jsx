import { createContext, useContext, useMemo, useState } from 'react';

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [items, setItems] = useState([]);

  const addItem = (item) => {
    setItems((prev) => {
      const exists = prev.find((i) => i.itemId === item.itemId && i.itemType === item.itemType);
      if (exists) return prev;
      return [...prev, item];
    });
  };

  const removeItem = (itemId, itemType) => {
    setItems((prev) => prev.filter((i) => !(i.itemId === itemId && i.itemType === itemType)));
  };

  const clearCart = () => setItems([]);

  const total = useMemo(() => items.reduce((sum, item) => sum + item.price, 0), [items]);

  const value = useMemo(
    () => ({ items, addItem, removeItem, clearCart, total, count: items.length }),
    [items, total]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export const useCart = () => useContext(CartContext);
