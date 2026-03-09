'use client';

import { useLocale } from 'next-intl';
import { useRouter, usePathname } from '@/lib/navigation';
import { useTransition } from 'react';

export default function LanguageSwitcher() {
    const locale = useLocale();
    const router = useRouter();
    const pathname = usePathname();
    const [isPending, startTransition] = useTransition();

    const toggleLanguage = () => {
        const nextLocale = locale === 'en' ? 'ar' : 'en';
        startTransition(() => {
            router.replace(pathname, { locale: nextLocale });
        });
    };

    return (
        <button
            onClick={toggleLanguage}
            disabled={isPending}
            style={{
                background: 'none',
                border: '1px solid var(--color-border)',
                padding: '5px 10px',
                color: '#d4af37',
                cursor: 'pointer',
                fontSize: '0.9rem',
                marginInlineStart: '1rem',
                display: 'flex',
                alignItems: 'center',
                gap: '5px'
            }}
        >
            {locale === 'en' ? '🇺🇸 EN' : '🇪🇬 AR'}
        </button>
    );
}
