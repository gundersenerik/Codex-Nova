/* ============================================================================
   NAVIGATION - Tab management and UI navigation
   ============================================================================ */

// State management
window.currentTab = 'promocodes';
let currentSubTab = null;

// DOM Elements (will be initialized when DOM is ready)
let sidebar = null;
let mobileMenuToggle = null;
let headerTitle = null;
let navItems = null;
let tabContents = null;

// ============================================================================
// INITIALIZATION
// ============================================================================

function initializeNavigation() {
    // Get DOM elements
    sidebar = document.getElementById('sidebar');
    mobileMenuToggle = document.getElementById('mobileMenuToggle');
    headerTitle = document.getElementById('headerTitle');
    navItems = document.querySelectorAll('.nav-item');
    tabContents = document.querySelectorAll('.tab-content');
    
    // Set up event listeners
    setupNavigationEvents();
    setupSubNavigationEvents();
    setupMobileMenuEvents();
    setupKeyboardShortcuts();
    setupReverseLookup();
    setupHoverEffects();
}

// ============================================================================
// EVENT LISTENERS
// ============================================================================

function setupNavigationEvents() {
    if (!navItems) return;
    
    navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            const tabId = item.getAttribute('data-tab');
            const isExpandable = item.getAttribute('data-expandable') === 'true';
            
            if (isExpandable) {
                // Toggle sub-navigation
                const subNav = document.getElementById(`${tabId}-subnav`);
                if (subNav) {
                    const isOpen = subNav.classList.contains('active');
                    
                    // Close all sub-navs
                    document.querySelectorAll('.sub-nav').forEach(nav => {
                        nav.classList.remove('active');
                    });
                    
                    if (!isOpen) {
                        subNav.classList.add('active');
                        // Activate first sub-item
                        const firstSubItem = subNav.querySelector('.sub-nav-item');
                        if (firstSubItem) {
                            firstSubItem.click();
                        }
                    }
                }
            } else {
                // Regular navigation
                activateTab(tabId);
            }
        });
    });
}

function setupSubNavigationEvents() {
    const subNavItems = document.querySelectorAll('.sub-nav-item');
    
    subNavItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.stopPropagation();
            const subTabId = item.getAttribute('data-subtab');
            
            // Update active states
            document.querySelectorAll('.sub-nav-item').forEach(subItem => {
                subItem.classList.remove('active');
            });
            item.classList.add('active');
            
            // Update parent nav item
            const parentNav = item.closest('.sub-nav').previousElementSibling;
            if (parentNav) {
                activateNavItem(parentNav);
            }
            
            // Show content
            activateTab(subTabId);
        });
    });
}

function setupMobileMenuEvents() {
    if (mobileMenuToggle) {
        mobileMenuToggle.addEventListener('click', () => {
            if (sidebar) {
                sidebar.classList.toggle('mobile-open');
            }
        });
    }
    
    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
        if (sidebar && mobileMenuToggle) {
            const isClickInSidebar = sidebar.contains(e.target);
            const isClickOnToggle = mobileMenuToggle.contains(e.target);
            
            if (!isClickInSidebar && !isClickOnToggle && sidebar.classList.contains('mobile-open')) {
                sidebar.classList.remove('mobile-open');
            }
        }
    });
}

function setupKeyboardShortcuts() {
    document.addEventListener('keydown', (e) => {
        // Command palette (Cmd/Ctrl + K)
        if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
            e.preventDefault();
            // TODO: Show command palette
            console.log('Command palette triggered');
        }
        
        // Escape key to close mobile menu
        if (e.key === 'Escape' && sidebar && sidebar.classList.contains('mobile-open')) {
            sidebar.classList.remove('mobile-open');
        }
    });
}

function setupReverseLookup() {
    const lookupInput = document.getElementById('lookupInput');
    const lookupButton = document.getElementById('lookupButton');
    const lookupResult = document.getElementById('lookupResult');

    if (lookupButton && lookupInput && lookupResult) {
        const performLookup = () => {
            const code = lookupInput.value.trim();
            if (code) {
                lookupResult.innerHTML = `
                    <div style="padding: var(--space-lg); background: var(--gray-50); border-radius: 8px; margin-top: var(--space-lg);">
                        <h3 style="margin-bottom: var(--space-md);">Decoding: ${code}</h3>
                        <p style="color: var(--gray-600);">This feature will be implemented as we build out each platform's naming logic.</p>
                    </div>
                `;
            }
        };
        
        lookupButton.addEventListener('click', performLookup);
        
        // Allow Enter key to trigger lookup
        lookupInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                performLookup();
            }
        });
    }
}

function setupHoverEffects() {
    // Add smooth hover effects to all buttons
    document.querySelectorAll('button').forEach(button => {
        button.addEventListener('mouseenter', function() {
            if (!this.disabled && !this.classList.contains('no-hover')) {
                this.style.transform = 'translateY(-1px)';
            }
        });
        
        button.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });
}

// ============================================================================
// NAVIGATION FUNCTIONS
// ============================================================================

function activateTab(tabId) {
    // Update current tab
    window.currentTab = tabId;
    
    // Update content
    if (tabContents) {
        tabContents.forEach(content => {
            content.classList.remove('active');
        });
    }
    
    const targetContent = document.getElementById(tabId);
    if (targetContent) {
        targetContent.classList.add('active');
    }
    
    // Initialize tab-specific functionality
    initializeTabSpecificFeatures(tabId);
    
    // Update header title
    updateHeaderTitle(tabId);
    
    // Close mobile menu
    if (sidebar) {
        sidebar.classList.remove('mobile-open');
    }
    
    // Update URL hash (optional)
    if (history.replaceState) {
        history.replaceState(null, null, `#${tabId}`);
    }
}

function activateNavItem(navItem) {
    if (navItems) {
        navItems.forEach(item => {
            item.classList.remove('active');
        });
    }
    
    if (navItem) {
        navItem.classList.add('active');
    }
}

// Initialize tab-specific features
async function initializeTabSpecificFeatures(tabId) {
    try {
        switch (tabId) {
            case 'promocodes':
                // Initialize promocode functionality if not already initialized
                if (window.promocode && window.promocode.initialize) {
                    await window.promocode.initialize();
                }
                break;
            
            // Add other tab-specific initializations here as needed
            default:
                // No specific initialization needed
                break;
        }
    } catch (error) {
        console.error(`Failed to initialize features for tab ${tabId}:`, error);
        // Don't throw error to prevent navigation failure
    }
}

function updateHeaderTitle(tabId) {
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
    
    if (headerTitle) {
        headerTitle.textContent = titles[tabId] || 'Naming Standards';
    }
}

// ============================================================================
// URL HANDLING
// ============================================================================

function initializeFromURL() {
    // Check for hash in URL and activate corresponding tab
    const hash = window.location.hash.substring(1);
    if (hash) {
        const targetContent = document.getElementById(hash);
        if (targetContent) {
            activateTab(hash);
            
            // Find and activate the corresponding nav item
            const correspondingNavItem = document.querySelector(`[data-tab="${hash}"], [data-subtab="${hash}"]`);
            if (correspondingNavItem) {
                if (correspondingNavItem.hasAttribute('data-subtab')) {
                    // It's a sub-nav item
                    correspondingNavItem.click();
                } else {
                    // It's a main nav item
                    activateNavItem(correspondingNavItem);
                }
            }
        }
    }
}

// ============================================================================
// SEARCH FUNCTIONALITY
// ============================================================================

function initializeSearch() {
    const searchInput = document.querySelector('.search-input');
    
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            const searchTerm = e.target.value.toLowerCase().trim();
            
            if (searchTerm === '') {
                // Reset all nav items to visible
                document.querySelectorAll('.nav-item, .sub-nav-item').forEach(item => {
                    item.style.display = '';
                });
                return;
            }
            
            // Filter nav items based on search term
            document.querySelectorAll('.nav-item').forEach(item => {
                const text = item.textContent.toLowerCase();
                const shouldShow = text.includes(searchTerm);
                item.style.display = shouldShow ? '' : 'none';
            });
            
            document.querySelectorAll('.sub-nav-item').forEach(item => {
                const text = item.textContent.toLowerCase();
                const shouldShow = text.includes(searchTerm);
                item.style.display = shouldShow ? '' : 'none';
                
                // Show parent sub-nav if any child matches
                if (shouldShow) {
                    const parentSubNav = item.closest('.sub-nav');
                    if (parentSubNav) {
                        parentSubNav.style.display = 'block';
                        parentSubNav.classList.add('active');
                    }
                }
            });
        });
        
        // Clear search on escape
        searchInput.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                searchInput.value = '';
                searchInput.dispatchEvent(new Event('input'));
                searchInput.blur();
            }
        });
    }
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

function getCurrentTab() {
    return window.currentTab;
}

function navigateToTab(tabId) {
    const targetContent = document.getElementById(tabId);
    if (targetContent) {
        activateTab(tabId);
        return true;
    }
    return false;
}

// Make functions available globally for onclick handlers
window.activateTab = activateTab;
window.navigateToTab = navigateToTab;
window.getCurrentTab = getCurrentTab;