'use client';

import { Link } from '@/lib/navigation';
import styles from './page.module.css';
import { PRODUCTS, MOCK_USER_HISTORY } from '@/lib/data';
import ProductCard from '@/components/ui/ProductCard';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import { useRouter } from '@/lib/navigation';
import { useTranslations } from 'next-intl';
import { useLoyalty } from '@/context/LoyaltyContext';
import { useTelegram } from '@/context/TelegramContext';

export default function Home() {
  const { user } = useAuth();
  const { points, tier } = useLoyalty();
  const { showToast } = useToast();
  const { isTelegram } = useTelegram();
  const router = useRouter();
  const t = useTranslations('Hero');

  // "Smart" Recommendations Logic
  const recommendedProducts = PRODUCTS.filter(p => {
    const matchesBrand = MOCK_USER_HISTORY.includes(p.brandId);
    const matchesStrength = p.strength ? MOCK_USER_HISTORY.includes(p.strength.toLowerCase() + '-strength') : false;
    return matchesBrand || p.rating >= 4.9;
  }).slice(0, 3);

  // Stable Top Deals
  const topDeals = PRODUCTS.filter(p => ['cohiba-behike', 'montecristo-no2', 'fuente-opusx'].includes(p.id));

  const handleJoinClick = (e) => {
    if (user) {
      e.preventDefault();
      showToast("You are already a member of the Aficionado Club.", 'info');
      setTimeout(() => router.push('/account'), 1500); // Redirect to account for convenience
    }
  };

  // Simplistic Telegram View REMOVED to unify design
  // if (isTelegram) { ... }

  return (
    <div className={styles.home}>
      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>{t('title')}</h1>
          <p className={styles.heroSubtitle}>
            {t('subtitle')}
          </p>
          <div className={styles.heroActions}>
            <Link href="/shop" className="btn">{t('cta')}</Link>
            <Link href="/about" className="btn-outline" style={{ marginInlineStart: '1rem' }}>{t('heritage')}</Link>
          </div>
        </div>
      </section>

      {/* Top Deals (This Month's Features) */}
      <section className="container" style={{ margin: '4rem auto' }}>
        <div className={styles.sectionHeader}>
          <h2>{t('features_title')}</h2>
        </div>
        <div className={styles.productGrid}>
          {topDeals.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* Smart Recommendations */}
      <section className="container" style={{ margin: '4rem auto' }}>
        <div className={styles.sectionHeader}>
          <h2>{t('recommendations_title')}</h2>
          <p className={styles.sectionSubtitle} dangerouslySetInnerHTML={{ __html: t.raw('recommendations_subtitle') }} />
        </div>

        <div className={styles.productGrid}>
          {recommendedProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* Loyalty / Banner */}
      <section className={styles.loyaltyBanner}>
        <div className="container">
          {user ? (
            <div className={styles.loyaltyStatus}>
              <div className={styles.loyaltyHeader}>
                <h2>Welcome back, {user.name || 'Aficionado'}</h2>
                <div className={styles.tierBadge}>{tier.name} Status</div>
              </div>

              <div className={styles.pointsDisplay}>
                <div className={styles.pointCircle}>
                  <span className={styles.pointValue}>{points}</span>
                  <span className={styles.pointLabel}>Points</span>
                </div>

                <div className={styles.tierProgress}>
                  {tier.name !== 'Platinum' ? (
                    <>
                      <div className={styles.progressText}>
                        <span>{tier.name}</span>
                        <span>{5000 - points} to Platinum ({tier.name === 'Silver' ? 'Next: Gold' : 'Next: Platinum'})</span>
                      </div>
                      <div className={styles.progressBar}>
                        <div className={styles.progressFill} style={{ width: `${Math.min((points / 5000) * 100, 100)}%` }}></div>
                      </div>
                    </>
                  ) : (
                    <p className={styles.maxTier}>You have reached the highest tier. Enjoy exclusive Platinum benefits!</p>
                  )}

                  <div className={styles.benefitsList}>
                    <h4>Current {tier.name} Benefits:</h4>
                    <ul>
                      {tier.benefits && tier.benefits.map((benefit, index) => (
                        <li key={index}>✓ {benefit}</li>
                      ))}
                    </ul>
                  </div>
                  <div style={{ marginTop: '1rem' }}>
                    <Link href="/loyalty" className="btn-link-accent" style={{ fontSize: '0.9rem', color: '#fff', textDecoration: 'underline' }}>
                      View All Tiers & Policy →
                    </Link>
                  </div>
                </div>
              </div>

              <div className={styles.loyaltyActions}>
                <Link href="/account" className="btn-outline-dark">View My Offers</Link>
                <Link href="/shop" className="btn-dark">Earn More Points</Link>
              </div>
            </div>
          ) : (
            <>
              <h2 dangerouslySetInnerHTML={{ __html: t.raw('join_title') }} />
              <p>{t('join_text')}</p>
              <Link href="/register" onClick={handleJoinClick} className="btn" style={{ marginTop: '1.5rem', background: '#fff', color: '#120C0A', display: 'inline-block' }}>{t('join_btn')}</Link>
            </>
          )}
        </div>
      </section>
    </div>
  );
}
