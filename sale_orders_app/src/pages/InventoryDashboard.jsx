import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { useApp } from '../context/AppContext';
import CustomMultiSelect from '../components/ui/CustomMultiSelect';

import InvDashboard from '../components/inventory/InvDashboard';
import InvStock from '../components/inventory/InvStock';
import InvAdjustment from '../components/inventory/InvAdjustment';
import InvLedger from '../components/inventory/InvLedger';
import InvReturn from '../components/inventory/InvReturn';
import ItemRateProfile from '../components/inventory/ItemRateProfile';
import ReorderLevelSettings from '../components/inventory/ReorderLevelSettings';
import ClothQualitySetup from '../components/inventory/ClothQualitySetup';

import PurchaseDemand from '../components/inventory/PurchaseDemand';
import PurchaseOrder from '../components/inventory/PurchaseOrder';
import InwardGatePass from '../components/inventory/InwardGatePass';
import GoodsReceivingNote from '../components/inventory/GoodsReceivingNote';
import StockTransfer from '../components/inventory/StockTransfer';
import StockTransferHistory from '../components/inventory/StockTransferHistory';
import { useSearchParams } from 'react-router-dom';

export default function InventoryDashboard() {
  const { state } = useApp();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedDepartments, setSelectedDepartments] = useState(() => {
      const saved = localStorage.getItem('InvDashboard_departments');
      return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
      localStorage.setItem('InvDashboard_departments', JSON.stringify(selectedDepartments));
  }, [selectedDepartments]);

  const tabs = [
    { id: 'dashboard', label: 'Inventory Dashboard' },
    { id: 'stock', label: 'Inventory Stock' },
    { id: 'rate-profile', label: 'Item Rate Profile' },
    { id: 'reorder-levels', label: 'Reorder Levels' },
    { id: 'cloth-conversion', label: 'Cloth Quality' },
    { id: 'adjustment', label: 'Inventory Adjustment' },
    { id: 'ledger', label: 'Inventory Ledger' },
    { id: 'return', label: 'Inventory Return' },
    { id: 'purchase-demand', label: 'Purchase Demand' },
    { id: 'purchase-order', label: 'Purchase Order' },
    { id: 'inward-gate-pass', label: 'Inward Gate Pass' },
    { id: 'grn', label: 'Goods Receiving Note' },
    { id: 'stock-transfer', label: 'Stock Transfer', icon: 'sync_alt' },
  ];
  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
     const tab = searchParams.get('tab');
     if (tab && tabs.find(t => t.id === tab)) {
         setActiveTab(tab);
     }
  }, [searchParams]);

  const handleTabSelect = (id) => {
     setActiveTab(id);
     setSearchParams({ tab: id });
  };

  const subNavConfig = {
      title: 'Inventory',
      items: tabs.map(tab => ({
          ...tab,
          icon: tab.id === 'dashboard' ? 'dashboard' : 
                tab.id === 'stock' ? 'inventory_2' : 
                tab.id === 'rate-profile' ? 'price_change' : 
                tab.id === 'reorder-levels' ? 'notifications_active' :
                tab.id === 'cloth-conversion' ? 'texture' :
                tab.id === 'adjustment' ? 'tune' : 
                tab.id === 'ledger' ? 'receipt_long' : 
                tab.id === 'return' ? 'assignment_return' :
                tab.id === 'purchase-demand' ? 'assignment' :
                tab.id === 'purchase-order' ? 'shopping_cart' :
                tab.id === 'inward-gate-pass' ? 'local_shipping' :
                tab.id === 'stock-transfer' ? 'sync_alt' : 'inventory'
      })),
      activeId: activeTab,
      onSelect: handleTabSelect
  };

  return (
    <Layout subNavConfig={subNavConfig}>
      <div className="max-w-full px-6 mx-auto w-full">
        
        {/* Global Department Filter */}
        {activeTab !== 'rate-profile' && activeTab !== 'reorder-levels' && activeTab !== 'cloth-conversion' && (
          <div className="flex justify-end mb-4 pr-4 animate-in fade-in slide-in-from-top-2 duration-500">
              <div className="w-[300px]">
                  <CustomMultiSelect 
                      options={(state.departments || []).map(d => ({ label: d.label || d, value: d.value || d }))}
                      selectedValues={selectedDepartments}
                      onChange={setSelectedDepartments}
                      placeholder="All Departments"
                  />
              </div>
          </div>
        )}

        {/* Tab Content */}
        <div className="animate-in fade-in slide-in-from-bottom-2 duration-300 fill-mode-both">
          {activeTab === 'dashboard' && <InvDashboard selectedDepartments={selectedDepartments} />}
          {activeTab === 'stock' && <InvStock selectedDepartments={selectedDepartments} />}
          {activeTab === 'rate-profile' && <ItemRateProfile />}
          {activeTab === 'reorder-levels' && <ReorderLevelSettings />}
          {activeTab === 'cloth-conversion' && <ClothQualitySetup />}
          {activeTab === 'adjustment' && <InvAdjustment selectedDepartments={selectedDepartments} />}
          {activeTab === 'ledger' && <InvLedger selectedDepartments={selectedDepartments} />}
          {activeTab === 'return' && <InvReturn selectedDepartments={selectedDepartments} />}
          {activeTab === 'purchase-demand' && <PurchaseDemand selectedDepartments={selectedDepartments} />}
          {activeTab === 'purchase-order' && <PurchaseOrder selectedDepartments={selectedDepartments} />}
          {activeTab === 'inward-gate-pass' && <InwardGatePass />}
          {activeTab === 'grn' && <GoodsReceivingNote />}
          {activeTab === 'stock-transfer' && <StockTransfer onHistoryClick={() => handleTabSelect('stock-transfer-history')} />}
          {activeTab === 'stock-transfer-history' && <StockTransferHistory onNewTransferClick={() => handleTabSelect('stock-transfer')} />}
        </div>
      </div>
    </Layout>
  );
}
