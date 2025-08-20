/* ============================================================================
   DATABASE SERVICE - Airtable data access layer for promocodes
   ============================================================================ */

// Load config from environment or use defaults
const AIRTABLE_CONFIG = {
    BASE_ID: window.ENV?.AIRTABLE_BASE_ID || 'UPDATE_CONFIG_JS',
    PERSONAL_ACCESS_TOKEN: window.ENV?.AIRTABLE_TOKEN || 'UPDATE_CONFIG_JS',
    BASE_URL: 'https://api.airtable.com/v0'
};

// Check if credentials are missing
if (AIRTABLE_CONFIG.BASE_ID === 'UPDATE_CONFIG_JS') {
    console.error('⚠️ Airtable credentials not found!');
    console.error('Please copy config.example.js to config.js and add your credentials');
}

// Cache for better performance
let dbCache = {
    brands: null,
    products: {},
    ratePlans: {},
    lastFetch: {}
};

const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

// ============================================================================
// AIRTABLE API HELPER
// ============================================================================

async function airtableRequest(tableName, params = {}) {
    const url = new URL(`${AIRTABLE_CONFIG.BASE_URL}/${AIRTABLE_CONFIG.BASE_ID}/${tableName}`);
    
    // Add query parameters
    Object.keys(params).forEach(key => {
        if (params[key]) {
            url.searchParams.append(key, params[key]);
        }
    });
    
    try {
        const response = await fetch(url.toString(), {
            headers: {
                'Authorization': `Bearer ${AIRTABLE_CONFIG.PERSONAL_ACCESS_TOKEN}`,
                'Content-Type': 'application/json'
            }
        });
        
        if (!response.ok) {
            throw new Error(`Airtable API error: ${response.status} ${response.statusText}`);
        }
        
        const data = await response.json();
        
        // Transform Airtable records to simple objects
        return {
            data: data.records.map(record => ({
                id: record.id,
                ...record.fields
            })),
            error: null
        };
        
    } catch (error) {
        // API request failed silently
        return { data: null, error: error.message };
    }
}

// ============================================================================
// CORE DATABASE FUNCTIONS
// ============================================================================

function initializeDatabase() {
    // Airtable service ready
    return true;
}

// ============================================================================
// BRANDS
// ============================================================================

async function fetchAllBrands() {
    try {
        // Check cache first
        if (dbCache.brands && isValidCache('brands')) {
            return { data: dbCache.brands, error: null };
        }

        const result = await airtableRequest('Brands');
        if (result.error) throw new Error(result.error);
        
        // Transform data format
        const data = result.data.map(brand => ({
            id: brand.id,
            code: brand['Brand Code'],
            name: brand['Brand Name'],
            country: brand['Country']
        })).filter(brand => brand.code && brand.name); // Filter out incomplete records
        
        // Update cache
        dbCache.brands = data;
        dbCache.lastFetch.brands = Date.now();
        
        return { data, error: null };
    } catch (error) {
        // Failed to fetch brands
        return { data: null, error: error.message };
    }
}

async function getBrandsGrouped() {
    const { data: brands, error } = await fetchAllBrands();
    if (error) return { data: null, error };
    
    const grouped = {
        norwegian: brands.filter(b => b.country === 'NO'),
        swedish: brands.filter(b => b.country === 'SE')
    };
    
    return { data: grouped, error: null };
}

async function getBrandByCode(brandCode) {
    const { data: brands, error } = await fetchAllBrands();
    if (error) return { data: null, error };
    
    const brand = brands.find(b => b.code === brandCode);
    return { data: brand, error: brand ? null : 'Brand not found' };
}

// ============================================================================
// PRODUCTS
// ============================================================================

async function fetchProductsByBrand(brandCode) {
    try {
        // Check cache first
        const cacheKey = `products_${brandCode}`;
        if (dbCache.products[cacheKey] && isValidCache(cacheKey)) {
            return { data: dbCache.products[cacheKey], error: null };
        }

        // Get brand first to get the brand ID
        const { data: brand, error: brandError } = await getBrandByCode(brandCode);
        if (brandError) return { data: null, error: brandError };
        
        const result = await airtableRequest('Products', {
            filterByFormula: `{Brand} = "${brand.name}"`
        });
        
        if (result.error) throw new Error(result.error);
        
        // Transform data format
        const data = result.data.map(product => ({
            id: product.id,
            brand_id: brand.id,
            name: product['Product Name'],
            type: product['Type'],
            shortcode: product['Shortcode']
        }));
        
        // Update cache
        dbCache.products[cacheKey] = data;
        dbCache.lastFetch[cacheKey] = Date.now();
        
        return { data, error: null };
    } catch (error) {
        // Failed to fetch products
        return { data: null, error: error.message };
    }
}

async function getProductById(productId) {
    try {
        // For Airtable, we need to get the product by record ID
        const result = await airtableRequest(`Products/${productId}`);
        if (result.error) throw new Error(result.error);
        
        const product = {
            id: result.data.id,
            name: result.data['Product Name'],
            type: result.data['Type'],
            shortcode: result.data['Shortcode']
        };
        
        return { data: product, error: null };
    } catch (error) {
        // Failed to fetch product
        return { data: null, error: error.message };
    }
}

// ============================================================================
// RATE PLANS
// ============================================================================

async function fetchRatePlansForProduct(productId) {
    try {
        const cacheKey = `rateplans_${productId}`;
        if (dbCache.ratePlans[cacheKey] && isValidCache(cacheKey)) {
            return { data: dbCache.ratePlans[cacheKey], error: null };
        }

        // Get product name for filtering
        const { data: product, error: productError } = await getProductById(productId);
        if (productError) return { data: null, error: productError };
        
        const result = await airtableRequest('Rate Plans', {
            filterByFormula: `{Product} = "${product.name}"`
        });
        
        if (result.error) throw new Error(result.error);
        
        // Transform data format
        const data = result.data.map(plan => ({
            id: plan.id,
            product_id: productId,
            plan_type_code: plan['Plan Code'],
            plan_type_name: plan['Plan Name'],
            price: plan['Price'],
            category: plan['Category'] || 'standard'
        }));
        
        // Rate plans loaded
        
        // Update cache
        dbCache.ratePlans[cacheKey] = data;
        dbCache.lastFetch[cacheKey] = Date.now();
        
        return { data, error: null };
    } catch (error) {
        // Failed to fetch rate plans
        return { data: null, error: error.message };
    }
}

// ============================================================================
// UTILITY FUNCTIONS (Keep same interface)
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
    // Cache cleared
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
        
        if (code && !isNaN(price)) {
            const friendlyNames = {
                'W': 'Weekly',
                'M': 'Monthly', 
                'Q': 'Quarterly',
                '6M': '6 Months',
                'Y': 'Yearly',
                'Y/M': 'Yearly (per month)'
            };
            
            const displayName = friendlyNames[code] || name;
            options[code] = `${displayName} (${price} kr)`;
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
        // Failed to fetch brand data
        return { data: null, error: error.message };
    }
}

// Stub functions for compatibility (not needed with Airtable)
async function fetchPlatformConfig() { return { data: [], error: null }; }
async function getConfigValue() { return { data: null, error: 'Not used with Airtable' }; }
async function saveGeneration() { return { data: null, error: null }; }
async function getUserGenerations() { return { data: [], error: null }; }
async function saveBrazeName() { return { success: true, error: null }; }

// ============================================================================
// EXPORT FUNCTIONS
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

// Airtable service loaded