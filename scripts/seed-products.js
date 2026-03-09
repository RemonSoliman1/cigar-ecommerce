const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

function getEnvVars() {
    try {
        const envPath = path.join(__dirname, '..', '.env.local');
        if (fs.existsSync(envPath)) {
            const data = fs.readFileSync(envPath, 'utf8');
            const vars = {};
            data.split('\n').forEach(line => {
                const [key, value] = line.split('=');
                if (key && value) {
                    vars[key.trim()] = value.trim();
                }
            });
            return vars;
        }
    } catch (e) {
        console.error('Could not read .env.local', e);
    }
    return {};
}

const env = getEnvVars();
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_KEY) {
    console.error('Error: Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local');
    process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const productsPath = path.join(__dirname, '..', 'data', 'products.json');
const products = JSON.parse(fs.readFileSync(productsPath, 'utf8'));

async function seedProducts() {
    console.log(`Preparing to upload ${products.length} products...`);

    for (const product of products) {
        const price = product.models && product.models.length > 0 ? product.models[0].price : 0;

        const payload = {
            slug: product.id,
            Name: product.name,
            Price: price,
            description: product.description,
            image_url: product.image,
            brand_id: product.brandId,
            type: product.type,
            strength: product.strength,
            flavor_profile: product.flavor_profile,
            rating: product.rating,
            is_new: product.new || false
        };

        // Check if product with this slug exists
        const { data: existing, error: fetchError } = await supabase
            .from('products')
            .select('id')
            .eq('slug', product.id)
            .maybeSingle(); // Use maybeSingle to avoid error if 0 rows

        if (fetchError) {
            console.error(`Error checking ${product.name}:`, fetchError.message);
            continue;
        }

        let error;
        if (existing) {
            // Update
            const { error: updateError } = await supabase
                .from('products')
                .update(payload)
                .eq('slug', product.id);
            error = updateError;
            if (!error) console.log(`Updated: ${product.name}`);
        } else {
            // Insert
            const { error: insertError } = await supabase
                .from('products')
                .insert([payload]);
            error = insertError;
            if (!error) console.log(`Created: ${product.name}`);
        }

        if (error) {
            console.error(`Failed to upload ${product.name}:`, error.message);
        }
    }

    console.log('Seeding complete.');
}

seedProducts();
