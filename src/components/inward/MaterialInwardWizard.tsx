'use client';

import React, { useState } from 'react';
import { useERP } from '../../context/ERPContext';
import { InwardItem, MaterialInwardNote } from '../../types';
import {
  FileSpreadsheet,
  Plus,
  Trash2,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Building2,
  Calendar,
  Warehouse,
  QrCode,
  Printer,
  Barcode as BarcodeIcon,
  Check,
  ShieldCheck,
  IndianRupee,
  AlertCircle
} from 'lucide-react';

export const MaterialInwardWizard: React.FC = () => {
  const { products, zones, addInwardNote, user, setActiveModule, quickNotification } = useERP();
  
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);

  // Step 1 Form
  const [vendorName, setVendorName] = useState('TechGlobal Distribution Inc.');
  const [poNumber, setPoNumber] = useState('PO-88941-US');
  const [invoiceDate, setInvoiceDate] = useState(new Date().toISOString().slice(0, 10));
  const [selectedZone, setSelectedZone] = useState(zones[0]?.name || 'Zone A — Main Retail Floor');
  const [grnNotes, setGrnNotes] = useState('All cartons arrived intact with factory security seals.');

  // Step 2 Dynamic Items
  const [items, setItems] = useState<InwardItem[]>([
    {
      id: `item-${Date.now()}-1`,
      sku: products[0]?.sku || 'BK-BG-2026',
      name: products[0]?.name || 'Bhagavad-gita As It Is (2026 Deluxe Edition)',
      quantity: 15,
      unitCost: products[0]?.cost || 180.00,
      sellingPrice: products[0]?.price || 450.00,
      batchNo: 'BAT-2026-DLX-01',
      expiryDate: '2036-12-31',
      taxRate: 0,
      total: 2700.00
    }
  ]);

  // Step 3 Options
  const [autoPrintLabels, setAutoPrintLabels] = useState(true);
  const [generatedGrnNumber, setGeneratedGrnNumber] = useState('');

  // Auto calculation helper
  const updateRow = (id: string, updates: Partial<InwardItem>) => {
    setItems(prev =>
      prev.map(item => {
        if (item.id === id) {
          const updated = { ...item, ...updates };
          // If SKU changed, try to auto-fill name, cost, and selling price from products catalog
          if (updates.sku) {
            const foundProd = products.find(p => p.sku === updates.sku);
            if (foundProd) {
              updated.name = foundProd.name;
              updated.unitCost = foundProd.cost;
              updated.sellingPrice = foundProd.price;
            }
          }
          // Recalculate total
          const sub = updated.quantity * updated.unitCost;
          const tax = sub * (updated.taxRate / 100);
          updated.total = Number((sub + tax).toFixed(2));
          return updated;
        }
        return item;
      })
    );
  };

  const addRow = () => {
    const defaultProd = products[Math.min(items.length, products.length - 1)] || products[0];
    const newRow: InwardItem = {
      id: `item-${Date.now()}-${Math.random()}`,
      sku: defaultProd ? defaultProd.sku : 'SKU-NEW-100',
      name: defaultProd ? defaultProd.name : 'New Merch Item',
      quantity: 10,
      unitCost: defaultProd ? defaultProd.cost : 50.00,
      sellingPrice: defaultProd ? defaultProd.price : 150.00,
      batchNo: `BAT-2026-Q3-${Math.floor(10 + Math.random() * 89)}`,
      expiryDate: '2030-12-31',
      taxRate: 0,
      total: Number((10 * (defaultProd ? defaultProd.cost : 50)).toFixed(2))
    };
    setItems(prev => [...prev, newRow]);
  };

  const removeRow = (id: string) => {
    if (items.length === 1) {
      alert("At least one product item is required for a Goods Received Note.");
      return;
    }
    setItems(prev => prev.filter(i => i.id !== id));
  };

  const totalGrnValue = items.reduce((acc, i) => acc + i.total, 0);
  const totalUnits = items.reduce((acc, i) => acc + Number(i.quantity), 0);

  const handleCompleteGrn = () => {
    const grnNo = `GRN-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    setGeneratedGrnNumber(grnNo);

    addInwardNote({
      grnNumber: grnNo,
      poNumber: poNumber || 'PO-0000',
      vendorName: vendorName || 'Unknown Vendor',
      invoiceDate: invoiceDate,
      warehouse: selectedZone,
      items: items,
      status: 'completed',
      totalValue: totalGrnValue,
      receivedBy: user?.name || 'Radha Govinda Das',
      timestamp: new Date().toLocaleString(),
      notes: grnNotes
    });

    if (autoPrintLabels) {
      quickNotification('Barcode Stickers Sent to Printer', `Dispatched ${totalUnits} serialized tags to terminal printer.`, 'info');
    }

    setStep(4);
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Header */}
      <div className="pb-4 border-b border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <FileSpreadsheet className="w-6 h-6 text-blue-500 shrink-0" />
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              Material Inward Note (GRN Wizard)
            </h1>
          </div>
          <p className="text-xs text-slate-400 mt-1 font-mono">
            INTAKE PROCESS • TAX COMPUTATION • BARCODE VERIFICATION • INVENTORY SYNC
          </p>
        </div>
        <div className="px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-mono font-bold text-slate-700 dark:text-slate-300">
          PO: {poNumber}
        </div>
      </div>

      {/* Bento Summary Grid (3 columns) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-bold uppercase tracking-widest font-mono">Total PO Value</span>
            <IndianRupee className="w-4 h-4 text-slate-700 dark:text-slate-300" />
          </div>
          <div className="mt-3">
            <span className="text-2xl font-bold font-mono tracking-tight text-slate-900 dark:text-white">
              ₹{items.reduce((sum, i) => sum + i.total, 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
          </div>
        </div>

        <div className="p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-bold uppercase tracking-widest font-mono">Carton Items</span>
            <BarcodeIcon className="w-4 h-4 text-slate-700 dark:text-slate-300" />
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono tracking-tight text-slate-900 dark:text-white">
              {items.reduce((sum, i) => sum + i.quantity, 0)} <span className="text-xs text-slate-400 font-normal">units</span>
            </span>
            <span className="text-xs font-mono font-bold text-slate-500">({items.length} SKUs)</span>
          </div>
        </div>

        <div className="p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-bold uppercase tracking-widest font-mono">Destination Zone</span>
            <Warehouse className="w-4 h-4 text-slate-700 dark:text-slate-300" />
          </div>
          <div className="mt-3 truncate">
            <span className="text-sm font-bold font-mono text-slate-900 dark:text-white truncate block">
              {selectedZone.split('—')[0]}
            </span>
            <span className="text-[10px] text-slate-400 font-mono truncate block">
              {selectedZone.split('—')[1] || 'Retail Floor'}
            </span>
          </div>
        </div>
      </div>

      {/* Wizard Progress Stepper */}
      <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="grid grid-cols-4 gap-2 text-center relative">
          {[
            { num: 1, title: 'Vendor PO Info' },
            { num: 2, title: 'Dynamic Items' },
            { num: 3, title: 'Batch Barcode QC' },
            { num: 4, title: 'Confirmation' }
          ].map(st => {
            const isDone = step > st.num;
            const isCurrent = step === st.num;
            return (
              <div key={st.num} className="flex flex-col items-center gap-1.5 z-10">
                <div
                  className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold font-mono transition-all ${
                    isDone
                      ? 'bg-[#15803D] text-white shadow-sm'
                      : isCurrent
                      ? 'bg-[#D97706] text-white shadow-sm font-extrabold ring-2 ring-[#D97706]/30'
                      : 'bg-slate-100 dark:bg-slate-800 text-[#786C65] border border-[#E8E2D9] dark:border-slate-700'
                  }`}
                >
                  {isDone ? <Check className="w-4 h-4" /> : st.num}
                </div>
                <span className={`text-[11px] font-bold font-mono uppercase tracking-wider truncate max-w-full ${
                  isCurrent ? 'text-[#D97706] dark:text-amber-400' : isDone ? 'text-[#15803D] dark:text-emerald-400' : 'text-[#786C65]'
                }`}>
                  {st.title}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Step 1: Vendor & Document Details */}
      {step === 1 && (
        <div className="p-6 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6 animate-in fade-in duration-200">
          <div className="border-b border-slate-100 dark:border-slate-800 pb-4">
            <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Building2 className="w-5 h-5 text-indigo-500" />
              <span>Step 1: Supplier & Purchase Order Information</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">Specify origin vendor and destination warehouse zone.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Supplier / Vendor Name</label>
              <input
                type="text"
                value={vendorName}
                onChange={e => setVendorName(e.target.value)}
                placeholder="e.g. TechGlobal Distribution Inc."
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 font-medium text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Purchase Order (PO) Number</label>
              <input
                type="text"
                value={poNumber}
                onChange={e => setPoNumber(e.target.value)}
                placeholder="e.g. PO-88941-US"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 font-mono text-indigo-600 dark:text-indigo-400 font-semibold focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Invoice Date</label>
              <div className="relative">
                <Calendar className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                <input
                  type="date"
                  value={invoiceDate}
                  onChange={e => setInvoiceDate(e.target.value)}
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 font-medium text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Destination Warehouse Zone</label>
              <div className="relative">
                <Warehouse className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                <select
                  value={selectedZone}
                  onChange={e => setSelectedZone(e.target.value)}
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 font-medium text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                >
                  {zones.map(z => (
                    <option key={z.id} value={z.name}>{z.name}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="md:col-span-2">
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Inspection & Delivery Notes</label>
              <textarea
                rows={2}
                value={grnNotes}
                onChange={e => setGrnNotes(e.target.value)}
                placeholder="Optional carrier notes, seal numbers, or QC instructions..."
                className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 font-medium text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-end">
            <button
              onClick={() => {
                if (!vendorName || !poNumber) {
                  alert("Please enter Supplier Name and PO Number.");
                  return;
                }
                setStep(2);
              }}
              className="flex items-center gap-2 px-6 py-3 rounded-lg bg-black dark:bg-white text-white dark:text-black font-bold text-xs sm:text-sm shadow-sm transition-all hover:opacity-90 font-mono"
            >
              <span>NEXT: ADD PRODUCT ROWS</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Step 2: Dynamic Product Rows & Calculations */}
      {step === 2 && (
        <div className="p-6 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6 animate-in fade-in duration-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <span>Step 2: Dynamic Shipment Items & Auto calculations</span>
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">Select SKUs from catalog, input quantities, and verify tax totals.</p>
            </div>
            <button
              onClick={addRow}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-black dark:bg-white text-white dark:text-black font-bold text-xs shadow-sm transition-all self-start sm:self-auto font-mono hover:opacity-90"
            >
              <Plus className="w-4 h-4" />
              <span>+ ADD SKU ROW</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[700px]">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/70 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  <th className="py-2.5 px-3 w-40">SKU Lookup</th>
                  <th className="py-2.5 px-3">Product Description</th>
                  <th className="py-2.5 px-3 w-24">Qty</th>
                  <th className="py-2.5 px-3 w-28">Unit Cost (₹)</th>
                  <th className="py-2.5 px-3 w-28">Selling Price (₹)</th>
                  <th className="py-2.5 px-3 w-28">Batch #</th>
                  <th className="py-2.5 px-3 w-20">Tax (%)</th>
                  <th className="py-2.5 px-3 w-28 text-right">Row Total</th>
                  <th className="py-2.5 px-2 w-10 text-center"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-xs">
                {items.map(row => (
                  <tr key={row.id} className="group">
                    <td className="py-3 px-3">
                      <select
                        value={row.sku}
                        onChange={e => updateRow(row.id, { sku: e.target.value })}
                        className="w-full px-2.5 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 font-mono font-semibold text-indigo-600 dark:text-indigo-400 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                      >
                        {products.map(p => (
                          <option key={p.id} value={p.sku}>{p.sku}</option>
                        ))}
                      </select>
                    </td>
                    <td className="py-3 px-3">
                      <input
                        type="text"
                        value={row.name}
                        onChange={e => updateRow(row.id, { name: e.target.value })}
                        className="w-full px-2.5 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 font-medium focus:outline-none focus:ring-1 focus:ring-indigo-500"
                      />
                    </td>
                    <td className="py-3 px-3">
                      <input
                        type="number"
                        min="1"
                        value={row.quantity}
                        onChange={e => updateRow(row.id, { quantity: parseInt(e.target.value) || 0 })}
                        className="w-full px-2 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 font-bold focus:outline-none focus:ring-1 focus:ring-indigo-500 text-center"
                      />
                    </td>
                    <td className="py-3 px-3">
                      <input
                        type="number"
                        step="0.01"
                        value={row.unitCost}
                        onChange={e => updateRow(row.id, { unitCost: parseFloat(e.target.value) || 0 })}
                        className="w-full px-2 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 font-semibold text-emerald-600 dark:text-emerald-400 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                      />
                    </td>
                    <td className="py-3 px-3">
                      <input
                        type="number"
                        step="0.01"
                        value={row.sellingPrice || 0}
                        onChange={e => updateRow(row.id, { sellingPrice: parseFloat(e.target.value) || 0 })}
                        className="w-full px-2 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 font-semibold text-blue-600 dark:text-blue-400 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                      />
                    </td>
                    <td className="py-3 px-3">
                      <input
                        type="text"
                        value={row.batchNo}
                        onChange={e => updateRow(row.id, { batchNo: e.target.value })}
                        className="w-full px-2 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-[11px] focus:outline-none focus:ring-1 focus:ring-indigo-500"
                      />
                    </td>
                    <td className="py-3 px-3">
                      <select
                        value={row.taxRate}
                        onChange={e => updateRow(row.id, { taxRate: parseFloat(e.target.value) || 0 })}
                        className="w-full px-1.5 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:outline-none"
                      >
                        <option value="0">0%</option>
                        <option value="5">5%</option>
                        <option value="10">10%</option>
                        <option value="15">15%</option>
                      </select>
                    </td>
                    <td className="py-3 px-3 text-right font-bold text-slate-900 dark:text-white">
                      ₹{row.total.toFixed(2)}
                    </td>
                    <td className="py-3 px-2 text-center">
                      <button
                        onClick={() => removeRow(row.id)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950 transition-colors"
                        title="Remove Row"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Grand Totals Bar */}
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
            <div className="space-y-1">
              <span className="font-semibold text-slate-700 dark:text-slate-300">Total Units Received: <strong>{totalUnits} pcs</strong></span>
              <p className="text-[11px] text-slate-400">Values include computed regional VAT/Tax rates.</p>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-slate-500 uppercase tracking-wider font-bold">Total GRN Valuation:</span>
              <span className="text-xl sm:text-2xl font-extrabold text-[#D97706]">
                ₹{totalGrnValue.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
            </div>
          </div>

          {/* Navigation buttons */}
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <button
              onClick={() => setStep(1)}
              className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold text-xs sm:text-sm transition-colors font-mono"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>BACK: VENDOR PO</span>
            </button>
            <button
              onClick={() => setStep(3)}
              className="flex items-center gap-2 px-6 py-3 rounded-lg bg-black dark:bg-white text-white dark:text-black font-bold text-xs sm:text-sm shadow-sm transition-all hover:opacity-90 font-mono"
            >
              <span>NEXT: BARCODE & BATCH REVIEW</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Step 3: Barcode & Batch Verification */}
      {step === 3 && (
        <div className="p-6 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6 animate-in fade-in duration-200">
          <div className="border-b border-slate-100 dark:border-slate-800 pb-4">
            <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <QrCode className="w-5 h-5 text-amber-500" />
              <span>Step 3: Barcode & Batch Label Preview</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">Verify auto-generated serial barcodes and sticker print queues before final commitment.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {items.map((row, idx) => {
              const fakeBarcode = `49000${Math.floor(10000000 + Math.random() * 89999999)}`;
              return (
                <div key={row.id} className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex items-center justify-between gap-4">
                  <div className="space-y-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-mono font-bold text-[10px]">
                        {row.sku}
                      </span>
                      <span className="text-[10px] text-slate-400">Qty: {row.quantity}</span>
                    </div>
                    <div className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate">
                      {row.name}
                    </div>
                    <div className="text-[11px] text-slate-500">
                      Batch: <strong className="text-slate-700 dark:text-slate-300">{row.batchNo}</strong> • Exp: {row.expiryDate}
                    </div>
                  </div>

                  {/* Visual Barcode simulation */}
                  <div className="p-2.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center shrink-0 shadow-sm">
                    <div className="flex items-center justify-center gap-[2px] h-8 w-24 overflow-hidden opacity-90">
                      {Array.from({ length: 18 }).map((_, i) => (
                        <div key={i} className="bg-slate-900 dark:bg-white h-full" style={{ width: `${i % 3 === 0 ? 3 : 1.5}px` }} />
                      ))}
                    </div>
                    <span className="text-[9px] font-mono text-slate-600 dark:text-slate-400 block mt-1 tracking-wider">
                      {fakeBarcode}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Printer Options Toggle */}
          <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Printer className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0" />
              <div>
                <h4 className="text-xs font-bold text-amber-900 dark:text-amber-300">Auto-Print Adhesive Sticker Labels (1x2 inch)</h4>
                <p className="text-[11px] text-amber-700 dark:text-amber-400/80">
                  When enabled, {totalUnits} individual barcode stickers will dispatch immediately to Terminal Printer #1 upon GRN confirmation.
                </p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer shrink-0">
              <input
                type="checkbox"
                checked={autoPrintLabels}
                onChange={e => setAutoPrintLabels(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-500"></div>
            </label>
          </div>

          {/* Navigation */}
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <button
              onClick={() => setStep(2)}
              className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold text-xs sm:text-sm transition-colors font-mono"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>BACK: DYNAMIC ITEMS</span>
            </button>
            <button
              onClick={handleCompleteGrn}
              className="flex items-center gap-2 px-6 py-3 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm shadow-sm transition-all font-mono"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>CONFIRM & COMMIT GRN</span>
            </button>
          </div>
        </div>
      )}

      {/* Step 4: Success Confirmation Screen */}
      {step === 4 && (
        <div className="p-8 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm text-center space-y-6 animate-in zoom-in-95 duration-200">
          <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-500 flex items-center justify-center mx-auto ring-8 ring-emerald-500/10">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <div className="space-y-1">
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white font-mono">
              MATERIAL INWARD NOTE PROCESSED
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-mono">
              GRN NUMBER <strong className="text-black dark:text-white font-bold">{generatedGrnNumber}</strong> RECORDED.
            </p>
          </div>

          {/* Summary Card */}
          <div className="max-w-md mx-auto p-5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-left space-y-3 text-xs font-mono">
            <div className="flex justify-between border-b border-slate-200 dark:border-slate-800 pb-2 font-bold text-slate-800 dark:text-slate-200">
              <span>Destination Zone:</span>
              <span className="text-slate-900 dark:text-white">{selectedZone.split('—')[0]}</span>
            </div>
            <div className="flex justify-between text-slate-600 dark:text-slate-400">
              <span>Total Units Added:</span>
              <span className="font-bold text-slate-900 dark:text-white">{totalUnits} units</span>
            </div>
            <div className="flex justify-between text-slate-600 dark:text-slate-400">
              <span>Total Financial Value:</span>
              <span className="font-bold text-emerald-600 dark:text-emerald-400">
                ₹{totalGrnValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
            </div>
            <div className="flex justify-between text-slate-600 dark:text-slate-400">
              <span>Received By:</span>
              <span>{user?.name || 'Radha Govinda Das'}</span>
            </div>
            {autoPrintLabels && (
              <div className="pt-2 border-t border-slate-200 dark:border-slate-800 flex items-center gap-2 text-amber-600 dark:text-amber-400 font-bold">
                <Printer className="w-4 h-4 shrink-0" />
                <span>{totalUnits} BARCODE LABELS SENT TO PRINTER QUEUE.</span>
              </div>
            )}
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4 font-mono">
            <button
              onClick={() => {
                alert(`Printing Official GRN Voucher ${generatedGrnNumber} to default office printer...`);
                quickNotification('Voucher Printing', `Printing ${generatedGrnNumber} document voucher.`, 'info');
              }}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs transition-colors"
            >
              <Printer className="w-4 h-4" />
              <span>PRINT VOUCHER</span>
            </button>
            <button
              onClick={() => {
                setStep(1);
                setItems([{
                  id: `item-${Date.now()}-1`,
                  sku: products[0]?.sku || 'AUD-SNY-105',
                  name: products[0]?.name || 'Sony WH-1000XM5 Headphones',
                  quantity: 10,
                  unitCost: 260.00,
                  batchNo: 'BAT-2026-Q3-090',
                  expiryDate: '2029-12-31',
                  taxRate: 10,
                  total: 2860.00
                }]);
              }}
              className="w-full sm:w-auto px-5 py-2.5 rounded-lg bg-black dark:bg-white text-white dark:text-black font-bold text-xs shadow-sm transition-all hover:opacity-90"
            >
              + NEW GRN NOTE
            </button>
            <button
              onClick={() => setActiveModule('inventory')}
              className="w-full sm:w-auto px-5 py-2.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs border border-slate-200 dark:border-slate-700 transition-all"
            >
              WAREHOUSE DASHBOARD &rarr;
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
