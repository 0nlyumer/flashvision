import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../../context/AppContext';

export default function AppIconWidget({ title, icon, path }) {
  const navigate = useNavigate();
  const { state } = useApp();

  return (
    <div 
      onClick={() => navigate(path)}
      className={`w-full h-full flex flex-col items-center justify-center gap-2 rounded-[24px] border hover:border-primary/30 shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-[0_8px_30px_rgba(0,66,119,0.1)] cursor-pointer transition-all duration-300 group ${
        state.dashboardBackground
          ? 'bg-transparent border-transparent'
          : 'bg-gradient-to-br from-surface-container-low to-surface-container border-outline-variant/30 hover:from-primary/10 hover:to-primary/5'
      }`}
    >
      <div className="w-12 h-12 bg-surface-container-high group-hover:bg-primary text-on-surface-variant group-hover:text-on-primary rounded-2xl flex items-center justify-center transition-colors duration-300 shadow-sm group-hover:shadow-md">
        <span className="material-symbols-outlined text-[28px]" style={{ fontVariationSettings: "'FILL' 1" }}>{icon}</span>
      </div>
      <span className="font-label text-xs font-bold text-on-surface-variant group-hover:text-primary transition-colors text-center px-2 line-clamp-2 leading-tight">
        {title}
      </span>
    </div>
  );
}
