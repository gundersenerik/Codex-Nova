/* ============================================================================
   MAIN APPLICATION - SQLite Frontend-Only Version
   ============================================================================ */

// ============================================================================
// APPLICATION INITIALIZATION
// ============================================================================

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Naming Standards Hub - Frontend Edition Starting...');
    startApplicationInitialization();
});

// Main initialization sequence
async function startApplicationInitialization() {
    try {
        showLoadingOverlay('Initializing application...');
        
        // Step 1: Initialize SQL.js database
        console.log('🔧 Step 1: Initializing SQLite database...');
        await initializeDatabaseLayer();
        
        // Step 2: Load/Initialize data
        console.log('🔧 Step 2: Loading database data...');
        await initializeData();
        
        // Step 3: Initialize authentication
        console.log('🔧 Step 3: Initializing authentication...');
        await initializeAuthSystem();
        
        // Step 4: Initialize UI components
        console.log('🔧 Step 4: Initializing UI components...');
        await initializeUIComponents();
        
        // Step 5: Initialize business logic
        console.log('🔧 Step 5: Initializing business logic...');
        await initializeBusinessLogic();
        
        // Step 6: Start auto-save and finalize
        console.log('🔧 Step 6: Finalizing application...');
        await finalizeApplication();
        
        console.log('✅ Application initialized successfully');
        hideLoadingOverlay();
        showApplication();
        
    } catch (error) {
        console.error('❌ Application initialization failed:', error);
        showInitializationError(error);
    }
}

// ============================================================================
// INITIALIZATION STEPS
// ============================================================================

// Step 1: Initialize database layer
async function initializeDatabaseLayer() {
    try {
        // Try to initialize SQL.js
        await window.sqlDB.initialize();
        
        // Verify database is ready
        if (!window.sqlDB.isReady()) {
            throw new Error('SQLite database failed to initialize');
        }
        
        console.log('✅ SQLite database initialized');
        return { success: true };
        
    } catch (error) {
        console.error('❌ SQLite initialization failed, falling back to mock data:', error);
        
        // Fallback to mock database
        if (window.MockDatabase) {
            window.MockDatabase.initialize();
            console.log('✅ Mock database initialized as fallback');
            return { success: true, fallback: true };
        }
        
        throw new Error('Failed to initialize any database: ' + error.message);
    }
}

// Step 2: Load database data
async function initializeData() {
    try {
        // Check if we're using mock data (only if SQLite failed)
        if (window.MockDatabase && window.MockDatabase.isReady() && !window.sqlDB.isReady()) {
            console.log('📂 Using mock database - data already loaded');
            const stats = window.MockDatabase.getStats();
            if (stats.data) {
                console.log('📊 Mock database stats:', stats.data);
            }
            return { success: true };
        }
        
        // SQLite initialization
        // Check if database exists in localStorage
        if (window.dataManager.hasStoredDatabase()) {
            // Load existing database from localStorage
            const loadResult = window.dataManager.load();
            if (loadResult.success) {
                console.log('📂 Loaded existing database from localStorage');
                const stats = window.sqlDB.getStats();
                if (stats.data) {
                    console.log('📊 Database stats:', stats.data);
                }
                return { success: true };
            }
        }
        
        // No existing database - load pre-populated database
        console.log('🚀 First run detected - loading pre-populated database...');
        
        // Load the pre-populated database
        if (window.loadPrePopulatedDatabase) {
            const result = await window.loadPrePopulatedDatabase();
            if (result.success) {
                console.log('✅ Pre-populated database loaded successfully');
                console.log('📊 Database stats:', result.stats);
                
                // Save to localStorage for next time
                await window.dataManager.save();
                console.log('💾 Database saved to localStorage for future use');
                
                return { success: true };
            } else {
                console.warn('⚠️ Failed to load pre-populated database:', result.error);
            }
        }
        
        // Fallback: Load empty schema if pre-populated database failed
        console.log('📂 Loading default schema as fallback...');
        await window.sqlDB.loadSchema();
        
        // Verify data was loaded
        const stats = window.sqlDB.getStats();
        if (stats.data) {
            console.log('📊 Database stats:', stats.data);
        }
        
        return { success: true };
        
    } catch (error) {
        console.error('❌ Data initialization failed:', error);
        throw new Error('Failed to load database data: ' + error.message);
    }
}

// Step 3: Initialize authentication system
async function initializeAuthSystem() {
    try {
        const result = await window.auth.initialize();
        if (!result.success) {
            throw new Error(result.error);
        }
        
        console.log('✅ Authentication system initialized');
        return { success: true };
        
    } catch (error) {
        console.error('❌ Auth initialization failed:', error);
        throw new Error('Failed to initialize authentication: ' + error.message);
    }
}

// Step 4: Initialize UI components
async function initializeUIComponents() {
    try {
        // Initialize navigation system
        if (typeof initializeNavigation === 'function') {
            initializeNavigation();
            console.log('✅ Navigation initialized');
        }
        
        // Initialize search functionality (if exists)
        if (typeof initializeSearch === 'function') {
            initializeSearch();
            console.log('✅ Search initialized');
        }
        
        // Handle URL routing (if exists)
        if (typeof initializeFromURL === 'function') {
            initializeFromURL();
            console.log('✅ URL routing initialized');
        }
        
        return { success: true };
        
    } catch (error) {
        console.error('❌ UI initialization failed:', error);
        throw new Error('Failed to initialize UI components: ' + error.message);
    }
}

// Step 5: Initialize business logic
async function initializeBusinessLogic() {
    try {
        // Initialize database service
        if (window.database && window.database.initialize) {
            const dbInitResult = window.database.initialize();
            if (!dbInitResult) {
                throw new Error('Database service initialization failed');
            }
            console.log('✅ Database service initialized');
        }
        
        // Initialize promocode functionality
        if (window.promocode && window.promocode.initialize) {
            await window.promocode.initialize();
            console.log('✅ Promocode system initialized');
        }
        
        return { success: true };
        
    } catch (error) {
        console.error('❌ Business logic initialization failed:', error);
        // Don't throw - business logic failures shouldn't break the app
        console.warn('⚠️ Continuing with partial business logic initialization');
        return { success: false, error: error.message };
    }
}

// Step 6: Finalize application
async function finalizeApplication() {
    try {
        // Start auto-save
        if (window.AppConfig.SETTINGS.AUTO_SAVE) {
            window.dataManager.startAutoSave();
            console.log('✅ Auto-save started');
        }
        
        // Set up periodic cache clearing
        setInterval(() => {
            if (window.database && window.database.clearCache) {
                window.database.clearCache();
            }
        }, window.AppConfig.SETTINGS.CACHE_DURATION || 300000);
        
        // Set up window beforeunload handler for data saving
        window.addEventListener('beforeunload', () => {
            if (window.dataManager) {
                window.dataManager.save();
            }
        });
        
        console.log('✅ Application finalized');
        return { success: true };
        
    } catch (error) {
        console.error('❌ Application finalization failed:', error);
        // Don't throw - finalization issues shouldn't break the app
        return { success: false, error: error.message };
    }
}

// ============================================================================
// UI HELPER FUNCTIONS
// ============================================================================

// Show loading overlay
function showLoadingOverlay(message = 'Loading...') {
    let overlay = document.getElementById('initLoadingOverlay');
    if (!overlay) {
        overlay = document.createElement('div');
        overlay.id = 'initLoadingOverlay';
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(255, 255, 255, 0.95);
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            z-index: 9999;
            font-family: 'Inter', sans-serif;
        `;
        
        overlay.innerHTML = `
            <div style="text-align: center;">
                <div style="
                    width: 40px;
                    height: 40px;
                    border: 3px solid #e0e0e0;
                    border-top: 3px solid #5b4cfd;
                    border-radius: 50%;
                    animation: spin 1s linear infinite;
                    margin: 0 auto 20px auto;
                "></div>
                <div style="
                    font-size: 18px;
                    font-weight: 600;
                    color: #333;
                    margin-bottom: 8px;
                ">Naming Standards Hub</div>
                <div id="loadingMessage" style="
                    font-size: 14px;
                    color: #666;
                ">${message}</div>
            </div>
            <style>
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
            </style>
        `;
        
        document.body.appendChild(overlay);
    } else {
        const messageEl = overlay.querySelector('#loadingMessage');
        if (messageEl) messageEl.textContent = message;
        overlay.style.display = 'flex';
    }
}

// Hide loading overlay
function hideLoadingOverlay() {
    const overlay = document.getElementById('initLoadingOverlay');
    if (overlay) {
        overlay.style.display = 'none';
    }
}

// Show the application
function showApplication() {
    // Hide any initialization loading screens
    hideLoadingOverlay();
    
    // Show main app container
    const appContainer = document.querySelector('.app-container');
    if (appContainer) {
        appContainer.style.opacity = '1';
        appContainer.style.visibility = 'visible';
    }
    
    // Add loaded class to body
    document.body.classList.add('app-loaded');
    
    // Show success notification
    if (typeof showNotification === 'function') {
        showNotification('Application loaded successfully! Using local SQLite database.', 'success');
    }
}

// Show initialization error
function showInitializationError(error) {
    hideLoadingOverlay();
    
    const errorContainer = document.createElement('div');
    errorContainer.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: #f8f9fa;
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 9999;
        font-family: 'Inter', sans-serif;
    `;
    
    errorContainer.innerHTML = `
        <div style="
            max-width: 500px;
            padding: 40px;
            background: white;
            border-radius: 12px;
            box-shadow: 0 4px 20px rgba(0,0,0,0.1);
            text-align: center;
        ">
            <div style="
                width: 60px;
                height: 60px;
                background: #ff3e3e;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                margin: 0 auto 24px auto;
                font-size: 24px;
                color: white;
            ">⚠️</div>
            <h2 style="
                margin: 0 0 16px 0;
                font-size: 24px;
                font-weight: 600;
                color: #333;
            ">Initialization Failed</h2>
            <p style="
                margin: 0 0 24px 0;
                color: #666;
                line-height: 1.5;
            ">${error.message}</p>
            <button onclick="location.reload()" style="
                background: #5b4cfd;
                color: white;
                border: none;
                padding: 12px 24px;
                border-radius: 8px;
                font-weight: 600;
                cursor: pointer;
                font-size: 14px;
            ">Reload Application</button>
        </div>
    `;
    
    document.body.appendChild(errorContainer);
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

// Copy text to clipboard
function copyToClipboard(text) {
    if (navigator.clipboard && window.isSecureContext) {
        return navigator.clipboard.writeText(text).then(() => {
            if (typeof showNotification === 'function') {
                showNotification('Copied to clipboard!', 'success');
            }
        }).catch(() => {
            fallbackCopyToClipboard(text);
        });
    } else {
        fallbackCopyToClipboard(text);
    }
}

function fallbackCopyToClipboard(text) {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    textArea.style.top = '-999999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    
    try {
        document.execCommand('copy');
        if (typeof showNotification === 'function') {
            showNotification('Copied to clipboard!', 'success');
        }
    } catch (err) {
        console.error('Fallback copy failed:', err);
        if (typeof showNotification === 'function') {
            showNotification('Failed to copy to clipboard', 'error');
        }
    }
    
    document.body.removeChild(textArea);
}

// Format date for display
function formatDate(date) {
    if (!(date instanceof Date)) {
        date = new Date(date);
    }
    
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

// Debounce function
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// ============================================================================
// GLOBAL ERROR HANDLING
// ============================================================================

// Global error handler
window.addEventListener('error', (event) => {
    console.error('Global error:', event.error);
    
    if (event.error && event.error.message && typeof showNotification === 'function') {
        showNotification('An unexpected error occurred. Check console for details.', 'error');
    }
});

// Unhandled promise rejection handler
window.addEventListener('unhandledrejection', (event) => {
    console.error('Unhandled promise rejection:', event.reason);
    event.preventDefault();
    
    if (typeof showNotification === 'function') {
        showNotification('An unexpected error occurred. Please try again.', 'error');
    }
});

// ============================================================================
// MAKE FUNCTIONS GLOBALLY AVAILABLE
// ============================================================================

// Make utility functions available globally
window.copyToClipboard = copyToClipboard;
window.formatDate = formatDate;
window.debounce = debounce;

console.log('✅ Main application script loaded');