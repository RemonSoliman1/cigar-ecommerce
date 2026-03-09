'use client';

import { LOYALTY_TIERS } from '@/context/LoyaltyContext';
import styles from './loyalty.module.css';
import { Check } from 'lucide-react';

export default function LoyaltyPage() {
    return (
        <div className="container">
            <div className={styles.header}>
                <h1>Aficionado Club Policy</h1>
                <p>Earn points with every purchase and unlock exclusive rewards as you climb the ranks of our elite membership program.</p>
            </div>

            <div className={styles.tiersContainer}>
                {LOYALTY_TIERS.map((tier) => (
                    <div key={tier.name} className={`${styles.tierCard} ${styles[tier.name.toLowerCase()]}`}>
                        <div className={styles.tierHeader}>
                            <h2>{tier.name}</h2>
                            <p className={styles.pointsReq}>{tier.minPoints}+ Points</p>
                        </div>
                        <ul className={styles.benefitsList}>
                            {tier.benefits.map((benefit, index) => (
                                <li key={index}>
                                    <Check size={16} className={styles.icon} />
                                    <span>{benefit}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}
            </div>

            <div className={styles.faqSection}>
                <h2>How It Works</h2>
                <div className={styles.faqItem}>
                    <h3>Earning Points</h3>
                    <p>You earn 1 point for every EGP 10 spent on cigars and accessories. Gold and Platinum members earn at an accelerated rate.</p>
                </div>
                <div className={styles.faqItem}>
                    <h3>Tier Expiration</h3>
                    <p>Your tier status is valid for 12 months from the date you qualify. Maintain your points balance to keep your status.</p>
                </div>
            </div>
        </div>
    );
}
