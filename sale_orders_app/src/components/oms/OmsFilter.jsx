import React, { useState, useMemo } from 'react';

export default function OmsFilter({ pendingItems = [], customers = [] }) {
    // --- State for Filters and Toggles ---
    const [viewMode, setViewMode] = useState('item'); // 'item' | 'order'
    const [activeFilter, setActiveFilter] = useState('All Orders'); // 'All Orders' | 'By Customer' | 'By Date'
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('All Statuses');
    const [customerFilter, setCustomerFilter] = useState('All Customers');

    const handleFilterButtonClick = (filterName) => {
        setActiveFilter(filterName);
    };

    // --- Data Processing Logic ---
    const processedData = useMemo(() => {
        let itemsToProcess = [...pendingItems];

        // Ensure we hook into the customer name
        itemsToProcess = itemsToProcess.map(item => ({
            ...item,
            customerName: customers.find(c => c.id === item.customerId)?.name || item.customer || 'Unknown'
        }));

        // Search text filter
        if (searchTerm) {
            const lowerSearch = searchTerm.toLowerCase();
            itemsToProcess = itemsToProcess.filter(item => 
                (item.orderId && item.orderId.toLowerCase().includes(lowerSearch)) ||
                (item.itemCode && item.itemCode.toLowerCase().includes(lowerSearch)) ||
                (item.productName && item.productName.toLowerCase().includes(lowerSearch))
            );
        }

        // Dropdown status filter
        if (statusFilter !== 'All Statuses') {
            itemsToProcess = itemsToProcess.filter(item => item.status === statusFilter);
        }

        // Dropdown customer filter
        if (customerFilter !== 'All Customers') {
            itemsToProcess = itemsToProcess.filter(item => item.customerName === customerFilter);
        }

        // Active Filter Button Group Logic (By Customer simply sorts by customer, by date sorts by date)
        if (activeFilter === 'By Customer') {
            itemsToProcess.sort((a, b) => a.customerName.localeCompare(b.customerName));
        } else if (activeFilter === 'By Date') {
            itemsToProcess.sort((a, b) => new Date(b.date) - new Date(a.date));
        }

        // If Item-Wise -> Just return the list of items
        if (viewMode === 'item') {
            return itemsToProcess;
        }

        // If Order-Wise -> Group by orderId
        if (viewMode === 'order') {
            const orderGroups = itemsToProcess.reduce((acc, item) => {
                if (!acc[item.orderId]) {
                    acc[item.orderId] = {
                        orderId: item.orderId,
                        date: item.date,
                        customerName: item.customerName,
                        totalItems: 0,
                        totalQuantity: 0,
                        totalProduced: 0,
                        status: 'Multiple'
                    };
                }
                const group = acc[item.orderId];
                group.totalItems += 1;
                group.totalQuantity += parseInt(item.quantity) || 0;
                group.totalProduced += parseInt(item.producedQty) || 0;
                // If all items share the same status, use it, else 'Mixed'
                if (group.totalItems === 1) {
                    group.status = item.status;
                } else if (group.status !== item.status) {
                    group.status = 'Mixed';
                }
                return acc;
            }, {});
            return Object.values(orderGroups);
        }

        return itemsToProcess;
    }, [pendingItems, customers, searchTerm, statusFilter, customerFilter, activeFilter, viewMode]);

    return (
        <div className="animate-in fade-in duration-500 max-w-[1920px] mx-auto">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-4">
                <div>
                    <h1 className="text-3xl font-manrope font-extrabold tracking-tight text-on-surface">Order Management</h1>
                    <p className="text-on-surface-variant font-body mt-1">Real-time status tracking for synthetic logistics workflows.</p>
                </div>
                <div className="flex flex-col gap-3">
                    <div className="flex items-center gap-3 bg-surface-container-lowest p-1.5 rounded-full shadow-sm border border-outline-variant/15 w-fit">
                        {['All Orders', 'By Customer', 'By Date'].map(btn => (
                            <button 
                                key={btn}
                                onClick={() => handleFilterButtonClick(btn)}
                                className={`px-5 py-2 rounded-full text-sm font-semibold transition-colors ${
                                    activeFilter === btn ? 'bg-primary text-on-primary shadow-sm' : 'text-on-surface-variant hover:bg-surface-container-low'
                                }`}
                            >{btn}</button>
                        ))}
                    </div>
                    <div className="flex items-center bg-surface-container-lowest p-1.5 rounded-full shadow-sm border border-outline-variant/15 gap-2 w-fit">
                        <button 
                            onClick={() => setViewMode('item')}
                            className={`px-5 py-2 rounded-full text-sm font-semibold transition-colors ${viewMode === 'item' ? 'bg-primary text-on-primary shadow-sm' : 'text-on-surface-variant hover:bg-surface-container-low'}`}
                        >Item-wise</button>
                        <button 
                            onClick={() => setViewMode('order')}
                            className={`px-5 py-2 rounded-full text-sm font-semibold transition-colors ${viewMode === 'order' ? 'bg-primary text-on-primary shadow-sm' : 'text-on-surface-variant hover:bg-surface-container-low'}`}
                        >Sale Order-wise</button>
                    </div>
                </div>
            </div>

            {/* Filter Controls */}
            <div className="bg-surface-container-low p-6 rounded-2xl mb-8 flex flex-wrap items-center gap-6 border-none">
                <div className="flex-1 min-w-[200px]">
                    <label className="block text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mb-2 px-1">Search Database</label>
                    <div className="relative">
                        <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-lg">manage_search</span>
                        <input 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-surface-container-lowest border-none ring-1 ring-outline-variant/20 focus:ring-primary rounded-xl py-3 pl-11 pr-4 text-sm font-medium" 
                            placeholder="Sale Order / Code..." type="text" 
                        />
                    </div>
                </div>
                <div className="w-48">
                    <label className="block text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mb-2 px-1">Status</label>
                    <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="w-full bg-surface-container-lowest border-none ring-1 ring-outline-variant/20 focus:ring-primary rounded-xl py-3 px-4 text-sm font-medium">
                        <option>All Statuses</option>
                        <option>Pending</option>
                        <option>In Process</option>
                        <option>Completed</option>
                    </select>
                </div>
                <div className="w-48">
                    <label className="block text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mb-2 px-1">Customer</label>
                    <select value={customerFilter} onChange={(e) => setCustomerFilter(e.target.value)} className="w-full bg-surface-container-lowest border-none ring-1 ring-outline-variant/20 focus:ring-primary rounded-xl py-3 px-4 text-sm font-medium">
                        <option>All Customers</option>
                        {customers.map(c => (
                            <option key={c.id} value={c.name}>{c.name}</option>
                        ))}
                    </select>
                </div>
                <div className="pt-6">
                    <button onClick={() => { setSearchTerm(''); setStatusFilter('All Statuses'); setCustomerFilter('All Customers'); }} className="bg-surface-container-highest p-3 rounded-xl text-primary hover:bg-primary hover:text-white transition-all">
                        <span className="material-symbols-outlined">filter_list_off</span>
                    </button>
                </div>
            </div>

            {/* Data Table Section */}
            <div className="bg-surface-container-lowest rounded-2xl shadow-[0_20px_40px_rgba(0,28,56,0.06)] overflow-hidden">
                <div className="overflow-x-auto">
                    {viewMode === 'item' ? (
                        <table className="w-full text-left border-collapse">
                            <thead className="bg-surface-container-low text-on-surface-variant text-[11px] font-bold uppercase tracking-wider">
                                <tr>
                                    <th className="py-5 px-6">Sale Order No</th>
                                    <th className="py-5 px-6">Order Date</th>
                                    <th className="py-5 px-6">Item Code</th>
                                    <th className="py-5 px-6">Item Name</th>
                                    <th className="py-5 px-6">Customer Name</th>
                                    <th className="py-5 px-6">Order Metre</th>
                                    <th className="py-5 px-6">Output Metres</th>
                                    <th className="py-5 px-6 font-extrabold text-tertiary">Remaining Qty</th>
                                    <th className="py-5 px-6">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-surface-container">
                                {processedData.length > 0 ? processedData.map((item, idx) => {
                                    const qty = parseInt(item.quantity) || 0;
                                    const outputQty = parseInt(item.producedQty) || 0;
                                    const remaining = qty - outputQty;

                                    return (
                                    <tr key={`item-${idx}`} className="hover:bg-surface-container-low/30 transition-colors group">
                                        <td className="py-5 px-6 font-manrope font-bold text-primary">{item.orderId}</td>
                                        <td className="py-5 px-6 text-sm text-on-surface">{new Date(item.date).toLocaleDateString()}</td>
                                        <td className="py-5 px-6 font-mono text-xs font-semibold bg-slate-100 rounded px-2 w-fit">{item.itemCode}</td>
                                        <td className="py-5 px-6">
                                            <div className="flex flex-col">
                                                <span className="text-sm font-semibold">{item.productName}</span>
                                            </div>
                                        </td>
                                        <td className="py-5 px-6 text-sm font-semibold">{item.customerName}</td>
                                        <td className="py-5 px-6 text-sm font-medium">{qty}</td>
                                        <td className="py-5 px-6 text-sm font-bold text-on-surface-variant">{outputQty}</td>
                                        <td className="py-5 px-6 text-sm font-bold text-tertiary">{remaining}</td>
                                        <td className="py-5 px-6">
                                            <span className="bg-tertiary-fixed text-on-tertiary-fixed-variant px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-tight flex items-center w-fit gap-1">
                                                <span className="w-1.5 h-1.5 rounded-full bg-tertiary"></span>
                                                {item.status}
                                            </span>
                                        </td>
                                    </tr>
                                )}) : (
                                    <tr>
                                        <td colSpan="9" className="py-10 text-center text-on-surface-variant">No items match the current filters.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    ) : (
                        <table className="w-full text-left border-collapse">
                            <thead className="bg-surface-container-low text-on-surface-variant text-[11px] font-bold uppercase tracking-wider">
                                <tr>
                                    <th className="py-5 px-6">Sale Order No</th>
                                    <th className="py-5 px-6">Order Date</th>
                                    <th className="py-5 px-6">Customer Name</th>
                                    <th className="py-5 px-6">Total Line Items</th>
                                    <th className="py-5 px-6">Total Order Metre</th>
                                    <th className="py-5 px-6">Total Output Metres</th>
                                    <th className="py-5 px-6 font-extrabold text-tertiary">Total Remaining Qty</th>
                                    <th className="py-5 px-6">Aggregated Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-surface-container">
                                {processedData.length > 0 ? processedData.map((group, idx) => {
                                    const diff = group.totalQuantity - group.totalProduced;
                                    return (
                                    <tr key={`group-${idx}`} className="hover:bg-surface-container-low/30 transition-colors group">
                                        <td className="py-5 px-6 font-manrope font-extrabold text-primary">{group.orderId}</td>
                                        <td className="py-5 px-6 text-sm text-on-surface">{new Date(group.date).toLocaleDateString()}</td>
                                        <td className="py-5 px-6 text-sm font-semibold">{group.customerName}</td>
                                        <td className="py-5 px-6 text-sm font-medium">{group.totalItems}</td>
                                        <td className="py-5 px-6 text-sm font-medium">{group.totalQuantity}</td>
                                        <td className="py-5 px-6 text-sm font-bold text-on-surface-variant">{group.totalProduced}</td>
                                        <td className="py-5 px-6 text-sm font-bold text-tertiary">{diff}</td>
                                        <td className="py-5 px-6">
                                            <span className="bg-tertiary-fixed text-on-tertiary-fixed-variant px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-tight flex items-center w-fit gap-1">
                                                <span className="w-1.5 h-1.5 rounded-full bg-tertiary"></span>
                                                {group.status}
                                            </span>
                                        </td>
                                    </tr>
                                )}) : (
                                    <tr>
                                        <td colSpan="8" className="py-10 text-center text-on-surface-variant">No orders match the current filters.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    )}
                </div>

                {/* Pagination */}
                <div className="bg-surface-container-low px-8 py-4 flex justify-between items-center border-t border-outline-variant/10">
                    <p className="text-xs font-medium text-on-surface-variant">Showing <span className="text-on-surface font-bold">{processedData.length}</span> results</p>
                </div>
            </div>
        </div>
    );
}
