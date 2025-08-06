/* ============================================================================
   BRAZE NAMING V2 DATA - Clean data structure for Braze naming conventions
   ============================================================================ */

window.brazeNamingV2Data = {
    // Object type definitions
    objectTypes: [
        { code: "CMP", name: "Campaign", description: "Braze Campaign" },
        { code: "CAN", name: "Canvas", description: "Braze Canvas" },
        { code: "SEG", name: "Segment", description: "Braze Segment" },
        { code: "TPL", name: "Template", description: "Braze Template" },
        { code: "WHK", name: "Webhook", description: "Braze Webhook" },
        { code: "RPT", name: "Report", description: "Braze Report" },
        { code: "TAG", name: "Tag", description: "Braze Tag" }
    ],
    
    // Code definitions
    codes: [
        { 
            value: "1000", 
            name: "Transactional", 
            description: "Must-send, account & subscription flows",
            optOut: "No (mandatory)"
        },
        { 
            value: "2000", 
            name: "Marketing / Journey", 
            description: "Lifecycle and revenue-driving flows",
            optOut: "Yes (footer unsubscribe)"
        },
        { 
            value: "3000", 
            name: "Operational", 
            description: "Backend or housekeeping objects that never reach the customer",
            optOut: "N/A"
        },
        { 
            value: "YYYY", 
            name: "One-off / Year-bound", 
            description: "Seasonal or ad-hoc sends best grouped by calendar year",
            optOut: "Yes"
        }
    ],
    
    // Brand definitions
    brands: [
        { code: "AP", name: "Aftenposten" },
        { code: "AB", name: "Aftonbladet" },
        { code: "BT", name: "Bergens Tidende" },
        { code: "DP", name: "Dine Penger" },
        { code: "E24", name: "E24" },
        { code: "FT", name: "Full Tilgang" },
        { code: "OM", name: "Omni" },
        { code: "SA", name: "Stavanger Aftenblad" },
        { code: "SVD", name: "Svenska Dagbladet" },
        { code: "VG", name: "VG" },
        { code: "VK", name: "Vektklubb" },
        { code: "W", name: "Wellobe" }
    ],
    
    // Communication type definitions with default code mappings
    communicationTypes: [
        // 1000 - Transactional (default)
        { 
            tag: "Confirmation", 
            defaultCode: "1000", 
            purpose: "Order, stop, address-change receipts" 
        },
        { 
            tag: "Distribution", 
            defaultCode: "1000", 
            purpose: "Failed / late delivery notices" 
        },
        { 
            tag: "Payment", 
            defaultCode: "1000", 
            purpose: "Card-expiry, payment reminders & stop" 
        },
        { 
            tag: "FullpriceNotification", 
            defaultCode: "1000", 
            purpose: "Campaign-to-full-price rollover alerts" 
        },
        { 
            tag: "Digitalytelsesloven", 
            defaultCode: "1000", 
            purpose: "Mandatory info on digital rights" 
        },
        { 
            tag: "CheckoutCancelled", 
            defaultCode: "1000", 
            purpose: "Checkout failure notices" 
        },
        { 
            tag: "TransactionalReceipt", 
            defaultCode: "1000", 
            purpose: "CCS receipts (internal naming)" 
        },
        
        // 2000 - Marketing (default)
        { 
            tag: "Onboarding", 
            defaultCode: "2000", 
            purpose: "First-time customer welcome flows" 
        },
        { 
            tag: "Engagement", 
            defaultCode: "2000", 
            purpose: "Habit-building nudges, non-promo" 
        },
        { 
            tag: "Upsale", 
            defaultCode: "2000", 
            purpose: "Cross-sell & add-on offers (always-on)" 
        },
        { 
            tag: "Holdback", 
            defaultCode: "2000", 
            purpose: "Control-group communications" 
        },
        { 
            tag: "Winback", 
            defaultCode: "2000", 
            purpose: "Offers to lapsed subscribers" 
        },
        { 
            tag: "Newsletter", 
            defaultCode: "2000", 
            purpose: "Editorial or product newsletters" 
        },
        { 
            tag: "Sale", 
            defaultCode: "2000", 
            purpose: "Promo campaigns, seasonal offers" 
        },
        { 
            tag: "Share", 
            defaultCode: "2000", 
            purpose: "Share your subscription flows" 
        },
        { 
            tag: "Pricing", 
            defaultCode: "2000", 
            purpose: "Annual price-adjustment notices" 
        },
        { 
            tag: "Survey", 
            defaultCode: "2000", 
            purpose: "Feedback, stop-reason, NPS surveys" 
        },
        { 
            tag: "RetentionReminder", 
            defaultCode: "2000", 
            purpose: "We miss you / Finish checkout nudges" 
        },
        
        // 3000 - Operational (default)
        { 
            tag: "Suppress", 
            defaultCode: "3000", 
            purpose: "Exclusion/suppression segments" 
        },
        { 
            tag: "DataPush", 
            defaultCode: "3000", 
            purpose: "Webhooks & data-sync canvases" 
        },
        { 
            tag: "Housekeeping", 
            defaultCode: "3000", 
            purpose: "Nightly maintenance canvases" 
        },
        { 
            tag: "Infra", 
            defaultCode: "3000", 
            purpose: "Infrastructure and operational objects" 
        }
    ],
    
    // Product-specific tags (for reference only, not used in naming)
    productTags: [
        { tag: "Junior", product: "Aftenposten Junior" },
        { tag: "Historie", product: "Aftenposten Historie" },
        { tag: "Hyttemagasinet", product: "Hyttemagasinet" },
        { tag: "Innsikt", product: "Aftenposten Innsikt" },
        { tag: "MatFraNorge", product: "Mat fra Norge" },
        { tag: "MagasinPlus", product: "Magasin +" },
        { tag: "FullTilgang", product: "Full Tilgang bundles" },
        { tag: "VGBundles", product: "VG+*, VG+ Dine Penger, VG+ Podme, etc." }
    ]
};