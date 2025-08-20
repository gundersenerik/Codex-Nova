# Product Name Issue - Investigation Results & Solution

## 🔍 Investigation Summary

### The Issue
You're seeing "Aftenposten Solo" instead of just "Solo" in the product dropdown.

### Root Cause
The application is still using the **OLD sample data** which has product names with brand prefixes.

## 📊 Current State vs Expected State

### Current (OLD sample-data.sql):
```sql
-- Products have brand prefix
'Aftenposten Solo'
'Aftenposten Duo'
'Aftenposten Full Tilgang'
'Bergens Tidende Basis'
```

### Expected (YOUR CSV data):
```sql
-- Products WITHOUT brand prefix
'Solo'
'Duo'
'Full Tilgang'
'Basis'
```

## ✅ The Solution

The import SQL (`codex-nova-import.sql`) is **CORRECT** and contains the right product names without prefixes. You just need to:

1. **Run the import** to replace old data
2. **Clear browser cache** to see the changes

## 🚀 Quick Fix Steps

### Option 1: Automated Script (Easiest)
```bash
# Make script executable
chmod +x database/clear-and-import.sh

# Run complete import with cache clearing
./database/clear-and-import.sh
```

### Option 2: Manual Steps

#### Step 1: Check Current State
```bash
# See what's currently in database
sqlite3 database/naming-standards.db < database/check-product-names.sql
```

#### Step 2: Run the Import
```bash
# Stop app
./start-dev.sh stop

# Import new data
sqlite3 database/naming-standards.db < database/codex-nova-import.sql

# Restart app
./start-dev.sh start
```

#### Step 3: Clear Browser Cache
1. Open http://localhost:4200
2. Open DevTools (F12)
3. Go to Console tab
4. Paste and run:
```javascript
// Clear all caches
localStorage.clear();
sessionStorage.clear();
location.reload(true);
```

Or use the complete script:
```javascript
// Copy entire contents of database/browser-clear-cache.js
```

#### Step 4: Hard Refresh
- Mac: `Cmd + Shift + R`
- PC: `Ctrl + Shift + R`

## 🔎 Verification

### Check in Browser Console:
```javascript
// This will show current product names
await window.database.fetchBrandProducts('AP').then(r => {
    r.data.forEach(p => console.log(p.name));
});
```

### Expected Output:
```
Solo              ✅ (not "Aftenposten Solo")
Duo               ✅ (not "Aftenposten Duo")
Full Tilgang      ✅ (not "Aftenposten Full Tilgang")
Basis             ✅ (not "Aftenposten Basis")
```

## 📝 Why This Happened

1. **Application startup**: Loads `/database/sample-data.sql`
2. **Sample data has**: Old format with brand prefixes
3. **Your CSV has**: New format without prefixes
4. **Import not run yet**: So you see old data

## 🎯 After Import

The product dropdown will show:
- ✅ "Solo" (not "Aftenposten Solo")
- ✅ "Duo" (not "Aftenposten Duo")  
- ✅ "Basis" (not "Aftenposten Basis")
- ✅ "Full Tilgang" (not "Aftenposten Full Tilgang")

## 💡 Additional Notes

### Products Using Brand Prefix as Shortcode
Some products in your CSV don't have a Product Prefix, so they use the Brand Prefix:
- Aftonbladet Plus → Uses "AB" as shortcode
- Some Omni products → Use "OMNI" as shortcode

This is **working as intended** based on your CSV data.

### UI Display Logic
The dropdown shows `product.name` directly - it does NOT concatenate brand + product names. The issue is purely the data that's currently loaded.

## 🆘 Troubleshooting

If products still show with brand prefixes after import:

1. **Check import ran successfully**:
   ```bash
   sqlite3 database/naming-standards.db "SELECT COUNT(*) FROM products;"
   # Should show: 86 or 87
   ```

2. **Force clear everything**:
   - Close all browser tabs
   - Clear browser cache completely (Settings → Clear browsing data)
   - Restart the application
   - Open in Incognito/Private window

3. **Verify correct database**:
   - Make sure you're importing to the right database file
   - Check the application is reading from the same database

## ✨ Summary

**Your import file is correct!** The product names in `codex-nova-import.sql` are exactly as you want them (without brand prefixes). You just need to run the import and clear the cache to see the changes.