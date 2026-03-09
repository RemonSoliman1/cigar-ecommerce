'use client';
import { useEffect, useState } from 'react';

export default function DebugPage() {
    const [status, setStatus] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('/api/debug/env')
            .then(res => res.json())
            .then(data => {
                setStatus(data);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    }, []);

    if (loading) return <div style={{ padding: '2rem' }}>Checking System Health...</div>;

    if (!status) return <div>Failed to load status.</div>;

    const getIcon = (val) => val ? '✅' : '❌';
    const getColor = (val) => val ? 'green' : 'red';

    return (
        <div style={{ padding: '2rem', fontFamily: 'monospace', maxWidth: '600px', margin: '0 auto' }}>
            <h1>System Diagnostic</h1>
            <div style={{ border: '1px solid #ccc', padding: '1rem', borderRadius: '8px' }}>
                <p><strong>Node Env:</strong> {status.node_env}</p>
                <p><strong>Site URL:</strong> {status.site_url}</p>
                <hr />
                <h3>Server-Side Keys (Vercel Env Vars)</h3>
                <ul style={{ listStyle: 'none', padding: 0 }}>
                    <li style={{ color: getColor(status.telegram_bot_token) }}>
                        {getIcon(status.telegram_bot_token)} TELEGRAM_BOT_TOKEN
                    </li>
                    <li style={{ color: getColor(status.telegram_chat_id) }}>
                        {getIcon(status.telegram_chat_id)} TELEGRAM_ADMIN_CHAT_ID
                    </li>
                    <li style={{ color: getColor(status.resend_api_key) }}>
                        {getIcon(status.resend_api_key)} RESEND_API_KEY
                    </li>
                    <li style={{ color: getColor(status.supabase_url) }}>
                        {getIcon(status.supabase_url)} NEXT_PUBLIC_SUPABASE_URL
                    </li>
                    <li style={{ color: getColor(status.supabase_key) }}>
                        {getIcon(status.supabase_key)} NEXT_PUBLIC_SUPABASE_ANON_KEY
                    </li>
                </ul>
            </div>
            <p style={{ marginTop: '1rem', color: '#666' }}>
                If any of these are ❌, you need to add them in Vercel Dashboard {'>'} Settings {'>'} Environment Variables.
            </p>
        </div>
    );
}
