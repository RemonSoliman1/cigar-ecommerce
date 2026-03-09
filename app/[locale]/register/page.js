'use client';

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter, Link } from '@/lib/navigation';

export default function RegisterPage() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [dob, setDob] = useState('');
    const [error, setError] = useState('');
    const { register } = useAuth();
    const router = useRouter();

    const calculateAge = (birthDate) => {
        const today = new Date();
        const birthDateObj = new Date(birthDate);
        let age = today.getFullYear() - birthDateObj.getFullYear();
        const m = today.getMonth() - birthDateObj.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birthDateObj.getDate())) {
            age--;
        }
        return age;
    };

    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        if (!dob) {
            setError("Date of birth is required.");
            setLoading(false);
            return;
        }

        if (password !== confirmPassword) {
            setError("Passwords do not match.");
            setLoading(false);
            return;
        }

        const age = calculateAge(dob);
        if (age < 18) {
            setError("You must be at least 18 years old to account.");
            setLoading(false);
            return;
        }

        const res = await register(name, email, password, dob);

        if (res.success) {
            // 1. Sync to Supabase for Order History support
            await fetch('/api/auth/sync-user', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, dob })
            }).catch(console.error);

            // 2. Send Welcome Email
            await fetch('/api/emails/welcome', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email })
            }).catch(console.error);

            // Redirect to Verify Page
            window.location.href = `/verify?email=${encodeURIComponent(email)}`;
        } else {
            setError(res.error || 'Registration failed');
        }
        setLoading(false);
    };

    return (
        <div className="container" style={{ maxWidth: '400px', margin: '6rem auto', padding: '2rem', border: '1px solid var(--color-border)', background: 'var(--color-bg-secondary)' }}>
            <h1 style={{ textAlign: 'center', marginBottom: '2rem' }}>Create Account</h1>
            {error && <p style={{ color: 'red', marginBottom: '1rem', textAlign: 'center' }}>{error}</p>}
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <input
                    type="text"
                    placeholder="Full Name"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    style={{ padding: '1rem', background: 'var(--color-bg)', border: '1px solid var(--color-border)', color: '#fff' }}
                    required
                />
                <input
                    type="email"
                    placeholder="Email Address"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    style={{ padding: '1rem', background: 'var(--color-bg)', border: '1px solid var(--color-border)', color: '#fff' }}
                    required
                />

                <div style={{ position: 'relative' }}>
                    <input
                        type={showPassword ? "text" : "password"}
                        placeholder="Password"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        style={{ width: '100%', padding: '1rem', background: 'var(--color-bg)', border: '1px solid var(--color-border)', color: '#fff' }}
                        required
                    />
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#aaa', cursor: 'pointer', fontSize: '0.8rem' }}
                    >
                        {showPassword ? 'Hide' : 'Show'}
                    </button>
                </div>

                <div style={{ position: 'relative' }}>
                    <input
                        type={showPassword ? "text" : "password"}
                        placeholder="Confirm Password"
                        value={confirmPassword}
                        onChange={e => setConfirmPassword(e.target.value)}
                        style={{ width: '100%', padding: '1rem', background: 'var(--color-bg)', border: '1px solid var(--color-border)', color: '#fff' }}
                        required
                    />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <label style={{ fontSize: '0.9rem', color: '#aaa', marginLeft: '0.5rem' }}>Date of Birth (For Age Verification)</label>
                    <input
                        type="date"
                        value={dob}
                        onChange={e => setDob(e.target.value)}
                        style={{ padding: '1rem', background: 'var(--color-bg)', border: '1px solid var(--color-border)', color: '#fff', fontFamily: 'inherit' }}
                        required
                    />
                </div>
                <button className="btn" type="submit" disabled={loading}>
                    {loading ? 'Signing Up...' : 'Sign Up'}
                </button>
            </form>
            <p style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '0.9rem' }}>
                Already have an account? <Link href="/login" style={{ color: 'var(--color-accent)', textDecoration: 'underline' }}>Login</Link>
            </p>
        </div>
    );
}
