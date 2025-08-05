# Codebase Inventory Report

Generated: 2025-08-05

## Executive Summary

- **Total JS files**: 15 (excluding lib files)
- **Potential conflicts found**: 2
- **Global namespace pollution**: High (many window.* assignments)
- **Architecture**: Monolithic with global functions and variables

## 🚨 Critical Issues Found

### 1. Duplicate Function: `showError`
- **auth.js:320** - `function showError(elementId, message)`
- **promocode.js:877** - `function showError(message)`

**Impact**: These functions have different signatures and will conflict in global scope.

### 2. Missing File Reference (Fixed)
- **sql-database-omni-init.js** - File existed but wasn't referenced (now deleted)

### 3. Brand Change Error Source
- The "Invalid type parameter: [object Event]" error is likely from navigation between tabs
- When switching from promocode to Braze tabs, event handlers might be crossing

## Global Functions Inventory

### auth.js (12 functions)
- updateAuthUI
- showAuthModal
- hideAuthModal
- toggleUserDropdown
- hideUserDropdown
- setLoadingState
- showError ⚠️
- hideError
- showNotification
- getCurrentUser
- isAuthenticated
- hasRole

### braze-naming.js (13 functions)
- initializeBrazeNaming
- initializeBrazeForm
- setupBrazeEventListeners
- handleBrandChange
- handleMainCommTypeChange
- updateBrazeFormState
- resetBrazeForm
- populateBrazeDropdown
- resetBrazeDropdown
- handleDiscountTypeChange
- handleBrandCountryVisibility
- generateBrazeName
- capitalizeFirst

### promocode.js (22 functions)
- generateUnifiedCode
- reversePromocode
- createNorwegianStyleFields
- renderFormFields
- createSimpleFormField
- setupFormEventListeners
- handlePromocodeBrandChange
- handleProductChange
- handleDiscountTypeChange
- handleBrandCountryVisibility
- handleGenerateClick
- collectFormValues
- validateRequiredFields
- validateForm
- clearForm
- showResult
- hideResult
- showLoading
- hideLoading
- showError ⚠️
- saveToHistory
- initializePromocodePage
- populateBrandDropdown

### navigation.js (10 functions)
- initializeNavigation
- setupNavigationEvents
- setupMobileMenu
- setupKeyboardShortcuts
- setupReverseLookup
- setupHoverEffects
- activateTab
- updateHeaderTitle
- initializeTabSpecificFeatures
- navigateToTab
- getCurrentTab

### main.js (12 functions)
- startApplicationInitialization
- initializeDatabaseLayer
- initializeData
- initializeAuthSystem
- initializeUIComponents
- initializeBusinessLogic
- finalizeApplication
- showLoadingOverlay
- hideLoadingOverlay
- showApplication
- showInitializationError
- copyToClipboard
- formatDate
- debounce

## Window Namespace Usage

### Modules Exported to window
1. **window.AppConfig** (config.js)
2. **window.auth** (auth.js)
3. **window.brazeNamingData** (braze-naming-data.js)
4. **window.brazeNaming** (braze-naming.js)
5. **window.CSVImporter** (csv-importer.js)
6. **window.dataManager** (data-manager.js)
7. **window.database** (database.js)
8. **window.MockData** (mock-data.js)
9. **window.MockDatabase** (mock-data.js)
10. **window.promocode** (promocode.js)
11. **window.sqlDB** (sql-database.js)
12. **window.INITIAL_DATABASE** (database-initializer.js)

### Global Variables
- **window.currentTab** (navigation.js)
- Multiple utility functions in window scope

## Event Listeners Analysis

### Change Events
- Multiple brand select elements with change listeners
- Form inputs with validation listeners
- Discount type changes

### Critical Finding
All Braze forms (campaign, canvas, segment) have brand select elements that trigger handleBrandChange with proper type parameter.

## Recommendations

### Immediate Fixes
1. ✅ Rename duplicate `showError` functions
2. ✅ Remove orphaned sql-database-omni-init.js file (done)
3. ✅ Fix handleBrandChange naming conflict (already done)

### Architecture Improvements

#### 1. Implement Namespace Pattern
```javascript
window.CJC = {
    auth: { /* auth functions */ },
    promocode: { /* promocode functions */ },
    braze: { /* braze functions */ },
    navigation: { /* navigation functions */ },
    utils: { /* shared utilities */ }
};
```

#### 2. Module Pattern for Each Component
```javascript
// Example for promocode module
window.CJC.promocode = (function() {
    // Private variables
    let currentBrand = null;
    
    // Private functions
    function validateForm() { /* ... */ }
    
    // Public API
    return {
        initialize: initializePromocodePage,
        generateCode: generateUnifiedCode
    };
})();
```

#### 3. Event Bus for Cross-Module Communication
```javascript
window.CJC.events = {
    listeners: {},
    on(event, callback) { /* ... */ },
    emit(event, data) { /* ... */ },
    off(event, callback) { /* ... */ }
};
```

#### 4. Dependency Management
- Define clear initialization order
- Remove circular dependencies
- Use async/await for proper sequencing

## Next Steps

1. **Phase 1**: Fix immediate conflicts (showError functions)
2. **Phase 2**: Implement namespace structure
3. **Phase 3**: Refactor modules one by one
4. **Phase 4**: Add event bus for communication
5. **Phase 5**: Create module loader system

This refactoring will prevent future conflicts and make the codebase more maintainable as new features are added.