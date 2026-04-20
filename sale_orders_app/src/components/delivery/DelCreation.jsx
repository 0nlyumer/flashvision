import React from 'react';

export default function DelCreation({ onGenerateChallan }) {
  return (
    <div className="flex-1 animate-in fade-in duration-500 pb-36 relative">
      <div className="max-w-6xl mx-auto w-full">
        {/* Editorial Header */}
        <div className="mb-10">
          <span className="text-primary font-bold tracking-widest text-[10px] uppercase mb-2 block">Dispatch Management</span>
          <h1 className="font-headline text-4xl font-extrabold text-on-surface tracking-tight leading-none mb-4">Select Goods for Dispatch</h1>
          <p className="text-on-surface-variant max-w-xl text-sm font-body">Review and consolidate ready-to-ship inventory. Select items below to generate your delivery challan and initiate the dispatch workflow.</p>
        </div>

        <div className="mb-8 relative max-w-2xl">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-outline" style={{ fontVariationSettings: "'FILL' 0" }}>person_search</span>
          <input className="w-full pl-12 pr-6 py-4 bg-surface-container-lowest border border-outline-variant/30 rounded-xl shadow-sm focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm font-medium text-on-surface placeholder:text-on-surface-variant/50 outline-none" placeholder="Search by Customer Name..." type="text" />
        </div>

        {/* Tabs & Controls */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
          <div className="flex bg-surface-container-low p-1.5 rounded-full shadow-inner flex-1 max-w-sm w-full">
            <button className="flex-1 py-2.5 rounded-full bg-white text-primary font-bold shadow-sm text-sm transition-all focus:outline-none">Order-wise</button>
            <button className="flex-1 py-2.5 rounded-full text-on-surface-variant font-semibold text-sm hover:bg-surface-container transition-all focus:outline-none">Item-wise</button>
          </div>
          <div className="flex gap-3">
            <button className="flex items-center gap-2 px-4 py-2 bg-surface-container-lowest border border-outline-variant/30 rounded-lg text-sm font-semibold text-on-surface-variant hover:bg-surface-container-low transition-colors outline-none focus:ring-2 focus:ring-primary/20">
              <span className="material-symbols-outlined text-lg" style={{ fontVariationSettings: "'FILL' 0" }}>filter_list</span>
              Filter
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-surface-container-lowest border border-outline-variant/30 rounded-lg text-sm font-semibold text-on-surface-variant hover:bg-surface-container-low transition-colors outline-none focus:ring-2 focus:ring-primary/20">
              <span className="material-symbols-outlined text-lg" style={{ fontVariationSettings: "'FILL' 0" }}>download</span>
              Export
            </button>
          </div>
        </div>

        {/* Table Container */}
        <div className="bg-surface-container-lowest rounded-2xl shadow-[0_20px_40px_rgba(0,28,56,0.04)] overflow-hidden border border-outline-variant/10 cursor-default">
          <div className="overflow-x-auto w-full">
            <table className="w-full text-left min-w-[700px]">
              <thead>
                <tr className="bg-surface-container-low/50">
                  <th className="py-5 px-6 w-12 text-center">
                    <input className="rounded text-primary focus:ring-primary/20 border-outline-variant/50 w-4 h-4 cursor-pointer" type="checkbox" />
                  </th>
                  <th className="py-5 px-4 font-headline text-xs font-bold text-on-surface-variant uppercase tracking-wider">Order #</th>
                  <th className="py-5 px-4 font-headline text-xs font-bold text-on-surface-variant uppercase tracking-wider">Customer Entity</th>
                  <th className="py-5 px-4 font-headline text-xs font-bold text-on-surface-variant uppercase tracking-wider text-center">Ready Date</th>
                  <th className="py-5 px-4 font-headline text-xs font-bold text-on-surface-variant uppercase tracking-wider text-center">Total Items</th>
                  <th className="py-5 px-4 font-headline text-xs font-bold text-on-surface-variant uppercase tracking-wider text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-container-low">
                {/* Row 1 */}
                <tr className="group hover:bg-surface-container-low transition-colors">
                  <td className="py-5 px-6 text-center">
                    <input defaultChecked className="rounded text-primary focus:ring-primary border-outline-variant w-4 h-4 cursor-pointer" type="checkbox" />
                  </td>
                  <td className="py-5 px-4 font-bold text-primary text-sm whitespace-nowrap">SO-2024-8842</td>
                  <td className="py-5 px-4">
                    <div className="flex flex-col">
                      <span className="text-sm font-bold text-on-surface">Bio-Tech Industries Ltd.</span>
                      <span className="text-xs text-on-surface-variant">Mumbai Regional Hub</span>
                    </div>
                  </td>
                  <td className="py-5 px-4 text-center text-sm font-medium whitespace-nowrap">Oct 24, 2023</td>
                  <td className="py-5 px-4 text-center">
                    <span className="bg-primary-fixed text-on-primary-fixed px-2.5 py-1 rounded-full text-xs font-bold whitespace-nowrap">14 Items</span>
                  </td>
                  <td className="py-5 px-4 text-right">
                    <span className="text-[10px] font-bold uppercase bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded whitespace-nowrap">Ready</span>
                  </td>
                </tr>

                {/* Row 2 */}
                <tr className="group hover:bg-surface-container-low transition-colors">
                  <td className="py-5 px-6 text-center">
                    <input className="rounded text-primary focus:ring-primary border-outline-variant w-4 h-4 cursor-pointer" type="checkbox" />
                  </td>
                  <td className="py-5 px-4 font-bold text-primary text-sm whitespace-nowrap">SO-2024-8845</td>
                  <td className="py-5 px-4">
                    <div className="flex flex-col">
                      <span className="text-sm font-bold text-on-surface">Global Pharma Solutions</span>
                      <span className="text-xs text-on-surface-variant">Chennai Port Authority</span>
                    </div>
                  </td>
                  <td className="py-5 px-4 text-center text-sm font-medium whitespace-nowrap">Oct 25, 2023</td>
                  <td className="py-5 px-4 text-center">
                    <span className="bg-primary-fixed text-on-primary-fixed px-2.5 py-1 rounded-full text-xs font-bold whitespace-nowrap">08 Items</span>
                  </td>
                  <td className="py-5 px-4 text-right">
                    <span className="text-[10px] font-bold uppercase bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded whitespace-nowrap">Ready</span>
                  </td>
                </tr>

                {/* Row 3 */}
                <tr className="group hover:bg-surface-container-low transition-colors bg-surface-container-low/20">
                  <td className="py-5 px-6 text-center">
                    <input defaultChecked className="rounded text-primary focus:ring-primary border-outline-variant w-4 h-4 cursor-pointer" type="checkbox" />
                  </td>
                  <td className="py-5 px-4 font-bold text-primary text-sm whitespace-nowrap">SO-2024-8901</td>
                  <td className="py-5 px-4">
                    <div className="flex flex-col">
                      <span className="text-sm font-bold text-on-surface">Synthesis Chemical Corp</span>
                      <span className="text-xs text-on-surface-variant">Direct Delivery - Zone A</span>
                    </div>
                  </td>
                  <td className="py-5 px-4 text-center text-sm font-medium whitespace-nowrap">Oct 26, 2023</td>
                  <td className="py-5 px-4 text-center">
                    <span className="bg-primary-fixed text-on-primary-fixed px-2.5 py-1 rounded-full text-xs font-bold whitespace-nowrap">22 Items</span>
                  </td>
                  <td className="py-5 px-4 text-right">
                    <span className="text-[10px] font-bold uppercase bg-tertiary-fixed text-tertiary px-2 py-0.5 rounded whitespace-nowrap">Priority</span>
                  </td>
                </tr>

                {/* Row 4 */}
                <tr className="group hover:bg-surface-container-low transition-colors">
                  <td className="py-5 px-6 text-center">
                    <input className="rounded text-primary focus:ring-primary border-outline-variant w-4 h-4 cursor-pointer" type="checkbox" />
                  </td>
                  <td className="py-5 px-4 font-bold text-primary text-sm whitespace-nowrap">SO-2024-8912</td>
                  <td className="py-5 px-4">
                    <div className="flex flex-col">
                      <span className="text-sm font-bold text-on-surface">Advance Materials Group</span>
                      <span className="text-xs text-on-surface-variant">Pune Manufacturing Unit</span>
                    </div>
                  </td>
                  <td className="py-5 px-4 text-center text-sm font-medium whitespace-nowrap">Oct 26, 2023</td>
                  <td className="py-5 px-4 text-center">
                    <span className="bg-primary-fixed text-on-primary-fixed px-2.5 py-1 rounded-full text-xs font-bold whitespace-nowrap">05 Items</span>
                  </td>
                  <td className="py-5 px-4 text-right">
                    <span className="text-[10px] font-bold uppercase bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded whitespace-nowrap">Ready</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Empty State / Pagination Hint */}
          <div className="p-6 bg-surface-container-low/30 border-t border-surface-container-low flex justify-between items-center">
            <p className="text-xs text-on-surface-variant">Showing 4 of 28 eligible Sales Orders</p>
            <div className="flex gap-2">
              <button className="p-2 rounded-lg hover:bg-surface-container transition-colors disabled:opacity-30 outline-none" disabled>
                <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 0" }}>chevron_left</span>
              </button>
              <button className="p-2 rounded-lg hover:bg-surface-container transition-colors outline-none focus:ring-2 focus:ring-primary/20">
                <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 0" }}>chevron_right</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Fixed Bottom Summary Bar */}
      <div className="fixed bottom-4 lg:bottom-10 inset-x-4 lg:left-64 lg:right-10 z-50 pointer-events-none">
        <div className="max-w-[1440px] w-full mx-auto flex justify-center lg:justify-end">
          <div className="max-w-6xl w-full mx-auto lg:ml-auto lg:mr-0 pointer-events-auto">
            <div className="bg-surface-container-lowest/90 backdrop-blur-xl border border-white/40 shadow-[0_15px_50px_rgba(0,28,56,0.15)] rounded-2xl p-6 flex flex-col xl:flex-row items-center justify-between gap-6 relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/[0.02] to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              
              <div className="flex flex-wrap items-center gap-6 sm:gap-10 mx-auto xl:mx-0 w-full xl:w-auto justify-center xl:justify-start">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 shrink-0 rounded-xl bg-primary/10 flex items-center justify-center text-primary group-hover:scale-105 transition-transform">
                    <span className="material-symbols-outlined shrink-0" style={{ fontVariationSettings: "'FILL' 1" }}>inventory</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] uppercase font-bold text-on-surface-variant tracking-wider">Total Selected Items</span>
                    <span className="text-2xl font-extrabold text-on-surface tracking-tight">36 <span className="text-sm font-medium text-on-surface-variant">Units</span></span>
                  </div>
                </div>
                
                <div className="h-10 w-px bg-outline-variant/30 hidden sm:block"></div>
                
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 shrink-0 rounded-xl bg-secondary/10 flex items-center justify-center text-secondary group-hover:scale-105 transition-transform">
                    <span className="material-symbols-outlined shrink-0" style={{ fontVariationSettings: "'FILL' 0" }}>weight</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] uppercase font-bold text-on-surface-variant tracking-wider">Estimated Payload</span>
                    <span className="text-2xl font-extrabold text-on-surface tracking-tight">1,420 <span className="text-sm font-medium text-on-surface-variant">Kg</span></span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-4 w-full xl:w-auto mt-4 xl:mt-0">
                <button className="flex-1 xl:flex-none px-6 py-4 rounded-xl text-on-surface-variant font-bold hover:bg-surface-container transition-colors outline-none focus:ring-2 focus:ring-primary/20">
                  Clear All
                </button>
                <button 
                  onClick={onGenerateChallan}
                  className="flex-[2] xl:flex-none px-10 py-4 bg-gradient-to-br from-primary to-primary-container text-white rounded-xl font-bold shadow-xl shadow-primary/30 flex items-center justify-center gap-3 hover:scale-[1.02] hover:shadow-primary/40 active:scale-95 transition-all outline-none"
                >
                  <span className="whitespace-nowrap">Generate Delivery Challan</span>
                  <span className="material-symbols-outlined text-xl shrink-0" style={{ fontVariationSettings: "'FILL' 0" }}>arrow_forward</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
