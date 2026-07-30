export type ModuleType =
  | 'dashboard'
  | 'products'
  | 'inward'
  | 'inventory'
  | 'barcode'
  | 'pos'
  | 'events'
  | 'reports';

export type StockStatus = 'in_stock' | 'low_stock' | 'out_of_stock' | 'discontinued';

export interface Product {
  id: string;
  sku: string;
  name: string;
  category: string;
  price: number;
  cost: number;
  stock: number;
  minStock: number;
  warehouseZone: string;
  batchNo: string;
  barcode: string;
  imageUrl: string;
  status: StockStatus;
  lastUpdated: string;
  supplier: string;
  rating: number;
  description?: string;
  tags?: string[];
}

export interface InventoryBatch {
  id: string;
  sku: string;
  batchNo: string;
  receivedDate: string;
  edition?: string;
  costPrice: number;
  sellingPrice: number;
  totalQuantity: number;
  remainingQuantity: number;
  status: 'in_stock' | 'low_stock' | 'out_of_stock';
  grnNumber?: string;
}

export interface InwardItem {
  id: string;
  sku: string;
  name: string;
  quantity: number;
  unitCost: number;
  sellingPrice?: number; // Retail sales price entered during inward
  batchNo: string;
  expiryDate: string;
  taxRate: number; // GST percentage e.g., 5 or 12 or 18
  total: number;
}

export interface MaterialInwardNote {
  id: string;
  grnNumber: string;
  poNumber: string;
  vendorName: string;
  invoiceDate: string;
  warehouse: string;
  items: InwardItem[];
  status: 'completed' | 'draft' | 'pending_qc';
  totalValue: number;
  receivedBy: string;
  timestamp: string;
  notes?: string;
}

export interface WarehouseZone {
  id: string;
  name: string;
  code: string;
  capacity: number; // in pallet slots or units
  currentOccupancy: number;
  tempType: 'ambient' | 'cold' | 'secure_cage' | 'quarantine';
  manager: string;
  activeSKUs: number;
  description: string;
}

export type BarcodeFormat = 'code128' | 'ean13' | 'qr';
export type BarcodeLabelTemplate = 'retail_tag_1x2' | 'shelf_label_2x3' | 'jewelry_hangtag' | 'box_shipping_4x6';

export interface BarcodeRecord {
  id: string;
  sku: string;
  productName: string;
  barcodeValue: string;
  format: BarcodeFormat;
  template: BarcodeLabelTemplate;
  generatedAt: string;
  batchNo: string;
  printCount: number;
}

export interface CartItem {
  product: Product;
  quantity: number;
  discountPercent: number;
  customNote?: string;
}

export interface SalesTag {
  id: string;
  name: string;
  discount: number; // percentage (0 to 100)
  badgeColor?: string;
}

export type PaymentMethod = 'cash' | 'upi' | 'card' | 'split' | 'apple_pay';

export interface POSOrder {
  id: string;
  orderNumber: string;
  items: CartItem[];
  subtotal: number;
  discountAmount: number;
  taxAmount: number;
  total: number;
  paymentMethod: PaymentMethod;
  timestamp: string;
  cashierName: string;
  customerPhone?: string;
  customerName?: string;
  salesTag?: string;
  upiId?: string;
}

export interface SalesEvent {
  id: string;
  name: string;
  type: 'clearance' | 'flash_sale' | 'seasonal' | 'vip_exclusive' | 'stall_booth' | 'book_fair';
  startDate: string;
  endDate: string;
  status: 'active' | 'upcoming' | 'ended';
  targetRevenue: number;
  currentRevenue: number;
  allocatedSKUs: number;
  discountRule: string;
  description: string;
  bannerColor: string;
  stallLocation?: string;
  managerName?: string;
  booksSoldQty?: number;
  booksSoldRevenue?: number;
  giftsSoldQty?: number;
  giftsSoldRevenue?: number;
}

export interface StockMovement {
  id: string;
  type: 'inward_grn' | 'pos_sale' | 'zone_transfer' | 'shrinkage_adjustment';
  sku: string;
  productName: string;
  qtyDelta: number;
  fromZone?: string;
  toZone?: string;
  timestamp: string;
  operator: string;
  referenceNo: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: 'alert' | 'success' | 'warning' | 'info';
  timestamp: string;
  read: boolean;
  linkModule?: ModuleType;
}

export interface UserProfile {
  name: string;
  email: string;
  role: 'Store Manager' | 'Store Executive' | 'Warehouse Manager' | 'Lead Cashier' | 'System Admin';
  avatar: string;
  branch: string;
  shift: string;
}
