/* ============================================================================
   PROMOCODE MODULE - Unified promocode generation system
   ============================================================================ */

// Module state
let promocodePageInitialized = false;
let currentBrandData = null;
let currentProductData = null;

// ============================================================================
// INITIALIZATION
// ============================================================================

// Initialize promocode page
async function initializePromocodePage() {
    try {
        // Prevent re-initialization
        if (promocodePageInitialized) {
            console.log('Promocode page already initialized, skipping...');
            return;
        }
        
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
            brandSelect.addEventListener('change', handlePromocodeBrandChange);
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
        
        // Mark as initialized
        promocodePageInitialized = true;
        console.log('Promocode page initialized successfully');
        
    } catch (error) {
        console.error('Error initializing promocode page:', error);
        showPromocodeError('Failed to initialize promocode page: ' + error.message);
    }
}

// Populate brand dropdown from database
async function populateBrandDropdown() {
    const brandSelect = document.getElementById('brand-select');
    if (!brandSelect) return;
    
    try {
        // Store current selection before clearing
        const currentSelection = brandSelect.value;
        
        const { data: brandGroups, error } = await window.database.getBrandsGrouped();
        
        if (error) {
            throw new Error(error);
        }
        
        console.log('Brand groups received:', brandGroups); // Debug log
        
        brandSelect.innerHTML = '<option value="">Select a brand</option>';
        
        // Add Norwegian brands (country code is "NO")
        if (brandGroups.NO && brandGroups.NO.length > 0) {
            const norwegianGroup = document.createElement('optgroup');
            norwegianGroup.label = 'Norway';
            brandGroups.NO.forEach(brand => {
                // Skip empty or invalid brands
                if (!brand || !brand.code || !brand.name || brand.name.trim() === '') {
                    console.warn('Skipping invalid Norwegian brand:', brand);
                    return;
                }
                const option = document.createElement('option');
                option.value = brand.code;
                option.textContent = brand.name;
                norwegianGroup.appendChild(option);
            });
            brandSelect.appendChild(norwegianGroup);
        }
        
        // Add Swedish brands (country code is "SE")
        if (brandGroups.SE && brandGroups.SE.length > 0) {
            const swedishGroup = document.createElement('optgroup');
            swedishGroup.label = 'Sweden';
            brandGroups.SE.forEach(brand => {
                // Skip empty or invalid brands
                if (!brand || !brand.code || !brand.name || brand.name.trim() === '') {
                    console.warn('Skipping invalid Swedish brand:', brand);
                    return;
                }
                const option = document.createElement('option');
                option.value = brand.code;
                option.textContent = brand.name;
                swedishGroup.appendChild(option);
            });
            brandSelect.appendChild(swedishGroup);
        }
        
        // Add any brands with other country codes
        Object.keys(brandGroups).forEach(country => {
            if (country !== 'NO' && country !== 'SE' && brandGroups[country] && brandGroups[country].length > 0) {
                const countryGroup = document.createElement('optgroup');
                countryGroup.label = country;
                brandGroups[country].forEach(brand => {
                    if (!brand || !brand.code || !brand.name || brand.name.trim() === '') {
                        console.warn(`Skipping invalid ${country} brand:`, brand);
                        return;
                    }
                    const option = document.createElement('option');
                    option.value = brand.code;
                    option.textContent = brand.name;
                    countryGroup.appendChild(option);
                });
                brandSelect.appendChild(countryGroup);
            }
        });
        
        // Restore previous selection if it exists
        if (currentSelection) {
            brandSelect.value = currentSelection;
            console.log('Restored brand selection:', currentSelection);
        }
        
        console.log('Brand dropdown populated with', brandSelect.options.length - 1, 'brands'); // -1 for the placeholder option
        
    } catch (error) {
        console.error('Error populating brand dropdown:', error);
        showPromocodeError('Failed to load brands: ' + error.message);
    }
}

// ============================================================================
// EVENT HANDLERS
// ============================================================================

// Handle brand selection change
async function handlePromocodeBrandChange() {
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
        showPromocodeError('Failed to load brand data: ' + error.message);
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
            console.warn('Selected product not found:', selectedProductKey);
            return;
        }
        
        currentProductData = selectedProduct;
        
        // Validate that product has a shortcode
        if (!selectedProduct.shortcode) {
            console.warn(`Product "${selectedProduct.name}" is missing a shortcode`);
            showPromocodeError(`Warning: Product "${selectedProduct.name}" is missing a shortcode. Please update the product configuration.`);
        }
        
        // Fetch rate plans for the selected product
        const { data: ratePlans, error } = await window.database.fetchRatePlansForProduct(selectedProduct.id);
        
        if (error) {
            console.error('Error fetching rate plans:', error);
            ratePlanSelect.innerHTML = '<option value="">No rate plans available</option>';
            return;
        }
        
        // Update rate plan options
        const options = window.database.transformRatePlansToOptions(ratePlans);
        ratePlanSelect.innerHTML = '';
        Object.entries(options).forEach(([value, text]) => {
            const option = document.createElement('option');
            option.value = value;
            option.textContent = text;
            ratePlanSelect.appendChild(option);
        });
        
    } catch (error) {
        console.error('Error handling product change:', error);
        showPromocodeError('Failed to load rate plans: ' + error.message);
    }
}

// Handle discount type change (for conditional fields)
function handleDiscountTypeChange() {
    const discountType = document.getElementById('discountType');
    const amountGroup = document.querySelector('.discount-amount-group');
    const percentGroup = document.querySelector('.discount-percent-group');
    
    if (!discountType) return;
    
    // Show/hide conditional fields based on discount type
    if (amountGroup) {
        amountGroup.style.display = (discountType.value === 'amount') ? 'block' : 'none';
    }
    if (percentGroup) {
        percentGroup.style.display = (discountType.value === 'percent') ? 'block' : 'none';
    }
}

// Handle generate button click
async function handleGenerateClick() {
    try {
        const values = collectFormValues();
        validateRequiredFields(values);
        const code = await generateUnifiedCode(values);
        displayResult(code);
    } catch (error) {
        console.error('Error generating promocode:', error);
        showPromocodeError(error.message);
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
            row: 2
        },
        {
            id: 'renewalRatePlan',
            label: 'Renewal Rate Plan', 
            type: 'select',
            options: { '': 'Select a rate plan' },
            required: true,
            size: 'medium',
            row: 2
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
            row: 4
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
            row: 3
        },
        {
            id: 'offerLength',
            label: 'Length',
            type: 'number',
            placeholder: '1-99',
            min: 1,
            max: 99,
            required: false,
            size: 'small',
            row: 3
        },
        {
            id: 'discountType',
            label: 'Discount Type',
            type: 'select',
            options: { 
                '': 'No discount',
                'percent': 'Percentage', 
                'amount': 'Fixed Amount' 
            },
            required: false,
            size: 'small',
            row: 3
        },
        {
            id: 'discountAmount',
            label: 'Amount (kr)',
            type: 'number',
            placeholder: 'e.g., 50',
            min: 0,
            max: 9999,
            required: false,
            size: 'small',
            row: 3,
            conditional: 'discountType:amount',
            className: 'discount-amount-group'
        },
        {
            id: 'discountPercent',
            label: 'Percent (%)',
            type: 'number',
            placeholder: 'e.g., 25',
            min: 0,
            max: 100,
            required: false,
            size: 'small',
            row: 3,
            conditional: 'discountType:percent',
            className: 'discount-percent-group'
        }
    ];
}

// Render form fields in the container
function renderFormFields(fields) {
    const container = document.getElementById('dynamic-form-container');
    if (!container) return;
    
    container.innerHTML = '';
    
    // Group fields by row
    const rowGroups = {};
    fields.forEach(field => {
        const row = field.row || 1;
        if (!rowGroups[row]) rowGroups[row] = [];
        rowGroups[row].push(field);
    });
    
    // Render each row
    Object.keys(rowGroups).sort().forEach(rowNum => {
        const row = document.createElement('div');
        row.className = 'form-row';
        
        rowGroups[rowNum].forEach(field => {
            const fieldElement = createFormField(field);
            row.appendChild(fieldElement);
        });
        
        container.appendChild(row);
    });
    
    setupFormEventListeners();
    
    // Initially hide conditional fields
    handleDiscountTypeChange();
}

// Create individual form field
function createFormField(field) {
    const group = document.createElement('div');
    group.className = `form-group ${field.className || ''} size-${field.size || 'medium'}`;
    if (field.conditional) {
        group.dataset.conditional = field.conditional;
    }
    
    const label = document.createElement('label');
    label.htmlFor = field.id;
    label.className = 'form-label';
    label.innerHTML = field.label + (field.required ? ' <span class="required">*</span>' : '');
    
    let input;
    if (field.type === 'select') {
        input = document.createElement('select');
        input.className = 'form-control form-select';
        
        Object.entries(field.options).forEach(([value, text]) => {
            const option = document.createElement('option');
            option.value = value;
            option.textContent = text;
            input.appendChild(option);
        });
    } else {
        input = document.createElement('input');
        input.type = field.type;
        input.className = 'form-control';
        
        if (field.placeholder) input.placeholder = field.placeholder;
        if (field.min !== undefined) input.min = field.min;
        if (field.max !== undefined) input.max = field.max;
        if (field.maxLength) input.maxLength = field.maxLength;
    }
    
    input.id = field.id;
    input.name = field.id;
    if (field.required) input.required = true;
    
    group.appendChild(label);
    group.appendChild(input);
    
    return group;
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
// PROMOCODE GENERATION
// ============================================================================

// Generate unified promocode
async function generateUnifiedCode(values) {
    try {
        if (!currentBrandData || !currentProductData) {
            throw new Error('Please select a brand and product first');
        }
        
        // Start with brand code
        let code = currentBrandData.brand.code;
        
        // Add product shortcode
        if (currentProductData.shortcode) {
            code += `-${currentProductData.shortcode}`;
        } else {
            console.warn('Product missing shortcode, using first 3 letters of name');
            const fallback = currentProductData.name.substring(0, 3).toUpperCase();
            code += `-${fallback}`;
        }
        
        // Add offer details if present
        if (values.offerPeriod && values.offerLength) {
            code += `-${values.offerLength}${values.offerPeriod}`;
            
            // Add discount if present
            if (values.discountType === 'percent' && values.discountPercent) {
                code += `${values.discountPercent}p`;
            } else if (values.discountType === 'amount' && values.discountAmount) {
                code += `${values.discountAmount}kr`;
            }
        }
        
        // Add lifecycle if present
        if (values.lifecycle) {
            code += `-${values.lifecycle}`;
        }
        
        // Add renewal rate plan
        if (values.renewalRatePlan) {
            code += `-${values.renewalRatePlan}`;
        }
        
        return code.toUpperCase();
        
    } catch (error) {
        console.error('Error generating promocode:', error);
        throw error;
    }
}

// Reverse engineer a promocode
function reversePromocode(code) {
    try {
        if (!code) {
            return { error: 'No code provided' };
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
// UTILITY FUNCTIONS
// ============================================================================

// Collect form values
function collectFormValues() {
    const values = {};
    const inputs = document.querySelectorAll('#dynamic-form-container input, #dynamic-form-container select');
    
    inputs.forEach(input => {
        if (input.value) {
            values[input.id] = input.value;
        }
    });
    
    return values;
}

// Validate required fields
function validateRequiredFields(values) {
    const requiredFields = [
        { id: 'product', label: 'Product' },
        { id: 'renewalRatePlan', label: 'Renewal Rate Plan' }
    ];
    
    for (const field of requiredFields) {
        if (!values[field.id]) {
            throw new Error(`${field.label} is required`);
        }
    }
}

// Validate form (for enabling/disabling generate button)
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
    const container = document.getElementById('dynamic-form-container');
    if (container) {
        container.innerHTML = '';
    }
    currentBrandData = null;
    currentProductData = null;
}

// ============================================================================
// UI FEEDBACK FUNCTIONS
// ============================================================================

// Show loading state
function showLoading(message = 'Loading...') {
    const container = document.getElementById('dynamic-form-container');
    if (container) {
        container.innerHTML = `
            <div class="loading-container">
                <div class="loading-spinner"></div>
                <p>${message}</p>
            </div>
        `;
    }
}

// Hide loading state
function hideLoading() {
    // Loading state will be replaced by form fields
}

// Show error message
function showPromocodeError(message) {
    const alertContainer = document.getElementById('promocode-alerts');
    if (!alertContainer) {
        console.error('Promocode error:', message);
        return;
    }
    
    alertContainer.innerHTML = `
        <div class="alert alert-danger alert-dismissible fade show" role="alert">
            <strong>Error:</strong> ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        </div>
    `;
}

// Display generated promocode result
function displayResult(code) {
    const resultContainer = document.getElementById('promocode-result');
    if (!resultContainer) return;
    
    resultContainer.innerHTML = `
        <div class="result-card">
            <h3>Generated Promocode</h3>
            <div class="code-display">
                <code id="generated-code">${code}</code>
                <button class="btn btn-secondary" id="copy-promocode-btn">
                    <i class="fas fa-copy"></i> Copy
                </button>
            </div>
        </div>
    `;
    
    resultContainer.style.display = 'block';
    
    // Re-attach copy handler
    const copyBtn = document.getElementById('copy-promocode-btn');
    if (copyBtn) {
        copyBtn.addEventListener('click', () => {
            const codeElement = document.getElementById('generated-code');
            if (codeElement && window.copyToClipboard) {
                window.copyToClipboard(codeElement.textContent);
            }
        });
    }
}

// Hide result
function hideResult() {
    const resultContainer = document.getElementById('promocode-result');
    if (resultContainer) {
        resultContainer.style.display = 'none';
        resultContainer.innerHTML = '';
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
    handlePromocodeBrandChange,
    collectFormValues
};

console.log('Promocode module loaded');