import React from 'react';
import { useApp } from '../../context/AppContext';

export default function WorkingDaysWidget({ onShowHistory }) {
    const { state } = useApp();

    const now = new Date();
    const currentMonthYear = `${now.getFullYear()}-${now.getMonth()}`;
    const currentMonthPlans = (state.productionPlans || []).filter(plan => {
        const planDate = new Date(plan.date || plan.createdAt || new Date());
        return `${planDate.getFullYear()}-${planDate.getMonth()}` === currentMonthYear;
    });

    const uniqueWorkingDays = new Set();
    currentMonthPlans.forEach(plan => {
        const planDate = new Date(plan.date || plan.createdAt || new Date());
        uniqueWorkingDays.add(planDate.toLocaleDateString());
    });
    const workingDaysInMonth = uniqueWorkingDays.size;

    return (
        <div 
            className={`h-full rounded-3xl border flex flex-col justify-between cursor-pointer hover:border-primary/40 transition-colors group relative ${
                state.dashboardBackground 
                  ? 'bg-transparent border-transparent shadow-none p-1' 
                  : 'bg-secondary-container/30 border-outline-variant/10 p-6'
            }`}
            onClick={() => onShowHistory('days')}
        >
            <span className="material-symbols-outlined text-primary" style={{fontVariationSettings: "'wght' 700"}}>calendar_today</span>
            <div className="mt-4">
                <p className="text-xs uppercase tracking-widest font-bold text-primary/60">Working Days</p>
                <p className="text-4xl font-bold font-manrope text-on-surface mt-1">{workingDaysInMonth}</p>
            </div>
            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="material-symbols-outlined text-on-surface-variant/50 text-sm">open_in_new</span>
            </div>
        </div>
    );
}
