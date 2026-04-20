import React from 'react';

export default function DelDashboard() {
  return (
    <div className="space-y-10 w-full animate-in fade-in duration-500 pb-24">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-on-surface font-headline">Delivery Dashboard</h1>
          <p className="text-on-surface-variant mt-1 text-sm">Managing 1,284 total dispatches in the current fiscal month.</p>
        </div>
        <button className="flex items-center gap-2 px-6 py-3 bg-gradient-to-br from-primary to-primary-container text-on-primary rounded-xl font-semibold shadow-lg shadow-primary/20 hover:shadow-primary/40 active:scale-95 transition-all">
          <span className="material-symbols-outlined text-xl" style={{ fontVariationSettings: "'FILL' 0" }}>add_circle</span>
          <span>Create New Challan</span>
        </button>
      </div>

      {/* KPI Section: High Level Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Total Dispatches */}
        <div className="bg-surface-container-lowest p-6 rounded-3xl xl:rounded-full asymmetric-shadow border border-white/50 group hover:-translate-y-1 hover:shadow-[0_25px_50px_rgba(0,28,56,0.08)] transition-all">
          <div className="flex justify-between items-start mb-4 px-2 xl:px-4 pt-2 xl:pt-4">
            <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-primary">
              <span className="material-symbols-outlined text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>package_2</span>
            </div>
            <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg">+12.5%</span>
          </div>
          <div className="px-2 xl:px-4 pb-2 xl:pb-4 text-center xl:text-left">
            <p className="text-on-surface-variant text-sm font-medium">Total Dispatches</p>
            <h3 className="text-4xl font-extrabold text-on-surface mt-1">1,284</h3>
          </div>
        </div>

        {/* Pending Challans */}
        <div className="bg-surface-container-lowest p-6 rounded-3xl xl:rounded-full asymmetric-shadow border border-white/50 group hover:-translate-y-1 hover:shadow-[0_25px_50px_rgba(0,28,56,0.08)] transition-all">
          <div className="flex justify-between items-start mb-4 px-2 xl:px-4 pt-2 xl:pt-4">
            <div className="w-12 h-12 rounded-xl bg-amber-50 flex items-center justify-center text-tertiary">
              <span className="material-symbols-outlined text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>pending_actions</span>
            </div>
            <span className="text-xs font-bold text-tertiary bg-tertiary-fixed px-2 py-1 rounded-lg">Critical</span>
          </div>
          <div className="px-2 xl:px-4 pb-2 xl:pb-4 text-center xl:text-left">
            <p className="text-on-surface-variant text-sm font-medium">Pending Challans</p>
            <h3 className="text-4xl font-extrabold text-on-surface mt-1">42</h3>
          </div>
        </div>

        {/* Completed Orders */}
        <div className="bg-surface-container-lowest p-6 rounded-3xl xl:rounded-full asymmetric-shadow border border-white/50 group hover:-translate-y-1 hover:shadow-[0_25px_50px_rgba(0,28,56,0.08)] transition-all">
          <div className="flex justify-between items-start mb-4 px-2 xl:px-4 pt-2 xl:pt-4">
            <div className="w-12 h-12 rounded-xl bg-slate-50 flex items-center justify-center text-slate-700">
              <span className="material-symbols-outlined text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>task_alt</span>
            </div>
            <span className="text-xs font-bold text-slate-500 bg-slate-100 px-2 py-1 rounded-lg">Target: 95%</span>
          </div>
          <div className="px-2 xl:px-4 pb-2 xl:pb-4 text-center xl:text-left">
            <p className="text-on-surface-variant text-sm font-medium">Completed Orders</p>
            <h3 className="text-4xl font-extrabold text-on-surface mt-1">892</h3>
          </div>
        </div>
      </div>

      {/* Main Data Grid */}
      <div className="grid grid-cols-12 gap-8">
        {/* Chart Section: Left Column (8 cols) */}
        <div className="col-span-12 lg:col-span-8 space-y-8">
          {/* Bar Chart Card */}
          <div className="bg-surface-container-lowest p-8 rounded-[2rem] asymmetric-shadow border border-white/50">
            <div className="flex justify-between items-center mb-10">
              <div>
                <h4 className="text-lg font-bold text-on-surface font-headline">Completed Sale Orders</h4>
                <p className="text-on-surface-variant text-xs">Last 30 Days trend analysis</p>
              </div>
              <div className="flex gap-4">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-primary"></span>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant">Domestic</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-primary-fixed"></span>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant">Export</span>
                </div>
              </div>
            </div>

            {/* Visual Representation of Bar Chart */}
            <div className="flex items-end justify-between h-48 gap-2 relative">
              {/* Chart Grid Lines */}
              <div className="absolute inset-0 flex flex-col justify-between border-b border-slate-100">
                <div className="w-full border-t border-slate-50"></div>
                <div className="w-full border-t border-slate-50"></div>
                <div className="w-full border-t border-slate-50"></div>
                <div className="w-full border-t border-slate-50"></div>
              </div>
              
              {/* Individual Bars pt */}
              <div className="flex-1 flex flex-col justify-end gap-1 group relative h-full">
                <div className="w-full bg-primary-fixed rounded-t-sm h-[30%]"></div>
                <div className="w-full bg-primary rounded-t-sm h-[40%]"></div>
                <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[10px] text-slate-400 font-bold">WK 1</div>
              </div>
              <div className="flex-1 flex flex-col justify-end gap-1 group relative h-full">
                <div className="w-full bg-primary-fixed rounded-t-sm h-[20%]"></div>
                <div className="w-full bg-primary rounded-t-sm h-[55%]"></div>
                <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[10px] text-slate-400 font-bold">WK 2</div>
              </div>
              <div className="flex-1 flex flex-col justify-end gap-1 group relative h-full">
                <div className="w-full bg-primary-fixed rounded-t-sm h-[45%]"></div>
                <div className="w-full bg-primary rounded-t-sm h-[35%]"></div>
                <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[10px] text-slate-400 font-bold">WK 3</div>
              </div>
              <div className="flex-1 flex flex-col justify-end gap-1 group relative h-full">
                <div className="w-full bg-primary-fixed rounded-t-sm h-[25%]"></div>
                <div className="w-full bg-primary rounded-t-sm h-[65%]"></div>
                <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[10px] text-slate-400 font-bold">WK 4</div>
              </div>
            </div>

            {/* Stats Footer */}
            <div className="grid grid-cols-3 gap-4 mt-12 pt-8 border-t border-surface-container-low">
              <div>
                <p className="text-[10px] text-on-surface-variant font-bold uppercase tracking-wider mb-1">Avg Time</p>
                <p className="text-xl font-bold text-on-surface">4.2 Days</p>
              </div>
              <div>
                <p className="text-[10px] text-on-surface-variant font-bold uppercase tracking-wider mb-1">On-Time %</p>
                <p className="text-xl font-bold text-on-surface">98.4%</p>
              </div>
              <div>
                <p className="text-[10px] text-on-surface-variant font-bold uppercase tracking-wider mb-1">Active Carriers</p>
                <p className="text-xl font-bold text-on-surface">18 Units</p>
              </div>
            </div>
          </div>

          {/* Finished Items List */}
          <div className="bg-surface-container-lowest rounded-[2rem] asymmetric-shadow border border-white/50 overflow-hidden">
            <div className="p-6 border-b border-surface-container-low flex justify-between items-center bg-surface-container/20">
              <h4 className="text-lg font-bold text-on-surface font-headline">Finished Items <span className="-mt-1 ml-1 text-xs text-on-surface-variant font-body">(Ready for Delivery)</span></h4>
              <button className="text-primary text-sm font-bold hover:underline">View All</button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-surface-container-low/50 text-[10px] uppercase tracking-widest text-slate-500 font-bold">
                  <tr>
                    <th className="px-6 py-4">Item Name</th>
                    <th className="px-6 py-4">Sale Order ID</th>
                    <th className="px-6 py-4">Quantity</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-surface-container-low text-sm">
                  <tr className="hover:bg-surface/50 transition-colors">
                    <td className="px-6 py-5 font-semibold text-on-surface">Industrial Centrifuge X1</td>
                    <td className="px-6 py-5 font-mono text-slate-500">SO-2024-8842</td>
                    <td className="px-6 py-5">14 Units</td>
                    <td className="px-6 py-5">
                      <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md bg-emerald-50 text-emerald-700 text-[10px] font-bold">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span> READY
                      </span>
                    </td>
                    <td className="px-6 py-5 text-right">
                      <button className="text-slate-400 hover:text-primary transition-colors p-1">
                        <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 0" }}>more_vert</span>
                      </button>
                    </td>
                  </tr>
                  <tr className="hover:bg-surface/50 transition-colors">
                    <td className="px-6 py-5 font-semibold text-on-surface">Pneumatic Valves-H9</td>
                    <td className="px-6 py-5 font-mono text-slate-500">SO-2024-9105</td>
                    <td className="px-6 py-5">120 Units</td>
                    <td className="px-6 py-5">
                      <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md bg-emerald-50 text-emerald-700 text-[10px] font-bold">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span> READY
                      </span>
                    </td>
                    <td className="px-6 py-5 text-right">
                      <button className="text-slate-400 hover:text-primary transition-colors p-1">
                        <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 0" }}>more_vert</span>
                      </button>
                    </td>
                  </tr>
                  <tr className="hover:bg-surface/50 transition-colors">
                    <td className="px-6 py-5 font-semibold text-on-surface">Synthetic Lubricant Core</td>
                    <td className="px-6 py-5 font-mono text-slate-500">SO-2024-9118</td>
                    <td className="px-6 py-5">500 Ltr</td>
                    <td className="px-6 py-5">
                      <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md bg-amber-50 text-amber-700 text-[10px] font-bold">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-600"></span> INSPECTION
                      </span>
                    </td>
                    <td className="px-6 py-5 text-right">
                      <button className="text-slate-400 hover:text-primary transition-colors p-1">
                        <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 0" }}>more_vert</span>
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Progress Flow Section: Right Column (4 cols) */}
        <div className="col-span-12 lg:col-span-4 space-y-8">
          <div class="bg-surface-container-lowest p-6 xl:p-8 rounded-[2rem] asymmetric-shadow border border-white/50 h-full">
            <div className="flex justify-between items-center mb-8">
              <h4 className="text-lg font-bold text-on-surface font-headline">Active Production Flow</h4>
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.5)]"></span>
            </div>

            <div className="space-y-8">
              {/* Production Item 1 */}
              <div className="space-y-3 relative group">
                <div className="flex justify-between items-end">
                  <div>
                    <p className="text-xs font-bold text-slate-400 uppercase">SO-2024-8842</p>
                    <p className="text-sm font-semibold text-on-surface mt-0.5 group-hover:text-primary transition-colors">Industrial Centrifuge X1</p>
                  </div>
                  <p className="text-xs font-black text-primary">70%</p>
                </div>
                <div className="w-full h-2 bg-surface-container-low rounded-full overflow-hidden border border-outline-variant/10">
                  <div className="h-full bg-primary rounded-full transition-all duration-1000 ease-in-out" style={{ width: '70%' }}></div>
                </div>
                <p className="text-[10px] font-bold text-on-surface-variant flex items-center gap-1.5 opacity-80 group-hover:opacity-100 transition-opacity">
                  <span className="material-symbols-outlined text-[12px]" style={{ fontVariationSettings: "'FILL' 0" }}>inventory</span>
                  14/20 Items Ready
                </p>
              </div>

              {/* Production Item 2 */}
              <div className="space-y-3 relative group">
                <div className="flex justify-between items-end">
                  <div>
                    <p className="text-xs font-bold text-slate-400 uppercase">SO-2024-9105</p>
                    <p className="text-sm font-semibold text-on-surface mt-0.5 group-hover:text-primary transition-colors">Pneumatic Valves-H9</p>
                  </div>
                  <p className="text-xs font-black text-primary">45%</p>
                </div>
                <div className="w-full h-2 bg-surface-container-low rounded-full overflow-hidden border border-outline-variant/10">
                  <div className="h-full bg-primary transition-all duration-1000 ease-in-out opacity-80 rounded-full" style={{ width: '45%' }}></div>
                </div>
                <p className="text-[10px] font-bold text-on-surface-variant flex items-center gap-1.5 opacity-80 group-hover:opacity-100 transition-opacity">
                  <span className="material-symbols-outlined text-[12px]" style={{ fontVariationSettings: "'FILL' 0" }}>inventory</span>
                  54/120 Items Ready
                </p>
              </div>

              {/* Vertical Pulse Tracker */}
              <div className="mt-10 pt-8 border-t border-surface-container-low">
                <p className="text-xs font-bold text-on-surface-variant uppercase tracking-widest mb-6 border-l-2 border-primary pl-2">Dispatch Pipeline</p>
                <div className="relative pl-8 space-y-8">
                  {/* Thick Progress Line */}
                  <div className="absolute left-[3px] top-2 bottom-2 w-1.5 bg-surface-container-high rounded-full overflow-hidden">
                    <div className="absolute top-0 w-full bg-gradient-to-b from-primary to-primary-container rounded-full h-[60%]"></div>
                  </div>
                  
                  {/* Steps */}
                  <div className="relative group hover:translate-x-1 transition-transform">
                    <div className="absolute -left-[33px] w-6 h-6 rounded-full bg-primary flex items-center justify-center text-[10px] text-white font-bold ring-4 ring-surface-container-lowest shadow-sm z-10 scale-110">1</div>
                    <p className="text-xs font-bold text-on-surface">Order Aggregation</p>
                    <p className="text-[10px] text-on-surface-variant mt-0.5 bg-surface-container-low inline-block px-1.5 py-0.5 rounded font-mono">Completed at 09:15 AM</p>
                  </div>
                  
                  <div className="relative group hover:translate-x-1 transition-transform">
                    <div className="absolute -left-[33px] w-6 h-6 rounded-full bg-primary flex items-center justify-center text-[10px] text-white font-bold ring-4 ring-surface-container-lowest shadow-sm z-10 scale-110">2</div>
                    <p className="text-xs font-bold text-on-surface">Quality Clearance</p>
                    <p className="text-[10px] text-on-surface-variant mt-0.5 font-mono">Batch #482 passed 10:45 AM</p>
                  </div>
                  
                  <div className="relative group hover:translate-x-1 transition-transform opacity-70">
                    <div className="absolute -left-[33px] w-6 h-6 rounded-full bg-surface-container-high flex items-center justify-center text-[10px] text-on-surface-variant font-bold ring-4 ring-surface-container-lowest shadow-sm z-10">3</div>
                    <p className="text-xs font-bold text-slate-500">Loading & Sealing</p>
                    <p className="text-[10px] text-slate-400 mt-0.5 font-mono">Estimated start: 02:00 PM</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
