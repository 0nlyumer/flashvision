import React from 'react';
import { useApp } from '../../context/AppContext';

// Finance dashboard primary view component
export default function FinanceDashboard() {
  const { state } = useApp();
  const currencyCode = state.adminSetup?.baseCurrency ? state.adminSetup.baseCurrency.split(' ')[0] : 'PKR';

  const salesInvoices = state.salesInvoices || [];
  const purchaseInvoices = state.purchaseInvoices || [];
  const paymentVouchers = state.paymentVouchers || [];

  // Dynamic Receivables (AR) aur Payables (AP) calculate karna
  const totalReceivables = salesInvoices.filter(inv => inv.status !== 'Paid').reduce((sum, inv) => sum + inv.grandTotal, 0);
  const totalPayables = purchaseInvoices.filter(inv => inv.status !== 'Paid').reduce((sum, inv) => sum + inv.grandTotal, 0);

  // Formatting helpers for base currency
  const formatPKR = (num) => {
    return currencyCode + ' ' + num.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
  };

  const totalRevenue = salesInvoices.reduce((sum, inv) => sum + inv.grandTotal, 0);
  const totalExpenses = purchaseInvoices.reduce((sum, inv) => sum + inv.grandTotal, 0) + 
                        paymentVouchers.reduce((sum, v) => sum + (v.amount || v.totalAmount || 0), 0);
  
  const netProfit = totalRevenue - totalExpenses;
  const netProfitPercent = totalRevenue > 0 ? ((netProfit / totalRevenue) * 100).toFixed(1) : '0';

  const cashIn = salesInvoices.filter(inv => inv.status === 'Paid').reduce((sum, inv) => sum + inv.grandTotal, 0) + 
                 paymentVouchers.filter(v => v.type === 'Receipt').reduce((sum, v) => sum + (v.amount || v.totalAmount || 0), 0);
  const cashOut = paymentVouchers.filter(v => v.type === 'Payment').reduce((sum, v) => sum + (v.amount || v.totalAmount || 0), 0);

  // Dynamic user generated transactions list
  const userSalesTrans = salesInvoices.map(inv => ({
    id: inv.id,
    date: new Date(inv.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    category: `Sales Invoiced (${inv.customerName})`,
    amount: inv.grandTotal,
    status: inv.status || 'Settled',
    type: 'income'
  }));

  const userPurchaseTrans = purchaseInvoices.map(inv => ({
    id: inv.id,
    date: new Date(inv.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    category: `Purchase Posted (${inv.vendorName})`,
    amount: inv.grandTotal,
    status: 'Posted',
    type: 'expense'
  }));

  const userVouchersTrans = paymentVouchers.map(v => ({
    id: v.voucherNo || v.id,
    date: new Date(v.date || Date.now()).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    category: `${v.type || 'Payment'} Voucher (${v.paidTo || v.receivedFrom || 'Cash/Bank'})`,
    amount: v.amount || v.totalAmount || 0,
    status: 'Posted',
    type: (v.type === 'Receipt' || v.type === 'receipt') ? 'income' : 'expense'
  }));

  // Sab ko merge kar ke sorted display banana
  const allTransactions = [...userSalesTrans, ...userPurchaseTrans, ...userVouchersTrans];

  return (
    <div className="flex-1 w-full max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col gap-8">
      {/* Page header section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h2 className="font-display text-4xl font-extrabold text-on-surface tracking-tight">Finance Overview</h2>
          <p className="font-body text-sm text-on-surface-variant mt-1">Real-time consolidated financials for Q3</p>
        </div>
        <div className="flex gap-2">
          <button className="flex items-center gap-2 px-4 py-2 bg-surface-container-low text-on-surface-variant font-label text-sm rounded-lg hover:bg-surface-container transition-colors">
            <span className="material-symbols-outlined text-[18px]">calendar_month</span>
            This Month
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-primary text-on-primary font-label text-sm font-semibold rounded-lg shadow-[0_8px_16px_rgba(0,66,119,0.15)] hover:opacity-90 transition-opacity bg-gradient-to-br from-primary to-primary-container">
            <span className="material-symbols-outlined text-[18px]">download</span>
            Export
          </button>
        </div>
      </div>

      {/* 1. TOP KPI CARDS (Bento Grid Style) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Revenue Card */}
        <div className="bg-surface-container-lowest rounded-xl p-6 shadow-[0_20px_40px_rgba(0,28,56,0.03)] relative overflow-hidden group">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-primary-fixed rounded-lg">
              <span className="material-symbols-outlined text-primary">monitoring</span>
            </div>
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-positive-light text-emerald-positive">
              <span className="material-symbols-outlined text-[14px]">trending_up</span>
              +100%
            </span>
          </div>
          <h3 className="font-label text-xs text-on-surface-variant uppercase tracking-wider font-semibold mb-1">Total Revenue</h3>
          <div className="font-display text-2xl font-extrabold text-on-surface">{formatPKR(totalRevenue)}</div>
          
          <div className="absolute bottom-0 left-0 w-full h-12 opacity-40 group-hover:opacity-100 transition-opacity">
            <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 100 30">
              <path d="M0,30 L0,20 Q10,15 20,22 T40,18 T60,10 T80,5 L100,0 L100,30 Z" fill="#d1fae5"></path>
              <path d="M0,20 Q10,15 20,22 T40,18 T60,10 T80,5 L100,0" fill="none" stroke="#059669" strokeWidth="2"></path>
            </svg>
          </div>
        </div>

        {/* Operating Expenses Card */}
        <div className="bg-surface-container-lowest rounded-xl p-6 shadow-[0_20px_40px_rgba(0,28,56,0.03)] flex flex-col justify-between">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-secondary-fixed rounded-lg">
              <span className="material-symbols-outlined text-secondary">receipt_long</span>
            </div>
          </div>
          <div>
            <h3 className="font-label text-xs text-on-surface-variant uppercase tracking-wider font-semibold mb-1">Operating Expenses</h3>
            <div className="font-display text-2xl font-extrabold text-on-surface">{formatPKR(totalExpenses)}</div>
            <div className="mt-4 flex flex-col gap-1.5">
              <div className="flex justify-between font-label text-[10px] text-on-surface-variant">
                <span>Budget Utilization</span>
                <span className="font-semibold">{totalRevenue > 0 ? Math.min(100, Math.round(totalExpenses / totalRevenue * 100)) : 0}%</span>
              </div>
              <div className="w-full h-1.5 bg-surface-container-high rounded-full overflow-hidden">
                <div className="h-full bg-secondary rounded-full" style={{ width: `${totalRevenue > 0 ? Math.min(100, Math.round(totalExpenses / totalRevenue * 100)) : 0}%` }}></div>
              </div>
            </div>
          </div>
        </div>

        {/* Net Profit Card */}
        <div className="bg-surface-container-lowest rounded-xl p-6 shadow-[0_20px_40px_rgba(0,28,56,0.03)] flex flex-col justify-between">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-tertiary-fixed rounded-lg">
              <span className="material-symbols-outlined text-tertiary">savings</span>
            </div>
          </div>
          <div>
            <h3 className="font-label text-xs text-on-surface-variant uppercase tracking-wider font-semibold mb-1">Net Profit Margin</h3>
            <div className="font-display text-2xl font-extrabold text-on-surface">{formatPKR(netProfit)}</div>
            <p className="font-body text-[11px] text-on-surface-variant mt-2 italic">Net = Rev - Exp ({netProfitPercent}% Margin)</p>
          </div>
        </div>

        {/* Cash Flow Index */}
        <div className="bg-surface-container-lowest rounded-xl p-6 shadow-[0_20px_40px_rgba(0,28,56,0.03)] flex flex-col justify-between">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-surface-container-high rounded-lg">
              <span className="material-symbols-outlined text-on-surface">account_balance</span>
            </div>
          </div>
          <div>
            <h3 className="font-label text-xs text-on-surface-variant uppercase tracking-wider font-semibold mb-2">Cash Flow Index</h3>
            <div className="flex gap-4">
              <div className="flex-1 bg-surface-container-low rounded-lg p-3 border border-outline-variant/10">
                <div className="flex items-center gap-1 text-[10px] text-on-surface-variant uppercase font-bold mb-1">
                  <span className="material-symbols-outlined text-[14px] text-emerald-positive">south_east</span> In
                </div>
                <div className="font-display text-sm font-extrabold text-on-surface">{formatPKR(cashIn)}</div>
              </div>
              <div className="flex-1 bg-surface-container-low rounded-lg p-3 border border-outline-variant/10">
                <div className="flex items-center gap-1 text-[10px] text-on-surface-variant uppercase font-bold mb-1">
                  <span className="material-symbols-outlined text-[14px] text-rose-negative">north_east</span> Out
                </div>
                <div className="font-display text-sm font-extrabold text-on-surface">{formatPKR(cashOut)}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. ANALYTICS GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Chart Area */}
        <div className="lg:col-span-2 bg-surface-container-lowest rounded-xl p-6 shadow-[0_20px_40px_rgba(0,28,56,0.03)] flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="font-headline text-lg font-bold text-on-surface">Revenue vs Expenses</h3>
              <p className="font-body text-xs text-on-surface-variant">Trailing 6 Months ({currencyCode} Millions)</p>
            </div>
            <div className="flex bg-surface-container-low p-1 rounded-lg border border-outline-variant/20">
              <button className="px-3 py-1 text-xs font-semibold rounded-md text-on-surface-variant hover:bg-surface-container transition-colors">W</button>
              <button className="px-3 py-1 text-xs font-semibold rounded-md text-on-surface-variant hover:bg-surface-container transition-colors">M</button>
              <button className="px-3 py-1 text-xs font-semibold rounded-md bg-surface-container-lowest shadow-sm text-primary">QTD</button>
            </div>
          </div>
          {/* SVG Line Chart Widget */}
          <div className="flex-1 w-full min-h-[250px] relative">
            <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 500 200">
              <defs>
                <linearGradient id="rev-grad" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stopColor="#004277" stopOpacity="0.2"></stop>
                  <stop offset="100%" stopColor="#004277" stopOpacity="0"></stop>
                </linearGradient>
              </defs>
              {/* Grid Lines */}
              <line className="chart-grid" stroke="#e7e8ee" strokeDasharray="4" x1="0" x2="500" y1="50" y2="50"></line>
              <line className="chart-grid" stroke="#e7e8ee" strokeDasharray="4" x1="0" x2="500" y1="100" y2="100"></line>
              <line className="chart-grid" stroke="#e7e8ee" strokeDasharray="4" x1="0" x2="500" y1="150" y2="150"></line>
              <line stroke="#e1e2e8" strokeWidth="1" x1="0" x2="500" y1="200" y2="200"></line>
              
              {/* Chart line points */}
              <path fill="url(#rev-grad)" d="M0,150 Q50,130 100,140 T200,90 T300,110 T400,60 T500,40 L500,200 L0,200 Z"></path>
              <path fill="none" stroke="#004277" strokeWidth="3" d="M0,150 Q50,130 100,140 T200,90 T300,110 T400,60 T500,40"></path>
              <path fill="none" stroke="#456080" strokeWidth="3" d="M0,180 Q50,170 100,175 T200,150 T300,160 T400,130 T500,120"></path>
            </svg>
            <div className="absolute left-0 top-0 h-full flex flex-col justify-between text-[10px] text-on-surface-variant font-label py-2 -ml-6">
              <span>50M</span>
              <span>35M</span>
              <span>20M</span>
              <span>0M</span>
            </div>
            <div className="absolute bottom-0 left-0 w-full flex justify-between text-[10px] text-on-surface-variant font-label -mb-6 px-2">
              <span>Apr</span>
              <span>May</span>
              <span>Jun</span>
              <span>Jul</span>
              <span>Aug</span>
              <span>Sep</span>
            </div>
          </div>
          <div className="flex gap-6 mt-8 justify-center">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-primary"></div>
              <span className="text-xs font-label text-on-surface">Revenue</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-secondary"></div>
              <span className="text-xs font-label text-on-surface">Expenses</span>
            </div>
          </div>
        </div>

        {/* Market Monitor Widget */}
        <div className="flex flex-col gap-6">
          <div className="bg-surface-container-lowest rounded-xl p-6 shadow-[0_20px_40px_rgba(0,28,56,0.03)] h-full">
            <h3 className="font-headline text-lg font-bold text-on-surface mb-4">Market Monitor</h3>
            <div className="flex flex-col gap-4">
              {/* Gold Spot */}
              <div className="bg-surface-container-low rounded-lg p-4 border border-outline-variant/10 flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-tertiary-fixed flex items-center justify-center">
                    <span className="font-display font-bold text-on-tertiary-fixed text-sm">Au</span>
                  </div>
                  <div>
                    <div className="font-label font-bold text-on-surface text-sm">XAU/USD</div>
                    <div className="font-body text-[10px] text-on-surface-variant">Gold Spot</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-display font-extrabold text-on-surface text-sm">1,924.50</div>
                  <div className="font-label text-[10px] text-emerald-positive font-bold flex items-center justify-end gap-0.5">
                    <span className="material-symbols-outlined text-[12px]">arrow_drop_up</span> +0.45%
                  </div>
                </div>
              </div>
              {/* US Dollar Index */}
              <div className="bg-surface-container-low rounded-lg p-4 border border-outline-variant/10 flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-secondary-fixed flex items-center justify-center">
                    <span className="material-symbols-outlined text-on-secondary-fixed">attach_money</span>
                  </div>
                  <div>
                    <div className="font-label font-bold text-on-surface text-sm">DXY</div>
                    <div className="font-body text-[10px] text-on-surface-variant">US Dollar Index</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-display font-extrabold text-on-surface text-sm">104.20</div>
                  <div className="font-label text-[10px] text-rose-negative font-bold flex items-center justify-end gap-0.5">
                    <span className="material-symbols-outlined text-[12px]">arrow_drop_down</span> -0.12%
                  </div>
                </div>
              </div>
              {/* KIBOR Rate */}
              <div className="bg-surface-container-low rounded-lg p-4 border border-outline-variant/10 flex justify-between items-center mt-2">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-surface-container-highest flex items-center justify-center">
                    <span className="material-symbols-outlined text-on-surface">account_balance</span>
                  </div>
                  <div>
                    <div className="font-label font-bold text-on-surface text-sm">KIBOR</div>
                    <div className="font-body text-[10px] text-on-surface-variant">6-Month Rate</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-display font-extrabold text-on-surface text-sm">22.45%</div>
                  <div className="font-label text-[10px] text-on-surface-variant font-bold flex items-center justify-end gap-0.5">
                    <span className="material-symbols-outlined text-[12px]">horizontal_rule</span> 0.00%
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. DATA TABLES & TRACKERS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* AR/AP Tracker */}
        <div className="lg:col-span-1 bg-surface-container-lowest rounded-xl p-6 shadow-[0_20px_40px_rgba(0,28,56,0.03)] flex flex-col">
          <h3 className="font-headline text-lg font-bold text-on-surface mb-6">AR / AP Status</h3>
          <div className="flex flex-col gap-6 flex-1 justify-center">
            {/* Receivables (AR) Dynamic Conic Progress Bar */}
            <div className="flex items-center gap-4">
              <div className="relative w-16 h-16 rounded-full flex items-center justify-center" style={{ background: 'conic-gradient(#059669 82%, #e1e2e8 0)' }}>
                <div className="absolute w-12 h-12 bg-surface-container-lowest rounded-full flex items-center justify-center">
                  <span className="font-label text-[10px] font-bold text-on-surface">82%</span>
                </div>
              </div>
              <div>
                <div className="font-label text-xs text-on-surface-variant uppercase tracking-wider font-semibold">Receivables (AR)</div>
                <div className="font-display font-extrabold text-on-surface text-lg">{formatPKR(totalReceivables)}</div>
                <div className="text-[10px] text-emerald-positive">Dynamic Sum</div>
              </div>
            </div>
            <div className="w-full h-px bg-outline-variant/20"></div>
            {/* Payables (AP) Dynamic Conic Progress Bar */}
            <div className="flex items-center gap-4">
              <div className="relative w-16 h-16 rounded-full flex items-center justify-center" style={{ background: 'conic-gradient(#e11d48 45%, #e1e2e8 0)' }}>
                <div className="absolute w-12 h-12 bg-surface-container-lowest rounded-full flex items-center justify-center">
                  <span className="font-label text-[10px] font-bold text-on-surface">45%</span>
                </div>
              </div>
              <div>
                <div className="font-label text-xs text-on-surface-variant uppercase tracking-wider font-semibold">Payables (AP)</div>
                <div className="font-display font-extrabold text-on-surface text-lg">{formatPKR(totalPayables)}</div>
                <div className="text-[10px] text-rose-negative">Dynamic Sum</div>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Transactions Table */}
        <div className="lg:col-span-2 bg-surface-container-lowest rounded-xl p-0 shadow-[0_20px_40px_rgba(0,28,56,0.03)] overflow-hidden flex flex-col">
          <div className="p-6 pb-4 flex justify-between items-center">
            <h3 className="font-headline text-lg font-bold text-on-surface">Recent Transactions</h3>
            <button className="text-primary font-label text-xs font-bold hover:underline">View All</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-surface-container-low border-y border-outline-variant/20">
                  <th className="font-label text-[10px] uppercase text-on-surface-variant font-semibold px-6 py-3">ID / Date</th>
                  <th className="font-label text-[10px] uppercase text-on-surface-variant font-semibold px-6 py-3 px-6 py-3">Category</th>
                  <th className="font-label text-[10px] uppercase text-on-surface-variant font-semibold px-6 py-3 text-right">Amount ({currencyCode})</th>
                  <th className="font-label text-[10px] uppercase text-on-surface-variant font-semibold px-6 py-3 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="font-body text-sm divide-y divide-outline-variant/10">
                {allTransactions.slice(0, 7).map((trx, idx) => (
                  <tr key={`${trx.id}_${idx}`} className="hover:bg-surface-container-low/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-semibold text-on-surface">{trx.id}</div>
                      <div className="text-[10px] text-on-surface-variant mt-0.5">{trx.date}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-[16px] text-secondary">
                          {trx.type === 'income' ? 'payments' : 'inventory_2'}
                        </span>
                        <span className="text-on-surface font-medium">{trx.category}</span>
                      </div>
                    </td>
                    <td className={`px-6 py-4 text-right font-display font-bold ${trx.type === 'income' ? 'text-emerald-positive' : 'text-on-surface'}`}>
                      {trx.amount.toLocaleString('en-US')}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className={`inline-flex items-center px-2 py-1 rounded-md text-[10px] font-bold ${
                        trx.status === 'Settled' || trx.status === 'Posted' ? 'bg-emerald-positive-light text-emerald-positive' :
                        trx.status === 'Pending' ? 'bg-surface-container-high text-on-surface-variant' :
                        'bg-rose-negative-light text-rose-negative'
                      }`}>
                        {trx.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
