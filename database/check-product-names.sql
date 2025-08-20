-- ============================================================================
-- DIAGNOSTIC: CHECK PRODUCT NAMES
-- This query shows current product names in the database
-- ============================================================================

-- 1. Show Aftenposten products (should be just "Solo", not "Aftenposten Solo")
SELECT '=== AFTENPOSTEN PRODUCTS ===' as check;
SELECT 
    b.code as brand_code,
    b.name as brand_name,
    p.name as product_name,
    p.shortcode,
    CASE 
        WHEN p.name LIKE '%Aftenposten%' THEN '❌ Has brand prefix (OLD DATA)'
        ELSE '✅ No brand prefix (NEW DATA)'
    END as status
FROM products p
JOIN brands b ON p.brand_id = b.id
WHERE b.code = 'AP'
ORDER BY p.name;

-- 2. Show all products with potential brand prefixes
SELECT '=== PRODUCTS WITH BRAND PREFIXES ===' as check;
SELECT 
    b.code,
    b.name as brand,
    p.name as product,
    CASE 
        WHEN p.name LIKE '%' || b.name || '%' THEN '❌ Contains brand name'
        ELSE '✅ Clean name'
    END as status
FROM products p
JOIN brands b ON p.brand_id = b.id
WHERE p.name LIKE '%' || b.name || '%'
ORDER BY b.code, p.name;

-- 3. Count summary
SELECT '=== SUMMARY ===' as check;
SELECT 
    COUNT(CASE WHEN p.name LIKE '%Aftenposten%' THEN 1 END) as products_with_aftenposten,
    COUNT(CASE WHEN p.name LIKE '%Bergens Tidende%' THEN 1 END) as products_with_bt,
    COUNT(CASE WHEN p.name LIKE '%Stavanger%' THEN 1 END) as products_with_sa,
    COUNT(CASE WHEN p.name LIKE '%VG%' AND b.code = 'VG' THEN 1 END) as products_with_vg,
    COUNT(*) as total_products
FROM products p
JOIN brands b ON p.brand_id = b.id;

-- 4. Expected vs Actual
SELECT '=== EXPECTED AFTER IMPORT ===' as check;
SELECT 'Aftenposten products should show:' as note;
SELECT '  - Solo (not Aftenposten Solo)' as example
UNION ALL SELECT '  - Duo (not Aftenposten Duo)'
UNION ALL SELECT '  - Basis (not Aftenposten Basis)'
UNION ALL SELECT '  - Full Tilgang (not Aftenposten Full Tilgang)';