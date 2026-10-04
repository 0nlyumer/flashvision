import React, { useState, useMemo } from 'react';

export default function OmsSelection({ pendingItems = [], customers = [], handlePlanProduction }) {
    const [searchTerm, setSearchTerm] = useState("");
    const [viewMode, setViewMode] = useState('item'); // 'item' | 'order'
    const [selectedIds, setSelectedIds] = useState([]); // array of item.id

    // Pre-process Data (Attach customer name and remaining qty)
    const itemsWithData = useMemo(() => {
        return pendingItems.map(item => {
            const customerName = customers.find(c => c.id === item.customerId)?.name || item.customer || 'Unknown';
            const originalQty = parseInt(item.originalQuantity) || parseInt(item.quantity) || 0;
            const outputQty = parseInt(item.producedQty) || 0;
            const remaining = parseInt(item.remainingToPlan) || parseInt(item.quantity) || 0;
            return {
                ...item,
                customerName,
                originalQty,
                outputQty,
                remaining
            };
        });
    }, [pendingItems, customers]);

    const toggleSelection = (itemCode) => {
        if (selectedIds.includes(itemCode)) {
            setSelectedIds(selectedIds.filter(code => code !== itemCode));
        } else {
            setSelectedIds([...selectedIds, itemCode]);
        }
    };

    const toggleGroupSelection = (orderId) => {
        const orderItems = itemsWithData.filter(i => i.orderId === orderId);
        const orderItemCodes = orderItems.map(i => i.itemCode);
        const allSelected = orderItemCodes.every(code => selectedIds.includes(code));

        if (allSelected) {
            // Deselect all
            setSelectedIds(selectedIds.filter(code => !orderItemCodes.includes(code)));
        } else {
            // Select all
            const newSelection = new Set([...selectedIds, ...orderItemCodes]);
            setSelectedIds(Array.from(newSelection));
        }
    };

    // Filter by search term
    const filteredItems = useMemo(() => {
        if (!searchTerm) return itemsWithData;
        const lower = searchTerm.toLowerCase();
        return itemsWithData.filter(i => 
            (i.orderId && i.orderId.toLowerCase().includes(lower)) ||
            (i.itemCode && i.itemCode.toLowerCase().includes(lower)) ||
            (i.customerName && i.customerName.toLowerCase().includes(lower))
        );
    }, [itemsWithData, searchTerm]);

    // Grouping for order-wise view
    const orderGroups = useMemo(() => {
        if (viewMode === 'item') return [];
        const groups = {};
        filteredItems.forEach(item => {
            if (!groups[item.orderId]) {
                groups[item.orderId] = {
                    orderId: item.orderId,
                    date: item.date,
                    customerName: item.customerName,
                    items: [],
                    totalQty: 0,
                    totalOutput: 0,
                    totalRemaining: 0
                };
            }
            groups[item.orderId].items.push(item);
            groups[item.orderId].totalQty += item.originalQty;
            groups[item.orderId].totalOutput += item.outputQty;
            groups[item.orderId].totalRemaining += item.remaining;
        });
        return Object.values(groups);
    }, [filteredItems, viewMode]);

    // Final selected objects array
    const selectedItemObjects = useMemo(() => {
        return itemsWithData.filter(i => selectedIds.includes(i.itemCode));
    }, [itemsWithData, selectedIds]);

    const submitPlan = () => {
        handlePlanProduction(selectedItemObjects);
    };

    return (
        <div className="animate-in fade-in duration-500 max-w-[1920px] mx-auto pb-32">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4 px-2">
                <div>
                    <h1 className="text-3xl font-manrope font-extrabold tracking-tight text-on-surface">Production Planning</h1>
                    <p className="text-on-surface-variant font-body mt-1">Select and group pending orders/items for the next optimal production run.</p>
                </div>
            </div>

            {/* Smart Routing & Filters */}
            <div className="bg-gradient-to-r from-surface-container-lowest to-surface-container-low p-6 rounded-2xl mb-8 flex flex-col xl:flex-row gap-6 items-center justify-between border border-outline-variant/10 shadow-sm">
                <div className="flex items-center gap-4 flex-1 w-full xl:w-full">
                    <div className="relative flex-1">
                        <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline text-lg">search</span>
                        <input 
                            className="w-full bg-white border border-outline-variant/30 focus:border-primary focus:ring-2 focus:ring-primary/20 rounded-xl py-3 pl-12 pr-4 text-sm font-medium transition-all shadow-sm" 
                            placeholder="Filter by SKU, Order, or Core Material..." 
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    {/* View Toggles */}
                    <div className="flex items-center bg-white p-1 rounded-xl shadow-sm border border-outline-variant/20">
                        <button 
                            onClick={() => setViewMode('item')}
                            className={`px-5 py-2 rounded-lg text-sm font-bold flex items-center gap-2 transition-all ${viewMode === 'item' ? 'bg-primary text-white shadow-md' : 'text-slate-500 hover:text-primary hover:bg-primary/5'}`}
                        >
                            Item Wise
                        </button>
                        <button 
                            onClick={() => setViewMode('order')}
                            className={`px-5 py-2 rounded-lg text-sm font-bold flex items-center gap-2 transition-all ${viewMode === 'order' ? 'bg-primary text-white shadow-md' : 'text-slate-500 hover:text-primary hover:bg-primary/5'}`}
                        >
                            Order Wise
                        </button>
                    </div>
                </div>
            </div>

            {/* Selection Data Table */}
            <div className="bg-surface-container-lowest rounded-[2rem] shadow-[0_20px_40px_rgba(0,28,56,0.06)] overflow-hidden border border-outline-variant/10">
                <div className="overflow-x-auto custom-scrollbar">
                    {/* Render ITEM-WISE TABLE */}
                    {viewMode === 'item' ? (
                        <table className="w-full text-left border-collapse min-w-[1200px]">
                            <thead>
                                <tr className="bg-surface-container-low/50">
                                    <th className="py-5 px-6 w-12 border-b border-outline-variant/10 text-center">
                                         #
                                    </th>
                                    <th className="py-5 px-6 text-[11px] font-extrabold uppercase tracking-widest text-on-surface-variant border-b border-outline-variant/10">Sale Order / Date</th>
                                    <th className="py-5 px-6 text-[11px] font-extrabold uppercase tracking-widest text-on-surface-variant border-b border-outline-variant/10">Customer Name</th>
                                    <th className="py-5 px-6 text-[11px] font-extrabold uppercase tracking-widest text-on-surface-variant border-b border-outline-variant/10">Product / Item Code</th>
                                    <th className="py-5 px-6 text-[11px] font-extrabold uppercase tracking-widest text-on-surface-variant border-b border-outline-variant/10 text-right">Order Metres</th>
                                    <th className="py-5 px-6 text-[11px] font-extrabold uppercase tracking-widest text-on-surface-variant border-b border-outline-variant/10 text-right">Output Metres</th>
                                    <th className="py-5 px-6 text-[11px] font-extrabold uppercase tracking-widest text-tertiary border-b border-outline-variant/10 text-right">Remaining</th>
                                </tr>
                            </thead>
                            <tbody className="group">
                                {filteredItems.length > 0 ? filteredItems.map((item) => (
                                    <tr key={item.id} className={`border-b border-outline-variant/10 transition-colors ${selectedIds.includes(item.id) ? 'bg-primary/5' : 'hover:bg-surface-container-lowest'}`}>
                                        <td className="py-6 px-6 text-center align-middle">
                                            <input 
                                                className="w-5 h-5 rounded text-primary focus:ring-primary border-outline-variant bg-surface cursor-pointer shadow-sm" 
                                                type="checkbox"
                                                checked={selectedIds.includes(item.itemCode)}
                                                onChange={() => toggleSelection(item.itemCode)} 
                                            />
                                        </td>
                                        <td className="py-6 px-6 align-middle">
                                            <div className="flex flex-col gap-1">
                                                <span className="font-bold text-primary text-sm">{item.orderId}</span>
                                                <span className="text-xs text-on-surface-variant">{new Date(item.date).toLocaleDateString()}</span>
                                            </div>
                                        </td>
                                        <td className="py-6 px-6 align-middle">
                                            <span className="text-sm font-semibold text-on-surface">{item.customerName}</span>
                                        </td>
                                        <td className="py-6 px-6 align-middle">
                                            <div className="flex flex-col gap-1">
                                                <span className="font-bold text-on-surface text-sm">{item.productName}</span>
                                                <span className="font-mono text-[10px] bg-slate-100 text-slate-600 px-1 py-0.5 rounded w-fit">{item.itemCode}</span>
                                            </div>
                                        </td>
                                        <td className="py-6 px-6 align-middle text-right">
                                            <span className="font-manrope font-black text-base text-on-surface">{item.originalQty}<span className="text-xs font-medium ml-1">m</span></span>
                                        </td>
                                        <td className="py-6 px-6 align-middle text-right">
                                            <span className="font-manrope font-bold text-base text-on-surface-variant">{item.outputQty}<span className="text-xs font-medium ml-1">m</span></span>
                                        </td>
                                        <td className="py-6 px-6 align-middle text-right">
                                            <span className="font-manrope font-black text-lg text-tertiary">{item.remaining}<span className="text-sm font-medium ml-1">m</span></span>
                                        </td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan="8" className="py-12 text-center text-on-surface-variant">No pending items found.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    ) : (
                        /* Render ORDER-WISE TABLE */
                        <table className="w-full text-left border-collapse min-w-[1000px]">
                            <thead>
                                <tr className="bg-surface-container-low/50">
                                    <th className="py-5 px-6 w-12 border-b border-outline-variant/10 text-center">
                                         #
                                    </th>
                                    <th className="py-5 px-6 text-[11px] font-extrabold uppercase tracking-widest text-on-surface-variant border-b border-outline-variant/10">Sale Order / Date</th>
                                    <th className="py-5 px-6 text-[11px] font-extrabold uppercase tracking-widest text-on-surface-variant border-b border-outline-variant/10">Customer Name</th>
                                    <th className="py-5 px-6 text-[11px] font-extrabold uppercase tracking-widest text-on-surface-variant border-b border-outline-variant/10 text-center">Total Items</th>
                                    <th className="py-5 px-6 text-[11px] font-extrabold uppercase tracking-widest text-on-surface-variant border-b border-outline-variant/10 text-right">Total Order Metres</th>
                                    <th className="py-5 px-6 text-[11px] font-extrabold uppercase tracking-widest text-on-surface-variant border-b border-outline-variant/10 text-right">Total Output</th>
                                    <th className="py-5 px-6 text-[11px] font-extrabold uppercase tracking-widest text-tertiary border-b border-outline-variant/10 text-right">Total Remaining</th>
                                </tr>
                            </thead>
                            <tbody className="group">
                                {orderGroups.length > 0 ? orderGroups.map((group) => {
                                    const allItemCodes = group.items.map(i => i.itemCode);
                                    const allSelected = allItemCodes.every(code => selectedIds.includes(code));
                                    const someSelected = allItemCodes.some(code => selectedIds.includes(code));
                                    const checkStateClass = allSelected ? 'bg-primary/5 border-l-4 border-l-primary' : (someSelected ? 'bg-primary/5 opacity-80' : 'hover:bg-surface-container-lowest');

                                    return (
                                    <tr key={group.orderId} className={`border-b border-outline-variant/10 transition-colors ${checkStateClass}`}>
                                        <td className="py-6 px-6 text-center align-middle">
                                            <input 
                                                className="w-5 h-5 rounded text-primary focus:ring-primary border-outline-variant bg-surface cursor-pointer shadow-sm" 
                                                type="checkbox"
                                                checked={allSelected}
                                                // If some are selected, checking again acts as Check All, otherwise flips.
                                                onChange={() => toggleGroupSelection(group.orderId)} 
                                            />
                                        </td>
                                        <td className="py-6 px-6 align-middle">
                                            <div className="flex flex-col gap-1">
                                                <span className="font-bold text-primary text-sm">{group.orderId}</span>
                                                <span className="text-xs text-on-surface-variant">{new Date(group.date).toLocaleDateString()}</span>
                                            </div>
                                        </td>
                                        <td className="py-6 px-6 align-middle">
                                            <span className="text-sm font-semibold text-on-surface">{group.customerName}</span>
                                        </td>
                                        <td className="py-6 px-6 align-middle text-center">
                                            <span className="bg-surface-container-high px-3 py-1 rounded-full text-xs font-bold text-on-surface-variant">{group.items.length} Items</span>
                                        </td>
                                        <td className="py-6 px-6 align-middle text-right">
                                            <span className="font-manrope font-black text-base text-on-surface">{group.totalQty}<span className="text-xs font-medium ml-1">m</span></span>
                                        </td>
                                        <td className="py-6 px-6 align-middle text-right">
                                            <span className="font-manrope font-bold text-base text-on-surface-variant">{group.totalOutput}<span className="text-xs font-medium ml-1">m</span></span>
                                        </td>
                                        <td className="py-6 px-6 align-middle text-right">
                                            <span className="font-manrope font-black text-lg text-tertiary">{group.totalRemaining}<span className="text-sm font-medium ml-1">m</span></span>
                                        </td>
                                    </tr>
                                )}) : (
                                    <tr>
                                        <td colSpan="7" className="py-12 text-center text-on-surface-variant">No pending orders found.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>

            {/* Sticky Action Footer */}
            <div className="fixed bottom-[49px] left-[0px] md:left-[240px] right-0 z-40 px-10 py-0 flex justify-center translate-y-[-24px] pointer-events-none">
                <div className="bg-surface-container-lowest/80 backdrop-blur-xl border border-outline-variant/20 shadow-[0_-10px_40px_rgba(0,0,0,0.08)] rounded-2xl p-4 flex items-center justify-between w-full max-w-5xl pointer-events-auto overflow-x-auto custom-scrollbar">
                    <div className="flex items-center gap-8 pl-4">
                        <div>
                            <p className="text-[10px] uppercase tracking-widest text-on-surface-variant font-bold mb-0.5">Selected Items</p>
                            <p className="text-2xl font-manrope font-black text-primary leading-none">{selectedIds.length.toString().padStart(2, '0')}</p>
                        </div>
                        <div className="border-l border-outline-variant/30 h-10"></div>
                        <div>
                            <p className="text-[10px] uppercase tracking-widest text-on-surface-variant font-bold mb-0.5">Cumulative Target</p>
                            <p className="text-2xl font-manrope font-black text-primary leading-none">
                                {selectedItemObjects.reduce((acc, i) => acc + (parseInt(i.quantity) || 0), 0).toLocaleString()}
                                <span className="text-sm font-medium ml-1">m</span>
                            </p>
                        </div>
                    </div>
                    <div>
                        <button 
                            disabled={selectedIds.length === 0}
                            onClick={submitPlan}
                            className={`px-8 py-3.5 rounded-xl font-bold flex shrink-0 items-center gap-3 transition-all ${
                                selectedIds.length > 0 
                                    ? 'bg-gradient-to-r from-primary to-primary-container text-white shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-95'
                                    : 'bg-surface-container-high text-on-surface-variant opacity-50 cursor-not-allowed'
                            }`}
                        >
                            <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>precision_manufacturing</span>
                            Plan Production
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
