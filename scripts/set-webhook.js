const https = require('https');
require('dotenv').config({ path: '.env.local' });

const token = process.env.TELEGRAM_BOT_TOKEN;
const url = process.argv[2]; // Get URL from command line argument

if (!token) {
    console.error('❌ Error: TELEGRAM_BOT_TOKEN is missing in .env.local');
    process.exit(1);
}

if (!url) {
    console.error('❌ Error: Please provide your Vercel URL as an argument.');
    console.error('Usage: node scripts/set-webhook.js https://your-project.vercel.app');
    process.exit(1);
}

// Ensure URL ends with the webhook path
const webhookUrl = url.endsWith('/')
    ? `${url}api/telegram/webhook`
    : `${url}/api/telegram/webhook`;

console.log(`🔗 Setting webhook to: ${webhookUrl}`);

const apiUrl = `https://api.telegram.org/bot${token}/setWebhook?url=${webhookUrl}`;

https.get(apiUrl, (res) => {
    let data = '';

    res.on('data', (chunk) => {
        data += chunk;
    });

    res.on('end', () => {
        const response = JSON.parse(data);
        if (response.ok) {
            console.log('✅ Webhook set successfully!');
            console.log(response.description);
        } else {
            console.error('❌ Failed to set webhook:');
            console.error(response);
        }
    });

}).on('error', (err) => {
    console.error('Error making request:', err.message);
});
