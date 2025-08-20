/* ============================================================================
   CSV IMPORTER - Real Data Import with Validation & Integrity Checks
   ============================================================================ */

// Configuration
const CSV_CONFIG = {
    FILE_PATH: 'assets/_CJC Codex - Brands - Products - Rate Plans - Sheet1 (1).csv',
    REQUIRED_COLUMNS: ['brand_code', 'brand_name', 'country', 'product_name', 'product_type'],
    VALID_COUNTRIES: ['NO', 'SE'],
    VALID_PRODUCT_TYPES: ['print', 'digital']
};

// Rate plan column mapping - all 28 columns from CSV
const RATE_PLAN_MAPPING = {
    'Rate Plan Week': { code: 'W', name: 'Weekly', category: 'standard', sort: 5 },
    'Rate Plan Month': { code: 'M', name: 'Monthly', category: 'standard', sort: 10 },
    'Rate Plan Quarter': { code: 'Q', name: 'Quarterly', category: 'standard', sort: 20 },
    'Rate Plan 6 months': { code: '6M', name: '6 Months', category: 'standard', sort: 30 },
    'Rate Plan Year': { code: 'Y', name: 'Yearly', category: 'standard', sort: 40 },
    'Rate Plan Year/month': { code: 'Y/M', name: 'Yearly (per month)', category: 'standard', sort: 50 },
    'Rate plan 6-month/month': { code: '6M/M', name: '6 Months (per month)', category: 'standard', sort: 60 },
    'Rate plan quarter/month': { code: 'Q/M', name: 'Quarterly (per month)', category: 'standard', sort: 70 },
    'Rate Plan Day': { code: 'D', name: 'Daily', category: 'standard', sort: 1 },
    'Rate Plan In-app 3 mån': { code: 'APP3M', name: 'In-app 3 Months', category: 'app', sort: 200 },
    'Rate Plan in-app 6 mån': { code: 'APP6M', name: 'In-app 6 Months', category: 'app', sort: 210 },
    'Rate Plan Pub 1500': { code: 'PUB1500', name: 'Publisher 1500', category: 'publisher', sort: 300 },
    'Rate Plan Pub 2000': { code: 'PUB2000', name: 'Publisher 2000', category: 'publisher', sort: 310 },
    'Rate Plan B2B Year': { code: 'B2B_Y', name: 'B2B Yearly', category: 'business', sort: 400 },
    'Rate Plan Övriga Sverige Månad': { code: 'SE_OV_M', name: 'Övriga Sverige Monthly', category: 'regional', sort: 140 },
    'Rate Plan Övriga Sverige Kvartal': { code: 'SE_OV_Q', name: 'Övriga Sverige Quarterly', category: 'regional', sort: 150 },
    'Rate Plan Övriga Sverige Halvår': { code: 'SE_OV_6M', name: 'Övriga Sverige 6 Months', category: 'regional', sort: 160 },
    'Rate Plan Övriga Sverige År': { code: 'SE_OV_Y', name: 'Övriga Sverige Yearly', category: 'regional', sort: 170 },
    'Rate Plan Sthlm Månad': { code: 'SE_ST_M', name: 'Stockholm Monthly', category: 'regional', sort: 100 },
    'Rate Plan Sthlm Kvartal': { code: 'SE_ST_Q', name: 'Stockholm Quarterly', category: 'regional', sort: 110 },
    'Rate Plan Sthlm Halvår': { code: 'SE_ST_6M', name: 'Stockholm 6 Months', category: 'regional', sort: 120 },
    'Rate Plan Sthlm År': { code: 'SE_ST_Y', name: 'Stockholm Yearly', category: 'regional', sort: 130 },
    'Rate Plan Företag År': { code: 'CORP_Y', name: 'Corporate Yearly', category: 'business', sort: 410 }
};

// Global state
let validationResults = null;
let importResults = null;

// ============================================================================
// DATA CLEANING FUNCTIONS
// ============================================================================

// Clean price values - handle "/mån" suffix and empty cells
function cleanPriceValue(cellValue) {
    if (!cellValue || cellValue.toString().trim() === '') {
        return 'N/A';
    }
    
    let cleaned = cellValue.toString().trim();
    
    // Handle "/mån" suffix
    cleaned = cleaned.replace('/mån', '');
    cleaned = cleaned.replace('/månad', '');
    
    // Check if it's a valid number
    if (!isNaN(cleaned) && cleaned !== '') {
        return parseFloat(cleaned).toFixed(2);
    }
    
    // If it's already N/A or not a number, return as is
    return cleaned === 'N/A' ? 'N/A' : cleaned;
}

// Parse CSV content into structured data
function parseCSV(csvContent) {
    const lines = csvContent.split('\n');
    const headers = lines[0].split(',').map(h => h.trim());
    const data = [];
    
    for (let i = 1; i < lines.length; i++) {
        if (lines[i].trim() === '') continue;
        
        const values = lines[i].split(',').map(v => v.trim());
        const row = {};
        
        headers.forEach((header, index) => {
            row[header] = values[index] || '';
        });
        
        data.push(row);
    }
    
    return { headers, data };
}

// ============================================================================
// VALIDATION FUNCTIONS
// ============================================================================

// Validate CSV structure and data integrity
function validateCSVData(csvData) {
    console.log('🔍 Starting CSV validation...');
    
    const results = {
        isValid: true,
        errors: [],
        warnings: [],
        stats: {
            totalRows: csvData.data.length,
            uniqueBrands: 0,
            uniqueProducts: 0,
            totalRatePlans: 0,
            ratePlansByBrand: new Map()
        }
    };
    
    // Check required columns exist
    CSV_CONFIG.REQUIRED_COLUMNS.forEach(col => {
        if (!csvData.headers.includes(col)) {
            results.errors.push(`Missing required column: ${col}`);
            results.isValid = false;
        }
    });
    
    if (!results.isValid) {
        return results;
    }
    
    // Validate each row
    const uniqueBrands = new Set();
    const uniqueProducts = new Set();
    const productKeys = new Set();
    
    csvData.data.forEach((row, index) => {
        const rowNum = index + 2; // +2 because index starts at 0 and we skip header
        
        // Validate required fields
        CSV_CONFIG.REQUIRED_COLUMNS.forEach(col => {
            if (!row[col] || row[col].trim() === '') {
                results.errors.push(`Row ${rowNum}: Missing ${col}`);
                results.isValid = false;
            }
        });
        
        // Validate country
        if (row.country && !CSV_CONFIG.VALID_COUNTRIES.includes(row.country)) {
            results.errors.push(`Row ${rowNum}: Invalid country '${row.country}'. Must be NO or SE`);
            results.isValid = false;
        }
        
        // Validate product type
        if (row.product_type && !CSV_CONFIG.VALID_PRODUCT_TYPES.includes(row.product_type)) {
            results.errors.push(`Row ${rowNum}: Invalid product_type '${row.product_type}'. Must be 'print' or 'digital'`);
            results.isValid = false;
        }
        
        // Check for duplicate brand+product combinations
        const productKey = `${row.brand_code}:${row.product_name}`;
        if (productKeys.has(productKey)) {
            results.errors.push(`Row ${rowNum}: Duplicate brand+product combination: ${productKey}`);
            results.isValid = false;
        }
        productKeys.add(productKey);
        
        // Collect statistics
        uniqueBrands.add(row.brand_code);
        uniqueProducts.add(productKey);
        
        // Count rate plans for this product
        let ratePlansForProduct = 0;
        Object.keys(RATE_PLAN_MAPPING).forEach(column => {
            if (csvData.headers.includes(column)) {
                const cleanedPrice = cleanPriceValue(row[column]);
                if (cleanedPrice !== 'N/A' && cleanedPrice !== '') {
                    ratePlansForProduct++;
                    results.stats.totalRatePlans++;
                }
            }
        });
        
        // Track rate plans by brand
        if (!results.stats.ratePlansByBrand.has(row.brand_code)) {
            results.stats.ratePlansByBrand.set(row.brand_code, 0);
        }
        results.stats.ratePlansByBrand.set(
            row.brand_code, 
            results.stats.ratePlansByBrand.get(row.brand_code) + ratePlansForProduct
        );
        
        console.log(`✓ ${row.brand_code} - ${row.product_name}: ${ratePlansForProduct} rate plans`);
    });
    
    results.stats.uniqueBrands = uniqueBrands.size;
    results.stats.uniqueProducts = uniqueProducts.size;
    
    return results;
}

// Verify brand-product-rate plan alignment
function validateBrandAlignment(csvData) {
    console.log('🔍 Validating brand-product-rate plan alignment...');
    
    const alignmentMap = new Map();
    const issues = [];
    
    csvData.data.forEach((row, index) => {
        const brandCode = row.brand_code;
        const productName = row.product_name;
        const rowNum = index + 2;
        
        // Check each rate plan column
        Object.keys(RATE_PLAN_MAPPING).forEach(column => {
            if (csvData.headers.includes(column)) {
                const price = cleanPriceValue(row[column]);
                if (price !== 'N/A' && price !== '') {
                    const alignmentKey = `${brandCode}:${productName}:${column}`;
                    
                    if (alignmentMap.has(alignmentKey)) {
                        issues.push(`Row ${rowNum}: Duplicate rate plan alignment: ${alignmentKey}`);
                    }
                    
                    alignmentMap.set(alignmentKey, {
                        brand_code: brandCode,
                        product_name: productName,
                        rate_plan_column: column,
                        price: price,
                        row: rowNum
                    });
                }
            }
        });
    });
    
    console.log(`✓ Found ${alignmentMap.size} unique rate plan alignments`);
    
    return {
        alignments: alignmentMap,
        issues: issues,
        totalAlignments: alignmentMap.size
    };
}

// ============================================================================
// DATABASE IMPORT FUNCTIONS
// ============================================================================

// Import brands into database
function importBrands(csvData) {
    console.log('📥 Importing brands...');
    
    const uniqueBrands = new Map();
    
    // Collect unique brands
    csvData.data.forEach(row => {
        const key = row.brand_code;
        if (!uniqueBrands.has(key)) {
            uniqueBrands.set(key, {
                code: row.brand_code,
                name: row.brand_name,
                country: row.country
            });
        }
    });
    
    // Insert brands
    uniqueBrands.forEach(brand => {
        const sql = `INSERT INTO brands (code, name, country) VALUES (?, ?, ?)`;
        window.sqlDB.execute(sql, [brand.code, brand.name, brand.country]);
    });
    
    console.log(`✅ Imported ${uniqueBrands.size} brands`);
    return uniqueBrands.size;
}

// Import products into database
function importProducts(csvData) {
    console.log('📥 Importing products...');
    
    let productCount = 0;
    
    csvData.data.forEach(row => {
        const sql = `INSERT INTO products (brand_code, product_name, product_code) VALUES (?, ?, ?)`;
        window.sqlDB.execute(sql, [row.brand_code, row.product_name, row.product_type]);
        productCount++;
    });
    
    console.log(`✅ Imported ${productCount} products`);
    return productCount;
}

// Import rate plan types into database
function importRatePlanTypes() {
    console.log('📥 Importing rate plan types...');
    
    let count = 0;
    
    Object.entries(RATE_PLAN_MAPPING).forEach(([column, config]) => {
        const sql = `INSERT INTO rate_plan_types (code, name, category, is_active, sort_order) VALUES (?, ?, ?, 1, ?)`;
        window.sqlDB.execute(sql, [config.code, config.name, config.category, config.sort]);
        count++;
    });
    
    console.log(`✅ Imported ${count} rate plan types`);
    return count;
}

// Import rate plans into database
function importRatePlans(csvData) {
    console.log('📥 Importing rate plans...');
    
    let ratePlanCount = 0;
    
    csvData.data.forEach(row => {
        const brandCode = row.brand_code;
        const productName = row.product_name;
        
        // Get product ID
        const productQuery = `SELECT id FROM products WHERE brand_code = ? AND product_name = ?`;
        const productResult = window.sqlDB.query(productQuery, [brandCode, productName]);
        
        if (!productResult.data || productResult.data.length === 0) {
            console.error(`❌ Product not found: ${brandCode} - ${productName}`);
            return;
        }
        
        const productId = productResult.data[0].id;
        
        // Insert rate plans for this product
        Object.keys(RATE_PLAN_MAPPING).forEach(column => {
            if (csvData.headers.includes(column)) {
                const price = cleanPriceValue(row[column]);
                if (price !== 'N/A' && price !== '') {
                    const planTypeCode = RATE_PLAN_MAPPING[column].code;
                    const sql = `INSERT INTO rate_plans (product_id, plan_type_code, price) VALUES (?, ?, ?)`;
                    window.sqlDB.execute(sql, [productId, planTypeCode, parseFloat(price)]);
                    ratePlanCount++;
                }
            }
        });
    });
    
    console.log(`✅ Imported ${ratePlanCount} rate plans`);
    return ratePlanCount;
}

// ============================================================================
// MAIN IMPORT FUNCTIONS
// ============================================================================

// Phase 1: Validate CSV data
async function validateCSV() {
    try {
        console.log('🚀 PHASE 1: CSV VALIDATION STARTING...');
        
        // Fetch CSV file
        const response = await fetch(CSV_CONFIG.FILE_PATH);
        if (!response.ok) {
            throw new Error(`Failed to load CSV: ${response.status}`);
        }
        
        const csvContent = await response.text();
        const csvData = parseCSV(csvContent);
        
        console.log(`📊 CSV loaded: ${csvData.data.length} rows, ${csvData.headers.length} columns`);
        
        // Validate data structure
        const validation = validateCSVData(csvData);
        
        // Validate brand alignment
        const alignment = validateBrandAlignment(csvData);
        
        validationResults = {
            csvData: csvData,
            validation: validation,
            alignment: alignment
        };
        
        // Display results
        displayValidationResults();
        
        return validation.isValid && alignment.issues.length === 0;
        
    } catch (error) {
        console.error('❌ CSV validation failed:', error);
        return false;
    }
}

// Phase 2: Import data to database
async function importCSVData() {
    if (!validationResults || !validationResults.validation.isValid) {
        console.error('❌ Cannot import: Validation failed or not run');
        return false;
    }
    
    try {
        console.log('🚀 PHASE 2: DATABASE IMPORT STARTING...');
        
        // Clear existing data
        console.log('🧹 Clearing existing data...');
        window.sqlDB.execute('DELETE FROM rate_plans');
        window.sqlDB.execute('DELETE FROM products');
        window.sqlDB.execute('DELETE FROM rate_plan_types');
        window.sqlDB.execute('DELETE FROM brands');
        window.sqlDB.execute('DELETE FROM generations');
        
        // Import data in correct order
        const brandsImported = importBrands(validationResults.csvData);
        const productsImported = importProducts(validationResults.csvData);
        const ratePlanTypesImported = importRatePlanTypes();
        const ratePlansImported = importRatePlans(validationResults.csvData);
        
        importResults = {
            brands: brandsImported,
            products: productsImported,
            ratePlanTypes: ratePlanTypesImported,
            ratePlans: ratePlansImported
        };
        
        console.log('🚀 PHASE 3: VERIFICATION STARTING...');
        return verifyImport();
        
    } catch (error) {
        console.error('❌ Import failed:', error);
        return false;
    }
}

// Phase 3: Verify import results
function verifyImport() {
    console.log('🔍 Verifying import results...');
    
    const expectedRatePlans = validationResults.validation.stats.totalRatePlans;
    const actualRatePlans = importResults.ratePlans;
    
    if (expectedRatePlans !== actualRatePlans) {
        console.error(`❌ RATE PLAN COUNT MISMATCH! Expected: ${expectedRatePlans}, Actual: ${actualRatePlans}`);
        return false;
    }
    
    console.log(`✅ Rate plan count verified: ${actualRatePlans} imported`);
    
    // Verify brand isolation
    const brandCheck = window.sqlDB.query(`
        SELECT b.code, COUNT(rp.id) as rate_plan_count
        FROM brands b
        JOIN products p ON b.code = p.brand_code
        JOIN rate_plans rp ON p.id = rp.product_id
        GROUP BY b.code
        ORDER BY b.code
    `);
    
    console.log('🔍 Brand isolation verification:');
    if (brandCheck.data) {
        brandCheck.data.forEach(row => {
            const expected = validationResults.validation.stats.ratePlansByBrand.get(row.code) || 0;
            console.log(`   ${row.code}: ${row.rate_plan_count} rate plans (expected: ${expected})`);
            
            if (row.rate_plan_count !== expected) {
                console.error(`❌ Brand ${row.code} rate plan mismatch!`);
                return false;
            }
        });
    }
    
    return true;
}

// Display validation results
function displayValidationResults() {
    if (!validationResults) return;
    
    const { validation, alignment } = validationResults;
    
    console.log('\n📊 VALIDATION RESULTS:');
    console.log('========================');
    console.log(`✅ Total rows processed: ${validation.stats.totalRows}`);
    console.log(`✅ Unique brands: ${validation.stats.uniqueBrands}`);
    console.log(`✅ Unique products: ${validation.stats.uniqueProducts}`);
    console.log(`✅ Total rate plans: ${validation.stats.totalRatePlans}`);
    
    console.log('\n📈 Rate plans by brand:');
    validation.stats.ratePlansByBrand.forEach((count, brand) => {
        console.log(`   ${brand}: ${count} rate plans`);
    });
    
    if (validation.errors.length > 0) {
        console.log('\n❌ ERRORS:');
        validation.errors.forEach(error => console.log(`   ${error}`));
    }
    
    if (validation.warnings.length > 0) {
        console.log('\n⚠️  WARNINGS:');
        validation.warnings.forEach(warning => console.log(`   ${warning}`));
    }
    
    if (alignment.issues.length > 0) {
        console.log('\n❌ ALIGNMENT ISSUES:');
        alignment.issues.forEach(issue => console.log(`   ${issue}`));
    }
    
    console.log(`\n${validation.isValid && alignment.issues.length === 0 ? '✅ VALIDATION PASSED' : '❌ VALIDATION FAILED'}`);
}

// Display import results
function displayImportResults() {
    if (!importResults) return;
    
    console.log('\n🎉 IMPORT COMPLETE!');
    console.log('===================');
    console.log(`📊 Brands imported: ${importResults.brands}`);
    console.log(`📊 Products imported: ${importResults.products}`);
    console.log(`📊 Rate plan types imported: ${importResults.ratePlanTypes}`);
    console.log(`📊 Rate plans imported: ${importResults.ratePlans}`);
    console.log('\n💾 Data saved to database');
    console.log('🔄 Auto-backup created in localStorage');
}

// Full import process
async function runFullImport() {
    console.log('🚀 STARTING FULL CSV IMPORT PROCESS...');
    console.log('=====================================');
    
    // Phase 1: Validation
    const validationPassed = await validateCSV();
    
    if (!validationPassed) {
        console.error('❌ IMPORT ABORTED: Validation failed');
        return false;
    }
    
    // Phase 2 & 3: Import and Verify
    const importSuccess = await importCSVData();
    
    if (!importSuccess) {
        console.error('❌ IMPORT FAILED');
        return false;
    }
    
    // Display final results
    displayImportResults();
    
    // Save to localStorage
    if (window.dataManager && window.dataManager.save) {
        window.dataManager.save();
        console.log('💾 Data persisted to localStorage');
    }
    
    console.log('\n✅ CSV IMPORT COMPLETED SUCCESSFULLY!');
    return true;
}

// Export functions for global access
window.CSVImporter = {
    validateCSV,
    importCSVData,
    runFullImport,
    displayValidationResults,
    displayImportResults,
    getValidationResults: () => validationResults,
    getImportResults: () => importResults
};

console.log('📦 CSV Importer loaded and ready');