/* ============================================================================
   DATA MANAGER - Data persistence, backup/restore, and file operations
   ============================================================================ */

// Configuration
const DATA_MANAGER_CONFIG = {
    STORAGE_KEY: 'naming_standards_hub_db',
    BACKUP_KEY: 'naming_standards_hub_backup',
    AUTO_SAVE_INTERVAL: 30000, // 30 seconds
    MAX_BACKUPS: 5
};

// State
let autoSaveTimer = null;
let isAutoSaveEnabled = true;

// ============================================================================
// CORE PERSISTENCE FUNCTIONS
// ============================================================================

// Save current database state to localStorage
function saveDatabase() {
    try {
        if (!window.sqlDB.isReady()) {
            throw new Error('Database not initialized');
        }
        
        const result = window.sqlDB.saveToLocalStorage(DATA_MANAGER_CONFIG.STORAGE_KEY);
        if (result.error) {
            throw new Error(result.error);
        }
        
        // Save metadata
        const metadata = {
            savedAt: new Date().toISOString(),
            version: '1.0.0',
            stats: window.sqlDB.getStats().data || {}
        };
        localStorage.setItem(DATA_MANAGER_CONFIG.STORAGE_KEY + '_meta', JSON.stringify(metadata));
        
        console.log('💾 Database saved successfully');
        return { success: true, error: null };
        
    } catch (error) {
        console.error('❌ Failed to save database:', error);
        return { success: false, error: error.message };
    }
}

// Load database from localStorage
function loadDatabase() {
    try {
        const result = window.sqlDB.loadFromLocalStorage(DATA_MANAGER_CONFIG.STORAGE_KEY);
        if (result.error) {
            // No saved database found, use default schema
            console.log('📂 No saved database found, using default schema');
            return loadDefaultDatabase();
        }
        
        // Load metadata
        const metaData = localStorage.getItem(DATA_MANAGER_CONFIG.STORAGE_KEY + '_meta');
        let metadata = {};
        if (metaData) {
            try {
                metadata = JSON.parse(metaData);
            } catch (e) {
                console.warn('Failed to parse metadata');
            }
        }
        
        console.log('📂 Database loaded from localStorage', metadata);
        return { success: true, error: null, metadata };
        
    } catch (error) {
        console.error('❌ Failed to load database:', error);
        return { success: false, error: error.message };
    }
}

// Load default database (schema + sample data)
async function loadDefaultDatabase() {
    try {
        await window.sqlDB.loadSchema();
        console.log('📂 Default database loaded');
        return { success: true, error: null, isDefault: true };
    } catch (error) {
        console.error('❌ Failed to load default database:', error);
        return { success: false, error: error.message };
    }
}

// ============================================================================
// BACKUP MANAGEMENT
// ============================================================================

// Create backup of current database
function createBackup(name = null) {
    try {
        if (!window.sqlDB.isReady()) {
            throw new Error('Database not initialized');
        }
        
        const { data: dbData, error } = window.sqlDB.exportDatabase();
        if (error) {
            throw new Error(error);
        }
        
        const backup = {
            name: name || `Backup ${new Date().toLocaleString()}`,
            createdAt: new Date().toISOString(),
            data: Array.from(dbData), // Convert Uint8Array to regular array for JSON
            stats: window.sqlDB.getStats().data || {}
        };
        
        // Get existing backups
        let backups = getBackupList();
        
        // Add new backup
        backups.unshift(backup);
        
        // Keep only max backups
        if (backups.length > DATA_MANAGER_CONFIG.MAX_BACKUPS) {
            backups = backups.slice(0, DATA_MANAGER_CONFIG.MAX_BACKUPS);
        }
        
        // Save backups
        localStorage.setItem(DATA_MANAGER_CONFIG.BACKUP_KEY, JSON.stringify(backups));
        
        console.log('💾 Backup created:', backup.name);
        return { success: true, backup, error: null };
        
    } catch (error) {
        console.error('❌ Failed to create backup:', error);
        return { success: false, error: error.message };
    }
}

// Get list of available backups
function getBackupList() {
    try {
        const backupsData = localStorage.getItem(DATA_MANAGER_CONFIG.BACKUP_KEY);
        return backupsData ? JSON.parse(backupsData) : [];
    } catch (error) {
        console.warn('Failed to load backup list:', error);
        return [];
    }
}

// Restore from backup
function restoreFromBackup(backupIndex) {
    try {
        const backups = getBackupList();
        if (backupIndex < 0 || backupIndex >= backups.length) {
            throw new Error('Invalid backup index');
        }
        
        const backup = backups[backupIndex];
        const dbData = new Uint8Array(backup.data); // Convert back to Uint8Array
        
        const result = window.sqlDB.importDatabase(dbData);
        if (result.error) {
            throw new Error(result.error);
        }
        
        console.log('📂 Restored from backup:', backup.name);
        return { success: true, backup, error: null };
        
    } catch (error) {
        console.error('❌ Failed to restore backup:', error);
        return { success: false, error: error.message };
    }
}

// Delete backup
function deleteBackup(backupIndex) {
    try {
        let backups = getBackupList();
        if (backupIndex < 0 || backupIndex >= backups.length) {
            throw new Error('Invalid backup index');
        }
        
        const deletedBackup = backups.splice(backupIndex, 1)[0];
        localStorage.setItem(DATA_MANAGER_CONFIG.BACKUP_KEY, JSON.stringify(backups));
        
        console.log('🗑️ Backup deleted:', deletedBackup.name);
        return { success: true, deletedBackup, error: null };
        
    } catch (error) {
        console.error('❌ Failed to delete backup:', error);
        return { success: false, error: error.message };
    }
}

// Check if database exists in localStorage
function hasStoredDatabase() {
    return localStorage.getItem(DATA_MANAGER_CONFIG.STORAGE_KEY) !== null;
}

// ============================================================================
// FILE OPERATIONS
// ============================================================================

// Export database to downloadable file
function exportToFile(filename = null) {
    try {
        if (!window.sqlDB.isReady()) {
            throw new Error('Database not initialized');
        }
        
        const { data, error } = window.sqlDB.exportDatabase();
        if (error) {
            throw new Error(error);
        }
        
        // Create blob with SQLite database
        const blob = new Blob([data], { type: 'application/x-sqlite3' });
        
        // Generate filename
        const defaultFilename = `naming-standards-hub-${new Date().toISOString().split('T')[0]}.db`;
        const finalFilename = filename || defaultFilename;
        
        // Create download link
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = finalFilename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        console.log('📥 Database exported to file:', finalFilename);
        return { success: true, filename: finalFilename, error: null };
        
    } catch (error) {
        console.error('❌ Failed to export database:', error);
        return { success: false, error: error.message };
    }
}

// Import database from file
function importFromFile(file) {
    return new Promise((resolve) => {
        try {
            if (!file) {
                resolve({ success: false, error: 'No file provided' });
                return;
            }
            
            if (!file.name.endsWith('.db') && !file.name.endsWith('.sqlite') && !file.name.endsWith('.sqlite3')) {
                resolve({ success: false, error: 'Invalid file type. Please select a SQLite database file (.db, .sqlite, .sqlite3)' });
                return;
            }
            
            const reader = new FileReader();
            
            reader.onload = function(e) {
                try {
                    const arrayBuffer = e.target.result;
                    const data = new Uint8Array(arrayBuffer);
                    
                    const result = window.sqlDB.importDatabase(data);
                    if (result.error) {
                        resolve({ success: false, error: result.error });
                        return;
                    }
                    
                    console.log('📁 Database imported from file:', file.name);
                    resolve({ success: true, filename: file.name, error: null });
                    
                } catch (error) {
                    console.error('❌ Failed to process imported file:', error);
                    resolve({ success: false, error: error.message });
                }
            };
            
            reader.onerror = function() {
                resolve({ success: false, error: 'Failed to read file' });
            };
            
            reader.readAsArrayBuffer(file);
            
        } catch (error) {
            console.error('❌ Failed to import database:', error);
            resolve({ success: false, error: error.message });
        }
    });
}

// ============================================================================
// AUTO-SAVE FUNCTIONALITY
// ============================================================================

// Start auto-save timer
function startAutoSave() {
    if (autoSaveTimer) {
        clearInterval(autoSaveTimer);
    }
    
    if (!isAutoSaveEnabled) {
        return;
    }
    
    autoSaveTimer = setInterval(() => {
        if (window.sqlDB.isReady()) {
            saveDatabase();
        }
    }, DATA_MANAGER_CONFIG.AUTO_SAVE_INTERVAL);
    
    console.log('⏰ Auto-save started (every 30 seconds)');
}

// Stop auto-save timer
function stopAutoSave() {
    if (autoSaveTimer) {
        clearInterval(autoSaveTimer);
        autoSaveTimer = null;
    }
    console.log('⏹️ Auto-save stopped');
}

// Enable/disable auto-save
function setAutoSave(enabled) {
    isAutoSaveEnabled = enabled;
    if (enabled) {
        startAutoSave();
    } else {
        stopAutoSave();
    }
}

// ============================================================================
// DATA RESET AND CLEANUP
// ============================================================================

// Reset database to default state
async function resetToDefault() {
    try {
        // Create backup before reset
        createBackup('Before Reset');
        
        // Load default database
        const result = await loadDefaultDatabase();
        if (!result.success) {
            throw new Error(result.error);
        }
        
        // Save the fresh database
        saveDatabase();
        
        console.log('🔄 Database reset to default state');
        return { success: true, error: null };
        
    } catch (error) {
        console.error('❌ Failed to reset database:', error);
        return { success: false, error: error.message };
    }
}

// Clear all stored data
function clearAllData() {
    try {
        localStorage.removeItem(DATA_MANAGER_CONFIG.STORAGE_KEY);
        localStorage.removeItem(DATA_MANAGER_CONFIG.STORAGE_KEY + '_meta');
        localStorage.removeItem(DATA_MANAGER_CONFIG.BACKUP_KEY);
        
        console.log('🗑️ All stored data cleared');
        return { success: true, error: null };
        
    } catch (error) {
        console.error('❌ Failed to clear data:', error);
        return { success: false, error: error.message };
    }
}

// ============================================================================
// UTILITIES
// ============================================================================

// Get storage usage information
function getStorageInfo() {
    try {
        const dbData = localStorage.getItem(DATA_MANAGER_CONFIG.STORAGE_KEY);
        const metaData = localStorage.getItem(DATA_MANAGER_CONFIG.STORAGE_KEY + '_meta');
        const backupData = localStorage.getItem(DATA_MANAGER_CONFIG.BACKUP_KEY);
        
        const info = {
            database: {
                exists: !!dbData,
                size: dbData ? dbData.length : 0,
                sizeKB: dbData ? Math.round(dbData.length / 1024) : 0
            },
            metadata: {
                exists: !!metaData,
                size: metaData ? metaData.length : 0
            },
            backups: {
                count: getBackupList().length,
                size: backupData ? backupData.length : 0,
                sizeKB: backupData ? Math.round(backupData.length / 1024) : 0
            }
        };
        
        info.total = {
            size: info.database.size + info.metadata.size + info.backups.size,
            sizeKB: Math.round((info.database.size + info.metadata.size + info.backups.size) / 1024),
            sizeMB: Math.round((info.database.size + info.metadata.size + info.backups.size) / (1024 * 1024) * 100) / 100
        };
        
        return { data: info, error: null };
        
    } catch (error) {
        console.error('❌ Failed to get storage info:', error);
        return { data: null, error: error.message };
    }
}

// ============================================================================
// MAKE FUNCTIONS GLOBALLY AVAILABLE
// ============================================================================

// Export functions to global scope
window.dataManager = {
    // Core persistence
    save: saveDatabase,
    load: loadDatabase,
    loadDefault: loadDefaultDatabase,
    hasStoredDatabase,
    
    // Backup management
    createBackup,
    getBackups: getBackupList,
    restoreBackup: restoreFromBackup,
    deleteBackup,
    
    // File operations
    exportToFile,
    importFromFile,
    
    // Auto-save
    startAutoSave,
    stopAutoSave,
    setAutoSave,
    
    // Utilities
    reset: resetToDefault,
    clearAll: clearAllData,
    getStorageInfo,
    
    // Configuration
    config: DATA_MANAGER_CONFIG
};

console.log('Data manager loaded successfully');