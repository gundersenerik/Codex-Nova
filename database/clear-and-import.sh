#!/bin/bash
# ============================================================================
# COMPLETE IMPORT SCRIPT WITH CACHE CLEARING
# This script imports new data and clears all caches
# ============================================================================

echo "🚀 Starting Codex Nova Database Import..."
echo ""

# Step 1: Stop the application
echo "📦 Step 1: Stopping application..."
./start-dev.sh stop

# Step 2: Check current state (optional)
echo ""
echo "📊 Step 2: Checking current database state..."
sqlite3 database/naming-standards.db < database/check-product-names.sql | head -20

# Step 3: Run the import
echo ""
echo "⚙️ Step 3: Importing new data..."
sqlite3 database/naming-standards.db < database/codex-nova-import.sql

# Step 4: Verify import
echo ""
echo "✅ Step 4: Verifying import..."
sqlite3 database/naming-standards.db "SELECT b.code, p.name FROM products p JOIN brands b ON p.brand_id = b.id WHERE b.code = 'AP' LIMIT 5;"

# Step 5: Clear browser caches
echo ""
echo "🧹 Step 5: Clearing caches..."
echo "NOTE: Browser cache will be cleared when you reload the page"

# Step 6: Restart application
echo ""
echo "🔄 Step 6: Restarting application..."
./start-dev.sh start

echo ""
echo "✨ Import complete!"
echo ""
echo "📌 IMPORTANT NEXT STEPS:"
echo "1. Open http://localhost:4200"
echo "2. Open browser DevTools (F12)"
echo "3. In Console, run: localStorage.clear()"
echo "4. Hard refresh: Cmd+Shift+R (Mac) or Ctrl+Shift+R (PC)"
echo "5. Check Promocodes section - products should show WITHOUT brand prefixes"
echo ""
echo "Example: You should see 'Solo' not 'Aftenposten Solo'"