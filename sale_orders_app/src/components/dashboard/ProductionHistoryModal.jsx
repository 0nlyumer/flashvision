import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';

export default function ProductionHistoryModal({ isOpen, onClose, type }) {
    const { state } = useApp();
    const [pageOffset, setPageOffset] = useState(0); // 0 means current 6 months, 1 means previous 6 months, etc.

    // Aggregate data month by month
    const monthlyStats = useMemo(() => {
        const stats = {};
        const plans = state.productionPlans || [];

        plans.forEach(plan => {
            const planDate = new Date(plan.date || plan.createdAt || new Date());
            const monthKey = `${planDate.getFullYear()}-${String(planDate.getMonth() + 1).padStart(2, '0')}`;
            const monthLabel = planDate.toLocaleDateString('en-GB', { month: 'long', year: 'numeric' });
            
            if (!stats[monthKey]) {
                stats[monthKey] = {
                    monthKey,
                    monthLabel,
                    sortValue: planDate.getTime(),
                    totalMeters: 0,
                    totalItemsCompleted: 0,
                    uniqueDays: new Set()
                };
            }

            // Meters
            const meters = (plan.items || []).reduce((s, item) => s + parseInt(item.outputQty || item.quantity || 0), 0);
            stats[monthKey].totalMeters += meters;

            // Completed Items
            const completedItems = (plan.items || []).filter(it => it.status === 'Completed' || plan.status === 'Completed').length;
            stats[monthKey].totalItemsCompleted += completedItems;

            // Working Days
            stats[monthKey].uniqueDays.add(planDate.toLocaleDateString());
        });

        // Convert to array and sort descending (latest month first)
        let sortedStats = Object.values(stats).sort((a, b) => b.sortValue - a.sortValue);
        
        // Ensure we at least have the current month even if no plans exist
        const now = new Date();
        const currentMonthKey = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
        if (!stats[currentMonthKey]) {
            sortedStats.unshift({
                monthKey: currentMonthKey,
                monthLabel: now.toLocaleDateString('en-GB', { month: 'long', year: 'numeric' }),
                sortValue: now.getTime(),
                totalMeters: 0,
                totalItemsCompleted: 0,
                uniqueDays: new Set()
            });
            // Re-sort after adding current month
            sortedStats = sortedStats.sort((a, b) => b.sortValue - a.sortValue);
        }

        return sortedStats;
    }, [state.productionPlans]);

    // Pagination for 6 months per page
    const itemsPerPage = 6;
    const startIndex = pageOffset * itemsPerPage;
    const paginatedStats = monthlyStats.slice(startIndex, startIndex + itemsPerPage);
    const hasNextPage = startIndex + itemsPerPage < monthlyStats.length;
    const hasPrevPage = pageOffset > 0;

    if (!isOpen) return null;

    let title = "";
    let icon = "";
    if (type === 'target') {
        title = "Production (Meters) History";
        icon = "trending_up";
    } else if (type === 'items') {
        title = "Total Completed Items History";
        icon = "inventory_2";
    } else if (type === 'days') {
        title = "Working Days History";
        icon = "calendar_today";
    }

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className="bg-surface-container-lowest w-full max-w-2xl rounded-3xl shadow-[0_20px_40px_rgba(0,0,0,0.2)] border border-outline-variant/20 overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200">
                
                <div className="flex items-center justify-between p-6 border-b border-outline-variant/10 bg-surface/50">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                            <span className="material-symbols-outlined">{icon}</span>
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-on-surface font-manrope">{title}</h2>
                            <p className="text-sm text-on-surface-variant font-medium">6-Month Historical View</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 text-on-surface-variant hover:text-error hover:bg-error/10 rounded-full transition-colors">
                        <span className="material-symbols-outlined">close</span>
                    </button>
                </div>

                <div className="p-6 overflow-y-auto">
                    {/* Navigation */}
                    <div className="flex items-center justify-between mb-4 bg-surface-container-low p-2 rounded-xl">
                        <button 
                            disabled={!hasNextPage} // hasNextPage means we can go deeper into history
                            onClick={() => setPageOffset(prev => prev + 1)}
                            className="flex items-center gap-1 px-3 py-1.5 text-sm font-semibold text-primary hover:bg-primary/10 rounded-lg disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
                        >
                            <span className="material-symbols-outlined text-[18px]">chevron_left</span>
                            Older
                        </button>
                        <span className="text-sm font-bold text-on-surface-variant">
                            Showing {startIndex + 1} - {Math.min(startIndex + itemsPerPage, monthlyStats.length)} of {monthlyStats.length} Months
                        </span>
                        <button 
                            disabled={!hasPrevPage} // hasPrevPage means we can go to newer history
                            onClick={() => setPageOffset(prev => prev - 1)}
                            className="flex items-center gap-1 px-3 py-1.5 text-sm font-semibold text-primary hover:bg-primary/10 rounded-lg disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
                        >
                            Newer
                            <span className="material-symbols-outlined text-[18px]">chevron_right</span>
                        </button>
                    </div>

                    {/* Data Table */}
                    <div className="overflow-x-auto rounded-xl border border-outline-variant/20">
                        <table className="w-full text-left border-collapse">
                            <thead className="bg-surface-container-low text-on-surface-variant text-xs uppercase tracking-wider font-bold">
                                <tr>
                                    <th className="px-6 py-4">Month / Year</th>
                                    <th className="px-6 py-4 text-right">
                                        {type === 'target' && 'Meters Produced'}
                                        {type === 'items' && 'Items Completed'}
                                        {type === 'days' && 'Working Days'}
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-outline-variant/10 text-sm">
                                {paginatedStats.length > 0 ? paginatedStats.map((stat, idx) => (
                                    <tr key={idx} className="hover:bg-surface-container-lowest/50 transition-colors group">
                                        <td className="px-6 py-4 font-bold text-on-surface flex items-center gap-2">
                                            <span className="material-symbols-outlined text-[16px] text-on-surface-variant opacity-50 group-hover:opacity-100 transition-opacity">event</span>
                                            {stat.monthLabel}
                                        </td>
                                        <td className="px-6 py-4 text-right font-black font-manrope text-primary text-base">
                                            {type === 'target' && stat.totalMeters.toLocaleString() + ' M'}
                                            {type === 'items' && stat.totalItemsCompleted.toLocaleString()}
                                            {type === 'days' && stat.uniqueDays.size}
                                        </td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan="2" className="px-6 py-8 text-center text-on-surface-variant">
                                            No data available for this period.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}
