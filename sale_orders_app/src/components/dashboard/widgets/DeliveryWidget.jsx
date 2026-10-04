import React from 'react';
import { useApp } from '../../../context/AppContext';

export default function DeliveryWidget() {
  const { state } = useApp();
  
  const totalDispatches = state.deliveries?.length ?? 0;
  const pendingChallans = state.deliveries?.filter(d => d.status === 'Prepared' || d.status === 'Pending').length ?? 0;
  const completedOrders = state.saleOrders?.filter(o => o.status === 'Completed').length ?? 0;

  return (
    <div className="w-full h-full flex flex-col justify-between">
      <h3 className="text-sm font-bold text-on-surface mb-2">Delivery KPI</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-2 flex-1">
        <div className={`rounded-xl p-3 flex flex-col justify-center ${state.dashboardBackground ? 'bg-primary/10' : 'bg-primary/5'}`}>
          <p className="text-[10px] text-on-surface-variant uppercase font-bold">Total Dispatches</p>
          <p className="text-xl font-black text-primary">{totalDispatches}</p>
        </div>
        <div className={`rounded-xl p-3 flex flex-col justify-center ${state.dashboardBackground ? 'bg-tertiary/10' : 'bg-tertiary/5'}`}>
          <p className="text-[10px] text-on-surface-variant uppercase font-bold">Pending Challans</p>
          <p className="text-xl font-black text-tertiary">{pendingChallans}</p>
        </div>
        <div className={`rounded-xl p-3 flex flex-col justify-center ${state.dashboardBackground ? 'bg-surface-container/30' : 'bg-surface-container'}`}>
          <p className="text-[10px] text-on-surface-variant uppercase font-bold">Completed</p>
          <p className="text-xl font-black text-on-surface">{completedOrders}</p>
        </div>
      </div>
    </div>
  );
}
