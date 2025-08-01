# Naming Standards Hub - Frontend Edition

A **frontend-only** version of the Naming Standards Hub that runs entirely in the browser using SQLite (via SQL.js) for data storage. Perfect for static hosting and offline usage. Future versions may include a backend, and user login.

## 🚀 **Quick Start**

### **Option 1: Static File Hosting**
1. Upload the entire folder to any static hosting service:
   - **Netlify**: Drag & drop the folder to netlify.com
   - **Vercel**: `npx vercel --prod`
   - **GitHub Pages**: Push to repository and enable Pages
   - **Local Server**: `python -m http.server 8000` or any local server

### **Option 2: Direct File Opening**
Simply open `index.html` in your browser (some features may be limited due to CORS).

## 📁 **Project Structure**

```
naming-standards-hub-frontend/
├── index.html                  # Main application page
├── css/
│   ├── main.css               # Core styles
│   ├── components.css         # Component styles  
│   └── responsive.css         # Mobile responsive styles
├── js/
│   ├── lib/
│   │   ├── sql-wasm.js       # SQL.js library (50KB)
│   │   └── sql-wasm.wasm     # SQLite WASM engine (599KB)
│   ├── config.js             # Static configuration
│   ├── sql-database.js       # SQLite database wrapper
│   ├── data-manager.js       # Data persistence & backups
│   ├── database.js           # Database service layer
│   ├── auth.js               # Simplified authentication
│   ├── promocode.js          # Promocode business logic
│   ├── navigation.js         # UI navigation logic
│   └── main.js               # Application initialization
├── database/
│   ├── schema.sql            # SQLite database schema
│   └── sample-data.sql       # Sample data for development
├── assets/
│   └── icons/                # Application icons
└── README.md                 # This file
```

## 🗄️ **Database**

### **Technology**
- **SQLite** running in browser via [SQL.js](https://sql.js.org/)
- **Storage**: Browser localStorage (persistent across sessions)
- **Backup**: Export/import .db files + automatic backups
- **Size**: ~650KB total (SQL.js library)

### **Tables**
- `brands` - Norwegian & Swedish media companies
- `products` - Subscription products per brand  
- `rate_plan_types` - Standardized subscription periods
- `rate_plans` - Pricing for products
- `generations` - History of generated names

### **Sample Data Included**
- **8 Brands**: VG, Bergens Tidende, Aftonbladet, Göteborgs-Posten, etc.
- **13 Products**: Plus, Premium, Digital subscriptions
- **19 Rate Plan Types**: Monthly, Quarterly, Regional variants
- **50+ Rate Plans**: Realistic Norwegian/Swedish pricing

## 🔐 **Authentication**

### **Demo Accounts** (Built-in)
- **VG Demo**: `demo@vg.no` / `demo123`
- **Aftonbladet Demo**: `demo@aftonbladet.se` / `demo123`  
- **Admin**: `admin@namingstandards.app` / `admin123`

### **Features**
- ✅ Simple demo authentication (no external services)
- ✅ User session persistence in localStorage
- ✅ Role-based access (editor, admin)
- ✅ No server required

## 💾 **Data Management**

### **Automatic Features**
- **Auto-save**: Every 30 seconds to localStorage
- **Caching**: 5-minute cache for database queries
- **Backups**: Up to 5 automatic backups maintained
- **Persistence**: Data survives browser restarts

### **Manual Operations**
```javascript
// Save current state
window.dataManager.save();

// Create named backup
window.dataManager.createBackup("Before Major Changes");

// Export to downloadable file
window.dataManager.exportToFile("my-database.db");

// Import database from file
window.dataManager.importFromFile(fileObject);

// Reset to fresh sample data
window.dataManager.reset();
```

## 🎯 **Features**

### **Core Functionality**
- ✅ **Promocode Generation** - Unified Norwegian/Swedish logic
- ✅ **Rate Plan Management** - Complex pricing structures
- ✅ **Multi-brand Support** - 8 media companies included
- ✅ **Generation History** - Track all generated codes
- ✅ **Reverse Engineering** - Decode existing promocodes

### **Platform Support** (Ready for expansion)
- 🎟️ **Promocodes** - Fully implemented
- 🔗 **UTM Standards** - Structure ready
- 📱 **Braze** - Structure ready  
- 📊 **VEV** - Structure ready
- 🏷️ **Sales Poster** - Structure ready

## 🔧 **Configuration**

Edit `js/config.js` to customize:

```javascript
window.AppConfig = {
    // Demo accounts
    DEMO_ACCOUNTS: [...],
    
    // Auto-save settings
    SETTINGS: {
        AUTO_SAVE: true,
        AUTO_SAVE_INTERVAL: 30000
    },
    
    // Platform enablement
    PLATFORMS: {
        PROMOCODES: { enabled: true },
        UTM: { enabled: true }
    }
};
```

## 📊 **Browser Storage Usage**

| Component | Typical Size | Notes |
|-----------|-------------|--------|
| SQLite Database | 50-200KB | Depends on data volume |
| Backup History | 100-500KB | Up to 5 backups |
| User Settings | 1-5KB | Preferences, session |
| **Total** | **~500KB** | All data stored locally |

## 🌍 **Browser Compatibility**

| Browser | Status | Notes |
|---------|--------|-------|
| Chrome 57+ | ✅ Full | Recommended |
| Firefox 52+ | ✅ Full | Full support |
| Safari 11+ | ✅ Full | Works well |
| Edge 16+ | ✅ Full | Modern Edge |
| Mobile | ✅ Limited | Basic functionality |

**Requirements**: 
- WebAssembly support
- localStorage (2MB+ available)
- Modern JavaScript (ES6+)

## 🚀 **Deployment Examples**

### **Netlify**
```bash
# Drag and drop folder to netlify.com
# Or via CLI:
npm install -g netlify-cli
netlify deploy --prod --dir naming-standards-hub-frontend
```

### **Vercel**
```bash
npm install -g vercel
cd naming-standards-hub-frontend
vercel --prod
```

### **GitHub Pages**
1. Create repository
2. Upload files to `main` branch
3. Enable Pages in Settings → Pages → Source: Deploy from branch

### **Local Development**
```bash
# Python 3
python -m http.server 8000

# Node.js
npx serve .

# PHP
php -S localhost:8000
```

## 🛠️ **Development**

### **Adding New Brands**
1. Add to `database/sample-data.sql`:
```sql
INSERT INTO brands (code, name, country) VALUES ('XYZ', 'New Brand', 'NO');
```

2. Add products and rate plans for the brand
3. Reload application to apply changes

### **Adding New Rate Plan Types**
```sql
INSERT INTO rate_plan_types (code, name, category, sort_order) 
VALUES ('CUSTOM', 'Custom Plan', 'special', 999);
```

### **Customizing Business Logic**
- Edit `js/promocode.js` for promocode generation rules
- Edit `js/database.js` for data access patterns
- Edit `css/` files for styling changes

## 📝 **Changelog**

### **v2.0.0 - Frontend Edition**
- ✅ Complete migration from Supabase to SQLite
- ✅ Frontend-only architecture (no server required)
- ✅ Local data storage with backup/restore
- ✅ Simplified authentication system
- ✅ Enhanced rate plan management
- ✅ Improved error handling and initialization

### **v1.0.0 - Original Version**
- Supabase backend with Node.js server
- Server-side authentication
- Cloud database storage

## ❓ **Troubleshooting**

### **Application Won't Load**
1. Check browser console for errors
2. Ensure all files are served over HTTP/HTTPS (not file://)
3. Clear browser cache and localStorage
4. Try incognito/private browsing mode

### **Database Issues**
```javascript
// Check database status
console.log(window.sqlDB.isReady());
console.log(window.sqlDB.getStats());

// Reset to defaults
window.dataManager.reset();
```

### **Performance Issues**
- Database is limited to ~2MB by localStorage
- Consider periodic data cleanup
- Export/import large datasets instead of storing locally

## 📞 **Support**

This is a frontend-only application that runs entirely in your browser. No external services or APIs are required.

**Need help?**
- Check browser console for error messages
- Verify file structure matches documentation
- Test with sample data first
- Use browser developer tools for debugging

---

## 🎯 **Perfect for:**
- ✅ **Static hosting** (Netlify, Vercel, GitHub Pages)
- ✅ **Offline usage** (works without internet)
- ✅ **Demo environments** (no backend setup required)
- ✅ **Personal use** (data stays on your device)
- ✅ **Rapid prototyping** (deploy instantly)

**Built with:** Vanilla JavaScript, SQLite (SQL.js), HTML5, CSS3