/* ============================================================================
   MOCK DATA MODULE - Fallback for when SQLite fails (Migrated to CJC Namespace)
   ============================================================================ */

CJC.defineModule('mockData', function(api) {
    const { utils, events } = api;
    
    // ========================================================================
    // PRIVATE STATE
    // ========================================================================
    let initialized = false;
    
    // Mock database data for immediate testing
    const mockData = {
        brands: [
            { id: 1, code: 'VG', name: 'Verdens Gang', country: 'NO' },
            { id: 2, code: 'BT', name: 'Bergens Tidende', country: 'NO' },
            { id: 3, code: 'SA', name: 'Stavanger Aftenblad', country: 'NO' },
            { id: 4, code: 'AP', name: 'Adresseavisen', country: 'NO' },
            { id: 5, code: 'AB', name: 'Aftonbladet', country: 'SE' },
            { id: 6, code: 'GP', name: 'Göteborgs-Posten', country: 'SE' },
            { id: 7, code: 'SVD', name: 'Svenska Dagbladet', country: 'SE' },
            { id: 8, code: 'SYD', name: 'Sydsvenskan', country: 'SE' }
        ],
        
        products: [
            { id: 1, brand_code: 'VG', product_name: 'VG+', product_code: 'PLUS' },
            { id: 2, brand_code: 'VG', product_name: 'VG Pluss Mobile', product_code: 'MOBILE' },
            { id: 3, brand_code: 'BT', product_name: 'BT+', product_code: 'PLUS' },
            { id: 4, brand_code: 'BT', product_name: 'BT Premium', product_code: 'PREMIUM' },
            { id: 5, brand_code: 'SA', product_name: 'SA+', product_code: 'PLUS' },
            { id: 6, brand_code: 'AP', product_name: 'Adresseavisen Digital', product_code: 'DIGITAL' },
            { id: 7, brand_code: 'AB', product_name: 'Aftonbladet Plus', product_code: 'PLUS' },
            { id: 8, brand_code: 'AB', product_name: 'Aftonbladet Premium', product_code: 'PREMIUM' },
            { id: 9, brand_code: 'GP', product_name: 'GP Premium', product_code: 'PREMIUM' },
            { id: 10, brand_code: 'GP', product_name: 'GP Digital', product_code: 'DIGITAL' },
            { id: 11, brand_code: 'SVD', product_name: 'Svenska Dagbladet Plus', product_code: 'PLUS' },
            { id: 12, brand_code: 'SVD', product_name: 'SvD Premium', product_code: 'PREMIUM' },
            { id: 13, brand_code: 'SYD', product_name: 'Sydsvenskan Plus', product_code: 'PLUS' }
        ],
        
        ratePlanTypes: [
            { code: 'M', name: 'Monthly', category: 'standard', is_active: 1, sort_order: 10 },
            { code: 'Q', name: 'Quarterly', category: 'standard', is_active: 1, sort_order: 20 },
            { code: '6M', name: '6 Months', category: 'standard', is_active: 1, sort_order: 30 },
            { code: 'Y', name: 'Yearly', category: 'standard', is_active: 1, sort_order: 40 },
            { code: 'Y/M', name: 'Yearly (per month)', category: 'standard', is_active: 1, sort_order: 50 },
            { code: '6M/M', name: '6 Months (per month)', category: 'standard', is_active: 1, sort_order: 60 },
            { code: 'Q/M', name: 'Quarterly (per month)', category: 'standard', is_active: 1, sort_order: 70 },
            { code: 'SE_ST_M', name: 'Stockholm - Monthly', category: 'regional', is_active: 1, sort_order: 100 },
            { code: 'SE_ST_Q', name: 'Stockholm - Quarterly', category: 'regional', is_active: 1, sort_order: 110 },
            { code: 'SE_OV_M', name: 'Övriga Sverige - Monthly', category: 'regional', is_active: 1, sort_order: 140 }
        ],
        
        ratePlans: [
            // VG+ plans
            { id: 1, product_id: 1, plan_type_code: 'M', price: 99.00 },
            { id: 2, product_id: 1, plan_type_code: 'Q', price: 249.00 },
            { id: 3, product_id: 1, plan_type_code: '6M', price: 449.00 },
            { id: 4, product_id: 1, plan_type_code: 'Y', price: 799.00 },
            { id: 5, product_id: 1, plan_type_code: 'Y/M', price: 69.00 },
            
            // VG Mobile plans
            { id: 6, product_id: 2, plan_type_code: 'M', price: 49.00 },
            { id: 7, product_id: 2, plan_type_code: 'Q', price: 129.00 },
            { id: 8, product_id: 2, plan_type_code: 'Y', price: 449.00 },
            
            // BT+ plans
            { id: 9, product_id: 3, plan_type_code: 'M', price: 89.00 },
            { id: 10, product_id: 3, plan_type_code: 'Q', price: 229.00 },
            { id: 11, product_id: 3, plan_type_code: 'Y', price: 699.00 },
            
            // Aftonbladet Plus plans
            { id: 12, product_id: 7, plan_type_code: 'M', price: 99.00 },
            { id: 13, product_id: 7, plan_type_code: 'Q', price: 249.00 },
            { id: 14, product_id: 7, plan_type_code: 'Y', price: 799.00 },
            { id: 15, product_id: 7, plan_type_code: 'SE_ST_M', price: 119.00 },
            { id: 16, product_id: 7, plan_type_code: 'SE_OV_M', price: 89.00 }
        ]
    };
    
    // ========================================================================
    // PUBLIC API
    // ========================================================================
    
    return {
        initialize() {
            console.log('🔄 Using mock database for testing...');
            initialized = true;
            events.emit('mockData:initialized');
            return true;
        },
        
        isReady() {
            return initialized;
        },
        
        getBrands() {
            return mockData.brands.map(brand => ({
                code: brand.code,
                name: brand.name,
                country: brand.country
            }));
        },
        
        getProductsByBrand(brandCode) {
            return mockData.products
                .filter(product => product.brand_code === brandCode)
                .map(product => ({
                    id: product.id,
                    name: product.product_name,
                    type: 'digital'
                }));
        },
        
        getRatePlansForProduct(productId) {
            const product = mockData.products.find(p => p.id === productId);
            if (!product) return [];
            
            return mockData.ratePlans
                .filter(plan => plan.product_id === productId)
                .map(plan => {
                    const planType = mockData.ratePlanTypes.find(type => type.code === plan.plan_type_code);
                    return {
                        id: plan.id,
                        code: plan.plan_type_code,
                        name: planType ? planType.name : plan.plan_type_code,
                        price: plan.price,
                        category: planType ? planType.category : 'standard'
                    };
                });
        },
        
        getRatePlanTypes() {
            return mockData.ratePlanTypes
                .filter(type => type.is_active)
                .sort((a, b) => a.sort_order - b.sort_order);
        },
        
        getStats() {
            return {
                success: true,
                data: {
                    brands: mockData.brands.length,
                    products: mockData.products.length,
                    ratePlans: mockData.ratePlans.length,
                    ratePlanTypes: mockData.ratePlanTypes.length
                }
            };
        },
        
        // Expose raw data for compatibility
        getRawData() {
            return mockData;
        }
    };
});

// ============================================================================
// COMPATIBILITY LAYER - Remove after full migration
// ============================================================================

(function() {
    // Wait for module to be available
    const checkAndSetup = () => {
        try {
            const mockDataModule = CJC.require('mockData');
            
            // Map old window.MockData to raw data
            window.MockData = mockDataModule.getRawData();
            
            // Map old window.MockDatabase to new module
            window.MockDatabase = {
                initialized: false,
                
                initialize() {
                    this.initialized = mockDataModule.initialize();
                    return this.initialized;
                },
                
                isReady() {
                    return mockDataModule.isReady();
                },
                
                getBrands() {
                    return mockDataModule.getBrands();
                },
                
                getProductsByBrand(brandCode) {
                    return mockDataModule.getProductsByBrand(brandCode);
                },
                
                getRatePlansForProduct(productId) {
                    return mockDataModule.getRatePlansForProduct(productId);
                },
                
                getRatePlanTypes() {
                    return mockDataModule.getRatePlanTypes();
                },
                
                getStats() {
                    return mockDataModule.getStats();
                }
            };
            
            console.log('✅ Mock database compatibility layer established');
        } catch (e) {
            // Module not ready yet, try again
            setTimeout(checkAndSetup, 100);
        }
    };
    
    // Start checking
    checkAndSetup();
})();