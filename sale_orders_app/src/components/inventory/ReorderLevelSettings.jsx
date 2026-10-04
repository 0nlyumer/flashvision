import React, { useState, useMemo, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { useDialog } from '../../context/DialogContext';

export default function ReorderLevelSettings() {
  const { state, setState } = useApp();
  const { appAlert, appConfirm } = useDialog();

  const items = state.items || [];
  const departments = state.departments || [];

  // Filter States
  const [selectedDept, setSelectedDept] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  // Local editing levels dictionary
  const [localLevels, setLocalLevels] = useState({});

  // Reset local inputs when selected department changes
  useEffect(() => {
    setLocalLevels({});
  }, [selectedDept]);

  // Filter items that belong to the selected department and match search query
  const filteredItems = useMemo(() => {
    if (!selectedDept) return [];
    
    return items.filter(item => {
      // 1. Department match (supporting comma-separated list of departments)
      const depts = (item.department || '').split(',').map(d => d.trim()).filter(Boolean);
      if (!depts.includes(selectedDept)) return false;

      // 2. Search match
      if (searchQuery) {
        const lowerQ = searchQuery.toLowerCase();
        const nameMatch = (item.name || '').toLowerCase().includes(lowerQ);
        const skuMatch = (item.sku || '').toLowerCase().includes(lowerQ);
        if (!nameMatch && !skuMatch) return false;
      }

      return true;
    });
  }, [items, selectedDept, searchQuery]);

  // Handle Save Reorder Level for a single item
  const handleSaveLevel = async (item) => {
    if (!selectedDept) return;

    const rawVal = localLevels[item.id];
    
    // If input is empty/cleared, we can remove the reorder level
    if (rawVal === '' || rawVal === undefined) {
      const proceed = await appConfirm(
        `Are you sure you want to clear the reorder level alert for "${item.name}" in ${selectedDept}?`,
        "Clear Alert Level",
        "Clear Alert",
        "Cancel"
      );
      if (!proceed) return;

      const updatedItems = items.map(it => {
        if (it.id === item.id) {
          const newReorderLevels = { ...(it.reorderLevelsByDept || {}) };
          delete newReorderLevels[selectedDept];
          return {
            ...it,
            reorderLevelsByDept: newReorderLevels
          };
        }
        return it;
      });

      setState(prev => ({ ...prev, items: updatedItems }));
      appAlert('Reorder alert cleared successfully.', 'success');
      return;
    }

    const val = parseFloat(rawVal);
    if (isNaN(val) || val < 0) {
      appAlert('Please enter a valid non-negative number.', 'error');
      return;
    }

    const updatedItems = items.map(it => {
      if (it.id === item.id) {
        return {
          ...it,
          reorderLevelsByDept: {
            ...(it.reorderLevelsByDept || {}),
            [selectedDept]: val
          }
        };
      }
      return it;
    });

    setState(prev => ({ ...prev, items: updatedItems }));
    appAlert(`Reorder alert level set to ${val} for "${item.name}" in ${selectedDept}.`, 'success');
  };

  // Helper to determine if an item is below reorder level and check PD status
  const getAlertStatus = (item) => {
    const level = item.reorderLevelsByDept?.[selectedDept];
    if (level === undefined || level === null) {
      return { label: 'Not Configured', style: 'bg-slate-100 text-slate-700 border border-slate-200' };
    }

    // Determine current stock (total stock or sum)
    let currentStock = 0;
    if (item.stockByType && Object.keys(item.stockByType).length > 0) {
      currentStock = Object.values(item.stockByType).reduce((sum, v) => sum + (Number(v) || 0), 0);
    } else {
      currentStock = Number(item.stock || 0);
    }

    if (currentStock <= level) {
      // Check if a pending/ordered PD exists for this item in this department
      const hasPendingPD = (state.purchaseDemands || []).some(pd => 
        pd.department === selectedDept &&
        (pd.status === 'Pending' || pd.status === 'Ordered') &&
        pd.items?.some(it => it.itemId === item.id || it.itemCode === item.sku || it.itemCode === item.id)
      );

      if (hasPendingPD) {
        return { label: 'Low Stock (PD Active)', style: 'bg-red-100 text-red-700 border border-red-200 font-black animate-pulse' };
      }
      return { label: 'Low Stock', style: 'bg-orange-100 text-orange-700 border border-orange-200 font-bold' };
    }

    return { label: 'Stock Normal', style: 'bg-emerald-100 text-emerald-700 border border-emerald-200 font-medium' };
  };

  return (
    <div className="flex flex-col h-full space-y-6 animate-in fade-in duration-500">
      
      {/* Header bar and Filters */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-surface-container-lowest p-6 rounded-3xl border border-outline-variant/15 shadow-sm">
        <div>
          <div className="flex items-center gap-2 text-primary font-bold text-sm tracking-widest uppercase mb-1">
            <span className="material-symbols-outlined text-[16px]">notifications_active</span>
            Stock Alert Levels
          </div>
          <h2 className="text-3xl font-black text-on-surface">Reorder Levels Setup</h2>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 items-center shrink-0 w-full md:w-auto">
          {/* Department Selector */}
          <div className="relative w-full sm:w-64">
            <select
              value={selectedDept}
              onChange={e => setSelectedDept(e.target.value)}
              className="w-full pl-4 pr-10 py-3 bg-surface border border-outline-variant/30 rounded-2xl text-sm focus:ring-2 focus:ring-primary outline-none appearance-none font-bold text-on-surface"
            >
              <option value="">-- Select Department --</option>
              {departments.map(dept => (
                <option key={dept.id || dept} value={dept.name || dept}>
                  {dept.name || dept}
                </option>
              ))}
            </select>
            <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none">expand_more</span>
          </div>

          {/* Item Search Bar */}
          <div className="relative w-full sm:w-72">
            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant text-sm">search</span>
            <input
              type="text"
              placeholder="Search by Name or SKU..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              disabled={!selectedDept}
              className="w-full pl-11 pr-4 py-3 bg-surface border border-outline-variant/30 rounded-2xl text-sm focus:ring-2 focus:ring-primary outline-none text-on-surface disabled:opacity-50 disabled:bg-surface-container-low"
            />
          </div>
        </div>
      </div>

      {/* Main Grid Container */}
      <div className="bg-surface-container-lowest rounded-3xl border border-outline-variant/15 shadow-sm overflow-hidden flex flex-col flex-1 min-h-[500px]">
        {selectedDept ? (
          <div className="flex flex-col h-full flex-1">
            <header className="px-6 py-4 border-b border-outline-variant/10 flex justify-between items-center bg-surface-container-low/20">
              <span className="text-xs font-bold text-on-surface-variant uppercase tracking-widest">
                Items Mapped in "{selectedDept}" ({filteredItems.length} items)
              </span>
            </header>

            <div className="flex-1 overflow-auto">
              {filteredItems.length > 0 ? (
                <table className="w-full text-left text-sm border-collapse">
                  <thead className="bg-surface-container-low/40 text-on-surface-variant border-b border-outline-variant/10 sticky top-0 backdrop-blur z-10">
                    <tr>
                      <th className="px-6 py-4 font-bold text-xs uppercase tracking-wider">Item SKU / Code</th>
                      <th className="px-6 py-4 font-bold text-xs uppercase tracking-wider">Item Name</th>
                      <th className="px-6 py-4 font-bold text-xs uppercase tracking-wider">Category</th>
                      <th className="px-6 py-4 font-bold text-xs uppercase tracking-wider text-right">Current Stock</th>
                      <th className="px-6 py-4 font-bold text-xs uppercase tracking-wider text-center">Alert Status</th>
                      <th className="px-6 py-4 font-bold text-xs uppercase tracking-wider w-44">Reorder Level Alert</th>
                      <th className="px-6 py-4 font-bold text-xs uppercase tracking-wider text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-outline-variant/10 font-medium text-on-surface">
                    {filteredItems.map(item => {
                      const status = getAlertStatus(item);
                      
                      // Calculate stock
                      let currentStock = 0;
                      if (item.stockByType && Object.keys(item.stockByType).length > 0) {
                        currentStock = Object.values(item.stockByType).reduce((sum, v) => sum + (Number(v) || 0), 0);
                      } else {
                        currentStock = Number(item.stock || 0);
                      }

                      // Read local input value or fallback to saved level
                      const currentInputValue = localLevels[item.id] !== undefined 
                        ? localLevels[item.id] 
                        : (item.reorderLevelsByDept?.[selectedDept] !== undefined ? item.reorderLevelsByDept[selectedDept] : '');

                      return (
                        <tr key={item.id} className="hover:bg-surface-container-low/20 transition-colors">
                          <td className="px-6 py-4 font-mono text-xs text-primary font-bold">
                            {item.sku || item.id}
                          </td>
                          <td className="px-6 py-4">
                            <div>
                              <div className="font-bold text-sm text-on-surface">{item.name}</div>
                              <div className="text-[10px] text-on-surface-variant max-w-[200px] truncate" title={item.specifications || item.description}>
                                {item.specifications || item.description || 'No description'}
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-xs text-on-surface-variant">
                            {item.category || 'Item'}
                          </td>
                          <td className="px-6 py-4 text-right font-black">
                            {currentStock.toLocaleString(undefined, { maximumFractionDigits: 2 })} {item.uom || 'Units'}
                          </td>
                          <td className="px-6 py-4 text-center">
                            <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${status.style}`}>
                              {status.label}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="relative">
                              <input
                                type="number"
                                min="0"
                                placeholder="Not Configured"
                                value={currentInputValue}
                                onChange={e => setLocalLevels({ ...localLevels, [item.id]: e.target.value })}
                                className="w-full bg-surface border border-outline-variant/30 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-primary outline-none font-bold text-on-surface"
                              />
                            </div>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <button
                              onClick={() => handleSaveLevel(item)}
                              className="bg-primary text-on-primary rounded-xl px-4 py-2 text-xs font-black flex items-center justify-center gap-1 hover:bg-primary/95 transition-all shadow active:scale-95 ml-auto"
                            >
                              <span className="material-symbols-outlined text-[14px]">save</span>
                              Save
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              ) : (
                <div className="py-24 text-center text-on-surface-variant text-sm font-medium">
                  No items found in this department.
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center p-12 text-center flex-1">
            <span className="material-symbols-outlined text-primary/30 text-5xl mb-4" style={{ fontVariationSettings: "'FILL' 0" }}>corporate_fare</span>
            <h3 className="text-lg font-bold text-on-surface mb-1">Select a Department</h3>
            <p className="text-sm text-on-surface-variant max-w-sm">
              Please select a department from the top dropdown to load the items and manage their department-wise alert levels.
            </p>
          </div>
        )}
      </div>

    </div>
  );
}
