import React, { useState, useMemo, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useApp } from '../../context/AppContext';
import {
  DEFAULT_FG_CONFIG,
  generateFGDisplayName,
  matchItemToCombination,
  createFinishedGoodFromCombo
} from '../../utils/fgCombinationUtils';
import FGQuickConfigModal from './FGQuickConfigModal';

export default function FGCombinationBuilder({
  onSelectItem,
  allowCreation = false,
  allowQuickConfig = true,
  placeholder = 'Builder',
  compact = true,
  buttonClassName = ''
}) {
  const { state } = useApp();
  const [isOpen, setIsOpen] = useState(false);
  const [isQuickConfigOpen, setIsQuickConfigOpen] = useState(false);

  const triggerRef = useRef(null);
  const panelRef = useRef(null);
  const [panelCoords, setPanelCoords] = useState({ top: 0, left: 0, width: 1040 });

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

  // Available fabric colors based on selected fabric
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
    const newItem = createFinishedGoodFromCombo(combo, config, finishedGoods.length + 1);
    if (onSelectItem) {
      onSelectItem(newItem);
    }
    setIsOpen(false);
  };

  // Auto-adjust positioning according to table position and screen boundaries
  const updateCoordinates = () => {
    if (!triggerRef.current) return;
    const rect = triggerRef.current.getBoundingClientRect();
    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;

    // Desired width for single horizontal row
    const targetWidth = Math.min(1080, screenWidth - 32);

    // Default left aligns with trigger
    let left = rect.left;

    // If panel would overflow the right edge of the screen, shift it left
    if (left + targetWidth > screenWidth - 16) {
      left = screenWidth - 16 - targetWidth;
    }

    // CRITICAL: Guarantee it NEVER goes off-screen to the left (prevents clipping into sidebar)
    if (left < 16) {
      left = 16;
    }

    // Vertical positioning: below trigger if space available, otherwise above
    const estimatedHeight = 110;
    const spaceBelow = screenHeight - rect.bottom;
    let top = rect.bottom + 6;

    if (spaceBelow < estimatedHeight + 10 && rect.top > estimatedHeight + 10) {
      top = rect.top - estimatedHeight - 6;
    }

    setPanelCoords({
      top: Math.round(top),
      left: Math.round(left),
      width: Math.round(targetWidth)
    });
  };

  useEffect(() => {
    if (!isOpen) return;
    updateCoordinates();

    const handleScrollOrResize = () => {
      updateCoordinates();
    };

    window.addEventListener('resize', handleScrollOrResize);
    window.addEventListener('scroll', handleScrollOrResize, true);

    const handleClickOutside = (e) => {
      if (
        (triggerRef.current && triggerRef.current.contains(e.target)) ||
        (panelRef.current && panelRef.current.contains(e.target)) ||
        e.target.closest('[role="dialog"]')
      ) {
        return;
      }
      setIsOpen(false);
    };

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('resize', handleScrollOrResize);
      window.removeEventListener('scroll', handleScrollOrResize, true);
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  return (
    <div className="relative inline-flex items-center shrink-0" ref={triggerRef}>
      {/* 1. Toggle Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        title={isOpen ? "Hide Combination Builder" : "Open Finished Goods Combination Builder"}
        className={`flex items-center gap-1.5 px-3 py-2.5 rounded-xl text-xs font-bold transition-all border shrink-0 shadow-sm ${
          isOpen
            ? 'bg-primary/10 border-primary text-primary ring-2 ring-primary/20'
            : activeAttributeCount > 0
            ? 'bg-primary/10 border-primary/50 text-primary hover:bg-primary/20'
            : 'bg-surface hover:bg-surface-container-low border-outline-variant/50 text-on-surface'
        } ${buttonClassName}`}
      >
        <span className="material-symbols-outlined text-[17px]">
          {isOpen ? 'expand_less' : activeAttributeCount > 0 ? 'view_in_ar' : 'tune'}
        </span>
        <span>{isOpen ? 'Hide Builder' : placeholder}</span>
        {activeAttributeCount > 0 && !isOpen && (
          <span className="w-4 h-4 rounded-full bg-primary text-white text-[9px] font-black flex items-center justify-center shrink-0">
            {activeAttributeCount}
          </span>
        )}
      </button>

      {/* 2. Auto-Adjusting Single Horizontal Row Combination Builder Panel (Portal) */}
      {isOpen && typeof document !== 'undefined' && createPortal(
        <div
          ref={panelRef}
          style={{
            position: 'fixed',
            top: `${panelCoords.top}px`,
            left: `${panelCoords.left}px`,
            width: `${panelCoords.width}px`,
            zIndex: 9999
          }}
          className="bg-surface/98 dark:bg-[#131722]/98 backdrop-blur-xl border border-outline-variant/60 rounded-2xl p-2.5 shadow-2xl animate-in fade-in zoom-in-95 duration-150 text-on-surface ring-1 ring-outline-variant/40"
        >
          {/* ROW 1: Single Horizontal Row of 7 Dropdowns + Action Controls */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-2 border-b border-slate-200/60 dark:border-slate-800 scrollbar-thin">
            
            {/* Header Mini Badge */}
            <div className="flex items-center gap-1 text-[11px] font-black uppercase tracking-wider text-on-surface-variant font-bold shrink-0 px-1">
              <span className="material-symbols-outlined text-[16px]">view_in_ar</span>
              <span className="hidden sm:inline">FG Combo:</span>
            </div>

            {/* 1. Paper / Texture */}
            <div className="shrink-0 w-[120px]">
              <select
                value={combo.paperCode}
                onChange={(e) => handleSelectField('paperCode', e.target.value)}
                className={`w-full bg-slate-50 dark:bg-slate-900 border rounded-lg px-2 py-1.5 text-xs font-bold transition-all focus:ring-2 focus:ring-primary/25 outline-none ${
                  combo.paperCode ? 'border-primary text-primary bg-primary/5 font-bold' : 'border-outline-variant/60 text-on-surface bg-surface-container-lowest'
                }`}
                title="Paper / Texture Pattern"
              >
                <option value="">Texture ▾</option>
                {(config.paperCodes || []).map(p => (
                  <option key={p.id} value={p.code}>
                    {p.code} - {p.name}
                  </option>
                ))}
              </select>
            </div>

            {/* 2. Base Item / Gauge */}
            <div className="shrink-0 w-[125px]">
              <select
                value={combo.baseItem}
                onChange={(e) => handleSelectField('baseItem', e.target.value)}
                className={`w-full bg-slate-50 dark:bg-slate-900 border rounded-lg px-2 py-1.5 text-xs font-bold transition-all focus:ring-2 focus:ring-primary/25 outline-none ${
                  combo.baseItem ? 'border-primary text-primary bg-primary/5 font-bold' : 'border-outline-variant/60 text-on-surface bg-surface-container-lowest'
                }`}
                title="Gauge / Base Item"
              >
                <option value="">Gauge / Item ▾</option>
                {(config.gauges || []).map(g => (
                  <option key={g.id} value={g.name}>
                    {g.name}
                  </option>
                ))}
              </select>
            </div>

            {/* 3. Top Color */}
            <div className="shrink-0 w-[110px]">
              <select
                value={combo.color}
                onChange={(e) => handleSelectField('color', e.target.value)}
                className={`w-full bg-slate-50 dark:bg-slate-900 border rounded-lg px-2 py-1.5 text-xs font-bold transition-all focus:ring-2 focus:ring-primary/25 outline-none ${
                  combo.color ? 'border-primary text-primary bg-primary/5 font-bold' : 'border-outline-variant/60 text-on-surface bg-surface-container-lowest'
                }`}
                title="Top Surface Color"
              >
                <option value="">Top Color ▾</option>
                {(config.colors || []).map(c => (
                  <option key={c.id} value={c.name}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            {/* 4. Layers */}
            <div className="shrink-0 w-[100px]">
              <select
                value={combo.layers}
                onChange={(e) => handleSelectField('layers', e.target.value)}
                className={`w-full bg-slate-50 dark:bg-slate-900 border rounded-lg px-2 py-1.5 text-xs font-bold transition-all focus:ring-2 focus:ring-primary/25 outline-none ${
                  combo.layers ? 'border-primary text-primary bg-primary/5 font-bold' : 'border-outline-variant/60 text-on-surface bg-surface-container-lowest'
                }`}
                title="Layers Specification"
              >
                <option value="">Layers ▾</option>
                {['1 Layer', '2 Layer', '3 Layer', '4 Layer'].map(l => (
                  <option key={l} value={l}>{l}</option>
                ))}
              </select>
            </div>

            {/* 5. Backing Fabric */}
            <div className="shrink-0 w-[115px]">
              <select
                value={combo.fabricName}
                onChange={(e) => handleSelectField('fabricName', e.target.value)}
                className={`w-full bg-slate-50 dark:bg-slate-900 border rounded-lg px-2 py-1.5 text-xs font-bold transition-all focus:ring-2 focus:ring-primary/25 outline-none ${
                  combo.fabricName ? 'border-primary text-primary bg-primary/5 font-bold' : 'border-outline-variant/60 text-on-surface bg-surface-container-lowest'
                }`}
                title="Backing Fabric"
              >
                <option value="">Fabric ▾</option>
                {(config.fabrics || []).map(f => (
                  <option key={f.id} value={f.name}>
                    {f.name}
                  </option>
                ))}
              </select>
            </div>

            {/* 6. Fabric Color */}
            <div className="shrink-0 w-[105px]">
              <select
                value={combo.fabricColor}
                onChange={(e) => handleSelectField('fabricColor', e.target.value)}
                disabled={!combo.fabricName || availableFabricColors.length === 0}
                className={`w-full bg-slate-50 dark:bg-slate-900 border rounded-lg px-2 py-1.5 text-xs font-bold transition-all focus:ring-2 focus:ring-primary/25 outline-none disabled:opacity-40 disabled:cursor-not-allowed ${
                  combo.fabricColor ? 'border-primary text-primary bg-primary/5 font-bold' : 'border-outline-variant/60 text-on-surface bg-surface-container-lowest'
                }`}
                title="Backing Fabric Color"
              >
                <option value="">Fabric Col ▾</option>
                {availableFabricColors.map((col, idx) => (
                  <option key={idx} value={col}>{col}</option>
                ))}
              </select>
            </div>

            {/* 7. Packing */}
            <div className="shrink-0 w-[115px]">
              <select
                value={combo.packing}
                onChange={(e) => handleSelectField('packing', e.target.value)}
                className={`w-full bg-slate-50 dark:bg-slate-900 border rounded-lg px-2 py-1.5 text-xs font-bold transition-all focus:ring-2 focus:ring-primary/25 outline-none ${
                  combo.packing ? 'border-primary text-primary bg-primary/5 font-bold' : 'border-outline-variant/60 text-on-surface bg-surface-container-lowest'
                }`}
                title={masking.maskPacking ? "Packing attribute (Masked from title, preserved in DB)" : "Packing Specification"}
              >
                <option value="">Packing {masking.maskPacking ? '🔒' : ''} ▾</option>
                {(config.packings || []).map(pk => (
                  <option key={pk.id} value={pk.name}>
                    {pk.name} ({pk.size}{pk.uom})
                  </option>
                ))}
              </select>
            </div>

            {/* Action Controls: Reset, Settings Gear (Configuration), and Close */}
            <div className="flex items-center gap-1 shrink-0 ml-auto pl-1">
              {activeAttributeCount > 0 && (
                <button
                  type="button"
                  onClick={handleReset}
                  className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 hover:text-red-500 transition-colors"
                  title="Reset All Selections"
                >
                  <span className="material-symbols-outlined text-[17px]">restart_alt</span>
                </button>
              )}

              {allowQuickConfig && (
                <button
                  type="button"
                  onClick={() => setIsQuickConfigOpen(true)}
                  className="p-1.5 rounded-lg hover:bg-cyan-500/15 text-on-surface-variant hover:text-primary transition-colors"
                  title="FG Combination Configuration (Attributes, Lookups, Masking)"
                >
                  <span className="material-symbols-outlined text-[17px]">settings</span>
                </button>
              )}

              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-slate-100 transition-colors"
                title="Close Builder"
              >
                <span className="material-symbols-outlined text-[17px]">close</span>
              </button>
            </div>

          </div>

          {/* ROW 2: Dynamic Identity Preview & Matching Items / Registration Bar */}
          <div className="flex items-center justify-between gap-3 pt-2 text-xs">
            
            {/* Generated Name Preview Badge */}
            <div className="flex items-center gap-2 min-w-0 flex-1">
              {generatedName ? (
                <div className="flex items-center gap-1.5 bg-surface-container-high text-on-surface px-2.5 py-1 rounded-lg border border-outline-variant/60 font-bold text-xs truncate max-w-xl shadow-xs">
                  <span className="material-symbols-outlined text-[15px] text-primary shrink-0">verified</span>
                  <span className="truncate">{generatedName}</span>
                </div>
              ) : (
                <span className="text-[11px] text-slate-500 dark:text-slate-400 italic">
                  Select attributes in the row above to build Finished Good combination
                </span>
              )}

              {combo.packing && masking.maskPacking && (
                <span className="text-[10px] font-semibold text-amber-700 dark:text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20 shrink-0">
                  Packing: {combo.packing} (in DB)
                </span>
              )}
            </div>

            {/* Actions / Results */}
            <div className="flex items-center gap-2 shrink-0">
              
              {/* If matching items exist: List clickable quick-select pills */}
              {matchingItems.length > 0 && (
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] font-extrabold uppercase text-slate-500 dark:text-slate-400">
                    Found ({matchingItems.length}):
                  </span>
                  {matchingItems.slice(0, 3).map(item => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => handleChooseItem(item)}
                      className="px-2.5 py-1 rounded-lg bg-slate-50 dark:bg-slate-800 hover:bg-cyan-500/20 text-slate-800 dark:text-slate-100 border border-slate-200 dark:border-slate-700 hover:border-cyan-500 text-[11px] font-bold transition-all flex items-center gap-1.5 shadow-xs active:scale-95"
                      title={`Select ${item.name}`}
                    >
                      <span>{item.name}</span>
                      <span className="font-mono text-[9px] bg-slate-200 dark:bg-slate-700 px-1 py-0.2 rounded text-slate-600 dark:text-slate-300">
                        {item.sku}
                      </span>
                    </button>
                  ))}
                  {matchingItems.length > 3 && (
                    <span className="text-[10px] font-bold text-slate-400">
                      +{matchingItems.length - 3} more
                    </span>
                  )}
                </div>
              )}

              {/* No match indicator */}
              {activeAttributeCount > 0 && matchingItems.length === 0 && (
                <span className="text-[11px] font-semibold text-amber-600 dark:text-amber-400 flex items-center gap-1">
                  <span className="material-symbols-outlined text-[14px]">info</span>
                  {allowCreation ? 'Not registered in warehouse' : 'No matching items'}
                </span>
              )}

              {/* Register as New Finished Good: Allowed ONLY in Sales Order screen */}
              {allowCreation && activeAttributeCount >= 2 && !exactMatchExists && generatedName && (
                <button
                  type="button"
                  onClick={handleCreateNew}
                  className="bg-primary hover:bg-primary/90 text-white text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-1.5 shadow-md transition-all active:scale-95 shrink-0"
                  title="Register this new Finished Good and add to Sales Order"
                >
                  <span className="material-symbols-outlined text-[15px]">add_circle</span>
                  <span>+ Register As New FG</span>
                </button>
              )}

            </div>

          </div>

        </div>,
        document.body
      )}

      {/* 3. Non-blocking Quick Configuration Modal */}
      {allowQuickConfig && (
        <FGQuickConfigModal
          isOpen={isQuickConfigOpen}
          onClose={() => setIsQuickConfigOpen(false)}
        />
      )}
    </div>
  );
}
