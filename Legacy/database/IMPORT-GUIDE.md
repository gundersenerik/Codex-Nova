# Codex Nova Database Import Guide

## Overview

This guide explains how to completely replace your brands, products, and rate plans with data from your CSV file.

## Import Summary

Based on your CSV file:
- **12 Brands** (7 Norwegian, 5 Swedish)
- **86 Products** (unique across all brands)
- **266 Rate Plans** (prices for different subscription periods)

## Method 1: Using the HTML Import Tool (Easiest)

1. **Open the import tool:**
   ```bash
   open database/complete-import.html
   ```

2. **Upload your CSV file:**
   - Drag and drop your CSV file onto the upload area
   - Or click to browse and select the file

3. **Review the preview:**
   - Check the counts match your expectations
   - Review any warnings (products using fallback prefixes)
   - Preview the SQL that will be generated

4. **Download the SQL file:**
   - Click "Download SQL" to save the import file

5. **Execute the import:**
   - Run the SQL in your database (see Method 2, Step 2)

## Method 2: Command Line Import (Direct)

1. **Generate the SQL file:**
   ```bash
   cd "/Users/erik.gundersenschibsted.com/Documents/Codex Nova"
   node database/process-csv.js
   ```
   
   This creates: `database/codex-nova-import.sql`

2. **Execute the import:**
   ```bash
   # Stop the application first
   ./start-dev.sh stop
   
   # Run the import
   sqlite3 database/naming-standards.db < database/codex-nova-import.sql
   
   # Verify the import
   sqlite3 database/naming-standards.db < database/verify-import.sql
   
   # Restart the application
   ./start-dev.sh start
   ```

## Method 3: Manual Browser Import

1. **Open the application:**
   http://localhost:4200

2. **Open browser console** (F12 → Console)

3. **Run the import:**
   ```javascript
   // Load and execute the SQL file
   const response = await fetch('/database/codex-nova-import.sql');
   const sql = await response.text();
   
   // Execute the SQL
   await window.database.executeQuery(sql);
   
   console.log('Import complete!');
   ```

## What the Import Does

### Step 1: Backup
- Creates timestamped backup tables
- Preserves all existing data

### Step 2: Clear
- Deletes all rate plans
- Deletes all products
- Deletes all brands

### Step 3: Import
- Inserts 12 new brands with country codes
- Inserts 86 products with shortcodes
- Inserts 266 rate plans with prices

## Verification

After import, run these checks:

```sql
-- Check counts
SELECT 'Brands:', COUNT(*) FROM brands;
SELECT 'Products:', COUNT(*) FROM products;
SELECT 'Rate Plans:', COUNT(*) FROM rate_plans;

-- Check sample promocodes
SELECT b.code || '-' || p.shortcode || '-' as sample
FROM products p
JOIN brands b ON p.brand_id = b.id
LIMIT 5;
```

Expected results:
- Brands: 12
- Products: 86
- Rate Plans: 266

## Products Using Fallback Prefixes

These products don't have a specific Product Prefix and use their Brand Prefix:

### Aftonbladet (AB)
- Aftonbladet Plus → Uses `AB`

### Omni (OMNI)
- Multiple products use `OMNI`

### VG
- Several MinMote products use `VG`

### SVD
- SvD Junior and others use `SVD`

## Rollback (If Needed)

If something goes wrong, you can restore the backup:

```sql
-- Find your backup tables
.tables

-- Look for tables like:
-- brands_backup_1737000000000
-- products_backup_1737000000000
-- rate_plans_backup_1737000000000

-- Restore from backup
DELETE FROM rate_plans;
DELETE FROM products;
DELETE FROM brands;

INSERT INTO brands SELECT * FROM brands_backup_1737000000000;
INSERT INTO products SELECT * FROM products_backup_1737000000000;
INSERT INTO rate_plans SELECT * FROM rate_plans_backup_1737000000000;
```

## Testing the Import

1. **Go to Promocodes section**
2. **Select a brand** (e.g., Aftenposten)
3. **Select a product** (e.g., Solo)
4. **Generate a promocode**
5. **Verify format**: Should be `AP-SOLO-[offer]-[lifecycle]-[renewal]`

## Troubleshooting

### Import seems to run but no data appears
- Check if you're looking at the right database
- Verify the application has restarted
- Clear browser cache

### Products missing
- Check the CSV file has all expected rows
- Verify no duplicate product names within same brand
- Check for parsing errors in warnings

### Rate plans missing
- N/A values are skipped (this is normal)
- Check price values are numeric
- Verify rate plan columns are correctly named

## File Locations

- **Import SQL**: `/database/codex-nova-import.sql`
- **Processor Script**: `/database/process-csv.js`
- **HTML Tool**: `/database/complete-import.html`
- **Verification**: `/database/verify-import.sql`
- **Import Summary**: `/database/import-summary.json`

## Support

If you encounter issues:
1. Check the warnings in the import summary
2. Run the verification SQL
3. Check browser console for errors
4. Review the generated SQL file manually