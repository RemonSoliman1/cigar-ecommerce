
import { supabase } from '@/lib/supabaseClient';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request) {
    try {
        const { email } = await request.json();

        if (!email) {
            return Response.json({ success: false, error: 'Email is required' }, { status: 400 });
        }

        // 1. Check if user exists
        const { data: user } = await supabase
            .from('users')
            .select('*')
            .eq('email', email)
            .single();

        if (!user) {
            // Security: Don't reveal if user exists or not, but for UX in this specific app...
            // Let's return success even if user doesn't exist to prevent enumeration, 
            // OR finding the user is harmless here since it's a niche shop.
            // Let's return error for now to be helpful to the legitimate user.
            return Response.json({ success: false, error: 'No account found with this email.' }, { status: 404 });
        }

        // 2. Generate Reset Token (6-digit code)
        const token = Math.floor(100000 + Math.random() * 900000).toString();

        // 3. Store Token with type 'password_reset'
        const { error: tokenError } = await supabase
            .from('verification_tokens')
            .insert([{
                email,
                token,
                type: 'password_reset',
                expires_at: new Date(Date.now() + 3600000).toISOString() // 1 hour form now
            }]);

        if (tokenError) {
            console.error('Save Token Error:', tokenError);
            return Response.json({ success: false, error: 'Failed to create reset token' }, { status: 500 });
        }

        // 4. Send Email
        const resetLink = `${process.env.NEXT_PUBLIC_SITE_URL}/reset-password?email=${encodeURIComponent(email)}&code=${token}`;

        const { data: emailData, error: emailError } = await resend.emails.send({
            from: 'Cigar Lounge <onboarding@resend.dev>',
            to: email,
            subject: 'Reset Your Password - Cigar Lounge',
            html: `
                <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2>Password Reset Request</h2>
                    <p>We received a request to reset your password. If this wasn't you, please ignore this email.</p>
                    
                    <div style="background: #f4f4f4; padding: 20px; text-align: center; margin: 20px 0;">
                        <span style="font-size: 24px; font-weight: bold; letter-spacing: 5px;">${token}</span>
                    </div>

                    <p style="text-align: center;">
                        <a href="${resetLink}" style="background: #c6a87c; color: #fff; padding: 10px 20px; text-decoration: none; border-radius: 5px; font-weight: bold;">Reset Password</a>
                    </p>
                </div>
            `
        });

        if (emailError) {
            console.error('Resend Error:', emailError);
            // Return success with token if dev mode/free tier restriction
            if (emailError.statusCode === 403 || emailError.name === 'validation_error') {
                return Response.json({ success: true, token, warning: 'Email not sent (Resend Free Tier). Code is provided for testing.' });
            }
            return Response.json({ success: false, error: 'Failed to send reset email' }, { status: 500 });
        }

        return Response.json({ success: true });

    } catch (error) {
        console.error('Forgot Password API Error:', error);
        return Response.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
    }
}
