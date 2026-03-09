'use client';

import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkSession = async () => {
            const storedEmail = localStorage.getItem('cigar_user_email');
            if (storedEmail) {
                try {
                    const res = await fetch(`/api/auth/me?email=${encodeURIComponent(storedEmail)}`);
                    const data = await res.json();
                    if (data.user) {
                        setUser(data.user);
                    } else {
                        localStorage.removeItem('cigar_user_email'); // Invalid session
                    }
                } catch (e) {
                    console.error("Session check failed", e);
                }
            }
            setLoading(false);
        };
        checkSession();
    }, []);

    const login = async (email, password) => {
        try {
            const res = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });
            const data = await res.json();

            if (data.success) {
                setUser(data.user);
                localStorage.setItem('cigar_user_email', data.user.email); // Persist simplified session
                return { success: true };
            }
            return { success: false, error: data.error };
        } catch (error) {
            return { success: false, error: 'Login failed' };
        }
    };

    const register = async (name, email, password, dob) => {
        try {
            const res = await fetch('/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, password, dob })
            });
            const data = await res.json();

            if (data.success) {
                // Auto login or ask to verify? 
                // For now, let's just return success and ask them to verify
                return { success: true, message: 'Please verify your email.' };
            }
            return { success: false, error: data.error };
        } catch (error) {
            return { success: false, error: 'Registration failed' };
        }
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('cigar_user_email');
        localStorage.removeItem('cigar_user'); // Cleanup old key
    };

    return (
        <AuthContext.Provider value={{ user, login, register, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);
