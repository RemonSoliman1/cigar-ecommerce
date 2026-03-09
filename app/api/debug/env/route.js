import { NextResponse } from 'next/server';

export async function GET() {
    return NextResponse.json({
        telegram_bot_token: !!process.env.TELEGRAM_BOT_TOKEN,
        telegram_chat_id: !!process.env.TELEGRAM_ADMIN_CHAT_ID,
        supabase_url: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
        supabase_key: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
        resend_api_key: !!process.env.RESEND_API_KEY,
        site_url: process.env.NEXT_PUBLIC_SITE_URL || 'MISSING',
        node_env: process.env.NODE_ENV
    });
}
