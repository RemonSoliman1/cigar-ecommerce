import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

export async function POST(request) {
    try {
        const formData = await request.formData();
        const file = formData.get('file');

        if (!file) {
            return NextResponse.json({ success: false, error: 'No file uploaded' }, { status: 400 });
        }

        // 1. Validate File
        if (file.size > 5 * 1024 * 1024) { // 5MB limit
            return NextResponse.json({ success: false, error: 'File too large (max 5MB)' }, { status: 400 });
        }

        const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml'];
        if (!validTypes.includes(file.type)) {
            return NextResponse.json({ success: false, error: 'Invalid file type. Ensure you are uploading a supported image or SVG.' }, { status: 400 });
        }

        // 2. Generate Path
        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
        const filePath = `products/${fileName}`;

        // 3. Upload via Admin Client (Bypasses RLS)
        // Note: formData file is a File/Blob object. Supabase js client accepts it directly.

        if (!supabaseAdmin) {
            throw new Error('Server misconfiguration: Admin client not available');
        }

        const { data, error } = await supabaseAdmin.storage
            .from('product-images')
            .upload(filePath, file, {
                contentType: file.type,
                upsert: false
            });

        if (error) throw error;

        // 4. Get Public URL
        const { data: { publicUrl } } = supabaseAdmin.storage
            .from('product-images')
            .getPublicUrl(filePath);

        return NextResponse.json({ success: true, url: publicUrl });

    } catch (error) {
        console.error('Upload Error:', error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
