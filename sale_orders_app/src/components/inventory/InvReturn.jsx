import React from 'react';

export default function InvReturn() {
  return (
    <div className="animate-in fade-in duration-500 max-w-[1400px] mx-auto pb-24">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 mb-4 text-xs font-medium text-on-surface-variant">
        <span>Inventory</span>
        <span className="material-symbols-outlined text-[14px]" style={{ fontVariationSettings: "'FILL' 0" }}>chevron_right</span>
        <span>Returns Management</span>
        <span className="material-symbols-outlined text-[14px]" style={{ fontVariationSettings: "'FILL' 0" }}>chevron_right</span>
        <span className="text-primary font-bold">Process Stock Return</span>
      </nav>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-6">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight text-on-surface mb-2 font-headline">Process Stock Return</h1>
          <p className="text-on-surface-variant text-lg max-w-2xl leading-relaxed font-body">Search for a sale order to load items for return processing and inventory reconciliation.</p>
        </div>
        <div className="flex gap-4">
          <button className="px-6 py-2.5 rounded-xl border border-outline text-primary font-semibold hover:bg-surface-container-low transition-all">Cancel</button>
          <button className="px-8 py-2.5 rounded-xl bg-gradient-to-br from-primary to-primary-container text-on-primary font-bold shadow-lg shadow-primary/20 flex items-center gap-2 hover:scale-[1.02] transition-all">
            <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
            Process Return
          </button>
        </div>
      </div>

      {/* Search Section */}
      <div className="mb-8 bg-surface-container-lowest p-8 rounded-[2rem] shadow-[0_10px_30px_rgba(0,28,56,0.03)] border border-primary/10">
        <div className="max-w-2xl">
          <label className="text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-3 block">Primary Search: Sale Order Number</label>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-primary" style={{ fontVariationSettings: "'FILL' 0" }}>receipt_long</span>
              <input className="w-full bg-surface-container-low border border-outline-variant/10 rounded-xl pl-12 pr-4 py-4 focus:ring-2 focus:ring-primary transition-all text-lg font-semibold outline-none" placeholder="Enter SO Number (e.g. SO-2024-8902)..." type="text" defaultValue="SO-2024-8902" />
            </div>
            <button className="bg-primary text-on-primary px-8 py-4 rounded-xl font-bold hover:bg-primary-container transition-colors flex items-center justify-center gap-2">
              <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 0" }}>search</span>
              Load Items
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-10">
        {/* Form Area */}
        <div className="xl:col-span-8 space-y-8">
          <div className="bg-surface-container-lowest p-8 rounded-[2rem] shadow-[0_20px_40px_rgba(0,28,56,0.04)] border border-outline-variant/10 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1 h-full bg-primary"></div>
            <div className="flex justify-between items-center mb-6 pl-2">
              <h3 className="text-xl font-bold flex items-center gap-2 font-headline">
                <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 0" }}>inventory</span>
                Items from Order SO-2024-8902
              </h3>
              <span className="text-xs font-bold bg-secondary-container text-on-secondary-fixed-variant px-3 py-1 rounded-full">3 Items Found</span>
            </div>

            {/* Loaded Items List */}
            <div className="space-y-4 mb-8">
              {/* Item 1 */}
              <div className="grid grid-cols-1 sm:grid-cols-12 items-center p-4 bg-surface-container-low rounded-xl border border-transparent hover:border-primary/20 transition-all gap-4">
                <div className="sm:col-span-1 border-b sm:border-0 pb-2 sm:pb-0 flex justify-start sm:justify-center">
                  <input defaultChecked className="w-5 h-5 rounded border-outline text-primary focus:ring-primary cursor-pointer" type="checkbox" />
                </div>
                <div className="sm:col-span-6">
                  <p className="font-bold text-on-surface">Solaris Glass Unit B4</p>
                  <p className="text-xs text-on-surface-variant font-medium">SKU: FV-WIN-402-B • Batch: #2024-A</p>
                </div>
                <div className="sm:col-span-2 text-start sm:text-center">
                  <p className="text-[10px] uppercase font-bold text-on-surface-variant mb-1">Ordered</p>
                  <p className="font-bold text-on-surface">50 Units</p>
                </div>
                <div className="sm:col-span-3">
                  <p className="text-[10px] uppercase font-bold text-on-surface-variant mb-1">Return Qty</p>
                  <input className="w-full bg-surface-container-lowest border-outline-variant/50 border rounded-lg px-3 py-2 text-sm font-bold focus:ring-2 focus:ring-primary outline-none text-on-surface" type="number" defaultValue="12" />
                </div>
              </div>

              {/* Item 2 */}
              <div className="grid grid-cols-1 sm:grid-cols-12 items-center p-4 bg-surface-container-low rounded-xl border border-transparent hover:border-primary/20 transition-all gap-4">
                <div className="sm:col-span-1 border-b sm:border-0 pb-2 sm:pb-0 flex justify-start sm:justify-center">
                  <input className="w-5 h-5 rounded border-outline text-primary focus:ring-primary cursor-pointer" type="checkbox" />
                </div>
                <div className="sm:col-span-6">
                  <p className="font-bold text-on-surface">Alpha Seal Connector v2</p>
                  <p className="text-xs text-on-surface-variant font-medium">SKU: FV-CON-88-V2 • Batch: #2024-A</p>
                </div>
                <div className="sm:col-span-2 text-start sm:text-center">
                  <p className="text-[10px] uppercase font-bold text-on-surface-variant mb-1">Ordered</p>
                  <p className="font-bold text-on-surface">200 Units</p>
                </div>
                <div className="sm:col-span-3">
                  <p className="text-[10px] uppercase font-bold text-on-surface-variant mb-1">Return Qty</p>
                  <input className="w-full bg-surface-container-lowest border-outline-variant/50 border rounded-lg px-3 py-2 text-sm font-bold focus:ring-2 focus:ring-primary outline-none text-on-surface" type="number" defaultValue="0" />
                </div>
              </div>

              {/* Item 3 */}
              <div className="grid grid-cols-1 sm:grid-cols-12 items-center p-4 bg-surface-container-low rounded-xl border border-transparent hover:border-primary/20 transition-all gap-4">
                <div className="sm:col-span-1 border-b sm:border-0 pb-2 sm:pb-0 flex justify-start sm:justify-center">
                  <input className="w-5 h-5 rounded border-outline text-primary focus:ring-primary cursor-pointer" type="checkbox" />
                </div>
                <div className="sm:col-span-6">
                  <p className="font-bold text-on-surface">Luminescent Panel X</p>
                  <p className="text-xs text-on-surface-variant font-medium">SKU: FV-PNL-X100 • Batch: #2023-F</p>
                </div>
                <div className="sm:col-span-2 text-start sm:text-center">
                  <p className="text-[10px] uppercase font-bold text-on-surface-variant mb-1">Ordered</p>
                  <p className="font-bold text-on-surface">15 Units</p>
                </div>
                <div className="sm:col-span-3">
                  <p className="text-[10px] uppercase font-bold text-on-surface-variant mb-1">Return Qty</p>
                  <input className="w-full bg-surface-container-lowest border-outline-variant/50 border rounded-lg px-3 py-2 text-sm font-bold focus:ring-2 focus:ring-primary outline-none text-on-surface" type="number" defaultValue="0" />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-surface-container">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-on-surface-variant">Return Reason (Apply to Selected)</label>
                <div className="relative">
                  <select className="w-full bg-surface-container-low border border-outline-variant/10 rounded-xl px-4 py-4 focus:ring-2 focus:ring-primary transition-all appearance-none outline-none">
                    <option>Select Reason</option>
                    <option defaultValue>Damaged</option>
                    <option>Wrong Item</option>
                    <option>Surplus</option>
                    <option>Quality Failure</option>
                  </select>
                  <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-outline-variant pointer-events-none" style={{ fontVariationSettings: "'FILL' 0" }}>expand_more</span>
                </div>
              </div>
              <div className="md:col-span-2 space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-on-surface-variant">Return Action</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <button className="p-4 border-2 border-primary bg-primary/5 rounded-xl text-primary font-bold text-sm flex flex-col items-center gap-2 hover:bg-primary/10 transition-colors">
                    <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 0" }}>inventory</span>
                    Return to Stock
                  </button>
                  <button className="p-4 border border-outline-variant/30 bg-surface-container-lowest hover:border-primary rounded-xl text-on-surface-variant hover:text-primary font-medium text-sm flex flex-col items-center gap-2 transition-all">
                    <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 0" }}>security</span>
                    Quarantine
                  </button>
                  <button className="p-4 border border-outline-variant/30 bg-surface-container-lowest hover:border-error rounded-xl text-on-surface-variant hover:text-error font-medium text-sm flex flex-col items-center gap-2 transition-all">
                    <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 0" }}>delete_forever</span>
                    Scrap
                  </button>
                  <button className="p-4 border border-outline-variant/30 bg-surface-container-lowest hover:border-primary rounded-xl text-on-surface-variant hover:text-primary font-medium text-sm flex flex-col items-center gap-2 transition-all">
                    <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 0" }}>build</span>
                    Refurbish
                  </button>
                </div>
              </div>
              <div className="md:col-span-2 space-y-2 mt-2">
                <label className="text-xs font-bold uppercase tracking-wider text-on-surface-variant">Remarks/Notes</label>
                <textarea className="w-full bg-surface-container-low border border-outline-variant/10 rounded-xl px-4 py-4 focus:ring-2 focus:ring-primary transition-all outline-none" placeholder="Additional details about the items' condition or customer feedback..." rows="4"></textarea>
              </div>
            </div>
          </div>

          {/* Workflow Tracker */}
          <div className="bg-surface-container-lowest p-8 rounded-[2rem] border border-outline-variant/10 shadow-[0_10px_30px_rgba(0,28,56,0.03)] hidden sm:block">
            <h3 className="text-sm font-bold mb-6 text-on-surface-variant uppercase tracking-widest">Processing Workflow</h3>
            
            <div className="flex items-center">
              <div className="flex flex-col items-center">
                <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center text-[10px] text-on-primary font-bold">1</div>
                <div className="w-1 h-12 bg-primary"></div>
              </div>
              <div className="ml-4 mb-12">
                <p className="text-sm font-bold text-on-surface">Initiate Return</p>
                <p className="text-xs text-on-surface-variant">Identify and validate SO items</p>
              </div>
            </div>
            
            <div className="flex items-center -mt-8">
              <div className="flex flex-col items-center">
                <div className="w-6 h-6 rounded-full border-2 border-primary bg-surface flex items-center justify-center text-[10px] text-primary font-bold z-10 relative">2</div>
                <div className="w-1 h-12 bg-surface-variant relative -top-1"></div>
              </div>
              <div className="ml-4 mb-12">
                <p className="text-sm font-bold text-on-surface">Physical QC</p>
                <p className="text-xs text-on-surface-variant">Verify against checklist</p>
              </div>
            </div>
            
            <div className="flex items-center -mt-8">
              <div className="flex flex-col items-center z-10 relative">
                <div className="w-6 h-6 rounded-full bg-surface-variant flex items-center justify-center text-[10px] text-on-surface-variant font-bold">3</div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-bold text-on-surface-variant">Inventory Reconciliation</p>
                <p className="text-xs text-on-surface-variant">Final update to system records</p>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar/Side Panel (Right side) */}
        <div className="xl:col-span-4 space-y-8">
          {/* Live Item Insights */}
          <div className="bg-surface-container-lowest rounded-2xl shadow-[0_20px_40px_rgba(0,28,56,0.04)] border border-outline-variant/10 overflow-hidden">
            <div className="h-40 relative">
              <img className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAZ4iawOkhNKyj2wbCVhvhUrgd3gqG2Krj5wJnq4A_iboDpyIrmu5zMJp2wBvxzhKOB5icRoYjSKYcy924Kfvo0SOSin_6xYCgV23IxdFk1HSkHZX6ntYy6x5CvCEagdIUPXHWxS99FuRUg9M5vrRXWVawcSlv2ferKPhasVAI9LBepq8URr3fVPrFL6KUj_wXnvkZLxzMN_03hZxQ5Z4aauFW-_L9q3D_xULeqboZ9O2x5alrUKbtpKdpUTvp3HIQrkn0cU5kUYYI4" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
              <div className="absolute bottom-4 left-4 text-white">
                <span className="bg-primary px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider mb-2 inline-block text-white shadow-sm border border-white/10">Live Item Insights</span>
                <h4 className="font-bold text-lg leading-tight">Solaris Glass Unit B4</h4>
              </div>
            </div>
            <div className="p-6">
              <div className="flex justify-between items-center py-3 border-b border-surface-container">
                <span className="text-xs text-on-surface-variant font-medium">Current Stock</span>
                <span className="font-bold text-on-surface">1,240 Units</span>
              </div>
              <div className="flex justify-between items-center py-3 border-b border-surface-container">
                <span className="text-xs text-on-surface-variant font-medium">Warehouse Loc</span>
                <span className="font-bold text-on-surface">WH-A / Sector 4</span>
              </div>
              <div className="flex justify-between items-center pt-3 pb-1">
                <span className="text-xs text-on-surface-variant font-medium">Last Return</span>
                <span className="font-bold text-tertiary">14 Days ago</span>
              </div>
            </div>
          </div>

          {/* QC Checklist */}
          <div className="bg-surface-container border border-outline-variant/10 p-6 rounded-2xl shadow-sm">
            <h4 className="text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-4">QC Checklist</h4>
            <div className="space-y-4">
              <label className="flex items-center gap-3 cursor-pointer group">
                <div className="w-5 h-5 rounded border-2 border-primary bg-primary/10 transition-colors flex items-center justify-center">
                  <span className="material-symbols-outlined text-[14px] text-primary font-bold" style={{ fontVariationSettings: "'FILL' 0" }}>check</span>
                </div>
                <span className="text-sm font-medium text-on-surface">Package Integrity Verified</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer group">
                <div className="w-5 h-5 rounded border-2 border-outline-variant/50 bg-surface-container-lowest group-hover:border-primary transition-colors flex items-center justify-center"></div>
                <span className="text-sm font-medium text-on-surface">Serial Number Match</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer group">
                <div className="w-5 h-5 rounded border-2 border-outline-variant/50 bg-surface-container-lowest group-hover:border-primary transition-colors flex items-center justify-center"></div>
                <span className="text-sm font-medium text-on-surface">Surface Damage Inspection</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer group">
                <div className="w-5 h-5 rounded border-2 border-outline-variant/50 bg-surface-container-lowest group-hover:border-primary transition-colors flex items-center justify-center"></div>
                <span className="text-sm font-medium text-on-surface">Hazardous Leak Check</span>
              </label>
            </div>
          </div>

          {/* Recent Returns */}
          <div className="space-y-4 bg-surface-container-lowest border border-outline-variant/10 p-6 rounded-2xl shadow-sm">
            <h4 className="text-xs font-bold uppercase tracking-widest text-on-surface-variant flex justify-between items-center pb-2 border-b border-outline-variant/10">
              Recent Returns
              <button className="text-primary normal-case font-bold hover:underline">View All</button>
            </h4>
            
            {/* List Item 1 */}
            <div className="p-4 bg-surface-container-low rounded-xl flex items-center gap-4 group hover:bg-surface-container transition-colors cursor-pointer border border-transparent hover:border-outline-variant/20">
              <div className="w-10 h-10 rounded-lg bg-surface-container-highest flex items-center justify-center text-primary shrink-0">
                <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 0" }}>assignment_return</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-on-surface truncate">#RET-90422</p>
                <p className="text-xs text-on-surface-variant truncate">2 Units • Damaged</p>
              </div>
              <span className="text-[10px] font-bold text-on-surface-variant shrink-0">2H AGO</span>
            </div>
            
            {/* List Item 2 */}
            <div className="p-4 bg-surface-container-low rounded-xl flex items-center gap-4 group hover:bg-surface-container transition-colors cursor-pointer border border-transparent hover:border-outline-variant/20">
              <div className="w-10 h-10 rounded-lg bg-surface-container-highest flex items-center justify-center text-primary shrink-0">
                <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 0" }}>assignment_return</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-on-surface truncate">#RET-90419</p>
                <p className="text-xs text-on-surface-variant truncate">15 Units • Surplus</p>
              </div>
              <span className="text-[10px] font-bold text-on-surface-variant shrink-0">5H AGO</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
