
const fs = require('fs');
const path = require('path');

// Read JSON
const productsPath = path.join(__dirname, '../data/products.json');
const products = JSON.parse(fs.readFileSync(productsPath, 'utf8'));

let sql = `-- Seed Products Data\n`;
sql += `TRUNCATE TABLE products;\n`; // Clear existing if any

products.forEach(p => {
    // Escape single quotes in text fields
    const escape = (str) => str ? str.replace(/'/g, "''") : '';

    const id = escape(p.id);
    const brandId = escape(p.brandId);
    const name = escape(p.name);
    const type = escape(p.type);
    const series = escape(p.series || '');
    const description = escape(p.description);
    const strength = escape(p.strength || '');
    const rating = p.rating || 0;
    const image = escape(p.image);
    const category = escape(p.category || '');
    const isNew = p.new ? 'true' : 'false';

    // Arrays/JSON
    const flavorProfile = p.flavor_profile
        ? `ARRAY['${p.flavor_profile.map(f => escape(f)).join("','")}']`
        : 'NULL';

    const models = JSON.stringify(p.models || []);

    sql += `INSERT INTO products (id, brand_id, name, type, series, description, strength, flavor_profile, rating, image, category, is_new, models) VALUES (
'${id}', '${brandId}', '${name}', '${type}', '${series}', '${description}', '${strength}', ${flavorProfile}, ${rating}, '${image}', '${category}', ${isNew}, '${models}'::jsonb
);\n`;
});

// Write to file
const outputPath = path.join(__dirname, '../seed_products.sql');
fs.writeFileSync(outputPath, sql);

console.log(`✅ Generated SQL seed file at ${outputPath}`);
