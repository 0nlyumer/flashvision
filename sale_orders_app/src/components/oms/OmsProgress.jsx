import React from 'react';

export default function OmsProgress({ activeRunItems, handleCompleteRun }) {
    return (
        <div className="animate-in fade-in duration-500 max-w-[1920px] mx-auto">
            {/* Header / Module Title Area */}
            <div className="mb-10 flex justify-between items-end">
                <div>
                    <div className="flex items-center gap-3 mb-2">
                        <span className="bg-secondary-container text-on-secondary-fixed-variant px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest border border-outline-variant/20">Active Run: #RUN-44Z9</span>
                        <span className="flex items-center text-xs font-semibold text-primary"><span className="w-2 h-2 bg-primary rounded-full animate-pulse mr-2"></span> System Nominal</span>
                    </div>
                    <h1 className="text-3xl font-manrope font-extrabold tracking-tight text-on-surface">Production Progress</h1>
                    <p className="text-on-surface-variant font-body mt-1 max-w-2xl">Monitoring active manufacturing pipelines. Parameters are locked during live operation until completion criteria are met.</p>
                </div>
            </div>

            {/* Stepper / Progress Bar (Shared Component Idea) */}
            <div className="bg-surface-container-lowest p-8 rounded-[2rem] shadow-[0_20px_40px_rgba(0,28,56,0.04)] mb-10 border border-outline-variant/10">
                <h3 className="text-sm font-bold uppercase tracking-widest text-on-surface-variant mb-8 flex items-center justify-between">
                    System Process Flow
                    <span className="text-xs font-medium normal-case bg-surface-container-high px-3 py-1 rounded-full text-on-surface">Auto-updating</span>
                </h3>
                <div className="flex items-center justify-between relative">
                    <div className="absolute left-0 right-0 h-1 bg-surface-container top-[25px] -z-10 rounded-full"></div>
                    <div className="absolute left-0 w-3/5 h-1 bg-gradient-to-r from-primary to-primary-container top-[25px] -z-10 rounded-full shadow-[0_0_10px_rgba(0,66,119,0.5)]"></div>

                    {/* Step 1 */}
                    <div className="flex flex-col items-center gap-3 relative z-10 w-32">
                        <div className="w-12 h-12 bg-primary text-white rounded-full flex items-center justify-center shadow-lg border-4 border-white">
                            <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>inventory_2</span>
                        </div>
                        <div className="text-center">
                            <p className="font-bold text-sm text-on-surface leading-tight">Order Prep</p>
                            <p className="text-[10px] text-on-surface-variant mt-0.5">Completed 08:30</p>
                        </div>
                    </div>

                    {/* Step 2 */}
                    <div className="flex flex-col items-center gap-3 relative z-10 w-32">
                        <div className="w-12 h-12 bg-primary flex items-center justify-center rounded-full text-white shadow-lg border-4 border-white">
                            <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>precision_manufacturing</span>
                        </div>
                        <div className="text-center">
                            <p className="font-bold text-sm text-on-surface leading-tight">Machine Setup</p>
                            <p className="text-[10px] text-on-surface-variant mt-0.5">Completed 09:15</p>
                        </div>
                    </div>

                    {/* Step 3 */}
                    <div className="flex flex-col items-center gap-3 relative z-10 w-32">
                        <div className="w-16 h-16 bg-primary-container flex items-center justify-center rounded-full text-white shadow-xl shadow-primary/30 border-4 border-white -mt-2">
                            <span className="material-symbols-outlined text-3xl animate-spin-slow">autorenew</span>
                        </div>
                        <div className="text-center">
                            <p className="font-bold text-sm text-primary leading-tight">In Production</p>
                            <p className="text-[10px] text-primary mt-0.5 font-bold">Est. 2h 15m remaining</p>
                        </div>
                    </div>

                    {/* Step 4 */}
                    <div className="flex flex-col items-center gap-3 relative z-10 w-32">
                        <div className="w-12 h-12 bg-surface-container-high border-2 border-outline-variant/30 border-dashed rounded-full flex items-center justify-center text-outline">
                            <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 0" }}>fact_check</span>
                        </div>
                        <div className="text-center">
                            <p className="font-bold text-sm text-on-surface-variant leading-tight">Quality Check</p>
                            <p className="text-[10px] text-outline mt-0.5">Pending</p>
                        </div>
                    </div>

                    {/* Step 5 */}
                    <div className="flex flex-col items-center gap-3 relative z-10 w-32">
                        <div className="w-12 h-12 bg-surface-container-high border-2 border-outline-variant/30 border-dashed rounded-full flex items-center justify-center text-outline">
                            <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 0" }}>local_shipping</span>
                        </div>
                        <div className="text-center">
                            <p className="font-bold text-sm text-on-surface-variant leading-tight">Dispatch</p>
                            <p className="text-[10px] text-outline mt-0.5">Pending</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-10">
                {/* Main Data Section */}
                <div className="xl:col-span-2">
                    <div className="bg-surface-container-lowest rounded-2xl shadow-[0_20px_40px_rgba(0,28,56,0.06)] overflow-hidden border border-outline-variant/10">
                        <div className="p-6 border-b border-outline-variant/10 flex justify-between items-center bg-surface-container-low/50">
                            <div>
                                <h2 className="text-lg font-manrope font-bold">Line Summary</h2>
                                <p className="text-xs text-on-surface-variant mt-1">Real-time parameters for currently assigned sub-items</p>
                            </div>
                            <button className="text-sm font-semibold text-primary hover:bg-surface-container-high px-4 py-2 rounded-lg transition-colors">Export Log</button>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse min-w-[700px]">
                                <thead className="bg-surface-container-lowest text-on-surface-variant text-[11px] font-extrabold uppercase tracking-widest">
                                    <tr>
                                        <th className="py-5 px-6 border-b border-outline-variant/10">Order Reference</th>
                                        <th className="py-5 px-6 border-b border-outline-variant/10">Material Spec</th>
                                        <th className="py-5 px-6 border-b border-outline-variant/10">Target (m)</th>
                                        <th className="py-5 px-6 border-b border-outline-variant/10">Est. Deviation</th>
                                        <th className="py-5 px-6 border-b border-outline-variant/10 text-right">Yield Risk</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-surface-container whitespace-nowrap">
                                    {activeRunItems && activeRunItems.length > 0 ? activeRunItems.map((item, idx) => (
                                        <tr key={idx} className="hover:bg-surface-container-low/30 transition-colors">
                                            <td className="py-5 px-6">
                                                <div className="flex flex-col">
                                                    <span className="font-manrope font-bold text-on-surface">{item.orderId || 'SO-88294'}</span>
                                                    <span className="font-mono text-[10px] text-on-surface-variant mt-1">{item.itemCode || 'INV-2309-A'}</span>
                                                </div>
                                            </td>
                                            <td className="py-5 px-6">
                                                <div className="flex flex-col">
                                                    <span className="text-sm font-semibold">{item.productName || 'Syn-Polyester V2'}</span>
                                                    <span className="text-[10px] text-on-surface-variant">Thickness: 0.4mm, Tension: High</span>
                                                </div>
                                            </td>
                                            <td className="py-5 px-6 font-semibold text-primary">{item.quantity} m</td>
                                            <td className="py-5 px-6">
                                                <span className="text-xs font-bold text-error bg-error-container/50 px-2 py-1 rounded">+{Math.floor(item.quantity * 0.015)}m (+1.5%)</span>
                                            </td>
                                            <td className="py-5 px-6 text-right">
                                                <span className="inline-flex items-center text-xs font-bold text-tertiary">
                                                    <span className="material-symbols-outlined text-[14px] mr-1" style={{ fontVariationSettings: "'FILL' 1" }}>warning</span> Low
                                                </span>
                                            </td>
                                        </tr>
                                    )) : (
                                        /* Static fallbacks to match the prototype exactly */
                                        <>
                                            <tr className="hover:bg-surface-container-low/30 transition-colors">
                                                <td className="py-5 px-6">
                                                    <div className="flex flex-col">
                                                        <span className="font-manrope font-bold text-on-surface">SO-88294</span>
                                                        <span className="font-mono text-[10px] text-on-surface-variant mt-1">INV-2309-A</span>
                                                    </div>
                                                </td>
                                                <td className="py-5 px-6">
                                                    <div className="flex flex-col">
                                                        <span className="text-sm font-semibold">Syn-Polyester V2</span>
                                                        <span className="text-[10px] text-on-surface-variant">Thickness: 0.4mm, Tension: High</span>
                                                    </div>
                                                </td>
                                                <td className="py-5 px-6 font-semibold text-primary">4,500 m</td>
                                                <td className="py-5 px-6">
                                                    <span className="text-xs font-bold text-error bg-error-container/50 px-2 py-1 rounded">+67.5m (+1.5%)</span>
                                                </td>
                                                <td className="py-5 px-6 text-right">
                                                    <span className="inline-flex items-center text-xs font-bold text-tertiary">
                                                        <span className="material-symbols-outlined text-[14px] mr-1" style={{ fontVariationSettings: "'FILL' 1" }}>warning</span> Low
                                                    </span>
                                                </td>
                                            </tr>
                                            <tr className="hover:bg-surface-container-low/30 transition-colors">
                                                <td className="py-5 px-6">
                                                    <div className="flex flex-col">
                                                        <span className="font-manrope font-bold text-on-surface">SO-88210</span>
                                                        <span className="font-mono text-[10px] text-on-surface-variant mt-1">INV-2309-B</span>
                                                    </div>
                                                </td>
                                                <td className="py-5 px-6">
                                                    <div className="flex flex-col">
                                                        <span className="text-sm font-semibold">Graphene-Mesh LT</span>
                                                        <span className="text-[10px] text-on-surface-variant">Thickness: 0.1mm, Weave: Hex</span>
                                                    </div>
                                                </td>
                                                <td className="py-5 px-6 font-semibold text-primary">1,250 m</td>
                                                <td className="py-5 px-6">
                                                    <span className="text-xs font-bold text-green-700 bg-green-100 px-2 py-1 rounded">Optimal (0%)</span>
                                                </td>
                                                <td className="py-5 px-6 text-right">
                                                    <span className="inline-flex items-center text-xs font-bold text-on-surface-variant">
                                                        <span className="material-symbols-outlined text-[14px] mr-1">check_circle</span> None
                                                    </span>
                                                </td>
                                            </tr>
                                            <tr className="bg-surface-container-low/10">
                                                <td colSpan="2" className="py-4 px-6 text-right text-xs font-bold uppercase tracking-widest text-on-surface-variant">Aggregate Requirements</td>
                                                <td className="py-4 px-6 font-black text-lg text-primary bg-surface-container-low/30">5,750 m</td>
                                                <td className="py-4 px-6 text-xs font-bold text-error">+67.5m Total</td>
                                                <td></td>
                                            </tr>
                                        </>
                                    )}
                                    {activeRunItems && activeRunItems.length > 0 && (
                                        <tr className="bg-surface-container-low/10">
                                            <td colSpan="2" className="py-4 px-6 text-right text-xs font-bold uppercase tracking-widest text-on-surface-variant">Aggregate Requirements</td>
                                            <td className="py-4 px-6 font-black text-lg text-primary bg-surface-container-low/30">
                                                {activeRunItems.reduce((acc, item) => acc + parseInt(item.quantity || 0, 10), 0)} m
                                            </td>
                                            <td className="py-4 px-6 text-xs font-bold text-error">...</td>
                                            <td></td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Operational Notes / Constraints */}
                    <div className="mt-8 bg-tertiary-fixed/30 border border-tertiary/20 rounded-2xl p-6 flex gap-4">
                        <div className="mt-1 text-tertiary">
                            <span className="material-symbols-outlined">info</span>
                        </div>
                        <div>
                            <h4 className="font-bold text-tertiary text-sm mb-1">Operational Constraint Noted</h4>
                            <p className="text-xs text-on-tertiary-fixed-variant leading-relaxed">System calibration requires a continuous run to avoid thermal degradation on Graphene-Mesh LT. Do not initiate emergency stop unless critical safety limits are breached. Expected thermal peak at 11:45 AM.</p>
                        </div>
                    </div>
                </div>

                {/* Right Column: Analytics & Execution */}
                <div className="flex flex-col gap-8">
                    {/* Analytics Card */}
                    <div className="bg-surface-container-lowest border border-outline-variant/10 rounded-2xl p-8 shadow-[0_20px_40px_rgba(0,28,56,0.06)]">
                        <h3 className="font-manrope font-bold text-on-surface mb-8 pb-4 border-b border-outline-variant/10">Production Analytics</h3>
                        <div className="flex flex-col items-center justify-center mb-8 relative">
                            {/* Circular progress visualization concept */}
                            <div className="w-40 h-40 rounded-full border-[12px] border-surface-container flex items-center justify-center relative">
                                <div className="absolute inset-0 rounded-full border-[12px] border-primary border-t-transparent border-r-transparent rotate-45"></div>
                                <div className="text-center">
                                    <span className="block text-3xl font-black text-primary font-manrope leading-none">62%</span>
                                    <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mt-1">Complete</span>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-5">
                            <div>
                                <div className="flex justify-between text-xs font-bold mb-2">
                                    <span className="text-on-surface-variant uppercase tracking-widest">Resource Usage</span>
                                    <span className="text-primary">88%</span>
                                </div>
                                <div className="w-full bg-surface-container h-2 rounded-full overflow-hidden">
                                    <div className="bg-primary h-full w-[88%] rounded-full"></div>
                                </div>
                            </div>
                            <div>
                                <div className="flex justify-between text-xs font-bold mb-2">
                                    <span className="text-on-surface-variant uppercase tracking-widest">Power Draw</span>
                                    <span className="text-tertiary">14.2 kW</span>
                                </div>
                                <div className="w-full bg-surface-container h-2 rounded-full overflow-hidden">
                                    <div className="bg-tertiary h-full w-[75%] rounded-full"></div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Action Card */}
                    <div className="mt-auto bg-primary-container p-8 rounded-3xl text-on-primary shadow-xl shadow-primary/20 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
                        <div className="relative z-10">
                            <h3 className="font-manrope text-xl font-extrabold mb-2 text-white">Finalize Batch</h3>
                            <p className="text-sm text-primary-fixed mb-6 font-medium">Commit production metrics and forward to Quality Control vault.</p>
                            <button
                                onClick={handleCompleteRun}
                                className="w-full bg-white text-primary font-bold py-4 rounded-xl shadow-lg hover:bg-primary-fixed transition-colors flex items-center justify-center gap-2 active:scale-95"
                            >
                                <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                                Complete Production Run
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
