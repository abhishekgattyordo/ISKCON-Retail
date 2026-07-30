'use client';

import React, { useState, useEffect } from 'react';
import { useERP } from '../../context/ERPContext';
import { POSOrder, SalesTag } from '../../types';
import { motion, AnimatePresence } from 'motion/react';
import {
  Terminal,
  Search,
  Plus,
  Minus,
  Trash2,
  CreditCard,
  Banknote,
  Smartphone,
  CheckCircle2,
  Tag,
  ShoppingBag,
  ArrowRight,
  Receipt,
  User,
  ShieldCheck,
  QrCode,
  Camera,
  X,
  Sparkles,
  Barcode,
  Percent,
  Printer,
  FileText,
  AlertCircle,
  Monitor,
  Zap
} from 'lucide-react';

// Dynamic sales tags are loaded from ERPContext

export const POSTerminal: React.FC = () => {
  const { products, cart, addToCart, removeFromCart, updateCartQuantity, clearCart, addOrder, user, quickNotification, salesTags, addSalesTag, deleteSalesTag } = useERP();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'cash' | 'upi'>('upi');
  const [customerName, setCustomerName] = useState('Bhakta John');
  
  // Set default active tag from context salesTags
  const [activeTag, setActiveTag] = useState<SalesTag | null>(null);
  useEffect(() => {
    if (salesTags && salesTags.length > 0) {
      const exists = salesTags.find(t => t.id === activeTag?.id);
      if (!exists) {
        setActiveTag(salesTags[0]);
      } else {
        setActiveTag(exists);
      }
    }
  }, [salesTags]);

  // Modals & Scanners
  const [barcodeInput, setBarcodeInput] = useState('');
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [isTagsModalOpen, setIsTagsModalOpen] = useState(false);
  const [newTagName, setNewTagName] = useState('');
  const [newTagDiscount, setNewTagDiscount] = useState<number>(0);
  const [cameraScanningText, setCameraScanningText] = useState('Align barcode within laser crosshairs...');
  const [checkoutSuccess, setCheckoutSuccess] = useState(false);
  const [lastOrder, setLastOrder] = useState<any>(null);
  const [showReceiptPreview, setShowReceiptPreview] = useState(false);

  const categories = ['All', ...Array.from(new Set(products.map(p => p.category)))];

  const filteredProducts = products.filter(p => {
    if (!p) return false;
    const matchesSearch = (p.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (p.sku || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (p.barcode || '').includes(searchQuery);
    const matchesCat = selectedCategory === 'All' || p.category === selectedCategory;
    return matchesSearch && matchesCat && p.stock > 0;
  });

  // Calculations
  const getProductTaxRate = (category: string): number => {
    if (category === 'Books') return 5; // 5% GST for spiritual books
    if (category === 'Organic Products') return 12; // 12% GST for A2 Ghee etc.
    if (category === 'Devotional Apparel') return 12; // 12% GST for Silk Dhoti etc.
    if (category === 'Deity Worship') return 18; // 18% GST for fine brass deities
    return 5; // Default 5% GST
  };

  const cartRawSubtotal = cart.reduce((acc, item) => acc + (item.product.price * item.quantity), 0);
  const discountPercent = activeTag?.discount || 0;
  const discountAmount = (cartRawSubtotal * discountPercent) / 100;
  const cartSubtotalAfterDiscount = Math.max(0, cartRawSubtotal - discountAmount);

  // Dynamic, item-category-specific GST calculation
  const cartTax = cart.reduce((acc, item) => {
    const effectivePrice = item.product.price * (1 - discountPercent / 100);
    const taxRate = getProductTaxRate(item.product.category);
    return acc + (effectivePrice * item.quantity * (taxRate / 100));
  }, 0);

  const cartTotal = cartSubtotalAfterDiscount + cartTax;

  // Barcode quick scan handler
  const handleBarcodeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanInput = barcodeInput.trim();
    if (!cleanInput) return;

    // Exact match by Barcode first, then fall back to SKU (case insensitive)
    const found = products.find(p => p.barcode === cleanInput || p.sku.toLowerCase() === cleanInput.toLowerCase());
    if (found) {
      if (found.stock > 0) {
        addToCart(found, 1);
        const taxRate = getProductTaxRate(found.category);
        quickNotification(
          'Barcode Identified',
          `Added ${found.name} (Price: ₹${found.price}, Batch: ${found.batchNo}, GST: ${taxRate}%)`,
          'success'
        );
      } else {
        quickNotification('Out of Stock', `${found.name} currently has 0 units in stock.`, 'warning');
      }
      setBarcodeInput('');
    } else {
      quickNotification('Barcode Not Found', `No SKU/Barcode matching "${cleanInput}" in active catalog.`, 'alert');
    }
  };

  // Simulate camera barcode scan for specific products
  const simulateCameraScanProduct = (sku: string) => {
    setCameraScanningText('Processing scanned frame...');
    setTimeout(() => {
      const found = products.find(p => p.sku === sku);
      if (found) {
        if (found.stock > 0) {
          addToCart(found, 1);
          const taxRate = getProductTaxRate(found.category);
          quickNotification(
            'Camera Scan Verified',
            `Identified ${found.name} (Price: ₹${found.price}, Batch: ${found.batchNo}, GST: ${taxRate}%)`,
            'success'
          );
        } else {
          quickNotification('Out of Stock', `${found.name} currently has 0 units in stock.`, 'warning');
        }
        setIsCameraOpen(false);
        setCameraScanningText('Align barcode within laser crosshairs...');
      } else {
        quickNotification('Scan Error', `Could not match scanned object.`, 'alert');
      }
    }, 1200);
  };

  // Keep fallback random scan generator
  const simulateCameraScan = () => {
    setCameraScanningText('Locating barcode stream...');
    setTimeout(() => {
      const randomProd = products[Math.floor(Math.random() * products.length)];
      if (randomProd) {
        if (randomProd.stock > 0) {
          addToCart(randomProd, 1);
          const taxRate = getProductTaxRate(randomProd.category);
          quickNotification(
            'Camera Scan Verified',
            `Scanned ${randomProd.name} (Price: ₹${randomProd.price}, Batch: ${randomProd.batchNo}, GST: ${taxRate}%)`,
            'success'
          );
        } else {
          quickNotification('Out of Stock', `${randomProd.name} is out of stock.`, 'warning');
        }
        setIsCameraOpen(false);
        setCameraScanningText('Align barcode within laser crosshairs...');
      }
    }, 1500);
  };

  const handleCheckout = () => {
    if (cart.length === 0) return;
    const orderNo = `INV-${new Date().getFullYear()}-${Date.now().toString().slice(-6)}`;
    const newOrderPayload: POSOrder = {
      id: `ord-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      orderNumber: orderNo,
      items: [...cart],
      subtotal: cartRawSubtotal,
      discountAmount,
      taxAmount: cartTax,
      total: cartTotal,
      paymentMethod,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      cashierName: user?.name || 'Radha Govinda Das',
      customerName: customerName || 'Walk-in Devotee',
      salesTag: activeTag?.name || 'Standard Retail'
    };
    addOrder(newOrderPayload);
    setLastOrder(newOrderPayload);
    setCheckoutSuccess(true);
    setShowReceiptPreview(true);
    clearCart();
    quickNotification('POS Checkout Completed', `Invoice ${orderNo} generated via ${paymentMethod.toUpperCase()}.`, 'success');
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto font-sans">
      {/* Top Barcode & Terminal Status Header */}
      <div className="p-6 rounded-2xl bg-[#FFFFFF] dark:bg-slate-900 border border-[#E5E7EB] dark:border-slate-800 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-[#10B981]/15 text-[#10B981] flex items-center justify-center">
              <Monitor className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold tracking-tight text-[#111827] dark:text-white">
                  POS Express Checkout
                </h1>
                <span className="px-2 py-0.5 rounded-full bg-[#10B981]/15 text-[#10B981] font-mono text-[11px] font-semibold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] animate-ping" /> TERMINAL 01
                </span>
              </div>
              <p className="text-xs text-[#6B7280] dark:text-slate-400 mt-0.5">
                High-speed barcode scanner • Touch terminal • Integrated GST calculation
              </p>
            </div>
          </div>
        </div>

        {/* Large Barcode Scanner Input */}
        <div className="flex items-center gap-3 w-full md:w-auto">
          <form onSubmit={handleBarcodeSubmit} className="relative flex-1 md:w-80">
            <Barcode className="w-4 h-4 text-[#D97706] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={barcodeInput}
              onChange={e => setBarcodeInput(e.target.value)}
              placeholder="Scan or type barcode SKU (e.g. BOOK-001)..."
              className="w-full pl-10 pr-20 py-2.5 rounded-xl bg-amber-50/50 dark:bg-slate-800 border border-[#E8E2D9] dark:border-slate-700 text-xs font-mono text-[#1F1916] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#D97706] shadow-2xs"
            />
            <button
              type="submit"
              className="absolute right-1.5 top-1.5 bottom-1.5 px-3 rounded-lg bg-[#D97706] hover:bg-[#B45309] text-white text-[11px] font-medium transition-colors"
            >
              ADD
            </button>
          </form>

          <button
            onClick={() => setIsCameraOpen(true)}
            className="px-4 py-2.5 rounded-xl bg-[#F59E0B]/15 hover:bg-[#F59E0B]/25 text-[#D97706] dark:text-amber-400 border border-[#F59E0B]/30 font-medium text-xs flex items-center gap-2 shrink-0 transition-all shadow-2xs"
          >
            <Camera className="w-4 h-4" />
            <span>Camera Scan</span>
          </button>
        </div>
       </div>

      {/* Main Terminal Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Area: Catalog & Filters (8 Columns on Desktop) */}
        <motion.div
          layout="position"
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className={`${
            cart.length > 0 ? 'lg:col-span-7 xl:col-span-8' : 'lg:col-span-12 col-span-full'
          } space-y-4`}
        >
          {/* Sales Tag Selector Bar */}
          <div className="p-4 rounded-2xl bg-[#FFFFFF] dark:bg-slate-900 border border-[#E5E7EB] dark:border-slate-800 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-xs font-semibold text-[#111827] dark:text-white">
              <Tag className="w-4 h-4 text-[#F59E0B]" />
              <span>Active Sales Tag:</span>
            </div>
            <div className="flex flex-wrap items-center gap-1.5">
              {salesTags.map(tag => (
                <button
                  key={tag.id}
                  onClick={() => {
                    setActiveTag(tag);
                    quickNotification('Promotion Tag Applied', `Switched to ${tag.name}`, 'info');
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                    activeTag?.id === tag.id
                      ? 'bg-[#111827] dark:bg-white text-white dark:text-slate-900 shadow-xs ring-2 ring-[#F59E0B]'
                      : 'bg-[#FAFAFA] dark:bg-slate-800 text-[#6B7280] dark:text-slate-400 border border-[#E5E7EB] dark:border-slate-700 hover:bg-slate-100'
                  }`}
                >
                  {tag.name} {tag.discount > 0 ? `(-${tag.discount}%)` : ''}
                </button>
              ))}
              <button
                onClick={() => setIsTagsModalOpen(true)}
                className="px-2.5 py-1.5 rounded-xl text-[11px] font-bold bg-amber-50 text-amber-700 hover:bg-amber-100 border border-amber-200 transition-colors flex items-center gap-1 ml-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Configure</span>
              </button>
            </div>
          </div>

          {/* Search and Category Filter */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-[#786C65] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search by Bhagavad Gita, deity items, or category..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#FFFFFF] dark:bg-slate-900 border border-[#E8E2D9] dark:border-slate-800 text-xs sm:text-sm text-[#1F1916] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#D97706] shadow-2xs"
              />
            </div>
            <div className="flex gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                    selectedCategory === cat
                      ? 'bg-[#D97706] text-white shadow-xs'
                      : 'bg-[#FFFFFF] dark:bg-slate-900 text-[#786C65] dark:text-slate-400 border border-[#E8E2D9] dark:border-slate-800 hover:bg-[#FAF8F5] dark:hover:bg-slate-800'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Product Cards Grid with Thumbnails */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 max-h-[620px] overflow-y-auto pr-1">
            {filteredProducts.map(product => (
              <div
                key={product.id}
                onClick={() => addToCart(product, 1)}
                className="p-3 rounded-[18px] bg-[#FFFFFF] dark:bg-slate-900 border border-[#E8E2D9] dark:border-slate-800 hover:border-[#D97706] hover:shadow-md transition-all text-left flex flex-col justify-between group cursor-pointer relative overflow-hidden"
              >
                <div className="space-y-2">
                  <div className="relative w-full h-28 rounded-xl overflow-hidden bg-amber-50/50 dark:bg-slate-800 border border-[#E8E2D9] dark:border-slate-700">
                    <img
                      src={product.imageUrl}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <span className="absolute top-1.5 left-1.5 px-1.5 py-0.5 rounded bg-black/60 text-white font-mono text-[10px] font-bold backdrop-blur-xs">
                      {product.stock} left
                    </span>
                  </div>
                  <div>
                    <div className="flex items-center justify-between text-[10px] font-mono text-[#786C65] mt-0.5">
                      <span className="truncate">{product.sku}</span>
                      <span className="text-amber-800 bg-amber-50 dark:bg-amber-950/30 px-1 rounded truncate max-w-[80px] font-bold">
                        {product.batchNo}
                      </span>
                    </div>
                    <h3 className="font-semibold text-xs text-[#1F1916] dark:text-white line-clamp-2 leading-snug group-hover:text-[#D97706] transition-colors mt-0.5">
                      {product.name}
                    </h3>
                    <div className="flex items-center gap-1 mt-1 text-[10px] font-mono text-slate-500">
                      <Barcode className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="truncate font-semibold">{product.barcode}</span>
                    </div>
                  </div>
                </div>

                <div className="pt-2.5 mt-2 border-t border-[#E8E2D9] dark:border-slate-800 flex items-center justify-between">
                  <div>
                    {activeTag && activeTag.discount > 0 ? (
                      <div className="flex flex-col">
                        <span className="text-[10px] text-[#786C65] line-through font-mono">₹{product.price.toFixed(2)}</span>
                        <span className="font-bold font-mono text-xs text-[#15803D]">
                          ₹{(product.price * (1 - activeTag.discount / 100)).toFixed(2)}
                        </span>
                      </div>
                    ) : (
                      <span className="font-bold font-mono text-xs text-[#1F1916] dark:text-white">
                        ₹{product.price.toFixed(2)}
                      </span>
                    )}
                  </div>
                  <button className="w-7 h-7 rounded-lg bg-[#FEF3C7] text-[#B45309] flex items-center justify-center group-hover:bg-[#D97706] group-hover:text-white transition-colors">
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
            {filteredProducts.length === 0 && (
              <div className="col-span-full py-16 text-center text-[#6B7280] text-sm">
                No items found matching criteria. Scan barcode or adjust filters.
              </div>
            )}
          </div>
        </motion.div>

        {/* Right Area: Running Cart & Checkout Counter (4 Columns on Desktop) */}
        <AnimatePresence mode="popLayout">
          {cart.length > 0 && (
            <motion.div
              key="pos-running-cart"
              initial={{ opacity: 0, x: 50, scale: 0.98 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 50, scale: 0.98 }}
              transition={{ type: "spring", stiffness: 300, damping: 28 }}
              className="lg:col-span-5 xl:col-span-4 rounded-2xl bg-[#FFFFFF] dark:bg-slate-900 border border-[#E5E7EB] dark:border-slate-800 shadow-xs p-5 flex flex-col justify-between h-[730px] sticky top-20"
            >
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#E5E7EB] dark:border-slate-800">
              <div className="flex items-center gap-2 font-semibold text-base text-[#111827] dark:text-white">
                <ShoppingBag className="w-5 h-5 text-[#2563EB]" />
                <span>Running Cart</span>
                <span className="px-2 py-0.5 rounded-full bg-[#FAFAFA] dark:bg-slate-800 text-xs font-mono border border-[#E5E7EB] dark:border-slate-700">
                  {cart.reduce((a, b) => a + b.quantity, 0)} units
                </span>
              </div>
              {cart.length > 0 && (
                <button
                  onClick={clearCart}
                  className="text-xs font-semibold text-[#EF4444] hover:underline"
                >
                  Clear Cart
                </button>
              )}
            </div>

            {/* Customer & Devotee Entry */}
            <div>
              <label className="text-xs text-[#6B7280] font-medium block mb-1">Customer / Devotee Account</label>
              <div className="relative">
                <User className="w-4 h-4 text-[#6B7280] absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={customerName}
                  onChange={e => setCustomerName(e.target.value)}
                  placeholder="Enter devotee name or mobile..."
                  className="w-full pl-9 pr-3 py-2 rounded-xl bg-[#FAFAFA] dark:bg-slate-800 border border-[#E5E7EB] dark:border-slate-700 text-xs text-[#111827] dark:text-white focus:outline-none focus:ring-1 focus:ring-[#2563EB]"
                />
              </div>
            </div>

            {/* Active Cart Items List */}
            <div className="space-y-2.5 max-h-[300px] overflow-y-auto pr-1">
              {cart.map(item => {
                const effectivePrice = item.product.price * (1 - (activeTag?.discount || 0) / 100);
                const itemTaxRate = getProductTaxRate(item.product.category);
                return (
                  <div
                    key={item.product.id}
                    className="p-3 rounded-xl bg-[#FAFAFA] dark:bg-slate-800/60 border border-[#E5E7EB] dark:border-slate-700/80 flex items-center justify-between gap-3"
                  >
                    <img
                      src={item.product.imageUrl}
                      alt={item.product.name}
                      className="w-10 h-10 rounded-lg object-cover border border-[#E5E7EB] dark:border-slate-700 shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-xs text-[#111827] dark:text-white truncate">{item.product.name}</p>
                      <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 mt-1">
                        <span className="text-xs font-mono font-bold text-[#10B981]">₹{effectivePrice.toFixed(2)}</span>
                        {activeTag && activeTag.discount > 0 && (
                          <span className="text-[10px] text-[#6B7280] line-through font-mono">₹{item.product.price.toFixed(2)}</span>
                        )}
                        <span className="text-[9px] bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-400 px-1.5 py-0.5 rounded-sm font-mono whitespace-nowrap">
                          {item.product.batchNo}
                        </span>
                        <span className="text-[9px] bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-400 px-1.5 py-0.5 rounded-sm font-mono whitespace-nowrap">
                          GST: {itemTaxRate}%
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        onClick={() => updateCartQuantity(item.product.id, Math.max(0, item.quantity - 1))}
                        className="w-7 h-7 rounded-lg bg-[#FFFFFF] dark:bg-slate-900 border border-[#E5E7EB] dark:border-slate-700 text-[#111827] dark:text-white flex items-center justify-center font-bold text-xs hover:bg-slate-100"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="w-6 text-center font-mono font-semibold text-xs">{item.quantity}</span>
                      <button
                        onClick={() => updateCartQuantity(item.product.id, item.quantity + 1)}
                        className="w-7 h-7 rounded-lg bg-[#FFFFFF] dark:bg-slate-900 border border-[#E5E7EB] dark:border-slate-700 text-[#111827] dark:text-white flex items-center justify-center font-bold text-xs hover:bg-slate-100"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => removeFromCart(item.product.id)}
                        className="w-7 h-7 rounded-lg text-[#EF4444] hover:bg-rose-50 dark:hover:bg-rose-950/40 flex items-center justify-center ml-0.5"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
              {cart.length === 0 && (
                <div className="py-16 text-center text-[#6B7280] text-xs space-y-2 border-2 border-dashed border-[#E5E7EB] dark:border-slate-800 rounded-2xl">
                  <ShoppingBag className="w-8 h-8 text-[#6B7280] mx-auto opacity-40" />
                  <p>Running cart is currently empty.</p>
                  <p className="text-[11px] text-[#6B7280]">Scan barcodes or click items from the left catalog.</p>
                </div>
              )}
            </div>
          </div>

          {/* Totals & Payment Execution */}
          <div className="space-y-3.5 pt-4 border-t border-[#E5E7EB] dark:border-slate-800">
            <div className="space-y-1.5 text-xs text-[#6B7280]">
              <div className="flex justify-between">
                <span>Raw Subtotal</span>
                <span className="font-mono text-[#111827] dark:text-white">₹{cartRawSubtotal.toFixed(2)}</span>
              </div>
              {activeTag && activeTag.discount > 0 && (
                <div className="flex justify-between text-[#10B981] font-medium">
                  <span>Discount ({activeTag.name})</span>
                  <span className="font-mono">-₹{discountAmount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Total GST / Sales Tax</span>
                <span className="font-mono text-[#111827] dark:text-white">₹{cartTax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-bold text-base text-[#1F1916] dark:text-white pt-2 border-t border-[#E8E2D9] dark:border-slate-800">
                <span>Total Payable</span>
                <span className="text-[#D97706] dark:text-amber-400 font-mono text-lg">₹{cartTotal.toFixed(2)}</span>
              </div>
            </div>

            {/* Payment Method Toggles */}
            <div>
              <label className="text-xs text-[#786C65] font-medium block mb-1.5">Select Payment Method</label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'upi', label: 'UPI / QR', icon: Smartphone },
                  { id: 'card', label: 'Card / POS', icon: CreditCard },
                  { id: 'cash', label: 'Cash', icon: Banknote },
                ].map(mode => {
                  const Icon = mode.icon;
                  return (
                    <button
                      key={mode.id}
                      onClick={() => setPaymentMethod(mode.id as any)}
                      className={`py-2.5 px-2 rounded-xl font-medium text-xs flex flex-col items-center justify-center gap-1 border transition-all ${
                        paymentMethod === mode.id
                          ? 'bg-[#D97706] text-white border-transparent shadow-xs'
                          : 'bg-[#FAF7F2] dark:bg-slate-800 text-[#786C65] dark:text-slate-300 border-[#E8E2D9] dark:border-slate-700 hover:bg-amber-50/60'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span>{mode.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Checkout Trigger */}
            <button
              disabled={cart.length === 0}
              onClick={handleCheckout}
              className="w-full py-4 rounded-xl bg-[#D97706] hover:bg-[#B45309] disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold text-sm shadow-md shadow-[#D97706]/25 flex items-center justify-center gap-2 transition-all active:scale-98"
            >
              <span>COMPLETE BILL (₹{cartTotal.toFixed(2)})</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Camera Barcode Scanner Modal */}
      {isCameraOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-md rounded-2xl bg-[#FFFFFF] dark:bg-slate-900 border border-[#E5E7EB] dark:border-slate-800 p-6 shadow-2xl space-y-4 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-[#E5E7EB] dark:border-slate-800">
              <div className="flex items-center gap-2 font-semibold text-base text-[#111827] dark:text-white">
                <Camera className="w-5 h-5 text-[#F59E0B]" />
                <span>Camera Barcode Scanner</span>
              </div>
              <button onClick={() => setIsCameraOpen(false)} className="text-[#6B7280] hover:text-[#111827] dark:hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="relative aspect-video rounded-xl bg-slate-950 overflow-hidden flex items-center justify-center border-2 border-dashed border-[#F59E0B]/50">
              {/* Laser Animation */}
              <div className="absolute inset-x-8 top-1/2 -translate-y-1/2 h-0.5 bg-[#EF4444] shadow-[0_0_8px_#EF4444] animate-pulse" />
              <div className="absolute inset-12 border border-white/20 rounded-lg pointer-events-none flex items-center justify-center">
                <span className="text-[11px] font-mono text-white/50 bg-black/60 px-2 py-1 rounded">
                  SCAN AREA
                </span>
              </div>
              <Barcode className="w-24 h-24 text-white/10 animate-bounce" />
            </div>

            <p className="text-center text-xs text-[#6B7280] font-medium min-h-[16px]">
              {cameraScanningText}
            </p>

            <div className="space-y-2 border-t border-[#E5E7EB] dark:border-slate-800 pt-3">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Point camera at Product/Edition:</span>
              <div className="grid grid-cols-1 gap-2 max-h-[160px] overflow-y-auto pr-1">
                {[
                  { sku: 'BK-BG-2022', label: 'Bhagavad Gita – 2022 Edition', sub: 'Price: ₹350 • Batch: BBT-2022-GITA' },
                  { sku: 'BK-BG-2025', label: 'Bhagavad Gita – 2025 Edition', sub: 'Price: ₹450 • Batch: BBT-2025-GITA' },
                  { sku: 'BK-BG-DELUXE', label: 'Bhagavad Gita – Deluxe Leatherbound', sub: 'Price: ₹850 • Batch: BBT-2026-A1' },
                  { sku: 'OG-GHEE-PURE', label: 'A2 Gir Cow Organic Vedic Ghee', sub: 'Price: ₹950 • Batch: GIR-2026-GH1' }
                ].map(p => (
                  <button
                    key={p.sku}
                    onClick={() => simulateCameraScanProduct(p.sku)}
                    className="w-full text-left p-2 rounded-xl bg-[#FAFAFA] dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-[#D97706] hover:bg-amber-50/20 text-xs flex justify-between items-center group transition-all"
                  >
                    <div>
                      <div className="font-semibold text-slate-800 dark:text-slate-200 group-hover:text-[#D97706] transition-colors">{p.label}</div>
                      <div className="text-[10px] text-slate-500 font-mono mt-0.5">{p.sub}</div>
                    </div>
                    <Sparkles className="w-4 h-4 text-slate-400 group-hover:text-[#D97706] shrink-0 ml-1.5" />
                  </button>
                ))}
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setIsCameraOpen(false)}
                className="flex-1 py-2.5 rounded-xl bg-[#FAFAFA] dark:bg-slate-800 border border-[#E5E7EB] dark:border-slate-700 text-xs font-semibold text-[#111827] dark:text-white hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                onClick={simulateCameraScan}
                className="flex-1 py-2.5 rounded-xl bg-[#F59E0B] hover:bg-[#D97706] text-white text-xs font-semibold shadow-xs flex items-center justify-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Random Scan</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Receipt Preview Modal */}
      {showReceiptPreview && lastOrder && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-md rounded-2xl bg-[#FFFFFF] dark:bg-slate-900 border border-[#E5E7EB] dark:border-slate-800 p-6 shadow-2xl space-y-5 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-[#E5E7EB] dark:border-slate-800">
              <div className="flex items-center gap-2 font-semibold text-base text-[#10B981]">
                <CheckCircle2 className="w-5 h-5" />
                <span>Transaction Approved</span>
              </div>
              <button onClick={() => setShowReceiptPreview(false)} className="text-[#6B7280] hover:text-[#111827] dark:hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Authentic Invoice Body */}
            <div id="pos-receipt-print-section" className="p-5 rounded-xl bg-[#FAFAFA] dark:bg-slate-950 border border-[#E5E7EB] dark:border-slate-800 space-y-4 font-mono text-xs">
              <div className="text-center border-b border-dashed border-[#E5E7EB] dark:border-slate-800 pb-3">
                <h3 className="font-bold text-sm text-[#111827] dark:text-white font-sans">
                  ISKCON TEMPLE RETAIL ERP
                </h3>
                <p className="text-[10px] text-[#6B7280]">Govinda's Bookstore & Prasad Distribution</p>
                <p className="text-[10px] text-[#6B7280] mt-1 font-mono">INVOICE #{lastOrder.orderNumber}</p>
              </div>

               <div className="space-y-1 text-[11px] text-[#6B7280] border-b border-dashed border-[#E5E7EB] dark:border-slate-800 pb-3">
                <div className="flex justify-between">
                  <span>Date/Time:</span>
                  <span className="text-[#111827] dark:text-white">{lastOrder.timestamp}</span>
                </div>
                <div className="flex justify-between">
                  <span>Customer:</span>
                  <span className="text-[#111827] dark:text-white">{lastOrder.customerName}</span>
                </div>
                <div className="flex justify-between">
                  <span>Cashier:</span>
                  <span className="text-[#111827] dark:text-white">{lastOrder.cashierName}</span>
                </div>
                <div className="flex justify-between">
                  <span>Payment Mode:</span>
                  <span className="text-[#2563EB] font-bold uppercase">{lastOrder.paymentMethod}</span>
                </div>
              </div>

              {/* Items */}
              <div className="space-y-1.5 border-b border-dashed border-[#E5E7EB] dark:border-slate-800 pb-3">
                <div className="text-[10px] uppercase font-bold text-[#6B7280] pb-1 flex justify-between">
                  <span>Item</span>
                  <span>Amount</span>
                </div>
                {lastOrder.items.map((it: any, idx: number) => (
                  <div key={idx} className="flex justify-between text-[#111827] dark:text-slate-200">
                    <span className="truncate max-w-[200px]">{it.quantity}x {it.product.name}</span>
                    <span>₹{(it.quantity * it.product.price * (1 - (it.discountPercent || 0) / 100)).toFixed(2)}</span>
                  </div>
                ))}
              </div>

              {/* Summary */}
              <div className="space-y-1 text-[#6B7280]">
                {lastOrder.discountAmount > 0 && (
                  <div className="flex justify-between text-[#10B981]">
                    <span>Promo Discount:</span>
                    <span>-₹{lastOrder.discountAmount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>GST (5% Devotional):</span>
                  <span>₹{lastOrder.taxAmount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm font-bold text-[#111827] dark:text-white pt-2 border-t border-[#E5E7EB] dark:border-slate-800">
                  <span>TOTAL PAID:</span>
                  <span className="text-[#10B981]">₹{lastOrder.total.toFixed(2)}</span>
                </div>
              </div>

              <div className="text-center pt-3 border-t border-dashed border-[#E5E7EB] dark:border-slate-800">
                {/* Visual authentic barcode simulation of the invoice number */}
                <div className="py-2.5 flex flex-col items-center justify-center bg-white dark:bg-slate-900/40 p-2 rounded-xl border border-slate-200/50 dark:border-slate-800">
                  <div className="flex items-center gap-0.5 h-10 w-full justify-center overflow-hidden">
                    {Array.from({ length: 36 }).map((_, bIdx) => {
                      const seed = lastOrder.orderNumber ? lastOrder.orderNumber.charCodeAt(bIdx % lastOrder.orderNumber.length) : bIdx;
                      const width = (seed + bIdx) % 3 === 0 ? '3px' : (seed + bIdx) % 2 === 0 ? '1px' : '2px';
                      const isGap = (seed * bIdx) % 6 === 0 && bIdx > 1 && bIdx < 34;
                      return (
                        <span
                          key={bIdx}
                          className={`${isGap ? 'bg-transparent' : 'bg-black dark:bg-slate-200'} inline-block h-full`}
                          style={{ width }}
                        />
                      );
                    })}
                  </div>
                  <span className="text-[10px] font-mono font-extrabold text-slate-800 dark:text-slate-300 mt-1 tracking-widest">
                    *{lastOrder.orderNumber}*
                  </span>
                </div>
                <span className="text-[9px] text-[#6B7280] mt-2 block font-sans">THANK YOU FOR YOUR DEVOTION & SUPPORT</span>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  const receiptSection = document.getElementById('pos-receipt-print-section');
                  if (receiptSection) {
                    const receiptClone = receiptSection.cloneNode(true) as HTMLElement;
                    receiptClone.id = 'receipt-section-active';
                    receiptClone.classList.add('active-print-element');
                    document.body.appendChild(receiptClone);
                    
                    document.body.classList.add('print-receipt-only');
                    
                    const pageStyle = document.createElement('style');
                    pageStyle.id = 'dynamic-print-page-style';
                    pageStyle.innerHTML = `@page { size: 80mm auto; margin: 0; }`;
                    document.head.appendChild(pageStyle);
                    
                    window.print();
                    
                    setTimeout(() => {
                      receiptClone.remove();
                      document.body.classList.remove('print-receipt-only');
                      const pStyle = document.getElementById('dynamic-print-page-style');
                      if (pStyle) pStyle.remove();
                    }, 500);
                  } else {
                    window.print();
                  }
                }}
                className="flex-1 py-3 rounded-xl bg-[#FFFFFF] dark:bg-slate-800 hover:bg-slate-50 border border-[#E5E7EB] dark:border-slate-700 text-[#111827] dark:text-white font-semibold text-xs flex items-center justify-center gap-2"
              >
                <Printer className="w-4 h-4 text-[#2563EB]" />
                <span>Print Receipt</span>
              </button>
              <button
                onClick={() => setShowReceiptPreview(false)}
                className="flex-1 py-3 rounded-xl bg-[#2563EB] hover:bg-[#1d4ed8] text-white font-semibold text-xs flex items-center justify-center gap-2"
              >
                <span>New Transaction</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Sales Tags Dynamic Configuration Modal */}
      {isTagsModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-lg rounded-2xl bg-[#FFFFFF] dark:bg-slate-900 border border-[#E5E7EB] dark:border-slate-800 p-6 shadow-2xl space-y-5 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-[#E5E7EB] dark:border-slate-800">
              <div className="flex items-center gap-2 font-semibold text-base text-[#111827] dark:text-white">
                <Tag className="w-5 h-5 text-amber-600" />
                <span>Configure Sales Tags & Discounts</span>
              </div>
              <button onClick={() => setIsTagsModalOpen(false)} className="text-[#6B7280] hover:text-[#111827] dark:hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* List existing tags */}
            <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
              <p className="text-xs font-semibold text-[#6B7280] uppercase tracking-wider">Active Promotional / Donation Tags</p>
              {salesTags.map(tag => (
                <div key={tag.id} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-750">
                  <div className="flex items-center gap-2.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                    <div>
                      <p className="text-xs font-bold text-[#111827] dark:text-white">{tag.name}</p>
                      <p className="text-[10px] text-slate-500">Discount: {tag.discount}% {tag.discount === 100 ? '(Free on checkout / Donation)' : ''}</p>
                    </div>
                  </div>
                  {tag.name !== 'Standard Retail' ? (
                    <button
                      type="button"
                      onClick={() => {
                        deleteSalesTag(tag.id);
                      }}
                      className="text-xs text-rose-600 hover:text-rose-800 hover:underline font-medium px-2 py-1 rounded"
                    >
                      Delete
                    </button>
                  ) : (
                    <span className="text-[10px] font-mono text-slate-400">System Required</span>
                  )}
                </div>
              ))}
            </div>

            {/* Form to add tag */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (!newTagName.trim()) return;
                addSalesTag({
                  name: newTagName.trim(),
                  discount: Number(newTagDiscount)
                });
                setNewTagName('');
                setNewTagDiscount(0);
              }}
              className="p-4 rounded-xl bg-amber-50/50 dark:bg-slate-800/50 border border-amber-100 dark:border-slate-700 space-y-3"
            >
              <p className="text-xs font-bold text-[#D97706]">Create Custom Sales / Donation Tag</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-medium text-slate-600 dark:text-slate-400 mb-1">Tag Name</label>
                  <input
                    type="text"
                    value={newTagName}
                    onChange={(e) => setNewTagName(e.target.value)}
                    placeholder="e.g. Ashram donation, Festival"
                    className="w-full px-3 py-2 rounded-lg bg-white dark:bg-slate-900 border border-[#E5E7EB] dark:border-slate-700 text-xs text-[#111827] dark:text-white focus:outline-none focus:ring-1 focus:ring-amber-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-slate-600 dark:text-slate-400 mb-1">Discount Rate (%)</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={newTagDiscount}
                    onChange={(e) => setNewTagDiscount(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-lg bg-white dark:bg-slate-900 border border-[#E5E7EB] dark:border-slate-700 text-xs text-[#111827] dark:text-white focus:outline-none focus:ring-1 focus:ring-amber-500"
                    required
                  />
                </div>
              </div>
              <button
                type="submit"
                className="w-full py-2 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs rounded-lg transition-colors flex items-center justify-center gap-1 shadow-xs"
              >
                <Plus className="w-4 h-4" />
                <span>Add Sales Tag</span>
              </button>
            </form>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setIsTagsModalOpen(false)}
                className="px-4 py-2 bg-[#111827] text-white hover:bg-black dark:bg-white dark:text-slate-900 text-xs font-semibold rounded-xl"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
