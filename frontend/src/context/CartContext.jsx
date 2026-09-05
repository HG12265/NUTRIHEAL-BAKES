import React, { createContext, useContext, useState, useEffect } from 'react';
import { useToast } from './ToastContext';

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const [items, setItems] = useState(() => {
    try {
      const savedCart = localStorage.getItem('nutriheal_cart');
      return savedCart ? JSON.parse(savedCart) : [];
    } catch {
      return [];
    }
  });

  const { addToast } = useToast();

  useEffect(() => {
    localStorage.setItem('nutriheal_cart', JSON.stringify(items));
  }, [items]);

  const addToCart = (product, quantity = 1) => {
    if (!product.availability) {
      addToast(`"${product.name}" is currently out of stock`, 'error');
      return false;
    }

    setItems((prevItems) => {
      const existingIndex = prevItems.findIndex(
        (item) => item.product === product._id
      );

      if (existingIndex > -1) {
        const updated = [...prevItems];
        updated[existingIndex].quantity += quantity;
        return updated;
      } else {
        return [
          ...prevItems,
          {
            product: product._id,
            name: product.name,
            price: product.price,
            image: product.image,
            category: product.category,
            quantity: quantity,
          },
        ];
      }
    });

    addToast(`Added "${product.name}" to cart!`, 'success');
    return true;
  };

  const updateQuantity = (productId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }

    setItems((prevItems) =>
      prevItems.map((item) =>
        item.product === productId ? { ...item, quantity } : item
      )
    );
  };

  const removeFromCart = (productId) => {
    const itemToRemove = items.find((item) => item.product === productId);
    if (itemToRemove) {
      addToast(`Removed "${itemToRemove.name}" from cart`, 'info');
    }
    setItems((prevItems) => prevItems.filter((item) => item.product !== productId));
  };

  const clearCart = () => {
    setItems([]);
    localStorage.removeItem('nutriheal_cart');
  };

  const subtotal = items.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  // Delivery policy: Free for orders >= ₹500, else ₹40
  const deliveryFee = items.length === 0 ? 0 : subtotal >= 500 ? 0 : 40;
  const totalAmount = subtotal + deliveryFee;
  const totalItems = items.reduce((acc, item) => acc + item.quantity, 0);

  const value = {
    items,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    subtotal,
    deliveryFee,
    totalAmount,
    totalItems,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
