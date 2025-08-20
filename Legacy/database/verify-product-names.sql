-- Verify that products display WITHOUT brand prefixes
-- Run this in your browser console after clearing cache

SELECT 
    b.code as brand_code,
    b.name as brand_name,
    p.name as product_name,
    p.shortcode
FROM products p
JOIN brands b ON p.brand_id = b.id
WHERE b.code IN ('AP', 'BT', 'AB')
ORDER BY b.code, p.name
LIMIT 20;

-- Expected results:
-- AP | Aftenposten | Solo | SOLO  (NOT "Aftenposten Solo")
-- AP | Aftenposten | Basis | BAS   (NOT "Aftenposten Basis")
-- AP | Aftenposten | Duo | DUO     (NOT "Aftenposten Duo")
-- etc.