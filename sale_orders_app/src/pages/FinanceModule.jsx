import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import FinanceDashboard from '../components/finance/FinanceDashboard';
import SalesInvoice from '../components/finance/SalesInvoice';
import PurchaseInvoice from '../components/finance/PurchaseInvoice';
import ChartOfAccounts from '../components/finance/ChartOfAccounts';
import LedgerTaxDashboard from '../components/finance/LedgerTaxDashboard';
import Vouchers from '../components/finance/Vouchers';
import { useSearchParams } from 'react-router-dom';

export default function FinanceModule() {
  const [searchParams, setSearchParams] = useSearchParams();
  const tabInUrl = searchParams.get('tab');
  const [activeTab, setActiveTab] = useState(() => tabInUrl || 'overview');
  const [visitedTabs, setVisitedTabs] = useState(() => new Set([tabInUrl || 'overview']));

  useEffect(() => {
    const targetTab = searchParams.get('tab') || 'overview';
    if (targetTab !== activeTab) {
      setActiveTab(targetTab);
      setVisitedTabs(prev => {
        if (prev.has(targetTab)) return prev;
        const next = new Set(prev);
        next.add(targetTab);
        return next;
      });
    }
  }, [searchParams]);

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
    setVisitedTabs(prev => {
      if (prev.has(id)) return prev;
      const next = new Set(prev);
      next.add(id);
      return next;
    });
    setSearchParams({ tab: id }, { replace: true });
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
      <div className="max-w-full mx-auto w-full">
        {visitedTabs.has('overview') && (
          <div style={{ display: activeTab === 'overview' ? 'block' : 'none' }}>
            <FinanceDashboard />
          </div>
        )}
        {visitedTabs.has('sales-invoice') && (
          <div style={{ display: activeTab === 'sales-invoice' ? 'block' : 'none' }}>
            <SalesInvoice />
          </div>
        )}
        {visitedTabs.has('purchase-invoice') && (
          <div style={{ display: activeTab === 'purchase-invoice' ? 'block' : 'none' }}>
            <PurchaseInvoice />
          </div>
        )}
        {visitedTabs.has('chart-of-accounts') && (
          <div style={{ display: activeTab === 'chart-of-accounts' ? 'block' : 'none' }}>
            <ChartOfAccounts />
          </div>
        )}
        {visitedTabs.has('ledger-tax') && (
          <div style={{ display: activeTab === 'ledger-tax' ? 'block' : 'none' }}>
            <LedgerTaxDashboard />
          </div>
        )}
        {visitedTabs.has('vouchers') && (
          <div style={{ display: activeTab === 'vouchers' ? 'block' : 'none' }}>
            <Vouchers />
          </div>
        )}
      </div>
    </Layout>
  );
}
