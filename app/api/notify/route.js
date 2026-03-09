import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { sendTelegramMessage } from '@/lib/telegram';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request) {
    try {
        const body = await request.json();
        const { orderId, items, total, customer } = body;

        // --- 1. PRO TELEGRAM MESSAGE ---
        let telegramText = `<b>🏛️ CIGAR LOUNGE - NEW ORDER</b>\n`;
        telegramText += `▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬\n`;
        telegramText += `<b>🧾 Order ID:</b> #${orderId}\n`;
        telegramText += `<b>💰 Total:</b> EGP ${total.toLocaleString()}\n\n`;

        telegramText += `<b>📦 Order Details:</b>\n`;
        items.forEach(item => {
            telegramText += `• <b>${item.name}</b>\n`;
            telegramText += `   └ Variant: ${item.selectedSize}\n`;
            telegramText += `   └ Qty: ${item.quantity} x EGP ${item.price}\n`;
        });

        telegramText += `\n<b>👤 Customer Info:</b>\n`;
        telegramText += `<b>Name:</b> ${customer.name}\n`;
        telegramText += `<b>Phone:</b> ${customer.phone}\n`;
        telegramText += `<b>Email:</b> ${customer.email}\n`;
        telegramText += `<b>Address:</b> ${customer.street}, ${customer.city}\n`;
        telegramText += `▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬`;

        // Send Telegram Notification
        await sendTelegramMessage(telegramText);

        // --- 2. PRO EMAIL TEMPLATE ---
        // Basic HTML Email Design
        const emailHtml = `
            <!DOCTYPE html>
            <html>
            <head>
                <style>
                    body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 0; }
                    .container { max-width: 600px; margin: 20px auto; background: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 10px rgba(0,0,0,0.1); }
                    .header { background-color: #1a1a1a; color: #d4af37; padding: 30px; text-align: center; }
                    .header h1 { margin: 0; font-size: 24px; letter-spacing: 2px; text-transform: uppercase; }
                    .content { padding: 30px; color: #333333; line-height: 1.6; }
                    .section { margin-bottom: 25px; border-bottom: 1px solid #eeeeee; padding-bottom: 20px; }
                    .details-table { width: 100%; border-collapse: collapse; margin-top: 15px; }
                    .details-table th { text-align: left; color: #666; font-size: 12px; text-transform: uppercase; padding-bottom: 10px; border-bottom: 2px solid #eee; }
                    .details-table td { padding: 12px 0; border-bottom: 1px solid #eee; }
                    .total-row td { border-top: 2px solid #333; font-weight: bold; font-size: 18px; color: #1a1a1a; padding-top: 15px; }
                    .footer { background-color: #eeeeee; padding: 20px; text-align: center; font-size: 12px; color: #888; }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h1>Cigar Lounge</h1>
                    </div>
                    <div class="content">
                        <div class="section">
                            <h2 style="margin-top: 0; color: #1a1a1a;">New Order #${orderId}</h2>
                            <p>A new order has been placed. Please review the details below.</p>
                        </div>
                        
                        <div class="section">
                            <h3 style="color: #666; font-size: 14px; text-transform: uppercase;">Customer Information</h3>
                            <p style="margin: 5px 0;">
                                <strong>${customer.name}</strong><br>
                                ${customer.street}, ${customer.city}<br>
                                ${customer.phone} | <a href="mailto:${customer.email}">${customer.email}</a>
                            </p>
                        </div>

                        <div class="section">
                            <h3 style="color: #666; font-size: 14px; text-transform: uppercase;">Order Items</h3>
                            <table class="details-table">
                                <thead>
                                    <tr>
                                        <th>Item</th>
                                        <th style="text-align: right;">Qty</th>
                                        <th style="text-align: right;">Price</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    ${items.map(item => `
                                    <tr>
                                        <td>
                                            <span style="font-weight: bold; color: #333;">${item.name}</span><br>
                                            <span style="font-size: 12px; color: #666;">${item.selectedSize}</span>
                                        </td>
                                        <td style="text-align: right;">${item.quantity}</td>
                                        <td style="text-align: right;">EGP ${item.price}</td>
                                    </tr>
                                    `).join('')}
                                    <tr class="total-row">
                                        <td>Total</td>
                                        <td colspan="2" style="text-align: right;">EGP ${total.toLocaleString()}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <div class="footer">
                        &copy; ${new Date().getFullYear()} Cigar Lounge System Notification
                    </div>
                </div>
            </body>
            </html>
        `;

        try {
            await resend.emails.send({
                from: 'Cigar Lounge Orders <onboarding@resend.dev>',
                to: 'remonsabry44@gmail.com',
                subject: `New Order #${orderId} - ${customer.name}`,
                html: emailHtml,
            });
        } catch (emailError) {
            console.error("Resend Error:", emailError);
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Notification API Error:", error);
        return NextResponse.json({ success: false, error: 'Failed to process notifications' }, { status: 500 });
    }
}
