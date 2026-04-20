import React, { useState } from 'react';
import Layout from '../components/Layout';

import InvDashboard from '../components/inventory/InvDashboard';
import InvStock from '../components/inventory/InvStock';
import InvAdjustment from '../components/inventory/InvAdjustment';
import InvLedger from '../components/inventory/InvLedger';
import InvReturn from '../components/inventory/InvReturn';

export default function InventoryDashboard() {
  const [activeTab, setActiveTab] = useState('dashboard');

  const tabs = [
    { id: 'dashboard', label: 'Inventory Dashboard' },
    { id: 'stock', label: 'Inventory Stock' },
    { id: 'adjustment', label: 'Inventory Adjustment' },
    { id: 'ledger', label: 'Inventory Ledger' },
    { id: 'return', label: 'Inventory Return' },
  ];

  return (
    <Layout>
      <div className="max-w-[1600px] mx-auto w-full">
        {/* Module Navigation */}
        <div className="bg-surface-container-lowest p-2 rounded-2xl flex gap-2 mb-8 shadow-sm border border-outline-variant/10 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-6 py-3 rounded-xl font-bold text-sm whitespace-nowrap transition-all ${
                activeTab === tab.id
                  ? 'bg-primary text-on-primary shadow-md'
                  : 'text-on-surface-variant hover:bg-surface-container hover:text-primary'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="animate-in fade-in slide-in-from-bottom-2 duration-300 fill-mode-both">
          {activeTab === 'dashboard' && <InvDashboard />}
          {activeTab === 'stock' && <InvStock />}
          {activeTab === 'adjustment' && <InvAdjustment />}
          {activeTab === 'ledger' && <InvLedger />}
          {activeTab === 'return' && <InvReturn />}
        </div>
      </div>
    </Layout>
  );
}
