# AI Prompt Template for Adding New Features to Codex Nova

Use this template when asking AI to add new features to the Codex Nova application.

## Template

```
I want to add a new feature to Codex Nova: [FEATURE NAME]

**Feature Description:**
[Describe what the feature should do]

**User Story:**
As a [user type], I want to [action] so that [benefit].

**Requirements:**
- [Requirement 1]
- [Requirement 2]
- [Requirement 3]

**Important Context:**
- This is a frontend-only application using the CJC namespace pattern
- Check `/CODEBASE-INVENTORY.md` for architecture details
- Use `/js/module-template.js` as the starting point
- Follow patterns in `/js/modules/promocode.js` for reference
- Review `/FEATURE-DEVELOPMENT-GUIDE.md` for best practices

**Development Constraints:**
- Must use CJC.defineModule() - no global functions
- Must emit/listen to events for cross-module communication
- Must work with both SQLite and mock data fallback
- Must include responsive design (mobile-first)
- Must follow existing UI patterns (cards, forms, etc.)

**Please implement this feature following the established patterns.**
```

## Example Usage

### Example 1: Adding a QR Code Generator

```
I want to add a new feature to Codex Nova: QR Code Generator

**Feature Description:**
Generate QR codes for promocodes, URLs, and other marketing materials. The QR codes should be customizable with brand colors and logos.

**User Story:**
As a marketing manager, I want to generate QR codes for promocodes so that I can include them in print materials and posters.

**Requirements:**
- Generate QR codes from any text input
- Support promocode integration (auto-fill from promocode generator)
- Allow size customization (small, medium, large)
- Support brand color customization
- Enable logo embedding in center of QR code
- Provide download options (PNG, SVG)
- Save to history with parameters

**Important Context:**
- This is a frontend-only application using the CJC namespace pattern
- Check `/CODEBASE-INVENTORY.md` for architecture details
- Use `/js/module-template.js` as the starting point
- Follow patterns in `/js/modules/promocode.js` for reference
- Review `/FEATURE-DEVELOPMENT-GUIDE.md` for best practices

**Development Constraints:**
- Must use CJC.defineModule() - no global functions
- Must emit/listen to events for cross-module communication
- Must work with both SQLite and mock data fallback
- Must include responsive design (mobile-first)
- Must follow existing UI patterns (cards, forms, etc.)

**Please implement this feature following the established patterns.**
```

### Example 2: Adding Email Template Builder

```
I want to add a new feature to Codex Nova: Email Template Builder

**Feature Description:**
Create standardized email templates with dynamic variables for different brands and campaigns. Templates should follow naming conventions and brand guidelines.

**User Story:**
As an email marketer, I want to generate consistent email templates so that I can maintain brand standards across all communications.

**Requirements:**
- Select email type (promotional, transactional, newsletter)
- Choose brand (integrates with existing brand selector)
- Fill in template variables (subject, preheader, CTA)
- Preview email with brand styling
- Generate HTML and plain text versions
- Copy to clipboard functionality
- Integration with UTM link generator

**Important Context:**
- This is a frontend-only application using the CJC namespace pattern
- Check `/CODEBASE-INVENTORY.md` for architecture details
- Use `/js/module-template.js` as the starting point
- Follow patterns in `/js/modules/promocode.js` for reference
- Review `/FEATURE-DEVELOPMENT-GUIDE.md` for best practices

**Development Constraints:**
- Must use CJC.defineModule() - no global functions
- Must emit/listen to events for cross-module communication
- Must work with both SQLite and mock data fallback
- Must include responsive design (mobile-first)
- Must follow existing UI patterns (cards, forms, etc.)

**Please implement this feature following the established patterns.**
```

## Key Points for AI to Remember

### 1. File Structure
```
/js/modules/[feature-name].js  # Module implementation
/index.html                     # Add navigation item and content tab
/css/components.css             # Add feature-specific styles if needed
```

### 2. Module Structure
```javascript
CJC.defineModule('featureName', function(api) {
    const { utils, events, config } = api;
    
    // Private state
    let privateData = null;
    
    // Private functions
    function doSomethingPrivate() { }
    
    // Public API
    return {
        initialize() { },
        destroy() { }
    };
});
```

### 3. Integration Steps
1. Create module file using template
2. Add navigation item to sidebar
3. Add content tab to main area
4. Register in navigation module
5. Listen for brand changes if needed
6. Emit events for other modules

### 4. Database Integration
- Check if new tables are needed
- Update schema.sql if required
- Add mock data support
- Use existing database module patterns

### 5. UI Patterns
- Use `.card` for content containers
- Use `.form-control` for inputs
- Use `.generate-btn` for main actions
- Follow existing form layouts
- Include loading states
- Show notifications for feedback

### 6. Event Integration
```javascript
// Listen to brand changes
events.on('brand:changed', function(data) {
    updateFeatureForBrand(data);
});

// Emit feature-specific events
events.emit('feature:completed', result);
```

### 7. Common Utilities
```javascript
// Notifications
utils.notify('Success!', 'success');
utils.notify('Error occurred', 'error');

// Copy to clipboard
utils.copyToClipboard(text);

// Generate IDs
const id = utils.generateId('feature');

// Debounce
const debouncedFn = utils.debounce(fn, 300);
```

## Testing Checklist

When implementing a new feature, ensure:

- [ ] Module loads without errors
- [ ] No global functions created
- [ ] Navigation works correctly
- [ ] Brand selection integration works
- [ ] Events fire correctly
- [ ] Form validation works
- [ ] Responsive design works on mobile
- [ ] Loading states display properly
- [ ] Error handling shows notifications
- [ ] History saves correctly (if applicable)
- [ ] Mock data fallback works
- [ ] No console errors
- [ ] Feature can be destroyed/cleaned up

## Additional Resources

- **Architecture**: `/CODEBASE-INVENTORY.md`
- **Development Guide**: `/FEATURE-DEVELOPMENT-GUIDE.md`
- **Module Template**: `/js/module-template.js`
- **Example Module**: `/js/modules/promocode.js`
- **CJC Namespace**: `/js/cjc-namespace.js`
- **UI Styles**: `/css/components.css`

## Tips for Success

1. **Start Simple**: Get basic functionality working first
2. **Follow Patterns**: Use existing modules as reference
3. **Test Early**: Check console for errors frequently
4. **Use Events**: Don't directly call other modules
5. **Keep Private**: Only expose necessary functions
6. **Handle Errors**: Always provide user feedback
7. **Document**: Add comments for complex logic
8. **Stay Focused**: One feature per module

This template ensures consistent, high-quality feature development that integrates seamlessly with the existing Codex Nova architecture.