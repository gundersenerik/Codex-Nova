/* ============================================================================
   OMNI CONSOLIDATION INITIALIZATION
   This script runs after the database is initialized to consolidate Omni brands
   ============================================================================ */

// Function to run Omni consolidation
async function consolidateOmniBrands() {
    if (!window.sqlDB || !window.sqlDB.isReady()) {
        console.error('Database not ready for Omni consolidation');
        return false;
    }
    
    try {
        console.log('Starting Omni brand consolidation...');
        
        // First, clean up any empty or invalid brand entries
        const cleanupResult = window.sqlDB.execute(`
            DELETE FROM brands 
            WHERE name = '' 
               OR name IS NULL 
               OR code = '' 
               OR code IS NULL
        `);
        
        if (cleanupResult.error) {
            console.log('Note during cleanup:', cleanupResult.error);
        } else {
            console.log('Cleaned up any empty brand entries');
        }
        
        // Check if shortcode column exists, if not add it
        const addColumnResult = window.sqlDB.execute(`
            ALTER TABLE products ADD COLUMN shortcode TEXT
        `);
        
        // This might fail if column already exists, which is fine
        if (addColumnResult.error && !addColumnResult.error.includes('duplicate column')) {
            console.log('Note:', addColumnResult.error);
        }
        
        // Check if we have multiple Omni brands
        const omniCheck = window.sqlDB.query(`
            SELECT code, name FROM brands 
            WHERE code IN ('OM', 'OMB', 'OME', 'OMEB', 'OMMER', 'OMMERB', 'OMSP')
            ORDER BY code
        `);
        
        if (omniCheck.data && omniCheck.data.length > 1) {
            console.log(`Found ${omniCheck.data.length} Omni brands to consolidate`);
            
            // Get the main Omni brand ID
            const mainOmni = window.sqlDB.query(`
                SELECT id FROM brands WHERE code = 'OM' LIMIT 1
            `);
            
            if (!mainOmni.data || mainOmni.data.length === 0) {
                console.error('Main Omni brand not found');
                return false;
            }
            
            const mainOmniId = mainOmni.data[0].id;
            
            // Update all Omni products to use the main brand and set shortcodes
            const updateResult = window.sqlDB.execute(`
                UPDATE products 
                SET brand_id = ${mainOmniId},
                    shortcode = CASE 
                        WHEN name = 'Omni annonsfritt' THEN 'OM'
                        WHEN name = 'Omni Bundle' THEN 'OM'
                        WHEN name = 'Omni Bundle Bas' THEN 'OMB'
                        WHEN name = 'Omni Ekonomi' THEN 'OME'
                        WHEN name = 'Omni Ekonomi Bas' THEN 'OMEB'
                        WHEN name = 'Omni Mer' THEN 'OMMER'
                        WHEN name = 'Omni Mer Bas' THEN 'OMMERB'
                        WHEN name = 'Omni Superpaketet' THEN 'OMSP'
                        ELSE shortcode
                    END
                WHERE name LIKE 'Omni%'
            `);
            
            if (updateResult.error) {
                console.error('Failed to update Omni products:', updateResult.error);
                return false;
            }
            
            // Delete the extra Omni brands and any duplicates
            const deleteResult = window.sqlDB.execute(`
                DELETE FROM brands 
                WHERE code IN ('OMB', 'OME', 'OMEB', 'OMMER', 'OMMERB', 'OMSP')
                   OR (code = 'OM' AND id != ${mainOmniId})
                   OR name = ''
                   OR name IS NULL
            `);
            
            if (deleteResult.error) {
                console.error('Failed to delete extra Omni brands:', deleteResult.error);
                return false;
            }
            
            console.log('✅ Omni brands consolidated successfully');
            
            // Clear the database cache to ensure fresh data
            if (window.database && window.database.clearCache) {
                window.database.clearCache();
                console.log('Database cache cleared after consolidation');
            }
            
            // Verify the result
            const verifyResult = window.sqlDB.query(`
                SELECT 
                    b.code as brand_code,
                    b.name as brand_name,
                    COUNT(DISTINCT p.id) as product_count,
                    COUNT(DISTINCT p.shortcode) as unique_shortcodes
                FROM brands b
                LEFT JOIN products p ON p.brand_id = b.id
                WHERE b.code = 'OM'
                GROUP BY b.code, b.name
            `);
            
            if (verifyResult.data && verifyResult.data.length > 0) {
                const stats = verifyResult.data[0];
                console.log(`Omni now has ${stats.product_count} products with ${stats.unique_shortcodes} unique shortcodes`);
            }
        } else {
            console.log('Omni brands already consolidated or not present');
        }
        
        return true;
        
    } catch (error) {
        console.error('Error during Omni consolidation:', error);
        return false;
    }
}

// Add to global scope
window.consolidateOmniBrands = consolidateOmniBrands;

// Auto-run when database is ready
if (window.sqlDB && window.sqlDB.isReady()) {
    setTimeout(consolidateOmniBrands, 100);
} else {
    // Wait for database to be ready
    const checkInterval = setInterval(() => {
        if (window.sqlDB && window.sqlDB.isReady()) {
            clearInterval(checkInterval);
            consolidateOmniBrands();
        }
    }, 100);
}

console.log('Omni consolidation script loaded');