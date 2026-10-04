import React, { useState } from 'react';
import PrintLayout from '../ui/PrintLayout';
import { useApp } from '../../context/AppContext';
import GlobalPagination from '../ui/GlobalPagination';

export default function OmsSlip({ activeRuns = [] }) {
    const { state } = useApp();
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 20;

    const displayedData = state?.isGlobalPaginated 
        ? activeRuns.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
        : activeRuns;

    if (activeRuns.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center h-[60vh]">
                <span className="material-symbols-outlined text-[80px] text-surface-container-highest mb-4">description</span>
                <h2 className="text-2xl font-manrope font-extrabold text-on-surface">No Production Slips Generated</h2>
                <p className="text-on-surface-variant font-medium mt-2 max-w-md text-center">
                    Plan a production run from the Planning tab to generate job sheets and tracking slips.
                </p>
            </div>
        );
    }

    // Function to trigger a mock print
    const handlePrint = (runId) => {
        window.print();
    };

    return (
        <>
        {/* ON-SCREEN UI */}
        <div className="animate-in fade-in duration-500 max-w-[1920px] mx-auto pb-20 print:hidden">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4 px-2">
                <div>
                    <h1 className="text-3xl font-manrope font-extrabold tracking-tight text-on-surface">Final Production Slip</h1>
                    <p className="text-on-surface-variant font-body mt-1">Generate and print production routing slips for the factory floor.</p>
                </div>
            </div>

            {/* Slip Cards Container */}
            <div className="grid grid-cols-1 gap-6">
                {displayedData.map((run, idx) => (
                    <div key={run.id} className="bg-surface-container-lowest rounded-3xl p-8 border border-outline-variant/15 shadow-sm relative overflow-hidden group">
                        
                        {/* Decorative Background Element */}
                        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>

                        <div className="relative z-10 flex flex-col xl:flex-row justify-between gap-8">
                            
                            {/* Header Info */}
                            <div className="xl:w-1/4 pr-8 xl:border-r border-outline-variant/20">
                                <div className="mb-6">
                                    <span className="text-[10px] font-extrabold text-on-surface-variant uppercase tracking-widest mb-1 block">Production Routing Slip</span>
                                    <h2 className="text-2xl font-manrope font-black text-primary">{run.id}</h2>
                                    <p className="text-sm font-medium text-on-surface-variant mt-1">Generated: {new Date(run.startTime).toLocaleString()}</p>
                                </div>
                                <button 
                                    onClick={() => handlePrint(run.id)}
                                    className="w-full bg-surface-container-low hover:bg-primary/10 text-primary font-bold py-3 px-4 rounded-xl transition-colors border border-outline-variant/20 flex items-center justify-center gap-2"
                                >
                                    <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>print</span>
                                    Print Job Card
                                </button>
                            </div>

                            {/* Main Details Table Area */}
                            <div className="xl:w-3/4 overflow-x-auto custom-scrollbar">
                                <table className="w-full text-left">
                                    <thead>
                                        <tr className="border-b-2 border-outline-variant/10">
                                            <th className="py-2 px-4 text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">Sale Order</th>
                                            <th className="py-2 px-4 text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">Customer</th>
                                            <th className="py-2 px-4 text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">Item details</th>
                                            <th className="py-2 px-4 text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">Required Material</th>
                                            <th className="py-2 px-4 text-[10px] font-bold text-on-surface-variant uppercase tracking-wider text-right">Order Metres</th>
                                            <th className="py-2 px-4 text-[10px] font-bold text-on-surface-variant uppercase tracking-wider text-right">Output</th>
                                            <th className="py-2 px-4 text-[10px] font-extrabold text-tertiary uppercase tracking-wider text-right">Remaining</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y border-outline-variant/10">
                                        <tr>
                                            <td className="py-4 px-4 align-top">
                                                <div className="flex flex-col gap-1">
                                                    <span className="font-bold text-sm text-on-surface">{run.orderId || 'N/A'}</span>
                                                    <span className="text-xs text-on-surface-variant">{run.orderDate ? new Date(run.orderDate).toLocaleDateString() : 'N/A'}</span>
                                                </div>
                                            </td>
                                            <td className="py-4 px-4 align-top">
                                                <span className="font-semibold text-sm text-on-surface">{run.customerName || 'Unknown'}</span>
                                            </td>
                                            <td className="py-4 px-4 align-top">
                                                <div className="flex flex-col gap-1">
                                                    <span className="font-bold text-sm text-on-surface">{run.productName}</span>
                                                    <span className="font-mono text-xs bg-slate-100 text-slate-600 px-1 py-0.5 rounded w-fit">{run.itemCode}</span>
                                                </div>
                                            </td>
                                            <td className="py-4 px-4 align-top">
                                                <span className="text-sm font-semibold text-on-surface">{run.requiredFabricName || 'None'}</span>
                                            </td>
                                            <td className="py-4 px-4 align-top text-right">
                                                <span className="font-manrope font-black text-on-surface">{run.quantity} <span className="text-xs text-on-surface-variant font-medium">m</span></span>
                                            </td>
                                            <td className="py-4 px-4 align-top text-right">
                                                <span className="font-manrope font-black text-on-surface-variant">{run.outputQty || 0} <span className="text-xs text-on-surface-variant font-medium">m</span></span>
                                            </td>
                                            <td className="py-4 px-4 align-top text-right">
                                                <span className="font-manrope font-black text-tertiary text-lg">{run.remaining !== undefined ? run.remaining : run.quantity} <span className="text-sm text-on-surface-variant font-medium">m</span></span>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>

                                {/* Footer Bar of the slip row */}
                                <div className="mt-8 flex items-center justify-between bg-surface-container-low rounded-xl p-4 border border-outline-variant/10">
                                    <div className="flex items-center gap-2">
                                        <div className="w-2 h-2 rounded-full bg-primary animate-pulse"></div>
                                        <span className="text-xs font-bold text-primary uppercase tracking-widest">Routing Sent to Machine Line</span>
                                    </div>
                                    <div className="text-xs font-mono text-on-surface-variant">BARCODE: {run.id.replace('RUN-', '')}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            
            <div className="mt-8">
                <GlobalPagination 
                    totalItems={activeRuns.length}
                    itemsPerPage={itemsPerPage}
                    currentPage={currentPage}
                    setCurrentPage={setCurrentPage}
                />
            </div>
        </div>

        {/* PRINT-ONLY UI (Clean Table format) */}
        <div className="hidden print:block w-full">
            {activeRuns.map((run, idx) => {
                const slipSettings = state?.adminSetup?.printSettings?.moduleSettings?.production_slip || {};
                const rowSize = slipSettings.rowSize || 'normal';
                const cellPadding = rowSize === 'compact' ? 'py-1 px-2' : rowSize === 'spacious' ? 'py-4 px-4' : 'py-2 px-3';
                
                let colWidths = [];
                if (slipSettings.columnWidths) {
                    colWidths = slipSettings.columnWidths.split(',').map(s => s.trim());
                }

                return (
                <div key={run.id} className="mb-10 page-break-after-always" style={{ pageBreakAfter: idx === activeRuns.length - 1 ? 'auto' : 'always' }}>
                    <PrintLayout 
                        documentTitle="Production Routing Slip"
                        documentId={run.id}
                        date={new Date(run.startTime).toLocaleDateString()}
                        disclaimerKey="production"
                        extraMeta={[
                            { label: 'Sale Order', value: run.orderId || 'N/A' },
                            { label: 'Customer', value: run.customerName || 'Unknown' }
                        ]}
                    >
                        <div className="border border-gray-300 mt-4">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-gray-100">
                                        <th className="py-2 px-3 text-[11px] font-black text-gray-700 uppercase border border-gray-300" style={{ width: colWidths[0] || '15%' }}>Item Code</th>
                                        <th className="py-2 px-3 text-[11px] font-black text-gray-700 uppercase border border-gray-300" style={{ width: colWidths[1] || 'auto' }}>Product</th>
                                        <th className="py-2 px-3 text-[11px] font-black text-gray-700 uppercase border border-gray-300" style={{ width: colWidths[2] || '20%' }}>Req. Material</th>
                                        <th className="py-2 px-3 text-[11px] font-black text-gray-700 uppercase border border-gray-300 text-right" style={{ width: colWidths[3] || '12%' }}>Target (m)</th>
                                        <th className="py-2 px-3 text-[11px] font-black text-gray-700 uppercase border border-gray-300 text-right" style={{ width: colWidths[4] || '12%' }}>Output (m)</th>
                                        <th className="py-2 px-3 text-[11px] font-black text-gray-700 uppercase border border-gray-300 text-right" style={{ width: colWidths[5] || '12%' }}>Balance (m)</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td className={`${cellPadding} text-[11px] font-bold border border-gray-300`}>{run.itemCode}</td>
                                        <td className={`${cellPadding} text-[11px] border border-gray-300`}>{run.productName}</td>
                                        <td className={`${cellPadding} text-[11px] border border-gray-300`}>{run.requiredFabricName || 'None'}</td>
                                        <td className={`${cellPadding} text-[11px] font-bold text-right border border-gray-300`}>{run.quantity}</td>
                                        <td className={`${cellPadding} text-[11px] font-bold text-right border border-gray-300`}>{run.outputQty || 0}</td>
                                        <td className={`${cellPadding} text-[11px] font-bold text-right border border-gray-300`}>{run.remaining !== undefined ? run.remaining : run.quantity}</td>
                                    </tr>
                                </tbody>
                            </table>
                            <div className="p-4 bg-gray-50 flex justify-between items-center border-t border-gray-300">
                                <div><strong className="text-[10px] text-gray-500">MACHINE ALLOCATION:</strong> ________________________</div>
                                <div><strong className="text-[10px] text-gray-500">OPERATOR SIGN:</strong> ________________________</div>
                            </div>
                        </div>
                    </PrintLayout>
                </div>
            )})}
        </div>
        </>
    );
}
