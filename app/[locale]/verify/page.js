'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

export default function VerifyPage() {
    const [code, setCode] = useState('');
    const [status, setStatus] = useState('idle'); // idle, verifying, success, error
    const [message, setMessage] = useState('');
    const searchParams = useSearchParams();
    const router = useRouter();
    const { login } = useAuth(); // We might need to auto-login, but server handles verification

    useEffect(() => {
        const token = searchParams.get('token');
        const email = searchParams.get('email'); // Optional context

        if (token) {
            // Auto Verify via Magic Link
            handleVerify(token);
        }
    }, [searchParams]);

    const handleVerify = async (tokenToVerify) => {
        setStatus('verifying');
        setMessage('');

        try {
            const res = await fetch('/api/auth/verify', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ token: tokenToVerify })
            });
            const data = await res.json();

            if (data.success) {
                setStatus('success');
                setMessage('Verification successful! You can now access your account.');

                // Auto Login
                if (data.user) {
                    localStorage.setItem('cigar_user_email', data.user.email);
                    // Force a reload or redirect to account which will pick up the session
                    setTimeout(() => {
                        window.location.href = '/account';
                    }, 1000);
                } else {
                    setTimeout(() => {
                        router.push('/login');
                    }, 2000);
                }
            } else {
                setStatus('error');
                setMessage(data.error || 'Verification failed');
            }
        } catch (e) {
            setStatus('error');
            setMessage('An error occurred. Please try again.');
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        handleVerify(code);
    };

    return (
        <div className="container" style={{ maxWidth: '400px', margin: '6rem auto', padding: '2rem', textAlign: 'center', background: 'var(--color-bg-secondary)', border: '1px solid var(--color-border)' }}>
            <h1 style={{ marginBottom: '1.5rem' }}>Verify Account</h1>

            {status === 'verifying' && <p>Verifying...</p>}

            {status === 'success' && (
                <div style={{ color: 'green', marginBottom: '1rem' }}>
                    <p>✅ {message}</p>
                    <p style={{ fontSize: '0.9rem', color: '#aaa' }}>Redirecting...</p>
                </div>
            )}

            {status === 'error' && (
                <div style={{ color: 'red', marginBottom: '1rem' }}>
                    <p>❌ {message}</p>
                </div>
            )}

            {(status === 'idle' || status === 'error') && (
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <p style={{ fontSize: '0.9rem', color: '#ccc' }}>
                        Please enter the 6-digit code sent to your email.
                    </p>
                    <input
                        type="text"
                        placeholder="Enter 6-digit code"
                        value={code}
                        onChange={(e) => setCode(e.target.value)}
                        style={{ padding: '1rem', textAlign: 'center', fontSize: '1.2rem', letterSpacing: '0.5rem', background: 'var(--color-bg)', border: '1px solid var(--color-border)', color: '#fff' }}
                        maxLength={6}
                        required
                    />
                    <button className="btn" type="submit">Verify</button>
                </form>
            )}
        </div>
    );
}
