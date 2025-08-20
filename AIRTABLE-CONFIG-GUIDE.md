# Airtable Configuration Guide

## ✅ Migration Complete!
The application has been successfully migrated from SQLite to Airtable. Follow these steps to configure your Airtable connection.

## 🔧 Configuration Steps

### 1. Get Your Airtable Credentials

1. **Base ID**:
   - Open your Airtable base
   - Look at the URL: `https://airtable.com/appXXXXXXXXXXXXXX/...`
   - The part starting with `app` is your Base ID (e.g., `appABC123DEF456`)

2. **Personal Access Token**:
   - Go to https://airtable.com/create/tokens
   - Click "Create new token"
   - Give it a name (e.g., "Codex Nova")
   - Add these scopes:
     - `data.records:read` for all tables
   - Select your base from the list
   - Click "Create token"
   - Copy the token (starts with `pat...`)
   - **SAVE THIS TOKEN** - you won't be able to see it again!

### 2. Update Configuration

Edit `js/database-airtable.js` and update lines 6-7:

```javascript
const AIRTABLE_CONFIG = {
    BASE_ID: 'appYOUR_BASE_ID_HERE',  // Replace with your Base ID
    PERSONAL_ACCESS_TOKEN: 'patYOUR_TOKEN_HERE',  // Replace with your token
    BASE_URL: 'https://api.airtable.com/v0'
};
```

### 3. Airtable Table Structure

Ensure your Airtable base has these tables with the exact field names:

#### **Brands** Table
| Field Name | Type | Required |
|------------|------|----------|
| Brand Code | Single line text | Yes |
| Brand Name | Single line text | Yes |
| Country | Single line text | Yes |

#### **Products** Table
| Field Name | Type | Required |
|------------|------|----------|
| Product Name | Single line text | Yes |
| Brand | Link to Brands | Yes |
| Type | Single line text | No |
| Shortcode | Single line text | No |

#### **Rate Plans** Table
| Field Name | Type | Required |
|------------|------|----------|
| Plan Code | Single line text | Yes |
| Plan Name | Single line text | Yes |
| Product | Link to Products | Yes |
| Price | Number | Yes |
| Category | Single line text | No |

### 4. Import Your Data

If you have existing data from the SQLite database:

1. Export from SQLite (if you have a backup):
   - Brands: 18 records
   - Products: 79 records
   - Rate Plans: 260 records

2. Import to Airtable:
   - Use Airtable's CSV import feature
   - Or manually create records
   - Ensure linking fields are properly connected

### 5. Test the Connection

1. Start the development server:
   ```bash
   ./start-dev.sh start
   ```

2. Open http://localhost:4200

3. Check the browser console for:
   - "✅ Airtable database initialized"
   - "📊 Airtable connected - X brands available"

4. Try selecting a brand in the Promocode section

## 🎯 Benefits of Airtable

- **No localStorage limits** - All data stored in cloud
- **Easy data management** - Use Airtable's UI to update brands/products
- **Real-time updates** - Changes reflect immediately (5-min cache)
- **Smaller app size** - Removed 650KB of WASM files
- **Simpler codebase** - No complex SQLite initialization

## ⚠️ Important Notes

### Security Consideration
The Personal Access Token will be visible in the browser's developer tools. For production:
- Consider using a proxy server to hide the token
- Or use Airtable's official SDK with proper authentication
- Limit token permissions to read-only access

### Rate Limits
- Airtable API: 5 requests per second
- The app uses 5-minute caching to minimize API calls

### Internet Connection
- The app now requires internet connection to fetch data
- Consider adding offline fallback if needed

## 🚨 Troubleshooting

### "Airtable API error: 401"
- Check your Personal Access Token is correct
- Verify token has read permissions for your base

### "Airtable API error: 404"
- Check your Base ID is correct
- Verify table names match exactly (case-sensitive)

### "Failed to connect to Airtable"
- Check internet connection
- Verify Airtable base is not deleted/archived
- Check browser console for CORS errors

## 📝 Files Changed

### Created:
- `js/database-airtable.js` - New Airtable database service

### Updated:
- `js/main.js` - Simplified initialization for Airtable
- `index.html` - Replaced SQLite scripts with Airtable

### Moved to Legacy:
- `js/sql-database.js` → `Legacy/js/old-versions/`
- `js/database.js` → `Legacy/js/old-versions/`
- `js/database-initializer.js` → `Legacy/js/old-versions/`
- `js/lib/sql-wasm.js` → `Legacy/js/old-versions/`
- `js/lib/sql-wasm.wasm` → `Legacy/js/old-versions/`
- All SQLite-related module files

## ✅ Next Steps

1. Configure your Airtable credentials (see step 2 above)
2. Set up your Airtable tables (see step 3 above)
3. Import your data (see step 4 above)
4. Test the application (see step 5 above)

Once configured, your app will fetch data directly from Airtable!