const { Telegraf, Markup } = require('telegraf');
require('dotenv').config({ path: '.env.local' }); // Load env vars

// Helper to validate token
const token = process.env.TELEGRAM_BOT_TOKEN;
if (!token) {
    console.error('❌ Error: TELEGRAM_BOT_TOKEN is missing in .env.local');
    process.exit(1);
}

const bot = new Telegraf(token);

// 1. /start command - Entry Point
bot.start((ctx) => {
    const userName = ctx.from.first_name || 'Aficionado';

    // The Web App URL - prioritization: Env Var > Hardcoded fallback
    const webAppUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://cigar-lounge-one.vercel.app';

    console.log('🔗 Using Web App URL:', webAppUrl);

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

// 2. /help command
bot.help((ctx) => {
    ctx.reply('Currently, this bot serves as the gateway to our Mini App. Type /start to begin shopping.');
});

// 3. Search Handler (Text Messages)
bot.on('text', (ctx) => {
    const query = ctx.message.text;

    // Ignore commands (which start with /)
    if (query.startsWith('/')) return;

    // The Web App URL - prioritization: Env Var > Hardcoded fallback
    const webAppUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://cigar-lounge-one.vercel.app';
    // Ensure we use a clean URL for search
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

// 4. Error Handling
bot.catch((err, ctx) => {
    console.error(`Ooops, encountered an error for ${ctx.updateType}`, err);
});

// 4. Launch Bot
console.log('===============================================================');
console.log('⚠️  WARNING: SERVERLESS WEBHOOK MIGRATION COMPLETE ⚠️');
console.log('===============================================================');
console.log('You no longer need to run this script manually!');
console.log('The bot is now hosted 24/7 on Vercel via Serverless Webhooks.');
console.log('Running this script locally will cause a "Conflict" error with Telegram.');
console.log('If you wish to test locally, you MUST delete the webhook first:');
console.log('https://api.telegram.org/bot<TOKEN>/deleteWebhook');
console.log('===============================================================\n');

console.log('🚀 Cigar Lounge Bot (Local Polling) is starting...');
bot.launch().then(() => {
    console.log('✅ Bot is running! Go to Telegram and message it.');
});

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
