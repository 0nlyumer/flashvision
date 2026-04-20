import React from 'react';

export default function InvLedger() {
  return (
    <div className="animate-in fade-in duration-500 max-w-[1400px] mx-auto pb-24">
      {/* Header Section */}
      <section className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-transparent pb-4 mb-8">
        <div className="space-y-4 flex-1 w-full max-w-2xl">
          <div>
            <nav className="flex text-xs text-on-surface-variant mb-2 gap-2">
              <span>Inventory</span>
              <span>/</span>
              <span className="text-primary font-semibold">Ledger</span>
            </nav>
            <h1 className="text-4xl font-extrabold text-on-surface tracking-tight leading-tight mb-1 font-headline">Multi-Item Ledger</h1>
            <p className="text-on-surface-variant text-base font-body">Consolidated tracking for multiple raw material stocks.</p>
          </div>
          {/* Multi-Select Search/Dropdown Mockup */}
          <div className="relative w-full">
            <div className="flex flex-wrap items-center gap-2 p-2 bg-surface-container-lowest border border-outline-variant/30 rounded-xl min-h-[52px] shadow-sm">
              <div className="flex items-center gap-1.5 bg-blue-50 text-blue-700 px-3 py-1 rounded-lg text-xs font-bold border border-blue-100">
                <span>Polypropylene HD</span>
                <span className="material-symbols-outlined text-sm cursor-pointer" style={{ fontVariationSettings: "'FILL' 0" }}>close</span>
              </div>
              <div className="flex items-center gap-1.5 bg-blue-50 text-blue-700 px-3 py-1 rounded-lg text-xs font-bold border border-blue-100">
                <span>LDPE Resin</span>
                <span className="material-symbols-outlined text-sm cursor-pointer" style={{ fontVariationSettings: "'FILL' 0" }}>close</span>
              </div>
              <div className="flex items-center gap-1.5 bg-blue-50 text-blue-700 px-3 py-1 rounded-lg text-xs font-bold border border-blue-100">
                <span>PVC Compound</span>
                <span className="material-symbols-outlined text-sm cursor-pointer" style={{ fontVariationSettings: "'FILL' 0" }}>close</span>
              </div>
              <input className="flex-1 min-w-[120px] border-none focus:ring-0 text-sm bg-transparent outline-none" placeholder="Add items..." type="text" />
              <button className="px-2 text-on-surface-variant">
                <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 0" }}>keyboard_arrow_down</span>
              </button>
            </div>
          </div>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-6 py-3 bg-surface-container-highest rounded-xl font-bold text-on-surface hover:bg-surface-container-high transition-colors">
            <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 0" }}>ios_share</span>
            <span>Export Selected</span>
            <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 0" }}>expand_more</span>
          </button>
          <button className="flex items-center gap-2 px-6 py-3 bg-gradient-to-br from-primary to-primary-container rounded-xl font-bold text-white shadow-[0_10px_20px_rgba(0,66,119,0.1)] hover:opacity-90 transition-all">
            <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 0" }}>print</span>
            <span>Print Combined</span>
          </button>
        </div>
      </section>

      {/* Stats Bar (Aggregate Style) */}
      <section className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-surface-container-lowest p-6 rounded-xl border border-outline-variant/10 shadow-[0_20px_40px_rgba(0,28,56,0.04)]">
          <div className="text-on-surface-variant text-[10px] font-black uppercase tracking-widest mb-4">Aggregate Stock</div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-primary tracking-tight font-headline">3,812.40</span>
            <span className="text-sm font-medium text-on-surface-variant">MT</span>
          </div>
          <div className="mt-4 flex items-center text-xs text-green-600 font-bold">
            <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 0" }}>analytics</span>
            <span className="ml-1">Across 3 Items</span>
          </div>
        </div>
        <div className="bg-surface-container-lowest p-6 rounded-xl border border-outline-variant/10 shadow-[0_20px_40px_rgba(0,28,56,0.04)]">
          <div className="text-on-surface-variant text-[10px] font-black uppercase tracking-widest mb-4">Avg. Inventory Age</div>
          <div className="text-3xl font-black text-on-surface tracking-tight font-headline">14.2 Days</div>
          <div className="mt-4 text-xs text-on-surface-variant font-medium">Weighted Average</div>
        </div>
        <div className="bg-surface-container-lowest p-6 rounded-xl border border-outline-variant/10 shadow-[0_20px_40px_rgba(0,28,56,0.04)]">
          <div className="text-on-surface-variant text-[10px] font-black uppercase tracking-widest mb-4">Aggregate Inward (MTD)</div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-on-surface tracking-tight font-headline">1,120.00</span>
            <span className="text-sm font-medium text-on-surface-variant">MT</span>
          </div>
          <div className="mt-4 text-xs text-secondary font-bold flex items-center">
            <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 0" }}>inventory</span>
            <span className="ml-1">8 Transactions total</span>
          </div>
        </div>
        <div className="bg-surface-container-lowest p-6 rounded-xl border border-outline-variant/10 shadow-[0_20px_40px_rgba(0,28,56,0.04)]">
          <div className="text-on-surface-variant text-[10px] font-black uppercase tracking-widest mb-4">Aggregate Outward (MTD)</div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-tertiary tracking-tight font-headline">945.50</span>
            <span className="text-sm font-medium text-on-surface-variant">MT</span>
          </div>
          <div className="mt-4 text-xs text-tertiary font-bold flex items-center">
            <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 0" }}>trending_up</span>
            <span className="ml-1">+8.2% vs Combined Forecast</span>
          </div>
        </div>
      </section>

      {/* Filters Section */}
      <section className="bg-surface-container-low p-6 rounded-2xl flex flex-wrap items-center justify-between gap-6 mb-8 border border-outline-variant/5">
        <div className="flex flex-wrap items-center gap-6">
          <div className="space-y-1.5 border border-outline-variant/10 rounded-xl p-2 bg-white/50">
            <label className="block text-[10px] font-black uppercase tracking-widest text-on-surface-variant px-2">Date Range</label>
            <div className="flex items-center gap-2 bg-surface-container-lowest px-4 py-2.5 rounded-lg border border-outline-variant/20 shadow-sm cursor-pointer">
              <span className="material-symbols-outlined text-sm text-on-surface-variant" style={{ fontVariationSettings: "'FILL' 0" }}>calendar_month</span>
              <span className="text-sm font-medium">Aug 01, 2023 - Aug 31, 2023</span>
              <span className="material-symbols-outlined text-sm text-on-surface-variant" style={{ fontVariationSettings: "'FILL' 0" }}>expand_more</span>
            </div>
          </div>
          <div className="space-y-1.5 border border-outline-variant/10 rounded-xl p-2 bg-white/50">
            <label className="block text-[10px] font-black uppercase tracking-widest text-on-surface-variant px-2">Transaction Type</label>
            <select className="bg-surface-container-lowest border border-outline-variant/20 rounded-lg text-sm font-medium py-2.5 px-4 focus:ring-primary focus:border-primary shadow-sm outline-none cursor-pointer">
              <option>All Transactions</option>
              <option>Purchase</option>
              <option>Sale</option>
              <option>Production</option>
              <option>Return</option>
            </select>
          </div>
          <div className="space-y-1.5 border border-outline-variant/10 rounded-xl p-2 bg-white/50">
            <label className="block text-[10px] font-black uppercase tracking-widest text-on-surface-variant px-2">Filter by SKU</label>
            <select className="bg-surface-container-lowest border border-outline-variant/20 rounded-lg text-sm font-medium py-2.5 px-4 focus:ring-primary focus:border-primary shadow-sm outline-none cursor-pointer">
              <option>Show All SKUs</option>
              <option>POLY-772-HD</option>
              <option>LDPE-300-RES</option>
              <option>PVC-COMP-12</option>
            </select>
          </div>
        </div>
        <button className="text-primary font-bold text-sm flex items-center gap-1 hover:underline px-4">
          <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 0" }}>filter_list_off</span>
          Reset Filters
        </button>
      </section>

      {/* Ledger Table */}
      <section className="bg-surface-container-lowest rounded-2xl overflow-hidden shadow-[0_20px_40px_rgba(0,28,56,0.04)] border border-outline-variant/10">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[1000px]">
            <thead className="bg-surface-container-low text-on-surface-variant border-b border-outline-variant/10">
              <tr>
                <th className="px-6 py-4 text-[11px] font-black uppercase tracking-widest">Date</th>
                <th className="px-6 py-4 text-[11px] font-black uppercase tracking-widest">Item / SKU</th>
                <th className="px-6 py-4 text-[11px] font-black uppercase tracking-widest">Type</th>
                <th className="px-6 py-4 text-[11px] font-black uppercase tracking-widest">Ref #</th>
                <th className="px-6 py-4 text-[11px] font-black uppercase tracking-widest text-right">Qty In</th>
                <th className="px-6 py-4 text-[11px] font-black uppercase tracking-widest text-right">Qty Out</th>
                <th className="px-6 py-4 text-[11px] font-black uppercase tracking-widest text-right">Balance</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/10">
              <tr className="hover:bg-surface-container-low/50 transition-colors">
                <td className="px-6 py-5">
                  <div className="text-sm font-bold text-on-surface">Aug 28, 2023</div>
                  <div className="text-[10px] text-on-surface-variant uppercase">09:45 AM</div>
                </td>
                <td className="px-6 py-5">
                  <div className="text-sm font-bold text-on-surface">Polypropylene HD</div>
                  <div className="text-[10px] text-on-surface-variant font-mono">POLY-772-HD</div>
                </td>
                <td className="px-6 py-5">
                  <span className="px-2.5 py-1 rounded-full bg-primary-container text-on-primary-fixed text-[10px] font-black uppercase">Purchase</span>
                </td>
                <td className="px-6 py-5 text-sm font-mono text-primary font-semibold">PO-88219-X</td>
                <td className="px-6 py-5 text-right font-bold text-green-600 text-sm">250.00</td>
                <td className="px-6 py-5 text-right font-bold text-on-surface-variant text-sm">—</td>
                <td className="px-6 py-5 text-right font-black text-on-surface text-sm">1,248.50</td>
              </tr>
              <tr className="bg-surface-container-low/20 hover:bg-surface-container-low/50 transition-colors">
                <td className="px-6 py-5">
                  <div className="text-sm font-bold text-on-surface">Aug 28, 2023</div>
                  <div className="text-[10px] text-on-surface-variant uppercase">08:15 AM</div>
                </td>
                <td className="px-6 py-5">
                  <div className="text-sm font-bold text-on-surface">LDPE Resin</div>
                  <div className="text-[10px] text-on-surface-variant font-mono">LDPE-300-RES</div>
                </td>
                <td className="px-6 py-5">
                  <span className="px-2.5 py-1 rounded-full bg-surface-container-highest text-on-surface-variant text-[10px] font-black uppercase">Production</span>
                </td>
                <td className="px-6 py-5 text-sm font-mono text-primary font-semibold">WO-22100-M</td>
                <td className="px-6 py-5 text-right font-bold text-on-surface-variant text-sm">—</td>
                <td className="px-6 py-5 text-right font-bold text-tertiary text-sm">45.00</td>
                <td className="px-6 py-5 text-right font-black text-on-surface text-sm">820.25</td>
              </tr>
              <tr className="hover:bg-surface-container-low/50 transition-colors">
                <td className="px-6 py-5">
                  <div className="text-sm font-bold text-on-surface">Aug 27, 2023</div>
                  <div className="text-[10px] text-on-surface-variant uppercase">11:30 AM</div>
                </td>
                <td className="px-6 py-5">
                  <div className="text-sm font-bold text-on-surface">PVC Compound</div>
                  <div className="text-[10px] text-on-surface-variant font-mono">PVC-COMP-12</div>
                </td>
                <td className="px-6 py-5">
                  <span className="px-2.5 py-1 rounded-full bg-tertiary-fixed text-on-tertiary-fixed-variant text-[10px] font-black uppercase">Sale</span>
                </td>
                <td className="px-6 py-5 text-sm font-mono text-primary font-semibold">SO-99105-V</td>
                <td className="px-6 py-5 text-right font-bold text-on-surface-variant text-sm">—</td>
                <td className="px-6 py-5 text-right font-bold text-tertiary text-sm">210.00</td>
                <td className="px-6 py-5 text-right font-black text-on-surface text-sm">1,743.65</td>
              </tr>
              <tr className="bg-surface-container-low/20 hover:bg-surface-container-low/50 transition-colors">
                <td className="px-6 py-5">
                  <div className="text-sm font-bold text-on-surface">Aug 26, 2023</div>
                  <div className="text-[10px] text-on-surface-variant uppercase">02:30 PM</div>
                </td>
                <td className="px-6 py-5">
                  <div className="text-sm font-bold text-on-surface">Polypropylene HD</div>
                  <div className="text-[10px] text-on-surface-variant font-mono">POLY-772-HD</div>
                </td>
                <td className="px-6 py-5">
                  <span className="px-2.5 py-1 rounded-full bg-tertiary-fixed text-on-tertiary-fixed-variant text-[10px] font-black uppercase">Sale</span>
                </td>
                <td className="px-6 py-5 text-sm font-mono text-primary font-semibold">SO-99102-L</td>
                <td className="px-6 py-5 text-right font-bold text-on-surface-variant text-sm">—</td>
                <td className="px-6 py-5 text-right font-bold text-tertiary text-sm">75.50</td>
                <td className="px-6 py-5 text-right font-black text-on-surface text-sm">998.50</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="px-6 py-4 bg-surface-container-low flex justify-between items-center border-t border-outline-variant/10">
          <div className="text-xs font-medium text-on-surface-variant">Showing 1 to 4 of 312 consolidated entries</div>
          <div className="flex items-center gap-1">
            <button className="p-1 rounded hover:bg-surface-container-high transition-colors"><span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 0" }}>chevron_left</span></button>
            <button className="w-8 h-8 rounded-full bg-primary text-white text-xs font-bold">1</button>
            <button className="w-8 h-8 rounded-full hover:bg-surface-container-high text-xs font-bold">2</button>
            <button className="w-8 h-8 rounded-full hover:bg-surface-container-high text-xs font-bold">3</button>
            <button className="p-1 rounded hover:bg-surface-container-high transition-colors"><span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 0" }}>chevron_right</span></button>
          </div>
        </div>
      </section>
    </div>
  );
}
