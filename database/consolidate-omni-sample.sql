-- ============================================================================
-- OMNI BRAND CONSOLIDATION FOR SAMPLE DATA
-- This updates the sample-data.sql to consolidate Omni brands
-- ============================================================================

-- First, remove the extra Omni brand entries from the brands table
-- Keep only the main 'OM' entry
DELETE FROM brands WHERE code IN ('OMB', 'OME', 'OMEB', 'OMMER', 'OMMERB', 'OMSP');

-- Ensure we have the shortcode column
ALTER TABLE products ADD COLUMN shortcode TEXT;

-- Update all Omni products to belong to the single OM brand
-- and add the appropriate shortcodes
UPDATE products 
SET brand_id = (SELECT id FROM brands WHERE code = 'OM'),
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
WHERE name LIKE 'Omni%';

-- Verify the consolidation
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