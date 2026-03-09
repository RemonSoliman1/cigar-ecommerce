
import { supabase } from '@/lib/supabaseClient';

export async function GET(request) {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');

    if (!email) {
        return Response.json({ user: null });
    }

    const { data: user, error } = await supabase
        .from('users')
        .select('*')
        .eq('email', email)
        .single();

    if (error || !user) {
        return Response.json({ user: null });
    }

    const { password: _, ...userWithoutPassword } = user;
    return Response.json({ user: userWithoutPassword });
}
