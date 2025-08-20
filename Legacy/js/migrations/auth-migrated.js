/* ============================================================================
   AUTH MODULE - Migrated to CJC Namespace
   This shows how to convert existing modules to the namespace pattern
   ============================================================================ */

CJC.defineModule('auth', function(api) {
    const { utils, events } = api;
    
    // ========================================================================
    // PRIVATE STATE (Was global variables)
    // ========================================================================
    let currentUser = null;
    let authModal = null;
    let isInitialized = false;
    
    // ========================================================================
    // PRIVATE FUNCTIONS (Was global functions)
    // ========================================================================
    
    function showError(elementId, message) {
        const errorElement = document.getElementById(elementId);
        if (errorElement) {
            errorElement.textContent = message;
            errorElement.style.display = 'block';
        }
        // Also use centralized notification
        utils.notify(message, 'error');
    }
    
    function hideError(elementId) {
        const errorElement = document.getElementById(elementId);
        if (errorElement) {
            errorElement.style.display = 'none';
        }
    }
    
    function setLoadingState(type, loading) {
        const button = document.querySelector(`#${type}Form button[type="submit"]`);
        const spinner = document.querySelector(`#${type}Form .loading-spinner`);
        
        if (button) {
            button.disabled = loading;
            button.textContent = loading ? '' : (type === 'login' ? 'Sign In' : 'Sign Up');
        }
        
        if (spinner) {
            spinner.style.display = loading ? 'inline-block' : 'none';
        }
    }
    
    function updateAuthUI(isAuthenticated) {
        const authSection = document.getElementById('authSection');
        const userSection = document.getElementById('userSection');
        const userNameDisplay = document.getElementById('userNameDisplay');
        const userAvatar = document.getElementById('userAvatar');
        
        if (authSection) authSection.style.display = isAuthenticated ? 'none' : 'flex';
        if (userSection) userSection.style.display = isAuthenticated ? 'flex' : 'none';
        
        if (isAuthenticated && currentUser) {
            if (userNameDisplay) userNameDisplay.textContent = currentUser.name;
            if (userAvatar) userAvatar.textContent = currentUser.name.charAt(0).toUpperCase();
        }
        
        // Emit auth state change event
        events.emit('auth:stateChanged', { isAuthenticated, user: currentUser });
    }
    
    async function handleLogin(e) {
        e.preventDefault();
        
        const email = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPassword').value;
        
        setLoadingState('login', true);
        hideError('loginError');
        
        try {
            // Demo login
            if (email === 'demo@example.com' && password === 'demo') {
                currentUser = {
                    id: 'demo-user',
                    email: 'demo@example.com',
                    name: 'Demo User',
                    role: 'demo'
                };
                
                localStorage.setItem('currentUser', JSON.stringify(currentUser));
                updateAuthUI(true);
                hideAuthModal();
                utils.notify('Welcome back, Demo User!', 'success');
                events.emit('auth:login', currentUser);
            } else {
                throw new Error('Invalid email or password');
            }
        } catch (error) {
            showError('loginError', error.message);
        } finally {
            setLoadingState('login', false);
        }
    }
    
    function showAuthModal(type) {
        authModal = document.getElementById('authModal');
        const overlay = document.getElementById('authModalOverlay');
        const loginForm = document.getElementById('loginForm');
        const signupForm = document.getElementById('signupForm');
        const modalTitle = document.getElementById('authModalTitle');
        
        if (authModal && overlay) {
            authModal.style.display = 'block';
            overlay.style.display = 'block';
            
            if (loginForm) loginForm.style.display = type === 'login' ? 'block' : 'none';
            if (signupForm) signupForm.style.display = type === 'signup' ? 'block' : 'none';
            if (modalTitle) modalTitle.textContent = type === 'login' ? 'Sign In' : 'Sign Up';
            
            hideError('loginError');
            hideError('signupError');
        }
    }
    
    function hideAuthModal() {
        if (authModal) authModal.style.display = 'none';
        const overlay = document.getElementById('authModalOverlay');
        if (overlay) overlay.style.display = 'none';
    }
    
    // ========================================================================
    // PUBLIC API
    // ========================================================================
    
    return {
        // Initialize auth module
        async initialize() {
            if (isInitialized) return;
            
            // Check for existing session
            const savedUser = localStorage.getItem('currentUser');
            if (savedUser) {
                try {
                    currentUser = JSON.parse(savedUser);
                    updateAuthUI(true);
                } catch (error) {
                    console.error('Failed to parse saved user:', error);
                }
            }
            
            // Setup event listeners
            const loginForm = document.getElementById('loginForm');
            if (loginForm) {
                loginForm.addEventListener('submit', handleLogin);
            }
            
            // Setup demo login button
            window.showDemoLogin = () => {
                document.getElementById('loginEmail').value = 'demo@example.com';
                document.getElementById('loginPassword').value = 'demo';
                utils.notify('Use these demo credentials to login', 'info');
            };
            
            isInitialized = true;
            events.emit('auth:initialized');
        },
        
        // Public methods
        getCurrentUser() {
            return currentUser;
        },
        
        isAuthenticated() {
            return !!currentUser;
        },
        
        hasRole(role) {
            return currentUser && currentUser.role === role;
        },
        
        showLogin() {
            showAuthModal('login');
        },
        
        showSignup() {
            showAuthModal('signup');
        },
        
        logout() {
            currentUser = null;
            localStorage.removeItem('currentUser');
            updateAuthUI(false);
            utils.notify('You have been logged out', 'info');
            events.emit('auth:logout');
            window.location.reload();
        }
    };
});

// ============================================================================
// MIGRATION HELPERS - Temporary compatibility layer
// ============================================================================

// These maintain backward compatibility during migration
// Remove these once all code is updated to use CJC.require('auth')

window.showAuthModal = function(type) {
    console.warn('Deprecated: Use CJC.require("auth").showLogin() or .showSignup()');
    const auth = CJC.require('auth');
    type === 'login' ? auth.showLogin() : auth.showSignup();
};

window.hideAuthModal = function() {
    console.warn('Deprecated: Auth modal hiding is now internal');
};

window.getCurrentUser = function() {
    console.warn('Deprecated: Use CJC.require("auth").getCurrentUser()');
    return CJC.require('auth').getCurrentUser();
};

window.isAuthenticated = function() {
    console.warn('Deprecated: Use CJC.require("auth").isAuthenticated()');
    return CJC.require('auth').isAuthenticated();
};

window.logout = function() {
    console.warn('Deprecated: Use CJC.require("auth").logout()');
    CJC.require('auth').logout();
};