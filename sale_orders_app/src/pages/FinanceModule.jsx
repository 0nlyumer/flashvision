import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import FinanceDashboard from '../components/finance/FinanceDashboard';
import SalesInvoice from '../components/finance/SalesInvoice';
import PurchaseInvoice from '../components/finance/PurchaseInvoice';
import ChartOfAccounts from '../components/finance/ChartOfAccounts';
import LedgerTaxDashboard from '../components/finance/LedgerTaxDashboard';
import Vouchers from '../components/finance/Vouchers';
import { useSearchParams } from 'react-router-dom';

// Finance Module ka main page controller
export default function FinanceModule() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState(() => {
    const urlTab = searchParams.get('tab');
    return urlTab || 'overview';
  });

  // Tab dynamic change hook handler
  useEffect(() => {
    const targetTab = searchParams.get('tab') || 'overview';
    if (targetTab !== activeTab) {
      setActiveTab(targetTab);
    }
  }, [searchParams, activeTab]);

  // Sub-navigation tabs configure mapping
  const tabs = [
    { id: 'overview', label: 'Finance Overview', icon: 'monitoring' },
    { id: 'sales-invoice', label: 'Sales Invoice', icon: 'receipt' },
    { id: 'purchase-invoice', label: 'Purchase Invoice', icon: 'shopping_bag' },
    { id: 'chart-of-accounts', label: 'Chart of Accounts', icon: 'account_tree' },
    { id: 'ledger-tax', label: 'Ledger & Tax', icon: 'receipt_long' },
    { id: 'vouchers', label: 'Vouchers', icon: 'account_balance_wallet' }
  ];

  const handleTabSelect = (id) => {
    setActiveTab(id);
    setSearchParams({ tab: id });
  };

  const subNavConfig = {
    title: "Finance & Accounts",
    items: tabs,
    activeId: activeTab,
    onSelect: handleTabSelect,
    moduleName: "finance"
  };

  return (
    <Layout subNavConfig={subNavConfig}>
      <div className="max-w-full mx-auto w-full animate-in fade-in slide-in-from-bottom-2 duration-300 fill-mode-both">
        {activeTab === 'overview' && <FinanceDashboard />}
        {activeTab === 'sales-invoice' && <SalesInvoice />}
        {activeTab === 'purchase-invoice' && <PurchaseInvoice />}
        {activeTab === 'chart-of-accounts' && <ChartOfAccounts />}
        {activeTab === 'ledger-tax' && <LedgerTaxDashboard />}
        {activeTab === 'vouchers' && <Vouchers />}
      </div>
    </Layout>
  );
}
