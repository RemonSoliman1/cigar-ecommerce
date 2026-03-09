'use client';

export default function ShippingPolicy() {
    return (
        <div className="container" style={{ padding: '4rem 0', maxWidth: '800px' }}>
            <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '2.5rem', marginBottom: '2rem' }}>Shipping Policy</h1>

            <section style={{ marginBottom: '2rem' }}>
                <h3 style={{ color: 'var(--color-accent)', marginBottom: '0.5rem' }}>Processing Time</h3>
                <p style={{ color: 'var(--color-text-secondary)', lineHeight: '1.6' }}>
                    All orders are processed within 1-2 business days. Orders are not shipped or delivered on weekends or holidays.
                    If we are experiencing a high volume of orders, shipments may be delayed by a few days.
                </p>
            </section>

            <section style={{ marginBottom: '2rem' }}>
                <h3 style={{ color: 'var(--color-accent)', marginBottom: '0.5rem' }}>Shipping Rates & Delivery Estimates</h3>
                <p style={{ color: 'var(--color-text-secondary)', lineHeight: '1.6' }}>
                    Shipping charges for your order will be calculated and displayed at checkout.
                </p>
                <ul style={{ margin: '1rem 0 1rem 1.5rem', color: 'var(--color-text-secondary)' }}>
                    <li><strong>Standard Shipping:</strong> 3-5 business days - Free for Gold/Platinum members or orders over $100.</li>
                    <li><strong>Express Shipping:</strong> 1-2 business days - $15.00 (Free for Platinum members).</li>
                </ul>
            </section>

            <section style={{ marginBottom: '2rem' }}>
                <h3 style={{ color: 'var(--color-accent)', marginBottom: '0.5rem' }}>International Shipping</h3>
                <p style={{ color: 'var(--color-text-secondary)', lineHeight: '1.6' }}>
                    We currently ship to select international destinations. Please note that custom duties and taxes are the responsibility of the customer.
                </p>
            </section>
        </div>
    );
}
