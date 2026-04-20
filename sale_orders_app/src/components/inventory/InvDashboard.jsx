import React from 'react';

export default function InvDashboard() {
  return (
    <div className="animate-in fade-in duration-500 max-w-[1400px] mx-auto pb-24">
      {/* Header / Top Bar */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-4">
        <div>
          <h2 className="text-3xl font-headline font-extrabold tracking-tight text-on-surface">Inventory Dashboard</h2>
          <p className="text-on-surface-variant mt-1 font-body">Real-time oversight of global synthetic asset distribution.</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline" style={{ fontVariationSettings: "'FILL' 0" }}>search</span>
            <input 
              className="pl-10 pr-4 py-2 bg-surface-container-low border border-outline-variant/20 rounded-full text-sm focus:ring-2 focus:ring-primary w-64 transition-all outline-none" 
              placeholder="Search SKU or Batch..." 
              type="text"
            />
          </div>
          <button className="w-10 h-10 flex items-center justify-center rounded-full bg-surface-container hover:bg-surface-container-high transition-colors">
            <span className="material-symbols-outlined text-on-surface" style={{ fontVariationSettings: "'FILL' 0" }}>notifications</span>
          </button>
        </div>
      </header>

      {/* KPI Cards Section */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
        {/* Total Stock Value */}
        <div className="bg-surface-container-lowest p-6 rounded-xl border border-outline-variant/10 shadow-[0_20px_40px_rgba(0,28,56,0.04)] flex flex-col justify-between h-32 relative overflow-hidden">
          <div className="z-10">
            <p className="text-xs font-label font-bold text-on-surface-variant uppercase tracking-widest">Total Stock Value</p>
            <h3 className="text-2xl font-headline font-extrabold text-primary mt-1">$4.28M</h3>
          </div>
          <div className="flex items-center gap-1 text-xs font-bold text-emerald-600 z-10">
            <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 0" }}>trending_up</span>
            <span>+2.4% vs last mo</span>
          </div>
          <div className="absolute -right-4 -bottom-4 opacity-5 pointer-events-none">
            <span className="material-symbols-outlined text-8xl" style={{ fontVariationSettings: "'FILL' 0" }}>payments</span>
          </div>
        </div>

        {/* Recent Movements */}
        <div className="bg-surface-container-lowest p-6 rounded-xl border border-outline-variant/10 shadow-[0_20px_40px_rgba(0,28,56,0.04)] flex flex-col justify-between h-32 relative overflow-hidden">
          <div className="z-10">
            <p className="text-xs font-label font-bold text-on-surface-variant uppercase tracking-widest">Recent Movements</p>
            <h3 className="text-2xl font-headline font-extrabold text-primary mt-1">1,402</h3>
          </div>
          <p className="text-xs font-medium text-on-surface-variant z-10">Past 24 hours</p>
          <div className="absolute -right-4 -bottom-4 opacity-5 pointer-events-none">
            <span className="material-symbols-outlined text-8xl" style={{ fontVariationSettings: "'FILL' 0" }}>local_shipping</span>
          </div>
        </div>
      </section>

      {/* Data Visualization Grid */}
      <section className="mb-10">
        <div className="bg-surface-container-lowest p-8 rounded-[2rem] border border-outline-variant/10 shadow-[0_20px_40px_rgba(0,28,56,0.04)]">
          <div className="flex justify-between items-center mb-10">
            <h3 className="text-xl font-headline font-bold text-on-surface">High-Stock Items by Category</h3>
            <div className="flex gap-2">
              <span className="px-3 py-1 bg-surface-container-low rounded-full text-[10px] font-bold uppercase tracking-wider text-primary">Volume (MT)</span>
            </div>
          </div>
          <div className="flex items-end justify-between h-64 gap-8 px-4">
            {/* Polymers */}
            <div className="flex-1 flex flex-col items-center gap-4">
              <div className="w-full bg-primary-container rounded-t-lg relative group h-[95%] hover:-translate-y-1 transition-transform">
                <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-on-surface text-white text-[10px] py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity">1,250MT</div>
              </div>
              <span className="text-xs font-medium text-on-surface-variant">Polymers</span>
            </div>
            {/* Chemicals */}
            <div className="flex-1 flex flex-col items-center gap-4">
              <div className="w-full bg-primary rounded-t-lg relative group h-[88%] hover:-translate-y-1 transition-transform">
                <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-on-surface text-white text-[10px] py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity">1,100MT</div>
              </div>
              <span className="text-xs font-medium text-on-surface-variant">Chemicals</span>
            </div>
            {/* Fabrics */}
            <div className="flex-1 flex flex-col items-center gap-4">
              <div className="w-full bg-secondary rounded-t-lg relative group h-[82%] hover:-translate-y-1 transition-transform">
                <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-on-surface text-white text-[10px] py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity">980MT</div>
              </div>
              <span className="text-xs font-medium text-on-surface-variant">Fabrics</span>
            </div>
            {/* Resins */}
            <div className="flex-1 flex flex-col items-center gap-4">
              <div className="w-full bg-primary-container rounded-t-lg relative group h-[90%] hover:-translate-y-1 transition-transform">
                <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-on-surface text-white text-[10px] py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity">1,150MT</div>
              </div>
              <span className="text-xs font-medium text-on-surface-variant">Resins</span>
            </div>
            {/* Additive */}
            <div className="flex-1 flex flex-col items-center gap-4">
              <div className="w-full bg-secondary-container rounded-t-lg relative group h-[75%] hover:-translate-y-1 transition-transform">
                <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-on-surface text-white text-[10px] py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity">820MT</div>
              </div>
              <span className="text-xs font-medium text-on-surface-variant">Additives</span>
            </div>
          </div>
        </div>
      </section>

      {/* Completed Sale Orders Table */}
      <section className="bg-surface-container-lowest rounded-[2rem] border border-outline-variant/10 shadow-[0_20px_40px_rgba(0,28,56,0.04)] overflow-hidden">
        <div className="p-8 flex justify-between items-center bg-surface-container-low/50 border-b border-outline-variant/10">
          <div className="flex items-center gap-3">
            <div className="w-2 h-6 bg-primary rounded-full"></div>
            <h3 className="text-xl font-headline font-bold text-on-surface">Completed Sale Orders</h3>
          </div>
          <button className="text-primary font-bold text-sm flex items-center gap-1 hover:underline">
            Export All <span className="material-symbols-outlined text-base" style={{ fontVariationSettings: "'FILL' 0" }}>download</span>
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="bg-surface-container-low/30 border-b border-outline-variant/10">
                <th className="px-8 py-4 text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Item Name / SKU</th>
                <th className="px-8 py-4 text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Customer</th>
                <th className="px-8 py-4 text-[10px] font-bold uppercase tracking-widest text-on-surface-variant text-center">Completion Date</th>
                <th className="px-8 py-4 text-[10px] font-bold uppercase tracking-widest text-on-surface-variant text-right">Total Quantity</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/10">
              <tr className="hover:bg-surface-container-low/30 transition-colors group">
                <td className="px-8 py-6">
                  <div className="flex flex-col">
                    <span className="font-bold text-on-surface text-sm">Polypropylene High-Density Resin</span>
                    <span className="text-xs text-on-surface-variant">SKU: POLY-772-HD</span>
                  </div>
                </td>
                <td className="px-8 py-6">
                  <span className="text-sm font-medium text-on-surface">Nexus Manufacturing Inc.</span>
                </td>
                <td className="px-8 py-6 text-center text-sm text-on-surface-variant">Oct 24, 2023</td>
                <td className="px-8 py-6 text-right font-bold text-primary">450 MT</td>
              </tr>
              <tr className="hover:bg-surface-container-low/30 transition-colors group">
                <td className="px-8 py-6">
                  <div className="flex flex-col">
                    <span className="font-bold text-on-surface text-sm">Synthetic Aramid Fiber (Grade A)</span>
                    <span className="text-xs text-on-surface-variant">SKU: FIB-990-AR</span>
                  </div>
                </td>
                <td className="px-8 py-6">
                  <span className="text-sm font-medium text-on-surface">Aerospace Dynamics</span>
                </td>
                <td className="px-8 py-6 text-center text-sm text-on-surface-variant">Oct 22, 2023</td>
                <td className="px-8 py-6 text-right font-bold text-primary">120 Rolls</td>
              </tr>
              <tr className="hover:bg-surface-container-low/30 transition-colors group">
                <td className="px-8 py-6">
                  <div className="flex flex-col">
                    <span className="font-bold text-on-surface text-sm">Cobalt-Catalyst Liquid Solution</span>
                    <span className="text-xs text-on-surface-variant">SKU: CHEM-441-CO</span>
                  </div>
                </td>
                <td className="px-8 py-6">
                  <span className="text-sm font-medium text-on-surface">Global Bio-Labs Ltd.</span>
                </td>
                <td className="px-8 py-6 text-center text-sm text-on-surface-variant">Oct 21, 2023</td>
                <td className="px-8 py-6 text-right font-bold text-primary">85 Units</td>
              </tr>
              <tr className="hover:bg-surface-container-low/30 transition-colors group">
                <td className="px-8 py-6">
                  <div className="flex flex-col">
                    <span className="font-bold text-on-surface text-sm">Industrial Polymer Additive G-4</span>
                    <span className="text-xs text-on-surface-variant">SKU: ADD-011-G4</span>
                  </div>
                </td>
                <td className="px-8 py-6">
                  <span className="text-sm font-medium text-on-surface">Precision Synthetics</span>
                </td>
                <td className="px-8 py-6 text-center text-sm text-on-surface-variant">Oct 20, 2023</td>
                <td className="px-8 py-6 text-right font-bold text-primary">500 KG</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="p-6 text-center border-t border-outline-variant/10">
          <button className="text-primary font-headline font-bold text-sm py-2 px-6 rounded-lg hover:bg-surface-container-high transition-colors">
            View All Sales Records
          </button>
        </div>
      </section>

    </div>
  );
}
