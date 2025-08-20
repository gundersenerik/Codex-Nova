// ============================================================================
// BROWSER CACHE CLEAR SCRIPT
// Run this in browser console after importing new data
// ============================================================================

console.log('🧹 Starting cache clear...');

// 1. Clear localStorage
localStorage.clear();
console.log('✅ localStorage cleared');

// 2. Clear sessionStorage
sessionStorage.clear();
console.log('✅ sessionStorage cleared');

// 3. Clear database cache if exists
if (window.database && window.database.clearCache) {
    window.database.clearCache();
    console.log('✅ Database cache cleared');
}

// 4. Clear IndexedDB (if used)
if (window.indexedDB) {
    indexedDB.databases().then(databases => {
        databases.forEach(db => {
            indexedDB.deleteDatabase(db.name);
            console.log(`✅ Deleted IndexedDB: ${db.name}`);
        });
    }).catch(e => console.log('IndexedDB not accessible'));
}

// 5. Check current products for Aftenposten
if (window.database && window.database.fetchBrandProducts) {
    window.database.fetchBrandProducts('AP').then(result => {
        console.log('\n📊 Current Aftenposten products:');
        if (result.data && result.data.length > 0) {
            result.data.forEach(product => {
                const hasPrefix = product.name.includes('Aftenposten');
                const status = hasPrefix ? '❌' : '✅';
                console.log(`${status} ${product.name}`);
            });
            
            const anyWithPrefix = result.data.some(p => p.name.includes('Aftenposten'));
            if (anyWithPrefix) {
                console.log('\n⚠️ Products still have brand prefixes!');
                console.log('Run the import: sqlite3 database/naming-standards.db < database/codex-nova-import.sql');
            } else {
                console.log('\n✅ Products are correctly named without brand prefixes!');
            }
        }
    });
}

console.log('\n🔄 Now reload the page with Cmd+Shift+R (Mac) or Ctrl+Shift+R (PC)');

// Return confirmation
'Cache cleared! Reload the page to see changes.';