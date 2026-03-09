'use client';

import { useAuth } from '@/context/AuthContext';
import { useRouter } from '@/lib/navigation';
import { useEffect, useState } from 'react';
import { Link } from '@/lib/navigation';
import styles from './account.module.css';
import OrderCard from './OrderCard';
import { useTranslations } from 'next-intl';
import { useLoyalty } from '@/context/LoyaltyContext';
import { LayoutDashboard, ShoppingBag, MapPin, Settings, LogOut, Heart } from 'lucide-react';

export default function AccountPage() {
    const { user, logout, loading } = useAuth();
    const router = useRouter();
    const t = useTranslations('Account');
    const { points, tier } = useLoyalty();

    const [activeTab, setActiveTab] = useState('overview');
    const [orders, setOrders] = useState([]);

    // Settings State
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [updateStatus, setUpdateStatus] = useState({ loading: false, error: '', success: '' });

    const handleUpdatePassword = async (e) => {
        e.preventDefault();
        setUpdateStatus({ loading: true, error: '', success: '' });

        if (newPassword !== confirmPassword) {
            setUpdateStatus({ loading: false, error: 'Passwords do not match', success: '' });
            return;
        }

        if (newPassword.length < 6) {
            setUpdateStatus({ loading: false, error: 'Password must be at least 6 characters', success: '' });
            return;
        }

        try {
            const res = await fetch('/api/auth/update-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: user.email, newPassword })
            });
            const data = await res.json();

            if (data.success) {
                setUpdateStatus({ loading: false, error: '', success: 'Password updated successfully!' });
                setNewPassword('');
                setConfirmPassword('');
            } else {
                setUpdateStatus({ loading: false, error: data.error || 'Failed to update password', success: '' });
            }
        } catch (err) {
            setUpdateStatus({ loading: false, error: 'An error occurred', success: '' });
        }
    };

    useEffect(() => {
        if (!loading && !user) {
            router.push('/login');
        }

        // Load orders
        if (user) {
            fetch(`/api/orders?email=${encodeURIComponent(user.email)}`)
                .then(res => res.json())
                .then(data => {
                    if (data.orders) {
                        // Map DB structure to Frontend structure
                        // Map DB structure to Frontend structure
                        const mappedOrders = data.orders.map(o => ({
                            id: o.id,
                            date: o.created_at,
                            status: o.status || 'Pending',
                            // API now returns normalized 'total' and 'items'
                            total: o.total || o.total_price || 0,
                            items: Array.isArray(o.items) ? o.items.map(i => ({
                                id: i.product_id || i.id, // Handle both structures
                                name: i.name || 'Unknown Item',
                                quantity: i.quantity || 1,
                                price: i.price || 0,
                                selectedSize: i.size || i.selectedSize || ''
                            })) : []
                        }));
                        setOrders(mappedOrders);
                    }
                })
                .catch(err => console.error("Failed to load orders", err));
        }
    }, [user, loading, router]);

    if (loading || !user) return <div className="container" style={{ padding: '4rem', textAlign: 'center' }}>Loading...</div>;

    const renderContent = () => {
        switch (activeTab) {
            case 'orders':
                return (
                    <div className={styles.section}>
                        <h2>Order History</h2>
                        {orders.length === 0 ? (
                            <div className={styles.emptyState}>
                                <p>{t('orders.empty')}</p>
                                <Link href="/shop" className="btn" style={{ marginTop: '1rem' }}>Start Shopping</Link>
                            </div>
                        ) : (
                            <div className={styles.orderList}>
                                {orders.map((order, idx) => (
                                    <OrderCard key={idx} order={order} />
                                ))}
                            </div>
                        )}
                    </div>
                );
            case 'settings':
                return (
                    <div className={styles.section}>
                        <h2>Account Settings</h2>
                        <form className={styles.formGrid} onSubmit={handleUpdatePassword}>
                            <div className={styles.formGroup}>
                                <label>Full Name</label>
                                <input type="text" defaultValue={user.name} className={styles.input} disabled style={{ opacity: 0.7 }} />
                            </div>
                            <div className={styles.formGroup}>
                                <label>Email Address</label>
                                <input type="email" defaultValue={user.email} className={styles.input} disabled style={{ opacity: 0.7 }} />
                            </div>

                            <div className={styles.formGroup} style={{ position: 'relative' }}>
                                <label>New Password</label>
                                <div style={{ position: 'relative' }}>
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        placeholder="Min 6 characters"
                                        className={styles.input}
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        style={{ width: '100%' }}
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
                                            cursor: 'pointer',
                                            fontSize: '0.8rem'
                                        }}
                                    >
                                        {showPassword ? 'Hide' : 'Show'}
                                    </button>
                                </div>
                            </div>

                            <div className={styles.formGroup}>
                                <label>Confirm Password</label>
                                <input
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Confirm new password"
                                    className={styles.input}
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                />
                            </div>

                            <div style={{ gridColumn: '1 / -1' }}>
                                {updateStatus.error && <p style={{ color: 'red', marginBottom: '1rem' }}>{updateStatus.error}</p>}
                                {updateStatus.success && <p style={{ color: 'green', marginBottom: '1rem' }}>{updateStatus.success}</p>}

                                <button className="btn" disabled={updateStatus.loading}>
                                    {updateStatus.loading ? 'Saving...' : 'Save Password'}
                                </button>
                            </div>
                        </form>
                    </div>
                );
            case 'overview':
            default:
                return (
                    <div className={styles.section}>
                        <h2>Dashboard Overview</h2>
                        <div className={styles.statsGrid}>
                            <div className={styles.statCard}>
                                <span className={styles.statValue}>{points}</span>
                                <span className={styles.statLabel}>Loyalty Points</span>
                            </div>
                            <div className={styles.statCard}>
                                <span className={styles.statValue}>{tier.name}</span>
                                <span className={styles.statLabel}>Current Status</span>
                            </div>
                            <div className={styles.statCard}>
                                <span className={styles.statValue}>{orders.length}</span>
                                <span className={styles.statLabel}>Total Orders</span>
                            </div>
                        </div>

                        {/* Recent Order Snippet */}
                        {orders.length > 0 && (
                            <div style={{ marginTop: '3rem' }}>
                                <h3 style={{ marginBottom: '1rem', color: 'var(--color-accent)' }}>Recent Order</h3>
                                <OrderCard order={orders[0]} />
                            </div>
                        )}
                    </div>
                );
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.dashboardGrid}>
                {/* Sidebar */}
                <aside className={styles.sidebar}>
                    <div className={styles.userBrief}>
                        <h3>{user.name || 'Member'}</h3>
                        <p>{user.email}</p>
                    </div>
                    <nav className={styles.nav}>
                        <button
                            className={`${styles.navBtn} ${activeTab === 'overview' ? styles.activeBtn : ''}`}
                            onClick={() => setActiveTab('overview')}
                        >
                            <LayoutDashboard size={20} /> Overview
                        </button>
                        <button
                            className={`${styles.navBtn} ${activeTab === 'orders' ? styles.activeBtn : ''}`}
                            onClick={() => setActiveTab('orders')}
                        >
                            <ShoppingBag size={20} /> Orders
                        </button>
                        <button
                            className={styles.navBtn}
                            onClick={() => router.push('/wishlist')}
                        >
                            <Heart size={20} /> Wishlist
                        </button>
                        <button
                            className={`${styles.navBtn} ${activeTab === 'settings' ? styles.activeBtn : ''}`}
                            onClick={() => setActiveTab('settings')}
                        >
                            <Settings size={20} /> Settings
                        </button>

                        {user.role === 'admin' && (
                            <button
                                className={styles.navBtn}
                                onClick={() => router.push('/admin')}
                                style={{ color: '#ffcc00' }}
                            >
                                <LayoutDashboard size={20} /> Admin Dashboard
                            </button>
                        )}

                        <button
                            className={styles.navBtn}
                            onClick={logout}
                            style={{ marginTop: '1rem', color: '#ff4444' }}
                        >
                            <LogOut size={20} /> Sign Out
                        </button>
                    </nav>
                </aside>

                {/* Main Content */}
                <main className={styles.content}>
                    {renderContent()}
                </main>
            </div>
        </div>
    );
}
