import React, { useState, useRef, useEffect, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { useApp } from '../../context/AppContext';
import { DEFAULT_FG_CONFIG, getInitialFGConfig, saveFGConfig } from '../../utils/fgCombinationUtils';

export default function FGQuickConfigModal({ isOpen, onClose }) {
  const { state, setCollection } = useApp();
  const [activeTab, setActiveTab] = useState('paperCodes');

  // Load from state or persistent initial config
  const config = state.fg_combinations_config || getInitialFGConfig();

  // Local form states for adding new entries
  const [newPaper, setNewPaper] = useState({ code: '', name: '', description: '' });
  const [newGauge, setNewGauge] = useState({ name: '', gauge: '' });
  const [newColor, setNewColor] = useState({ name: '', hex: '#111111' });
  const [newLayer, setNewLayer] = useState({ name: '' });
  const [newFabric, setNewFabric] = useState({ name: '', colorsStr: 'White, Black, Grey' });
  const [newPacking, setNewPacking] = useState({ name: '', uom: 'Meters', size: 50 });

  // Synchronize departments directly from ERP state (Department Settings)
  const erpDepartments = useMemo(() => {
    const list = state.departments || [];
    const normalized = list.map((d, idx) => {
      const name = typeof d === 'string' ? d : (d.name || d.label || d.value || '');
      const id = typeof d === 'object' && d.id ? d.id : ('dept_' + idx);
      const disabled = typeof d === 'object' ? !!d.disabled : false;
      return { id, name, disabled };
    }).filter(d => d.name && !d.disabled);

    if (normalized.length > 0) return normalized;
    return [
      { id: 'dept_fg', name: 'Finished Goods' },
      { id: 'dept_prod', name: 'Production Department' },
      { id: 'dept_wh', name: 'Warehouse' }
    ];
  }, [state.departments]);

  const handleSetDefaultDepartment = (deptName) => {
    const newConfig = {
      ...config,
      defaultDepartment: deptName
    };
    saveFGConfig(newConfig);
    setCollection('fg_combinations_config', newConfig);
  };

  // Draggable positioning state
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef({ mouseX: 0, mouseY: 0, posX: 0, posY: 0 });

  // Reset drag position on open
  useEffect(() => {
    if (isOpen) {
      setPosition({ x: 0, y: 0 });
    }
  }, [isOpen]);

  const handlePointerDown = (e) => {
    // Only primary click
    if (e.button !== 0 && e.pointerType === 'mouse') return;
    setIsDragging(true);
    dragStartRef.current = {
      mouseX: e.clientX,
      mouseY: e.clientY,
      posX: position.x,
      posY: position.y
    };

    const handlePointerMove = (moveEvt) => {
      const deltaX = moveEvt.clientX - dragStartRef.current.mouseX;
      const deltaY = moveEvt.clientY - dragStartRef.current.mouseY;
      setPosition({
        x: Math.round(dragStartRef.current.posX + deltaX),
        y: Math.round(dragStartRef.current.posY + deltaY)
      });
    };

    const handlePointerUp = () => {
      setIsDragging(false);
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
    };

    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);
  };

  if (!isOpen) return null;

  const updateConfig = (key, updater) => {
    const current = config[key] || [];
    const updated = typeof updater === 'function' ? updater(current) : updater;
    const newConfig = { ...config, [key]: updated };
    
    // Save to persistent storage and dispatch broadcast
    saveFGConfig(newConfig);
    // Update global app state
    setCollection('fg_combinations_config', newConfig);
  };

  const handleAddPaper = (e) => {
    if (e && e.preventDefault) e.preventDefault();
    if (e && e.stopPropagation) e.stopPropagation();
    if (!newPaper.code.trim()) return;
    const item = {
      id: 'p_' + Date.now(),
      code: newPaper.code.trim().toUpperCase(),
      name: newPaper.name.trim() || newPaper.code.trim(),
      description: newPaper.description.trim()
    };
    updateConfig('paperCodes', prev => [...prev, item]);
    setNewPaper({ code: '', name: '', description: '' });
  };

  const handleAddGauge = (e) => {
    if (e && e.preventDefault) e.preventDefault();
    if (e && e.stopPropagation) e.stopPropagation();
    if (!newGauge.name.trim()) return;
    const item = {
      id: 'g_' + Date.now(),
      name: newGauge.name.trim(),
      gauge: newGauge.gauge.trim() || newGauge.name.trim()
    };
    updateConfig('gauges', prev => [...prev, item]);
    setNewGauge({ name: '', gauge: '' });
  };

  const handleAddColor = (e) => {
    if (e && e.preventDefault) e.preventDefault();
    if (e && e.stopPropagation) e.stopPropagation();
    if (!newColor.name.trim()) return;
    const item = {
      id: 'c_' + Date.now(),
      name: newColor.name.trim(),
      hex: newColor.hex || '#111111'
    };
    updateConfig('colors', prev => [...prev, item]);
    setNewColor({ name: '', hex: '#111111' });
  };

  const handleAddLayer = (e) => {
    if (e && e.preventDefault) e.preventDefault();
    if (e && e.stopPropagation) e.stopPropagation();
    if (!newLayer.name.trim()) return;
    const item = {
      id: 'l_' + Date.now(),
      name: newLayer.name.trim()
    };
    updateConfig('layers', prev => [...prev, item]);
    setNewLayer({ name: '' });
  };

  const handleAddFabric = (e) => {
    if (e && e.preventDefault) e.preventDefault();
    if (e && e.stopPropagation) e.stopPropagation();
    if (!newFabric.name.trim()) return;
    const colors = newFabric.colorsStr.split(',').map(s => s.trim()).filter(Boolean);
    const item = {
      id: 'f_' + Date.now(),
      name: newFabric.name.trim(),
      colors: colors.length > 0 ? colors : ['White', 'Black']
    };
    updateConfig('fabrics', prev => [...prev, item]);
    setNewFabric({ name: '', colorsStr: 'White, Black, Grey' });
  };

  const handleAddPacking = (e) => {
    if (e && e.preventDefault) e.preventDefault();
    if (e && e.stopPropagation) e.stopPropagation();
    if (!newPacking.name.trim()) return;
    const item = {
      id: 'pk_' + Date.now(),
      name: newPacking.name.trim(),
      uom: newPacking.uom || 'Meters',
      size: parseFloat(newPacking.size) || 50
    };
    updateConfig('packings', prev => [...prev, item]);
    setNewPacking({ name: '', uom: 'Meters', size: 50 });
  };

  const handleDelete = (key, id) => {
    updateConfig(key, prev => prev.filter(i => i.id !== id));
  };

  const toggleMasking = (fieldKey) => {
    const currentMasking = config.masking || DEFAULT_FG_CONFIG.masking;
    const updatedMasking = {
      ...currentMasking,
      [fieldKey]: !currentMasking[fieldKey]
    };
    const newConfig = { ...config, masking: updatedMasking };
    saveFGConfig(newConfig);
    setCollection('fg_combinations_config', newConfig);
  };

  const tabs = [
    { id: 'departments', label: 'Departments', icon: 'business' },
    { id: 'paperCodes', label: 'Paper / Texture', icon: 'texture' },
    { id: 'gauges', label: 'Item / Gauge', icon: 'straighten' },
    { id: 'colors', label: 'Top Colors', icon: 'palette' },
    { id: 'layers', label: 'Layers', icon: 'layers' },
    { id: 'fabrics', label: 'Backing Fabrics', icon: 'dry_cleaning' },
    { id: 'packings', label: 'Packing Types', icon: 'inventory_2' },
    { id: 'masking', label: 'Name Masking', icon: 'visibility_off' }
  ];

  const masking = config.masking || DEFAULT_FG_CONFIG.masking;

  const modalContent = (
    <div 
      role="dialog" 
      aria-modal="true" 
      data-builder-modal="true"
      className="fixed inset-0 z-[10000] flex items-center justify-center p-4 bg-slate-900/40 dark:bg-black/75 backdrop-blur-md animate-in fade-in duration-200"
      onClick={(e) => {
        // Prevent background clicks from submitting forms
        e.stopPropagation();
      }}
    >
      <div 
        style={{ transform: `translate3d(${position.x}px, ${position.y}px, 0)` }}
        className="fg-modal-card rounded-3xl w-full max-w-4xl max-h-[88vh] flex flex-col overflow-hidden text-on-surface transition-shadow duration-200"
      >
        
        {/* Header - DRAGGABLE HANDLE */}
        <div 
          onPointerDown={handlePointerDown}
          className={`px-6 py-4.5 fg-modal-header flex items-center justify-between select-none ${
            isDragging ? 'cursor-grabbing' : 'cursor-grab'
          }`}
          title="Click and drag to move this window anywhere"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shadow-inner">
              <span className="material-symbols-outlined text-[22px]">tune</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-on-surface tracking-tight">
                  Finished Goods Configuration & Masking
                </h3>
                <span className="text-[10px] bg-primary/10 text-primary font-bold px-2 py-0.5 rounded-full border border-primary/20 flex items-center gap-1">
                  <span className="material-symbols-outlined text-[12px]">drag_indicator</span>
                  Draggable
                </span>
              </div>
              <p className="text-xs text-on-surface-variant">
                Manage textures, gauges, colors, backings, and auto-naming format. Changes persist instantly.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[11px] text-slate-400 dark:text-slate-500 font-medium hidden sm:inline">
              Hold header to reposition
            </span>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onClose();
              }}
              className="w-9 h-9 rounded-xl flex items-center justify-center bg-surface hover:bg-surface-container-high text-on-surface-variant hover:text-red-500 transition-colors cursor-pointer border border-outline-variant/20"
              title="Close Configuration"
            >
              <span className="material-symbols-outlined text-[18px]">close</span>
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-outline-variant/15 bg-surface-container-lowest overflow-x-auto px-4 gap-1.5 scrollbar-none py-2 shrink-0">
          {tabs.map(tab => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
                activeTab === tab.id
                  ? 'bg-primary text-white shadow-sm ring-1 ring-primary/40'
                  : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high/60'
              }`}
            >
              <span className="material-symbols-outlined text-[16px]">{tab.icon}</span>
              <span>{tab.label}</span>
              {tab.id !== 'masking' && (
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${activeTab === tab.id ? 'bg-white/20 text-white' : 'bg-surface-container text-on-surface-variant'}`}>
                  {tab.id === 'departments' ? erpDepartments.length : (config[tab.id] || []).length}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Body Content */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">

          {/* TAB 0: Departments & Default Assignment */}
          {activeTab === 'departments' && (
            <div className="space-y-5">
              {/* Default Department Status Banner */}
              <div className="p-4 rounded-2xl bg-primary/10 border border-primary/25 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary text-white flex items-center justify-center shadow-md">
                    <span className="material-symbols-outlined text-[22px]">verified</span>
                  </div>
                  <div>
                    <h4 className="text-xs font-black uppercase tracking-wider text-primary">Active Default Department</h4>
                    <p className="text-sm font-extrabold text-on-surface">
                      {config.defaultDepartment || erpDepartments[0]?.name || 'Finished Goods'}
                    </p>
                    <span className="text-[11px] text-on-surface-variant font-medium">
                      All new finished goods created from the Builder will be automatically entered into this department with ERP serial numbering.
                    </span>
                  </div>
                </div>
              </div>

              {/* Centrally Synced Notice */}
              <div className="p-3.5 rounded-xl bg-surface-container-low/60 border border-outline-variant/20 flex items-center gap-2.5 text-xs text-on-surface-variant">
                <span className="material-symbols-outlined text-[20px] text-primary shrink-0">info</span>
                <span>
                  Departments are synchronized directly from <strong>ERP Settings → Department Settings</strong>. Select which existing department should be the default destination for Finished Goods added from the Builder.
                </span>
              </div>

              {/* ERP Departments Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {erpDepartments.map(dept => {
                  const isCurrentDefault = (config.defaultDepartment || erpDepartments[0]?.name || 'Finished Goods') === dept.name;
                  return (
                    <div 
                      key={dept.id} 
                      className={`p-4 rounded-2xl border transition-all shadow-xs flex items-center justify-between gap-3 fg-item-card ${
                        isCurrentDefault 
                          ? 'border-primary ring-2 ring-primary/25 bg-primary/5' 
                          : 'border-outline-variant/15 hover:border-outline-variant/40'
                      }`}
                    >
                      <div className="flex flex-col gap-1.5 min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <span className="material-symbols-outlined text-[20px] text-primary">business</span>
                          <span className="font-extrabold text-sm text-on-surface truncate">{dept.name}</span>
                        </div>
                        {isCurrentDefault ? (
                          <span className="text-[10px] font-black text-primary bg-primary/15 px-2.5 py-0.5 rounded-md w-fit flex items-center gap-1">
                            <span className="material-symbols-outlined text-[13px]">star</span>
                            Active Default Department
                          </span>
                        ) : (
                          <button
                            type="button"
                            onClick={() => handleSetDefaultDepartment(dept.name)}
                            className="text-xs font-bold text-on-surface-variant hover:text-primary hover:underline text-left w-fit flex items-center gap-1.5 cursor-pointer mt-0.5"
                          >
                            <span className="material-symbols-outlined text-[15px]">radio_button_unchecked</span>
                            <span>Set as Default</span>
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 1: Paper / Texture Codes */}
          {activeTab === 'paperCodes' && (
            <div className="space-y-5">
              <div 
                onKeyDown={(e) => { if (e.key === 'Enter') handleAddPaper(e); }}
                className="bg-surface-container-low/60 backdrop-blur-md p-4.5 rounded-2xl border border-outline-variant/20 flex flex-wrap gap-3 items-end"
              >
                <div className="flex-1 min-w-[140px]">
                  <label className="text-[11px] font-bold text-on-surface-variant block mb-1">Paper Code *</label>
                  <input
                    type="text"
                    placeholder="e.g. P-109"
                    value={newPaper.code}
                    onChange={(e) => setNewPaper(prev => ({ ...prev, code: e.target.value }))}
                    className="w-full bg-surface-container-lowest border border-outline-variant/30 rounded-xl px-3 py-2 text-xs font-bold text-on-surface uppercase outline-none focus:ring-2 focus:ring-primary/25"
                  />
                </div>
                <div className="flex-2 min-w-[180px]">
                  <label className="text-[11px] font-bold text-on-surface-variant block mb-1">Texture Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Suede Grain Emboss"
                    value={newPaper.name}
                    onChange={(e) => setNewPaper(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full bg-surface-container-lowest border border-outline-variant/30 rounded-xl px-3 py-2 text-xs text-on-surface outline-none focus:ring-2 focus:ring-primary/25"
                  />
                </div>
                <div className="flex-3 min-w-[200px]">
                  <label className="text-[11px] font-bold text-on-surface-variant block mb-1">Description / Spec</label>
                  <input
                    type="text"
                    placeholder="e.g. Matte finish release paper"
                    value={newPaper.description}
                    onChange={(e) => setNewPaper(prev => ({ ...prev, description: e.target.value }))}
                    className="w-full bg-surface-container-lowest border border-outline-variant/30 rounded-xl px-3 py-2 text-xs text-on-surface outline-none focus:ring-2 focus:ring-primary/25"
                  />
                </div>
                <button
                  type="button"
                  onClick={handleAddPaper}
                  className="bg-primary hover:bg-primary/90 text-white font-bold text-xs px-4 py-2 rounded-xl flex items-center gap-1.5 shadow-sm transition-all active:scale-95 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[16px]">add</span>
                  <span>+ Add Paper</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {(config.paperCodes || []).map(p => (
                  <div key={p.id} className="p-3.5 rounded-2xl border border-outline-variant/15 bg-surface-container-lowest/80 backdrop-blur-md flex items-start justify-between gap-3 group hover:border-primary/40 transition-all shadow-xs">
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-mono font-bold text-xs text-primary bg-primary/10 px-2 py-0.5 rounded-md border border-primary/20">{p.code}</span>
                        <span className="font-bold text-xs text-on-surface truncate">{p.name}</span>
                      </div>
                      {p.description && <p className="text-[11px] text-on-surface-variant mt-1 line-clamp-1">{p.description}</p>}
                    </div>
                    <button
                      type="button"
                      onClick={() => handleDelete('paperCodes', p.id)}
                      className="text-on-surface-variant/40 hover:text-red-500 p-1 rounded-lg hover:bg-red-500/10 transition-colors opacity-0 group-hover:opacity-100 cursor-pointer"
                      title="Delete"
                    >
                      <span className="material-symbols-outlined text-[16px]">delete</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 2: Gauges / Item Thickness */}
          {activeTab === 'gauges' && (
            <div className="space-y-5">
              <div 
                onKeyDown={(e) => { if (e.key === 'Enter') handleAddGauge(e); }}
                className="bg-surface-container-low/60 backdrop-blur-md p-4.5 rounded-2xl border border-outline-variant/20 flex flex-wrap gap-3 items-end"
              >
                <div className="flex-1 min-w-[200px]">
                  <label className="text-[11px] font-bold text-on-surface-variant block mb-1">Base Item / Gauge Name *</label>
                  <input
                    type="text"
                    placeholder="e.g. 0.95mm Automotive Rexine"
                    value={newGauge.name}
                    onChange={(e) => setNewGauge(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full bg-surface-container-lowest border border-outline-variant/30 rounded-xl px-3 py-2 text-xs font-bold text-on-surface outline-none focus:ring-2 focus:ring-primary/25"
                  />
                </div>
                <div className="w-[160px]">
                  <label className="text-[11px] font-bold text-on-surface-variant block mb-1">Thickness Value</label>
                  <input
                    type="text"
                    placeholder="e.g. 0.95mm"
                    value={newGauge.gauge}
                    onChange={(e) => setNewGauge(prev => ({ ...prev, gauge: e.target.value }))}
                    className="w-full bg-surface-container-lowest border border-outline-variant/30 rounded-xl px-3 py-2 text-xs text-on-surface outline-none focus:ring-2 focus:ring-primary/25"
                  />
                </div>
                <button
                  type="button"
                  onClick={handleAddGauge}
                  className="bg-primary hover:bg-primary/90 text-white font-bold text-xs px-4 py-2 rounded-xl flex items-center gap-1.5 shadow-sm transition-all active:scale-95 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[16px]">add</span>
                  <span>+ Add Item Gauge</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {(config.gauges || []).map(g => (
                  <div key={g.id} className="p-3.5 rounded-2xl border border-outline-variant/15 bg-surface-container-lowest/80 backdrop-blur-md flex items-center justify-between gap-3 group hover:border-primary/40 transition-all shadow-xs">
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-primary text-[18px]">straighten</span>
                      <span className="font-bold text-xs text-on-surface">{g.name}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleDelete('gauges', g.id)}
                      className="text-on-surface-variant/40 hover:text-red-500 p-1 rounded-lg hover:bg-red-500/10 transition-colors opacity-0 group-hover:opacity-100 cursor-pointer"
                      title="Delete"
                    >
                      <span className="material-symbols-outlined text-[16px]">delete</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: Top Colors */}
          {activeTab === 'colors' && (
            <div className="space-y-5">
              <div 
                onKeyDown={(e) => { if (e.key === 'Enter') handleAddColor(e); }}
                className="bg-surface-container-low/60 backdrop-blur-md p-4.5 rounded-2xl border border-outline-variant/20 flex flex-wrap gap-3 items-end"
              >
                <div className="flex-1 min-w-[180px]">
                  <label className="text-[11px] font-bold text-on-surface-variant block mb-1">Color Name *</label>
                  <input
                    type="text"
                    placeholder="e.g. Royal Maroon"
                    value={newColor.name}
                    onChange={(e) => setNewColor(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full bg-surface-container-lowest border border-outline-variant/30 rounded-xl px-3 py-2 text-xs font-bold text-on-surface outline-none focus:ring-2 focus:ring-primary/25"
                  />
                </div>
                <div className="w-[120px]">
                  <label className="text-[11px] font-bold text-on-surface-variant block mb-1">Hex Code</label>
                  <div className="flex items-center gap-2 bg-surface-container-lowest border border-outline-variant/30 rounded-xl px-2 py-1.5">
                    <input
                      type="color"
                      value={newColor.hex}
                      onChange={(e) => setNewColor(prev => ({ ...prev, hex: e.target.value }))}
                      className="w-6 h-6 rounded cursor-pointer border-none bg-transparent"
                    />
                    <span className="text-[11px] font-mono font-bold text-on-surface-variant">{newColor.hex}</span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleAddColor}
                  className="bg-primary hover:bg-primary/90 text-white font-bold text-xs px-4 py-2 rounded-xl flex items-center gap-1.5 shadow-sm transition-all active:scale-95 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[16px]">add</span>
                  <span>+ Add Color</span>
                </button>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {(config.colors || []).map(c => (
                  <div key={c.id} className="p-3 rounded-2xl border border-outline-variant/15 bg-surface-container-lowest/80 backdrop-blur-md flex items-center justify-between gap-2 group hover:border-primary/40 transition-all shadow-xs">
                    <div className="flex items-center gap-2.5">
                      <span className="w-5 h-5 rounded-full border border-black/20 dark:border-white/20 shrink-0 shadow-xs" style={{ backgroundColor: c.hex || '#111111' }}></span>
                      <span className="font-bold text-xs text-on-surface truncate">{c.name}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleDelete('colors', c.id)}
                      className="text-on-surface-variant/40 hover:text-red-500 p-1 rounded-lg hover:bg-red-500/10 transition-colors opacity-0 group-hover:opacity-100 cursor-pointer"
                      title="Delete"
                    >
                      <span className="material-symbols-outlined text-[16px]">delete</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: Layers */}
          {activeTab === 'layers' && (
            <div className="space-y-5">
              <div 
                onKeyDown={(e) => { if (e.key === 'Enter') handleAddLayer(e); }}
                className="bg-surface-container-low/60 backdrop-blur-md p-4.5 rounded-2xl border border-outline-variant/20 flex gap-3 items-end"
              >
                <div className="flex-1 max-w-sm">
                  <label className="text-[11px] font-bold text-on-surface-variant block mb-1">Layer Specification *</label>
                  <input
                    type="text"
                    placeholder="e.g. 5 Layer Heavy"
                    value={newLayer.name}
                    onChange={(e) => setNewLayer({ name: e.target.value })}
                    className="w-full bg-surface-container-lowest border border-outline-variant/30 rounded-xl px-3 py-2 text-xs font-bold text-on-surface outline-none focus:ring-2 focus:ring-primary/25"
                  />
                </div>
                <button
                  type="button"
                  onClick={handleAddLayer}
                  className="bg-primary hover:bg-primary/90 text-white font-bold text-xs px-4 py-2 rounded-xl flex items-center gap-1.5 shadow-sm transition-all active:scale-95 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[16px]">add</span>
                  <span>+ Add Layer</span>
                </button>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {(config.layers || []).map(l => (
                  <div key={l.id} className="p-3.5 rounded-2xl border border-outline-variant/15 bg-surface-container-lowest/80 backdrop-blur-md flex items-center justify-between gap-2 group hover:border-primary/40 transition-all shadow-xs">
                    <span className="font-bold text-xs text-on-surface">{l.name}</span>
                    <button
                      type="button"
                      onClick={() => handleDelete('layers', l.id)}
                      className="text-on-surface-variant/40 hover:text-red-500 p-1 rounded-lg hover:bg-red-500/10 transition-colors opacity-0 group-hover:opacity-100 cursor-pointer"
                      title="Delete"
                    >
                      <span className="material-symbols-outlined text-[16px]">delete</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: Backing Fabrics */}
          {activeTab === 'fabrics' && (
            <div className="space-y-5">
              <div 
                onKeyDown={(e) => { if (e.key === 'Enter') handleAddFabric(e); }}
                className="bg-surface-container-low/60 backdrop-blur-md p-4.5 rounded-2xl border border-outline-variant/20 flex flex-wrap gap-3 items-end"
              >
                <div className="flex-1 min-w-[180px]">
                  <label className="text-[11px] font-bold text-on-surface-variant block mb-1">Fabric Material Name *</label>
                  <input
                    type="text"
                    placeholder="e.g. Polar Fleece Backing"
                    value={newFabric.name}
                    onChange={(e) => setNewFabric(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full bg-surface-container-lowest border border-outline-variant/30 rounded-xl px-3 py-2 text-xs font-bold text-on-surface outline-none focus:ring-2 focus:ring-primary/25"
                  />
                </div>
                <div className="flex-2 min-w-[240px]">
                  <label className="text-[11px] font-bold text-on-surface-variant block mb-1">Available Colors (Comma Separated)</label>
                  <input
                    type="text"
                    placeholder="e.g. White, Black, Charcoal, Raw Ecru"
                    value={newFabric.colorsStr}
                    onChange={(e) => setNewFabric(prev => ({ ...prev, colorsStr: e.target.value }))}
                    className="w-full bg-surface-container-lowest border border-outline-variant/30 rounded-xl px-3 py-2 text-xs text-on-surface outline-none focus:ring-2 focus:ring-primary/25"
                  />
                </div>
                <button
                  type="button"
                  onClick={handleAddFabric}
                  className="bg-primary hover:bg-primary/90 text-white font-bold text-xs px-4 py-2 rounded-xl flex items-center gap-1.5 shadow-sm transition-all active:scale-95 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[16px]">add</span>
                  <span>+ Add Fabric</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {(config.fabrics || []).map(f => (
                  <div key={f.id} className="p-3.5 rounded-2xl border border-outline-variant/15 bg-surface-container-lowest/80 backdrop-blur-md flex items-start justify-between gap-3 group hover:border-primary/40 transition-all shadow-xs">
                    <div>
                      <span className="font-bold text-xs text-on-surface block">{f.name}</span>
                      <div className="flex flex-wrap gap-1 mt-1.5">
                        {(f.colors || []).map((col, idx) => (
                          <span key={idx} className="text-[10px] bg-surface-container px-2 py-0.5 rounded-md font-medium text-on-surface-variant">
                            {col}
                          </span>
                        ))}
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleDelete('fabrics', f.id)}
                      className="text-on-surface-variant/40 hover:text-red-500 p-1 rounded-lg hover:bg-red-500/10 transition-colors opacity-0 group-hover:opacity-100 cursor-pointer"
                      title="Delete"
                    >
                      <span className="material-symbols-outlined text-[16px]">delete</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 6: Packing Types */}
          {activeTab === 'packings' && (
            <div className="space-y-5">
              <div 
                onKeyDown={(e) => { if (e.key === 'Enter') handleAddPacking(e); }}
                className="bg-surface-container-low/60 backdrop-blur-md p-4.5 rounded-2xl border border-outline-variant/20 flex flex-wrap gap-3 items-end"
              >
                <div className="flex-2 min-w-[180px]">
                  <label className="text-[11px] font-bold text-on-surface-variant block mb-1">Packing Name *</label>
                  <input
                    type="text"
                    placeholder="e.g. 75M Custom Roll"
                    value={newPacking.name}
                    onChange={(e) => setNewPacking(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full bg-surface-container-lowest border border-outline-variant/30 rounded-xl px-3 py-2 text-xs font-bold text-on-surface outline-none focus:ring-2 focus:ring-primary/25"
                  />
                </div>
                <div className="w-[110px]">
                  <label className="text-[11px] font-bold text-on-surface-variant block mb-1">Size Value</label>
                  <input
                    type="number"
                    placeholder="75"
                    value={newPacking.size}
                    onChange={(e) => setNewPacking(prev => ({ ...prev, size: e.target.value }))}
                    className="w-full bg-surface-container-lowest border border-outline-variant/30 rounded-xl px-3 py-2 text-xs text-on-surface outline-none focus:ring-2 focus:ring-primary/25"
                  />
                </div>
                <div className="w-[120px]">
                  <label className="text-[11px] font-bold text-on-surface-variant block mb-1">UOM</label>
                  <select
                    value={newPacking.uom}
                    onChange={(e) => setNewPacking(prev => ({ ...prev, uom: e.target.value }))}
                    className="w-full bg-surface-container-lowest border border-outline-variant/30 rounded-xl px-2 py-2 text-xs font-bold text-on-surface outline-none"
                  >
                    <option value="Meters">Meters</option>
                    <option value="Yards">Yards</option>
                    <option value="Rolls">Rolls</option>
                    <option value="Carton">Carton</option>
                    <option value="Crate">Crate</option>
                  </select>
                </div>
                <button
                  type="button"
                  onClick={handleAddPacking}
                  className="bg-primary hover:bg-primary/90 text-white font-bold text-xs px-4 py-2 rounded-xl flex items-center gap-1.5 shadow-sm transition-all active:scale-95 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[16px]">add</span>
                  <span>+ Add Packing</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {(config.packings || []).map(pk => (
                  <div key={pk.id} className="p-3.5 rounded-2xl border border-outline-variant/15 bg-surface-container-lowest/80 backdrop-blur-md flex items-center justify-between gap-3 group hover:border-primary/40 transition-all shadow-xs">
                    <div>
                      <span className="font-bold text-xs text-on-surface block">{pk.name}</span>
                      <span className="text-[11px] text-on-surface-variant font-mono">{pk.size} {pk.uom}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleDelete('packings', pk.id)}
                      className="text-on-surface-variant/40 hover:text-red-500 p-1 rounded-lg hover:bg-red-500/10 transition-colors opacity-0 group-hover:opacity-100 cursor-pointer"
                      title="Delete"
                    >
                      <span className="material-symbols-outlined text-[16px]">delete</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 7: Name Masking Rules */}
          {activeTab === 'masking' && (
            <div className="space-y-4">
              <div className="bg-primary/5 border border-primary/20 rounded-2xl p-4 text-xs text-on-surface leading-relaxed">
                <p className="font-bold text-primary mb-1">Masking Architecture Rule</p>
                Masking hides selected attributes from the generated item title while preserving them as discrete configuration attributes in your database and order ledger.
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  { key: 'maskPacking', label: 'Mask Packing from Item Title', desc: 'Packing remains tracked in orders, but is omitted from title' },
                  { key: 'maskPaperCode', label: 'Mask Paper Code', desc: 'Hide texture release code from generated title' },
                  { key: 'maskItemName', label: 'Mask Base Item Name / Gauge', desc: 'Omit gauge baseline from generated title' },
                  { key: 'maskColor', label: 'Mask Top Color', desc: 'Omit primary surface color from generated title' },
                  { key: 'maskLayers', label: 'Mask Layers', desc: 'Omit specification layers (e.g. 2 Layer)' },
                  { key: 'maskFabric', label: 'Mask Backing Fabric', desc: 'Omit backing fabric and color parenthesis' }
                ].map(item => (
                  <div key={item.key} className="p-4 rounded-2xl border border-outline-variant/20 bg-surface-container-lowest/80 backdrop-blur-md flex items-center justify-between gap-4">
                    <div>
                      <span className="text-xs font-bold text-on-surface block">{item.label}</span>
                      <span className="text-[11px] text-on-surface-variant leading-tight block mt-0.5">{item.desc}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => toggleMasking(item.key)}
                      className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                        masking[item.key] ? 'bg-primary' : 'bg-surface-container-highest'
                      }`}
                    >
                      <span
                        className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform shadow ${
                          masking[item.key] ? 'translate-x-5' : 'translate-x-0'
                        }`}
                      />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 border-t border-outline-variant/15 flex items-center justify-between bg-surface-container-low/70 shrink-0">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="text-[11px] text-on-surface-variant font-semibold">
              Live Auto-Sync Active — All entries persist in local & cloud memory
            </span>
          </div>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onClose();
            }}
            className="px-5 py-2 rounded-xl bg-primary text-white font-bold text-xs hover:bg-primary/90 transition-all shadow-sm active:scale-95 cursor-pointer"
          >
            Done
          </button>
        </div>

      </div>
    </div>
  );

  return typeof document !== 'undefined' ? createPortal(modalContent, document.body) : modalContent;
}
