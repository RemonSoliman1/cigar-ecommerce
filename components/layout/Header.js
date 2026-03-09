'use client';

import { Link, usePathname, useRouter } from '@/lib/navigation';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { useProducts } from '@/context/ProductContext';
import styles from './Header.module.css';
import { BRANDS } from '@/lib/data';

import { useState, useEffect } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { User, Heart, ShoppingBag } from 'lucide-react';

import { useTelegram } from '@/context/TelegramContext';

export default function Header() {
    const { isTelegram } = useTelegram();
    const pathname = usePathname();
    const router = useRouter();
    const { cart } = useCart();
    const { user } = useAuth(); // Restored
    const { products } = useProducts(); // usage
    const [isHovered, setIsHovered] = useState(false); // Restored
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false); // Restored
    const t = useTranslations('Header');
    const currentLocale = useLocale();

    // Cascading MegaMenu State (Adaptive from Products)
    const [hoveredType, setHoveredType] = useState(null);
    const [hoveredBrand, setHoveredBrand] = useState(null);

    // Derived Menu Data from live products
    const staticTypes = [
        { id: 'cigar', label: 'CIGARS' },
        { id: 'cigarillo', label: 'CIGARILLOS' },
        { id: 'bundle', label: 'BUNDLES' },
        { id: 'sampler', label: 'SAMPLERS' },
        { id: 'accessory', label: 'ACCESSORIES' }
    ];

    // Get unique brands for the hovered type
    const menuBrands = hoveredType ? [...new Set(products.filter(p => p.type === hoveredType || (hoveredType === 'cigar' && !p.type)).map(p => p.brandId || p.brand_id))].filter(Boolean) : [];

    // Get unique series for the hovered brand
    const menuSeries = hoveredBrand ? [...new Set(products.filter(p => (p.brandId || p.brand_id) === hoveredBrand).map(p => p.series))].filter(Boolean) : [];

    // New State
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    // Search Logic
    const handleSearch = (e) => {
        const query = e.target.value;
        setSearchQuery(query);
        if (query.length > 0) {
            import('@/lib/search').then(({ searchProducts }) => {
                const results = searchProducts(query, products).slice(0, 5);
                setSearchResults(results);
            });
        } else {
            setSearchResults([]);
        }
    };

    // Close search on click outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (!event.target.closest(`.${styles.searchContainer}`)) {
                setSearchResults([]);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const [isScrolled, setIsScrolled] = useState(false);

    // Scroll Logic
    useEffect(() => {
        const handleScroll = () => {
            const scrollY = window.scrollY;
            if (scrollY > 100) {
                setIsScrolled(true);
            } else if (scrollY < 50) {
                setIsScrolled(false);
            }
        };
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Swipe to Close Logic
    const [touchStart, setTouchStart] = useState(null);
    const [touchEnd, setTouchEnd] = useState(null);
    const minSwipeDistance = 50;

    const onTouchStart = (e) => {
        setTouchEnd(null);
        setTouchStart(e.targetTouches[0].clientX);
    };

    const onTouchMove = (e) => setTouchEnd(e.targetTouches[0].clientX);

    const onTouchEnd = () => {
        if (!touchStart || !touchEnd) return;
        const distance = touchStart - touchEnd;
        const isLeftSwipe = distance > minSwipeDistance;
        if (isLeftSwipe) {
            setMobileMenuOpen(false);
        }
    };

    // Edge Swipe to Open Logic
    useEffect(() => {
        let touchStartX = 0;
        let touchEndX = 0;

        const handleTouchStart = (e) => {
            touchStartX = e.changedTouches[0].screenX;
        };

        const handleTouchEnd = (e) => {
            touchEndX = e.changedTouches[0].screenX;
            if (touchStartX < 50 && touchEndX > touchStartX + 50) {
                setMobileMenuOpen(true);
            }
        };

        window.addEventListener('touchstart', handleTouchStart);
        window.addEventListener('touchend', handleTouchEnd);

        return () => {
            window.removeEventListener('touchstart', handleTouchStart);
            window.removeEventListener('touchend', handleTouchEnd);
        };
    }, []);

    const changeLocale = (locale) => {
        router.push(pathname, { locale });
    };

    const cartCount = cart.reduce((total, item) => total + item.quantity, 0);

    return (
        <header className={`${styles.header} ${isScrolled ? styles.scrolled : ''}`}>
            {/* ROW 1: ACTION / LOGO / SEARCH / ICONS ROW */}
            <div className={styles.actionBar}>
                <div className="container" style={{ display: 'flex', width: '100%', alignItems: 'center', justifyContent: 'space-between' }}>
                    {/* HAMBURGER MENU */}
                    <button
                        className={styles.hamburger}
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        aria-label="Toggle Menu"
                    >
                        <span className={`${styles.bar} ${mobileMenuOpen ? styles.open : ''}`}></span>
                        <span className={`${styles.bar} ${mobileMenuOpen ? styles.open : ''}`}></span>
                        <span className={`${styles.bar} ${mobileMenuOpen ? styles.open : ''}`}></span>
                    </button>

                    {/* LOGO (LEFT) */}
                    <Link href="/" className={styles.logo}>
                        CIGAR <span className={styles.logoAccent}>LOUNGE</span>

                    </Link>

                    {/* SEARCH BAR (CENTER) */}
                    <div className={`${styles.searchContainer} ${styles.desktopOnly}`}>
                        <input
                            type="text"
                            placeholder={t('search_label') || 'Search the humidor...'}
                            className={styles.searchInput}
                            value={searchQuery}
                            onChange={(e) => {
                                setSearchQuery(e.target.value);
                                handleSearch(e);
                            }}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    setSearchResults([]);
                                    router.push(`/shop?q=${encodeURIComponent(searchQuery)}`);
                                }
                            }}
                        />
                        <button
                            className={styles.searchSubmitBtn}
                            onClick={() => {
                                setSearchResults([]);
                                if (searchQuery) router.push(`/shop?q=${encodeURIComponent(searchQuery)}`);
                            }}
                            aria-label="Search"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></svg>
                        </button>
                        {searchResults.length > 0 && (
                            <div className={styles.searchResults}>
                                {searchResults.map(p => (
                                    <Link key={p.id} href={`/product/${p.id}`} className={styles.searchItem} onClick={() => { setSearchResults([]); setSearchQuery(''); }}>
                                        <img src={p.image} alt={p.name} className={styles.searchThumb} />
                                        <div>
                                            <div style={{ fontWeight: 'bold' }}>{p.name}</div>
                                            <div style={{ fontSize: '0.8rem', color: '#aaa' }}>EGP {p.models[0].price}</div>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* ICONS & LANG (RIGHT) */}
                    <div className={styles.actions}>
                        {user ? (
                            <Link href="/account" className={styles.iconBtn} aria-label="Account">
                                <User size={24} />
                            </Link>
                        ) : (
                            <Link href="/login" className={styles.iconBtn} aria-label="Login">
                                <User size={24} />
                            </Link>
                        )}

                        {/* Admin Link */}
                        {user?.role === 'admin' && (
                            <Link href="/admin" className={styles.iconBtn} aria-label="Admin Dashboard" style={{ color: '#ffcc00' }}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>
                            </Link>
                        )}

                        <Link href="/wishlist" className={styles.iconBtn} aria-label="Wishlist">
                            <Heart size={24} />
                        </Link>

                        {pathname !== '/login' && pathname !== '/ar/login' && pathname !== '/en/login' && (
                            <div
                                className={styles.cartContainer}
                                onMouseEnter={() => setIsHovered(true)}
                                onMouseLeave={() => setIsHovered(false)}
                            >
                                <Link href="/cart" className={styles.cartIcon}>
                                    <ShoppingBag size={24} />
                                    {cartCount > 0 && <span className={styles.badge}>{cartCount}</span>}
                                </Link>
                                <div className={`${styles.miniCart} ${isHovered ? styles.show : ''}`}>
                                    {cart.length === 0 ? (
                                        <div className={styles.empty}>{t('cart_empty')}</div>
                                    ) : (
                                        <>
                                            <ul className={styles.cartList}>
                                                {cart.map((item, idx) => (
                                                    <li key={`${item.id}-${idx}`} className={styles.cartItem}>
                                                        <img src={item.image} alt={item.name} className={styles.thumb} />
                                                        <div className={styles.info}>
                                                            <p className={styles.name}>{item.name}</p>
                                                            <p className={styles.size}>{item.selectedSize}</p>
                                                            <p className={styles.price}>EGP {item.price} x {item.quantity}</p>
                                                        </div>
                                                    </li>
                                                ))}
                                            </ul>
                                            <div className={styles.total}>
                                                <span>{t('total')}</span>
                                                <span>EGP {cart.reduce((t, i) => t + (i.price * i.quantity), 0).toFixed(2)}</span>
                                            </div>
                                            <Link href="/checkout" className={`btn ${styles.checkoutBtn}`}>
                                                {t('checkout')}
                                            </Link>
                                        </>
                                    )}
                                </div>
                            </div>
                        )}

                        <div className={styles.langLinks}>
                            <button className={`${styles.langLink} ${currentLocale === 'en' ? styles.activeLang : ''}`} onClick={() => changeLocale('en')}>EN</button>
                            <span className={styles.langSep}>|</span>
                            <button className={`${styles.langLink} ${currentLocale === 'ar' ? styles.activeLang : ''}`} onClick={() => changeLocale('ar')}>العربيه</button>
                        </div>
                    </div>
                </div>
            </div>

            {/* ROW 2: NAVIGATION ROW */}
            <nav className={styles.navBar}>
                <div className="container" style={{ display: 'flex', width: '100%', alignItems: 'center', justifyContent: 'center' }}>
                    <div className={styles.nav}>
                        <Link href="/" className={styles.link}>HOME</Link>
                        <div className={styles.navItemContainer} onMouseLeave={() => { setHoveredType(null); setHoveredBrand(null); }}>
                            <Link href="/shop" className={styles.link}>SHOP</Link>
                            <div className={styles.megaMenu}>
                                <div className={styles.megaMenuInner}>
                                    {/* Column 1: Categories (Types) */}
                                    <div className={styles.megaColumn} style={{ minWidth: '150px' }}>
                                        <h4>CATEGORIES</h4>
                                        {staticTypes.map(tOption => (
                                            <Link
                                                key={tOption.id}
                                                href={`/shop?type=${tOption.id}`}
                                                onMouseEnter={() => { setHoveredType(tOption.id); setHoveredBrand(null); }}
                                                style={{ color: hoveredType === tOption.id ? 'var(--color-accent)' : '#ccc' }}
                                            >
                                                {tOption.label}
                                            </Link>
                                        ))}
                                        <Link href="/shop" onMouseEnter={() => { setHoveredType(null); setHoveredBrand(null); }} style={{ marginTop: '1rem', color: '#888' }}>All Products</Link>
                                    </div>

                                    {/* Column 2: Brands in this Category */}
                                    {hoveredType && (
                                        <div className={styles.megaColumn} style={{ animation: 'fadeIn 0.3s ease', minWidth: '200px' }}>
                                            <h4>BRANDS IN HUMIDOR</h4>
                                            {menuBrands.map(brandId => {
                                                const brandObj = BRANDS.find(b => b.id === brandId);
                                                const brandName = brandObj ? brandObj.name : (brandId.charAt(0).toUpperCase() + brandId.slice(1).replace(/-/g, ' '));
                                                return (
                                                    <Link
                                                        key={brandId}
                                                        href={`/shop?type=${hoveredType}&brand=${brandId}`}
                                                        onMouseEnter={() => setHoveredBrand(brandId)}
                                                        style={{ color: hoveredBrand === brandId ? 'var(--color-accent)' : '#ccc', textTransform: 'uppercase' }}
                                                    >
                                                        {brandName}
                                                    </Link>
                                                );
                                            })}
                                            {menuBrands.length === 0 && <span style={{ color: '#666', fontSize: '0.85rem' }}>No brands available.</span>}
                                        </div>
                                    )}

                                    {/* Column 3: Series/Vitolas in this Brand */}
                                    {hoveredBrand && (
                                        <div className={styles.megaColumn} style={{ animation: 'fadeIn 0.3s ease', minWidth: '200px' }}>
                                            <h4>AVAILABLE COLLECTIONS</h4>
                                            <Link
                                                href={`/shop?type=${hoveredType}&brand=${hoveredBrand}`}
                                                style={{ color: 'var(--color-accent)', fontStyle: 'italic', marginBottom: '0.5rem', textTransform: 'uppercase' }}
                                            >
                                                Shop All {BRANDS.find(b => b.id === hoveredBrand)?.name || hoveredBrand}
                                            </Link>
                                            {menuSeries.map(series => (
                                                <Link
                                                    key={series}
                                                    href={`/shop?type=${hoveredType}&brand=${hoveredBrand}&series=${encodeURIComponent(series)}`}
                                                    style={{ color: '#ccc', textTransform: 'uppercase' }}
                                                >
                                                    {series}
                                                </Link>
                                            ))}
                                            {menuSeries.length === 0 && <span style={{ color: '#666', fontSize: '0.85rem' }}>No collections found.</span>}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                        <Link href="/about" className={styles.link}>HERITAGE</Link>
                    </div>
                </div>
            </nav>

            {/* BACKDROP */}
            {mobileMenuOpen && (
                <div className={styles.backdrop} onClick={() => setMobileMenuOpen(false)}></div>
            )}

            {/* MOBILE DRAWER */}
            <div className={`${styles.navMobile} ${mobileMenuOpen ? styles.mobileNavOpen : ''}`} onTouchStart={onTouchStart} onTouchMove={onTouchMove} onTouchEnd={onTouchEnd}>
                <button className={styles.closeBtn} onClick={() => setMobileMenuOpen(false)} aria-label="Close Menu">
                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg>
                </button>
                <div className={styles.mobileMenuSearch}>
                    <div className={styles.searchContainer}>
                        <input type="text" placeholder={t('search_label') || 'Found...'} className={styles.searchInput} value={searchQuery} onChange={(e) => { setSearchQuery(e.target.value); handleSearch(e); }} onKeyDown={(e) => { if (e.key === 'Enter') { setSearchResults([]); setMobileMenuOpen(false); router.push(`/shop?q=${encodeURIComponent(searchQuery)}`); } }} suppressHydrationWarning />
                        {searchResults.length > 0 && (
                            <div className={styles.searchResults}>
                                {searchResults.map(p => (
                                    <Link key={p.id} href={`/product/${p.id}`} className={styles.searchItem} onClick={() => { setSearchResults([]); setSearchQuery(''); setMobileMenuOpen(false); }}>
                                        <img src={p.image} alt={p.name} className={styles.searchThumb} />
                                        <div>
                                            <div style={{ fontWeight: 'bold' }}>{p.name}</div>
                                            <div style={{ fontSize: '0.8rem', color: '#aaa' }}>EGP {p.models[0].price}</div>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
                <div className={styles.mobileActions}>
                    <Link href="/" className={styles.mobilemylink} onClick={() => setMobileMenuOpen(false)}>HOME</Link>
                    <Link href="/shop" className={styles.mobilemylink} onClick={() => setMobileMenuOpen(false)}>SHOP</Link>
                    <Link href="/about" className={styles.mobilemylink} onClick={() => setMobileMenuOpen(false)}>HERITAGE</Link>
                </div>
            </div>
        </header>
    );
}
