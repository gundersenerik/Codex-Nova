/* ============================================================================
   CONFIGURATION - Static application configuration (no server needed)
   ============================================================================ */

// Static configuration for frontend-only app
window.AppConfig = {
    // Application Info
    APP_NAME: 'Naming Standards Hub',
    VERSION: '2.0.0-frontend',
    
    // Demo User Accounts (for simplified auth)
    DEMO_ACCOUNTS: [
        {
            id: 'demo-user-vg',
            email: 'demo@vg.no',
            password: 'demo123',
            name: 'VG Demo User',
            brand: 'VG',
            role: 'editor'
        },
        {
            id: 'demo-user-ab',
            email: 'demo@aftonbladet.se', 
            password: 'demo123',
            name: 'Aftonbladet Demo User',
            brand: 'AB',
            role: 'editor'
        },
        {
            id: 'admin-user',
            email: 'admin@namingstandards.app',
            password: 'admin123',
            name: 'Admin User',
            brand: null,
            role: 'admin'
        }
    ],
    
    // Default Settings
    SETTINGS: {
        AUTO_SAVE: true,
        AUTO_SAVE_INTERVAL: 30000, // 30 seconds
        CACHE_DURATION: 300000,    // 5 minutes
        MAX_HISTORY_ITEMS: 100,
        THEME: 'light'
    },
    
    // Platform Configuration
    PLATFORMS: {
        PROMOCODES: {
            name: 'Promocodes',
            icon: '🎟️',
            enabled: true
        },
        UTM: {
            name: 'UTM Standards',
            icon: '🔗',
            enabled: true,
            subtypes: ['purchase', 'landing', 'email', 'campaign']
        },
        BRAZE: {
            name: 'Braze',
            icon: '📱',
            enabled: true,
            subtypes: ['campaigns', 'segments', 'canvases']
        },
        VEV: {
            name: 'VEV',
            icon: '📊',
            enabled: true
        },
        SALES_POSTER: {
            name: 'Sales Poster',
            icon: '🏷️',
            enabled: true
        }
    },
    
    // Brand Configuration
    BRANDS: {
        NORWEGIAN: ['VG', 'BT', 'SA', 'AP'],
        SWEDISH: ['AB', 'GP', 'SVD', 'SYD']
    },
    
    // Development Flags
    DEBUG: true,
    MOCK_MODE: false, // We're using real SQLite now
    
    // UI Configuration
    UI: {
        SIDEBAR_COLLAPSED: false,
        SHOW_DEBUG_INFO: true,
        ANIMATE_TRANSITIONS: true
    }
};

// Utility functions for config
window.AppConfig.getAccount = function(email, password) {
    return this.DEMO_ACCOUNTS.find(acc => 
        acc.email === email && acc.password === password
    );
};

window.AppConfig.getPlatform = function(platformKey) {
    return this.PLATFORMS[platformKey.toUpperCase()];
};

window.AppConfig.isBrandNorwegian = function(brandCode) {
    return this.BRANDS.NORWEGIAN.includes(brandCode);
};

window.AppConfig.isBrandSwedish = function(brandCode) {
    return this.BRANDS.SWEDISH.includes(brandCode);
};

console.log('✅ Static configuration loaded');