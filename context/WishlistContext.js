'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

const WishlistContext = createContext();

export function WishlistProvider({ children }) {
    const [wishlist, setWishlist] = useState([]);

    const { user } = useAuth(); // Use the hook instead of Context directly

    // Load from local storage
    useEffect(() => {
        if (user) {
            const stored = localStorage.getItem(`wishlist_${user.email}`);
            if (stored) {
                setWishlist(JSON.parse(stored));
            } else {
                setWishlist([]); // Clear if no wishlist for this user
            }
        } else {
            setWishlist([]); // Clear if no user
        }
    }, [user]);

    // Save to local storage whenever wishlist changes
    useEffect(() => {
        if (user) {
            localStorage.setItem(`wishlist_${user.email}`, JSON.stringify(wishlist));
        }
    }, [wishlist, user]);

    const addToWishlist = (product) => {
        setWishlist((prev) => {
            if (prev.find(item => item.id === product.id)) return prev;
            return [...prev, product];
        });
    };

    const removeFromWishlist = (productId) => {
        setWishlist((prev) => prev.filter(item => item.id !== productId));
    };

    const isInWishlist = (productId) => {
        return wishlist.some(item => item.id === productId);
    };

    const toggleWishlist = (product) => {
        if (isInWishlist(product.id)) {
            removeFromWishlist(product.id);
        } else {
            addToWishlist(product);
        }
    };

    return (
        <WishlistContext.Provider value={{ wishlist, addToWishlist, removeFromWishlist, isInWishlist, toggleWishlist }}>
            {children}
        </WishlistContext.Provider>
    );
}

export function useWishlist() {
    return useContext(WishlistContext);
}
