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
        console.error('Airtable request failed:', error);
        // Fall back to mock data on error
        return getMockDataForTable(tableName, params);
    }
}

// Mock data provider
function getMockDataForTable(tableName, params) {
    switch(tableName) {
        case 'Brands':
            return { data: MOCK_DATA.brands, error: null };
        case 'Products':
            // Simple mock filtering
            const allProducts = Object.values(MOCK_DATA.products).flat();
            return { data: allProducts, error: null };
        case 'Rate Plans':
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
        console.log('✅ Database service initialized with Airtable');
    } else {
        console.log('✅ Database service initialized with mock data');
    }
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
        
        // Transform data format - handle both mock and real data
        const data = result.data.map(brand => ({
            id: brand.id,
            code: brand['Brand Code'] || brand.code,
            name: brand['Brand Name'] || brand.name,
            country: brand['Country'] || brand.country
        })).filter(brand => brand.code && brand.name);
        
        // Update cache
        dbCache.brands = data;
        dbCache.lastFetch.brands = Date.now();
        
        return { data, error: null };
    } catch (error) {
        console.error('Failed to fetch brands:', error);
        // Return mock data as fallback
        return { data: MOCK_DATA.brands, error: null };
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

        // For mock data, return from MOCK_DATA
        if (!hasValidCredentials) {
            const mockProducts = MOCK_DATA.products[brandCode] || [];
            dbCache.products[cacheKey] = mockProducts;
            dbCache.lastFetch[cacheKey] = Date.now();
            return { data: mockProducts, error: null };
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
            name: product['Product Name'] || product.name,
            type: product['Type'] || product.type,
            shortcode: product['Shortcode'] || product.shortcode
        }));
        
        // Update cache
        dbCache.products[cacheKey] = data;
        dbCache.lastFetch[cacheKey] = Date.now();
        
        return { data, error: null };
    } catch (error) {
        console.error('Failed to fetch products:', error);
        // Return empty array as fallback
        return { data: [], error: null };
    }
}

async function getProductById(productId) {
    try {
        // For mock data
        if (!hasValidCredentials) {
            const allProducts = Object.values(MOCK_DATA.products).flat();
            const product = allProducts.find(p => p.id === productId);
            return { data: product, error: product ? null : 'Product not found' };
        }

        // For Airtable, we need to get the product by record ID
        const result = await airtableRequest(`Products/${productId}`);
        if (result.error) throw new Error(result.error);
        
        const product = {
            id: result.data.id,
            name: result.data['Product Name'] || result.data.name,
            type: result.data['Type'] || result.data.type,
            shortcode: result.data['Shortcode'] || result.data.shortcode
        };
        
        return { data: product, error: null };
    } catch (error) {
        console.error('Failed to fetch product:', error);
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

        // For mock data
        if (!hasValidCredentials) {
            const mockRatePlans = MOCK_DATA.ratePlans[productId] || [];
            dbCache.ratePlans[cacheKey] = mockRatePlans;
            dbCache.lastFetch[cacheKey] = Date.now();
            return { data: mockRatePlans, error: null };
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
            plan_type_code: plan['Plan Code'] || plan.plan_type_code,
            plan_type_name: plan['Plan Name'] || plan.plan_type_name,
            price: plan['Price'] || plan.price,
            category: plan['Category'] || plan.category || 'standard'
        }));
        
        // Update cache
        dbCache.ratePlans[cacheKey] = data;
        dbCache.lastFetch[cacheKey] = Date.now();
        
        return { data, error: null };
    } catch (error) {
        console.error('Failed to fetch rate plans:', error);
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
            .replace(/[^a-z0-9\\s]/g, '')
            .replace(/\\s+/g, '-');
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

console.log('✅ Database service loaded successfully (Airtable with fallback)');
console.log('🔍 window.database created:', !!window.database);
console.log('🔍 Credentials status:', hasValidCredentials ? 'Valid' : 'Using mock data');