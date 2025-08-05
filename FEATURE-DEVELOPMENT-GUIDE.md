# Feature Development Guide

## 🛡️ Conflict-Free Feature Development

This guide ensures you can add new features without breaking existing functionality.

## Quick Start for New Features

### 1. Include the Namespace (One-time setup)

Add this to your `index.html` BEFORE all other JavaScript files:
```html
<!-- Add this line before other JS files -->
<script src="js/cjc-namespace.js"></script>
```

### 2. Create Your Feature Module

Copy `js/module-template.js` to create your new feature:
```bash
cp js/module-template.js js/my-new-feature.js
```

### 3. Define Your Module

```javascript
CJC.defineModule('myNewFeature', function(api) {
    const { utils, events } = api;
    
    // Private variables - no conflicts!
    let privateState = {};
    
    // Private functions - no conflicts!
    function handleSubmit() {
        // Your code here
    }
    
    function showError(msg) {
        utils.notify(msg, 'error');
    }
    
    // Public API
    return {
        initialize() {
            console.log('My feature initialized');
        },
        
        doSomething() {
            // Feature logic
        }
    };
});
```

### 4. Use Your Module

```javascript
// In your main.js or navigation.js
const myFeature = CJC.require('myNewFeature');
myFeature.initialize();
myFeature.doSomething();
```

## ❌ DON'T DO THIS (Causes Conflicts)

```javascript
// BAD - Global function
function handleSubmit() { }

// BAD - Global variable
var currentUser = null;

// BAD - Window assignment
window.myFunction = function() { }
```

## ✅ DO THIS INSTEAD (Conflict-Free)

```javascript
// GOOD - Module scoped
CJC.defineModule('userFeature', function(api) {
    // Private - no conflicts
    let currentUser = null;
    
    function handleSubmit() { }
    
    return {
        getUser: () => currentUser
    };
});
```

## Common Patterns

### 1. Notification/Errors
```javascript
// Instead of multiple showError functions:
api.utils.notify('Something went wrong', 'error');
api.utils.notify('Success!', 'success');
```

### 2. Event Communication
```javascript
// Emit events
api.events.emit('user:login', userData);

// Listen to events
api.events.on('user:login', function(data) {
    console.log('User logged in:', data);
});
```

### 3. Accessing Other Modules
```javascript
// Safe module access
const database = CJC.require('database');
const result = await database.fetchData();
```

### 4. Module Initialization
```javascript
// In navigation.js
async function initializeTabSpecificFeatures(tabId) {
    switch (tabId) {
        case 'my-feature':
            const myFeature = CJC.require('myNewFeature');
            myFeature.initialize();
            break;
    }
}
```

## Migration Example: Promocode Module

**Before (Global Functions):**
```javascript
// Conflicts with other modules!
let currentBrandData = null;

function showError(message) { }
function handleBrandChange() { }
function generatePromocode() { }

window.promocode = {
    initialize: initializePromocodePage
};
```

**After (Namespaced Module):**
```javascript
CJC.defineModule('promocode', function(api) {
    // Private - no conflicts
    let currentBrandData = null;
    
    function showError(message) {
        api.utils.notify(message, 'error');
    }
    
    function handleBrandChange() {
        // Implementation
    }
    
    // Public API
    return {
        initialize() {
            // Setup code
        },
        
        generateCode(values) {
            return generateUnifiedCode(currentBrandData.code, values);
        }
    };
});
```

## Benefits

1. **No Naming Conflicts** - Each module has its own scope
2. **Clear Dependencies** - Use CJC.require() to access other modules
3. **Better Testing** - Test modules in isolation
4. **Easy Debugging** - CJC.debug.listModules() shows all loaded modules
5. **Event-Driven** - Modules communicate through events

## Debugging Tools

```javascript
// List all modules
CJC.debug.listModules();

// Check for global functions (should decrease over time)
CJC.debug.checkConflicts();

// See active event listeners
CJC.debug.listEvents();
```

## Best Practices

1. **One Module Per File** - Keep modules focused
2. **Private by Default** - Only expose what's necessary
3. **Use Events** - For cross-module communication
4. **Avoid Global** - Never create global functions/variables
5. **Document API** - Clear comments on public methods

## FAQ

**Q: What if I need to access a module before it's loaded?**
A: Use events to wait for module load:
```javascript
CJC.events.once('module:loaded', function(data) {
    if (data.name === 'myModule') {
        // Now safe to use
    }
});
```

**Q: How do I share data between modules?**
A: Use events or create a shared data module:
```javascript
// Option 1: Events
CJC.events.emit('data:updated', newData);

// Option 2: Shared module
CJC.defineModule('sharedData', function() {
    const store = {};
    return {
        set: (key, val) => store[key] = val,
        get: (key) => store[key]
    };
});
```

**Q: Can I still use existing global functions?**
A: Yes, during migration. But wrap them in modules ASAP.

## Next Steps

1. Add `cjc-namespace.js` to your HTML
2. Create your first module using the template
3. Gradually migrate existing code
4. Remove global functions one by one

This approach guarantees conflict-free development!