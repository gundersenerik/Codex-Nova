/* ============================================================================
   SQL.js DATABASE WRAPPER - SQLite in Browser for Naming Standards Hub
   ============================================================================ */

// Global database instance
let db = null;
let SQL = null;

// ============================================================================
// INITIALIZATION
// ============================================================================

// Initialize SQL.js library and create database
async function initializeSQLJS() {
    try {
        console.log('🔄 Initializing SQL.js...');
        
        // Initialize SQL.js with WASM file location
        SQL = await window.initSqlJs({
            locateFile: file => `js/lib/${file}`
        });
        
        // Create new in-memory database
        db = new SQL.Database();
        
        console.log('✅ SQL.js initialized successfully');
        return true;
        
    } catch (error) {
        console.error('❌ Failed to initialize SQL.js:', error);
        throw new Error('Failed to initialize SQLite database: ' + error.message);
    }
}

// Load database schema and data (CSV data if available, otherwise sample data)
async function loadDatabaseSchema() {
    try {
        console.log('🔄 Loading database schema...');
        
        // First, try to load from localStorage (CSV data)
        const savedData = loadFromLocalStorage('naming_standards_hub_db');
        if (!savedData.error) {
            console.log('✅ Loaded real CSV data from localStorage');
            
            // Verify data
            const brandCount = db.exec("SELECT COUNT(*) as count FROM brands");
            const productCount = db.exec("SELECT COUNT(*) as count FROM products");  
            const ratePlanCount = db.exec("SELECT COUNT(*) as count FROM rate_plans");
            
            console.log('📊 Real database loaded:', {
                brands: brandCount[0]?.values[0][0] || 0,
                products: productCount[0]?.values[0][0] || 0,
                ratePlans: ratePlanCount[0]?.values[0][0] || 0
            });
            
            return true;
        }
        
        console.log('📂 No saved CSV data found, loading schema and sample data...');
        
        // Fetch schema SQL file
        const schemaResponse = await fetch('database/schema.sql');
        if (!schemaResponse.ok) {
            throw new Error(`Failed to load schema: ${schemaResponse.status}`);
        }
        const schemaSQL = await schemaResponse.text();
        
        // Execute schema
        db.exec(schemaSQL);
        console.log('✅ Database schema loaded');
        
        // Fetch sample data SQL file
        const dataResponse = await fetch('database/sample-data.sql');
        if (!dataResponse.ok) {
            throw new Error(`Failed to load sample data: ${dataResponse.status}`);
        }
        const dataSQL = await dataResponse.text();
        
        // Execute sample data
        db.exec(dataSQL);
        console.log('✅ Sample data loaded (no CSV data available)');
        
        // Verify data was loaded
        const brandCount = db.exec("SELECT COUNT(*) as count FROM brands");
        const productCount = db.exec("SELECT COUNT(*) as count FROM products");
        const ratePlanCount = db.exec("SELECT COUNT(*) as count FROM rate_plans");
        
        console.log('📊 Sample database loaded:', {
            brands: brandCount[0]?.values[0][0] || 0,
            products: productCount[0]?.values[0][0] || 0,
            ratePlans: ratePlanCount[0]?.values[0][0] || 0
        });
        
        return true;
        
    } catch (error) {
        console.error('❌ Failed to load database schema:', error);
        throw new Error('Failed to load database: ' + error.message);
    }
}

// ============================================================================
// DATABASE OPERATIONS
// ============================================================================

// Execute SQL query and return results in a structured format
function executeQuery(sql, params = []) {
    try {
        const results = db.exec(sql, params);
        
        if (!results || results.length === 0) {
            return { data: [], error: null };
        }
        
        // Convert SQL.js result format to array of objects
        const result = results[0];
        const columns = result.columns;
        const values = result.values;
        
        const data = values.map(row => {
            const obj = {};
            columns.forEach((col, index) => {
                obj[col] = row[index];
            });
            return obj;
        });
        
        return { data, error: null };
        
    } catch (error) {
        console.error('SQL Error:', error);
        return { data: null, error: error.message };
    }
}

// Execute SQL statement (INSERT, UPDATE, DELETE) without return data
function executeStatement(sql, params = []) {
    try {
        db.run(sql, params);
        return { error: null };
    } catch (error) {
        console.error('SQL Error:', error);
        return { error: error.message };
    }
}

// Get a single row result
function getRow(sql, params = []) {
    const result = executeQuery(sql, params);
    if (result.error) return result;
    
    return {
        data: result.data.length > 0 ? result.data[0] : null,
        error: null
    };
}

// ============================================================================
// DATA PERSISTENCE
// ============================================================================

// Export database to binary array (can be saved to file)
function exportDatabase() {
    try {
        const data = db.export();
        return { data, error: null };
    } catch (error) {
        console.error('Export error:', error);
        return { data: null, error: error.message };
    }
}

// Import database from binary array
function importDatabase(data) {
    try {
        db.close();
        db = new SQL.Database(data);
        return { error: null };
    } catch (error) {
        console.error('Import error:', error);
        return { error: error.message };
    }
}

// Save database to localStorage
function saveToLocalStorage(key = 'naming_standards_db') {
    try {
        const { data, error } = exportDatabase();
        if (error) return { error };
        
        // Convert to base64 for localStorage
        const base64 = btoa(String.fromCharCode.apply(null, data));
        localStorage.setItem(key, base64);
        
        console.log('💾 Database saved to localStorage');
        return { error: null };
    } catch (error) {
        console.error('Save error:', error);
        return { error: error.message };
    }
}

// Load database from localStorage
function loadFromLocalStorage(key = 'naming_standards_db') {
    try {
        const base64 = localStorage.getItem(key);
        if (!base64) {
            return { error: 'No saved database found' };
        }
        
        // Convert from base64
        const binaryString = atob(base64);
        const data = new Uint8Array(binaryString.length);
        for (let i = 0; i < binaryString.length; i++) {
            data[i] = binaryString.charCodeAt(i);
        }
        
        const result = importDatabase(data);
        if (!result.error) {
            console.log('📂 Database loaded from localStorage');
        }
        return result;
    } catch (error) {
        console.error('Load error:', error);
        return { error: error.message };
    }
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

// Check if database is initialized
function isDatabaseReady() {
    return db !== null && SQL !== null;
}

// Get database statistics
function getDatabaseStats() {
    if (!isDatabaseReady()) {
        return { error: 'Database not initialized' };
    }
    
    try {
        const tables = executeQuery(`
            SELECT name, sql FROM sqlite_master 
            WHERE type='table' AND name NOT LIKE 'sqlite_%'
            ORDER BY name
        `);
        
        const stats = {};
        if (tables.data) {
            for (const table of tables.data) {
                const count = executeQuery(`SELECT COUNT(*) as count FROM ${table.name}`);
                stats[table.name] = count.data ? count.data[0].count : 0;
            }
        }
        
        return { data: stats, error: null };
    } catch (error) {
        return { data: null, error: error.message };
    }
}

// ============================================================================
// MAKE FUNCTIONS GLOBALLY AVAILABLE
// ============================================================================

// Export functions to global scope
window.sqlDB = {
    // Initialization
    initialize: initializeSQLJS,
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

console.log('SQL.js database wrapper loaded successfully');