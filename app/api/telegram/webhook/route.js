import { NextResponse } from 'next/server';
import { Telegraf, Markup } from 'telegraf';

// Helper to validate token
const token = process.env.TELEGRAM_BOT_TOKEN;
if (!token) {
    console.error('❌ Error: TELEGRAM_BOT_TOKEN is missing');
}

// 1. Initialize Bot
const bot = new Telegraf(token || '');

// 2. Define Commands (Must match scripts/telegram-bot.js logic)
bot.start((ctx) => {
    const userName = ctx.from?.first_name || 'Aficionado';
    const webAppUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://cigar-lounge-one.vercel.app';

    console.log('🔗 [Webhook] Using Web App URL:', webAppUrl);

    ctx.reply(
        `<b>Welcome to the Cigar Lounge, ${userName}.</b>\n\nExperience our premium collection of hand-rolled cigars and accessories directly within Telegram.`,
        {
            parse_mode: 'HTML',
            ...Markup.inlineKeyboard([
                [Markup.button.webApp('🔥 Enter the Lounge', webAppUrl)]
            ])
        }
    );
});

bot.help((ctx) => {
    ctx.reply('Currently, this bot serves as the gateway to our Mini App. Type /start to begin shopping.');
});

bot.on('text', (ctx) => {
    const query = ctx.message.text;

    if (query.startsWith('/')) return;

    const webAppUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://cigar-lounge-one.vercel.app';
    const searchUrl = `https://cigar-lounge-one.vercel.app/shop?q=${encodeURIComponent(query)}`;

    ctx.reply(
        `🔎 <b>Search for "${query}"</b>\n\nI can search the humidor for exactly what you're looking for, or you can enter the lounge to browse our full collection.`,
        {
            parse_mode: 'HTML',
            ...Markup.inlineKeyboard([
                [Markup.button.webApp(`🔎 Search "${query}"`, searchUrl)],
                [Markup.button.webApp('🔥 Enter the Lounge', webAppUrl)]
            ])
        }
    );
});

// Avoid crashes
bot.catch((err, ctx) => {
    console.error(`Ooops, encountered an error for ${ctx.updateType}`, err);
});

// 3. Webhook HTTP Handler
export async function POST(req) {
    if (!token) return NextResponse.json({ error: 'Bot token not configured' }, { status: 500 });

    try {
        const body = await req.json();
        // Pass the raw update body to Telegraf
        await bot.handleUpdate(body);
        return NextResponse.json({ success: true, processed: true });
    } catch (e) {
        console.error('Webhook Error:', e);
        return NextResponse.json({ error: 'Failed to process update', details: e.message }, { status: 500 });
    }
}

// Ensure GET requests return a friendly health check
export async function GET() {
    return NextResponse.json({ status: 'Telegram Bot Webhook is Active.' });
}
