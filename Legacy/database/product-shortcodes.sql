-- ============================================================================
-- PRODUCT SHORTCODE ASSIGNMENTS
-- Update all products with specific shortcodes
-- ============================================================================

-- Aftenposten (AP) Products
UPDATE products SET shortcode = 'APAM' WHERE name = 'Aftenposten A-magasinet';
UPDATE products SET shortcode = 'APDUO' WHERE name = 'Aftenposten Duo';
UPDATE products SET shortcode = 'APFT' WHERE name = 'Aftenposten Full Tilgang';
UPDATE products SET shortcode = 'APHELG' WHERE name = 'Aftenposten Helg';
UPDATE products SET shortcode = 'APSOLO' WHERE name = 'Aftenposten Solo';
UPDATE products SET shortcode = 'APUKE' WHERE name = 'Aftenposten Uke';

-- Bergens Tidende (BT) Products
UPDATE products SET shortcode = 'BTBAS' WHERE name = 'BT Basis';
UPDATE products SET shortcode = 'BTFAM' WHERE name = 'BT Familie';
UPDATE products SET shortcode = 'BTFT' WHERE name = 'BT Full tilgang';
UPDATE products SET shortcode = 'BTFTH' WHERE name = 'BT Full tilgang Helg';
UPDATE products SET shortcode = 'BTFTK' WHERE name = 'BT Full tilgang Komplett';
UPDATE products SET shortcode = 'BTHELG' WHERE name = 'BT Helg';
UPDATE products SET shortcode = 'BTKOMP' WHERE name = 'BT Komplett';
UPDATE products SET shortcode = 'BTMF' WHERE name = 'BT mandag til fredag';
UPDATE products SET shortcode = 'BTPREM' WHERE name = 'BT Premium';

-- E24 Products
UPDATE products SET shortcode = 'E24BAS' WHERE name = 'E24 Basis';
UPDATE products SET shortcode = 'E24FT' WHERE name = 'E24 Full tilgang';
UPDATE products SET shortcode = 'E24DP' WHERE name = 'E24 og Dine penger+';
UPDATE products SET shortcode = 'E24PRO' WHERE name = 'E24 Pro';
UPDATE products SET shortcode = 'E24ST' WHERE name = 'E24 sanntidskurser';
UPDATE products SET shortcode = 'E24UD' WHERE name = 'E24 uten deling';

-- Stavanger Aftenblad (SA) Products
UPDATE products SET shortcode = 'SABAS' WHERE name = 'Aftenbladet Basis';
UPDATE products SET shortcode = 'SAFAM' WHERE name = 'Aftenbladet Familie';
UPDATE products SET shortcode = 'SAFT' WHERE name = 'Aftenbladet Full tilgang';
UPDATE products SET shortcode = 'SAFTH' WHERE name = 'Aftenbladet Full tillgang Helg';
UPDATE products SET shortcode = 'SAFTK' WHERE name = 'Aftenbladet Full tillgang Komplett';
UPDATE products SET shortcode = 'SAHELG' WHERE name = 'Aftenbladet Helg';
UPDATE products SET shortcode = 'SAKOMP' WHERE name = 'Aftenbladet Komplett';
UPDATE products SET shortcode = 'SAMF' WHERE name = 'Aftenbladet mandag til fredag';
UPDATE products SET shortcode = 'SAPREM' WHERE name = 'Aftenbladet Premium';

-- VG Products
UPDATE products SET shortcode = 'VGEA' WHERE name = 'VG eavis';
UPDATE products SET shortcode = 'VGWHH' WHERE name = 'VG Weekend hele helgen';
UPDATE products SET shortcode = 'VGWFS' WHERE name = 'VG Weekend fredag-lørdag';
UPDATE products SET shortcode = 'VGWLS' WHERE name = 'VG Weekend lørdag-søndag';
UPDATE products SET shortcode = 'VGBAS' WHERE name = 'VG+ Basis';
UPDATE products SET shortcode = 'VGPLUS' WHERE name = 'VG+';
UPDATE products SET shortcode = 'VGDP' WHERE name = 'VG+ og Dine penger+';
UPDATE products SET shortcode = 'VGSPORT' WHERE name = 'VG+ Sport';
UPDATE products SET shortcode = 'VGTOT' WHERE name = 'VG+ Total';
UPDATE products SET shortcode = 'VGFT' WHERE name = 'VG+ Full tilgang';
UPDATE products SET shortcode = 'VGFLEX' WHERE name = 'VG+ Flex';
UPDATE products SET shortcode = 'VGPOD' WHERE name = 'VG+ og PodMe';
UPDATE products SET shortcode = 'VGMM' WHERE name = 'MinMote strikk';
UPDATE products SET shortcode = 'VGEAP' WHERE name = 'VG eAvis med VG+';
UPDATE products SET shortcode = 'VGDPP' WHERE name = 'Dine penger+';

-- Aftonbladet (AB) Products
UPDATE products SET shortcode = 'ABET' WHERE name = 'Aftonbladet e-tidning';
UPDATE products SET shortcode = 'ABPLUS' WHERE name = 'Aftonbladet Plus';
UPDATE products SET shortcode = 'ABPOD' WHERE name = 'Aftonbladet Plus & Podme';
UPDATE products SET shortcode = 'ABSUPER' WHERE name = 'Aftonbladet Superpaketet';
UPDATE products SET shortcode = 'ABHOCKEY' WHERE name = 'Plus & SvenskHockey.tv';

-- Svenska Dagbladet (SVD) Products
UPDATE products SET shortcode = 'SVDPREM' WHERE name = 'SvD digital premium';
UPDATE products SET shortcode = 'SVDSTD' WHERE name = 'SvD digital standard';
UPDATE products SET shortcode = 'SVDSTAD' WHERE name = 'SvD Superpaketet - tillägg alla dagar';
UPDATE products SET shortcode = 'SVDSTH' WHERE name = 'SvD Superpaketet - tillägg helg';
UPDATE products SET shortcode = 'SVDSTDP' WHERE name = 'SvD Superpaketet - tillägg digital premium';
UPDATE products SET shortcode = 'SVDVIN' WHERE name = 'SvD Vinklubb';
UPDATE products SET shortcode = 'SVDSUPER' WHERE name = 'SvD Superpaketet';

-- Omni Products (Keep existing shortcodes)
UPDATE products SET shortcode = 'OM' WHERE name = 'Omni annonsfritt';
UPDATE products SET shortcode = 'OM' WHERE name = 'Omni Bundle';
UPDATE products SET shortcode = 'OMB' WHERE name = 'Omni Bundle Bas';
UPDATE products SET shortcode = 'OME' WHERE name = 'Omni Ekonomi';
UPDATE products SET shortcode = 'OMEB' WHERE name = 'Omni Ekonomi Bas';
UPDATE products SET shortcode = 'OMMER' WHERE name = 'Omni Mer';
UPDATE products SET shortcode = 'OMMERB' WHERE name = 'Omni Mer Bas';
UPDATE products SET shortcode = 'OMSP' WHERE name = 'Omni Superpaketet';

-- Other Products
UPDATE products SET shortcode = 'R24' WHERE name = 'Randaberg24';

-- ============================================================================
-- VERIFICATION QUERY
-- Run this to see all products with their shortcodes
-- ============================================================================
SELECT 
    b.code as brand_code,
    b.name as brand_name,
    p.name as product_name,
    p.shortcode,
    p.type
FROM products p
JOIN brands b ON p.brand_id = b.id
ORDER BY b.code, p.name;