
import { NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request) {
    try {
        const { email, name } = await request.json();

        if (!email) {
            return NextResponse.json({ error: 'Email is required' }, { status: 400 });
        }

        // NOTE: On free tier, can only send to verified address. 
        // We attempt to send to 'email'. If it fails, it will be logged.
        const { data, error } = await resend.emails.send({
            from: 'Cigar Lounge <onboarding@resend.dev>',
            to: [email], // Try sending to the registered user
            subject: 'Welcome to Cigar Lounge',
            html: `
                <div style="font-family: sans-serif; color: #333;">
                    <h1>Welcome, ${name || 'Aficionado'}!</h1>
                    <p>Thank you for joining Cigar Lounge. We are delighted to have you with us.</p>
                    <p>Explore our premium collection of cigars and accessories.</p>
                    <br/>
                    <a href="${process.env.NEXT_PUBLIC_SITE_URL}/shop" style="background: #c6a87c; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Start Shopping</a>
                </div>
            `,
        });

        if (error) {
            console.error("Resend Error:", error);
            return NextResponse.json({ error: 'Failed to send email' }, { status: 500 });
        }

        return NextResponse.json({ success: true, data });

    } catch (error) {
        console.error("Email Error:", error);
        return NextResponse.json({ error: 'Failed to send email' }, { status: 500 });
    }
}
