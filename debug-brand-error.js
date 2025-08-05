// Debug script to trace the "Invalid type parameter: [object Event]" error
// Run this in the browser console to add detailed logging

(function() {
    // Override handleBrandChange in braze-naming.js to add more logging
    const originalHandleBrandChange = window.handleBrandChange;
    if (typeof handleBrandChange === 'function') {
        window.handleBrandChange = function(type) {
            console.log('=== handleBrandChange called ===');
            console.log('Type parameter:', type);
            console.log('Type of parameter:', typeof type);
            console.log('Is Event object?', type instanceof Event);
            console.log('Call stack:', new Error().stack);
            
            // Call original function
            if (originalHandleBrandChange) {
                return originalHandleBrandChange.apply(this, arguments);
            }
        };
    }
    
    // Log all change events on brand selects
    const brandSelects = document.querySelectorAll('[id$="-brand"]');
    console.log('Found brand selects:', brandSelects.length);
    
    brandSelects.forEach(select => {
        console.log('Adding debug listener to:', select.id);
        
        // Get existing listeners info
        const listeners = getEventListeners ? getEventListeners(select) : null;
        if (listeners && listeners.change) {
            console.log(`Existing change listeners on ${select.id}:`, listeners.change.length);
        }
        
        // Add debug listener
        select.addEventListener('change', function(e) {
            console.log(`=== Change event on ${select.id} ===`);
            console.log('Event:', e);
            console.log('Target value:', e.target.value);
            console.log('Current tab:', window.currentTab);
        }, true); // Use capture phase to run first
    });
    
    // Monitor tab changes
    const originalActivateTab = window.activateTab;
    window.activateTab = function(tabId) {
        console.log('=== Tab change: ' + tabId + ' ===');
        const result = originalActivateTab.apply(this, arguments);
        
        // Check brand selects after tab change
        setTimeout(() => {
            console.log('Checking brand selects after tab change...');
            const selects = document.querySelectorAll('[id$="-brand"]');
            selects.forEach(select => {
                console.log(`${select.id}: visible=${select.offsetParent !== null}, value="${select.value}"`);
            });
        }, 100);
        
        return result;
    };
    
    console.log('Debug script loaded. Try switching between tabs and selecting brands.');
})();