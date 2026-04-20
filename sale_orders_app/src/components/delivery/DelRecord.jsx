import React from 'react';

export default function DelRecord() {
  return (
    <div className="flex-1 animate-in fade-in duration-500 pb-24">
      {/* Header Section with Asymmetric Layout */}
      <div className="flex flex-col md:flex-row justify-between items-end mb-10 gap-6 w-full">
        <div className="max-w-2xl">
          <nav className="flex items-center gap-2 text-xs font-semibold text-primary mb-2 tracking-widest uppercase">
            <span>Logistics</span>
            <span className="material-symbols-outlined text-[10px]" style={{ fontVariationSettings: "'FILL' 0" }}>chevron_right</span>
            <span className="text-on-surface-variant">History</span>
          </nav>
          <h2 className="font-headline text-4xl font-extrabold text-on-surface tracking-tight">Delivery Challan History</h2>
          <p className="text-on-surface-variant mt-3 text-sm leading-relaxed max-w-lg">
            Manage and track your synthetic logistics documentation. View real-time status updates and historical data for all generated delivery challans.
          </p>
        </div>

        {/* Filters: Date Range and More */}
        <div className="flex items-center gap-3 bg-surface-container-low p-2 rounded-2xl shrink-0">
          <div className="flex flex-col px-4 border-r border-outline-variant/20">
            <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-tighter">Date Range</span>
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-on-surface">Oct 01 - Oct 31, 2023</span>
              <span className="material-symbols-outlined text-sm text-primary" style={{ fontVariationSettings: "'FILL' 0" }}>calendar_today</span>
            </div>
          </div>
          <button className="flex items-center gap-2 px-6 py-3 bg-surface-container-lowest rounded-xl text-sm font-semibold text-on-surface shadow-sm hover:shadow-md transition-all outline-none focus:ring-2 focus:ring-primary/20">
            <span className="material-symbols-outlined text-lg" style={{ fontVariationSettings: "'FILL' 0" }}>filter_list</span>
            More Filters
          </button>
        </div>
      </div>

      {/* Bento Stats Strip */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10 w-full">
        <div className="bg-surface-container-lowest p-6 rounded-3xl shadow-[0_20px_40px_rgba(0,28,56,0.04)] flex flex-col justify-between h-32 border border-outline-variant/5">
          <span className="text-xs font-bold text-on-surface-variant uppercase tracking-widest">Total Challans</span>
          <div className="flex items-end justify-between">
            <span className="text-3xl font-black text-on-surface">1,284</span>
            <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg">+12%</span>
          </div>
        </div>
        
        <div className="bg-primary text-white p-6 rounded-3xl shadow-xl shadow-primary/10 flex flex-col justify-between h-32">
          <span className="text-xs font-bold text-primary-fixed-dim uppercase tracking-widest">In Transit</span>
          <div className="flex items-end justify-between">
            <span className="text-3xl font-black">42</span>
            <span className="material-symbols-outlined opacity-50 text-4xl" style={{ fontVariationSettings: "'FILL' 0" }}>local_shipping</span>
          </div>
        </div>
        
        <div className="bg-surface-container-lowest p-6 rounded-3xl shadow-[0_20px_40px_rgba(0,28,56,0.04)] flex flex-col justify-between h-32 border border-outline-variant/5">
          <span className="text-xs font-bold text-on-surface-variant uppercase tracking-widest">Delivered Today</span>
          <div className="flex items-end justify-between">
            <span className="text-3xl font-black text-on-surface">156</span>
            <span className="text-xs font-bold text-primary bg-primary-fixed px-2 py-1 rounded-lg">High Flow</span>
          </div>
        </div>
        
        <div className="bg-tertiary-fixed text-on-tertiary-fixed p-6 rounded-3xl shadow-[0_20px_40px_rgba(0,28,56,0.04)] flex flex-col justify-between h-32">
          <span className="text-xs font-bold text-on-tertiary-fixed-variant uppercase tracking-widest">Pending Drafts</span>
          <div className="flex items-end justify-between">
            <span className="text-3xl font-black">08</span>
            <span className="material-symbols-outlined opacity-50 text-4xl" style={{ fontVariationSettings: "'FILL' 0" }}>edit_document</span>
          </div>
        </div>
      </div>

      {/* Professional Data Table */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4 w-full">
        <div className="relative w-full max-w-md group shrink-0">
          <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline group-focus-within:text-primary transition-colors" style={{ fontVariationSettings: "'FILL' 0" }}>search</span>
          <input className="w-full bg-surface-container-lowest border border-outline-variant/30 rounded-xl pl-12 pr-4 py-3 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all placeholder:text-on-surface-variant/50 shadow-sm outline-none" placeholder="Search by Challan ID or Customer Name..." type="text" />
        </div>
        <div className="flex items-center gap-2 text-xs font-bold text-on-surface-variant uppercase tracking-widest shrink-0">
          <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 0" }}>sort</span>
          Sort by: Latest First
        </div>
      </div>

      <div className="bg-surface-container-lowest rounded-[2rem] shadow-[0_40px_80px_rgba(0,28,56,0.05)] overflow-hidden border border-outline-variant/10 w-full mb-10 cursor-default">
        <div className="overflow-x-auto w-full">
          <table className="w-full text-left border-collapse min-w-[1000px]">
            <thead>
              <tr className="bg-surface-container-low/50">
                <th className="px-8 py-5 text-[11px] font-bold text-on-surface-variant uppercase tracking-widest">Challan ID</th>
                <th className="px-6 py-5 text-[11px] font-bold text-on-surface-variant uppercase tracking-widest">Date</th>
                <th className="px-6 py-5 text-[11px] font-bold text-on-surface-variant uppercase tracking-widest">Customer Name</th>
                <th className="px-6 py-5 text-[11px] font-bold text-on-surface-variant uppercase tracking-widest">Vehicle Number</th>
                <th className="px-6 py-5 text-[11px] font-bold text-on-surface-variant uppercase tracking-widest">Items</th>
                <th className="px-6 py-5 text-[11px] font-bold text-on-surface-variant uppercase tracking-widest">Value (PKR)</th>
                <th className="px-6 py-5 text-[11px] font-bold text-on-surface-variant uppercase tracking-widest text-center">Status</th>
                <th className="px-8 py-5 text-[11px] font-bold text-on-surface-variant uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/10">
              {/* Row 1 */}
              <tr className="hover:bg-surface-container-low/50 transition-colors group">
                <td className="px-8 py-5 font-bold text-primary tracking-tight whitespace-nowrap">DC-2023-8902</td>
                <td className="px-6 py-5 text-sm text-on-surface-variant whitespace-nowrap">24 Oct, 2023</td>
                <td className="px-6 py-5 font-semibold text-on-surface whitespace-nowrap">Nexus Global Corp</td>
                <td className="px-6 py-5 text-sm font-mono text-on-surface-variant whitespace-nowrap">KAE-4592</td>
                <td className="px-6 py-5 text-sm text-on-surface whitespace-nowrap">240 Pcs</td>
                <td className="px-6 py-5 font-bold text-on-surface whitespace-nowrap">1,450,000</td>
                <td className="px-6 py-5">
                  <div className="flex justify-center">
                    <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase bg-primary-fixed text-primary tracking-tighter flex items-center gap-1.5 whitespace-nowrap">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></span>
                      Dispatched
                    </span>
                  </div>
                </td>
                <td className="px-8 py-5">
                  <div className="flex items-center justify-end gap-1 opacity-100 xl:opacity-0 xl:group-hover:opacity-100 transition-opacity">
                    <button className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-surface-container text-on-surface-variant transition-colors outline-none focus:ring-2 focus:ring-primary/20" title="Edit">
                      <span className="material-symbols-outlined text-lg" style={{ fontVariationSettings: "'FILL' 0" }}>edit</span>
                    </button>
                    <button className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-surface-container text-on-surface-variant transition-colors outline-none focus:ring-2 focus:ring-primary/20" title="Print">
                      <span className="material-symbols-outlined text-lg" style={{ fontVariationSettings: "'FILL' 0" }}>print</span>
                    </button>
                    <button className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-error/10 text-error transition-colors outline-none focus:ring-2 focus:ring-error/20" title="Delete">
                      <span className="material-symbols-outlined text-lg" style={{ fontVariationSettings: "'FILL' 0" }}>delete</span>
                    </button>
                  </div>
                </td>
              </tr>
              
              {/* Row 2 */}
              <tr className="hover:bg-surface-container-low/50 transition-colors group">
                <td className="px-8 py-5 font-bold text-primary tracking-tight whitespace-nowrap">DC-2023-8899</td>
                <td className="px-6 py-5 text-sm text-on-surface-variant whitespace-nowrap">23 Oct, 2023</td>
                <td className="px-6 py-5 font-semibold text-on-surface whitespace-nowrap">Indus Valley Textiles</td>
                <td className="px-6 py-5 text-sm font-mono text-on-surface-variant whitespace-nowrap">LES-1120</td>
                <td className="px-6 py-5 text-sm text-on-surface whitespace-nowrap">1,200 Pcs</td>
                <td className="px-6 py-5 font-bold text-on-surface whitespace-nowrap">4,280,000</td>
                <td className="px-6 py-5">
                  <div className="flex justify-center">
                    <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase bg-emerald-50 text-emerald-700 tracking-tighter flex items-center gap-1.5 border border-emerald-200 whitespace-nowrap">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
                      Delivered
                    </span>
                  </div>
                </td>
                <td className="px-8 py-5">
                  <div className="flex items-center justify-end gap-1 opacity-100 xl:opacity-0 xl:group-hover:opacity-100 transition-opacity">
                    <button className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-surface-container text-on-surface-variant transition-colors outline-none focus:ring-2 focus:ring-primary/20" title="Edit">
                      <span className="material-symbols-outlined text-lg" style={{ fontVariationSettings: "'FILL' 0" }}>edit</span>
                    </button>
                    <button className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-surface-container text-on-surface-variant transition-colors outline-none focus:ring-2 focus:ring-primary/20" title="Print">
                      <span className="material-symbols-outlined text-lg" style={{ fontVariationSettings: "'FILL' 0" }}>print</span>
                    </button>
                    <button className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-error/10 text-error transition-colors outline-none focus:ring-2 focus:ring-error/20" title="Delete">
                      <span className="material-symbols-outlined text-lg" style={{ fontVariationSettings: "'FILL' 0" }}>delete</span>
                    </button>
                  </div>
                </td>
              </tr>
              
              {/* Row 3 */}
              <tr className="hover:bg-surface-container-low/50 transition-colors group bg-surface-container-low/10">
                <td className="px-8 py-5 font-bold text-primary tracking-tight whitespace-nowrap">DC-2023-8910</td>
                <td className="px-6 py-5 text-sm text-on-surface-variant whitespace-nowrap">Today, 09:45</td>
                <td className="px-6 py-5 font-semibold text-on-surface whitespace-nowrap">Atlas Trading Co.</td>
                <td className="px-6 py-5 text-sm font-mono text-on-surface-variant whitespace-nowrap">---</td>
                <td className="px-6 py-5 text-sm text-on-surface whitespace-nowrap">45 Pcs</td>
                <td className="px-6 py-5 font-bold text-on-surface whitespace-nowrap">235,500</td>
                <td className="px-6 py-5">
                  <div className="flex justify-center">
                    <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase bg-surface-variant text-on-surface-variant tracking-tighter flex items-center gap-1.5 whitespace-nowrap">
                      <span className="w-1.5 h-1.5 rounded-full bg-on-surface-variant"></span>
                      Draft
                    </span>
                  </div>
                </td>
                <td className="px-8 py-5">
                  <div className="flex items-center justify-end gap-1 opacity-100 xl:opacity-0 xl:group-hover:opacity-100 transition-opacity">
                    <button className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-surface-container text-on-surface-variant transition-colors outline-none focus:ring-2 focus:ring-primary/20" title="Edit">
                      <span className="material-symbols-outlined text-lg" style={{ fontVariationSettings: "'FILL' 0" }}>edit</span>
                    </button>
                    <button className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-surface-container text-on-surface-variant transition-colors outline-none focus:ring-2 focus:ring-primary/20" title="Print">
                      <span className="material-symbols-outlined text-lg" style={{ fontVariationSettings: "'FILL' 0" }}>print</span>
                    </button>
                    <button className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-error/10 text-error transition-colors outline-none focus:ring-2 focus:ring-error/20" title="Delete">
                      <span className="material-symbols-outlined text-lg" style={{ fontVariationSettings: "'FILL' 0" }}>delete</span>
                    </button>
                  </div>
                </td>
              </tr>

              {/* Row 4 */}
              <tr className="hover:bg-surface-container-low/50 transition-colors group">
                <td className="px-8 py-5 font-bold text-primary tracking-tight whitespace-nowrap">DC-2023-8884</td>
                <td className="px-6 py-5 text-sm text-on-surface-variant whitespace-nowrap">21 Oct, 2023</td>
                <td className="px-6 py-5 font-semibold text-on-surface whitespace-nowrap">Karachi Logistics Ltd</td>
                <td className="px-6 py-5 text-sm font-mono text-on-surface-variant whitespace-nowrap">JU-9901</td>
                <td className="px-6 py-5 text-sm text-on-surface whitespace-nowrap">18 Pcs</td>
                <td className="px-6 py-5 font-bold text-on-surface whitespace-nowrap">98,000</td>
                <td className="px-6 py-5">
                  <div className="flex justify-center">
                    <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase bg-emerald-50 text-emerald-700 border border-emerald-200 tracking-tighter flex items-center gap-1.5 whitespace-nowrap">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
                      Delivered
                    </span>
                  </div>
                </td>
                <td className="px-8 py-5">
                  <div className="flex items-center justify-end gap-1 opacity-100 xl:opacity-0 xl:group-hover:opacity-100 transition-opacity">
                    <button className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-surface-container text-on-surface-variant transition-colors outline-none focus:ring-2 focus:ring-primary/20" title="Edit">
                      <span className="material-symbols-outlined text-lg" style={{ fontVariationSettings: "'FILL' 0" }}>edit</span>
                    </button>
                    <button className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-surface-container text-on-surface-variant transition-colors outline-none focus:ring-2 focus:ring-primary/20" title="Print">
                      <span className="material-symbols-outlined text-lg" style={{ fontVariationSettings: "'FILL' 0" }}>print</span>
                    </button>
                    <button className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-error/10 text-error transition-colors outline-none focus:ring-2 focus:ring-error/20" title="Delete">
                      <span className="material-symbols-outlined text-lg" style={{ fontVariationSettings: "'FILL' 0" }}>delete</span>
                    </button>
                  </div>
                </td>
              </tr>
              
              {/* Row 5 */}
              <tr className="hover:bg-surface-container-low/50 transition-colors group">
                <td className="px-8 py-5 font-bold text-primary tracking-tight whitespace-nowrap">DC-2023-8871</td>
                <td className="px-6 py-5 text-sm text-on-surface-variant whitespace-nowrap">20 Oct, 2023</td>
                <td className="px-6 py-5 font-semibold text-on-surface whitespace-nowrap">Blue Chip Industries</td>
                <td className="px-6 py-5 text-sm font-mono text-on-surface-variant whitespace-nowrap">ABC-123</td>
                <td className="px-6 py-5 text-sm text-on-surface whitespace-nowrap">512 Pcs</td>
                <td className="px-6 py-5 font-bold text-on-surface whitespace-nowrap">6,120,000</td>
                <td className="px-6 py-5">
                  <div className="flex justify-center">
                    <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase bg-primary-fixed text-primary tracking-tighter flex items-center gap-1.5 whitespace-nowrap">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></span>
                      Dispatched
                    </span>
                  </div>
                </td>
                <td className="px-8 py-5">
                  <div className="flex items-center justify-end gap-1 opacity-100 xl:opacity-0 xl:group-hover:opacity-100 transition-opacity">
                    <button className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-surface-container text-on-surface-variant transition-colors outline-none focus:ring-2 focus:ring-primary/20" title="Edit">
                      <span className="material-symbols-outlined text-lg" style={{ fontVariationSettings: "'FILL' 0" }}>edit</span>
                    </button>
                    <button className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-surface-container text-on-surface-variant transition-colors outline-none focus:ring-2 focus:ring-primary/20" title="Print">
                      <span className="material-symbols-outlined text-lg" style={{ fontVariationSettings: "'FILL' 0" }}>print</span>
                    </button>
                    <button className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-error/10 text-error transition-colors outline-none focus:ring-2 focus:ring-error/20" title="Delete">
                      <span className="material-symbols-outlined text-lg" style={{ fontVariationSettings: "'FILL' 0" }}>delete</span>
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        
        {/* Custom Pagination */}
        <div className="px-8 py-6 bg-surface-container-low/20 flex flex-col sm:flex-row items-center justify-between border-t border-outline-variant/10 gap-4">
          <p className="text-sm text-on-surface-variant">Showing <span className="font-bold text-on-surface">1 - 5</span> of <span className="font-bold text-on-surface">1,284</span> challans</p>
          <div className="flex items-center gap-1">
            <button className="w-10 h-10 flex items-center justify-center rounded-xl border border-outline-variant/30 hover:bg-surface-container transition-colors disabled:opacity-30 outline-none focus:ring-2 focus:ring-primary/20" disabled>
              <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 0" }}>chevron_left</span>
            </button>
            <button className="w-10 h-10 flex items-center justify-center rounded-xl bg-primary text-white font-bold shadow-md outline-none focus:ring-2 focus:ring-primary/20 focus:ring-offset-1">1</button>
            <button className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-surface-container transition-colors text-on-surface font-semibold outline-none focus:ring-2 focus:ring-primary/20">2</button>
            <button className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-surface-container transition-colors text-on-surface font-semibold outline-none focus:ring-2 focus:ring-primary/20 hidden sm:flex">3</button>
            <span className="px-2 text-on-surface-variant">...</span>
            <button className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-surface-container transition-colors text-on-surface font-semibold outline-none focus:ring-2 focus:ring-primary/20">257</button>
            <button className="w-10 h-10 flex items-center justify-center rounded-xl border border-outline-variant/30 hover:bg-surface-container transition-colors outline-none focus:ring-2 focus:ring-primary/20">
              <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 0" }}>chevron_right</span>
            </button>
          </div>
        </div>
      </div>

      {/* Quick Action Toast / Floating Tip */}
      <div className="bg-gradient-to-r from-secondary-container to-primary-container p-6 rounded-3xl flex flex-col md:flex-row items-start md:items-center justify-between shadow-2xl shadow-secondary/10 gap-4 group hover:shadow-primary/20 transition-all">
        <div className="flex items-center gap-4 w-full">
          <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white shrink-0 group-hover:scale-110 transition-transform">
            <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>lightbulb</span>
          </div>
          <div>
            <h4 className="text-white font-bold tracking-tight">Pro Tip: Bulk Printing</h4>
            <p className="text-white/80 text-sm">Select multiple rows to generate a consolidated delivery report or bulk print labels.</p>
          </div>
        </div>
        <button className="bg-white text-primary px-6 py-2 rounded-xl text-sm font-bold shadow-sm hover:bg-surface-bright transition-colors whitespace-nowrap outline-none focus:ring-2 focus:ring-white/50 w-full md:w-auto">Learn More</button>
      </div>
    </div>
  );
}
