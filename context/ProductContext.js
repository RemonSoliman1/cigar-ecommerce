'use client';

import { createContext, useContext, useState, useEffect } from 'react';

const ProductContext = createContext();

export function ProductProvider({ children }) {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchProducts = async () => {
        try {
            setLoading(true);
            const res = await fetch(`/api/products?t=${Date.now()}`, { cache: 'no-store' });
            const data = await res.json();

            if (data.error) throw new Error(data.error);

            setProducts(data);
        } catch (err) {
            console.error('Failed to load products:', err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    const refreshProducts = () => {
        fetchProducts();
    };

    return (
        <ProductContext.Provider value={{ products, loading, error, refreshProducts }}>
            {children}
        </ProductContext.Provider>
    );
}

export const useProducts = () => useContext(ProductContext);
