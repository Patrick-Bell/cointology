import { createContext, useContext, useEffect, useState } from 'react';

// Create the Cart Context
const CartContext = createContext();

// Cart Provider component
export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState(() => {
        // Initialize from local storage
        const savedCartItems = localStorage.getItem('cartItems');
        return savedCartItems ? JSON.parse(savedCartItems) : [];
    });

    // Load cart items from local storage on mount
    useEffect(() => {
        const storedCart = JSON.parse(localStorage.getItem('cartItems')) || [];
        setCartItems(storedCart);
    }, []);

    // Function to add item to cart
    const addItemToCart = (item) => {
        // Get current cart items from local storage or default to an empty array
        const existingCart = JSON.parse(localStorage.getItem('cartItems')) || [];

        console.log('item in question', item, 'id', item.id)
    
        const existingItemIndex = existingCart.findIndex(cartItem => cartItem.id === item.id);
    
        if (existingItemIndex > -1) {
            // Update quantity and total if item exists
            existingCart[existingItemIndex].quantity += item.quantity;
            existingCart[existingItemIndex].item_total = existingCart[existingItemIndex].price * existingCart[existingItemIndex].quantity;
        } else {
            // Add new item to cart
            item.item_total = item.price * item.quantity; // Calculate total
            existingCart.push(item);
        }
    
        // Update cartItems state and local storage
        setCartItems(existingCart);
        localStorage.setItem('cartItems', JSON.stringify(existingCart)); // Save to local storage
    };
    
    
    // Function to remove item from cart
    const removeItemFromCart = (itemId) => {
        const updatedCart = cartItems.filter(cartItem => cartItem.id !== itemId);
        setCartItems(updatedCart);
        localStorage.setItem('cartItems', JSON.stringify(updatedCart)); // Save to local storage
    };

    // Function to checkout
    const checkout = () => {
        if (cartItems.length === 0) {
            alert("Your cart is empty!");
            return;
        }

        // Process the checkout logic here
        console.log("Proceeding to checkout with items:", cartItems);
        
        // Clear cart after checkout
        setCartItems([]);
        localStorage.removeItem('cartItems');
    };

    // Provide context values
    return (
        <CartContext.Provider value={{ cartItems, addItemToCart, removeItemFromCart, checkout }}>
            {children}
        </CartContext.Provider>
    );
};

// Custom hook to use the Cart Context
export const useCart = () => {
    return useContext(CartContext);
};
