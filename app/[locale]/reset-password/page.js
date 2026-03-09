'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation'; // Use standard hook for params
import { useRouter as useNavRouter } from '@/lib/navigation'; // Use our wrapper for push
import Link from 'next/link';

export default function ResetPasswordPage() {
    const router = useNavRouter();
    const searchParams = useSearchParams();

    const [email, setEmail] = useState('');
    const [code, setCode] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    useEffect(() => {
        const emailParam = searchParams.get('email');
        const codeParam = searchParams.get('code');
        if (emailParam) setEmail(emailParam);
        if (codeParam) setCode(codeParam);
    }, [searchParams]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const res = await fetch('/api/auth/reset-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, code, newPassword })
            });
            const data = await res.json();

            if (data.success) {
                setSuccess(true);
                setTimeout(() => {
                    router.push('/login');
                }, 3000);
            } else {
                setError(data.error || 'Failed to reset password.');
            }
        } catch (err) {
            setError('An error occurred. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div style={{ maxWidth: '400px', margin: '4rem auto', padding: '2rem', textAlign: 'center' }}>
                <h1 style={{ color: 'var(--color-accent)', marginBottom: '1rem' }}>Password Changed!</h1>
                <p>Your password has been updated successfully.</p>
                <p>Redirecting to login...</p>
                <p style={{ marginTop: '20px' }}>
                    <Link href="/login" style={{ color: 'var(--color-accent)' }}>Click here if you are not redirected</Link>
                </p>
            </div>
        );
    }

    return (
        <div style={{ maxWidth: '400px', margin: '4rem auto', padding: '2rem', textAlign: 'center' }}>
            <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '2rem', marginBottom: '1rem' }}>Reset Password</h1>
            <p style={{ color: '#888', marginBottom: '2rem' }}>Enter the code sent to {email}</p>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <input
                    type="email"
                    placeholder="Email Address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    style={{
                        padding: '12px',
                        background: 'rgba(255,255,255,0.05)',
                        border: '1px solid var(--color-border)',
                        color: '#fff'
                    }}
                />
                <input
                    type="text"
                    placeholder="Verification Code (6-digits)"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    required
                    style={{
                        padding: '12px',
                        background: 'rgba(255,255,255,0.05)',
                        border: '1px solid var(--color-border)',
                        color: '#fff',
                        letterSpacing: '2px'
                    }}
                />
                <div style={{ position: 'relative' }}>
                    <input
                        type={showPassword ? "text" : "password"}
                        placeholder="New Password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        required
                        style={{
                            width: '100%',
                            padding: '12px',
                            background: 'rgba(255,255,255,0.05)',
                            border: '1px solid var(--color-border)',
                            color: '#fff'
                        }}
                    />
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        style={{
                            position: 'absolute',
                            right: '10px',
                            top: '50%',
                            transform: 'translateY(-50%)',
                            background: 'none',
                            border: 'none',
                            color: '#888',
                            cursor: 'pointer'
                        }}
                    >
                        {showPassword ? 'Hide' : 'Show'}
                    </button>
                </div>

                {error && <p style={{ color: 'red', fontSize: '0.9rem' }}>{error}</p>}

                <button
                    type="submit"
                    disabled={loading}
                    className="btn btn-primary"
                    style={{ padding: '12px', cursor: 'pointer' }}
                >
                    {loading ? 'Resetting...' : 'Set New Password'}
                </button>
            </form>
        </div>
    );
}
