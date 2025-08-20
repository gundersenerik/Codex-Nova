// ============================================================================
// BROWSER IMPORT SCRIPT
// Run this in the browser console to import the new data
// ============================================================================

async function importCodexNovaData() {
    console.log('🚀 Starting Codex Nova data import...');
    
    try {
        // 1. Clear existing cache
        console.log('🧹 Clearing cache...');
        localStorage.clear();
        if (window.database && window.database.clearCache) {
            window.database.clearCache();
        }
        
        // 2. Fetch the import SQL
        console.log('📥 Loading import SQL...');
        const response = await fetch('/database/codex-nova-import.sql');
        if (!response.ok) {
            throw new Error(`Failed to load SQL: ${response.status}`);
        }
        const sqlContent = await response.text();
        
        // 3. Execute the SQL
        console.log('⚙️ Executing import...');
        if (window.sqlDB && window.sqlDB.db) {
            // Split SQL into individual statements
            const statements = sqlContent
                .split(';')
                .map(s => s.trim())
                .filter(s => s.length > 0 && !s.startsWith('--'));
            
            let successCount = 0;
            let errorCount = 0;
            
            statements.forEach((statement, index) => {
                try {
                    // Skip backup statements as they might not work in SQL.js
                    if (statement.includes('CREATE TABLE IF NOT EXISTS') && statement.includes('backup')) {
                        console.log(`⏭️ Skipping backup statement ${index + 1}`);
                        return;
                    }
                    
                    window.sqlDB.db.run(statement + ';');
                    successCount++;
                    
                    // Log progress for important statements
                    if (statement.includes('INSERT INTO brands')) {
                        console.log('✅ Inserted brand');
                    } else if (statement.includes('INSERT INTO products')) {
                        if (successCount % 10 === 0) {
                            console.log(`✅ Inserted ${successCount} products...`);
                        }
                    } else if (statement.includes('DELETE FROM')) {
                        console.log('🗑️ Cleared old data');
                    }
                } catch (error) {
                    errorCount++;
                    if (!statement.includes('backup')) {
                        console.error(`❌ Error on statement ${index + 1}:`, error.message);
                    }
                }
            });
            
            console.log(`✅ Import complete! ${successCount} statements executed, ${errorCount} errors`);
            
            // 4. Save to localStorage
            console.log('💾 Saving to localStorage...');
            if (window.sqlDB && window.sqlDB.saveDatabase) {
                window.sqlDB.saveDatabase();
            }
            
            // 5. Verify the import
            console.log('🔍 Verifying import...');
            const result = window.sqlDB.db.exec("SELECT b.code, p.name FROM products p JOIN brands b ON p.brand_id = b.id WHERE b.code = 'AP' LIMIT 5");
            
            if (result && result.length > 0) {
                console.log('📊 Sample Aftenposten products:');
                result[0].values.forEach(row => {
                    const hasPrefix = row[1].includes('Aftenposten');
                    const status = hasPrefix ? '❌' : '✅';
                    console.log(`${status} ${row[0]}: ${row[1]}`);
                });
            }
            
            // 6. Final message
            console.log('\n✨ Import successful!');
            console.log('🔄 Now reload the page to see the changes.');
            console.log('Use Cmd+Shift+R (Mac) or Ctrl+Shift+R (PC) for hard refresh.');
            
            return true;
            
        } else {
            throw new Error('Database not initialized. Please reload the page and try again.');
        }
        
    } catch (error) {
        console.error('❌ Import failed:', error);
        return false;
    }
}

// Run the import
importCodexNovaData();