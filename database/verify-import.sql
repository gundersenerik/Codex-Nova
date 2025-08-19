-- ============================================================================
-- CODEX NOVA IMPORT VERIFICATION
-- Run this after importing to verify the data
-- ============================================================================

-- 1. Summary counts
SELECT '=== SUMMARY ===' as report;
SELECT 'Brands' as entity, COUNT(*) as count FROM brands
UNION ALL
SELECT 'Products', COUNT(*) FROM products
UNION ALL
SELECT 'Rate Plans', COUNT(*) FROM rate_plans;

-- 2. Brands by country
SELECT '=== BRANDS BY COUNTRY ===' as report;
SELECT country, COUNT(*) as brand_count 
FROM brands 
GROUP BY country 
ORDER BY country;

-- 3. Products per brand
SELECT '=== PRODUCTS PER BRAND ===' as report;
SELECT 
    b.code as brand_code,
    b.name as brand_name,
    COUNT(p.id) as product_count
FROM brands b
LEFT JOIN products p ON p.brand_id = b.id
GROUP BY b.code, b.name
ORDER BY b.code;

-- 4. Products using brand prefix as fallback
SELECT '=== PRODUCTS USING FALLBACK PREFIX ===' as report;
SELECT 
    b.code as brand_code,
    p.name as product_name,
    p.shortcode
FROM products p
JOIN brands b ON p.brand_id = b.id
WHERE p.shortcode = b.code
ORDER BY b.code, p.name;

-- 5. Rate plans distribution
SELECT '=== RATE PLAN DISTRIBUTION ===' as report;
SELECT 
    rp.code,
    rp.name,
    COUNT(*) as product_count,
    MIN(rp.price) as min_price,
    MAX(rp.price) as max_price
FROM rate_plans rp
GROUP BY rp.code, rp.name
ORDER BY rp.code;

-- 6. Sample promocodes (first 10)
SELECT '=== SAMPLE PROMOCODES ===' as report;
SELECT 
    b.code || '-' || p.shortcode || '-' as promocode_start,
    b.name as brand,
    p.name as product
FROM products p
JOIN brands b ON p.brand_id = b.id
LIMIT 10;

-- 7. Products without rate plans
SELECT '=== PRODUCTS WITHOUT RATE PLANS ===' as report;
SELECT 
    b.code as brand_code,
    p.name as product_name
FROM products p
JOIN brands b ON p.brand_id = b.id
LEFT JOIN rate_plans rp ON rp.product_id = p.id
WHERE rp.id IS NULL
ORDER BY b.code, p.name;

-- 8. Duplicate product names across brands
SELECT '=== DUPLICATE PRODUCT NAMES ===' as report;
SELECT 
    p.name as product_name,
    GROUP_CONCAT(b.code, ', ') as brands
FROM products p
JOIN brands b ON p.brand_id = b.id
GROUP BY p.name
HAVING COUNT(DISTINCT b.id) > 1
ORDER BY COUNT(DISTINCT b.id) DESC, p.name;

-- 9. Rate plan price ranges by brand
SELECT '=== PRICE RANGES BY BRAND ===' as report;
SELECT 
    b.code as brand_code,
    b.name as brand_name,
    COUNT(DISTINCT rp.code) as rate_plan_types,
    MIN(rp.price) as min_price,
    MAX(rp.price) as max_price,
    ROUND(AVG(rp.price), 2) as avg_price
FROM brands b
JOIN products p ON p.brand_id = b.id
JOIN rate_plans rp ON rp.product_id = p.id
GROUP BY b.code, b.name
ORDER BY b.code;

-- 10. Final verification
SELECT '=== VERIFICATION COMPLETE ===' as report;
SELECT 
    CASE 
        WHEN (SELECT COUNT(*) FROM brands) > 0 
         AND (SELECT COUNT(*) FROM products) > 0 
         AND (SELECT COUNT(*) FROM rate_plans) > 0
        THEN '✅ Import appears successful!'
        ELSE '❌ Import may have issues - check counts above'
    END as status;