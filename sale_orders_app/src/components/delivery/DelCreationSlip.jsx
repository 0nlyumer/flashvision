import React from 'react';

export default function DelCreationSlip({ onBack }) {
  return (
    <div className="flex-1 animate-in fade-in duration-500 pb-24">
      {/* Breadcrumbs */}
      <div className="flex items-center gap-2 mb-6 text-sm font-medium text-on-surface-variant max-w-6xl mx-auto">
        <button onClick={onBack} className="hover:text-primary transition-colors flex items-center">
          <span className="material-symbols-outlined text-sm mr-1" style={{ fontVariationSettings: "'FILL' 0" }}>arrow_back</span>
          Orders
        </button>
        <span className="material-symbols-outlined text-xs" style={{ fontVariationSettings: "'FILL' 0" }}>chevron_right</span>
        <button onClick={onBack} className="hover:text-primary transition-colors">Delivery Selection</button>
        <span className="material-symbols-outlined text-xs" style={{ fontVariationSettings: "'FILL' 0" }}>chevron_right</span>
        <span className="text-primary font-bold">DC-2024-551</span>
      </div>

      {/* Main Document Container */}
      <div className="max-w-6xl mx-auto flex flex-col gap-8">
        
        {/* Action Toolbar Overlay */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-surface-container-lowest p-6 rounded-xl shadow-[0_20px_40px_rgba(0,28,56,0.06)] sticky top-0 z-30 border border-outline-variant/10">
          <div className="flex flex-col">
            <span className="text-xs font-bold text-on-surface-variant uppercase tracking-widest mb-1">Current Transaction</span>
            <div className="flex items-center gap-3">
              <span className="text-2xl font-black font-headline text-primary">DC-2024-551</span>
              <span className="px-3 py-1 bg-surface-container-high rounded text-xs font-bold text-on-surface">MAY 24, 2024</span>
            </div>
          </div>
          <div className="flex flex-wrap gap-3">
            <button className="flex items-center gap-2 px-5 py-2.5 text-primary font-semibold text-sm hover:bg-surface-container transition-colors rounded-xl outline-none focus:ring-2 focus:ring-primary/20">
              <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 0" }}>print</span>
              Print Challan
            </button>
            <button className="flex items-center gap-2 px-5 py-2.5 text-secondary font-semibold text-sm bg-secondary-container hover:bg-secondary-container/80 transition-colors rounded-xl outline-none focus:ring-2 focus:ring-secondary/20">
              <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 0" }}>picture_as_pdf</span>
              Save as PDF
            </button>
            <button className="flex items-center gap-2 px-5 py-2.5 text-on-surface-variant font-semibold text-sm hover:bg-surface-container transition-colors rounded-xl border border-outline-variant/30 outline-none focus:ring-2 focus:ring-primary/20">
              <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 0" }}>history</span>
              View History
            </button>
            <button className="flex items-center gap-2 px-8 py-2.5 bg-gradient-to-br from-primary to-primary-container text-on-primary font-bold text-sm shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all rounded-xl outline-none">
              <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 0" }}>check_circle</span>
              Finalize Dispatch
            </button>
          </div>
        </div>

        {/* Bento Grid Layout for Details */}
        <div className="grid grid-cols-12 gap-6">
          {/* Section 1: Header Details */}
          <div className="col-span-12 md:col-span-7 bg-surface-container-low p-8 rounded-xl flex flex-col gap-6">
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-xs font-black uppercase tracking-[0.2em] text-primary mb-4">Consignee Details</h2>
                <h3 className="text-xl font-bold font-headline mb-1">Bio-Tech Industries Ltd.</h3>
                <p className="text-on-surface-variant text-sm leading-relaxed max-w-sm">
                  Plot 44-C, Sector 15, Korangi Industrial Area,<br/>
                  Karachi, Pakistan - 74900
                </p>
              </div>
              <div className="text-right">
                <h2 className="text-xs font-black uppercase tracking-[0.2em] text-primary mb-4">Origin</h2>
                <h3 className="text-lg font-bold font-headline mb-1">AJ Synthetic Partnership</h3>
                <p className="text-on-surface-variant text-xs italic">Flashvision Logistics Network</p>
              </div>
            </div>
            
            <div className="h-px bg-outline-variant/20 w-full"></div>
            
            <div className="flex flex-wrap gap-8 sm:gap-12">
              <div>
                <p className="text-[10px] font-bold text-on-surface-variant uppercase mb-1">GST Number</p>
                <p className="font-bold text-sm">12-44-9988-123-11</p>
              </div>
              <div>
                <p className="text-[10px] font-bold text-on-surface-variant uppercase mb-1">Purchase Order</p>
                <p className="font-bold text-sm">PO-SYN-9022</p>
              </div>
              <div>
                <p className="text-[10px] font-bold text-on-surface-variant uppercase mb-1">Warehouse</p>
                <p className="font-bold text-sm">North-Hub WH-4</p>
              </div>
            </div>
          </div>

          {/* Section 2: Logistics & Tracking */}
          <div className="col-span-12 md:col-span-5 bg-primary text-on-primary p-8 rounded-xl flex flex-col justify-between relative overflow-hidden">
            <div className="relative z-10">
              <h2 className="text-xs font-black uppercase tracking-[0.2em] text-primary-fixed/60 mb-6">Logistics Section</h2>
              <div className="flex flex-col gap-5">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-primary-container flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 0" }}>local_shipping</span>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase font-bold text-primary-fixed/60">Vehicle Number</p>
                    <p className="text-lg font-bold">KAE-5582 (Flatbed)</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-primary-container flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 0" }}>person</span>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase font-bold text-primary-fixed/60">Driver Name</p>
                    <p className="text-lg font-bold">Muhammad Arsalan</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-primary-container flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 0" }}>call</span>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase font-bold text-primary-fixed/60">Contact Details</p>
                    <p className="text-lg font-bold">+92 300 1234567</p>
                  </div>
                </div>
              </div>
            </div>
            {/* Decorative element */}
            <div className="absolute -right-12 -bottom-12 w-48 h-48 bg-primary-container rounded-full opacity-20 blur-3xl"></div>
          </div>

          {/* Section 3: Main Item Table */}
          <div className="col-span-12 bg-surface-container-lowest rounded-xl overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.02)] border border-outline-variant/10">
            <div className="overflow-x-auto w-full">
              <table className="w-full border-collapse min-w-[700px]">
                <thead>
                  <tr className="bg-surface-container text-left border-b border-outline-variant/10">
                    <th className="py-4 px-6 text-[10px] font-black uppercase tracking-widest text-on-surface-variant">Item ID</th>
                    <th className="py-4 px-6 text-[10px] font-black uppercase tracking-widest text-on-surface-variant">Item Name / Fabric</th>
                    <th className="py-4 px-6 text-[10px] font-black uppercase tracking-widest text-on-surface-variant">Packing Std</th>
                    <th className="py-4 px-6 text-[10px] font-black uppercase tracking-widest text-on-surface-variant">Size</th>
                    <th className="py-4 px-6 text-[10px] font-black uppercase tracking-widest text-on-surface-variant">Qty (Mtrs)</th>
                    <th className="py-4 px-6 text-[10px] font-black uppercase tracking-widest text-on-surface-variant text-right">Rate (PKR)</th>
                    <th className="py-4 px-6 text-[10px] font-black uppercase tracking-widest text-on-surface-variant text-right">Total Value</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant/10">
                  <tr className="hover:bg-surface-container-low transition-colors">
                    <td className="py-5 px-6 font-mono text-sm">SYN-992-BL</td>
                    <td className="py-5 px-6">
                      <p className="font-bold text-sm">Industrial Nylon Weave</p>
                      <p className="text-xs text-on-surface-variant">Grade-A High Tensile</p>
                    </td>
                    <td className="py-5 px-6 text-sm">Roll</td>
                    <td className="py-5 px-6 text-sm">100m</td>
                    <td className="py-5 px-6 font-bold text-sm">500.00</td>
                    <td className="py-5 px-6 text-sm text-right">1,250.00</td>
                    <td className="py-5 px-6 font-bold text-sm text-right">625,000.00</td>
                  </tr>
                  <tr className="hover:bg-surface-container-low transition-colors">
                    <td className="py-5 px-6 font-mono text-sm">SYN-401-RD</td>
                    <td className="py-5 px-6">
                      <p className="font-bold text-sm">Reinforced Polymer Mesh</p>
                      <p className="text-xs text-on-surface-variant">Waterproof Coating</p>
                    </td>
                    <td className="py-5 px-6 text-sm">Drum</td>
                    <td className="py-5 px-6 text-sm">50m</td>
                    <td className="py-5 px-6 font-bold text-sm">200.00</td>
                    <td className="py-5 px-6 text-sm text-right">3,400.00</td>
                    <td className="py-5 px-6 font-bold text-sm text-right">680,000.00</td>
                  </tr>
                  <tr className="hover:bg-surface-container-low transition-colors">
                    <td className="py-5 px-6 font-mono text-sm">ACC-002-FT</td>
                    <td className="py-5 px-6">
                      <p className="font-bold text-sm">Synthetic Fastener Strips</p>
                      <p className="text-xs text-on-surface-variant">Industrial Adhesive Back</p>
                    </td>
                    <td className="py-5 px-6 text-sm">Box</td>
                    <td className="py-5 px-6 text-sm">10m</td>
                    <td className="py-5 px-6 font-bold text-sm">50.00</td>
                    <td className="py-5 px-6 text-sm text-right">850.00</td>
                    <td className="py-5 px-6 font-bold text-sm text-right">42,500.00</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Section 4: Summary & Signatures */}
          <div className="col-span-12 md:col-span-6 bg-surface-container-low p-8 rounded-xl">
            <h2 className="text-xs font-black uppercase tracking-[0.2em] text-primary mb-8">Authentication</h2>
            <div className="grid grid-cols-2 gap-8 sm:gap-12 mt-4">
              <div className="flex flex-col gap-12">
                <div className="border-b border-outline-variant/50 w-full h-12 flex items-end pb-1">
                  <span className="text-[10px] text-on-surface-variant italic">E-Signed: Flashvision System</span>
                </div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant text-center">Issued By (Flashvision)</p>
              </div>
              <div className="flex flex-col gap-12">
                <div className="border-b border-outline-variant/30 w-full h-12"></div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant text-center">Received By (Consignee)</p>
              </div>
            </div>
            <div className="mt-8 p-4 bg-tertiary-fixed rounded-lg border border-tertiary/10">
              <p className="text-[10px] text-on-tertiary-fixed-variant leading-relaxed font-medium">
                <strong>Declaration:</strong> Goods once sold will not be taken back. This document serves as a proof of physical transfer of inventory from AJ Synthetic Hub to Bio-Tech Industries.
              </p>
            </div>
          </div>

          {/* Pricing Block */}
          <div className="col-span-12 md:col-span-6 bg-surface-container-lowest p-8 rounded-xl border border-outline-variant/10 shadow-sm flex flex-col justify-end">
            <div className="flex flex-col gap-4">
              <div className="flex justify-between items-center text-on-surface-variant">
                <span className="text-sm font-medium">Subtotal (Net Value)</span>
                <span className="font-bold">PKR 1,347,500.00</span>
              </div>
              <div className="flex justify-between items-center text-on-surface-variant">
                <span className="text-sm font-medium">Sales Tax (GST 17%)</span>
                <span className="font-bold">PKR 229,075.00</span>
              </div>
              <div className="flex justify-between items-center text-on-surface-variant">
                <span className="text-sm font-medium">Logistic Surcharge</span>
                <span className="font-bold">PKR 12,500.00</span>
              </div>
              
              <div className="h-px bg-outline-variant/20 my-2"></div>
              
              <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2">
                <span className="text-lg font-black font-headline text-on-surface">Grand Total</span>
                <div className="sm:text-right">
                  <span className="text-2xl font-black font-headline text-primary block">PKR 1,589,075.00</span>
                  <p className="text-[10px] font-bold text-on-surface-variant uppercase mt-1">One Million five hundred eighty nine thousand...</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer System Info */}
        <footer className="flex flex-col sm:flex-row justify-between items-center py-6 text-[10px] font-bold text-on-surface-variant/40 uppercase tracking-[0.15em] sm:tracking-[0.25em] gap-2 text-center sm:text-left">
          <span>Flashvision Logistics Engine v4.2.0</span>
          <span>Timestamp: 2024-05-24 14:22:11</span>
          <span className="hidden sm:inline">Security Hash: 8821-XFA-[...]</span>
        </footer>
      </div>
    </div>
  );
}
