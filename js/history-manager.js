/* ============================================================================
   HISTORY MANAGER - Centralized history management for all naming standards
   ============================================================================ */

(function() {
    'use strict';
    
    const STORAGE_KEY = 'namingStandardsHistory';
    const MAX_ITEMS = 100;
    
    // History state
    let history = [];
    
    // Load history from localStorage
    function loadHistory() {
        try {
            const saved = localStorage.getItem(STORAGE_KEY);
            if (saved) {
                history = JSON.parse(saved);
            }
        } catch (e) {
            // Failed to load history
            history = [];
        }
    }
    
    // Save history to localStorage
    function saveHistory() {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
        } catch (e) {
            // Failed to save history
        }
    }
    
    // Add item to history
    function addItem(item) {
        // Ensure required fields
        if (!item.type || !item.name || !item.timestamp) {
            // Invalid history item
            return;
        }
        
        // Add to beginning
        history.unshift(item);
        
        // Limit size
        if (history.length > MAX_ITEMS) {
            history = history.slice(0, MAX_ITEMS);
        }
        
        // Save and update display
        saveHistory();
        updateDisplay();
    }
    
    // Clear all history
    function clearHistory() {
        if (confirm('Are you sure you want to clear all history?')) {
            history = [];
            saveHistory();
            updateDisplay();
            
            if (window.showNotification) {
                window.showNotification('History cleared', 'success');
            }
        }
    }
    
    // Get filtered history
    function getFilteredHistory(type = 'all') {
        if (type === 'all') {
            return history;
        }
        return history.filter(item => item.type === type);
    }
    
    // Format timestamp
    function formatTimestamp(timestamp) {
        const date = new Date(timestamp);
        const now = new Date();
        const diff = now - date;
        
        // Less than 1 minute
        if (diff < 60000) {
            return 'Just now';
        }
        
        // Less than 1 hour
        if (diff < 3600000) {
            const minutes = Math.floor(diff / 60000);
            return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
        }
        
        // Less than 24 hours
        if (diff < 86400000) {
            const hours = Math.floor(diff / 3600000);
            return `${hours} hour${hours > 1 ? 's' : ''} ago`;
        }
        
        // More than 24 hours - show date and time
        return date.toLocaleString();
    }
    
    // Get type label
    function getTypeLabel(type) {
        const labels = {
            'promocode': 'Promocode',
            'braze': 'Braze Name',
            'utm': 'UTM Link'
        };
        return labels[type] || type;
    }
    
    // Get type icon
    function getTypeIcon(type) {
        const icons = {
            'promocode': '🎟️',
            'braze': '📱',
            'utm': '🔗'
        };
        return icons[type] || '📄';
    }
    
    // Update history display
    function updateDisplay() {
        const listElement = document.getElementById('history-list');
        const countElement = document.getElementById('history-count');
        const filterElement = document.getElementById('history-filter');
        
        if (!listElement) return;
        
        const filterType = filterElement ? filterElement.value : 'all';
        const filtered = getFilteredHistory(filterType);
        
        // Update count
        if (countElement) {
            countElement.textContent = filtered.length;
        }
        
        // Display items
        if (filtered.length === 0) {
            listElement.innerHTML = `
                <div class="history-empty" style="padding: var(--space-xl); text-align: center; color: var(--gray-500);">
                    <div style="font-size: 2rem; margin-bottom: var(--space-md);">📭</div>
                    <p>${filterType === 'all' ? 'No history yet. Start generating naming standards!' : `No ${getTypeLabel(filterType)} history yet.`}</p>
                </div>
            `;
            return;
        }
        
        listElement.innerHTML = filtered.map(item => {
            const details = getItemDetails(item);
            return `
                <div class="history-item" style="padding: var(--space-md); border-bottom: 1px solid var(--gray-200); display: flex; justify-content: space-between; align-items: center;">
                    <div style="flex: 1;">
                        <div style="display: flex; align-items: center; gap: var(--space-sm); margin-bottom: var(--space-xs);">
                            <span style="font-size: 1.25rem;">${getTypeIcon(item.type)}</span>
                            <span style="font-weight: 600; color: var(--gray-900); font-family: var(--font-mono); font-size: 0.875rem;">${item.name}</span>
                        </div>
                        <div style="font-size: 0.75rem; color: var(--gray-600);">
                            <span style="background: var(--gray-100); padding: 2px 6px; border-radius: 4px; margin-right: var(--space-xs);">${getTypeLabel(item.type)}</span>
                            ${details}
                            <span style="margin-left: var(--space-sm);">${formatTimestamp(item.timestamp)}</span>
                        </div>
                    </div>
                    <button onclick="window.historyManager.copyItem('${item.name}')" class="btn btn-secondary btn-sm" style="padding: var(--space-xs) var(--space-sm); font-size: 0.75rem;">
                        Copy
                    </button>
                </div>
            `;
        }).join('');
    }
    
    // Get item details based on type
    function getItemDetails(item) {
        if (item.type === 'promocode') {
            return item.brand ? `Brand: ${item.brand}` : '';
        } else if (item.type === 'braze') {
            const parts = [];
            if (item.objectType) parts.push(`Type: ${item.objectType}`);
            if (item.brand) parts.push(`Brand: ${item.brand}`);
            if (item.commType) parts.push(`Comm: ${item.commType}`);
            return parts.join(' • ');
        } else if (item.type === 'utm') {
            return item.campaign ? `Campaign: ${item.campaign}` : '';
        }
        return '';
    }
    
    // Copy item to clipboard
    function copyItem(text) {
        navigator.clipboard.writeText(text)
            .then(() => {
                if (window.showNotification) {
                    window.showNotification('Copied to clipboard!', 'success');
                }
            })
            .catch(err => {
                // Failed to copy
                if (window.showNotification) {
                    window.showNotification('Failed to copy', 'error');
                }
            });
    }
    
    // Initialize
    function initialize() {
        loadHistory();
        updateDisplay();
        
        // Set up event listeners
        const filterElement = document.getElementById('history-filter');
        if (filterElement) {
            filterElement.addEventListener('change', updateDisplay);
        }
        
        const clearButton = document.getElementById('clear-history-btn');
        if (clearButton) {
            clearButton.addEventListener('click', clearHistory);
        }
    }
    
    // Public API
    window.historyManager = {
        addItem: addItem,
        clearHistory: clearHistory,
        updateDisplay: updateDisplay,
        copyItem: copyItem,
        initialize: initialize
    };
    
    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initialize);
    } else {
        initialize();
    }
})();