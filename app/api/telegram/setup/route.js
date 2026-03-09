import { NextResponse } from 'next/server';

export async function GET(req) {
    const token = process.env.TELEGRAM_BOT_TOKEN;
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://cigar-lounge-one.vercel.app';

    if (!token) {
        return NextResponse.json({ error: 'TELEGRAM_BOT_TOKEN is missing' }, { status: 500 });
    }

    const webhookUrl = `${siteUrl}/api/telegram/webhook`;
    const telegramApiUrl = `https://api.telegram.org/bot${token}/setWebhook?url=${webhookUrl}`;

    try {
        const response = await fetch(telegramApiUrl);
        const data = await response.json();

        if (data.ok) {
            return NextResponse.json({
                success: true,
                message: 'Webhook successfully set to Vercel Serverless Function.',
                url: webhookUrl,
                telegram_response: data
            });
        } else {
            return NextResponse.json({
                success: false,
                error: 'Telegram rejected the webhook setup.',
                telegram_response: data
            }, { status: 400 });
        }
    } catch (error) {
        return NextResponse.json({
            success: false,
            error: 'Failed to contact Telegram API.',
            details: error.message
        }, { status: 500 });
    }
}
