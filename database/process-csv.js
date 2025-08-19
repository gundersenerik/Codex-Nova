#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Process the CSV file
function processCSV() {
    // Read the CSV file with proper encoding
    const csvPath = path.join(__dirname, '..', 'assets', 'Codex Nova Database - Products&Rateplans (1).csv');
    const csvContent = fs.readFileSync(csvPath, 'utf-8');
    
    // Parse CSV
    const lines = csvContent.split('\n');
    const headers = lines[0].split(',').map(h => h.trim());
    
    // Fix header names
    const headerMap = {
        'Brand ': 'Brandname',
        'Country': 'Country',
        'Brand Prefix': 'Brand Prefix',
        'Product': 'Product',
        'Product Prefix': 'Product Prefix',
        'Standard Promocode': 'Standard Promocode',
        'Product Type': 'Product Type'
    };
    
    const brands = new Map();
    const products = new Map(); // Use Map to avoid duplicates
    const ratePlans = [];
    
    // Rate plan mapping
    const ratePlanMapping = {
        'Rate Plan Week': { code: 'W', name: 'Week' },
        'Rate Plan Month': { code: 'M', name: 'Month' },
        'Rate Plan Quarter': { code: 'Q', name: 'Quarter' },
        'Rate Plan 6 months': { code: 'H', name: '6 months' },
        'Rate Plan Year': { code: 'Y', name: 'Year' },
        'Rate Plan Year/month': { code: 'YM', name: 'Year/month' },
        'Rate plan 6-month/month': { code: 'HM', name: '6-month/month' },
        'Rate plan quarter/month': { code: 'QM', name: 'Quarter/month' },
        'Rate Plan Day': { code: 'D', name: 'Day' },
        'In-app 3 mån': { code: 'APP_3M', name: 'In-app 3 months' },
        'in-app 6 mån': { code: 'APP_6M', name: 'In-app 6 months' },
        'Pub 1500': { code: 'PUB_1500', name: 'Pub 1500' },
        'Pub 2000': { code: 'PUB_2000', name: 'Pub 2000' },
        'B2B Year': { code: 'B2B_Y', name: 'B2B Year' },
        'Övriga Sverige Månad': { code: 'SE_OS_M', name: 'Övriga Sverige Monthly' },
        'Övriga Sverige Kvartal': { code: 'SE_OS_Q', name: 'Övriga Sverige Quarterly' },
        'Övriga Sverige Halvår': { code: 'SE_OS_H', name: 'Övriga Sverige Half-year' },
        'Övriga Sverige År': { code: 'SE_OS_Y', name: 'Övriga Sverige Yearly' },
        'Sthlm Månad': { code: 'SE_ST_M', name: 'Stockholm Monthly' },
        'Sthlm Kvartal': { code: 'SE_ST_Q', name: 'Stockholm Quarterly' },
        'Sthlm Halvår': { code: 'SE_ST_H', name: 'Stockholm Half-year' },
        'Sthlm År': { code: 'SE_ST_Y', name: 'Stockholm Yearly' },
        'Företag År': { code: 'FO_Y', name: 'Företag Year' }
    };
    
    // Process each row
    for (let i = 1; i < lines.length; i++) {
        if (!lines[i].trim()) continue;
        
        const values = lines[i].split(',');
        const row = {};
        
        headers.forEach((header, index) => {
            row[header] = values[index]?.trim() || '';
        });
        
        // Extract brand
        const brandCode = row['Brand Prefix'];
        const brandName = row['Brand'] || row['Brand '];  // Try both with and without space
        const country = row['Country'];
        
        if (brandCode && brandName && !brands.has(brandCode)) {
            brands.set(brandCode, {
                code: brandCode,
                name: brandName.trim(),
                country: country
            });
        }
        
        // Extract product
        if (brandCode && row['Product']) {
            const productKey = `${brandCode}|${row['Product']}`;
            const productPrefix = row['Product Prefix']?.trim() || brandCode;
            
            if (!products.has(productKey)) {
                products.set(productKey, {
                    brand_code: brandCode,
                    name: row['Product'],
                    type: (row['Product Type'] || 'digital').toLowerCase(),
                    shortcode: productPrefix
                });
            }
            
            // Extract rate plans
            Object.entries(ratePlanMapping).forEach(([columnName, mapping]) => {
                const price = row[columnName];
                if (price && price !== 'N/A' && price !== '') {
                    const numericPrice = parseInt(price.toString().replace(/[^0-9]/g, ''));
                    if (!isNaN(numericPrice)) {
                        ratePlans.push({
                            brand_code: brandCode,
                            product_name: row['Product'],
                            rate_code: mapping.code,
                            rate_name: mapping.name,
                            price: numericPrice
                        });
                    }
                }
            });
        }
    }
    
    // Convert products Map to array
    const productsArray = Array.from(products.values());
    
    // Generate SQL
    let sql = `-- ============================================================================
-- CODEX NOVA DATABASE IMPORT
-- Generated: ${new Date().toISOString()}
-- Brands: ${brands.size}
-- Products: ${productsArray.length}
-- Rate Plans: ${ratePlans.length}
-- ============================================================================

-- STEP 1: BACKUP EXISTING DATA
CREATE TABLE IF NOT EXISTS brands_backup_${Date.now()} AS SELECT * FROM brands;
CREATE TABLE IF NOT EXISTS products_backup_${Date.now()} AS SELECT * FROM products;
CREATE TABLE IF NOT EXISTS rate_plans_backup_${Date.now()} AS SELECT * FROM rate_plans;

-- STEP 2: CLEAR EXISTING DATA
DELETE FROM rate_plans;
DELETE FROM products;
DELETE FROM brands;

-- STEP 3: INSERT BRANDS
`;
    
    brands.forEach(brand => {
        sql += `INSERT INTO brands (code, name, country) VALUES ('${brand.code}', '${brand.name.replace(/'/g, "''")}', '${brand.country}');\n`;
    });
    
    sql += `\n-- STEP 4: INSERT PRODUCTS\n`;
    productsArray.forEach(product => {
        const productName = product.name.replace(/'/g, "''");
        sql += `INSERT INTO products (brand_id, name, type, shortcode) VALUES ((SELECT id FROM brands WHERE code = '${product.brand_code}'), '${productName}', '${product.type}', '${product.shortcode}');\n`;
    });
    
    sql += `\n-- STEP 5: INSERT RATE PLANS\n`;
    ratePlans.forEach(plan => {
        const productName = plan.product_name.replace(/'/g, "''");
        sql += `INSERT INTO rate_plans (product_id, code, name, price, category) VALUES ((SELECT p.id FROM products p JOIN brands b ON p.brand_id = b.id WHERE b.code = '${plan.brand_code}' AND p.name = '${productName}'), '${plan.rate_code}', '${plan.rate_name}', ${plan.price}, 'standard');\n`;
    });
    
    // Save SQL file
    const outputPath = path.join(__dirname, 'codex-nova-import.sql');
    fs.writeFileSync(outputPath, sql);
    
    console.log(`✅ SQL import file generated: ${outputPath}`);
    console.log(`   - Brands: ${brands.size}`);
    console.log(`   - Products: ${productsArray.length}`);
    console.log(`   - Rate Plans: ${ratePlans.length}`);
    
    // Also save a summary
    const summary = {
        brands: Array.from(brands.values()),
        productCount: productsArray.length,
        ratePlanCount: ratePlans.length,
        productsByBrand: {}
    };
    
    productsArray.forEach(p => {
        if (!summary.productsByBrand[p.brand_code]) {
            summary.productsByBrand[p.brand_code] = 0;
        }
        summary.productsByBrand[p.brand_code]++;
    });
    
    const summaryPath = path.join(__dirname, 'import-summary.json');
    fs.writeFileSync(summaryPath, JSON.stringify(summary, null, 2));
    console.log(`📊 Summary saved: ${summaryPath}`);
}

// Run the processor
processCSV();