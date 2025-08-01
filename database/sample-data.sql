-- ============================================================================
-- NAMING STANDARDS HUB - Sample Data
-- ============================================================================

-- Clear existing data
DELETE FROM rate_plans;
DELETE FROM products;
DELETE FROM brands;
DELETE FROM rate_plan_types;

-- ============================================================================
-- RATE PLAN TYPES - Standardized Plan Codes
-- ============================================================================
INSERT INTO rate_plan_types (code, name, category, sort_order) VALUES
('APP_3M', 'In-app 3 mån', 'app', 1),
('APP_6M', 'in-app 6 mån', 'app', 2),
('B2B_Y', 'B2B Year', 'business', 3),
('FO_Y', 'Företag År', 'business', 4),
('H', '6 months', 'standard', 5),
('HM', '6-month/month', 'standard', 6),
('M', 'Month', 'standard', 7),
('PUB_1500', 'Pub 1500', 'business', 8),
('PUB_2000', 'Pub 2000', 'business', 9),
('Q', 'Quarter', 'standard', 10),
('QM', 'quarter/month', 'standard', 11),
('SE_OS_H', 'Övriga Sverige Halvår', 'regional', 12),
('SE_OS_M', 'Övriga Sverige Månad', 'regional', 13),
('SE_OS_Q', 'Övriga Sverige Kvartal', 'regional', 14),
('SE_OS_Y', 'Övriga Sverige År', 'regional', 15),
('SE_ST_H', 'Sthlm Halvår', 'regional', 16),
('SE_ST_M', 'Sthlm Månad', 'regional', 17),
('SE_ST_Q', 'Sthlm Kvartal', 'regional', 18),
('SE_ST_Y', 'Sthlm År', 'regional', 19),
('W', 'Week', 'standard', 20),
('Y', 'Year', 'standard', 21),
('YM', 'Year/month', 'standard', 22);

-- ============================================================================
-- BRANDS - Norwegian & Swedish Media Companies
-- ============================================================================
INSERT INTO brands (code, name, country) VALUES
('AP', 'Aftenposten', 'NO'),
('BT', 'Bergens Tidende', 'NO'),
('E24', 'E24', 'NO'),
('R24', 'Randaberg24', 'NO'),
('SA', 'Stavanger Aftenblad', 'NO'),
('VG', 'Verdens Gang', 'NO'),
('PM', 'Podme', 'NO'),
('VK', 'VektKlubb', 'NO'),
('AB', 'Aftonbladet', 'SE'),
('SVD', 'Svenska Dagbladet', 'SE'),
('OM', 'Omni', 'SE'),
('OMB', 'Omni Bundle', 'SE'),
('OME', 'Omni Ekonomi', 'SE'),
('OMEB', 'Omni Ekonomi Bas', 'SE'),
('OMMER', 'Omni Mer', 'SE'),
('OMMERB', 'Omni Mer Bas', 'SE'),
('OMSP', 'Omni Superpaketet', 'SE'),
('W', 'Wellobe', 'SE');

-- ============================================================================
-- PRODUCTS - Using brand_id foreign key references
-- ============================================================================

INSERT INTO products (brand_id, name, type) 
SELECT id, 'Aftenposten A-magasinet', 'print' FROM brands WHERE code = 'AP';
INSERT INTO products (brand_id, name, type) 
SELECT id, 'Aftenposten Duo', 'digital' FROM brands WHERE code = 'AP';
INSERT INTO products (brand_id, name, type) 
SELECT id, 'Aftenposten Full Tilgang', 'digital' FROM brands WHERE code = 'AP';
INSERT INTO products (brand_id, name, type) 
SELECT id, 'Aftenposten Helg', 'print' FROM brands WHERE code = 'AP';
INSERT INTO products (brand_id, name, type) 
SELECT id, 'Aftenposten Solo', 'digital' FROM brands WHERE code = 'AP';
INSERT INTO products (brand_id, name, type) 
SELECT id, 'Aftenposten Uke', 'print' FROM brands WHERE code = 'AP';
INSERT INTO products (brand_id, name, type) 
SELECT id, 'BT Basis', 'digital' FROM brands WHERE code = 'BT';
INSERT INTO products (brand_id, name, type) 
SELECT id, 'BT Familie', 'digital' FROM brands WHERE code = 'BT';
INSERT INTO products (brand_id, name, type) 
SELECT id, 'BT Full tilgang', 'digital' FROM brands WHERE code = 'BT';
INSERT INTO products (brand_id, name, type) 
SELECT id, 'BT Full tilgang Helg', 'print' FROM brands WHERE code = 'BT';
INSERT INTO products (brand_id, name, type) 
SELECT id, 'BT Full tilgang Komplett', 'print' FROM brands WHERE code = 'BT';
INSERT INTO products (brand_id, name, type) 
SELECT id, 'BT Helg', 'print' FROM brands WHERE code = 'BT';
INSERT INTO products (brand_id, name, type) 
SELECT id, 'BT Komplett', 'print' FROM brands WHERE code = 'BT';
INSERT INTO products (brand_id, name, type) 
SELECT id, 'BT mandag til fredag', 'print' FROM brands WHERE code = 'BT';
INSERT INTO products (brand_id, name, type) 
SELECT id, 'BT Premium', 'digital' FROM brands WHERE code = 'BT';
INSERT INTO products (brand_id, name, type) 
SELECT id, 'E24 Basis', 'digital' FROM brands WHERE code = 'E24';
INSERT INTO products (brand_id, name, type) 
SELECT id, 'E24 Full tilgang', 'digital' FROM brands WHERE code = 'E24';
INSERT INTO products (brand_id, name, type) 
SELECT id, 'E24 og Dine penger+', 'digital' FROM brands WHERE code = 'E24';
INSERT INTO products (brand_id, name, type) 
SELECT id, 'E24 Pro', 'digital' FROM brands WHERE code = 'E24';
INSERT INTO products (brand_id, name, type) 
SELECT id, 'E24 sanntidskurser', 'digital' FROM brands WHERE code = 'E24';
INSERT INTO products (brand_id, name, type) 
SELECT id, 'E24 uten deling', 'digital' FROM brands WHERE code = 'E24';
INSERT INTO products (brand_id, name, type) 
SELECT id, 'Omni annonsfritt', 'digital' FROM brands WHERE code = 'OM';
INSERT INTO products (brand_id, name, type) 
SELECT id, 'Omni Bundle', 'digital' FROM brands WHERE code = 'OM';
INSERT INTO products (brand_id, name, type) 
SELECT id, 'Omni Bundle Bas', 'digital' FROM brands WHERE code = 'OMB';
INSERT INTO products (brand_id, name, type) 
SELECT id, 'Omni Ekonomi', 'digital' FROM brands WHERE code = 'OME';
INSERT INTO products (brand_id, name, type) 
SELECT id, 'Omni Ekonomi Bas', 'digital' FROM brands WHERE code = 'OMEB';
INSERT INTO products (brand_id, name, type) 
SELECT id, 'Omni Mer', 'digital' FROM brands WHERE code = 'OMMER';
INSERT INTO products (brand_id, name, type) 
SELECT id, 'Omni Mer Bas', 'digital' FROM brands WHERE code = 'OMMERB';
INSERT INTO products (brand_id, name, type) 
SELECT id, 'Omni Superpaketet', 'digital' FROM brands WHERE code = 'OMSP';
INSERT INTO products (brand_id, name, type) 
SELECT id, 'Randaberg24', 'digital' FROM brands WHERE code = 'R24';
INSERT INTO products (brand_id, name, type) 
SELECT id, 'Aftenbladet Basis', 'digital' FROM brands WHERE code = 'SA';
INSERT INTO products (brand_id, name, type) 
SELECT id, 'Aftenbladet Familie', 'digital' FROM brands WHERE code = 'SA';
INSERT INTO products (brand_id, name, type) 
SELECT id, 'Aftenbladet Full tilgang', 'digital' FROM brands WHERE code = 'SA';
INSERT INTO products (brand_id, name, type) 
SELECT id, 'Aftenbladet Full tillgang Helg', 'print' FROM brands WHERE code = 'SA';
INSERT INTO products (brand_id, name, type) 
SELECT id, 'Aftenbladet Full tillgang Komplett', 'print' FROM brands WHERE code = 'SA';
INSERT INTO products (brand_id, name, type) 
SELECT id, 'Aftenbladet Helg', 'print' FROM brands WHERE code = 'SA';
INSERT INTO products (brand_id, name, type) 
SELECT id, 'Aftenbladet Komplett', 'print' FROM brands WHERE code = 'SA';
INSERT INTO products (brand_id, name, type) 
SELECT id, 'Aftenbladet mandag til fredag', 'print' FROM brands WHERE code = 'SA';
INSERT INTO products (brand_id, name, type) 
SELECT id, 'Aftenbladet Premium', 'digital' FROM brands WHERE code = 'SA';
INSERT INTO products (brand_id, name, type) 
SELECT id, 'VG eavis', 'digital' FROM brands WHERE code = 'VG';
INSERT INTO products (brand_id, name, type) 
SELECT id, 'VG Weekend hele helgen', 'print' FROM brands WHERE code = 'VG';
INSERT INTO products (brand_id, name, type) 
SELECT id, 'VG Weekend fredag-lørdag', 'print' FROM brands WHERE code = 'VG';
INSERT INTO products (brand_id, name, type) 
SELECT id, 'VG Weekend lørdag-søndag', 'print' FROM brands WHERE code = 'VG';
INSERT INTO products (brand_id, name, type) 
SELECT id, 'VG+ Basis', 'digital' FROM brands WHERE code = 'VG';
INSERT INTO products (brand_id, name, type) 
SELECT id, 'VG+', 'digital' FROM brands WHERE code = 'VG';
INSERT INTO products (brand_id, name, type) 
SELECT id, 'VG+ og Dine penger+', 'digital' FROM brands WHERE code = 'VG';
INSERT INTO products (brand_id, name, type) 
SELECT id, 'VG+ Sport', 'digital' FROM brands WHERE code = 'VG';
INSERT INTO products (brand_id, name, type) 
SELECT id, 'VG+ Total', 'digital' FROM brands WHERE code = 'VG';
INSERT INTO products (brand_id, name, type) 
SELECT id, 'VG+ Full tilgang', 'digital' FROM brands WHERE code = 'VG';
INSERT INTO products (brand_id, name, type) 
SELECT id, 'VG+ Flex', 'digital' FROM brands WHERE code = 'VG';
INSERT INTO products (brand_id, name, type) 
SELECT id, 'VG+ og PodMe', 'digital' FROM brands WHERE code = 'VG';
INSERT INTO products (brand_id, name, type) 
SELECT id, 'MinMote strikk', 'digital' FROM brands WHERE code = 'VG';
INSERT INTO products (brand_id, name, type) 
SELECT id, 'VG eAvis med VG+', 'digital' FROM brands WHERE code = 'VG';
INSERT INTO products (brand_id, name, type) 
SELECT id, 'Dine penger+', 'digital' FROM brands WHERE code = 'VG';
INSERT INTO products (brand_id, name, type) 
SELECT id, 'Aftonbladet e-tidning', 'digital' FROM brands WHERE code = 'AB';
INSERT INTO products (brand_id, name, type) 
SELECT id, 'Aftonbladet Plus', 'digital' FROM brands WHERE code = 'AB';
INSERT INTO products (brand_id, name, type) 
SELECT id, 'Aftonbladet Plus & Podme', 'digital' FROM brands WHERE code = 'AB';
INSERT INTO products (brand_id, name, type) 
SELECT id, 'Aftonbladet Superpaketet', 'digital' FROM brands WHERE code = 'AB';
INSERT INTO products (brand_id, name, type) 
SELECT id, 'Plus & SvenskHockey.tv', 'digital' FROM brands WHERE code = 'AB';
INSERT INTO products (brand_id, name, type) 
SELECT id, 'SvD digital premium', 'digital' FROM brands WHERE code = 'SVD';
INSERT INTO products (brand_id, name, type) 
SELECT id, 'SvD digital standard', 'digital' FROM brands WHERE code = 'SVD';
INSERT INTO products (brand_id, name, type) 
SELECT id, 'SvD Superpaketet - tillägg alla dagar', 'digital' FROM brands WHERE code = 'SVD';
INSERT INTO products (brand_id, name, type) 
SELECT id, 'SvD Superpaketet - tillägg helg', 'digital' FROM brands WHERE code = 'SVD';
INSERT INTO products (brand_id, name, type) 
SELECT id, 'SvD Superpaketet - tillägg digital premium', 'digital' FROM brands WHERE code = 'SVD';
INSERT INTO products (brand_id, name, type) 
SELECT id, 'SvD Vinklubb', 'digital' FROM brands WHERE code = 'SVD';
INSERT INTO products (brand_id, name, type) 
SELECT id, 'SvD Superpaketet', 'digital' FROM brands WHERE code = 'SVD';
INSERT INTO products (brand_id, name, type) 
SELECT id, 'SvD digital premium SP', 'digital' FROM brands WHERE code = 'SVD';
INSERT INTO products (brand_id, name, type) 
SELECT id, 'SvD taltidning', 'digital' FROM brands WHERE code = 'SVD';
INSERT INTO products (brand_id, name, type) 
SELECT id, 'SvD taltidning - tillägg', 'digital' FROM brands WHERE code = 'SVD';
INSERT INTO products (brand_id, name, type) 
SELECT id, 'SvD digital standard & Podme', 'digital' FROM brands WHERE code = 'SVD';
INSERT INTO products (brand_id, name, type) 
SELECT id, 'SvD komplett alla dagar', 'print' FROM brands WHERE code = 'SVD';
INSERT INTO products (brand_id, name, type) 
SELECT id, 'SvD komplett helg', 'print' FROM brands WHERE code = 'SVD';
INSERT INTO products (brand_id, name, type) 
SELECT id, 'Svenska Dagbladet söndag', 'print' FROM brands WHERE code = 'SVD';
INSERT INTO products (brand_id, name, type) 
SELECT id, 'SvD komplett vardag', 'print' FROM brands WHERE code = 'SVD';
INSERT INTO products (brand_id, name, type) 
SELECT id, 'SvD komplett sexdagars', 'print' FROM brands WHERE code = 'SVD';
INSERT INTO products (brand_id, name, type) 
SELECT id, 'SvD komplett tredagars', 'print' FROM brands WHERE code = 'SVD';
INSERT INTO products (brand_id, name, type) 
SELECT id, 'Podme NO', 'digital' FROM brands WHERE code = 'PM';
INSERT INTO products (brand_id, name, type) 
SELECT id, 'Vektklubb', 'digital' FROM brands WHERE code = 'VK';
INSERT INTO products (brand_id, name, type) 
SELECT id, 'Wellobe', 'digital' FROM brands WHERE code = 'W';

-- ============================================================================
-- RATE PLANS - Complete data with proper foreign key references
-- ============================================================================

INSERT INTO rate_plans (product_id, code, name, price, category)
SELECT p.id, 'W', 'Rate Plan Week', 107, 'standard'
FROM products p
JOIN brands b ON p.brand_id = b.id
WHERE b.code = 'AP' AND p.name = 'Aftenposten A-magasinet';
INSERT INTO rate_plans (product_id, code, name, price, category)
SELECT p.id, 'M', 'Rate Plan Month', 499, 'standard'
FROM products p
JOIN brands b ON p.brand_id = b.id
WHERE b.code = 'AP' AND p.name = 'Aftenposten A-magasinet';
INSERT INTO rate_plans (product_id, code, name, price, category)
SELECT p.id, 'Q', 'Rate Plan Quarter', 1497, 'standard'
FROM products p
JOIN brands b ON p.brand_id = b.id
WHERE b.code = 'AP' AND p.name = 'Aftenposten A-magasinet';
INSERT INTO rate_plans (product_id, code, name, price, category)
SELECT p.id, 'H', 'Rate Plan 6 months', 2994, 'standard'
FROM products p
JOIN brands b ON p.brand_id = b.id
WHERE b.code = 'AP' AND p.name = 'Aftenposten A-magasinet';
INSERT INTO rate_plans (product_id, code, name, price, category)
SELECT p.id, 'Y', 'Rate Plan Year', 5988, 'standard'
FROM products p
JOIN brands b ON p.brand_id = b.id
WHERE b.code = 'AP' AND p.name = 'Aftenposten A-magasinet';
INSERT INTO rate_plans (product_id, code, name, price, category)
SELECT p.id, 'W', 'Rate Plan Week', 67, 'standard'
FROM products p
JOIN brands b ON p.brand_id = b.id
WHERE b.code = 'AP' AND p.name = 'Aftenposten Duo';
INSERT INTO rate_plans (product_id, code, name, price, category)
SELECT p.id, 'M', 'Rate Plan Month', 299, 'standard'
FROM products p
JOIN brands b ON p.brand_id = b.id
WHERE b.code = 'AP' AND p.name = 'Aftenposten Duo';
INSERT INTO rate_plans (product_id, code, name, price, category)
SELECT p.id, 'Q', 'Rate Plan Quarter', 897, 'standard'
FROM products p
JOIN brands b ON p.brand_id = b.id
WHERE b.code = 'AP' AND p.name = 'Aftenposten Duo';
INSERT INTO rate_plans (product_id, code, name, price, category)
SELECT p.id, 'H', 'Rate Plan 6 months', 1794, 'standard'
FROM products p
JOIN brands b ON p.brand_id = b.id
WHERE b.code = 'AP' AND p.name = 'Aftenposten Duo';
INSERT INTO rate_plans (product_id, code, name, price, category)
SELECT p.id, 'Y', 'Rate Plan Year', 3588, 'standard'
FROM products p
JOIN brands b ON p.brand_id = b.id
WHERE b.code = 'AP' AND p.name = 'Aftenposten Duo';
INSERT INTO rate_plans (product_id, code, name, price, category)
SELECT p.id, 'W', 'Rate Plan Week', 87, 'standard'
FROM products p
JOIN brands b ON p.brand_id = b.id
WHERE b.code = 'AP' AND p.name = 'Aftenposten Full Tilgang';
INSERT INTO rate_plans (product_id, code, name, price, category)
SELECT p.id, 'M', 'Rate Plan Month', 379, 'standard'
FROM products p
JOIN brands b ON p.brand_id = b.id
WHERE b.code = 'AP' AND p.name = 'Aftenposten Full Tilgang';
INSERT INTO rate_plans (product_id, code, name, price, category)
SELECT p.id, 'Q', 'Rate Plan Quarter', 1137, 'standard'
FROM products p
JOIN brands b ON p.brand_id = b.id
WHERE b.code = 'AP' AND p.name = 'Aftenposten Full Tilgang';
INSERT INTO rate_plans (product_id, code, name, price, category)
SELECT p.id, 'H', 'Rate Plan 6 months', 2274, 'standard'
FROM products p
JOIN brands b ON p.brand_id = b.id
WHERE b.code = 'AP' AND p.name = 'Aftenposten Full Tilgang';
INSERT INTO rate_plans (product_id, code, name, price, category)
SELECT p.id, 'Y', 'Rate Plan Year', 4548, 'standard'
FROM products p
JOIN brands b ON p.brand_id = b.id
WHERE b.code = 'AP' AND p.name = 'Aftenposten Full Tilgang';
INSERT INTO rate_plans (product_id, code, name, price, category)
SELECT p.id, 'W', 'Rate Plan Week', 123, 'standard'
FROM products p
JOIN brands b ON p.brand_id = b.id
WHERE b.code = 'AP' AND p.name = 'Aftenposten Helg';
INSERT INTO rate_plans (product_id, code, name, price, category)
SELECT p.id, 'M', 'Rate Plan Month', 569, 'standard'
FROM products p
JOIN brands b ON p.brand_id = b.id
WHERE b.code = 'AP' AND p.name = 'Aftenposten Helg';
INSERT INTO rate_plans (product_id, code, name, price, category)
SELECT p.id, 'Q', 'Rate Plan Quarter', 1707, 'standard'
FROM products p
JOIN brands b ON p.brand_id = b.id
WHERE b.code = 'AP' AND p.name = 'Aftenposten Helg';
INSERT INTO rate_plans (product_id, code, name, price, category)
SELECT p.id, 'H', 'Rate Plan 6 months', 3414, 'standard'
FROM products p
JOIN brands b ON p.brand_id = b.id
WHERE b.code = 'AP' AND p.name = 'Aftenposten Helg';
INSERT INTO rate_plans (product_id, code, name, price, category)
SELECT p.id, 'Y', 'Rate Plan Year', 6300, 'standard'
FROM products p
JOIN brands b ON p.brand_id = b.id
WHERE b.code = 'AP' AND p.name = 'Aftenposten Helg';
INSERT INTO rate_plans (product_id, code, name, price, category)
SELECT p.id, 'M', 'Rate Plan Month', 249, 'standard'
FROM products p
JOIN brands b ON p.brand_id = b.id
WHERE b.code = 'AP' AND p.name = 'Aftenposten Solo';
INSERT INTO rate_plans (product_id, code, name, price, category)
SELECT p.id, 'Q', 'Rate Plan Quarter', 747, 'standard'
FROM products p
JOIN brands b ON p.brand_id = b.id
WHERE b.code = 'AP' AND p.name = 'Aftenposten Solo';
INSERT INTO rate_plans (product_id, code, name, price, category)
SELECT p.id, 'H', 'Rate Plan 6 months', 1494, 'standard'
FROM products p
JOIN brands b ON p.brand_id = b.id
WHERE b.code = 'AP' AND p.name = 'Aftenposten Solo';
INSERT INTO rate_plans (product_id, code, name, price, category)
SELECT p.id, 'Y', 'Rate Plan Year', 2988, 'standard'
FROM products p
JOIN brands b ON p.brand_id = b.id
WHERE b.code = 'AP' AND p.name = 'Aftenposten Solo';
INSERT INTO rate_plans (product_id, code, name, price, category)
SELECT p.id, 'W', 'Rate Plan Week', 165, 'standard'
FROM products p
JOIN brands b ON p.brand_id = b.id
WHERE b.code = 'AP' AND p.name = 'Aftenposten Uke';
INSERT INTO rate_plans (product_id, code, name, price, category)
SELECT p.id, 'M', 'Rate Plan Month', 769, 'standard'
FROM products p
JOIN brands b ON p.brand_id = b.id
WHERE b.code = 'AP' AND p.name = 'Aftenposten Uke';
INSERT INTO rate_plans (product_id, code, name, price, category)
SELECT p.id, 'Q', 'Rate Plan Quarter', 2307, 'standard'
FROM products p
JOIN brands b ON p.brand_id = b.id
WHERE b.code = 'AP' AND p.name = 'Aftenposten Uke';
INSERT INTO rate_plans (product_id, code, name, price, category)
SELECT p.id, 'H', 'Rate Plan 6 months', 4614, 'standard'
FROM products p
JOIN brands b ON p.brand_id = b.id
WHERE b.code = 'AP' AND p.name = 'Aftenposten Uke';
INSERT INTO rate_plans (product_id, code, name, price, category)
SELECT p.id, 'Y', 'Rate Plan Year', 9228, 'standard'
FROM products p
JOIN brands b ON p.brand_id = b.id
WHERE b.code = 'AP' AND p.name = 'Aftenposten Uke';
INSERT INTO rate_plans (product_id, code, name, price, category)
SELECT p.id, 'W', 'Rate Plan Week', 54, 'standard'
FROM products p
JOIN brands b ON p.brand_id = b.id
WHERE b.code = 'BT' AND p.name = 'BT Basis';
INSERT INTO rate_plans (product_id, code, name, price, category)
SELECT p.id, 'M', 'Rate Plan Month', 229, 'standard'
FROM products p
JOIN brands b ON p.brand_id = b.id
WHERE b.code = 'BT' AND p.name = 'BT Basis';
INSERT INTO rate_plans (product_id, code, name, price, category)
SELECT p.id, 'Q', 'Rate Plan Quarter', 687, 'standard'
FROM products p
JOIN brands b ON p.brand_id = b.id
WHERE b.code = 'BT' AND p.name = 'BT Basis';
INSERT INTO rate_plans (product_id, code, name, price, category)
SELECT p.id, 'H', 'Rate Plan 6 months', 1374, 'standard'
FROM products p
JOIN brands b ON p.brand_id = b.id
WHERE b.code = 'BT' AND p.name = 'BT Basis';
INSERT INTO rate_plans (product_id, code, name, price, category)
SELECT p.id, 'Y', 'Rate Plan Year', 2748, 'standard'
FROM products p
JOIN brands b ON p.brand_id = b.id
WHERE b.code = 'BT' AND p.name = 'BT Basis';
INSERT INTO rate_plans (product_id, code, name, price, category)
SELECT p.id, 'M', 'Rate Plan Month', 349, 'standard'
FROM products p
JOIN brands b ON p.brand_id = b.id
WHERE b.code = 'BT' AND p.name = 'BT Familie';
INSERT INTO rate_plans (product_id, code, name, price, category)
SELECT p.id, 'Q', 'Rate Plan Quarter', 1047, 'standard'
FROM products p
JOIN brands b ON p.brand_id = b.id
WHERE b.code = 'BT' AND p.name = 'BT Familie';
INSERT INTO rate_plans (product_id, code, name, price, category)
SELECT p.id, 'H', 'Rate Plan 6 months', 2094, 'standard'
FROM products p
JOIN brands b ON p.brand_id = b.id
WHERE b.code = 'BT' AND p.name = 'BT Familie';
INSERT INTO rate_plans (product_id, code, name, price, category)
SELECT p.id, 'Y', 'Rate Plan Year', 4188, 'standard'
FROM products p
JOIN brands b ON p.brand_id = b.id
WHERE b.code = 'BT' AND p.name = 'BT Familie';
INSERT INTO rate_plans (product_id, code, name, price, category)
SELECT p.id, 'W', 'Rate Plan Week', 87, 'standard'
FROM products p
JOIN brands b ON p.brand_id = b.id
WHERE b.code = 'BT' AND p.name = 'BT Full tilgang';
INSERT INTO rate_plans (product_id, code, name, price, category)
SELECT p.id, 'M', 'Rate Plan Month', 379, 'standard'
FROM products p
JOIN brands b ON p.brand_id = b.id
WHERE b.code = 'BT' AND p.name = 'BT Full tilgang';
INSERT INTO rate_plans (product_id, code, name, price, category)
SELECT p.id, 'Q', 'Rate Plan Quarter', 1137, 'standard'
FROM products p
JOIN brands b ON p.brand_id = b.id
WHERE b.code = 'BT' AND p.name = 'BT Full tilgang';
INSERT INTO rate_plans (product_id, code, name, price, category)
SELECT p.id, 'H', 'Rate Plan 6 months', 2274, 'standard'
FROM products p
JOIN brands b ON p.brand_id = b.id
WHERE b.code = 'BT' AND p.name = 'BT Full tilgang';
INSERT INTO rate_plans (product_id, code, name, price, category)
SELECT p.id, 'Y', 'Rate Plan Year', 4548, 'standard'
FROM products p
JOIN brands b ON p.brand_id = b.id
WHERE b.code = 'BT' AND p.name = 'BT Full tilgang';
INSERT INTO rate_plans (product_id, code, name, price, category)
SELECT p.id, 'M', 'Rate Plan Month', 568, 'standard'
FROM products p
JOIN brands b ON p.brand_id = b.id
WHERE b.code = 'BT' AND p.name = 'BT Full tilgang Helg';
INSERT INTO rate_plans (product_id, code, name, price, category)
SELECT p.id, 'Q', 'Rate Plan Quarter', 1674, 'standard'
FROM products p
JOIN brands b ON p.brand_id = b.id
WHERE b.code = 'BT' AND p.name = 'BT Full tilgang Helg';
INSERT INTO rate_plans (product_id, code, name, price, category)
SELECT p.id, 'H', 'Rate Plan 6 months', 3348, 'standard'
FROM products p
JOIN brands b ON p.brand_id = b.id
WHERE b.code = 'BT' AND p.name = 'BT Full tilgang Helg';
INSERT INTO rate_plans (product_id, code, name, price, category)
SELECT p.id, 'Y', 'Rate Plan Year', 6696, 'standard'
FROM products p
JOIN brands b ON p.brand_id = b.id
WHERE b.code = 'BT' AND p.name = 'BT Full tilgang Helg';
INSERT INTO rate_plans (product_id, code, name, price, category)
SELECT p.id, 'M', 'Rate Plan Month', 758, 'standard'
FROM products p
JOIN brands b ON p.brand_id = b.id
WHERE b.code = 'BT' AND p.name = 'BT Full tilgang Komplett';
INSERT INTO rate_plans (product_id, code, name, price, category)
SELECT p.id, 'Q', 'Rate Plan Quarter', 2274, 'standard'
FROM products p
JOIN brands b ON p.brand_id = b.id
WHERE b.code = 'BT' AND p.name = 'BT Full tilgang Komplett';
INSERT INTO rate_plans (product_id, code, name, price, category)
SELECT p.id, 'H', 'Rate Plan 6 months', 4548, 'standard'
FROM products p
JOIN brands b ON p.brand_id = b.id
WHERE b.code = 'BT' AND p.name = 'BT Full tilgang Komplett';
INSERT INTO rate_plans (product_id, code, name, price, category)
SELECT p.id, 'Y', 'Rate Plan Year', 9096, 'standard'
FROM products p
JOIN brands b ON p.brand_id = b.id
WHERE b.code = 'BT' AND p.name = 'BT Full tilgang Komplett';
INSERT INTO rate_plans (product_id, code, name, price, category)
SELECT p.id, 'W', 'Rate Plan Week', 113, 'standard'
FROM products p
JOIN brands b ON p.brand_id = b.id
WHERE b.code = 'BT' AND p.name = 'BT Helg';
INSERT INTO rate_plans (product_id, code, name, price, category)
SELECT p.id, 'M', 'Rate Plan Month', 489, 'standard'
FROM products p
JOIN brands b ON p.brand_id = b.id
WHERE b.code = 'BT' AND p.name = 'BT Helg';
INSERT INTO rate_plans (product_id, code, name, price, category)
SELECT p.id, 'Q', 'Rate Plan Quarter', 1467, 'standard'
FROM products p
JOIN brands b ON p.brand_id = b.id
WHERE b.code = 'BT' AND p.name = 'BT Helg';
INSERT INTO rate_plans (product_id, code, name, price, category)
SELECT p.id, 'H', 'Rate Plan 6 months', 2934, 'standard'
FROM products p
JOIN brands b ON p.brand_id = b.id
WHERE b.code = 'BT' AND p.name = 'BT Helg';
INSERT INTO rate_plans (product_id, code, name, price, category)
SELECT p.id, 'Y', 'Rate Plan Year', 5868, 'standard'
FROM products p
JOIN brands b ON p.brand_id = b.id
WHERE b.code = 'BT' AND p.name = 'BT Helg';
INSERT INTO rate_plans (product_id, code, name, price, category)
SELECT p.id, 'M', 'Rate Plan Month', 689, 'standard'
FROM products p
JOIN brands b ON p.brand_id = b.id
WHERE b.code = 'BT' AND p.name = 'BT Komplett';
INSERT INTO rate_plans (product_id, code, name, price, category)
SELECT p.id, 'Q', 'Rate Plan Quarter', 2067, 'standard'
FROM products p
JOIN brands b ON p.brand_id = b.id
WHERE b.code = 'BT' AND p.name = 'BT Komplett';
INSERT INTO rate_plans (product_id, code, name, price, category)
SELECT p.id, 'H', 'Rate Plan 6 months', 4134, 'standard'
FROM products p
JOIN brands b ON p.brand_id = b.id
WHERE b.code = 'BT' AND p.name = 'BT Komplett';
INSERT INTO rate_plans (product_id, code, name, price, category)
SELECT p.id, 'Y', 'Rate Plan Year', 8268, 'standard'
FROM products p
JOIN brands b ON p.brand_id = b.id
WHERE b.code = 'BT' AND p.name = 'BT Komplett';
INSERT INTO rate_plans (product_id, code, name, price, category)
SELECT p.id, 'M', 'Rate Plan Month', 689, 'standard'
FROM products p
JOIN brands b ON p.brand_id = b.id
WHERE b.code = 'BT' AND p.name = 'BT mandag til fredag';
INSERT INTO rate_plans (product_id, code, name, price, category)
SELECT p.id, 'Q', 'Rate Plan Quarter', 2067, 'standard'
FROM products p
JOIN brands b ON p.brand_id = b.id
WHERE b.code = 'BT' AND p.name = 'BT mandag til fredag';
INSERT INTO rate_plans (product_id, code, name, price, category)
SELECT p.id, 'H', 'Rate Plan 6 months', 4134, 'standard'
FROM products p
JOIN brands b ON p.brand_id = b.id
WHERE b.code = 'BT' AND p.name = 'BT mandag til fredag';
INSERT INTO rate_plans (product_id, code, name, price, category)
SELECT p.id, 'Y', 'Rate Plan Year', 8268, 'standard'
FROM products p
JOIN brands b ON p.brand_id = b.id
WHERE b.code = 'BT' AND p.name = 'BT mandag til fredag';
INSERT INTO rate_plans (product_id, code, name, price, category)
SELECT p.id, 'W', 'Rate Plan Week', 66, 'standard'
FROM products p
JOIN brands b ON p.brand_id = b.id
WHERE b.code = 'BT' AND p.name = 'BT Premium';
INSERT INTO rate_plans (product_id, code, name, price, category)
SELECT p.id, 'M', 'Rate Plan Month', 299, 'standard'
FROM products p
JOIN brands b ON p.brand_id = b.id
WHERE b.code = 'BT' AND p.name = 'BT Premium';
INSERT INTO rate_plans (product_id, code, name, price, category)
SELECT p.id, 'Q', 'Rate Plan Quarter', 897, 'standard'
FROM products p
JOIN brands b ON p.brand_id = b.id
WHERE b.code = 'BT' AND p.name = 'BT Premium';
INSERT INTO rate_plans (product_id, code, name, price, category)
SELECT p.id, 'H', 'Rate Plan 6 months', 1794, 'standard'
FROM products p
JOIN brands b ON p.brand_id = b.id
WHERE b.code = 'BT' AND p.name = 'BT Premium';
INSERT INTO rate_plans (product_id, code, name, price, category)
SELECT p.id, 'Y', 'Rate Plan Year', 3588, 'standard'
FROM products p
JOIN brands b ON p.brand_id = b.id
WHERE b.code = 'BT' AND p.name = 'BT Premium';
INSERT INTO rate_plans (product_id, code, name, price, category)
SELECT p.id, 'M', 'Rate Plan Month', 199, 'standard'
FROM products p
JOIN brands b ON p.brand_id = b.id
WHERE b.code = 'E24' AND p.name = 'E24 Basis';
INSERT INTO rate_plans (product_id, code, name, price, category)
SELECT p.id, 'M', 'Rate Plan Month', 379, 'standard'
FROM products p
JOIN brands b ON p.brand_id = b.id
WHERE b.code = 'E24' AND p.name = 'E24 Full tilgang';
INSERT INTO rate_plans (product_id, code, name, price, category)
SELECT p.id, 'Y', 'Rate Plan Year', 4548, 'standard'
FROM products p
JOIN brands b ON p.brand_id = b.id
WHERE b.code = 'E24' AND p.name = 'E24 Full tilgang';
INSERT INTO rate_plans (product_id, code, name, price, category)
SELECT p.id, 'M', 'Rate Plan Month', 269, 'standard'
FROM products p
JOIN brands b ON p.brand_id = b.id
WHERE b.code = 'E24' AND p.name = 'E24 og Dine penger+';
INSERT INTO rate_plans (product_id, code, name, price, category)
SELECT p.id, 'Y', 'Rate Plan Year', 2628, 'standard'
FROM products p
JOIN brands b ON p.brand_id = b.id
WHERE b.code = 'E24' AND p.name = 'E24 og Dine penger+';
INSERT INTO rate_plans (product_id, code, name, price, category)
SELECT p.id, 'M', 'Rate Plan Month', 249, 'standard'
FROM products p
JOIN brands b ON p.brand_id = b.id
WHERE b.code = 'E24' AND p.name = 'E24 Pro';
INSERT INTO rate_plans (product_id, code, name, price, category)
SELECT p.id, 'Y', 'Rate Plan Year', 1999, 'standard'
FROM products p
JOIN brands b ON p.brand_id = b.id
WHERE b.code = 'E24' AND p.name = 'E24 Pro';
INSERT INTO rate_plans (product_id, code, name, price, category)
SELECT p.id, 'M', 'Rate Plan Month', 0, 'standard'
FROM products p
JOIN brands b ON p.brand_id = b.id
WHERE b.code = 'E24' AND p.name = 'E24 sanntidskurser';
INSERT INTO rate_plans (product_id, code, name, price, category)
SELECT p.id, 'M', 'Rate Plan Month', 198, 'standard'
FROM products p
JOIN brands b ON p.brand_id = b.id
WHERE b.code = 'E24' AND p.name = 'E24 uten deling';
INSERT INTO rate_plans (product_id, code, name, price, category)
SELECT p.id, 'M', 'Rate Plan Month', 29, 'standard'
FROM products p
JOIN brands b ON p.brand_id = b.id
WHERE b.code = 'OM' AND p.name = 'Omni annonsfritt';
INSERT INTO rate_plans (product_id, code, name, price, category)
SELECT p.id, 'M', 'Rate Plan Month', 249, 'standard'
FROM products p
JOIN brands b ON p.brand_id = b.id
WHERE b.code = 'OM' AND p.name = 'Omni Bundle';
INSERT INTO rate_plans (product_id, code, name, price, category)
SELECT p.id, 'YM', 'Rate Plan Year/month', 199, 'standard'
FROM products p
JOIN brands b ON p.brand_id = b.id
WHERE b.code = 'OM' AND p.name = 'Omni Bundle';
INSERT INTO rate_plans (product_id, code, name, price, category)
SELECT p.id, 'M', 'Rate Plan Month', 199, 'standard'
FROM products p
JOIN brands b ON p.brand_id = b.id
WHERE b.code = 'OMB' AND p.name = 'Omni Bundle Bas';
INSERT INTO rate_plans (product_id, code, name, price, category)
SELECT p.id, 'YM', 'Rate Plan Year/month', 159, 'standard'
FROM products p
JOIN brands b ON p.brand_id = b.id
WHERE b.code = 'OMB' AND p.name = 'Omni Bundle Bas';
INSERT INTO rate_plans (product_id, code, name, price, category)
SELECT p.id, 'M', 'Rate Plan Month', 189, 'standard'
FROM products p
JOIN brands b ON p.brand_id = b.id
WHERE b.code = 'OME' AND p.name = 'Omni Ekonomi';
INSERT INTO rate_plans (product_id, code, name, price, category)
SELECT p.id, 'YM', 'Rate Plan Year/month', 159, 'standard'
FROM products p
JOIN brands b ON p.brand_id = b.id
WHERE b.code = 'OME' AND p.name = 'Omni Ekonomi';
INSERT INTO rate_plans (product_id, code, name, price, category)
SELECT p.id, 'M', 'Rate Plan Month', 179, 'standard'
FROM products p
JOIN brands b ON p.brand_id = b.id
WHERE b.code = 'OMEB' AND p.name = 'Omni Ekonomi Bas';
INSERT INTO rate_plans (product_id, code, name, price, category)
SELECT p.id, 'YM', 'Rate Plan Year/month', 149, 'standard'
FROM products p
JOIN brands b ON p.brand_id = b.id
WHERE b.code = 'OMEB' AND p.name = 'Omni Ekonomi Bas';
INSERT INTO rate_plans (product_id, code, name, price, category)
SELECT p.id, 'M', 'Rate Plan Month', 139, 'standard'
FROM products p
JOIN brands b ON p.brand_id = b.id
WHERE b.code = 'OMMER' AND p.name = 'Omni Mer';
INSERT INTO rate_plans (product_id, code, name, price, category)
SELECT p.id, 'Y', 'Rate Plan Year', 1188, 'standard'
FROM products p
JOIN brands b ON p.brand_id = b.id
WHERE b.code = 'OMMER' AND p.name = 'Omni Mer';
INSERT INTO rate_plans (product_id, code, name, price, category)
SELECT p.id, 'YM', 'Rate Plan Year/month', 99, 'standard'
FROM products p
JOIN brands b ON p.brand_id = b.id
WHERE b.code = 'OMMER' AND p.name = 'Omni Mer';
INSERT INTO rate_plans (product_id, code, name, price, category)
SELECT p.id, 'W', 'Rate Plan Week', 29, 'standard'
FROM products p
JOIN brands b ON p.brand_id = b.id
WHERE b.code = 'OMMERB' AND p.name = 'Omni Mer Bas';
INSERT INTO rate_plans (product_id, code, name, price, category)
SELECT p.id, 'M', 'Rate Plan Month', 119, 'standard'
FROM products p
JOIN brands b ON p.brand_id = b.id
WHERE b.code = 'OMMERB' AND p.name = 'Omni Mer Bas';
INSERT INTO rate_plans (product_id, code, name, price, category)
SELECT p.id, 'Y', 'Rate Plan Year', 948, 'standard'
FROM products p
JOIN brands b ON p.brand_id = b.id
WHERE b.code = 'OMMERB' AND p.name = 'Omni Mer Bas';
INSERT INTO rate_plans (product_id, code, name, price, category)
SELECT p.id, 'YM', 'Rate Plan Year/month', 79, 'standard'
FROM products p
JOIN brands b ON p.brand_id = b.id
WHERE b.code = 'OMMERB' AND p.name = 'Omni Mer Bas';
INSERT INTO rate_plans (product_id, code, name, price, category)
SELECT p.id, 'M', 'Rate Plan Month', 299, 'standard'
FROM products p
JOIN brands b ON p.brand_id = b.id
WHERE b.code = 'OMSP' AND p.name = 'Omni Superpaketet';
INSERT INTO rate_plans (product_id, code, name, price, category)
SELECT p.id, 'YM', 'Rate Plan Year/month', 269, 'standard'
FROM products p
JOIN brands b ON p.brand_id = b.id
WHERE b.code = 'OMSP' AND p.name = 'Omni Superpaketet';
INSERT INTO rate_plans (product_id, code, name, price, category)
SELECT p.id, 'M', 'Rate Plan Month', 99, 'standard'
FROM products p
JOIN brands b ON p.brand_id = b.id
WHERE b.code = 'R24' AND p.name = 'Randaberg24';
INSERT INTO rate_plans (product_id, code, name, price, category)
SELECT p.id, 'Y', 'Rate Plan Year', 1188, 'standard'
FROM products p
JOIN brands b ON p.brand_id = b.id
WHERE b.code = 'R24' AND p.name = 'Randaberg24';
INSERT INTO rate_plans (product_id, code, name, price, category)
SELECT p.id, 'W', 'Rate Plan Week', 54, 'standard'
FROM products p
JOIN brands b ON p.brand_id = b.id
WHERE b.code = 'SA' AND p.name = 'Aftenbladet Basis';
INSERT INTO rate_plans (product_id, code, name, price, category)
SELECT p.id, 'M', 'Rate Plan Month', 229, 'standard'
FROM products p
JOIN brands b ON p.brand_id = b.id
WHERE b.code = 'SA' AND p.name = 'Aftenbladet Basis';
INSERT INTO rate_plans (product_id, code, name, price, category)
SELECT p.id, 'Q', 'Rate Plan Quarter', 687, 'standard'
FROM products p
JOIN brands b ON p.brand_id = b.id
WHERE b.code = 'SA' AND p.name = 'Aftenbladet Basis';
INSERT INTO rate_plans (product_id, code, name, price, category)
SELECT p.id, 'H', 'Rate Plan 6 months', 1374, 'standard'
FROM products p
JOIN brands b ON p.brand_id = b.id
WHERE b.code = 'SA' AND p.name = 'Aftenbladet Basis';
INSERT INTO rate_plans (product_id, code, name, price, category)
SELECT p.id, 'Y', 'Rate Plan Year', 2748, 'standard'
FROM products p
JOIN brands b ON p.brand_id = b.id
WHERE b.code = 'SA' AND p.name = 'Aftenbladet Basis';
INSERT INTO rate_plans (product_id, code, name, price, category)
SELECT p.id, 'M', 'Rate Plan Month', 349, 'standard'
FROM products p
JOIN brands b ON p.brand_id = b.id
WHERE b.code = 'SA' AND p.name = 'Aftenbladet Familie';
INSERT INTO rate_plans (product_id, code, name, price, category)
SELECT p.id, 'Q', 'Rate Plan Quarter', 1047, 'standard'
FROM products p
JOIN brands b ON p.brand_id = b.id
WHERE b.code = 'SA' AND p.name = 'Aftenbladet Familie';
INSERT INTO rate_plans (product_id, code, name, price, category)
SELECT p.id, 'H', 'Rate Plan 6 months', 2094, 'standard'
FROM products p
JOIN brands b ON p.brand_id = b.id
WHERE b.code = 'SA' AND p.name = 'Aftenbladet Familie';
INSERT INTO rate_plans (product_id, code, name, price, category)
SELECT p.id, 'Y', 'Rate Plan Year', 4188, 'standard'
FROM products p
JOIN brands b ON p.brand_id = b.id
WHERE b.code = 'SA' AND p.name = 'Aftenbladet Familie';
INSERT INTO rate_plans (product_id, code, name, price, category)
SELECT p.id, 'M', 'Rate Plan Month', 379, 'standard'
FROM products p
JOIN brands b ON p.brand_id = b.id
WHERE b.code = 'SA' AND p.name = 'Aftenbladet Full tilgang';
INSERT INTO rate_plans (product_id, code, name, price, category)
SELECT p.id, 'Q', 'Rate Plan Quarter', 1137, 'standard'
FROM products p
JOIN brands b ON p.brand_id = b.id
WHERE b.code = 'SA' AND p.name = 'Aftenbladet Full tilgang';
INSERT INTO rate_plans (product_id, code, name, price, category)
SELECT p.id, 'H', 'Rate Plan 6 months', 2274, 'standard'
FROM products p
JOIN brands b ON p.brand_id = b.id
WHERE b.code = 'SA' AND p.name = 'Aftenbladet Full tilgang';
INSERT INTO rate_plans (product_id, code, name, price, category)
SELECT p.id, 'Y', 'Rate Plan Year', 4548, 'standard'
FROM products p
JOIN brands b ON p.brand_id = b.id
WHERE b.code = 'SA' AND p.name = 'Aftenbladet Full tilgang';
INSERT INTO rate_plans (product_id, code, name, price, category)
SELECT p.id, 'M', 'Rate Plan Month', 568, 'standard'
FROM products p
JOIN brands b ON p.brand_id = b.id
WHERE b.code = 'SA' AND p.name = 'Aftenbladet Full tillgang Helg';
INSERT INTO rate_plans (product_id, code, name, price, category)
SELECT p.id, 'Q', 'Rate Plan Quarter', 1704, 'standard'
FROM products p
JOIN brands b ON p.brand_id = b.id
WHERE b.code = 'SA' AND p.name = 'Aftenbladet Full tillgang Helg';
INSERT INTO rate_plans (product_id, code, name, price, category)
SELECT p.id, 'H', 'Rate Plan 6 months', 3408, 'standard'
FROM products p
JOIN brands b ON p.brand_id = b.id
WHERE b.code = 'SA' AND p.name = 'Aftenbladet Full tillgang Helg';
INSERT INTO rate_plans (product_id, code, name, price, category)
SELECT p.id, 'Y', 'Rate Plan Year', 6588, 'standard'
FROM products p
JOIN brands b ON p.brand_id = b.id
WHERE b.code = 'SA' AND p.name = 'Aftenbladet Full tillgang Helg';
INSERT INTO rate_plans (product_id, code, name, price, category)
SELECT p.id, 'M', 'Rate Plan Month', 734, 'standard'
FROM products p
JOIN brands b ON p.brand_id = b.id
WHERE b.code = 'SA' AND p.name = 'Aftenbladet Full tillgang Komplett';
INSERT INTO rate_plans (product_id, code, name, price, category)
SELECT p.id, 'Q', 'Rate Plan Quarter', 2202, 'standard'
FROM products p
JOIN brands b ON p.brand_id = b.id
WHERE b.code = 'SA' AND p.name = 'Aftenbladet Full tillgang Komplett';
INSERT INTO rate_plans (product_id, code, name, price, category)
SELECT p.id, 'H', 'Rate Plan 6 months', 4404, 'standard'
FROM products p
JOIN brands b ON p.brand_id = b.id
WHERE b.code = 'SA' AND p.name = 'Aftenbladet Full tillgang Komplett';
INSERT INTO rate_plans (product_id, code, name, price, category)
SELECT p.id, 'Y', 'Rate Plan Year', 8448, 'standard'
FROM products p
JOIN brands b ON p.brand_id = b.id
WHERE b.code = 'SA' AND p.name = 'Aftenbladet Full tillgang Komplett';
INSERT INTO rate_plans (product_id, code, name, price, category)
SELECT p.id, 'W', 'Rate Plan Week', 115, 'standard'
FROM products p
JOIN brands b ON p.brand_id = b.id
WHERE b.code = 'SA' AND p.name = 'Aftenbladet Helg';
INSERT INTO rate_plans (product_id, code, name, price, category)
SELECT p.id, 'M', 'Rate Plan Month', 499, 'standard'
FROM products p
JOIN brands b ON p.brand_id = b.id
WHERE b.code = 'SA' AND p.name = 'Aftenbladet Helg';
INSERT INTO rate_plans (product_id, code, name, price, category)
SELECT p.id, 'Q', 'Rate Plan Quarter', 1497, 'standard'
FROM products p
JOIN brands b ON p.brand_id = b.id
WHERE b.code = 'SA' AND p.name = 'Aftenbladet Helg';
INSERT INTO rate_plans (product_id, code, name, price, category)
SELECT p.id, 'H', 'Rate Plan 6 months', 2994, 'standard'
FROM products p
JOIN brands b ON p.brand_id = b.id
WHERE b.code = 'SA' AND p.name = 'Aftenbladet Helg';
INSERT INTO rate_plans (product_id, code, name, price, category)
SELECT p.id, 'Y', 'Rate Plan Year', 5760, 'standard'
FROM products p
JOIN brands b ON p.brand_id = b.id
WHERE b.code = 'SA' AND p.name = 'Aftenbladet Helg';
INSERT INTO rate_plans (product_id, code, name, price, category)
SELECT p.id, 'M', 'Rate Plan Month', 655, 'standard'
FROM products p
JOIN brands b ON p.brand_id = b.id
WHERE b.code = 'SA' AND p.name = 'Aftenbladet Komplett';
INSERT INTO rate_plans (product_id, code, name, price, category)
SELECT p.id, 'Q', 'Rate Plan Quarter', 1995, 'standard'
FROM products p
JOIN brands b ON p.brand_id = b.id
WHERE b.code = 'SA' AND p.name = 'Aftenbladet Komplett';
INSERT INTO rate_plans (product_id, code, name, price, category)
SELECT p.id, 'H', 'Rate Plan 6 months', 3990, 'standard'
FROM products p
JOIN brands b ON p.brand_id = b.id
WHERE b.code = 'SA' AND p.name = 'Aftenbladet Komplett';
INSERT INTO rate_plans (product_id, code, name, price, category)
SELECT p.id, 'Y', 'Rate Plan Year', 7620, 'standard'
FROM products p
JOIN brands b ON p.brand_id = b.id
WHERE b.code = 'SA' AND p.name = 'Aftenbladet Komplett';
INSERT INTO rate_plans (product_id, code, name, price, category)
SELECT p.id, 'M', 'Rate Plan Month', 665, 'standard'
FROM products p
JOIN brands b ON p.brand_id = b.id
WHERE b.code = 'SA' AND p.name = 'Aftenbladet mandag til fredag';
INSERT INTO rate_plans (product_id, code, name, price, category)
SELECT p.id, 'Q', 'Rate Plan Quarter', 1995, 'standard'
FROM products p
JOIN brands b ON p.brand_id = b.id
WHERE b.code = 'SA' AND p.name = 'Aftenbladet mandag til fredag';
INSERT INTO rate_plans (product_id, code, name, price, category)
SELECT p.id, 'H', 'Rate Plan 6 months', 3990, 'standard'
FROM products p
JOIN brands b ON p.brand_id = b.id
WHERE b.code = 'SA' AND p.name = 'Aftenbladet mandag til fredag';
INSERT INTO rate_plans (product_id, code, name, price, category)
SELECT p.id, 'Y', 'Rate Plan Year', 7620, 'standard'
FROM products p
JOIN brands b ON p.brand_id = b.id
WHERE b.code = 'SA' AND p.name = 'Aftenbladet mandag til fredag';
INSERT INTO rate_plans (product_id, code, name, price, category)
SELECT p.id, 'W', 'Rate Plan Week', 66, 'standard'
FROM products p
JOIN brands b ON p.brand_id = b.id
WHERE b.code = 'SA' AND p.name = 'Aftenbladet Premium';
INSERT INTO rate_plans (product_id, code, name, price, category)
SELECT p.id, 'M', 'Rate Plan Month', 299, 'standard'
FROM products p
JOIN brands b ON p.brand_id = b.id
WHERE b.code = 'SA' AND p.name = 'Aftenbladet Premium';
INSERT INTO rate_plans (product_id, code, name, price, category)
SELECT p.id, 'Q', 'Rate Plan Quarter', 897, 'standard'
FROM products p
JOIN brands b ON p.brand_id = b.id
WHERE b.code = 'SA' AND p.name = 'Aftenbladet Premium';
INSERT INTO rate_plans (product_id, code, name, price, category)
SELECT p.id, 'H', 'Rate Plan 6 months', 1794, 'standard'
FROM products p
JOIN brands b ON p.brand_id = b.id
WHERE b.code = 'SA' AND p.name = 'Aftenbladet Premium';
INSERT INTO rate_plans (product_id, code, name, price, category)
SELECT p.id, 'Y', 'Rate Plan Year', 3588, 'standard'
FROM products p
JOIN brands b ON p.brand_id = b.id
WHERE b.code = 'SA' AND p.name = 'Aftenbladet Premium';
INSERT INTO rate_plans (product_id, code, name, price, category)
SELECT p.id, 'W', 'Rate Plan Week', 59, 'standard'
FROM products p
JOIN brands b ON p.brand_id = b.id
WHERE b.code = 'VG' AND p.name = 'VG eavis';
INSERT INTO rate_plans (product_id, code, name, price, category)
SELECT p.id, 'M', 'Rate Plan Month', 179, 'standard'
FROM products p
JOIN brands b ON p.brand_id = b.id
WHERE b.code = 'VG' AND p.name = 'VG eavis';
INSERT INTO rate_plans (product_id, code, name, price, category)
SELECT p.id, 'Q', 'Rate Plan Quarter', 499, 'standard'
FROM products p
JOIN brands b ON p.brand_id = b.id
WHERE b.code = 'VG' AND p.name = 'VG eavis';
INSERT INTO rate_plans (product_id, code, name, price, category)
SELECT p.id, 'H', 'Rate Plan 6 months', 949, 'standard'
FROM products p
JOIN brands b ON p.brand_id = b.id
WHERE b.code = 'VG' AND p.name = 'VG eavis';
INSERT INTO rate_plans (product_id, code, name, price, category)
SELECT p.id, 'Y', 'Rate Plan Year', 1788, 'standard'
FROM products p
JOIN brands b ON p.brand_id = b.id
WHERE b.code = 'VG' AND p.name = 'VG eavis';
INSERT INTO rate_plans (product_id, code, name, price, category)
SELECT p.id, 'M', 'Rate Plan Month', 349, 'standard'
FROM products p
JOIN brands b ON p.brand_id = b.id
WHERE b.code = 'VG' AND p.name = 'VG Weekend hele helgen';
INSERT INTO rate_plans (product_id, code, name, price, category)
SELECT p.id, 'Q', 'Rate Plan Quarter', 1047, 'standard'
FROM products p
JOIN brands b ON p.brand_id = b.id
WHERE b.code = 'VG' AND p.name = 'VG Weekend hele helgen';
INSERT INTO rate_plans (product_id, code, name, price, category)
SELECT p.id, 'H', 'Rate Plan 6 months', 2094, 'standard'
FROM products p
JOIN brands b ON p.brand_id = b.id
WHERE b.code = 'VG' AND p.name = 'VG Weekend hele helgen';
INSERT INTO rate_plans (product_id, code, name, price, category)
SELECT p.id, 'Y', 'Rate Plan Year', 4188, 'standard'
FROM products p
JOIN brands b ON p.brand_id = b.id
WHERE b.code = 'VG' AND p.name = 'VG Weekend hele helgen';
INSERT INTO rate_plans (product_id, code, name, price, category)
SELECT p.id, 'M', 'Rate Plan Month', 329, 'standard'
FROM products p
JOIN brands b ON p.brand_id = b.id
WHERE b.code = 'VG' AND p.name = 'VG Weekend fredag-lørdag';
INSERT INTO rate_plans (product_id, code, name, price, category)
SELECT p.id, 'Q', 'Rate Plan Quarter', 949, 'standard'
FROM products p
JOIN brands b ON p.brand_id = b.id
WHERE b.code = 'VG' AND p.name = 'VG Weekend fredag-lørdag';
INSERT INTO rate_plans (product_id, code, name, price, category)
SELECT p.id, 'H', 'Rate Plan 6 months', 1849, 'standard'
FROM products p
JOIN brands b ON p.brand_id = b.id
WHERE b.code = 'VG' AND p.name = 'VG Weekend fredag-lørdag';
INSERT INTO rate_plans (product_id, code, name, price, category)
SELECT p.id, 'Y', 'Rate Plan Year', 3599, 'standard'
FROM products p
JOIN brands b ON p.brand_id = b.id
WHERE b.code = 'VG' AND p.name = 'VG Weekend fredag-lørdag';
INSERT INTO rate_plans (product_id, code, name, price, category)
SELECT p.id, 'M', 'Rate Plan Month', 299, 'standard'
FROM products p
JOIN brands b ON p.brand_id = b.id
WHERE b.code = 'VG' AND p.name = 'VG Weekend lørdag-søndag';
INSERT INTO rate_plans (product_id, code, name, price, category)
SELECT p.id, 'Q', 'Rate Plan Quarter', 897, 'standard'
FROM products p
JOIN brands b ON p.brand_id = b.id
WHERE b.code = 'VG' AND p.name = 'VG Weekend lørdag-søndag';
INSERT INTO rate_plans (product_id, code, name, price, category)
SELECT p.id, 'H', 'Rate Plan 6 months', 1794, 'standard'
FROM products p
JOIN brands b ON p.brand_id = b.id
WHERE b.code = 'VG' AND p.name = 'VG Weekend lørdag-søndag';
INSERT INTO rate_plans (product_id, code, name, price, category)
SELECT p.id, 'Y', 'Rate Plan Year', 3588, 'standard'
FROM products p
JOIN brands b ON p.brand_id = b.id
WHERE b.code = 'VG' AND p.name = 'VG Weekend lørdag-søndag';
INSERT INTO rate_plans (product_id, code, name, price, category)
SELECT p.id, 'W', 'Rate Plan Week', 59, 'standard'
FROM products p
JOIN brands b ON p.brand_id = b.id
WHERE b.code = 'VG' AND p.name = 'VG+ Basis';
INSERT INTO rate_plans (product_id, code, name, price, category)
SELECT p.id, 'M', 'Rate Plan Month', 99, 'standard'
FROM products p
JOIN brands b ON p.brand_id = b.id
WHERE b.code = 'VG' AND p.name = 'VG+ Basis';
INSERT INTO rate_plans (product_id, code, name, price, category)
SELECT p.id, 'Q', 'Rate Plan Quarter', 225, 'standard'
FROM products p
JOIN brands b ON p.brand_id = b.id
WHERE b.code = 'VG' AND p.name = 'VG+ Basis';
INSERT INTO rate_plans (product_id, code, name, price, category)
SELECT p.id, 'H', 'Rate Plan 6 months', 499, 'standard'
FROM products p
JOIN brands b ON p.brand_id = b.id
WHERE b.code = 'VG' AND p.name = 'VG+ Basis';
INSERT INTO rate_plans (product_id, code, name, price, category)
SELECT p.id, 'Y', 'Rate Plan Year', 999, 'standard'
FROM products p
JOIN brands b ON p.brand_id = b.id
WHERE b.code = 'VG' AND p.name = 'VG+ Basis';
INSERT INTO rate_plans (product_id, code, name, price, category)
SELECT p.id, 'W', 'Rate Plan Week', 39, 'standard'
FROM products p
JOIN brands b ON p.brand_id = b.id
WHERE b.code = 'VG' AND p.name = 'VG+';
INSERT INTO rate_plans (product_id, code, name, price, category)
SELECT p.id, 'M', 'Rate Plan Month', 99, 'standard'
FROM products p
JOIN brands b ON p.brand_id = b.id
WHERE b.code = 'VG' AND p.name = 'VG+';
INSERT INTO rate_plans (product_id, code, name, price, category)
SELECT p.id, 'Q', 'Rate Plan Quarter', 225, 'standard'
FROM products p
JOIN brands b ON p.brand_id = b.id
WHERE b.code = 'VG' AND p.name = 'VG+';
INSERT INTO rate_plans (product_id, code, name, price, category)
SELECT p.id, 'H', 'Rate Plan 6 months', 349, 'standard'
FROM products p
JOIN brands b ON p.brand_id = b.id
WHERE b.code = 'VG' AND p.name = 'VG+';
INSERT INTO rate_plans (product_id, code, name, price, category)
SELECT p.id, 'Y', 'Rate Plan Year', 799, 'standard'
FROM products p
JOIN brands b ON p.brand_id = b.id
WHERE b.code = 'VG' AND p.name = 'VG+';
INSERT INTO rate_plans (product_id, code, name, price, category)
SELECT p.id, 'PUB_1500', 'Rate Plan Pub 1500', 1875, 'business'
FROM products p
JOIN brands b ON p.brand_id = b.id
WHERE b.code = 'VG' AND p.name = 'VG+';
INSERT INTO rate_plans (product_id, code, name, price, category)
SELECT p.id, 'PUB_2000', 'Rate Plan Pub 2000', 2500, 'business'
FROM products p
JOIN brands b ON p.brand_id = b.id
WHERE b.code = 'VG' AND p.name = 'VG+';
INSERT INTO rate_plans (product_id, code, name, price, category)
SELECT p.id, 'W', 'Rate Plan Week', 59, 'standard'
FROM products p
JOIN brands b ON p.brand_id = b.id
WHERE b.code = 'VG' AND p.name = 'VG+ og Dine penger+';
INSERT INTO rate_plans (product_id, code, name, price, category)
SELECT p.id, 'Q', 'Rate Plan Quarter', 119, 'standard'
FROM products p
JOIN brands b ON p.brand_id = b.id
WHERE b.code = 'VG' AND p.name = 'VG+ og Dine penger+';
INSERT INTO rate_plans (product_id, code, name, price, category)
SELECT p.id, 'W', 'Rate Plan Week', 59, 'standard'
FROM products p
JOIN brands b ON p.brand_id = b.id
WHERE b.code = 'VG' AND p.name = 'VG+ Sport';
INSERT INTO rate_plans (product_id, code, name, price, category)
SELECT p.id, 'Q', 'Rate Plan Quarter', 149, 'standard'
FROM products p
JOIN brands b ON p.brand_id = b.id
WHERE b.code = 'VG' AND p.name = 'VG+ Sport';
INSERT INTO rate_plans (product_id, code, name, price, category)
SELECT p.id, 'Q', 'Rate Plan Quarter', 179, 'standard'
FROM products p
JOIN brands b ON p.brand_id = b.id
WHERE b.code = 'VG' AND p.name = 'VG+ Total';
INSERT INTO rate_plans (product_id, code, name, price, category)
SELECT p.id, 'Q', 'Rate Plan Quarter', 379, 'standard'
FROM products p
JOIN brands b ON p.brand_id = b.id
WHERE b.code = 'VG' AND p.name = 'VG+ Full tilgang';
INSERT INTO rate_plans (product_id, code, name, price, category)
SELECT p.id, 'H', 'Rate Plan 6 months', 2094, 'standard'
FROM products p
JOIN brands b ON p.brand_id = b.id
WHERE b.code = 'VG' AND p.name = 'VG+ Full tilgang';
INSERT INTO rate_plans (product_id, code, name, price, category)
SELECT p.id, 'Y', 'Rate Plan Year', 4188, 'standard'
FROM products p
JOIN brands b ON p.brand_id = b.id
WHERE b.code = 'VG' AND p.name = 'VG+ Full tilgang';
INSERT INTO rate_plans (product_id, code, name, price, category)
SELECT p.id, 'Q', 'Rate Plan Quarter', 299, 'standard'
FROM products p
JOIN brands b ON p.brand_id = b.id
WHERE b.code = 'VG' AND p.name = 'VG+ Flex';
INSERT INTO rate_plans (product_id, code, name, price, category)
SELECT p.id, 'W', 'Rate Plan Week', 59, 'standard'
FROM products p
JOIN brands b ON p.brand_id = b.id
WHERE b.code = 'VG' AND p.name = 'VG+ og PodMe';
INSERT INTO rate_plans (product_id, code, name, price, category)
SELECT p.id, 'M', 'Rate Plan Month', 119, 'standard'
FROM products p
JOIN brands b ON p.brand_id = b.id
WHERE b.code = 'VG' AND p.name = 'VG+ og PodMe';
INSERT INTO rate_plans (product_id, code, name, price, category)
SELECT p.id, 'H', 'Rate Plan 6 months', 649, 'standard'
FROM products p
JOIN brands b ON p.brand_id = b.id
WHERE b.code = 'VG' AND p.name = 'VG+ og PodMe';
INSERT INTO rate_plans (product_id, code, name, price, category)
SELECT p.id, 'Y', 'Rate Plan Year', 1199, 'standard'
FROM products p
JOIN brands b ON p.brand_id = b.id
WHERE b.code = 'VG' AND p.name = 'VG+ og PodMe';
INSERT INTO rate_plans (product_id, code, name, price, category)
SELECT p.id, 'W', 'Rate Plan Week', 39, 'standard'
FROM products p
JOIN brands b ON p.brand_id = b.id
WHERE b.code = 'VG' AND p.name = 'MinMote strikk';
INSERT INTO rate_plans (product_id, code, name, price, category)
SELECT p.id, 'M', 'Rate Plan Month', 209, 'standard'
FROM products p
JOIN brands b ON p.brand_id = b.id
WHERE b.code = 'VG' AND p.name = 'VG eAvis med VG+';
INSERT INTO rate_plans (product_id, code, name, price, category)
SELECT p.id, 'Y', 'Rate Plan Year', 2199, 'standard'
FROM products p
JOIN brands b ON p.brand_id = b.id
WHERE b.code = 'VG' AND p.name = 'VG eAvis med VG+';
INSERT INTO rate_plans (product_id, code, name, price, category)
SELECT p.id, 'W', 'Rate Plan Week', 39, 'standard'
FROM products p
JOIN brands b ON p.brand_id = b.id
WHERE b.code = 'VG' AND p.name = 'Dine penger+';
INSERT INTO rate_plans (product_id, code, name, price, category)
SELECT p.id, 'M', 'Rate Plan Month', 89, 'standard'
FROM products p
JOIN brands b ON p.brand_id = b.id
WHERE b.code = 'VG' AND p.name = 'Dine penger+';
INSERT INTO rate_plans (product_id, code, name, price, category)
SELECT p.id, 'Y', 'Rate Plan Year', 1059, 'standard'
FROM products p
JOIN brands b ON p.brand_id = b.id
WHERE b.code = 'VG' AND p.name = 'Dine penger+';
INSERT INTO rate_plans (product_id, code, name, price, category)
SELECT p.id, 'M', 'Rate Plan Month', 149, 'standard'
FROM products p
JOIN brands b ON p.brand_id = b.id
WHERE b.code = 'AB' AND p.name = 'Aftonbladet e-tidning';
INSERT INTO rate_plans (product_id, code, name, price, category)
SELECT p.id, 'M', 'Rate Plan Month', 149, 'standard'
FROM products p
JOIN brands b ON p.brand_id = b.id
WHERE b.code = 'AB' AND p.name = 'Aftonbladet Plus';
INSERT INTO rate_plans (product_id, code, name, price, category)
SELECT p.id, 'Y', 'Rate Plan Year', 1195, 'standard'
FROM products p
JOIN brands b ON p.brand_id = b.id
WHERE b.code = 'AB' AND p.name = 'Aftonbladet Plus';
INSERT INTO rate_plans (product_id, code, name, price, category)
SELECT p.id, 'M', 'Rate Plan Month', 179, 'standard'
FROM products p
JOIN brands b ON p.brand_id = b.id
WHERE b.code = 'AB' AND p.name = 'Aftonbladet Plus & Podme';
INSERT INTO rate_plans (product_id, code, name, price, category)
SELECT p.id, 'M', 'Rate Plan Month', 299, 'standard'
FROM products p
JOIN brands b ON p.brand_id = b.id
WHERE b.code = 'AB' AND p.name = 'Aftonbladet Superpaketet';
INSERT INTO rate_plans (product_id, code, name, price, category)
SELECT p.id, 'M', 'Rate Plan Month', 199, 'standard'
FROM products p
JOIN brands b ON p.brand_id = b.id
WHERE b.code = 'AB' AND p.name = 'Plus & SvenskHockey.tv';
INSERT INTO rate_plans (product_id, code, name, price, category)
SELECT p.id, 'M', 'Rate Plan Month', 349, 'standard'
FROM products p
JOIN brands b ON p.brand_id = b.id
WHERE b.code = 'SVD' AND p.name = 'SvD digital premium';
INSERT INTO rate_plans (product_id, code, name, price, category)
SELECT p.id, 'Q', 'Rate Plan Quarter', 1047, 'standard'
FROM products p
JOIN brands b ON p.brand_id = b.id
WHERE b.code = 'SVD' AND p.name = 'SvD digital premium';
INSERT INTO rate_plans (product_id, code, name, price, category)
SELECT p.id, 'H', 'Rate Plan 6 months', 2094, 'standard'
FROM products p
JOIN brands b ON p.brand_id = b.id
WHERE b.code = 'SVD' AND p.name = 'SvD digital premium';
INSERT INTO rate_plans (product_id, code, name, price, category)
SELECT p.id, 'Y', 'Rate Plan Year', 4188, 'standard'
FROM products p
JOIN brands b ON p.brand_id = b.id
WHERE b.code = 'SVD' AND p.name = 'SvD digital premium';
INSERT INTO rate_plans (product_id, code, name, price, category)
SELECT p.id, 'B2B_Y', 'Rate Plan B2B Year', 4188, 'business'
FROM products p
JOIN brands b ON p.brand_id = b.id
WHERE b.code = 'SVD' AND p.name = 'SvD digital premium';
INSERT INTO rate_plans (product_id, code, name, price, category)
SELECT p.id, 'SE_OS_M', 'Rate Plan Övriga Sverige Månad', 4188, 'regional'
FROM products p
JOIN brands b ON p.brand_id = b.id
WHERE b.code = 'SVD' AND p.name = 'SvD digital premium';
INSERT INTO rate_plans (product_id, code, name, price, category)
SELECT p.id, 'SE_OS_Q', 'Rate Plan Övriga Sverige Kvartal', 4188, 'regional'
FROM products p
JOIN brands b ON p.brand_id = b.id
WHERE b.code = 'SVD' AND p.name = 'SvD digital premium';
INSERT INTO rate_plans (product_id, code, name, price, category)
SELECT p.id, 'SE_OS_H', 'Rate Plan Övriga Sverige Halvår', 4188, 'regional'
FROM products p
JOIN brands b ON p.brand_id = b.id
WHERE b.code = 'SVD' AND p.name = 'SvD digital premium';
INSERT INTO rate_plans (product_id, code, name, price, category)
SELECT p.id, 'SE_OS_Y', 'Rate Plan Övriga Sverige År', 4188, 'regional'
FROM products p
JOIN brands b ON p.brand_id = b.id
WHERE b.code = 'SVD' AND p.name = 'SvD digital premium';
INSERT INTO rate_plans (product_id, code, name, price, category)
SELECT p.id, 'SE_ST_M', 'Rate Plan Sthlm Månad', 4188, 'regional'
FROM products p
JOIN brands b ON p.brand_id = b.id
WHERE b.code = 'SVD' AND p.name = 'SvD digital premium';
INSERT INTO rate_plans (product_id, code, name, price, category)
SELECT p.id, 'SE_ST_Q', 'Rate Plan Sthlm Kvartal', 4188, 'regional'
FROM products p
JOIN brands b ON p.brand_id = b.id
WHERE b.code = 'SVD' AND p.name = 'SvD digital premium';
INSERT INTO rate_plans (product_id, code, name, price, category)
SELECT p.id, 'SE_ST_H', 'Rate Plan Sthlm Halvår', 4188, 'regional'
FROM products p
JOIN brands b ON p.brand_id = b.id
WHERE b.code = 'SVD' AND p.name = 'SvD digital premium';
INSERT INTO rate_plans (product_id, code, name, price, category)
SELECT p.id, 'SE_ST_Y', 'Rate Plan Sthlm År', 4188, 'regional'
FROM products p
JOIN brands b ON p.brand_id = b.id
WHERE b.code = 'SVD' AND p.name = 'SvD digital premium';
INSERT INTO rate_plans (product_id, code, name, price, category)
SELECT p.id, 'FO_Y', 'Rate Plan Företag År', 4188, 'business'
FROM products p
JOIN brands b ON p.brand_id = b.id
WHERE b.code = 'SVD' AND p.name = 'SvD digital premium';
INSERT INTO rate_plans (product_id, code, name, price, category)
SELECT p.id, 'M', 'Rate Plan Month', 229, 'standard'
FROM products p
JOIN brands b ON p.brand_id = b.id
WHERE b.code = 'SVD' AND p.name = 'SvD digital standard';
INSERT INTO rate_plans (product_id, code, name, price, category)
SELECT p.id, 'Q', 'Rate Plan Quarter', 687, 'standard'
FROM products p
JOIN brands b ON p.brand_id = b.id
WHERE b.code = 'SVD' AND p.name = 'SvD digital standard';
INSERT INTO rate_plans (product_id, code, name, price, category)
SELECT p.id, 'H', 'Rate Plan 6 months', 1374, 'standard'
FROM products p
JOIN brands b ON p.brand_id = b.id
WHERE b.code = 'SVD' AND p.name = 'SvD digital standard';
INSERT INTO rate_plans (product_id, code, name, price, category)
SELECT p.id, 'Y', 'Rate Plan Year', 2748, 'standard'
FROM products p
JOIN brands b ON p.brand_id = b.id
WHERE b.code = 'SVD' AND p.name = 'SvD digital standard';
INSERT INTO rate_plans (product_id, code, name, price, category)
SELECT p.id, 'M', 'Rate Plan Month', 69, 'standard'
FROM products p
JOIN brands b ON p.brand_id = b.id
WHERE b.code = 'SVD' AND p.name = 'SvD Superpaketet - tillägg alla dagar';
INSERT INTO rate_plans (product_id, code, name, price, category)
SELECT p.id, 'M', 'Rate Plan Month', 69, 'standard'
FROM products p
JOIN brands b ON p.brand_id = b.id
WHERE b.code = 'SVD' AND p.name = 'SvD Superpaketet - tillägg helg';
INSERT INTO rate_plans (product_id, code, name, price, category)
SELECT p.id, 'M', 'Rate Plan Month', 89, 'standard'
FROM products p
JOIN brands b ON p.brand_id = b.id
WHERE b.code = 'SVD' AND p.name = 'SvD Superpaketet - tillägg digital premium';
INSERT INTO rate_plans (product_id, code, name, price, category)
SELECT p.id, 'M', 'Rate Plan Month', 39, 'standard'
FROM products p
JOIN brands b ON p.brand_id = b.id
WHERE b.code = 'SVD' AND p.name = 'SvD Vinklubb';
INSERT INTO rate_plans (product_id, code, name, price, category)
SELECT p.id, 'Y', 'Rate Plan Year', 399, 'standard'
FROM products p
JOIN brands b ON p.brand_id = b.id
WHERE b.code = 'SVD' AND p.name = 'SvD Vinklubb';
INSERT INTO rate_plans (product_id, code, name, price, category)
SELECT p.id, 'M', 'Rate Plan Month', 299, 'standard'
FROM products p
JOIN brands b ON p.brand_id = b.id
WHERE b.code = 'SVD' AND p.name = 'SvD Superpaketet';
INSERT INTO rate_plans (product_id, code, name, price, category)
SELECT p.id, 'M', 'Rate Plan Month', 379, 'standard'
FROM products p
JOIN brands b ON p.brand_id = b.id
WHERE b.code = 'SVD' AND p.name = 'SvD digital premium SP';
INSERT INTO rate_plans (product_id, code, name, price, category)
SELECT p.id, 'Y', 'Rate Plan Year', 2304, 'standard'
FROM products p
JOIN brands b ON p.brand_id = b.id
WHERE b.code = 'SVD' AND p.name = 'SvD taltidning';
INSERT INTO rate_plans (product_id, code, name, price, category)
SELECT p.id, 'Y', 'Rate Plan Year', 480, 'standard'
FROM products p
JOIN brands b ON p.brand_id = b.id
WHERE b.code = 'SVD' AND p.name = 'SvD taltidning - tillägg';
INSERT INTO rate_plans (product_id, code, name, price, category)
SELECT p.id, 'W', 'Rate Plan Week', 57, 'standard'
FROM products p
JOIN brands b ON p.brand_id = b.id
WHERE b.code = 'SVD' AND p.name = 'SvD digital standard & Podme';
INSERT INTO rate_plans (product_id, code, name, price, category)
SELECT p.id, 'M', 'Rate Plan Month', 249, 'standard'
FROM products p
JOIN brands b ON p.brand_id = b.id
WHERE b.code = 'SVD' AND p.name = 'SvD digital standard & Podme';
INSERT INTO rate_plans (product_id, code, name, price, category)
SELECT p.id, 'SE_OS_M', 'Rate Plan Övriga Sverige Månad', 799, 'regional'
FROM products p
JOIN brands b ON p.brand_id = b.id
WHERE b.code = 'SVD' AND p.name = 'SvD komplett alla dagar';
INSERT INTO rate_plans (product_id, code, name, price, category)
SELECT p.id, 'SE_OS_Q', 'Rate Plan Övriga Sverige Kvartal', 2397, 'regional'
FROM products p
JOIN brands b ON p.brand_id = b.id
WHERE b.code = 'SVD' AND p.name = 'SvD komplett alla dagar';
INSERT INTO rate_plans (product_id, code, name, price, category)
SELECT p.id, 'SE_OS_Y', 'Rate Plan Övriga Sverige År', 9588, 'regional'
FROM products p
JOIN brands b ON p.brand_id = b.id
WHERE b.code = 'SVD' AND p.name = 'SvD komplett alla dagar';
INSERT INTO rate_plans (product_id, code, name, price, category)
SELECT p.id, 'SE_ST_M', 'Rate Plan Sthlm Månad', 799, 'regional'
FROM products p
JOIN brands b ON p.brand_id = b.id
WHERE b.code = 'SVD' AND p.name = 'SvD komplett alla dagar';
INSERT INTO rate_plans (product_id, code, name, price, category)
SELECT p.id, 'SE_ST_Q', 'Rate Plan Sthlm Kvartal', 2397, 'regional'
FROM products p
JOIN brands b ON p.brand_id = b.id
WHERE b.code = 'SVD' AND p.name = 'SvD komplett alla dagar';
INSERT INTO rate_plans (product_id, code, name, price, category)
SELECT p.id, 'SE_ST_H', 'Rate Plan Sthlm Halvår', 4794, 'regional'
FROM products p
JOIN brands b ON p.brand_id = b.id
WHERE b.code = 'SVD' AND p.name = 'SvD komplett alla dagar';
INSERT INTO rate_plans (product_id, code, name, price, category)
SELECT p.id, 'SE_ST_Y', 'Rate Plan Sthlm År', 9588, 'regional'
FROM products p
JOIN brands b ON p.brand_id = b.id
WHERE b.code = 'SVD' AND p.name = 'SvD komplett alla dagar';
INSERT INTO rate_plans (product_id, code, name, price, category)
SELECT p.id, 'FO_Y', 'Rate Plan Företag År', 10788, 'business'
FROM products p
JOIN brands b ON p.brand_id = b.id
WHERE b.code = 'SVD' AND p.name = 'SvD komplett alla dagar';
INSERT INTO rate_plans (product_id, code, name, price, category)
SELECT p.id, 'SE_ST_M', 'Rate Plan Sthlm Månad', 519, 'regional'
FROM products p
JOIN brands b ON p.brand_id = b.id
WHERE b.code = 'SVD' AND p.name = 'SvD komplett helg';
INSERT INTO rate_plans (product_id, code, name, price, category)
SELECT p.id, 'SE_ST_Q', 'Rate Plan Sthlm Kvartal', 1557, 'regional'
FROM products p
JOIN brands b ON p.brand_id = b.id
WHERE b.code = 'SVD' AND p.name = 'SvD komplett helg';
INSERT INTO rate_plans (product_id, code, name, price, category)
SELECT p.id, 'SE_ST_H', 'Rate Plan Sthlm Halvår', 3114, 'regional'
FROM products p
JOIN brands b ON p.brand_id = b.id
WHERE b.code = 'SVD' AND p.name = 'SvD komplett helg';
INSERT INTO rate_plans (product_id, code, name, price, category)
SELECT p.id, 'SE_ST_Y', 'Rate Plan Sthlm År', 5628, 'regional'
FROM products p
JOIN brands b ON p.brand_id = b.id
WHERE b.code = 'SVD' AND p.name = 'SvD komplett helg';
INSERT INTO rate_plans (product_id, code, name, price, category)
SELECT p.id, 'FO_Y', 'Rate Plan Företag År', 7188, 'business'
FROM products p
JOIN brands b ON p.brand_id = b.id
WHERE b.code = 'SVD' AND p.name = 'SvD komplett helg';
INSERT INTO rate_plans (product_id, code, name, price, category)
SELECT p.id, 'SE_OS_M', 'Rate Plan Övriga Sverige Månad', 149, 'regional'
FROM products p
JOIN brands b ON p.brand_id = b.id
WHERE b.code = 'SVD' AND p.name = 'Svenska Dagbladet söndag';
INSERT INTO rate_plans (product_id, code, name, price, category)
SELECT p.id, 'SE_OS_Q', 'Rate Plan Övriga Sverige Kvartal', 447, 'regional'
FROM products p
JOIN brands b ON p.brand_id = b.id
WHERE b.code = 'SVD' AND p.name = 'Svenska Dagbladet söndag';
INSERT INTO rate_plans (product_id, code, name, price, category)
SELECT p.id, 'SE_OS_H', 'Rate Plan Övriga Sverige Halvår', 894, 'regional'
FROM products p
JOIN brands b ON p.brand_id = b.id
WHERE b.code = 'SVD' AND p.name = 'Svenska Dagbladet söndag';
INSERT INTO rate_plans (product_id, code, name, price, category)
SELECT p.id, 'SE_OS_Y', 'Rate Plan Övriga Sverige År', 1788, 'regional'
FROM products p
JOIN brands b ON p.brand_id = b.id
WHERE b.code = 'SVD' AND p.name = 'Svenska Dagbladet söndag';
INSERT INTO rate_plans (product_id, code, name, price, category)
SELECT p.id, 'FO_Y', 'Rate Plan Företag År', 1788, 'business'
FROM products p
JOIN brands b ON p.brand_id = b.id
WHERE b.code = 'SVD' AND p.name = 'Svenska Dagbladet söndag';
INSERT INTO rate_plans (product_id, code, name, price, category)
SELECT p.id, 'SE_ST_M', 'Rate Plan Sthlm Månad', 499, 'regional'
FROM products p
JOIN brands b ON p.brand_id = b.id
WHERE b.code = 'SVD' AND p.name = 'SvD komplett vardag';
INSERT INTO rate_plans (product_id, code, name, price, category)
SELECT p.id, 'SE_ST_Q', 'Rate Plan Sthlm Kvartal', 1497, 'regional'
FROM products p
JOIN brands b ON p.brand_id = b.id
WHERE b.code = 'SVD' AND p.name = 'SvD komplett vardag';
INSERT INTO rate_plans (product_id, code, name, price, category)
SELECT p.id, 'SE_ST_H', 'Rate Plan Sthlm Halvår', 2994, 'regional'
FROM products p
JOIN brands b ON p.brand_id = b.id
WHERE b.code = 'SVD' AND p.name = 'SvD komplett vardag';
INSERT INTO rate_plans (product_id, code, name, price, category)
SELECT p.id, 'SE_ST_Y', 'Rate Plan Sthlm År', 5988, 'regional'
FROM products p
JOIN brands b ON p.brand_id = b.id
WHERE b.code = 'SVD' AND p.name = 'SvD komplett vardag';
INSERT INTO rate_plans (product_id, code, name, price, category)
SELECT p.id, 'FO_Y', 'Rate Plan Företag År', 7188, 'business'
FROM products p
JOIN brands b ON p.brand_id = b.id
WHERE b.code = 'SVD' AND p.name = 'SvD komplett vardag';
INSERT INTO rate_plans (product_id, code, name, price, category)
SELECT p.id, 'SE_OS_M', 'Rate Plan Övriga Sverige Månad', 699, 'regional'
FROM products p
JOIN brands b ON p.brand_id = b.id
WHERE b.code = 'SVD' AND p.name = 'SvD komplett sexdagars';
INSERT INTO rate_plans (product_id, code, name, price, category)
SELECT p.id, 'SE_OS_Q', 'Rate Plan Övriga Sverige Kvartal', 2097, 'regional'
FROM products p
JOIN brands b ON p.brand_id = b.id
WHERE b.code = 'SVD' AND p.name = 'SvD komplett sexdagars';
INSERT INTO rate_plans (product_id, code, name, price, category)
SELECT p.id, 'SE_OS_H', 'Rate Plan Övriga Sverige Halvår', 4194, 'regional'
FROM products p
JOIN brands b ON p.brand_id = b.id
WHERE b.code = 'SVD' AND p.name = 'SvD komplett sexdagars';
INSERT INTO rate_plans (product_id, code, name, price, category)
SELECT p.id, 'SE_OS_Y', 'Rate Plan Övriga Sverige År', 8388, 'regional'
FROM products p
JOIN brands b ON p.brand_id = b.id
WHERE b.code = 'SVD' AND p.name = 'SvD komplett sexdagars';
INSERT INTO rate_plans (product_id, code, name, price, category)
SELECT p.id, 'SE_ST_M', 'Rate Plan Sthlm Månad', 519, 'regional'
FROM products p
JOIN brands b ON p.brand_id = b.id
WHERE b.code = 'SVD' AND p.name = 'SvD komplett tredagars';
INSERT INTO rate_plans (product_id, code, name, price, category)
SELECT p.id, 'SE_ST_Q', 'Rate Plan Sthlm Kvartal', 1557, 'regional'
FROM products p
JOIN brands b ON p.brand_id = b.id
WHERE b.code = 'SVD' AND p.name = 'SvD komplett tredagars';
INSERT INTO rate_plans (product_id, code, name, price, category)
SELECT p.id, 'SE_ST_H', 'Rate Plan Sthlm Halvår', 3114, 'regional'
FROM products p
JOIN brands b ON p.brand_id = b.id
WHERE b.code = 'SVD' AND p.name = 'SvD komplett tredagars';
INSERT INTO rate_plans (product_id, code, name, price, category)
SELECT p.id, 'SE_ST_Y', 'Rate Plan Sthlm År', 6228, 'regional'
FROM products p
JOIN brands b ON p.brand_id = b.id
WHERE b.code = 'SVD' AND p.name = 'SvD komplett tredagars';
INSERT INTO rate_plans (product_id, code, name, price, category)
SELECT p.id, 'M', 'Rate Plan Month', 79, 'standard'
FROM products p
JOIN brands b ON p.brand_id = b.id
WHERE b.code = 'PM' AND p.name = 'Podme NO';
INSERT INTO rate_plans (product_id, code, name, price, category)
SELECT p.id, 'YM', 'Rate Plan Year/month', 149, 'standard'
FROM products p
JOIN brands b ON p.brand_id = b.id
WHERE b.code = 'VK' AND p.name = 'Vektklubb';
INSERT INTO rate_plans (product_id, code, name, price, category)
SELECT p.id, 'HM', 'Rate plan 6-month/month', 199, 'standard'
FROM products p
JOIN brands b ON p.brand_id = b.id
WHERE b.code = 'VK' AND p.name = 'Vektklubb';
INSERT INTO rate_plans (product_id, code, name, price, category)
SELECT p.id, 'QM', 'Rate plan quarter/month', 249, 'standard'
FROM products p
JOIN brands b ON p.brand_id = b.id
WHERE b.code = 'VK' AND p.name = 'Vektklubb';
INSERT INTO rate_plans (product_id, code, name, price, category)
SELECT p.id, 'APP_3M', 'Rate Plan In-app 3 mån', 749, 'app'
FROM products p
JOIN brands b ON p.brand_id = b.id
WHERE b.code = 'VK' AND p.name = 'Vektklubb';
INSERT INTO rate_plans (product_id, code, name, price, category)
SELECT p.id, 'YM', 'Rate Plan Year/month', 199, 'standard'
FROM products p
JOIN brands b ON p.brand_id = b.id
WHERE b.code = 'W' AND p.name = 'Wellobe';
INSERT INTO rate_plans (product_id, code, name, price, category)
SELECT p.id, 'HM', 'Rate plan 6-month/month', 229, 'standard'
FROM products p
JOIN brands b ON p.brand_id = b.id
WHERE b.code = 'W' AND p.name = 'Wellobe';
INSERT INTO rate_plans (product_id, code, name, price, category)
SELECT p.id, 'QM', 'Rate plan quarter/month', 279, 'standard'
FROM products p
JOIN brands b ON p.brand_id = b.id
WHERE b.code = 'W' AND p.name = 'Wellobe';
INSERT INTO rate_plans (product_id, code, name, price, category)
SELECT p.id, 'APP_6M', 'Rate Plan in-app 6 mån', 1470, 'app'
FROM products p
JOIN brands b ON p.brand_id = b.id
WHERE b.code = 'W' AND p.name = 'Wellobe';