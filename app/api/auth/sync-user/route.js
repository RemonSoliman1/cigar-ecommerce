
import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY; // Using Anon key, assuming RLS allows insert
const supabase = createClient(supabaseUrl, supabaseKey);

export async function POST(request) {
    try {
        const { name, email, dob } = await request.json();

        if (!email) {
            return NextResponse.json({ error: 'Email is required' }, { status: 400 });
        }

        // Check if user exists
        const { data: existing } = await supabase
            .from('customers')
            .select('id')
            .eq('email', email)
            .single();

        if (existing) {
            return NextResponse.json({ success: true, message: 'User already exists', id: existing.id });
        }

        // Insert new user
        const { data, error } = await supabase
            .from('customers')
            .insert([{ name, email, date_of_birth: dob, points: 0, tier: 'Silver' }])
            .select()
            .single();

        if (error) throw error;

        return NextResponse.json({ success: true, user: data });

    } catch (error) {
        console.error("Sync User Error:", error);
        return NextResponse.json({ error: 'Failed to sync user' }, { status: 500 });
    }
}
