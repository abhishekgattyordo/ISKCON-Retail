import {
  Product,
  MaterialInwardNote,
  WarehouseZone,
  POSOrder,
  SalesEvent,
  StockMovement,
  NotificationItem,
  UserProfile,
  BarcodeRecord,
  InventoryBatch
} from '../types';

export const INITIAL_USER: UserProfile = {
  name: 'Radha Govinda Das',
  email: 'store.manager@aura-retail.org',
  role: 'Store Manager',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  branch: 'Main Temple Store — Mayapur HQ',
  shift: '08:00 – 17:00 IST'
};

export const INITIAL_ZONES: WarehouseZone[] = [
  {
    id: 'zone-a',
    name: 'Zone A — Main Retail Floor',
    code: 'ZA-01',
    capacity: 2500,
    currentOccupancy: 1850,
    tempType: 'ambient',
    manager: 'Sri Rama Das',
    activeSKUs: 320,
    description: 'Front shelf displays, fast-moving spiritual literature & deity garments'
  },
  {
    id: 'zone-b',
    name: 'Zone B — High-Density Book Storage',
    code: 'ZB-02',
    capacity: 5000,
    currentOccupancy: 4200,
    tempType: 'ambient',
    manager: 'Madhavananda Das',
    activeSKUs: 180,
    description: 'Bulk storage for Bhagavad-gita, Srimad-Bhagavatam & Caitanya-caritamrta sets'
  },
  {
    id: 'zone-c',
    name: 'Zone C — Premium Crafts & Brassware Vault',
    code: 'ZC-03',
    capacity: 1200,
    currentOccupancy: 640,
    tempType: 'secure_cage',
    manager: 'Gaurangi Devi',
    activeSKUs: 95,
    description: 'Locked vault for brass Deity idols, silver lamps & high-value brassware'
  },
  {
    id: 'zone-d',
    name: 'Zone D — Cold Storage & Organic Items',
    code: 'ZD-04',
    capacity: 800,
    currentOccupancy: 390,
    tempType: 'cold',
    manager: 'Mukunda Das',
    activeSKUs: 42,
    description: 'Temperature controlled 4°C-8°C for organic ghee, pure sandal paste & prasadam'
  }
];

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'p-101',
    sku: 'BK-BG-DELUXE',
    name: 'Bhagavad-gita As It Is (Deluxe Leatherbound)',
    category: 'Books',
    price: 850,
    cost: 420,
    stock: 240,
    minStock: 50,
    warehouseZone: 'Zone B — High-Density Book Storage',
    batchNo: 'BBT-2026-A1',
    barcode: '8901234567890',
    imageUrl: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&auto=format&fit=crop&q=80',
    status: 'in_stock',
    lastUpdated: '2026-07-28T10:30:00Z',
    supplier: 'BBT International Publishing',
    rating: 4.9,
    description: 'Full original edition with 48 full-color illustrations and original Sanskrit texts.',
    tags: ['Bestseller', 'Hardcover', 'Sanskrit']
  },
  {
    id: 'p-101-2022',
    sku: 'BK-BG-2022',
    name: 'Bhagavad Gita As It Is (2022 Edition)',
    category: 'Books',
    price: 350,
    cost: 180,
    stock: 120,
    minStock: 30,
    warehouseZone: 'Zone B — High-Density Book Storage',
    batchNo: 'BBT-2022-GITA',
    barcode: '8901234567222',
    imageUrl: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&auto=format&fit=crop&q=80',
    status: 'in_stock',
    lastUpdated: '2026-07-28T10:30:00Z',
    supplier: 'BBT International Publishing',
    rating: 4.8,
    description: 'Bhagavad Gita As It Is, 2022 softbound edition with authentic Sanskrit translations and commentary.',
    tags: ['Classic', 'Softcover', 'Sanskrit']
  },
  {
    id: 'p-101-2025',
    sku: 'BK-BG-2025',
    name: 'Bhagavad Gita As It Is (2025 Edition)',
    category: 'Books',
    price: 450,
    cost: 220,
    stock: 180,
    minStock: 30,
    warehouseZone: 'Zone B — High-Density Book Storage',
    batchNo: 'BBT-2025-GITA',
    barcode: '8901234567255',
    imageUrl: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&auto=format&fit=crop&q=80',
    status: 'in_stock',
    lastUpdated: '2026-07-28T10:30:00Z',
    supplier: 'BBT International Publishing',
    rating: 4.9,
    description: 'Bhagavad Gita As It Is, 2025 revised edition with expanded commentary, high-resolution color illustrations, and premium paper quality.',
    tags: ['Latest', 'Premium', 'Sanskrit']
  },
  {
    id: 'p-102',
    sku: 'BK-SB-SET18',
    name: 'Srimad-Bhagavatam Complete 18-Volume Canto Set',
    category: 'Books',
    price: 12500,
    cost: 7200,
    stock: 28,
    minStock: 10,
    warehouseZone: 'Zone B — High-Density Book Storage',
    batchNo: 'BBT-2026-SB1',
    barcode: '8901234567891',
    imageUrl: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400&auto=format&fit=crop&q=80',
    status: 'in_stock',
    lastUpdated: '2026-07-27T14:15:00Z',
    supplier: 'BBT International Publishing',
    rating: 5.0,
    description: 'Complete 18-volume set translated by A.C. Bhaktivedanta Swami Prabhupada.',
    tags: ['Set', 'Collector', 'Spiritual Science']
  },
  {
    id: 'p-103',
    sku: 'DW-BRASS-DEITY',
    name: 'Handcrafted Brass Radha-Krishna Deities (12 Inches)',
    category: 'Deity Worship',
    price: 4500,
    cost: 2100,
    stock: 8,
    minStock: 5,
    warehouseZone: 'Zone C — Premium Crafts & Brassware Vault',
    batchNo: 'VRN-2026-BR1',
    barcode: '8901234567892',
    imageUrl: 'https://images.unsplash.com/photo-1582562124811-c09040d0a901?w=400&auto=format&fit=crop&q=80',
    status: 'low_stock',
    lastUpdated: '2026-07-28T09:00:00Z',
    supplier: 'Vrindavan Artisan Crafts',
    rating: 4.8,
    description: 'Pure brass idols finely polished by traditional Vrindavan artisans.',
    tags: ['Brass', 'Handcrafted', 'Vrindavan']
  },
  {
    id: 'p-104',
    sku: 'DA-SILK-DHOTI',
    name: 'Pure Raw Silk Kurta Dhoti Set (Golden Saffron)',
    category: 'Devotional Apparel',
    price: 2200,
    cost: 1100,
    stock: 45,
    minStock: 15,
    warehouseZone: 'Zone A — Main Retail Floor',
    batchNo: 'MUP-2026-SL1',
    barcode: '8901234567893',
    imageUrl: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=400&auto=format&fit=crop&q=80',
    status: 'in_stock',
    lastUpdated: '2026-07-26T11:20:00Z',
    supplier: 'Mayapur Weavers Guild',
    rating: 4.7,
    description: '100% natural raw silk set ideal for festive occasions and daily temple seva.',
    tags: ['Silk', 'Festive', 'Traditional']
  },
  {
    id: 'p-105',
    sku: 'IN-SANDAL-WOOD',
    name: 'Natural Mysore Sandalwood Sticks & Incense Cones',
    category: 'Incense & Aromas',
    price: 350,
    cost: 140,
    stock: 180,
    minStock: 40,
    warehouseZone: 'Zone A — Main Retail Floor',
    batchNo: 'MYS-2026-IN1',
    barcode: '8901234567894',
    imageUrl: 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=400&auto=format&fit=crop&q=80',
    status: 'in_stock',
    lastUpdated: '2026-07-28T12:00:00Z',
    supplier: 'Mysore Natural Aromatics',
    rating: 4.9,
    description: 'Authentic Mysore pure sandalwood incense sticks free from charcoal and synthetic oils.',
    tags: ['Eco-friendly', 'Aroma', 'Pure']
  },
  {
    id: 'p-106',
    sku: 'OG-GHEE-PURE',
    name: 'A2 Gir Cow Organic Vedic Ghee (500ml Glass Jar)',
    category: 'Organic Products',
    price: 950,
    cost: 600,
    stock: 65,
    minStock: 20,
    warehouseZone: 'Zone D — Cold Storage & Organic Items',
    batchNo: 'GIR-2026-GH1',
    barcode: '8901234567895',
    imageUrl: 'https://images.unsplash.com/photo-1589927986089-35812388d1f4?w=400&auto=format&fit=crop&q=80',
    status: 'in_stock',
    lastUpdated: '2026-07-28T15:45:00Z',
    supplier: 'Surabhi Vedic Dairy Farm',
    rating: 4.9,
    description: 'Traditional Bilona method A2 Ghee made from grass-fed Gir cow milk.',
    tags: ['A2 Ghee', 'Bilona', 'Organic']
  }
];

export const INITIAL_INWARD_NOTES: MaterialInwardNote[] = [
  {
    id: 'grn-2026-001',
    grnNumber: 'GRN-2026-8801',
    poNumber: 'PO-BBT-904',
    vendorName: 'BBT International Publishing',
    invoiceDate: '2026-07-25',
    warehouse: 'Mayapur Central Logistics Hub',
    items: [
      {
        id: 'item-1',
        sku: 'BK-BG-DELUXE',
        name: 'Bhagavad-gita As It Is (Deluxe Leatherbound)',
        quantity: 100,
        unitCost: 420,
        sellingPrice: 850,
        batchNo: 'BBT-2026-A1',
        expiryDate: 'N/A',
        taxRate: 5,
        total: 44100
      }
    ],
    status: 'completed',
    totalValue: 44100,
    receivedBy: 'Radha Govinda Das',
    timestamp: '2026-07-25T11:30:00Z',
    notes: 'Verified barcode scanning and zero damage during transport.'
  }
];

export const INITIAL_ORDERS: POSOrder[] = [
  {
    id: 'ord-2026-101',
    orderNumber: 'POS-2026-7001',
    items: [
      {
        product: INITIAL_PRODUCTS[0],
        quantity: 2,
        discountPercent: 10
      },
      {
        product: INITIAL_PRODUCTS[4],
        quantity: 3,
        discountPercent: 0
      }
    ],
    subtotal: 2750,
    discountAmount: 170,
    taxAmount: 129,
    total: 2709,
    paymentMethod: 'upi',
    timestamp: '2026-07-28T16:20:00Z',
    cashierName: 'Radha Govinda Das',
    customerPhone: '+91 98765 43210',
    customerName: 'Ananda Vardhana Das',
    salesTag: 'Janmashtami Pre-Booking'
  }
];

export const INITIAL_EVENTS: SalesEvent[] = [
  {
    id: 'evt-2026-01',
    name: 'Janmashtami Maha Book Fair 2026',
    type: 'book_fair',
    startDate: '2026-08-10',
    endDate: '2026-08-25',
    status: 'upcoming',
    targetRevenue: 500000,
    currentRevenue: 120000,
    allocatedSKUs: 150,
    discountRule: 'Flat 20% on all BBT hardcover publications',
    description: 'Annual flagship event featuring book distribution stalls and cultural programs.',
    bannerColor: 'from-amber-500 to-orange-600',
    stallLocation: 'Main Temple Courtyard Pavilion A',
    managerName: 'Sri Rama Das',
    booksSoldQty: 420,
    booksSoldRevenue: 110000,
    giftsSoldQty: 85,
    giftsSoldRevenue: 10000
  }
];

export const INITIAL_MOVEMENTS: StockMovement[] = [
  {
    id: 'mov-101',
    type: 'inward_grn',
    sku: 'BK-BG-DELUXE',
    productName: 'Bhagavad-gita As It Is (Deluxe Leatherbound)',
    qtyDelta: 100,
    fromZone: 'Vendor - BBT',
    toZone: 'Zone B — High-Density Book Storage',
    timestamp: '2026-07-25T11:30:00Z',
    operator: 'Radha Govinda Das',
    referenceNo: 'GRN-2026-8801'
  }
];

export const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif-01',
    title: 'Low Stock Alert',
    message: 'Handcrafted Brass Radha-Krishna Deities reached min threshold (8 remaining).',
    timestamp: '10 mins ago',
    type: 'warning',
    read: false,
    linkModule: 'products'
  },
  {
    id: 'notif-02',
    title: 'Material Inward GRN Verified',
    message: 'GRN-2026-8801 with 100 Bhagavad-gita books successfully logged.',
    timestamp: '2 hours ago',
    type: 'success',
    read: true,
    linkModule: 'inward'
  }
];

export const INITIAL_BARCODES: BarcodeRecord[] = [
  {
    id: 'bc-101',
    sku: 'BK-BG-DELUXE',
    productName: 'Bhagavad-gita As It Is (Deluxe Leatherbound)',
    barcodeValue: '8901234567890',
    format: 'code128',
    template: 'retail_tag_1x2',
    generatedAt: '2026-07-28T09:00:00Z',
    batchNo: 'BBT-2026-A1',
    printCount: 50
  },
  {
    id: 'bc-102',
    sku: 'BK-BG-2022',
    productName: 'Bhagavad Gita As It Is (2022 Edition)',
    barcodeValue: '8901234567222',
    format: 'code128',
    template: 'retail_tag_1x2',
    generatedAt: '2026-07-28T09:00:00Z',
    batchNo: 'BBT-2022-GITA',
    printCount: 150
  },
  {
    id: 'bc-103',
    sku: 'BK-BG-2025',
    productName: 'Bhagavad Gita As It Is (2025 Edition)',
    barcodeValue: '8901234567255',
    format: 'code128',
    template: 'retail_tag_1x2',
    generatedAt: '2026-07-28T09:00:00Z',
    batchNo: 'BBT-2025-GITA',
    printCount: 200
  }
];

export const INITIAL_BATCHES: InventoryBatch[] = [
  {
    id: 'bat-101-1',
    sku: 'BK-BG-DELUXE',
    batchNo: 'BBT-2025-A0',
    receivedDate: '2025-06-15',
    edition: '2025 Edition',
    costPrice: 400,
    sellingPrice: 800,
    totalQuantity: 150,
    remainingQuantity: 40,
    status: 'in_stock',
    grnNumber: 'GRN-2025-1022'
  },
  {
    id: 'bat-101-2',
    sku: 'BK-BG-DELUXE',
    batchNo: 'BBT-2026-A1',
    receivedDate: '2026-07-25',
    edition: '2026 Deluxe Edition',
    costPrice: 420,
    sellingPrice: 850,
    totalQuantity: 200,
    remainingQuantity: 200,
    status: 'in_stock',
    grnNumber: 'GRN-2026-8801'
  },
  {
    id: 'bat-102-1',
    sku: 'BK-BG-2022',
    batchNo: 'BBT-2022-GITA',
    receivedDate: '2022-10-10',
    edition: '2022 Edition',
    costPrice: 180,
    sellingPrice: 350,
    totalQuantity: 150,
    remainingQuantity: 120,
    status: 'in_stock',
    grnNumber: 'GRN-2022-4012'
  },
  {
    id: 'bat-103-1',
    sku: 'BK-BG-2025',
    batchNo: 'BBT-2025-GITA',
    receivedDate: '2025-01-20',
    edition: '2025 Edition',
    costPrice: 220,
    sellingPrice: 450,
    totalQuantity: 200,
    remainingQuantity: 180,
    status: 'in_stock',
    grnNumber: 'GRN-2025-5022'
  },
  {
    id: 'bat-104-1',
    sku: 'BK-SB-SET18',
    batchNo: 'BBT-2026-SB1',
    receivedDate: '2026-03-12',
    edition: '1st Edition',
    costPrice: 7200,
    sellingPrice: 12500,
    totalQuantity: 40,
    remainingQuantity: 28,
    status: 'in_stock',
    grnNumber: 'GRN-2026-1044'
  },
  {
    id: 'bat-105-1',
    sku: 'DW-BRASS-DEITY',
    batchNo: 'VRN-2026-BR1',
    receivedDate: '2026-05-02',
    edition: 'Handcrafted 2026',
    costPrice: 2100,
    sellingPrice: 4500,
    totalQuantity: 10,
    remainingQuantity: 8,
    status: 'low_stock',
    grnNumber: 'GRN-2026-2005'
  },
  {
    id: 'bat-106-1',
    sku: 'DA-SILK-DHOTI',
    batchNo: 'MUP-2026-SL1',
    receivedDate: '2026-06-01',
    edition: 'Summer 2026',
    costPrice: 1100,
    sellingPrice: 2200,
    totalQuantity: 50,
    remainingQuantity: 45,
    status: 'in_stock',
    grnNumber: 'GRN-2026-3011'
  },
  {
    id: 'bat-107-1',
    sku: 'IN-SANDAL-WOOD',
    batchNo: 'MYS-2026-IN1',
    receivedDate: '2026-04-18',
    edition: 'Standard',
    costPrice: 140,
    sellingPrice: 350,
    totalQuantity: 200,
    remainingQuantity: 180,
    status: 'in_stock',
    grnNumber: 'GRN-2026-4022'
  },
  {
    id: 'bat-108-1',
    sku: 'OG-GHEE-PURE',
    batchNo: 'GIR-2026-GH1',
    receivedDate: '2026-07-05',
    edition: 'Vedic Bilona',
    costPrice: 600,
    sellingPrice: 950,
    totalQuantity: 80,
    remainingQuantity: 65,
    status: 'in_stock',
    grnNumber: 'GRN-2026-5055'
  }
];
