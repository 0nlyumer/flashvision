import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { useDialog } from '../../context/DialogContext';

export default function ClothQualitySetup() {
  const { state, setState } = useApp();
  const { appAlert } = useDialog();

  const items = state.items || [];

  // Filter raw materials where rawMaterialType is 'Cloth'
  const clothItems = useMemo(() => {
    return items.filter(item => 
      (item.category === 'Raw Material' || item.type === 'Raw Material') && 
      item.rawMaterialType === 'Cloth'
    );
  }, [items]);

  // States
  const [searchQuery, setSearchQuery] = useState('');
  const [localQualities, setLocalQualities] = useState({});

  // Calculator Simulator States
  const [simSelectedId, setSimSelectedId] = useState('');
  const [simKgs, setSimKgs] = useState('');
  const [simMeters, setSimMeters] = useState('');

  // Filtered cloth items for the list
  const filteredClothItems = useMemo(() => {
    return clothItems.filter(item => {
      const lowerQ = searchQuery.toLowerCase();
      return (
        (item.name || '').toLowerCase().includes(lowerQ) ||
        (item.sku || '').toLowerCase().includes(lowerQ)
      );
    });
  }, [clothItems, searchQuery]);

  // Handle Save Cloth Quality
  const handleSaveQuality = (item) => {
    const rawVal = localQualities[item.id];
    
    if (rawVal === '' || rawVal === undefined) {
      appAlert('Please enter a valid numeric value.', 'error');
      return;
    }

    const val = parseFloat(rawVal);
    if (isNaN(val) || val <= 0) {
      appAlert('Please enter a valid positive quality factor (meters per KG).', 'error');
      return;
    }

    const updatedItems = items.map(it => {
      if (it.id === item.id) {
        return {
          ...it,
          clothQuality: val
        };
      }
      return it;
    });

    setState(prev => ({ ...prev, items: updatedItems }));
    appAlert(`Cloth Quality saved! 1 KG of "${item.name}" is set to ${val} Meters.`, 'success');
  };

  // Simulator conversion logic
  const selectedSimCloth = useMemo(() => {
    return clothItems.find(i => i.id === simSelectedId);
  }, [clothItems, simSelectedId]);

  const handleSimKgsChange = (val) => {
    setSimKgs(val);
    if (!selectedSimCloth || !selectedSimCloth.clothQuality) {
      setSimMeters('');
      return;
    }
    const kgs = parseFloat(val);
    if (isNaN(kgs) || kgs < 0) {
      setSimMeters('');
      return;
    }
    setSimMeters((kgs * selectedSimCloth.clothQuality).toFixed(2));
  };

  const handleSimMetersChange = (val) => {
    setSimMeters(val);
    if (!selectedSimCloth || !selectedSimCloth.clothQuality) {
      setSimKgs('');
      return;
    }
    const meters = parseFloat(val);
    if (isNaN(meters) || meters < 0) {
      setSimKgs('');
      return;
    }
    setSimKgs((meters / selectedSimCloth.clothQuality).toFixed(2));
  };

  // Reset simulator when cloth changes
  const handleSimClothChange = (id) => {
    setSimSelectedId(id);
    setSimKgs('');
    setSimMeters('');
  };

  return (
    <div className="flex flex-col xl:flex-row gap-6 animate-in fade-in duration-500 pb-16">
      
      {/* Left side: Cloth list table */}
      <div className="flex-1 flex flex-col space-y-6">
        
        {/* Header & Filter Row */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-surface-container-lowest p-6 rounded-3xl border border-outline-variant/15 shadow-sm">
          <div>
            <div className="flex items-center gap-2 text-primary font-bold text-sm tracking-widest uppercase mb-1">
              <span className="material-symbols-outlined text-[16px]">texture</span>
              Fabric Yield Parameters
            </div>
            <h2 className="text-3xl font-black text-on-surface">Cloth Quality Setup</h2>
          </div>

          <div className="relative w-full sm:w-72 shrink-0">
            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant text-sm">search</span>
            <input
              type="text"
              placeholder="Search Cloth Materials..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-surface border border-outline-variant/30 rounded-2xl text-sm focus:ring-2 focus:ring-primary outline-none text-on-surface"
            />
          </div>
        </div>

        {/* Main Grid Card */}
        <div className="bg-surface-container-lowest rounded-3xl border border-outline-variant/15 shadow-sm overflow-hidden flex flex-col flex-1 min-h-[400px]">
          <table className="w-full text-left text-sm border-collapse">
            <thead className="bg-surface-container-low/40 text-on-surface-variant border-b border-outline-variant/10 sticky top-0 backdrop-blur z-10">
              <tr>
                <th className="px-6 py-4 font-bold text-xs uppercase tracking-wider">SKU / Code</th>
                <th className="px-6 py-4 font-bold text-xs uppercase tracking-wider">Cloth Material Name</th>
                <th className="px-6 py-4 font-bold text-xs uppercase tracking-wider">Specifications</th>
                <th className="px-6 py-4 font-bold text-xs uppercase tracking-wider text-center">Standard UOM</th>
                <th className="px-6 py-4 font-bold text-xs uppercase tracking-wider w-56">Quality Factor (Meters / 1 KG)</th>
                <th className="px-6 py-4 font-bold text-xs uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/10 font-medium text-on-surface">
              {filteredClothItems.map(item => {
                const currentVal = localQualities[item.id] !== undefined
                  ? localQualities[item.id]
                  : (item.clothQuality !== undefined ? item.clothQuality : '');

                return (
                  <tr key={item.id} className="hover:bg-surface-container-low/20 transition-colors">
                    <td className="px-6 py-4 font-mono text-xs text-primary font-bold">
                      {item.sku || item.id}
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-bold text-sm text-on-surface">{item.name}</div>
                    </td>
                    <td className="px-6 py-4 text-xs text-on-surface-variant max-w-[200px] truncate" title={item.specifications || 'No specs'}>
                      {item.specifications || 'None'}
                    </td>
                    <td className="px-6 py-4 text-center text-xs font-bold text-on-surface-variant uppercase">
                      {item.uom || 'KG'}
                    </td>
                    <td className="px-6 py-4">
                      <div className="relative flex items-center">
                        <input
                          type="number"
                          step="0.01"
                          min="0.01"
                          placeholder="Not Configured"
                          value={currentVal}
                          onChange={e => setLocalQualities({ ...localQualities, [item.id]: e.target.value })}
                          className="w-full bg-surface border border-outline-variant/30 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-primary outline-none font-bold text-on-surface pr-14"
                        />
                        <span className="absolute right-3 text-[10px] font-black text-on-surface-variant uppercase tracking-wider pointer-events-none">M / KG</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => handleSaveQuality(item)}
                        className="bg-primary text-on-primary rounded-xl px-4 py-2 text-xs font-black flex items-center justify-center gap-1 hover:bg-primary/95 transition-all shadow active:scale-95 ml-auto"
                      >
                        <span className="material-symbols-outlined text-[14px]">save</span>
                        Save
                      </button>
                    </td>
                  </tr>
                );
              })}
              {filteredClothItems.length === 0 && (
                <tr>
                  <td colSpan="6" className="py-24 text-center text-on-surface-variant text-sm font-medium">
                    No registered raw materials with type "Cloth" found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Right side: Simulator calculator panel */}
      <div className="w-full xl:w-96 shrink-0 space-y-6">
        
        <div className="bg-gradient-to-br from-surface-container-lowest to-surface-container-low p-6 rounded-3xl border border-outline-variant/20 shadow-sm relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-full -z-10 group-hover:scale-110 transition-transform"></div>
          <h3 className="font-bold text-sm tracking-widest uppercase text-on-surface-variant mb-6 inline-flex items-center gap-2">
            <span className="material-symbols-outlined text-[18px]">calculate</span> Converter Simulator
          </h3>
          
          <div className="space-y-5">
            {/* Pick Cloth Dropdown */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant ml-1">Select Cloth Type</label>
              <div className="relative">
                <select
                  value={simSelectedId}
                  onChange={e => handleSimClothChange(e.target.value)}
                  className="w-full pl-4 pr-10 py-3 bg-surface border border-outline-variant/30 rounded-2xl text-sm focus:ring-2 focus:ring-primary outline-none appearance-none font-bold text-on-surface"
                >
                  <option value="">-- Select Cloth --</option>
                  {clothItems.map(item => (
                    <option key={item.id} value={item.id}>{item.name}</option>
                  ))}
                </select>
                <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none">expand_more</span>
              </div>
            </div>

            {/* Quality Factor Badge */}
            {selectedSimCloth && (
              <div className="bg-primary/5 border border-primary/20 p-4 rounded-2xl">
                <div className="text-[10px] font-black uppercase tracking-wider text-primary mb-1">Configured Conversion Quality</div>
                <div className="text-sm font-bold text-on-surface">
                  {selectedSimCloth.clothQuality ? (
                    <span>1 KG = <strong className="text-primary font-manrope text-base">{selectedSimCloth.clothQuality}</strong> Meters</span>
                  ) : (
                    <span className="italic text-on-surface-variant/75">Not configured. Set quality factor in the table to start calculations.</span>
                  )}
                </div>
              </div>
            )}

            {/* Input fields */}
            <div className="grid grid-cols-1 gap-4 pt-2">
              {/* KG Input */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant ml-1">Weight (KGs)</label>
                <div className="relative flex items-center">
                  <input
                    type="number"
                    placeholder="0.00"
                    value={simKgs}
                    onChange={e => handleSimKgsChange(e.target.value)}
                    disabled={!selectedSimCloth || !selectedSimCloth.clothQuality}
                    className="w-full pl-4 pr-12 py-3 bg-surface border border-outline-variant/30 rounded-2xl text-sm focus:ring-2 focus:ring-primary outline-none font-bold text-on-surface disabled:opacity-50 disabled:bg-surface-container-low"
                  />
                  <span className="absolute right-4 text-xs font-bold text-on-surface-variant">KG</span>
                </div>
              </div>

              {/* Bidirectional Arrow indicator */}
              <div className="flex justify-center -my-2">
                <span className="material-symbols-outlined text-primary/40 text-[20px] select-none">sync_alt</span>
              </div>

              {/* Meters Input */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant ml-1">Length (Meters)</label>
                <div className="relative flex items-center">
                  <input
                    type="number"
                    placeholder="0.00"
                    value={simMeters}
                    onChange={e => handleSimMetersChange(e.target.value)}
                    disabled={!selectedSimCloth || !selectedSimCloth.clothQuality}
                    className="w-full pl-4 pr-12 py-3 bg-surface border border-outline-variant/30 rounded-2xl text-sm focus:ring-2 focus:ring-primary outline-none font-bold text-on-surface disabled:opacity-50 disabled:bg-surface-container-low"
                  />
                  <span className="absolute right-4 text-xs font-bold text-on-surface-variant">Mtr</span>
                </div>
              </div>
            </div>

            {!simSelectedId && (
              <div className="text-xs text-on-surface-variant/75 italic text-center py-4">
                Please select a cloth item above to test the yield calculator.
              </div>
            )}
          </div>
        </div>

      </div>

    </div>
  );
}
