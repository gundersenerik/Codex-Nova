// data.js

// -----------------------------------------------------------------------------
// DATA FOR NAMING CONVENTION GENERATOR
// -----------------------------------------------------------------------------

/**
 * @typedef {Object} Brand
 * @property {string} initial - The brand's abbreviation (e.g., "AP").
 * @property {string} fullName - The brand's full name (e.g., "Aftenposten").
 */

/** @type {Brand[]} */
const brands = [
    { initial: "AP", fullName: "Aftenposten" },
    { initial: "BT", fullName: "Bergens Tidende" },
    { initial: "SA", fullName: "Stavanger Aftenblad" },
    { initial: "VG", fullName: "VG" },
    { initial: "E24", fullName: "E24" },
    { initial: "DP", fullName: "Dine Penger" },
    { initial: "VK", fullName: "Vektklubb" },
    { initial: "Vink", fullName: "Vink" },
    { initial: "Vinklubben", fullName: "Vinklubben" },
    { initial: "Magasin+", fullName: "Magasin+" },
    { initial: "Innsikt", fullName: "Aftenposten Innsikt" },
    { initial: "Historie", fullName: "Aftenposten Historie" },
    { initial: "MFN", fullName: "Mat fra Norge" },
    { initial: "Hytte", fullName: "Hyttemagasinet" },
    { initial: "APJR", fullName: "Aftenposten Junior" },
    { initial: "AB", fullName: "Aftonbladet" },
    { initial: "SvD", fullName: "Svenska Dagbladet" },
    { initial: "Omni", fullName: "Omni" },
    { initial: "OmniEko", fullName: "Omni Ekonomi" },
    { initial: "Wellobe", fullName: "Wellobe" }
];

/** @type {BrandPackage[]} */
const brandPackages = [
    { initial: "FT", fullName: "Full tilgang" },
    { initial: "SP", fullName: "Superpaketet" }
];


/** @type {PurposeCodeOption[]} */
const purposeCodes = [
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
        id: "adhoc",
        display: "Ad-hoc Communication (Current Year)",
        codeValue: "YEAR" 
    }
];

/** @type {CommunicationType[]} */
const communicationTypes = [ // For Campaigns/Canvases
    {
        name: "Checkout Cancelled",
        generatedString: "Checkout_Cancelled",
        validCodes: ["2000"],
        description: "Communication sent related to checkout cancelled or checkout payment failed."
    },
    {
        name: "Confirmation",
        validCodes: ["1000"],
        description: "Order confirmations for stop, address changes.",
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
        description: "Information to the customer about their digital product at Schibsted."
    },
    {
        name: "Distribution",
        validCodes: ["1000"],
        description: "Failed delivery, problems with delivery.",
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
        validCodes: ["2000", "YEAR"],
        description: "Engagement related, either ad hoc or permanent."
    },
    {
        name: "Fullprice Notification",
        generatedString: "Fullprice_Notification",
        validCodes: ["1000"],
        description: "Reminders sent when campaign price is going over to fullprice."
    },
    {
        name: "Holdback",
        generatedString: "Holdback",
        validCodes: ["2000"],
        description: "Holdback related communication."
    },
    {
        name: "Newsletter",
        generatedString: "Newsletter",
        validCodes: ["YEAR"],
        description: "All newsletters."
    },
    {
        name: "Onboarding",
        generatedString: "Onboarding",
        validCodes: ["2000"],
        description: "Onboarding related communication."
    },
    {
        name: "Payment",
        validCodes: ["1000"],
        description: "CC expire, payment reminders and payment stop.",
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
        description: "Communication related to price adjustments."
    },
    {
        name: "Sale",
        generatedString: "Sale",
        validCodes: ["YEAR"],
        description: "Campaigns."
    },
    {
        name: "Share",
        validCodes: ["1000"],
        description: "All communication related to sharing of subscription.",
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
        name: "Upsale",
        generatedString: "Upsale",
        validCodes: ["2000", "YEAR"],
        description: "Upsale initiatives."
    },
    {
        name: "Winback",
        generatedString: "Winback",
        validCodes: ["2000"],
        description: "Winback related communication."
    }
];

// Segment Communication Types
// As per "CJAC-Naming structure segment-160525-200836.pdf", the list of communication types
// is identical to campaigns/canvases. The PDF does not specify different code restrictions
// per type for segments, so we assume they are the same.
// The main difference for segments will be the optional "Custom Suffix".
const segmentCommunicationTypes = JSON.parse(JSON.stringify(communicationTypes));
// If specific segment types are needed later, this array can be modified.
// For example, if "Sale" for segments should only be valid for "YEAR":
// const saleSegmentType = segmentCommunicationTypes.find(type => type.name === "Sale");
// if (saleSegmentType) {
//     saleSegmentType.validCodes = ["YEAR"];
// }
