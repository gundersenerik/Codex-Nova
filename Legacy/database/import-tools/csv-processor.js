/* ============================================================================
   CSV PROCESSOR - Codex Nova Database Import
   ============================================================================ */

class CodexNovaCSVProcessor {
    constructor() {
        // Rate plan column to code mapping
        this.ratePlanMapping = {
            'Rate Plan Week': { code: 'W', name: 'Week', category: 'standard' },
            'Rate Plan Month': { code: 'M', name: 'Month', category: 'standard' },
            'Rate Plan Quarter': { code: 'Q', name: 'Quarter', category: 'standard' },
            'Rate Plan 6 months': { code: 'H', name: '6 months', category: 'standard' },
            'Rate Plan Year': { code: 'Y', name: 'Year', category: 'standard' },
            'Rate Plan Year/month': { code: 'YM', name: 'Year/month', category: 'standard' },
            'Rate plan 6-month/month': { code: 'HM', name: '6-month/month', category: 'standard' },
            'Rate plan quarter/month': { code: 'QM', name: 'Quarter/month', category: 'standard' },
            'Rate Plan Day': { code: 'D', name: 'Day', category: 'standard' },
            'In-app 3 mån': { code: 'APP_3M', name: 'In-app 3 months', category: 'app' },
            'in-app 6 mån': { code: 'APP_6M', name: 'In-app 6 months', category: 'app' },
            'Pub 1500': { code: 'PUB_1500', name: 'Pub 1500', category: 'business' },
            'Pub 2000': { code: 'PUB_2000', name: 'Pub 2000', category: 'business' },
            'B2B Year': { code: 'B2B_Y', name: 'B2B Year', category: 'business' },
            'Övriga Sverige Månad': { code: 'SE_OS_M', name: 'Övriga Sverige Monthly', category: 'regional' },
            'Övriga Sverige Kvartal': { code: 'SE_OS_Q', name: 'Övriga Sverige Quarterly', category: 'regional' },
            'Övriga Sverige Halvår': { code: 'SE_OS_H', name: 'Övriga Sverige Half-year', category: 'regional' },
            'Övriga Sverige År': { code: 'SE_OS_Y', name: 'Övriga Sverige Yearly', category: 'regional' },
            'Sthlm Månad': { code: 'SE_ST_M', name: 'Stockholm Monthly', category: 'regional' },
            'Sthlm Kvartal': { code: 'SE_ST_Q', name: 'Stockholm Quarterly', category: 'regional' },
            'Sthlm Halvår': { code: 'SE_ST_H', name: 'Stockholm Half-year', category: 'regional' },
            'Sthlm År': { code: 'SE_ST_Y', name: 'Stockholm Yearly', category: 'regional' },
            'Företag År': { code: 'FO_Y', name: 'Företag Year', category: 'business' }
        };
        
        this.brands = new Map();
        this.products = [];
        this.ratePlans = [];
        this.errors = [];
        this.warnings = [];
        this.stats = {
            totalRows: 0,
            brandsFound: 0,
            productsProcessed: 0,
            ratePlansCreated: 0,
            ratePlansSkipped: 0,
            productsUsingFallback: 0
        };
    }
    
    parseCSV(csvContent) {
        const lines = csvContent.split('\n');
        const headers = lines[0].split(',').map(h => h.trim());
        const data = [];
        
        for (let i = 1; i < lines.length; i++) {
            if (!lines[i].trim()) continue;
            
            const values = this.parseCSVLine(lines[i]);
            const row = {};
            
            headers.forEach((header, index) => {
                row[header] = values[index]?.trim() || '';
            });
            
            data.push(row);
        }
        
        this.stats.totalRows = data.length;
        return data;
    }
    
    parseCSVLine(line) {
        const values = [];
        let current = '';
        let inQuotes = false;
        
        for (let i = 0; i < line.length; i++) {
            const char = line[i];
            
            if (char === '"') {
                inQuotes = !inQuotes;
            } else if (char === ',' && !inQuotes) {
                values.push(current);
                current = '';
            } else {
                current += char;
            }
        }
        values.push(current);
        
        return values;
    }
    
    processData(csvContent) {
        const data = this.parseCSV(csvContent);
        
        // Process each row
        data.forEach((row, index) => {
            // Fix known data issues
            this.fixDataIssues(row, index);
            
            // Extract brand
            this.extractBrand(row);
            
            // Extract product
            this.extractProduct(row, index);
            
            // Extract rate plans
            this.extractRatePlans(row, index);
        });
        
        // Calculate statistics
        this.stats.brandsFound = this.brands.size;
        this.stats.productsProcessed = this.products.length;
        
        return {
            brands: Array.from(this.brands.values()),
            products: this.products,
            ratePlans: this.ratePlans,
            errors: this.errors,
            warnings: this.warnings,
            stats: this.stats
        };
    }
    
    fixDataIssues(row, index) {
        // Fix known issue: AB-D16 should be AP-D16
        if (row['Product'] === 'Aftenposten mandag til lørdag' && 
            row['Standard promocode'] === 'AB-D16') {
            row['Standard promocode'] = 'AP-D16';
            this.warnings.push(`Row ${index + 2}: Fixed promocode AB-D16 → AP-D16 for Aftenposten product`);
        }
    }
    
    extractBrand(row) {
        const code = row['Brand Prefix'];
        const name = row['Brandname'];
        const country = row['Country'];
        
        if (!code || !name) return;
        
        if (!this.brands.has(code)) {
            this.brands.set(code, {
                code: code,
                name: name.trim(),
                country: country || 'NO'
            });
        }
    }
    
    extractProduct(row, index) {
        const brandCode = row['Brand Prefix'];
        const productName = row['Product'];
        const productPrefix = row['Product Prefix']?.trim();
        const productType = row['Product Type'];
        const standardPromocode = row['Standard promocode'];
        
        if (!brandCode || !productName) {
            this.errors.push(`Row ${index + 2}: Missing brand or product name`);
            return;
        }
        
        // Use product prefix if available, otherwise use brand prefix
        const shortcode = productPrefix || brandCode;
        
        if (!productPrefix) {
            this.stats.productsUsingFallback++;
            this.warnings.push(`Row ${index + 2}: Product "${productName}" using brand prefix "${brandCode}" as fallback`);
        }
        
        // Validate standard promocode format
        const expectedStart = `${brandCode}-${shortcode}`;
        if (standardPromocode && !standardPromocode.startsWith(expectedStart)) {
            this.warnings.push(`Row ${index + 2}: Promocode mismatch. Expected to start with "${expectedStart}" but got "${standardPromocode}"`);
        }
        
        this.products.push({
            brand_code: brandCode,
            name: productName,
            type: (productType || 'digital').toLowerCase(),
            shortcode: shortcode,
            standard_promocode: standardPromocode,
            row_index: index + 2
        });
    }
    
    extractRatePlans(row, index) {
        const brandCode = row['Brand Prefix'];
        const productName = row['Product'];
        
        if (!brandCode || !productName) return;
        
        // Process each rate plan column
        Object.entries(this.ratePlanMapping).forEach(([columnName, mapping]) => {
            const price = row[columnName];
            
            // Skip N/A, empty, or invalid values
            if (!price || price === 'N/A' || price === 'n/a' || price === '') {
                this.stats.ratePlansSkipped++;
                return;
            }
            
            // Parse price as number
            const numericPrice = parseInt(price.toString().replace(/[^0-9]/g, ''));
            
            if (isNaN(numericPrice)) {
                this.warnings.push(`Row ${index + 2}: Invalid price "${price}" for ${columnName}`);
                return;
            }
            
            this.ratePlans.push({
                brand_code: brandCode,
                product_name: productName,
                rate_code: mapping.code,
                rate_name: mapping.name,
                price: numericPrice,
                category: mapping.category,
                row_index: index + 2
            });
            
            this.stats.ratePlansCreated++;
        });
    }
    
    generateSQL() {
        let sql = '';
        
        // Header
        sql += `-- ============================================================================
-- CODEX NOVA DATABASE IMPORT
-- Generated: ${new Date().toISOString()}
-- Brands: ${this.brands.size}
-- Products: ${this.products.length}
-- Rate Plans: ${this.ratePlans.length}
-- ============================================================================

`;
        
        // Backup existing data
        sql += `-- STEP 1: BACKUP EXISTING DATA
-- ============================================================================
CREATE TABLE IF NOT EXISTS brands_backup_${Date.now()} AS SELECT * FROM brands;
CREATE TABLE IF NOT EXISTS products_backup_${Date.now()} AS SELECT * FROM products;
CREATE TABLE IF NOT EXISTS rate_plans_backup_${Date.now()} AS SELECT * FROM rate_plans;

`;
        
        // Clear existing data
        sql += `-- STEP 2: CLEAR EXISTING DATA
-- ============================================================================
DELETE FROM rate_plans;
DELETE FROM products;
DELETE FROM brands;

`;
        
        // Insert brands
        sql += `-- STEP 3: INSERT BRANDS (${this.brands.size} brands)
-- ============================================================================
`;
        this.brands.forEach(brand => {
            sql += `INSERT INTO brands (code, name, country) VALUES ('${brand.code}', '${brand.name.replace(/'/g, "''")}', '${brand.country}');\n`;
        });
        sql += '\n';
        
        // Insert products
        sql += `-- STEP 4: INSERT PRODUCTS (${this.products.length} products)
-- ============================================================================
`;
        this.products.forEach(product => {
            const productName = product.name.replace(/'/g, "''");
            sql += `INSERT INTO products (brand_id, name, type, shortcode) VALUES `;
            sql += `((SELECT id FROM brands WHERE code = '${product.brand_code}'), '${productName}', '${product.type}', '${product.shortcode}');\n`;
        });
        sql += '\n';
        
        // Insert rate plans
        sql += `-- STEP 5: INSERT RATE PLANS (${this.ratePlans.length} rate plans)
-- ============================================================================
`;
        
        // Group rate plans by product for better organization
        const ratePlansByProduct = {};
        this.ratePlans.forEach(rp => {
            const key = `${rp.brand_code}|${rp.product_name}`;
            if (!ratePlansByProduct[key]) {
                ratePlansByProduct[key] = [];
            }
            ratePlansByProduct[key].push(rp);
        });
        
        Object.entries(ratePlansByProduct).forEach(([key, plans]) => {
            const [brandCode, productName] = key.split('|');
            sql += `-- ${brandCode} - ${productName}\n`;
            
            plans.forEach(plan => {
                const productNameEscaped = plan.product_name.replace(/'/g, "''");
                sql += `INSERT INTO rate_plans (product_id, code, name, price, category) VALUES `;
                sql += `((SELECT p.id FROM products p JOIN brands b ON p.brand_id = b.id WHERE b.code = '${plan.brand_code}' AND p.name = '${productNameEscaped}'), `;
                sql += `'${plan.rate_code}', '${plan.rate_name}', ${plan.price}, '${plan.category}');\n`;
            });
            sql += '\n';
        });
        
        return sql;
    }
    
    generateReport() {
        return {
            summary: {
                brands: this.brands.size,
                products: this.products.length,
                ratePlans: this.ratePlans.length,
                productsUsingFallback: this.stats.productsUsingFallback,
                errors: this.errors.length,
                warnings: this.warnings.length
            },
            brands: Array.from(this.brands.values()),
            productsByBrand: this.getProductsByBrand(),
            errors: this.errors,
            warnings: this.warnings,
            stats: this.stats
        };
    }
    
    getProductsByBrand() {
        const result = {};
        this.products.forEach(product => {
            if (!result[product.brand_code]) {
                result[product.brand_code] = [];
            }
            result[product.brand_code].push(product);
        });
        return result;
    }
}

// Export for use in browser or Node.js
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CodexNovaCSVProcessor;
}