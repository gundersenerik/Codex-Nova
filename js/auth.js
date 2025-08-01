/* ============================================================================
   AUTHENTICATION - Simplified demo authentication (no external services)
   ============================================================================ */

// Global variables for authentication state
let currentUser = null;
let isDemo = true; // Always demo mode in frontend-only version

// ============================================================================
// AUTHENTICATION FUNCTIONS
// ============================================================================

// Initialize authentication on page load
async function initializeAuth() {
    try {
        console.log('🔐 Initializing authentication...');
        
        // Check if user was previously logged in
        const savedUser = localStorage.getItem('current_user');
        if (savedUser) {
            try {
                currentUser = JSON.parse(savedUser);
                updateAuthUI(true);
                console.log('✅ User restored from localStorage:', currentUser.email);
            } catch (e) {
                console.warn('Failed to parse saved user, clearing localStorage');
                localStorage.removeItem('current_user');
            }
        } else {
            updateAuthUI(false);
        }
        
        return { success: true };
    } catch (error) {
        console.error('❌ Auth initialization error:', error);
        updateAuthUI(false);
        return { success: false, error: error.message };
    }
}

// Handle login with demo accounts
async function handleLogin(event) {
    event.preventDefault();
    
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    
    setLoadingState('login', true);
    hideError('loginError');
    
    try {
        // Simulate loading delay for realistic UX
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Check against demo accounts
        const account = window.AppConfig.getAccount(email, password);
        
        if (!account) {
            throw new Error('Invalid email or password. Try demo@vg.no / demo123');
        }
        
        // Set current user
        currentUser = {
            id: account.id,
            email: account.email,
            name: account.name,
            brand: account.brand,
            role: account.role
        };
        
        // Save to localStorage
        localStorage.setItem('current_user', JSON.stringify(currentUser));
        
        // Update UI
        updateAuthUI(true);
        hideAuthModal();
        
        // Show welcome message
        showNotification(`Welcome ${currentUser.name}! This is a demo environment.`, 'success');
        
        console.log('✅ Login successful:', currentUser.email);
        
    } catch (error) {
        console.error('❌ Login error:', error);
        showError('loginError', error.message);
    }
    
    setLoadingState('login', false);
}

// Handle signup (creates demo account)
async function handleSignup(event) {
    event.preventDefault();
    
    const email = document.getElementById('signupEmail').value;
    const password = document.getElementById('signupPassword').value;
    const passwordConfirm = document.getElementById('signupPasswordConfirm').value;
    
    // Validate passwords match
    if (password !== passwordConfirm) {
        showError('signupError', 'Passwords do not match');
        return;
    }
    
    setLoadingState('signup', true);
    hideError('signupError');
    
    try {
        // Simulate loading delay
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // Check if email already exists
        const existingAccount = window.AppConfig.DEMO_ACCOUNTS.find(acc => acc.email === email);
        if (existingAccount) {
            throw new Error('Account already exists. Try logging in instead.');
        }
        
        // Create new demo user
        currentUser = {
            id: 'user-' + Date.now(),
            email: email,
            name: email.split('@')[0],
            brand: null,
            role: 'user'
        };
        
        // Save to localStorage
        localStorage.setItem('current_user', JSON.stringify(currentUser));
        
        // Update UI
        updateAuthUI(true);
        hideAuthModal();
        
        showNotification('Demo account created! Your data is stored locally.', 'success');
        
        console.log('✅ Signup successful:', currentUser.email);
        
    } catch (error) {
        console.error('❌ Signup error:', error);
        showError('signupError', error.message);
    }
    
    setLoadingState('signup', false);
}

// Handle logout
async function logout() {
    try {
        // Clear current user
        currentUser = null;
        
        // Clear localStorage
        localStorage.removeItem('current_user');
        
        // Update UI
        updateAuthUI(false);
        hideUserDropdown();
        
        showNotification('Logged out successfully', 'info');
        
        console.log('✅ Logout successful');
        
    } catch (error) {
        console.error('❌ Logout error:', error);
        showNotification('Error signing out. Please try again.', 'error');
    }
}

// Demo user login shortcut
async function showDemoLogin() {
    document.getElementById('loginEmail').value = 'demo@vg.no';
    document.getElementById('loginPassword').value = 'demo123';
    showAuthModal('login');
}

// ============================================================================
// UI HELPER FUNCTIONS
// ============================================================================

// Update UI based on authentication state
function updateAuthUI(isAuthenticated) {
    const authButtons = document.getElementById('authButtons');
    const userMenu = document.getElementById('userMenu');
    const demoUserBanner = document.getElementById('demoUserBanner');
    const headerTitle = document.getElementById('headerTitle');
    
    if (isAuthenticated && currentUser) {
        // Show user menu, hide auth buttons
        if (authButtons) authButtons.style.display = 'none';
        if (userMenu) userMenu.style.display = 'block';
        
        // Update user avatar and email
        const userAvatar = document.getElementById('userAvatar');
        const userEmail = document.getElementById('userEmail');
        
        if (userAvatar) userAvatar.textContent = currentUser.name.charAt(0).toUpperCase();
        if (userEmail) userEmail.textContent = currentUser.email;
        
        // Show demo banner
        if (demoUserBanner) {
            demoUserBanner.style.display = 'block';
        }
        
        // Update header title to current tab
        if (window.currentTab && headerTitle) {
            const titles = {
                'promocodes': 'Promocodes',
                'utm-purchase': 'Purchase Links',
                'utm-landing': 'Landing Page Links',
                'utm-email': 'Email Links',
                'utm-campaign': 'Campaign Links',
                'braze-campaigns': 'Braze Campaigns',
                'braze-segments': 'Braze Segments', 
                'braze-canvases': 'Braze Canvases',
                'vev': 'VEV',
                'sales-poster': 'Sales Poster Service',
                'reverse-lookup': 'Reverse Lookup',
                'history': 'History'
            };
            headerTitle.textContent = titles[window.currentTab] || 'Naming Standards';
        }
    } else {
        // Show auth buttons, hide user menu
        if (authButtons) authButtons.style.display = 'flex';
        if (userMenu) userMenu.style.display = 'none';
        if (demoUserBanner) demoUserBanner.style.display = 'none';
        if (headerTitle) headerTitle.textContent = 'Naming Standards Hub';
    }
}

// Show/hide auth modal
function showAuthModal(type) {
    const overlay = document.getElementById('authModalOverlay');
    const loginModal = document.getElementById('loginModal');
    const signupModal = document.getElementById('signupModal');
    
    if (!overlay || !loginModal || !signupModal) return;
    
    // Hide all modals first
    loginModal.classList.remove('show');
    signupModal.classList.remove('show');
    
    // Show overlay
    overlay.classList.add('show');
    
    // Show specific modal
    if (type === 'login') {
        loginModal.classList.add('show');
        const loginEmail = document.getElementById('loginEmail');
        if (loginEmail) loginEmail.focus();
    } else if (type === 'signup') {
        signupModal.classList.add('show');
        const signupEmail = document.getElementById('signupEmail');
        if (signupEmail) signupEmail.focus();
    }
}

function hideAuthModal() {
    const overlay = document.getElementById('authModalOverlay');
    const loginModal = document.getElementById('loginModal');
    const signupModal = document.getElementById('signupModal');
    
    if (overlay) overlay.classList.remove('show');
    if (loginModal) loginModal.classList.remove('show');
    if (signupModal) signupModal.classList.remove('show');
    
    // Clear forms
    const forms = ['loginEmail', 'loginPassword', 'signupEmail', 'signupPassword', 'signupPasswordConfirm'];
    forms.forEach(id => {
        const element = document.getElementById(id);
        if (element) element.value = '';
    });
    
    // Hide errors
    hideError('loginError');
    hideError('signupError');
}

// User dropdown
function toggleUserDropdown() {
    const dropdown = document.getElementById('userDropdown');
    if (dropdown) {
        dropdown.classList.toggle('show');
    }
}

function hideUserDropdown() {
    const dropdown = document.getElementById('userDropdown');
    if (dropdown) {
        dropdown.classList.remove('show');
    }
}

// Close dropdown when clicking outside
document.addEventListener('click', function(event) {
    const userMenu = document.getElementById('userMenu');
    if (userMenu && !userMenu.contains(event.target)) {
        hideUserDropdown();
    }
});

// Loading states
function setLoadingState(type, loading) {
    const button = document.getElementById(`${type}ButtonText`);
    const spinner = document.getElementById(`${type}Spinner`);
    const form = button?.closest('form');
    
    if (loading) {
        if (button) button.style.display = 'none';
        if (spinner) spinner.style.display = 'block';
        if (form) form.style.pointerEvents = 'none';
    } else {
        if (button) button.style.display = 'block';
        if (spinner) spinner.style.display = 'none';
        if (form) form.style.pointerEvents = 'auto';
    }
}

// Error handling
function showError(elementId, message) {
    const errorElement = document.getElementById(elementId);
    if (errorElement) {
        errorElement.textContent = message;
        errorElement.style.display = 'block';
    }
}

function hideError(elementId) {
    const errorElement = document.getElementById(elementId);
    if (errorElement) {
        errorElement.style.display = 'none';
    }
}

// Notifications
function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 16px 20px;
        border-radius: 8px;
        color: white;
        font-weight: 500;
        z-index: 2000;
        max-width: 400px;
        animation: slideInRight 0.3s ease-out;
    `;
    
    // Set background color based on type
    const colors = {
        success: '#00c896',
        error: '#ff3e3e',
        info: '#5b4cfd',
        warning: '#ffb800'
    };
    notification.style.background = colors[type] || colors.info;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    // Remove after 4 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease-out';
        setTimeout(() => {
            if (document.body.contains(notification)) {
                document.body.removeChild(notification);
            }
        }, 300);
    }, 4000);
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

// Get current user
function getCurrentUser() {
    return currentUser;
}

// Check if user is authenticated
function isAuthenticated() {
    return currentUser !== null;
}

// Check if user has role
function hasRole(role) {
    return currentUser && currentUser.role === role;
}

// Make functions globally available
window.auth = {
    initialize: initializeAuth,
    login: handleLogin,
    signup: handleSignup,
    logout: logout,
    getCurrentUser,
    isAuthenticated,
    hasRole
};

console.log('✅ Simplified authentication loaded');