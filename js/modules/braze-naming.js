/* ============================================================================
   BRAZE NAMING MODULE - CJC Namespace Version
   ============================================================================ */

CJC.defineModule('brazeNaming', function() {
    'use strict';
    
    // Private state
    const brazeState = {
        campaign: {
            selectedPurposeCode: null,
            selectedBrand: null,
            selectedPackage: null,
            selectedMainCommType: null,
            selectedSpecificCommType: null,
            description: '',
            flags: []
        },
        canvas: {
            selectedPurposeCode: null,
            selectedBrand: null,
            selectedPackage: null,
            selectedMainCommType: null,
            selectedSpecificCommType: null,
            description: '',
            flags: []
        },
        segment: {
            selectedPurposeCode: null,
            selectedBrand: null,
            selectedPackage: null,
            selectedMainCommType: null,
            selectedSpecificCommType: null,
            customSuffix: '',
            description: '',
            flags: []
        }
    };
    
    // Track initialization state
    let brazeInitialized = false;
    
    // Private helper functions
    function capitalizeFirst(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }
    
    // Convert string to kebab-case
    function toKebabCase(str) {
        if (!str) return '';
        return str
            .trim()
            .replace(/([a-z])([A-Z])/g, '$1-$2')  // camelCase to kebab-case
            .replace(/[\s_]+/g, '-')              // spaces and underscores to hyphens
            .replace(/[^a-zA-Z0-9-]/g, '')        // remove non-alphanumeric except hyphens
            .replace(/-+/g, '-')                   // multiple hyphens to single
            .replace(/^-|-$/g, '')                 // remove leading/trailing hyphens
            .toLowerCase();
    }
    
    function populateBrazeDropdown(selectElement, items, valueField, textField, isPackageDropdown = false) {
        if (!selectElement) return;
        
        // Clear existing options
        if (isPackageDropdown) {
            selectElement.innerHTML = '<option value="">-- No Package --</option>';
        } else {
            const placeholder = selectElement.options[0]?.text || '-- Select --';
            selectElement.innerHTML = `<option value="">${placeholder}</option>`;
        }
        
        // Add new options
        if (items && items.length > 0) {
            items.forEach(item => {
                const option = document.createElement('option');
                option.value = item[valueField];
                option.textContent = item[textField];
                selectElement.appendChild(option);
            });
        }
    }
    
    function resetBrazeDropdown(selectElement, placeholder, isPackageDropdown = false) {
        if (!selectElement) return;
        
        if (isPackageDropdown) {
            selectElement.innerHTML = '<option value="">-- No Package --</option>';
        } else {
            selectElement.innerHTML = `<option value="">-- ${placeholder} --</option>`;
        }
        selectElement.value = '';
    }
    
    function updateBrazeFormState(type) {
        const state = brazeState[type];
        const generateBtn = document.getElementById(`${type}-generate-btn`);
        
        // Check if we can generate a name
        let canGenerate = state.selectedPurposeCode && 
                         state.selectedBrand && 
                         state.selectedMainCommType;
        
        // Check if specific type is required
        const commTypes = type === 'segment' 
            ? window.brazeNamingData.segmentCommunicationTypes 
            : window.brazeNamingData.communicationTypes;
        
        const mainTypeData = commTypes.find(ct => ct.name === state.selectedMainCommType);
        const hasSubTypes = mainTypeData && mainTypeData.subTypes && mainTypeData.subTypes.length > 0;
        
        if (hasSubTypes) {
            canGenerate = canGenerate && state.selectedSpecificCommType;
        }
        
        // Enable/disable generate button
        if (generateBtn) {
            generateBtn.disabled = !canGenerate;
        }
    }
    
    async function saveBrazeNameToHistory(type, name, state) {
        try {
            // Prepare data for saving
            const historyData = {
                name_type: type,
                generated_name: name,
                purpose_code: state.selectedPurposeCode,
                brand: state.selectedBrand,
                package: state.selectedPackage || null,
                comm_type: state.selectedMainCommType,
                specific_type: state.selectedSpecificCommType || null,
                custom_suffix: type === 'segment' ? state.customSuffix : null,
                description: state.description || null,
                flags: state.flags.length > 0 ? state.flags.join('|') : null
            };
            
            // Save to database (this will be implemented when database is ready)
            if (window.database && window.database.saveBrazeName) {
                await window.database.saveBrazeName(historyData);
            }
        } catch (error) {
            console.error('Failed to save Braze name to history:', error);
        }
    }
    
    function setupBrazeEventListeners(type) {
        const state = brazeState[type];
        
        // Purpose code change
        const purposeSelect = document.getElementById(`${type}-purpose`);
        if (purposeSelect) {
            purposeSelect.addEventListener('change', () => {
                state.selectedPurposeCode = purposeSelect.value;
                const mainCommSelect = document.getElementById(`${type}-comm-type`);
                
                if (state.selectedPurposeCode) {
                    // Update communication types based on purpose code
                    const commTypes = type === 'segment' 
                        ? window.brazeNamingData.segmentCommunicationTypes 
                        : window.brazeNamingData.communicationTypes;
                    
                    // Filter by valid codes
                    const validCommTypes = commTypes.filter(ct => 
                        ct.validCodes.includes(state.selectedPurposeCode)
                    );
                    
                    // Reset and repopulate communication types
                    const currentCommType = state.selectedMainCommType;
                    populateBrazeDropdown(mainCommSelect, validCommTypes, 'name', 'name');
                    mainCommSelect.disabled = false;
                    
                    // Try to preserve the current selection if it's still valid
                    if (currentCommType && validCommTypes.some(ct => ct.name === currentCommType)) {
                        mainCommSelect.value = currentCommType;
                    } else {
                        // Only clear if the current type is not valid for the new purpose code
                        state.selectedMainCommType = null;
                        handleMainCommTypeChange(type);
                    }
                } else {
                    // Only reset communication types when no purpose code is selected
                    resetBrazeDropdown(mainCommSelect, 'Select Main Type');
                    mainCommSelect.disabled = true;
                    state.selectedMainCommType = null;
                    handleMainCommTypeChange(type);
                }
                
                updateBrazeFormState(type);
            });
        }
        
        // Brand change
        const brandSelect = document.getElementById(`${type}-brand`);
        if (brandSelect) {
            brandSelect.addEventListener('change', function() {
                const state = brazeState[type];
                if (!state) {
                    console.error(`No state found for type: ${type}`);
                    return;
                }
                state.selectedBrand = this.value;
                handleBrazeBrandChange(type);
            });
        }
        
        // Package change
        const packageSelect = document.getElementById(`${type}-package`);
        if (packageSelect) {
            packageSelect.addEventListener('change', () => {
                state.selectedPackage = packageSelect.value;
                updateBrazeFormState(type);
            });
        }
        
        // Main communication type change
        const mainCommSelect = document.getElementById(`${type}-comm-type`);
        if (mainCommSelect) {
            mainCommSelect.addEventListener('change', () => {
                state.selectedMainCommType = mainCommSelect.value;
                handleMainCommTypeChange(type);
            });
        }
        
        // Specific communication type change
        const specificCommSelect = document.getElementById(`${type}-specific-type`);
        if (specificCommSelect) {
            specificCommSelect.addEventListener('change', () => {
                state.selectedSpecificCommType = specificCommSelect.value;
                updateBrazeFormState(type);
            });
        }
        
        // Description field (for all types)
        const descriptionInput = document.getElementById(`${type}-description`);
        if (descriptionInput) {
            descriptionInput.addEventListener('input', () => {
                state.description = descriptionInput.value;
                updateBrazeFormState(type);
            });
        }
        
        // Custom suffix for segments (legacy)
        if (type === 'segment') {
            const customSuffixInput = document.getElementById('segment-custom-suffix');
            if (customSuffixInput) {
                customSuffixInput.addEventListener('input', () => {
                    state.customSuffix = customSuffixInput.value;
                    updateBrazeFormState(type);
                });
            }
        }
        
        // Flags checkboxes
        const flagsContainer = document.getElementById(`${type}-flags`);
        if (flagsContainer) {
            const flagCheckboxes = flagsContainer.querySelectorAll('input[type="checkbox"]');
            flagCheckboxes.forEach(checkbox => {
                checkbox.addEventListener('change', () => {
                    if (checkbox.checked) {
                        if (!state.flags.includes(checkbox.value)) {
                            state.flags.push(checkbox.value);
                        }
                    } else {
                        state.flags = state.flags.filter(f => f !== checkbox.value);
                    }
                    updateBrazeFormState(type);
                });
            });
        }
        
        // Reset button
        const resetBtn = document.getElementById(`${type}-reset-btn`);
        if (resetBtn) {
            resetBtn.addEventListener('click', () => resetBrazeForm(type));
        }
        
        // Copy button
        const copyBtn = document.getElementById(`copy-${type}-btn`);
        if (copyBtn) {
            copyBtn.addEventListener('click', () => {
                const nameElement = document.getElementById(`generated-${type}-name`);
                if (nameElement && nameElement.textContent) {
                    navigator.clipboard.writeText(nameElement.textContent)
                        .then(() => {
                            if (window.showNotification) {
                                window.showNotification('Name copied to clipboard!', 'success');
                            }
                        })
                        .catch(err => {
                            console.error('Failed to copy:', err);
                            if (window.showNotification) {
                                window.showNotification('Failed to copy name', 'error');
                            }
                        });
                }
            });
        }
    }
    
    function handleBrazeBrandChange(type) {
        // Check if type is an event object (defensive programming)
        if (type && typeof type === 'object' && type.target) {
            console.error('handleBrazeBrandChange received an Event object instead of a type string');
            console.error('This suggests an event handler is incorrectly wired');
            console.error('Event target:', type.target);
            console.error('Stack trace:', new Error().stack);
            
            // Try to determine which element triggered this
            if (type.target && type.target.id) {
                console.error('Element ID that triggered this:', type.target.id);
            }
            return;
        }
        
        // Validate type parameter
        if (!type || typeof type !== 'string' || !brazeState[type]) {
            console.error(`Invalid type parameter: ${type}`);
            return;
        }
        
        const state = brazeState[type];
        const packageSelect = document.getElementById(`${type}-package`);
        const mainCommSelect = document.getElementById(`${type}-comm-type`);
        
        if (state.selectedBrand) {
            // Enable package selection when brand is selected
            populateBrazeDropdown(packageSelect, window.brazeNamingData.packages, 'fullName', 'fullName', true);
            packageSelect.disabled = false;
        } else {
            // Reset package field if no brand selected
            resetBrazeDropdown(packageSelect, 'No Package', true);
            packageSelect.disabled = true;
            state.selectedPackage = null;
        }
        
        // Note: Communication types are now handled in purpose code change event
        // They don't depend on brand selection anymore
        
        handleMainCommTypeChange(type);
    }
    
    function handleMainCommTypeChange(type) {
        const state = brazeState[type];
        const specificContainer = document.getElementById(`${type}-specific-type-container`);
        const specificSelect = document.getElementById(`${type}-specific-type`);
        
        const commTypes = type === 'segment' 
            ? window.brazeNamingData.segmentCommunicationTypes 
            : window.brazeNamingData.communicationTypes;
        
        const mainTypeData = commTypes.find(ct => ct.name === state.selectedMainCommType);
        const hasSubTypes = mainTypeData && mainTypeData.subTypes && mainTypeData.subTypes.length > 0;
        
        if (hasSubTypes) {
            // Show and populate specific type dropdown
            specificContainer.style.display = 'block';
            populateBrazeDropdown(specificSelect, mainTypeData.subTypes, 'name', 'name');
            specificSelect.disabled = false;
        } else {
            // Hide specific type dropdown
            specificContainer.style.display = 'none';
            resetBrazeDropdown(specificSelect, 'Select Specific Type');
            specificSelect.disabled = true;
            state.selectedSpecificCommType = null;
        }
        
        // Handle segment-specific custom suffix
        if (type === 'segment') {
            const customSuffixContainer = document.getElementById('segment-custom-suffix-container');
            const customSuffixInput = document.getElementById('segment-custom-suffix');
            
            if (state.selectedMainCommType) {
                customSuffixContainer.style.display = 'block';
                customSuffixInput.disabled = false;
            } else {
                customSuffixContainer.style.display = 'none';
                customSuffixInput.disabled = true;
                customSuffixInput.value = '';
                state.customSuffix = '';
            }
        }
        
        updateBrazeFormState(type);
    }
    
    function initializeBrazeForm(type) {
        const form = document.getElementById(`braze${capitalizeFirst(type)}Form`);
        if (!form) return;
        
        // Ensure state exists for this type
        if (!brazeState[type]) {
            console.error(`No state defined for type: ${type}`);
            return;
        }
        
        // Populate purpose codes
        const purposeSelect = document.getElementById(`${type}-purpose`);
        if (purposeSelect) {
            populateBrazeDropdown(purposeSelect, window.brazeNamingData.purposeCodes, 'codeValue', 'display');
        }
        
        // Populate brands - always enabled and populated
        const brandSelect = document.getElementById(`${type}-brand`);
        if (brandSelect) {
            populateBrazeDropdown(brandSelect, window.brazeNamingData.brands, 'fullName', 'fullName');
            brandSelect.disabled = false;
        }
        
        // Set up event listeners
        setupBrazeEventListeners(type);
        
        // Handle form submission
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            generateBrazeName(type);
        });
    }
    
    // Public functions
    function initializeBrazeNaming() {
        // Prevent duplicate initialization
        if (brazeInitialized) {
            console.log('Braze naming already initialized');
            return;
        }
        
        // Check if we have the required data
        if (!window.brazeNamingData) {
            console.error('Braze naming data not loaded');
            return;
        }
        
        // Initialize each form type
        initializeBrazeForm('campaign');
        initializeBrazeForm('canvas');
        initializeBrazeForm('segment');
        
        // Mark as initialized
        brazeInitialized = true;
    }
    
    async function generateBrazeName(type) {
        const state = brazeState[type];
        const currentYear = new Date().getFullYear().toString();
        
        // Get prefix based on type
        const prefix = {
            'campaign': 'CMP',
            'canvas': 'CAN',
            'segment': 'SEG'
        }[type];
        
        // Get code part
        let codePart = state.selectedPurposeCode === 'YEAR' ? currentYear : state.selectedPurposeCode;
        
        // Get brand part
        const brandData = window.brazeNamingData.brands.find(b => b.fullName === state.selectedBrand);
        let brandPart = brandData ? brandData.initial : 'XX';
        
        // Add package if selected
        if (state.selectedPackage) {
            const packageData = window.brazeNamingData.packages.find(p => p.fullName === state.selectedPackage);
            if (packageData) {
                brandPart += `_${packageData.initial}`;
            }
        }
        
        // Get communication part
        let commPart = '';
        const commTypes = type === 'segment' 
            ? window.brazeNamingData.segmentCommunicationTypes 
            : window.brazeNamingData.communicationTypes;
        
        const mainTypeData = commTypes.find(ct => ct.name === state.selectedMainCommType);
        if (mainTypeData) {
            if (mainTypeData.subTypes && mainTypeData.subTypes.length > 0 && state.selectedSpecificCommType) {
                const subTypeData = mainTypeData.subTypes.find(st => st.name === state.selectedSpecificCommType);
                commPart = subTypeData ? subTypeData.generatedString : '';
            } else {
                commPart = mainTypeData.generatedString || '';
            }
        }
        
        // Build final name
        let finalName = `${prefix}_${codePart}_${brandPart}_${commPart}`;
        
        // Add description if provided (works for all types)
        if (state.description) {
            const kebabDescription = toKebabCase(state.description);
            if (kebabDescription) {
                finalName += `_${kebabDescription}`;
            }
        }
        
        // Add custom suffix for segments (legacy support)
        if (type === 'segment' && state.customSuffix && !state.description) {
            const sanitizedSuffix = state.customSuffix.trim().replace(/\s+/g, '_');
            if (sanitizedSuffix) {
                finalName += `_${sanitizedSuffix}`;
            }
        }
        
        // Add flags if selected
        if (state.flags && state.flags.length > 0) {
            finalName += `_${state.flags.join('|')}`;
        }
        
        // Display the result
        const resultContainer = document.getElementById(`${type}-result-container`);
        const nameElement = document.getElementById(`generated-${type}-name`);
        
        if (resultContainer && nameElement) {
            nameElement.textContent = finalName;
            resultContainer.style.display = 'block';
        }
        
        // Save to database/history
        await saveBrazeNameToHistory(type, finalName, state);
        
        // Show notification
        if (window.showNotification) {
            window.showNotification(`${capitalizeFirst(type)} name generated successfully!`, 'success');
        }
    }
    
    function resetBrazeForm(type) {
        const state = brazeState[type];
        
        // Reset state
        state.selectedPurposeCode = null;
        state.selectedBrand = null;
        state.selectedPackage = null;
        state.selectedMainCommType = null;
        state.selectedSpecificCommType = null;
        state.description = '';
        state.flags = [];
        if (type === 'segment') {
            state.customSuffix = '';
        }
        
        // Reset form elements
        document.getElementById(`${type}-purpose`).value = '';
        document.getElementById(`${type}-brand`).value = '';
        // Keep brand dropdown enabled with all brands
        const brandSelect = document.getElementById(`${type}-brand`);
        if (brandSelect) {
            populateBrazeDropdown(brandSelect, window.brazeNamingData.brands, 'fullName', 'fullName');
            brandSelect.disabled = false;
        }
        resetBrazeDropdown(document.getElementById(`${type}-package`), 'No Package', true);
        document.getElementById(`${type}-package`).disabled = true;
        resetBrazeDropdown(document.getElementById(`${type}-comm-type`), 'Select Main Type');
        document.getElementById(`${type}-comm-type`).disabled = true;
        resetBrazeDropdown(document.getElementById(`${type}-specific-type`), 'Select Specific Type');
        document.getElementById(`${type}-specific-type`).disabled = true;
        
        // Hide specific type container
        document.getElementById(`${type}-specific-type-container`).style.display = 'none';
        
        // Reset segment-specific fields
        if (type === 'segment') {
            document.getElementById('segment-custom-suffix').value = '';
            document.getElementById('segment-custom-suffix').disabled = true;
            document.getElementById('segment-custom-suffix-container').style.display = 'none';
        }
        
        // Reset description field
        const descriptionInput = document.getElementById(`${type}-description`);
        if (descriptionInput) {
            descriptionInput.value = '';
        }
        
        // Reset flags checkboxes
        const flagsContainer = document.getElementById(`${type}-flags`);
        if (flagsContainer) {
            const flagCheckboxes = flagsContainer.querySelectorAll('input[type="checkbox"]');
            flagCheckboxes.forEach(checkbox => {
                checkbox.checked = false;
            });
        }
        
        // Hide result
        const resultContainer = document.getElementById(`${type}-result-container`);
        if (resultContainer) {
            resultContainer.style.display = 'none';
        }
        
        // Disable generate button
        const generateBtn = document.getElementById(`${type}-generate-btn`);
        if (generateBtn) {
            generateBtn.disabled = true;
        }
    }
    
    // Module initialization
    function initialize() {
        console.log('✅ Braze naming module loaded in CJC namespace');
    }
    
    // Initialize on load
    initialize();
    
    // Public API
    return {
        initialize: initializeBrazeNaming,
        generateName: generateBrazeName,
        reset: resetBrazeForm,
        handleBrazeBrandChange // Expose this for backward compatibility
    };
});

// Compatibility layer - maintains existing global references
(function() {
    'use strict';
    
    // Wait for module to be available
    function setupCompatibility() {
        if (CJC && CJC.modules && CJC.modules.brazeNaming) {
            // Create global reference
            window.brazeNaming = CJC.modules.brazeNaming;
            
            // Also expose handleBrazeBrandChange globally for backward compatibility
            window.handleBrazeBrandChange = CJC.modules.brazeNaming.handleBrazeBrandChange;
            
            // Temporary: Catch any calls to the old function name
            if (!window.handleBrandChange) {
                window.handleBrandChange = function(param) {
                    console.error('DEPRECATED: handleBrandChange called with:', param);
                    console.error('This function has been renamed to handleBrazeBrandChange');
                    console.error('Stack trace:', new Error().stack);
                    
                    // If it's being called with a string parameter, redirect to the new function
                    if (typeof param === 'string') {
                        console.log('Redirecting to handleBrazeBrandChange with type:', param);
                        CJC.modules.brazeNaming.handleBrazeBrandChange(param);
                    }
                };
            }
            
            console.log('✅ Braze naming compatibility layer established');
        } else {
            // Retry in a moment
            setTimeout(setupCompatibility, 10);
        }
    }
    
    setupCompatibility();
})();