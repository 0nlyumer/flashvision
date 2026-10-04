import React from 'react';
import { useApp } from '../../context/AppContext';

export default function ProductionItemsWidget({ onShowHistory }) {
    const { state } = useApp();

    const now = new Date();
    const currentMonthYear = `${now.getFullYear()}-${now.getMonth()}`;
    const currentMonthPlans = (state.productionPlans || []).filter(plan => {
        const planDate = new Date(plan.date || plan.createdAt || new Date());
        return `${planDate.getFullYear()}-${planDate.getMonth()}` === currentMonthYear;
    });

    const totalCompletedItems = currentMonthPlans.reduce((sum, plan) => {
        return sum + (plan.items || []).filter(it => it.status === 'Completed' || plan.status === 'Completed').length;
    }, 0);

    return (
        <div 
            className={`h-full rounded-3xl border flex flex-col justify-between cursor-pointer hover:border-tertiary-fixed-variant/40 transition-colors group relative ${
                state.dashboardBackground 
                  ? 'bg-transparent border-transparent shadow-none p-1' 
                  : 'bg-surface-container border-outline-variant/10 p-6'
            }`}
            onClick={() => onShowHistory('items')}
        >
            <span className="material-symbols-outlined text-on-tertiary-fixed-variant" style={{fontVariationSettings: "'FILL' 1"}}>inventory_2</span>
            <div className="mt-4">
                <p className="text-xs uppercase tracking-widest font-bold text-on-tertiary-fixed-variant/60">Total Items Completed</p>
                <p className="text-4xl font-bold font-manrope text-on-surface mt-1">{totalCompletedItems.toLocaleString()}</p>
            </div>
            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="material-symbols-outlined text-on-surface-variant/50 text-sm">open_in_new</span>
            </div>
        </div>
    );
}
