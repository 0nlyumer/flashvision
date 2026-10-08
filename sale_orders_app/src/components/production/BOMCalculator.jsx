import FGCombinationBuilder from "../ui/FGCombinationBuilder";
import React, { useState, useRef, useEffect, useMemo } from 'react';
import { useApp } from '../../context/AppContext';

export default function BOMCalculator({ onClose }) {
  const { state } = useApp();
  
  // States
  const [selectedFG, setSelectedFG] = useState('');
  const [targetBatchSize, setTargetBatchSize] = useState('');
  const [fgSearchStr, setFgSearchStr] = useState('');
  const [fgDropdownOpen, setFgDropdownOpen] = useState(false);
  const fgDropdownRef = useRef(null);

  // Manual Component Overrides
  const [manualTankWeights, setManualTankWeights] = useState({
      top: '',
      foam: '',
      adhesive: ''
  });

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (fgDropdownRef.current && !fgDropdownRef.current.contains(event.target)) {
        setFgDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const boms = state.boms || [];
  const activeBOM = useMemo(() => boms.find(b => b.finishedGoodId === selectedFG), [boms, selectedFG]);

  useEffect(() => {
     if (activeBOM) {
         setTargetBatchSize(activeBOM.batchSize);
         setManualTankWeights({ top: '', foam: '', adhesive: '' });
     } else {
         setTargetBatchSize('');
     }
  }, [activeBOM]);

  const finishedGoods = state.items ? state.items.filter(i => i.type === 'Finish Good' || i.category === 'Finished Goods' || i.category === 'Finish Good') : [];
  
  // Filter for only FGs that HAVE a bom
  const bomEnabledFGs = finishedGoods.filter(fg => boms.some(b => b.finishedGoodId === fg.id));
  
  const filteredFGs = bomEnabledFGs.filter(fg => 
    (fg.name && fg.name.toLowerCase().includes(fgSearchStr.toLowerCase())) || 
    (fg.sku && fg.sku.toLowerCase().includes(fgSearchStr.toLowerCase())) ||
    (fg.itemCode && fg.itemCode.toLowerCase().includes(fgSearchStr.toLowerCase()))
  );

  const getPhaseBaseWeight = (materialsKey) => {
      if (!activeBOM || !activeBOM.phases || !activeBOM.phases[materialsKey]) return 0;
      const tBatch = parseFloat(targetBatchSize) || 0;
      const bBatch = parseFloat(activeBOM.batchSize) || 1;
      const batchMultiplier = tBatch / bBatch;

      return activeBOM.phases[materialsKey].reduce((sum, item) => sum + (parseFloat(item.value || item.quantity || 0) * batchMultiplier), 0);
  };

  const renderPhaseTable = (title, subtitle, materialsKey) => {
      if (!activeBOM || !activeBOM.phases) return null;
      const rawMaterials = activeBOM.phases[materialsKey] || [];
      if (rawMaterials.length === 0) return null;

      const tBatch = parseFloat(targetBatchSize) || 0;
      const bBatch = parseFloat(activeBOM.batchSize) || 1;
      const batchMultiplier = tBatch / bBatch;

      let basePhaseWeight = getPhaseBaseWeight(materialsKey);
      let isOverridden = false;
      let finalPhaseWeight = basePhaseWeight;

      if (!title.toLowerCase().includes('packing') && manualTankWeights[materialsKey] !== '') {
          finalPhaseWeight = parseFloat(manualTankWeights[materialsKey]) || 0;
          isOverridden = true;
      }

      const ratioMultiplier = isOverridden && basePhaseWeight > 0 ? (finalPhaseWeight / basePhaseWeight) : 1;

      return (
          <div className="bg-surface p-6 rounded-2xl shadow-sm border border-outline-variant/20 relative">
             <div className="flex justify-between items-center mb-6">
                 <div>
                    <h3 className="text-xl font-bold font-manrope text-on-surface">{title}</h3>
                    <p className="text-sm text-on-surface-variant font-medium mt-1">{subtitle}</p>
                 </div>
             </div>
             
             <div className="space-y-3">
                 {rawMaterials.map((row, idx) => {
                     const baseScaledValue = parseFloat(row.value || row.quantity || 0) * batchMultiplier;
                     const finalValue = baseScaledValue * ratioMultiplier;

                     return (
                         <div key={idx} className="flex gap-4 items-center bg-surface-container-lowest p-3 rounded-xl border border-outline-variant/30 shadow-sm">
                             <div className="flex-1">
                                 <div className="font-semibold text-sm text-on-surface">{row.name}</div>
                             </div>
                             <div className="w-1/3 min-w-[140px] relative">
                                 <input 
                                    type="text" 
                                    readOnly
                                    value={finalValue.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 3 })}
                                    className="w-full bg-surface-container-low border border-transparent rounded-xl pl-4 pr-16 py-2.5 text-sm font-bold text-on-surface focus:outline-none"
                                 />
                                 <div className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-on-surface-variant pointer-events-none">
                                     {title.toLowerCase().includes('packing') ? 'Boxes' : 'KG/Ltr'}
                                 </div>
                             </div>
                         </div>
                     );
                 })}
             </div>

             {/* Total Weight Counter with Manual Target Override */}
             {!title.toLowerCase().includes('packing') && (
                 <div className="mt-6 pt-4 border-t border-outline-variant/20 flex flex-col items-end">
                     {isOverridden && (
                         <span className="text-xs font-bold text-tertiary tracking-wide uppercase mb-2 animate-in fade-in flex items-center gap-1">
                             <span className="material-symbols-outlined text-[14px]">tune</span>
                             Manual Override Active
                         </span>
                     )}
                     <div className={`px-4 py-2 rounded-xl flex items-center gap-4 shadow-sm border transition-colors ${isOverridden ? 'bg-tertiary/10 border-tertiary/30' : 'bg-primary/5 border-primary/20'}`}>
                         <span className={`text-sm font-bold uppercase tracking-wider ${isOverridden ? 'text-tertiary' : 'text-on-surface-variant'}`}>
                             Tank Output (KG/Ltr):
                         </span>
                         <input
                            type="number"
                            value={isOverridden ? manualTankWeights[materialsKey] : finalPhaseWeight.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 3, useGrouping: false })}
                            onChange={(e) => {
                                setManualTankWeights(prev => ({
                                    ...prev,
                                    [materialsKey]: e.target.value
                                }));
                            }}
                            className={`w-32 bg-surface border rounded-lg pl-3 pr-3 text-right py-1.5 text-lg font-black font-manrope focus:outline-none focus:ring-2 transition-colors ${isOverridden ? 'border-tertiary text-tertiary focus:ring-tertiary/50' : 'border-outline-variant/30 text-primary focus:ring-primary/50'}`}
                         />
                     </div>
                 </div>
             )}
          </div>
      );
  };

  return (
    <div className="animate-in fade-in zoom-in-95 duration-300 relative">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8 border-b border-outline-variant/20 pb-6">
          <div className="flex items-center gap-4">
              <button onClick={onClose} className="p-2 bg-surface-container-low hover:bg-surface-container rounded-full text-on-surface transition-colors flex items-center justify-center border border-outline-variant/30 font-bold hover:shadow-md">
                  <span className="material-symbols-outlined font-bold text-xl">arrow_back</span>
              </button>
              <div className="flex-1 space-y-1">
                  <div className="flex items-center gap-2 text-secondary font-bold text-xs tracking-widest uppercase mb-1">
                      <span className="material-symbols-outlined text-sm">calculate</span>
                      Simulation Engine
                  </div>
                  <h2 className="text-3xl font-extrabold text-on-surface tracking-tight font-manrope">BOM Calculator</h2>
              </div>
          </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Formulation Specs */}
          <div className="lg:col-span-2 space-y-6">
              
              <div className="bg-surface-container-lowest p-6 rounded-3xl shadow-[0_10px_30px_rgba(0,0,0,0.02)] border border-outline-variant/10 relative z-10">
                 <h3 className="text-xl font-bold font-manrope text-on-surface mb-6">Simulation Target</h3>
                 <div className="space-y-6">
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                         
                         {/* Searchable FG Dropdown with Configured BOMs Only */}
                         <div className="relative" ref={fgDropdownRef}>
                             <label className="block text-xs uppercase tracking-wider font-bold text-on-surface-variant mb-2">Select Configured Finish Good</label>
                             <div className="flex items-center gap-2">
<div className="relative">
                                 <input 
                                     type="text"
                                     value={selectedFG ? (bomEnabledFGs.find(i => i.id === selectedFG)?.name || '') : fgSearchStr}
                                     onChange={(e) => {
                                         if (selectedFG && e.target.value !== bomEnabledFGs.find(i => i.id === selectedFG)?.name) {
                                            setSelectedFG('');
                                            setTargetBatchSize('');
                                         }
                                         setFgSearchStr(e.target.value);
                                         setFgDropdownOpen(true);
                                     }}
                                     onFocus={() => setFgDropdownOpen(true)}
                                     placeholder="Search configured item..."
                                     className="w-full bg-surface-container-low border border-outline-variant/30 p-4 rounded-xl text-on-surface focus:outline-none focus:border-secondary transition-colors text-sm pr-10"
                                 />
                                 <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none">
                                     search
                                 </span>
                             </div>
<FGCombinationBuilder compact={true} allowCreation={false} onSelectItem={(chosen) => { setSelectedFG(chosen.id); setFgSearchStr(chosen.name); setFgDropdownOpen(false); }} />
</div>

                             {fgDropdownOpen && (
                                 <div className="absolute top-full left-0 right-0 mt-2 bg-surface border border-outline-variant/20 rounded-xl shadow-lg max-h-60 overflow-y-auto z-50 py-2">
                                     {filteredFGs.length > 0 ? filteredFGs.map(fg => (
                                         <div 
                                             key={fg.id}
                                             onClick={() => {
                                                 setSelectedFG(fg.id);
                                                 setFgSearchStr('');
                                                 setFgDropdownOpen(false);
                                             }}
                                             className="px-4 py-3 hover:bg-surface-container-low cursor-pointer transition-colors border-b border-outline-variant/10 last:border-0"
                                         >
                                             <div className="font-bold text-on-surface text-sm">{fg.name}</div>
                                             {fg.sku && <div className="text-xs text-on-surface-variant mt-0.5">{fg.sku}</div>}
                                         </div>
                                     )) : (
                                         <div className="px-4 py-3 text-sm text-on-surface-variant italic">No configured items found.</div>
                                     )}
                                 </div>
                             )}
                         </div>

                         <div>
                             <label className="block text-xs uppercase tracking-wider font-bold text-on-surface-variant mb-2">Target Production Batch Size</label>
                             <div className="relative">
                                 <input 
                                     type="number" 
                                     placeholder="Enter Target Output" 
                                     value={targetBatchSize}
                                     onChange={(e) => setTargetBatchSize(e.target.value)}
                                     disabled={!selectedFG}
                                     className="w-full bg-surface-container-low border border-outline-variant/30 p-4 rounded-xl text-on-surface focus:outline-none focus:border-secondary transition-colors text-sm font-bold disabled:opacity-50"
                                 />
                                 <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-bold text-on-surface-variant pointer-events-none">Meters</span>
                             </div>
                         </div>
                     </div>
                 </div>
              </div>

              {/* Dynamic Phases Render */}
              {selectedFG && activeBOM && (
                 <div className="space-y-6">
                     {renderPhaseTable("TOP Phase", "Auto-scaled chemicals for top layer", "top")}
                     {renderPhaseTable("FOAM Phase", "Auto-scaled chemicals for foam layer", "foam")}
                     {renderPhaseTable("ADHESIVE Phase", "Auto-scaled chemicals for adhesive layer", "adhesive")}
                     {renderPhaseTable("PACKING Phase", "Packing material mapping", "packing")}
                 </div>
              )}
          </div>

          <div className="lg:col-span-1 border-l border-outline-variant/10 pl-8">
              <div className="sticky top-6">
                  {/* Cloth Detail Panel */}
                  <div className="bg-surface-container-lowest rounded-3xl p-6 border border-outline-variant/10 shadow-sm relative overflow-hidden group">
                      <div className="absolute top-0 right-0 w-32 h-32 bg-secondary/5 rounded-bl-full -z-10 group-hover:scale-110 transition-transform"></div>
                      <h3 className="font-bold text-sm tracking-widest uppercase text-on-surface-variant mb-6 inline-flex items-center gap-2">
                          <span className="material-symbols-outlined text-[18px]">texture</span> Cloth Specification
                      </h3>
                      
                      <div className="space-y-4 relative z-10">
                          <div>
                              <p className="text-xs text-on-surface-variant mb-1 font-semibold uppercase tracking-wider">Required Base Cloth</p>
                              <div className="font-bold text-lg text-on-surface">
                                  {activeBOM ? activeBOM.clothName : '-'}
                              </div>
                          </div>
                          
                          <div className="pt-4 border-t border-outline-variant/20">
                              <p className="text-xs text-on-surface-variant mb-1 font-semibold uppercase tracking-wider">Required Target Quantity</p>
                              {(() => {
                                  if (!activeBOM || !targetBatchSize) return <div className="text-xl font-bold text-on-surface">-</div>;
                                  
                                  const baseQty = parseFloat(activeBOM.clothQuantity || activeBOM.clothWeight) || 0;
                                  const targetQtyKG = (baseQty * (parseFloat(targetBatchSize) || 0)) / parseFloat(activeBOM.batchSize || 1);
                                  
                                  const fabricItem = state.items?.find(i => String(i.name).toLowerCase() === String(activeBOM.clothName).toLowerCase());
                                  const quality = fabricItem?.clothQuality || 0;
                                  
                                  return (
                                      <div className="space-y-1">
                                          <div className="flex items-baseline gap-1">
                                              <span className="text-3xl font-black text-secondary font-manrope">
                                                  {targetQtyKG.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 2 })}
                                              </span>
                                              <span className="text-xs font-bold text-on-surface-variant ml-1">KG</span>
                                          </div>
                                          {quality > 0 && (
                                              <div className="text-xs font-bold text-primary flex items-center gap-1 mt-1 bg-primary/5 p-2 rounded-xl border border-primary/10">
                                                  <span className="material-symbols-outlined text-[14px]">sync</span>
                                                  <span>~ {(targetQtyKG * quality).toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 1 })} Meters</span>
                                                  <span className="text-[10px] text-on-surface-variant font-medium">(Yield: 1kg = {quality}m)</span>
                                              </div>
                                          )}
                                      </div>
                                  );
                              })()}
                          </div>
                      </div>
                  </div>

                  {activeBOM && (
                      <div className="mt-6 bg-primary-container p-6 rounded-3xl w-full border border-primary/10 shadow-sm">
                          <div className="flex items-center gap-3 mb-2">
                             <span className="material-symbols-outlined text-on-primary-container">info</span>
                             <h4 className="font-bold text-on-primary-container">Simulation Active</h4>
                          </div>
                          <p className="text-sm text-on-primary-container/80 font-medium leading-relaxed">
                            Formulas are calculating based on a base BOM size of <strong>{activeBOM.batchSize}M</strong> extrapolated to your target output of <strong>{targetBatchSize || 0}M</strong>. Manual tank overrides modify density ratios specifically for the adjusted phase tank without affecting remaining formulation ratios.
                          </p>
                      </div>
                  )}

                  {!activeBOM && (
                    <div className="mt-6 p-6 rounded-3xl border border-dashed border-outline-variant/30 flex flex-col items-center justify-center text-center opacity-60">
                        <span className="material-symbols-outlined text-4xl mb-3">calculate</span>
                        <p className="font-bold text-on-surface-variant text-sm">Select an Item</p>
                        <p className="text-xs text-on-surface-variant mt-1">Choose a configured finished good to run simulations.</p>
                    </div>
                  )}
              </div>
          </div>
      </div>
    </div>
  );
}
