/* ============================================================================
   SQL DATABASE MODULE - SQLite in Browser (Migrated to CJC Namespace)
   ============================================================================ */

CJC.defineModule('sqlDatabase', function(api) {
    const { utils, events } = api;
    
    // ========================================================================
    // PRIVATE STATE
    // ========================================================================
    let db = null;
    let SQL = null;
    let isInitialized = false;
    
    // ========================================================================
    // PRIVATE FUNCTIONS
    // ========================================================================
    
    // Initialize SQL.js library and create database
    async function initializeSQLJS() {
        try {
            console.log('🔄 Initializing SQL.js...');
            
            // Initialize SQL.js with WASM file location
            SQL = await window.initSqlJs({
                locateFile: file => `/js/lib/${file}`
            });
            
            // Create new in-memory database
            db = new SQL.Database();
            
            console.log('✅ SQL.js initialized successfully');
            events.emit('sqlDatabase:initialized');
            return true;
            
        } catch (error) {
            console.error('❌ Failed to initialize SQL.js:', error);
            events.emit('sqlDatabase:error', { error: error.message });
            throw new Error('Failed to initialize SQLite database: ' + error.message);
        }
    }
    
    // Load database schema and data
    async function loadDatabaseSchema() {
        try {
            console.log('🔄 Loading database schema...');
            
            // First, try to load from localStorage
            const savedData = loadFromLocalStorage('naming_standards_hub_db');
            if (!savedData.error) {
                console.log('✅ Loaded data from localStorage');
                
                // Verify data
                const brandCount = db.exec("SELECT COUNT(*) as count FROM brands");
                const productCount = db.exec("SELECT COUNT(*) as count FROM products");  
                const ratePlanCount = db.exec("SELECT COUNT(*) as count FROM rate_plans");
                
                console.log('📊 Database loaded:', {
                    brands: brandCount[0]?.values[0][0] || 0,
                    products: productCount[0]?.values[0][0] || 0,
                    ratePlans: ratePlanCount[0]?.values[0][0] || 0
                });
                
                events.emit('sqlDatabase:dataLoaded', { source: 'localStorage' });
                return true;
            }
            
            // If no saved data, load schema and initial data
            console.log('📂 No saved data found, loading schema...');
            
            // Load schema
            const schemaResponse = await fetch('/database/schema.sql');
            const schemaSQL = await schemaResponse.text();
            db.run(schemaSQL);
            console.log('✅ Schema loaded');
            
            // Load sample data
            const sampleDataResponse = await fetch('/database/sample-data.sql');
            const sampleDataSQL = await sampleDataResponse.text();
            db.run(sampleDataSQL);
            console.log('✅ Sample data loaded');
            
            events.emit('sqlDatabase:dataLoaded', { source: 'sampleData' });
            return true;
            
        } catch (error) {
            console.error('❌ Failed to load database schema:', error);
            events.emit('sqlDatabase:error', { error: error.message });
            throw new Error('Failed to load database schema: ' + error.message);
        }
    }
    
    // Execute a SELECT query and return results
    function executeQuery(sql, params = []) {
        if (!isDatabaseReady()) {
            return { data: null, error: 'Database not initialized' };
        }
        
        try {
            const stmt = db.prepare(sql);
            const results = [];
            
            if (params.length > 0) {
                stmt.bind(params);
            }
            
            while (stmt.step()) {
                results.push(stmt.getAsObject());
            }
            
            stmt.free();
            return { data: results, error: null };
            
        } catch (error) {
            console.error('Query error:', error);
            return { data: null, error: error.message };
        }
    }
    
    // Execute a non-SELECT statement (INSERT, UPDATE, DELETE)
    function executeStatement(sql, params = []) {
        if (!isDatabaseReady()) {
            return { success: false, error: 'Database not initialized' };
        }
        
        try {
            const stmt = db.prepare(sql);
            
            if (params.length > 0) {
                stmt.bind(params);
            }
            
            stmt.run();
            stmt.free();
            
            // Get last insert ID if applicable
            const lastId = db.exec("SELECT last_insert_rowid()")[0]?.values[0][0];
            
            return { success: true, error: null, lastId };
            
        } catch (error) {
            console.error('Statement error:', error);
            return { success: false, error: error.message };
        }
    }
    
    // Get a single row
    function getRow(sql, params = []) {
        const result = executeQuery(sql, params);
        if (result.error) return { data: null, error: result.error };
        return { data: result.data[0] || null, error: null };
    }
    
    // Export database to binary format
    function exportDatabase() {
        if (!isDatabaseReady()) {
            return { data: null, error: 'Database not initialized' };
        }
        
        try {
            const data = db.export();
            return { data, error: null };
        } catch (error) {
            return { data: null, error: error.message };
        }
    }
    
    // Import database from binary format
    function importDatabase(data) {
        try {
            if (!SQL) {
                throw new Error('SQL.js not initialized');
            }
            
            db = new SQL.Database(data);
            events.emit('sqlDatabase:imported');
            return { success: true, error: null };
            
        } catch (error) {
            return { success: false, error: error.message };
        }
    }
    
    // Save database to localStorage
    function saveToLocalStorage(key = 'naming_standards_hub_db') {
        const exported = exportDatabase();
        if (exported.error) return { success: false, error: exported.error };
        
        try {
            const buffer = exported.data;
            const base64 = btoa(String.fromCharCode(...buffer));
            localStorage.setItem(key, base64);
            return { success: true, error: null };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }
    
    // Load database from localStorage
    function loadFromLocalStorage(key = 'naming_standards_hub_db') {
        try {
            const base64 = localStorage.getItem(key);
            if (!base64) {
                return { success: false, error: 'No saved database found' };
            }
            
            const buffer = Uint8Array.from(atob(base64), c => c.charCodeAt(0));
            const result = importDatabase(buffer);
            return result;
        } catch (error) {
            return { success: false, error: error.message };
        }
    }
    
    // Check if database is ready
    function isDatabaseReady() {
        return db !== null && SQL !== null;
    }
    
    // Get database statistics
    function getDatabaseStats() {
        if (!isDatabaseReady()) {
            return { data: null, error: 'Database not initialized' };
        }
        
        try {
            const stats = {
                brands: db.exec("SELECT COUNT(*) as count FROM brands")[0]?.values[0][0] || 0,
                products: db.exec("SELECT COUNT(*) as count FROM products")[0]?.values[0][0] || 0,
                ratePlans: db.exec("SELECT COUNT(*) as count FROM rate_plans")[0]?.values[0][0] || 0,
                generations: db.exec("SELECT COUNT(*) as count FROM generations")[0]?.values[0][0] || 0
            };
            
            return { data: stats, error: null };
        } catch (error) {
            return { data: null, error: error.message };
        }
    }
    
    // ========================================================================
    // PUBLIC API
    // ========================================================================
    
    return {
        // Initialization
        async initialize() {
            if (isInitialized) {
                console.log('SQL Database already initialized');
                return true;
            }
            
            await initializeSQLJS();
            isInitialized = true;
            return true;
        },
        
        loadSchema: loadDatabaseSchema,
        
        // Query execution
        query: executeQuery,
        execute: executeStatement,
        getRow: getRow,
        
        // Persistence
        exportDatabase,
        importDatabase,
        saveToLocalStorage,
        loadFromLocalStorage,
        
        // Utilities
        isReady: isDatabaseReady,
        getStats: getDatabaseStats,
        
        // Direct access (for advanced usage)
        getDB: () => db,
        getSQL: () => SQL
    };
});

// ============================================================================
// COMPATIBILITY LAYER - Remove after full migration
// ============================================================================

(function() {
    // Wait for module to be available
    const checkAndSetup = () => {
        try {
            const sqlDB = CJC.require('sqlDatabase');
            
            // Map old window.sqlDB to new module
            window.sqlDB = {
                initialize: () => sqlDB.initialize(),
                loadSchema: () => sqlDB.loadSchema(),
                query: (sql, params) => sqlDB.query(sql, params),
                execute: (sql, params) => sqlDB.execute(sql, params),
                getRow: (sql, params) => sqlDB.getRow(sql, params),
                exportDatabase: () => sqlDB.exportDatabase(),
                importDatabase: (data) => sqlDB.importDatabase(data),
                saveToLocalStorage: (key) => sqlDB.saveToLocalStorage(key),
                loadFromLocalStorage: (key) => sqlDB.loadFromLocalStorage(key),
                isReady: () => sqlDB.isReady(),
                getStats: () => sqlDB.getStats(),
                getDB: () => sqlDB.getDB(),
                getSQL: () => sqlDB.getSQL()
            };
            
            console.log('SQL Database compatibility layer established');
        } catch (e) {
            // Module not ready yet, try again
            setTimeout(checkAndSetup, 100);
        }
    };
    
    // Start checking
    checkAndSetup();
})();