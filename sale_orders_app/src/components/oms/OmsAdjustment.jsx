import React, { useState, useEffect } from 'react';

export default function OmsAdjustment({ pendingItems = [], onCancel, handleStartRun }) {
    // pendingItems already contains only the selected items from ProductionOMS list.
    const selectedData = pendingItems;
    
    // Manage input state for adjustments
    const [adjustments, setAdjustments] = useState({});

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
        // Just start run for each, using the adjusted quantities
        selectedData.forEach(item => {
            const adjQty = adjustments[item.itemCode] || item.quantity;
            handleStartRun({ ...item, producedQty: adjQty });
        });
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
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse min-w-[1200px]">
                        <thead>
                            <tr className="bg-surface-container-low/50">
                                <th className="py-5 px-6 text-[11px] font-extrabold uppercase tracking-widest text-on-surface-variant border-b border-outline-variant/10">Sale Order / Date</th>
                                <th className="py-5 px-6 text-[11px] font-extrabold uppercase tracking-widest text-on-surface-variant border-b border-outline-variant/10">Customer Name</th>
                                <th className="py-5 px-6 text-[11px] font-extrabold uppercase tracking-widest text-on-surface-variant border-b border-outline-variant/10">Product / Item Code</th>
                                <th className="py-5 px-6 text-[11px] font-extrabold uppercase tracking-widest text-on-surface-variant border-b border-outline-variant/10">Required Material</th>
                                <th className="py-5 px-6 text-[11px] font-extrabold uppercase tracking-widest text-on-surface-variant border-b border-outline-variant/10 text-right">Order Metres</th>
                                <th className="py-5 px-6 text-[11px] font-extrabold uppercase tracking-widest text-on-surface-variant border-b border-outline-variant/10 text-right">Output Metres</th>
                                <th className="py-5 px-6 text-[11px] font-extrabold uppercase tracking-widest text-primary border-b border-outline-variant/10 text-right min-w-[200px]">Production Metres</th>
                            </tr>
                        </thead>
                        <tbody className="group">
                            {selectedData.length > 0 ? selectedData.map((item) => (
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
                                    <td className="py-6 px-6 align-middle">
                                        <div className="flex flex-col gap-1">
                                            <span className="text-xs font-semibold text-on-surface">{item.requiredFabricName || 'None'}</span>
                                            {item.hasShortage && <span className="text-[10px] text-error font-bold flex items-center gap-1"><span className="material-symbols-outlined text-[12px]">warning</span>Shortage</span>}
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
            </div>

            {/* Summary Section */}
            <div className="bg-surface-container rounded-2xl p-8 flex flex-col md:flex-row items-center justify-between">
                <div className="flex space-x-12 mb-6 md:mb-0">
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
                </div>
                <button 
                    onClick={submitRuns}
                    disabled={selectedData.length === 0}
                    className="bg-gradient-to-br from-primary to-primary-container text-on-primary px-10 py-5 rounded-xl font-bold text-lg flex items-center space-x-4 shadow-xl hover:shadow-primary/20 transition-all active:scale-95 group disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <span>Confirm Production Plan</span>
                    <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">precision_manufacturing</span>
                </button>
            </div>
        </div>
    );
}
