
import { supabase } from '@/lib/supabaseClient';

export async function POST(request) {
    try {
        const { email, password } = await request.json();

        // 1. Get User
        const { data: user, error } = await supabase
            .from('users')
            .select('*')
            .eq('email', email)
            .single();

        if (error || !user) {
            return Response.json({ success: false, error: 'Invalid email or password' }, { status: 401 });
        }

        // 2. Check Password (Simple check for now)
        if (user.password !== password) {
            return Response.json({ success: false, error: 'Invalid email or password' }, { status: 401 });
        }

        // 3. Return User Data (exclude password)
        const { password: _, ...userWithoutPassword } = user;

        return Response.json({ success: true, user: userWithoutPassword });

    } catch (error) {
        return Response.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
    }
}
