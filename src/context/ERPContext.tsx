'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  ModuleType,
  Product,
  MaterialInwardNote,
  WarehouseZone,
  POSOrder,
  SalesEvent,
  StockMovement,
  NotificationItem,
  UserProfile,
  BarcodeRecord,
  CartItem,
  SalesTag,
  InventoryBatch
} from '../types';
import {
  INITIAL_PRODUCTS,
  INITIAL_INWARD_NOTES,
  INITIAL_ZONES,
  INITIAL_ORDERS,
  INITIAL_EVENTS,
  INITIAL_MOVEMENTS,
  INITIAL_NOTIFICATIONS,
  INITIAL_USER,
  INITIAL_BARCODES,
  INITIAL_BATCHES
} from '../data/initialData';

interface ERPContextType {
  activeModule: ModuleType;
  setActiveModule: (mod: ModuleType, updateUrl?: boolean) => void;
  products: Product[];
  addProduct: (product: Omit<Product, 'id'>) => void;
  updateProduct: (id: string, updates: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  inwardNotes: MaterialInwardNote[];
  addInwardNote: (note: Omit<MaterialInwardNote, 'id'>) => void;
  batches: InventoryBatch[];
  setBatches: React.Dispatch<React.SetStateAction<InventoryBatch[]>>;
  zones: WarehouseZone[];
  orders: POSOrder[];
  addOrder: (order: Omit<POSOrder, 'id'>) => void;
  events: SalesEvent[];
  addEvent: (event: Omit<SalesEvent, 'id' | 'currentRevenue' | 'booksSoldQty' | 'booksSoldRevenue' | 'giftsSoldQty' | 'giftsSoldRevenue'>) => void;
  updateEvent: (id: string, updates: Partial<SalesEvent>) => void;
  deleteEvent: (id: string) => void;
  setEvents: React.Dispatch<React.SetStateAction<SalesEvent[]>>;
  movements: StockMovement[];
  notifications: NotificationItem[];
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  barcodes: BarcodeRecord[];
  addBarcodeRecord: (record: Omit<BarcodeRecord, 'id'>) => void;
  salesTags: SalesTag[];
  addSalesTag: (tag: Omit<SalesTag, 'id'>) => void;
  deleteSalesTag: (id: string) => void;
  user: UserProfile;
  cart: CartItem[];
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateCartQuantity: (productId: string, quantity: number) => void;
  updateCartDiscount: (productId: string, discount: number) => void;
  clearCart: () => void;
  isSearchModalOpen: boolean;
  setIsSearchModalOpen: (open: boolean) => void;
  theme: 'light' | 'dark' | 'system';
  setTheme: (theme: 'light' | 'dark' | 'system') => void;
  sidebarCollapsed: boolean;
  toggleSidebar: () => void;
  mobileMenuOpen: boolean;
  setMobileMenuOpen: (open: boolean) => void;
  quickNotification: (title: string, message: string, type?: 'alert' | 'success' | 'warning' | 'info') => void;
  isAuthenticated: boolean;
  login: (email: string, pass: string) => boolean;
  logout: () => void;
}

const ERPContext = createContext<ERPContextType | undefined>(undefined);

export const ERPProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeModule, setActiveModuleState] = useState<ModuleType>(() => {
    if (typeof window !== 'undefined') {
      const path = window.location.pathname.replace(/^\//, '');
      const validModules: ModuleType[] = ['dashboard', 'products', 'inward', 'inventory', 'pos', 'barcode', 'events', 'reports'];
      if (validModules.includes(path as ModuleType)) {
        return path as ModuleType;
      }
    }
    return 'dashboard';
  });

  // Route-based URL history navigation sync
  const setActiveModule = (mod: ModuleType, updateUrl: boolean = true) => {
    setActiveModuleState(mod);
    setMobileMenuOpen(false);
    if (updateUrl && typeof window !== 'undefined') {
      const targetPath = mod === 'dashboard' ? '/' : `/${mod}`;
      if (window.location.pathname !== targetPath) {
        window.history.pushState({ module: mod }, '', targetPath);
      }
    }
  };

  // Listen to browser Back/Forward navigation (popstate)
  useEffect(() => {
    const handlePopState = () => {
      if (typeof window === 'undefined') return;
      const path = window.location.pathname.replace(/^\//, '');
      const validModules: ModuleType[] = ['dashboard', 'products', 'inward', 'inventory', 'pos', 'barcode', 'events', 'reports'];
      if (validModules.includes(path as ModuleType)) {
        setActiveModuleState(path as ModuleType);
      } else {
        setActiveModuleState('dashboard');
      }
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [inwardNotes, setInwardNotes] = useState<MaterialInwardNote[]>(INITIAL_INWARD_NOTES);
  const [batches, setBatches] = useState<InventoryBatch[]>(INITIAL_BATCHES);
  const [zones] = useState<WarehouseZone[]>(INITIAL_ZONES);
  const [orders, setOrders] = useState<POSOrder[]>(INITIAL_ORDERS);
  const [events, setEvents] = useState<SalesEvent[]>(INITIAL_EVENTS);
  const [movements, setMovements] = useState<StockMovement[]>(INITIAL_MOVEMENTS);
  const [notifications, setNotifications] = useState<NotificationItem[]>(INITIAL_NOTIFICATIONS);
  const [barcodes, setBarcodes] = useState<BarcodeRecord[]>(INITIAL_BARCODES);
  const [salesTags, setSalesTags] = useState<SalesTag[]>([
    { id: 'tag-1', name: 'Standard Retail', discount: 0, badgeColor: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300' },
    { id: 'tag-2', name: 'Ashram Donation', discount: 100, badgeColor: 'bg-red-50 text-red-700 border border-red-200' },
    { id: 'tag-3', name: 'Book Distribution Patron (-20%)', discount: 20, badgeColor: 'bg-indigo-50 text-indigo-700 border border-indigo-200' },
    { id: 'tag-4', name: 'Sunday Feast Special (-10%)', discount: 10, badgeColor: 'bg-amber-50 text-amber-700 border border-amber-200' },
    { id: 'tag-5', name: 'Full Donation / Complimentary', discount: 100, badgeColor: 'bg-emerald-50 text-emerald-700 border border-emerald-200' }
  ]);
  const [user, setUser] = useState<UserProfile>(INITIAL_USER);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const auth = localStorage.getItem('iskcon_erp_auth') === 'true';
      setIsAuthenticated(auth);
      const storedUser = localStorage.getItem('iskcon_erp_user');
      if (storedUser) {
        try {
          setUser(JSON.parse(storedUser));
        } catch (e) {
          // ignore
        }
      }
    }
  }, []);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [theme, setThemeState] = useState<'light' | 'dark' | 'system'>('light');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Handle dark mode DOM classes
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [theme]);

  // Handle keyboard shortcut for Cmd/Ctrl+K search modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsSearchModalOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const setTheme = (newTheme: 'light' | 'dark' | 'system') => {
    setThemeState(newTheme);
  };

  const toggleSidebar = () => {
    if (typeof window !== 'undefined' && window.innerWidth < 1024) {
      setMobileMenuOpen(prev => !prev);
    } else {
      setSidebarCollapsed(prev => !prev);
    }
  };

  const quickNotification = (
    title: string,
    message: string,
    type: 'alert' | 'success' | 'warning' | 'info' = 'info'
  ) => {
    const newNotif: NotificationItem = {
      id: `notif-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      title,
      message,
      type,
      timestamp: 'Just now',
      read: false
    };
    setNotifications(prev => [newNotif, ...prev]);
  };

  const addProduct = (prodData: Omit<Product, 'id'>) => {
    const newProd: Product = {
      ...prodData,
      id: `prod-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`
    };
    setProducts(prev => [newProd, ...prev]);
    quickNotification('Product Catalog Updated', `Added SKU ${newProd.sku} (${newProd.name}) to catalog.`, 'success');
  };

  const updateProduct = (id: string, updates: Partial<Product>) => {
    setProducts(prev =>
      prev.map(p => {
        if (p.id === id) {
          const updated = { ...p, ...updates, lastUpdated: new Date().toISOString() };
          return updated;
        }
        return p;
      })
    );
  };

  const deleteProduct = (id: string) => {
    const target = products.find(p => p.id === id);
    setProducts(prev => prev.filter(p => p.id !== id));
    if (target) {
      quickNotification('Product Deleted', `Removed SKU ${target.sku} from active database.`, 'warning');
    }
  };

  const addInwardNote = (noteData: Omit<MaterialInwardNote, 'id'>) => {
    const newNote: MaterialInwardNote = {
      ...noteData,
      id: `min-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`
    };
    setInwardNotes(prev => [newNote, ...prev]);

    // Automatically adjust inventory stock levels based on GRN items
    newNote.items.forEach(item => {
      setProducts(prev =>
        prev.map(p => {
          if (p.sku === item.sku) {
            const newStock = p.stock + item.quantity;
            return {
              ...p,
              stock: newStock,
              cost: item.unitCost > 0 ? item.unitCost : p.cost,
              price: item.sellingPrice && item.sellingPrice > 0 ? item.sellingPrice : p.price,
              batchNo: item.batchNo || p.batchNo,
              status: newStock <= p.minStock ? 'low_stock' : 'in_stock',
              lastUpdated: new Date().toISOString()
            };
          }
          return p;
        })
      );

      // Create a new inventory batch
      const newBatch: InventoryBatch = {
        id: `bat-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
        sku: item.sku,
        batchNo: item.batchNo || `BAT-${newNote.invoiceDate ? newNote.invoiceDate.slice(0, 4) : new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`,
        receivedDate: newNote.invoiceDate || new Date().toISOString().slice(0, 10),
        edition: item.sku.includes('2022') ? '2022 Edition' : item.sku.includes('2025') ? '2025 Edition' : item.sku.includes('DELUXE') ? 'Deluxe Edition' : 'Standard Edition',
        costPrice: item.unitCost,
        sellingPrice: item.sellingPrice && item.sellingPrice > 0 ? item.sellingPrice : (item.unitCost * 1.5),
        totalQuantity: item.quantity,
        remainingQuantity: item.quantity,
        status: 'in_stock',
        grnNumber: newNote.grnNumber
      };
      setBatches(prev => [newBatch, ...prev]);

      // Add audit movement
      const mov: StockMovement = {
        id: `mov-${Date.now()}-${Math.random()}`,
        type: 'inward_grn',
        sku: item.sku,
        productName: item.name,
        qtyDelta: item.quantity,
        toZone: newNote.warehouse,
        timestamp: 'Just now',
        operator: newNote.receivedBy,
        referenceNo: newNote.grnNumber
      };
      setMovements(m => [mov, ...m]);
    });

    quickNotification('GRN Created Successfully', `Document ${newNote.grnNumber} processed. Inventory balances updated.`, 'success');
  };

  const addOrder = (orderData: Omit<POSOrder, 'id'>) => {
    const newOrder: POSOrder = {
      ...orderData,
      id: `ord-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`
    };
    setOrders(prev => [newOrder, ...prev]);

    // Deduct stock
    newOrder.items.forEach(cartItem => {
      // FIFO Batch-wise inventory tracking deduction
      setBatches(prevBatches => {
        const skuBatches = prevBatches
          .filter(b => b.sku === cartItem.product.sku && b.remainingQuantity > 0)
          .sort((a, b) => a.receivedDate.localeCompare(b.receivedDate));

        let qtyNeeded = cartItem.quantity;
        const deductions: Record<string, number> = {};

        for (const batch of skuBatches) {
          if (qtyNeeded <= 0) break;
          const toDeduct = Math.min(batch.remainingQuantity, qtyNeeded);
          deductions[batch.id] = batch.remainingQuantity - toDeduct;
          qtyNeeded -= toDeduct;
        }

        return prevBatches.map(b => {
          if (b.id in deductions) {
            const rem = deductions[b.id];
            return {
              ...b,
              remainingQuantity: rem,
              status: rem === 0 ? 'out_of_stock' : rem <= 5 ? 'low_stock' : 'in_stock' as 'in_stock' | 'low_stock' | 'out_of_stock'
            };
          }
          return b;
        });
      });

      setProducts(prev =>
        prev.map(p => {
          if (p.id === cartItem.product.id) {
            const newStock = Math.max(0, p.stock - cartItem.quantity);
            return {
              ...p,
              stock: newStock,
              status: newStock === 0 ? 'out_of_stock' : newStock <= p.minStock ? 'low_stock' : 'in_stock'
            };
          }
          return p;
        })
      );

      // Add movement
      const mov: StockMovement = {
        id: `mov-${Date.now()}-${Math.random()}`,
        type: 'pos_sale',
        sku: cartItem.product.sku,
        productName: cartItem.product.name,
        qtyDelta: -cartItem.quantity,
        fromZone: cartItem.product.warehouseZone,
        timestamp: 'Just now',
        operator: newOrder.cashierName,
        referenceNo: newOrder.orderNumber
      };
      setMovements(m => [mov, ...m]);
    });

    quickNotification('POS Order Completed', `Order ${newOrder.orderNumber} (₹${newOrder.total.toFixed(2)}) processed via ${newOrder.paymentMethod.replace('_', ' ')}.`, 'success');
  };

  const addEvent = (eventData: Omit<SalesEvent, 'id' | 'currentRevenue' | 'booksSoldQty' | 'booksSoldRevenue' | 'giftsSoldQty' | 'giftsSoldRevenue'>) => {
    const newEvent: SalesEvent = {
      ...eventData,
      id: `evt-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      currentRevenue: 0,
      booksSoldQty: 0,
      booksSoldRevenue: 0,
      giftsSoldQty: 0,
      giftsSoldRevenue: 0,
    };
    setEvents(prev => [newEvent, ...prev]);
    quickNotification('Sales Event Created', `Event "${newEvent.name}" is now registered.`, 'success');
  };

  const updateEvent = (id: string, updates: Partial<SalesEvent>) => {
    setEvents(prev => prev.map(evt => evt.id === id ? { ...evt, ...updates } : evt));
  };

  const deleteEvent = (id: string) => {
    setEvents(prev => prev.filter(evt => evt.id !== id));
    quickNotification('Event Deleted', 'Sales event removed from system.', 'info');
  };

  const addToCart = (product: Product, quantity = 1) => {
    setCart(prev => {
      const existing = prev.find(item => item.product.id === product.id);
      if (existing) {
        return prev.map(item =>
          item.product.id === product.id ? { ...item, quantity: item.quantity + quantity } : item
        );
      }
      return [...prev, { product, quantity, discountPercent: 0 }];
    });
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => prev.filter(item => item.product.id !== productId));
  };

  const updateCartQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart(prev =>
      prev.map(item => (item.product.id === productId ? { ...item, quantity } : item))
    );
  };

  const updateCartDiscount = (productId: string, discount: number) => {
    setCart(prev =>
      prev.map(item => (item.product.id === productId ? { ...item, discountPercent: discount } : item))
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const addBarcodeRecord = (recordData: Omit<BarcodeRecord, 'id'>) => {
    const newRec: BarcodeRecord = {
      ...recordData,
      id: `bar-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`
    };
    setBarcodes(prev => [newRec, ...prev]);
    quickNotification('Barcode Batch Generated', `Created ${newRec.printCount} labels for SKU ${newRec.sku}.`, 'success');
  };

  const addSalesTag = (tagData: Omit<SalesTag, 'id'>) => {
    const newTag: SalesTag = {
      ...tagData,
      id: `tag-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      badgeColor: tagData.badgeColor || 'bg-amber-50 text-[#D97706] border border-amber-200'
    };
    setSalesTags(prev => [...prev, newTag]);
    quickNotification('Sales Tag Created', `Added tag "${newTag.name}" with ${newTag.discount}% discount.`, 'success');
  };

  const deleteSalesTag = (id: string) => {
    const target = salesTags.find(t => t.id === id);
    if (target?.name === 'Standard Retail') {
      quickNotification('Cannot Delete', 'Standard Retail tag is required by the system.', 'alert');
      return;
    }
    setSalesTags(prev => prev.filter(t => t.id !== id));
    if (target) {
      quickNotification('Sales Tag Removed', `Deleted tag "${target.name}".`, 'warning');
    }
  };

  const markNotificationRead = (id: string) => {
    setNotifications(prev =>
      prev.map(n => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllNotificationsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const login = (email: string, pass: string): boolean => {
    const cleanEmail = email.trim().toLowerCase();
    let validatedUser: UserProfile | null = null;

    if (cleanEmail === 'store.manager@aura-retail.org' && pass === 'radha108') {
      validatedUser = {
        name: 'Radha Govinda Das',
        email: 'store.manager@aura-retail.org',
        role: 'Store Manager',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        branch: 'Main Temple Store — Mayapur HQ',
        shift: '08:00 – 17:00 IST'
      };
    } else if (cleanEmail === 'srirama@aura-retail.org' && pass === 'ram108') {
      validatedUser = {
        name: 'Sri Rama Das',
        email: 'srirama@aura-retail.org',
        role: 'Lead Cashier',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
        branch: 'Vrindavan Festival Stall A',
        shift: '07:00 – 18:00 IST'
      };
    }

    if (validatedUser) {
      setIsAuthenticated(true);
      setUser(validatedUser);
      if (typeof window !== 'undefined') {
        localStorage.setItem('iskcon_erp_auth', 'true');
        localStorage.setItem('iskcon_erp_user', JSON.stringify(validatedUser));
      }
      quickNotification('Hare Krishna!', `Welcome back, ${validatedUser.name}. Session verified.`, 'success');
      return true;
    }

    quickNotification('Authentication Failed', 'Invalid email or passcode. Please try again.', 'alert');
    return false;
  };

  const logout = () => {
    setIsAuthenticated(false);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('iskcon_erp_auth');
      localStorage.removeItem('iskcon_erp_user');
    }
    quickNotification('Logged Out', 'You have been safely signed out of the ERP system.', 'info');
  };

  return (
    <ERPContext.Provider
      value={{
        activeModule,
        setActiveModule,
        products,
        addProduct,
        updateProduct,
        deleteProduct,
        inwardNotes,
        addInwardNote,
        batches,
        setBatches,
        zones,
        orders,
        addOrder,
        events,
        addEvent,
        updateEvent,
        deleteEvent,
        setEvents,
        movements,
        notifications,
        markNotificationRead,
        markAllNotificationsRead,
        barcodes,
        addBarcodeRecord,
        salesTags,
        addSalesTag,
        deleteSalesTag,
        user,
        cart,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        updateCartDiscount,
        clearCart,
        isSearchModalOpen,
        setIsSearchModalOpen,
        theme,
        setTheme,
        sidebarCollapsed,
        toggleSidebar,
        mobileMenuOpen,
        setMobileMenuOpen,
        quickNotification,
        isAuthenticated,
        login,
        logout
      }}
    >
      {children}
    </ERPContext.Provider>
  );
};

export const useERP = () => {
  const context = useContext(ERPContext);
  if (!context) {
    throw new Error('useERP must be used within an ERPProvider');
  }
  return context;
};
