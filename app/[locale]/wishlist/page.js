'use client';

import { useWishlist } from '@/context/WishlistContext';
import { useCart } from '@/context/CartContext';
import { Link } from '@/lib/navigation';
import { useTranslations } from 'next-intl';
import WishlistButton from '@/components/ui/WishlistButton';
import styles from './wishlist.module.css';

export default function WishlistPage() {
    const { wishlist, removeFromWishlist } = useWishlist();
    const { addToCart } = useCart();
    const t = useTranslations('Shop');

    if (wishlist.length === 0) {
        return (
            <div className="container" style={{ padding: '4rem 0', textAlign: 'center', minHeight: '60vh' }}>
                <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '2.5rem', marginBottom: '1rem' }}>Your Wishlist</h1>
                <p style={{ color: '#888', marginBottom: '2rem' }}>Your wishlist is currently empty.</p>
                <Link href="/shop" className="btn">Browse Shop</Link>
            </div>
        );
    }

    return (
        <div className="container" style={{ padding: '4rem 0' }}>
            <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '2.5rem', marginBottom: '3rem', textAlign: 'center' }}>Your Wishlist</h1>

            <div className={styles.grid}>
                {wishlist.map(product => (
                    <div key={product.id} className={styles.card}>
                        <div className={styles.imageContainer}>
                            <Link href={`/product/${product.id}`}>
                                <img src={product.image} alt={product.name} className={styles.image} />
                            </Link>
                            <button
                                className={styles.removeBtn}
                                onClick={() => removeFromWishlist(product.id)}
                            >
                                ×
                            </button>
                        </div>
                        <div className={styles.content}>
                            <Link href={`/product/${product.id}`} className={styles.name}>{product.name}</Link>
                            <p className={styles.price}>EGP {product.models[0].price.toFixed(2)}</p>

                            <div className={styles.actions}>
                                <button
                                    className={`btn ${styles.addToCart}`}
                                    onClick={() => addToCart({ ...product, stock: product.models[0].stock }, product.models[0].name || product.models[0].size || 'Base', product.models[0].price, 1)}
                                >
                                    Add to Cart
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
