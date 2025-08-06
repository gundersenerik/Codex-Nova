# Codex Nova - Codebase Inventory

## 🏗️ Architecture Overview

### Application Type
- **Frontend-Only Web Application** - Runs entirely in the browser
- **Database**: SQLite via SQL.js (WebAssembly)
- **Development Server**: Python simple HTTP server (port 4200)
- **Static Hosting Compatible**: Can be deployed to any static hosting service

### Architecture Pattern
- **Namespace-Based Module System** (CJC - Codex Junior Club)
- **Event-Driven Communication** between modules
- **No Build Process Required** - Plain JavaScript modules

## 📁 Project Structure

```
/Codex Nova/
├── index.html                    # Main application entry point
├── start-dev.sh                  # Development server script
│
├── css/                          # Styling
│   ├── main.css                 # Core styles & CSS variables
│   ├── components.css           # UI component styles
│   └── responsive.css           # Mobile responsive styles
│
├── js/                          # JavaScript modules
│   ├── cjc-namespace.js         # Core namespace & module system
│   ├── module-template.js       # Template for new modules
│   ├── main.js                  # Application initialization
│   ├── config.js                # Static configuration
│   │
│   ├── modules/                 # CJC-namespaced modules
│   │   ├── auth.js              # Authentication module
│   │   ├── database.js          # Database service layer
│   │   ├── sql-database.js      # SQLite wrapper
│   │   ├── data-manager.js      # Data persistence & backups
│   │   ├── navigation.js        # UI navigation & routing
│   │   ├── promocode.js         # Promocode generator
│   │   ├── braze-naming.js      # Braze naming standards
│   │   ├── csv-importer.js      # CSV import functionality
│   │   └── mock-data.js         # Fallback mock database
│   │
│   └── lib/                     # Third-party libraries
│       ├── sql-wasm.js          # SQL.js library
│       └── sql-wasm.wasm        # SQLite WebAssembly
│
├── database/                    # Database files
│   ├── schema.sql              # SQLite schema definition
│   ├── sample-data.sql         # Sample data for development
│   └── migrate-omni.sql        # Migration scripts
│
└── assets/                     # Static assets
    └── icons/                  # Application icons
```

## 🧩 Core Components

### 1. CJC Namespace System (`js/cjc-namespace.js`)
The foundation that prevents naming conflicts and enables modular development.

**Key Features:**
- `CJC.defineModule()` - Define new modules
- `CJC.require()` - Access other modules
- `CJC.events` - Event bus for communication
- `CJC.utils` - Shared utilities
- `CJC.debug` - Development tools

### 2. Module Template (`js/module-template.js`)
Standard pattern for creating new features:
- Private variables and functions
- Public API definition
- Event handling
- Lifecycle methods (initialize, destroy)

### 3. Main Application (`js/main.js`)
Handles the application boot sequence:
1. Initialize SQLite database
2. Load/restore data
3. Initialize authentication
4. Setup UI components
5. Initialize business logic modules
6. Start auto-save

## 📦 Feature Modules

### Current Features
1. **Promocodes** - Generate standardized promotional codes
2. **UTM Standards** - Create UTM links (Purchase, Landing, Email, Campaign)
3. **Braze Naming** - Naming standards for Campaigns, Canvases, Segments
4. **VEV** - (Placeholder for future feature)
5. **Sales Poster** - (Placeholder for future feature)
6. **Reverse Lookup** - Decode promocodes and other standards
7. **History** - Track generated items

### Module Communication Pattern
```javascript
// Emit events
CJC.events.emit('brand:changed', brandData);

// Listen to events
CJC.events.on('brand:changed', function(data) {
    // React to brand change
});
```

## 🎨 UI Components & Patterns

### Layout Structure
- **Sidebar**: Navigation, search, user menu
- **Main Content**: Tab-based content areas
- **Cards**: Primary content containers
- **Forms**: Consistent form styling with validation

### Component Classes
- `.card` - Content containers
- `.form-control` - Input fields
- `.btn`, `.generate-btn` - Buttons
- `.nav-item` - Navigation items
- `.notification` - Toast notifications

### Responsive Design
- Mobile-first approach
- Breakpoints: 768px (tablet), 1024px (desktop)
- Collapsible sidebar on mobile

## 🗃️ Data Layer

### Database Schema
- **Brands** - Brand definitions (code, name, country)
- **Products** - Products per brand
- **Rate Plans** - Initial and renewal rate plans
- **Configurations** - Brand-specific configurations
- **History** - User generation history

### Data Management
- Local storage persistence
- Import/Export functionality
- Automatic backups
- Mock data fallback

## 🔧 Development Workflow

### Starting Development
```bash
# Start the development server
./start-dev.sh start

# Access at http://localhost:4200

# Stop the server
./start-dev.sh stop
```

### Adding a New Feature
1. Copy `js/module-template.js` to `js/modules/my-feature.js`
2. Modify the module name and implementation
3. Add navigation item in `index.html`
4. Add tab content in `index.html`
5. Register in navigation module
6. Test the feature

## 🎯 Best Practices

### Code Organization
- One module per file
- Private by default, expose only necessary APIs
- Use events for cross-module communication
- Never create global variables/functions

### Naming Conventions
- Module names: camelCase (e.g., `promocode`, `brazeNaming`)
- File names: kebab-case (e.g., `braze-naming.js`)
- CSS classes: kebab-case (e.g., `.form-control`)
- Event names: colon-separated (e.g., `user:login`)

### Error Handling
- Use `CJC.utils.notify()` for user notifications
- Log errors to console for debugging
- Graceful fallbacks (e.g., mock data)

## 🚀 Extension Points

### Adding New Modules
1. Define module using `CJC.defineModule()`
2. Implement required methods (initialize, destroy)
3. Expose public API
4. Emit/listen to events as needed

### Adding New UI Components
1. Add HTML structure to `index.html`
2. Style in `components.css`
3. Add responsive rules in `responsive.css`
4. Handle interactions in module

### Database Extensions
1. Add tables to `schema.sql`
2. Update database module with new queries
3. Add mock data support
4. Test with both SQLite and mock data

## 📊 Module Dependencies

```
main.js
  ├── cjc-namespace.js (required first)
  ├── sql-database.js
  ├── database.js
  ├── auth.js
  ├── navigation.js
  └── [feature modules]
      ├── promocode.js
      ├── braze-naming.js
      └── csv-importer.js
```

## 🔍 Debugging Tools

```javascript
// List all loaded modules
CJC.debug.listModules();

// Check for global function conflicts
CJC.debug.checkConflicts();

// View active event listeners
CJC.debug.listEvents();

// Access any module
const module = CJC.require('moduleName');
```

## 📝 Configuration

### Static Config (`js/config.js`)
- API endpoints (if any)
- Feature flags
- Default values
- Constants

### Runtime Config
- User preferences (stored in localStorage)
- Session data
- Cached data with TTL

## 🎪 Event Catalog

Common events used across modules:
- `module:loaded` - When a module is loaded
- `config:updated` - When configuration changes
- `user:login` - User authentication
- `user:logout` - User sign out
- `data:saved` - When data is persisted
- `brand:changed` - Brand selection change
- `[module]:initialized` - Module-specific initialization

## 💡 Tips for AI/Developers

1. **Always use the CJC namespace** - Never create global functions
2. **Check existing patterns** - Look at promocode.js for reference
3. **Use the module template** - Start from module-template.js
4. **Test with both databases** - SQLite and mock data
5. **Follow the initialization sequence** - See main.js
6. **Use events for loose coupling** - Don't directly call other modules
7. **Keep modules focused** - Single responsibility principle
8. **Document public APIs** - Clear comments on return values

## 🚨 Migration Status

The codebase has been migrated from global functions to the CJC namespace pattern. Key improvements:

- **Before**: 100+ global functions causing conflicts
- **After**: All functionality encapsulated in CJC modules
- **Conflicts Resolved**: No more duplicate function names
- **Future-Proof**: New features can be added without conflicts

All modules now follow the pattern shown in `js/module-template.js` and communicate via the event bus.