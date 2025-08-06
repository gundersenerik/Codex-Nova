/* ============================================================================
   PROMOCODE MODULE - CJC Namespace Version
   ============================================================================ */

CJC.defineModule('promocode', function() {
    'use strict';
    
    // Private state
    let currentBrandData = null;
    let currentProductData = null;
    let promocodePageInitialized = false;
    
    // Private helper functions
    function showPromocodeError(message) {
        if (window.showNotification) {
            window.showNotification(message, 'error');
        } else {
            alert('Error: ' + message);
        }
    }
    
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
    
    function hideLoading() {
        // Loading will be replaced by renderFormFields
    }
    
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
    
    function hideResult() {
        const resultContainer = document.getElementById('result-container');
        if (resultContainer) {
            resultContainer.style.display = 'none';
        }
    }
    
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
    
    // Unified promocode generation logic
    function generateUnifiedCode(brandCode, values) {
        try {
            // Validate inputs
            if (!brandCode || !values) {
                throw new Error('Missing brand code or values');
            }

            // Use product-specific shortcode if available (for Omni products)
            let shortcode = brandCode;
            if (currentProductData && currentProductData.shortcode) {
                shortcode = currentProductData.shortcode;
            }

            let codeParts = [shortcode];
            
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
                id: 'offerDuration',
                label: 'Initial Duration',
                type: 'number',
                placeholder: 'e.g., 3',
                min: 1,
                max: 24,
                required: false,
                size: 'small',
                row: 3
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
                label: 'Offer Price',
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
                label: 'Discount',
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
                label: 'Custom Offer Text',
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
                type: 'toggle',
                required: false,
                size: 'small',
                row: 4,
                showWhen: { type: 'brandCountry', value: 'NO' }
            }
        ];
    }
    
    function createSimpleFormField(field) {
        const group = document.createElement('div');
        group.className = 'form-group';
        
        // Handle conditional visibility
        if (field.showWhen) {
            group.dataset.showWhen = JSON.stringify(field.showWhen);
            
            // For row 3 discount fields, use visibility instead of display to maintain grid layout
            if (field.row === 3 && (field.id === 'offerPrice' || field.id === 'discountValue')) {
                group.style.visibility = 'hidden';
                group.style.opacity = '0';
                group.style.transform = 'scale(0.95)';
                group.style.transition = 'visibility 0.2s, opacity 0.2s, transform 0.2s';
            } else {
                group.style.display = 'none';
            }
        }
        
        // Special handling for checkbox
        if (field.type === 'checkbox') {
            group.className = 'checkbox-group';
            
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.id = field.id;
            checkbox.name = field.id;
            checkbox.className = 'form-checkbox';
            
            const label = document.createElement('label');
            label.setAttribute('for', field.id);
            label.className = 'form-label';
            label.textContent = field.label;
            
            group.appendChild(checkbox);
            group.appendChild(label);
            return group;
        }
        
        // Special handling for toggle switch
        if (field.type === 'toggle') {
            group.className = 'toggle-container';
            
            const toggleSwitch = document.createElement('label');
            toggleSwitch.className = 'toggle-switch';
            
            const input = document.createElement('input');
            input.type = 'checkbox';
            input.id = field.id;
            input.name = field.id;
            
            const slider = document.createElement('span');
            slider.className = 'toggle-slider';
            
            toggleSwitch.appendChild(input);
            toggleSwitch.appendChild(slider);
            
            const label = document.createElement('span');
            label.className = 'toggle-label';
            label.textContent = field.label;
            
            group.appendChild(toggleSwitch);
            group.appendChild(label);
            return group;
        }
        
        // Regular fields (select, number, text)
        const label = document.createElement('label');
        label.setAttribute('for', field.id);
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
    
    function renderFormFields(fields, containerSelector = '#dynamic-form-container') {
        try {
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
            
            // Row 1: Brand field (full width)
            const brandRow = document.createElement('div');
            brandRow.className = 'form-row';
            
            const brandGroup = document.createElement('div');
            brandGroup.className = 'form-group';
            
            const brandLabel = document.createElement('label');
            brandLabel.setAttribute('for', 'brand-display');
            brandLabel.className = 'form-label';
            brandLabel.innerHTML = 'Brand <span class="required">*</span>';
            
            const brandInput = document.createElement('input');
            brandInput.type = 'text';
            brandInput.id = 'brand-display';
            brandInput.className = 'form-control';
            
            // Verify brand data structure
            if (!currentBrandData || !currentBrandData.brand) {
                console.error('Invalid brand data:', currentBrandData);
                brandInput.value = 'Error: Invalid brand data';
            } else {
                brandInput.value = currentBrandData.brand.name;
            }
            
            brandInput.readOnly = true;
            brandInput.style.backgroundColor = '#f5f5f5';
        
        brandGroup.appendChild(brandLabel);
        brandGroup.appendChild(brandInput);
        brandRow.appendChild(brandGroup);
        form.appendChild(brandRow);
        
        // Group fields by row
        const fieldsByRow = {};
        fields.forEach(field => {
            const row = field.row || 1;
            if (!fieldsByRow[row]) fieldsByRow[row] = [];
            fieldsByRow[row].push(field);
        });
        
        // Create sections and rows
        Object.keys(fieldsByRow).sort().forEach(rowNum => {
            const rowDiv = document.createElement('div');
            const fieldsInRow = fieldsByRow[rowNum];
            
            // Use fixed column count for specific rows to handle conditional fields
            let columnCount;
            if (rowNum === '3') {
                // Row 3 always uses 4 columns to accommodate dynamic discount fields
                columnCount = 4;
            } else if (rowNum === '4') {
                // Row 4 always uses 3 columns
                columnCount = 3;
            } else {
                // Other rows calculate based on visible fields
                const visibleFields = fieldsInRow.filter(f => !f.showWhen || f.showWhen.type === 'brandCountry');
                columnCount = visibleFields.length;
            }
            
            rowDiv.className = `form-row form-row-${columnCount}`;
            
            // Special handling for row 3 to group conditional fields
            if (rowNum === '3') {
                let conditionalFieldsWrapper = null;
                
                fieldsInRow.forEach(field => {
                    // Check if this is one of the conditional price fields
                    if (field.id === 'offerPrice' || field.id === 'discountValue') {
                        // Create wrapper if it doesn't exist
                        if (!conditionalFieldsWrapper) {
                            conditionalFieldsWrapper = document.createElement('div');
                            conditionalFieldsWrapper.className = 'conditional-fields-wrapper';
                            conditionalFieldsWrapper.style.position = 'relative';
                            rowDiv.appendChild(conditionalFieldsWrapper);
                        }
                        // Add field to wrapper
                        const fieldElement = createSimpleFormField(field);
                        conditionalFieldsWrapper.appendChild(fieldElement);
                    } else {
                        // Regular field
                        const fieldElement = createSimpleFormField(field);
                        rowDiv.appendChild(fieldElement);
                    }
                });
            } else {
                // Normal row processing
                fieldsInRow.forEach(field => {
                    const fieldElement = createSimpleFormField(field);
                    rowDiv.appendChild(fieldElement);
                });
            }
            
            form.appendChild(rowDiv);
        });
        
        // Add generate button
        const buttonDiv = document.createElement('div');
        buttonDiv.innerHTML = `
            <button type="button" id="generate-promocode-btn" class="generate-btn">
                <span>🚀</span>
                <span>Generate Promocode</span>
            </button>
        `;
        
        form.appendChild(buttonDiv);
        container.appendChild(form);
        
        // Setup event listeners
        setupFormEventListeners();
        
        // Initialize conditional field visibility
        handleDiscountTypeChange();
        handleBrandCountryVisibility();
        
        } catch (error) {
            console.error('Error rendering form fields:', error);
            showPromocodeError('Failed to render form: ' + error.message);
        }
    }
    
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
            
            // Update brand display based on product selection
            const brandInput = document.getElementById('brand-display');
            if (brandInput && currentBrandData) {
                // For Omni brand with custom shortcode, show it in parentheses
                if (currentBrandData.brand.code === 'OM' && selectedProduct.shortcode) {
                    brandInput.value = `${currentBrandData.brand.name} (${selectedProduct.shortcode})`;
                } else {
                    // For other brands or products without custom shortcode, show just the brand name
                    brandInput.value = currentBrandData.brand.name;
                }
            }
            
            // Fetch rate plans for this product
            const { data: ratePlans, error } = await window.database.fetchRatePlansForProduct(selectedProduct.id);
            
            if (error) {
                throw new Error(error);
            }
            
            // Update rate plan select options
            const ratePlanOptions = window.database.transformRatePlansToOptions(ratePlans);
            
            ratePlanSelect.innerHTML = '';
            Object.entries(ratePlanOptions).forEach(([value, text]) => {
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
    
    function handleDiscountTypeChange() {
        const discountType = document.getElementById('discountType')?.value;
        
        // Handle conditional field visibility
        const allFields = document.querySelectorAll('[data-show-when]');
        allFields.forEach(field => {
            const showWhen = JSON.parse(field.dataset.showWhen);
            
            if (showWhen.field === 'discountType') {
                // Check if this field is in row 3 (discount-related fields)
                const isRow3Field = field.querySelector('#offerPrice') || field.querySelector('#discountValue');
                
                if (showWhen.value === discountType) {
                    if (isRow3Field) {
                        // For row 3 fields, use visibility to maintain grid layout
                        field.style.visibility = 'visible';
                        field.style.opacity = '1';
                        field.style.transform = 'scale(1)';
                    } else {
                        field.style.display = 'block';
                    }
                    field.classList.add('fade-in');
                    // Remove animation class after animation completes
                    setTimeout(() => field.classList.remove('fade-in'), 300);
                } else {
                    if (isRow3Field) {
                        // For row 3 fields, hide with visibility to maintain grid layout
                        field.style.visibility = 'hidden';
                        field.style.opacity = '0';
                        field.style.transform = 'scale(0.95)';
                    } else {
                        field.style.display = 'none';
                    }
                    // Clear hidden field values
                    const input = field.querySelector('input, select');
                    if (input) input.value = '';
                }
            }
        });
    }
    
    function handleBrandCountryVisibility() {
        const formContainer = document.querySelector('#dynamic-form-container');
        const brandCountry = formContainer?.dataset.brandCountry;
        
        // Handle conditional field visibility based on brand country
        const allFields = document.querySelectorAll('[data-show-when]');
        allFields.forEach(field => {
            const showWhen = JSON.parse(field.dataset.showWhen);
            
            if (showWhen.type === 'brandCountry') {
                if (showWhen.value === brandCountry) {
                    field.style.display = field.classList.contains('toggle-container') ? 'flex' : 'block';
                } else {
                    field.style.display = 'none';
                    // Clear hidden field values
                    const input = field.querySelector('input');
                    if (input && (input.type === 'checkbox' || field.classList.contains('toggle-container'))) {
                        input.checked = false;
                    }
                }
            }
        });
    }
    
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
            showPromocodeError(error.message);
        }
    }
    
    function collectFormValues() {
        const values = {};
        
        const fields = createNorwegianStyleFields();
        fields.forEach(field => {
            const element = document.getElementById(field.id);
            if (element) {
                if (field.type === 'checkbox' || field.type === 'toggle') {
                    values[field.id] = element.checked;
                } else {
                    values[field.id] = element.value;
                }
            }
        });
        
        return values;
    }
    
    function validateRequiredFields(values) {
        const fields = createNorwegianStyleFields();
        const requiredFields = fields.filter(f => f.required);
        
        for (const field of requiredFields) {
            if (!values[field.id] || values[field.id] === '') {
                throw new Error(`${field.label} is required`);
            }
        }
    }
    
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
            
            brandSelect.innerHTML = '<option value="">Select a brand</option>';
            
            // Add Norwegian brands
            if (brandGroups.norwegian && brandGroups.norwegian.length > 0) {
                const norwegianGroup = document.createElement('optgroup');
                norwegianGroup.label = 'Norway';
                brandGroups.norwegian.forEach(brand => {
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
            
            // Add Swedish brands
            if (brandGroups.swedish && brandGroups.swedish.length > 0) {
                const swedishGroup = document.createElement('optgroup');
                swedishGroup.label = 'Sweden';
                brandGroups.swedish.forEach(brand => {
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
            
            // Restore previous selection if it exists
            if (currentSelection) {
                brandSelect.value = currentSelection;
                console.log('Restored brand selection:', currentSelection);
            }
            
        } catch (error) {
            console.error('Error populating brand dropdown:', error);
            showPromocodeError('Failed to load brands: ' + error.message);
        }
    }
    
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
    
    // Module initialization
    function initialize() {
        console.log('✅ Promocode module loaded in CJC namespace');
    }
    
    // Initialize on load
    initialize();
    
    // Public API
    return {
        initialize: initializePromocodePage,
        generateUnifiedCode,
        reversePromocode,
        handlePromocodeBrandChange,
        collectFormValues
    };
});

// Compatibility layer - maintains existing global references
(function() {
    'use strict';
    
    // Wait for module to be available
    function setupCompatibility() {
        if (CJC && CJC.modules && CJC.modules.promocode) {
            // Create global reference
            window.promocode = CJC.modules.promocode;
            
            // Also expose commonly used functions globally for backward compatibility
            window.handlePromocodeBrandChange = CJC.modules.promocode.handlePromocodeBrandChange;
            
            console.log('✅ Promocode compatibility layer established');
        } else {
            // Retry in a moment
            setTimeout(setupCompatibility, 10);
        }
    }
    
    setupCompatibility();
})();