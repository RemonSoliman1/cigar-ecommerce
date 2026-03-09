export async function sendTelegramMessage(text, targetChatId = null) {
    const token = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = targetChatId || process.env.TELEGRAM_ADMIN_CHAT_ID;

    if (!token || !chatId) {
        console.error("Telegram credentials missing");
        return;
    }

    const url = `https://api.telegram.org/bot${token}/sendMessage`;

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                chat_id: chatId,
                text: text,
                parse_mode: 'HTML',
            }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error("Telegram API Error:", errorData);
        }
    } catch (error) {
        console.error("Failed to send Telegram message:", error);
    }
}
