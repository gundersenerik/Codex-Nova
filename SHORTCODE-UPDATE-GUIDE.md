# Product Shortcode Update Guide

## Overview
This guide explains how to update product shortcodes in the Naming Standards Hub application.

## Current Status
- Database already has a `shortcode` column in the `products` table
- Promocode logic updated to use product shortcodes (falls back to brand code if not set)
- Only Omni products currently have shortcodes assigned

## Method 1: Quick Update Using SQL Script (Recommended)

### Step 1: Stop the application
```bash
./start-dev.sh stop
```

### Step 2: Apply the shortcodes
```bash
# Option A: Use the pre-created script
sqlite3 database/naming-standards.db < database/product-shortcodes.sql

# Option B: Or apply directly in SQLite
sqlite3 database/naming-standards.db
```

### Step 3: Restart the application
```bash
./start-dev.sh start
```

## Method 2: Manual Update via Browser Console

1. Open the application at http://localhost:4200
2. Open browser Developer Tools (F12)
3. Go to Console tab
4. Run this code:

```javascript
// Update a specific product
await window.database.executeQuery(
    "UPDATE products SET shortcode = ? WHERE name = ?",
    ['VGPLUS', 'VG+']
);

// Verify the update
const result = await window.database.executeQuery(
    "SELECT * FROM products WHERE name = 'VG+'"
);
console.log(result);
```

## Method 3: Bulk Update from CSV

1. Edit the CSV file: `database/products-shortcodes.csv`
2. Import using this script:

```javascript
// In browser console
async function importShortcodesFromCSV() {
    const response = await fetch('/database/products-shortcodes.csv');
    const text = await response.text();
    const lines = text.split('\n');
    
    for (let i = 1; i < lines.length; i++) {
        const [brand_code, product_name, shortcode] = lines[i].split(',');
        if (product_name && shortcode) {
            await window.database.executeQuery(
                "UPDATE products SET shortcode = ? WHERE name = ?",
                [shortcode.trim(), product_name.trim()]
            );
        }
    }
    console.log('Import complete!');
}

await importShortcodesFromCSV();
```

## Method 4: Direct Database Edit

1. Install SQLite browser: https://sqlitebrowser.org/
2. Open the database file (location depends on your setup)
3. Edit the `products` table directly
4. Save and restart the application

## Shortcode Naming Convention

### Recommended Pattern:
- **Brand prefix** (2-3 letters): AP, VG, AB, etc.
- **Product identifier** (2-5 letters): PLUS, FT, BAS, etc.
- **Keep it short**: Maximum 8 characters total
- **No special characters**: Only A-Z and 0-9

### Examples:
- `VGPLUS` - VG+ standard subscription
- `APFT` - Aftenposten Full Tilgang
- `ABSUPER` - Aftonbladet Superpaketet
- `E24PRO` - E24 Professional

## Testing Your Changes

1. Go to the Promocodes section
2. Select a brand
3. Select a product
4. Check that the brand display shows the correct shortcode
5. Generate a promocode
6. Verify the shortcode appears at the beginning

## Troubleshooting

### Shortcode not appearing?
- Check browser console for warnings
- Verify the product has a shortcode in the database:
```sql
SELECT name, shortcode FROM products WHERE brand_id = (SELECT id FROM brands WHERE code = 'VG');
```

### Fallback to brand code?
- This is normal if no shortcode is set
- Check console for warning messages
- The system will use brand code as fallback

## Adding New Products

When adding new products, always include a shortcode:

```sql
INSERT INTO products (brand_id, name, type, shortcode) 
VALUES (
    (SELECT id FROM brands WHERE code = 'VG'),
    'VG+ New Product',
    'digital',
    'VGNEW'
);
```

## Best Practices

1. **Keep shortcodes unique** within the entire system
2. **Document changes** in this file or a changelog
3. **Test thoroughly** after bulk updates
4. **Backup database** before major changes:
```bash
cp database/naming-standards.db database/naming-standards.db.backup
```

## Current Shortcode Assignments

See `database/products-shortcodes.csv` for the complete list of all products and their assigned shortcodes.

## Questions?

- The shortcode appears at the beginning of every promocode
- Format: `[SHORTCODE]-[PRODUCT]-[OFFER]-[LIFECYCLE]-[RENEWAL]`
- Example: `VGPLUS-VGPLUS-3M199-HB-M249`