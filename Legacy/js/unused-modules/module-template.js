/* ============================================================================
   MODULE TEMPLATE - Copy this file when creating new features
   ============================================================================ */

// Define your module using CJC.defineModule
CJC.defineModule('myFeature', function(api) {
    // Access utilities and events through the api parameter
    const { utils, events, config } = api;
    
    // ========================================================================
    // PRIVATE VARIABLES (Not accessible outside this module)
    // ========================================================================
    let privateData = null;
    let isInitialized = false;
    
    // ========================================================================
    // PRIVATE FUNCTIONS (Not accessible outside this module)
    // ========================================================================
    
    function validateInput(input) {
        // Private validation logic
        return input && input.length > 0;
    }
    
    function processData(data) {
        // Private processing logic
        console.log('Processing:', data);
        return data.toUpperCase();
    }
    
    function showError(message) {
        // Use centralized notification system
        utils.notify(message, 'error');
    }
    
    // ========================================================================
    // EVENT HANDLERS
    // ========================================================================
    
    function handleDataChange(newData) {
        privateData = newData;
        // Emit event for other modules
        events.emit('myFeature:dataChanged', newData);
    }
    
    // ========================================================================
    // PUBLIC API (Exposed to other modules)
    // ========================================================================
    
    return {
        // Initialize the module
        initialize() {
            if (isInitialized) {
                console.log('MyFeature already initialized');
                return;
            }
            
            console.log('Initializing MyFeature module...');
            
            // Set up event listeners
            events.on('someGlobalEvent', handleDataChange);
            
            // Initialize UI if needed
            this.setupUI();
            
            isInitialized = true;
            events.emit('myFeature:initialized');
        },
        
        // Set up UI components
        setupUI() {
            const container = document.getElementById('my-feature-container');
            if (!container) return;
            
            // Create UI elements
            container.innerHTML = `
                <div class="my-feature">
                    <h3>My Feature</h3>
                    <button id="my-feature-btn">Click Me</button>
                </div>
            `;
            
            // Add event listeners
            const btn = document.getElementById('my-feature-btn');
            if (btn) {
                btn.addEventListener('click', () => {
                    this.doSomething('Button clicked!');
                });
            }
        },
        
        // Public method
        doSomething(input) {
            if (!validateInput(input)) {
                showError('Invalid input');
                return null;
            }
            
            const result = processData(input);
            events.emit('myFeature:actionCompleted', result);
            return result;
        },
        
        // Getter for private data (controlled access)
        getData() {
            return privateData;
        },
        
        // Cleanup method
        destroy() {
            events.off('someGlobalEvent', handleDataChange);
            privateData = null;
            isInitialized = false;
        }
    };
});

// ============================================================================
// USAGE EXAMPLES
// ============================================================================

/*
// From another module or script:

// 1. Access the module
const myFeature = CJC.require('myFeature');

// 2. Initialize it
myFeature.initialize();

// 3. Use public methods
const result = myFeature.doSomething('test');

// 4. Listen to module events
CJC.events.on('myFeature:actionCompleted', function(data) {
    console.log('MyFeature completed:', data);
});

// 5. Communicate between modules
CJC.events.emit('someGlobalEvent', { data: 'new data' });
*/