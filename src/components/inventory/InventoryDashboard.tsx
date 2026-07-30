'use client';

import React, { useState } from 'react';
import { useERP } from '../../context/ERPContext';
import { WarehouseZone, StockMovement } from '../../types';
import {
  Warehouse,
  Thermometer,
  ShieldCheck,
  AlertTriangle,
  Clock,
  ArrowRightLeft,
  Package,
  CheckCircle2,
  Lock,
  User,
  Activity,
  Layers,
  Search,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';

export const InventoryDashboard: React.FC = () => {
  const { zones, products, movements, setActiveModule } = useERP();
  const [selectedZoneId, setSelectedZoneId] = useState<string>(zones[0]?.id || 'zone-a');
  const [searchMovement, setSearchMovement] = useState('');

  const activeZone = zones.find(z => z.id === selectedZoneId) || zones[0];
  const zoneProducts = activeZone
    ? products.filter(p => p.warehouseZone?.toLowerCase().includes((activeZone.name || '').split('—')[0].toLowerCase()))
    : [];

  const totalCap = zones.reduce((acc, z) => acc + (z.capacity || 0), 0);
  const totalOcc = zones.reduce((acc, z) => acc + (z.currentOccupancy || 0), 0);
  const overallPercent = totalCap > 0 ? Math.round((totalOcc / totalCap) * 100) : 0;

  const filteredMovements = movements.filter(
    m =>
      m.productName.toLowerCase().includes(searchMovement.toLowerCase()) ||
      m.sku.toLowerCase().includes(searchMovement.toLowerCase()) ||
      m.referenceNo.toLowerCase().includes(searchMovement.toLowerCase()) ||
      m.operator.toLowerCase().includes(searchMovement.toLowerCase())
  );

  const getTempBadge = (type: string) => {
    switch (type) {
      case 'cold':
        return <span className="px-2 py-0.5 rounded-md bg-blue-500/10 text-blue-500 border border-blue-500/20 text-[10px] font-bold flex items-center gap-1"><Thermometer className="w-3 h-3" /> Cold 4°C – 8°C</span>;
      case 'secure_cage':
        return <span className="px-2 py-0.5 rounded-md bg-purple-500/10 text-purple-500 border border-purple-500/20 text-[10px] font-bold flex items-center gap-1"><Lock className="w-3 h-3" /> Biometric Vault</span>;
      case 'quarantine':
        return <span className="px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-500 border border-amber-500/20 text-[10px] font-bold flex items-center gap-1"><AlertTriangle className="w-3 h-3" /> QC Quarantine</span>;
      default:
        return <span className="px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 text-[10px] font-bold flex items-center gap-1"><Activity className="w-3 h-3" /> Ambient 21°C</span>;
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Title Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2.5">
            <Warehouse className="w-6 h-6 text-purple-500 shrink-0" />
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              Warehouse & Inventory Telemetry
            </h1>
          </div>
          <p className="text-xs text-slate-400 mt-1 font-mono">
            LIVE CAPACITY • TEMPERATURE MONITORING • IMMUTABLE AUDIT LOGS
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <button
            onClick={() => setActiveModule('inward')}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-black dark:bg-white text-white dark:text-black font-bold text-xs hover:opacity-90 transition-all shadow-sm"
          >
            <span>+ Receive Shipment (GRN)</span>
          </button>
        </div>
      </div>

      {/* Bento Grid Row 1: Summary Stats (4 columns) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="p-6 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-[11px] font-bold uppercase tracking-widest">Facility Occupancy</span>
              <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-700 dark:text-slate-300">
                <Layers className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-4 flex items-baseline gap-2">
              <span className="text-3xl font-bold font-mono tracking-tight text-slate-900 dark:text-white">{overallPercent}%</span>
              <span className="text-xs text-slate-400 font-mono">({totalOcc}/{totalCap} slots)</span>
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800">
            <div className="w-full h-1.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
              <div className="h-full bg-black dark:bg-white rounded-full transition-all duration-500" style={{ width: `${overallPercent}%` }} />
            </div>
          </div>
        </div>

        <div className="p-6 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-[11px] font-bold uppercase tracking-widest">Active SKUs</span>
              <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-700 dark:text-slate-300">
                <Package className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-4 flex items-baseline gap-2">
              <span className="text-3xl font-bold font-mono tracking-tight text-slate-900 dark:text-white">{products.length}</span>
              <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 uppercase tracking-wide">4 Zones</span>
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-400 font-mono">
            <span>Cost Basis:</span>
            <span className="font-bold text-slate-700 dark:text-slate-300">${(products.reduce((acc, p) => acc + p.cost * p.stock, 0) / 1000).toFixed(1)}k</span>
          </div>
        </div>

        <div className="p-6 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-[11px] font-bold uppercase tracking-widest">Quarantine & QC</span>
              <div className="w-8 h-8 rounded-lg bg-amber-50 dark:bg-amber-950/50 flex items-center justify-center text-amber-600">
                <AlertTriangle className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-4 flex items-baseline gap-2">
              <span className="text-3xl font-bold font-mono tracking-tight text-amber-600 dark:text-amber-400">
                {zones.find(z => z.tempType === 'quarantine')?.currentOccupancy || 45}
              </span>
              <span className="text-xs font-medium text-slate-400 font-mono">slots pending</span>
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-500 font-medium truncate">
            Dyson V15 diagnostic hold
          </div>
        </div>

        <div className="p-6 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-[11px] font-bold uppercase tracking-widest">Stock Health</span>
              <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-950/50 flex items-center justify-center text-emerald-600">
                <ShieldCheck className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-4 flex items-baseline gap-2">
              <span className="text-3xl font-bold font-mono tracking-tight text-emerald-600 dark:text-emerald-400">
                {products.filter(p => p.status === 'in_stock').length}
              </span>
              <span className="text-xs font-bold text-emerald-600 uppercase tracking-wide">Healthy</span>
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-rose-500 font-bold">
            <span>Action Required</span>
            <span className="font-mono">{products.filter(p => p.status !== 'in_stock').length} items</span>
          </div>
        </div>
      </div>

      {/* Bento Grid Row 2: Facility Zone Visualizer */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2 font-mono">
            <span>[01] Interactive Facility Zone Matrix</span>
          </h2>
          <span className="text-xs text-slate-400">Select tile to inspect live batches</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {zones.map(zone => {
            const isSelected = zone.id === selectedZoneId;
            const occPct = Math.round((zone.currentOccupancy / zone.capacity) * 100);
            let borderColor = 'border-slate-200 dark:border-slate-800';
            let bgStyle = 'bg-white dark:bg-slate-900';
            if (isSelected) {
              borderColor = 'border-black dark:border-white ring-1 ring-black dark:ring-white shadow-sm';
              bgStyle = 'bg-slate-50 dark:bg-slate-900';
            }

            return (
              <div
                key={zone.id}
                onClick={() => setSelectedZoneId(zone.id)}
                className={`p-6 rounded-xl border transition-all cursor-pointer flex flex-col justify-between group ${borderColor} ${bgStyle} hover:border-slate-400 dark:hover:border-slate-600`}
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 font-mono font-bold text-xs text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700">
                      {zone.code}
                    </span>
                    {getTempBadge(zone.tempType)}
                  </div>

                  <div>
                    <h3 className="font-bold text-sm text-slate-900 dark:text-white group-hover:text-slate-600 dark:group-hover:text-slate-300 transition-colors">
                      {zone.name}
                    </h3>
                    <p className="text-[11px] text-slate-400 mt-1 line-clamp-2">
                      {zone.description}
                    </p>
                  </div>
                </div>

                <div className="mt-6 pt-3 border-t border-slate-100 dark:border-slate-800 space-y-2">
                  <div className="flex items-center justify-between text-xs font-semibold font-mono">
                    <span className="text-slate-400">CAPACITY</span>
                    <span className="text-slate-900 dark:text-white font-bold">{occPct}% <span className="text-[10px] font-normal text-slate-400">({zone.currentOccupancy}/{zone.capacity})</span></span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                    <div className={`h-full rounded-full ${occPct >= 90 ? 'bg-rose-500' : occPct >= 75 ? 'bg-amber-500' : 'bg-black dark:bg-white'}`} style={{ width: `${occPct}%` }} />
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1 font-mono">
                    <span className="flex items-center gap-1"><User className="w-3 h-3" /> {zone.manager}</span>
                    <span>{zone.activeSKUs} SKUs</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Bento Grid Row 3: Selected Zone Batches */}
      <div className="p-6 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider font-mono flex items-center gap-2">
              <span>[02] Active Inventory Batches &bull; <strong className="text-slate-900 dark:text-white font-sans">{activeZone?.name || 'All Warehouse Zones'}</strong></span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">Assigned manager: <strong className="text-slate-700 dark:text-slate-300">{activeZone?.manager || 'Unassigned'}</strong> &bull; Environmental telemetry synchronized.</p>
          </div>
          <span className="px-3 py-1 rounded-md bg-slate-100 dark:bg-slate-800 text-xs font-mono font-bold text-slate-700 dark:text-slate-300 self-start sm:self-auto border border-slate-200 dark:border-slate-700">
            {zoneProducts.length} PRODUCTS ASSIGNED
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
          {zoneProducts.length === 0 ? (
            <div className="col-span-full py-8 text-center text-xs text-slate-400 font-mono">
              NO MERCHANDISE ASSIGNED TO THIS ZONE CURRENTLY.
            </div>
          ) : (
            zoneProducts.map(prod => {
              const isLow = prod.status !== 'in_stock';
              return (
                <div key={prod.id} className="p-4 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex flex-col justify-between space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <img src={prod.imageUrl} alt={prod.name} className="w-10 h-10 rounded-md object-cover bg-slate-100 shrink-0 border border-slate-200 dark:border-slate-800" />
                      <div className="min-w-0">
                        <div className="font-bold text-xs text-slate-900 dark:text-white truncate">
                          {prod.name}
                        </div>
                        <div className="text-[11px] text-slate-500 font-mono mt-0.5">{prod.sku}</div>
                      </div>
                    </div>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase shrink-0 ${
                      isLow ? 'bg-rose-50 dark:bg-rose-950 text-rose-500 border border-rose-200 dark:border-rose-800 animate-pulse' : 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700'
                    }`}>
                      {prod.status.replace('_', ' ')}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-200/60 dark:border-slate-800/80 text-[11px] font-mono">
                    <div>
                      <span className="text-slate-400 block text-[10px]">BALANCE</span>
                      <strong className="text-xs font-bold text-slate-900 dark:text-white">{prod.stock} UNIT</strong>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px]">BATCH TAG</span>
                      <strong className="text-xs text-slate-700 dark:text-slate-300">{prod.batchNo}</strong>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Bento Grid Row 4: Immutable Audit Trail Table */}
      <div className="p-6 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider font-mono flex items-center gap-2">
              <Clock className="w-4 h-4 text-slate-500" />
              <span>[03] Immutable Stock Movement Timeline (Audit Trail)</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">All inbound GRN receipts, outbound POS purchases, and internal zone transfers.</p>
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchMovement}
              onChange={e => setSearchMovement(e.target.value)}
              placeholder="Filter by SKU, reference, operator..."
              className="w-full pl-9 pr-3 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs font-mono focus:outline-none focus:border-slate-400 dark:focus:border-slate-600 transition-colors"
            />
          </div>
        </div>

        <div className="space-y-2 pt-1">
          {filteredMovements.length === 0 ? (
            <div className="py-8 text-center text-xs text-slate-400 font-mono">No stock movements match filter.</div>
          ) : (
            filteredMovements.map(mov => {
              const isPos = mov.type === 'pos_sale';
              const isGrn = mov.type === 'inward_grn';
              return (
                <div
                  key={mov.id}
                  className="p-3.5 rounded-lg bg-slate-50/70 dark:bg-slate-950/70 border border-slate-200/60 dark:border-slate-800/80 flex items-center justify-between gap-4 hover:bg-slate-100/80 dark:hover:bg-slate-900 transition-colors"
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div className={`w-9 h-9 rounded-md flex items-center justify-center font-bold shrink-0 border border-slate-200 dark:border-slate-800 ${
                      isGrn ? 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200' : isPos ? 'bg-rose-50 dark:bg-rose-950 text-rose-500' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                    }`}>
                      {isGrn ? <ArrowDownRight className="w-4 h-4" /> : isPos ? <ArrowUpRight className="w-4 h-4" /> : <ArrowRightLeft className="w-4 h-4" />}
                    </div>
                    <div className="min-w-0">
                      <div className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-2">
                        <span className="truncate">{mov.productName}</span>
                        <span className="px-1.5 py-0.5 rounded text-[9px] font-mono bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 shrink-0">
                          {mov.sku}
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-400 mt-0.5 flex items-center gap-2 font-mono">
                        <span className="font-bold text-slate-700 dark:text-slate-300">{mov.referenceNo}</span>
                        <span>•</span>
                        <span>OP: {mov.operator}</span>
                        <span>•</span>
                        <span>{mov.timestamp}</span>
                      </div>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <span className={`text-sm font-bold font-mono ${
                      mov.qtyDelta > 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'
                    }`}>
                      {mov.qtyDelta > 0 ? `+${mov.qtyDelta}` : mov.qtyDelta} UNIT
                    </span>
                    <div className="text-[10px] text-slate-400 mt-0.5 font-mono">
                      {mov.toZone ? `TO ${mov.toZone.split('—')[0]}` : ''} {mov.fromZone ? `FROM ${mov.fromZone.split('—')[0]}` : ''}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
