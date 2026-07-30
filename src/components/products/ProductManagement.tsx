'use client';

import React, { useState, useMemo } from 'react';
import { useERP } from '../../context/ERPContext';
import { Product, StockStatus } from '../../types';
import {
  Search,
  Plus,
  Filter,
  Grid,
  List,
  Edit3,
  Trash2,
  Tag,
  Download,
  AlertTriangle,
  CheckCircle2,
  X,
  Package,
  ArrowUpDown,
  Barcode,
  Layers,
  ChevronLeft,
  ChevronRight,
  MoreVertical,
  SlidersHorizontal,
  IndianRupee
} from 'lucide-react';

export const ProductManagement: React.FC = () => {
  const { products, addProduct, updateProduct, deleteProduct, zones, quickNotification, batches } = useERP();
  
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedStatus, setSelectedStatus] = useState<string>('All');
  const [sortField, setSortField] = useState<'name' | 'price' | 'stock' | 'sku'>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  
  const [viewingBatchesProduct, setViewingBatchesProduct] = useState<Product | null>(null);
  const [batchSearchQuery, setBatchSearchQuery] = useState('');
  
  // Selection state
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  
  // Drawer state (null = closed, 'new' = create, Product = edit)
  const [activeDrawer, setActiveDrawer] = useState<'new' | Product | null>(null);

  // Form state for new/edit
  const [formData, setFormData] = useState<Partial<Product>>({
    sku: 'SKU-NEW-001',
    name: '',
    category: 'Audio & Acoustics',
    price: 99.99,
    cost: 50.00,
    stock: 10,
    minStock: 5,
    warehouseZone: zones[0]?.name || 'Zone A — Main Retail Floor',
    batchNo: 'BAT-2026-Q3-001',
    barcode: '4905524950000',
    imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&auto=format&fit=crop&q=80',
    status: 'in_stock',
    supplier: 'TechGlobal Distribution Inc.',
    rating: 4.8,
    description: 'Enterprise retail item catalog description.'
  });

  const categories = useMemo(() => {
    const cats = new Set(products.map(p => p.category));
    return ['All', ...Array.from(cats)];
  }, [products]);

  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      if (!p) return false;
      const matchesSearch =
        (p.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (p.sku || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (p.barcode || '').includes(searchQuery);
      const matchesCat = selectedCategory === 'All' || p.category === selectedCategory;
      const matchesStatus = selectedStatus === 'All' || p.status === selectedStatus;
      return matchesSearch && matchesCat && matchesStatus;
    }).sort((a, b) => {
      let valA = a[sortField];
      let valB = b[sortField];
      if (typeof valA === 'string' && typeof valB === 'string') {
        return sortOrder === 'asc' ? valA.localeCompare(valB) : valB.localeCompare(valA);
      }
      if (typeof valA === 'number' && typeof valB === 'number') {
        return sortOrder === 'asc' ? valA - valB : valB - valA;
      }
      return 0;
    });
  }, [products, searchQuery, selectedCategory, selectedStatus, sortField, sortOrder]);

  const handleSort = (field: 'name' | 'price' | 'stock' | 'sku') => {
    if (sortField === field) {
      setSortOrder(prev => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(filteredProducts.map(p => p.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelectRow = (id: string) => {
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const handleBulkDelete = () => {
    if (confirm(`Are you sure you want to delete ${selectedIds.length} selected products?`)) {
      selectedIds.forEach(id => deleteProduct(id));
      setSelectedIds([]);
      quickNotification('Bulk Action Completed', `Deleted selected products from catalog.`, 'warning');
    }
  };

  const handleBulkDiscount = (pct: number) => {
    selectedIds.forEach(id => {
      const prod = products.find(p => p.id === id);
      if (prod) {
        const newPrice = Number((prod.price * (1 - pct / 100)).toFixed(2));
        updateProduct(id, { price: newPrice });
      }
    });
    quickNotification('Bulk Discount Applied', `Reduced price by ${pct}% on ${selectedIds.length} items.`, 'success');
  };

  const handleOpenDrawer = (item: 'new' | Product) => {
    if (item === 'new') {
      setFormData({
        sku: `SKU-${Math.floor(1000 + Math.random() * 9000)}`,
        name: '',
        category: categories[1] || 'General Merchandise',
        price: 149.99,
        cost: 80.00,
        stock: 15,
        minStock: 5,
        warehouseZone: zones[0]?.name || 'Zone A — Main Retail Floor',
        batchNo: `BAT-2026-Q3-${Math.floor(10 + Math.random() * 89)}`,
        barcode: `${Math.floor(1000000000000 + Math.random() * 8999999999999)}`,
        imageUrl: 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=500&auto=format&fit=crop&q=80',
        status: 'in_stock',
        supplier: 'ISKCON Temple Trust Distribution',
        rating: 4.8,
        description: 'New high-velocity retail product entry.'
      });
    } else {
      setFormData({ ...item });
    }
    setActiveDrawer(item);
  };

  const handleSaveDrawer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.sku) {
      alert("Please provide at least SKU and Product Name.");
      return;
    }

    const stockVal = Number(formData.stock) || 0;
    const minVal = Number(formData.minStock) || 5;
    let computedStatus: StockStatus = 'in_stock';
    if (stockVal === 0) computedStatus = 'out_of_stock';
    else if (stockVal <= minVal) computedStatus = 'low_stock';

    if (activeDrawer === 'new') {
      addProduct({
        sku: formData.sku || 'SKU-001',
        name: formData.name || 'Untitled SKU',
        category: formData.category || 'General',
        price: Number(formData.price) || 0,
        cost: Number(formData.cost) || 0,
        stock: stockVal,
        minStock: minVal,
        warehouseZone: formData.warehouseZone || 'Zone A',
        batchNo: formData.batchNo || 'BAT-01',
        barcode: formData.barcode || '123456789',
        imageUrl: formData.imageUrl || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&auto=format&fit=crop&q=80',
        status: computedStatus,
        lastUpdated: new Date().toISOString(),
        supplier: formData.supplier || 'Vendor A',
        rating: Number(formData.rating) || 4.5,
        description: formData.description
      });
    } else if (activeDrawer && typeof activeDrawer !== 'string') {
      updateProduct(activeDrawer.id, {
        ...formData,
        stock: stockVal,
        minStock: minVal,
        status: computedStatus
      });
      quickNotification('Product Updated', `Saved changes for ${formData.sku}.`, 'success');
    }

    setActiveDrawer(null);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto relative">
      {/* Header & Title Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2.5">
            <Package className="w-6 h-6 text-indigo-500 shrink-0" />
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              Product Catalog & Pricing
            </h1>
            <span className="px-2 py-0.5 rounded-md text-[10px] font-mono font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
              {products.length} SKUS
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1 font-mono">
            MERCHANDISE PRICING • WAREHOUSE ASSIGNMENTS • BARCODE SERIALS • BALANCES
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <button
            onClick={() => {
              const csv = [
                ['SKU', 'Name', 'Category', 'Price', 'Cost', 'Stock', 'Zone', 'Barcode'].join(','),
                ...filteredProducts.map(p => [p.sku, `"${p.name}"`, p.category, p.price, p.cost, p.stock, `"${p.warehouseZone}"`, p.barcode].join(','))
              ].join('\n');
              const blob = new Blob([csv], { type: 'text/csv' });
              const url = URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = `ISKCON_Retail_Catalog_${new Date().toISOString().slice(0, 10)}.csv`;
              a.click();
              quickNotification('Catalog Exported', 'Downloaded CSV data spreadsheet.', 'info');
            }}
            className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-slate-100 dark:bg-slate-900 hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs border border-slate-200 dark:border-slate-800 transition-all font-mono"
          >
            <Download className="w-4 h-4" />
            <span className="hidden sm:inline">EXPORT CSV</span>
          </button>

          <button
            onClick={() => handleOpenDrawer('new')}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#D97706] hover:bg-[#B45309] text-white font-semibold text-xs transition-all shadow-sm shadow-[#D97706]/20"
          >
            <Plus className="w-4 h-4" />
            <span>CREATE PRODUCT</span>
          </button>
        </div>
      </div>

      {/* Bento Summary Grid (3 columns) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="p-6 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-[11px] font-bold uppercase tracking-widest">Catalog Valuation</span>
              <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-700 dark:text-slate-300">
                <IndianRupee className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-4 flex items-baseline gap-2">
              <span className="text-3xl font-bold font-mono tracking-tight text-slate-900 dark:text-white">
                ₹{(products.reduce((acc, p) => acc + p.price * p.stock, 0) / 1000).toFixed(1)}k
              </span>
              <span className="text-xs font-semibold text-slate-400 font-mono">retail value</span>
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-400 font-mono">
            <span>Cost basis:</span>
            <span className="font-bold text-slate-700 dark:text-slate-300">₹{(products.reduce((acc, p) => acc + p.cost * p.stock, 0) / 1000).toFixed(1)}k</span>
          </div>
        </div>

        <div className="p-6 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-[11px] font-bold uppercase tracking-widest">Gross Profit Margin</span>
              <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-700 dark:text-slate-300">
                <Tag className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-4 flex items-baseline gap-2">
              <span className="text-3xl font-bold font-mono tracking-tight text-emerald-600 dark:text-emerald-400">
                {Math.round(products.reduce((acc, p) => acc + ((p.price - p.cost) / p.price) * 100, 0) / (products.length || 1))}%
              </span>
              <span className="text-xs font-bold text-emerald-600 uppercase tracking-wide">avg markup</span>
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-400 font-mono">
            <span>High performer:</span>
            <span className="font-bold text-slate-700 dark:text-slate-300">Sony XM5 (58%)</span>
          </div>
        </div>

        <div className="p-6 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-[11px] font-bold uppercase tracking-widest">Inventory Status</span>
              <div className="w-8 h-8 rounded-lg bg-rose-50 dark:bg-rose-950/50 flex items-center justify-center text-rose-500">
                <AlertTriangle className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-4 flex items-baseline gap-2">
              <span className="text-3xl font-bold font-mono tracking-tight text-slate-900 dark:text-white">
                {products.filter(p => p.status === 'in_stock').length} <span className="text-sm text-slate-400 font-normal">/ {products.length}</span>
              </span>
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">Healthy</span>
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-mono">
            <span className="text-rose-500 font-bold">Reorder alert:</span>
            <span className="font-bold text-rose-600 dark:text-rose-400">{products.filter(p => p.status !== 'in_stock').length} SKU(s) critical</span>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3 sm:space-y-0 sm:flex sm:items-center justify-between gap-4">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search by SKU, Product Name, or Barcode..."
            className="w-full pl-10 pr-4 py-2 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs font-mono text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-slate-400 dark:focus:border-slate-600 transition-colors"
          />
        </div>

        {/* Dropdowns and View Toggle */}
        <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
          {/* Category Filter */}
          <select
            value={selectedCategory}
            onChange={e => setSelectedCategory(e.target.value)}
            className="px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs font-mono font-medium text-slate-700 dark:text-slate-300 focus:outline-none"
          >
            {categories.map(cat => (
              <option key={cat} value={cat}>Category: {cat}</option>
            ))}
          </select>

          {/* Status Filter */}
          <select
            value={selectedStatus}
            onChange={e => setSelectedStatus(e.target.value)}
            className="px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs font-mono font-medium text-slate-700 dark:text-slate-300 focus:outline-none"
          >
            <option value="All">Status: All Stock</option>
            <option value="in_stock">In Stock</option>
            <option value="low_stock">Low Stock Alerts</option>
            <option value="out_of_stock">Out of Stock</option>
          </select>

          {/* Grid vs Table View Toggle */}
          <div className="flex items-center p-1 rounded-lg bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
            <button
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-md text-xs font-medium transition-all ${
                viewMode === 'table'
                  ? 'bg-white dark:bg-slate-800 text-black dark:text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
              }`}
              title="Table List View"
            >
              <List className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-md text-xs font-medium transition-all ${
                viewMode === 'grid'
                  ? 'bg-white dark:bg-slate-800 text-black dark:text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
              }`}
              title="Card Grid View"
            >
              <Grid className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Bulk Actions Bar (When items selected) */}
      {selectedIds.length > 0 && (
        <div className="p-3.5 rounded-xl bg-black dark:bg-white text-white dark:text-black shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-3 animate-in fade-in slide-in-from-top-2 duration-150 border border-slate-800 dark:border-slate-200">
          <div className="flex items-center gap-2 text-xs font-bold font-mono">
            <span className="px-2 py-0.5 rounded bg-white/20 dark:bg-black/20 text-white dark:text-black font-bold">{selectedIds.length} SELECTED</span>
            <span>BULK CATALOG MODIFICATION ACTIVE</span>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => handleBulkDiscount(10)}
              className="px-3 py-1.5 rounded-lg bg-white/10 dark:bg-black/10 hover:bg-white/20 dark:hover:bg-black/20 text-xs font-bold font-mono border border-white/15 dark:border-black/15 transition-all"
            >
              10% OFF
            </button>
            <button
              onClick={() => handleBulkDiscount(20)}
              className="px-3 py-1.5 rounded-lg bg-white/10 dark:bg-black/10 hover:bg-white/20 dark:hover:bg-black/20 text-xs font-bold font-mono border border-white/15 dark:border-black/15 transition-all"
            >
              20% OFF
            </button>
            <button
              onClick={handleBulkDelete}
              className="px-3 py-1.5 rounded-lg bg-rose-500 hover:bg-rose-600 text-white text-xs font-bold font-mono shadow transition-all flex items-center gap-1.5"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>DELETE SELECTED</span>
            </button>
            <button
              onClick={() => setSelectedIds([])}
              className="p-1.5 rounded-lg hover:bg-white/20 dark:hover:bg-black/20 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Main Table or Grid View */}
      {viewMode === 'table' ? (
        <div className="rounded-2xl bg-white dark:bg-slate-900 border border-[#E5E7EB] dark:border-slate-800 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse table-fixed min-w-[1000px]">
              <thead>
                <tr className="bg-slate-50/70 dark:bg-slate-950/70 text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                  <th className="p-4 sm:p-5 w-16 text-center border-r border-b border-[#E5E7EB] dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50">
                    <input
                      type="checkbox"
                      checked={selectedIds.length === filteredProducts.length && filteredProducts.length > 0}
                      onChange={e => handleSelectAll(e.target.checked)}
                      className="rounded border-slate-300 dark:border-slate-700 text-indigo-600 focus:ring-indigo-500"
                    />
                  </th>
                  <th className="p-4 sm:p-5 w-[30%] border-r border-b border-[#E5E7EB] dark:border-slate-800 cursor-pointer hover:text-slate-700 dark:hover:text-slate-200" onClick={() => handleSort('name')}>
                    <div className="flex items-center gap-1.5">
                      <span>Product & SKU</span>
                      <ArrowUpDown className="w-3 h-3" />
                    </div>
                  </th>
                  <th className="p-4 sm:p-5 w-[14%] border-r border-b border-[#E5E7EB] dark:border-slate-800">Category</th>
                  <th className="p-4 sm:p-5 w-[16%] border-r border-b border-[#E5E7EB] dark:border-slate-800 cursor-pointer hover:text-slate-700 dark:hover:text-slate-200" onClick={() => handleSort('price')}>
                    <div className="flex items-center gap-1.5">
                      <span>Price / Cost</span>
                      <ArrowUpDown className="w-3 h-3" />
                    </div>
                  </th>
                  <th className="p-4 sm:p-5 w-[14%] border-r border-b border-[#E5E7EB] dark:border-slate-800 cursor-pointer hover:text-slate-700 dark:hover:text-slate-200" onClick={() => handleSort('stock')}>
                    <div className="flex items-center gap-1.5">
                      <span>Stock Balance</span>
                      <ArrowUpDown className="w-3 h-3" />
                    </div>
                  </th>
                  <th className="p-4 sm:p-5 w-[14%] border-r border-b border-[#E5E7EB] dark:border-slate-800">Warehouse Zone</th>
                  <th className="p-4 sm:p-5 w-[12%] border-b border-[#E5E7EB] dark:border-slate-800 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="text-xs bg-white dark:bg-slate-900">
                {filteredProducts.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="p-12 text-center text-slate-400">
                      No products found matching the search criteria.
                    </td>
                  </tr>
                ) : (
                  filteredProducts.map(prod => {
                    const isSelected = selectedIds.includes(prod.id);
                    const margin = Math.round(((prod.price - prod.cost) / prod.price) * 100);

                    return (
                      <tr
                        key={prod.id}
                        className={`transition-colors group ${
                          isSelected
                            ? 'bg-indigo-50/50 dark:bg-indigo-950/30'
                            : 'hover:bg-slate-50/80 dark:hover:bg-slate-800/50'
                        }`}
                      >
                        <td className="p-4 sm:p-5 text-center border-r border-b border-[#E5E7EB] dark:border-slate-800">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => handleSelectRow(prod.id)}
                            className="rounded border-slate-300 dark:border-slate-700 text-indigo-600 focus:ring-indigo-500"
                          />
                        </td>
                        <td className="p-4 sm:p-5 border-r border-b border-[#E5E7EB] dark:border-slate-800 font-medium">
                          <div className="flex items-center gap-3 min-w-0">
                            <img
                              src={prod.imageUrl}
                              alt={prod.name}
                              className="w-10 h-10 rounded-xl object-cover bg-slate-100 dark:bg-slate-800 shrink-0 border border-slate-200/50 dark:border-slate-700/50"
                            />
                            <div className="min-w-0 flex-1">
                              <div className="font-semibold text-slate-900 dark:text-white truncate group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                                {prod.name}
                              </div>
                              <div className="text-[11px] text-slate-400 font-mono mt-0.5 flex items-center gap-1.5 truncate">
                                <span>{prod.sku}</span>
                                <span>•</span>
                                <span className="text-slate-500">{prod.barcode}</span>
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="p-4 sm:p-5 border-r border-b border-[#E5E7EB] dark:border-slate-800 text-slate-600 dark:text-slate-400">
                          <span className="px-2 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-[11px] font-medium inline-block truncate max-w-full">
                            {prod.category}
                          </span>
                        </td>
                        <td className="p-4 sm:p-5 border-r border-b border-[#E5E7EB] dark:border-slate-800">
                          <div className="font-bold text-slate-900 dark:text-white truncate">₹{prod.price.toFixed(2)}</div>
                          <div className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold mt-0.5 truncate">
                            Cost: ₹{prod.cost.toFixed(2)} ({margin}% margin)
                          </div>
                        </td>
                        <td className="p-4 sm:p-5 border-r border-b border-[#E5E7EB] dark:border-slate-800">
                          <div className="flex items-center gap-2">
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                              prod.status === 'in_stock'
                                ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
                                : prod.status === 'low_stock'
                                ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 animate-pulse'
                                : 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20'
                            }`}>
                              {prod.stock} units
                            </span>
                          </div>
                          <div className="text-[10px] text-slate-400 mt-0.5 truncate">Min: {prod.minStock}</div>
                        </td>
                        <td className="p-4 sm:p-5 border-r border-b border-[#E5E7EB] dark:border-slate-800 text-slate-600 dark:text-slate-400">
                          <div className="text-xs font-medium text-slate-800 dark:text-slate-200 truncate" title={prod.warehouseZone}>
                            {prod.warehouseZone.split('—')[0]}
                          </div>
                          <div className="text-[10px] text-slate-400 mt-0.5 truncate">Batch: {prod.batchNo}</div>
                        </td>
                        <td className="p-4 sm:p-5 border-b border-[#E5E7EB] dark:border-slate-800 text-right">
                          <div className="flex items-center justify-end gap-1">
                            <button
                              onClick={() => setViewingBatchesProduct(prod)}
                              className="p-2 rounded-xl text-slate-400 hover:text-amber-600 dark:hover:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-950/50 transition-all shrink-0"
                              title="View Batches"
                            >
                              <Layers className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleOpenDrawer(prod)}
                              className="p-2 rounded-xl text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 transition-all shrink-0"
                              title="Edit Product"
                            >
                              <Edit3 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => {
                                if (confirm(`Delete ${prod.name}?`)) deleteProduct(prod.id);
                              }}
                              className="p-2 rounded-xl text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/50 transition-all shrink-0"
                              title="Delete Product"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* Grid Cards View */
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredProducts.map(prod => {
            const margin = Math.round(((prod.price - prod.cost) / prod.price) * 100);
            const isSelected = selectedIds.includes(prod.id);

            return (
              <div
                key={prod.id}
                className={`rounded-xl bg-white dark:bg-slate-900 border transition-all overflow-hidden flex flex-col justify-between group ${
                  isSelected
                    ? 'border-black dark:border-white ring-1 ring-black dark:ring-white shadow-sm'
                    : 'border-slate-200 dark:border-slate-800 hover:border-slate-400 dark:hover:border-slate-600 shadow-sm hover:shadow'
                }`}
              >
                <div>
                  <div className="relative aspect-video w-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                    <img
                      src={prod.imageUrl}
                      alt={prod.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-2.5 left-2.5">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => handleSelectRow(prod.id)}
                        className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 shadow"
                      />
                    </div>
                    <div className="absolute top-2.5 right-2.5">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase backdrop-blur-md ${
                        prod.status === 'in_stock'
                          ? 'bg-emerald-500/80 text-white'
                          : 'bg-rose-500/80 text-white animate-pulse'
                      }`}>
                        {prod.stock} left
                      </span>
                    </div>
                  </div>

                  <div className="p-4 space-y-2">
                    <div className="flex items-center justify-between text-[11px] text-slate-400">
                      <span className="font-mono text-indigo-500">{prod.sku}</span>
                      <span>{prod.category}</span>
                    </div>
                    <h3 className="font-semibold text-xs sm:text-sm text-slate-900 dark:text-white line-clamp-2 leading-snug group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                      {prod.name}
                    </h3>
                    <div className="pt-2 flex items-baseline justify-between border-t border-slate-100 dark:border-slate-800">
                      <div>
                        <span className="text-lg font-bold text-slate-900 dark:text-white">₹{prod.price.toFixed(2)}</span>
                        <span className="text-[10px] text-emerald-600 dark:text-emerald-400 block font-medium">
                          +{margin}% profit margin
                        </span>
                      </div>
                      <span className="text-[10px] text-slate-400 text-right">
                        {prod.warehouseZone.split('—')[0]}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="px-4 py-2.5 bg-slate-50 dark:bg-slate-950/80 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <span className="text-[10px] text-slate-400">Batch: {prod.batchNo}</span>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => setViewingBatchesProduct(prod)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-amber-600 dark:hover:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-950 transition-colors"
                      title="View Batches"
                    >
                      <Layers className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleOpenDrawer(prod)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950 transition-colors"
                      title="Edit"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => {
                        if (confirm(`Delete ${prod.name}?`)) deleteProduct(prod.id);
                      }}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950 transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Floating Action Button (Mobile / Quick access) */}
      <button
        onClick={() => handleOpenDrawer('new')}
        className="fixed bottom-6 right-6 lg:hidden p-4 rounded-full bg-indigo-600 text-white shadow-2xl shadow-indigo-600/40 hover:scale-105 transition-all z-30"
        title="Create New Product"
      >
        <Plus className="w-6 h-6" />
      </button>

      {/* Side Drawer for Creating / Editing Product */}
      {activeDrawer && (
        <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/60 dark:bg-black/70 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 h-full shadow-2xl flex flex-col justify-between border-l border-slate-200 dark:border-slate-800 animate-in slide-in-from-right duration-200 overflow-y-auto">
            <form onSubmit={handleSaveDrawer} className="flex-1 flex flex-col justify-between p-6">
              <div className="space-y-5">
                <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
                  <div>
                    <h3 className="text-base font-bold text-slate-900 dark:text-white">
                      {activeDrawer === 'new' ? 'Create New SKU Entry' : 'Edit Merchandise Profile'}
                    </h3>
                    <p className="text-xs text-slate-500">
                      {activeDrawer === 'new' ? 'Add a new product to the enterprise database.' : `Updating ${formData.sku}`}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setActiveDrawer(null)}
                    className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-4 text-xs">
                  <div>
                    <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">SKU Identifier</label>
                    <input
                      type="text"
                      required
                      value={formData.sku || ''}
                      onChange={e => setFormData({ ...formData, sku: e.target.value })}
                      placeholder="e.g. AUD-SNY-105"
                      className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 font-mono text-indigo-600 dark:text-indigo-400 font-semibold focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Product Title</label>
                    <input
                      type="text"
                      required
                      value={formData.name || ''}
                      onChange={e => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g. Sony WH-1000XM5 Wireless Headphones"
                      className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Category</label>
                      <input
                        type="text"
                        value={formData.category || ''}
                        onChange={e => setFormData({ ...formData, category: e.target.value })}
                        className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Warehouse Zone</label>
                      <select
                        value={formData.warehouseZone || zones[0]?.name}
                        onChange={e => setFormData({ ...formData, warehouseZone: e.target.value })}
                        className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                      >
                        {zones.map(z => (
                          <option key={z.id} value={z.name}>{z.name.split('—')[0]}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Retail Price (₹)</label>
                      <input
                        type="number"
                        step="0.01"
                        value={formData.price || 0}
                        onChange={e => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
                        className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Unit Cost Basis (₹)</label>
                      <input
                        type="number"
                        step="0.01"
                        value={formData.cost || 0}
                        onChange={e => setFormData({ ...formData, cost: parseFloat(e.target.value) || 0 })}
                        className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-emerald-600 dark:text-emerald-400 font-semibold focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Current Stock Balance</label>
                      <input
                        type="number"
                        value={formData.stock || 0}
                        onChange={e => setFormData({ ...formData, stock: parseInt(e.target.value) || 0 })}
                        className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 font-bold focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Reorder Min Alert Level</label>
                      <input
                        type="number"
                        value={formData.minStock || 5}
                        onChange={e => setFormData({ ...formData, minStock: parseInt(e.target.value) || 0 })}
                        className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Barcode Serial EAN</label>
                      <input
                        type="text"
                        value={formData.barcode || ''}
                        onChange={e => setFormData({ ...formData, barcode: e.target.value })}
                        className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 font-mono text-slate-600 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Batch Number Tag</label>
                      <input
                        type="text"
                        value={formData.batchNo || ''}
                        onChange={e => setFormData({ ...formData, batchNo: e.target.value })}
                        className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Image URL</label>
                    <input
                      type="url"
                      value={formData.imageUrl || ''}
                      onChange={e => setFormData({ ...formData, imageUrl: e.target.value })}
                      className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-slate-200 dark:border-slate-800 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setActiveDrawer(null)}
                  className="px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-lg shadow-indigo-600/30 transition-all"
                >
                  {activeDrawer === 'new' ? 'Save New SKU' : 'Commit Updates'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View Batches Modal */}
      {viewingBatchesProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 dark:bg-black/70 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="relative w-full max-w-4xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col max-h-[85vh] animate-in zoom-in-95 duration-150 overflow-hidden">
            
            {/* Modal Header */}
            <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider block mb-1">
                  Inventory Batch Tracking (FIFO Flow)
                </span>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <span>{viewingBatchesProduct.name}</span>
                  <span className="text-xs font-mono px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-500">
                    {viewingBatchesProduct.sku}
                  </span>
                </h3>
              </div>
              <button
                onClick={() => {
                  setViewingBatchesProduct(null);
                  setBatchSearchQuery('');
                }}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Sub-header Controls */}
            <div className="px-6 py-4 bg-slate-50 dark:bg-slate-950/30 border-b border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search by Batch #, Edition, or GRN..."
                  value={batchSearchQuery}
                  onChange={e => setBatchSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-1.5 text-xs rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>
              <div className="flex items-center gap-3 text-xs text-slate-500 font-mono">
                <span>Total Catalog Stock: <strong className="text-slate-900 dark:text-white font-sans">{viewingBatchesProduct.stock}</strong></span>
                <span className="text-slate-300 dark:text-slate-700">|</span>
                <span>Active Batches: <strong className="text-slate-900 dark:text-white font-sans">{batches.filter(b => b.sku === viewingBatchesProduct.sku && b.remainingQuantity > 0).length}</strong></span>
              </div>
            </div>

            {/* Modal Body Table */}
            <div className="p-6 overflow-y-auto flex-1">
              {(() => {
                // 1. Get all batches for this product SKU
                let filtered = batches.filter(b => b.sku === viewingBatchesProduct.sku);
                
                // 2. Filter by batchSearchQuery if any
                if (batchSearchQuery.trim()) {
                  const q = batchSearchQuery.toLowerCase();
                  filtered = filtered.filter(b => 
                    b.batchNo.toLowerCase().includes(q) || 
                    (b.edition && b.edition.toLowerCase().includes(q)) ||
                    (b.grnNumber && b.grnNumber.toLowerCase().includes(q))
                  );
                }
                
                // 3. Sort by receivedDate ascending (FIFO: oldest first)
                const sortedBatches = filtered.sort((a, b) => a.receivedDate.localeCompare(b.receivedDate));

                const activeBatchesSorted = batches
                  .filter(b => b.sku === viewingBatchesProduct.sku && b.remainingQuantity > 0)
                  .sort((a, b) => a.receivedDate.localeCompare(b.receivedDate));

                if (sortedBatches.length === 0) {
                  return (
                    <div className="text-center py-12">
                      <Package className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                      <p className="text-sm font-semibold text-slate-600 dark:text-slate-400">No matching batches found</p>
                      <p className="text-xs text-slate-400 mt-1">There are either no batches recorded for this SKU, or they don't match your filter.</p>
                    </div>
                  );
                }

                return (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead>
                        <tr className="border-b border-slate-200 dark:border-slate-800 text-[10px] font-bold uppercase text-slate-400">
                          <th className="pb-3 px-3">Batch Number / Edition</th>
                          <th className="pb-3 px-3">FIFO Queue Position</th>
                          <th className="pb-3 px-3">Received Date</th>
                          <th className="pb-3 px-3">Unit Costs (Cost / Sell)</th>
                          <th className="pb-3 px-3 text-right">Stock (Remaining / Total)</th>
                          <th className="pb-3 px-3 text-center">Inward Reference</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                        {sortedBatches.map(batch => {
                          const activeIndex = activeBatchesSorted.findIndex(b => b.id === batch.id);
                          
                          return (
                            <tr key={batch.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/50 transition-colors">
                              <td className="py-3 px-3">
                                <div className="font-semibold text-slate-900 dark:text-white font-mono">{batch.batchNo}</div>
                                <div className="text-[10px] text-slate-400 mt-0.5">{batch.edition || 'Standard Edition'}</div>
                              </td>
                              <td className="py-3 px-3">
                                {batch.remainingQuantity === 0 ? (
                                  <span className="inline-flex px-1.5 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-400 dark:bg-slate-800/80 dark:text-slate-500">
                                    Fully Consumed
                                  </span>
                                ) : activeIndex === 0 ? (
                                  <span className="inline-flex px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-900/55">
                                    1st Up (FIFO Next)
                                  </span>
                                ) : activeIndex > 0 ? (
                                  <span className="inline-flex px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-50 text-amber-700 dark:bg-amber-950/30 dark:text-amber-400 border border-amber-100 dark:border-amber-900/55">
                                    {activeIndex + 1} in queue
                                  </span>
                                ) : (
                                  <span className="inline-flex px-1.5 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-400 dark:bg-slate-800/80 dark:text-slate-500">
                                    Inactive
                                  </span>
                                )}
                              </td>
                              <td className="py-3 px-3 text-slate-600 dark:text-slate-400 font-mono">
                                {batch.receivedDate}
                              </td>
                              <td className="py-3 px-3">
                                <div className="text-slate-800 dark:text-slate-200 font-medium">
                                  Cost: <span className="text-emerald-600 dark:text-emerald-400 font-mono">₹{batch.costPrice.toFixed(2)}</span>
                                </div>
                                <div className="text-slate-500 mt-0.5">
                                  Sell: <span className="text-indigo-600 dark:text-indigo-400 font-mono font-semibold">₹{batch.sellingPrice.toFixed(2)}</span>
                                </div>
                              </td>
                              <td className="py-3 px-3 text-right">
                                <div className="font-bold text-slate-900 dark:text-white">
                                  {batch.remainingQuantity} <span className="text-[10px] text-slate-400 font-normal">pcs left</span>
                                </div>
                                <div className="text-[10px] text-slate-400 mt-0.5">
                                  of {batch.totalQuantity} received
                                </div>
                              </td>
                              <td className="py-3 px-3 text-center">
                                {batch.grnNumber ? (
                                  <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 font-mono font-bold text-slate-700 dark:text-slate-300">
                                    {batch.grnNumber}
                                  </span>
                                ) : (
                                  <span className="text-slate-300 font-mono">—</span>
                                )}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                );
              })()}
            </div>

            {/* Modal Footer */}
            <div className="p-6 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/20 flex justify-end">
              <button
                onClick={() => {
                  setViewingBatchesProduct(null);
                  setBatchSearchQuery('');
                }}
                className="px-5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-semibold transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
