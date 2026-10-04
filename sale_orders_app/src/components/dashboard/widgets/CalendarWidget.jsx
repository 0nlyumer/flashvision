import React from 'react';
import { useApp } from '../../../context/AppContext';

export default function CalendarWidget() {
  const { state } = useApp();
  // A simple static calendar UI representation
  const days = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
  const dates = Array.from({ length: 30 }, (_, i) => i + 1);
  const currentDay = new Date().getDate();

  return (
    <div className="w-full h-full flex flex-col">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-sm font-bold text-on-surface flex items-center gap-2">
          <span className="material-symbols-outlined text-primary text-[18px]">calendar_month</span>
          May 2026
        </h3>
      </div>
      <div className="grid grid-cols-7 gap-1 flex-1">
        {days.map(d => (
          <div key={d} className="text-center text-[10px] font-bold text-on-surface-variant">
            {d}
          </div>
        ))}
        {/* Empty slots for start of month padding */}
        <div className="text-center p-1"></div>
        <div className="text-center p-1"></div>
        <div className="text-center p-1"></div>
        
        {dates.map(date => (
          <div key={date} className="flex items-center justify-center">
            <span className={`w-6 h-6 flex items-center justify-center rounded-full text-[11px] font-medium 
              ${date === currentDay ? 'bg-primary text-on-primary font-bold shadow-md' : `text-on-surface ${state.dashboardBackground ? 'hover:bg-surface-container/30' : 'hover:bg-surface-container-high'} cursor-pointer`}`}>
              {date}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
