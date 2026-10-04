import React, { useState, useRef, useEffect } from 'react';
import ResizableHeader from '../ui/ResizableHeader';
import { useApp } from '../../context/AppContext';
import { useDialog } from '../../context/DialogContext';
import CustomSelect from '../ui/CustomSelect';

export default function StockDemand({ onHistoryClick, initialDemand, isViewOnly }) {
    const { state, setCollection } = useApp();
    const { appConfirm, appAlert } = useDialog();
    
    const [requestingDepartment, setRequestingDepartment] = useState("Production Department");
    const [targetDepartment, setTargetDepartment] = useState("");
    const [targetDate, setTargetDate] = useState('');
    const [demandItems, setDemandItems] = useState([]);
    const [minStockThreshold, setMinStockThreshold] = useState('');
    const [invalidRows, setInvalidRows] = useState([]);

    useEffect(() => {
        if (initialDemand) {
            setRequestingDepartment(initialDemand.department || "Production Department");
            setTargetDepartment(initialDemand.targetDepartment || "");
            setTargetDate(initialDemand.targetDate || '');
            setDemandItems(initialDemand.items || []);
        } else {
            setRequestingDepartment("Production Department");
            setTargetDepartment("");
            setTargetDate('');
            setDemandItems([]);
        }
    }, [initialDemand]);
    
    // Determine Demand ID based on existing demands if we had them, defaulting to 001
    const demandsCount = state.stockDemands ? state.stockDemands.length : 0;
    const nextDemandId = initialDemand ? initialDemand.id : `DMD-${String(demandsCount + 1).padStart(3, '0')}`;

    // Item Search Dropdown State for the "Add Row" functionality
    const [searchQuery, setSearchQuery] = useState('');
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsDropdownOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Filter items based on Target Department and search query
    const availableItems = (state.items || []).filter(item => {
        if (targetDepartment) {
            const depts = (item.department || '').split(',').map(d => d.trim()).filter(Boolean);
            if (!depts.includes(targetDepartment)) return false;
        }
        if (searchQuery && !item.name.toLowerCase().includes(searchQuery.toLowerCase()) && !item.sku.toLowerCase().includes(searchQuery.toLowerCase())) return false;
        return true;
    });

    const handleBackClick = async () => {
        if (demandItems.length > 0 || targetDate) {
            if (await appConfirm("You have unsaved changes. Are you sure you want to leave without saving?")) {
                onHistoryClick();
            }
        } else {
            onHistoryClick();
        }
    };

    const handleSubmit = () => {
        if (demandItems.length === 0) return appAlert('Please add at least one item.');
        if (!targetDepartment) return appAlert('Please select a Target Department.');
        
        const invalidIds = demandItems.filter(item => !Number(item.qty)).map(item => item.id);
        if (invalidIds.length > 0) {
            setInvalidRows(invalidIds);
            return appAlert('Some items have missing or zero quantities. Please fill them before submitting.');
        }
        
        setInvalidRows([]);
        
        if (initialDemand) {
            // Update existing
            const updatedDemand = { ...initialDemand, department: requestingDepartment, targetDepartment, targetDate, items: demandItems };
            const updatedDemands = state.stockDemands.map(d => d.id === initialDemand.id ? updatedDemand : d);
            setCollection('stockDemands', updatedDemands);
        } else {
            // Create new
            const newDemand = {
                id: nextDemandId,
                requestedBy: state.currentUser?.name || "System User",
                department: requestingDepartment,
                targetDepartment: targetDepartment,
                date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute:'2-digit' }),
                targetDate: targetDate,
                status: 'Pending',
                items: demandItems
            };
            const updatedDemands = [...(state.stockDemands || []), newDemand];
            setCollection('stockDemands', updatedDemands);
        }
        
        onHistoryClick();
    };

    const handleAddItem = (item) => {
        const packingSize = Number(item.packingSizeRaw || item.packingSize || 1);
        
        setDemandItems(prev => [...prev, {
            id: Date.now().toString() + Math.random().toString(36).substr(2, 5),
            itemId: item.id,
            sku: item.sku,
            name: item.name,
            qty: '',
            packingQty: '',
            unit: item.uom || item.unit,
            packingType: item.packingType || 'Box',
            packingSizeRaw: packingSize,
            type: '',
            remarks: ''
        }]);
        setSearchQuery('');
        setIsDropdownOpen(false);
    };

    const handleAutoLoad = () => {
        const threshold = Number(minStockThreshold);
        if (isNaN(threshold) || minStockThreshold === '') {
            return appAlert('Please enter a valid number for the minimum stock threshold.');
        }
        if (!targetDepartment) {
            return appAlert('Please select a Target Department first.');
        }
        
        const lowStockItems = state.items.filter(item => {
            const depts = (item.department || '').split(',').map(d => d.trim()).filter(Boolean);
            if (!depts.includes(targetDepartment)) return false;
            const currentStock = Number(item.stock) || 0;
            return currentStock <= threshold;
        });

        if (lowStockItems.length === 0) {
            return appAlert(`No items found below or equal to ${threshold} stock in ${targetDepartment}.`);
        }

        const newItems = lowStockItems.map(item => ({
            id: Date.now().toString() + Math.random().toString(36).substr(2, 5),
            itemId: item.id,
            sku: item.sku,
            name: item.name,
            qty: '',
            packingQty: '',
            unit: item.uom || item.unit,
            packingType: item.packingType || 'Box',
            packingSizeRaw: Number(item.packingSizeRaw || item.packingSize || 1),
            type: '',
            remarks: ''
        }));

        setDemandItems(prev => {
            const existingItemIds = new Set(prev.map(r => r.itemId));
            const filteredNewItems = newItems.filter(item => !existingItemIds.has(item.itemId));
            
            if (filteredNewItems.length === 0) {
                appAlert('All low stock items are already in your demand list.');
                return prev;
            }
            
            return [...prev, ...filteredNewItems];
        });
    };

    const handleUpdateRow = (rowId, field, value) => {
        if (invalidRows.includes(rowId)) {
            setInvalidRows(prev => prev.filter(id => id !== rowId));
        }
        setDemandItems(prev => prev.map(row => {
            if (row.id === rowId) {
                const updatedRow = { ...row, [field]: value };
                
                // Bidirectional Math
                const pSize = Number(updatedRow.packingSizeRaw || 1);
                if (field === 'qty') {
                    const q = Number(value);
                    if (!isNaN(q)) {
                        updatedRow.packingQty = pSize > 0 ? (q / pSize).toFixed(2).replace(/\.00$/, '') : q;
                    } else {
                        updatedRow.packingQty = '';
                    }
                } else if (field === 'packingQty') {
                    const pq = Number(value);
                    if (!isNaN(pq)) {
                        updatedRow.qty = pSize > 0 ? (pq * pSize).toString() : pq.toString();
                    } else {
                        updatedRow.qty = '';
                    }
                }

                // Type detection
                const currentQty = Number(updatedRow.qty);
                if (currentQty > 0) {
                    if (currentQty < pSize || currentQty % pSize !== 0) {
                        updatedRow.type = 'Loose';
                    } else {
                        updatedRow.type = 'Packing Standard';
                    }
                } else {
                    updatedRow.type = '';
                }

                return updatedRow;
            }
            return row;
        }));
    };

    const handleRemoveRow = (rowId) => {
        setDemandItems(prev => prev.filter(r => r.id !== rowId));
    };

    const handleRowBlur = (row) => {
        if (!row.type) return;
        
        // Count how many entries of this item have this type
        const sameTypeEntries = demandItems.filter(r => r.itemId === row.itemId && r.type === row.type);
        if (sameTypeEntries.length > 1) {
            appAlert(`You can only have one "${row.type}" entry for item ${row.name}. Please consolidate your quantities.`);
            handleUpdateRow(row.id, 'qty', '');
        }
    };

    return (
        <div className="w-full mx-auto animate-in fade-in zoom-in-95 duration-300">
            {/* Page Header */}
            <div className="mb-8 flex justify-between items-start">
                <div>
                    <button onClick={handleBackClick} className="flex items-center gap-2 text-sm text-on-surface-variant hover:text-primary transition-colors mb-4 group font-medium">
                        <span className="material-symbols-outlined text-[18px] group-hover:-translate-x-1 transition-transform">arrow_back</span>
                        Back to History
                    </button>
                    <h2 className="text-4xl font-extrabold text-on-surface tracking-tight font-manrope">Stock Demand</h2>
                    <p className="font-body text-on-surface-variant mt-2 max-w-2xl">Initiate a formal request for materials from inventory to support production workflows.</p>
                </div>
            </div>

            {/* Form Layout */}
            <div className="bg-surface-container-lowest rounded-[2rem] shadow-[0_20px_40px_rgba(0,28,56,0.06)] border border-outline-variant/10">
                {/* Section 1: Demand Details */}
                <div className="p-8 border-b border-surface-container-low">
                    <h3 className="font-headline text-lg font-semibold text-on-surface mb-6 flex items-center gap-2">
                        <span className="material-symbols-outlined text-primary">info</span>
                        Demand Details
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div>
                            <label className="block font-body text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-2">Demand ID</label>
                            <div className="bg-surface text-on-surface-variant font-body text-sm py-3 px-4 rounded-lg border border-outline-variant/10 flex items-center justify-between opacity-70">
                                <span className="font-bold text-primary">{nextDemandId}</span>
                                <span className="text-xs bg-surface-container px-2 py-1 rounded">Auto-generated</span>
                            </div>
                        </div>
                        <div>
                            <label className="block font-body text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-2">Requesting Department</label>
                            <div className="relative">
                                <CustomSelect
                                    name="requestingDepartment"
                                    value={requestingDepartment}
                                    onChange={(e) => setRequestingDepartment(e.target.value)}
                                    options={(state.departments || ['Production Department', 'Assembly Division', 'Quality Assurance']).map(d => ({label: d.label || d, value: d.value || d}))}
                                    placeholder="Select Requesting Department"
                                    disabled={isViewOnly}
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block font-body text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-2">Target Department (Demand From)</label>
                            <div className="relative">
                                <CustomSelect
                                    name="targetDepartment"
                                    value={targetDepartment}
                                    onChange={(e) => {
                                        setTargetDepartment(e.target.value);
                                        // Clear items if target department changes to avoid mismatches
                                        if (demandItems.length > 0) {
                                            if (window.confirm("Changing the target department will clear your currently added items. Continue?")) {
                                                setDemandItems([]);
                                            } else {
                                                return; // Abort change
                                            }
                                        }
                                    }}
                                    options={(state.departments || ['Main Inventory', 'Raw Material Godown']).map(d => ({label: d.label || d, value: d.value || d}))}
                                    placeholder="Select Source Department"
                                    disabled={isViewOnly}
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block font-body text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-2">Target Date</label>
                            <div className="relative">
                                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-sm">calendar_month</span>
                                <input disabled={isViewOnly} value={targetDate} onChange={(e) => setTargetDate(e.target.value)} className="w-full bg-surface-container-low text-on-surface font-body text-sm py-3 pl-10 pr-4 rounded-lg border-b border-outline-variant/20 focus:outline-none focus:bg-surface-container-lowest focus:border-primary/50 transition-all cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed" type="date" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Section 2: Auto Load Low Stock */}
                <div className="p-8 border-b border-surface-container-low bg-surface/50">
                    <h3 className="font-headline text-sm font-bold text-on-surface mb-4 flex items-center gap-2">
                        <span className="material-symbols-outlined text-primary text-[18px]">auto_awesome</span>
                        Auto-load Low Stock Items
                    </h3>
                    <div className="flex items-end gap-4 max-w-xl">
                        <div className="flex-1">
                            <label className="block font-body text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-2">Minimum Stock Threshold</label>
                            <div className="relative">
                                <input 
                                    type="number" 
                                    value={minStockThreshold} 
                                    onChange={(e) => setMinStockThreshold(e.target.value)} 
                                    placeholder="e.g. 100"
                                    disabled={isViewOnly}
                                    className="w-full bg-surface-container-lowest text-on-surface font-body text-sm py-2.5 px-4 rounded-lg border border-outline-variant/30 focus:outline-none focus:ring-2 focus:ring-primary transition-all disabled:opacity-70 disabled:cursor-not-allowed" 
                                />
                            </div>
                        </div>
                        <button 
                            onClick={handleAutoLoad} 
                            disabled={!targetDepartment || isViewOnly}
                            className="px-6 py-2.5 rounded-lg bg-secondary-container text-on-secondary-container font-body text-sm font-semibold hover:bg-secondary-container/80 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
                        >
                            <span className="material-symbols-outlined text-[18px]">download</span>
                            Load Items
                        </button>
                    </div>
                    {!targetDepartment && <p className="text-xs text-error mt-2">Please select a Target Department first.</p>}
                </div>

                {/* Section 3: Requested Items */}
                <div className="p-8 bg-surface">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="font-headline text-lg font-semibold text-on-surface flex items-center gap-2">
                            <span className="material-symbols-outlined text-primary">category</span>
                            Requested Items
                        </h3>
                    </div>
                    {/* Removed overflow-hidden to allow dropdown and table to expand naturally */}
                    <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/10 overflow-visible">
                        <div className="w-full">
                            <table className="w-full text-left border-collapse" style={{ tableLayout: 'fixed' }}>
                                <thead>
                                    <tr className="bg-surface-container-low border-b border-outline-variant/10">
                                        <ResizableHeader className="py-3 px-4 font-body text-xs font-semibold text-on-surface-variant uppercase tracking-wider" style={{ width: '25%' }}>Item</ResizableHeader>
                                        <ResizableHeader className="py-3 px-4 font-body text-xs font-semibold text-on-surface-variant uppercase tracking-wider" style={{ width: '15%' }}>Packing Qty</ResizableHeader>
                                        <ResizableHeader className="py-3 px-4 font-body text-xs font-semibold text-on-surface-variant uppercase tracking-wider" style={{ width: '15%' }}>Item Qty</ResizableHeader>
                                        <ResizableHeader className="py-3 px-4 font-body text-xs font-semibold text-on-surface-variant uppercase tracking-wider" style={{ width: '18%' }}>Type</ResizableHeader>
                                        <ResizableHeader className="py-3 px-4 font-body text-xs font-semibold text-on-surface-variant uppercase tracking-wider">Remarks</ResizableHeader>
                                        <th className="py-3 px-4 w-12 border-l border-outline-variant/10"></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {demandItems.map((row) => (
                                        <tr key={row.id} className={`border-b border-outline-variant/5 group hover:bg-surface-container-low/50 transition-colors ${invalidRows.includes(row.id) ? 'bg-error-container/20' : ''}`}>
                                            <td className="py-3 px-4 border-l border-r border-outline-variant/5">
                                                <div className="font-bold text-on-surface text-sm">{row.name}</div>
                                                <div className="text-xs text-on-surface-variant">{row.sku} (Pack Size: {row.packingSizeRaw})</div>
                                            </td>
                                            <td className="py-3 px-4 border-r border-outline-variant/5">
                                                <div className="flex items-center gap-2">
                                                    <input 
                                                        className={`w-16 bg-surface-container-low text-on-surface font-body text-sm rounded border-none focus:ring-1 focus:ring-primary px-2 py-1 text-center ${invalidRows.includes(row.id) && !Number(row.packingQty) ? 'ring-1 ring-error bg-error/5' : ''}`} 
                                                        type="number" 
                                                        value={row.packingQty}
                                                        onChange={(e) => handleUpdateRow(row.id, 'packingQty', e.target.value)}
                                                        onBlur={() => handleRowBlur(row)}
                                                        disabled={isViewOnly}
                                                    />
                                                    <span className="text-xs text-on-surface-variant">{row.packingType}</span>
                                                </div>
                                            </td>
                                            <td className="py-3 px-4 border-r border-outline-variant/5">
                                                <div className="flex items-center gap-2">
                                                    <input 
                                                        className={`w-20 bg-surface-container-low text-on-surface font-body text-sm rounded border-none focus:ring-1 focus:ring-primary px-2 py-1 text-center ${invalidRows.includes(row.id) && !Number(row.qty) ? 'ring-1 ring-error bg-error/5' : ''}`} 
                                                        type="number" 
                                                        value={row.qty}
                                                        onChange={(e) => handleUpdateRow(row.id, 'qty', e.target.value)}
                                                        onBlur={() => handleRowBlur(row)}
                                                        disabled={isViewOnly}
                                                    />
                                                    <span className="text-xs text-on-surface-variant">{row.unit}</span>
                                                </div>
                                            </td>
                                            <td className="py-3 px-4 border-r border-outline-variant/5">
                                                <span className={`px-2 py-1 rounded text-xs font-bold ${
                                                    row.type === 'Loose' ? 'bg-secondary-container text-on-secondary-container' : 
                                                    row.type === 'Packing Standard' ? 'bg-tertiary-container text-on-tertiary-container' : 
                                                    'bg-surface-container text-outline'
                                                }`}>
                                                    {row.type || 'N/A'}
                                                </span>
                                            </td>
                                            <td className="py-3 px-4 border-r border-outline-variant/5">
                                                <input 
                                                    className="w-full bg-transparent text-on-surface-variant font-body text-sm border-none focus:ring-0 p-0" 
                                                    placeholder="Add remarks..." 
                                                    type="text" 
                                                    value={row.remarks}
                                                    onChange={(e) => handleUpdateRow(row.id, 'remarks', e.target.value)}
                                                    disabled={isViewOnly}
                                                />
                                            </td>
                                            <td className="py-3 px-4 text-center">
                                                {!isViewOnly && (
                                                    <button onClick={() => handleRemoveRow(row.id)} className="text-outline hover:text-error transition-colors opacity-0 group-hover:opacity-100">
                                                        <span className="material-symbols-outlined text-sm">delete</span>
                                                    </button>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                    <tr className="group hover:bg-surface-container-low/50 transition-colors">
                                        <td colSpan="6" className="py-3 px-4 border-l border-r border-outline-variant/5 relative" ref={dropdownRef}>
                                            <div className="relative">
                                                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-sm">search</span>
                                                <input 
                                                    className="w-full bg-transparent text-on-surface font-body text-sm border-none focus:ring-0 pl-10 py-2 placeholder-outline-variant" 
                                                    placeholder="Search inventory to add item..." 
                                                    type="text" 
                                                    value={searchQuery}
                                                    onChange={(e) => {
                                                        setSearchQuery(e.target.value);
                                                        setIsDropdownOpen(true);
                                                    }}
                                                    onClick={() => setIsDropdownOpen(true)}
                                                    disabled={!targetDepartment || isViewOnly}
                                                />
                                                {!targetDepartment && !isViewOnly && (
                                                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-error">
                                                        Select Target Department First
                                                    </span>
                                                )}
                                                {isDropdownOpen && searchQuery && (
                                                    <div className="absolute left-0 top-full mt-1 w-[400px] bg-surface rounded-xl shadow-xl border border-outline-variant/20 max-h-[300px] overflow-y-auto z-50">
                                                        {availableItems.length > 0 ? availableItems.map(item => (
                                                            <div 
                                                                key={item.id} 
                                                                onClick={() => handleAddItem(item)}
                                                                className="px-4 py-3 hover:bg-surface-container-low cursor-pointer border-b border-outline-variant/5 flex flex-col"
                                                            >
                                                                <span className="font-bold text-sm text-on-surface">{item.name}</span>
                                                                <div className="flex gap-4 text-xs text-on-surface-variant mt-1">
                                                                    <span>{item.sku}</span>
                                                                    <span>Pack Size: {item.packingSizeRaw || 1} {item.packingType}</span>
                                                                    <span>Stock: {item.stock}</span>
                                                                </div>
                                                            </div>
                                                        )) : (
                                                            <div className="px-4 py-3 text-sm text-on-surface-variant italic">No items found.</div>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>

            {/* Action Footer */}
            <div className="mt-8 flex justify-end gap-4 items-center">
                <button onClick={handleBackClick} className="px-6 py-3 rounded-lg text-primary font-body text-sm font-semibold hover:bg-surface-container-low transition-colors">
                    Cancel
                </button>
                {!isViewOnly && (
                    <button onClick={handleSubmit} className="px-8 py-3 rounded-lg bg-gradient-to-br from-primary to-primary-container text-on-primary font-body text-sm font-semibold shadow-[0_10px_20px_rgba(0,66,119,0.15)] flex items-center gap-2 hover:opacity-95 transition-opacity">
                        <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>send</span>
                        Submit Demand
                    </button>
                )}
            </div>
        </div>
    );
}
