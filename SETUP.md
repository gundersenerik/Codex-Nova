# Codex Nova - Setup Instructions

## Quick Start

1. **Configure Airtable Connection**
   ```bash
   # Copy the example config file
   cp js/config.example.js js/config.js
   
   # Edit js/config.js and add your credentials
   ```

2. **Get Your Airtable Credentials**
   - **Base ID**: 
     - Go to your Airtable base
     - The URL will be: `https://airtable.com/app[YOUR_BASE_ID]/...`
     - Copy the part that starts with `app`
   
   - **Personal Access Token**:
     - Go to https://airtable.com/account
     - Click on "Generate new token"
     - Give it a name and appropriate scopes
     - Copy the token (starts with `pat...`)

3. **Update js/config.js**
   ```javascript
   window.ENV = {
       AIRTABLE_BASE_ID: 'appXXXXXXXXXXXX',
       AIRTABLE_TOKEN: 'patXXXXXXXXXXXX.XXXXXXXXXX'
   };
   ```

4. **Start Development Server**
   ```bash
   ./start-dev.sh start
   ```
   
   Then open http://localhost:4200 in your browser.

## Important Notes

- **NEVER commit `js/config.js` to version control** - it contains sensitive credentials
- The `.gitignore` file is configured to exclude this file
- If you see "Airtable credentials not found!" in the console, check your config.js file

## Airtable Database Structure

Your Airtable base should have these tables:

### Brands Table
- Brand Code (Single line text)
- Brand Name (Single line text)
- Country (Single line text) - Use "NO" for Norway, "SE" for Sweden

### Products Table
- Brand (Link to Brands)
- Product Name (Single line text)
- Type (Single select) - "digital" or "print"
- Shortcode (Single line text) - Product prefix for promocodes

### Rate Plans Table
- Product (Link to Products)
- Plan Code (Single line text) - e.g., "M", "Q", "Y"
- Plan Name (Single line text)
- Price (Number)
- Category (Single select) - optional

## Troubleshooting

- **"Airtable credentials not found!"** - Check that js/config.js exists and has valid credentials
- **"Airtable API error: 401"** - Your token is invalid or expired
- **"Airtable API error: 404"** - Your Base ID is incorrect
- **No data loading** - Check browser console for errors and verify your Airtable structure