/* ============================================================================
   CJC NAMESPACE - Foundation for conflict-free feature development
   ============================================================================ */

// Create the root namespace
window.CJC = window.CJC || {
    version: '1.0.0',
    modules: {},
    utils: {},
    config: null,
    events: null
};

// Event Bus for inter-module communication
CJC.events = (function() {
    const listeners = {};
    
    return {
        on(event, callback) {
            if (!listeners[event]) listeners[event] = [];
            listeners[event].push(callback);
            return this; // Allow chaining
        },
        
        off(event, callback) {
            if (!listeners[event]) return this;
            if (!callback) {
                delete listeners[event];
            } else {
                listeners[event] = listeners[event].filter(cb => cb !== callback);
            }
            return this;
        },
        
        emit(event, data) {
            if (!listeners[event]) return this;
            listeners[event].forEach(callback => {
                try {
                    callback(data);
                } catch (error) {
                    console.error(`Error in event listener for ${event}:`, error);
                }
            });
            return this;
        },
        
        once(event, callback) {
            const wrapper = (data) => {
                callback(data);
                this.off(event, wrapper);
            };
            return this.on(event, wrapper);
        }
    };
})();

// Shared utilities
CJC.utils = {
    // Notification system (replaces multiple showError functions)
    notify(message, type = 'info') {
        if (window.showNotification) {
            window.showNotification(message, type);
        } else if (type === 'error') {
            alert('Error: ' + message);
        } else {
            console.log(`[${type.toUpperCase()}]`, message);
        }
    },
    
    // Copy to clipboard (centralized)
    copyToClipboard(text) {
        if (window.copyToClipboard) {
            return window.copyToClipboard(text);
        }
        // Fallback implementation
        const textarea = document.createElement('textarea');
        textarea.value = text;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
        this.notify('Copied to clipboard!', 'success');
    },
    
    // Debounce utility
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },
    
    // Generate unique ID
    generateId(prefix = 'id') {
        return `${prefix}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }
};

// Module loader and manager
CJC.defineModule = function(name, factory) {
    if (CJC.modules[name]) {
        console.warn(`Module ${name} already exists. Overwriting...`);
    }
    
    try {
        // Create module with access to CJC utilities
        const moduleAPI = {
            utils: CJC.utils,
            events: CJC.events,
            config: CJC.config
        };
        
        // Execute factory function to create module
        CJC.modules[name] = factory(moduleAPI);
        
        // Emit module loaded event
        CJC.events.emit('module:loaded', { name, module: CJC.modules[name] });
        
        console.log(`✅ Module loaded: ${name}`);
        return CJC.modules[name];
        
    } catch (error) {
        console.error(`❌ Failed to load module ${name}:`, error);
        throw error;
    }
};

// Configuration management
CJC.setConfig = function(config) {
    CJC.config = Object.freeze({ ...config });
    CJC.events.emit('config:updated', CJC.config);
};

// Module communication helper
CJC.require = function(moduleName) {
    if (!CJC.modules[moduleName]) {
        throw new Error(`Module ${moduleName} not found. Make sure it's loaded.`);
    }
    return CJC.modules[moduleName];
};

// Development helpers
CJC.debug = {
    listModules() {
        console.log('Loaded modules:', Object.keys(CJC.modules));
        return Object.keys(CJC.modules);
    },
    
    listEvents() {
        console.log('Active events:', Object.keys(CJC.events._listeners || {}));
    },
    
    checkConflicts() {
        const globalFuncs = [];
        for (let key in window) {
            if (typeof window[key] === 'function' && !key.startsWith('webkit')) {
                globalFuncs.push(key);
            }
        }
        console.log(`Found ${globalFuncs.length} global functions`);
        return globalFuncs;
    }
};

console.log('CJC Namespace initialized. Use CJC.defineModule() to add new features safely.');