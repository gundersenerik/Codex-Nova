/* ============================================================================
   MAIN APPLICATION - Airtable Cloud Database Version
   ============================================================================ */

// ============================================================================
// APPLICATION INITIALIZATION
// ============================================================================

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    startApplicationInitialization();
});

// Main initialization sequence
async function startApplicationInitialization() {
    try {
        showLoadingOverlay('Initializing application...');
        
        // Initialize all components
        await initializeDatabaseLayer();
        await initializeData();
        await initializeAuthSystem();
        await initializeUIComponents();
        await initializeBusinessLogic();
        await finalizeApplication();
        hideLoadingOverlay();
        showApplication();
        
    } catch (error) {
        console.error('Failed to start application:', error.message);
        showInitializationError(error);
    }
}

// ============================================================================
// INITIALIZATION STEPS
// ============================================================================

// Step 1: Initialize database layer
async function initializeDatabaseLayer() {
    try {
        // Initialize Airtable database
        const success = window.database.initialize();
        if (!success) {
            throw new Error('Airtable database failed to initialize');
        }
        
        // Database ready
        return { success: true };
        
    } catch (error) {
        console.error('Failed to connect to Airtable:', error.message);
        throw error;
    }
}

// Step 2: Load database data
async function initializeData() {
    try {
        // Test database connection
        const { data: brands, error } = await window.database.fetchAllBrands();
        if (error) {
            throw new Error('Failed to fetch brands: ' + error);
        }
        return { success: true };
        
    } catch (error) {
        console.error('Failed to load data:', error.message);
        throw new Error('Failed to connect to Airtable: ' + error.message);
    }
}

// Step 3: Initialize authentication system
async function initializeAuthSystem() {
    try {
        const result = await window.auth.initialize();
        if (!result.success) {
            throw new Error(result.error);
        }
        
        // Auth ready
        return { success: true };
        
    } catch (error) {
        console.error('Authentication error:', error.message);
        throw new Error('Failed to initialize authentication: ' + error.message);
    }
}

// Step 4: Initialize UI components
async function initializeUIComponents() {
    try {
        // Initialize navigation system
        if (typeof initializeNavigation === 'function') {
            initializeNavigation();
            // Navigation ready
        }
        
        // Initialize search functionality (if exists)
        if (typeof initializeSearch === 'function') {
            initializeSearch();
            // Search ready
        }
        
        // Handle URL routing (if exists)
        if (typeof initializeFromURL === 'function') {
            initializeFromURL();
            // URL routing ready
        }
        
        return { success: true };
        
    } catch (error) {
        console.error('UI error:', error.message);
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
            // Database service ready
        }
        
        // Initialize promocode functionality
        if (window.promocode && window.promocode.initialize) {
            await window.promocode.initialize();
            // Promocode system ready
        }
        
        return { success: true };
        
    } catch (error) {
        // Non-critical error - continue
        return { success: false, error: error.message };
    }
}

// Step 6: Finalize application
async function finalizeApplication() {
    try {
        // Airtable doesn't need auto-save (data is stored in cloud)
        // Set up periodic cache clearing
        setInterval(() => {
            if (window.database && window.database.clearCache) {
                window.database.clearCache();
            }
        }, window.AppConfig.SETTINGS.CACHE_DURATION || 300000);
        
        // Application ready
        return { success: true };
        
    } catch (error) {
        // Non-critical finalization error
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
        showNotification('Application ready', 'success');
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
        // Copy failed
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
    // Global error caught
    
    if (event.error && event.error.message && typeof showNotification === 'function') {
        showNotification('An unexpected error occurred. Check console for details.', 'error');
    }
});

// Unhandled promise rejection handler
window.addEventListener('unhandledrejection', (event) => {
    // Unhandled promise
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

// Main script loaded