import React, { useState } from 'react';
import ResizableHeader from '../ui/ResizableHeader';
import { useApp } from '../../context/AppContext';
import GlobalPagination from '../ui/GlobalPagination';

export default function StockReceivingNote({ onHistoryClick }) {
    const { state, addNotification, updateStockTransferStatus } = useApp();
    const [transferId, setTransferId] = useState('');
    const [loadedTransfer, setLoadedTransfer] = useState(null);
    const [receivedItems, setReceivedItems] = useState([]);
    const [closeDemand, setCloseDemand] = useState(false);
    
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 20;

    const handleFetchManifest = () => {
        if (!transferId) {
            addNotification('Error', 'Please enter a Transfer ID', 'error');
            return;
        }

        const transfer = state.stockTransfers?.find(t => t.id === transferId);
        if (!transfer) {
            addNotification('Not Found', `Transfer ID ${transferId} not found in the system.`, 'error');
            setLoadedTransfer(null);
            setReceivedItems([]);
            return;
        }

        setLoadedTransfer(transfer);
        setReceivedItems(transfer.items.map(item => ({
            ...item,
            receivedQty: item.qty,
            condition: 'Undamaged',
            location: ''
        })));
        addNotification('Manifest Loaded', `Successfully fetched manifest for ${transferId}.`, 'success');
    };

    const handleItemChange = (index, field, value) => {
        const newItems = [...receivedItems];
        newItems[index] = { ...newItems[index], [field]: value };
        setReceivedItems(newItems);
    };

    const handleConfirmReceipt = () => {
        if (!loadedTransfer) return;

        updateStockTransferStatus(loadedTransfer.id, 'Received', receivedItems, closeDemand);
        addNotification('Receipt Confirmed', `Successfully received items for ${loadedTransfer.id}.`, 'success');
        
        setTransferId('');
        setLoadedTransfer(null);
        setReceivedItems([]);
        setCloseDemand(false);
    };

    const displayedReceivedItems = state?.isGlobalPaginated
        ? receivedItems.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
        : receivedItems;

    return (
        <div className="animate-in fade-in zoom-in-95 duration-300 h-full flex flex-col">
            {/* Page Header */}
            <div className="flex justify-between items-end mb-8">
                <div className="flex flex-col gap-2">
                    <h2 className="text-4xl font-extrabold text-on-surface tracking-tight font-manrope">Stock Receiving Note</h2>
                    <p className="font-body text-on-surface-variant text-sm max-w-2xl">
                        Enter the Stock Transfer ID to pull manifest details. Verify incoming quantities against the physical shipment before finalizing receipt into inventory.
                    </p>
                </div>
                <button onClick={onHistoryClick} className="flex items-center gap-2 px-6 py-3 border border-primary/20 hover:border-primary/40 text-primary hover:bg-primary/5 rounded-lg shadow-sm text-sm font-bold transition-all hover:scale-[1.02]">
                    <span className="material-symbols-outlined text-[20px]">history</span>
                    Receiving History
                </button>
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 flex-1">
                {/* Left Column: Search & Details */}
                <div className="xl:col-span-4 flex flex-col gap-8">
                    {/* Search Card */}
                    <div className="bg-surface-container-lowest rounded-xl p-8 shadow-[0_20px_40px_rgba(0,28,56,0.06)] border border-outline-variant/15 flex flex-col gap-6">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-primary-container/10 flex items-center justify-center text-primary">
                                <span className="material-symbols-outlined">document_scanner</span>
                            </div>
                            <h3 className="font-headline font-semibold text-lg text-on-surface">Locate Transfer</h3>
                        </div>
                        <div className="flex flex-col gap-2">
                            <label className="font-label text-xs text-on-surface-variant uppercase tracking-wider">Transfer ID</label>
                            <div className="relative bg-surface-container-low rounded-lg p-1 border border-outline-variant/20 focus-within:bg-surface-container-lowest focus-within:border-primary/50 transition-all">
                                <select 
                                    className="w-full bg-transparent border-none focus:ring-0 font-body text-on-surface font-semibold py-2 px-3 appearance-none cursor-pointer" 
                                    value={transferId}
                                    onChange={(e) => {
                                        setTransferId(e.target.value);
                                        if (e.target.value) {
                                            // Optional: auto fetch
                                        }
                                    }}
                                >
                                    <option value="" disabled>Select Pending Transfer...</option>
                                    {(state.stockTransfers || []).filter(t => t.status !== 'Received').map(t => (
                                        <option key={t.id} value={t.id}>{t.id} - {t.source} to {t.destination}</option>
                                    ))}
                                </select>
                                <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-outline text-[20px] pointer-events-none">expand_more</span>
                            </div>
                        </div>
                        <button onClick={handleFetchManifest} className="bg-gradient-to-br from-primary to-primary-container w-full py-3 rounded-lg text-on-primary font-label font-semibold flex items-center justify-center gap-2 hover:opacity-90 transition-opacity">
                            <span className="material-symbols-outlined text-[20px]">search</span>
                            Fetch Manifest
                        </button>
                    </div>

                    {/* Transfer Summary */}
                    {loadedTransfer && (
                        <div className="bg-surface-container-low rounded-xl p-8 border border-outline-variant/10 flex flex-col gap-6 relative overflow-hidden animate-in fade-in zoom-in-95">
                            <div className="absolute -right-10 -top-10 w-32 h-32 bg-primary/5 rounded-full blur-2xl"></div>
                            <h3 className="font-headline font-semibold text-lg text-on-surface relative z-10">Manifest Details</h3>
                            <div className="space-y-4 relative z-10">
                                <div className="flex justify-between items-center py-2 border-b border-outline-variant/10">
                                    <span className="font-label text-sm text-on-surface-variant">Source</span>
                                    <span className="font-body text-sm font-semibold text-on-surface">{loadedTransfer.source}</span>
                                </div>
                                <div className="flex justify-between items-center py-2 border-b border-outline-variant/10">
                                    <span className="font-label text-sm text-on-surface-variant">Destination</span>
                                    <span className="font-body text-sm font-semibold text-on-surface">{loadedTransfer.destination}</span>
                                </div>
                                <div className="flex justify-between items-center py-2 border-b border-outline-variant/10">
                                    <span className="font-label text-sm text-on-surface-variant">Transfer Date</span>
                                    <span className="font-body text-sm font-semibold text-on-surface">{loadedTransfer.date}</span>
                                </div>
                                <div className="flex justify-between items-center py-2">
                                    <span className="font-label text-sm text-on-surface-variant">Total Items</span>
                                    <span className="font-body text-sm font-semibold text-on-surface">{loadedTransfer.items.length}</span>
                                </div>
                            </div>
                            <div className="mt-2 inline-flex items-center gap-2 bg-tertiary-container/10 text-tertiary px-3 py-1.5 rounded-full self-start">
                                <span className="material-symbols-outlined text-[16px]">info</span>
                                <span className="font-label text-xs font-semibold">Action Required</span>
                            </div>
                        </div>
                    )}
                </div>

                {/* Right Column: Verification List */}
                <div className="xl:col-span-8 flex flex-col gap-6">
                    <div className="flex items-center justify-between px-2 mb-2">
                        <h3 className="font-headline font-semibold text-xl text-on-surface">Items to Receive</h3>
                        <span className="font-label text-sm text-on-surface-variant">Showing {receivedItems.length} items</span>
                    </div>

                    <div className="bg-surface-container-lowest rounded-xl shadow-[0_10px_30px_rgba(0,28,56,0.03)] border border-outline-variant/15 overflow-hidden">
                        <div className="overflow-x-auto min-h-[150px]">
                            <table className="w-full text-left border-collapse" style={{ tableLayout: 'fixed' }}>
                                <thead>
                                    <tr className="bg-surface-container-low text-on-surface-variant font-label text-xs uppercase tracking-wider border-b border-outline-variant/15">
                                        <ResizableHeader className="py-3 px-4 font-semibold" style={{ width: '40%' }}>Item Info</ResizableHeader>
                                        <ResizableHeader className="py-3 px-4 font-semibold text-center" style={{ width: '20%' }}>Received Qty</ResizableHeader>
                                        <ResizableHeader className="py-3 px-4 font-semibold" style={{ width: '25%' }}>Condition</ResizableHeader>
                                        <ResizableHeader className="py-3 px-4 font-semibold" style={{ width: '15%' }}>Location</ResizableHeader>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-outline-variant/10">
                                    {displayedReceivedItems.length > 0 ? (
                                        displayedReceivedItems.map((item, localIdx) => {
                                            const idx = state?.isGlobalPaginated ? (currentPage - 1) * itemsPerPage + localIdx : localIdx;
                                            return (
                                            <tr key={idx} className="hover:bg-surface-bright transition-colors">
                                                <td className="py-4 px-4 align-middle border-r border-outline-variant/5">
                                                    <div className="flex gap-4 items-center">
                                                        <div className="w-12 h-12 rounded-lg bg-surface-container flex items-center justify-center shrink-0">
                                                            <span className="material-symbols-outlined text-outline-variant text-xl">inventory_2</span>
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <h4 className="font-headline font-semibold text-sm text-on-surface truncate">{item.name}</h4>
                                                            <p className="font-body text-xs text-on-surface-variant">SKU: {item.id}</p>
                                                            <p className="font-body text-[10px] text-on-surface-variant mt-1 flex items-center gap-1">
                                                                <span className="material-symbols-outlined text-[12px]">inventory_2</span>
                                                                Expected: {item.qty} {item.uom}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="py-4 px-4 align-middle text-center border-r border-outline-variant/5">
                                                    <input 
                                                        className="w-20 bg-surface-container-low border border-outline-variant/20 rounded-lg font-body text-sm px-3 py-2 text-on-surface focus:bg-surface-container-lowest focus:border-primary/50 transition-colors text-center mx-auto" 
                                                        type="number" 
                                                        value={item.receivedQty} 
                                                        onChange={(e) => handleItemChange(idx, 'receivedQty', e.target.value)}
                                                    />
                                                </td>
                                                <td className="py-4 px-4 align-middle border-r border-outline-variant/5">
                                                    <select 
                                                        className="w-full bg-surface-container-low border border-outline-variant/20 rounded-lg font-body text-sm px-3 py-2 text-on-surface focus:bg-surface-container-lowest focus:border-primary/50 transition-colors"
                                                        value={item.condition}
                                                        onChange={(e) => handleItemChange(idx, 'condition', e.target.value)}
                                                    >
                                                        <option>Undamaged</option>
                                                        <option>Minor Damage</option>
                                                        <option>Critical Damage</option>
                                                    </select>
                                                </td>
                                                <td className="py-4 px-4 align-middle">
                                                    <input 
                                                        className="w-full bg-surface-container-low border border-outline-variant/20 rounded-lg font-body text-sm px-3 py-2 text-on-surface focus:bg-surface-container-lowest focus:border-primary/50 transition-colors" 
                                                        type="text" 
                                                        placeholder="Scan Bin"
                                                        value={item.location}
                                                        onChange={(e) => handleItemChange(idx, 'location', e.target.value)}
                                                    />
                                                </td>
                                            </tr>
                                            );
                                        })
                                    ) : (
                                        <tr>
                                            <td colSpan="4" className="py-8 text-center text-on-surface-variant">
                                                <span className="material-symbols-outlined text-4xl mb-2 opacity-50">search_off</span>
                                                <p>No items loaded. Please fetch a manifest first.</p>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                        {receivedItems.length > 0 && (
                            <GlobalPagination 
                                totalItems={receivedItems.length}
                                itemsPerPage={itemsPerPage}
                                currentPage={currentPage}
                                setCurrentPage={setCurrentPage}
                            />
                        )}
                    </div>

                    {/* Actions */}
                    {loadedTransfer && (
                        <div className="mt-8 flex items-center justify-between border-t border-outline-variant/10 pt-8">
                            <div className="flex items-center gap-2">
                                {loadedTransfer.linkedDemand && (
                                    <label className="flex items-center gap-2 cursor-pointer bg-surface-container-low px-4 py-2 rounded-lg border border-outline-variant/20 hover:bg-surface-container transition-colors">
                                        <input 
                                            type="checkbox" 
                                            className="w-4 h-4 text-primary rounded border-outline-variant focus:ring-primary focus:ring-2"
                                            checked={closeDemand}
                                            onChange={(e) => setCloseDemand(e.target.checked)}
                                        />
                                        <span className="font-label text-sm font-semibold text-on-surface">Close Demand? <span className="font-body font-normal text-xs text-on-surface-variant ml-1">(Check if no further stock is expected)</span></span>
                                    </label>
                                )}
                            </div>
                            <div className="flex gap-4">
                                <button className="px-6 py-3 rounded-lg font-label font-semibold text-primary hover:bg-primary/5 transition-colors">
                                    Save Draft
                                </button>
                                <button onClick={handleConfirmReceipt} className="bg-gradient-to-br from-primary to-primary-container px-8 py-3 rounded-lg text-on-primary font-label font-semibold flex items-center gap-2 hover:opacity-90 transition-opacity shadow-[0_8px_16px_rgba(0,66,119,0.2)]">
                                    <span className="material-symbols-outlined text-[20px]">check_circle</span>
                                    Confirm Receipt
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
