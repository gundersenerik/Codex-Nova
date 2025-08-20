/* ============================================================================
   DATABASE INITIALIZER - Pre-populated database for Naming Standards Hub
   Generated: 2025-08-01T13:31:12.662Z
   ============================================================================ */

// Pre-populated database with 18 brands, 79 products, and 260 rate plans
window.INITIAL_DATABASE = {
    version: '1.0.0',
    created: '2025-08-01',
    stats: {
        brands: 18,
        products: 79,
        ratePlans: 260
    },
    // Database content as JSON
    data: {
  "brands": [
    {
      "id": 1,
      "code": "AP",
      "name": "Aftenposten",
      "country": "NO"
    },
    {
      "id": 2,
      "code": "BT",
      "name": "Bergens Tidende",
      "country": "NO"
    },
    {
      "id": 3,
      "code": "E24",
      "name": "E24",
      "country": "NO"
    },
    {
      "id": 4,
      "code": "OM",
      "name": "Omni",
      "country": "SE"
    },
    {
      "id": 5,
      "code": "OMB",
      "name": "Omni",
      "country": "SE"
    },
    {
      "id": 6,
      "code": "OME",
      "name": "Omni",
      "country": "SE"
    },
    {
      "id": 7,
      "code": "OMEB",
      "name": "Omni",
      "country": "SE"
    },
    {
      "id": 8,
      "code": "OMMER",
      "name": "Omni",
      "country": "SE"
    },
    {
      "id": 9,
      "code": "OMMERB",
      "name": "Omni",
      "country": "SE"
    },
    {
      "id": 10,
      "code": "OMSP",
      "name": "Omni",
      "country": "SE"
    },
    {
      "id": 11,
      "code": "R24",
      "name": "Randaberg24",
      "country": "NO"
    },
    {
      "id": 12,
      "code": "SA",
      "name": "Stavanger Aftenblad",
      "country": "NO"
    },
    {
      "id": 13,
      "code": "VG",
      "name": "VG",
      "country": "NO"
    },
    {
      "id": 14,
      "code": "AB",
      "name": "Aftonbladet",
      "country": "SE"
    },
    {
      "id": 15,
      "code": "SVD",
      "name": "Svenska Dagbladet",
      "country": "SE"
    },
    {
      "id": 16,
      "code": "PM",
      "name": "Podme NO",
      "country": "NO"
    },
    {
      "id": 17,
      "code": "VK",
      "name": "VektKlubb",
      "country": "NO"
    },
    {
      "id": 18,
      "code": "W",
      "name": "Wellobe",
      "country": "SE"
    }
  ],
  "products": [
    {
      "id": 1,
      "brand_id": 1,
      "name": "Aftenposten A-magasinet",
      "type": "print"
    },
    {
      "id": 2,
      "brand_id": 1,
      "name": "Aftenposten Duo",
      "type": "digital"
    },
    {
      "id": 3,
      "brand_id": 1,
      "name": "Aftenposten Full Tilgang",
      "type": "digital"
    },
    {
      "id": 4,
      "brand_id": 1,
      "name": "Aftenposten Helg",
      "type": "print"
    },
    {
      "id": 5,
      "brand_id": 1,
      "name": "Aftenposten Solo",
      "type": "digital"
    },
    {
      "id": 6,
      "brand_id": 1,
      "name": "Aftenposten Uke",
      "type": "print"
    },
    {
      "id": 7,
      "brand_id": 2,
      "name": "BT Basis",
      "type": "digital"
    },
    {
      "id": 8,
      "brand_id": 2,
      "name": "BT Familie",
      "type": "digital"
    },
    {
      "id": 9,
      "brand_id": 2,
      "name": "BT Full tilgang",
      "type": "digital"
    },
    {
      "id": 10,
      "brand_id": 2,
      "name": "BT Full tilgang Helg",
      "type": "print"
    },
    {
      "id": 11,
      "brand_id": 2,
      "name": "BT Full tilgang Komplett",
      "type": "print"
    },
    {
      "id": 12,
      "brand_id": 2,
      "name": "BT Helg",
      "type": "print"
    },
    {
      "id": 13,
      "brand_id": 2,
      "name": "BT Komplett",
      "type": "print"
    },
    {
      "id": 14,
      "brand_id": 2,
      "name": "BT mandag til fredag",
      "type": "print"
    },
    {
      "id": 15,
      "brand_id": 2,
      "name": "BT Premium",
      "type": "digital"
    },
    {
      "id": 16,
      "brand_id": 3,
      "name": "E24 Basis",
      "type": "digital"
    },
    {
      "id": 17,
      "brand_id": 3,
      "name": "E24 Full tilgang",
      "type": "digital"
    },
    {
      "id": 18,
      "brand_id": 3,
      "name": "E24 og Dine penger+",
      "type": "digital"
    },
    {
      "id": 19,
      "brand_id": 3,
      "name": "E24 Pro",
      "type": "digital"
    },
    {
      "id": 20,
      "brand_id": 3,
      "name": "E24 sanntidskurser",
      "type": "digital"
    },
    {
      "id": 21,
      "brand_id": 3,
      "name": "E24 uten deling",
      "type": "digital"
    },
    {
      "id": 22,
      "brand_id": 4,
      "name": "Omni annonsfritt",
      "type": "digital"
    },
    {
      "id": 23,
      "brand_id": 4,
      "name": "Omni Bundle",
      "type": "digital"
    },
    {
      "id": 24,
      "brand_id": 5,
      "name": "Omni Bundle Bas",
      "type": "digital"
    },
    {
      "id": 25,
      "brand_id": 6,
      "name": "Omni Ekonomi",
      "type": "digital"
    },
    {
      "id": 26,
      "brand_id": 7,
      "name": "Omni Ekonomi Bas",
      "type": "digital"
    },
    {
      "id": 27,
      "brand_id": 8,
      "name": "Omni Mer",
      "type": "digital"
    },
    {
      "id": 28,
      "brand_id": 9,
      "name": "Omni Mer Bas",
      "type": "digital"
    },
    {
      "id": 29,
      "brand_id": 10,
      "name": "Omni Superpaketet",
      "type": "digital"
    },
    {
      "id": 30,
      "brand_id": 11,
      "name": "Randaberg24",
      "type": "digital"
    },
    {
      "id": 31,
      "brand_id": 12,
      "name": "Aftenbladet Basis",
      "type": "digital"
    },
    {
      "id": 32,
      "brand_id": 12,
      "name": "Aftenbladet Familie",
      "type": "digital"
    },
    {
      "id": 33,
      "brand_id": 12,
      "name": "Aftenbladet Full tilgang",
      "type": "digital"
    },
    {
      "id": 34,
      "brand_id": 12,
      "name": "Aftenbladet Full tillgang Helg",
      "type": "print"
    },
    {
      "id": 35,
      "brand_id": 12,
      "name": "Aftenbladet Full tillgang Komplett",
      "type": "print"
    },
    {
      "id": 36,
      "brand_id": 12,
      "name": "Aftenbladet Helg",
      "type": "print"
    },
    {
      "id": 37,
      "brand_id": 12,
      "name": "Aftenbladet Komplett",
      "type": "print"
    },
    {
      "id": 38,
      "brand_id": 12,
      "name": "Aftenbladet mandag til fredag",
      "type": "print"
    },
    {
      "id": 39,
      "brand_id": 12,
      "name": "Aftenbladet Premium",
      "type": "digital"
    },
    {
      "id": 40,
      "brand_id": 13,
      "name": "VG eavis",
      "type": "digital"
    },
    {
      "id": 41,
      "brand_id": 13,
      "name": "VG Weekend hele helgen",
      "type": "print"
    },
    {
      "id": 42,
      "brand_id": 13,
      "name": "VG Weekend fredag-lørdag",
      "type": "print"
    },
    {
      "id": 43,
      "brand_id": 13,
      "name": "VG Weekend lørdag-søndag",
      "type": "print"
    },
    {
      "id": 44,
      "brand_id": 13,
      "name": "VG+ Basis",
      "type": "digital"
    },
    {
      "id": 45,
      "brand_id": 13,
      "name": "VG+",
      "type": "digital"
    },
    {
      "id": 46,
      "brand_id": 13,
      "name": "VG+ og Dine penger+",
      "type": "digital"
    },
    {
      "id": 47,
      "brand_id": 13,
      "name": "VG+ Sport",
      "type": "digital"
    },
    {
      "id": 48,
      "brand_id": 13,
      "name": "VG+ Total",
      "type": "digital"
    },
    {
      "id": 49,
      "brand_id": 13,
      "name": "VG+ Full tilgang",
      "type": "digital"
    },
    {
      "id": 50,
      "brand_id": 13,
      "name": "VG+ Flex",
      "type": "digital"
    },
    {
      "id": 51,
      "brand_id": 13,
      "name": "VG+ og PodMe",
      "type": "digital"
    },
    {
      "id": 52,
      "brand_id": 13,
      "name": "MinMote strikk",
      "type": "digital"
    },
    {
      "id": 53,
      "brand_id": 13,
      "name": "VG eAvis med VG+",
      "type": "digital"
    },
    {
      "id": 54,
      "brand_id": 13,
      "name": "Dine penger+",
      "type": "digital"
    },
    {
      "id": 55,
      "brand_id": 14,
      "name": "Aftonbladet e-tidning",
      "type": "digital"
    },
    {
      "id": 56,
      "brand_id": 14,
      "name": "Aftonbladet Plus",
      "type": "digital"
    },
    {
      "id": 57,
      "brand_id": 14,
      "name": "Aftonbladet Plus & Podme",
      "type": "digital"
    },
    {
      "id": 58,
      "brand_id": 14,
      "name": "Aftonbladet Superpaketet",
      "type": "digital"
    },
    {
      "id": 59,
      "brand_id": 14,
      "name": "Plus & SvenskHockey.tv",
      "type": "digital"
    },
    {
      "id": 60,
      "brand_id": 15,
      "name": "SvD digital premium",
      "type": "digital"
    },
    {
      "id": 61,
      "brand_id": 15,
      "name": "SvD digital standard",
      "type": "digital"
    },
    {
      "id": 62,
      "brand_id": 15,
      "name": "SvD Superpaketet - tillägg alla dagar",
      "type": "digital"
    },
    {
      "id": 63,
      "brand_id": 15,
      "name": "SvD Superpaketet - tillägg helg",
      "type": "digital"
    },
    {
      "id": 64,
      "brand_id": 15,
      "name": "SvD Superpaketet - tillägg digital premium",
      "type": "digital"
    },
    {
      "id": 65,
      "brand_id": 15,
      "name": "SvD Vinklubb",
      "type": "digital"
    },
    {
      "id": 66,
      "brand_id": 15,
      "name": "SvD Superpaketet",
      "type": "digital"
    },
    {
      "id": 67,
      "brand_id": 15,
      "name": "SvD digital premium SP",
      "type": "digital"
    },
    {
      "id": 68,
      "brand_id": 15,
      "name": "SvD taltidning",
      "type": "digital"
    },
    {
      "id": 69,
      "brand_id": 15,
      "name": "SvD taltidning - tillägg",
      "type": "digital"
    },
    {
      "id": 70,
      "brand_id": 15,
      "name": "SvD digital standard & Podme",
      "type": "digital"
    },
    {
      "id": 71,
      "brand_id": 15,
      "name": "SvD komplett alla dagar",
      "type": "print"
    },
    {
      "id": 72,
      "brand_id": 15,
      "name": "SvD komplett helg",
      "type": "print"
    },
    {
      "id": 73,
      "brand_id": 15,
      "name": "Svenska Dagbladet söndag",
      "type": "print"
    },
    {
      "id": 74,
      "brand_id": 15,
      "name": "SvD komplett vardag",
      "type": "print"
    },
    {
      "id": 75,
      "brand_id": 15,
      "name": "SvD komplett sexdagars",
      "type": "print"
    },
    {
      "id": 76,
      "brand_id": 15,
      "name": "SvD komplett tredagars",
      "type": "print"
    },
    {
      "id": 77,
      "brand_id": 16,
      "name": "Podme NO",
      "type": "digital"
    },
    {
      "id": 78,
      "brand_id": 17,
      "name": "Vektklubb",
      "type": "digital"
    },
    {
      "id": 79,
      "brand_id": 18,
      "name": "Wellobe",
      "type": "digital"
    }
  ],
  "ratePlans": [
    {
      "id": 1,
      "product_id": 1,
      "code": "W",
      "name": "Weekly",
      "price": 107,
      "category": "standard",
      "sort_order": 5
    },
    {
      "id": 2,
      "product_id": 1,
      "code": "M",
      "name": "Monthly",
      "price": 499,
      "category": "standard",
      "sort_order": 10
    },
    {
      "id": 3,
      "product_id": 1,
      "code": "Q",
      "name": "Quarterly",
      "price": 1497,
      "category": "standard",
      "sort_order": 20
    },
    {
      "id": 4,
      "product_id": 1,
      "code": "6M",
      "name": "6 Months",
      "price": 2994,
      "category": "standard",
      "sort_order": 30
    },
    {
      "id": 5,
      "product_id": 1,
      "code": "Y",
      "name": "Yearly",
      "price": 5988,
      "category": "standard",
      "sort_order": 40
    },
    {
      "id": 6,
      "product_id": 2,
      "code": "W",
      "name": "Weekly",
      "price": 67,
      "category": "standard",
      "sort_order": 5
    },
    {
      "id": 7,
      "product_id": 2,
      "code": "M",
      "name": "Monthly",
      "price": 299,
      "category": "standard",
      "sort_order": 10
    },
    {
      "id": 8,
      "product_id": 2,
      "code": "Q",
      "name": "Quarterly",
      "price": 897,
      "category": "standard",
      "sort_order": 20
    },
    {
      "id": 9,
      "product_id": 2,
      "code": "6M",
      "name": "6 Months",
      "price": 1794,
      "category": "standard",
      "sort_order": 30
    },
    {
      "id": 10,
      "product_id": 2,
      "code": "Y",
      "name": "Yearly",
      "price": 3588,
      "category": "standard",
      "sort_order": 40
    },
    {
      "id": 11,
      "product_id": 3,
      "code": "W",
      "name": "Weekly",
      "price": 87,
      "category": "standard",
      "sort_order": 5
    },
    {
      "id": 12,
      "product_id": 3,
      "code": "M",
      "name": "Monthly",
      "price": 379,
      "category": "standard",
      "sort_order": 10
    },
    {
      "id": 13,
      "product_id": 3,
      "code": "Q",
      "name": "Quarterly",
      "price": 1137,
      "category": "standard",
      "sort_order": 20
    },
    {
      "id": 14,
      "product_id": 3,
      "code": "6M",
      "name": "6 Months",
      "price": 2274,
      "category": "standard",
      "sort_order": 30
    },
    {
      "id": 15,
      "product_id": 3,
      "code": "Y",
      "name": "Yearly",
      "price": 4548,
      "category": "standard",
      "sort_order": 40
    },
    {
      "id": 16,
      "product_id": 4,
      "code": "W",
      "name": "Weekly",
      "price": 123,
      "category": "standard",
      "sort_order": 5
    },
    {
      "id": 17,
      "product_id": 4,
      "code": "M",
      "name": "Monthly",
      "price": 569,
      "category": "standard",
      "sort_order": 10
    },
    {
      "id": 18,
      "product_id": 4,
      "code": "Q",
      "name": "Quarterly",
      "price": 1707,
      "category": "standard",
      "sort_order": 20
    },
    {
      "id": 19,
      "product_id": 4,
      "code": "6M",
      "name": "6 Months",
      "price": 3414,
      "category": "standard",
      "sort_order": 30
    },
    {
      "id": 20,
      "product_id": 4,
      "code": "Y",
      "name": "Yearly",
      "price": 6300,
      "category": "standard",
      "sort_order": 40
    },
    {
      "id": 21,
      "product_id": 5,
      "code": "M",
      "name": "Monthly",
      "price": 249,
      "category": "standard",
      "sort_order": 10
    },
    {
      "id": 22,
      "product_id": 5,
      "code": "Q",
      "name": "Quarterly",
      "price": 747,
      "category": "standard",
      "sort_order": 20
    },
    {
      "id": 23,
      "product_id": 5,
      "code": "6M",
      "name": "6 Months",
      "price": 1494,
      "category": "standard",
      "sort_order": 30
    },
    {
      "id": 24,
      "product_id": 5,
      "code": "Y",
      "name": "Yearly",
      "price": 2988,
      "category": "standard",
      "sort_order": 40
    },
    {
      "id": 25,
      "product_id": 6,
      "code": "W",
      "name": "Weekly",
      "price": 165,
      "category": "standard",
      "sort_order": 5
    },
    {
      "id": 26,
      "product_id": 6,
      "code": "M",
      "name": "Monthly",
      "price": 769,
      "category": "standard",
      "sort_order": 10
    },
    {
      "id": 27,
      "product_id": 6,
      "code": "Q",
      "name": "Quarterly",
      "price": 2307,
      "category": "standard",
      "sort_order": 20
    },
    {
      "id": 28,
      "product_id": 6,
      "code": "6M",
      "name": "6 Months",
      "price": 4614,
      "category": "standard",
      "sort_order": 30
    },
    {
      "id": 29,
      "product_id": 6,
      "code": "Y",
      "name": "Yearly",
      "price": 9228,
      "category": "standard",
      "sort_order": 40
    },
    {
      "id": 30,
      "product_id": 7,
      "code": "W",
      "name": "Weekly",
      "price": 54,
      "category": "standard",
      "sort_order": 5
    },
    {
      "id": 31,
      "product_id": 7,
      "code": "M",
      "name": "Monthly",
      "price": 229,
      "category": "standard",
      "sort_order": 10
    },
    {
      "id": 32,
      "product_id": 7,
      "code": "Q",
      "name": "Quarterly",
      "price": 687,
      "category": "standard",
      "sort_order": 20
    },
    {
      "id": 33,
      "product_id": 7,
      "code": "6M",
      "name": "6 Months",
      "price": 1374,
      "category": "standard",
      "sort_order": 30
    },
    {
      "id": 34,
      "product_id": 7,
      "code": "Y",
      "name": "Yearly",
      "price": 2748,
      "category": "standard",
      "sort_order": 40
    },
    {
      "id": 35,
      "product_id": 8,
      "code": "M",
      "name": "Monthly",
      "price": 349,
      "category": "standard",
      "sort_order": 10
    },
    {
      "id": 36,
      "product_id": 8,
      "code": "Q",
      "name": "Quarterly",
      "price": 1047,
      "category": "standard",
      "sort_order": 20
    },
    {
      "id": 37,
      "product_id": 8,
      "code": "6M",
      "name": "6 Months",
      "price": 2094,
      "category": "standard",
      "sort_order": 30
    },
    {
      "id": 38,
      "product_id": 8,
      "code": "Y",
      "name": "Yearly",
      "price": 4188,
      "category": "standard",
      "sort_order": 40
    },
    {
      "id": 39,
      "product_id": 9,
      "code": "W",
      "name": "Weekly",
      "price": 87,
      "category": "standard",
      "sort_order": 5
    },
    {
      "id": 40,
      "product_id": 9,
      "code": "M",
      "name": "Monthly",
      "price": 379,
      "category": "standard",
      "sort_order": 10
    },
    {
      "id": 41,
      "product_id": 9,
      "code": "Q",
      "name": "Quarterly",
      "price": 1137,
      "category": "standard",
      "sort_order": 20
    },
    {
      "id": 42,
      "product_id": 9,
      "code": "6M",
      "name": "6 Months",
      "price": 2274,
      "category": "standard",
      "sort_order": 30
    },
    {
      "id": 43,
      "product_id": 9,
      "code": "Y",
      "name": "Yearly",
      "price": 4548,
      "category": "standard",
      "sort_order": 40
    },
    {
      "id": 44,
      "product_id": 10,
      "code": "M",
      "name": "Monthly",
      "price": 568,
      "category": "standard",
      "sort_order": 10
    },
    {
      "id": 45,
      "product_id": 10,
      "code": "Q",
      "name": "Quarterly",
      "price": 1674,
      "category": "standard",
      "sort_order": 20
    },
    {
      "id": 46,
      "product_id": 10,
      "code": "6M",
      "name": "6 Months",
      "price": 3348,
      "category": "standard",
      "sort_order": 30
    },
    {
      "id": 47,
      "product_id": 10,
      "code": "Y",
      "name": "Yearly",
      "price": 6696,
      "category": "standard",
      "sort_order": 40
    },
    {
      "id": 48,
      "product_id": 11,
      "code": "M",
      "name": "Monthly",
      "price": 758,
      "category": "standard",
      "sort_order": 10
    },
    {
      "id": 49,
      "product_id": 11,
      "code": "Q",
      "name": "Quarterly",
      "price": 2274,
      "category": "standard",
      "sort_order": 20
    },
    {
      "id": 50,
      "product_id": 11,
      "code": "6M",
      "name": "6 Months",
      "price": 4548,
      "category": "standard",
      "sort_order": 30
    },
    {
      "id": 51,
      "product_id": 11,
      "code": "Y",
      "name": "Yearly",
      "price": 9096,
      "category": "standard",
      "sort_order": 40
    },
    {
      "id": 52,
      "product_id": 12,
      "code": "W",
      "name": "Weekly",
      "price": 113,
      "category": "standard",
      "sort_order": 5
    },
    {
      "id": 53,
      "product_id": 12,
      "code": "M",
      "name": "Monthly",
      "price": 489,
      "category": "standard",
      "sort_order": 10
    },
    {
      "id": 54,
      "product_id": 12,
      "code": "Q",
      "name": "Quarterly",
      "price": 1467,
      "category": "standard",
      "sort_order": 20
    },
    {
      "id": 55,
      "product_id": 12,
      "code": "6M",
      "name": "6 Months",
      "price": 2934,
      "category": "standard",
      "sort_order": 30
    },
    {
      "id": 56,
      "product_id": 12,
      "code": "Y",
      "name": "Yearly",
      "price": 5868,
      "category": "standard",
      "sort_order": 40
    },
    {
      "id": 57,
      "product_id": 13,
      "code": "M",
      "name": "Monthly",
      "price": 689,
      "category": "standard",
      "sort_order": 10
    },
    {
      "id": 58,
      "product_id": 13,
      "code": "Q",
      "name": "Quarterly",
      "price": 2067,
      "category": "standard",
      "sort_order": 20
    },
    {
      "id": 59,
      "product_id": 13,
      "code": "6M",
      "name": "6 Months",
      "price": 4134,
      "category": "standard",
      "sort_order": 30
    },
    {
      "id": 60,
      "product_id": 13,
      "code": "Y",
      "name": "Yearly",
      "price": 8268,
      "category": "standard",
      "sort_order": 40
    },
    {
      "id": 61,
      "product_id": 14,
      "code": "M",
      "name": "Monthly",
      "price": 689,
      "category": "standard",
      "sort_order": 10
    },
    {
      "id": 62,
      "product_id": 14,
      "code": "Q",
      "name": "Quarterly",
      "price": 2067,
      "category": "standard",
      "sort_order": 20
    },
    {
      "id": 63,
      "product_id": 14,
      "code": "6M",
      "name": "6 Months",
      "price": 4134,
      "category": "standard",
      "sort_order": 30
    },
    {
      "id": 64,
      "product_id": 14,
      "code": "Y",
      "name": "Yearly",
      "price": 8268,
      "category": "standard",
      "sort_order": 40
    },
    {
      "id": 65,
      "product_id": 15,
      "code": "W",
      "name": "Weekly",
      "price": 66,
      "category": "standard",
      "sort_order": 5
    },
    {
      "id": 66,
      "product_id": 15,
      "code": "M",
      "name": "Monthly",
      "price": 299,
      "category": "standard",
      "sort_order": 10
    },
    {
      "id": 67,
      "product_id": 15,
      "code": "Q",
      "name": "Quarterly",
      "price": 897,
      "category": "standard",
      "sort_order": 20
    },
    {
      "id": 68,
      "product_id": 15,
      "code": "6M",
      "name": "6 Months",
      "price": 1794,
      "category": "standard",
      "sort_order": 30
    },
    {
      "id": 69,
      "product_id": 15,
      "code": "Y",
      "name": "Yearly",
      "price": 3588,
      "category": "standard",
      "sort_order": 40
    },
    {
      "id": 70,
      "product_id": 16,
      "code": "M",
      "name": "Monthly",
      "price": 199,
      "category": "standard",
      "sort_order": 10
    },
    {
      "id": 71,
      "product_id": 17,
      "code": "M",
      "name": "Monthly",
      "price": 379,
      "category": "standard",
      "sort_order": 10
    },
    {
      "id": 72,
      "product_id": 17,
      "code": "Y",
      "name": "Yearly",
      "price": 4548,
      "category": "standard",
      "sort_order": 40
    },
    {
      "id": 73,
      "product_id": 18,
      "code": "M",
      "name": "Monthly",
      "price": 269,
      "category": "standard",
      "sort_order": 10
    },
    {
      "id": 74,
      "product_id": 18,
      "code": "Y",
      "name": "Yearly",
      "price": 2628,
      "category": "standard",
      "sort_order": 40
    },
    {
      "id": 75,
      "product_id": 19,
      "code": "M",
      "name": "Monthly",
      "price": 249,
      "category": "standard",
      "sort_order": 10
    },
    {
      "id": 76,
      "product_id": 19,
      "code": "Y",
      "name": "Yearly",
      "price": 1999,
      "category": "standard",
      "sort_order": 40
    },
    {
      "id": 77,
      "product_id": 20,
      "code": "M",
      "name": "Monthly",
      "price": 0,
      "category": "standard",
      "sort_order": 10
    },
    {
      "id": 78,
      "product_id": 21,
      "code": "M",
      "name": "Monthly",
      "price": 198,
      "category": "standard",
      "sort_order": 10
    },
    {
      "id": 79,
      "product_id": 22,
      "code": "M",
      "name": "Monthly",
      "price": 29,
      "category": "standard",
      "sort_order": 10
    },
    {
      "id": 80,
      "product_id": 23,
      "code": "M",
      "name": "Monthly",
      "price": 249,
      "category": "standard",
      "sort_order": 10
    },
    {
      "id": 81,
      "product_id": 23,
      "code": "Y/M",
      "name": "Yearly (per month)",
      "price": 199,
      "category": "standard",
      "sort_order": 50
    },
    {
      "id": 82,
      "product_id": 24,
      "code": "M",
      "name": "Monthly",
      "price": 199,
      "category": "standard",
      "sort_order": 10
    },
    {
      "id": 83,
      "product_id": 24,
      "code": "Y/M",
      "name": "Yearly (per month)",
      "price": 159,
      "category": "standard",
      "sort_order": 50
    },
    {
      "id": 84,
      "product_id": 25,
      "code": "M",
      "name": "Monthly",
      "price": 189,
      "category": "standard",
      "sort_order": 10
    },
    {
      "id": 85,
      "product_id": 25,
      "code": "Y/M",
      "name": "Yearly (per month)",
      "price": 159,
      "category": "standard",
      "sort_order": 50
    },
    {
      "id": 86,
      "product_id": 26,
      "code": "M",
      "name": "Monthly",
      "price": 179,
      "category": "standard",
      "sort_order": 10
    },
    {
      "id": 87,
      "product_id": 26,
      "code": "Y/M",
      "name": "Yearly (per month)",
      "price": 149,
      "category": "standard",
      "sort_order": 50
    },
    {
      "id": 88,
      "product_id": 27,
      "code": "M",
      "name": "Monthly",
      "price": 139,
      "category": "standard",
      "sort_order": 10
    },
    {
      "id": 89,
      "product_id": 27,
      "code": "Y",
      "name": "Yearly",
      "price": 1188,
      "category": "standard",
      "sort_order": 40
    },
    {
      "id": 90,
      "product_id": 27,
      "code": "Y/M",
      "name": "Yearly (per month)",
      "price": 99,
      "category": "standard",
      "sort_order": 50
    },
    {
      "id": 91,
      "product_id": 28,
      "code": "W",
      "name": "Weekly",
      "price": 29,
      "category": "standard",
      "sort_order": 5
    },
    {
      "id": 92,
      "product_id": 28,
      "code": "M",
      "name": "Monthly",
      "price": 119,
      "category": "standard",
      "sort_order": 10
    },
    {
      "id": 93,
      "product_id": 28,
      "code": "Y",
      "name": "Yearly",
      "price": 948,
      "category": "standard",
      "sort_order": 40
    },
    {
      "id": 94,
      "product_id": 28,
      "code": "Y/M",
      "name": "Yearly (per month)",
      "price": 79,
      "category": "standard",
      "sort_order": 50
    },
    {
      "id": 95,
      "product_id": 29,
      "code": "M",
      "name": "Monthly",
      "price": 299,
      "category": "standard",
      "sort_order": 10
    },
    {
      "id": 96,
      "product_id": 29,
      "code": "Y/M",
      "name": "Yearly (per month)",
      "price": 269,
      "category": "standard",
      "sort_order": 50
    },
    {
      "id": 97,
      "product_id": 30,
      "code": "M",
      "name": "Monthly",
      "price": 99,
      "category": "standard",
      "sort_order": 10
    },
    {
      "id": 98,
      "product_id": 30,
      "code": "Y",
      "name": "Yearly",
      "price": 1188,
      "category": "standard",
      "sort_order": 40
    },
    {
      "id": 99,
      "product_id": 31,
      "code": "W",
      "name": "Weekly",
      "price": 54,
      "category": "standard",
      "sort_order": 5
    },
    {
      "id": 100,
      "product_id": 31,
      "code": "M",
      "name": "Monthly",
      "price": 229,
      "category": "standard",
      "sort_order": 10
    },
    {
      "id": 101,
      "product_id": 31,
      "code": "Q",
      "name": "Quarterly",
      "price": 687,
      "category": "standard",
      "sort_order": 20
    },
    {
      "id": 102,
      "product_id": 31,
      "code": "6M",
      "name": "6 Months",
      "price": 1374,
      "category": "standard",
      "sort_order": 30
    },
    {
      "id": 103,
      "product_id": 31,
      "code": "Y",
      "name": "Yearly",
      "price": 2748,
      "category": "standard",
      "sort_order": 40
    },
    {
      "id": 104,
      "product_id": 32,
      "code": "M",
      "name": "Monthly",
      "price": 349,
      "category": "standard",
      "sort_order": 10
    },
    {
      "id": 105,
      "product_id": 32,
      "code": "Q",
      "name": "Quarterly",
      "price": 1047,
      "category": "standard",
      "sort_order": 20
    },
    {
      "id": 106,
      "product_id": 32,
      "code": "6M",
      "name": "6 Months",
      "price": 2094,
      "category": "standard",
      "sort_order": 30
    },
    {
      "id": 107,
      "product_id": 32,
      "code": "Y",
      "name": "Yearly",
      "price": 4188,
      "category": "standard",
      "sort_order": 40
    },
    {
      "id": 108,
      "product_id": 33,
      "code": "M",
      "name": "Monthly",
      "price": 379,
      "category": "standard",
      "sort_order": 10
    },
    {
      "id": 109,
      "product_id": 33,
      "code": "Q",
      "name": "Quarterly",
      "price": 1137,
      "category": "standard",
      "sort_order": 20
    },
    {
      "id": 110,
      "product_id": 33,
      "code": "6M",
      "name": "6 Months",
      "price": 2274,
      "category": "standard",
      "sort_order": 30
    },
    {
      "id": 111,
      "product_id": 33,
      "code": "Y",
      "name": "Yearly",
      "price": 4548,
      "category": "standard",
      "sort_order": 40
    },
    {
      "id": 112,
      "product_id": 34,
      "code": "M",
      "name": "Monthly",
      "price": 568,
      "category": "standard",
      "sort_order": 10
    },
    {
      "id": 113,
      "product_id": 34,
      "code": "Q",
      "name": "Quarterly",
      "price": 1704,
      "category": "standard",
      "sort_order": 20
    },
    {
      "id": 114,
      "product_id": 34,
      "code": "6M",
      "name": "6 Months",
      "price": 3408,
      "category": "standard",
      "sort_order": 30
    },
    {
      "id": 115,
      "product_id": 34,
      "code": "Y",
      "name": "Yearly",
      "price": 6588,
      "category": "standard",
      "sort_order": 40
    },
    {
      "id": 116,
      "product_id": 35,
      "code": "M",
      "name": "Monthly",
      "price": 734,
      "category": "standard",
      "sort_order": 10
    },
    {
      "id": 117,
      "product_id": 35,
      "code": "Q",
      "name": "Quarterly",
      "price": 2202,
      "category": "standard",
      "sort_order": 20
    },
    {
      "id": 118,
      "product_id": 35,
      "code": "6M",
      "name": "6 Months",
      "price": 4404,
      "category": "standard",
      "sort_order": 30
    },
    {
      "id": 119,
      "product_id": 35,
      "code": "Y",
      "name": "Yearly",
      "price": 8448,
      "category": "standard",
      "sort_order": 40
    },
    {
      "id": 120,
      "product_id": 36,
      "code": "W",
      "name": "Weekly",
      "price": 115,
      "category": "standard",
      "sort_order": 5
    },
    {
      "id": 121,
      "product_id": 36,
      "code": "M",
      "name": "Monthly",
      "price": 499,
      "category": "standard",
      "sort_order": 10
    },
    {
      "id": 122,
      "product_id": 36,
      "code": "Q",
      "name": "Quarterly",
      "price": 1497,
      "category": "standard",
      "sort_order": 20
    },
    {
      "id": 123,
      "product_id": 36,
      "code": "6M",
      "name": "6 Months",
      "price": 2994,
      "category": "standard",
      "sort_order": 30
    },
    {
      "id": 124,
      "product_id": 36,
      "code": "Y",
      "name": "Yearly",
      "price": 5760,
      "category": "standard",
      "sort_order": 40
    },
    {
      "id": 125,
      "product_id": 37,
      "code": "M",
      "name": "Monthly",
      "price": 655,
      "category": "standard",
      "sort_order": 10
    },
    {
      "id": 126,
      "product_id": 37,
      "code": "Q",
      "name": "Quarterly",
      "price": 1995,
      "category": "standard",
      "sort_order": 20
    },
    {
      "id": 127,
      "product_id": 37,
      "code": "6M",
      "name": "6 Months",
      "price": 3990,
      "category": "standard",
      "sort_order": 30
    },
    {
      "id": 128,
      "product_id": 37,
      "code": "Y",
      "name": "Yearly",
      "price": 7620,
      "category": "standard",
      "sort_order": 40
    },
    {
      "id": 129,
      "product_id": 38,
      "code": "M",
      "name": "Monthly",
      "price": 665,
      "category": "standard",
      "sort_order": 10
    },
    {
      "id": 130,
      "product_id": 38,
      "code": "Q",
      "name": "Quarterly",
      "price": 1995,
      "category": "standard",
      "sort_order": 20
    },
    {
      "id": 131,
      "product_id": 38,
      "code": "6M",
      "name": "6 Months",
      "price": 3990,
      "category": "standard",
      "sort_order": 30
    },
    {
      "id": 132,
      "product_id": 38,
      "code": "Y",
      "name": "Yearly",
      "price": 7620,
      "category": "standard",
      "sort_order": 40
    },
    {
      "id": 133,
      "product_id": 39,
      "code": "W",
      "name": "Weekly",
      "price": 66,
      "category": "standard",
      "sort_order": 5
    },
    {
      "id": 134,
      "product_id": 39,
      "code": "M",
      "name": "Monthly",
      "price": 299,
      "category": "standard",
      "sort_order": 10
    },
    {
      "id": 135,
      "product_id": 39,
      "code": "Q",
      "name": "Quarterly",
      "price": 897,
      "category": "standard",
      "sort_order": 20
    },
    {
      "id": 136,
      "product_id": 39,
      "code": "6M",
      "name": "6 Months",
      "price": 1794,
      "category": "standard",
      "sort_order": 30
    },
    {
      "id": 137,
      "product_id": 39,
      "code": "Y",
      "name": "Yearly",
      "price": 3588,
      "category": "standard",
      "sort_order": 40
    },
    {
      "id": 138,
      "product_id": 40,
      "code": "W",
      "name": "Weekly",
      "price": 59,
      "category": "standard",
      "sort_order": 5
    },
    {
      "id": 139,
      "product_id": 40,
      "code": "M",
      "name": "Monthly",
      "price": 179,
      "category": "standard",
      "sort_order": 10
    },
    {
      "id": 140,
      "product_id": 40,
      "code": "Q",
      "name": "Quarterly",
      "price": 499,
      "category": "standard",
      "sort_order": 20
    },
    {
      "id": 141,
      "product_id": 40,
      "code": "6M",
      "name": "6 Months",
      "price": 949,
      "category": "standard",
      "sort_order": 30
    },
    {
      "id": 142,
      "product_id": 40,
      "code": "Y",
      "name": "Yearly",
      "price": 1788,
      "category": "standard",
      "sort_order": 40
    },
    {
      "id": 143,
      "product_id": 41,
      "code": "M",
      "name": "Monthly",
      "price": 349,
      "category": "standard",
      "sort_order": 10
    },
    {
      "id": 144,
      "product_id": 41,
      "code": "Q",
      "name": "Quarterly",
      "price": 1047,
      "category": "standard",
      "sort_order": 20
    },
    {
      "id": 145,
      "product_id": 41,
      "code": "6M",
      "name": "6 Months",
      "price": 2094,
      "category": "standard",
      "sort_order": 30
    },
    {
      "id": 146,
      "product_id": 41,
      "code": "Y",
      "name": "Yearly",
      "price": 4188,
      "category": "standard",
      "sort_order": 40
    },
    {
      "id": 147,
      "product_id": 42,
      "code": "M",
      "name": "Monthly",
      "price": 329,
      "category": "standard",
      "sort_order": 10
    },
    {
      "id": 148,
      "product_id": 42,
      "code": "Q",
      "name": "Quarterly",
      "price": 949,
      "category": "standard",
      "sort_order": 20
    },
    {
      "id": 149,
      "product_id": 42,
      "code": "6M",
      "name": "6 Months",
      "price": 1849,
      "category": "standard",
      "sort_order": 30
    },
    {
      "id": 150,
      "product_id": 42,
      "code": "Y",
      "name": "Yearly",
      "price": 3599,
      "category": "standard",
      "sort_order": 40
    },
    {
      "id": 151,
      "product_id": 43,
      "code": "M",
      "name": "Monthly",
      "price": 299,
      "category": "standard",
      "sort_order": 10
    },
    {
      "id": 152,
      "product_id": 43,
      "code": "Q",
      "name": "Quarterly",
      "price": 897,
      "category": "standard",
      "sort_order": 20
    },
    {
      "id": 153,
      "product_id": 43,
      "code": "6M",
      "name": "6 Months",
      "price": 1794,
      "category": "standard",
      "sort_order": 30
    },
    {
      "id": 154,
      "product_id": 43,
      "code": "Y",
      "name": "Yearly",
      "price": 3588,
      "category": "standard",
      "sort_order": 40
    },
    {
      "id": 155,
      "product_id": 44,
      "code": "W",
      "name": "Weekly",
      "price": 59,
      "category": "standard",
      "sort_order": 5
    },
    {
      "id": 156,
      "product_id": 44,
      "code": "M",
      "name": "Monthly",
      "price": 99,
      "category": "standard",
      "sort_order": 10
    },
    {
      "id": 157,
      "product_id": 44,
      "code": "Q",
      "name": "Quarterly",
      "price": 225,
      "category": "standard",
      "sort_order": 20
    },
    {
      "id": 158,
      "product_id": 44,
      "code": "6M",
      "name": "6 Months",
      "price": 499,
      "category": "standard",
      "sort_order": 30
    },
    {
      "id": 159,
      "product_id": 44,
      "code": "Y",
      "name": "Yearly",
      "price": 999,
      "category": "standard",
      "sort_order": 40
    },
    {
      "id": 160,
      "product_id": 45,
      "code": "W",
      "name": "Weekly",
      "price": 39,
      "category": "standard",
      "sort_order": 5
    },
    {
      "id": 161,
      "product_id": 45,
      "code": "M",
      "name": "Monthly",
      "price": 99,
      "category": "standard",
      "sort_order": 10
    },
    {
      "id": 162,
      "product_id": 45,
      "code": "Q",
      "name": "Quarterly",
      "price": 225,
      "category": "standard",
      "sort_order": 20
    },
    {
      "id": 163,
      "product_id": 45,
      "code": "6M",
      "name": "6 Months",
      "price": 349,
      "category": "standard",
      "sort_order": 30
    },
    {
      "id": 164,
      "product_id": 45,
      "code": "Y",
      "name": "Yearly",
      "price": 799,
      "category": "standard",
      "sort_order": 40
    },
    {
      "id": 165,
      "product_id": 45,
      "code": "PUB1500",
      "name": "Publisher 1500",
      "price": 1875,
      "category": "business",
      "sort_order": 300
    },
    {
      "id": 166,
      "product_id": 45,
      "code": "PUB2000",
      "name": "Publisher 2000",
      "price": 2500,
      "category": "business",
      "sort_order": 310
    },
    {
      "id": 167,
      "product_id": 46,
      "code": "W",
      "name": "Weekly",
      "price": 59,
      "category": "standard",
      "sort_order": 5
    },
    {
      "id": 168,
      "product_id": 46,
      "code": "Q",
      "name": "Quarterly",
      "price": 119,
      "category": "standard",
      "sort_order": 20
    },
    {
      "id": 169,
      "product_id": 47,
      "code": "W",
      "name": "Weekly",
      "price": 59,
      "category": "standard",
      "sort_order": 5
    },
    {
      "id": 170,
      "product_id": 47,
      "code": "Q",
      "name": "Quarterly",
      "price": 149,
      "category": "standard",
      "sort_order": 20
    },
    {
      "id": 171,
      "product_id": 48,
      "code": "Q",
      "name": "Quarterly",
      "price": 179,
      "category": "standard",
      "sort_order": 20
    },
    {
      "id": 172,
      "product_id": 49,
      "code": "Q",
      "name": "Quarterly",
      "price": 379,
      "category": "standard",
      "sort_order": 20
    },
    {
      "id": 173,
      "product_id": 49,
      "code": "6M",
      "name": "6 Months",
      "price": 2094,
      "category": "standard",
      "sort_order": 30
    },
    {
      "id": 174,
      "product_id": 49,
      "code": "Y",
      "name": "Yearly",
      "price": 4188,
      "category": "standard",
      "sort_order": 40
    },
    {
      "id": 175,
      "product_id": 50,
      "code": "Q",
      "name": "Quarterly",
      "price": 299,
      "category": "standard",
      "sort_order": 20
    },
    {
      "id": 176,
      "product_id": 51,
      "code": "W",
      "name": "Weekly",
      "price": 59,
      "category": "standard",
      "sort_order": 5
    },
    {
      "id": 177,
      "product_id": 51,
      "code": "M",
      "name": "Monthly",
      "price": 119,
      "category": "standard",
      "sort_order": 10
    },
    {
      "id": 178,
      "product_id": 51,
      "code": "6M",
      "name": "6 Months",
      "price": 649,
      "category": "standard",
      "sort_order": 30
    },
    {
      "id": 179,
      "product_id": 51,
      "code": "Y",
      "name": "Yearly",
      "price": 1199,
      "category": "standard",
      "sort_order": 40
    },
    {
      "id": 180,
      "product_id": 52,
      "code": "W",
      "name": "Weekly",
      "price": 39,
      "category": "standard",
      "sort_order": 5
    },
    {
      "id": 181,
      "product_id": 53,
      "code": "M",
      "name": "Monthly",
      "price": 209,
      "category": "standard",
      "sort_order": 10
    },
    {
      "id": 182,
      "product_id": 53,
      "code": "Y",
      "name": "Yearly",
      "price": 2199,
      "category": "standard",
      "sort_order": 40
    },
    {
      "id": 183,
      "product_id": 54,
      "code": "W",
      "name": "Weekly",
      "price": 39,
      "category": "standard",
      "sort_order": 5
    },
    {
      "id": 184,
      "product_id": 54,
      "code": "M",
      "name": "Monthly",
      "price": 89,
      "category": "standard",
      "sort_order": 10
    },
    {
      "id": 185,
      "product_id": 54,
      "code": "Y",
      "name": "Yearly",
      "price": 1059,
      "category": "standard",
      "sort_order": 40
    },
    {
      "id": 186,
      "product_id": 55,
      "code": "M",
      "name": "Monthly",
      "price": 149,
      "category": "standard",
      "sort_order": 10
    },
    {
      "id": 187,
      "product_id": 56,
      "code": "M",
      "name": "Monthly",
      "price": 149,
      "category": "standard",
      "sort_order": 10
    },
    {
      "id": 188,
      "product_id": 56,
      "code": "Y",
      "name": "Yearly",
      "price": 1195,
      "category": "standard",
      "sort_order": 40
    },
    {
      "id": 189,
      "product_id": 57,
      "code": "M",
      "name": "Monthly",
      "price": 179,
      "category": "standard",
      "sort_order": 10
    },
    {
      "id": 190,
      "product_id": 58,
      "code": "M",
      "name": "Monthly",
      "price": 299,
      "category": "standard",
      "sort_order": 10
    },
    {
      "id": 191,
      "product_id": 59,
      "code": "M",
      "name": "Monthly",
      "price": 199,
      "category": "standard",
      "sort_order": 10
    },
    {
      "id": 192,
      "product_id": 60,
      "code": "M",
      "name": "Monthly",
      "price": 349,
      "category": "standard",
      "sort_order": 10
    },
    {
      "id": 193,
      "product_id": 60,
      "code": "Q",
      "name": "Quarterly",
      "price": 1047,
      "category": "standard",
      "sort_order": 20
    },
    {
      "id": 194,
      "product_id": 60,
      "code": "6M",
      "name": "6 Months",
      "price": 2094,
      "category": "standard",
      "sort_order": 30
    },
    {
      "id": 195,
      "product_id": 60,
      "code": "Y",
      "name": "Yearly",
      "price": 4188,
      "category": "standard",
      "sort_order": 40
    },
    {
      "id": 196,
      "product_id": 60,
      "code": "B2B_Y",
      "name": "B2B Yearly",
      "price": 4188,
      "category": "business",
      "sort_order": 400
    },
    {
      "id": 197,
      "product_id": 60,
      "code": "SE_M",
      "name": "Sweden Monthly",
      "price": 4188,
      "category": "regional",
      "sort_order": 510
    },
    {
      "id": 198,
      "product_id": 60,
      "code": "SE_Q",
      "name": "Sweden Quarterly",
      "price": 4188,
      "category": "regional",
      "sort_order": 520
    },
    {
      "id": 199,
      "product_id": 60,
      "code": "SE_6M",
      "name": "Sweden 6 Months",
      "price": 4188,
      "category": "regional",
      "sort_order": 530
    },
    {
      "id": 200,
      "product_id": 60,
      "code": "SE_Y",
      "name": "Sweden Yearly",
      "price": 4188,
      "category": "regional",
      "sort_order": 540
    },
    {
      "id": 201,
      "product_id": 60,
      "code": "STHLM_M",
      "name": "Stockholm Monthly",
      "price": 4188,
      "category": "regional",
      "sort_order": 610
    },
    {
      "id": 202,
      "product_id": 60,
      "code": "STHLM_Q",
      "name": "Stockholm Quarterly",
      "price": 4188,
      "category": "regional",
      "sort_order": 620
    },
    {
      "id": 203,
      "product_id": 60,
      "code": "STHLM_6M",
      "name": "Stockholm 6 Months",
      "price": 4188,
      "category": "regional",
      "sort_order": 630
    },
    {
      "id": 204,
      "product_id": 60,
      "code": "STHLM_Y",
      "name": "Stockholm Yearly",
      "price": 4188,
      "category": "regional",
      "sort_order": 640
    },
    {
      "id": 205,
      "product_id": 60,
      "code": "CORP_Y",
      "name": "Corporate Yearly",
      "price": 4188,
      "category": "business",
      "sort_order": 450
    },
    {
      "id": 206,
      "product_id": 61,
      "code": "M",
      "name": "Monthly",
      "price": 229,
      "category": "standard",
      "sort_order": 10
    },
    {
      "id": 207,
      "product_id": 61,
      "code": "Q",
      "name": "Quarterly",
      "price": 687,
      "category": "standard",
      "sort_order": 20
    },
    {
      "id": 208,
      "product_id": 61,
      "code": "6M",
      "name": "6 Months",
      "price": 1374,
      "category": "standard",
      "sort_order": 30
    },
    {
      "id": 209,
      "product_id": 61,
      "code": "Y",
      "name": "Yearly",
      "price": 2748,
      "category": "standard",
      "sort_order": 40
    },
    {
      "id": 210,
      "product_id": 62,
      "code": "M",
      "name": "Monthly",
      "price": 69,
      "category": "standard",
      "sort_order": 10
    },
    {
      "id": 211,
      "product_id": 63,
      "code": "M",
      "name": "Monthly",
      "price": 69,
      "category": "standard",
      "sort_order": 10
    },
    {
      "id": 212,
      "product_id": 64,
      "code": "M",
      "name": "Monthly",
      "price": 89,
      "category": "standard",
      "sort_order": 10
    },
    {
      "id": 213,
      "product_id": 65,
      "code": "M",
      "name": "Monthly",
      "price": 39,
      "category": "standard",
      "sort_order": 10
    },
    {
      "id": 214,
      "product_id": 65,
      "code": "Y",
      "name": "Yearly",
      "price": 399,
      "category": "standard",
      "sort_order": 40
    },
    {
      "id": 215,
      "product_id": 66,
      "code": "M",
      "name": "Monthly",
      "price": 299,
      "category": "standard",
      "sort_order": 10
    },
    {
      "id": 216,
      "product_id": 67,
      "code": "M",
      "name": "Monthly",
      "price": 379,
      "category": "standard",
      "sort_order": 10
    },
    {
      "id": 217,
      "product_id": 68,
      "code": "Y",
      "name": "Yearly",
      "price": 2304,
      "category": "standard",
      "sort_order": 40
    },
    {
      "id": 218,
      "product_id": 69,
      "code": "Y",
      "name": "Yearly",
      "price": 480,
      "category": "standard",
      "sort_order": 40
    },
    {
      "id": 219,
      "product_id": 70,
      "code": "W",
      "name": "Weekly",
      "price": 57,
      "category": "standard",
      "sort_order": 5
    },
    {
      "id": 220,
      "product_id": 70,
      "code": "M",
      "name": "Monthly",
      "price": 249,
      "category": "standard",
      "sort_order": 10
    },
    {
      "id": 221,
      "product_id": 71,
      "code": "SE_M",
      "name": "Sweden Monthly",
      "price": 799,
      "category": "regional",
      "sort_order": 510
    },
    {
      "id": 222,
      "product_id": 71,
      "code": "SE_Q",
      "name": "Sweden Quarterly",
      "price": 2397,
      "category": "regional",
      "sort_order": 520
    },
    {
      "id": 223,
      "product_id": 71,
      "code": "SE_Y",
      "name": "Sweden Yearly",
      "price": 9588,
      "category": "regional",
      "sort_order": 540
    },
    {
      "id": 224,
      "product_id": 71,
      "code": "STHLM_M",
      "name": "Stockholm Monthly",
      "price": 799,
      "category": "regional",
      "sort_order": 610
    },
    {
      "id": 225,
      "product_id": 71,
      "code": "STHLM_Q",
      "name": "Stockholm Quarterly",
      "price": 2397,
      "category": "regional",
      "sort_order": 620
    },
    {
      "id": 226,
      "product_id": 71,
      "code": "STHLM_6M",
      "name": "Stockholm 6 Months",
      "price": 4794,
      "category": "regional",
      "sort_order": 630
    },
    {
      "id": 227,
      "product_id": 71,
      "code": "STHLM_Y",
      "name": "Stockholm Yearly",
      "price": 9588,
      "category": "regional",
      "sort_order": 640
    },
    {
      "id": 228,
      "product_id": 71,
      "code": "CORP_Y",
      "name": "Corporate Yearly",
      "price": 10788,
      "category": "business",
      "sort_order": 450
    },
    {
      "id": 229,
      "product_id": 72,
      "code": "STHLM_M",
      "name": "Stockholm Monthly",
      "price": 519,
      "category": "regional",
      "sort_order": 610
    },
    {
      "id": 230,
      "product_id": 72,
      "code": "STHLM_Q",
      "name": "Stockholm Quarterly",
      "price": 1557,
      "category": "regional",
      "sort_order": 620
    },
    {
      "id": 231,
      "product_id": 72,
      "code": "STHLM_6M",
      "name": "Stockholm 6 Months",
      "price": 3114,
      "category": "regional",
      "sort_order": 630
    },
    {
      "id": 232,
      "product_id": 72,
      "code": "STHLM_Y",
      "name": "Stockholm Yearly",
      "price": 5628,
      "category": "regional",
      "sort_order": 640
    },
    {
      "id": 233,
      "product_id": 72,
      "code": "CORP_Y",
      "name": "Corporate Yearly",
      "price": 7188,
      "category": "business",
      "sort_order": 450
    },
    {
      "id": 234,
      "product_id": 73,
      "code": "SE_M",
      "name": "Sweden Monthly",
      "price": 149,
      "category": "regional",
      "sort_order": 510
    },
    {
      "id": 235,
      "product_id": 73,
      "code": "SE_Q",
      "name": "Sweden Quarterly",
      "price": 447,
      "category": "regional",
      "sort_order": 520
    },
    {
      "id": 236,
      "product_id": 73,
      "code": "SE_6M",
      "name": "Sweden 6 Months",
      "price": 894,
      "category": "regional",
      "sort_order": 530
    },
    {
      "id": 237,
      "product_id": 73,
      "code": "SE_Y",
      "name": "Sweden Yearly",
      "price": 1788,
      "category": "regional",
      "sort_order": 540
    },
    {
      "id": 238,
      "product_id": 73,
      "code": "CORP_Y",
      "name": "Corporate Yearly",
      "price": 1788,
      "category": "business",
      "sort_order": 450
    },
    {
      "id": 239,
      "product_id": 74,
      "code": "STHLM_M",
      "name": "Stockholm Monthly",
      "price": 499,
      "category": "regional",
      "sort_order": 610
    },
    {
      "id": 240,
      "product_id": 74,
      "code": "STHLM_Q",
      "name": "Stockholm Quarterly",
      "price": 1497,
      "category": "regional",
      "sort_order": 620
    },
    {
      "id": 241,
      "product_id": 74,
      "code": "STHLM_6M",
      "name": "Stockholm 6 Months",
      "price": 2994,
      "category": "regional",
      "sort_order": 630
    },
    {
      "id": 242,
      "product_id": 74,
      "code": "STHLM_Y",
      "name": "Stockholm Yearly",
      "price": 5988,
      "category": "regional",
      "sort_order": 640
    },
    {
      "id": 243,
      "product_id": 74,
      "code": "CORP_Y",
      "name": "Corporate Yearly",
      "price": 7188,
      "category": "business",
      "sort_order": 450
    },
    {
      "id": 244,
      "product_id": 75,
      "code": "SE_M",
      "name": "Sweden Monthly",
      "price": 699,
      "category": "regional",
      "sort_order": 510
    },
    {
      "id": 245,
      "product_id": 75,
      "code": "SE_Q",
      "name": "Sweden Quarterly",
      "price": 2097,
      "category": "regional",
      "sort_order": 520
    },
    {
      "id": 246,
      "product_id": 75,
      "code": "SE_6M",
      "name": "Sweden 6 Months",
      "price": 4194,
      "category": "regional",
      "sort_order": 530
    },
    {
      "id": 247,
      "product_id": 75,
      "code": "SE_Y",
      "name": "Sweden Yearly",
      "price": 8388,
      "category": "regional",
      "sort_order": 540
    },
    {
      "id": 248,
      "product_id": 76,
      "code": "STHLM_M",
      "name": "Stockholm Monthly",
      "price": 519,
      "category": "regional",
      "sort_order": 610
    },
    {
      "id": 249,
      "product_id": 76,
      "code": "STHLM_Q",
      "name": "Stockholm Quarterly",
      "price": 1557,
      "category": "regional",
      "sort_order": 620
    },
    {
      "id": 250,
      "product_id": 76,
      "code": "STHLM_6M",
      "name": "Stockholm 6 Months",
      "price": 3114,
      "category": "regional",
      "sort_order": 630
    },
    {
      "id": 251,
      "product_id": 76,
      "code": "STHLM_Y",
      "name": "Stockholm Yearly",
      "price": 6228,
      "category": "regional",
      "sort_order": 640
    },
    {
      "id": 252,
      "product_id": 77,
      "code": "M",
      "name": "Monthly",
      "price": 79,
      "category": "standard",
      "sort_order": 10
    },
    {
      "id": 253,
      "product_id": 78,
      "code": "Y/M",
      "name": "Yearly (per month)",
      "price": 149,
      "category": "standard",
      "sort_order": 50
    },
    {
      "id": 254,
      "product_id": 78,
      "code": "6M/M",
      "name": "6 Months (per month)",
      "price": 199,
      "category": "standard",
      "sort_order": 60
    },
    {
      "id": 255,
      "product_id": 78,
      "code": "Q/M",
      "name": "Quarterly (per month)",
      "price": 249,
      "category": "standard",
      "sort_order": 70
    },
    {
      "id": 256,
      "product_id": 78,
      "code": "APP3M",
      "name": "In-app 3 Months",
      "price": 749,
      "category": "app",
      "sort_order": 200
    },
    {
      "id": 257,
      "product_id": 79,
      "code": "Y/M",
      "name": "Yearly (per month)",
      "price": 199,
      "category": "standard",
      "sort_order": 50
    },
    {
      "id": 258,
      "product_id": 79,
      "code": "6M/M",
      "name": "6 Months (per month)",
      "price": 229,
      "category": "standard",
      "sort_order": 60
    },
    {
      "id": 259,
      "product_id": 79,
      "code": "Q/M",
      "name": "Quarterly (per month)",
      "price": 279,
      "category": "standard",
      "sort_order": 70
    },
    {
      "id": 260,
      "product_id": 79,
      "code": "APP6M",
      "name": "In-app 6 Months",
      "price": 1470,
      "category": "app",
      "sort_order": 210
    }
  ]
}
};

// Function to load the pre-populated database
window.loadPrePopulatedDatabase = async function() {
    try {
        if (!window.sqlDB || !window.sqlDB.isReady()) {
            throw new Error('SQL.js not initialized');
        }
        
        const db = window.sqlDB;
        const data = window.INITIAL_DATABASE.data;
        
        console.log('🔄 Loading pre-populated data...');
        
        // First, ensure the schema is loaded
        console.log('📄 Loading database schema...');
        await window.sqlDB.loadSchema();
        
        // Clear existing data (if any)
        db.execute('DELETE FROM rate_plans');
        db.execute('DELETE FROM products');
        db.execute('DELETE FROM brands');
        
        // Insert brands
        for (const brand of data.brands) {
            db.execute(
                'INSERT INTO brands (id, code, name, country) VALUES (?, ?, ?, ?)',
                [brand.id, brand.code, brand.name, brand.country]
            );
        }
        
        // Insert products
        for (const product of data.products) {
            db.execute(
                'INSERT INTO products (id, brand_id, name, type) VALUES (?, ?, ?, ?)',
                [product.id, product.brand_id, product.name, product.type]
            );
        }
        
        // Insert rate plans
        for (const ratePlan of data.ratePlans) {
            db.execute(
                'INSERT INTO rate_plans (id, product_id, code, name, price, category, sort_order) VALUES (?, ?, ?, ?, ?, ?, ?)',
                [ratePlan.id, ratePlan.product_id, ratePlan.code, ratePlan.name, ratePlan.price, ratePlan.category, ratePlan.sort_order]
            );
        }
        
        console.log('✅ Pre-populated database loaded:', window.INITIAL_DATABASE.stats);
        
        // Save to localStorage
        await window.dataManager.save();
        
        return { success: true, stats: window.INITIAL_DATABASE.stats };
        
    } catch (error) {
        console.error('❌ Failed to load pre-populated database:', error);
        return { success: false, error: error.message };
    }
};