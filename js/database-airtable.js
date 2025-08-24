/* ============================================================================
   DATABASE SERVICE - Airtable data access layer for promocodes
   ============================================================================ */

// Debug: Check what's available at load time
console.log('🔍 Loading database-airtable.js...');
console.log('🔍 window.ENV exists?', !!window.ENV);
console.log('🔍 window.ENV contents:', window.ENV);

// Load config from environment or use defaults
const AIRTABLE_CONFIG = {
    BASE_ID: window.ENV?.AIRTABLE_BASE_ID || 'UPDATE_CONFIG_JS',
    PERSONAL_ACCESS_TOKEN: window.ENV?.AIRTABLE_TOKEN || 'UPDATE_CONFIG_JS',
    BASE_URL: 'https://api.airtable.com/v0'
};

// Field mappings for Airtable tables - Easy to update if field names change
const FIELD_MAPPINGS = {
    BRANDS: {
        CODE: 'Brand Code',
        NAME: 'Brand Name',
        COUNTRY: 'Country'
    },
    PRODUCTS: {
        NAME: 'Product Name',
        TYPE: 'Product Type',
        CODE: 'Product Code',
        BRAND: 'Brand',  // This is likely a linked record field
        PROMOCODE_ID: 'Promocode ID'
    },
    RATE_PLANS: {
        CODE: 'Plan Code',
        NAME: 'Plan Name',
        PRICE: 'Price',
        CATEGORY: 'Category',
        PRODUCT: 'Product',  // This is likely a linked record field
        PLAN_ID: 'Plan ID'
    }
};

// Table names in Airtable
const TABLE_NAMES = {
    BRANDS: 'Brands',
    PRODUCTS: 'Products',
    RATE_PLANS: 'Rate Plans'
};

// Check if we have valid credentials
const hasValidCredentials = 
    AIRTABLE_CONFIG.BASE_ID !== 'UPDATE_CONFIG_JS' && 
    AIRTABLE_CONFIG.PERSONAL_ACCESS_TOKEN !== 'UPDATE_CONFIG_JS' &&
    AIRTABLE_CONFIG.BASE_ID.startsWith('app');

if (!hasValidCredentials) {
    console.warn('⚠️ Airtable credentials not configured properly!');
    console.warn('BASE_ID:', AIRTABLE_CONFIG.BASE_ID);
    console.warn('Has token?', AIRTABLE_CONFIG.PERSONAL_ACCESS_TOKEN !== 'UPDATE_CONFIG_JS');
    console.warn('Please ensure config.js is loaded before database-airtable.js');
}

// Cache for better performance
let dbCache = {
    brands: null,
    products: {},
    ratePlans: {},
    lastFetch: {}
};

const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

// Mock data for when Airtable is not configured
const MOCK_DATA = {
    brands: [
        { id: '1', code: 'VG', name: 'VG', country: 'NO' },
        { id: '2', code: 'BT', name: 'Bergens Tidende', country: 'NO' },
        { id: '3', code: 'AP', name: 'Aftenposten', country: 'NO' },
        { id: '4', code: 'AB', name: 'Aftonbladet', country: 'SE' },
        { id: '5', code: 'GP', name: 'Göteborgs-Posten', country: 'SE' }
    ],
    products: {
        'VG': [
            { id: '1', brand_id: '1', name: 'VG Total', type: 'subscription', shortcode: 'VGT' },
            { id: '2', brand_id: '1', name: 'VG Pluss', type: 'subscription', shortcode: 'VGP' }
        ],
        'BT': [
            { id: '3', brand_id: '2', name: 'BT Digital', type: 'subscription', shortcode: 'BTD' }
        ]
    },
    ratePlans: {
        '1': [
            { id: '1', product_id: '1', plan_type_code: 'M', plan_type_name: 'Monthly', price: 99, category: 'standard' },
            { id: '2', product_id: '1', plan_type_code: 'Y', plan_type_name: 'Yearly', price: 999, category: 'standard' }
        ]
    }
};

// ============================================================================
// AIRTABLE API HELPER
// ============================================================================

async function airtableRequest(tableName, params = {}) {
    // If no valid credentials, return mock data
    if (!hasValidCredentials) {
        console.warn('Using mock data for:', tableName);
        return getMockDataForTable(tableName, params);
    }

    const url = new URL(`${AIRTABLE_CONFIG.BASE_URL}/${AIRTABLE_CONFIG.BASE_ID}/${encodeURIComponent(tableName)}`);
    
    // Add query parameters
    Object.keys(params).forEach(key => {
        if (params[key]) {
            url.searchParams.append(key, params[key]);
        }
    });
    
    console.log('🔍 Airtable request:', url.toString());
    console.log('🔍 With params:', params);
    
    try {
        const response = await fetch(url.toString(), {
            headers: {
                'Authorization': `Bearer ${AIRTABLE_CONFIG.PERSONAL_ACCESS_TOKEN}`,
                'Content-Type': 'application/json'
            }
        });
        
        if (!response.ok) {
            const errorText = await response.text();
            console.error('❌ Airtable API error:', response.status, errorText);
            throw new Error(`Airtable API error: ${response.status} ${response.statusText}`);
        }
        
        const data = await response.json();
        
        console.log(`✅ Received ${data.records.length} records from ${tableName}`);
        
        // Transform Airtable records to simple objects
        return {
            data: data.records.map(record => ({
                id: record.id,
                ...record.fields
            })),
            error: null
        };
        
    } catch (error) {
        console.error('❌ Airtable request failed:', error);
        // Fall back to mock data on error
        return getMockDataForTable(tableName, params);
    }
}

// Mock data provider
function getMockDataForTable(tableName, params) {
    console.log('📦 Using mock data for table:', tableName);
    switch(tableName) {
        case TABLE_NAMES.BRANDS:
            return { data: MOCK_DATA.brands, error: null };
        case TABLE_NAMES.PRODUCTS:
            // Simple mock filtering
            const allProducts = Object.values(MOCK_DATA.products).flat();
            return { data: allProducts, error: null };
        case TABLE_NAMES.RATE_PLANS:
            const allRatePlans = Object.values(MOCK_DATA.ratePlans).flat();
            return { data: allRatePlans, error: null };
        default:
            return { data: [], error: null };
    }
}

// ============================================================================
// CORE DATABASE FUNCTIONS
// ============================================================================

function initializeDatabase() {
    if (hasValidCredentials) {
        console.log('✅ Airtable database initialized');
        console.log('📊 Base ID:', AIRTABLE_CONFIG.BASE_ID);
        console.log('📋 Field mappings configured for:', Object.keys(TABLE_NAMES).join(', '));
    } else {
        console.warn('⚠️ Using mock data - Airtable not configured');
        console.warn('To use real data, update js/config.js with your Airtable credentials');
    }
    return { success: true };
}

// ============================================================================
// BRANDS
// ============================================================================

async function fetchAllBrands() {
    try {
        // Check cache
        if (dbCache.brands && isValidCache('brands')) {
            console.log('📦 Using cached brands');
            return { data: dbCache.brands, error: null };
        }
        
        const result = await airtableRequest(TABLE_NAMES.BRANDS);
        
        if (result.error) throw new Error(result.error);
        
        // Transform data using field mappings
        const data = result.data.map(brand => ({
            id: brand.id,
            code: brand[FIELD_MAPPINGS.BRANDS.CODE] || brand.code,
            name: brand[FIELD_MAPPINGS.BRANDS.NAME] || brand.name,
            country: brand[FIELD_MAPPINGS.BRANDS.COUNTRY] || brand.country
        }));
        
        // Update cache
        dbCache.brands = data;
        dbCache.lastFetch.brands = Date.now();
        
        console.log(`✅ Fetched ${data.length} brands from Airtable`);
        return { data, error: null };
        
    } catch (error) {
        console.error('Failed to fetch brands:', error);
        return { data: [], error: error.message };
    }
}

async function getBrandsGrouped() {
    const result = await fetchAllBrands();
    
    if (result.error) return result;
    
    const grouped = {};
    result.data.forEach(brand => {
        const country = brand.country || 'Other';
        if (!grouped[country]) grouped[country] = [];
        grouped[country].push(brand);
    });
    
    return { data: grouped, error: null };
}

async function getBrandByCode(brandCode) {
    const result = await fetchAllBrands();
    
    if (result.error) return { data: null, error: result.error };
    
    const brand = result.data.find(b => b.code === brandCode);
    return { data: brand || null, error: brand ? null : 'Brand not found' };
}

// ============================================================================
// PRODUCTS
// ============================================================================

async function fetchProductsByBrand(brandCode) {
    try {
        const cacheKey = `products_${brandCode}`;
        
        // Check cache
        if (dbCache.products[cacheKey] && isValidCache(cacheKey)) {
            console.log('📦 Using cached products for brand:', brandCode);
            return { data: dbCache.products[cacheKey], error: null };
        }
        
        // Get the brand first
        const brandResult = await getBrandByCode(brandCode);
        if (brandResult.error) throw new Error(brandResult.error);
        
        console.log('🔍 Looking for products with brand:', brandResult.data.name);
        
        // Try multiple filter approaches for linked records and text fields
        let result;
        
        // First try: Assume Brand field contains the brand name as text
        let filterFormula = `{${FIELD_MAPPINGS.PRODUCTS.BRAND}} = "${brandResult.data.name}"`;
        console.log('🔍 Trying filter formula:', filterFormula);
        
        result = await airtableRequest(TABLE_NAMES.PRODUCTS, {
            filterByFormula: filterFormula
        });
        
        // If no results, try with brand code
        if (!result.data || result.data.length === 0) {
            filterFormula = `{${FIELD_MAPPINGS.PRODUCTS.BRAND}} = "${brandCode}"`;
            console.log('🔍 No results, trying with brand code:', filterFormula);
            
            result = await airtableRequest(TABLE_NAMES.PRODUCTS, {
                filterByFormula: filterFormula
            });
        }
        
        // If still no results, try searching in linked records
        if (!result.data || result.data.length === 0) {
            filterFormula = `SEARCH("${brandResult.data.name}", {${FIELD_MAPPINGS.PRODUCTS.BRAND}})`;
            console.log('🔍 No results, trying SEARCH formula:', filterFormula);
            
            result = await airtableRequest(TABLE_NAMES.PRODUCTS, {
                filterByFormula: filterFormula
            });
        }
        
        // If still no results, fetch all products and filter client-side
        if (!result.data || result.data.length === 0) {
            console.log('🔍 No filtered results, fetching all products and filtering client-side');
            result = await airtableRequest(TABLE_NAMES.PRODUCTS);
            
            if (result.data) {
                // Filter products that have the brand name in any form
                result.data = result.data.filter(product => {
                    const brandField = product[FIELD_MAPPINGS.PRODUCTS.BRAND];
                    if (!brandField) return false;
                    
                    // Check if it's an array (linked record)
                    if (Array.isArray(brandField)) {
                        return brandField.includes(brandResult.data.id) || 
                               brandField.some(b => b === brandResult.data.name);
                    }
                    
                    // Check if it's a string
                    if (typeof brandField === 'string') {
                        return brandField === brandResult.data.name || 
                               brandField === brandCode ||
                               brandField.includes(brandResult.data.name);
                    }
                    
                    return false;
                });
                
                console.log(`✅ Filtered ${result.data.length} products client-side for brand ${brandCode}`);
            }
        }
        
        if (result.error) throw new Error(result.error);
        
        // Transform data using field mappings
        const data = result.data.map(product => ({
            id: product.id,
            brand_id: brandResult.data.id,
            name: product[FIELD_MAPPINGS.PRODUCTS.NAME] || product.name,
            type: product[FIELD_MAPPINGS.PRODUCTS.TYPE] || product.type || 'subscription',
            shortcode: product[FIELD_MAPPINGS.PRODUCTS.CODE] || product.shortcode || '',
            promocode_id: product[FIELD_MAPPINGS.PRODUCTS.PROMOCODE_ID] || ''
        }));
        
        // Update cache
        dbCache.products[cacheKey] = data;
        dbCache.lastFetch[cacheKey] = Date.now();
        
        console.log(`✅ Fetched ${data.length} products for brand ${brandCode}`);
        return { data, error: null };
        
    } catch (error) {
        console.error('❌ Failed to fetch products:', error);
        // Return mock data on error
        const mockProducts = MOCK_DATA.products[brandCode] || [];
        return { data: mockProducts, error: null };
    }
}

async function getProductById(productId) {
    try {
        // First, try to fetch the product directly by ID
        const url = new URL(`${AIRTABLE_CONFIG.BASE_URL}/${AIRTABLE_CONFIG.BASE_ID}/${encodeURIComponent(TABLE_NAMES.PRODUCTS)}/${productId}`);
        
        const response = await fetch(url.toString(), {
            headers: {
                'Authorization': `Bearer ${AIRTABLE_CONFIG.PERSONAL_ACCESS_TOKEN}`,
                'Content-Type': 'application/json'
            }
        });
        
        if (response.ok) {
            const data = await response.json();
            const product = {
                id: data.id,
                ...data.fields,
                name: data.fields[FIELD_MAPPINGS.PRODUCTS.NAME] || data.fields.name,
                type: data.fields[FIELD_MAPPINGS.PRODUCTS.TYPE] || data.fields.type || 'subscription',
                shortcode: data.fields[FIELD_MAPPINGS.PRODUCTS.CODE] || data.fields.shortcode || ''
            };
            return { data: product, error: null };
        }
        
        // If direct fetch fails, search through cached products
        const brandsResult = await fetchAllBrands();
        if (brandsResult.error) throw new Error(brandsResult.error);
        
        for (const brand of brandsResult.data) {
            const productsResult = await fetchProductsByBrand(brand.code);
            if (!productsResult.error) {
                const product = productsResult.data.find(p => p.id === productId);
                if (product) return { data: product, error: null };
            }
        }
        
        return { data: null, error: 'Product not found' };
    } catch (error) {
        console.error('Failed to get product:', error);
        return { data: null, error: error.message };
    }
}

// ============================================================================
// RATE PLANS
// ============================================================================

async function fetchRatePlansForProduct(productId) {
    try {
        const cacheKey = `rateplans_${productId}`;
        
        // Check cache
        if (dbCache.ratePlans[cacheKey] && isValidCache(cacheKey)) {
            console.log('📦 Using cached rate plans for product:', productId);
            return { data: dbCache.ratePlans[cacheKey], error: null };
        }
        
        // Get product to find its name
        const product = await getProductById(productId);
        if (product.error) throw new Error(product.error);
        
        console.log('🔍 Looking for rate plans for product:', product.data.name);
        
        // Try multiple filter approaches
        let result;
        
        // First try: Assume Product field contains the product name as text
        let filterFormula = `{${FIELD_MAPPINGS.RATE_PLANS.PRODUCT}} = "${product.data.name}"`;
        console.log('🔍 Trying filter formula:', filterFormula);
        
        result = await airtableRequest(TABLE_NAMES.RATE_PLANS, {
            filterByFormula: filterFormula
        });
        
        // If no results, try searching in linked records
        if (!result.data || result.data.length === 0) {
            filterFormula = `SEARCH("${product.data.name}", {${FIELD_MAPPINGS.RATE_PLANS.PRODUCT}})`;
            console.log('🔍 No results, trying SEARCH formula:', filterFormula);
            
            result = await airtableRequest(TABLE_NAMES.RATE_PLANS, {
                filterByFormula: filterFormula
            });
        }
        
        // If still no results, fetch all rate plans and filter client-side
        if (!result.data || result.data.length === 0) {
            console.log('🔍 No filtered results, fetching all rate plans and filtering client-side');
            result = await airtableRequest(TABLE_NAMES.RATE_PLANS);
            
            if (result.data) {
                // Filter rate plans that have the product name in any form
                result.data = result.data.filter(plan => {
                    const productField = plan[FIELD_MAPPINGS.RATE_PLANS.PRODUCT];
                    if (!productField) return false;
                    
                    // Check if it's an array (linked record)
                    if (Array.isArray(productField)) {
                        return productField.includes(productId) || 
                               productField.some(p => p === product.data.name);
                    }
                    
                    // Check if it's a string
                    if (typeof productField === 'string') {
                        return productField === product.data.name ||
                               productField.includes(product.data.name);
                    }
                    
                    return false;
                });
                
                console.log(`✅ Filtered ${result.data.length} rate plans client-side for product ${product.data.name}`);
            }
        }
        
        if (result.error) throw new Error(result.error);
        
        // Transform data using field mappings
        const data = result.data.map(plan => ({
            id: plan.id,
            product_id: productId,
            plan_type_code: plan[FIELD_MAPPINGS.RATE_PLANS.CODE] || plan.plan_type_code || '',
            plan_type_name: plan[FIELD_MAPPINGS.RATE_PLANS.NAME] || plan.plan_type_name || '',
            price: plan[FIELD_MAPPINGS.RATE_PLANS.PRICE] || plan.price || 0,
            category: plan[FIELD_MAPPINGS.RATE_PLANS.CATEGORY] || plan.category || 'standard',
            plan_id: plan[FIELD_MAPPINGS.RATE_PLANS.PLAN_ID] || ''
        }));
        
        // Update cache
        dbCache.ratePlans[cacheKey] = data;
        dbCache.lastFetch[cacheKey] = Date.now();
        
        console.log(`✅ Fetched ${data.length} rate plans for product ${productId}`);
        return { data, error: null };
    } catch (error) {
        console.error('❌ Failed to fetch rate plans:', error);
        return { data: [], error: null };
    }
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

function isValidCache(key) {
    const lastFetch = dbCache.lastFetch[key];
    if (!lastFetch) return false;
    return (Date.now() - lastFetch) < CACHE_DURATION;
}

function clearCache() {
    dbCache = {
        brands: null,
        products: {},
        ratePlans: {},
        lastFetch: {}
    };
    console.log('Cache cleared');
}

function transformProductsToOptions(products) {
    if (!products || products.length === 0) return {};
    
    const options = { '': 'Select a product' };
    products.forEach(product => {
        const key = product.name
            .toLowerCase()
            .replace(/[^a-z0-9\s]/g, '')
            .replace(/\s+/g, '-');
        options[key] = product.name;
    });
    
    return options;
}

function transformRatePlansToOptions(ratePlans) {
    if (!ratePlans || ratePlans.length === 0) {
        return { '': 'No rate plans available' };
    }
    
    const options = { '': 'Select a rate plan' };
    
    ratePlans.forEach(plan => {
        const code = plan.plan_type_code;
        const name = plan.plan_type_name || plan.name || plan.plan_type_code;
        const price = Number(plan.price);
        
        if (code) {
            const friendlyNames = {
                'W': 'Weekly',
                'M': 'Monthly', 
                'Q': 'Quarterly',
                '6M': '6 Months',
                'Y': 'Yearly',
                'Y/M': 'Yearly (per month)'
            };
            
            const displayName = friendlyNames[code] || name || code;
            
            if (!isNaN(price) && price > 0) {
                options[code] = `${displayName} (${price} kr)`;
            } else {
                options[code] = displayName;
            }
        }
    });
    
    return options;
}

async function getFullBrandData(brandCode) {
    try {
        const [brandResult, productsResult] = await Promise.all([
            getBrandByCode(brandCode),
            fetchProductsByBrand(brandCode)
        ]);
        
        if (brandResult.error) return { data: null, error: brandResult.error };
        if (productsResult.error) return { data: null, error: productsResult.error };
        
        // Get rate plans for first product
        let initialRatePlans = [];
        if (productsResult.data && productsResult.data.length > 0) {
            const ratePlansResult = await fetchRatePlansForProduct(productsResult.data[0].id);
            if (!ratePlansResult.error) {
                initialRatePlans = ratePlansResult.data || [];
            }
        }
        
        return {
            data: {
                brand: brandResult.data,
                products: productsResult.data || [],
                initialRatePlans: initialRatePlans
            },
            error: null
        };
    } catch (error) {
        console.error('Failed to fetch brand data:', error);
        return { data: null, error: error.message };
    }
}

// Stub functions for compatibility
async function fetchPlatformConfig() { return { data: [], error: null }; }
async function getConfigValue() { return { data: null, error: 'Not used with Airtable' }; }
async function saveGeneration() { return { data: null, error: null }; }
async function getUserGenerations() { return { data: [], error: null }; }
async function saveBrazeName() { return { success: true, error: null }; }

// ============================================================================
// EXPORT FUNCTIONS - ALWAYS CREATE window.database
// ============================================================================

window.database = {
    initialize: initializeDatabase,
    
    // Brands
    fetchAllBrands,
    getBrandsGrouped,
    getBrandByCode,
    
    // Products
    fetchProductsByBrand,
    getProductById,
    
    // Rate Plans
    fetchRatePlansForProduct,
    
    // Configuration (stubs)
    fetchPlatformConfig,
    getConfigValue,
    
    // History (stubs)
    saveGeneration,
    getUserGenerations,
    saveBrazeName,
    
    // Utilities
    clearCache,
    transformProductsToOptions,
    transformRatePlansToOptions,
    getFullBrandData
};

// Log field mappings for debugging
console.log('📋 Field Mappings Configuration:', FIELD_MAPPINGS);
console.log('📊 Table Names:', TABLE_NAMES);
console.log('✅ Database service loaded successfully (Airtable with fallback)');
console.log('🔍 window.database created:', !!window.database);
console.log('🔍 Credentials status:', hasValidCredentials ? 'Valid' : 'Using mock data');