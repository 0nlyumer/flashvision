import React from 'react';

export default function InvStock() {
  return (
    <div className="animate-in fade-in duration-500 max-w-[1400px] mx-auto pb-24">
      {/* Header Form */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-6">
        <div>
          <nav className="flex text-xs text-on-surface-variant mb-2 gap-2">
            <span>Inventory</span>
            <span>/</span>
            <span className="text-primary font-semibold">Stock List</span>
          </nav>
          <h1 className="text-4xl font-extrabold tracking-tight text-on-surface brand-font">Stock Inventory</h1>
          <p className="text-on-surface-variant mt-2 max-w-xl">Real-time oversight of synthetic assets across global fulfillment nodes. Maintain precision in your logistic flows.</p>
        </div>
        <div className="flex gap-3">
          <button className="px-6 py-2.5 rounded-xl border border-outline-variant bg-surface-container-lowest text-primary font-semibold hover:bg-surface-container transition-colors flex items-center gap-2">
            <span className="material-symbols-outlined text-lg" style={{ fontVariationSettings: "'FILL' 0" }}>tune</span>
            Stock Adjustment
          </button>
          <button className="px-6 py-2.5 rounded-xl bg-gradient-to-br from-primary to-primary-container text-white font-semibold hover:shadow-lg active:scale-95 transition-all flex items-center gap-2">
            <span className="material-symbols-outlined text-lg" style={{ fontVariationSettings: "'FILL' 0" }}>add_circle</span>
            Add New Item
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-surface-container-low rounded-2xl p-6 mb-8 flex flex-wrap items-center gap-6 border border-outline-variant/10">
        <div className="flex-1 min-w-[300px] relative">
          <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline" style={{ fontVariationSettings: "'FILL' 0" }}>search</span>
          <input className="w-full bg-surface-container-lowest border-none outline-none ring-1 ring-outline-variant/20 focus:ring-2 focus:ring-primary rounded-xl py-3 pl-12 pr-4 text-sm font-medium" placeholder="Search by ID, name, or SKU..." type="text"/>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex flex-col">
            <span className="text-[10px] uppercase tracking-wider font-bold text-on-surface-variant mb-1 ml-1">Category</span>
            <select className="bg-surface-container-lowest border-none ring-1 ring-outline-variant/20 rounded-xl py-2 px-4 text-sm font-medium min-w-[160px] focus:ring-2 focus:ring-primary outline-none">
              <option>All Categories</option>
              <option>Synthetic Polymers</option>
              <option>Liquid Resins</option>
              <option>Aero-composites</option>
            </select>
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] uppercase tracking-wider font-bold text-on-surface-variant mb-1 ml-1">Warehouse</span>
            <select className="bg-surface-container-lowest border-none ring-1 ring-outline-variant/20 rounded-xl py-2 px-4 text-sm font-medium min-w-[160px] focus:ring-2 focus:ring-primary outline-none">
              <option>Global Nodes</option>
              <option>Berlin-North Hub</option>
              <option>Singapore-04</option>
              <option>Austin-Central</option>
            </select>
          </div>
          <button className="mt-5 p-2.5 text-on-surface-variant hover:text-primary hover:bg-white rounded-xl transition-all">
            <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 0" }}>filter_list</span>
          </button>
        </div>
      </div>

      {/* Inventory Table (Bento Style Card) */}
      <div className="bg-surface-container-lowest rounded-2xl overflow-hidden border border-outline-variant/10 shadow-[0_20px_40px_rgba(0,28,56,0.06)] mb-12">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[1000px]">
            <thead>
              <tr className="bg-surface-container text-on-surface-variant text-[11px] font-bold uppercase tracking-widest border-b border-outline-variant/10">
                <th className="px-8 py-5">Item ID</th>
                <th className="px-6 py-5">Product Details</th>
                <th className="px-6 py-5">Category</th>
                <th className="px-6 py-5">Warehouse</th>
                <th className="px-6 py-5">Stock Level</th>
                <th className="px-6 py-5">UOM</th>
                <th className="px-6 py-5">Last Sync</th>
                <th className="px-8 py-5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="text-sm divide-y divide-outline-variant/10">
              <tr className="hover:bg-surface-container-low transition-colors group">
                <td className="px-8 py-6 font-mono font-medium text-primary">#FV-9021-X</td>
                <td className="px-6 py-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-secondary-container/30 flex items-center justify-center text-primary">
                      <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 0" }}>science</span>
                    </div>
                    <div>
                      <div className="font-bold text-on-surface">Neo-Polymer V2</div>
                      <div className="text-[11px] text-on-surface-variant">High-density industrial grade</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-6">
                  <span className="px-3 py-1 rounded-full bg-primary-fixed text-on-primary-fixed-variant text-[10px] font-bold">SYNTHETICS</span>
                </td>
                <td className="px-6 py-6 text-on-surface-variant font-medium">Berlin-North</td>
                <td className="px-6 py-6">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-on-surface">1,240.00</span>
                    <div className="w-12 h-1.5 rounded-full bg-surface-container-high overflow-hidden">
                      <div className="bg-primary h-full" style={{width: '85%'}}></div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-6 text-on-surface-variant">KG</td>
                <td className="px-6 py-6 text-on-surface-variant">2h ago</td>
                <td className="px-8 py-6 text-right">
                  <button className="opacity-0 group-hover:opacity-100 text-outline hover:text-primary transition-all">
                    <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 0" }}>more_vert</span>
                  </button>
                </td>
              </tr>
              <tr className="bg-surface-container-low/30 hover:bg-surface-container-low transition-colors group">
                <td className="px-8 py-6 font-mono font-medium text-primary">#FV-1188-B</td>
                <td className="px-6 py-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-secondary-container/30 flex items-center justify-center text-primary">
                      <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 0" }}>opacity</span>
                    </div>
                    <div>
                      <div className="font-bold text-on-surface">ClearResin Alpha</div>
                      <div className="text-[11px] text-on-surface-variant">Optical transparency resin</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-6">
                  <span className="px-3 py-1 rounded-full bg-secondary-container text-on-secondary-container text-[10px] font-bold">LIQUIDS</span>
                </td>
                <td className="px-6 py-6 text-on-surface-variant font-medium">Singapore-04</td>
                <td className="px-6 py-6">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-tertiary">42.00</span>
                    <div className="w-12 h-1.5 rounded-full bg-surface-container-high overflow-hidden">
                      <div className="bg-tertiary h-full" style={{width: '15%'}}></div>
                    </div>
                  </div>
                  <span className="text-[10px] text-tertiary font-bold">CRITICAL LOW</span>
                </td>
                <td className="px-6 py-6 text-on-surface-variant">Ltrs</td>
                <td className="px-6 py-6 text-on-surface-variant">12m ago</td>
                <td className="px-8 py-6 text-right">
                  <button className="opacity-0 group-hover:opacity-100 text-outline hover:text-primary transition-all">
                    <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 0" }}>more_vert</span>
                  </button>
                </td>
              </tr>
              <tr className="hover:bg-surface-container-low transition-colors group">
                <td className="px-8 py-6 font-mono font-medium text-primary">#FV-5542-C</td>
                <td className="px-6 py-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-secondary-container/30 flex items-center justify-center text-primary">
                      <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 0" }}>layers</span>
                    </div>
                    <div>
                      <div className="font-bold text-on-surface">Carbon Fiber Roll</div>
                      <div className="text-[11px] text-on-surface-variant">3K Twill Weave 200gsm</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-6">
                  <span className="px-3 py-1 rounded-full bg-tertiary-fixed text-on-tertiary-fixed-variant text-[10px] font-bold">COMPOSITES</span>
                </td>
                <td className="px-6 py-6 text-on-surface-variant font-medium">Austin-Central</td>
                <td className="px-6 py-6">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-on-surface">850.00</span>
                    <div className="w-12 h-1.5 rounded-full bg-surface-container-high overflow-hidden">
                      <div className="bg-primary h-full" style={{width: '60%'}}></div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-6 text-on-surface-variant">SQM</td>
                <td className="px-6 py-6 text-on-surface-variant">Yesterday</td>
                <td className="px-8 py-6 text-right">
                  <button className="opacity-0 group-hover:opacity-100 text-outline hover:text-primary transition-all">
                    <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 0" }}>more_vert</span>
                  </button>
                </td>
              </tr>
              <tr className="bg-surface-container-low/30 hover:bg-surface-container-low transition-colors group">
                <td className="px-8 py-6 font-mono font-medium text-primary">#FV-2291-M</td>
                <td className="px-6 py-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-secondary-container/30 flex items-center justify-center text-primary">
                      <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 0" }}>precision_manufacturing</span>
                    </div>
                    <div>
                      <div className="font-bold text-on-surface">Micro-Actuator A1</div>
                      <div className="text-[11px] text-on-surface-variant">High-torque robotic joint</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-6">
                  <span className="px-3 py-1 rounded-full bg-primary-fixed text-on-primary-fixed-variant text-[10px] font-bold">ELECTRONICS</span>
                </td>
                <td className="px-6 py-6 text-on-surface-variant font-medium">Singapore-04</td>
                <td className="px-6 py-6">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-on-surface">3,400.00</span>
                    <div className="w-12 h-1.5 rounded-full bg-surface-container-high overflow-hidden">
                      <div className="bg-primary h-full" style={{width: '95%'}}></div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-6 text-on-surface-variant">Units</td>
                <td className="px-6 py-6 text-on-surface-variant">4h ago</td>
                <td className="px-8 py-6 text-right">
                  <button className="opacity-0 group-hover:opacity-100 text-outline hover:text-primary transition-all">
                    <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 0" }}>more_vert</span>
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        {/* Pagination */}
        <div className="px-8 py-6 bg-surface-container-low border-t border-outline-variant/10 flex items-center justify-between">
          <div className="text-xs text-on-surface-variant font-medium">
            Showing <span className="text-on-surface">1 - 4</span> of 248 items
          </div>
          <div className="flex gap-2">
            <button className="p-2 rounded-lg border border-outline-variant hover:bg-white text-on-surface-variant transition-all">
              <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 0" }}>chevron_left</span>
            </button>
            <button className="px-4 py-2 rounded-lg bg-primary text-white text-xs font-bold">1</button>
            <button className="px-4 py-2 rounded-lg hover:bg-white text-on-surface-variant text-xs font-bold transition-all">2</button>
            <button className="px-4 py-2 rounded-lg hover:bg-white text-on-surface-variant text-xs font-bold transition-all">3</button>
            <button className="p-2 rounded-lg border border-outline-variant hover:bg-white text-on-surface-variant transition-all">
              <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 0" }}>chevron_right</span>
            </button>
          </div>
        </div>
      </div>

      {/* System Stats Asymmetric Footer */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-8 rounded-[2rem] bg-primary text-on-primary flex flex-col justify-between shadow-[0_20px_40px_rgba(0,28,56,0.06)] relative overflow-hidden">
          <div className="relative z-10">
            <h3 className="text-sm font-bold opacity-80 mb-6 uppercase tracking-widest">Total Valuation</h3>
            <div className="text-4xl font-extrabold brand-font">$4.2M</div>
            <p className="text-xs mt-2 opacity-70">+12% from last quarter</p>
          </div>
          {/* Abstract decorative element border-none ring-0 */}
          <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
        </div>
        <div className="md:col-span-2 p-8 rounded-[2rem] bg-surface-container-high flex items-center gap-10">
          <div className="flex-1">
            <h3 className="text-sm font-bold text-on-surface-variant mb-4 uppercase tracking-widest">Operational Health</h3>
            <div className="flex items-center gap-4 mb-2">
              <div className="text-2xl font-bold">98.4%</div>
              <div className="flex-1 h-3 rounded-full bg-surface-container flex overflow-hidden">
                <div className="bg-primary w-[98%] h-full rounded-full"></div>
              </div>
            </div>
            <p className="text-[11px] text-on-surface-variant">Global warehouse synchronization is optimal. 2 nodes reporting minor latency.</p>
          </div>
          <div className="hidden lg:block w-32 h-20 rounded-2xl bg-white p-4 shadow-[0_10px_20px_rgba(0,28,56,0.03)] border border-outline-variant/10">
            <div className="text-[10px] font-bold text-outline mb-2">SYNC RATE</div>
            <div className="flex items-end gap-1 h-8">
              <div className="w-2 bg-primary/20 h-4 rounded-t-sm"></div>
              <div className="w-2 bg-primary/40 h-6 rounded-t-sm"></div>
              <div className="w-2 bg-primary/60 h-5 rounded-t-sm"></div>
              <div className="w-2 bg-primary h-8 rounded-t-sm"></div>
              <div class="w-2 bg-primary/80 h-7 rounded-t-sm"></div>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
