import React, { useState, useMemo, useRef, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import {
  DEFAULT_FG_CONFIG,
  generateFGDisplayName,
  matchItemToCombination,
  createFinishedGoodFromCombo,
  getCombinationBadgeList
} from '../../utils/fgCombinationUtils';
import FGQuickConfigModal from './FGQuickConfigModal';

export default function FGCombinationBuilder({
  onSelectItem,
  allowCreation = false,
  allowQuickConfig = true,
  className = '',
  buttonClassName = '',
  compact = false,
  placeholder = 'Combination Builder'
}) {
  const { state } = useApp();
  const [isOpen, setIsOpen] = useState(false);
  const [isQuickConfigOpen, setIsQuickConfigOpen] = useState(false);

  // Configuration options from global state or defaults
  const config = state.fg_combinations_config || DEFAULT_FG_CONFIG;
  const masking = config.masking || DEFAULT_FG_CONFIG.masking;

  // Combination selection state
  const [combo, setCombo] = useState({
    paperCode: '',
    baseItem: '',
    color: '',
    layers: '',
    fabricName: '',
    fabricColor: '',
    packing: ''
  });

  const popoverRef = useRef(null);

  // Close when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (popoverRef.current && !popoverRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  // Compute available fabric colors based on selected fabric
  const availableFabricColors = useMemo(() => {
    if (!combo.fabricName) return [];
    const found = (config.fabrics || []).find(f => f.name === combo.fabricName);
    return found ? found.colors || [] : [];
  }, [combo.fabricName, config.fabrics]);

  // Count active attributes
  const activeAttributeCount = useMemo(() => {
    return Object.values(combo).filter(Boolean).length;
  }, [combo]);

  // Generated dynamic preview name
  const generatedName = useMemo(() => {
    return generateFGDisplayName(combo, masking);
  }, [combo, masking]);

  // Finished Goods list from state.items
  const finishedGoods = useMemo(() => {
    return (state.items || []).filter(i => i.category === 'Finished Goods' || i.type === 'Finish Good');
  }, [state.items]);

  // Matching items
  const matchingItems = useMemo(() => {
    if (activeAttributeCount === 0) return [];
    return finishedGoods.filter(item => matchItemToCombination(item, combo));
  }, [finishedGoods, combo, activeAttributeCount]);

  const exactMatchExists = useMemo(() => {
    if (!generatedName) return false;
    return finishedGoods.some(i => (i.name || '').toLowerCase() === generatedName.toLowerCase());
  }, [finishedGoods, generatedName]);

  const handleSelectField = (field, value) => {
    setCombo(prev => {
      const next = { ...prev, [field]: value };
      if (field === 'fabricName') {
        next.fabricColor = ''; // Reset fabric color if fabric changed
      }
      return next;
    });
  };

  const handleReset = () => {
    setCombo({
      paperCode: '',
      baseItem: '',
      color: '',
      layers: '',
      fabricName: '',
      fabricColor: '',
      packing: ''
    });
  };

  const handleChooseItem = (item) => {
    if (onSelectItem) {
      onSelectItem(item);
    }
    setIsOpen(false);
  };

  const handleCreateNew = () => {
    if (!allowCreation || !generatedName) return;
    const newItem = createFinishedGoodFromCombo(combo, state.items, masking);
    if (onSelectItem) {
      onSelectItem(newItem);
    }
    setIsOpen(false);
  };

  return (
    <div className={`relative inline-block ${className}`} ref={popoverRef}>
      {/* Toggle Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        title="Open Finished Goods Combination Builder"
        className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all border ${
          isOpen || activeAttributeCount > 0
            ? 'bg-cyan-500/15 border-cyan-500 text-cyan-600 dark:text-cyan-400 shadow-sm'
            : 'bg-surface-container-low hover:bg-surface-container border-outline-variant/30 text-on-surface-variant hover:text-on-surface'
        } ${buttonClassName}`}
      >
        <span className="material-symbols-outlined text-[18px]">
          {activeAttributeCount > 0 ? 'view_in_ar' : 'tune'}
        </span>
        {!compact && <span>{placeholder}</span>}
        {activeAttributeCount > 0 && (
          <span className="w-5 h-5 rounded-full bg-cyan-600 text-white text-[10px] font-black flex items-center justify-center shrink-0">
            {activeAttributeCount}
          </span>
        )}
      </button>

      {/* Popover Builder Interface */}
      {isOpen && (
        <div className="absolute z-50 left-0 sm:left-auto sm:right-0 mt-2 w-[95vw] sm:w-[620px] max-w-[650px] bg-surface-container-lowest border border-outline-variant/30 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.25)] p-5 text-on-surface animate-in fade-in zoom-in-95 duration-200">
          
          {/* Header */}
          <div className="flex items-center justify-between pb-3 mb-4 border-b border-outline-variant/15">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-cyan-500/15 text-cyan-600 dark:text-cyan-400 flex items-center justify-center">
                <span className="material-symbols-outlined text-[18px]">dashboard_customize</span>
              </div>
              <div>
                <h3 className="text-sm font-extrabold text-on-surface flex items-center gap-2">
                  FG Combination Builder
                  <span className="text-[9px] uppercase tracking-wider font-black px-1.5 py-0.5 rounded bg-cyan-500/15 text-cyan-600 border border-cyan-500/30">
                    Synthetic Leather
                  </span>
                </h3>
                <p className="text-[11px] text-on-surface-variant">
                  {allowCreation ? 'Segmented attribute builder with instant item creation' : 'Multi-attribute filter for Finished Goods'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              {allowQuickConfig && (
                <button
                  type="button"
                  onClick={() => setIsQuickConfigOpen(true)}
                  className="p-1.5 rounded-lg hover:bg-surface-container text-on-surface-variant hover:text-cyan-600 transition-colors"
                  title="Configure Attributes & Masking Rules"
                >
                  <span className="material-symbols-outlined text-[18px]">settings</span>
                </button>
              )}
              {activeAttributeCount > 0 && (
                <button
                  type="button"
                  onClick={handleReset}
                  className="text-[11px] font-bold text-red-500 hover:underline px-2 py-1"
                >
                  Reset
                </button>
              )}
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-lg hover:bg-surface-container text-on-surface-variant hover:text-on-surface"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>
          </div>

          {/* Segmented Attribute Dropdowns Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-4">
            
            {/* 1. Paper / Texture Code */}
            <div>
              <label className="text-[10px] font-extrabold uppercase tracking-wider text-on-surface-variant block mb-1">
                Paper / Texture
              </label>
              <select
                value={combo.paperCode}
                onChange={(e) => handleSelectField('paperCode', e.target.value)}
                className="w-full bg-surface border border-outline-variant/30 rounded-xl px-2.5 py-2 text-xs font-bold text-on-surface focus:ring-2 focus:ring-cyan-500/30 outline-none"
              >
                <option value="">Any Texture</option>
                {(config.paperCodes || []).map(p => (
                  <option key={p.id} value={p.code}>
                    {p.code} ({p.name})
                  </option>
                ))}
              </select>
            </div>

            {/* 2. Base Item / Gauge */}
            <div>
              <label className="text-[10px] font-extrabold uppercase tracking-wider text-on-surface-variant block mb-1">
                Item / Gauge
              </label>
              <select
                value={combo.baseItem}
                onChange={(e) => handleSelectField('baseItem', e.target.value)}
                className="w-full bg-surface border border-outline-variant/30 rounded-xl px-2.5 py-2 text-xs font-bold text-on-surface focus:ring-2 focus:ring-cyan-500/30 outline-none"
              >
                <option value="">Any Gauge</option>
                {(config.gauges || []).map(g => (
                  <option key={g.id} value={g.name}>
                    {g.name}
                  </option>
                ))}
              </select>
            </div>

            {/* 3. Top Color */}
            <div>
              <label className="text-[10px] font-extrabold uppercase tracking-wider text-on-surface-variant block mb-1">
                Top Color
              </label>
              <select
                value={combo.color}
                onChange={(e) => handleSelectField('color', e.target.value)}
                className="w-full bg-surface border border-outline-variant/30 rounded-xl px-2.5 py-2 text-xs font-bold text-on-surface focus:ring-2 focus:ring-cyan-500/30 outline-none"
              >
                <option value="">Any Color</option>
                {(config.colors || []).map(c => (
                  <option key={c.id} value={c.name}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            {/* 4. Layers */}
            <div>
              <label className="text-[10px] font-extrabold uppercase tracking-wider text-on-surface-variant block mb-1">
                Layers
              </label>
              <select
                value={combo.layers}
                onChange={(e) => handleSelectField('layers', e.target.value)}
                className="w-full bg-surface border border-outline-variant/30 rounded-xl px-2.5 py-2 text-xs font-bold text-on-surface focus:ring-2 focus:ring-cyan-500/30 outline-none"
              >
                <option value="">Any Layer</option>
                {(config.layers || []).map(l => (
                  <option key={l.id} value={l.name}>
                    {l.name}
                  </option>
                ))}
              </select>
            </div>

            {/* 5. Backing Fabric */}
            <div>
              <label className="text-[10px] font-extrabold uppercase tracking-wider text-on-surface-variant block mb-1">
                Backing Fabric
              </label>
              <select
                value={combo.fabricName}
                onChange={(e) => handleSelectField('fabricName', e.target.value)}
                className="w-full bg-surface border border-outline-variant/30 rounded-xl px-2.5 py-2 text-xs font-bold text-on-surface focus:ring-2 focus:ring-cyan-500/30 outline-none"
              >
                <option value="">Any Fabric</option>
                {(config.fabrics || []).map(f => (
                  <option key={f.id} value={f.name}>
                    {f.name}
                  </option>
                ))}
              </select>
            </div>

            {/* 6. Fabric Color */}
            <div>
              <label className="text-[10px] font-extrabold uppercase tracking-wider text-on-surface-variant block mb-1">
                Fabric Color
              </label>
              <select
                value={combo.fabricColor}
                onChange={(e) => handleSelectField('fabricColor', e.target.value)}
                disabled={!combo.fabricName || availableFabricColors.length === 0}
                className="w-full bg-surface border border-outline-variant/30 rounded-xl px-2.5 py-2 text-xs font-bold text-on-surface focus:ring-2 focus:ring-cyan-500/30 outline-none disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <option value="">Any Fabric Color</option>
                {availableFabricColors.map((col, idx) => (
                  <option key={idx} value={col}>
                    {col}
                  </option>
                ))}
              </select>
            </div>

            {/* 7. Packing (Masked attribute) */}
            <div className="col-span-2 sm:col-span-3">
              <div className="flex items-center justify-between mb-1">
                <label className="text-[10px] font-extrabold uppercase tracking-wider text-on-surface-variant">
                  Packing Specification
                </label>
                {masking.maskPacking && (
                  <span className="text-[9px] font-semibold text-amber-600 dark:text-amber-400 flex items-center gap-1">
                    <span className="material-symbols-outlined text-[12px]">visibility_off</span>
                    Masked from display title
                  </span>
                )}
              </div>
              <select
                value={combo.packing}
                onChange={(e) => handleSelectField('packing', e.target.value)}
                className="w-full bg-surface border border-outline-variant/30 rounded-xl px-3 py-2 text-xs font-bold text-on-surface focus:ring-2 focus:ring-cyan-500/30 outline-none"
              >
                <option value="">Select Packing Type (Optional)</option>
                {(config.packings || []).map(pk => (
                  <option key={pk.id} value={pk.name}>
                    {pk.name} ({pk.size} {pk.uom})
                  </option>
                ))}
              </select>
            </div>

          </div>

          {/* Dynamic Combination Identity Banner */}
          {generatedName && (
            <div className="p-3.5 bg-gradient-to-r from-cyan-500/10 via-blue-500/10 to-indigo-500/10 border border-cyan-500/30 rounded-xl mb-4">
              <div className="text-[10px] font-black uppercase tracking-widest text-cyan-600 dark:text-cyan-400 mb-1 flex items-center gap-1">
                <span className="material-symbols-outlined text-[13px]">verified</span>
                Standard Identity Name
              </div>
              <div className="font-extrabold text-xs text-on-surface font-headline break-words">
                {generatedName}
              </div>
              {combo.packing && masking.maskPacking && (
                <div className="mt-1.5 flex items-center gap-1 text-[10px] text-on-surface-variant font-medium">
                  <span className="font-bold">Packing Attribute:</span> {combo.packing}
                  <span className="text-amber-600 font-semibold">(Preserved in DB)</span>
                </div>
              )}
            </div>
          )}

          {/* Matching Results List */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-on-surface-variant px-1">
              <span>Matching Finished Goods ({matchingItems.length})</span>
              {activeAttributeCount === 0 && (
                <span className="text-[11px] font-normal italic">Select attributes to filter</span>
              )}
            </div>

            <div className="max-h-48 overflow-y-auto space-y-1.5 pr-1">
              {matchingItems.map(item => (
                <div
                  key={item.id}
                  onClick={() => handleChooseItem(item)}
                  className="p-3 bg-surface hover:bg-cyan-500/10 border border-outline-variant/20 hover:border-cyan-500/40 rounded-xl cursor-pointer transition-all flex items-center justify-between group"
                >
                  <div className="flex-1 pr-3">
                    <div className="font-bold text-xs text-on-surface group-hover:text-cyan-600 transition-colors">
                      {item.name}
                    </div>
                    <div className="flex items-center gap-2 mt-1 flex-wrap">
                      <span className="font-mono text-[10px] font-bold bg-surface-container-high px-1.5 py-0.5 rounded border border-outline-variant/20">
                        {item.sku}
                      </span>
                      <span className="text-[10px] font-semibold text-tertiary">
                        Stock: {item.stock || 0} {item.unit || item.uom || 'm'}
                      </span>
                      {item.price > 0 && (
                        <span className="text-[10px] font-semibold text-primary">
                          Rate: {item.price}
                        </span>
                      )}
                    </div>
                  </div>
                  <button
                    type="button"
                    className="px-3 py-1.5 rounded-lg bg-cyan-600 text-white text-[11px] font-bold opacity-0 group-hover:opacity-100 transition-opacity shrink-0"
                  >
                    Select
                  </button>
                </div>
              ))}

              {activeAttributeCount > 0 && matchingItems.length === 0 && (
                <div className="p-4 text-center border border-dashed border-outline-variant/30 rounded-xl bg-surface">
                  <p className="text-xs font-semibold text-on-surface-variant">
                    No matching Finished Good found in database.
                  </p>
                </div>
              )}
            </div>

            {/* Sales Order Creation Action */}
            {allowCreation && activeAttributeCount >= 2 && !exactMatchExists && generatedName && (
              <div className="pt-3 border-t border-outline-variant/15 flex items-center justify-between gap-3 bg-surface-container-low p-3 rounded-xl mt-3">
                <div className="text-[11px] text-on-surface-variant">
                  This combination does not exist yet. Register it now for this Sales Order:
                </div>
                <button
                  type="button"
                  onClick={handleCreateNew}
                  className="bg-primary hover:bg-primary/90 text-white text-xs font-bold px-3.5 py-2 rounded-xl flex items-center gap-1.5 shrink-0 shadow-sm transition-all active:scale-95"
                >
                  <span className="material-symbols-outlined text-[16px]">add_circle</span>
                  + Register As New FG
                </button>
              </div>
            )}
          </div>

        </div>
      )}

      {/* Quick Config Modal */}
      {allowQuickConfig && (
        <FGQuickConfigModal
          isOpen={isQuickConfigOpen}
          onClose={() => setIsQuickConfigOpen(false)}
        />
      )}
    </div>
  );
}
