'use client';

export default function ReturnsPolicy() {
    return (
        <div className="container" style={{ padding: '4rem 0', maxWidth: '800px' }}>
            <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '2.5rem', marginBottom: '2rem' }}>Returns & Exchanges</h1>

            <section style={{ marginBottom: '2rem' }}>
                <h3 style={{ color: 'var(--color-accent)', marginBottom: '0.5rem' }}>Our Graphic Guarantee</h3>
                <p style={{ color: 'var(--color-text-secondary)', lineHeight: '1.6' }}>
                    We stand behind the quality of our products. If you are not completely satisfied with your purchase, simply contact us within 15 days of receipt.
                </p>
            </section>

            <section style={{ marginBottom: '2rem' }}>
                <h3 style={{ color: 'var(--color-accent)', marginBottom: '0.5rem' }}>Return Eligibility</h3>
                <ul style={{ margin: '1rem 0 1rem 1.5rem', color: 'var(--color-text-secondary)', lineHeight: '1.6' }}>
                    <li>Cigars must be in their original packaging and humidified condition.</li>
                    <li>Accessories must be unused and in original packaging.</li>
                    <li>Any "Sampler Packs" must be returned in full.</li>
                </ul>
            </section>

            <section style={{ marginBottom: '2rem' }}>
                <h3 style={{ color: 'var(--color-accent)', marginBottom: '0.5rem' }}>How to Initiate a Return</h3>
                <p style={{ color: 'var(--color-text-secondary)', lineHeight: '1.6' }}>
                    To start a return, please contact our Customer Care team at support@cigarlounge.com with your Order #.
                    We will provide you with a return shipping label and instructions.
                </p>
            </section>
        </div>
    );
}
