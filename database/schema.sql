-- ============================================================================
-- NAMING STANDARDS HUB - SQLite Database Schema
-- ============================================================================

-- Enable foreign key constraints
PRAGMA foreign_keys = ON;

-- ============================================================================
-- BRANDS TABLE - Norwegian & Swedish Media Companies
-- ============================================================================
CREATE TABLE IF NOT EXISTS brands (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    code TEXT UNIQUE NOT NULL,           -- VG, BT, AB, GP, etc.
    name TEXT NOT NULL,                  -- Full brand name
    country TEXT NOT NULL CHECK (country IN ('NO', 'SE')),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================================
-- PRODUCTS TABLE - Subscription Products per Brand
-- ============================================================================
CREATE TABLE IF NOT EXISTS products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    brand_id INTEGER NOT NULL,
    name TEXT NOT NULL,                  -- "VG+", "Aftonbladet Plus"
    type TEXT NOT NULL,                  -- "digital" or "print"
    shortcode TEXT,                      -- Product-specific shortcode (e.g., OM, OMB, OME)
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (brand_id) REFERENCES brands(id) ON DELETE CASCADE
);

-- ============================================================================
-- RATE PLAN TYPES TABLE - Standardized Plan Codes
-- ============================================================================
CREATE TABLE IF NOT EXISTS rate_plan_types (
    code TEXT PRIMARY KEY,               -- M, Q, Y, SE_ST_M, etc.
    name TEXT NOT NULL,                  -- "Monthly", "Stockholm Monthly"
    category TEXT DEFAULT 'standard',    -- standard, regional, app
    is_active BOOLEAN DEFAULT 1,
    sort_order INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================================
-- RATE PLANS TABLE - Pricing for Products
-- ============================================================================
CREATE TABLE IF NOT EXISTS rate_plans (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    product_id INTEGER NOT NULL,
    code TEXT NOT NULL,                  -- M, Q, Y, etc.
    name TEXT NOT NULL,                  -- "Monthly", "Quarterly", etc.
    price INTEGER NOT NULL,              -- Price in local currency (NOK/SEK)
    category TEXT DEFAULT 'standard',    -- standard, regional, app, business
    sort_order INTEGER DEFAULT 100,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    UNIQUE(product_id, code)             -- Prevent duplicate plans for same product
);

-- ============================================================================
-- GENERATIONS TABLE - History of Generated Names
-- ============================================================================
CREATE TABLE IF NOT EXISTS generations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id TEXT,                        -- Simple user identifier
    platform TEXT NOT NULL,             -- promocodes, utm, braze, etc.
    generated_name TEXT NOT NULL,        -- The generated code/name
    parameters TEXT,                     -- JSON string of generation parameters
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================================
-- INDEXES for Performance
-- ============================================================================
CREATE INDEX IF NOT EXISTS idx_products_brand_id ON products(brand_id);
CREATE INDEX IF NOT EXISTS idx_rate_plans_product_id ON rate_plans(product_id);
CREATE INDEX IF NOT EXISTS idx_rate_plans_code ON rate_plans(code);
CREATE INDEX IF NOT EXISTS idx_generations_platform ON generations(platform);
CREATE INDEX IF NOT EXISTS idx_generations_created_at ON generations(created_at);

-- ============================================================================
-- VIEWS for Common Queries
-- ============================================================================

-- View: Rate plans with type information
CREATE VIEW IF NOT EXISTS rate_plans_with_types AS
SELECT 
    rp.id,
    rp.product_id,
    rp.code,
    rpt.name as plan_type_name,
    rpt.category,
    rp.price,
    rp.created_at
FROM rate_plans rp
JOIN rate_plan_types rpt ON rp.code = rpt.code
WHERE rpt.is_active = 1;

-- View: Products with brand information
CREATE VIEW IF NOT EXISTS products_with_brands AS
SELECT 
    p.id,
    p.name as product_name,
    p.brand_id,
    b.code as brand_code,
    b.name as brand_name,
    b.country,
    p.created_at
FROM products p
JOIN brands b ON p.brand_id = b.id;

-- ============================================================================
-- BRAZE NAMING HISTORY TABLE - Store Braze naming convention history
-- ============================================================================
CREATE TABLE IF NOT EXISTS braze_naming_history (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name_type TEXT NOT NULL CHECK (name_type IN ('campaign', 'canvas', 'segment')),
    generated_name TEXT NOT NULL,
    purpose_code TEXT,
    brand TEXT,
    package TEXT,
    comm_type TEXT,
    specific_type TEXT,
    custom_suffix TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    created_by TEXT
);

-- Create index for Braze naming history
CREATE INDEX IF NOT EXISTS idx_braze_naming_type ON braze_naming_history(name_type);
CREATE INDEX IF NOT EXISTS idx_braze_naming_created_at ON braze_naming_history(created_at);