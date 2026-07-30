'use client';

import React, { useState } from 'react';
import { useERP } from '../../context/ERPContext';
import {
  IndianRupee,
  BookOpen,
  Gift,
  Heart,
  Package,
  AlertTriangle,
  TrendingUp,
  ShoppingCart,
  Terminal,
  ArrowUpRight,
  Plus,
  FileSpreadsheet,
  Receipt,
  ArrowLeftRight,
  Sliders,
  ChevronDown,
  Calendar,
  Sparkles
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';

const SALES_TREND_DATA = [
  { date: '23 Jul', revenue: 11000 },
  { date: '24 Jul', revenue: 14500 },
  { date: '25 Jul', revenue: 13000 },
  { date: '26 Jul', revenue: 17800 },
  { date: '27 Jul', revenue: 15400 },
  { date: '28 Jul', revenue: 20200 },
  { date: '29 Jul', revenue: 24500 },
];

const CATEGORY_PIE_DATA = [
  { name: 'Books', value: 62, color: '#2563EB' },
  { name: 'Gift Items', value: 20, color: '#D97706' },
  { name: 'Prasadam', value: 10, color: '#15803D' },
  { name: 'Clothing', value: 5, color: '#7C3AED' },
  { name: 'Others', value: 3, color: '#94A3B8' }
];

export const ExecutiveDashboard: React.FC = () => {
  const { products, orders, events, setActiveModule, user } = useERP();

  const [salesTimeframe, setSalesTimeframe] = useState<'week' | 'month' | 'year'>('week');
  const [showSalesDropdown, setShowSalesDropdown] = useState(false);
  const [topBooksTimeframe, setTopBooksTimeframe] = useState<'week' | 'month' | 'all_time'>('month');
  const [showTopBooksDropdown, setShowTopBooksDropdown] = useState(false);

  const getSalesTrendData = () => {
    switch (salesTimeframe) {
      case 'week':
        return [
          { date: '23 Jul', revenue: 11000 },
          { date: '24 Jul', revenue: 14500 },
          { date: '25 Jul', revenue: 13000 },
          { date: '26 Jul', revenue: 17800 },
          { date: '27 Jul', revenue: 15400 },
          { date: '28 Jul', revenue: 20200 },
          { date: '29 Jul', revenue: 24500 },
        ];
      case 'month':
        return [
          { date: 'Week 1', revenue: 64000 },
          { date: 'Week 2', revenue: 78000 },
          { date: 'Week 3', revenue: 69000 },
          { date: 'Week 4', revenue: 95400 },
        ];
      case 'year':
        return [
          { date: 'Jan', revenue: 240000 },
          { date: 'Feb', revenue: 280000 },
          { date: 'Mar', revenue: 310000 },
          { date: 'Apr', revenue: 290000 },
          { date: 'May', revenue: 350000 },
          { date: 'Jun', revenue: 420000 },
          { date: 'Jul', revenue: 490000 },
        ];
      default:
        return SALES_TREND_DATA;
    }
  };

  const getTopBooksData = () => {
    switch (topBooksTimeframe) {
      case 'week':
        return [
          { title: 'Bhagavad Gita As It Is', code: 'BG', copies: 98, revenue: 58800, color: 'bg-red-700' },
          { title: 'Srimad Bhagavatam', code: 'SB', copies: 62, revenue: 40920, color: 'bg-blue-800' },
          { title: 'Nectar of Devotion', code: 'ND', copies: 45, revenue: 20250, color: 'bg-amber-700' },
          { title: 'Teachings of Lord Caitanya', code: 'LC', copies: 38, revenue: 15200, color: 'bg-orange-700' },
          { title: 'Bhakti Rasamrita Sindhu', code: 'BR', copies: 24, revenue: 9600, color: 'bg-emerald-800' },
        ];
      case 'month':
        return [
          { title: 'Bhagavad Gita As It Is', code: 'BG', copies: 456, revenue: 273600, color: 'bg-red-700' },
          { title: 'Srimad Bhagavatam', code: 'SB', copies: 320, revenue: 211200, color: 'bg-blue-800' },
          { title: 'Nectar of Devotion', code: 'ND', copies: 198, revenue: 89100, color: 'bg-amber-700' },
          { title: 'Teachings of Lord Caitanya', code: 'LC', copies: 156, revenue: 62400, color: 'bg-orange-700' },
          { title: 'Bhakti Rasamrita Sindhu', code: 'BR', copies: 112, revenue: 44800, color: 'bg-emerald-800' },
        ];
      case 'all_time':
        return [
          { title: 'Bhagavad Gita As It Is', code: 'BG', copies: 4890, revenue: 2934000, color: 'bg-red-700' },
          { title: 'Srimad Bhagavatam', code: 'SB', copies: 2940, revenue: 1937400, color: 'bg-blue-800' },
          { title: 'Nectar of Devotion', code: 'ND', copies: 1840, revenue: 828000, color: 'bg-amber-700' },
          { title: 'Teachings of Lord Caitanya', code: 'LC', copies: 1420, revenue: 568000, color: 'bg-orange-700' },
          { title: 'Bhakti Rasamrita Sindhu', code: 'BR', copies: 1050, revenue: 420000, color: 'bg-emerald-800' },
        ];
      default:
        return [
          { title: 'Bhagavad Gita As It Is', code: 'BG', copies: 456, revenue: 273600, color: 'bg-red-700' },
          { title: 'Srimad Bhagavatam', code: 'SB', copies: 320, revenue: 211200, color: 'bg-blue-800' },
          { title: 'Nectar of Devotion', code: 'ND', copies: 198, revenue: 89100, color: 'bg-amber-700' },
          { title: 'Teachings of Lord Caitanya', code: 'LC', copies: 156, revenue: 62400, color: 'bg-orange-700' },
          { title: 'Bhakti Rasamrita Sindhu', code: 'BR', copies: 112, revenue: 44800, color: 'bg-emerald-800' },
        ];
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto font-sans">
      
      {/* 1. Welcome Hero Banner with Temple Illustration */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#FFF5E9] via-[#FFF8F2] to-[#FAF5EC] border border-[#E8E2D9] p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm">
        {/* Decorative subtle lotus overlay background */}
        <div className="absolute inset-0 lotus-pattern-bg opacity-[0.04] pointer-events-none" />
        
        {/* Left Side Content */}
        <div className="space-y-4 max-w-xl z-10 text-center md:text-left">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 border border-amber-200/60">
            <span className="text-xs font-bold text-[#D97706] tracking-wide flex items-center gap-1 uppercase">
              Hare Krishna! 🙏
            </span>
          </div>
          <div className="space-y-1">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-display font-bold tracking-tight text-[#1F1916]">
              Welcome back, {user?.name || 'Radha Govinda Das'}
            </h1>
            <p className="text-xs sm:text-sm text-[#786C65] font-medium leading-relaxed">
              Manage your temple store operations with devotion & efficiency.
            </p>
          </div>
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 pt-1">
            <button
              onClick={() => setActiveModule('pos')}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#D97706] hover:bg-[#B45309] text-white font-bold text-xs transition-all shadow-sm shadow-[#D97706]/20"
            >
              <ShoppingCart className="w-3.5 h-3.5" />
              <span>POS Checkout</span>
            </button>
            <button
              onClick={() => setActiveModule('reports')}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-[#E8E2D9] hover:bg-[#FAF8F5] text-[#786C65] font-bold text-xs transition-all"
            >
              <TrendingUp className="w-3.5 h-3.5 text-[#D97706]" />
              <span>View Today's Sales</span>
            </button>
          </div>
        </div>

        {/* Right Side Vector Temple & Books Graphic */}
        <div className="relative w-full max-w-md h-40 md:h-44 flex items-center justify-center shrink-0 overflow-hidden md:-mr-4">
          {/* Beautiful modern vector illustration using styled inline SVGs */}
          <div className="absolute inset-0 flex items-center justify-center scale-95 md:scale-100">
            {/* Background Temple Silhouette */}
            <svg viewBox="0 0 500 200" className="w-full h-full text-amber-200/45 dark:text-amber-800/10 fill-currentColor absolute bottom-0">
              <path d="M50,180 L450,180 L450,170 C450,170 410,130 380,130 C350,130 340,160 340,160 C340,160 310,100 280,100 C250,100 240,150 240,150 L240,140 C240,140 210,60 170,60 C130,60 110,140 110,140 C110,140 90,120 70,120 C50,120 50,180 50,180 Z" />
              <path d="M150,180 L350,180 L350,160 C350,130 310,80 270,80 C230,80 210,140 210,140 L210,110 C210,90 190,40 160,40 C130,40 110,110 110,110 C110,110 90,80 60,80 L60,180 Z" opacity="0.6" />
              {/* Domes and arches */}
              <circle cx="160" cy="40" r="8" className="text-[#D4AF37] fill-currentColor" />
              <circle cx="270" cy="80" r="6" className="text-[#D4AF37] fill-currentColor" />
              <circle cx="380" cy="130" r="5" className="text-[#D4AF37] fill-currentColor" />
            </svg>
            
            {/* Gilded arches detail */}
            <div className="absolute bottom-2 flex items-center gap-4 z-10">
              {/* Bhagavad Gita Book Cover Rendering */}
              <div className="w-16 h-24 rounded-md bg-gradient-to-b from-[#B91C1C] to-[#7F1D1D] shadow-md border border-[#E5A93C]/40 flex flex-col justify-between p-1.5 text-white transform -rotate-6 translate-y-2 hover:rotate-0 hover:translate-y-0 transition-all cursor-pointer">
                <div className="border border-[#E5A93C]/40 rounded-sm h-full flex flex-col justify-between p-1">
                  <div className="text-[7px] font-bold text-center text-[#FEF3C7] tracking-wider font-display leading-none">BHAGAVAD GITA</div>
                  <div className="w-7 h-7 mx-auto rounded-full bg-[#FEF3C7]/10 flex items-center justify-center border border-[#FEF3C7]/20">
                    <Sparkles className="w-3.5 h-3.5 text-[#E5A93C]" />
                  </div>
                  <div className="text-[5px] text-center text-slate-300 font-mono leading-none">PRABHUPADA</div>
                </div>
              </div>

              {/* Srimad Bhagavatam Book Cover Rendering */}
              <div className="w-16 h-24 rounded-md bg-gradient-to-b from-[#1E3A8A] to-[#1E1B4B] shadow-md border border-[#FEF3C7]/30 flex flex-col justify-between p-1.5 text-white transform rotate-3 translate-y-1 hover:rotate-0 hover:translate-y-0 transition-all cursor-pointer">
                <div className="border border-[#FEF3C7]/20 rounded-sm h-full flex flex-col justify-between p-1">
                  <div className="text-[7px] font-bold text-center text-blue-200 tracking-wider font-display leading-none">SRIMAD BHAGAVATAM</div>
                  <div className="w-7 h-7 mx-auto rounded-full bg-[#FEF3C7]/10 flex items-center justify-center border border-[#FEF3C7]/20">
                    <span className="text-[9px] text-[#FEF3C7]">ॐ</span>
                  </div>
                  <div className="text-[5px] text-center text-slate-300 font-mono leading-none">CANTOS 1-12</div>
                </div>
              </div>

              {/* Devotional Gift Bag Visual */}
              <div className="w-14 h-20 rounded-t-lg bg-[#FAF6EE] border border-[#E8E2D9] shadow-sm flex flex-col items-center justify-center p-1 transform rotate-12 translate-y-4 hover:rotate-0 hover:translate-y-2 transition-all">
                <div className="w-4 h-4 rounded-full border border-amber-600/30 -mt-2 mb-1" />
                <div className="text-[8px] font-display font-extrabold text-[#D97706] tracking-widest leading-none">ISKCON</div>
                <svg viewBox="0 0 24 24" className="w-4 h-4 text-[#D97706]/40 mt-1" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M12 2C12 2 9 7 12 15C15 7 12 2 12 2Z" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Metrics KPI Grid - Exactly 6 cards responsive layout */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {/* KPI 1: Today's Sales */}
        <div className="p-4 rounded-2xl bg-white border border-[#E8E2D9] flex flex-col justify-between shadow-2xs hover:shadow-sm transition-all">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center text-[#D97706]">
              <IndianRupee className="w-4 h-4" />
            </div>
            <span className="text-[11px] font-bold text-[#786C65] tracking-tight uppercase">Today's Sales</span>
          </div>
          <div className="mt-3.5 space-y-0.5">
            <div className="flex items-baseline gap-1.5">
              <span className="text-xl sm:text-2xl font-bold font-mono text-[#1F1916]">₹18,490</span>
              <span className="text-[10px] font-bold text-[#15803D] flex items-center font-mono">
                ↑14.2%
              </span>
            </div>
            <p className="text-[10px] text-[#786C65] font-semibold">vs yesterday ₹16,200</p>
          </div>
        </div>

        {/* KPI 2: Books Sold */}
        <div className="p-4 rounded-2xl bg-white border border-[#E8E2D9] flex flex-col justify-between shadow-2xs hover:shadow-sm transition-all">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-[#2563EB]">
              <BookOpen className="w-4 h-4" />
            </div>
            <span className="text-[11px] font-bold text-[#786C65] tracking-tight uppercase">Books Sold</span>
          </div>
          <div className="mt-3.5 space-y-0.5">
            <div className="flex items-baseline gap-1.5">
              <span className="text-xl sm:text-2xl font-bold font-mono text-[#1F1916]">268</span>
              <span className="text-[10px] font-bold text-[#15803D] flex items-center font-mono">
                ↑12.5%
              </span>
            </div>
            <p className="text-[10px] text-[#786C65] font-semibold">vs yesterday 238</p>
          </div>
        </div>

        {/* KPI 3: Gift Items Sold */}
        <div className="p-4 rounded-2xl bg-white border border-[#E8E2D9] flex flex-col justify-between shadow-2xs hover:shadow-sm transition-all">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center text-[#D97706]">
              <Gift className="w-4 h-4" />
            </div>
            <span className="text-[11px] font-bold text-[#786C65] tracking-tight uppercase">Gift Items</span>
          </div>
          <div className="mt-3.5 space-y-0.5">
            <div className="flex items-baseline gap-1.5">
              <span className="text-xl sm:text-2xl font-bold font-mono text-[#1F1916]">184</span>
              <span className="text-[10px] font-bold text-[#15803D] flex items-center font-mono">
                ↑8.3%
              </span>
            </div>
            <p className="text-[10px] text-[#786C65] font-semibold">vs yesterday 170</p>
          </div>
        </div>

        {/* KPI 4: Donations */}
        <div className="p-4 rounded-2xl bg-white border border-[#E8E2D9] flex flex-col justify-between shadow-2xs hover:shadow-sm transition-all">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-red-50 flex items-center justify-center text-[#EF4444]">
              <Heart className="w-4 h-4" />
            </div>
            <span className="text-[11px] font-bold text-[#786C65] tracking-tight uppercase">Donations</span>
          </div>
          <div className="mt-3.5 space-y-0.5">
            <div className="flex items-baseline gap-1.5">
              <span className="text-xl sm:text-2xl font-bold font-mono text-[#1F1916]">₹7,820</span>
              <span className="text-[10px] font-bold text-[#15803D] flex items-center font-mono">
                ↑21.6%
              </span>
            </div>
            <p className="text-[10px] text-[#786C65] font-semibold">vs yesterday ₹6,430</p>
          </div>
        </div>

        {/* KPI 5: Inventory Value */}
        <div className="p-4 rounded-2xl bg-white border border-[#E8E2D9] flex flex-col justify-between shadow-2xs hover:shadow-sm transition-all">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center text-[#D97706]">
              <Package className="w-4 h-4" />
            </div>
            <span className="text-[11px] font-bold text-[#786C65] tracking-tight uppercase">Inventory</span>
          </div>
          <div className="mt-3.5 space-y-0.5">
            <div className="flex items-baseline gap-1.5">
              <span className="text-xl sm:text-2xl font-bold font-mono text-[#1F1916]">₹8,13,800</span>
            </div>
            <p className="text-[10px] text-[#15803D] font-bold font-mono">updated just now</p>
          </div>
        </div>

        {/* KPI 6: Low Stock Items */}
        <div
          onClick={() => setActiveModule('products')}
          className="p-4 rounded-2xl bg-white border border-[#E8E2D9] flex flex-col justify-between shadow-2xs hover:shadow-sm hover:border-[#D97706] transition-all cursor-pointer"
        >
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-red-50 flex items-center justify-center text-[#B91C1C]">
              <AlertTriangle className="w-4 h-4" />
            </div>
            <span className="text-[11px] font-bold text-[#786C65] tracking-tight uppercase">Low Stock</span>
          </div>
          <div className="mt-3.5 space-y-0.5">
            <div className="flex items-baseline gap-1.5">
              <span className="text-xl sm:text-2xl font-bold font-mono text-[#B91C1C]">23</span>
            </div>
            <p className="text-[10px] text-[#D97706] font-bold flex items-center gap-0.5">
              View Details <ChevronDown className="w-3 h-3 rotate-270" />
            </p>
          </div>
        </div>
      </div>

      {/* 3. Middle Row: Charts and Lists (Sales Overview, Top Books, Sales by Category) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Chart Module: Sales Overview (Area Chart) */}
        <div className="lg:col-span-5 p-5 rounded-3xl bg-white border border-[#E8E2D9] flex flex-col justify-between shadow-2xs">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-[#E8E2D9]">
              <h2 className="font-display font-bold text-sm tracking-tight text-[#1F1916]">
                Sales Overview
              </h2>
              <div className="relative">
                <button
                  onClick={() => setShowSalesDropdown(!showSalesDropdown)}
                  className="flex items-center gap-1.5 text-[11px] font-bold text-[#786C65] hover:text-[#1F1916] bg-[#FAF8F5] px-2.5 py-1.5 rounded-xl border border-[#E8E2D9] hover:bg-[#FAF8F5]/80 transition-all cursor-pointer active:scale-95"
                >
                  <span>
                    {salesTimeframe === 'week' ? 'This Week' : salesTimeframe === 'month' ? 'This Month' : 'This Year'}
                  </span>
                  <ChevronDown className="w-3 h-3 text-[#786C65] transition-transform duration-200" />
                </button>
                {showSalesDropdown && (
                  <>
                    <div className="fixed inset-0 z-30" onClick={() => setShowSalesDropdown(false)} />
                    <div className="absolute right-0 mt-1.5 w-32 rounded-xl bg-white border border-[#E8E2D9] shadow-lg z-40 py-1 overflow-hidden animate-in fade-in slide-in-from-top-1 duration-150">
                      {[
                        { label: 'This Week', value: 'week' },
                        { label: 'This Month', value: 'month' },
                        { label: 'This Year', value: 'year' },
                      ].map((opt) => (
                        <button
                          key={opt.value}
                          onClick={() => {
                            setSalesTimeframe(opt.value as any);
                            setShowSalesDropdown(false);
                          }}
                          className={`w-full text-left px-3.5 py-2 text-xs transition-colors hover:bg-[#FAF8F5] ${
                            salesTimeframe === opt.value
                              ? 'text-[#D97706] font-bold bg-amber-50/50'
                              : 'text-[#786C65] font-semibold'
                          }`}
                        >
                          {opt.label}
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>
            <div className="h-48 w-full mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={getSalesTrendData()} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#D97706" stopOpacity={0.15} />
                      <stop offset="95%" stopColor="#D97706" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E8E2D9" opacity={0.5} />
                  <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#786C65', fontWeight: 'bold' }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#786C65', fontWeight: 'bold' }} tickFormatter={(v) => `₹${v / 1000}k`} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#FFFFFF', borderColor: '#E8E2D9', borderRadius: '12px', fontSize: '11px', color: '#1F1916' }}
                    formatter={(val: any) => [`₹${val.toLocaleString()}`, 'Revenue']}
                  />
                  <Area type="monotone" dataKey="revenue" stroke="#D97706" strokeWidth={2} fillOpacity={1} fill="url(#colorSales)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Top Selling Books list */}
        <div className="lg:col-span-4 p-5 rounded-3xl bg-white border border-[#E8E2D9] flex flex-col justify-between shadow-2xs">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-[#E8E2D9]">
              <h2 className="font-display font-bold text-sm tracking-tight text-[#1F1916]">
                Top Selling Books
              </h2>
              <div className="relative">
                <button
                  onClick={() => setShowTopBooksDropdown(!showTopBooksDropdown)}
                  className="flex items-center gap-1.5 text-[11px] font-bold text-[#786C65] hover:text-[#1F1916] bg-[#FAF8F5] px-2.5 py-1.5 rounded-xl border border-[#E8E2D9] hover:bg-[#FAF8F5]/80 transition-all cursor-pointer active:scale-95"
                >
                  <span>
                    {topBooksTimeframe === 'week' ? 'This Week' : topBooksTimeframe === 'month' ? 'This Month' : 'All Time'}
                  </span>
                  <ChevronDown className="w-3 h-3 text-[#786C65] transition-transform duration-200" />
                </button>
                {showTopBooksDropdown && (
                  <>
                    <div className="fixed inset-0 z-30" onClick={() => setShowTopBooksDropdown(false)} />
                    <div className="absolute right-0 mt-1.5 w-32 rounded-xl bg-white border border-[#E8E2D9] shadow-lg z-40 py-1 overflow-hidden animate-in fade-in slide-in-from-top-1 duration-150">
                      {[
                        { label: 'This Week', value: 'week' },
                        { label: 'This Month', value: 'month' },
                        { label: 'All Time', value: 'all_time' },
                      ].map((opt) => (
                        <button
                          key={opt.value}
                          onClick={() => {
                            setTopBooksTimeframe(opt.value as any);
                            setShowTopBooksDropdown(false);
                          }}
                          className={`w-full text-left px-3.5 py-2 text-xs transition-colors hover:bg-[#FAF8F5] ${
                            topBooksTimeframe === opt.value
                              ? 'text-[#D97706] font-bold bg-amber-50/50'
                              : 'text-[#786C65] font-semibold'
                          }`}
                        >
                          {opt.label}
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>
            
            <div className="mt-4 space-y-3.5">
              {getTopBooksData().map((book, idx) => (
                <div key={idx} className="flex items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className={`w-7 h-8 rounded-sm ${book.color} flex items-center justify-center text-[9px] text-white font-bold shrink-0 shadow-2xs`}>
                      {book.code}
                    </div>
                    <div className="min-w-0">
                      <p className="font-bold text-[#1F1916] truncate leading-tight">{book.title}</p>
                      <p className="text-[10px] text-[#786C65] font-semibold">{book.copies} copies</p>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="font-bold font-mono text-[#1F1916]">₹{book.revenue.toLocaleString()}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sales by Category (Donut Chart) */}
        <div className="lg:col-span-3 p-5 rounded-3xl bg-white border border-[#E8E2D9] flex flex-col justify-between shadow-2xs">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-[#E8E2D9]">
              <h2 className="font-display font-bold text-sm tracking-tight text-[#1F1916]">
                Sales by Category
              </h2>
            </div>
            
            <div className="relative h-40 w-full mt-4 flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={CATEGORY_PIE_DATA}
                    cx="50%"
                    cy="50%"
                    innerRadius={44}
                    outerRadius={58}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {CATEGORY_PIE_DATA.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ backgroundColor: '#FFFFFF', borderColor: '#E8E2D9', borderRadius: '12px', fontSize: '11px' }}
                    formatter={(val: any) => [`${val}%`, 'Share']}
                  />
                </PieChart>
              </ResponsiveContainer>
              
              <div className="absolute text-center">
                <p className="text-base font-bold font-mono text-[#1F1916] leading-none">₹18,490</p>
                <p className="text-[9px] text-[#786C65] font-bold uppercase tracking-tight mt-0.5">Total Sales</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 mt-2">
              {CATEGORY_PIE_DATA.map((cat, idx) => (
                <div key={idx} className="flex items-center gap-1.5 text-[10px]">
                  <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: cat.color }} />
                  <span className="font-bold text-[#786C65] truncate">{cat.name}</span>
                  <span className="font-bold text-[#1F1916] ml-auto font-mono">{cat.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>

      {/* 4. Bottom Row: Recent Inward, Festivals & Events, Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Recent Material Inward */}
        <div className="lg:col-span-5 p-5 rounded-3xl bg-white border border-[#E8E2D9] flex flex-col justify-between shadow-2xs">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-[#E8E2D9]">
              <h2 className="font-display font-bold text-sm tracking-tight text-[#1F1916]">
                Recent Material Inward
              </h2>
              <button
                onClick={() => setActiveModule('inward')}
                className="text-[11px] font-bold text-[#D97706] hover:underline"
              >
                View All
              </button>
            </div>
            
            <div className="mt-4 space-y-3.5">
              {[
                { grn: 'GRN-2026-07-145', date: '29 Jul, 2026', source: 'Gita Press', amount: '₹ 48,750' },
                { grn: 'GRN-2026-07-144', date: '28 Jul, 2026', source: 'BBT India', amount: '₹ 23,560' },
                { grn: 'GRN-2026-07-143', date: '27 Jul, 2026', source: 'Mayapur Store', amount: '₹ 15,840' },
                { grn: 'GRN-2026-07-142', date: '27 Jul, 2026', source: 'ISKCON Bangalore', amount: '₹ 31,200' },
              ].map((item, idx) => (
                <div key={idx} className="flex items-center justify-between text-xs py-1">
                  <div>
                    <span className="font-mono font-bold text-[#1F1916] bg-[#FAF8F5] border border-[#E8E2D9] px-2 py-0.5 rounded-md text-[10px]">
                      {item.grn}
                    </span>
                    <span className="text-[11px] text-[#786C65] font-semibold ml-2">{item.source}</span>
                  </div>
                  <div className="text-right">
                    <p className="font-bold font-mono text-[#1F1916]">{item.amount}</p>
                    <p className="text-[9px] text-[#786C65] font-semibold">{item.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Upcoming Festivals & Events */}
        <div className="lg:col-span-4 p-5 rounded-3xl bg-white border border-[#E8E2D9] flex flex-col justify-between shadow-2xs">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-[#E8E2D9]">
              <h2 className="font-display font-bold text-sm tracking-tight text-[#1F1916]">
                Sales Events & Stalls
              </h2>
              <button
                onClick={() => setActiveModule('events')}
                className="text-[11px] font-bold text-[#D97706] hover:underline"
              >
                View Stalls
              </button>
            </div>
            
            <div className="mt-4 space-y-4">
              {events.slice(0, 4).map((evt, idx) => (
                <div key={evt.id || idx} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full overflow-hidden border border-[#E8E2D9] bg-amber-50 flex items-center justify-center font-bold text-[#D97706]">
                      🛕
                    </div>
                    <div>
                      <p className="font-bold text-[#1F1916] leading-tight line-clamp-1">{evt.name}</p>
                      <p className="text-[10px] text-[#786C65] font-semibold mt-0.5">
                        {evt.stallLocation || 'Temple Ground'} • Sales: ₹{(evt.currentRevenue || 0).toLocaleString('en-IN')}
                      </p>
                    </div>
                  </div>
                  <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold font-mono tracking-wide uppercase shrink-0 border ${
                    evt.status === 'active'
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-100'
                      : evt.status === 'upcoming'
                      ? 'bg-amber-50 text-amber-700 border border-amber-100'
                      : 'bg-slate-50 text-slate-500 border border-slate-200'
                  }`}>
                    {evt.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Actions Grid */}
        <div className="lg:col-span-3 p-5 rounded-3xl bg-white border border-[#E8E2D9] flex flex-col justify-between shadow-2xs">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-[#E8E2D9]">
              <h2 className="font-display font-bold text-sm tracking-tight text-[#1F1916]">
                Quick Actions
              </h2>
            </div>
            
            <div className="grid grid-cols-2 gap-2 mt-4">
              <button
                onClick={() => setActiveModule('pos')}
                className="p-3 rounded-xl border border-[#E8E2D9] hover:border-[#D97706] hover:bg-[#FAF8F5] transition-all text-center flex flex-col items-center justify-center gap-1.5 cursor-pointer"
              >
                <ShoppingCart className="w-4.5 h-4.5 text-[#D97706]" />
                <span className="text-[10px] font-bold text-[#1F1916] leading-tight">New Sale (POS)</span>
              </button>
              
              <button
                onClick={() => setActiveModule('products')}
                className="p-3 rounded-xl border border-[#E8E2D9] hover:border-[#D97706] hover:bg-[#FAF8F5] transition-all text-center flex flex-col items-center justify-center gap-1.5 cursor-pointer"
              >
                <BookOpen className="w-4.5 h-4.5 text-[#D97706]" />
                <span className="text-[10px] font-bold text-[#1F1916] leading-tight">Add Book</span>
              </button>

              <button
                onClick={() => setActiveModule('products')}
                className="p-3 rounded-xl border border-[#E8E2D9] hover:border-[#D97706] hover:bg-[#FAF8F5] transition-all text-center flex flex-col items-center justify-center gap-1.5 cursor-pointer"
              >
                <Gift className="w-4.5 h-4.5 text-[#D97706]" />
                <span className="text-[10px] font-bold text-[#1F1916] leading-tight">Add Gift Item</span>
              </button>

              <button
                onClick={() => setActiveModule('reports')}
                className="p-3 rounded-xl border border-[#E8E2D9] hover:border-[#D97706] hover:bg-[#FAF8F5] transition-all text-center flex flex-col items-center justify-center gap-1.5 cursor-pointer"
              >
                <Receipt className="w-4.5 h-4.5 text-[#D97706]" />
                <span className="text-[10px] font-bold text-[#1F1916] leading-tight">Create Invoice</span>
              </button>

              <button
                onClick={() => setActiveModule('inventory')}
                className="p-3 rounded-xl border border-[#E8E2D9] hover:border-[#D97706] hover:bg-[#FAF8F5] transition-all text-center flex flex-col items-center justify-center gap-1.5 cursor-pointer"
              >
                <ArrowLeftRight className="w-4.5 h-4.5 text-[#D97706]" />
                <span className="text-[10px] font-bold text-[#1F1916] leading-tight">Stock Transfer</span>
              </button>

              <button
                onClick={() => setActiveModule('inward')}
                className="p-3 rounded-xl border border-[#E8E2D9] hover:border-[#D97706] hover:bg-[#FAF8F5] transition-all text-center flex flex-col items-center justify-center gap-1.5 cursor-pointer"
              >
                <FileSpreadsheet className="w-4.5 h-4.5 text-[#D97706]" />
                <span className="text-[10px] font-bold text-[#1F1916] leading-tight">New GRN</span>
              </button>
            </div>
          </div>
        </div>

      </div>
      
    </div>
  );
};
