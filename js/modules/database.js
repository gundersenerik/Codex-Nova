/* ============================================================================
   DATABASE MODULE - Data access layer (Migrated to CJC Namespace)
   ============================================================================ */

CJC.defineModule('database', function(api) {
    const { utils, events } = api;
    
    // ========================================================================
    // PRIVATE STATE
    // ========================================================================
    let sqlDatabase = null;
    let mockData = null;
    let initialized = false;
    
    // Cache management
    let dbCache = {
        brands: null,
        products: {},
        ratePlans: {},
        configs: {},
        lastFetch: {}
    };
    
    const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
    
    // ========================================================================
    // PRIVATE FUNCTIONS
    // ========================================================================
    
    // Check if cached data is still valid
    function isValidCache(key) {
        const lastFetch = dbCache.lastFetch[key];
        if (!lastFetch) return false;
        return (Date.now() - lastFetch) < CACHE_DURATION;
    }
    
    // Helper to check which database we're using
    function isUsingMockData() {
        return mockData && mockData.isReady() && 
               (!sqlDatabase || !sqlDatabase.isReady());
    }
    
    // Transform products to select options format
    function transformProductsToOptions(products) {
        if (!products || products.length === 0) return {};
        
        const options = { '': 'Select a product' };
        products.forEach(product => {
            // Create clean key from product name
            const key = product.name
                .toLowerCase()
                .replace(/[^a-z0-9\s]/g, '')
                .replace(/\s+/g, '-');
            options[key] = product.name;
        });
        
        return options;
    }
    
    // Transform rate plans to select options format
    function transformRatePlansToOptions(ratePlans) {
        if (!ratePlans || ratePlans.length === 0) {
            return { '': 'No rate plans available' };
        }
        
        const options = { '': 'Select a rate plan' };
        
        ratePlans.forEach(plan => {
            // The database query gives us the plan type name
            const code = plan.plan_type_code || plan.code;
            const name = plan.plan_type_name || plan.name || plan.plan_type_code || plan.code;
            const price = Number(plan.price);
            
            if (code && !isNaN(price)) {
                // Format the display name based on the plan type
                let displayName = name;
                
                // Add descriptive names for special codes
                const friendlyNames = {
                    'W': 'Weekly',
                    'M': 'Monthly', 
                    'Q': 'Quarterly',
                    '6M': '6 Months',
                    'Y': 'Yearly',
                    'Y/M': 'Yearly (per month)',
                    '6M/M': '6 Months (per month)',
                    'Q/M': 'Quarterly (per month)',
                    'D': 'Daily',
                    'APP3M': 'In-app 3 Months',
                    'APP6M': 'In-app 6 Months',
                    'SE_OV_M': 'Övriga Sverige - Monthly',
                    'SE_OV_Q': 'Övriga Sverige - Quarterly',
                    'SE_OV_6M': 'Övriga Sverige - 6 Months',
                    'SE_OV_Y': 'Övriga Sverige - Yearly',
                    'SE_ST_M': 'Stockholm - Monthly',
                    'SE_ST_Q': 'Stockholm - Quarterly', 
                    'SE_ST_6M': 'Stockholm - 6 Months',
                    'SE_ST_Y': 'Stockholm - Yearly'
                };
                
                displayName = friendlyNames[code] || name;
                options[code] = `${displayName} (${price} kr)`;
            }
        });
        
        return options;
    }
    
    // ========================================================================
    // PUBLIC API
    // ========================================================================
    
    return {
        // Initialize database connection (uses SQL.js or mock data)
        initialize() {
            if (initialized) {
                console.log('Database module already initialized');
                return true;
            }
            
            // Get database modules
            sqlDatabase = CJC.require('sqlDatabase');
            mockData = CJC.require('mockData');
            
            // Check if SQLite is available
            if (sqlDatabase && sqlDatabase.isReady()) {
                console.log('✅ Database service initialized with SQLite');
                initialized = true;
                events.emit('database:initialized', { type: 'sqlite' });
                return true;
            }
            
            // Check if mock database is available
            if (mockData && mockData.isReady()) {
                console.log('✅ Database service initialized with mock data');
                initialized = true;
                events.emit('database:initialized', { type: 'mock' });
                return true;
            }
            
            console.error('❌ No database available (neither SQLite nor mock)');
            return false;
        },
        
        // ========================================================================
        // BRANDS
        // ========================================================================
        
        // Fetch all brands
        async fetchAllBrands() {
            try {
                // Check cache first
                if (dbCache.brands && isValidCache('brands')) {
                    return { data: dbCache.brands, error: null };
                }

                let data;
                
                if (isUsingMockData()) {
                    // Use mock data
                    data = mockData.getBrands();
                } else {
                    // Use SQLite
                    const result = sqlDatabase.query(`
                        SELECT * FROM brands 
                        WHERE code IS NOT NULL 
                          AND code != '' 
                          AND name IS NOT NULL 
                          AND name != ''
                        ORDER BY country, name
                    `);
                    
                    if (result.error) throw new Error(result.error);
                    data = result.data;
                }
                
                // Update cache
                dbCache.brands = data;
                dbCache.lastFetch.brands = Date.now();
                
                return { data, error: null };
            } catch (error) {
                console.error('Error fetching brands:', error);
                return { data: null, error: error.message };
            }
        },
        
        // Get brands grouped by country
        async getBrandsGrouped() {
            const { data: brands, error } = await this.fetchAllBrands();
            if (error) return { data: null, error };
            
            const grouped = {
                norwegian: brands.filter(b => b.country === 'NO'),
                swedish: brands.filter(b => b.country === 'SE')
            };
            
            return { data: grouped, error: null };
        },
        
        // Get single brand by code
        async getBrandByCode(brandCode) {
            const { data: brands, error } = await this.fetchAllBrands();
            if (error) return { data: null, error };
            
            const brand = brands.find(b => b.code === brandCode);
            return { data: brand, error: brand ? null : 'Brand not found' };
        },
        
        // ========================================================================
        // PRODUCTS
        // ========================================================================
        
        // Fetch products for a brand
        async fetchProductsByBrand(brandCode) {
            try {
                // Check cache first
                const cacheKey = `products_${brandCode}`;
                if (dbCache.products[cacheKey] && isValidCache(cacheKey)) {
                    return { data: dbCache.products[cacheKey], error: null };
                }

                let data;
                
                if (isUsingMockData()) {
                    // Use mock data
                    data = mockData.getProductsByBrand(brandCode);
                } else {
                    // Use SQLite
                    const result = sqlDatabase.query(`
                        SELECT p.* FROM products p
                        JOIN brands b ON p.brand_id = b.id 
                        WHERE b.code = ? 
                        ORDER BY p.name
                    `, [brandCode]);
                    
                    if (result.error) throw new Error(result.error);
                    data = result.data;
                }
                
                // Update cache
                dbCache.products[cacheKey] = data;
                dbCache.lastFetch[cacheKey] = Date.now();
                
                return { data, error: null };
            } catch (error) {
                console.error('Error fetching products:', error);
                return { data: null, error: error.message };
            }
        },
        
        // Get product by ID
        async getProductById(productId) {
            try {
                const { data, error } = sqlDatabase.getRow(`
                    SELECT * FROM products 
                    WHERE id = ?
                `, [productId]);
                
                if (error) throw new Error(error);
                return { data, error: null };
            } catch (error) {
                console.error('Error fetching product:', error);
                return { data: null, error: error.message };
            }
        },
        
        // ========================================================================
        // RATE PLANS
        // ========================================================================
        
        // Fetch rate plans for a product
        async fetchRatePlansForProduct(productId) {
            try {
                const cacheKey = `rateplans_${productId}`;
                if (dbCache.ratePlans[cacheKey] && isValidCache(cacheKey)) {
                    return { data: dbCache.ratePlans[cacheKey], error: null };
                }

                let data;
                
                if (isUsingMockData()) {
                    // Use mock data
                    data = mockData.getRatePlansForProduct(productId);
                } else {
                    // Use SQLite - Join rate_plans with rate_plan_types to get names and categories
                    const result = sqlDatabase.query(`
                        SELECT 
                            rp.id,
                            rp.price,
                            rp.code as plan_type_code,
                            rpt.name as plan_type_name,
                            rpt.category
                        FROM rate_plans rp
                        JOIN rate_plan_types rpt ON rp.code = rpt.code
                        WHERE rp.product_id = ? AND rpt.is_active = 1
                        ORDER BY rp.price
                    `, [productId]);
                    
                    if (result.error) throw new Error(result.error);
                    data = result.data;
                }
                
                console.log(`Fetched ${data.length} rate plans for product ${productId}`);
                
                // Update cache
                dbCache.ratePlans[cacheKey] = data;
                dbCache.lastFetch[cacheKey] = Date.now();
                
                return { data, error: null };
            } catch (error) {
                console.error('Error fetching rate plans:', error);
                return { data: null, error: error.message };
            }
        },
        
        // Fetch rate plans for multiple products
        async fetchRatePlansForProducts(productIds) {
            try {
                if (!productIds || productIds.length === 0) {
                    return { data: [], error: null };
                }
                
                const placeholders = productIds.map(() => '?').join(',');
                const { data, error } = sqlDatabase.query(`
                    SELECT 
                        rp.*,
                        rpt.name as plan_type_name,
                        rpt.category,
                        p.name as product_name,
                        b.code as brand_code
                    FROM rate_plans rp
                    JOIN rate_plan_types rpt ON rp.code = rpt.code
                    JOIN products p ON rp.product_id = p.id
                    JOIN brands b ON p.brand_id = b.id
                    WHERE rp.product_id IN (${placeholders})
                    ORDER BY rp.price
                `, productIds);
                
                if (error) throw new Error(error);
                return { data, error: null };
            } catch (error) {
                console.error('Error fetching rate plans:', error);
                return { data: null, error: error.message };
            }
        },
        
        // Get rate plan types by category
        async getRatePlanTypesByCategory(category = null) {
            try {
                let sql = `
                    SELECT * FROM rate_plan_types 
                    WHERE is_active = 1
                `;
                let params = [];
                
                if (category) {
                    sql += ' AND category = ?';
                    params.push(category);
                }
                
                sql += ' ORDER BY sort_order';
                
                const { data, error } = sqlDatabase.query(sql, params);
                if (error) throw new Error(error);
                
                return { data, error: null };
            } catch (error) {
                console.error('Error fetching rate plan types:', error);
                return { data: null, error: error.message };
            }
        },
        
        // ========================================================================
        // PLATFORM CONFIGURATION (Simplified - no longer needed for SQLite version)
        // ========================================================================
        
        // Fetch platform configuration (kept for compatibility)
        async fetchPlatformConfig(platform, configKey = null) {
            try {
                // Return empty result since we're not using platform config in SQLite version
                console.log('Platform config not used in SQLite version');
                return { data: [], error: null };
            } catch (error) {
                console.error('Error fetching platform config:', error);
                return { data: null, error: error.message };
            }
        },
        
        // Get specific config value (kept for compatibility)
        async getConfigValue(platform, configKey) {
            return { data: null, error: 'Config not used in SQLite version' };
        },
        
        // ========================================================================
        // GENERATION HISTORY
        // ========================================================================
        
        // Save generation to history
        async saveGeneration(platform, generatedName, parameters) {
            try {
                // Use simple user ID for SQLite version (no real auth)
                const userId = 'demo-user';
                
                const { error } = sqlDatabase.execute(`
                    INSERT INTO generations (user_id, platform, generated_name, parameters) 
                    VALUES (?, ?, ?, ?)
                `, [userId, platform, generatedName, JSON.stringify(parameters)]);
                
                if (error) throw new Error(error);
                return { data: null, error: null };
            } catch (error) {
                console.error('Error saving generation:', error);
                return { data: null, error: error.message };
            }
        },
        
        // Get user's generation history
        async getUserGenerations(platform = null, limit = 50) {
            try {
                let sql = `
                    SELECT * FROM generations 
                    WHERE user_id = ?
                `;
                let params = ['demo-user'];
                
                if (platform) {
                    sql += ' AND platform = ?';
                    params.push(platform);
                }
                
                sql += ' ORDER BY id DESC LIMIT ?';
                params.push(limit);
                
                const { data, error } = sqlDatabase.query(sql, params);
                if (error) throw new Error(error);
                
                return { data, error: null };
            } catch (error) {
                console.error('Error fetching user generations:', error);
                return { data: null, error: error.message };
            }
        },
        
        // Save Braze naming to history
        async saveBrazeName(data) {
            try {
                // Get auth module if available
                const auth = CJC.getModule('auth');
                const currentUser = (auth && auth.getCurrentUser && auth.getCurrentUser()) || 'anonymous';
                
                const result = sqlDatabase.execute(
                    `INSERT INTO braze_naming_history 
                    (name_type, generated_name, purpose_code, brand, package, comm_type, specific_type, custom_suffix, created_by) 
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                    [
                        data.name_type,
                        data.generated_name,
                        data.purpose_code,
                        data.brand,
                        data.package,
                        data.comm_type,
                        data.specific_type,
                        data.custom_suffix,
                        currentUser
                    ]
                );
                
                console.log('Braze name saved to history');
                return { success: true, error: null };
            } catch (error) {
                console.error('Error saving Braze name:', error);
                return { success: false, error: error.message };
            }
        },
        
        // ========================================================================
        // UTILITY FUNCTIONS
        // ========================================================================
        
        // Clear cache
        clearCache() {
            dbCache = {
                brands: null,
                products: {},
                ratePlans: {},
                configs: {},
                lastFetch: {}
            };
            console.log('Database cache cleared');
        },
        
        // Get full brand data (brand + products + rate plans)
        async getFullBrandData(brandCode) {
            try {
                const [brandResult, productsResult] = await Promise.all([
                    this.getBrandByCode(brandCode),
                    this.fetchProductsByBrand(brandCode)
                ]);
                
                if (brandResult.error) return { data: null, error: brandResult.error };
                if (productsResult.error) return { data: null, error: productsResult.error };
                
                // Get rate plans for first product (to populate initial dropdown)
                let initialRatePlans = [];
                if (productsResult.data && productsResult.data.length > 0) {
                    const ratePlansResult = await this.fetchRatePlansForProduct(productsResult.data[0].id);
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
                console.error('Error fetching full brand data:', error);
                return { data: null, error: error.message };
            }
        },
        
        // Expose transformation utilities
        transformProductsToOptions,
        transformRatePlansToOptions
    };
});

// ============================================================================
// COMPATIBILITY LAYER - Remove after full migration
// ============================================================================

(function() {
    // Wait for module to be available
    const checkAndSetup = () => {
        try {
            const databaseModule = CJC.require('database');
            
            // Map old window.database to new module
            window.database = {
                initialize: () => databaseModule.initialize(),
                
                // Brands
                fetchAllBrands: () => databaseModule.fetchAllBrands(),
                getBrandsGrouped: () => databaseModule.getBrandsGrouped(),
                getBrandByCode: (brandCode) => databaseModule.getBrandByCode(brandCode),
                
                // Products
                fetchProductsByBrand: (brandCode) => databaseModule.fetchProductsByBrand(brandCode),
                getProductById: (productId) => databaseModule.getProductById(productId),
                
                // Rate Plans
                fetchRatePlansForProduct: (productId) => databaseModule.fetchRatePlansForProduct(productId),
                fetchRatePlansForProducts: (productIds) => databaseModule.fetchRatePlansForProducts(productIds),
                getRatePlanTypesByCategory: (category) => databaseModule.getRatePlanTypesByCategory(category),
                
                // Configuration (kept for compatibility)
                fetchPlatformConfig: (platform, configKey) => databaseModule.fetchPlatformConfig(platform, configKey),
                getConfigValue: (platform, configKey) => databaseModule.getConfigValue(platform, configKey),
                
                // History
                saveGeneration: (platform, generatedName, parameters) => databaseModule.saveGeneration(platform, generatedName, parameters),
                getUserGenerations: (platform, limit) => databaseModule.getUserGenerations(platform, limit),
                saveBrazeName: (data) => databaseModule.saveBrazeName(data),
                
                // Utilities
                clearCache: () => databaseModule.clearCache(),
                transformProductsToOptions: (products) => databaseModule.transformProductsToOptions(products),
                transformRatePlansToOptions: (ratePlans) => databaseModule.transformRatePlansToOptions(ratePlans),
                getFullBrandData: (brandCode) => databaseModule.getFullBrandData(brandCode)
            };
            
            console.log('✅ Database compatibility layer established');
        } catch (e) {
            // Module not ready yet, try again
            setTimeout(checkAndSetup, 100);
        }
    };
    
    // Start checking
    checkAndSetup();
})();