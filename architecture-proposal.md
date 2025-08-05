# Architecture Refactoring Proposal

## Overview

To prevent future conflicts and improve maintainability, we need to refactor the codebase from its current global function approach to a properly namespaced, modular architecture.

## Current Issues

1. **Global Namespace Pollution**: 100+ global functions
2. **Name Conflicts**: Already encountered duplicate functions (showError, handleBrandChange)
3. **No Clear Boundaries**: Modules can accidentally interfere with each other
4. **Difficult to Test**: Global functions are hard to mock/test
5. **Poor Discoverability**: No clear API surface

## Proposed Solution: Namespaced Modular Architecture

### 1. Root Namespace

```javascript
// All app code lives under CJC (Codex Junior Club) namespace
window.CJC = {
    version: '1.0.0',
    modules: {},
    utils: {},
    events: null,
    config: null
};
```

### 2. Module Pattern Example

```javascript
// Each module is self-contained with private state
CJC.modules.promocode = (function() {
    // Private variables
    let currentBrandData = null;
    let currentProductData = null;
    
    // Private functions
    function validateForm() {
        // Implementation
    }
    
    function showError(message) {
        // Now this is private to this module
        CJC.utils.notify(message, 'error');
    }
    
    // Public API
    return {
        initialize: function() {
            console.log('Promocode module initialized');
        },
        
        generateCode: function(values) {
            return generateUnifiedCode(currentBrandData.code, values);
        },
        
        handleBrandChange: function() {
            // No more conflicts!
        }
    };
})();
```

### 3. Event Bus for Communication

```javascript
CJC.events = (function() {
    const listeners = {};
    
    return {
        on(event, callback) {
            if (!listeners[event]) listeners[event] = [];
            listeners[event].push(callback);
        },
        
        off(event, callback) {
            if (!listeners[event]) return;
            listeners[event] = listeners[event].filter(cb => cb !== callback);
        },
        
        emit(event, data) {
            if (!listeners[event]) return;
            listeners[event].forEach(callback => callback(data));
        }
    };
})();

// Usage
CJC.events.on('brand:changed', function(brandData) {
    console.log('Brand changed to:', brandData);
});
```

### 4. Shared Utilities

```javascript
CJC.utils = {
    notify: function(message, type = 'info') {
        // Centralized notification system
    },
    
    copyToClipboard: function(text) {
        // Shared utility
    },
    
    debounce: function(func, wait) {
        // Shared utility
    }
};
```

### 5. Module Loader

```javascript
CJC.loadModule = function(moduleName) {
    return new Promise((resolve, reject) => {
        if (CJC.modules[moduleName]) {
            resolve(CJC.modules[moduleName]);
            return;
        }
        
        // Dynamic loading logic here
        const script = document.createElement('script');
        script.src = `js/modules/${moduleName}.js`;
        script.onload = () => resolve(CJC.modules[moduleName]);
        script.onerror = reject;
        document.head.appendChild(script);
    });
};
```

## Migration Plan

### Phase 1: Foundation (2 hours)
1. Create CJC namespace structure
2. Move utilities to CJC.utils
3. Implement event bus
4. Create module template

### Phase 2: Core Modules (4 hours)
1. Refactor auth → CJC.modules.auth
2. Refactor database → CJC.modules.database
3. Refactor navigation → CJC.modules.navigation

### Phase 3: Feature Modules (4 hours)
1. Refactor promocode → CJC.modules.promocode
2. Refactor braze → CJC.modules.braze
3. Refactor csv-importer → CJC.modules.csvImporter

### Phase 4: Testing & Documentation (2 hours)
1. Test all functionality
2. Update documentation
3. Create migration guide

## Benefits

1. **No More Conflicts**: Each module has its own scope
2. **Clear APIs**: Public methods are explicitly defined
3. **Better Testing**: Modules can be tested in isolation
4. **Easier Debugging**: Clear boundaries between modules
5. **Future-Proof**: New features can be added as modules

## Example: Refactored Promocode Module

```javascript
// Before (global functions)
function handleBrandChange() { }
function showError() { }
function generatePromocode() { }

// After (namespaced module)
CJC.modules.promocode.handleBrandChange()
// showError is now private
CJC.modules.promocode.generateCode()
```

## Backwards Compatibility

During migration, we can maintain backwards compatibility:

```javascript
// Temporary compatibility layer
window.handlePromocodeBrandChange = function() {
    console.warn('Deprecated: Use CJC.modules.promocode.handleBrandChange()');
    return CJC.modules.promocode.handleBrandChange();
};
```

## Conclusion

This architecture will:
- Eliminate naming conflicts
- Improve code organization
- Make the codebase more maintainable
- Enable easier testing
- Support future growth

The migration can be done incrementally, module by module, without breaking existing functionality.