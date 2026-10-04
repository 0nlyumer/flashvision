import React, { useState, useRef, useEffect } from 'react';
import ResizableHeader from '../ui/ResizableHeader';
import { useApp } from '../../context/AppContext';

import { useDialog } from '../../context/DialogContext';

export default function StockTransfer({ onHistoryClick }) {
    const { state, addStockTransfer, addNotification, setCollection } = useApp();
    const { appAlert } = useDialog();
    const [transferItems, setTransferItems] = useState([]);

    const [linkedDemandId, setLinkedDemandId] = useState('');
    const [sourceWarehouse, setSourceWarehouse] = useState('');
    const [destinationWarehouse, setDestinationWarehouse] = useState('');
    const [transferDate, setTransferDate] = useState(new Date().toISOString().split('T')[0]);

    const demandsList = state.stockDemands?.filter(d => d.status === 'Pending') || [];
    const departmentsList = state.departments?.map(d => typeof d === 'string' ? d : d.value) || ['Main Inventory', 'Production Department'];

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

    const availableItems = (state.items || []).filter(item => {
        if (sourceWarehouse) {
            const itemDepts = (item.department || '').split(',').map(d => d.trim()).filter(Boolean);
            const isAssigned = itemDepts.includes(sourceWarehouse);
            if (!isAssigned && (!item.stockByDepartment || !item.stockByDepartment[sourceWarehouse])) return false;
        }
        if (searchQuery && !item.name.toLowerCase().includes(searchQuery.toLowerCase()) && !item.sku.toLowerCase().includes(searchQuery.toLowerCase())) return false;
        return true;
    });

    const handleDemandSelect = (demandId) => {
        setLinkedDemandId(demandId);
        if (!demandId) {
            setTransferItems([]);
            return;
        }
        
        const demand = demandsList.find(d => d.id === demandId);
        if (demand) {
            setSourceWarehouse(demand.targetDepartment || '');
            setDestinationWarehouse(demand.department || '');
            
            const items = demand.items.map(di => {
                const itemDb = state.items?.find(i => i.id === di.itemId || i.sku === di.sku);
                const sourceDept = demand.targetDepartment;
                const currentStock = itemDb ? (
                    itemDb.stockByDepartment && itemDb.stockByDepartment[sourceDept] !== undefined 
                        ? itemDb.stockByDepartment[sourceDept] 
                        : (itemDb.department === sourceDept ? itemDb.stock : 0)
                ) : 0;
                
                return {
                    id: Date.now().toString() + Math.random().toString(36).substr(2, 5),
                    itemId: itemDb ? itemDb.id : di.itemId,
                    sku: di.sku,
                    name: di.name,
                    currentStock: currentStock,
                    qty: di.qty || 0,
                    uom: di.unit || 'Units'
                };
            });
            setTransferItems(items);
            addNotification('Demand Linked', `Loaded ${items.length} items from ${demandId}.`, 'success');
        }
    };

    const handleExecuteTransfer = () => {
        if (!transferDate) {
            addNotification('Validation Error', 'Transfer Date is mandatory. Please select a date.', 'error');
            return;
        }

        if (!sourceWarehouse) {
            addNotification('Validation Error', 'Please select a source warehouse.', 'error');
            return;
        }

        if (!destinationWarehouse) {
            addNotification('Validation Error', 'Please select a destination warehouse.', 'error');
            return;
        }

        if (sourceWarehouse === destinationWarehouse) {
            addNotification('Validation Error', 'Source and destination cannot be the same.', 'error');
            return;
        }
        
        if (transferItems.length === 0) {
            addNotification('Validation Error', 'Please add items to transfer.', 'error');
            return;
        }

        // Check if quantities exceed available stock
        const overstockItems = transferItems.filter(item => Number(item.qty) > Number(item.currentStock));
        if (overstockItems.length > 0) {
            const shortageDetails = overstockItems.map(item => `- ${item.name} (Available: ${item.currentStock}, Trying to transfer: ${item.qty})`).join('\n');
            appAlert(`Insufficient stock for the following items:\n${shortageDetails}\n\nPlease adjust the transfer quantities.`);
            return;
        }

        const transferCount = state.stockTransfers ? state.stockTransfers.length : 0;
        const transferId = `TRF-${String(transferCount + 1).padStart(4, '0')}`;
        
        const newTransfer = {
            id: transferId,
            linkedDemand: linkedDemandId,
            source: sourceWarehouse,
            destination: destinationWarehouse,
            date: transferDate,
            items: transferItems,
            status: 'Pending Receipt'
        };

        addStockTransfer(newTransfer);
        
        // Update demand status if linked
        if (linkedDemandId) {
            const updatedDemands = state.stockDemands.map(d => {
                if (d.id === linkedDemandId) {
                    return { ...d, status: 'In Transit' };
                }
                return d;
            });
            setCollection('stockDemands', updatedDemands);
        }

        addNotification('Transfer Executed', `Stock Transfer ${transferId} has been successfully routed.`, 'success');
        
        // Reset form
        setLinkedDemandId('');
        setSourceWarehouse('');
        setDestinationWarehouse('');
        setTransferItems([]);
        setTransferDate(new Date().toISOString().split('T')[0]);
    };

    const handleItemQtyChange = (index, value) => {
        const newItems = [...transferItems];
        newItems[index].qty = value;
        setTransferItems(newItems);
    };

    const handleRemoveItem = (index) => {
        const newItems = [...transferItems];
        newItems.splice(index, 1);
        setTransferItems(newItems);
    };

    const handleAddItem = (item) => {
        const currentStock = item.stockByDepartment && item.stockByDepartment[sourceWarehouse] !== undefined 
            ? item.stockByDepartment[sourceWarehouse] 
            : ((item.department || '').split(',').map(d => d.trim()).filter(Boolean).includes(sourceWarehouse) ? item.stock : 0);

        setTransferItems(prev => [...prev, {
            id: Date.now().toString() + Math.random().toString(36).substr(2, 5),
            itemId: item.id,
            sku: item.sku,
            name: item.name,
            currentStock: currentStock,
            qty: 1,
            uom: item.uom || item.unit || 'Units'
        }]);
        setSearchQuery('');
        setIsDropdownOpen(false);
    };

    const totalQty = transferItems.reduce((sum, item) => sum + (Number(item.qty) || 0), 0);

    return (
        <div className="animate-in fade-in zoom-in-95 duration-300">
            {/* Hero / Header Section */}
            <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <div className="flex items-center gap-2 text-sm text-on-surface-variant mb-2 font-medium">
                        <span className="material-symbols-outlined text-[18px]">inventory_2</span>
                        <span>Inventory Module</span>
                        <span className="material-symbols-outlined text-[16px]">chevron_right</span>
                        <span className="text-primary font-semibold">Stock Transfer</span>
                    </div>
                    <h2 className="text-4xl font-extrabold text-on-surface tracking-tight font-manrope">Execute Transfer</h2>
                    <p className="font-body text-on-surface-variant mt-3 max-w-2xl text-base leading-relaxed">
                        Authorize and route internal stock movements between departments. Stock is deducted upon receiving.
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <button onClick={onHistoryClick} className="flex items-center gap-2 px-6 py-3 border border-primary/20 hover:border-primary/40 text-primary hover:bg-primary/5 rounded-lg shadow-sm text-sm font-bold transition-all hover:scale-[1.02]">
                        <span className="material-symbols-outlined text-[20px]">history</span>
                        Transfer History
                    </button>
                    <button onClick={handleExecuteTransfer} className="bg-gradient-to-br from-primary to-primary-container text-on-primary font-body font-semibold px-8 py-3 rounded-lg shadow-[0_20px_40px_rgba(0,28,56,0.06)] text-sm flex items-center gap-2 hover:opacity-90 transition-opacity">
                        <span className="material-symbols-outlined text-[18px]">local_shipping</span>
                        <span>Execute Transfer</span>
                    </button>
                </div>
            </div>

            {/* Main Layout Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Left Column: Transfer Form & Table */}
                <div className="lg:col-span-8 flex flex-col gap-8">
                    {/* Transfer Header Card */}
                    <section className="bg-surface-container-lowest rounded-xl p-8 shadow-[0_20px_40px_rgba(0,28,56,0.06)] relative overflow-visible border border-outline-variant/30">
                        {/* Decorative gradient blur in corner */}
                        <div className="absolute -top-10 -right-10 w-40 h-40 bg-secondary-container/30 rounded-full blur-3xl pointer-events-none"></div>
                        <h3 className="font-headline text-xl text-on-surface font-semibold mb-6">Transfer Configuration</h3>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                            {/* Link Stock Demand */}
                            <div className="flex flex-col gap-2 relative">
                                <label className="font-body text-xs font-semibold text-on-surface-variant uppercase tracking-wider">Link to Pending Demand (Optional)</label>
                                <div className="relative">
                                    <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-tertiary text-[20px]">link</span>
                                    <select 
                                        className="w-full bg-surface-container-low text-on-surface font-body text-sm rounded-lg py-3 pl-10 pr-10 border-none border-bottom border-outline-variant/20 focus:bg-surface transition-all focus:ring-0 focus:border-b-primary appearance-none cursor-pointer"
                                        value={linkedDemandId}
                                        onChange={(e) => handleDemandSelect(e.target.value)}
                                    >
                                        <option value="">-- Direct Transfer (No Demand) --</option>
                                        {demandsList.map(d => (
                                            <option key={d.id} value={d.id}>{d.id} - {d.targetDepartment} to {d.department}</option>
                                        ))}
                                    </select>
                                    <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-outline text-[20px] pointer-events-none">expand_more</span>
                                </div>
                            </div>
                            {/* Transfer Date */}
                            <div className="flex flex-col gap-2 relative">
                                <label className="font-body text-xs font-semibold text-on-surface-variant uppercase tracking-wider">Transfer Date <span className="text-error">*</span></label>
                                <div className="relative">
                                    <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-[20px]">calendar_today</span>
                                    <input 
                                        className="w-full bg-surface-container-low text-on-surface font-body text-sm rounded-lg py-3 pl-10 pr-4 border-none border-bottom border-outline-variant/20 focus:bg-surface transition-all focus:ring-0 focus:border-b-primary" 
                                        type="date" 
                                        value={transferDate}
                                        onChange={(e) => setTransferDate(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Source Warehouse */}
                            <div className="flex flex-col gap-2 relative">
                                <label className="font-body text-xs font-semibold text-on-surface-variant uppercase tracking-wider">Source Department</label>
                                <div className="relative">
                                    <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-primary-container text-[20px]">warehouse</span>
                                    <select 
                                        className="w-full bg-surface-container-low text-on-surface font-body text-sm rounded-lg py-3 pl-10 pr-10 border-none border-bottom border-outline-variant/20 focus:bg-surface appearance-none cursor-pointer"
                                        value={sourceWarehouse}
                                        onChange={(e) => {
                                            if (transferItems.length > 0) {
                                                if(window.confirm('Changing the source department will clear your added items. Continue?')) {
                                                    setTransferItems([]);
                                                    setSourceWarehouse(e.target.value);
                                                }
                                            } else {
                                                setSourceWarehouse(e.target.value);
                                            }
                                        }}
                                        disabled={!!linkedDemandId}
                                    >
                                        <option value="" disabled>Select Source...</option>
                                        {departmentsList.map(d => (
                                            <option key={`src-${d}`} value={d}>{d}</option>
                                        ))}
                                    </select>
                                    <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-outline text-[20px] pointer-events-none">expand_more</span>
                                </div>
                            </div>
                            {/* Destination Warehouse */}
                            <div className="flex flex-col gap-2">
                                <label className="font-body text-xs font-semibold text-on-surface-variant uppercase tracking-wider">Destination Department</label>
                                <div className="relative">
                                    <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-secondary text-[20px]">pin_drop</span>
                                    <select 
                                        className="w-full bg-surface-container-low text-on-surface font-body text-sm rounded-lg py-3 pl-10 pr-10 border-none border-bottom border-outline-variant/20 focus:bg-surface appearance-none cursor-pointer"
                                        value={destinationWarehouse}
                                        onChange={(e) => setDestinationWarehouse(e.target.value)}
                                        disabled={!!linkedDemandId}
                                    >
                                        <option disabled value="">Select Destination...</option>
                                        {departmentsList.map(d => (
                                            <option key={`dest-${d}`} value={d}>{d}</option>
                                        ))}
                                    </select>
                                    <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-outline text-[20px] pointer-events-none">expand_more</span>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Itemized Table Section */}
                    <section className="bg-surface-container-lowest rounded-xl p-8 shadow-[0_20px_40px_rgba(0,28,56,0.06)] flex-1 border border-outline-variant/30">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="font-headline text-xl text-on-surface font-semibold flex items-center gap-2">
                                <span className="material-symbols-outlined text-primary">category</span>
                                Transfer Items
                            </h3>
                        </div>
                        {/* Custom Data Table */}
                        <div className="w-full overflow-visible min-h-[150px]">
                            <table className="w-full text-left font-body text-sm whitespace-nowrap" style={{ tableLayout: 'fixed' }}>
                                <thead>
                                    <tr className="text-on-surface-variant text-xs uppercase tracking-wider font-semibold border-b border-surface-variant/30 bg-surface-container-low">
                                        <ResizableHeader className="pb-3 pt-3 px-4 font-semibold" style={{ width: '35%' }}>Item Info</ResizableHeader>
                                        <ResizableHeader className="pb-3 pt-3 px-4 text-right font-semibold" style={{ width: '20%' }}>Available Stock</ResizableHeader>
                                        <ResizableHeader className="pb-3 pt-3 px-4 text-right font-semibold text-primary" style={{ width: '25%' }}>Transfer Qty</ResizableHeader>
                                        <ResizableHeader className="pb-3 pt-3 px-4 text-center font-semibold" style={{ width: '15%' }}>UOM</ResizableHeader>
                                        <th className="pb-3 pt-3 w-10 border-l border-outline-variant/10"></th>
                                    </tr>
                                </thead>
                                <tbody className="text-on-surface">
                                    {transferItems.map((item, idx) => {
                                        const isShortage = Number(item.qty) > Number(item.currentStock);
                                        return (
                                        <tr key={idx} className={`group hover:bg-surface-container-low transition-colors duration-150 ${isShortage ? 'bg-error-container/10' : ''}`}>
                                            <td className="py-4 px-4 border-r border-outline-variant/5">
                                                <div className="font-bold">{item.name}</div>
                                                <div className="text-xs text-on-surface-variant font-mono">{item.sku || item.itemId}</div>
                                            </td>
                                            <td className={`py-4 px-4 text-right border-r border-outline-variant/5 ${isShortage ? 'text-error font-bold' : 'text-on-surface-variant'}`}>
                                                {item.currentStock}
                                            </td>
                                            <td className="py-4 px-4 text-right border-r border-outline-variant/5">
                                                <input 
                                                    className={`w-24 text-right bg-surface-container-lowest border-none shadow-[inset_0_0_0_1px_rgba(193,199,210,0.4)] rounded-md py-1.5 px-2 text-sm font-semibold focus:ring-0 focus:shadow-[inset_0_0_0_2px_#004277] transition-shadow ${isShortage ? 'text-error' : 'text-primary'}`} 
                                                    type="number" 
                                                    value={item.qty} 
                                                    onChange={(e) => handleItemQtyChange(idx, e.target.value)}
                                                />
                                            </td>
                                            <td className="py-4 pr-4 text-center text-on-surface-variant text-xs border-r border-outline-variant/5">{item.uom}</td>
                                            <td className="py-4 text-center">
                                                <button onClick={() => handleRemoveItem(idx)} className="text-outline-variant hover:text-error transition-colors p-1 opacity-0 group-hover:opacity-100">
                                                    <span className="material-symbols-outlined text-[18px]">delete</span>
                                                </button>
                                            </td>
                                        </tr>
                                    )})}
                                    <tr className="group hover:bg-surface-container-low transition-colors duration-150 relative">
                                        <td colSpan="5" className="py-4 px-4 border-outline-variant/5 relative" ref={dropdownRef}>
                                            <div className="relative w-full">
                                                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-[20px]">search</span>
                                                <input 
                                                    className="w-full bg-surface-container-lowest border-none rounded-md py-2.5 pl-10 pr-4 text-sm focus:ring-1 focus:ring-primary transition-all placeholder-outline-variant" 
                                                    placeholder={sourceWarehouse ? "Search to add item..." : "Select source department first"} 
                                                    type="text" 
                                                    value={searchQuery}
                                                    disabled={!sourceWarehouse}
                                                    onChange={(e) => {
                                                        setSearchQuery(e.target.value);
                                                        setIsDropdownOpen(true);
                                                    }}
                                                    onClick={() => setIsDropdownOpen(true)}
                                                />
                                                {isDropdownOpen && searchQuery && (
                                                    <div className="absolute left-0 top-full mt-1 w-full max-w-[500px] bg-surface rounded-xl shadow-xl border border-outline-variant/20 max-h-[300px] overflow-y-auto z-50">
                                                        {availableItems.length > 0 ? availableItems.map(item => {
                                                            const itemStock = item.stockByDepartment && item.stockByDepartment[sourceWarehouse] !== undefined 
                                                                ? item.stockByDepartment[sourceWarehouse] 
                                                                : ((item.department || '').split(',').map(d => d.trim()).filter(Boolean).includes(sourceWarehouse) ? item.stock : 0);
                                                            return (
                                                            <div 
                                                                key={item.id} 
                                                                onClick={() => handleAddItem(item)}
                                                                className="px-4 py-3 hover:bg-surface-container-low cursor-pointer border-b border-outline-variant/5 flex justify-between items-center"
                                                            >
                                                                <div>
                                                                    <div className="font-bold text-sm text-on-surface">{item.name}</div>
                                                                    <div className="text-xs text-on-surface-variant mt-0.5">{item.sku}</div>
                                                                </div>
                                                                <div className="text-xs font-bold bg-primary-container/20 text-primary px-2 py-1 rounded">
                                                                    Stock: {itemStock}
                                                                </div>
                                                            </div>
                                                        )}) : (
                                                            <div className="px-4 py-3 text-sm text-on-surface-variant italic">No items found in {sourceWarehouse}.</div>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </section>
                </div>

                {/* Right Column: Status / Contextual Info */}
                <div className="lg:col-span-4 flex flex-col gap-6">
                    {/* Summary Card */}
                    <div className="bg-primary text-on-primary rounded-xl p-6 shadow-[0_20px_40px_rgba(0,28,56,0.06)] relative overflow-hidden border border-primary-container">
                        <div className="bg-primary/80 absolute inset-0 rounded-xl"></div>
                        <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-on-primary/10 rounded-full blur-2xl pointer-events-none"></div>
                        <div className="relative z-10">
                            <h4 className="font-headline text-lg font-semibold text-on-primary-fixed-variant mb-4 text-white flex items-center gap-2">
                                <span className="material-symbols-outlined">receipt_long</span>
                                Transfer Summary
                            </h4>
                            
                            <div className="bg-surface/10 rounded-lg p-4 backdrop-blur-sm border border-white/10 space-y-3 mb-6">
                                <div className="flex justify-between items-center">
                                    <span className="font-body text-sm opacity-80 text-white">Date:</span>
                                    <span className="font-headline text-sm font-bold text-white">{transferDate}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="font-body text-sm opacity-80 text-white">From:</span>
                                    <span className="font-headline text-sm font-bold text-white text-right max-w-[150px] truncate" title={sourceWarehouse}>{sourceWarehouse || '-'}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="font-body text-sm opacity-80 text-white">To:</span>
                                    <span className="font-headline text-sm font-bold text-white text-right max-w-[150px] truncate" title={destinationWarehouse}>{destinationWarehouse || '-'}</span>
                                </div>
                            </div>

                            <div className="flex justify-between items-end mb-4">
                                <div className="flex flex-col">
                                    <span className="font-body text-xs opacity-80 text-white uppercase tracking-wider mb-1">Total Items</span>
                                    <span className="font-headline text-3xl font-black text-white leading-none">{transferItems.length}</span>
                                </div>
                                <div className="flex flex-col text-right">
                                    <span className="font-body text-xs opacity-80 text-white uppercase tracking-wider mb-1">Total Qty</span>
                                    <span className="font-headline text-2xl font-bold text-white leading-none">{totalQty}</span>
                                </div>
                            </div>
                            
                            <div className="w-full h-px bg-white/20 mb-4"></div>
                            
                            <p className="font-body text-xs opacity-80 leading-relaxed text-white">
                                Executing this transfer will generate a manifest for the destination department. Physical stock quantities will be updated upon confirmed receipt.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
