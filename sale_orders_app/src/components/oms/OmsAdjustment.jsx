import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import GlobalPagination from '../ui/GlobalPagination';

export default function OmsAdjustment({ pendingItems = [], onCancel, handleStartRun, editingPlanDate }) {
    // pendingItems already contains only the selected items from ProductionOMS list.
    const selectedData = pendingItems;
    
    // Manage input state for adjustments
    const { state } = useApp();
    const [adjustments, setAdjustments] = useState({});
    const [planDate, setPlanDate] = useState(editingPlanDate || '');

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 20;

    const displayedData = state?.isGlobalPaginated
        ? selectedData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
        : selectedData;

    useEffect(() => {
        const initAdj = {};
        selectedData.forEach(item => {
            initAdj[item.itemCode] = item.quantity;
        });
        setAdjustments(initAdj);
    }, [selectedData]);

    const handleInput = (code, val) => {
        setAdjustments(prev => ({ ...prev, [code]: val }));
    };

    const submitRuns = () => {
        if (!planDate) return;
        const payload = selectedData.map(item => ({
            ...item,
            producedQty: adjustments[item.itemCode] || item.quantity
        }));
        handleStartRun(payload, planDate);
    };

    return (
        <div className="animate-in fade-in duration-500 max-w-[1920px] mx-auto pb-24">
            {/* Header Section */}
            <div className="mb-10">
                <div onClick={onCancel} className="flex items-center space-x-2 text-primary mb-2 cursor-pointer hover:bg-surface-container-low w-max px-2 py-1 rounded-md transition-colors">
                    <span className="material-symbols-outlined text-sm">arrow_back</span>
                    <span className="text-xs font-bold uppercase tracking-widest font-label">Back to Selection</span>
                </div>
                <h2 className="text-3xl font-manrope font-extrabold tracking-tight text-on-surface">Adjust Production Metres</h2>
                <p className="text-on-surface-variant font-body mt-1 max-w-2xl">Review and refine the production targets for the selected sales orders. Adjustments here will update the final mill run requirements.</p>
            </div>

            {/* Table replacing Bento */}
            <div className="bg-surface-container-lowest rounded-[2rem] shadow-[0_20px_40px_rgba(0,28,56,0.06)] overflow-hidden border border-outline-variant/10 mb-8">
                <div className="overflow-x-auto custom-scrollbar">
                    <table className="w-full text-left border-collapse min-w-[1200px]">
                        <thead>
                            <tr className="bg-surface-container-low/50">
                                <th className="py-5 px-6 text-[11px] font-extrabold uppercase tracking-widest text-on-surface-variant border-b border-outline-variant/10">Sale Order / Date</th>
                                <th className="py-5 px-6 text-[11px] font-extrabold uppercase tracking-widest text-on-surface-variant border-b border-outline-variant/10">Customer Name</th>
                                <th className="py-5 px-6 text-[11px] font-extrabold uppercase tracking-widest text-on-surface-variant border-b border-outline-variant/10">Product / Item Code</th>
                                <th className="py-5 px-6 text-[11px] font-extrabold uppercase tracking-widest text-on-surface-variant border-b border-outline-variant/10 text-right">Order Metres</th>
                                <th className="py-5 px-6 text-[11px] font-extrabold uppercase tracking-widest text-on-surface-variant border-b border-outline-variant/10 text-right">Output Metres</th>
                                <th className="py-5 px-6 text-[11px] font-extrabold uppercase tracking-widest text-primary border-b border-outline-variant/10 text-right min-w-[200px]">Production Metres</th>
                            </tr>
                        </thead>
                        <tbody className="group">
                            {displayedData.length > 0 ? displayedData.map((item) => (
                                <tr key={item.itemCode} className="border-b border-outline-variant/10 transition-colors hover:bg-surface-container-lowest">
                                    <td className="py-6 px-6 align-middle">
                                        <div className="flex flex-col gap-1">
                                            <span className="font-bold text-primary text-sm">{item.orderId}</span>
                                            <span className="text-xs text-on-surface-variant">{new Date(item.date).toLocaleDateString()}</span>
                                        </div>
                                    </td>
                                    <td className="py-6 px-6 align-middle">
                                        <span className="text-sm font-semibold text-on-surface">{item.customerName || item.customer || 'Unknown'}</span>
                                    </td>
                                    <td className="py-6 px-6 align-middle">
                                        <div className="flex flex-col gap-1">
                                            <span className="font-bold text-on-surface text-sm">{item.productName || 'Unknown Item'}</span>
                                            <span className="font-mono text-[10px] bg-slate-100 text-slate-600 px-1 py-0.5 rounded w-fit">{item.itemCode}</span>
                                        </div>
                                    </td>
                                    <td className="py-6 px-6 align-middle text-right">
                                        <span className="font-manrope font-black text-base text-on-surface">{item.quantity}<span className="text-xs font-medium ml-1">m</span></span>
                                    </td>
                                    <td className="py-6 px-6 align-middle text-right">
                                        <span className="font-manrope font-bold text-base text-on-surface-variant font-mono">{parseInt(item.producedQty) || 0}<span className="text-xs font-medium ml-1">m</span></span>
                                    </td>
                                    <td className="py-4 px-6 align-middle text-right">
                                        <div className="relative inline-block w-32">
                                            <input 
                                                className="w-full bg-surface-container border border-outline-variant/30 rounded-lg px-4 py-2 text-base font-bold text-primary focus:ring-2 focus:ring-primary focus:bg-white transition-all outline-none" 
                                                type="number" 
                                                value={adjustments[item.itemCode] || ''}
                                                onChange={(e) => handleInput(item.itemCode, e.target.value)}
                                            />
                                            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-xs font-semibold pointer-events-none">m</span>
                                        </div>
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan="7" className="py-12 text-center text-on-surface-variant">No items found for adjustment.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
                
                <GlobalPagination 
                    totalItems={selectedData.length}
                    itemsPerPage={itemsPerPage}
                    currentPage={currentPage}
                    setCurrentPage={setCurrentPage}
                />
            </div>

            {/* Summary Section */}
            <div className="bg-surface-container rounded-2xl p-8 flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="flex flex-wrap gap-12 mb-6 md:mb-0">
                    <div>
                        <p className="text-[10px] uppercase tracking-widest text-on-surface-variant font-bold mb-1">Total Selected Items</p>
                        <p className="text-3xl font-manrope font-black text-on-surface">{selectedData.length > 0 ? selectedData.length.toString().padStart(2, '0') : '00'}</p>
                    </div>
                    <div>
                        <p className="text-[10px] uppercase tracking-widest text-on-surface-variant font-bold mb-1">Cumulative Target</p>
                        <p className="text-3xl font-manrope font-black text-on-surface">
                            {Object.values(adjustments).reduce((acc, v) => acc + parseInt(v || 0, 10), 0)}<span className="text-sm font-bold ml-1">m</span>
                        </p>
                    </div>
                    <div className="min-w-[200px]">
                        <p className="text-[10px] uppercase tracking-widest text-on-surface-variant font-bold mb-1">Plan Date <span className="text-error">*</span></p>
                        <input 
                            type="date" 
                            value={planDate}
                            onChange={(e) => setPlanDate(e.target.value)}
                            className="w-full bg-surface-container-lowest border-none ring-1 ring-outline-variant/30 focus:ring-primary rounded-xl px-4 py-2.5 text-sm font-bold text-on-surface outline-none transition-all"
                        />
                    </div>
                </div>
                <button 
                    onClick={submitRuns}
                    disabled={selectedData.length === 0 || !planDate}
                    className="bg-gradient-to-br from-primary to-primary-container text-on-primary px-10 py-5 rounded-xl font-bold text-lg flex items-center space-x-4 shadow-xl hover:shadow-primary/20 transition-all active:scale-95 group disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
                >
                    <span>Confirm Production Plan</span>
                    <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">precision_manufacturing</span>
                </button>
            </div>
        </div>
    );
}
