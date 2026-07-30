'use client';

import React from 'react';
import { useERP } from '@/context/ERPContext';
import { ExecutiveDashboard } from '@/components/dashboard/ExecutiveDashboard';
import { POSTerminal } from '@/components/pos/POSTerminal';
import { MaterialInwardWizard } from '@/components/inward/MaterialInwardWizard';
import { ProductManagement } from '@/components/products/ProductManagement';
import { InventoryDashboard } from '@/components/inventory/InventoryDashboard';
import { BarcodeManager } from '@/components/barcode/BarcodeManager';
import { SalesPromotions } from '@/components/events/SalesPromotions';
import { BIAnalytics } from '@/components/reports/BIAnalytics';

export default function CatchAllPageClient() {
  const { activeModule } = useERP();

  switch (activeModule) {
    case 'pos':
      return <POSTerminal />;
    case 'inward':
      return <MaterialInwardWizard />;
    case 'products':
      return <ProductManagement />;
    case 'inventory':
      return <InventoryDashboard />;
    case 'barcode':
      return <BarcodeManager />;
    case 'events':
      return <SalesPromotions />;
    case 'reports':
      return <BIAnalytics />;
    case 'dashboard':
    default:
      return <ExecutiveDashboard />;
  }
}
