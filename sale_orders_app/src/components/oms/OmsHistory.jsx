import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';

export default function OmsHistory({ completedRuns = [] }) {
    const { state, setCollection } = useApp();
    const [viewPlan, setViewPlan] = useState(null);

    const handlePrint = (plan) => {
        setViewPlan(plan);
        setTimeout(() => {
            window.print();
        }, 300);
    };

    const handleDelete = (planId) => {
        if(window.confirm('Are you sure you want to delete this production plan?')) {
            const newPlans = state.productionPlans.filter(p => p.id !== planId);
            setCollection('productionPlans', newPlans);
        }
    };

    return (
        <div className="animate-in fade-in duration-500 max-w-[1400px] mx-auto pb-24 relative">
            
            {/* Header */}
            <div className="mb-10 no-print">
                <h1 className="text-3xl font-manrope font-extrabold tracking-tight text-on-surface">Planning History</h1>
                <p className="text-on-surface-variant font-body mt-1">Review finalized production plans and efficiency deviations over time.</p>
            </div>

            {/* Filters & Actions Bar */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 no-print">
                <div className="flex flex-wrap items-end gap-4">
                    <div className="space-y-1.5">
                        <label className="text-[11px] font-bold uppercase tracking-widest text-on-surface-variant ml-1">Date Range</label>
                        <div className="flex items-center bg-surface-container-lowest rounded-xl p-1 shadow-sm border border-outline-variant/10">
                            <input className="bg-transparent border-none text-sm focus:ring-0 py-1.5 px-3 text-on-surface" type="date" />
                            <span className="text-outline mx-1">/</span>
                            <input className="bg-transparent border-none text-sm focus:ring-0 py-1.5 px-3 text-on-surface" type="date" />
                        </div>
                    </div>
                    <div className="space-y-1.5">
                        <label className="text-[11px] font-bold uppercase tracking-widest text-on-surface-variant ml-1">Status</label>
                        <select className="bg-surface-container-lowest border-none rounded-xl text-sm py-2.5 px-4 shadow-sm focus:ring-2 focus:ring-primary/10 pr-10 appearance-none">
                            <option>All Statuses</option>
                            <option>Completed</option>
                            <option>In Progress</option>
                            <option>Cancelled</option>
                        </select>
                    </div>
                    <button className="bg-surface-container-high text-on-surface font-semibold text-sm py-2.5 px-6 rounded-xl hover:bg-surface-dim transition-all flex items-center gap-2">
                        <span className="material-symbols-outlined text-lg" style={{ fontVariationSettings: "'FILL' 0" }}>filter_list</span>
                        Apply Filters
                    </button>
                </div>
            </div>

            {/* Bento Grid - Table Container */}
            <div className="bg-surface-container-lowest rounded-[2rem] shadow-[0_20px_40px_rgba(0,28,56,0.06)] overflow-hidden border border-outline-variant/10 no-print">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse min-w-[800px]">
                        <thead>
                            <tr className="bg-surface-container-low/50">
                                <th className="py-6 px-8 text-[11px] font-extrabold uppercase tracking-widest text-on-surface-variant border-b border-outline-variant/10">Plan ID</th>
                                <th className="py-6 px-8 text-[11px] font-extrabold uppercase tracking-widest text-on-surface-variant border-b border-outline-variant/10">Date Created</th>
                                <th className="py-6 px-8 text-[11px] font-extrabold uppercase tracking-widest text-on-surface-variant border-b border-outline-variant/10">Items</th>
                                <th className="py-6 px-8 text-[11px] font-extrabold uppercase tracking-widest text-on-surface-variant border-b border-outline-variant/10">Total Metres</th>
                                <th className="py-6 px-8 text-[11px] font-extrabold uppercase tracking-widest text-on-surface-variant border-b border-outline-variant/10">Status</th>
                                <th className="py-6 px-8 text-[11px] font-extrabold uppercase tracking-widest text-on-surface-variant border-b border-outline-variant/10 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-outline-variant/10">
                            {completedRuns.length > 0 ? completedRuns.map((run, idx) => (
                                <tr key={idx} className="hover:bg-surface-container-low/30 transition-colors group">
                                    <td className="py-5 px-8">
                                        <span className="font-bold text-primary">{run.id}</span>
                                    </td>
                                    <td className="py-5 px-8 text-sm font-medium text-on-surface">{new Date(run.date).toLocaleDateString()} <span className="text-on-surface-variant ml-1 font-normal">{new Date(run.date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span></td>
                                    <td className="py-5 px-8 text-sm font-semibold">{run.items?.length || 0}</td>
                                    <td className="py-5 px-8 text-sm font-semibold">{run.items ? run.items.reduce((acc, i) => acc + parseInt(i.qty || i.quantity || 0), 0) : 0}m</td>
                                    <td className="py-5 px-8">
                                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${run.status === 'Completed' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>
                                            <span className={`w-1.5 h-1.5 rounded-full mr-2 ${run.status === 'Completed' ? 'bg-green-500' : 'bg-blue-500 animate-pulse'}`}></span>
                                            {run.status || 'In Progress'}
                                        </span>
                                    </td>
                                    <td className="py-5 px-8 text-right">
                                        <div className="flex justify-end gap-2 group-hover:opacity-100 transition-opacity">
                                            <button onClick={() => setViewPlan(run)} className="p-2 hover:bg-primary-fixed text-primary rounded-lg transition-colors" title="View"><span className="material-symbols-outlined text-lg" style={{ fontVariationSettings: "'FILL' 0" }}>visibility</span></button>
                                            <button onClick={() => handlePrint(run)} className="p-2 hover:bg-primary-fixed text-primary rounded-lg transition-colors" title="Print"><span className="material-symbols-outlined text-lg" style={{ fontVariationSettings: "'FILL' 0" }}>print</span></button>
                                            <button onClick={() => handleDelete(run.id)} className="p-2 hover:bg-error-container text-error rounded-lg transition-colors" title="Delete"><span className="material-symbols-outlined text-lg" style={{ fontVariationSettings: "'FILL' 0" }}>delete</span></button>
                                        </div>
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan="6" className="py-12 text-center text-on-surface-variant text-sm border-b border-outline-variant/10">No planning history available.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="py-6 px-10 bg-surface-container-low/30 border-t border-outline-variant/10 flex items-center justify-between">
                    <p className="text-xs text-on-surface-variant font-medium">Showing {completedRuns.length} results</p>
                    <div className="flex items-center gap-1">
                        <button className="w-8 h-8 rounded-lg flex items-center justify-center text-outline hover:bg-surface-container-high transition-colors">
                            <span className="material-symbols-outlined text-lg" style={{ fontVariationSettings: "'FILL' 0" }}>chevron_left</span>
                        </button>
                        <button className="w-8 h-8 rounded-lg bg-primary text-white text-xs font-bold">1</button>
                        <button className="w-8 h-8 rounded-lg flex items-center justify-center text-outline hover:bg-surface-container-high transition-colors">
                            <span className="material-symbols-outlined text-lg" style={{ fontVariationSettings: "'FILL' 0" }}>chevron_right</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* Dashboard Stats Summary (Bento Sub-element) */}
            {completedRuns.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10 no-print">
                <div className="bg-surface-container-highest p-6 rounded-[1.5rem] flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                        <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>task_alt</span>
                    </div>
                    <div>
                        <p className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Efficiency Score</p>
                        <p className="text-xl font-black text-on-surface">94.2%</p>
                    </div>
                </div>
                <div className="bg-surface-container-highest p-6 rounded-[1.5rem] flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                        <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>straighten</span>
                    </div>
                    <div>
                        <p className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Monthly Metres</p>
                        <p className="text-xl font-black text-on-surface">84,200m</p>
                    </div>
                </div>
                <div className="bg-tertiary-fixed p-6 rounded-[1.5rem] flex items-center gap-4 border border-tertiary/10 text-on-tertiary-fixed-variant">
                    <div className="w-12 h-12 rounded-2xl bg-tertiary/10 flex items-center justify-center text-tertiary">
                        <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>warning</span>
                    </div>
                    <div>
                        <p className="text-xs font-bold uppercase tracking-wider">Plan Deviations</p>
                        <p className="text-xl font-black">2.1%</p>
                    </div>
                </div>
            </div>
            )}

            {/* View Modal */}
            {viewPlan && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm no-print">
                    <div className="print-wrapper bg-surface text-on-surface w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-3xl shadow-2xl relative">
                        {/* Modal Header */}
                        <div className="sticky top-0 bg-surface/90 backdrop-blur-md px-8 py-6 border-b border-outline-variant/20 flex justify-between items-center z-10 no-print">
                            <div>
                                <h2 className="text-2xl font-extrabold tracking-tight">Production Plan Document</h2>
                                <p className="text-sm font-semibold text-primary">{viewPlan.id}</p>
                            </div>
                            <div className="flex gap-4">
                                <button onClick={() => handlePrint(viewPlan)} className="bg-primary text-white px-5 py-2 rounded-xl text-sm font-bold flex items-center gap-2 hover:bg-primary/90 transition-colors">
                                    <span className="material-symbols-outlined text-[18px]">print</span>
                                    Print Document
                                </button>
                                <button onClick={() => setViewPlan(null)} className="w-10 h-10 rounded-full flex items-center justify-center bg-surface-container hover:bg-surface-container-high transition-colors text-on-surface">
                                    <span className="material-symbols-outlined">close</span>
                                </button>
                            </div>
                        </div>

                        {/* Printable Content Area */}
                        <div className="p-10 print-wrapper">
                            <div className="text-center mb-10 pb-6 border-b border-outline-variant/20">
                                <h1 className="text-4xl font-black font-manrope text-on-surface uppercase tracking-tight mb-2">Production Plan</h1>
                                <p className="text-lg font-mono font-medium text-on-surface-variant">{viewPlan.id}</p>
                            </div>
                            
                            <div className="grid grid-cols-2 gap-8 mb-10">
                                <div>
                                    <h3 className="text-xs font-bold uppercase tracking-widest text-outline mb-1">Date Created</h3>
                                    <p className="text-base font-semibold">{new Date(viewPlan.date).toLocaleString()}</p>
                                </div>
                                <div>
                                    <h3 className="text-xs font-bold uppercase tracking-widest text-outline mb-1">Status</h3>
                                    <p className="text-base font-semibold text-primary">{viewPlan.status}</p>
                                </div>
                            </div>

                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="border-b-2 border-outline-variant/30">
                                        <th className="py-3 px-2 text-[10px] font-extrabold uppercase tracking-widest text-on-surface-variant">Sale Order</th>
                                        <th className="py-3 px-2 text-[10px] font-extrabold uppercase tracking-widest text-on-surface-variant">Customer</th>
                                        <th className="py-3 px-2 text-[10px] font-extrabold uppercase tracking-widest text-on-surface-variant">Item</th>
                                        <th className="py-3 px-2 text-[10px] font-extrabold uppercase tracking-widest text-on-surface-variant text-right">Order Qty</th>
                                        <th className="py-3 px-2 text-[10px] font-extrabold uppercase tracking-widest text-on-surface-variant text-right">Prod Target</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-outline-variant/10">
                                    {viewPlan.items && viewPlan.items.map((item, idx) => (
                                        <tr key={idx}>
                                            <td className="py-4 px-2 font-bold text-sm text-on-surface">{item.orderId}</td>
                                            <td className="py-4 px-2 text-sm font-medium">{item.customerName || item.customer || 'Unknown'}</td>
                                            <td className="py-4 px-2 text-sm font-medium">
                                                {item.productName} <br />
                                                <span className="text-xs font-mono text-outline">{item.itemCode}</span>
                                            </td>
                                            <td className="py-4 px-2 text-sm font-bold text-right text-on-surface-variant">{item.quantity}m</td>
                                            <td className="py-4 px-2 text-sm font-bold text-right text-primary">{item.producedQty || 0}m</td>
                                        </tr>
                                    ))}
                                </tbody>
                                <tfoot>
                                    <tr className="border-t-2 border-outline-variant/30">
                                        <th colSpan="4" className="py-4 px-2 text-right text-[11px] font-extrabold uppercase tracking-widest text-on-surface-variant">Total Production Target:</th>
                                        <th className="py-4 px-2 text-right text-lg font-black text-on-surface">
                                            {viewPlan.items ? viewPlan.items.reduce((acc, i) => acc + parseInt(i.producedQty || 0), 0) : 0}m
                                        </th>
                                    </tr>
                                </tfoot>
                            </table>
                            
                            <div className="mt-20 pt-8 border-t border-outline-variant/20 flex justify-between text-sm font-semibold text-outline">
                                <p>Generated by Order Management System</p>
                                <p>Signature: _______________________</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
}
