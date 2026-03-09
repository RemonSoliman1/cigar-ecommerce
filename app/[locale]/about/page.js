import { useTranslations } from 'next-intl';
import { Link } from '@/lib/navigation';
import styles from './about.module.css';

export default function AboutPage() {
    const t = useTranslations('About');

    return (
        <div className="container" style={{ padding: '6rem 0' }}>
            <div className={styles.hero}>
                <h1 className={styles.title}>{t('title')}</h1>
                <p className={styles.subtitle}>{t('subtitle')}</p>
            </div>

            <div className={styles.content}>
                <div className={styles.section}>
                    <h2>{t('tradition_title')}</h2>
                    <p>{t('tradition_text1')}</p>
                    <p>{t('tradition_text2')}</p>
                </div>

                <div className={styles.section}>
                    <h2>{t('humidor_title')}</h2>
                    <p>{t('humidor_text')}</p>
                </div>

                <div className={styles.section} style={{ marginTop: '3rem', textAlign: 'center' }}>
                    <p style={{ fontStyle: 'italic', fontSize: '1.2rem', color: 'var(--color-accent)' }}>
                        "{t('quote')}" — {t('quote_author')}
                    </p>
                    <Link href="/shop" className="btn" style={{ marginTop: '2rem', display: 'inline-block' }}>{t('cta')}</Link>
                </div>
            </div>
        </div>
    );
}
