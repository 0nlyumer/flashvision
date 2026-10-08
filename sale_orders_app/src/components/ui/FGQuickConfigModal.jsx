import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { DEFAULT_FG_CONFIG } from '../../utils/fgCombinationUtils';

export default function FGQuickConfigModal({ isOpen, onClose }) {
  const { state, setCollection } = useApp();
  const [activeTab, setActiveTab] = useState('paperCodes');

  const config = state.fg_combinations_config || DEFAULT_FG_CONFIG;

  // Local form states for adding new entries
  const [newPaper, setNewPaper] = useState({ code: '', name: '', description: '' });
  const [newGauge, setNewGauge] = useState({ name: '', gauge: '' });
  const [newColor, setNewColor] = useState({ name: '', hex: '#111111' });
  const [newLayer, setNewLayer] = useState({ name: '' });
  const [newFabric, setNewFabric] = useState({ name: '', colorsStr: 'White, Black, Grey' });
  const [newPacking, setNewPacking] = useState({ name: '', uom: 'Meters', size: 50 });

  // Editing state
  const [editingItem, setEditingItem] = useState(null);

  if (!isOpen) return null;

  const updateConfig = (key, updater) => {
    const current = config[key] || [];
    const updated = typeof updater === 'function' ? updater(current) : updater;
    const newConfig = { ...config, [key]: updated };
    setCollection('fg_combinations_config', newConfig);
  };

  const handleAddPaper = (e) => {
    e.preventDefault();
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
    e.preventDefault();
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
    e.preventDefault();
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
    e.preventDefault();
    if (!newLayer.name.trim()) return;
    const item = {
      id: 'l_' + Date.now(),
      name: newLayer.name.trim()
    };
    updateConfig('layers', prev => [...prev, item]);
    setNewLayer({ name: '' });
  };

  const handleAddFabric = (e) => {
    e.preventDefault();
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
    e.preventDefault();
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
    setCollection('fg_combinations_config', { ...config, masking: updatedMasking });
  };

  const tabs = [
    { id: 'paperCodes', label: 'Paper / Texture', icon: 'texture' },
    { id: 'gauges', label: 'Item / Gauge', icon: 'straighten' },
    { id: 'colors', label: 'Top Colors', icon: 'palette' },
    { id: 'layers', label: 'Layers', icon: 'layers' },
    { id: 'fabrics', label: 'Backing Fabrics', icon: 'dry_cleaning' },
    { id: 'packings', label: 'Packing Types', icon: 'inventory_2' },
    { id: 'masking', label: 'Name Masking', icon: 'visibility_off' }
  ];

  const masking = config.masking || DEFAULT_FG_CONFIG.masking;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-2xl shadow-[0_25px_60px_rgba(0,0,0,0.3)] w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden text-on-surface">
        
        {/* Header */}
        <div className="px-6 py-5 border-b border-outline-variant/15 flex items-center justify-between bg-surface-container-low">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shadow-inner">
              <span className="material-symbols-outlined text-[22px]">tune</span>
            </div>
            <div>
              <h2 className="text-lg font-bold font-headline text-on-surface flex items-center gap-2">
                FG Combination & Identity Configuration
                <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-cyan-500/15 text-cyan-700 dark:text-cyan-400 border border-cyan-500/30">
                  Synthetic Leather
                </span>
              </h2>
              <p className="text-xs text-on-surface-variant font-medium">
                Manage discrete Finished Goods attribute options and dynamic naming patterns.
              </p>
            </div>
          </div>
          <button 
            type="button" 
            onClick={onClose}
            className="w-9 h-9 rounded-lg hover:bg-surface-container-high flex items-center justify-center text-on-surface-variant hover:text-on-surface transition-colors"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="px-6 border-b border-outline-variant/15 bg-surface flex gap-2 overflow-x-auto no-scrollbar py-2">
          {tabs.map(tab => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-primary text-white shadow-sm'
                  : 'text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface'
              }`}
            >
              <span className="material-symbols-outlined text-[16px]">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">

          {/* TAB 1: Paper / Texture Codes */}
          {activeTab === 'paperCodes' && (
            <div className="space-y-5">
              <form onSubmit={handleAddPaper} className="bg-surface-container-low p-4 rounded-xl border border-outline-variant/20 flex flex-wrap gap-3 items-end">
                <div className="flex-1 min-w-[140px]">
                  <label className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider block mb-1">Paper Code *</label>
                  <input
                    type="text"
                    placeholder="e.g. P-109, LAMB-88"
                    value={newPaper.code}
                    onChange={(e) => setNewPaper({ ...newPaper, code: e.target.value })}
                    className="w-full bg-surface border border-outline-variant/30 rounded-lg px-3 py-2 text-xs font-bold uppercase focus:ring-2 focus:ring-primary/20 outline-none"
                    required
                  />
                </div>
                <div className="flex-1 min-w-[180px]">
                  <label className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider block mb-1">Texture Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Fine Calfskin Grain"
                    value={newPaper.name}
                    onChange={(e) => setNewPaper({ ...newPaper, name: e.target.value })}
                    className="w-full bg-surface border border-outline-variant/30 rounded-lg px-3 py-2 text-xs font-medium focus:ring-2 focus:ring-primary/20 outline-none"
                  />
                </div>
                <div className="flex-[2] min-w-[200px]">
                  <label className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider block mb-1">Description / Spec</label>
                  <input
                    type="text"
                    placeholder="Optional embossed pattern notes"
                    value={newPaper.description}
                    onChange={(e) => setNewPaper({ ...newPaper, description: e.target.value })}
                    className="w-full bg-surface border border-outline-variant/30 rounded-lg px-3 py-2 text-xs font-medium focus:ring-2 focus:ring-primary/20 outline-none"
                  />
                </div>
                <button
                  type="submit"
                  className="bg-primary text-white text-xs font-bold px-4 py-2.5 rounded-lg hover:opacity-90 transition-opacity flex items-center gap-1.5 shadow-sm"
                >
                  <span className="material-symbols-outlined text-[16px]">add</span> Add Texture
                </button>
              </form>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {(config.paperCodes || []).map(p => (
                  <div key={p.id} className="p-3.5 bg-surface border border-outline-variant/20 rounded-xl flex items-center justify-between hover:border-primary/40 transition-colors">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-extrabold bg-primary/10 text-primary px-2 py-0.5 rounded border border-primary/20">{p.code}</span>
                        <span className="text-xs font-bold text-on-surface">{p.name}</span>
                      </div>
                      {p.description && <p className="text-[11px] text-on-surface-variant mt-1">{p.description}</p>}
                    </div>
                    <button
                      type="button"
                      onClick={() => handleDelete('paperCodes', p.id)}
                      className="text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40 p-1.5 rounded-lg transition-colors"
                      title="Delete"
                    >
                      <span className="material-symbols-outlined text-[16px]">delete</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 2: Item Gauges */}
          {activeTab === 'gauges' && (
            <div className="space-y-5">
              <form onSubmit={handleAddGauge} className="bg-surface-container-low p-4 rounded-xl border border-outline-variant/20 flex flex-wrap gap-3 items-end">
                <div className="flex-1 min-w-[200px]">
                  <label className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider block mb-1">Base Name *</label>
                  <input
                    type="text"
                    placeholder="e.g. 0.85mm Premium PU"
                    value={newGauge.name}
                    onChange={(e) => setNewGauge({ ...newGauge, name: e.target.value })}
                    className="w-full bg-surface border border-outline-variant/30 rounded-lg px-3 py-2 text-xs font-bold focus:ring-2 focus:ring-primary/20 outline-none"
                    required
                  />
                </div>
                <div className="w-36">
                  <label className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider block mb-1">Gauge (mm)</label>
                  <input
                    type="text"
                    placeholder="e.g. 0.85mm"
                    value={newGauge.gauge}
                    onChange={(e) => setNewGauge({ ...newGauge, gauge: e.target.value })}
                    className="w-full bg-surface border border-outline-variant/30 rounded-lg px-3 py-2 text-xs font-mono font-bold focus:ring-2 focus:ring-primary/20 outline-none"
                  />
                </div>
                <button
                  type="submit"
                  className="bg-primary text-white text-xs font-bold px-4 py-2.5 rounded-lg hover:opacity-90 transition-opacity flex items-center gap-1.5 shadow-sm"
                >
                  <span className="material-symbols-outlined text-[16px]">add</span> Add Gauge
                </button>
              </form>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {(config.gauges || []).map(g => (
                  <div key={g.id} className="p-3.5 bg-surface border border-outline-variant/20 rounded-xl flex items-center justify-between hover:border-primary/40 transition-colors">
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-cyan-600 text-[18px]">straighten</span>
                      <div>
                        <div className="text-xs font-bold text-on-surface">{g.name}</div>
                        {g.gauge && <span className="text-[10px] font-mono text-on-surface-variant">Thickness: {g.gauge}</span>}
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleDelete('gauges', g.id)}
                      className="text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40 p-1.5 rounded-lg transition-colors"
                      title="Delete"
                    >
                      <span className="material-symbols-outlined text-[16px]">delete</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: Top Layer Colors */}
          {activeTab === 'colors' && (
            <div className="space-y-5">
              <form onSubmit={handleAddColor} className="bg-surface-container-low p-4 rounded-xl border border-outline-variant/20 flex flex-wrap gap-3 items-end">
                <div className="flex-1 min-w-[180px]">
                  <label className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider block mb-1">Color Name *</label>
                  <input
                    type="text"
                    placeholder="e.g. Havana Cognac"
                    value={newColor.name}
                    onChange={(e) => setNewColor({ ...newColor, name: e.target.value })}
                    className="w-full bg-surface border border-outline-variant/30 rounded-lg px-3 py-2 text-xs font-bold focus:ring-2 focus:ring-primary/20 outline-none"
                    required
                  />
                </div>
                <div className="w-24">
                  <label className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider block mb-1">Color Swatch</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={newColor.hex}
                      onChange={(e) => setNewColor({ ...newColor, hex: e.target.value })}
                      className="w-10 h-8 rounded border border-outline-variant/30 cursor-pointer"
                    />
                    <span className="text-[10px] font-mono">{newColor.hex}</span>
                  </div>
                </div>
                <button
                  type="submit"
                  className="bg-primary text-white text-xs font-bold px-4 py-2.5 rounded-lg hover:opacity-90 transition-opacity flex items-center gap-1.5 shadow-sm"
                >
                  <span className="material-symbols-outlined text-[16px]">add</span> Add Color
                </button>
              </form>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {(config.colors || []).map(c => (
                  <div key={c.id} className="p-3 bg-surface border border-outline-variant/20 rounded-xl flex items-center justify-between hover:border-primary/40 transition-colors">
                    <div className="flex items-center gap-2.5">
                      <span className="w-5 h-5 rounded-full border border-black/20 shadow-inner shrink-0" style={{ backgroundColor: c.hex || '#ddd' }} />
                      <span className="text-xs font-bold text-on-surface">{c.name}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleDelete('colors', c.id)}
                      className="text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40 p-1 rounded transition-colors"
                      title="Delete"
                    >
                      <span className="material-symbols-outlined text-[15px]">delete</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: Layers */}
          {activeTab === 'layers' && (
            <div className="space-y-5">
              <form onSubmit={handleAddLayer} className="bg-surface-container-low p-4 rounded-xl border border-outline-variant/20 flex gap-3 items-end">
                <div className="flex-1">
                  <label className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider block mb-1">Layer Specification *</label>
                  <input
                    type="text"
                    placeholder="e.g. 5 Layer, Tri-Laminate"
                    value={newLayer.name}
                    onChange={(e) => setNewLayer({ ...newLayer, name: e.target.value })}
                    className="w-full bg-surface border border-outline-variant/30 rounded-lg px-3 py-2 text-xs font-bold focus:ring-2 focus:ring-primary/20 outline-none"
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="bg-primary text-white text-xs font-bold px-4 py-2.5 rounded-lg hover:opacity-90 transition-opacity flex items-center gap-1.5 shadow-sm"
                >
                  <span className="material-symbols-outlined text-[16px]">add</span> Add Layer
                </button>
              </form>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {(config.layers || []).map(l => (
                  <div key={l.id} className="p-3 bg-surface border border-outline-variant/20 rounded-xl flex items-center justify-between hover:border-primary/40 transition-colors">
                    <span className="text-xs font-extrabold text-on-surface flex items-center gap-2">
                      <span className="material-symbols-outlined text-[16px] text-primary">layers</span>
                      {l.name}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleDelete('layers', l.id)}
                      className="text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40 p-1 rounded transition-colors"
                      title="Delete"
                    >
                      <span className="material-symbols-outlined text-[15px]">delete</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: Backing Fabrics & Colors */}
          {activeTab === 'fabrics' && (
            <div className="space-y-5">
              <form onSubmit={handleAddFabric} className="bg-surface-container-low p-4 rounded-xl border border-outline-variant/20 flex flex-wrap gap-3 items-end">
                <div className="flex-1 min-w-[180px]">
                  <label className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider block mb-1">Fabric Name *</label>
                  <input
                    type="text"
                    placeholder="e.g. Circular Knit Polyester"
                    value={newFabric.name}
                    onChange={(e) => setNewFabric({ ...newFabric, name: e.target.value })}
                    className="w-full bg-surface border border-outline-variant/30 rounded-lg px-3 py-2 text-xs font-bold focus:ring-2 focus:ring-primary/20 outline-none"
                    required
                  />
                </div>
                <div className="flex-[2] min-w-[220px]">
                  <label className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider block mb-1">Available Colors (Comma separated)</label>
                  <input
                    type="text"
                    placeholder="White, Black, Natural Ecru, Grey"
                    value={newFabric.colorsStr}
                    onChange={(e) => setNewFabric({ ...newFabric, colorsStr: e.target.value })}
                    className="w-full bg-surface border border-outline-variant/30 rounded-lg px-3 py-2 text-xs font-medium focus:ring-2 focus:ring-primary/20 outline-none"
                  />
                </div>
                <button
                  type="submit"
                  className="bg-primary text-white text-xs font-bold px-4 py-2.5 rounded-lg hover:opacity-90 transition-opacity flex items-center gap-1.5 shadow-sm"
                >
                  <span className="material-symbols-outlined text-[16px]">add</span> Add Fabric
                </button>
              </form>

              <div className="space-y-3">
                {(config.fabrics || []).map(f => (
                  <div key={f.id} className="p-3.5 bg-surface border border-outline-variant/20 rounded-xl flex items-center justify-between hover:border-primary/40 transition-colors">
                    <div>
                      <div className="text-xs font-extrabold text-on-surface flex items-center gap-2">
                        <span className="material-symbols-outlined text-[16px] text-tertiary">dry_cleaning</span>
                        {f.name}
                      </div>
                      <div className="flex items-center gap-1.5 mt-2 flex-wrap">
                        <span className="text-[10px] font-bold uppercase text-on-surface-variant">Fabric Colors:</span>
                        {(f.colors || []).map((col, idx) => (
                          <span key={idx} className="text-[10px] font-semibold bg-surface-container-high px-2 py-0.5 rounded-full border border-outline-variant/30">
                            {col}
                          </span>
                        ))}
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleDelete('fabrics', f.id)}
                      className="text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40 p-1.5 rounded-lg transition-colors"
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
              <form onSubmit={handleAddPacking} className="bg-surface-container-low p-4 rounded-xl border border-outline-variant/20 flex flex-wrap gap-3 items-end">
                <div className="flex-1 min-w-[180px]">
                  <label className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider block mb-1">Packing Specification *</label>
                  <input
                    type="text"
                    placeholder="e.g. 75M Shrink Wrapped"
                    value={newPacking.name}
                    onChange={(e) => setNewPacking({ ...newPacking, name: e.target.value })}
                    className="w-full bg-surface border border-outline-variant/30 rounded-lg px-3 py-2 text-xs font-bold focus:ring-2 focus:ring-primary/20 outline-none"
                    required
                  />
                </div>
                <div className="w-28">
                  <label className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider block mb-1">UOM</label>
                  <select
                    value={newPacking.uom}
                    onChange={(e) => setNewPacking({ ...newPacking, uom: e.target.value })}
                    className="w-full bg-surface border border-outline-variant/30 rounded-lg px-2.5 py-2 text-xs font-bold focus:ring-2 focus:ring-primary/20 outline-none"
                  >
                    <option value="Meters">Meters</option>
                    <option value="Rolls">Rolls</option>
                    <option value="Carton">Carton</option>
                    <option value="Crate">Crate</option>
                  </select>
                </div>
                <div className="w-24">
                  <label className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider block mb-1">Std Size</label>
                  <input
                    type="number"
                    value={newPacking.size}
                    onChange={(e) => setNewPacking({ ...newPacking, size: e.target.value })}
                    className="w-full bg-surface border border-outline-variant/30 rounded-lg px-2 py-2 text-xs font-mono font-bold focus:ring-2 focus:ring-primary/20 outline-none text-right"
                  />
                </div>
                <button
                  type="submit"
                  className="bg-primary text-white text-xs font-bold px-4 py-2.5 rounded-lg hover:opacity-90 transition-opacity flex items-center gap-1.5 shadow-sm"
                >
                  <span className="material-symbols-outlined text-[16px]">add</span> Add Packing
                </button>
              </form>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {(config.packings || []).map(pk => (
                  <div key={pk.id} className="p-3.5 bg-surface border border-outline-variant/20 rounded-xl flex items-center justify-between hover:border-primary/40 transition-colors">
                    <div className="flex items-center gap-2.5">
                      <span className="material-symbols-outlined text-amber-600 text-[18px]">inventory_2</span>
                      <div>
                        <div className="text-xs font-bold text-on-surface">{pk.name}</div>
                        <span className="text-[10px] font-mono text-on-surface-variant">{pk.size} {pk.uom} per unit</span>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleDelete('packings', pk.id)}
                      className="text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40 p-1.5 rounded-lg transition-colors"
                      title="Delete"
                    >
                      <span className="material-symbols-outlined text-[16px]">delete</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 7: Name Masking Settings */}
          {activeTab === 'masking' && (
            <div className="space-y-4">
              <div className="p-4 bg-cyan-500/10 border border-cyan-500/20 rounded-xl text-xs text-on-surface">
                <span className="font-bold flex items-center gap-1.5 text-cyan-700 dark:text-cyan-400 mb-1">
                  <span className="material-symbols-outlined text-[16px]">info</span>
                  Attribute Masking Rules
                </span>
                Masked attributes will be omitted from the final generated display name ({'{Paper Code} {Item Name} {Color} {Layers} ({Fabric Name} {Fabric Color})'}), but their combination identity remains <strong>100% intact and distinguishable</strong> in the database and search dropdowns.
              </div>

              <div className="divide-y divide-outline-variant/15 border border-outline-variant/20 rounded-xl overflow-hidden bg-surface">
                {[
                  { key: 'maskPacking', label: 'Mask Packing from Item Display Name', desc: 'Packing (e.g. 50M Roll) remains in combination data but is hidden from the main title string.', default: true },
                  { key: 'maskLayers', label: 'Mask Layers Specification', desc: 'Hide layer count (e.g. 2 Layer) from generated name string.', default: false },
                  { key: 'maskColor', label: 'Mask Top Color', desc: 'Hide surface color from generated name string.', default: false },
                  { key: 'maskFabric', label: 'Mask Backing Fabric & Fabric Color', desc: 'Hide ([Fabric Name] [Fabric Color]) from generated name string.', default: false },
                  { key: 'maskPaperCode', label: 'Mask Paper / Texture Code', desc: 'Hide embossed release paper code from generated name string.', default: false }
                ].map(item => (
                  <div key={item.key} className="p-4 flex items-center justify-between hover:bg-surface-container-low transition-colors">
                    <div>
                      <h4 className="text-xs font-bold text-on-surface">{item.label}</h4>
                      <p className="text-[11px] text-on-surface-variant mt-0.5">{item.desc}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => toggleMasking(item.key)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
                        masking[item.key] ? 'bg-primary' : 'bg-surface-container-highest'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform shadow ${
                          masking[item.key] ? 'translate-x-6' : 'translate-x-1'
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
        <div className="px-6 py-4 border-t border-outline-variant/15 bg-surface-container-low flex justify-between items-center">
          <span className="text-[11px] text-on-surface-variant font-medium">
            Changes auto-save directly to enterprise Supabase cloud memory.
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-primary text-white text-xs font-bold hover:opacity-90 shadow-sm transition-opacity"
          >
            Done
          </button>
        </div>

      </div>
    </div>
  );
}
