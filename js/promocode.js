/* ============================================================================
   PROMOCODE MODULE - Complete Implementation
   Version: 2.0
   Description: Generates complex promotional codes with Norwegian/Swedish logic
   
   FORMAT STRUCTURE:
   Brand-Product-InitialOffer-[DiscountAmount]-RenewalType-[Freetext]-[CodeType]-RenewalPlan
   
   SEGMENTS EXPLAINED:
   1. Brand: Brand code (e.g., "AP", "VG", "DN")
   2. Product: Product shortcode (e.g., "PLUS", "DIGI", "PREM")
   3. InitialOffer: Combined term+price+type (e.g., "3M199K" = 3 months 199kr, "6M99P" = 6 months 99% off)
   4. DiscountAmount: Optional percentage/amount if using discount (e.g., "50" for 50% off)
   5. RenewalType: "T" (Termed) or "E" (Evergreen)
   6. Freetext: Optional campaign text (e.g., "SUMMER", "XMAS")
   7. CodeType: Optional type (e.g., "WB", "HB", "CMP", "FREE", "EMP", "KS")
   8. RenewalPlan: Combined term+price (e.g., "M249" = Monthly 249kr, "Q399" = Quarterly 399kr)
   
   EXAMPLES:
   - AP-PLUS-3M199K-T-WB-M249 (3 months at 199kr, Termed, Winback, then Monthly 249kr)
   - VG-DIGI-6M99P-50-E-SUMMER-CMP-Q399 (6 months at 99kr with 50% off, Evergreen, Summer Campaign, Quarterly 399kr)
   - DN-SOLO-1M0K-T-FREE-M199 (1 month free, Termed, Free offer, then Monthly 199kr)
   ============================================================================ */

// ============================================================================
// MODULE STATE
// ============================================================================

let currentBrandData = null;
let currentProductData = null;

// ============================================================================
// INITIALIZATION
// ============================================================================

// Initialize promocode page
async function initializePromocodePage() {
    try {
        console.log('Initializing promocode page...');
        
        // Populate brand dropdown
        await populateBrandDropdown();
        
        // Setup brand change listener
        const brandSelect = document.getElementById('brand-select');
        if (brandSelect) {
            brandSelect.addEventListener('change', handlePromocodeBrandChange);
        }
        
        // Setup reverse functionality
        setupReversePromocode();
        
        // Initialize with empty state
        clearForm();
        
        console.log('Promocode page initialized successfully');
        
    } catch (error) {
        console.error('Error initializing promocode page:', error);
        showPromocodeError('Failed to initialize promocode page: ' + error.message);
    }
}

// ============================================================================
// BRAND MANAGEMENT
// ============================================================================

// Populate brand dropdown
async function populateBrandDropdown() {
    try {
        const brandSelect = document.getElementById('brand-select');
        if (!brandSelect) {
            console.error('Brand dropdown not found');
            return;
        }
        
        // Clear existing options
        brandSelect.innerHTML = '<option value="">Select a brand</option>';
        
        // Get brands from database using the correct function name
        const { data: brands, error } = await window.database.fetchAllBrands();
        
        if (error) {
            throw new Error(error);
        }
        
        if (!brands || brands.length === 0) {
            throw new Error('No brands found in database');
        }
        
        // Debug: Check structure of first brand
        console.log('Sample brand structure:', brands[0]);
        
        // Sort brands by name (with safety checks)
        brands.sort((a, b) => {
            const nameA = a.name || a.Name || a.brand_name || '';
            const nameB = b.name || b.Name || b.brand_name || '';
            return nameA.localeCompare(nameB);
        });
        
        // Add each brand as an option
        brands.forEach(brand => {
            const option = document.createElement('option');
            const brandCode = brand.code || brand.Code || brand.brand_code;
            const brandName = brand.name || brand.Name || brand.brand_name || 'Unknown';
            
            if (brandCode) {
                option.value = brandCode;
                option.textContent = `${brandName} (${brandCode})`;
                brandSelect.appendChild(option);
            }
        });
        
        console.log('Brand dropdown populated with', brands.length, 'brands');
        
    } catch (error) {
        console.error('Error populating brand dropdown:', error);
        showPromocodeError('Failed to load brands: ' + error.message);
    }
}

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
        
        // Generate and render form
        const fields = createNorwegianStyleFields();
        
        // Update product options
        const productField = fields.find(f => f.id === 'product');
        if (productField && brandData.products) {
            productField.options = window.database.transformProductsToOptions(brandData.products);
        }
        
        // Update rate plan options (initially empty, populated on product selection)
        const ratePlanField = fields.find(f => f.id === 'renewalRatePlan');
        if (ratePlanField) {
            ratePlanField.options = { '': 'Select a product first' };
        }
        
        // Render the form
        renderFormFields(fields);
        
        hideLoading();
        
    } catch (error) {
        console.error('Error handling brand change:', error);
        showPromocodeError('Failed to load brand data: ' + error.message);
        hideLoading();
    }
}

// ============================================================================
// PRODUCT MANAGEMENT
// ============================================================================

// Handle product selection change
async function handleProductChange() {
    console.log('=== handleProductChange called ===');
    const productSelect = document.getElementById('product');
    const ratePlanSelect = document.getElementById('renewalRatePlan');
    
    if (!productSelect || !ratePlanSelect) {
        console.error('Missing select elements:', { productSelect, ratePlanSelect });
        return;
    }
    
    const selectedProductId = productSelect.value;
    console.log('Selected product ID:', selectedProductId);
    
    // Clear rate plans
    ratePlanSelect.innerHTML = '<option value="">Select a rate plan</option>';
    
    if (!selectedProductId || !currentBrandData) {
        console.log('No product selected or no brand data');
        return;
    }
    
    // Find selected product - try multiple matching strategies
    currentProductData = currentBrandData.products.find(p => 
        p.id === selectedProductId || 
        p.product_id === selectedProductId ||
        p.shortcode === selectedProductId ||
        p.slug === selectedProductId ||
        (p.name && p.name.toLowerCase().replace(/[^a-z0-9]/g, '-') === selectedProductId)
    );
    
    console.log('Current product data:', currentProductData);
    console.log('Available products:', currentBrandData.products.map(p => ({
        id: p.id,
        name: p.name,
        shortcode: p.shortcode
    })));
    
    if (!currentProductData) {
        console.error('Product not found in brand data');
        console.error('Looking for:', selectedProductId);
        console.error('Available product IDs:', currentBrandData.products.map(p => p.id));
        return;
    }
    
    try {
        // Check if rate plans are already in the product data (from getFullBrandData)
        let ratePlans = currentProductData.rate_plans || 
                       currentProductData.ratePlans || 
                       currentProductData.RatePlans ||
                       currentProductData['Rate Plans'];
        
        console.log('Rate plans already in product?', ratePlans);
        
        if (!ratePlans || ratePlans.length === 0) {
            // Try fetching with the actual product ID from the data
            const productIdToFetch = currentProductData.id || currentProductData.product_id;
            console.log('No rate plans in product data, fetching with ID:', productIdToFetch);
            
            const result = await window.database.fetchRatePlansForProduct(productIdToFetch);
            console.log('fetchRatePlansForProduct result:', result);
            
            ratePlans = result?.data || [];
            
            if (result?.error) {
                console.error('Error fetching rate plans:', result.error);
            }
        }
        
        // Populate rate plans if we have any
        if (ratePlans && ratePlans.length > 0) {
            console.log(`Found ${ratePlans.length} rate plans:`, ratePlans);
            
            // Store rate plans for later use
            currentProductData.rate_plans = ratePlans;
            
            ratePlans.forEach((plan, index) => {
                const option = document.createElement('option');
                
                // Use the correct ID field based on your data structure
                const planId = plan.id || plan.plan_id || `plan_${index}`;
                option.value = planId;
                
                // Build a meaningful name from the available fields
                let planName = plan.plan_type_name || plan.plan_type_code || '';
                
                // Add category if it's not "standard"
                if (plan.category && plan.category !== 'standard') {
                    planName = `${planName} (${plan.category})`;
                }
                
                // If we still don't have a good name, use the plan_id
                if (!planName && plan.plan_id) {
                    planName = plan.plan_id;
                } else if (!planName) {
                    planName = 'Rate Plan';
                }
                
                // Get the price
                const price = plan.price || 0;
                const priceText = price !== null && price !== undefined ? `${price}kr` : 'N/A';
                
                // Display format: "Monthly - 299kr"
                option.textContent = `${planName} - ${priceText}`;
                
                ratePlanSelect.appendChild(option);
            });
            
            console.log('Rate plans populated. Select element now has', ratePlanSelect.options.length, 'options');
            
            // Add event listener to auto-set renewal term when rate plan is selected
            ratePlanSelect.addEventListener('change', function() {
                const selectedPlan = ratePlans.find(p => p.id === this.value);
                if (selectedPlan && selectedPlan.plan_type_code) {
                    const renewalTermSelect = document.getElementById('renewalTerm');
                    if (renewalTermSelect) {
                        renewalTermSelect.value = selectedPlan.plan_type_code;
                        console.log('Auto-set renewal term to:', selectedPlan.plan_type_code);
                    }
                }
            });
        } else {
            console.log('No rate plans found for product');
            
            // Check if there's a transformRatePlansToOptions function we can use
            if (window.database.transformRatePlansToOptions) {
                console.log('Trying transformRatePlansToOptions...');
                const options = window.database.transformRatePlansToOptions(ratePlans || []);
                console.log('Transformed options:', options);
                
                // If we got options, populate them
                if (options && typeof options === 'object') {
                    Object.entries(options).forEach(([value, text]) => {
                        if (value) { // Skip empty values
                            const option = document.createElement('option');
                            option.value = value;
                            option.textContent = text;
                            ratePlanSelect.appendChild(option);
                        }
                    });
                }
            }
        }
    } catch (error) {
        console.error('Error in handleProductChange:', error);
    }
    
    // Trigger validation
    validateForm();
}

// ============================================================================
// FORM FIELD DEFINITIONS
// ============================================================================

function createNorwegianStyleFields() {
    return [
        // ========== ROW 2: PRODUCT & RATE PLAN ==========
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
        
        // ========== ROW 3: INITIAL OFFER CONFIGURATION ==========
        {
            id: 'initialLength',
            label: 'Initial Length',
            type: 'number',
            placeholder: 'e.g., 3',
            min: 1,
            max: 24,
            required: true,
            size: 'small',
            row: 3
        },
        {
            id: 'initialPeriod',
            label: 'Initial Period',
            type: 'select',
            options: {
                '': 'Select period',
                'M': 'Måneder (Months)',
                'U': 'Uker (Weeks)',
                'Q': 'Kvartal (Quarter)',
                'Y': 'År (Year)'
            },
            required: true,
            size: 'medium',
            row: 3
        },
        {
            id: 'initialPrice',
            label: 'Initial Price',
            type: 'number',
            placeholder: 'e.g., 199',
            min: 0,
            max: 9999,
            required: true,
            size: 'small',
            row: 3
        },
        
        // ========== ROW 4: DISCOUNT CONFIGURATION ==========
        {
            id: 'discountType',
            label: 'Discount Type',
            type: 'select',
            options: {
                'K': 'Kroner (Fixed Amount)',
                'P': 'Percentage'
            },
            required: true,
            size: 'medium',
            row: 4
        },
        {
            id: 'discountAmount',
            label: 'Discount Amount',
            type: 'number',
            placeholder: 'Amount or percentage',
            min: 0,
            max: 9999,
            required: false,
            size: 'small',
            row: 4,
            helperText: 'Leave empty if initial price is the full discount'
        },
        
        // ========== ROW 5: RENEWAL CONFIGURATION ==========
        {
            id: 'renewalType',
            label: 'Renewal Type',
            type: 'select',
            options: {
                'T': 'Termed (Fixed period)',
                'E': 'Evergreen (Continuous)'
            },
            required: true,
            size: 'medium',
            row: 5
        },
        {
            id: 'renewalTerm',
            label: 'Renewal Term',
            type: 'select',
            options: {
                'M': 'Monthly',
                'Q': 'Quarterly',
                'Y': 'Yearly',
                'U': 'Weekly'
            },
            required: true,
            size: 'medium',
            row: 5
        },
        
        // ========== ROW 6: CODE TYPE & FREETEXT ==========
        {
            id: 'codeType',
            label: 'Code Type',
            type: 'select',
            options: {
                '': 'None',
                'WB': 'Winback',
                'HB': 'Holdback',
                'CMP': 'Campaign',
                'FREE': 'Free',
                'EMP': 'Employee',
                'KS': 'Customer Service'
            },
            required: false,
            size: 'medium',
            row: 6
        },
        {
            id: 'freetext',
            label: 'Freetext (Optional)',
            type: 'text',
            placeholder: 'e.g., SUMMER, BLACK, XMAS',
            maxLength: 15,
            required: false,
            size: 'medium',
            row: 6,
            helperText: 'Custom campaign identifier'
        },
        
        // ========== ROW 7: ADDITIONAL OPTIONS ==========
        {
            id: 'ratePlanPrice',
            label: 'Override Rate Plan Price',
            type: 'number',
            placeholder: 'Leave empty to use selected rate plan',
            min: 0,
            max: 9999,
            required: false,
            size: 'medium',
            row: 7,
            helperText: 'Only fill if different from selected rate plan'
        },
        {
            id: 'notes',
            label: 'Internal Notes',
            type: 'text',
            placeholder: 'Notes (not included in code)',
            required: false,
            size: 'medium',
            row: 7
        }
    ];
}

// ============================================================================
// FORM RENDERING
// ============================================================================

function renderFormFields(fields) {
    const container = document.getElementById('dynamic-form-container');
    if (!container) return;
    
    container.innerHTML = '';
    
    // Create form wrapper with sections
    const formWrapper = document.createElement('div');
    formWrapper.className = 'promocode-form-wrapper';
    
    // Add section headers and group fields
    const sections = {
        2: { title: '📦 Product Configuration', className: 'product-section' },
        3: { title: '🎯 Initial Offer', className: 'offer-section' },
        4: { title: '💰 Discount Details', className: 'discount-section' },
        5: { title: '🔄 Renewal Settings', className: 'renewal-section' },
        6: { title: '🏷️ Code Classification', className: 'classification-section' },
        7: { title: '📝 Additional Options', className: 'options-section' }
    };
    
    // Group fields by row
    const rowGroups = {};
    fields.forEach(field => {
        const row = field.row || 1;
        if (!rowGroups[row]) rowGroups[row] = [];
        rowGroups[row].push(field);
    });
    
    // Render each section
    Object.keys(rowGroups).sort().forEach(rowNum => {
        if (sections[rowNum]) {
            // Add section header
            const sectionHeader = document.createElement('div');
            sectionHeader.className = 'form-section-header';
            sectionHeader.innerHTML = `<h4>${sections[rowNum].title}</h4>`;
            formWrapper.appendChild(sectionHeader);
        }
        
        // Create row container
        const row = document.createElement('div');
        row.className = `form-row ${sections[rowNum]?.className || ''}`;
        
        // Add fields to row
        rowGroups[rowNum].forEach(field => {
            const fieldElement = createFormField(field);
            row.appendChild(fieldElement);
        });
        
        formWrapper.appendChild(row);
    });
    
    // Add Generate Button
    const buttonRow = document.createElement('div');
    buttonRow.className = 'form-row button-row';
    buttonRow.style.cssText = 'margin-top: var(--space-lg); display: flex; justify-content: center; border-top: 1px solid var(--gray-200); padding-top: var(--space-lg);';
    
    const generateBtn = document.createElement('button');
    generateBtn.type = 'button';
    generateBtn.id = 'generate-promocode-btn';
    generateBtn.className = 'auth-button primary generate-btn';
    generateBtn.style.cssText = 'padding: var(--space-md) var(--space-xl); font-size: 1rem; font-weight: 600; display: flex; align-items: center; gap: var(--space-sm);';
    generateBtn.innerHTML = '<span>🚀</span><span>Generate Promocode</span>';
    generateBtn.disabled = true;
    
    buttonRow.appendChild(generateBtn);
    formWrapper.appendChild(buttonRow);
    
    container.appendChild(formWrapper);
    
    // Setup event listeners
    setupFormEventListeners();
    validateForm();
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
    label.innerHTML = field.label + (field.required ? '<span class="required">*</span>' : '');
    
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
    
    // Add helper text if provided
    if (field.helperText) {
        const helper = document.createElement('small');
        helper.className = 'form-helper-text';
        helper.textContent = field.helperText;
        helper.style.cssText = 'display: block; margin-top: 4px; color: var(--gray-600); font-size: 0.75rem;';
        group.appendChild(helper);
    }
    
    return group;
}

// ============================================================================
// EVENT HANDLERS
// ============================================================================

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
    
    // Form validation on input
    const form = document.querySelector('#dynamic-form-container');
    if (form) {
        form.addEventListener('input', validateForm);
    }
}

// Handle generate button click
async function handleGenerateClick() {
    try {
        if (!currentBrandData) {
            throw new Error('Please select a brand first');
        }
        
        const values = collectFormValues();
        validateRequiredFields(values);
        
        // Generate the promocode
        const code = await generateUnifiedCode(values);
        
        // Display the result
        displayResult(code);
        
        // Save to history if available
        if (window.saveToHistory) {
            saveToHistory(code, values);
        }
        
    } catch (error) {
        console.error('Error generating promocode:', error);
        showPromocodeError(error.message);
    }
}

// ============================================================================
// PROMOCODE GENERATION
// ============================================================================

async function generateUnifiedCode(values) {
    try {
        if (!currentBrandData || !currentProductData) {
            throw new Error('Please select a brand and product first');
        }
        
        // Build promocode segments
        const segments = [];
        
        // SEGMENT 1: Brand Code
        segments.push(currentBrandData.brand.code);
        
        // SEGMENT 2: Product Code
        const productCode = currentProductData.shortcode || 
                          currentProductData.name.substring(0, 4).toUpperCase().replace(/[^A-Z0-9]/g, '');
        segments.push(productCode);
        
        // SEGMENT 3: Initial Offer (Combined: term + price + discount type)
        // Format: "3M199K" or "6M99P"
        const initialOffer = `${values.initialLength}${values.initialPeriod}${values.initialPrice}${values.discountType}`;
        segments.push(initialOffer);
        
        // SEGMENT 4: Discount Amount (optional, only if specified)
        if (values.discountAmount) {
            segments.push(values.discountAmount);
        }
        
        // SEGMENT 5: Renewal Type (T or E)
        segments.push(values.renewalType);
        
        // SEGMENT 6: Freetext (optional)
        if (values.freetext) {
            const cleanFreetext = values.freetext.toUpperCase().replace(/[^A-Z0-9]/g, '');
            if (cleanFreetext) {
                segments.push(cleanFreetext);
            }
        }
        
        // SEGMENT 7: Code Type (optional)
        if (values.codeType) {
            segments.push(values.codeType);
        }
        
        // SEGMENT 8: Renewal (Combined: term + price)
        // Format: "M249" or "Q399"
        let ratePlanPrice = values.ratePlanPrice;
        let renewalTermCode = values.renewalTerm;
        
        if (!ratePlanPrice && values.renewalRatePlan) {
            // Try to find the actual rate plan data
            const selectedRatePlan = currentProductData.rate_plans?.find(
                plan => plan.id === values.renewalRatePlan
            );
            if (selectedRatePlan) {
                // Use the actual price from the rate plan
                ratePlanPrice = selectedRatePlan.price;
                // If we have a plan_type_code, use it for the renewal term
                if (selectedRatePlan.plan_type_code) {
                    renewalTermCode = selectedRatePlan.plan_type_code;
                }
            }
        }
        
        // Combine renewal term with price (no hyphen between them)
        const renewalSegment = ratePlanPrice 
            ? `${renewalTermCode}${ratePlanPrice}`
            : renewalTermCode;
        segments.push(renewalSegment);
        
        // Join all segments with hyphen
        const promocode = segments.join('-').toUpperCase();
        
        // Log for debugging
        console.log('Generated promocode:', promocode);
        console.log('Segments:', segments);
        
        return promocode;
        
    } catch (error) {
        console.error('Error generating promocode:', error);
        throw error;
    }
}

// ============================================================================
// REVERSE ENGINEERING
// ============================================================================

function reversePromocode(code) {
    try {
        if (!code) {
            return { error: 'No code provided' };
        }
        
        const parts = code.toUpperCase().split('-');
        if (parts.length < 5) {
            return { error: 'Invalid code format - insufficient segments' };
        }
        
        const result = {};
        let index = 0;
        
        // Part 1: Brand
        result['Brand'] = parts[index++];
        
        // Part 2: Product
        result['Product'] = parts[index++];
        
        // Part 3: Initial Offer (e.g., "3M199K" or "6M99P")
        const initialOffer = parts[index++];
        const offerMatch = initialOffer.match(/^(\d+)([MUQY])(\d+)([KP])$/);
        if (offerMatch) {
            const periodMap = {
                'M': 'Months',
                'U': 'Weeks',
                'Q': 'Quarters',
                'Y': 'Years'
            };
            result['Initial Term'] = `${offerMatch[1]} ${periodMap[offerMatch[2]] || offerMatch[2]}`;
            result['Initial Price'] = `${offerMatch[3]} kr`;
            result['Discount Type'] = offerMatch[4] === 'K' ? 'Kroner' : 'Percentage';
        } else {
            result['Initial Offer'] = initialOffer;
        }
        
        // Check if next part is a number (discount amount)
        if (parts[index] && !isNaN(parts[index])) {
            result['Discount Amount'] = parts[index];
            index++;
        }
        
        // Renewal Type (T or E)
        if (parts[index] && (parts[index] === 'T' || parts[index] === 'E')) {
            result['Renewal Type'] = parts[index] === 'T' ? 'Termed' : 'Evergreen';
            index++;
        }
        
        // Check for freetext or code type
        const codeTypes = ['WB', 'HB', 'CMP', 'FREE', 'EMP', 'KS'];
        
        // Check if we have a freetext segment (not a code type and not the final renewal segment)
        if (parts[index] && !codeTypes.includes(parts[index]) && index < parts.length - 1) {
            // Check if this is NOT the renewal segment (which starts with M, Q, Y, or U)
            if (!parts[index].match(/^[MQYU]\d+$/)) {
                result['Campaign'] = parts[index];
                index++;
            }
        }
        
        // Code Type
        if (parts[index] && codeTypes.includes(parts[index])) {
            const codeTypeMap = {
                'WB': 'Winback',
                'HB': 'Holdback',
                'CMP': 'Campaign',
                'FREE': 'Free',
                'EMP': 'Employee',
                'KS': 'Customer Service'
            };
            result['Code Type'] = codeTypeMap[parts[index]] || parts[index];
            index++;
        }
        
        // Renewal segment (e.g., "M249" or "Q399")
        if (parts[index]) {
            const renewalMatch = parts[index].match(/^([MQYU])(\d+)$/);
            if (renewalMatch) {
                const termMap = {
                    'M': 'Monthly',
                    'Q': 'Quarterly',
                    'Y': 'Yearly',
                    'U': 'Weekly'
                };
                result['Renewal Term'] = termMap[renewalMatch[1]] || renewalMatch[1];
                result['Renewal Price'] = `${renewalMatch[2]} kr`;
            } else {
                result['Renewal'] = parts[index];
            }
        }
        
        return result;
        
    } catch (error) {
        console.error('Error reversing promocode:', error);
        return { error: 'Failed to reverse engineer code: ' + error.message };
    }
}

// Setup reverse promocode functionality
function setupReversePromocode() {
    const reverseBtn = document.getElementById('reverse-btn');
    const reverseInput = document.getElementById('reverse-code-input');
    
    if (reverseBtn && reverseInput) {
        reverseBtn.addEventListener('click', handleReverseClick);
        reverseInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') handleReverseClick();
        });
    }
}

// Handle reverse button click
function handleReverseClick() {
    const reverseInput = document.getElementById('reverse-code-input');
    const code = reverseInput?.value.trim();
    
    if (!code) return;
    
    const result = reversePromocode(code);
    const reverseResultDiv = document.getElementById('reverse-result');
    const reverseOutput = document.getElementById('reverse-output');
    
    if (result.error) {
        reverseResultDiv.style.display = 'none';
        showPromocodeError(result.error);
    } else {
        let outputHtml = '';
        Object.entries(result).forEach(([key, value]) => {
            outputHtml += `<div style="margin-bottom: 4px;"><strong>${key}:</strong> ${value}</div>`;
        });
        reverseOutput.innerHTML = outputHtml;
        reverseResultDiv.style.display = 'block';
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
    const fields = createNorwegianStyleFields();
    const requiredFields = fields.filter(f => f.required);
    
    for (const field of requiredFields) {
        if (!values[field.id] || values[field.id] === '') {
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
        const fields = createNorwegianStyleFields();
        const requiredFields = fields.filter(f => f.required);
        
        // Check all required fields
        for (const field of requiredFields) {
            if (!values[field.id] || values[field.id] === '') {
                throw new Error(`${field.label} is required`);
            }
        }
        
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
        container.innerHTML = `
            <div class="placeholder">
                <div class="placeholder-icon">🎟️</div>
                <h3>Ready to Generate</h3>
                <p>Select a brand above to start configuring your promocode</p>
            </div>
        `;
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
    if (window.showNotification) {
        window.showNotification(message, 'error');
    } else {
        const alertContainer = document.getElementById('promocode-alerts');
        if (alertContainer) {
            alertContainer.innerHTML = `
                <div class="alert alert-danger alert-dismissible fade show" role="alert">
                    <strong>Error:</strong> ${message}
                    <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                </div>
            `;
        } else {
            console.error('Promocode error:', message);
        }
    }
}

// Display generated promocode result
function displayResult(code) {
    // Using the existing result container from HTML
    const resultContainer = document.getElementById('result-container');
    const generatedCodeElement = document.getElementById('generated-code');
    const copyBtn = document.getElementById('copy-promocode-btn');
    
    if (resultContainer && generatedCodeElement) {
        // Set the generated code
        generatedCodeElement.textContent = code;
        
        // Show the result container
        resultContainer.style.display = 'block';
        
        // Scroll to result smoothly
        resultContainer.scrollIntoView({ behavior: 'smooth', block: 'center' });
        
        // Setup copy button if it exists
        if (copyBtn) {
            copyBtn.onclick = function() {
                // Copy to clipboard
                navigator.clipboard.writeText(code).then(() => {
                    // Show success feedback
                    const originalText = copyBtn.textContent;
                    copyBtn.textContent = 'Copied!';
                    copyBtn.classList.add('success');
                    
                    setTimeout(() => {
                        copyBtn.textContent = originalText;
                        copyBtn.classList.remove('success');
                    }, 2000);
                }).catch(err => {
                    console.error('Failed to copy:', err);
                    showPromocodeError('Failed to copy to clipboard');
                });
            };
        }
    }
}

// Hide result
function hideResult() {
    const resultContainer = document.getElementById('result-container');
    if (resultContainer) {
        resultContainer.style.display = 'none';
    }
}

// Save to history (if available)
function saveToHistory(promocode, values) {
    if (!currentBrandData) return;
    
    try {
        const parameters = {
            brand: currentBrandData.brand.code,
            brand_name: currentBrandData.brand.name,
            ...values
        };
        
        if (window.database && window.database.saveGeneration) {
            window.database.saveGeneration('promocodes', promocode, parameters);
        }
        
    } catch (error) {
        console.log('Failed to save to history:', error.message);
        // Don't show error to user for history saving failures
    }
}

// ============================================================================
// EXPORT MODULE
// ============================================================================

// Export functions to global scope
window.promocode = {
    initialize: initializePromocodePage,
    generateUnifiedCode,
    reversePromocode,
    handlePromocodeBrandChange,
    collectFormValues
};

console.log('Promocode module loaded (v2.0)');