import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../../context/AppContext';

export default function ShortcutsWidget() {
  const navigate = useNavigate();
  const { state } = useApp();
  
  const shortcuts = [
    { label: 'Sale Orders', icon: 'shopping_cart', path: '/sale-orders', color: 'bg-indigo-100 text-indigo-600' },
    { label: 'Inventory', icon: 'inventory_2', path: '/inventory', color: 'bg-emerald-100 text-emerald-600' },
    { label: 'Production', icon: 'factory', path: '/production', color: 'bg-amber-100 text-amber-600' },
    { label: 'E-Files', icon: 'shelves', path: '/dashboard?tab=e-files', color: 'bg-sky-100 text-sky-600' },
    { label: 'Delivery', icon: 'local_shipping', path: '/delivery-dashboard', color: 'bg-rose-100 text-rose-600' },
    { label: 'Settings', icon: 'settings', path: '/settings', color: 'bg-slate-100 text-slate-600' },
  ];

  return (
    <div className="w-full h-full flex flex-col">
      <h3 className="text-sm font-bold text-on-surface mb-3 flex items-center gap-2">
        <span className="material-symbols-outlined text-primary text-[18px]">bolt</span>
        Quick Shortcuts
      </h3>
      <div className="grid grid-cols-2 gap-2 flex-1">
        {shortcuts.map((s, i) => (
          <button 
            key={i}
            onClick={() => navigate(s.path)}
            className={`flex flex-col items-center justify-center gap-1 p-2 rounded-xl border border-outline-variant/20 transition-colors ${
              state.dashboardBackground 
                ? 'hover:bg-surface-container/20' 
                : 'hover:bg-surface-container-low'
            }`}
          >
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${s.color}`}>
              <span className="material-symbols-outlined text-[18px]">{s.icon}</span>
            </div>
            <span className="text-[10px] font-bold text-on-surface-variant text-center">{s.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
