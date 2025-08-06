/* ============================================================================
   BRAZE NAMING V2 - Clean implementation of Braze naming conventions
   ============================================================================ */

(function() {
    'use strict';
    
    // State management
    const state = {
        objectType: null,
        code: null,
        year: new Date().getFullYear(),
        brand: null,
        commType: null,
        description: '',
        hasABTest: false,
        generatedName: '',
        history: []
    };
    
    // Helper functions
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
    
    function updatePreview() {
        const previewElement = document.getElementById('naming-preview');
        if (!previewElement) return;
        
        let preview = '';
        
        // Build preview based on current state
        if (state.objectType) {
            preview = state.objectType;
            
            if (state.code) {
                const codeValue = state.code === 'YYYY' ? state.year : state.code;
                preview += `_${codeValue}`;
                
                if (state.brand) {
                    preview += `_${state.brand}`;
                    
                    if (state.commType) {
                        preview += `_${state.commType}`;
                        
                        if (state.description) {
                            const kebabDesc = toKebabCase(state.description);
                            if (kebabDesc) {
                                preview += `_${kebabDesc}`;
                            }
                        }
                        
                        if (state.hasABTest) {
                            preview += '_abtest';
                        }
                    }
                }
            }
        }
        
        if (preview) {
            previewElement.innerHTML = `<span class="preview-text">${preview}</span>`;
            previewElement.classList.add('has-preview');
        } else {
            previewElement.innerHTML = '<span class="preview-placeholder">Select options to generate name...</span>';
            previewElement.classList.remove('has-preview');
        }
        
        // Update button states
        const hasCompleteName = state.objectType && state.code && state.brand && state.commType;
        document.getElementById('generate-btn').disabled = !hasCompleteName;
        document.getElementById('copy-name-btn').disabled = !state.generatedName;
        document.getElementById('copy-utm-btn').disabled = !state.generatedName;
    }
    
    function populateDropdown(selectId, items, valueField, textField) {
        const select = document.getElementById(selectId);
        if (!select) {
            console.error(`Dropdown element not found: ${selectId}`);
            return;
        }
        
        // Keep first option (placeholder)
        const firstOption = select.options[0];
        select.innerHTML = '';
        select.appendChild(firstOption);
        
        // Add items
        if (items && items.length > 0) {
            items.forEach(item => {
                const option = document.createElement('option');
                option.value = item[valueField];
                option.textContent = item[textField];
                if (item.description) {
                    option.title = item.description;
                }
                select.appendChild(option);
            });
        }
    }
    
    function updateCommunicationTypes() {
        const select = document.getElementById('comm-type');
        if (!select) return;
        
        // Keep first option
        const firstOption = select.options[0];
        select.innerHTML = '';
        select.appendChild(firstOption);
        
        if (!state.code) {
            return;
        }
        
        // Filter communication types by code
        const validTypes = window.brazeNamingV2Data.communicationTypes.filter(type => {
            // For YYYY code, allow types with defaultCode 2000 or YYYY
            if (state.code === 'YYYY') {
                return type.defaultCode === '2000' || type.defaultCode === 'YYYY';
            }
            return type.defaultCode === state.code;
        });
        
        // Sort by tag name
        validTypes.sort((a, b) => a.tag.localeCompare(b.tag));
        
        // Add filtered communication types
        validTypes.forEach(type => {
            const option = document.createElement('option');
            option.value = type.tag;
            option.textContent = type.tag;
            option.title = type.purpose;
            select.appendChild(option);
        });
        
        // Reset comm type selection if current selection is not valid
        if (state.commType && !validTypes.find(t => t.tag === state.commType)) {
            state.commType = null;
            showCodeOverrideWarning();
        }
    }
    
    function showCodeOverrideWarning() {
        if (!state.code || !state.commType) {
            document.getElementById('code-override-warning').style.display = 'none';
            return;
        }
        
        const commType = window.brazeNamingV2Data.communicationTypes.find(t => t.tag === state.commType);
        if (commType && commType.defaultCode !== state.code && state.code !== 'YYYY') {
            document.getElementById('default-code').textContent = commType.defaultCode;
            document.getElementById('code-override-warning').style.display = 'block';
        } else {
            document.getElementById('code-override-warning').style.display = 'none';
        }
    }
    
    function generateName() {
        if (!state.objectType || !state.code || !state.brand || !state.commType) {
            return;
        }
        
        // Build the name
        let name = state.objectType;
        
        // Add code (with year if YYYY)
        const codeValue = state.code === 'YYYY' ? state.year : state.code;
        name += `_${codeValue}`;
        
        // Add brand
        name += `_${state.brand}`;
        
        // Add communication type
        name += `_${state.commType}`;
        
        // Add description if provided
        if (state.description) {
            const kebabDesc = toKebabCase(state.description);
            if (kebabDesc) {
                name += `_${kebabDesc}`;
            }
        }
        
        // Add flags
        if (state.hasABTest) {
            name += '_abtest';
        }
        
        state.generatedName = name;
        
        // Add to history
        addToHistory(name);
        
        // Update UI
        updatePreview();
        
        // Show success notification
        if (window.showNotification) {
            window.showNotification('Name generated successfully!', 'success');
        }
    }
    
    function addToHistory(name) {
        const historyItem = {
            name: name,
            timestamp: new Date().toISOString(),
            objectType: state.objectType,
            code: state.code === 'YYYY' ? state.year : state.code,
            brand: state.brand,
            commType: state.commType,
            description: state.description,
            hasABTest: state.hasABTest
        };
        
        // Add to beginning of history
        state.history.unshift(historyItem);
        
        // Keep only last 20 items
        if (state.history.length > 20) {
            state.history = state.history.slice(0, 20);
        }
        
        // Save to localStorage
        try {
            localStorage.setItem('brazeNamingV2History', JSON.stringify(state.history));
        } catch (e) {
            console.error('Failed to save history:', e);
        }
        
        // Update history display
        updateHistoryDisplay();
    }
    
    function updateHistoryDisplay() {
        const container = document.getElementById('naming-history');
        if (!container) return;
        
        if (state.history.length === 0) {
            container.innerHTML = '<p class="no-history">No naming history yet</p>';
            return;
        }
        
        container.innerHTML = state.history.map((item, index) => `
            <div class="history-item">
                <div class="history-name">${item.name}</div>
                <div class="history-meta">
                    ${new Date(item.timestamp).toLocaleString()}
                    <button class="btn-small" onclick="window.brazeNamingV2.copyToClipboard('${item.name}')">Copy</button>
                </div>
            </div>
        `).join('');
    }
    
    function copyToClipboard(text) {
        navigator.clipboard.writeText(text)
            .then(() => {
                if (window.showNotification) {
                    window.showNotification('Copied to clipboard!', 'success');
                }
            })
            .catch(err => {
                console.error('Failed to copy:', err);
                if (window.showNotification) {
                    window.showNotification('Failed to copy', 'error');
                }
            });
    }
    
    function copyAsUTM() {
        if (!state.generatedName) return;
        
        // Convert to UTM format: lowercase with underscores
        const utmFormat = state.generatedName.toLowerCase();
        copyToClipboard(utmFormat);
    }
    
    function resetForm() {
        // Reset state
        state.objectType = null;
        state.code = null;
        state.year = new Date().getFullYear();
        state.brand = null;
        state.commType = null;
        state.description = '';
        state.hasABTest = false;
        state.generatedName = '';
        
        // Reset form elements
        document.getElementById('object-type').value = '';
        document.getElementById('code-type').value = '';
        document.getElementById('year-input').value = state.year;
        document.getElementById('year-input').style.display = 'none';
        document.getElementById('brand-select').value = '';
        document.getElementById('comm-type').value = '';
        document.getElementById('description-input').value = '';
        document.getElementById('abtest-flag').checked = false;
        
        // Hide warnings
        document.getElementById('code-override-warning').style.display = 'none';
        
        // Update preview
        updatePreview();
    }
    
    function initializeForm() {
        // Check if data is loaded
        if (!window.brazeNamingV2Data) {
            console.error('Braze naming V2 data not loaded');
            setTimeout(initializeForm, 100);
            return;
        }
        
        // Populate dropdowns
        populateDropdown('object-type', window.brazeNamingV2Data.objectTypes, 'code', 'name');
        populateDropdown('code-type', window.brazeNamingV2Data.codes, 'value', 'name');
        populateDropdown('brand-select', window.brazeNamingV2Data.brands, 'code', 'name');
        
        // Load history from localStorage
        try {
            const savedHistory = localStorage.getItem('brazeNamingV2History');
            if (savedHistory) {
                state.history = JSON.parse(savedHistory);
                updateHistoryDisplay();
            }
        } catch (e) {
            console.error('Failed to load history:', e);
        }
        
        // Set up event listeners
        setupEventListeners();
        
        // Initial UI state
        updatePreview();
    }
    
    function setupEventListeners() {
        // Object type change
        document.getElementById('object-type')?.addEventListener('change', function() {
            state.objectType = this.value;
            updatePreview();
        });
        
        // Code type change
        document.getElementById('code-type')?.addEventListener('change', function() {
            state.code = this.value;
            
            // Show/hide year input
            const yearInput = document.getElementById('year-input');
            if (this.value === 'YYYY') {
                yearInput.style.display = 'block';
                yearInput.value = state.year;
            } else {
                yearInput.style.display = 'none';
            }
            
            // Update communication types dropdown
            updateCommunicationTypes();
            showCodeOverrideWarning();
            updatePreview();
        });
        
        // Year input change
        document.getElementById('year-input')?.addEventListener('input', function() {
            state.year = this.value;
            updatePreview();
        });
        
        // Brand change
        document.getElementById('brand-select')?.addEventListener('change', function() {
            state.brand = this.value;
            updatePreview();
        });
        
        // Communication type change
        document.getElementById('comm-type')?.addEventListener('change', function() {
            state.commType = this.value;
            showCodeOverrideWarning();
            
            // Update hint
            const commType = window.brazeNamingV2Data.communicationTypes.find(t => t.tag === this.value);
            const hint = document.getElementById('comm-type-hint');
            if (commType && hint) {
                hint.textContent = commType.purpose;
            }
            
            updatePreview();
        });
        
        // Description input
        document.getElementById('description-input')?.addEventListener('input', function() {
            state.description = this.value;
            updatePreview();
        });
        
        // A/B Test checkbox
        document.getElementById('abtest-flag')?.addEventListener('change', function() {
            state.hasABTest = this.checked;
            updatePreview();
        });
        
        // Form submit
        document.getElementById('brazeNamingForm')?.addEventListener('submit', function(e) {
            e.preventDefault();
            generateName();
        });
        
        // Reset button
        document.getElementById('reset-btn')?.addEventListener('click', function(e) {
            e.preventDefault();
            resetForm();
        });
        
        // Copy buttons
        document.getElementById('copy-name-btn')?.addEventListener('click', function() {
            if (state.generatedName) {
                copyToClipboard(state.generatedName);
            }
        });
        
        document.getElementById('copy-utm-btn')?.addEventListener('click', function() {
            copyAsUTM();
        });
    }
    
    // Public API
    window.brazeNamingV2 = {
        initialize: initializeForm,
        copyToClipboard: copyToClipboard
    };
    
    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeForm);
    } else {
        initializeForm();
    }
})();