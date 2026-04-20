import React from 'react';

export default function InvAdjustment() {
  return (
    <div className="animate-in fade-in duration-500 max-w-[1400px] mx-auto pb-24">
      {/* Header section */}
      <header className="mb-10">
        <h1 className="text-4xl font-extrabold text-on-surface tracking-tight mb-2 font-headline">Manual Stock Adjustment</h1>
        <p className="text-on-surface-variant font-body">Correct inventory discrepancies with high-precision tracking.</p>
      </header>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
        {/* Form Section */}
        <section className="xl:col-span-8 space-y-8">
          <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/10 shadow-[0_20px_40px_rgba(0,28,56,0.06)] p-8">
            <form className="space-y-6">
              {/* Select Item */}
              <div>
                <label className="block text-sm font-bold text-on-surface mb-2 tracking-wide uppercase text-[10px]">Select Item</label>
                <div className="relative group">
                  <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline-variant" style={{ fontVariationSettings: "'FILL' 0" }}>search</span>
                  <input className="w-full bg-surface-container-low border border-outline-variant/10 rounded-xl pl-12 pr-4 py-4 focus:ring-2 focus:ring-primary focus:bg-surface-container-lowest transition-all placeholder:text-outline-variant outline-none" placeholder="Search by SKU, Name or Batch ID..." type="text" />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Adjustment Type */}
                <div>
                  <label className="block text-sm font-bold text-on-surface mb-2 tracking-wide uppercase text-[10px]">Adjustment Type</label>
                  <div className="flex gap-3">
                    <button className="flex-1 flex items-center justify-center gap-2 py-4 rounded-xl bg-primary-container text-white font-semibold transition-all shadow-sm" type="button">
                      <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 0" }}>add_circle</span> Addition
                    </button>
                    <button className="flex-1 flex items-center justify-center gap-2 py-4 rounded-xl bg-surface-container-low border border-outline-variant/10 text-on-surface-variant font-semibold hover:bg-surface-container transition-all" type="button">
                      <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 0" }}>remove_circle</span> Subtraction
                    </button>
                  </div>
                </div>
                {/* Quantity */}
                <div>
                  <label className="block text-sm font-bold text-on-surface mb-2 tracking-wide uppercase text-[10px]">Quantity</label>
                  <input className="w-full bg-surface-container-low border border-outline-variant/10 rounded-xl px-4 py-4 focus:ring-2 focus:ring-primary focus:bg-surface-container-lowest transition-all outline-none" placeholder="0.00" type="number" />
                </div>
              </div>
              {/* Reason */}
              <div>
                <label className="block text-sm font-bold text-on-surface mb-2 tracking-wide uppercase text-[10px]">Reason for Adjustment</label>
                <div className="relative">
                   <select className="w-full bg-surface-container-low border border-outline-variant/10 rounded-xl px-4 py-4 focus:ring-2 focus:ring-primary focus:bg-surface-container-lowest transition-all text-on-surface appearance-none outline-none">
                     <option>Select a reason...</option>
                     <option>Damage / Spoilage</option>
                     <option>Correction / Miscount</option>
                     <option>Initial Stock Entry</option>
                     <option>Return to Vendor</option>
                     <option>Internal Use</option>
                   </select>
                   <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-outline-variant pointer-events-none" style={{ fontVariationSettings: "'FILL' 0" }}>expand_more</span>
                </div>
              </div>
              {/* Remarks */}
              <div>
                <label className="block text-sm font-bold text-on-surface mb-2 tracking-wide uppercase text-[10px]">Remarks</label>
                <textarea className="w-full bg-surface-container-low border border-outline-variant/10 rounded-xl px-4 py-4 focus:ring-2 focus:ring-primary focus:bg-surface-container-lowest transition-all outline-none" placeholder="Enter detailed notes regarding this correction..." rows="4"></textarea>
              </div>
              <div className="flex justify-end gap-4 pt-4 border-t border-outline-variant/10">
                <button className="px-8 py-4 rounded-xl text-primary font-bold hover:bg-primary/5 transition-colors" type="button">Discard</button>
                <button className="px-10 py-4 rounded-xl bg-gradient-to-br from-primary to-primary-container text-white font-bold shadow-lg shadow-primary/20 hover:scale-[1.02] transition-all" type="button">Process Adjustment</button>
              </div>
            </form>
          </div>
        </section>

        {/* Reference / Reference Info Section */}
        <aside className="xl:col-span-4 space-y-6">
          {/* Current Stock Insight */}
          <div className="bg-surface-container-low rounded-2xl p-8 border border-outline-variant/15">
            <h3 className="text-sm font-bold text-on-surface-variant mb-6 tracking-widest uppercase">Live Item Insights</h3>
            <div className="flex items-center gap-4 mb-8">
              <div className="w-16 h-16 rounded-xl bg-surface-container-highest flex items-center justify-center overflow-hidden border border-outline-variant/20">
                <img alt="Synthetic Logistics Part" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuA6_I7nCq-Stx1iWBYzXD8-UOSGcrJ2RexbvHfHdY5b8EHGhI9apXPxGRKIkoJb0CXwQHAyjTtRm6Hvt5b6_gLrl6_av0ao94_0crlr1Rcv3vFcgOv6Ortj-MH3tsc4NOhVrep1i9E97OuTyZyoINic2OR8wqyAhNUj05DfkSyrvrIKhJKrdVBF-ASm84EYRT72kGPDXPLOh6pZplOwA_2iewjHkUBrl2OhxXibIWyzjh5LXUpdZxi5ljLzT5Et1lGrwCIbIPNbNUFC" />
              </div>
              <div>
                <p className="font-bold text-on-surface text-lg leading-tight">Iso-Hexane Grade-B</p>
                <p className="text-xs text-outline font-medium">SKU: FLV-882-QX</p>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex justify-between items-end p-4 bg-surface-container-lowest border border-outline-variant/10 rounded-xl">
                <div>
                  <span className="text-xs font-medium text-on-surface-variant">Current Balance</span>
                  <p className="text-2xl font-black text-primary">1,420 <span className="text-sm font-medium">Units</span></p>
                </div>
                <span className="material-symbols-outlined text-primary/40 text-3xl" style={{ fontVariationSettings: "'FILL' 0" }}>inventory</span>
              </div>
              <div className="flex justify-between items-end p-4 bg-surface-container-lowest border border-outline-variant/10 rounded-xl">
                <div>
                  <span className="text-xs font-medium text-on-surface-variant">Last Movement</span>
                  <p className="text-lg font-bold text-on-surface">3h ago</p>
                </div>
                <span className="material-symbols-outlined text-secondary/40" style={{ fontVariationSettings: "'FILL' 0" }}>schedule</span>
              </div>
              <div className="flex justify-between items-end p-4 bg-surface-container-lowest border border-outline-variant/10 rounded-xl">
                <div>
                  <span className="text-xs font-medium text-on-surface-variant">Location</span>
                  <p className="text-lg font-bold text-on-surface">WH-A / Row 12</p>
                </div>
                <span className="material-symbols-outlined text-secondary/40" style={{ fontVariationSettings: "'FILL' 0" }}>location_on</span>
              </div>
            </div>
            {/* Visual Context Image */}
            <div className="mt-8 rounded-xl overflow-hidden h-40 relative group border border-outline-variant/20">
              <img alt="Warehouse Storage" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBNWC1_jt0RPPYEzH3rV3JPtJ8PYbRT6LhoFmpi1wo2VvoXC5ZnyEAwLpaoh7hRC_w5kzeG6f4hYheK1s163jyFaj7o11ZQVcpiTS7K__U-dPZCgQkuoUxdsrKcEN-q-yrxXUjzNFkQFfj4rd9N9gaf4kNC2FJbnuB8OuOerG8Jnhjx9FBZ9IfwR1mxSego8yLR8QkMDwEjvxEe8WL21m1ru56unkMaDBdLyqfXMCE43qs1yPel6e-sEney9b4aFXlo8CIfy9Akara-" />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/80 to-transparent flex items-end p-4">
                <p className="text-white text-xs font-medium">Verified Location: Zone 4 Warehouse</p>
              </div>
            </div>
          </div>

          {/* Recent History Bento */}
          <div className="bg-surface-container-highest rounded-2xl p-6 border border-outline-variant/10">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-on-surface">Recent Activity</h3>
              <button className="text-xs font-bold text-primary hover:underline">View All</button>
            </div>
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-3 bg-white/50 rounded-lg">
                <div className="w-8 h-8 rounded-full bg-error-container text-error flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 0" }}>remove</span>
                </div>
                <div>
                  <p className="text-xs font-bold text-on-surface">-45 Units</p>
                  <p className="text-[10px] text-on-surface-variant">Damage • Dec 14, 2023</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-white/50 rounded-lg">
                <div className="w-8 h-8 rounded-full bg-secondary-container text-primary flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 0" }}>add</span>
                </div>
                <div>
                  <p className="text-xs font-bold text-on-surface">+120 Units</p>
                  <p className="text-[10px] text-on-surface-variant">Restock • Dec 12, 2023</p>
                </div>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
