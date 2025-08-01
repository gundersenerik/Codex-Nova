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

// Create the unified Norwegian-style form fields
function createNorwegianStyleFields() {
    return [
        {
            id: 'product',
            label: 'Product',
            type: 'select',
            options: { '': 'Select a product' },
            required: true
        },
        {
            id: 'renewalRatePlan',
            label: 'Renewal Rate Plan', 
            type: 'select',
            options: { '': 'Select a rate plan' },
            required: true
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
            required: false
        },
        {
            id: 'offerDuration',
            label: 'Initial Duration',
            type: 'number',
            placeholder: 'e.g., 3',
            min: 1,
            max: 24,
            required: false
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
            required: false
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
            required: false
        },
        {
            id: 'offerPrice',
            label: 'Offer Price (kr)',
            type: 'number',
            placeholder: 'e.g., 199',
            min: 1,
            max: 9999,
            required: false,
            showWhen: { field: 'discountType', value: 'kr' }
        },
        {
            id: 'discountValue',
            label: 'Discount Value (%)',
            type: 'number',
            placeholder: 'e.g., 50',
            min: 1,
            max: 100,
            required: false,
            showWhen: { field: 'discountType', value: 'pros' }
        },
        {
            id: 'customOfferText',
            label: 'Custom Offer Text (Optional)',
            type: 'text',
            placeholder: 'e.g., 3FOR1, SUMMER24',
            maxLength: 8,
            required: false
        },
        {
            id: 'isUnder30',
            label: 'Under 30',
            type: 'checkbox',
            required: false
        }
    ];
}

// Render form fields dynamically
function renderFormFields(fields, containerSelector = '#dynamic-form-container') {
    const container = document.querySelector(containerSelector);
    if (!container) {
        console.error('Form container not found:', containerSelector);
        return;
    }
    
    container.innerHTML = '';
    
    // Create form grid container
    const formGrid = document.createElement('div');
    formGrid.className = 'form-grid';
    
    // Group fields for better layout
    const mainFields = [];
    const priceFields = [];
    const conditionalFields = [];
    const checkboxFields = [];
    
    fields.forEach(field => {
        if (field.type === 'checkbox') {
            checkboxFields.push(field);
        } else if (field.showWhen) {
            conditionalFields.push(field);
        } else if (['discountType', 'offerPrice', 'discountValue'].includes(field.id)) {
            priceFields.push(field);
        } else {
            mainFields.push(field);
        }
    });
    
    // Add main fields to grid (2 columns)
    mainFields.forEach(field => {
        const fieldElement = createFormField(field);
        formGrid.appendChild(fieldElement);
    });
    
    container.appendChild(formGrid);
    
    // Add price fields in a 3-column grid
    if (priceFields.length > 0) {
        const priceGrid = document.createElement('div');
        priceGrid.className = 'form-grid-3';
        priceGrid.style.marginBottom = 'var(--space-xl)';
        
        priceFields.forEach(field => {
            const fieldElement = createFormField(field);
            priceGrid.appendChild(fieldElement);
        });
        
        // Add conditional fields to the same grid
        conditionalFields.forEach(field => {
            const fieldElement = createFormField(field);
            priceGrid.appendChild(fieldElement);
        });
        
        container.appendChild(priceGrid);
    }
    
    // Add checkbox fields in a separate row
    if (checkboxFields.length > 0) {
        const checkboxContainer = document.createElement('div');
        checkboxContainer.style.display = 'flex';
        checkboxContainer.style.gap = 'var(--space-xl)';
        checkboxContainer.style.marginBottom = 'var(--space-lg)';
        
        checkboxFields.forEach(field => {
            const fieldElement = createFormField(field);
            fieldElement.style.marginBottom = '0';
            checkboxContainer.appendChild(fieldElement);
        });
        
        container.appendChild(checkboxContainer);
    }
    
    // Add generate button
    const generateSection = document.createElement('div');
    generateSection.style.marginTop = 'var(--space-xl)';
    generateSection.style.paddingTop = 'var(--space-lg)';
    generateSection.style.borderTop = '1px solid var(--gray-200)';
    generateSection.innerHTML = `
        <button id="generate-promocode-btn" class="auth-button" style="width: 100%; justify-content: center; font-size: 1rem; padding: var(--space-md) var(--space-xl); font-weight: 600;">
            <span style="margin-right: var(--space-sm);">🚀</span>
            Generate Promocode
        </button>
    `;
    
    container.appendChild(generateSection);
    
    // Add event listeners
    setupFormEventListeners();
    
    // Ensure all selects have proper styling
    ensureSelectStyling();
}

// Ensure all select elements have proper form-select class
function ensureSelectStyling() {
    // Find all select elements with form-input class
    const selects = document.querySelectorAll('select.form-input');
    selects.forEach(select => {
        if (!select.classList.contains('form-select')) {
            select.classList.add('form-select');
        }
    });
}

// Create individual form field element
function createFormField(field) {
    const fieldDiv = document.createElement('div');
    fieldDiv.className = 'form-group';
    fieldDiv.id = `${field.id}-container`;
    fieldDiv.style.marginBottom = '0'; // Remove margin since grid handles spacing
    
    // Handle conditional visibility
    if (field.showWhen) {
        fieldDiv.style.display = 'none';
        fieldDiv.dataset.showWhen = JSON.stringify(field.showWhen);
    }
    
    let inputHtml = '';
    
    if (field.type === 'select') {
        inputHtml = `<select id="${field.id}" name="${field.id}" class="form-input form-select" ${field.required ? 'required' : ''}>`;
        
        Object.entries(field.options).forEach(([value, text]) => {
            inputHtml += `<option value="${value}">${text}</option>`;
        });
        
        inputHtml += '</select>';
        
    } else if (field.type === 'checkbox') {
        inputHtml = `
            <div style="display: flex; align-items: center; gap: var(--space-sm);">
                <input type="checkbox" id="${field.id}" name="${field.id}" style="width: 16px; height: 16px; accent-color: var(--primary); border-radius: 4px;">
                <label for="${field.id}" class="form-label" style="margin: 0;">${field.label}</label>
            </div>
        `;
        
    } else {
        const attributes = [];
        if (field.placeholder) attributes.push(`placeholder="${field.placeholder}"`);
        if (field.min !== undefined) attributes.push(`min="${field.min}"`);
        if (field.max !== undefined) attributes.push(`max="${field.max}"`);
        if (field.maxLength) attributes.push(`maxlength="${field.maxLength}"`);
        if (field.required) attributes.push('required');
        
        inputHtml = `<input type="${field.type}" id="${field.id}" name="${field.id}" class="form-input" ${attributes.join(' ')}>`;
    }
    
    if (field.type !== 'checkbox') {
        fieldDiv.innerHTML = `
            <label for="${field.id}" class="form-label">
                ${field.label} ${field.required ? '<span style="color: var(--danger);">*</span>' : ''}
            </label>
            ${inputHtml}
        `;
    } else {
        fieldDiv.innerHTML = inputHtml;
    }
    
    return fieldDiv;
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
        
        // Ensure all selects have proper styling after form render
        setTimeout(() => ensureSelectStyling(), 100);
        
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
        // Ensure the select maintains proper styling
        if (!ratePlanSelect.classList.contains('form-select')) {
            ratePlanSelect.classList.add('form-select');
        }
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
        
        // Ensure the select maintains proper styling after dynamic update
        if (!ratePlanSelect.classList.contains('form-select')) {
            ratePlanSelect.classList.add('form-select');
        }
        
        console.log('Rate plan select updated, HTML:', ratePlanSelect.innerHTML);
        
        // Ensure all selects maintain proper styling
        ensureSelectStyling();
        
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

// Ensure selects are properly styled on page load and after dynamic updates
document.addEventListener('DOMContentLoaded', () => {
    // Add a slight delay to ensure all elements are rendered
    setTimeout(() => ensureSelectStyling(), 500);
});

// Also ensure styling after any dynamic content changes
const observer = new MutationObserver(() => {
    ensureSelectStyling();
});

// Observe changes to the form container
document.addEventListener('DOMContentLoaded', () => {
    const formContainer = document.querySelector('#dynamic-form-container');
    if (formContainer) {
        observer.observe(formContainer, { childList: true, subtree: true });
    }
});