"use client";

import { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export function CartProvider({ children }) {
    const [cart, setCart] = useState([]);

    // Load cart from local storage on mount
    useEffect(() => {
        const savedCart = localStorage.getItem('cart');
        if (savedCart) {
            setCart(JSON.parse(savedCart));
        }
    }, []);

    // Save cart to local storage whenever it changes
    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(cart));
    }, [cart]);

    const addToCart = (product) => {
        setCart((prevCart) => {
            const existingItem = prevCart.find((item) => item.id === product.id && item.size === (product.size || "Small"));
            if (existingItem) {
                return prevCart.map((item) =>
                    item.id === product.id && item.size === existingItem.size
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                );
            }
            return [...prevCart, { ...product, quantity: 1, size: product.size || "Small" }];
        });
    };

    const removeFromCart = (productId, size) => {
        setCart((prevCart) => prevCart.filter((item) => !(item.id === productId && item.size === size)));
    };

    const updateQuantity = (productId, size, quantity) => {
        if (quantity < 1) return;
        setCart((prevCart) =>
            prevCart.map((item) =>
                item.id === productId && item.size === size ? { ...item, quantity } : item
            )
        );
    };

    const updateSize = (productId, oldSize, newSize) => {
        setCart((prevCart) =>
            prevCart.map((item) =>
                item.id === productId && item.size === oldSize
                    ? { ...item, size: newSize }
                    : item
            )
        );
    };

    const clearCart = () => {
        setCart([]);
    };

    const cartTotal = cart.reduce((total, item) => {
        const price = item.size === "Large" ? (item.largePrice || item.price + 10) : item.price;
        return total + price * item.quantity;
    }, 0);

    const cartCount = cart.reduce((count, item) => count + item.quantity, 0);

    return (
        <CartContext.Provider
            value={{
                cart,
                addToCart,
                removeFromCart,
                updateQuantity,
                updateSize,
                clearCart,
                cartTotal,
                cartCount,
            }}
        >
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    return useContext(CartContext);
}
