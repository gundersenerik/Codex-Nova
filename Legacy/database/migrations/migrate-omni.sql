-- ============================================================================
-- OMNI BRAND CONSOLIDATION MIGRATION
-- This script consolidates all Omni brands into a single brand
-- and assigns product-specific shortcodes
-- ============================================================================

-- Step 1: Add the shortcode column if it doesn't exist
-- (This will fail silently if the column already exists)
ALTER TABLE products ADD COLUMN shortcode TEXT;

-- Step 2: Create temporary mapping of old brand codes to product names
CREATE TEMPORARY TABLE omni_mapping AS
SELECT 
    'OM' as old_code, 'Omni annonsfritt' as product_name, 'OM' as shortcode
UNION SELECT 
    'OM' as old_code, 'Omni Bundle' as product_name, 'OM' as shortcode  
UNION SELECT
    'OMB' as old_code, 'Omni Bundle Bas' as product_name, 'OMB' as shortcode
UNION SELECT
    'OME' as old_code, 'Omni Ekonomi' as product_name, 'OME' as shortcode
UNION SELECT
    'OMEB' as old_code, 'Omni Ekonomi Bas' as product_name, 'OMEB' as shortcode
UNION SELECT
    'OMMER' as old_code, 'Omni Mer' as product_name, 'OMMER' as shortcode
UNION SELECT
    'OMMERB' as old_code, 'Omni Mer Bas' as product_name, 'OMMERB' as shortcode
UNION SELECT
    'OMSP' as old_code, 'Omni Superpaketet' as product_name, 'OMSP' as shortcode;

-- Step 3: Check if main Omni brand exists, if not create it
INSERT OR IGNORE INTO brands (code, name, country)
VALUES ('OM', 'Omni', 'SE');

-- Step 4: Get the main Omni brand ID
CREATE TEMPORARY TABLE omni_brand_id AS
SELECT id FROM brands WHERE code = 'OM' LIMIT 1;

-- Step 5: Create products for the main Omni brand if they don't exist
INSERT OR IGNORE INTO products (brand_id, name, type, shortcode)
SELECT 
    (SELECT id FROM omni_brand_id),
    m.product_name,
    'digital',
    m.shortcode
FROM omni_mapping m;

-- Step 6: Migrate rate plans from old Omni brands to new products
-- First, create a temporary table to map old product IDs to new product IDs
CREATE TEMPORARY TABLE product_migration_map AS
SELECT 
    old_p.id as old_product_id,
    new_p.id as new_product_id,
    old_b.code as old_brand_code,
    new_p.name as product_name
FROM brands old_b
JOIN products old_p ON old_p.brand_id = old_b.id
JOIN omni_mapping m ON old_b.code = m.old_code AND old_p.name = m.product_name
JOIN products new_p ON new_p.brand_id = (SELECT id FROM omni_brand_id) 
    AND new_p.name = m.product_name
WHERE old_b.code IN ('OMB', 'OME', 'OMEB', 'OMMER', 'OMMERB', 'OMSP');

-- Step 7: Migrate rate plans to new products
INSERT OR IGNORE INTO rate_plans (product_id, code, name, price, category, sort_order)
SELECT 
    pmm.new_product_id,
    rp.code,
    rp.name,
    rp.price,
    rp.category,
    rp.sort_order
FROM rate_plans rp
JOIN product_migration_map pmm ON rp.product_id = pmm.old_product_id;

-- Step 8: Delete rate plans from old products
DELETE FROM rate_plans 
WHERE product_id IN (SELECT old_product_id FROM product_migration_map);

-- Step 9: Delete old products
DELETE FROM products 
WHERE id IN (SELECT old_product_id FROM product_migration_map);

-- Step 10: Delete old Omni brands (except the main one)
DELETE FROM brands 
WHERE code IN ('OMB', 'OME', 'OMEB', 'OMMER', 'OMMERB', 'OMSP');

-- Step 11: Update any existing OM brand products with shortcodes if missing
UPDATE products 
SET shortcode = CASE 
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
WHERE brand_id = (SELECT id FROM brands WHERE code = 'OM')
AND shortcode IS NULL;

-- Clean up temporary tables
DROP TABLE IF EXISTS omni_mapping;
DROP TABLE IF EXISTS omni_brand_id;
DROP TABLE IF EXISTS product_migration_map;

-- Verify the migration
SELECT 
    b.code as brand_code,
    b.name as brand_name,
    p.name as product_name,
    p.shortcode,
    COUNT(rp.id) as rate_plan_count
FROM brands b
JOIN products p ON p.brand_id = b.id
LEFT JOIN rate_plans rp ON rp.product_id = p.id
WHERE b.code = 'OM'
GROUP BY b.code, b.name, p.name, p.shortcode
ORDER BY p.name;