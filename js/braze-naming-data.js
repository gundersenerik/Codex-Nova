/* ============================================================================
   BRAZE NAMING DATA - Data constants for Braze naming conventions
   ============================================================================ */

// Object type definitions
const brazeObjectTypes = [
    { code: "CMP", name: "Campaign", description: "Braze Campaign" },
    { code: "CAN", name: "Canvas", description: "Braze Canvas" },
    { code: "SEG", name: "Segment", description: "Braze Segment" },
    { code: "TPL", name: "Template", description: "Braze Template" },
    { code: "WHK", name: "Webhook", description: "Braze Webhook" },
    { code: "RPT", name: "Report", description: "Braze Report" },
    { code: "TAG", name: "Tag", description: "Braze Tag" }
];

// Brand definitions - Updated with proper 2-4 letter codes
const brazeBrands = [
    { initial: "AP", fullName: "Aftenposten" },
    { initial: "AB", fullName: "Aftonbladet" },
    { initial: "BT", fullName: "Bergens Tidende" },
    { initial: "DP", fullName: "Dine Penger" },
    { initial: "E24", fullName: "E24" },
    { initial: "FT", fullName: "Full Tilgang" },
    { initial: "OM", fullName: "Omni" },
    { initial: "SA", fullName: "Stavanger Aftenblad" },
    { initial: "SVD", fullName: "Svenska Dagbladet" },
    { initial: "VG", fullName: "VG" },
    { initial: "VK", fullName: "Vektklubb" },
    { initial: "W", fullName: "Wellobe" }
];

// Package definitions (Note: FT moved to brands)
const brazePackages = [
    // Packages are optional and can be empty
];

// Flags definitions
const brazeFlags = [
    { value: "oneoff", name: "One-off", description: "One-time send" },
    { value: "abtest", name: "A/B Test", description: "A/B test variant" },
    { value: "v2", name: "Version 2", description: "Second version" },
    { value: "sv", name: "Swedish", description: "Swedish language variant" }
];

// Purpose code definitions
const brazePurposeCodes = [
    {
        id: "transactional",
        display: "Transactional Communication (1000)",
        codeValue: "1000"
    },
    {
        id: "marketing",
        display: "Marketing & Customer Journey (2000)",
        codeValue: "2000"
    },
    {
        id: "operational",
        display: "Operational (3000)",
        codeValue: "3000"
    },
    {
        id: "adhoc",
        display: "Ad-hoc/One-off (Current Year)",
        codeValue: "YEAR"
    }
];

// Communication types for Campaigns/Canvases
const brazeCommunicationTypes = [
    {
        name: "Checkout Cancelled",
        generatedString: "Checkout_Cancelled",
        validCodes: ["2000"],
        description: "Communication sent related to checkout cancelled or checkout payment failed"
    },
    {
        name: "Confirmation",
        validCodes: ["1000"],
        description: "Order confirmations for stop, address changes",
        subTypes: [
            { name: "Purchase", generatedString: "Confirmation_Purchase" },
            { name: "Stop", generatedString: "Confirmation_Stop" },
            { name: "Temporary Stop", generatedString: "Confirmation_Temporary_Stop" },
            { name: "Permanent Address Change", generatedString: "Confirmation_Permanant_Address" },
            { name: "Temporary Address Change", generatedString: "Confirmation_Temporary_Address" }
        ]
    },
    {
        name: "Digitalytelsesloven",
        generatedString: "Digitalytelsesloven",
        validCodes: ["1000"],
        description: "Information to the customer about their digital product at Schibsted"
    },
    {
        name: "Distribution",
        validCodes: ["1000"],
        description: "Failed delivery, problems with delivery",
        subTypes: [
            { name: "Late Delivery (Mon-Fri)", generatedString: "Distribution_Late_Delivery_Man_Fri" },
            { name: "Late Delivery (Sat)", generatedString: "Distribution_Late_Delivery_Sat" },
            { name: "Failed Delivery (Mon-Fri)", generatedString: "Distribution_Failed_Delivery_Man_Fri" },
            { name: "Failed Delivery (Sat)", generatedString: "Distribution_Failed_Delivery_Sat" },
            { name: "Failed Delivery User Not Found (Mon-Fri)", generatedString: "Distribution_Failed_Delivery_User_Not_Found_Man-Fri" },
            { name: "Failed Delivery User Not Found (Sat)", generatedString: "Distribution_Failed_Delivery_User_Not_Found_Sat" }
        ]
    },
    {
        name: "Engagement",
        generatedString: "Engagement",
        validCodes: ["2000", "3000", "YEAR"],
        description: "Engagement related, either ad hoc or permanent"
    },
    {
        name: "Fullprice Notification",
        generatedString: "Fullprice_Notification",
        validCodes: ["1000"],
        description: "Reminders sent when campaign price is going over to fullprice"
    },
    {
        name: "Holdback",
        generatedString: "Holdback",
        validCodes: ["2000"],
        description: "Holdback related communication"
    },
    {
        name: "Newsletter",
        generatedString: "Newsletter",
        validCodes: ["YEAR"],
        description: "All newsletters"
    },
    {
        name: "Onboarding",
        generatedString: "Onboarding",
        validCodes: ["2000"],
        description: "Onboarding related communication"
    },
    {
        name: "Payment",
        validCodes: ["1000"],
        description: "CC expire, payment reminders and payment stop",
        subTypes: [
            { name: "Reminder", generatedString: "Payment_Reminder" },
            { name: "Stop", generatedString: "Payment_Stop" },
            { name: "Credit Card Expiring", generatedString: "Payment_Creditcard_Expires" }
        ]
    },
    {
        name: "Pricing",
        generatedString: "Pricing",
        validCodes: ["YEAR"],
        description: "Communication related to price adjustments"
    },
    {
        name: "Sale",
        generatedString: "Sale",
        validCodes: ["YEAR"],
        description: "Campaigns"
    },
    {
        name: "Share",
        validCodes: ["1000"],
        description: "All communication related to sharing of subscription",
        subTypes: [
            { name: "Secondary Subscriber Invitation", generatedString: "Share_Secondary_Invitation" },
            { name: "Primary Invitation Accepted", generatedString: "Share_Primary_Invitation_Accepted" },
            { name: "Primary Share Again", generatedString: "Share_Primary_Share_Again" },
            { name: "Secondary Buy Access", generatedString: "Share_Secondary_Buy_Access" }
        ]
    },
    {
        name: "Survey",
        generatedString: "Survey",
        validCodes: ["YEAR"],
        description: "Stop survey, feedback surveys etc."
    },
    {
        name: "Transactional",
        generatedString: "Transactional",
        validCodes: ["1000"],
        description: "Receipt from sale (*only used by CCS)"
    },
    {
        name: "Upsale",
        generatedString: "Upsale",
        validCodes: ["2000", "YEAR"],
        description: "Upsale initiatives"
    },
    {
        name: "Infra",
        generatedString: "Infra",
        validCodes: ["3000"],
        description: "Infrastructure and operational objects (suppression, housekeeping, etc.)"
    },
    {
        name: "Winback",
        generatedString: "Winback",
        validCodes: ["2000"],
        description: "Winback related communication"
    }
];

// Segment Communication Types (same as campaigns/canvases for now)
const brazeSegmentCommunicationTypes = JSON.parse(JSON.stringify(brazeCommunicationTypes));

// Export for use in other modules
window.brazeNamingData = {
    objectTypes: brazeObjectTypes,
    brands: brazeBrands,
    packages: brazePackages,
    purposeCodes: brazePurposeCodes,
    communicationTypes: brazeCommunicationTypes,
    segmentCommunicationTypes: brazeSegmentCommunicationTypes,
    flags: brazeFlags
};