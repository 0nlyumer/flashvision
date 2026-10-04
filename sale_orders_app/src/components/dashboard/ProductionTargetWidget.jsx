import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';

export default function ProductionTargetWidget({ onShowHistory }) {
    const { state, updateProductionTarget } = useApp();
    const [isEditingTarget, setIsEditingTarget] = useState(false);
    const [tempTarget, setTempTarget] = useState(state.productionTarget || 0);
    const [graphType, setGraphType] = useState('progress'); // progress, donut, bars

    // Current month stats
    const now = new Date();
    const currentMonthYear = `${now.getFullYear()}-${now.getMonth()}`;
    const currentMonthPlans = (state.productionPlans || []).filter(plan => {
        const planDate = new Date(plan.date || plan.createdAt || new Date());
        return `${planDate.getFullYear()}-${planDate.getMonth()}` === currentMonthYear;
    });

    const currentMonthlyProduction = currentMonthPlans.reduce((sum, plan) => {
        const batchTypes = state.batchOutputTypes || [
            { id: 1, name: 'Finished Good', uom: 'Meters', category: 'Finish Good' },
            { id: 2, name: 'Wastage', uom: 'Kgs', category: 'Wastage' },
            { id: 3, name: 'B-Grade', uom: 'Meters', category: 'Finish Good' }
        ];
        return sum + (plan.items || []).reduce((s, item) => {
            const actualOut = (item.outputs || []).reduce((outSum, o) => {
                const typeObj = batchTypes.find(t => String(t.id) === String(o.typeId) || t.name === o.typeName);
                const isWastage = (typeObj && typeObj.category) 
                    ? typeObj.category === 'Wastage' 
                    : o.typeName?.toLowerCase().includes('wastage');
                return isWastage ? outSum : outSum + parseFloat(o.quantity || 0);
            }, 0);
            return s + actualOut;
        }, 0);
    }, 0);

    const target = state.productionTarget || 1; // avoid division by zero
    const actual = currentMonthlyProduction;
    const progressPercent = Math.min((actual / target) * 100, 100).toFixed(1);

    const handleSaveTarget = () => {
        updateProductionTarget(Number(tempTarget));
        setIsEditingTarget(false);
    };

    const cycleGraph = (e) => {
        e.stopPropagation();
        const types = ['progress', 'donut', 'bars'];
        const next = types[(types.indexOf(graphType) + 1) % types.length];
        setGraphType(next);
    };

    return (
        <div 
            className={`h-full rounded-3xl border flex flex-col justify-between cursor-pointer hover:border-primary/40 transition-colors group relative ${
                state.dashboardBackground 
                  ? 'bg-transparent border-transparent shadow-none p-1' 
                  : 'bg-surface-container-lowest border-outline-variant/20 shadow-sm p-5'
            }`}
            onClick={() => onShowHistory('target')}
        >
            <div className="flex justify-between items-start mb-2">
                <div className="flex items-center gap-2 text-primary font-bold text-sm tracking-widest uppercase">
                    <span className="material-symbols-outlined text-[18px]">trending_up</span>
                    Production Target
                </div>
                <button 
                    onClick={cycleGraph}
                    className="p-1.5 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface-variant transition-colors"
                    title="Change Graph Type"
                >
                    <span className="material-symbols-outlined text-[16px]">bar_chart</span>
                </button>
            </div>

            <div className="flex flex-col gap-1 z-10 relative">
                <div className="flex items-end gap-2">
                    <p className="text-4xl font-black text-on-surface tracking-tighter font-manrope">
                        {actual.toLocaleString()}
                    </p>
                    <p className="text-sm font-medium text-on-surface-variant mb-1">/ {state.productionTarget?.toLocaleString()} M</p>
                </div>

                {isEditingTarget ? (
                    <div className="flex items-center gap-2 mt-2" onClick={e => e.stopPropagation()}>
                        <input 
                            type="number" 
                            className="bg-surface-container p-1 rounded border border-primary/30 w-24 text-sm"
                            value={tempTarget}
                            onChange={e => setTempTarget(e.target.value)}
                            autoFocus
                        />
                        <button onClick={handleSaveTarget} className="text-primary hover:bg-primary/10 p-1 rounded text-xs font-bold">Save</button>
                    </div>
                ) : (
                    <div 
                        className="text-xs font-bold text-primary cursor-pointer hover:underline w-fit"
                        onClick={(e) => { e.stopPropagation(); setIsEditingTarget(true); }}
                    >
                        Edit Target
                    </div>
                )}
            </div>

            {/* Graphs Container */}
            <div className="mt-4 flex-1 flex flex-col justify-end">
                {graphType === 'progress' && (
                    <div className="w-full">
                        <div className="flex justify-between text-xs font-bold text-on-surface-variant mb-1">
                            <span>Progress</span>
                            <span>{progressPercent}%</span>
                        </div>
                        <div className="h-3 w-full bg-surface-container-high rounded-full overflow-hidden">
                            <div 
                                className="h-full bg-primary rounded-full transition-all duration-1000"
                                style={{ width: `${progressPercent}%` }}
                            ></div>
                        </div>
                    </div>
                )}

                {graphType === 'donut' && (
                    <div className="flex items-center gap-4">
                        <div className="relative w-16 h-16">
                            <svg viewBox="0 0 36 36" className="w-16 h-16 transform -rotate-90">
                                <path
                                    className="text-surface-container-high"
                                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="4"
                                />
                                <path
                                    className="text-primary transition-all duration-1000"
                                    strokeDasharray={`${progressPercent}, 100`}
                                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="4"
                                />
                            </svg>
                            <div className="absolute inset-0 flex items-center justify-center text-xs font-bold text-on-surface">
                                {progressPercent}%
                            </div>
                        </div>
                        <div className="text-xs font-semibold text-on-surface-variant flex flex-col gap-1">
                            <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-primary"></div> Actual</div>
                            <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-surface-container-high"></div> Remaining</div>
                        </div>
                    </div>
                )}

                {graphType === 'bars' && (
                    <div className="flex items-end gap-3 h-20">
                        <div className="flex-1 flex flex-col justify-end items-center gap-1 h-full">
                            <div className="w-full bg-primary rounded-t-md transition-all duration-1000" style={{ height: `${Math.max(10, progressPercent)}%` }}></div>
                            <span className="text-[10px] font-bold text-on-surface-variant">Act.</span>
                        </div>
                        <div className="flex-1 flex flex-col justify-end items-center gap-1 h-full">
                            <div className="w-full bg-surface-container-high border border-outline-variant/30 rounded-t-md h-full"></div>
                            <span className="text-[10px] font-bold text-on-surface-variant">Tgt.</span>
                        </div>
                    </div>
                )}
            </div>

            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="material-symbols-outlined text-on-surface-variant/50 text-sm">open_in_new</span>
            </div>
        </div>
    );
}
