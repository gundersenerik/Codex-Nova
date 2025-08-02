/* ============================================================================
   PROMOCODE GENERATOR - Unified Norwegian logic for all brands
   ============================================================================ */

// Global variables for promocode functionality
let currentBrandData = null;
let currentProductData = null;

// ============================================================================
// UNIFIED PROMOCODE GENERATION LOGIC
// ============================================================================

// Generate promocode using unified Norwegian logic for ALL brands
function generateUnifiedCode(brandCode, values) {
    try {
        // Validate inputs
        if (!brandCode || !values) {
            throw new Error('Missing brand code or values');
        }

        let codeParts = [brandCode];
        
        // Product part
        if (values.product) {
            // Convert product name to clean code format
            const productCode = values.product.toUpperCase()
                .replace(/[^A-Z0-9]/g, '')
                .substring(0, 10); // Limit length
            codeParts.push(productCode);
        }
        
        // Offer segments
        let offerSegments = [];
        
        // Duration + Period + Price (Norwegian style)
        if (values.offerDuration && values.offerPeriod) {
            let initialOfferPart = `${values.offerDuration}${values.offerPeriod.toUpperCase()}`;
            
            // Add price if discount type is 'kr' 
            if (values.discountType === 'kr' && values.offerPrice) {
                initialOfferPart += values.offerPrice;
            }
            
            offerSegments.push(initialOfferPart);
        }
        
        // Percentage discount
        if (values.discountType === 'pros' && values.discountValue) {
            offerSegments.push(`${values.discountValue}PROS`);
        }
        
        // Custom offer text
        if (values.customOfferText) {
            const cleanCustomText = values.customOfferText.toUpperCase()
                .replace(/[^A-Z0-9]/g, '')
                .substring(0, 8); // Limit length
            offerSegments.push(cleanCustomText);
        }
        
        // Add offer part if we have segments
        if (offerSegments.length > 0) {
            codeParts.push(offerSegments.join('-'));
        }
        
        // Lifecycle part
        let lifecyclePart = '';
        if (values.lifecycle) {
            lifecyclePart += values.lifecycle;
        }
        if (values.isUnder30) {
            lifecyclePart += 'U30';
        }
        if (lifecyclePart) {
            codeParts.push(lifecyclePart);
        }
        
        // Renewal rate plan
        if (values.renewalRatePlan) {
            codeParts.push(values.renewalRatePlan);
        }
        
        // Join all parts and ensure uppercase
        const finalCode = codeParts.filter(part => part && part.length > 0).join('-').toUpperCase();
        
        if (finalCode.length < 3) {
            throw new Error('Generated code too short - please fill in more fields');
        }
        
        return finalCode;
        
    } catch (error) {
        console.error('Error generating promocode:', error);
        throw error;
    }
}

// Reverse engineer a promocode (basic implementation)
function reversePromocode(code) {
    try {
        if (!code || typeof code !== 'string') {
            return { error: 'Invalid code format' };
        }
        
        const parts = code.toUpperCase().split('-');
        if (parts.length < 2) {
            return { error: 'Invalid code format - too few parts' };
        }
        
        const result = {
            brand: `Brand: ${parts[0]}`,
            structure: `Parts: ${parts.length}`
        };
        
        if (parts.length > 1) {
            result.product = `Product: ${parts[1]}`;
        }
        
        if (parts.length > 2) {
            result.offer = `Offer: ${parts[2]}`;
        }
        
        if (parts.length > 3) {
            result.lifecycle = `Lifecycle: ${parts[3]}`;
        }
        
        if (parts.length > 4) {
            result.renewal = `Renewal: ${parts[4]}`;
        }
        
        return result;
        
    } catch (error) {
        console.error('Error reversing promocode:', error);
        return { error: 'Failed to reverse engineer code' };
    }
}

// ============================================================================
// FORM GENERATION AND MANAGEMENT
// ============================================================================

// Create the unified Norwegian-style form fields with size hints for layout
function createNorwegianStyleFields() {
    return [
        {
            id: 'product',
            label: 'Product',
            type: 'select',
            options: { '': 'Select a product' },
            required: true,
            size: 'medium',
            row: 1
        },
        {
            id: 'renewalRatePlan',
            label: 'Renewal Rate Plan', 
            type: 'select',
            options: { '': 'Select a rate plan' },
            required: true,
            size: 'medium',
            row: 1
        },
        {
            id: 'lifecycle',
            label: 'Lifecycle',
            type: 'select',
            options: { 
                '': 'None', 
                'HB': 'Holdback', 
                'WB': 'Winback', 
                'CMP': 'Campaign' 
            },
            required: false,
            size: 'small',
            row: 2
        },
        {
            id: 'offerDuration',
            label: 'Initial Duration',
            type: 'number',
            placeholder: 'e.g., 3',
            min: 1,
            max: 24,
            required: false,
            size: 'small',
            row: 2
        },
        {
            id: 'offerPeriod',
            label: 'Initial Period',
            type: 'select',
            options: { 
                '': 'Select period',
                'm': 'Måneder', 
                'u': 'Uker', 
                'q': 'Kvartal', 
                'h': 'Halvår', 
                'y': 'År' 
            },
            required: false,
            size: 'small',
            row: 2
        },
        {
            id: 'discountType',
            label: 'Discount Type',
            type: 'select',
            options: { 
                '': 'No Discount', 
                'kr': 'Kronor (kr)', 
                'pros': 'Percent (%)' 
            },
            required: false,
            size: 'small',
            row: 3
        },
        {
            id: 'offerPrice',
            label: 'Offer Price (kr)',
            type: 'number',
            placeholder: 'e.g., 199',
            min: 1,
            max: 9999,
            required: false,
            showWhen: { field: 'discountType', value: 'kr' },
            size: 'small',
            row: 3
        },
        {
            id: 'discountValue',
            label: 'Discount Value (%)',
            type: 'number',
            placeholder: 'e.g., 50',
            min: 1,
            max: 100,
            required: false,
            showWhen: { field: 'discountType', value: 'pros' },
            size: 'small',
            row: 3
        },
        {
            id: 'customOfferText',
            label: 'Custom Offer Text (Optional)',
            type: 'text',
            placeholder: 'e.g., 3FOR1, SUMMER24',
            maxLength: 8,
            required: false,
            size: 'large',
            row: 4
        },
        {
            id: 'isUnder30',
            label: 'Under 30',
            type: 'checkbox',
            required: false,
            size: 'small',
            row: 2,
            showWhen: { type: 'brandCountry', value: 'NO' }
        }
    ];
}

// NEW CLEAN FORM RENDERING SYSTEM
function renderFormFields(fields, containerSelector = '#dynamic-form-container') {
    const container = document.querySelector(containerSelector);
    if (!container) {
        console.error('Form container not found:', containerSelector);
        return;
    }
    
    container.innerHTML = '';
    
    // Create main form element
    const form = document.createElement('form');
    form.className = 'promocode-form';
    form.setAttribute('novalidate', 'true'); // We handle validation ourselves
    
    // Group fields by row
    const fieldsByRow = {};
    fields.forEach(field => {
        const row = field.row || 1;
        if (!fieldsByRow[row]) fieldsByRow[row] = [];
        fieldsByRow[row].push(field);
    });
    
    // Create rows
    Object.keys(fieldsByRow).sort().forEach(rowNum => {
        const rowDiv = document.createElement('div');
        rowDiv.className = 'form-row';
        rowDiv.dataset.row = rowNum;
        
        fieldsByRow[rowNum].forEach(field => {
            const fieldWrapper = createCleanFormField(field);
            rowDiv.appendChild(fieldWrapper);
        });
        
        form.appendChild(rowDiv);
    });
    
    // Add generate button
    const buttonRow = document.createElement('div');
    buttonRow.className = 'form-row form-actions';
    buttonRow.innerHTML = `
        <button type="button" id="generate-promocode-btn" class="generate-btn">
            <span class="btn-icon">🚀</span>
            <span class="btn-text">Generate Promocode</span>
        </button>
    `;
    
    form.appendChild(buttonRow);
    container.appendChild(form);
    
    // Setup event listeners
    setupFormEventListeners();
    
    // Initialize conditional field visibility
    handleDiscountTypeChange();
    handleBrandCountryVisibility();
}

// Clean event listener setup - no longer needed for styling

// Create clean form field with proper clickability
function createCleanFormField(field) {
    const wrapper = document.createElement('div');
    wrapper.className = `field-wrapper field-${field.size || 'medium'}`;
    wrapper.dataset.fieldId = field.id;
    
    // Handle conditional visibility
    if (field.showWhen) {
        wrapper.style.display = 'none';
        wrapper.dataset.showWhen = JSON.stringify(field.showWhen);
    }
    
    if (field.type === 'checkbox') {
        // Checkbox with clickable label
        wrapper.innerHTML = `
            <label class="checkbox-label">
                <input type="checkbox" 
                       id="${field.id}" 
                       name="${field.id}"
                       class="checkbox-input">
                <span class="checkbox-text">${field.label}</span>
            </label>
        `;
    } else {
        // Create label
        const label = document.createElement('label');
        label.className = 'field-label';
        label.setAttribute('for', field.id);
        label.innerHTML = field.label + (field.required ? ' <span class="required">*</span>' : '');
        
        // Create input/select
        let input;
        if (field.type === 'select') {
            input = document.createElement('select');
            input.className = 'field-input field-select';
            
            Object.entries(field.options).forEach(([value, text]) => {
                const option = document.createElement('option');
                option.value = value;
                option.textContent = text;
                input.appendChild(option);
            });
        } else {
            input = document.createElement('input');
            input.className = 'field-input';
            input.type = field.type;
            
            if (field.placeholder) input.placeholder = field.placeholder;
            if (field.min !== undefined) input.min = field.min;
            if (field.max !== undefined) input.max = field.max;
            if (field.maxLength) input.maxLength = field.maxLength;
        }
        
        input.id = field.id;
        input.name = field.id;
        if (field.required) input.required = true;
        
        wrapper.appendChild(label);
        wrapper.appendChild(input);
    }
    
    return wrapper;
}

// Setup form event listeners
function setupFormEventListeners() {
    // Product selection change
    const productSelect = document.getElementById('product');
    if (productSelect) {
        productSelect.addEventListener('change', handleProductChange);
    }
    
    // Generate button click
    const generateBtn = document.getElementById('generate-promocode-btn');
    if (generateBtn) {
        generateBtn.addEventListener('click', handleGenerateClick);
    }
    
    // Discount type change (for conditional fields)
    const discountTypeSelect = document.getElementById('discountType');
    if (discountTypeSelect) {
        discountTypeSelect.addEventListener('change', handleDiscountTypeChange);
    }
    
    // Form validation on input
    const form = document.querySelector('#dynamic-form-container');
    if (form) {
        form.addEventListener('input', validateForm);
    }
}

// ============================================================================
// EVENT HANDLERS
// ============================================================================

// Handle brand selection change
async function handleBrandChange() {
    const brandSelect = document.getElementById('brand-select');
    if (!brandSelect) return;
    
    const selectedBrandCode = brandSelect.value;
    
    // Clear previous results
    hideResult();
    clearForm();
    
    if (!selectedBrandCode) {
        clearForm();
        return;
    }
    
    try {
        showLoading('Loading brand data...');
        
        // Fetch full brand data
        const { data: brandData, error } = await window.database.getFullBrandData(selectedBrandCode);
        
        if (error) {
            throw new Error(error);
        }
        
        currentBrandData = brandData;
        
        // Store brand country for conditional fields
        const formContainer = document.querySelector('#dynamic-form-container');
        if (formContainer) {
            formContainer.dataset.brandCountry = brandData.brand.country;
        }
        
        // Generate and render form
        const fields = createNorwegianStyleFields();
        
        // Update product options
        const productField = fields.find(f => f.id === 'product');
        if (productField && brandData.products) {
            productField.options = window.database.transformProductsToOptions(brandData.products);
        }
        
        // Update rate plan options (initially empty)
        const ratePlanField = fields.find(f => f.id === 'renewalRatePlan');
        if (ratePlanField && brandData.initialRatePlans) {
            ratePlanField.options = window.database.transformRatePlansToOptions(brandData.initialRatePlans);
        }
        
        renderFormFields(fields);
        hideLoading();
        
    } catch (error) {
        console.error('Error handling brand change:', error);
        hideLoading();
        showError('Failed to load brand data: ' + error.message);
    }
}

// Handle product selection change
async function handleProductChange() {
    const productSelect = document.getElementById('product');
    const ratePlanSelect = document.getElementById('renewalRatePlan');
    
    if (!productSelect || !ratePlanSelect || !currentBrandData) return;
    
    const selectedProductKey = productSelect.value;
    if (!selectedProductKey) {
        ratePlanSelect.innerHTML = '<option value="">Select a rate plan</option>';
        return;
    }
    
    try {
        // Find the selected product
        const selectedProduct = currentBrandData.products.find(p => {
            const productKey = p.name
                .toLowerCase()
                .replace(/[^a-z0-9\s]/g, '')
                .replace(/\s+/g, '-');
            return productKey === selectedProductKey;
        });
        
        if (!selectedProduct) {
            console.error('Selected product not found:', selectedProductKey);
            return;
        }
        
        currentProductData = selectedProduct;
        
        // ADD DEBUGGING HERE
        console.log('Selected product:', selectedProduct);
        console.log('Fetching rate plans for product ID:', selectedProduct.id);
        
        // Fetch rate plans for this product
        const { data: ratePlans, error } = await window.database.fetchRatePlansForProduct(selectedProduct.id);
        
        if (error) {
            throw new Error(error);
        }
        
        // MORE DEBUGGING
        console.log('Rate plans received:', ratePlans);
        console.log('Number of rate plans:', ratePlans ? ratePlans.length : 0);
        if (ratePlans && ratePlans.length > 0) {
            console.log('First rate plan:', ratePlans[0]);
            console.log('Price type:', typeof ratePlans[0].price);
        }
        
        // Update rate plan select options
        const ratePlanOptions = window.database.transformRatePlansToOptions(ratePlans);
        console.log('Transformed options:', ratePlanOptions);
        
        ratePlanSelect.innerHTML = '';
        Object.entries(ratePlanOptions).forEach(([value, text]) => {
            const option = document.createElement('option');
            option.value = value;
            option.textContent = text;
            ratePlanSelect.appendChild(option);
        });
        
        console.log('Rate plan select updated, HTML:', ratePlanSelect.innerHTML);
        
    } catch (error) {
        console.error('Error handling product change:', error);
        showError('Failed to load rate plans: ' + error.message);
    }
}

// Handle discount type change (show/hide conditional fields)
function handleDiscountTypeChange() {
    const discountType = document.getElementById('discountType')?.value;
    
    // Handle conditional field visibility
    const allFields = document.querySelectorAll('[data-show-when]');
    allFields.forEach(field => {
        const showWhen = JSON.parse(field.dataset.showWhen);
        
        if (showWhen.field === 'discountType') {
            if (showWhen.value === discountType) {
                field.style.display = 'block';
                field.classList.add('fade-in');
                // Remove animation class after animation completes
                setTimeout(() => field.classList.remove('fade-in'), 300);
            } else {
                field.style.display = 'none';
                // Clear hidden field values
                const input = field.querySelector('input, select');
                if (input) input.value = '';
            }
        }
    });
}

// Handle brand country visibility (show/hide fields based on brand country)
function handleBrandCountryVisibility() {
    const formContainer = document.querySelector('#dynamic-form-container');
    const brandCountry = formContainer?.dataset.brandCountry;
    
    // Handle conditional field visibility based on brand country
    const allFields = document.querySelectorAll('[data-show-when]');
    allFields.forEach(field => {
        const showWhen = JSON.parse(field.dataset.showWhen);
        
        if (showWhen.type === 'brandCountry') {
            if (showWhen.value === brandCountry) {
                field.style.display = 'block';
            } else {
                field.style.display = 'none';
                // Clear hidden field values
                const input = field.querySelector('input');
                if (input && input.type === 'checkbox') {
                    input.checked = false;
                }
            }
        }
    });
}

// Handle generate button click
function handleGenerateClick() {
    try {
        if (!currentBrandData) {
            throw new Error('Please select a brand first');
        }
        
        // Collect form values
        const values = collectFormValues();
        
        // Validate required fields
        validateRequiredFields(values);
        
        // Generate the promocode
        const promocode = generateUnifiedCode(currentBrandData.brand.code, values);
        
        // Display result
        showResult(promocode);
        
        // Save to history (if user is logged in)
        saveToHistory(promocode, values);
        
    } catch (error) {
        console.error('Error generating promocode:', error);
        showError(error.message);
    }
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

// Collect all form values
function collectFormValues() {
    const values = {};
    
    const fields = createNorwegianStyleFields();
    fields.forEach(field => {
        const element = document.getElementById(field.id);
        if (element) {
            if (field.type === 'checkbox') {
                values[field.id] = element.checked;
            } else {
                values[field.id] = element.value;
            }
        }
    });
    
    return values;
}

// Validate required fields
function validateRequiredFields(values) {
    const fields = createNorwegianStyleFields();
    const requiredFields = fields.filter(f => f.required);
    
    for (const field of requiredFields) {
        if (!values[field.id] || values[field.id] === '') {
            throw new Error(`${field.label} is required`);
        }
    }
}

// Validate form in real-time
function validateForm() {
    const generateBtn = document.getElementById('generate-promocode-btn');
    if (!generateBtn) return;
    
    try {
        const values = collectFormValues();
        validateRequiredFields(values);
        
        generateBtn.disabled = false;
        generateBtn.style.opacity = '1';
        generateBtn.style.cursor = 'pointer';
        
    } catch (error) {
        generateBtn.disabled = true;
        generateBtn.style.opacity = '0.5';
        generateBtn.style.cursor = 'not-allowed';
    }
}

// Clear form
function clearForm() {
    const container = document.querySelector('#dynamic-form-container');
    if (container) {
        container.innerHTML = `
            <div class="placeholder">
                <div class="placeholder-icon">🎟️</div>
                <h3>Ready to Generate</h3>
                <p>Select a brand above to start configuring your promocode</p>
                <p style="font-size: 0.75rem; color: var(--gray-400); margin-top: var(--space-sm);">
                    All brands use the same Norwegian-style logic with database-driven data
                </p>
            </div>
        `;
    }
    currentBrandData = null;
    currentProductData = null;
}

// Show result
function showResult(promocode) {
    const resultContainer = document.getElementById('result-container');
    const generatedCodeElement = document.getElementById('generated-code');
    
    if (resultContainer && generatedCodeElement) {
        generatedCodeElement.textContent = promocode;
        resultContainer.style.display = 'block';
        
        // Scroll to result
        resultContainer.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
}

// Hide result
function hideResult() {
    const resultContainer = document.getElementById('result-container');
    if (resultContainer) {
        resultContainer.style.display = 'none';
    }
}

// Show loading state
function showLoading(message = 'Loading...') {
    const container = document.querySelector('#dynamic-form-container');
    if (container) {
        container.innerHTML = `
            <div class="placeholder">
                <div class="loading-spinner" style="margin: 0 auto var(--space-md) auto;"></div>
                <div style="color: var(--gray-600);">${message}</div>
            </div>
        `;
    }
}

// Hide loading state
function hideLoading() {
    // Loading will be replaced by renderFormFields
}

// Show error message
function showError(message) {
    if (window.showNotification) {
        window.showNotification(message, 'error');
    } else {
        alert('Error: ' + message);
    }
}

// Save to history
async function saveToHistory(promocode, values) {
    if (!currentBrandData) return;
    
    try {
        const parameters = {
            brand: currentBrandData.brand.code,
            brand_name: currentBrandData.brand.name,
            ...values
        };
        
        await window.database.saveGeneration('promocodes', promocode, parameters);
        
    } catch (error) {
        console.log('Failed to save to history:', error.message);
        // Don't show error to user for history saving failures
    }
}

// ============================================================================
// INITIALIZATION
// ============================================================================

// Initialize promocode page
async function initializePromocodePage() {
    try {
        console.log('Initializing promocode page...');
        
        // Initialize database connection
        if (!window.database.initialize()) {
            throw new Error('Failed to initialize database connection');
        }
        
        // Load and populate brand dropdown
        await populateBrandDropdown();
        
        // Setup main brand selection handler
        const brandSelect = document.getElementById('brand-select');
        if (brandSelect) {
            brandSelect.addEventListener('change', handleBrandChange);
        }
        
        // Setup copy button
        const copyBtn = document.getElementById('copy-promocode-btn');
        if (copyBtn) {
            copyBtn.addEventListener('click', () => {
                const codeElement = document.getElementById('generated-code');
                if (codeElement && window.copyToClipboard) {
                    window.copyToClipboard(codeElement.textContent);
                }
            });
        }
        
        console.log('Promocode page initialized successfully');
        
    } catch (error) {
        console.error('Error initializing promocode page:', error);
        showError('Failed to initialize promocode page: ' + error.message);
    }
}

// Populate brand dropdown from database
async function populateBrandDropdown() {
    const brandSelect = document.getElementById('brand-select');
    if (!brandSelect) return;
    
    try {
        const { data: brandGroups, error } = await window.database.getBrandsGrouped();
        
        if (error) {
            throw new Error(error);
        }
        
        brandSelect.innerHTML = '<option value="">Select a brand</option>';
        
        // Add Norwegian brands
        if (brandGroups.norwegian && brandGroups.norwegian.length > 0) {
            const norwegianGroup = document.createElement('optgroup');
            norwegianGroup.label = 'Norway';
            brandGroups.norwegian.forEach(brand => {
                const option = document.createElement('option');
                option.value = brand.code;
                option.textContent = brand.name;
                norwegianGroup.appendChild(option);
            });
            brandSelect.appendChild(norwegianGroup);
        }
        
        // Add Swedish brands
        if (brandGroups.swedish && brandGroups.swedish.length > 0) {
            const swedishGroup = document.createElement('optgroup');
            swedishGroup.label = 'Sweden';
            brandGroups.swedish.forEach(brand => {
                const option = document.createElement('option');
                option.value = brand.code;
                option.textContent = brand.name;
                swedishGroup.appendChild(option);
            });
            brandSelect.appendChild(swedishGroup);
        }
        
    } catch (error) {
        console.error('Error populating brand dropdown:', error);
        showError('Failed to load brands: ' + error.message);
    }
}

// ============================================================================
// MAKE FUNCTIONS GLOBALLY AVAILABLE
// ============================================================================

// Export functions to global scope
window.promocode = {
    initialize: initializePromocodePage,
    generateUnifiedCode,
    reversePromocode,
    handleBrandChange,
    collectFormValues
};

console.log('Promocode logic loaded successfully');

// ============================================================================
// DEBUGGING FUNCTIONS - TEMPORARY (Remove after fixing clickability issues)
// ============================================================================

// Debug form clicks
function debugFormClicks() {
    const form = document.querySelector('.promocode-form');
    if (!form) {
        console.warn('No form found with class .promocode-form');
        return;
    }
    
    // Log all clicks on form
    form.addEventListener('click', (e) => {
        console.log('=== CLICK DEBUG ===');
        console.log('Clicked element:', e.target);
        console.log('Tag:', e.target.tagName);
        console.log('Class:', e.target.className);
        console.log('ID:', e.target.id);
        console.log('Computed styles:', {
            pointerEvents: getComputedStyle(e.target).pointerEvents,
            zIndex: getComputedStyle(e.target).zIndex,
            position: getComputedStyle(e.target).position,
            display: getComputedStyle(e.target).display,
            width: getComputedStyle(e.target).width,
            height: getComputedStyle(e.target).height,
            cursor: getComputedStyle(e.target).cursor
        });
        console.log('Parent:', e.target.parentElement);
        console.log('Event phase:', e.eventPhase === 1 ? 'CAPTURE' : 'BUBBLE');
        console.log('=================');
    }, true); // Use capture phase
    
    // Check each field
    console.log('\n=== Field Boundaries ===');
    document.querySelectorAll('.field-wrapper').forEach(wrapper => {
        const input = wrapper.querySelector('input, select');
        const label = wrapper.querySelector('label');
        
        console.log(`Field: ${wrapper.dataset.fieldId}`);
        console.log('- Wrapper:', wrapper.getBoundingClientRect());
        console.log('- Label:', label?.getBoundingClientRect());
        console.log('- Input:', input?.getBoundingClientRect());
        console.log('---');
    });
}

// Check inherited styles
function checkInheritedStyles() {
    console.log('\n=== Checking Inherited Styles ===');
    const selectors = ['.field-input', '.field-select', '.field-label', '.field-wrapper', '.checkbox-label'];
    
    selectors.forEach(selector => {
        const element = document.querySelector(selector);
        if (!element) {
            console.log(`No element found for ${selector}`);
            return;
        }
        
        const styles = getComputedStyle(element);
        console.log(`\n${selector}:`);
        
        // Check problematic properties
        const problematic = {
            'pointer-events': styles.pointerEvents,
            'user-select': styles.userSelect,
            'z-index': styles.zIndex,
            'position': styles.position,
            'overflow': styles.overflow,
            'opacity': styles.opacity,
            'visibility': styles.visibility,
            'display': styles.display,
            'cursor': styles.cursor,
            'width': styles.width,
            'height': styles.height,
            'box-sizing': styles.boxSizing
        };
        
        Object.entries(problematic).forEach(([prop, value]) => {
            const isProblematic = 
                (prop === 'pointer-events' && value === 'none') ||
                (prop === 'visibility' && value === 'hidden') ||
                (prop === 'opacity' && value === '0') ||
                (prop === 'display' && value === 'none');
                
            if (isProblematic) {
                console.warn(`⚠️ ${prop}: ${value}`);
            } else {
                console.log(`✓ ${prop}: ${value}`);
            }
        });
    });
}

// Check for global CSS interference
function checkGlobalInterference() {
    console.log('\n=== Checking Global CSS Interference ===');
    const sheets = Array.from(document.styleSheets);
    const problematicRules = [];
    
    sheets.forEach(sheet => {
        try {
            const rules = Array.from(sheet.cssRules || sheet.rules || []);
            rules.forEach(rule => {
                if (rule.selectorText && rule.style) {
                    // Check for overly broad selectors
                    const suspicious = rule.selectorText.includes('*') || 
                        rule.selectorText === 'input' ||
                        rule.selectorText === 'select' ||
                        rule.selectorText === 'label' ||
                        rule.selectorText.includes('form');
                    
                    if (suspicious) {
                        // Check for problematic properties
                        const hasProblematic = 
                            rule.style.pointerEvents === 'none' ||
                            rule.style.userSelect === 'none' ||
                            rule.style.zIndex ||
                            rule.style.position === 'absolute' ||
                            rule.style.position === 'fixed';
                            
                        if (hasProblematic) {
                            problematicRules.push({
                                selector: rule.selectorText,
                                styles: {
                                    pointerEvents: rule.style.pointerEvents,
                                    userSelect: rule.style.userSelect,
                                    zIndex: rule.style.zIndex,
                                    position: rule.style.position
                                }
                            });
                        }
                    }
                }
            });
        } catch (e) {
            console.log('Could not access stylesheet:', sheet.href || 'inline');
        }
    });
    
    if (problematicRules.length > 0) {
        console.warn('Potentially problematic global rules found:');
        problematicRules.forEach(rule => {
            console.warn(rule);
        });
    } else {
        console.log('✓ No problematic global rules found');
    }
}

// Validate form structure
function validateFormStructure() {
    console.log('\n=== Validating Form Structure ===');
    const issues = [];
    
    // Check labels
    document.querySelectorAll('.field-label').forEach(label => {
        const forAttr = label.getAttribute('for');
        if (!forAttr) {
            issues.push(`Label missing 'for' attribute: ${label.textContent}`);
        } else {
            const input = document.getElementById(forAttr);
            if (!input) {
                issues.push(`Label 'for' points to non-existent element: ${forAttr}`);
            } else {
                console.log(`✓ Label "${label.textContent}" correctly linked to #${forAttr}`);
            }
        }
    });
    
    // Check inputs/selects
    document.querySelectorAll('.field-input, .field-select').forEach(field => {
        if (!field.id) {
            issues.push(`Field missing 'id' attribute: ${field.name || 'unknown'}`);
        }
        if (!field.name) {
            issues.push(`Field missing 'name' attribute: ${field.id || 'unknown'}`);
        }
        if (field.id && field.name) {
            console.log(`✓ Field properly identified: #${field.id}`);
        }
    });
    
    // Check checkboxes
    document.querySelectorAll('.checkbox-label').forEach(label => {
        const checkbox = label.querySelector('input[type="checkbox"]');
        if (!checkbox) {
            issues.push('Checkbox label missing checkbox input');
        } else {
            console.log(`✓ Checkbox properly nested in label: #${checkbox.id || 'unnamed'}`);
        }
    });
    
    if (issues.length > 0) {
        console.warn('Form structure issues found:');
        issues.forEach(issue => console.warn('- ' + issue));
    } else {
        console.log('✓ Form structure is valid');
    }
}

// Initialize all debugging
function initFormDebugging() {
    console.clear();
    console.log('🔍 FORM DEBUGGING INITIALIZED');
    console.log('================================\n');
    
    // Add visual debugging
    document.body.classList.add('debug-forms');
    console.log('✓ Visual debugging enabled (red=wrapper, blue=input, green=label)\n');
    
    // Run all checks
    debugFormClicks();
    checkInheritedStyles();
    checkGlobalInterference();
    validateFormStructure();
    
    console.log('\n🎯 Click any form element to see detailed debug info');
    console.log('🔄 Run initFormDebugging() again to refresh checks');
    console.log('❌ Run document.body.classList.remove("debug-forms") to disable visual debugging');
}

// Export debugging functions
window.formDebug = {
    init: initFormDebugging,
    clicks: debugFormClicks,
    styles: checkInheritedStyles,
    global: checkGlobalInterference,
    structure: validateFormStructure
};